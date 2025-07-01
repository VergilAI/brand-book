#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import glob from 'glob';

interface ColorInstance {
  file: string;
  line: number;
  context: string;
  type: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'css-var' | 'token-import';
}

interface ColorData {
  value: string;
  normalizedValue: string;
  instances: {
    hardcoded: ColorInstance[];
    inGeneratedTS: ColorInstance[];
    inGeneratedCSS: ColorInstance[];
    inYAML: { path: string; tokenName: string }[];
  };
  totalInstances: number;
  isFullyMigrated: boolean;
  healthScore: number;
}

interface ColorReport {
  timestamp: string;
  summary: {
    totalUniqueColors: number;
    fullyMigratedColors: number;
    partiallyMigratedColors: number;
    unmappedColors: number;
    overallHealthScore: number;
  };
  colors: Record<string, ColorData>;
  fileStats: {
    totalFilesScanned: number;
    filesWithHardcodedColors: number;
  };
}

class ComprehensiveColorAnalyzer {
  private colors: Map<string, ColorData> = new Map();
  private yamlTokens: Map<string, string> = new Map();
  private generatedTokens: Set<string> = new Set();
  private totalFilesScanned: number = 0;

  async analyze(): Promise<ColorReport> {
    console.log('🎨 Starting comprehensive color analysis...\n');

    // Step 1: Load YAML tokens first
    await this.loadYAMLTokens();
    
    // Step 2: Scan generated files to understand what's available
    await this.scanGeneratedFiles();
    
    // Step 3: Scan entire codebase for color usage
    await this.scanCodebase();
    
    // Step 4: Calculate health scores
    this.calculateHealthScores();
    
    // Step 5: Generate report
    return this.generateReport();
  }

  private async loadYAMLTokens() {
    console.log('📚 Loading YAML token definitions...');
    const yamlPath = path.join(process.cwd(), 'design-tokens', 'active', 'source', 'colors.yaml');
    
    if (!fs.existsSync(yamlPath)) {
      console.warn('⚠️  No colors.yaml found in active tokens');
      return;
    }

    const content = fs.readFileSync(yamlPath, 'utf-8');
    const data = yaml.load(content) as any;
    
    this.extractYAMLColors(data.colors, '');
    console.log(`✅ Found ${this.yamlTokens.size} color tokens in YAML\n`);
  }

