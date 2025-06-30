#!/usr/bin/env node

/**
 * Token Management Commands
 * Individual commands for token operations
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { TokenParser } from './parser.js';
import { TokenValidator } from './validator.js';
import { TokenExporter } from './exporter.js';
import {
  TokenDefinition,
  TokenRegistry,
  TokenCategory,
  TokenValueType,
  TokenSearchOptions,
  MigrationPlan
} from './types.js';

export class TokenCommands {
  private parser: TokenParser;
  private validator: TokenValidator;
  private exporter: TokenExporter;

  constructor() {
    this.parser = new TokenParser();
    this.validator = new TokenValidator();
    this.exporter = new TokenExporter();
  }

  /**
   * Add new token command
   */
  async addToken(options: {
    name: string;
    value: string;
    category: TokenCategory;
    type?: TokenValueType;
    comment?: string;
    semantic?: boolean;
  }): Promise<void> {
    console.log('🔧 Adding new token...');

    // Load current registry
    const registry = await this.parser.parseAll();

    // Validate token doesn't exist
    const exists = this.findToken(registry, options.name);
    if (exists) {
      throw new Error(`Token "${options.name}" already exists`);
    }

    // Create new token
    const newToken: TokenDefinition = {
      name: options.name,
      path: options.name,
      category: options.category,
      type: options.type || this.inferType(options.name, options.value),
      value: options.value,
      cssVar: `--${options.name}`,
      comment: options.comment,
      semantic: options.semantic || this.isSemantic(options.value)
    };

    // Validate new token
    const validationResults = this.validator.validateToken(newToken, registry);
    const errors = validationResults.filter(r => !r.passed);
    
    if (errors.length > 0) {
      console.warn('⚠️  Validation warnings:');
      errors.forEach(error => console.warn(`  - ${error.message}`));
    }

    // Add to registry
    registry.categories[options.category].tokens.push(newToken);
    registry.metadata.totalTokens++;

    // Export updated files
    await this.saveRegistry(registry);

    console.log(`✅ Token "${options.name}" added successfully`);
    console.log(`   Category: ${options.category}`);
    console.log(`   Value: ${options.value}`);
    console.log(`   CSS Variable: ${newToken.cssVar}`);
  }

  /**
   * Remove token command
   */
  async removeToken(name: string, options: { force?: boolean } = {}): Promise<void> {
    console.log(`🗑️  Removing token "${name}"...`);

    // Load current registry
    const registry = await this.parser.parseAll();

    // Find token
    const token = this.findToken(registry, name);
    if (!token) {
      throw new Error(`Token "${name}" not found`);
    }

    // Check dependencies
    const dependentTokens = this.findDependentTokens(registry, name);
    if (dependentTokens.length > 0 && !options.force) {
      console.error('❌ Cannot remove token - other tokens depend on it:');
      dependentTokens.forEach(dep => console.error(`  - ${dep.path}: ${dep.value}`));
      console.error('Use --force to remove anyway (may break dependent tokens)');
      return;
    }

    // Remove token
    for (const category of Object.values(registry.categories)) {
      const index = category.tokens.findIndex(t => t.name === name);
      if (index !== -1) {
        category.tokens.splice(index, 1);
        registry.metadata.totalTokens--;
        break;
      }
    }

    // Export updated files
    await this.saveRegistry(registry);

    console.log(`✅ Token "${name}" removed successfully`);
    
    if (dependentTokens.length > 0) {
      console.warn(`⚠️  ${dependentTokens.length} dependent tokens may be affected`);
    }
  }

  /**
   * Rename token command
   */
  async renameToken(oldName: string, newName: string): Promise<void> {
    console.log(`📝 Renaming token "${oldName}" to "${newName}"...`);

    // Load current registry
    const registry = await this.parser.parseAll();

    // Find token
    const token = this.findToken(registry, oldName);
    if (!token) {
      throw new Error(`Token "${oldName}" not found`);
    }

    // Check if new name already exists
    const exists = this.findToken(registry, newName);
    if (exists) {
      throw new Error(`Token "${newName}" already exists`);
    }

    // Find dependent tokens
    const dependentTokens = this.findDependentTokens(registry, oldName);

    // Rename token
    token.name = newName;
    token.path = newName;
    token.cssVar = `--${newName}`;

    // Update references in dependent tokens
    for (const dependent of dependentTokens) {
      dependent.value = dependent.value.replace(
        new RegExp(`var\\(--${oldName}\\)`, 'g'),
        `var(--${newName})`
      );
      
      if (dependent.references) {
        const index = dependent.references.indexOf(oldName);
        if (index !== -1) {
          dependent.references[index] = newName;
        }
      }
    }

    // Export updated files
    await this.saveRegistry(registry);

    console.log(`✅ Token renamed successfully`);
    console.log(`   Old name: ${oldName}`);
    console.log(`   New name: ${newName}`);
    
    if (dependentTokens.length > 0) {
      console.log(`   Updated ${dependentTokens.length} dependent tokens`);
    }
  }

  /**
   * Find tokens command
   */
  async findTokens(query: string, options: TokenSearchOptions = {}): Promise<TokenDefinition[]> {
    console.log(`🔍 Searching for tokens: "${query}"`);

    // Load current registry
    const registry = await this.parser.parseAll();

    // Collect all tokens
    const allTokens: TokenDefinition[] = [];
    for (const category of Object.values(registry.categories)) {
      allTokens.push(...category.tokens);
    }

    // Filter tokens
    let results = allTokens.filter(token => {
      // Text search
      const searchText = query.toLowerCase();
      const matches = 
        token.name.toLowerCase().includes(searchText) ||
        token.value.toLowerCase().includes(searchText) ||
        token.comment?.toLowerCase().includes(searchText) ||
        token.path.toLowerCase().includes(searchText);

      if (!matches) return false;

      // Category filter
      if (options.category && !options.category.includes(token.category)) {
        return false;
      }

      // Type filter
      if (options.type && !options.type.includes(token.type)) {
        return false;
      }

      // Deprecated filter
      if (options.deprecated !== undefined && token.deprecated !== options.deprecated) {
        return false;
      }

      // Semantic filter
      if (options.semantic !== undefined && token.semantic !== options.semantic) {
        return false;
      }

      return true;
    });

    // Regex search if enabled
    if (options.regex && query) {
      try {
        const regex = new RegExp(query, options.caseSensitive ? 'g' : 'gi');
        results = results.filter(token =>
          regex.test(token.name) || 
          regex.test(token.value) ||
          (token.comment && regex.test(token.comment))
        );
      } catch (error) {
        console.warn('Invalid regex pattern, falling back to text search');
      }
    }

    // Display results
    console.log(`\n📋 Found ${results.length} tokens:`);
    
    if (results.length === 0) {
      console.log('   No tokens match your search criteria');
    } else {
      // Group by category
      const byCategory: Record<string, TokenDefinition[]> = {};
      for (const token of results) {
        if (!byCategory[token.category]) {
          byCategory[token.category] = [];
        }
        byCategory[token.category].push(token);
      }

      for (const [category, tokens] of Object.entries(byCategory)) {
        console.log(`\n   ${category.toUpperCase()}:`);
        for (const token of tokens.slice(0, 10)) { // Limit display
          const deprecatedFlag = token.deprecated ? ' [DEPRECATED]' : '';
          console.log(`     ${token.name}: ${token.value}${deprecatedFlag}`);
          if (token.comment) {
            console.log(`       // ${token.comment}`);
          }
        }
        if (tokens.length > 10) {
          console.log(`     ... and ${tokens.length - 10} more`);
        }
      }
    }

    return results;
  }

  /**
   * Update token value command
   */
  async updateToken(name: string, updates: {
    value?: string;
    comment?: string;
    deprecated?: boolean;
  }): Promise<void> {
    console.log(`✏️  Updating token "${name}"...`);

    // Load current registry
    const registry = await this.parser.parseAll();

    // Find token
    const token = this.findToken(registry, name);
    if (!token) {
      throw new Error(`Token "${name}" not found`);
    }

    console.log('Current values:');
    console.log(`  Value: ${token.value}`);
    console.log(`  Comment: ${token.comment || 'none'}`);
    console.log(`  Deprecated: ${token.deprecated || false}`);

    // Apply updates
    let hasChanges = false;
    
    if (updates.value !== undefined && updates.value !== token.value) {
      token.value = updates.value;
      token.type = this.inferType(token.name, updates.value);
      token.semantic = this.isSemantic(updates.value);
      hasChanges = true;
    }

    if (updates.comment !== undefined && updates.comment !== token.comment) {
      token.comment = updates.comment;
      hasChanges = true;
    }

    if (updates.deprecated !== undefined && updates.deprecated !== token.deprecated) {
      token.deprecated = updates.deprecated;
      hasChanges = true;
    }

    if (!hasChanges) {
      console.log('No changes made');
      return;
    }

    // Validate updated token
    const validationResults = this.validator.validateToken(token, registry);
    const errors = validationResults.filter(r => !r.passed);
    
    if (errors.length > 0) {
      console.warn('⚠️  Validation warnings:');
      errors.forEach(error => console.warn(`  - ${error.message}`));
    }

    // Export updated files
    await this.saveRegistry(registry);

    console.log(`✅ Token "${name}" updated successfully`);
    console.log('New values:');
    console.log(`  Value: ${token.value}`);
    console.log(`  Comment: ${token.comment || 'none'}`);
    console.log(`  Deprecated: ${token.deprecated || false}`);
  }

  /**
   * Generate migration plan command
   */
  async generateMigrationPlan(fromVersion: string, toVersion: string): Promise<MigrationPlan> {
    console.log(`📋 Generating migration plan from ${fromVersion} to ${toVersion}...`);

    // This would compare two versions of the token registry
    // For now, return a basic plan
    const plan: MigrationPlan = {
      from: fromVersion,
      to: toVersion,
      operations: [],
      impact: {
        filesAffected: [],
        tokensChanged: 0,
        breakingChanges: 0,
        estimatedEffort: 'low'
      }
    };

    console.log(`✅ Migration plan generated`);
    console.log(`   Operations: ${plan.operations.length}`);
    console.log(`   Breaking changes: ${plan.impact.breakingChanges}`);
    console.log(`   Estimated effort: ${plan.impact.estimatedEffort}`);

    return plan;
  }

  /**
   * List all tokens command
   */
  async listTokens(options: { category?: TokenCategory; deprecated?: boolean } = {}): Promise<void> {
    console.log('📋 Listing tokens...');

    // Load current registry
    const registry = await this.parser.parseAll();

    const categoriesToShow = options.category 
      ? [options.category]
      : Object.keys(registry.categories) as TokenCategory[];

    for (const categoryName of categoriesToShow) {
      const category = registry.categories[categoryName];
      if (!category) continue;

      let tokens = category.tokens;
      
      // Filter deprecated if specified
      if (options.deprecated !== undefined) {
        tokens = tokens.filter(t => t.deprecated === options.deprecated);
      }

      if (tokens.length === 0) continue;

      console.log(`\n🎨 ${categoryName.toUpperCase()} (${tokens.length} tokens):`);
      
      for (const token of tokens) {
        const deprecatedFlag = token.deprecated ? ' [DEPRECATED]' : '';
        const semanticFlag = token.semantic ? ' [SEMANTIC]' : '';
        console.log(`   ${token.name}: ${token.value}${deprecatedFlag}${semanticFlag}`);
        
        if (token.comment) {
          console.log(`     // ${token.comment}`);
        }
      }
    }

    console.log(`\n📊 Total: ${registry.metadata.totalTokens} tokens`);
    if (registry.metadata.deprecated > 0) {
      console.log(`   Deprecated: ${registry.metadata.deprecated}`);
    }
    if (registry.metadata.semantic > 0) {
      console.log(`   Semantic: ${registry.metadata.semantic}`);
    }
  }

  /**
   * Validate tokens command
   */
  async validateTokens(options: { fix?: boolean } = {}): Promise<void> {
    console.log('🔍 Validating tokens...');

    // Load current registry
    const registry = await this.parser.parseAll();

    // Run validation
    const report = await this.validator.validateRegistry(registry);

    // Display results
    console.log(`\n📊 Validation Results:`);
    console.log(`   Total tokens: ${report.totalTokens}`);
    console.log(`   Errors: ${report.summary.errorCount}`);
    console.log(`   Warnings: ${report.summary.warningCount}`);
    console.log(`   Suggestions: ${report.summary.suggestionCount}`);
    console.log(`   Coverage: ${report.summary.coverage.toFixed(1)}%`);

    if (report.summary.errorCount > 0) {
      console.log(`\n❌ ERRORS:`);
      report.errors.forEach(error => {
        console.log(`   ${error.tokenPath}: ${error.message}`);
        if (error.suggestion) {
          console.log(`     💡 ${error.suggestion}`);
        }
      });
    }

    if (report.summary.warningCount > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      report.warnings.forEach(warning => {
        console.log(`   ${warning.tokenPath}: ${warning.message}`);
        if (warning.suggestion) {
          console.log(`     💡 ${warning.suggestion}`);
        }
      });
    }

    if (options.fix) {
      console.log(`\n🔧 Attempting to fix issues...`);
      // Auto-fix logic would go here
      console.log(`   Auto-fix not yet implemented`);
    }
  }

  // Helper methods

  private findToken(registry: TokenRegistry, name: string): TokenDefinition | null {
    for (const category of Object.values(registry.categories)) {
      const token = category.tokens.find(t => t.name === name || t.path === name);
      if (token) return token;
    }
    return null;
  }

  private findDependentTokens(registry: TokenRegistry, tokenName: string): TokenDefinition[] {
    const dependents: TokenDefinition[] = [];
    
    for (const category of Object.values(registry.categories)) {
      for (const token of category.tokens) {
        if (token.value.includes(`var(--${tokenName})`) || 
            token.references?.includes(tokenName)) {
          dependents.push(token);
        }
      }
    }
    
    return dependents;
  }

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

  private isColorValue(value: string): boolean {
    return /^#[0-9A-Fa-f]{3,6}$/.test(value) ||
           /^rgb\(/.test(value) ||
           /^rgba\(/.test(value) ||
           /^hsl\(/.test(value) ||
           /^oklch\(/.test(value) ||
           value === 'transparent' ||
           value === 'currentColor';
  }

  private isSemantic(value: string): boolean {
    return value.includes('var(--') || value.startsWith('{') && value.endsWith('}');
  }

  private async saveRegistry(registry: TokenRegistry): Promise<void> {
    // Export all formats
    await this.exporter.export(registry, { format: 'css', includeComments: true });
    await this.exporter.export(registry, { format: 'ts', includeComments: true });
    await this.exporter.export(registry, { format: 'json', includeComments: true });
  }
}