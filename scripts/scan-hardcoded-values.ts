import * as fs from 'fs';
import * as path from 'path';

interface Finding {
  type: 'hex-color' | 'rgb-color' | 'hsl-color' | 'pixel-value' | 'arbitrary-tailwind' | 'inline-style' | 'magic-number' | 'font-family' | 'box-shadow';
  value: string;
  file: string;
  line: number;
  column: number;
  context: string;
}

class HardcodedValueScanner {
  private findings: Finding[] = [];
  private scannedFiles = 0;
  private totalFindings = 0;

  // Patterns for detecting hardcoded values
  private patterns = {
    // Hex colors: #RGB, #RRGGBB, #RRGGBBAA
    hexColor: /#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?(?![0-9a-fA-F])/g,
    
    // RGB/RGBA values
    rgbColor: /rgba?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)/g,
    
    // HSL/HSLA values
    hslColor: /hsla?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[\d.]+\s*)?\)/g,
    
    // Pixel values (excluding 0px, 1px for borders)
    pixelValue: /(?<![a-zA-Z0-9-])(?!0px|1px)(\d*\.?\d+)(px|rem|em|vh|vw|pt)(?![a-zA-Z0-9-])/g,
    
    // Arbitrary Tailwind classes
    arbitraryTailwind: /(?:bg|text|border|ring|fill|stroke|from|via|to|shadow)-\[([^\]]+)\]/g,
    
    // Inline styles
    inlineStyle: /style\s*=\s*\{\s*\{([^}]+)\}\s*\}/g,
    
    // Font families not using tokens
    fontFamily: /font-family\s*:\s*["']([^"']+)["']/g,
    
    // Box shadows not using tokens
    boxShadow: /box-shadow\s*:\s*([^;]+);/g,
    
    // CSS magic numbers (in .css, .scss files)
    cssMagicNumber: /:\s*(\d*\.?\d+)(px|rem|em|%|vh|vw)(?![a-zA-Z0-9-])/g,
  };

  // Known exceptions that should be ignored
  private exceptions = {
    colors: [
      '#000000', '#000', // Pure black
      '#ffffff', '#fff', // Pure white
      'transparent',
      'currentColor',
      'inherit',
    ],
    pixels: [
      '0px', '0rem', '0em', // Zero values
      '1px', // Common border width
      '100%', '100vh', '100vw', // Full width/height
      '50%', // Half values
    ],
    fontFamilies: [
      'inherit',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'sans-serif',
      'monospace',
    ],
  };

  async scan(): Promise<void> {
    console.log('🔍 Starting hardcoded value scan...\n');

    // Find all relevant files
    const files = await this.findFiles(process.cwd());

    console.log(`Found ${files.length} files to scan\n`);

    // Scan each file
    for (const file of files) {
      await this.scanFile(file);
    }

    // Generate report
    await this.generateReport();
  }

  private async findFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const validExtensions = ['.ts', '.tsx', '.css', '.scss', '.js', '.jsx'];
    const ignoreDirs = ['node_modules', '.next', 'coverage', 'dist', 'build', '.git'];
    const ignoreFiles = ['scan-hardcoded-values.ts'];

    const walkDir = async (currentPath: string): Promise<void> => {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (entry.isDirectory()) {
          // Skip ignored directories
          if (ignoreDirs.includes(entry.name)) continue;
          await walkDir(fullPath);
        } else if (entry.isFile()) {
          // Check file extension
          const ext = path.extname(entry.name);
          if (!validExtensions.includes(ext)) continue;

          // Skip ignored files
          if (ignoreFiles.some(f => entry.name.includes(f))) continue;

          // Skip test and story files
          if (entry.name.includes('.test.') || 
              entry.name.includes('.spec.') || 
              entry.name.includes('.stories.') ||
              entry.name.includes('.min.')) continue;

          files.push(relativePath);
        }
      }
    };

    await walkDir(dir);
    return files.sort();
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileExt = path.extname(filePath);
    
    this.scannedFiles++;

    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;

      // Skip comments
      if (this.isComment(line, fileExt)) return;

      // Check for hex colors
      this.checkPattern(filePath, line, lineNumber, this.patterns.hexColor, 'hex-color', (match) => {
        return !this.exceptions.colors.includes(match.toLowerCase());
      });

      // Check for RGB colors
      this.checkPattern(filePath, line, lineNumber, this.patterns.rgbColor, 'rgb-color');

      // Check for HSL colors
      this.checkPattern(filePath, line, lineNumber, this.patterns.hslColor, 'hsl-color');

      // Check for pixel values
      this.checkPattern(filePath, line, lineNumber, this.patterns.pixelValue, 'pixel-value', (match) => {
        return !this.exceptions.pixels.includes(match.toLowerCase());
      });

      // Check for arbitrary Tailwind classes
      this.checkPattern(filePath, line, lineNumber, this.patterns.arbitraryTailwind, 'arbitrary-tailwind');

      // Check for inline styles
      if (line.includes('style=')) {
        this.checkInlineStyles(filePath, line, lineNumber);
      }

      // Check CSS-specific patterns in CSS/SCSS files
      if (['.css', '.scss'].includes(fileExt)) {
        this.checkCSSSpecificPatterns(filePath, line, lineNumber);
      }
    });
  }

  private isComment(line: string, fileExt: string): boolean {
    const trimmed = line.trim();
    
    // JS/TS comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return true;
    }
    
    // CSS comments
    if (['.css', '.scss'].includes(fileExt) && trimmed.includes('/*')) {
      return true;
    }

    return false;
  }

  private checkPattern(
    file: string,
    line: string,
    lineNumber: number,
    pattern: RegExp,
    type: Finding['type'],
    filter?: (match: string) => boolean
  ): void {
    let match;
    pattern.lastIndex = 0; // Reset regex state

    while ((match = pattern.exec(line)) !== null) {
      const value = match[0];
      
      // Apply filter if provided
      if (filter && !filter(value)) {
        continue;
      }

      // Skip if it's in a string that looks like a URL or import
      if (this.isInUrlOrImport(line, match.index)) {
        continue;
      }

      this.findings.push({
        type,
        value,
        file,
        line: lineNumber,
        column: match.index + 1,
        context: line.trim(),
      });
      this.totalFindings++;
    }
  }

  private isInUrlOrImport(line: string, index: number): boolean {
    // Check if it's part of a URL
    if (line.includes('http://') || line.includes('https://') || line.includes('url(')) {
      return true;
    }

    // Check if it's part of an import statement
    if (line.includes('import ') || line.includes('require(')) {
      return true;
    }

    // Check if it's in a data attribute or similar
    if (line.includes('data:') || line.includes('base64')) {
      return true;
    }

    return false;
  }

  private checkInlineStyles(file: string, line: string, lineNumber: number): void {
    const inlineStyleMatch = line.match(/style\s*=\s*\{\s*\{([^}]+)\}\s*\}/);
    
    if (inlineStyleMatch) {
      const styleContent = inlineStyleMatch[1];
      
      // Check for hardcoded colors in inline styles
      const colorProps = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];
      colorProps.forEach(prop => {
        const propPattern = new RegExp(`${prop}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`);
        const propMatch = styleContent.match(propPattern);
        
        if (propMatch && !this.exceptions.colors.includes(propMatch[1])) {
          this.findings.push({
            type: 'inline-style',
            value: `${prop}: ${propMatch[1]}`,
            file,
            line: lineNumber,
            column: line.indexOf(propMatch[0]) + 1,
            context: line.trim(),
          });
          this.totalFindings++;
        }
      });

      // Check for hardcoded dimensions
      const dimensionProps = ['width', 'height', 'fontSize', 'padding', 'margin'];
      dimensionProps.forEach(prop => {
        const propPattern = new RegExp(`${prop}\\s*:\\s*['"\`]?(\d+(?:px|rem|em))['"\`]?`);
        const propMatch = styleContent.match(propPattern);
        
        if (propMatch && !this.exceptions.pixels.includes(propMatch[1])) {
          this.findings.push({
            type: 'inline-style',
            value: `${prop}: ${propMatch[1]}`,
            file,
            line: lineNumber,
            column: line.indexOf(propMatch[0]) + 1,
            context: line.trim(),
          });
          this.totalFindings++;
        }
      });
    }
  }

  private checkCSSSpecificPatterns(file: string, line: string, lineNumber: number): void {
    // Check for font-family
    const fontFamilyMatch = line.match(this.patterns.fontFamily);
    if (fontFamilyMatch) {
      const fontFamily = fontFamilyMatch[1];
      if (!this.exceptions.fontFamilies.some(f => fontFamily.includes(f))) {
        this.findings.push({
          type: 'font-family',
          value: fontFamily,
          file,
          line: lineNumber,
          column: line.indexOf(fontFamilyMatch[0]) + 1,
          context: line.trim(),
        });
        this.totalFindings++;
      }
    }

    // Check for box-shadow
    const boxShadowMatch = line.match(this.patterns.boxShadow);
    if (boxShadowMatch) {
      const shadow = boxShadowMatch[1].trim();
      // Check if it contains hardcoded values (not using CSS variables)
      if (!shadow.includes('var(') && shadow !== 'none' && shadow !== 'inherit') {
        this.findings.push({
          type: 'box-shadow',
          value: shadow,
          file,
          line: lineNumber,
          column: line.indexOf(boxShadowMatch[0]) + 1,
          context: line.trim(),
        });
        this.totalFindings++;
      }
    }
  }

  private async generateReport(): Promise<void> {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Group findings by type
    const findingsByType = this.groupFindingsByType();
    
    // Generate markdown report
    let report = `# Hardcoded Values Scan Report\n\n`;
    report += `Generated on: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Files scanned**: ${this.scannedFiles}\n`;
    report += `- **Total findings**: ${this.totalFindings}\n\n`;

    // Summary by type
    report += `### Findings by Type\n\n`;
    report += `| Type | Count |\n`;
    report += `|------|-------|\n`;
    
    Object.entries(findingsByType).forEach(([type, findings]) => {
      report += `| ${this.formatType(type)} | ${findings.length} |\n`;
    });

    report += `\n## Detailed Findings\n\n`;

    // Detailed findings by type
    Object.entries(findingsByType).forEach(([type, findings]) => {
      if (findings.length === 0) return;

      report += `### ${this.formatType(type)} (${findings.length})\n\n`;
      
      // Group by file
      const byFile = this.groupByFile(findings);
      
      Object.entries(byFile).forEach(([file, fileFindings]) => {
        report += `#### \`${file}\`\n\n`;
        
        fileFindings.forEach(finding => {
          report += `- Line ${finding.line}: \`${finding.value}\`\n`;
          report += `  \`\`\`\n  ${finding.context}\n  \`\`\`\n`;
        });
        
        report += '\n';
      });
    });

    // Write report
    const reportPath = path.join(reportsDir, 'hardcoded-values.md');
    await fs.promises.writeFile(reportPath, report);

    // Console output
    console.log('\n✅ Scan complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Files scanned: ${this.scannedFiles}`);
    console.log(`   - Total findings: ${this.totalFindings}\n`);
    
    Object.entries(findingsByType).forEach(([type, findings]) => {
      if (findings.length > 0) {
        console.log(`   - ${this.formatType(type)}: ${findings.length}`);
      }
    });
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
  }

  private groupFindingsByType(): Record<string, Finding[]> {
    const grouped: Record<string, Finding[]> = {
      'hex-color': [],
      'rgb-color': [],
      'hsl-color': [],
      'pixel-value': [],
      'arbitrary-tailwind': [],
      'inline-style': [],
      'magic-number': [],
      'font-family': [],
      'box-shadow': [],
    };

    this.findings.forEach(finding => {
      grouped[finding.type].push(finding);
    });

    return grouped;
  }

  private groupByFile(findings: Finding[]): Record<string, Finding[]> {
    const grouped: Record<string, Finding[]> = {};

    findings.forEach(finding => {
      if (!grouped[finding.file]) {
        grouped[finding.file] = [];
      }
      grouped[finding.file].push(finding);
    });

    // Sort findings within each file by line number
    Object.values(grouped).forEach(fileFindings => {
      fileFindings.sort((a, b) => a.line - b.line);
    });

    return grouped;
  }

  private formatType(type: string): string {
    const typeNames: Record<string, string> = {
      'hex-color': 'Hex Colors',
      'rgb-color': 'RGB/RGBA Colors',
      'hsl-color': 'HSL/HSLA Colors',
      'pixel-value': 'Pixel Values',
      'arbitrary-tailwind': 'Arbitrary Tailwind Classes',
      'inline-style': 'Inline Styles',
      'magic-number': 'Magic Numbers',
      'font-family': 'Font Families',
      'box-shadow': 'Box Shadows',
    };

    return typeNames[type] || type;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const failOnErrors = args.includes('--fail-on-errors');
const outputJson = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

// Run the scanner
const scanner = new HardcodedValueScanner();
scanner.scan().then(async () => {
  // Export findings as JSON if requested
  if (outputJson) {
    const findings = scanner['findings']; // Access private property
    const jsonReport = {
      date: new Date().toISOString(),
      scannedFiles: scanner['scannedFiles'],
      totalFindings: scanner['totalFindings'],
      findings: findings,
      summary: {
        byType: Object.entries(scanner['groupFindingsByType']()).reduce((acc, [type, items]) => {
          acc[type] = items.length;
          return acc;
        }, {} as Record<string, number>)
      }
    };
    
    await fs.promises.writeFile(outputJson, JSON.stringify(jsonReport, null, 2));
    console.log(`\n📄 JSON report saved to: ${outputJson}`);
  }
  
  // Exit with error code if findings exist and fail-on-errors is set
  if (failOnErrors && scanner['totalFindings'] > 0) {
    console.error(`\n❌ Found ${scanner['totalFindings']} hardcoded values. Failing build.`);
    process.exit(1);
  }
}).catch(console.error);