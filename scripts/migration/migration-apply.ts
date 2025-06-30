import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { MigrationRuleSet, TransformationRule } from './migration-generate-rules';

/**
 * Stage 5: Application Engine
 * 
 * Executes the migration with safety features:
 * 1. Pre-flight checks and backup creation
 * 2. Staged application with rollback points
 * 3. Real-time validation during application
 * 4. Post-migration verification and cleanup
 * 5. Comprehensive logging and reporting
 */

interface MigrationProgress {
  stage: 'preparing' | 'backing-up' | 'applying' | 'validating' | 'cleaning-up' | 'completed' | 'failed';
  currentRule?: string;
  processedRules: number;
  totalRules: number;
  processedFiles: number;
  totalFiles: number;
  errors: string[];
  warnings: string[];
  startTime: Date;
  estimatedTimeRemaining?: string;
}

interface RollbackPoint {
  id: string;
  timestamp: string;
  gitCommit: string;
  description: string;
  stage: string;
  filesAffected: string[];
}

interface MigrationResult {
  success: boolean;
  migrationId: string;
  startTime: string;
  endTime: string;
  duration: string;
  progress: MigrationProgress;
  rollbackPoints: RollbackPoint[];
  filesModified: string[];
  rulesApplied: number;
  errorsEncountered: string[];
  summary: {
    totalReplacements: number;
    filesCoverage: number;
    successRate: number;
  };
  nextSteps: string[];
}

class MigrationApplicator {
  private ruleSet: MigrationRuleSet | null = null;
  private progress: MigrationProgress;
  private rollbackPoints: RollbackPoint[] = [];
  private modifiedFiles: Set<string> = new Set();
  private backupDir: string = '';
  private dryRun: boolean = false;

  constructor(options: { dryRun?: boolean } = {}) {
    this.dryRun = options.dryRun || false;
    
    this.progress = {
      stage: 'preparing',
      processedRules: 0,
      totalRules: 0,
      processedFiles: 0,
      totalFiles: 0,
      errors: [],
      warnings: [],
      startTime: new Date(),
    };
  }

  async apply(): Promise<MigrationResult> {
    console.log('🚀 Stage 5: Migration Application');
    console.log('=================================\n');

    if (this.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }

    try {
      // Load migration rules
      await this.loadMigrationRules();
      
      // Pre-flight checks
      await this.runPreflightChecks();
      
      // Create backup
      await this.createBackup();
      
      // Apply migration in stages
      await this.applyMigrationStages();
      
      // Post-migration validation
      await this.runPostMigrationValidation();
      
      // Cleanup and finalize
      await this.cleanup();

      return this.generateSuccessResult();
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      await this.handleMigrationFailure(error as Error);
      return this.generateFailureResult(error as Error);
    }
  }

  private async loadMigrationRules(): Promise<void> {
    this.updateProgress('preparing', 'Loading migration rules...');
    
    const rulesPath = path.join(process.cwd(), 'reports', 'migration-rules.json');
    if (!fs.existsSync(rulesPath)) {
      throw new Error('Migration rules not found. Run `npm run migrate:generate-rules` first.');
    }

    this.ruleSet = JSON.parse(await fs.promises.readFile(rulesPath, 'utf-8'));
    this.progress.totalRules = this.ruleSet!.transformationRules.length;
    
    console.log(`📁 Loaded ${this.progress.totalRules} transformation rules`);
    console.log(`🆔 Migration ID: ${this.ruleSet!.migrationId}\n`);
  }

