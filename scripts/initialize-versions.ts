#!/usr/bin/env tsx

/**
 * Initialize Design Token Versions
 * 
 * Creates initial version archive from the current state:
 * - v1.0.0 from legacy globals.css system
 * - v2.0.0 from current YAML system 
 * - v2.1.0-dev as active development
 */

import { promises as fs } from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { VersionMetadataManager } from '../design-tokens/lib/version-metadata';
import type { VersionMetadata } from '../design-tokens/lib/version-metadata';

class VersionInitializer {
  private rootDir: string;
  private tokensDir: string;
  private versionsDir: string;
  private activeDir: string;

  constructor() {
    this.rootDir = process.cwd();
    this.tokensDir = path.join(this.rootDir, 'design-tokens');
    this.versionsDir = path.join(this.tokensDir, 'versions');
    this.activeDir = path.join(this.tokensDir, 'active');
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing design token versions...\n');

    // Ensure directories exist
    await fs.mkdir(this.versionsDir, { recursive: true });
    await fs.mkdir(this.activeDir, { recursive: true });

    // Create v1.0.0 from legacy CSS system
    await this.createV1();

    // Create v2.0.0 from current YAML system
    await this.createV2();

    // Set up active development as v2.1.0-dev
    await this.setupActiveDevelopment();

    console.log('\n✅ Version initialization complete!');
    console.log('\nVersions created:');
    console.log('  📁 v1.0.0 - Legacy CSS-based system');
    console.log('  📁 v2.0.0 - YAML-based system (current)');
    console.log('  🚧 v2.1.0-dev - Active development');
    console.log('\nUse `npm run version:list` to see all versions');
  }

  /**
   * Create v1.0.0 from legacy globals.css
   */
  private async createV1(): Promise<void> {
    console.log('📦 Creating v1.0.0 from legacy CSS system...');

    const v1Dir = path.join(this.versionsDir, 'v1.0.0');
    await fs.mkdir(v1Dir, { recursive: true });
    await fs.mkdir(path.join(v1Dir, 'tokens'), { recursive: true });
    await fs.mkdir(path.join(v1Dir, 'build'), { recursive: true });
    await fs.mkdir(path.join(v1Dir, 'migration'), { recursive: true });

    // Extract tokens from globals.css and convert to YAML
    const legacyTokens = await this.extractLegacyTokens();
    await this.saveLegacyTokensAsYaml(path.join(v1Dir, 'tokens'), legacyTokens);

    // Copy original globals.css to build directory
    const globalsPath = path.join(this.rootDir, 'app', 'globals.css');
    await fs.copyFile(globalsPath, path.join(v1Dir, 'build', 'tokens.css'));

    // Create v1 metadata
    const v1Metadata = VersionMetadataManager.createMetadata('1.0.0', {
      name: 'Legacy CSS Design Tokens v1.0.0',
      description: 'Original CSS custom properties system',
      status: 'archived',
      releaseDate: '2024-01-01T00:00:00.000Z', // Placeholder date
      compatibility: {
        upgradeFrom: [],
        downgradeTo: [],
        migrationPaths: ['2.0.0'],
        platforms: {
          css: true,
          scss: false,
          javascript: false,
          typescript: false,
          tailwind: true
        },
        tools: {
          buildScript: 'manual',
          validationScript: 'none'
        }
      },
      build: {
        timestamp: '2024-01-01T00:00:00.000Z',
        builder: 'manual-extraction',
        environment: 'legacy',
        config: {
          platforms: ['css'],
          optimization: false,
          validation: false
        },
        outputs: {
          'tokens.css': {
            file: 'tokens.css',
            size: (await fs.stat(globalsPath)).size,
            hash: 'legacy-css-tokens'
          }
        },
        stats: {
          totalTokens: Object.keys(this.flattenTokens(legacyTokens)).length,
          newTokens: 0,
          changedTokens: 0,
          removedTokens: 0,
          buildTime: 0
        }
      }
    });

    await this.saveVersionMetadata(v1Dir, v1Metadata);

    // Create migration guide to v2.0.0
    await this.createV1ToV2MigrationGuide(v1Dir);
    
    console.log('   ✓ v1.0.0 created');
  }

