/**
 * Token Validator - Comprehensive validation system for design tokens
 */

import {
  TokenDefinition,
  TokenRegistry,
  ValidationRule,
  ValidationResult,
  ValidationReport,
  ValidationIssue,
  TokenValueType,
  AccessibilityInfo
} from './types.js';

export class TokenValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Validate entire token registry
   */
  async validateRegistry(registry: TokenRegistry): Promise<ValidationReport> {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    const suggestions: ValidationIssue[] = [];

    let totalTokens = 0;

    // Validate each category
    for (const [categoryName, group] of Object.entries(registry.categories)) {
      for (const token of group.tokens) {
        totalTokens++;
        
        // Run all applicable rules
        for (const rule of this.rules) {
          if (rule.category === 'all' || rule.category === token.category) {
            const result = rule.check(token, registry);
            
            if (!result.passed) {
              const issue: ValidationIssue = {
                tokenPath: token.path,
                rule: rule.name,
                severity: rule.severity,
                message: result.message,
                suggestion: result.suggestion
              };

              switch (rule.severity) {
                case 'error':
                  errors.push(issue);
                  break;
                case 'warning':
                  warnings.push(issue);
                  break;
                case 'info':
                  suggestions.push(issue);
                  break;
              }
            }
          }
        }
      }
    }

    return {
      timestamp: new Date().toISOString(),
      totalTokens,
      errors,
      warnings,
      suggestions,
      summary: {
        errorCount: errors.length,
        warningCount: warnings.length,
        suggestionCount: suggestions.length,
        coverage: (totalTokens / (totalTokens + errors.length)) * 100
      }
    };
  }

  /**
   * Validate single token
   */
  validateToken(token: TokenDefinition, registry: TokenRegistry): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const rule of this.rules) {
      if (rule.category === 'all' || rule.category === token.category) {
        results.push(rule.check(token, registry));
      }
    }

    return results;
  }

  /**
   * Add custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove validation rule
   */
  removeRule(name: string): void {
    this.rules = this.rules.filter(rule => rule.name !== name);
  }

  /**
   * Initialize built-in validation rules
   */
  private initializeRules(): void {
    // Color validation rules
    this.rules.push({
      name: 'valid-color-format',
      description: 'Color tokens must use valid color formats',
      category: 'colors',
      severity: 'error',
      check: (token: TokenDefinition) => {
        if (token.type === 'color') {
          const validFormats = [
            /^#[0-9A-Fa-f]{3}$/,
            /^#[0-9A-Fa-f]{6}$/,
            /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
            /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,
            /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
            /^oklch\([^)]+\)$/,
            /^var\(--[^)]+\)$/
          ];

          const isValid = validFormats.some(format => format.test(token.value));
          
          return {
            passed: isValid,
            message: isValid ? 'Valid color format' : `Invalid color format: ${token.value}`,
            suggestion: isValid ? undefined : 'Use hex (#RRGGBB), rgb(), hsl(), or CSS variable format'
          };
        }
        return { passed: true, message: 'Not a color token' };
      }
    });

    this.rules.push({
      name: 'color-contrast-accessibility',
      description: 'Color combinations should meet WCAG contrast requirements',
      category: 'colors',
      severity: 'warning',
      check: (token: TokenDefinition) => {
        if (token.type === 'color' && token.accessibility?.contrastRatio) {
          const ratio = token.accessibility.contrastRatio;
          const hasGoodContrast = ratio >= 4.5; // WCAG AA standard
          
          return {
            passed: hasGoodContrast,
            message: hasGoodContrast 
              ? `Good contrast ratio: ${ratio.toFixed(2)}:1`
              : `Poor contrast ratio: ${ratio.toFixed(2)}:1 (minimum 4.5:1)`,
            suggestion: hasGoodContrast 
              ? undefined 
              : 'Consider adjusting color lightness to improve contrast'
          };
        }
        return { passed: true, message: 'No contrast data available' };
      }
    });

    // Naming convention rules
    this.rules.push({
      name: 'kebab-case-naming',
      description: 'Token names should use kebab-case convention',
      category: 'all',
      severity: 'warning',
      check: (token: TokenDefinition) => {
        const isKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(token.name);
        
        return {
          passed: isKebabCase,
          message: isKebabCase 
            ? 'Follows kebab-case convention'
            : `Name should be kebab-case: ${token.name}`,
          suggestion: isKebabCase 
            ? undefined 
            : 'Use lowercase letters and hyphens only (e.g., "primary-color")'
        };
      }
    });

    this.rules.push({
      name: 'semantic-token-references',
      description: 'Semantic tokens should reference existing tokens',
      category: 'semantic',
      severity: 'error',
      check: (token: TokenDefinition, registry: TokenRegistry) => {
        if (token.semantic && token.references) {
          const allTokens = this.getAllTokenPaths(registry);
          const invalidRefs = token.references.filter(ref => !allTokens.has(ref));
          
          return {
            passed: invalidRefs.length === 0,
            message: invalidRefs.length === 0
              ? 'All references are valid'
              : `Invalid references: ${invalidRefs.join(', ')}`,
            suggestion: invalidRefs.length === 0
              ? undefined
              : 'Ensure referenced tokens exist in the registry'
          };
        }
        return { passed: true, message: 'Not a semantic token' };
      }
    });

    // Value consistency rules
    this.rules.push({
      name: 'no-duplicate-values',
      description: 'Tokens should not have identical values unless intentional',
      category: 'all',
      severity: 'info',
      check: (token: TokenDefinition, registry: TokenRegistry) => {
        const duplicates = this.findDuplicateValues(token, registry);
        const hasDuplicates = duplicates.length > 0;
        
        return {
          passed: !hasDuplicates,
          message: hasDuplicates
            ? `Duplicate value found in: ${duplicates.join(', ')}`
            : 'No duplicate values found',
          suggestion: hasDuplicates
            ? 'Consider using semantic tokens or ensure duplicates are intentional'
            : undefined
        };
      }
    });

    // Spacing rules
    this.rules.push({
      name: 'valid-spacing-unit',
      description: 'Spacing tokens should use consistent units',
      category: 'spacing',
      severity: 'warning',
      check: (token: TokenDefinition) => {
        if (token.type === 'spacing') {
          const validUnits = ['px', 'rem', 'em', '%'];
          const hasValidUnit = validUnits.some(unit => 
            token.value.endsWith(unit) || /^\d+$/.test(token.value)
          );
          
          return {
            passed: hasValidUnit,
            message: hasValidUnit
              ? 'Uses valid spacing unit'
              : `Invalid spacing unit in: ${token.value}`,
            suggestion: hasValidUnit
              ? undefined
              : 'Use px, rem, em, % or unitless numbers for spacing'
          };
        }
        return { passed: true, message: 'Not a spacing token' };
      }
    });

    // Typography rules
    this.rules.push({
      name: 'font-size-scale',
      description: 'Font sizes should follow a consistent scale',
      category: 'typography',
      severity: 'info',
      check: (token: TokenDefinition, registry: TokenRegistry) => {
        if (token.type === 'fontSize') {
          const fontSizes = this.getFontSizes(registry);
          const isPartOfScale = this.checkTypographicScale(token.value, fontSizes);
          
          return {
            passed: isPartOfScale,
            message: isPartOfScale
              ? 'Follows typographic scale'
              : 'May not follow consistent typographic scale',
            suggestion: isPartOfScale
              ? undefined
              : 'Consider using values that follow a consistent ratio (e.g., 1.2x, 1.414x)'
          };
        }
        return { passed: true, message: 'Not a font size token' };
      }
    });

    // Deprecation rules
    this.rules.push({
      name: 'deprecated-token-usage',
      description: 'Deprecated tokens should not be referenced by other tokens',
      category: 'all',
      severity: 'warning',
      check: (token: TokenDefinition, registry: TokenRegistry) => {
        if (token.deprecated && token.usedBy && token.usedBy.length > 0) {
          return {
            passed: false,
            message: `Deprecated token is still used by: ${token.usedBy.join(', ')}`,
            suggestion: 'Update references before removing deprecated token'
          };
        }
        return { passed: true, message: 'Token not deprecated or not in use' };
      }
    });

    // Comment rules
    this.rules.push({
      name: 'complex-token-documentation',
      description: 'Complex tokens should have explanatory comments',
      category: 'all',
      severity: 'info',
      check: (token: TokenDefinition) => {
        const isComplex = token.semantic || 
                         token.value.includes('calc(') ||
                         token.value.includes('linear-gradient') ||
                         token.value.includes('cubic-bezier');
        
        const hasComment = Boolean(token.comment);
        
        if (isComplex && !hasComment) {
          return {
            passed: false,
            message: 'Complex token should have explanatory comment',
            suggestion: 'Add comment explaining the token\'s purpose and usage'
          };
        }
        
        return { passed: true, message: 'Token is simple or well-documented' };
      }
    });
  }

  /**
   * Get all token paths in registry
   */
  private getAllTokenPaths(registry: TokenRegistry): Set<string> {
    const paths = new Set<string>();
    
    for (const category of Object.values(registry.categories)) {
      for (const token of category.tokens) {
        paths.add(token.path);
        paths.add(token.name);
        if (token.aliases) {
          token.aliases.forEach(alias => paths.add(alias));
        }
      }
    }
    
    return paths;
  }

  /**
   * Find tokens with duplicate values
   */
  private findDuplicateValues(targetToken: TokenDefinition, registry: TokenRegistry): string[] {
    const duplicates: string[] = [];
    
    for (const category of Object.values(registry.categories)) {
      for (const token of category.tokens) {
        if (token.path !== targetToken.path && 
            token.value === targetToken.value &&
            !token.semantic && !targetToken.semantic) {
          duplicates.push(token.path);
        }
      }
    }
    
    return duplicates;
  }

  /**
   * Get all font sizes from registry
   */
  private getFontSizes(registry: TokenRegistry): number[] {
    const sizes: number[] = [];
    
    for (const category of Object.values(registry.categories)) {
      for (const token of category.tokens) {
        if (token.type === 'fontSize') {
          const match = token.value.match(/^(\d*\.?\d+)(px|rem|em)?$/);
          if (match) {
            const value = parseFloat(match[1]);
            if (match[2] === 'rem') {
              sizes.push(value * 16); // Convert rem to px for comparison
            } else if (match[2] === 'em') {
              sizes.push(value * 16); // Assume 16px base
            } else {
              sizes.push(value);
            }
          }
        }
      }
    }
    
    return sizes.sort((a, b) => a - b);
  }

  /**
   * Check if font size follows a consistent typographic scale
   */
  private checkTypographicScale(value: string, allSizes: number[]): boolean {
    const match = value.match(/^(\d*\.?\d+)(px|rem|em)?$/);
    if (!match) return false;
    
    let pixelValue = parseFloat(match[1]);
    if (match[2] === 'rem' || match[2] === 'em') {
      pixelValue *= 16;
    }
    
    // Check if this size fits into a geometric progression
    const commonRatios = [1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618];
    
    for (const ratio of commonRatios) {
      // Check if pixelValue can be generated by ratio^n * baseSize
      for (const baseSize of [12, 14, 16, 18]) {
        let current = baseSize;
        let steps = 0;
        
        while (current <= pixelValue * 1.1 && steps < 10) {
          if (Math.abs(current - pixelValue) < 1) {
            return true;
          }
          current *= ratio;
          steps++;
        }
        
        current = baseSize;
        steps = 0;
        while (current >= pixelValue * 0.9 && steps < 10) {
          if (Math.abs(current - pixelValue) < 1) {
            return true;
          }
          current /= ratio;
          steps++;
        }
      }
    }
    
    return false;
  }
}