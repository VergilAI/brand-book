/**
 * Breaking Change Detection System
 * 
 * Analyzes differences between design token versions to automatically detect
 * breaking changes and assess their impact.
 */

import type { BreakingChange, BreakingChangeType, ImpactLevel, EffortLevel } from './version-metadata';

export interface TokenDiff {
  added: TokenChange[];
  removed: TokenChange[];
  modified: TokenChange[];
  renamed: TokenRename[];
}

export interface TokenChange {
  path: string;
  oldValue?: any;
  newValue?: any;
  category: string;
  type: 'primitive' | 'semantic' | 'component';
}

export interface TokenRename {
  oldPath: string;
  newPath: string;
  value: any;
  category: string;
  confidence: number; // 0-1, how confident we are this is a rename vs remove+add
}

export interface BreakingChangeAnalysis {
  isBreaking: boolean;
  breakingChanges: BreakingChange[];
  summary: {
    totalChanges: number;
    breakingCount: number;
    impactLevel: ImpactLevel;
    estimatedEffort: EffortLevel;
  };
  recommendations: string[];
}

export class BreakingChangeDetector {
  /**
   * Analyze differences between two token sets to detect breaking changes
   */
  static analyzeChanges(
    fromTokens: Record<string, any>,
    toTokens: Record<string, any>,
    fromVersion: string,
    toVersion: string
  ): BreakingChangeAnalysis {
    const diff = this.createDiff(fromTokens, toTokens);
    const breakingChanges = this.detectBreakingChanges(diff, fromVersion, toVersion);
    
    const summary = this.summarizeChanges(diff, breakingChanges);
    const recommendations = this.generateRecommendations(breakingChanges, summary);
    
    return {
      isBreaking: breakingChanges.length > 0,
      breakingChanges,
      summary,
      recommendations
    };
  }
  
  /**
   * Create a detailed diff between two token sets
   */
  private static createDiff(fromTokens: Record<string, any>, toTokens: Record<string, any>): TokenDiff {
    const fromPaths = this.flattenTokens(fromTokens);
    const toPaths = this.flattenTokens(toTokens);
    
    const fromKeys = new Set(Object.keys(fromPaths));
    const toKeys = new Set(Object.keys(toPaths));
    
    // Find added tokens
    const added: TokenChange[] = [];
    for (const key of toKeys) {
      if (!fromKeys.has(key)) {
        added.push({
          path: key,
          newValue: toPaths[key],
          category: this.getTokenCategory(key),
          type: this.getTokenType(key)
        });
      }
    }
    
    // Find removed tokens
    const removed: TokenChange[] = [];
    for (const key of fromKeys) {
      if (!toKeys.has(key)) {
        removed.push({
          path: key,
          oldValue: fromPaths[key],
          category: this.getTokenCategory(key),
          type: this.getTokenType(key)
        });
      }
    }
    
    // Find modified tokens
    const modified: TokenChange[] = [];
    for (const key of fromKeys) {
      if (toKeys.has(key) && !this.valuesEqual(fromPaths[key], toPaths[key])) {
        modified.push({
          path: key,
          oldValue: fromPaths[key],
          newValue: toPaths[key],
          category: this.getTokenCategory(key),
          type: this.getTokenType(key)
        });
      }
    }
    
    // Detect potential renames
    const renamed = this.detectRenames(removed, added);
    
    // Remove items that were identified as renames
    const renamedOldPaths = new Set(renamed.map(r => r.oldPath));
    const renamedNewPaths = new Set(renamed.map(r => r.newPath));
    
    return {
      added: added.filter(a => !renamedNewPaths.has(a.path)),
      removed: removed.filter(r => !renamedOldPaths.has(r.path)),
      modified,
      renamed
    };
  }
  
  /**
   * Detect breaking changes from the diff
   */
  private static detectBreakingChanges(
    diff: TokenDiff,
    fromVersion: string,
    toVersion: string
  ): BreakingChange[] {
    const changes: BreakingChange[] = [];
    let changeId = 1;
    
    // Token removals are always breaking
    for (const removed of diff.removed) {
      changes.push({
        id: `breaking-${changeId++}`,
        type: 'token-removed',
        description: `Token '${removed.path}' was removed`,
        impact: this.assessRemovalImpact(removed),
        token: removed.path,
        oldValue: removed.oldValue,
        migrationPath: this.generateRemovalMigration(removed),
        automatable: false,
        estimatedEffort: this.assessRemovalEffort(removed)
      });
    }
    
    // Token renames are breaking
    for (const renamed of diff.renamed) {
      changes.push({
        id: `breaking-${changeId++}`,
        type: 'token-renamed',
        description: `Token '${renamed.oldPath}' was renamed to '${renamed.newPath}'`,
        impact: this.assessRenameImpact(renamed),
        token: renamed.oldPath,
        oldValue: renamed.oldPath,
        newValue: renamed.newPath,
        migrationPath: this.generateRenameMigration(renamed),
        automatable: true,
        estimatedEffort: this.assessRenameEffort(renamed)
      });
    }
    
    // Significant value changes are breaking
    for (const modified of diff.modified) {
      if (this.isBreakingValueChange(modified)) {
        changes.push({
          id: `breaking-${changeId++}`,
          type: 'value-changed',
          description: `Token '${modified.path}' value changed significantly`,
          impact: this.assessValueChangeImpact(modified),
          token: modified.path,
          oldValue: modified.oldValue,
          newValue: modified.newValue,
          migrationPath: this.generateValueChangeMigration(modified),
          automatable: false,
          estimatedEffort: this.assessValueChangeEffort(modified)
        });
      }
    }
    
    return changes;
  }
  
