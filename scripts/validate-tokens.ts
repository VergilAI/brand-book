import { readFileSync } from 'fs';
import { join } from 'path';
import { colors } from '../packages/design-system/tokens/colors';
// For complete validation, we'd use:
// import { colorsComplete } from '../packages/design-system/tokens/colors-complete';

interface TokenMismatch {
  type: 'missing-in-css' | 'missing-in-ts' | 'value-mismatch' | 'naming-mismatch';
  cssName?: string;
  tsName?: string;
  cssValue?: string;
  tsValue?: string;
  message: string;
}

interface ParsedCssVariable {
  name: string;
  value: string;
  line: number;
}

// Convert kebab-case to camelCase
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert camelCase to kebab-case
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

// Parse CSS file and extract color variables
function parseCssVariables(cssContent: string): Map<string, ParsedCssVariable> {
  const variables = new Map<string, ParsedCssVariable>();
  const lines = cssContent.split('\n');
  
  // Regular expression to match CSS custom properties with hex colors
  const cssVarRegex = /^\s*--([\w-]+):\s*(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})\s*(?:;|\/\*)/;
  
  lines.forEach((line, index) => {
    const match = line.match(cssVarRegex);
    if (match) {
      const [, name, value] = match;
      // Normalize hex values to uppercase 6-digit format
      let normalizedValue = value.toUpperCase();
      if (normalizedValue.length === 4) {
        // Convert 3-digit hex to 6-digit
        normalizedValue = '#' + normalizedValue[1] + normalizedValue[1] + 
                         normalizedValue[2] + normalizedValue[2] + 
                         normalizedValue[3] + normalizedValue[3];
      }
      
      variables.set(name, {
        name,
        value: normalizedValue,
        line: index + 1
      });
    }
  });
  
  return variables;
}

// Flatten TypeScript tokens object
function flattenTokens(obj: any, prefix = ''): Map<string, string> {
  const flattened = new Map<string, string>();
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      // It's a color value
      const fullKey = prefix ? `${prefix}-${camelToKebab(key)}` : camelToKebab(key);
      // Normalize hex values to uppercase
      const normalizedValue = value.toUpperCase();
      flattened.set(fullKey, normalizedValue);
    } else if (typeof value === 'object' && value !== null && !value.includes?.('gradient')) {
      // Recursively flatten nested objects (skip gradients)
      const nestedFlattened = flattenTokens(value, prefix ? `${prefix}-${camelToKebab(key)}` : camelToKebab(key));
      nestedFlattened.forEach((val, k) => flattened.set(k, val));
    }
  }
  
  return flattened;
}