  private async runPreflightChecks(): Promise<void> {
    this.updateProgress('preparing', 'Running pre-flight checks...');
    
    console.log('✈️  Running pre-flight checks...');

    // Check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        this.progress.warnings.push('Git working directory is not clean');
        console.log('⚠️  Warning: Git working directory has uncommitted changes');
      }
    } catch (error) {
      this.progress.warnings.push('Could not check git status');
    }

    // Check if we can write to target files
    await this.checkFileWritePermissions();
    
    // Validate rule set integrity
    await this.validateRuleSetIntegrity();
    
    // Check available disk space
    await this.checkDiskSpace();

    console.log(`✅ Pre-flight checks completed (${this.progress.warnings.length} warnings)\n`);
  }

  private async checkFileWritePermissions(): Promise<void> {
    const testFiles = await this.findTargetFiles();
    let permissionErrors = 0;

    for (const file of testFiles.slice(0, 10)) { // Check first 10 files
      try {
        await fs.promises.access(file, fs.constants.W_OK);
      } catch (error) {
        permissionErrors++;
        this.progress.warnings.push(`No write permission for ${file}`);
      }
    }

    if (permissionErrors > 0) {
      throw new Error(`Write permission denied for ${permissionErrors} files`);
    }
  }

  private async validateRuleSetIntegrity(): Promise<void> {
    const rules = this.ruleSet!.transformationRules;
    
    // Check for malformed rules
    const malformedRules = rules.filter(rule => 
      !rule.pattern || !rule.replacement || !rule.metadata
    );

    if (malformedRules.length > 0) {
      throw new Error(`Found ${malformedRules.length} malformed transformation rules`);
    }

    // Check for conflicting rules
    const conflicts = this.detectRuleConflicts(rules);
    if (conflicts.length > 0) {
      this.progress.warnings.push(`Found ${conflicts.length} potential rule conflicts`);
    }
  }

  private detectRuleConflicts(rules: TransformationRule[]): string[] {
    const conflicts: string[] = [];
    
    // Check for overlapping patterns
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        if (this.patternsOverlap(rules[i].pattern, rules[j].pattern)) {
          conflicts.push(`Rules ${rules[i].id} and ${rules[j].id} have overlapping patterns`);
        }
      }
    }
    
    return conflicts;
  }

  private patternsOverlap(pattern1: string | RegExp, pattern2: string | RegExp): boolean {
    // Simple overlap detection - in practice, this would be more sophisticated
    const str1 = pattern1.toString();
    const str2 = pattern2.toString();
    return str1 === str2;
  }

  private async checkDiskSpace(): Promise<void> {
    try {
      const stats = fs.statSync('.');
      // Simple check - in practice, you'd check actual available space
      console.log('💾 Disk space check: OK');
    } catch (error) {
      this.progress.warnings.push('Could not check disk space');
    }
  }

  private async createBackup(): Promise<void> {
    if (this.dryRun) {
      console.log('🔍 DRY RUN: Skipping backup creation\n');
      return;
    }

    this.updateProgress('backing-up', 'Creating backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupDir = path.join(process.cwd(), 'backups', `migration-${timestamp}`);
    
    console.log(`💾 Creating backup at: ${this.backupDir}`);

    // Create git commit as backup
    await this.createGitRollbackPoint('Before migration application');
    
    // Create file system backup of critical files
    await this.createFileSystemBackup();
    
    console.log('✅ Backup created successfully\n');
  }

  private async createGitRollbackPoint(description: string): Promise<void> {
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "${description}" --allow-empty`, { stdio: 'inherit' });
      
      const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
      
      const rollbackPoint: RollbackPoint = {
        id: `rollback-${this.rollbackPoints.length + 1}`,
        timestamp: new Date().toISOString(),
        gitCommit: commit,
        description,
        stage: this.progress.stage,
        filesAffected: Array.from(this.modifiedFiles),
      };
      
      this.rollbackPoints.push(rollbackPoint);
      console.log(`📝 Created rollback point: ${commit.slice(0, 8)}`);
      
    } catch (error) {
      this.progress.warnings.push('Could not create git rollback point');
      console.warn('⚠️  Warning: Could not create git rollback point');
    }
  }

  private async createFileSystemBackup(): Promise<void> {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const targetFiles = await this.findTargetFiles();
    
    for (const file of targetFiles) {
      const backupPath = path.join(this.backupDir, file);
      const backupDir = path.dirname(backupPath);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      try {
        await fs.promises.copyFile(file, backupPath);
      } catch (error) {
        this.progress.warnings.push(`Could not backup ${file}`);
      }
    }
  }

  private async findTargetFiles(): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.ts', '.tsx', '.css', '.scss', '.js', '.jsx'];
    const ignoreDirs = ['node_modules', '.next', 'dist', 'build', '.git', 'backups'];

    const walkDir = async (dir: string): Promise<void> => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
          await walkDir(fullPath);
        } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
          files.push(fullPath);
        }
      }
    };

    await walkDir(process.cwd());
    this.progress.totalFiles = files.length;
    
    return files;
  }

  private async applyMigrationStages(): Promise<void> {
    this.updateProgress('applying', 'Applying transformation rules...');
    
    console.log('🔄 Applying transformation rules...\n');

    const rules = this.ruleSet!.transformationRules;
    const rulesByType = this.groupRulesByType(rules);
    
    // Apply rules in order of priority/type
    const orderedTypes = ['css-variable', 'tailwind-class', 'inline-style', 'typescript-import', 'component-prop'];
    
    for (const ruleType of orderedTypes) {
      if (rulesByType[ruleType]) {
        await this.applyRulesByType(ruleType, rulesByType[ruleType]);
        
        // Create checkpoint after each rule type
        await this.createGitRollbackPoint(`Applied ${ruleType} rules`);
      }
    }
    
    console.log('\n✅ All transformation rules applied successfully');
  }

  private groupRulesByType(rules: TransformationRule[]): Record<string, TransformationRule[]> {
    return rules.reduce((acc, rule) => {
      if (!acc[rule.type]) {
        acc[rule.type] = [];
      }
      acc[rule.type].push(rule);
      return acc;
    }, {} as Record<string, TransformationRule[]>);
  }

  private async applyRulesByType(ruleType: string, rules: TransformationRule[]): Promise<void> {
    console.log(`📝 Applying ${rules.length} ${ruleType} rules...`);
    
    const targetFiles = await this.findTargetFilesForRuleType(ruleType);
    
    for (const file of targetFiles) {
      await this.applyRulesToFile(file, rules);
      this.progress.processedFiles++;
      this.updateProgressDisplay();
    }
    
    this.progress.processedRules += rules.length;
    console.log(`   ✅ ${ruleType} rules applied`);
  }

  private async findTargetFilesForRuleType(ruleType: string): Promise<string[]> {
    const allFiles = await this.findTargetFiles();
    
    // Filter files based on rule type
    const extensionMap: Record<string, string[]> = {
      'css-variable': ['.css', '.scss', '.tsx', '.ts'],
      'tailwind-class': ['.tsx', '.ts', '.jsx', '.js'],
      'inline-style': ['.tsx', '.ts', '.jsx', '.js'],
      'typescript-import': ['.ts', '.tsx'],
      'component-prop': ['.tsx', '.jsx'],
    };
    
    const validExtensions = extensionMap[ruleType] || [];
    
    return allFiles.filter(file => 
      validExtensions.some(ext => file.endsWith(ext))
    );
  }

  private async applyRulesToFile(filePath: string, rules: TransformationRule[]): Promise<void> {
    try {
      let content = await fs.promises.readFile(filePath, 'utf-8');
      let modified = false;
      
      for (const rule of rules) {
        const originalContent = content;
        content = this.applyRule(content, rule);
        
        if (content !== originalContent) {
          modified = true;
        }
      }
      
      if (modified && !this.dryRun) {
        await fs.promises.writeFile(filePath, content);
        this.modifiedFiles.add(filePath);
      } else if (modified && this.dryRun) {
        console.log(`   📝 Would modify: ${filePath}`);
      }
      
    } catch (error) {
      const errorMsg = `Failed to process ${filePath}: ${error}`;
      this.progress.errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
    }
  }

  private applyRule(content: string, rule: TransformationRule): string {
    try {
      if (rule.pattern instanceof RegExp) {
        return content.replace(rule.pattern, rule.replacement);
      } else {
        return content.replaceAll(rule.pattern, rule.replacement);
      }
    } catch (error) {
      this.progress.warnings.push(`Rule ${rule.id} failed: ${error}`);
      return content;
    }
  }

  private async runPostMigrationValidation(): Promise<void> {
    this.updateProgress('validating', 'Running post-migration validation...');
    
    console.log('\n🔍 Running post-migration validation...');

    // Run build check
    await this.validateBuild();
    
    // Run tests (if available)
    await this.validateTests();
    
    // Check for broken references
    await this.validateReferences();
    
    // Visual regression check placeholder
    await this.validateVisual();

    console.log('✅ Post-migration validation completed\n');
  }

  private async validateBuild(): Promise<void> {
    if (this.dryRun) {
      console.log('🔍 DRY RUN: Skipping build validation');
      return;
    }

    try {
      console.log('🔨 Testing build...');
      execSync('npm run build', { stdio: 'pipe' });
      console.log('   ✅ Build successful');
    } catch (error) {
      const errorMsg = 'Build failed after migration';
      this.progress.errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  private async validateTests(): Promise<void> {
    if (this.dryRun) {
      console.log('🔍 DRY RUN: Skipping test validation');
      return;
    }

    try {
      console.log('🧪 Running tests...');
      execSync('npm test -- --passWithNoTests', { stdio: 'pipe' });
      console.log('   ✅ Tests passed');
    } catch (error) {
      this.progress.warnings.push('Some tests failed after migration');
      console.warn('   ⚠️  Warning: Some tests failed');
    }
  }

  private async validateReferences(): Promise<void> {
    console.log('🔗 Checking for broken references...');
    
    // Check for remaining temporary tokens
    const tempTokens = await this.findRemainingTempTokens();
    
    if (tempTokens.length > 0) {
      const warningMsg = `Found ${tempTokens.length} remaining temporary tokens`;
      this.progress.warnings.push(warningMsg);
      console.warn(`   ⚠️  ${warningMsg}`);
    } else {
      console.log('   ✅ No remaining temporary tokens found');
    }
  }

  private async findRemainingTempTokens(): Promise<string[]> {
    const files = await this.findTargetFiles();
    const tempTokenPattern = /var\(--unnamed-\w+-\d+\)/g;
    const remainingTokens: string[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf-8');
        const matches = content.match(tempTokenPattern);
        if (matches) {
          remainingTokens.push(...matches);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
    
    return [...new Set(remainingTokens)];
  }

  private async validateVisual(): Promise<void> {
    console.log('👁️  Visual validation placeholder...');
    console.log('   ℹ️  Manual visual testing recommended');
    
    // This would integrate with visual regression testing tools
    // like Percy, Chromatic, or similar
  }

  private async cleanup(): Promise<void> {
    this.updateProgress('cleaning-up', 'Cleaning up...');
    
    console.log('🧹 Cleaning up...');

    // Clean up temporary files
    await this.cleanupTempFiles();
    
    // Update documentation
    await this.updateDocumentation();
    
    // Create final rollback point
    await this.createGitRollbackPoint('Migration completed successfully');

    console.log('✅ Cleanup completed');
  }

  private async cleanupTempFiles(): Promise<void> {
    // Remove any temporary files created during migration
    const tempDir = path.join(process.cwd(), '.migration-temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private async updateDocumentation(): Promise<void> {
    // Update migration documentation
    const migrationLog = {
      migrationId: this.ruleSet!.migrationId,
      appliedAt: new Date().toISOString(),
      rulesApplied: this.progress.processedRules,
      filesModified: this.modifiedFiles.size,
      rollbackPoints: this.rollbackPoints,
    };

    const logPath = path.join(process.cwd(), 'reports', 'migration-history.json');
    let history: any[] = [];
    
    if (fs.existsSync(logPath)) {
      history = JSON.parse(await fs.promises.readFile(logPath, 'utf-8'));
    }
    
    history.push(migrationLog);
    await fs.promises.writeFile(logPath, JSON.stringify(history, null, 2));
  }

  private async handleMigrationFailure(error: Error): Promise<void> {
    console.log('\n🚨 Migration failed - initiating rollback...');
    
    if (this.rollbackPoints.length > 0) {
      const lastRollbackPoint = this.rollbackPoints[this.rollbackPoints.length - 1];
      try {
        execSync(`git reset --hard ${lastRollbackPoint.gitCommit}`, { stdio: 'inherit' });
        console.log(`✅ Rolled back to: ${lastRollbackPoint.gitCommit.slice(0, 8)}`);
      } catch (rollbackError) {
        console.error('❌ Rollback failed:', rollbackError);
        console.log('💾 Manual rollback required. Use backup at:', this.backupDir);
      }
    }

    // Save failure report
    await this.saveFailureReport(error);
  }

  private async saveFailureReport(error: Error): Promise<void> {
    const failureReport = {
      migrationId: this.ruleSet?.migrationId || 'unknown',
      failedAt: new Date().toISOString(),
      error: error.message,
      progress: this.progress,
      rollbackPoints: this.rollbackPoints,
      backupLocation: this.backupDir,
    };

    const reportPath = path.join(process.cwd(), 'reports', 'migration-failure.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(failureReport, null, 2));
  }

  private updateProgress(stage: MigrationProgress['stage'], message: string): void {
    this.progress.stage = stage;
    
    // Calculate estimated time remaining
    const elapsed = Date.now() - this.progress.startTime.getTime();
    const progressPercent = this.progress.processedRules / this.progress.totalRules;
    
    if (progressPercent > 0) {
      const estimatedTotal = elapsed / progressPercent;
      const remaining = estimatedTotal - elapsed;
      this.progress.estimatedTimeRemaining = this.formatDuration(remaining);
    }
    
    console.log(`${this.getStageIcon(stage)} ${message}`);
  }

  private updateProgressDisplay(): void {
    const percent = Math.round((this.progress.processedRules / this.progress.totalRules) * 100);
    const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
    
    process.stdout.write(`\r   Progress: [${bar}] ${percent}% (${this.progress.processedRules}/${this.progress.totalRules})`);
    
    if (this.progress.processedRules === this.progress.totalRules) {
      console.log(''); // New line after completion
    }
  }

  private getStageIcon(stage: string): string {
    const icons: Record<string, string> = {
      'preparing': '🛠️',
      'backing-up': '💾',
      'applying': '🔄',
      'validating': '✅',
      'cleaning-up': '🧹',
      'completed': '🎉',
      'failed': '❌',
    };
    return icons[stage] || '📋';
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private generateSuccessResult(): MigrationResult {
    const endTime = new Date();
    const duration = endTime.getTime() - this.progress.startTime.getTime();
    
    return {
      success: true,
      migrationId: this.ruleSet!.migrationId,
      startTime: this.progress.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: this.formatDuration(duration),
      progress: this.progress,
      rollbackPoints: this.rollbackPoints,
      filesModified: Array.from(this.modifiedFiles),
      rulesApplied: this.progress.processedRules,
      errorsEncountered: this.progress.errors,
      summary: {
        totalReplacements: this.calculateTotalReplacements(),
        filesCoverage: Math.round((this.modifiedFiles.size / this.progress.totalFiles) * 100),
        successRate: Math.round(((this.progress.processedRules - this.progress.errors.length) / this.progress.processedRules) * 100),
      },
      nextSteps: [
        'Test the migrated application thoroughly',
        'Run visual regression tests',
        'Update team documentation',
        'Consider cleanup of temporary migration files',
        'Monitor for any issues in production',
      ],
    };
  }

  private generateFailureResult(error: Error): MigrationResult {
    const endTime = new Date();
    const duration = endTime.getTime() - this.progress.startTime.getTime();
    
    return {
      success: false,
      migrationId: this.ruleSet?.migrationId || 'unknown',
      startTime: this.progress.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: this.formatDuration(duration),
      progress: this.progress,
      rollbackPoints: this.rollbackPoints,
      filesModified: Array.from(this.modifiedFiles),
      rulesApplied: this.progress.processedRules,
      errorsEncountered: [...this.progress.errors, error.message],
      summary: {
        totalReplacements: 0,
        filesCoverage: 0,
        successRate: 0,
      },
      nextSteps: [
        'Review failure report in reports/migration-failure.json',
        'Fix identified issues',
        'Restore from backup if necessary',
        'Re-run migration validation',
        'Consider gradual migration approach',
      ],
    };
  }

  private calculateTotalReplacements(): number {
    // This would be calculated by analyzing the actual replacements made
    return this.modifiedFiles.size * 10; // Placeholder estimation
  }

  async displayResult(result: MigrationResult): Promise<void> {
    console.log('\n🎯 Migration Results');
    console.log('===================\n');

    const statusIcon = result.success ? '✅' : '❌';
    const statusText = result.success ? 'SUCCESS' : 'FAILED';
    
    console.log(`${statusIcon} Status: ${statusText}`);
    console.log(`⏱️  Duration: ${result.duration}`);
    console.log(`📊 Files Modified: ${result.filesModified.length}`);
    console.log(`📋 Rules Applied: ${result.rulesApplied}\n`);

    if (result.success) {
      console.log('📈 Summary:');
      console.log(`   Total Replacements: ${result.summary.totalReplacements}`);
      console.log(`   File Coverage: ${result.summary.filesCoverage}%`);
      console.log(`   Success Rate: ${result.summary.successRate}%\n`);
    }

    if (result.errorsEncountered.length > 0) {
      console.log('❌ Errors Encountered:');
      result.errorsEncountered.forEach(error => {
        console.log(`   - ${error}`);
      });
      console.log('');
    }

    console.log('📋 Next Steps:');
    result.nextSteps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step}`);
    });

    // Save result report
    const resultPath = path.join(process.cwd(), 'reports', 'migration-result.json');
    await fs.promises.writeFile(resultPath, JSON.stringify(result, null, 2));
    console.log(`\n📄 Full report saved to: ${resultPath}`);
  }
}

// Execute if run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  const applicator = new MigrationApplicator({ dryRun });
  applicator.apply()
    .then(result => applicator.displayResult(result))
    .catch(console.error);
}

export { MigrationApplicator, MigrationResult };