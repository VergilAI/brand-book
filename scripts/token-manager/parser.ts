/**
 * Token Parser - Extract and parse tokens from various sources
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import {
  TokenDefinition,
  TokenRegistry,
  TokenCategory,
  TokenValueType,
  TokenGroup,
  AccessibilityInfo
} from './types.js';

export class TokenParser {
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
  }

  /**
   * Parse all tokens from CSS, YAML, and TypeScript sources
   */
  async parseAll(): Promise<TokenRegistry> {
    const registry: TokenRegistry = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      categories: {} as Record<TokenCategory, TokenGroup>,
      metadata: {
        totalTokens: 0,
        deprecated: 0,
        semantic: 0
      }
    };

    // Parse from different sources
    const cssTokens = this.parseCSSTokens();
    const yamlTokens = this.parseYAMLTokens();
    const tailwindTokens = this.parseTailwindConfig();

    // Merge and organize tokens
    const allTokens = this.mergeTokenSources(cssTokens, yamlTokens, tailwindTokens);
    
    // Organize by categories
    registry.categories = this.organizeByCategories(allTokens);
    
    // Calculate metadata
    registry.metadata = this.calculateMetadata(registry.categories);

    // Resolve references and dependencies
    this.resolveReferences(registry);

    return registry;
  }

  /**
   * Parse CSS custom properties from globals.css
   */
  private parseCSSTokens(): TokenDefinition[] {
    const cssPath = join(this.basePath, 'app', 'globals.css');
    if (!existsSync(cssPath)) {
      console.warn('CSS file not found:', cssPath);
      return [];
    }

    const content = readFileSync(cssPath, 'utf-8');
    const tokens: TokenDefinition[] = [];
    const lines = content.split('\n');

    let currentComment = '';
    let inRootBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Track if we're in :root block
      if (line === ':root {') {
        inRootBlock = true;
        continue;
      }
      if (line === '}' && inRootBlock) {
        inRootBlock = false;
        continue;
      }

      // Capture comments
      if (line.startsWith('/*') && line.endsWith('*/')) {
        currentComment = line.slice(2, -2).trim();
        continue;
      }

      // Parse CSS custom properties
      if (inRootBlock && line.startsWith('--')) {
        const match = line.match(/^--([\w-]+):\s*([^;]+);?/);
        if (match) {
          const [, name, value] = match;
          const cleanValue = value.trim();

          const token: TokenDefinition = {
            name,
            path: name,
            category: this.inferCategory(name, cleanValue),
            type: this.inferType(name, cleanValue),
            value: cleanValue,
            cssVar: `--${name}`,
            comment: currentComment || undefined,
            deprecated: this.isDeprecated(name, currentComment),
            semantic: this.isSemantic(cleanValue),
            accessibility: this.calculateAccessibility(cleanValue, name)
          };

          tokens.push(token);
          currentComment = '';
        }
      }
    }

    return tokens;
  }

  /**
   * Parse YAML token files if they exist
   */
  private parseYAMLTokens(): TokenDefinition[] {
    const yamlDir = join(this.basePath, 'design-tokens', 'active', 'source');
    if (!existsSync(yamlDir)) {
      return [];
    }

    const tokens: TokenDefinition[] = [];
    // Implementation would read YAML files and parse them
    // This is a placeholder for the YAML parsing logic
    return tokens;
  }

  /**
   * Parse Tailwind config for additional tokens
   */
  private parseTailwindConfig(): TokenDefinition[] {
    const configPath = join(this.basePath, 'tailwind.config.js');
    if (!existsSync(configPath)) {
      return [];
    }

    // This would parse the Tailwind config and extract theme tokens
    // For now, return empty array
    return [];
  }

  /**
   * Merge tokens from different sources, handling conflicts
   */
  private mergeTokenSources(...sources: TokenDefinition[][]): TokenDefinition[] {
    const merged = new Map<string, TokenDefinition>();

    for (const source of sources) {
      for (const token of source) {
        const existing = merged.get(token.path);
        if (existing) {
          // Merge token data, preferring more complete definitions
          merged.set(token.path, this.mergeTokenDefinitions(existing, token));
        } else {
          merged.set(token.path, token);
        }
      }
    }

    return Array.from(merged.values());
  }

  /**
   * Merge two token definitions, preferring the more complete one
   */
  private mergeTokenDefinitions(existing: TokenDefinition, incoming: TokenDefinition): TokenDefinition {
    return {
      ...existing,
      ...incoming,
      comment: incoming.comment || existing.comment,
      aliases: [...(existing.aliases || []), ...(incoming.aliases || [])],
      examples: [...(existing.examples || []), ...(incoming.examples || [])],
      accessibility: incoming.accessibility || existing.accessibility
    };
  }

  /**
   * Organize tokens by categories
   */
  private organizeByCategories(tokens: TokenDefinition[]): Record<TokenCategory, TokenGroup> {
    const categories: Record<TokenCategory, TokenGroup> = {} as any;

    // Initialize categories
    const categoryNames: TokenCategory[] = ['colors', 'spacing', 'typography', 'shadows', 'borders', 'animations', 'layout', 'semantic'];
    
    for (const categoryName of categoryNames) {
      categories[categoryName] = {
        name: categoryName,
        description: this.getCategoryDescription(categoryName),
        tokens: [],
        subgroups: []
      };
    }

    // Distribute tokens
    for (const token of tokens) {
      categories[token.category].tokens.push(token);
    }

    // Sort tokens within each category
    for (const category of Object.values(categories)) {
      category.tokens.sort((a, b) => a.name.localeCompare(b.name));
    }

    return categories;
  }

  /**
   * Calculate registry metadata
   */
  private calculateMetadata(categories: Record<TokenCategory, TokenGroup>) {
    let totalTokens = 0;
    let deprecated = 0;
    let semantic = 0;

    for (const category of Object.values(categories)) {
      totalTokens += category.tokens.length;
      deprecated += category.tokens.filter(t => t.deprecated).length;
      semantic += category.tokens.filter(t => t.semantic).length;
    }

    return { totalTokens, deprecated, semantic };
  }

  /**
   * Resolve token references and build dependency graph
   */
  private resolveReferences(registry: TokenRegistry): void {
    const allTokens = new Map<string, TokenDefinition>();
    
    // Build lookup map
    for (const category of Object.values(registry.categories)) {
      for (const token of category.tokens) {
        allTokens.set(token.path, token);
      }
    }

    // Find references
    for (const token of allTokens.values()) {
      if (token.semantic && token.value.includes('var(--')) {
        const references = this.extractReferences(token.value);
        token.references = references;

        // Update usedBy for referenced tokens
        for (const ref of references) {
          const referencedToken = allTokens.get(ref);
          if (referencedToken) {
            referencedToken.usedBy = referencedToken.usedBy || [];
            referencedToken.usedBy.push(token.path);
          }
        }
      }
    }
  }

  /**
   * Extract CSS variable references from a value
   */
  private extractReferences(value: string): string[] {
    const references: string[] = [];
    const regex = /var\(--([^)]+)\)/g;
    let match;

    while ((match = regex.exec(value)) !== null) {
      references.push(match[1]);
    }

    return references;
  }

  /**
   * Infer token category from name and value
   */
  private inferCategory(name: string, value: string): TokenCategory {
    // Color patterns
    if (this.isColorValue(value) || name.includes('color') || name.includes('purple') || 
        name.includes('blue') || name.includes('gray') || name.includes('black') || 
        name.includes('white') || name.includes('cyan') || name.includes('pink')) {
      return 'colors';
    }

    // Spacing patterns
    if (value.match(/^\d+(\.\d+)?(px|rem|em|%)$/) || name.includes('spacing') || 
        name.includes('gap') || name.includes('margin') || name.includes('padding')) {
      return 'spacing';
    }

    // Typography patterns
    if (name.includes('font') || name.includes('text') || name.includes('line-height')) {
      return 'typography';
    }

    // Shadow patterns
    if (value.includes('shadow') || name.includes('shadow')) {
      return 'shadows';
    }

    // Border patterns
    if (name.includes('radius') || name.includes('border')) {
      return 'borders';
    }

    // Animation patterns
    if (name.includes('ease') || name.includes('duration') || name.includes('timing')) {
      return 'animations';
    }

    // Layout patterns
    if (name.includes('width') || name.includes('height') || name.includes('size')) {
      return 'layout';
    }

    // Default to semantic
    return 'semantic';
  }

  /**
   * Infer token type from name and value
   */
  private inferType(name: string, value: string): TokenValueType {
    if (this.isColorValue(value)) return 'color';
    if (value.match(/^\d+(\.\d+)?(px|rem|em)$/)) return 'spacing';
    if (value.match(/^\d+(\.\d+)?(px|rem|em)$/) && name.includes('font')) return 'fontSize';
    if (value.match(/^\d+$/) && name.includes('weight')) return 'fontWeight';
    if (value.match(/^\d+(\.\d+)?$/) && name.includes('line')) return 'lineHeight';
    if (value.includes('shadow')) return 'shadow';
    if (value.match(/^\d+(\.\d+)?(px|rem)$/) && name.includes('radius')) return 'borderRadius';
    if (value.includes('cubic-bezier') || value.includes('ease')) return 'timing';
    if (value.includes('animation') || value.includes('transition')) return 'animation';
    
    return 'custom';
  }

  /**
   * Check if a value is a color
   */
  private isColorValue(value: string): boolean {
    return /^#[0-9A-Fa-f]{3,6}$/.test(value) ||
           /^rgb\(/.test(value) ||
           /^rgba\(/.test(value) ||
           /^hsl\(/.test(value) ||
           /^oklch\(/.test(value) ||
           value === 'transparent' ||
           value === 'currentColor';
  }

  /**
   * Check if token is deprecated based on name or comment
   */
  private isDeprecated(name: string, comment?: string): boolean {
    return name.includes('legacy') ||
           comment?.toLowerCase().includes('deprecated') ||
           comment?.toLowerCase().includes('do not use') ||
           false;
  }

  /**
   * Check if token is semantic (references other tokens)
   */
  private isSemantic(value: string): boolean {
    return value.includes('var(--') || value.startsWith('{') && value.endsWith('}');
  }

  /**
   * Calculate accessibility information for color tokens
   */
  private calculateAccessibility(value: string, name: string): AccessibilityInfo | undefined {
    if (!this.isColorValue(value)) return undefined;

    // This would integrate with a contrast calculation library
    // For now, return basic structure
    return {
      usage: this.inferColorUsage(name)
    };
  }

  /**
   * Infer appropriate usage for color tokens
   */
  private inferColorUsage(name: string): string[] {
    const usage: string[] = [];

    if (name.includes('background') || name.includes('bg')) {
      usage.push('background');
    }
    if (name.includes('text') || name.includes('foreground')) {
      usage.push('text');
    }
    if (name.includes('border')) {
      usage.push('border');
    }
    if (name.includes('primary')) {
      usage.push('primary-action');
    }
    if (name.includes('error') || name.includes('danger')) {
      usage.push('error-state');
    }
    if (name.includes('success')) {
      usage.push('success-state');
    }
    if (name.includes('warning')) {
      usage.push('warning-state');
    }

    return usage;
  }

  /**
   * Get description for token category
   */
  private getCategoryDescription(category: TokenCategory): string {
    const descriptions: Record<TokenCategory, string> = {
      colors: 'Color palette including brand colors, semantic colors, and functional colors',
      spacing: 'Spacing values for margins, padding, gaps, and layout',
      typography: 'Typography tokens including font sizes, weights, and line heights',
      shadows: 'Box shadow and drop shadow definitions',
      borders: 'Border radius, width, and style definitions',
      animations: 'Animation timing functions, durations, and keyframes',
      layout: 'Layout-related tokens like dimensions and positioning',
      semantic: 'Semantic tokens that reference other tokens for consistent theming'
    };

    return descriptions[category];
  }
}