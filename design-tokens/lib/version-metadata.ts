/**
 * Design Token Version Metadata System
 * 
 * Defines the structure and validation for design token version metadata,
 * including breaking change detection and compatibility matrices.
 */

export interface VersionMetadata {
  version: string;
  name: string;
  description: string;
  releaseDate: string;
  status: VersionStatus;
  
  // Semantic versioning
  semver: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    build?: string;
  };
  
  // Breaking changes and compatibility
  breakingChanges: BreakingChange[];
  compatibility: CompatibilityMatrix;
  deprecations: Deprecation[];
  
  // Technical metadata
  build: BuildMetadata;
  sources: SourceMetadata;
  
  // Migration information
  migrations: {
    from: MigrationPath[];
    to: MigrationPath[];
  };
  
  // Validation and testing
  validation: ValidationMetadata;
}

export type VersionStatus = 
  | 'development'     // Active development version
  | 'alpha'          // Alpha release
  | 'beta'           // Beta release
  | 'rc'             // Release candidate
  | 'stable'         // Stable release
  | 'deprecated'     // Deprecated version
  | 'archived';      // Archived version

export interface BreakingChange {
  id: string;
  type: BreakingChangeType;
  description: string;
  impact: ImpactLevel;
  
  // What changed
  token?: string;
  oldValue?: any;
  newValue?: any;
  
  // Migration guidance
  migrationPath: string;
  automatable: boolean;
  
  // Impact analysis
  affectedFiles?: string[];
  estimatedEffort: EffortLevel;
}

export type BreakingChangeType =
  | 'token-removed'      // Token deleted
  | 'token-renamed'      // Token name changed
  | 'value-changed'      // Token value changed significantly
  | 'structure-changed'  // Token hierarchy changed
  | 'format-changed'     // Output format changed
  | 'build-changed';     // Build process changed

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';
export type EffortLevel = 'minimal' | 'low' | 'medium' | 'high' | 'extensive';

export interface CompatibilityMatrix {
  // Versions this can safely upgrade from
  upgradeFrom: string[];
  
  // Versions this can safely downgrade to
  downgradeTo: string[];
  
  // Versions with available migrations
  migrationPaths: string[];
  
  // Platform compatibility
  platforms: {
    css: boolean;
    scss: boolean;
    javascript: boolean;
    typescript: boolean;
    tailwind: boolean;
    figma?: boolean;
  };
  
  // Tool compatibility
  tools: {
    buildScript: string;
    validationScript: string;
    migrationScript?: string;
  };
}

export interface Deprecation {
  token: string;
  reason: string;
  replacement?: string;
  deprecatedIn: string;
  removedIn?: string;
  migrationGuide: string;
}

export interface BuildMetadata {
  timestamp: string;
  builder: string;
  environment: string;
  
  // Build configuration
  config: {
    platforms: string[];
    optimization: boolean;
    validation: boolean;
  };
  
  // Generated files
  outputs: {
    [platform: string]: {
      file: string;
      size: number;
      hash: string;
    };
  };
  
  // Build statistics
  stats: {
    totalTokens: number;
    newTokens: number;
    changedTokens: number;
    removedTokens: number;
    buildTime: number;
  };
}

export interface SourceMetadata {
  // Source files included in this version
  files: {
    [filename: string]: {
      path: string;
      hash: string;
      size: number;
      lastModified: string;
    };
  };
  
  // Token organization
  structure: {
    categories: string[];
    totalTokens: number;
    tokensByCategory: Record<string, number>;
  };
  
  // Source validation
  validation: {
    syntax: boolean;
    references: boolean;
    consistency: boolean;
    accessibility: boolean;
  };
}

export interface MigrationPath {
  version: string;
  type: MigrationType;
  available: boolean;
  automated: boolean;
  script?: string;
  guide: string;
  estimatedTime: string;
}

export type MigrationType = 'upgrade' | 'downgrade' | 'lateral';

export interface ValidationMetadata {
  // Validation results
  syntax: ValidationResult;
  references: ValidationResult;
  accessibility: ValidationResult;
  performance: ValidationResult;
  