  /**
   * Detect potential token renames by matching values and similarity
   */
  private static detectRenames(removed: TokenChange[], added: TokenChange[]): TokenRename[] {
    const renames: TokenRename[] = [];
    
    for (const removedToken of removed) {
      for (const addedToken of added) {
        // Same value and similar path = likely rename
        if (this.valuesEqual(removedToken.oldValue, addedToken.newValue)) {
          const similarity = this.calculatePathSimilarity(removedToken.path, addedToken.path);
          
          if (similarity > 0.5) { // 50% similarity threshold
            renames.push({
              oldPath: removedToken.path,
              newPath: addedToken.path,
              value: removedToken.oldValue,
              category: removedToken.category,
              confidence: similarity
            });
          }
        }
      }
    }
    
    // Sort by confidence and remove duplicates
    return renames
      .sort((a, b) => b.confidence - a.confidence)
      .filter((rename, index, arr) => 
        arr.findIndex(r => r.oldPath === rename.oldPath || r.newPath === rename.newPath) === index
      );
  }
  
  /**
   * Flatten nested token object into dot-notation paths
   */
  private static flattenTokens(tokens: Record<string, any>, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(tokens)) {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !this.isTokenValue(value)) {
        Object.assign(result, this.flattenTokens(value, path));
      } else {
        result[path] = this.extractTokenValue(value);
      }
    }
    
    return result;
  }
  
  /**
   * Check if an object represents a token value (has 'value' property)
   */
  private static isTokenValue(obj: any): boolean {
    return obj && typeof obj === 'object' && 'value' in obj;
  }
  
  /**
   * Extract the actual value from a token object
   */
  private static extractTokenValue(token: any): any {
    if (this.isTokenValue(token)) {
      return token.value;
    }
    return token;
  }
  
  /**
   * Check if two token values are equal
   */
  private static valuesEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }
  
  /**
   * Calculate similarity between two token paths
   */
  private static calculatePathSimilarity(path1: string, path2: string): number {
    const parts1 = path1.split('.');
    const parts2 = path2.split('.');
    
    // Exact match
    if (path1 === path2) return 1;
    
    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(path1, path2);
    const maxLength = Math.max(path1.length, path2.length);
    const similarity = 1 - (distance / maxLength);
    
    // Bonus for similar structure (same number of parts)
    if (parts1.length === parts2.length) {
      const partMatches = parts1.filter((part, i) => part === parts2[i]).length;
      const structureBonus = partMatches / parts1.length * 0.3;
      return Math.min(1, similarity + structureBonus);
    }
    
    return similarity;
  }
  
  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  /**
   * Get token category from path
   */
  private static getTokenCategory(path: string): string {
    const parts = path.split('.');
    return parts[0] || 'unknown';
  }
  
  /**
   * Get token type from path
   */
  private static getTokenType(path: string): 'primitive' | 'semantic' | 'component' {
    const parts = path.split('.');
    
    if (parts.includes('semantic')) return 'semantic';
    if (parts.includes('component')) return 'component';
    return 'primitive';
  }
  
  /**
   * Assess impact of token removal
   */
  private static assessRemovalImpact(token: TokenChange): ImpactLevel {
    if (token.type === 'primitive') return 'high';
    if (token.category === 'colors' || token.category === 'spacing') return 'high';
    if (token.type === 'semantic') return 'medium';
    return 'low';
  }
  
  /**
   * Assess impact of token rename
   */
  private static assessRenameImpact(rename: TokenRename): ImpactLevel {
    if (rename.confidence > 0.8) return 'low'; // High confidence rename
    if (rename.category === 'colors' || rename.category === 'spacing') return 'medium';
    return 'low';
  }
  
  /**
   * Assess impact of value change
   */
  private static assessValueChangeImpact(token: TokenChange): ImpactLevel {
    if (token.category === 'colors') {
      return this.isSignificantColorChange(token.oldValue, token.newValue) ? 'high' : 'medium';
    }
    if (token.category === 'spacing') {
      return this.isSignificantSpacingChange(token.oldValue, token.newValue) ? 'high' : 'medium';
    }
    return 'medium';
  }
  
  /**
   * Check if a value change is breaking
   */
  private static isBreakingValueChange(token: TokenChange): boolean {
    // Color changes are breaking if they're significantly different
    if (token.category === 'colors') {
      return this.isSignificantColorChange(token.oldValue, token.newValue);
    }
    
    // Spacing changes are breaking if they're more than 20% different
    if (token.category === 'spacing') {
      return this.isSignificantSpacingChange(token.oldValue, token.newValue);
    }
    
    // Typography changes are breaking if they affect readability
    if (token.category === 'typography') {
      return this.isSignificantTypographyChange(token.oldValue, token.newValue);
    }
    
    return false;
  }
  
  /**
   * Check if color change is significant
   */
  private static isSignificantColorChange(oldColor: any, newColor: any): boolean {
    // Simplified check - in reality, you'd want to use color distance algorithms
    return oldColor !== newColor;
  }
  
  /**
   * Check if spacing change is significant
   */
  private static isSignificantSpacingChange(oldSpacing: any, newSpacing: any): boolean {
    // Extract numeric values
    const oldNum = parseFloat(String(oldSpacing).replace(/[^\d.-]/g, ''));
    const newNum = parseFloat(String(newSpacing).replace(/[^\d.-]/g, ''));
    
    if (isNaN(oldNum) || isNaN(newNum)) return true;
    
    // More than 20% change is significant
    const changePercent = Math.abs((newNum - oldNum) / oldNum);
    return changePercent > 0.2;
  }
  
  /**
   * Check if typography change is significant
   */
  private static isSignificantTypographyChange(oldValue: any, newValue: any): boolean {
    // Font family changes are always significant
    // Size changes > 20% are significant
    return oldValue !== newValue;
  }
  
  /**
   * Assess effort required for removal
   */
  private static assessRemovalEffort(token: TokenChange): EffortLevel {
    if (token.type === 'primitive' && ['colors', 'spacing'].includes(token.category)) {
      return 'high';
    }
    return 'medium';
  }
  
  /**
   * Assess effort required for rename
   */
  private static assessRenameEffort(rename: TokenRename): EffortLevel {
    return 'minimal'; // Renames are automatable
  }
  
  /**
   * Assess effort required for value change
   */
  private static assessValueChangeEffort(token: TokenChange): EffortLevel {
    if (token.category === 'colors') return 'high'; // Need visual testing
    if (token.category === 'spacing') return 'medium'; // Need layout testing
    return 'low';
  }
  
  /**
   * Generate migration instructions for removal
   */
  private static generateRemovalMigration(token: TokenChange): string {
    return `Token '${token.path}' has been removed. Find a suitable replacement or use a hardcoded value temporarily.`;
  }
  
  /**
   * Generate migration instructions for rename
   */
  private static generateRenameMigration(rename: TokenRename): string {
    return `Replace all instances of '${rename.oldPath}' with '${rename.newPath}'.`;
  }
  
  /**
   * Generate migration instructions for value change
   */
  private static generateValueChangeMigration(token: TokenChange): string {
    return `Token '${token.path}' value changed from '${token.oldValue}' to '${token.newValue}'. Review visual impact and test thoroughly.`;
  }
  
  /**
   * Summarize all changes
   */
  private static summarizeChanges(diff: TokenDiff, breakingChanges: BreakingChange[]) {
    const totalChanges = diff.added.length + diff.removed.length + diff.modified.length + diff.renamed.length;
    const breakingCount = breakingChanges.length;
    
    // Calculate overall impact
    const impacts = breakingChanges.map(c => c.impact);
    const impactLevel: ImpactLevel = impacts.includes('critical') ? 'critical' :
                                    impacts.includes('high') ? 'high' :
                                    impacts.includes('medium') ? 'medium' : 'low';
    
    // Calculate overall effort
    const efforts = breakingChanges.map(c => c.estimatedEffort);
    const estimatedEffort: EffortLevel = efforts.includes('extensive') ? 'extensive' :
                                        efforts.includes('high') ? 'high' :
                                        efforts.includes('medium') ? 'medium' :
                                        efforts.includes('low') ? 'low' : 'minimal';
    
    return {
      totalChanges,
      breakingCount,
      impactLevel,
      estimatedEffort
    };
  }
  
  /**
   * Generate recommendations based on analysis
   */
  private static generateRecommendations(changes: BreakingChange[], summary: any): string[] {
    const recommendations: string[] = [];
    
    if (summary.breakingCount === 0) {
      recommendations.push('✅ No breaking changes detected. This is a safe upgrade.');
    } else {
      recommendations.push(`⚠️  ${summary.breakingCount} breaking changes detected.`);
    }
    
    if (summary.impactLevel === 'critical' || summary.impactLevel === 'high') {
      recommendations.push('🔴 High impact changes require careful testing and gradual rollout.');
    }
    
    if (summary.estimatedEffort === 'extensive' || summary.estimatedEffort === 'high') {
      recommendations.push('⏰ Significant migration effort required. Plan accordingly.');
    }
    
    const automatableChanges = changes.filter(c => c.automatable).length;
    if (automatableChanges > 0) {
      recommendations.push(`🤖 ${automatableChanges} changes can be automated with migration scripts.`);
    }
    
    const manualChanges = changes.filter(c => !c.automatable).length;
    if (manualChanges > 0) {
      recommendations.push(`👨‍💻 ${manualChanges} changes require manual review and testing.`);
    }
    
    return recommendations;
  }
}