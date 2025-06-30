#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as readline from 'readline';

/**
 * Migration Rollback Utility
 * 
 * Provides safe rollback capabilities for migrations
 */

interface RollbackPoint {
  id: string;
  timestamp: string;
  gitCommit: string;
  description: string;
  stage: string;
  filesAffected: string[];
}

class MigrationRollback {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async rollback(): Promise<void> {
    console.log('🔙 Migration Rollback Utility');
    console.log('=============================\n');

    try {
      // Find available rollback points
      const rollbackPoints = await this.findRollbackPoints();
      
      if (rollbackPoints.length === 0) {
        console.log('❌ No rollback points found.');
        console.log('You may need to manually restore from backups.\n');
        await this.showManualRollbackOptions();
        return;
      }

      // Show available options
      await this.showRollbackOptions(rollbackPoints);
      
      // Get user choice
      const choice = await this.getUserChoice(rollbackPoints);
      
      if (choice) {
        await this.performRollback(choice);
      } else {
        console.log('Rollback cancelled.');
      }
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
    } finally {
      this.rl.close();
    }
  }

  private async findRollbackPoints(): Promise<RollbackPoint[]> {
    const rollbackPoints: RollbackPoint[] = [];
    
    // Check migration results for rollback points
    const resultPath = path.join(process.cwd(), 'reports', 'migration-result.json');
    if (fs.existsSync(resultPath)) {
      try {
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
        if (result.rollbackPoints) {
          rollbackPoints.push(...result.rollbackPoints);
        }
      } catch (error) {
        console.warn('⚠️  Could not read migration result file');
      }
    }

    // Check git log for migration commits
    try {
      const gitLog = execSync('git log --oneline --grep="migration" -10', { encoding: 'utf8' });
      const gitCommits = gitLog.trim().split('\n').filter(line => line.trim());
      
      gitCommits.forEach((commit, index) => {
        const [hash, ...messageParts] = commit.split(' ');
        const message = messageParts.join(' ');
        
        if (message.toLowerCase().includes('migration') || 
            message.toLowerCase().includes('rollback')) {
          rollbackPoints.push({
            id: `git-${index}`,
            timestamp: new Date().toISOString(), // Would get actual commit date
            gitCommit: hash,
            description: message,
            stage: 'git-commit',
            filesAffected: [],
          });
        }
      });
    } catch (error) {
      console.warn('⚠️  Could not check git history');
    }

    // Remove duplicates and sort by timestamp
    const uniquePoints = rollbackPoints.filter((point, index, self) => 
      index === self.findIndex(p => p.gitCommit === point.gitCommit)
    );

    return uniquePoints.slice(0, 10); // Limit to 10 most recent
  }

  private async showRollbackOptions(rollbackPoints: RollbackPoint[]): Promise<void> {
    console.log('📋 Available Rollback Points:');
    console.log('-----------------------------\n');

    rollbackPoints.forEach((point, index) => {
      console.log(`${index + 1}. ${point.description}`);
      console.log(`   Commit: ${point.gitCommit}`);
      console.log(`   Time: ${new Date(point.timestamp).toLocaleString()}`);
      console.log(`   Stage: ${point.stage}`);
      if (point.filesAffected.length > 0) {
        console.log(`   Files: ${point.filesAffected.length} affected`);
      }
      console.log('');
    });

    console.log(`${rollbackPoints.length + 1}. Manual rollback options`);
    console.log(`${rollbackPoints.length + 2}. Cancel\n`);
  }

  private async showManualRollbackOptions(): Promise<void> {
    console.log('🛠️  Manual Rollback Options:');
    console.log('----------------------------\n');

    console.log('1. **Git Reset (if you have migration commits):**');
    console.log('   git log --oneline  # Find commit before migration');
    console.log('   git reset --hard <commit-hash>\n');

    console.log('2. **Restore from backup directory:**');
    const backupDirs = this.findBackupDirectories();
    if (backupDirs.length > 0) {
      console.log('   Available backups:');
      backupDirs.forEach(dir => {
        console.log(`   - ${dir}`);
      });
      console.log('   Copy files from backup directory manually\n');
    } else {
      console.log('   No backup directories found\n');
    }

    console.log('3. **Revert specific files:**');
    console.log('   git checkout HEAD~1 -- <file-path>  # Restore individual files\n');

    console.log('4. **Full repository reset:**');
    console.log('   git reset --hard HEAD~1  # ⚠️  Loses all uncommitted changes\n');
  }

  private findBackupDirectories(): string[] {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) return [];

    try {
      return fs.readdirSync(backupDir)
        .filter(item => {
          const itemPath = path.join(backupDir, item);
          return fs.statSync(itemPath).isDirectory();
        })
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      return [];
    }
  }

  private async getUserChoice(rollbackPoints: RollbackPoint[]): Promise<RollbackPoint | null> {
    const maxChoice = rollbackPoints.length + 2;
    
    const answer = await this.askQuestion(`Choose rollback option (1-${maxChoice}): `);
    const choice = parseInt(answer.trim());

    if (isNaN(choice) || choice < 1 || choice > maxChoice) {
      console.log('❌ Invalid choice.');
      return null;
    }

    if (choice === maxChoice) {
      // Cancel
      return null;
    }

    if (choice === maxChoice - 1) {
      // Manual options
      await this.showManualRollbackOptions();
      await this.askQuestion('Press Enter to continue...');
      return null;
    }

    return rollbackPoints[choice - 1];
  }

  private async performRollback(rollbackPoint: RollbackPoint): Promise<void> {
    console.log(`\n🔄 Rolling back to: ${rollbackPoint.description}`);
    console.log(`Commit: ${rollbackPoint.gitCommit}\n`);

    // Confirm the action
    const confirm = await this.askQuestion('⚠️  This will reset your repository. Continue? (y/N): ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('Rollback cancelled.');
      return;
    }

    try {
      // Create a backup commit before rollback
      console.log('💾 Creating backup commit...');
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Backup before rollback" --allow-empty', { stdio: 'inherit' });

      // Perform the rollback
      console.log('🔄 Performing rollback...');
      execSync(`git reset --hard ${rollbackPoint.gitCommit}`, { stdio: 'inherit' });

      console.log('✅ Rollback completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Verify your application works correctly');
      console.log('2. Check that all files are as expected');
      console.log('3. Consider running tests');
      console.log('4. If you need to restart migration, run: npm run migrate:extract\n');

      // Clean up migration reports
      await this.cleanupMigrationReports();

    } catch (error) {
      console.error('❌ Rollback failed:', error);
      console.log('\n🛠️  Manual recovery may be required.');
      console.log('Check git reflog for additional recovery options:');
      console.log('git reflog');
    }
  }

  private async cleanupMigrationReports(): Promise<void> {
    const confirm = await this.askQuestion('Clean up migration reports? (y/N): ');
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      const reportsToClean = [
        'migration-discovery.json',
        'migration-mappings.json',
        'migration-validation.json',
        'migration-rules.json',
        'migration-result.json',
      ];

      const reportsDir = path.join(process.cwd(), 'reports');
      
      for (const report of reportsToClean) {
        const reportPath = path.join(reportsDir, report);
        if (fs.existsSync(reportPath)) {
          try {
            fs.unlinkSync(reportPath);
            console.log(`🗑️  Removed ${report}`);
          } catch (error) {
            console.warn(`⚠️  Could not remove ${report}`);
          }
        }
      }
    }
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

// Execute if run directly
if (require.main === module) {
  const rollback = new MigrationRollback();
  rollback.rollback().catch(console.error);
}

export { MigrationRollback };