// Validate tokens alignment
export function validateTokens(): { isValid: boolean; errors: TokenMismatch[] } {
  const errors: TokenMismatch[] = [];
  
  // Read CSS file
  const cssPath = join(process.cwd(), 'app', 'globals.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Parse CSS variables
  const cssVariables = parseCssVariables(cssContent);
  
  // Flatten TypeScript tokens
  const tsTokens = flattenTokens(colors);
  
  // Create a set of CSS variable names that should be checked
  // Filter out certain patterns that are expected to be CSS-only
  const cssOnlyPatterns = [
    /^vergil-purple-\d+$/,     // Legacy color variants
    /^vergil-violet-\d+$/,     // Legacy color variants
    /^vergil-indigo-\d+$/,     // Legacy color variants
    /^vergil-cyan-\d+$/,       // Legacy color variants
    /^vergil-blue-\d+$/,       // Legacy color variants
    /^gray-\d+$/,              // Tailwind gray scale
    /^vergil-full-/,           // Full colors (black/white)
    /^vergil-off-/,            // Off colors (black/white)
    /^vergil-footnote-/,       // UI-specific colors
    /^vergil-emphasis-/,       // UI-specific colors
    /^luminous-gold$/,         // Additional colors
    /^vivid-red$/,             // Additional colors
    /^midnight-black$/,        // Additional colors
    /^selection-/,             // Selection states
    /^map-/,                   // Tool-specific
    /^drawing-/,               // Tool-specific
    /^bezier-/,                // Tool-specific
    /^territory-/,             // Tool-specific
    /^vertex-/,                // Tool-specific
    /^snap-/,                  // Tool-specific
    /^orange-brand$/,          // One-off colors
    /^blue-/,                  // One-off blues
    /^cyan-bright$/,           // One-off cyan
    /^pure-/,                  // Pure colors
    /^vergil-primary$/,        // Mappings
    /^vergil-secondary$/,      // Mappings
    /^vergil-accent$/,         // Mappings
    /^vergil-info$/,           // Functional override
  ];
  
  // Check for CSS variables that should exist in TypeScript
  cssVariables.forEach((cssVar, cssName) => {
    // Skip if it matches a CSS-only pattern
    if (cssOnlyPatterns.some(pattern => pattern.test(cssName))) {
      return;
    }
    
    // Skip non-color variables
    if (!cssVar.value.startsWith('#')) {
      return;
    }
    
    // Try to find corresponding TypeScript token
    let found = false;
    let expectedTsName = '';
    
    // Direct match
    if (tsTokens.has(cssName)) {
      found = true;
      expectedTsName = cssName;
      
      // Check if values match
      const tsValue = tsTokens.get(cssName)!;
      if (cssVar.value !== tsValue) {
        errors.push({
          type: 'value-mismatch',
          cssName,
          tsName: cssName,
          cssValue: cssVar.value,
          tsValue,
          message: `Value mismatch for "${cssName}": CSS has ${cssVar.value}, TS has ${tsValue} (line ${cssVar.line})`
        });
      }
    } else {
      // Try various naming convention conversions
      const possibleNames = [
        cssName,
        cssName.replace(/^primary-/, ''),
        cssName.replace(/^accent-/, ''),
        cssName.replace(/^foundation-/, ''),
        cssName.replace(/^semantic-/, ''),
      ];
      
      for (const name of possibleNames) {
        for (const [tsKey, tsValue] of tsTokens) {
          if (tsKey === name || tsKey.endsWith(`-${name}`)) {
            found = true;
            expectedTsName = tsKey;
            
            // Check if values match
            if (cssVar.value !== tsValue) {
              errors.push({
                type: 'value-mismatch',
                cssName,
                tsName: tsKey,
                cssValue: cssVar.value,
                tsValue,
                message: `Value mismatch for "${cssName}": CSS has ${cssVar.value}, TS has ${tsValue} (line ${cssVar.line})`
              });
            }
            break;
          }
        }
        if (found) break;
      }
    }
    
    if (!found) {
      errors.push({
        type: 'missing-in-ts',
        cssName,
        cssValue: cssVar.value,
        message: `CSS variable "--${cssName}" (${cssVar.value}) not found in TypeScript tokens (line ${cssVar.line})`
      });
    }
  });
  
  // Check for TypeScript tokens that should exist in CSS
  tsTokens.forEach((tsValue, tsName) => {
    let found = false;
    
    // Direct match
    if (cssVariables.has(tsName)) {
      found = true;
    } else {
      // Try to find with different naming conventions
      const possibleCssNames = [
        tsName,
        `primary-${tsName}`,
        `accent-${tsName}`,
        `foundation-${tsName}`,
        `semantic-${tsName}`,
      ];
      
      for (const name of possibleCssNames) {
        if (cssVariables.has(name)) {
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      errors.push({
        type: 'missing-in-css',
        tsName,
        tsValue,
        message: `TypeScript token "${tsName}" (${tsValue}) not found in CSS variables`
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// CLI execution
if (typeof require !== 'undefined' && require.main === module) {
  const { isValid, errors } = validateTokens();
  
  if (!isValid) {
    console.error('\n❌ Token validation failed!\n');
    console.error(`Found ${errors.length} mismatch${errors.length > 1 ? 'es' : ''}:\n`);
    
    // Group errors by type
    const errorsByType = errors.reduce((acc, error) => {
      if (!acc[error.type]) acc[error.type] = [];
      acc[error.type].push(error);
      return acc;
    }, {} as Record<string, TokenMismatch[]>);
    
    // Display errors by type
    if (errorsByType['value-mismatch']) {
      console.error('📊 Value Mismatches:');
      errorsByType['value-mismatch'].forEach(error => {
        console.error(`   ${error.message}`);
      });
      console.error('');
    }
    
    if (errorsByType['missing-in-ts']) {
      console.error('🔍 Missing in TypeScript:');
      errorsByType['missing-in-ts'].forEach(error => {
        console.error(`   ${error.message}`);
      });
      console.error('');
    }
    
    if (errorsByType['missing-in-css']) {
      console.error('🎨 Missing in CSS:');
      errorsByType['missing-in-css'].forEach(error => {
        console.error(`   ${error.message}`);
      });
      console.error('');
    }
    
    if (errorsByType['naming-mismatch']) {
      console.error('📝 Naming Convention Issues:');
      errorsByType['naming-mismatch'].forEach(error => {
        console.error(`   ${error.message}`);
      });
      console.error('');
    }
    
    process.exit(1);
  } else {
    console.log('\n✅ All tokens are properly aligned!\n');
    console.log(`Validated ${cssVariables.size} CSS variables against TypeScript tokens.`);
  }
}