#!/usr/bin/env tsx

/**
 * Token Usage Validation Script
 * Scans codebase for hardcoded values and token compliance
 * This serves as a bridge until ESLint plugin is fully integrated
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  file: string;
  violations: Violation[];
}

interface Violation {
  type: 'hardcoded-color' | 'hardcoded-spacing' | 'arbitrary-tailwind' | 'deprecated-token';
  line: number;
  column: number;
  value: string;
  suggestion?: string;
  severity: 'error' | 'warning';
}

const COLOR_PATTERNS = {
  hex: /#[0-9a-fA-F]{3,8}\b/g,
  rgb: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/g,
  hsl: /hsla?\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/g,
  named: /\b(?:black|white|red|green|blue|yellow|purple|orange|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold)\b/gi,
};

const SPACING_PATTERNS = {
  px: /\b\d+(?:\.\d+)?px\b/g,
  rem: /\b\d+(?:\.\d+)?rem\b/g,
  em: /\b\d+(?:\.\d+)?em\b/g,
};

const ARBITRARY_PATTERNS = {
  color: /(?:bg|text|border|ring|shadow|from|to|via)-\[([^\]]*(?:#[0-9a-fA-F]+|rgb|hsl|color)[^\]]*)\]/g,
  spacing: /(?:p|m|gap|w|h|top|right|bottom|left|inset|space)-\[([^\]]*(?:\d+(?:px|rem|em|%))[^\]]*)\]/g,
};

const DEPRECATED_TOKENS = [
  'cosmic-purple',
  'electric-violet',
  'luminous-indigo',
  'phosphor-cyan',
  'synaptic-blue',
  'neural-pink',
];

const ALLOWED_VALUES = {
  colors: ['transparent', 'inherit', 'currentColor', 'initial', 'unset'],
  spacing: ['0', '0px', '0rem', '0em', 'auto', 'inherit', 'initial', 'unset', '100%', '50%', '25%', '75%'],
};

function getAllFiles(dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!item.startsWith('.') && !['node_modules', '.next', 'out', 'build'].includes(item)) {
          files.push(...getAllFiles(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

function validateFile(filePath: string): ValidationResult {
  const violations: Violation[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      
      // Check for hardcoded colors
      Object.entries(COLOR_PATTERNS).forEach(([type, pattern]) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const value = match[0];
          const column = match.index;
          
          if (!ALLOWED_VALUES.colors.includes(value) && !value.includes('var(')) {
            violations.push({
              type: 'hardcoded-color',
              line: lineNumber,
              column,
              value,
              suggestion: getColorSuggestion(value),
              severity: 'error',
            });
          }
        }
      });
      
      // Check for hardcoded spacing
      Object.entries(SPACING_PATTERNS).forEach(([type, pattern]) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const value = match[0];
          const column = match.index;
          
          if (!ALLOWED_VALUES.spacing.includes(value)) {
            violations.push({
              type: 'hardcoded-spacing',
              line: lineNumber,
              column,
              value,
              suggestion: getSpacingSuggestion(value),
              severity: 'error',
            });
          }
        }
      });
      
      // Check for arbitrary Tailwind classes
      Object.entries(ARBITRARY_PATTERNS).forEach(([type, pattern]) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const fullMatch = match[0];
          const value = match[1];
          const column = match.index;
          
          if (!value.includes('url(') && !value.includes('calc(') && !value.includes('var(')) {
            violations.push({
              type: 'arbitrary-tailwind',
              line: lineNumber,
              column,
              value: fullMatch,
              suggestion: getTailwindSuggestion(type, value),
              severity: 'error',
            });
          }
        }
      });
      
      // Check for deprecated tokens
      DEPRECATED_TOKENS.forEach(token => {
        if (line.includes(token)) {
          const column = line.indexOf(token);
          violations.push({
            type: 'deprecated-token',
            line: lineNumber,
            column,
            value: token,
            suggestion: getDeprecatedTokenSuggestion(token),
            severity: 'warning',
          });
        }
      });
    });
    
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
  }
  
  return { file: filePath, violations };
}

function getColorSuggestion(color: string): string | undefined {
  const suggestions = {
    '#7B00FF': 'tokens.colors.brand.purple',
    '#9933FF': 'tokens.colors.brand.purpleLight',
    '#1D1D1F': 'tokens.colors.neutral.offBlack',
    '#F5F5F7': 'tokens.colors.neutral.offWhite',
    '#000000': 'tokens.colors.neutral.black',
    '#FFFFFF': 'tokens.colors.neutral.white',
    'purple': 'tokens.colors.brand.purple',
    'black': 'tokens.colors.neutral.offBlack',
    'white': 'tokens.colors.neutral.offWhite',
  };
  
  return suggestions[color.toLowerCase()] || suggestions[color.toUpperCase()];
}

function getSpacingSuggestion(spacing: string): string | undefined {
  const suggestions = {
    '4px': 'tokens.spacing.scale[1]',
    '8px': 'tokens.spacing.scale[2]',
    '12px': 'tokens.spacing.scale[3]',
    '16px': 'tokens.spacing.scale[4]',
    '24px': 'tokens.spacing.scale[6]',
    '32px': 'tokens.spacing.scale[8]',
    '1rem': 'tokens.spacing.scale[4]',
    '1.5rem': 'tokens.spacing.scale[6]',
    '2rem': 'tokens.spacing.scale[8]',
  };
  
  return suggestions[spacing];
}

function getTailwindSuggestion(type: string, value: string): string | undefined {
  if (type === 'color') {
    if (value === '#7B00FF') return 'bg-vergil-purple';
    if (value === '#1D1D1F') return 'bg-vergil-off-black';
    if (value === '#F5F5F7') return 'bg-vergil-off-white';
  }
  
  if (type === 'spacing') {
    if (value === '16px') return 'p-4';
    if (value === '24px') return 'p-6';
    if (value === '8px') return 'p-2';
  }
  
  return undefined;
}

function getDeprecatedTokenSuggestion(token: string): string | undefined {
  const suggestions = {
    'cosmic-purple': 'vergil-purple',
    'electric-violet': 'vergil-purple-light',
    'luminous-indigo': 'vergil-purple-lighter',
    'phosphor-cyan': 'vergil-success',
    'synaptic-blue': 'vergil-info',
    'neural-pink': 'vergil-purple-lightest',
  };
  
  return suggestions[token];
}

function generateReport(results: ValidationResult[]): void {
  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const errorCount = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.severity === 'error').length, 0);
  const warningCount = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.severity === 'warning').length, 0);
  
  console.log('\n🎨 Token Usage Validation Report');
  console.log('================================');
  console.log(`Total files scanned: ${results.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Warnings: ${warningCount}`);
  
  if (totalViolations === 0) {
    console.log('\n✅ No token violations found! Token-first architecture is maintained.');
    return;
  }
  
  console.log('\n📋 Violations by Type:');
  const violationsByType = results.reduce((acc, result) => {
    result.violations.forEach(violation => {
      if (!acc[violation.type]) acc[violation.type] = 0;
      acc[violation.type]++;
    });
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(violationsByType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log('\n🔍 Detailed Violations:');
  results.forEach(result => {
    if (result.violations.length > 0) {
      console.log(`\n📄 ${result.file}:`);
      result.violations.forEach(violation => {
        const severity = violation.severity === 'error' ? '❌' : '⚠️';
        console.log(`  ${severity} Line ${violation.line}: ${violation.type}`);
        console.log(`     Value: "${violation.value}"`);
        if (violation.suggestion) {
          console.log(`     Suggestion: ${violation.suggestion}`);
        }
      });
    }
  });
  
  console.log('\n🔧 How to fix:');
  console.log('1. Run auto-fix where possible');
  console.log('2. Replace hardcoded values with design tokens');
  console.log('3. Import tokens: import { tokens } from "@/tokens"');
  console.log('4. Use Tailwind classes instead of arbitrary values');
  console.log('5. Migrate deprecated v1 colors to v2 system');
  
  // Generate detailed report file
  const reportData = {
    summary: {
      totalFiles: results.length,
      totalViolations,
      errorCount,
      warningCount,
      violationsByType,
    },
    results: results.filter(r => r.violations.length > 0),
    timestamp: new Date().toISOString(),
  };
  
  writeFileSync('reports/token-validation-report.json', JSON.stringify(reportData, null, 2));
  console.log('\n📊 Detailed report saved to: reports/token-validation-report.json');
}

function main() {
  console.log('🔍 Starting token usage validation...');
  
  const rootDir = process.cwd();
  const files = getAllFiles(rootDir);
  
  console.log(`📂 Scanning ${files.length} files...`);
  
  const results: ValidationResult[] = [];
  
  files.forEach(file => {
    const result = validateFile(file);
    results.push(result);
  });
  
  generateReport(results);
  
  const hasErrors = results.some(r => r.violations.some(v => v.severity === 'error'));
  
  if (hasErrors) {
    console.log('\n❌ Token validation failed. Please fix violations before proceeding.');
    process.exit(1);
  } else {
    console.log('\n✅ Token validation passed!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}