  /**
   * Create v2.0.0 from current YAML system
   */
  private async createV2(): Promise<void> {
    console.log('📦 Creating v2.0.0 from current YAML system...');

    const v2Dir = path.join(this.versionsDir, 'v2.0.0');
    await fs.mkdir(v2Dir, { recursive: true });
    await fs.mkdir(path.join(v2Dir, 'tokens'), { recursive: true });
    await fs.mkdir(path.join(v2Dir, 'build'), { recursive: true });
    await fs.mkdir(path.join(v2Dir, 'migration'), { recursive: true });

    // Copy current YAML source files
    const sourceDir = path.join(this.tokensDir, 'source');
    await this.copyDir(sourceDir, path.join(v2Dir, 'tokens'));

    // Copy current generated files
    const generatedDir = path.join(this.rootDir, 'generated');
    if (await this.exists(generatedDir)) {
      await this.copyDir(generatedDir, path.join(v2Dir, 'build'));
    }

    // Load current tokens for metadata
    const currentTokens = await this.loadTokensFromDir(sourceDir);

    // Create v2 metadata
    const v2Metadata = VersionMetadataManager.createMetadata('2.0.0', {
      name: 'YAML Design Tokens v2.0.0',
      description: 'YAML-based design token system with Apple-inspired monochrome palette',
      status: 'stable',
      releaseDate: new Date().toISOString(),
      compatibility: {
        upgradeFrom: ['1.0.0'],
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
      },
      build: {
        timestamp: new Date().toISOString(),
        builder: 'style-dictionary',
        environment: 'production',
        config: {
          platforms: ['css', 'scss', 'javascript', 'typescript', 'tailwind'],
          optimization: true,
          validation: true
        },
        outputs: await this.getBuildOutputs(path.join(v2Dir, 'build')),
        stats: {
          totalTokens: Object.keys(this.flattenTokens(currentTokens)).length,
          newTokens: 0,
          changedTokens: 0,
          removedTokens: 0,
          buildTime: 0
        }
      }
    });

    await this.saveVersionMetadata(v2Dir, v2Metadata);
    
    console.log('   ✓ v2.0.0 created');
  }

  /**
   * Set up active development as v2.1.0-dev
   */
  private async setupActiveDevelopment(): Promise<void> {
    console.log('🚧 Setting up active development v2.1.0-dev...');

    // Create active directory structure
    await fs.mkdir(path.join(this.activeDir, 'source'), { recursive: true });
    await fs.mkdir(path.join(this.activeDir, 'build'), { recursive: true });

    // Copy current source files to active
    const sourceDir = path.join(this.tokensDir, 'source');
    if (await this.exists(sourceDir)) {
      await this.copyDir(sourceDir, path.join(this.activeDir, 'source'));
    }

    // Create active metadata
    const activeMetadata = VersionMetadataManager.createMetadata('2.1.0-dev', {
      name: 'Active Development v2.1.0-dev',
      description: 'Active development version for design tokens',
      status: 'development',
      compatibility: {
        upgradeFrom: ['2.0.0'],
        downgradeTo: ['2.0.0'],
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
      }
    });

    await this.saveVersionMetadata(this.activeDir, activeMetadata);

    // Create development changelog
    await this.createDevelopmentChangelog();
    
    console.log('   ✓ Active development set up');
  }

