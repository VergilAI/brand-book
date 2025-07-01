#!/usr/bin/env tsx

/**
 * Color Sync Validator
 * 
 * Validates that colors are properly synchronized across all generated files:
 * - YAML source (design-tokens/active/source/colors.yaml)
 * - Generated TypeScript (generated/tokens.ts)
 * - Generated CSS (generated/tokens.css)
 * - Generated Tailwind theme (generated/tailwind-theme.js)
 * 
 * Handles:
 * - Direct color values (e.g., "#7B00FF")
 * - Semantic references (e.g., brand.purple -> {scales.purple.600})
 * - Nested references with multiple levels of indirection
 * - Missing files and edge cases
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface ColorSyncStatus {
  value: string;
  normalizedValue: string;
  tokenPath: string;
  status: 'synced' | 'outOfSync' | 'notPresent';
  details: {
    inYAML: boolean;
    yamlValue?: string;
    inTS: boolean;
    tsValue?: string;
    tsPath?: string;
    inCSS: boolean;
    cssValue?: string;
    cssVariable?: string;
    inTailwind: boolean;
    tailwindValue?: string;
    tailwindPath?: string;
  };
  mismatches: string[];
}

interface SyncValidationReport {
  timestamp: string;
  summary: {
    totalColors: number;
    syncedColors: number;
    outOfSyncColors: number;
    notPresentColors: number;
    syncPercentage: number;
  };
  colors: Record<string, ColorSyncStatus>;
  issues: {
    outOfSync: ColorSyncStatus[];
    notPresent: ColorSyncStatus[];
  };
}

export class ColorSyncValidator {
  private yamlColors: Map<string, { value: string; path: string }> = new Map();
  private yamlReferences: Map<string, string> = new Map();
  private tsColors: Map<string, { value: string; path: string }> = new Map();
  private cssColors: Map<string, { value: string; variable: string }> = new Map();
  private tailwindColors: Map<string, { value: string; path: string }> = new Map();

  async validate(): Promise<SyncValidationReport> {
    console.log('🔄 Starting color sync validation...\n');

    // Load all color sources
    await this.loadYAMLColors();
    await this.loadTSColors();
    await this.loadCSSColors();
    await this.loadTailwindColors();

    // Validate sync status for each color
    const syncStatuses = this.validateSyncStatus();

    // Generate report
    return this.generateReport(syncStatuses);
  }

  private async loadYAMLColors() {
    console.log('📚 Loading YAML colors...');
    const yamlPath = path.join(process.cwd(), 'design-tokens', 'active', 'source', 'colors.yaml');

    if (!fs.existsSync(yamlPath)) {
      console.warn('⚠️  No colors.yaml found');
      return;
    }

    const content = fs.readFileSync(yamlPath, 'utf-8');
    const data = yaml.load(content) as any;

    this.extractYAMLColors(data.colors, 'colors');
    console.log(`✅ Found ${this.yamlColors.size} direct colors and ${this.yamlReferences.size} references in YAML\n`);
  }

  private extractYAMLColors(obj: any, prefix: string) {
    for (const [key, value] of Object.entries(obj)) {
      const tokenPath = `${prefix}.${key}`;

      if (value && typeof value === 'object') {
        if ('value' in value && typeof value.value === 'string') {
          const colorValue = value.value;

          if (this.isReference(colorValue)) {
            // Store reference for later resolution
            this.yamlReferences.set(tokenPath, colorValue);
          } else if (this.isColorValue(colorValue)) {
            // Direct color value
            const normalized = this.normalizeColor(colorValue);
            this.yamlColors.set(tokenPath, { value: normalized, path: tokenPath });
          }
        } else {
          // Recurse into nested object
          this.extractYAMLColors(value, tokenPath);
        }
      }
    }
  }

  private async loadTSColors() {
    console.log('📚 Loading TypeScript colors...');
    const tsPath = path.join(process.cwd(), 'generated', 'tokens.ts');

    if (!fs.existsSync(tsPath)) {
      console.warn('⚠️  No tokens.ts found');
      return;
    }

    const content = fs.readFileSync(tsPath, 'utf-8');
    
    try {
      // Extract color values using a more robust approach
      this.extractTSColors(content);
    } catch (e) {
      console.warn('⚠️  Could not parse tokens.ts:', e);
    }

    console.log(`✅ Found ${this.tsColors.size} colors in TypeScript\n`);
  }

  private extractTSColors(content: string) {
    // Find all color definitions in the TypeScript file
    const lines = content.split('\n');
    let currentPath: string[] = [];
    let inColorsSection = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track when we enter the colors section
      if (line.trim() === 'colors: {') {
        inColorsSection = true;
        currentPath = ['colors'];
        braceDepth = 1;
        continue;
      }

      if (!inColorsSection) continue;

      // Count braces to track nesting depth
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;

      // Exit colors section when we close all braces
      if (braceDepth <= 0) {
        inColorsSection = false;
        currentPath = [];
        continue;
      }
      
      // Handle property definitions - match both camelCase and regular keys
      // Updated regex to properly match quoted keys including numeric ones
      const propertyMatch = line.trim().match(/^['"]?([a-zA-Z0-9_-]+)['"]?\s*:\s*(.+?)$/);
      if (propertyMatch) {
        const [, key, value] = propertyMatch;
        const trimmedValue = value.trim().replace(/,$/, ''); // Remove trailing comma
        
        if (trimmedValue === '{') {
          // Entering a nested object
          currentPath.push(key);
        } else if (trimmedValue.includes('{') && !trimmedValue.includes('}')) {
          // Object definition on same line
          currentPath.push(key);
        } else if (this.isColorValue(trimmedValue.replace(/['"]/g, ''))) {
          // Found a color value
          const cleanValue = trimmedValue.replace(/['"]/g, '').replace(/,\s*$/, '');
          const normalized = this.normalizeColor(cleanValue);
          // Convert camelCase to kebab-case for consistent path matching
          const normalizedKey = this.normalizeKeyForPath(key);
          const fullPath = [...currentPath, normalizedKey].join('.');
          this.tsColors.set(fullPath, { value: normalized, path: fullPath });
        }
      }

      // Handle closing braces on their own line
      if (line.trim() === '}' || line.trim() === '},') {
        if (currentPath.length > 1) {
          currentPath.pop();
        }
      }
    }
  }

  private normalizeKeyForPath(key: string): string {
    // Convert camelCase to kebab-case
    // e.g., purpleLight -> purple-light, offBlack -> off-black
    return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private async loadCSSColors() {
    console.log('📚 Loading CSS colors...');
    const cssPath = path.join(process.cwd(), 'generated', 'tokens.css');

    if (!fs.existsSync(cssPath)) {
      console.warn('⚠️  No tokens.css found');
      return;
    }

    const content = fs.readFileSync(cssPath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      // Match CSS custom properties
      const match = line.match(/^\s*(--vergil-[^:]+):\s*([^;]+);/);
      if (match) {
        const [, variable, value] = match;
        const trimmedValue = value.trim();
        
        if (this.isColorValue(trimmedValue)) {
          const normalized = this.normalizeColor(trimmedValue);
          // Convert CSS variable name to token path
          const tokenPath = this.cssVariableToTokenPath(variable);
          this.cssColors.set(tokenPath, { value: normalized, variable });
        }
      }
    }

    console.log(`✅ Found ${this.cssColors.size} colors in CSS\n`);
  }

  private cssVariableToTokenPath(cssVar: string): string {
    // Convert --vergil-colors-brand-purple to colors.brand.purple
    return cssVar
      .replace('--vergil-', '')
      .replace(/-/g, '.');
  }

  private async loadTailwindColors() {
    console.log('📚 Loading Tailwind colors...');
    const tailwindPath = path.join(process.cwd(), 'generated', 'tailwind-theme.js');

    if (!fs.existsSync(tailwindPath)) {
      console.warn('⚠️  No tailwind-theme.js found');
      return;
    }

    const content = fs.readFileSync(tailwindPath, 'utf-8');
    
    // Extract colors from the module.exports
    try {
      this.extractTailwindColors(content);
    } catch (e) {
      console.warn('⚠️  Could not parse tailwind-theme.js:', e);
    }

    console.log(`✅ Found ${this.tailwindColors.size} colors in Tailwind\n`);
  }

  private extractTailwindColors(content: string) {
    // Similar parsing logic to TypeScript, but for the Tailwind theme structure
    const lines = content.split('\n');
    let currentPath: string[] = [];
    let inColorsSection = false;

    for (const line of lines) {
      // Track when we enter the colors section
      if (line.includes('colors: {')) {
        inColorsSection = true;
        currentPath = ['colors'];
        continue;
      }

      if (!inColorsSection) continue;

      // Handle property definitions
      const propertyMatch = line.match(/^\s*"?(\w+(?:-\w+)*)"?\s*:\s*"?([^",}]+)"?,?\s*$/);
      if (propertyMatch) {
        const [, key, value] = propertyMatch;
        
        if (value.includes('{')) {
          currentPath.push(key);
        } else if (this.isColorValue(value)) {
          const normalized = this.normalizeColor(value);
          const fullPath = [...currentPath, key].join('.');
          this.tailwindColors.set(fullPath, { value: normalized, path: fullPath });
        }
      }

      // Track object nesting
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      
      if (closeBraces > openBraces) {
        for (let i = 0; i < closeBraces - openBraces; i++) {
          currentPath.pop();
          if (currentPath.length === 0) {
            inColorsSection = false;
          }
        }
      }
    }
  }

  private validateSyncStatus(): Map<string, ColorSyncStatus> {
    console.log('🔍 Validating sync status...\n');
    const statuses = new Map<string, ColorSyncStatus>();

    // First, resolve all YAML references to actual values
    const resolvedColors = new Map<string, { value: string; path: string }>();
    
    // Add direct colors
    for (const [path, data] of this.yamlColors) {
      resolvedColors.set(path, data);
    }

    // Resolve references
    for (const [path, reference] of this.yamlReferences) {
      const resolvedValue = this.resolveReference(reference);
      if (resolvedValue) {
        resolvedColors.set(path, { value: resolvedValue, path });
      }
    }

    // Check each YAML color (including resolved references)
    for (const [tokenPath, { value: yamlValue }] of resolvedColors) {
      const status = this.checkColorSync(tokenPath, yamlValue);
      statuses.set(tokenPath, status);
    }

    return statuses;
  }

  private resolveReference(reference: string): string | undefined {
    // Remove curly braces
    const refPath = reference.slice(1, -1);
    
    // Check direct colors first
    for (const [path, data] of this.yamlColors) {
      if (path === `colors.${refPath}`) {
        return data.value;
      }
    }

    // Check if it's a nested reference
    for (const [path, ref] of this.yamlReferences) {
      if (path === `colors.${refPath}`) {
        return this.resolveReference(ref);
      }
    }

    return undefined;
  }

  private checkColorSync(tokenPath: string, yamlValue: string): ColorSyncStatus {
    const tsData = this.tsColors.get(tokenPath);
    const cssData = this.cssColors.get(tokenPath);
    const tailwindData = this.tailwindColors.get(tokenPath);

    const mismatches: string[] = [];
    let status: 'synced' | 'outOfSync' | 'notPresent' = 'synced';

    // Check TypeScript
    if (tsData && tsData.value !== yamlValue) {
      mismatches.push(`TypeScript: ${tsData.value} (expected ${yamlValue})`);
      status = 'outOfSync';
    } else if (!tsData) {
      mismatches.push('Missing from TypeScript');
      status = 'notPresent';
    }

    // Check CSS
    if (cssData && cssData.value !== yamlValue) {
      mismatches.push(`CSS: ${cssData.value} (expected ${yamlValue})`);
      status = 'outOfSync';
    } else if (!cssData) {
      mismatches.push('Missing from CSS');
      status = status === 'outOfSync' ? 'outOfSync' : 'notPresent';
    }

    // Check Tailwind
    if (tailwindData && tailwindData.value !== yamlValue) {
      mismatches.push(`Tailwind: ${tailwindData.value} (expected ${yamlValue})`);
      status = 'outOfSync';
    } else if (!tailwindData) {
      mismatches.push('Missing from Tailwind');
      status = status === 'outOfSync' ? 'outOfSync' : 'notPresent';
    }

    // If everything matches, it's synced
    if (mismatches.length === 0) {
      status = 'synced';
    }

    return {
      value: yamlValue,
      normalizedValue: yamlValue,
      tokenPath,
      status,
      details: {
        inYAML: true,
        yamlValue,
        inTS: !!tsData,
        tsValue: tsData?.value,
        tsPath: tsData?.path,
        inCSS: !!cssData,
        cssValue: cssData?.value,
        cssVariable: cssData?.variable,
        inTailwind: !!tailwindData,
        tailwindValue: tailwindData?.value,
        tailwindPath: tailwindData?.path
      },
      mismatches
    };
  }

  private generateReport(statuses: Map<string, ColorSyncStatus>): SyncValidationReport {
    const colors = Object.fromEntries(statuses);
    const statusArray = Array.from(statuses.values());

    const syncedColors = statusArray.filter(s => s.status === 'synced').length;
    const outOfSyncColors = statusArray.filter(s => s.status === 'outOfSync').length;
    const notPresentColors = statusArray.filter(s => s.status === 'notPresent').length;
    const totalColors = statusArray.length;

    const outOfSync = statusArray.filter(s => s.status === 'outOfSync');
    const notPresent = statusArray.filter(s => s.status === 'notPresent');

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalColors,
        syncedColors,
        outOfSyncColors,
        notPresentColors,
        syncPercentage: totalColors > 0 ? Math.round((syncedColors / totalColors) * 100) : 0
      },
      colors,
      issues: {
        outOfSync,
        notPresent
      }
    };
  }

  private isReference(value: string): boolean {
    return /^\{[^}]+\}$/.test(value.trim());
  }

  private isColorValue(value: string): boolean {
    // Skip gradients and complex values
    if (value.includes('gradient') || value.includes('transparent')) {
      return false;
    }

    return /^#[0-9a-fA-F]{3,8}$/.test(value) ||
           /^rgba?\([^)]+\)$/.test(value) ||
           /^hsla?\([^)]+\)$/.test(value);
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
}

// Export for use in other scripts
export async function validateColorSync(): Promise<SyncValidationReport> {
  const validator = new ColorSyncValidator();
  return validator.validate();
}

// Main execution if run directly
if (require.main === module) {
  validateColorSync()
    .then(report => {
      console.log('📊 Color Sync Validation Summary:');
      console.log(`   Total colors: ${report.summary.totalColors}`);
      console.log(`   Synced: ${report.summary.syncedColors} ✅`);
      console.log(`   Out of sync: ${report.summary.outOfSyncColors} 🔴`);
      console.log(`   Not present: ${report.summary.notPresentColors} ⚠️`);
      console.log(`   Sync percentage: ${report.summary.syncPercentage}%`);

      if (report.issues.outOfSync.length > 0) {
        console.log('\n🔴 Out of Sync Colors:');
        for (const issue of report.issues.outOfSync) {
          console.log(`   ${issue.tokenPath}:`);
          for (const mismatch of issue.mismatches) {
            console.log(`     - ${mismatch}`);
          }
        }
      }

      if (report.issues.notPresent.length > 0) {
        console.log('\n⚠️  Missing Colors:');
        for (const issue of report.issues.notPresent) {
          console.log(`   ${issue.tokenPath}:`);
          for (const mismatch of issue.mismatches) {
            console.log(`     - ${mismatch}`);
          }
        }
      }

      // Save report
      const reportPath = path.join(process.cwd(), 'reports', 'color-sync-validation.json');
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Report saved to: ${reportPath}`);
    })
    .catch(console.error);
}