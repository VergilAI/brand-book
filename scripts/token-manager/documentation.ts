/**
 * Documentation Generator for Design Tokens
 * Generates comprehensive documentation and usage examples
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { TokenRegistry, TokenDefinition, TokenCategory, ExportResult } from './types.js';
import { AccessibilityChecker } from './accessibility.js';

export class DocumentationGenerator {
  private outputDir: string;
  private accessibilityChecker: AccessibilityChecker;

  constructor(outputDir: string = 'docs/tokens') {
    this.outputDir = outputDir;
    this.accessibilityChecker = new AccessibilityChecker();
    this.ensureOutputDir();
  }

  /**
   * Generate complete token documentation
   */
  async generateAll(registry: TokenRegistry): Promise<ExportResult[]> {
    console.log('📖 Generating token documentation...');

    const results: ExportResult[] = [];

    // Generate main documentation
    results.push(await this.generateOverview(registry));
    results.push(await this.generateCategoryDocs(registry));
    results.push(await this.generateUsageGuide(registry));
    results.push(await this.generateAccessibilityReport(registry));
    results.push(await this.generateMigrationGuide(registry));
    results.push(await this.generateTokenGallery(registry));

    console.log(`✅ Generated ${results.length} documentation files`);
    return results;
  }

  /**
   * Generate overview documentation
   */
  private async generateOverview(registry: TokenRegistry): Promise<ExportResult> {
    const content = this.buildMarkdownDocument([
      '# Design System Tokens',
      '',
      'This documentation provides a comprehensive overview of all design tokens in the Vergil Design System.',
      '',
      `**Last Updated:** ${new Date().toLocaleDateString()}`,
      `**Total Tokens:** ${registry.metadata.totalTokens}`,
      `**Categories:** ${Object.keys(registry.categories).length}`,
      '',
      '## Quick Stats',
      '',
      '| Metric | Count |',
      '|--------|-------|',
      `| Total Tokens | ${registry.metadata.totalTokens} |`,
      `| Deprecated | ${registry.metadata.deprecated} |`,
      `| Semantic | ${registry.metadata.semantic} |`,
      '',
      '## Categories',
      '',
      ...Object.entries(registry.categories).map(([name, group]) => 
        `- **${name}** (${group.tokens.length} tokens): ${group.description || 'No description'}`
      ),
      '',
      '## Usage',
      '',
      'Tokens can be used in CSS, SCSS, JavaScript, and TypeScript:',
      '',
      '```css',
      '/* CSS Custom Properties */',
      '.example {',
      '  color: var(--cosmic-purple);',
      '  background: var(--pure-light);',
      '}',
      '```',
      '',
      '```typescript',
      '// TypeScript/JavaScript',
      'import { tokens } from "./generated/tokens";',
      '',
      'const primaryColor = tokens.colors.cosmicPurple;',
      '```',
      '',
      '## Files Generated',
      '',
      '- `tokens.css` - CSS custom properties',
      '- `tokens.scss` - SCSS variables',
      '- `tokens.ts` - TypeScript constants',
      '- `tokens.json` - JSON data',
      '- `tailwind-tokens.js` - Tailwind configuration',
      '',
      '## Categories Overview',
      '',
      ...Object.entries(registry.categories).map(([name, group]) => [
        `### ${this.capitalizeFirst(name)}`,
        '',
        group.description || 'No description available.',
        '',
        `**Tokens:** ${group.tokens.length}`,
        `**Deprecated:** ${group.tokens.filter(t => t.deprecated).length}`,
        '',
        'Key tokens:',
        ...group.tokens.slice(0, 5).map(token => 
          `- \`${token.name}\`: ${token.value}${token.deprecated ? ' *(deprecated)*' : ''}`
        ),
        group.tokens.length > 5 ? `- *...and ${group.tokens.length - 5} more*` : '',
        ''
      ]).flat()
    ]);

    const filename = join(this.outputDir, 'README.md');
    writeFileSync(filename, content);

    return {
      content,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: registry.metadata.totalTokens,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate category-specific documentation
   */
  private async generateCategoryDocs(registry: TokenRegistry): Promise<ExportResult> {
    const allContent: string[] = [];
    
    for (const [categoryName, group] of Object.entries(registry.categories)) {
      const content = this.buildMarkdownDocument([
        `# ${this.capitalizeFirst(categoryName)} Tokens`,
        '',
        group.description || 'No description available.',
        '',
        `**Total Tokens:** ${group.tokens.length}`,
        `**Deprecated:** ${group.tokens.filter(t => t.deprecated).length}`,
        '',
        '## Tokens',
        '',
        '| Name | Value | Type | Description |',
        '|------|-------|------|-------------|',
        ...group.tokens.map(token => {
          const description = token.comment || 'No description';
          const deprecatedFlag = token.deprecated ? ' ⚠️' : '';
          return `| \`${token.name}\` | \`${token.value}\` | ${token.type} | ${description}${deprecatedFlag} |`;
        }),
        '',
        '## Usage Examples',
        '',
        this.generateUsageExamples(group.tokens.slice(0, 3), categoryName),
        '',
        '## CSS Variables',
        '',
        '```css',
        ':root {',
        ...group.tokens.map(token => `  ${token.cssVar}: ${token.value};`),
        '}',
        '```',
        ''
      ]);

      allContent.push(content);
      
      // Write individual category file
      const categoryFilename = join(this.outputDir, `${categoryName}.md`);
      writeFileSync(categoryFilename, content);
    }

    const combinedContent = allContent.join('\n---\n\n');
    const filename = join(this.outputDir, 'categories.md');
    writeFileSync(filename, combinedContent);

    return {
      content: combinedContent,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: registry.metadata.totalTokens,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate usage guide
   */
  private async generateUsageGuide(registry: TokenRegistry): Promise<ExportResult> {
    const content = this.buildMarkdownDocument([
      '# Token Usage Guide',
      '',
      'Learn how to effectively use design tokens in your projects.',
      '',
      '## Installation & Setup',
      '',
      '1. **Import CSS tokens:**',
      '```css',
      '@import "./generated/tokens.css";',
      '```',
      '',
      '2. **Import TypeScript tokens:**',
      '```typescript',
      'import { tokens, getCSSVar } from "./generated/tokens";',
      '```',
      '',
      '## Usage Patterns',
      '',
      '### CSS Custom Properties',
      '',
      'The recommended approach for CSS:',
      '',
      '```css',
      '.card {',
      '  background: var(--pure-light);',
      '  border: 1px solid var(--mist-gray);',
      '  border-radius: var(--radius);',
      '  color: var(--deep-space);',
      '}',
      '```',
      '',
      '### SCSS Variables',
      '',
      '```scss',
      '@import "./generated/tokens.scss";',
      '',
      '.button {',
      '  background: $cosmic-purple;',
      '  color: $pure-light;',
      '  padding: $spacing-md $spacing-lg;',
      '}',
      '```',
      '',
      '### TypeScript/JavaScript',
      '',
      '```typescript',
      'import { tokens } from "./generated/tokens";',
      '',
      '// Direct access',
      'const primaryColor = tokens.colors.cosmicPurple;',
      '',
      '// CSS variable helper',
      'const cssVar = getCSSVar("colors.cosmic-purple");',
      '// Returns: "var(--colors-cosmic-purple)"',
      '```',
      '',
      '### React/JSX',
      '',
      '```jsx',
      'import { tokens } from "./generated/tokens";',
      '',
      'function Button({ children }) {',
      '  return (',
      '    <button',
      '      style={{',
      '        backgroundColor: tokens.colors.cosmicPurple,',
      '        color: tokens.colors.pureLight,',
      '        borderRadius: tokens.borders.md',
      '      }}',
      '    >',
      '      {children}',
      '    </button>',
      '  );',
      '}',
      '```',
      '',
      '## Best Practices',
      '',
      '### 1. Use Semantic Tokens',
      '',
      'Prefer semantic tokens over direct color values:',
      '',
      '```css',
      '/* Good */',
      '.error-message {',
      '  color: var(--error-text);',
      '  background: var(--error-background);',
      '}',
      '',
      '/* Avoid */',
      '.error-message {',
      '  color: var(--red-500);',
      '  background: var(--red-50);',
      '}',
      '```',
      '',
      '### 2. Consistent Spacing',
      '',
      'Use the spacing scale consistently:',
      '',
      '```css',
      '.component {',
      '  margin: var(--spacing-lg);',
      '  padding: var(--spacing-md);',
      '  gap: var(--spacing-sm);',
      '}',
      '```',
      '',
      '### 3. Typography Hierarchy',
      '',
      'Follow the established type scale:',
      '',
      '```css',
      '.heading {',
      '  font-size: var(--font-size-h1);',
      '  line-height: var(--line-height-tight);',
      '  font-weight: var(--font-weight-bold);',
      '}',
      '```',
      '',
      '## Common Patterns',
      '',
      this.generateCommonPatterns(registry),
      '',
      '## Migration from Hard-coded Values',
      '',
      'When migrating existing code:',
      '',
      '1. **Audit current values:** Find all hard-coded colors, spacing, etc.',
      '2. **Map to tokens:** Match existing values to appropriate tokens',
      '3. **Update incrementally:** Replace values gradually, testing as you go',
      '4. **Validate consistency:** Ensure visual consistency is maintained',
      '',
      '## Troubleshooting',
      '',
      '### Token Not Found',
      '',
      'If a CSS variable shows as undefined:',
      '',
      '1. Check that tokens.css is imported',
      '2. Verify the token name is correct',
      '3. Ensure the token exists in the latest version',
      '',
      '### Type Errors (TypeScript)',
      '',
      'If TypeScript reports missing tokens:',
      '',
      '1. Regenerate tokens: `npm run build:tokens`',
      '2. Check import path',
      '3. Verify token exists in generated files'
    ]);

    const filename = join(this.outputDir, 'usage-guide.md');
    writeFileSync(filename, content);

    return {
      content,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: registry.metadata.totalTokens,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate accessibility report
   */
  private async generateAccessibilityReport(registry: TokenRegistry): Promise<ExportResult> {
    const allTokens: TokenDefinition[] = [];
    for (const category of Object.values(registry.categories)) {
      allTokens.push(...category.tokens);
    }

    const report = this.accessibilityChecker.generateAccessibilityReport(allTokens);

    const content = this.buildMarkdownDocument([
      '# Accessibility Report',
      '',
      'WCAG compliance analysis for color tokens.',
      '',
      `**Generated:** ${new Date().toLocaleDateString()}`,
      '',
      '## Summary',
      '',
      '| Level | Count | Percentage |',
      '|-------|-------|------------|',
      `| AAA Compliant | ${report.summary.aaa} | ${((report.summary.aaa / report.summary.total) * 100).toFixed(1)}% |`,
      `| AA Compliant | ${report.summary.aa} | ${((report.summary.aa / report.summary.total) * 100).toFixed(1)}% |`,
      `| Non-compliant | ${report.summary.fail} | ${((report.summary.fail / report.summary.total) * 100).toFixed(1)}% |`,
      `| **Total** | **${report.summary.total}** | **100%** |`,
      '',
      '## AAA Compliant Tokens ✅',
      '',
      report.compliant.length > 0 ? [
        '| Token | Value | Contrast Ratio | Background |',
        '|-------|-------|----------------|------------|',
        ...report.compliant.map(token => 
          `| \`${token.name}\` | \`${token.value}\` | ${token.accessibility?.contrastRatio?.toFixed(2)}:1 | ${token.accessibility?.backgroundColor} |`
        )
      ].join('\n') : '*No AAA compliant tokens found.*',
      '',
      '## AA Compliant Tokens ⚠️',
      '',
      report.warnings.length > 0 ? [
        '| Token | Value | Contrast Ratio | Background |',
        '|-------|-------|----------------|------------|',
        ...report.warnings.map(token => 
          `| \`${token.name}\` | \`${token.value}\` | ${token.accessibility?.contrastRatio?.toFixed(2)}:1 | ${token.accessibility?.backgroundColor} |`
        )
      ].join('\n') : '*No AA compliant tokens found.*',
      '',
      '## Non-compliant Tokens ❌',
      '',
      report.violations.length > 0 ? [
        '| Token | Value | Contrast Ratio | Background | Recommendation |',
        '|-------|-------|----------------|------------|----------------|',
        ...report.violations.map(token => {
          const suggestions = this.accessibilityChecker.suggestAccessibleAlternatives(
            token.value, 
            token.accessibility?.backgroundColor || '#ffffff'
          );
          return `| \`${token.name}\` | \`${token.value}\` | ${token.accessibility?.contrastRatio?.toFixed(2)}:1 | ${token.accessibility?.backgroundColor} | Try: ${suggestions.darker} or ${suggestions.lighter} |`;
        })
      ].join('\n') : '*All tokens are WCAG compliant! 🎉*',
      '',
      '## Guidelines',
      '',
      '### WCAG Contrast Requirements',
      '',
      '- **AAA Level:** 7:1 for normal text, 4.5:1 for large text',
      '- **AA Level:** 4.5:1 for normal text, 3:1 for large text',
      '',
      '### Usage Recommendations',
      '',
      '1. **Text on backgrounds:** Use AAA compliant combinations when possible',
      '2. **Interactive elements:** Ensure AA compliance minimum for buttons and links',
      '3. **Decorative elements:** Non-text elements have more flexibility',
      '',
      '### Testing Tools',
      '',
      '- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)',
      '- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)',
      '- Browser DevTools accessibility features'
    ]);

    const filename = join(this.outputDir, 'accessibility.md');
    writeFileSync(filename, content);

    return {
      content,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: allTokens.length,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate migration guide
   */
  private async generateMigrationGuide(registry: TokenRegistry): Promise<ExportResult> {
    const content = this.buildMarkdownDocument([
      '# Migration Guide',
      '',
      'Guide for migrating between token versions and updating existing implementations.',
      '',
      '## Version History',
      '',
      '### Current Version',
      '',
      `- **Version:** ${registry.version}`,
      `- **Last Updated:** ${registry.lastUpdated}`,
      `- **Total Tokens:** ${registry.metadata.totalTokens}`,
      '',
      '### Breaking Changes',
      '',
      'No breaking changes in current version.',
      '',
      '## Migration Strategies',
      '',
      '### 1. Gradual Migration',
      '',
      'Recommended approach for large codebases:',
      '',
      '```bash',
      '# 1. Audit current usage',
      'npm run token:find "color" --regex',
      '',
      '# 2. Replace incrementally',
      'npm run token:rename old-token new-token',
      '',
      '# 3. Validate changes',
      'npm run token:validate',
      '```',
      '',
      '### 2. Automated Migration',
      '',
      'For systematic updates:',
      '',
      '```bash',
      '# Generate migration plan',
      'npm run token:migration-plan v1.0.0 v2.0.0',
      '',
      '# Apply automated fixes',
      'npm run token:migrate --auto-fix',
      '```',
      '',
      '## Common Migration Tasks',
      '',
      '### Renaming Tokens',
      '',
      'When token names change:',
      '',
      '```bash',
      '# Check dependencies first',
      'npm run token:find "old-name"',
      '',
      '# Rename with automatic reference updates',
      'npm run token:rename old-name new-name',
      '```',
      '',
      '### Updating Values',
      '',
      'When token values change:',
      '',
      '```bash',
      '# Update value',
      'npm run token:update token-name --value "#new-value"',
      '',
      '# Validate impact',
      'npm run token:validate',
      '```',
      '',
      '### Deprecating Tokens',
      '',
      'When removing tokens:',
      '',
      '```bash',
      '# 1. Mark as deprecated',
      'npm run token:update token-name --deprecated true',
      '',
      '# 2. Find usage',
      'npm run token:find "deprecated-token"',
      '',
      '# 3. Replace usage with alternatives',
      '# 4. Remove token',
      'npm run token:remove deprecated-token',
      '```',
      '',
      '## Rollback Procedures',
      '',
      '### Git-based Rollback',
      '',
      'If using Git integration:',
      '',
      '```bash',
      'git revert HEAD  # Revert last token changes',
      'npm run build:tokens  # Rebuild tokens',
      '```',
      '',
      '### Manual Rollback',
      '',
      '1. Restore previous token files',
      '2. Run `npm run build:tokens`',
      '3. Test application thoroughly',
      '',
      '## Impact Assessment',
      '',
      'Before making changes, assess impact:',
      '',
      '### 1. Dependency Analysis',
      '',
      '```bash',
      'npm run token:find "token-name" --show-dependencies',
      '```',
      '',
      '### 2. Usage Scanning',
      '',
      '```bash',
      'npm run scan:hardcoded  # Find hard-coded values',
      'npm run report:coverage  # Check token adoption',
      '```',
      '',
      '### 3. Visual Regression Testing',
      '',
      'Recommended tools:',
      '- Chromatic (Storybook)',
      '- Percy',
      '- Playwright screenshots',
      '',
      '## Best Practices',
      '',
      '### 1. Communication',
      '',
      '- Announce breaking changes in advance',
      '- Provide clear migration instructions',
      '- Offer support during transition',
      '',
      '### 2. Testing',
      '',
      '- Test changes in staging environment',
      '- Run visual regression tests',
      '- Validate accessibility compliance',
      '',
      '### 3. Documentation',
      '',
      '- Update usage examples',
      '- Document new patterns',
      '- Maintain changelog'
    ]);

    const filename = join(this.outputDir, 'migration.md');
    writeFileSync(filename, content);

    return {
      content,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: registry.metadata.totalTokens,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate visual token gallery
   */
  private async generateTokenGallery(registry: TokenRegistry): Promise<ExportResult> {
    const content = this.buildMarkdownDocument([
      '# Token Gallery',
      '',
      'Visual showcase of all design tokens with live examples.',
      '',
      '> **Note:** This gallery is best viewed in a Markdown renderer that supports HTML and CSS.',
      '',
      ...Object.entries(registry.categories).map(([categoryName, group]) => [
        `## ${this.capitalizeFirst(categoryName)}`,
        '',
        this.generateCategoryGallery(categoryName, group.tokens),
        ''
      ]).flat()
    ]);

    const filename = join(this.outputDir, 'gallery.md');
    writeFileSync(filename, content);

    return {
      content,
      filename,
      format: 'markdown',
      metadata: {
        tokenCount: registry.metadata.totalTokens,
        categories: Object.keys(registry.categories) as TokenCategory[],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Generate category-specific gallery
   */
  private generateCategoryGallery(category: string, tokens: TokenDefinition[]): string {
    if (category === 'colors') {
      return this.generateColorGallery(tokens);
    } else if (category === 'spacing') {
      return this.generateSpacingGallery(tokens);
    } else if (category === 'typography') {
      return this.generateTypographyGallery(tokens);
    } else {
      return this.generateGenericGallery(tokens);
    }
  }

  /**
   * Generate color gallery with swatches
   */
  private generateColorGallery(tokens: TokenDefinition[]): string {
    const colorTokens = tokens.filter(t => t.type === 'color');
    
    return [
      '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">',
      ...colorTokens.map(token => `
  <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background: ${token.value}; height: 80px; position: relative;">
      <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
        ${token.value}
      </div>
    </div>
    <div style="padding: 12px;">
      <strong>${token.name}</strong><br>
      <code style="font-size: 12px; color: #666;">${token.cssVar}</code>
      ${token.comment ? `<br><em style="font-size: 12px; color: #888;">${token.comment}</em>` : ''}
    </div>
  </div>`),
      '</div>'
    ].join('\n');
  }

  /**
   * Generate spacing gallery with visual rulers
   */
  private generateSpacingGallery(tokens: TokenDefinition[]): string {
    const spacingTokens = tokens.filter(t => t.type === 'spacing');
    
    return [
      '<div style="margin: 20px 0;">',
      ...spacingTokens.map(token => `
  <div style="margin: 16px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <strong style="margin-right: 16px; min-width: 120px;">${token.name}</strong>
      <code style="margin-right: 16px;">${token.value}</code>
      <div style="background: #007bff; height: 4px; width: ${token.value}; min-width: 4px;"></div>
    </div>
    ${token.comment ? `<em style="font-size: 12px; color: #888;">${token.comment}</em>` : ''}
  </div>`),
      '</div>'
    ].join('\n');
  }

  /**
   * Generate typography gallery with text samples
   */
  private generateTypographyGallery(tokens: TokenDefinition[]): string {
    const fontSizeTokens = tokens.filter(t => t.type === 'fontSize');
    
    return [
      '<div style="margin: 20px 0;">',
      ...fontSizeTokens.map(token => `
  <div style="margin: 24px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="font-size: ${token.value}; line-height: 1.4; margin-bottom: 8px;">
      The quick brown fox jumps over the lazy dog
    </div>
    <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: #666;">
      <strong>${token.name}</strong>
      <code>${token.value}</code>
      ${token.comment ? `<em>${token.comment}</em>` : ''}
    </div>
  </div>`),
      '</div>'
    ].join('\n');
  }

  /**
   * Generate generic gallery for other token types
   */
  private generateGenericGallery(tokens: TokenDefinition[]): string {
    return [
      '| Token | Value | Type | Description |',
      '|-------|-------|------|-------------|',
      ...tokens.map(token => 
        `| \`${token.name}\` | \`${token.value}\` | ${token.type} | ${token.comment || 'No description'} |`
      )
    ].join('\n');
  }

  /**
   * Generate usage examples for tokens
   */
  private generateUsageExamples(tokens: TokenDefinition[], category: string): string {
    if (tokens.length === 0) return 'No examples available.';

    const examples = tokens.slice(0, 3).map(token => {
      switch (category) {
        case 'colors':
          return [
            `**${token.name}**`,
            '```css',
            `.example {`,
            `  color: var(${token.cssVar});`,
            `  background: var(${token.cssVar});`,
            '}',
            '```'
          ].join('\n');
        
        case 'spacing':
          return [
            `**${token.name}**`,
            '```css',
            `.example {`,
            `  margin: var(${token.cssVar});`,
            `  padding: var(${token.cssVar});`,
            '}',
            '```'
          ].join('\n');
        
        default:
          return [
            `**${token.name}**`,
            '```css',
            `.example {`,
            `  /* Apply ${token.name} */`,
            `  property: var(${token.cssVar});`,
            '}',
            '```'
          ].join('\n');
      }
    });

    return examples.join('\n\n');
  }

  /**
   * Generate common usage patterns
   */
  private generateCommonPatterns(registry: TokenRegistry): string {
    return [
      '### Card Component',
      '',
      '```css',
      '.card {',
      '  background: var(--pure-light);',
      '  border: 1px solid var(--mist-gray);',
      '  border-radius: var(--radius);',
      '  padding: var(--spacing-lg);',
      '  box-shadow: var(--shadow-md);',
      '}',
      '```',
      '',
      '### Button Component',
      '',
      '```css',
      '.button {',
      '  background: var(--cosmic-purple);',
      '  color: var(--pure-light);',
      '  border: none;',
      '  border-radius: var(--radius);',
      '  padding: var(--spacing-sm) var(--spacing-lg);',
      '  font-size: var(--font-size-body-md);',
      '  font-weight: var(--font-weight-medium);',
      '}',
      '',
      '.button:hover {',
      '  background: var(--electric-violet);',
      '}',
      '```',
      '',
      '### Typography Hierarchy',
      '',
      '```css',
      '.heading-1 {',
      '  font-size: var(--font-size-h1);',
      '  line-height: var(--line-height-tight);',
      '  font-weight: var(--font-weight-bold);',
      '  color: var(--deep-space);',
      '}',
      '',
      '.body-text {',
      '  font-size: var(--font-size-body-md);',
      '  line-height: var(--line-height-normal);',
      '  color: var(--stone-gray);',
      '}',
      '```'
    ].join('\n');
  }

  /**
   * Build markdown document from sections
   */
  private buildMarkdownDocument(sections: string[]): string {
    return sections.join('\n');
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }
}