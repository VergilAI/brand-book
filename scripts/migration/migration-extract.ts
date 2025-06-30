import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Stage 1: Discovery & Extraction
 * 
 * This stage scans the codebase for hardcoded values and:
 * 1. Replaces them with temporary tokens
 * 2. Creates a mapping file for human review
 * 3. Generates a discovery report
 */

interface HardcodedValue {
  id: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border-radius' | 'animation';
  value: string;
  temporaryToken: string;
  usages: ValueUsage[];
  category?: string;
  suggestedNames?: string[];
}

interface ValueUsage {
  file: string;
  line: number;
  column: number;
  context: string;
  originalValue: string;
  replaceableContext: string;
  confidence: 'high' | 'medium' | 'low';
}

interface ExtractionReport {
  timestamp: string;
  totalFiles: number;
  totalFindings: number;
  extractedValues: HardcodedValue[];
  summary: {
    byType: Record<string, number>;
    byFile: Record<string, number>;
    confidence: Record<string, number>;
  };
  nextSteps: string[];
}

class MigrationExtractor {
  private extractedValues: HardcodedValue[] = [];
  private valueCounter = 0;
  private scannedFiles = 0;
  private gitCommitHash: string = '';

  // Enhanced patterns for more comprehensive detection
  private patterns = {
    // Colors
    hexColor: /#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?(?![0-9a-fA-F])/g,
    rgbColor: /rgba?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)/g,
    hslColor: /hsla?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+\s*)?\)/g,
    namedColor: /\b(red|blue|green|yellow|purple|orange|pink|gray|grey|black|white|brown|cyan|magenta)\b/g,
    
    // Spacing and sizing
    pixelValue: /(?<![a-zA-Z0-9-])(\d*\.?\d+)(px|rem|em|vh|vw|pt|pc|in|cm|mm)(?![a-zA-Z0-9-])/g,
    percentValue: /(?<![a-zA-Z0-9-])(\d*\.?\d+)%(?![a-zA-Z0-9-])/g,
    
    // Typography
    fontFamily: /font-family\s*:\s*([^;]+);/g,
    fontSize: /font-size\s*:\s*([^;]+);/g,
    fontWeight: /font-weight\s*:\s*([^;]+);/g,
    lineHeight: /line-height\s*:\s*([^;]+);/g,
    letterSpacing: /letter-spacing\s*:\s*([^;]+);/g,
    
    // Shadows and effects
    boxShadow: /box-shadow\s*:\s*([^;]+);/g,
    textShadow: /text-shadow\s*:\s*([^;]+);/g,
    
    // Borders
    borderRadius: /border-radius\s*:\s*([^;]+);/g,
    borderWidth: /border(?:-(?:top|right|bottom|left))?-width\s*:\s*([^;]+);/g,
    
    // Animations
    animationDuration: /animation-duration\s*:\s*([^;]+);/g,
    transitionDuration: /transition-duration\s*:\s*([^;]+);/g,
    
    // Tailwind arbitrary values
    arbitraryTailwind: /(?:bg|text|border|ring|fill|stroke|from|via|to|shadow|p|m|w|h|gap|space|rounded)-\[([^\]]+)\]/g,
    
    // CSS-in-JS values
    cssInJsObject: /(\w+)\s*:\s*['"`]([^'"`]+)['"`]/g,
  };

  private exceptions = {
    colors: ['transparent', 'currentColor', 'inherit', 'initial', 'unset', '#000', '#fff', '#000000', '#ffffff'],
    spacing: ['0', '0px', '0rem', '0em', '1px', '100%', '50%', 'auto', 'inherit'],
    typography: ['inherit', 'initial', 'unset', 'normal', 'bold', 'italic'],
    common: ['none', 'auto', 'inherit', 'initial', 'unset', 'revert'],
  };

  async extract(): Promise<void> {
    console.log('🔄 Stage 1: Discovery & Extraction');
    console.log('=====================================\n');

    // Create git checkpoint
    await this.createGitCheckpoint('Before migration extraction');

    // Find and scan files
    const files = await this.findRelevantFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);

    // Scan files for hardcoded values
    for (const file of files) {
      await this.scanFile(file);
    }

    // Generate temporary tokens
    await this.generateTemporaryTokens();

    // Apply replacements to files
    await this.applyReplacements();

    // Generate discovery report
    await this.generateReport();

    // Create git commit with changes
    await this.createGitCheckpoint('Applied temporary tokens for migration');

    console.log('\n✅ Stage 1 Complete!');
    console.log('📋 Next steps:');
    console.log('   1. Review the discovery report: reports/migration-discovery.json');
    console.log('   2. Run: npm run migrate:review');
    console.log('   3. Map temporary tokens to semantic names');
  }

  private async createGitCheckpoint(message: string): Promise<void> {
    try {
      const hasChanges = execSync('git diff --cached --quiet', { stdio: 'ignore' }).toString() === '';
      if (!hasChanges) {
        execSync('git add .');
      }
      
      execSync(`git commit -m "${message}" --allow-empty`, { stdio: 'inherit' });
      this.gitCommitHash = execSync('git rev-parse HEAD').toString().trim();
      console.log(`📝 Git checkpoint created: ${this.gitCommitHash.slice(0, 8)}`);
    } catch (error) {
      console.warn('⚠️  Could not create git checkpoint:', error);
    }
  }

  private async findRelevantFiles(): Promise<string[]> {
    const files: string[] = [];
    const validExtensions = ['.ts', '.tsx', '.css', '.scss', '.js', '.jsx', '.vue', '.svelte'];
    const ignoreDirs = ['node_modules', '.next', 'coverage', 'dist', 'build', '.git', 'reports'];
    const ignoreFiles = ['migration-extract.ts', '.min.js', '.min.css'];

    const walkDir = async (currentPath: string): Promise<void> => {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name)) {
            await walkDir(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (validExtensions.includes(ext) && 
              !ignoreFiles.some(f => entry.name.includes(f)) &&
              !entry.name.includes('.test.') &&
              !entry.name.includes('.spec.') &&
              !entry.name.includes('.stories.')) {
            files.push(relativePath);
          }
        }
      }
    };

    await walkDir(process.cwd());
    return files.sort();
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileExt = path.extname(filePath);
    
    this.scannedFiles++;

    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;

      // Skip comments and imports
      if (this.shouldSkipLine(line, fileExt)) return;

      // Scan for different types of hardcoded values
      this.scanColors(filePath, line, lineNumber);
      this.scanSpacing(filePath, line, lineNumber);
      this.scanTypography(filePath, line, lineNumber);
      this.scanShadows(filePath, line, lineNumber);
      this.scanBorders(filePath, line, lineNumber);
      this.scanAnimations(filePath, line, lineNumber);
      this.scanArbitraryTailwind(filePath, line, lineNumber);
    });
  }

  private shouldSkipLine(line: string, fileExt: string): boolean {
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return true;
    }
    
    // Skip imports and requires
    if (trimmed.startsWith('import ') || trimmed.startsWith('require(')) {
      return true;
    }
    
    // Skip URLs and data URIs
    if (line.includes('http://') || line.includes('https://') || line.includes('data:')) {
      return true;
    }

    return false;
  }

  private scanColors(file: string, line: string, lineNumber: number): void {
    const patterns = [
      { pattern: this.patterns.hexColor, type: 'hex' },
      { pattern: this.patterns.rgbColor, type: 'rgb' },
      { pattern: this.patterns.hslColor, type: 'hsl' },
    ];

    patterns.forEach(({ pattern, type }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const value = match[0];
        
        if (!this.exceptions.colors.includes(value.toLowerCase())) {
          this.addExtractedValue('color', value, file, line, lineNumber, match.index, type);
        }
      }
    });
  }

  private scanSpacing(file: string, line: string, lineNumber: number): void {
    let match;
    this.patterns.pixelValue.lastIndex = 0;
    
    while ((match = this.patterns.pixelValue.exec(line)) !== null) {
      const value = match[0];
      
      if (!this.exceptions.spacing.includes(value.toLowerCase()) && 
          !this.isInUrlOrImport(line, match.index)) {
        this.addExtractedValue('spacing', value, file, line, lineNumber, match.index);
      }
    }
  }

  private scanTypography(file: string, line: string, lineNumber: number): void {
    const typographyPatterns = [
      { pattern: this.patterns.fontFamily, prop: 'font-family' },
      { pattern: this.patterns.fontSize, prop: 'font-size' },
      { pattern: this.patterns.fontWeight, prop: 'font-weight' },
      { pattern: this.patterns.lineHeight, prop: 'line-height' },
      { pattern: this.patterns.letterSpacing, prop: 'letter-spacing' },
    ];

    typographyPatterns.forEach(({ pattern, prop }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const value = match[1].trim();
        
        if (!this.exceptions.typography.includes(value.toLowerCase()) &&
            !this.exceptions.common.includes(value.toLowerCase())) {
          this.addExtractedValue('typography', value, file, line, lineNumber, match.index, prop);
        }
      }
    });
  }

  private scanShadows(file: string, line: string, lineNumber: number): void {
    const shadowPatterns = [
      { pattern: this.patterns.boxShadow, type: 'box-shadow' },
      { pattern: this.patterns.textShadow, type: 'text-shadow' },
    ];

    shadowPatterns.forEach(({ pattern, type }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const value = match[1].trim();
        
        if (!this.exceptions.common.includes(value.toLowerCase()) && 
            !value.includes('var(')) {
          this.addExtractedValue('shadow', value, file, line, lineNumber, match.index, type);
        }
      }
    });
  }

  private scanBorders(file: string, line: string, lineNumber: number): void {
    const borderPatterns = [
      { pattern: this.patterns.borderRadius, type: 'border-radius' },
      { pattern: this.patterns.borderWidth, type: 'border-width' },
    ];

    borderPatterns.forEach(({ pattern, type }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const value = match[1].trim();
        
        if (!this.exceptions.common.includes(value.toLowerCase())) {
          this.addExtractedValue('border-radius', value, file, line, lineNumber, match.index, type);
        }
      }
    });
  }

  private scanAnimations(file: string, line: string, lineNumber: number): void {
    const animationPatterns = [
      { pattern: this.patterns.animationDuration, type: 'animation-duration' },
      { pattern: this.patterns.transitionDuration, type: 'transition-duration' },
    ];

    animationPatterns.forEach(({ pattern, type }) => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const value = match[1].trim();
        
        if (!this.exceptions.common.includes(value.toLowerCase())) {
          this.addExtractedValue('animation', value, file, line, lineNumber, match.index, type);
        }
      }
    });
  }

  private scanArbitraryTailwind(file: string, line: string, lineNumber: number): void {
    let match;
    this.patterns.arbitraryTailwind.lastIndex = 0;
    
    while ((match = this.patterns.arbitraryTailwind.exec(line)) !== null) {
      const fullMatch = match[0];
      const value = match[1];
      const type = this.categorizeArbitraryValue(fullMatch, value);
      
      this.addExtractedValue(type, value, file, line, lineNumber, match.index, 'tailwind-arbitrary');
    }
  }

  private categorizeArbitraryValue(fullMatch: string, value: string): 'color' | 'spacing' | 'typography' | 'shadow' | 'border-radius' | 'animation' {
    if (fullMatch.includes('bg-') || fullMatch.includes('text-') || fullMatch.includes('border-') && value.match(/^#|rgb|hsl/)) {
      return 'color';
    }
    if (fullMatch.includes('p-') || fullMatch.includes('m-') || fullMatch.includes('w-') || fullMatch.includes('h-') || fullMatch.includes('gap-')) {
      return 'spacing';
    }
    if (fullMatch.includes('rounded-')) {
      return 'border-radius';
    }
    if (fullMatch.includes('shadow-')) {
      return 'shadow';
    }
    
    return 'spacing'; // Default fallback
  }

  private addExtractedValue(
    type: HardcodedValue['type'], 
    value: string, 
    file: string, 
    line: string, 
    lineNumber: number, 
    column: number,
    category?: string
  ): void {
    // Check if this value already exists
    let existingValue = this.extractedValues.find(v => v.value === value && v.type === type);
    
    if (!existingValue) {
      existingValue = {
        id: `extracted_${type}_${++this.valueCounter}`,
        type,
        value,
        temporaryToken: this.generateTemporaryToken(type, this.valueCounter),
        usages: [],
        category,
        suggestedNames: this.generateSuggestedNames(type, value, category),
      };
      this.extractedValues.push(existingValue);
    }

    // Add usage
    existingValue.usages.push({
      file,
      line: lineNumber,
      column: column + 1,
      context: line.trim(),
      originalValue: value,
      replaceableContext: this.generateReplaceableContext(line, value),
      confidence: this.calculateConfidence(line, value, type),
    });
  }

  private generateTemporaryToken(type: string, counter: number): string {
    const prefix = {
      color: 'unnamed-color',
      spacing: 'unnamed-spacing',
      typography: 'unnamed-typography',
      shadow: 'unnamed-shadow',
      'border-radius': 'unnamed-radius',
      animation: 'unnamed-animation',
    }[type] || 'unnamed-value';

    return `${prefix}-${counter}`;
  }

  private generateSuggestedNames(type: string, value: string, category?: string): string[] {
    const suggestions: string[] = [];
    
    switch (type) {
      case 'color':
        if (value.includes('#')) {
          suggestions.push(`color-${value.slice(1).toLowerCase()}`);
        }
        if (category) {
          suggestions.push(`${category}-color`);
        }
        break;
      case 'spacing':
        if (value.includes('px')) {
          const num = value.replace('px', '');
          suggestions.push(`spacing-${num}`, `size-${num}`);
        }
        break;
      case 'typography':
        if (category === 'font-size') {
          suggestions.push('text-size', 'font-size');
        }
        break;
    }
    
    return suggestions;
  }

  private generateReplaceableContext(line: string, value: string): string {
    // Generate the context that will be replaced with the temporary token
    return line.replace(value, '{{TEMP_TOKEN}}');
  }

  private calculateConfidence(line: string, value: string, type: string): 'high' | 'medium' | 'low' {
    // High confidence: Clear CSS properties or Tailwind classes
    if (line.includes(':') && line.includes(';')) return 'high';
    if (line.includes('className') || line.includes('class=')) return 'high';
    
    // Medium confidence: Inline styles or object properties
    if (line.includes('style=') || line.includes(': ')) return 'medium';
    
    // Low confidence: Other contexts
    return 'low';
  }

  private isInUrlOrImport(line: string, index: number): boolean {
    return line.includes('http://') || 
           line.includes('https://') || 
           line.includes('url(') ||
           line.includes('import ') ||
           line.includes('require(') ||
           line.includes('data:');
  }

  private async generateTemporaryTokens(): Promise<void> {
    console.log(`🏷️  Generated ${this.extractedValues.length} temporary tokens`);
    
    // Group by type for better organization
    const byType = this.extractedValues.reduce((acc, value) => {
      acc[value.type] = (acc[value.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(byType).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} tokens`);
    });
  }

  private async applyReplacements(): Promise<void> {
    console.log('\n🔄 Applying temporary token replacements...');
    
    const fileChanges: Record<string, string> = {};
    
    // Group usages by file
    const usagesByFile: Record<string, Array<{ value: HardcodedValue; usage: ValueUsage }>> = {};
    
    this.extractedValues.forEach(value => {
      value.usages.forEach(usage => {
        if (!usagesByFile[usage.file]) {
          usagesByFile[usage.file] = [];
        }
        usagesByFile[usage.file].push({ value, usage });
      });
    });

    // Apply replacements file by file
    for (const [filePath, usages] of Object.entries(usagesByFile)) {
      let content = await fs.promises.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Sort usages by line number descending to avoid offset issues
      usages.sort((a, b) => b.usage.line - a.usage.line);
      
      usages.forEach(({ value, usage }) => {
        const lineIndex = usage.line - 1;
        if (lineIndex < lines.length) {
          // Replace the value with a CSS variable placeholder
          lines[lineIndex] = lines[lineIndex].replace(
            usage.originalValue, 
            `var(--${value.temporaryToken})`
          );
        }
      });
      
      const newContent = lines.join('\n');
      if (newContent !== content) {
        await fs.promises.writeFile(filePath, newContent);
        fileChanges[filePath] = 'modified';
      }
    }

    console.log(`   ✅ Modified ${Object.keys(fileChanges).length} files`);
  }

  private async generateReport(): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const report: ExtractionReport = {
      timestamp: new Date().toISOString(),
      totalFiles: this.scannedFiles,
      totalFindings: this.extractedValues.length,
      extractedValues: this.extractedValues,
      summary: {
        byType: this.extractedValues.reduce((acc, value) => {
          acc[value.type] = (acc[value.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byFile: this.extractedValues.reduce((acc, value) => {
          value.usages.forEach(usage => {
            acc[usage.file] = (acc[usage.file] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
        confidence: this.extractedValues.reduce((acc, value) => {
          value.usages.forEach(usage => {
            acc[usage.confidence] = (acc[usage.confidence] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
      },
      nextSteps: [
        'Review extracted values in the migration interface',
        'Map temporary tokens to semantic names',
        'Validate migration readiness',
        'Generate transformation rules',
        'Apply final migration',
      ],
    };

    // Save the detailed report
    const reportPath = path.join(reportsDir, 'migration-discovery.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Create a human-readable summary
    const summaryPath = path.join(reportsDir, 'migration-discovery-summary.md');
    const summary = this.generateSummaryMarkdown(report);
    await fs.promises.writeFile(summaryPath, summary);

    console.log(`\n📊 Discovery report saved:`);
    console.log(`   - Detailed: ${reportPath}`);
    console.log(`   - Summary: ${summaryPath}`);
  }

  private generateSummaryMarkdown(report: ExtractionReport): string {
    let md = `# Migration Discovery Report\n\n`;
    md += `Generated: ${report.timestamp}\n\n`;
    md += `## Summary\n\n`;
    md += `- **Files Scanned**: ${report.totalFiles}\n`;
    md += `- **Values Extracted**: ${report.totalFindings}\n`;
    md += `- **Git Commit**: ${this.gitCommitHash}\n\n`;

    md += `### By Type\n\n`;
    Object.entries(report.summary.byType).forEach(([type, count]) => {
      md += `- **${type}**: ${count}\n`;
    });

    md += `\n### By Confidence\n\n`;
    Object.entries(report.summary.confidence).forEach(([confidence, count]) => {
      md += `- **${confidence}**: ${count}\n`;
    });

    md += `\n### Top Files by Findings\n\n`;
    const topFiles = Object.entries(report.summary.byFile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    topFiles.forEach(([file, count]) => {
      md += `- **${file}**: ${count}\n`;
    });

    md += `\n## Next Steps\n\n`;
    report.nextSteps.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });

    return md;
  }
}

// Execute if run directly
if (require.main === module) {
  const extractor = new MigrationExtractor();
  extractor.extract().catch(console.error);
}

export { MigrationExtractor, HardcodedValue, ValueUsage, ExtractionReport };