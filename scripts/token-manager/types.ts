/**
 * Token Management System - Core Types
 * Unified interfaces for design token management
 */

// Base token types
export type TokenValueType = 'color' | 'spacing' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'shadow' | 'borderRadius' | 'animation' | 'timing' | 'custom';

export type TokenCategory = 'colors' | 'spacing' | 'typography' | 'shadows' | 'borders' | 'animations' | 'layout' | 'semantic';

export interface TokenValue {
  value: string;
  type: TokenValueType;
  comment?: string;
  deprecated?: boolean;
  private?: boolean; // Internal use only
  semantic?: boolean; // Semantic token (references other tokens)
  references?: string[]; // What tokens this references
  usedBy?: string[]; // What tokens reference this
}

export interface TokenDefinition extends TokenValue {
  name: string;
  path: string;
  category: TokenCategory;
  cssVar: string;
  aliases?: string[]; // Alternative names
  examples?: string[]; // Usage examples
  accessibility?: AccessibilityInfo;
}

export interface AccessibilityInfo {
  contrastRatio?: number;
  wcagLevel?: 'AA' | 'AAA' | 'FAIL';
  backgroundColor?: string; // For contrast calculation
  foregroundColor?: string;
  usage?: string[]; // Where this should be used for accessibility
}

export interface TokenGroup {
  name: string;
  description?: string;
  tokens: TokenDefinition[];
  subgroups?: TokenGroup[];
}

export interface TokenRegistry {
  version: string;
  lastUpdated: string;
  categories: Record<TokenCategory, TokenGroup>;
  metadata: {
    totalTokens: number;
    deprecated: number;
    semantic: number;
  };
}

// Validation types
export interface ValidationRule {
  name: string;
  description: string;
  category: TokenCategory | 'all';
  severity: 'error' | 'warning' | 'info';
  check: (token: TokenDefinition, registry: TokenRegistry) => ValidationResult;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  suggestion?: string;
  autoFix?: () => TokenDefinition;
}

export interface ValidationReport {
  timestamp: string;
  totalTokens: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
  summary: {
    errorCount: number;
    warningCount: number;
    suggestionCount: number;
    coverage: number; // Percentage of tokens validated
  };
}

export interface ValidationIssue {
  tokenPath: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  line?: number;
  column?: number;
}

// Token operations
export interface TokenOperation {
  type: 'add' | 'update' | 'delete' | 'rename' | 'move';
  timestamp: string;
  tokenPath: string;
  oldValue?: TokenDefinition;
  newValue?: TokenDefinition;
  reason?: string;
}

export interface TokenTransaction {
  id: string;
  timestamp: string;
  operations: TokenOperation[];
  metadata: {
    user?: string;
    description: string;
    affectedFiles: string[];
    impactLevel: 'low' | 'medium' | 'high';
  };
}

// Search and filtering
export interface TokenSearchOptions {
  query?: string;
  category?: TokenCategory[];
  type?: TokenValueType[];
  deprecated?: boolean;
  semantic?: boolean;
  regex?: boolean;
  caseSensitive?: boolean;
}

export interface TokenSearchResult {
  tokens: TokenDefinition[];
  totalFound: number;
  categories: Record<TokenCategory, number>;
  types: Record<TokenValueType, number>;
}

// Export formats
export interface ExportOptions {
  format: 'css' | 'scss' | 'js' | 'ts' | 'json' | 'yaml' | 'tailwind';
  includeComments?: boolean;
  includeDeprecated?: boolean;
  prefix?: string;
  minify?: boolean;
  categories?: TokenCategory[];
}

export interface ExportResult {
  content: string;
  filename: string;
  format: string;
  metadata: {
    tokenCount: number;
    categories: TokenCategory[];
    timestamp: string;
  };
}

// Integration types
export interface IntegrationConfig {
  storybook: {
    enabled: boolean;
    hotReload: boolean;
    storiesPath: string;
  };
  git: {
    enabled: boolean;
    autoCommit: boolean;
    branchProtection: boolean;
  };
  build: {
    autoRebuild: boolean;
    outputFormats: ExportOptions['format'][];
    outputDir: string;
  };
}

// Editor types
export interface EditorSession {
  id: string;
  startTime: string;
  activeToken?: string;
  unsavedChanges: TokenOperation[];
  viewState: {
    category: TokenCategory;
    filter: TokenSearchOptions;
    sortBy: 'name' | 'category' | 'type' | 'lastModified';
    sortOrder: 'asc' | 'desc';
  };
}

export interface EditorAction {
  type: 'SELECT_TOKEN' | 'UPDATE_TOKEN' | 'CREATE_TOKEN' | 'DELETE_TOKEN' | 
        'FILTER_TOKENS' | 'SORT_TOKENS' | 'SAVE_CHANGES' | 'UNDO' | 'REDO';
  payload?: any;
  timestamp: string;
}

// CLI types
export interface CLICommand {
  name: string;
  description: string;
  options: CLIOption[];
  action: (args: any) => Promise<void>;
}

export interface CLIOption {
  name: string;
  alias?: string;
  description: string;
  type: 'string' | 'boolean' | 'number' | 'array';
  required?: boolean;
  default?: any;
  choices?: string[];
}

// Migration types
export interface MigrationPlan {
  from: string; // version or snapshot
  to: string;
  operations: MigrationOperation[];
  impact: {
    filesAffected: string[];
    tokensChanged: number;
    breakingChanges: number;
    estimatedEffort: 'low' | 'medium' | 'high';
  };
}

export interface MigrationOperation {
  type: 'rename' | 'update-value' | 'deprecate' | 'remove' | 'restructure';
  description: string;
  tokenPath: string;
  oldValue?: any;
  newValue?: any;
  breaking: boolean;
  autoFixable: boolean;
}