  /**
   * Extract design tokens from globals.css
   */
  private async extractLegacyTokens(): Promise<Record<string, any>> {
    const globalsPath = path.join(this.rootDir, 'app', 'globals.css');
    const cssContent = await fs.readFile(globalsPath, 'utf-8');

    const tokens: Record<string, any> = {
      colors: {
        legacy: {},
        brand: {},
        neutral: {},
        functional: {}
      },
      spacing: {},
      typography: {},
      animations: {}
    };

    // Extract CSS custom properties
    const customPropRegex = /--([^:]+):\s*([^;]+);/g;
    let match;

    while ((match = customPropRegex.exec(cssContent)) !== null) {
      const [, name, value] = match;
      const cleanName = name.trim();
      const cleanValue = value.trim();

      // Categorize tokens based on name patterns
      if (cleanName.includes('color') || cleanName.includes('purple') || cleanName.includes('violet') || 
          cleanName.includes('indigo') || cleanName.includes('cyan') || cleanName.includes('blue') ||
          cleanName.includes('pink') || cleanName.includes('gray') || cleanName.includes('black') ||
          cleanName.includes('white') || cleanName.includes('success') || cleanName.includes('error') ||
          cleanName.includes('warning') || cleanName.includes('info')) {
        
        if (cleanName.startsWith('cosmic-') || cleanName.startsWith('electric-') || cleanName.startsWith('luminous-')) {
          tokens.colors.legacy[cleanName] = { value: cleanValue, comment: 'Legacy V1 color token' };
        } else if (cleanName.startsWith('vergil-')) {
          tokens.colors.brand[cleanName.replace('vergil-', '')] = { value: cleanValue, comment: 'Brand color token' };
        } else if (cleanName.includes('gray') || cleanName.includes('black') || cleanName.includes('white')) {
          tokens.colors.neutral[cleanName] = { value: cleanValue, comment: 'Neutral color token' };
        } else if (cleanName.includes('success') || cleanName.includes('error') || cleanName.includes('warning') || cleanName.includes('info')) {
          tokens.colors.functional[cleanName] = { value: cleanValue, comment: 'Functional color token' };
        }
      } else if (cleanName.includes('font')) {
        tokens.typography[cleanName] = { value: cleanValue, comment: 'Typography token' };
      } else if (cleanName.includes('ease') || cleanName.includes('duration')) {
        tokens.animations[cleanName] = { value: cleanValue, comment: 'Animation token' };
      } else if (cleanName.includes('radius') || cleanName.includes('spacing')) {
        tokens.spacing[cleanName] = { value: cleanValue, comment: 'Spacing token' };
      }
    }

    return tokens;
  }

  /**
   * Save legacy tokens as YAML files
   */
  private async saveLegacyTokensAsYaml(tokensDir: string, tokens: Record<string, any>): Promise<void> {
    // Main tokens file
    const mainTokens = {
      tokens: {
        version: '1.0.0',
        description: 'Legacy CSS design tokens converted to YAML',
        ...tokens
      }
    };

    await fs.writeFile(
      path.join(tokensDir, 'tokens.yaml'),
      yaml.dump(mainTokens, { indent: 2 })
    );

    // Separate category files
    for (const [category, categoryTokens] of Object.entries(tokens)) {
      if (Object.keys(categoryTokens).length > 0) {
        const categoryData = { [category]: categoryTokens };
        await fs.writeFile(
          path.join(tokensDir, `${category}.yaml`),
          yaml.dump(categoryData, { indent: 2 })
        );
      }
    }
  }

  /**
   * Create migration guide from v1 to v2
   */
  private async createV1ToV2MigrationGuide(v1Dir: string): Promise<void> {
    const migrationGuide = `# Migration Guide: v1.0.0 → v2.0.0

## Overview

This migration moves from the legacy CSS custom properties system to the new YAML-based design token system with improved organization and Apple-inspired design language.

## Major Changes

### 🎨 Color System Overhaul

**Brand Colors Updated:**
- \`cosmic-purple\` (#6366F1) → \`vergil-purple\` (#7B00FF)
- \`electric-violet\` (#A78BFA) → \`vergil-purple-light\` (#9933FF)
- \`luminous-indigo\` (#818CF8) → \`vergil-purple-lighter\` (#BB66FF)

**New Monochrome Palette:**
- Added \`vergil-off-black\` (#1D1D1F) - primary text
- Added \`vergil-off-white\` (#F5F5F7) - light text/containers
- Subtle attention hierarchy with emphasis colors

### 🏗️ Token Organization

**Old Structure (CSS):**
\`\`\`css
:root {
  --cosmic-purple: #6366F1;
  --electric-violet: #A78BFA;
}
\`\`\`

**New Structure (YAML):**
\`\`\`yaml
colors:
  brand:
    purple:
      value: "#7B00FF"
      comment: "Primary brand purple"
  legacy:
    cosmic-purple:
      value: "#6366F1"
      deprecated: true
\`\`\`

## Migration Steps

### 1. Update Dependencies
\`\`\`bash
npm install
npm run build:tokens
\`\`\`

### 2. Replace Color References

**CSS/SCSS:**
\`\`\`diff
- background: var(--cosmic-purple);
+ background: var(--color-vergil-purple);
\`\`\`

**Tailwind Classes:**
\`\`\`diff
- bg-cosmic-purple
+ bg-vergil-purple
\`\`\`

### 3. Update Component Styles

The new system provides semantic tokens for better maintainability:

\`\`\`diff
- color: var(--cosmic-purple);
+ color: var(--color-interactive-primary);
\`\`\`

### 4. Test Thoroughly

- [ ] Visual regression testing
- [ ] Component library builds correctly
- [ ] No console errors for missing tokens
- [ ] Accessibility contrast still meets standards

## Breaking Changes

1. **Primary purple changed** from #6366F1 to #7B00FF
2. **Token naming convention** now uses semantic structure
3. **Build process** now requires \`npm run build:tokens\`
4. **Legacy tokens deprecated** (available but will be removed in v3.0.0)

## Compatibility

Legacy tokens are still available with deprecation warnings:
- \`cosmic-purple\` → use \`vergil-purple\`
- \`electric-violet\` → use \`vergil-purple-light\`
- \`luminous-indigo\` → use \`vergil-purple-lighter\`

## Support

For help with this migration:
- Check the design token documentation
- Run \`npm run validate-tokens\` to check for issues
- Use \`npm run scan:hardcoded\` to find remaining hardcoded values

Generated: ${new Date().toISOString()}
`;

    await fs.writeFile(path.join(v1Dir, 'migration', 'guide.md'), migrationGuide);
  }

