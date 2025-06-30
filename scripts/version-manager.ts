#!/usr/bin/env tsx

/**
 * Design Token Version Manager
 * 
 * CLI tool for managing design token versions, creating archives,
 * detecting breaking changes, and handling migrations.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as yaml from 'js-yaml';
import type { VersionMetadata } from '../design-tokens/lib/version-metadata';
import { VersionMetadataManager } from '../design-tokens/lib/version-metadata';
import { BreakingChangeDetector } from '../design-tokens/lib/breaking-change-detector';

interface VersionManagerOptions {
  command: string;
  version?: string;
  fromVersion?: string;
  toVersion?: string;
  force?: boolean;
  dryRun?: boolean;
}

class VersionManager {
  private rootDir: string;
  private tokensDir: string;
  private versionsDir: string;
  private activeDir: string;
  private migrationDir: string;

  constructor() {
    this.rootDir = process.cwd();
    this.tokensDir = path.join(this.rootDir, 'design-tokens');
    this.versionsDir = path.join(this.tokensDir, 'versions');
    this.activeDir = path.join(this.tokensDir, 'active');
    this.migrationDir = path.join(this.tokensDir, 'migration');
  }

  async run(options: VersionManagerOptions): Promise<void> {
    try {
      switch (options.command) {
        case 'create':
          await this.createVersion(options.version, options);
          break;
        case 'list':
          await this.listVersions();
          break;
        case 'activate':
          await this.activateVersion(options.version!, options);
          break;
        case 'diff':
          await this.diffVersions(options.fromVersion!, options.toVersion!, options);
          break;
        case 'check-breaking':
          await this.checkBreaking(options.fromVersion!, options.toVersion!, options);
          break;
        case 'info':
          await this.versionInfo(options.version!);
          break;
        default:
          this.showHelp();
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Create a new version from active development
   */
  async createVersion(version: string | undefined, options: VersionManagerOptions): Promise<void> {
    if (!version) {
      version = await this.promptForVersion();
    }

    console.log(`🚀 Creating version ${version}...`);

    // Validate version format
    try {
      VersionMetadataManager.parseSemver(version);
    } catch (error) {
      throw new Error(`Invalid version format: ${version}. Use semver format (e.g., 2.1.0)`);
    }

    // Check if version already exists
    const versionDir = path.join(this.versionsDir, `v${version}`);
    if (await this.exists(versionDir)) {
      if (!options.force) {
        throw new Error(`Version ${version} already exists. Use --force to overwrite.`);
      }
      console.log(`⚠️  Overwriting existing version ${version}`);
      await fs.rm(versionDir, { recursive: true });
    }

    // Validate active tokens
    console.log('🔍 Validating active tokens...');
    await this.validateTokens(this.activeDir);

    // Load active tokens
    const activeTokens = await this.loadTokens(path.join(this.activeDir, 'source'));
    
    // Detect breaking changes from previous version
    const previousVersion = await this.getLatestVersion();
    let breakingChanges = [];
    
    if (previousVersion) {
      console.log(`🔍 Checking for breaking changes from ${previousVersion}...`);
      const previousTokens = await this.loadTokens(path.join(this.versionsDir, `v${previousVersion}`, 'tokens'));
      const analysis = BreakingChangeDetector.analyzeChanges(
        previousTokens, 
        activeTokens, 
        previousVersion, 
        version
      );
      
      breakingChanges = analysis.breakingChanges;
      
      if (analysis.isBreaking) {
        console.log(`⚠️  ${analysis.breakingChanges.length} breaking changes detected:`);
        for (const change of analysis.breakingChanges) {
          console.log(`   • ${change.description} (${change.impact} impact)`);
        }
        
        if (!options.force) {
          const confirm = await this.promptConfirm('Continue with breaking changes?');
          if (!confirm) {
            console.log('❌ Version creation cancelled');
            return;
          }
        }
      } else {
        console.log('✅ No breaking changes detected');
      }
    }

    if (options.dryRun) {
      console.log('🏃 Dry run - no files will be created');
      return;
    }

    // Create version directory structure
    await fs.mkdir(versionDir, { recursive: true });
    await fs.mkdir(path.join(versionDir, 'tokens'), { recursive: true });
    await fs.mkdir(path.join(versionDir, 'build'), { recursive: true });
    await fs.mkdir(path.join(versionDir, 'migration'), { recursive: true });

    // Copy source tokens
    console.log('📋 Copying source tokens...');
    await this.copyDir(path.join(this.activeDir, 'source'), path.join(versionDir, 'tokens'));

    // Build all platform outputs
    console.log('🔨 Building platform outputs...');
    const buildOutputs = await this.buildTokens(path.join(versionDir, 'tokens'), path.join(versionDir, 'build'));

    // Create version metadata
    console.log('📝 Creating version metadata...');
    const metadata = VersionMetadataManager.createMetadata(version, {
      status: version.includes('-') ? 'beta' : 'stable',
      breakingChanges,
      build: {
        timestamp: new Date().toISOString(),
        builder: 'version-manager',
        environment: process.env.NODE_ENV || 'development',
        config: {
          platforms: ['css', 'scss', 'javascript', 'typescript', 'tailwind'],
          optimization: true,
          validation: true
        },
        outputs: buildOutputs,
        stats: await this.calculateBuildStats(activeTokens, previousVersion ? await this.loadTokens(path.join(this.versionsDir, `v${previousVersion}`, 'tokens')) : {})
      }
    });

    await this.saveVersionMetadata(versionDir, metadata);

    // Create migration guide if there are breaking changes
    if (breakingChanges.length > 0) {
      console.log('📖 Creating migration guide...');
      await this.createMigrationGuide(versionDir, previousVersion, version, breakingChanges);
    }

    // Update active development to next version
    console.log('🔄 Updating active development version...');
    await this.updateActiveVersion(version);

    console.log(`✅ Version ${version} created successfully!`);
    console.log(`📁 Location: ${versionDir}`);
    
    if (breakingChanges.length > 0) {
      console.log(`📖 Migration guide: ${path.join(versionDir, 'migration', 'guide.md')}`);
    }
  }

  /**
   * List all available versions
   */
  async listVersions(): Promise<void> {
    console.log('📋 Available versions:\n');

    const versions = await this.getAllVersions();
    
    if (versions.length === 0) {
      console.log('   No versions found');
      return;
    }

    for (const version of versions) {
      const versionDir = path.join(this.versionsDir, `v${version}`);
      const metadataPath = path.join(versionDir, 'metadata.json');
      
      if (await this.exists(metadataPath)) {
        const metadata: VersionMetadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
        const breaking = metadata.breakingChanges.length > 0 ? '⚠️ ' : '';
        const status = metadata.status === 'stable' ? '✅' : 
                      metadata.status === 'deprecated' ? '⚰️ ' : '🚧';
        
        console.log(`   ${status} ${breaking}v${version} - ${metadata.description}`);
        console.log(`      Released: ${new Date(metadata.releaseDate).toLocaleDateString()}`);
        console.log(`      Status: ${metadata.status}`);
        
        if (metadata.breakingChanges.length > 0) {
          console.log(`      Breaking changes: ${metadata.breakingChanges.length}`);
        }
        console.log('');
      } else {
        console.log(`   📁 v${version} (no metadata)`);
      }
    }
    
    const activeVersion = await this.getActiveVersion();
    console.log(`🚧 Active development: v${activeVersion}`);
  }

  /**
   * Activate a specific version for development
   */
  async activateVersion(version: string, options: VersionManagerOptions): Promise<void> {
    console.log(`🔄 Activating version ${version}...`);

    const versionDir = path.join(this.versionsDir, `v${version}`);
    if (!await this.exists(versionDir)) {
      throw new Error(`Version ${version} not found`);
    }

    if (!options.force) {
      const activeVersion = await this.getActiveVersion();
      const confirm = await this.promptConfirm(
        `This will replace the active development version (v${activeVersion}) with v${version}. Continue?`
      );
      if (!confirm) {
        console.log('❌ Activation cancelled');
        return;
      }
    }

    if (options.dryRun) {
      console.log('🏃 Dry run - no files will be modified');
      return;
    }

    // Backup current active
    const backupDir = path.join(this.activeDir, `backup-${Date.now()}`);
    console.log('💾 Backing up current active version...');
    await this.copyDir(this.activeDir, backupDir);

    // Clear current active (except backup)
    const activeContents = await fs.readdir(this.activeDir);
    for (const item of activeContents) {
      if (!item.startsWith('backup-')) {
        await fs.rm(path.join(this.activeDir, item), { recursive: true, force: true });
      }
    }

    // Copy version to active
    console.log('📋 Copying version to active...');
    await this.copyDir(path.join(versionDir, 'tokens'), path.join(this.activeDir, 'source'));
    
    // Update active metadata
    const versionMetadata: VersionMetadata = JSON.parse(
      await fs.readFile(path.join(versionDir, 'metadata.json'), 'utf-8')
    );
    
    const nextVersion = this.incrementVersion(version);
    const activeMetadata = VersionMetadataManager.createMetadata(`${nextVersion}-dev`, {
      status: 'development',
      description: `Active development based on v${version}`
    });

    await this.saveVersionMetadata(this.activeDir, activeMetadata);

    console.log(`✅ Version ${version} activated successfully!`);
    console.log(`🚧 Active development is now v${nextVersion}-dev`);
    console.log(`💾 Previous active backed up to: ${backupDir}`);
  }

  /**
   * Show diff between two versions
   */
  async diffVersions(fromVersion: string, toVersion: string, options: VersionManagerOptions): Promise<void> {
    console.log(`🔍 Comparing v${fromVersion} → v${toVersion}\n`);

    const fromTokens = await this.loadVersionTokens(fromVersion);
    const toTokens = await this.loadVersionTokens(toVersion);

    const diff = BreakingChangeDetector.analyzeChanges(fromTokens, toTokens, fromVersion, toVersion);

    // Summary
    console.log('📊 Summary:');
    console.log(`   Total changes: ${diff.summary.totalChanges}`);
    console.log(`   Breaking changes: ${diff.summary.breakingCount}`);
    console.log(`   Impact level: ${diff.summary.impactLevel}`);
    console.log(`   Estimated effort: ${diff.summary.estimatedEffort}\n`);

    // Breaking changes
    if (diff.breakingChanges.length > 0) {
      console.log('⚠️  Breaking Changes:');
      for (const change of diff.breakingChanges) {
        console.log(`   • ${change.description}`);
        console.log(`     Impact: ${change.impact} | Effort: ${change.estimatedEffort} | Auto: ${change.automatable ? 'Yes' : 'No'}`);
        console.log(`     Migration: ${change.migrationPath}`);
        console.log('');
      }
    }

    // Recommendations
    if (diff.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      for (const rec of diff.recommendations) {
        console.log(`   ${rec}`);
      }
    }
  }

  /**
   * Check for breaking changes between versions
   */
  async checkBreaking(fromVersion: string, toVersion: string, options: VersionManagerOptions): Promise<void> {
    console.log(`🔍 Checking for breaking changes: v${fromVersion} → v${toVersion}`);

    const fromTokens = await this.loadVersionTokens(fromVersion);
    const toTokens = await this.loadVersionTokens(toVersion);

    const analysis = BreakingChangeDetector.analyzeChanges(fromTokens, toTokens, fromVersion, toVersion);

    if (analysis.isBreaking) {
      console.log(`❌ Breaking changes detected (${analysis.breakingChanges.length})`);
      process.exit(1);
    } else {
      console.log('✅ No breaking changes detected');
      process.exit(0);
    }
  }

  /**
   * Show detailed information about a version
   */
  async versionInfo(version: string): Promise<void> {
    const versionDir = path.join(this.versionsDir, `v${version}`);
    const metadataPath = path.join(versionDir, 'metadata.json');

    if (!await this.exists(metadataPath)) {
      throw new Error(`Version ${version} not found or has no metadata`);
    }

    const metadata: VersionMetadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));

    console.log(`📋 Version ${version} Information\n`);
    console.log(`Name: ${metadata.name}`);
    console.log(`Description: ${metadata.description}`);
    console.log(`Status: ${metadata.status}`);
    console.log(`Released: ${new Date(metadata.releaseDate).toLocaleDateString()}`);
    console.log(`Semver: ${metadata.semver.major}.${metadata.semver.minor}.${metadata.semver.patch}`);
    
    if (metadata.semver.prerelease) {
      console.log(`Prerelease: ${metadata.semver.prerelease}`);
    }

    console.log('\n📊 Build Statistics:');
    console.log(`   Total tokens: ${metadata.build.stats.totalTokens}`);
    console.log(`   New tokens: ${metadata.build.stats.newTokens}`);
    console.log(`   Changed tokens: ${metadata.build.stats.changedTokens}`);
    console.log(`   Removed tokens: ${metadata.build.stats.removedTokens}`);
    console.log(`   Build time: ${metadata.build.stats.buildTime}ms`);

    if (metadata.breakingChanges.length > 0) {
      console.log('\n⚠️  Breaking Changes:');
      for (const change of metadata.breakingChanges) {
        console.log(`   • ${change.description} (${change.impact} impact)`);
      }
    }

    console.log('\n🔗 Compatibility:');
    console.log(`   Can upgrade from: ${metadata.compatibility.upgradeFrom.join(', ') || 'None'}`);
    console.log(`   Can downgrade to: ${metadata.compatibility.downgradeTo.join(', ') || 'None'}`);
    console.log(`   Migration paths: ${metadata.compatibility.migrationPaths.join(', ') || 'None'}`);
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

  private async loadTokens(tokensDir: string): Promise<Record<string, any>> {
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
      throw new Error(`Failed to load tokens from ${tokensDir}: ${error.message}`);
    }

    return tokens;
  }

  private async loadVersionTokens(version: string): Promise<Record<string, any>> {
    // Handle active version
    if (version === 'active') {
      return this.loadTokens(path.join(this.activeDir, 'source'));
    }

    const versionDir = path.join(this.versionsDir, `v${version}`);
    if (!await this.exists(versionDir)) {
      throw new Error(`Version ${version} not found`);
    }

    return this.loadTokens(path.join(versionDir, 'tokens'));
  }

  private async validateTokens(tokensDir: string): Promise<void> {
    try {
      // Run existing validation script
      execSync('npm run validate-tokens', { 
        cwd: this.rootDir,
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error('Token validation failed. Fix errors before creating version.');
    }
  }

  private async buildTokens(sourceDir: string, outputDir: string): Promise<Record<string, any>> {
    // Build all platform outputs
    try {
      execSync('npm run build:tokens', {
        cwd: this.rootDir,
        stdio: 'pipe'
      });

      // Copy generated files to version output
      const generatedDir = path.join(this.rootDir, 'generated');
      await this.copyDir(generatedDir, outputDir);

      // Return output metadata
      const outputs: Record<string, any> = {};
      const files = await fs.readdir(outputDir);
      
      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const stats = await fs.stat(filePath);
        outputs[file] = {
          file,
          size: stats.size,
          hash: 'sha256-placeholder' // In real implementation, calculate actual hash
        };
      }

      return outputs;
    } catch (error) {
      throw new Error(`Token build failed: ${error.message}`);
    }
  }

  private async calculateBuildStats(currentTokens: Record<string, any>, previousTokens: Record<string, any>) {
    // Simplified stats calculation
    const currentFlat = this.flattenObject(currentTokens);
    const previousFlat = this.flattenObject(previousTokens);

    const currentKeys = new Set(Object.keys(currentFlat));
    const previousKeys = new Set(Object.keys(previousFlat));

    const newTokens = [...currentKeys].filter(k => !previousKeys.has(k)).length;
    const removedTokens = [...previousKeys].filter(k => !currentKeys.has(k)).length;
    const changedTokens = [...currentKeys].filter(k => 
      previousKeys.has(k) && currentFlat[k] !== previousFlat[k]
    ).length;

    return {
      totalTokens: currentKeys.size,
      newTokens,
      changedTokens,
      removedTokens,
      buildTime: Date.now() // Placeholder
    };
  }

  private flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, this.flattenObject(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
    
    return result;
  }

  private async saveVersionMetadata(versionDir: string, metadata: VersionMetadata): Promise<void> {
    const metadataPath = path.join(versionDir, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  private async createMigrationGuide(
    versionDir: string, 
    fromVersion: string | null, 
    toVersion: string, 
    breakingChanges: any[]
  ): Promise<void> {
    const migrationDir = path.join(versionDir, 'migration');
    await fs.mkdir(migrationDir, { recursive: true });

    const guide = this.generateMigrationGuide(fromVersion, toVersion, breakingChanges);
    await fs.writeFile(path.join(migrationDir, 'guide.md'), guide);
  }

  private generateMigrationGuide(fromVersion: string | null, toVersion: string, breakingChanges: any[]): string {
    return `# Migration Guide: v${fromVersion || 'previous'} → v${toVersion}

## Overview

This guide helps you migrate from ${fromVersion ? `v${fromVersion}` : 'the previous version'} to v${toVersion}.

## Breaking Changes

${breakingChanges.length === 0 ? 'No breaking changes in this release.' : breakingChanges.map(change => `
### ${change.description}

**Impact:** ${change.impact}  
**Effort:** ${change.estimatedEffort}  
**Automatable:** ${change.automatable ? 'Yes' : 'No'}

**Migration:** ${change.migrationPath}

${change.token ? `**Token:** \`${change.token}\`` : ''}
${change.oldValue ? `**Old Value:** \`${change.oldValue}\`` : ''}
${change.newValue ? `**New Value:** \`${change.newValue}\`` : ''}
`).join('\n')}

## Migration Steps

1. **Backup your current setup**
2. **Update design token dependencies**
3. **Run automated migrations** (if available)
4. **Manual updates** for non-automatable changes
5. **Test thoroughly** - visual regression testing recommended
6. **Update documentation** to reflect changes

## Testing Checklist

- [ ] All components render correctly
- [ ] No console errors related to missing tokens
- [ ] Visual appearance matches expectations
- [ ] Accessibility requirements still met
- [ ] Performance impact is acceptable

## Support

If you need help with this migration:
- Check the [Design System Documentation]
- Create an issue in the repository
- Contact the design system team

Generated on ${new Date().toISOString()}
`;
  }

  private async updateActiveVersion(createdVersion: string): Promise<void> {
    const nextVersion = this.incrementVersion(createdVersion);
    const activeMetadata = VersionMetadataManager.createMetadata(`${nextVersion}-dev`, {
      status: 'development',
      description: `Active development after v${createdVersion}`
    });

    await this.saveVersionMetadata(this.activeDir, activeMetadata);
  }

  private incrementVersion(version: string): string {
    const semver = VersionMetadataManager.parseSemver(version);
    return `${semver.major}.${semver.minor}.${semver.patch + 1}`;
  }

  private async getAllVersions(): Promise<string[]> {
    try {
      const dirs = await fs.readdir(this.versionsDir);
      return dirs
        .filter(dir => dir.startsWith('v'))
        .map(dir => dir.substring(1))
        .sort((a, b) => {
          const aVer = VersionMetadataManager.parseSemver(a);
          const bVer = VersionMetadataManager.parseSemver(b);
          
          if (aVer.major !== bVer.major) return bVer.major - aVer.major;
          if (aVer.minor !== bVer.minor) return bVer.minor - aVer.minor;
          return bVer.patch - aVer.patch;
        });
    } catch {
      return [];
    }
  }

  private async getLatestVersion(): Promise<string | null> {
    const versions = await this.getAllVersions();
    return versions[0] || null;
  }

  private async getActiveVersion(): Promise<string> {
    try {
      const metadataPath = path.join(this.activeDir, 'metadata.json');
      const metadata: VersionMetadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
      return metadata.version;
    } catch {
      return 'unknown';
    }
  }

  private async promptForVersion(): Promise<string> {
    // In a real implementation, use a proper CLI prompt library
    console.log('Please provide a version number (e.g., 2.1.0):');
    throw new Error('Interactive version prompting not implemented. Use --version flag.');
  }

  private async promptConfirm(message: string): Promise<boolean> {
    // In a real implementation, use a proper CLI prompt library
    console.log(`${message} (y/N):`);
    return false; // Default to false for safety
  }

  private showHelp(): void {
    console.log(`
Design Token Version Manager

Usage:
  npm run version:create [--version 2.1.0] [--force] [--dry-run]
  npm run version:list
  npm run version:activate <version> [--force] [--dry-run]
  npm run version:diff <from-version> <to-version>
  npm run version:check-breaking <from-version> <to-version>
  npm run version:info <version>

Commands:
  create              Create new version from active development
  list                List all available versions
  activate            Activate a specific version for development  
  diff                Show differences between two versions
  check-breaking      Check for breaking changes (exits 1 if found)
  info                Show detailed version information

Options:
  --version           Specify version number for create command
  --force             Force operation without confirmation
  --dry-run           Show what would be done without making changes

Examples:
  npm run version:create --version 2.1.0
  npm run version:diff 2.0.0 2.1.0
  npm run version:activate 2.0.0 --force
`);
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const options: VersionManagerOptions = {
    command: args[0] || 'help'
  };

  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--version' && args[i + 1]) {
      options.version = args[++i];
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (!arg.startsWith('--')) {
      // Positional arguments
      if (!options.version) {
        options.version = arg;
      } else if (!options.fromVersion) {
        options.fromVersion = arg;
      } else if (!options.toVersion) {
        options.toVersion = arg;
      }
    }
  }

  // Handle commands that need different argument patterns
  if (options.command === 'diff' || options.command === 'check-breaking') {
    if (!options.fromVersion || !options.toVersion) {
      if (options.version && args[2]) {
        options.fromVersion = options.version;
        options.toVersion = args[2];
        delete options.version;
      } else {
        console.error(`❌ ${options.command} requires two version arguments`);
        process.exit(1);
      }
    }
  }

  const manager = new VersionManager();
  await manager.run(options);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { VersionManager };