  private extractYAMLColors(obj: any, prefix: string) {
    for (const [key, value] of Object.entries(obj)) {
      const tokenPath = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if ('value' in value && typeof value.value === 'string') {
          // This is a color token
          const normalizedColor = this.normalizeColor(value.value);
          this.yamlTokens.set(tokenPath, normalizedColor);
          
          // Initialize color data
          if (!this.colors.has(normalizedColor)) {
            this.colors.set(normalizedColor, {
              value: value.value,
              normalizedValue: normalizedColor,
              instances: {
                hardcoded: [],
                inGeneratedTS: [],
                inGeneratedCSS: [],
                inYAML: []
              },
              totalInstances: 0,
              isFullyMigrated: false,
              healthScore: 0
            });
          }
          
          const colorData = this.colors.get(normalizedColor)!;
          colorData.instances.inYAML.push({
            path: `colors.${tokenPath}`,
            tokenName: tokenPath.replace(/\./g, '-')
          });
        } else {
          // Recurse into nested object
          this.extractYAMLColors(value, tokenPath);
        }
      }
    }
  }

  private async scanGeneratedFiles() {
    console.log('🔍 Scanning generated token files...');
    
    // Scan generated TypeScript tokens
    const tsTokenPath = path.join(process.cwd(), 'generated', 'tokens.ts');
    if (fs.existsSync(tsTokenPath)) {
      const content = fs.readFileSync(tsTokenPath, 'utf-8');
      const lines = content.split('\n');
      
      // Look for color values in the tokens object
      lines.forEach((line, index) => {
        // Match color values in various formats
        const colorPatterns = [
          /#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?/g,
          /rgba?\s*\([^)]+\)/g,
          /hsla?\s*\([^)]+\)/g
        ];
        
        for (const pattern of colorPatterns) {
          const matches = line.matchAll(pattern);
          for (const match of matches) {
            const value = match[0];
            const normalized = this.normalizeColor(value);
            this.generatedTokens.add(normalized);
            
            if (!this.colors.has(normalized)) {
              this.colors.set(normalized, this.createEmptyColorData(value, normalized));
            }
            
            // Only add if not already tracked
            const colorData = this.colors.get(normalized)!;
            if (!colorData.instances.inGeneratedTS.some(i => i.line === index + 1)) {
              colorData.instances.inGeneratedTS.push({
                file: 'generated/tokens.ts',
                line: index + 1,
                context: line.trim(),
                type: 'token-import'
              });
            }
          }
        }
      });
    }
    
    // Scan generated CSS tokens
    const cssTokenPath = path.join(process.cwd(), 'generated', 'tokens.css');
    if (fs.existsSync(cssTokenPath)) {
      const content = fs.readFileSync(cssTokenPath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Look for CSS custom properties with color values
        const cssVarMatch = line.match(/--vergil-[^:]+:\s*([^;]+);/);
        if (cssVarMatch) {
          const value = cssVarMatch[1].trim();
          if (this.isColorValue(value)) {
            const normalized = this.normalizeColor(value);
            
            if (!this.colors.has(normalized)) {
              this.colors.set(normalized, this.createEmptyColorData(value, normalized));
            }
            
            const colorData = this.colors.get(normalized)!;
            if (!colorData.instances.inGeneratedCSS.some(i => i.line === index + 1)) {
              colorData.instances.inGeneratedCSS.push({
                file: 'generated/tokens.css',
                line: index + 1,
                context: line.trim(),
                type: 'css-var'
              });
            }
          }
        }
      });
    }
    
    console.log(`✅ Found ${this.generatedTokens.size} colors in generated files\n`);
  }

  private async scanCodebase() {
    console.log('🔍 Scanning codebase for color usage...');
    
    const files = glob.sync('**/*.{ts,tsx,css,scss,js,jsx}', {
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '.git/**',
        'generated/**',
        'design-tokens/**/*.yaml'
      ]
    });

    this.totalFilesScanned = files.length;
    let filesWithColors = 0;
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      let foundColorInFile = false;
      
      // Check for hardcoded colors
      const patterns = [
        // Hex colors
        { regex: /#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?(?![0-9a-fA-F])/g, type: 'hex' as const },
        // RGB/RGBA
        { regex: /rgba?\s*\([^)]+\)/g, type: 'rgb' as const },
        // HSL/HSLA
        { regex: /hsla?\s*\([^)]+\)/g, type: 'hsl' as const }
      ];
      
      for (const { regex, type } of patterns) {
        const matches = content.matchAll(regex);
        
        for (const match of matches) {
          const value = match[0];
          
          // Skip if it's in a comment or import statement
          const lineIndex = content.substring(0, match.index).split('\n').length - 1;
          const line = lines[lineIndex];
          if (line.includes('//') || line.includes('import') || line.includes('*')) {
            continue;
          }
          
          const normalized = this.normalizeColor(value);
          
          if (!this.colors.has(normalized)) {
            this.colors.set(normalized, this.createEmptyColorData(value, normalized));
          }
          
          this.colors.get(normalized)!.instances.hardcoded.push({
            file,
            line: lineIndex + 1,
            context: line.trim(),
            type
          });
          
          foundColorInFile = true;
        }
      }
      
      if (foundColorInFile) {
        filesWithColors++;
      }
    }
    
    console.log(`✅ Scanned ${files.length} files, found colors in ${filesWithColors} files\n`);
  }

  private createEmptyColorData(value: string, normalized: string): ColorData {
    return {
      value,
      normalizedValue: normalized,
      instances: {
        hardcoded: [],
        inGeneratedTS: [],
        inGeneratedCSS: [],
        inYAML: []
      },
      totalInstances: 0,
      isFullyMigrated: false,
      healthScore: 0
    };
  }

  private normalizeColor(color: string): string {
    color = color.trim().toLowerCase();
    
    // Normalize hex colors
    if (color.startsWith('#')) {
      // Convert 3-char hex to 6-char
      if (color.length === 4) {
        const r = color[1];
        const g = color[2];
        const b = color[3];
        color = `#${r}${r}${g}${g}${b}${b}`;
      }
      return color.toUpperCase();
    }
    
    // Normalize rgb/rgba
    if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return this.rgbToHex(r, g, b);
      }
    }
    
    return color;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  }

  private isColorValue(value: string): boolean {
    return /^#[0-9a-fA-F]{3,8}$/.test(value) ||
           /^rgba?\([^)]+\)$/.test(value) ||
           /^hsla?\([^)]+\)$/.test(value);
  }

  private calculateHealthScores() {
    for (const [_, colorData] of this.colors) {
      const hasHardcoded = colorData.instances.hardcoded.length > 0;
      const inYAML = colorData.instances.inYAML.length > 0;
      const inGeneratedTS = colorData.instances.inGeneratedTS.length > 0;
      const inGeneratedCSS = colorData.instances.inGeneratedCSS.length > 0;
      
      // Calculate total instances
      colorData.totalInstances = 
        colorData.instances.hardcoded.length +
        colorData.instances.inGeneratedTS.length +
        colorData.instances.inGeneratedCSS.length;
      
      // A color is fully migrated if:
      // 1. It's defined in YAML
      // 2. It's available in both generated TS and CSS
      // 3. It has NO hardcoded instances
      colorData.isFullyMigrated = inYAML && inGeneratedTS && inGeneratedCSS && !hasHardcoded;
      
      // Health score calculation
      let score = 0;
      if (inYAML) score += 40;  // 40% for being in YAML
      if (inGeneratedTS) score += 20;  // 20% for being in generated TS
      if (inGeneratedCSS) score += 20;  // 20% for being in generated CSS
      if (!hasHardcoded) score += 20;  // 20% for no hardcoded instances
      
      colorData.healthScore = score;
    }
  }

  private generateReport(): ColorReport {
    const colors = Object.fromEntries(this.colors);
    
    // Calculate summary stats
    const totalColors = this.colors.size;
    const fullyMigrated = Array.from(this.colors.values()).filter(c => c.isFullyMigrated).length;
    const partiallyMigrated = Array.from(this.colors.values()).filter(c => 
      c.healthScore > 0 && c.healthScore < 100
    ).length;
    const unmapped = Array.from(this.colors.values()).filter(c => c.healthScore === 0).length;
    
    // Overall health is percentage of fully migrated colors
    const overallHealth = totalColors > 0 ? Math.round((fullyMigrated / totalColors) * 100) : 0;
    
    const filesWithHardcoded = new Set(
      Array.from(this.colors.values())
        .flatMap(c => c.instances.hardcoded)
        .map(i => i.file)
    ).size;
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalUniqueColors: totalColors,
        fullyMigratedColors: fullyMigrated,
        partiallyMigratedColors: partiallyMigrated,
        unmappedColors: unmapped,
        overallHealthScore: overallHealth
      },
      colors,
      fileStats: {
        totalFilesScanned: this.totalFilesScanned,
        filesWithHardcodedColors: filesWithHardcoded
      }
    };
  }
}

// Main execution
async function main() {
  const analyzer = new ComprehensiveColorAnalyzer();
  const report = await analyzer.analyze();
  
  // Save report
  const reportPath = path.join(process.cwd(), 'reports', 'color-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📊 Color Analysis Summary:');
  console.log(`   Total unique colors: ${report.summary.totalUniqueColors}`);
  console.log(`   Fully migrated: ${report.summary.fullyMigratedColors} ✅`);
  console.log(`   Partially migrated: ${report.summary.partiallyMigratedColors} 🟡`);
  console.log(`   Unmapped: ${report.summary.unmappedColors} ❌`);
  console.log(`   Overall health: ${report.summary.overallHealthScore}%`);
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

main().catch(console.error);