  /**
   * Create development changelog
   */
  private async createDevelopmentChangelog(): Promise<void> {
    const changelog = `# Development Changelog

## v2.1.0-dev (Active Development)

### In Progress
- Version management system implementation
- Enhanced token validation
- Migration automation tools

### Planned
- [ ] Token usage analytics
- [ ] Figma design token sync
- [ ] Advanced color contrast validation
- [ ] Automatic semantic token generation

### Guidelines

When working on this development version:

1. **Follow semantic versioning** for all changes
2. **Update this changelog** with significant changes
3. **Run validation** before committing: \`npm run validate-tokens\`
4. **Test breaking changes** thoroughly before version creation
5. **Document migrations** for any breaking changes

### Development Commands

\`\`\`bash
# Build and test tokens
npm run build:tokens
npm run validate-tokens

# Check for hardcoded values
npm run scan:hardcoded

# Generate reports
npm run report:coverage
npm run report:all

# Version management
npm run version:create --version 2.1.0
npm run version:list
npm run version:diff 2.0.0 active
\`\`\`

Last updated: ${new Date().toISOString()}
`;

    await fs.writeFile(path.join(this.activeDir, 'CHANGELOG.md'), changelog);
  }

  // Helper methods

  private async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  private async loadTokensFromDir(tokensDir: string): Promise<Record<string, any>> {
    const tokens: Record<string, any> = {};
    
    try {
      const files = await fs.readdir(tokensDir);
      
      for (const file of files) {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filePath = path.join(tokensDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = yaml.load(content) as Record<string, any>;
          Object.assign(tokens, data);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not load tokens from ${tokensDir}`);
    }

    return tokens;
  }

  private flattenTokens(tokens: Record<string, any>, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(tokens)) {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !('value' in value)) {
        Object.assign(result, this.flattenTokens(value, path));
      } else {
        result[path] = value;
      }
    }
    
    return result;
  }

  private async getBuildOutputs(buildDir: string): Promise<Record<string, any>> {
    const outputs: Record<string, any> = {};
    
    try {
      if (await this.exists(buildDir)) {
        const files = await fs.readdir(buildDir);
        
        for (const file of files) {
          const filePath = path.join(buildDir, file);
          const stats = await fs.stat(filePath);
          outputs[file] = {
            file,
            size: stats.size,
            hash: `sha256-${Date.now()}` // Placeholder
          };
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read build outputs from ${buildDir}`);
    }

    return outputs;
  }

  private async saveVersionMetadata(versionDir: string, metadata: VersionMetadata): Promise<void> {
    const metadataPath = path.join(versionDir, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }
}

// CLI entry point
async function main() {
  try {
    const initializer = new VersionInitializer();
    await initializer.initialize();
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { VersionInitializer };