  // Test coverage
  coverage: {
    tokens: number;
    platforms: number;
    components: number;
  };
  
  // Quality metrics
  quality: {
    score: number;
    criteria: QualityCriteria[];
  };
}

export interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  timestamp: string;
}

export interface ValidationError {
  code: string;
  message: string;
  token?: string;
  file?: string;
  line?: number;
}

export interface ValidationWarning {
  code: string;
  message: string;
  token?: string;
  file?: string;
  line?: number;
  suggestion?: string;
}

export interface QualityCriteria {
  name: string;
  score: number;
  weight: number;
  description: string;
}

/**
 * Utility functions for working with version metadata
 */
export class VersionMetadataManager {
  static createMetadata(version: string, options: Partial<VersionMetadata> = {}): VersionMetadata {
    const semver = this.parseSemver(version);
    const timestamp = new Date().toISOString();
    
    return {
      version,
      name: options.name || `Design Tokens v${version}`,
      description: options.description || `Design token release ${version}`,
      releaseDate: timestamp,
      status: options.status || 'development',
      
      semver,
      
      breakingChanges: options.breakingChanges || [],
      compatibility: options.compatibility || this.createDefaultCompatibility(),
      deprecations: options.deprecations || [],
      
      build: options.build || this.createDefaultBuild(timestamp),
      sources: options.sources || this.createDefaultSources(),
      
      migrations: options.migrations || { from: [], to: [] },
      validation: options.validation || this.createDefaultValidation(),
      
      ...options
    };
  }
  
  static parseSemver(version: string) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?(?:\+(.+))?$/);
    if (!match) {
      throw new Error(`Invalid semver format: ${version}`);
    }
    
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4] || undefined,
      build: match[5] || undefined
    };
  }
  
  static isBreakingChange(from: VersionMetadata, to: VersionMetadata): boolean {
    return to.semver.major > from.semver.major || to.breakingChanges.length > 0;
  }
  
  static canUpgrade(from: string, to: VersionMetadata): boolean {
    return to.compatibility.upgradeFrom.includes(from);
  }
  
  static canDowngrade(from: VersionMetadata, to: string): boolean {
    return from.compatibility.downgradeTo.includes(to);
  }
  
  static hasMigrationPath(from: string, to: VersionMetadata): boolean {
    return to.compatibility.migrationPaths.includes(from);
  }
  
  private static createDefaultCompatibility(): CompatibilityMatrix {
    return {
      upgradeFrom: [],
      downgradeTo: [],
      migrationPaths: [],
      platforms: {
        css: true,
        scss: true,
        javascript: true,
        typescript: true,
        tailwind: true
      },
      tools: {
        buildScript: 'npm run build:tokens',
        validationScript: 'npm run validate-tokens'
      }
    };
  }
  
  private static createDefaultBuild(timestamp: string): BuildMetadata {
    return {
      timestamp,
      builder: 'design-token-builder',
      environment: 'development',
      config: {
        platforms: ['css', 'scss', 'javascript', 'typescript', 'tailwind'],
        optimization: false,
        validation: true
      },
      outputs: {},
      stats: {
        totalTokens: 0,
        newTokens: 0,
        changedTokens: 0,
        removedTokens: 0,
        buildTime: 0
      }
    };
  }
  
  private static createDefaultSources(): SourceMetadata {
    return {
      files: {},
      structure: {
        categories: [],
        totalTokens: 0,
        tokensByCategory: {}
      },
      validation: {
        syntax: false,
        references: false,
        consistency: false,
        accessibility: false
      }
    };
  }
  
  private static createDefaultValidation(): ValidationMetadata {
    return {
      syntax: { passed: false, errors: [], warnings: [], timestamp: new Date().toISOString() },
      references: { passed: false, errors: [], warnings: [], timestamp: new Date().toISOString() },
      accessibility: { passed: false, errors: [], warnings: [], timestamp: new Date().toISOString() },
      performance: { passed: false, errors: [], warnings: [], timestamp: new Date().toISOString() },
      coverage: {
        tokens: 0,
        platforms: 0,
        components: 0
      },
      quality: {
        score: 0,
        criteria: []
      }
    };
  }
}