#!/usr/bin/env tsx

/**
 * Migration Help and Status Utility
 * 
 * Provides help, status, and guidance for the migration pipeline system
 */

import * as fs from 'fs';
import * as path from 'path';

class MigrationHelper {
  
  showHelp(): void {
    console.log('🔄 Design Token Migration Pipeline');
    console.log('==================================\n');
    
    console.log('The migration pipeline provides a systematic approach to migrating hardcoded');
    console.log('design values to semantic design tokens through 5 carefully orchestrated stages.\n');
    
    this.showStages();
    this.showCommands();
    this.showExamples();
    this.showTroubleshooting();
  }

  private showStages(): void {
    console.log('📋 Migration Stages:');
    console.log('--------------------\n');
    
    const stages = [
      {
        number: 1,
        name: 'Discovery & Extraction',
        command: 'migrate:extract',
        description: 'Scans codebase for hardcoded values and replaces them with temporary tokens',
        outputs: ['migration-discovery.json', 'migration-discovery-summary.md'],
      },
      {
        number: 2,
        name: 'Human Review Interface',
        command: 'migrate:review',
        description: 'Interactive CLI for mapping temporary tokens to semantic names',
        outputs: ['migration-mappings.json', 'migration session files'],
      },
      {
        number: 3,
        name: 'Validation Engine',
        command: 'migrate:validate',
        description: 'Checks migration readiness and detects conflicts or issues',
        outputs: ['migration-validation.json', 'migration-validation-summary.md'],
      },
      {
        number: 4,
        name: 'Translation Rules',
        command: 'migrate:generate-rules',
        description: 'Creates explicit transformation rules for code changes',
        outputs: ['migration-rules.json', 'migration-rules-summary.md'],
      },
      {
        number: 5,
        name: 'Application',
        command: 'migrate:apply',
        description: 'Executes migration with rollback points and validation',
        outputs: ['migration-result.json', 'migration-history.json'],
      },
    ];

    stages.forEach(stage => {
      console.log(`${stage.number}. **${stage.name}**`);
      console.log(`   Command: npm run ${stage.command}`);
      console.log(`   ${stage.description}`);
      console.log(`   Outputs: ${stage.outputs.join(', ')}\n`);
    });
  }

  private showCommands(): void {
    console.log('⚙️  Available Commands:');
    console.log('-----------------------\n');
    
    const commands = [
      {
        command: 'npm run migrate:extract',
        description: 'Stage 1: Extract hardcoded values and create temporary tokens',
        options: [],
      },
      {
        command: 'npm run migrate:review',
        description: 'Stage 2: Interactive review and mapping of tokens',
        options: [],
      },
      {
        command: 'npm run migrate:validate',
        description: 'Stage 3: Validate migration readiness',
        options: [],
      },
      {
        command: 'npm run migrate:generate-rules',
        description: 'Stage 4: Generate transformation rules',
        options: [],
      },
      {
        command: 'npm run migrate:apply',
        description: 'Stage 5: Apply migration with full safety features',
        options: [],
      },
      {
        command: 'npm run migrate:apply:dry-run',
        description: 'Test migration application without making changes',
        options: [],
      },
      {
        command: 'npm run migrate:full-pipeline',
        description: 'Run complete pipeline (extract → review → validate → rules → apply)',
        options: ['⚠️  Interactive - requires human input at Stage 2'],
      },
      {
        command: 'npm run migrate:status',
        description: 'Check current migration status and progress',
        options: [],
      },
      {
        command: 'npm run migrate:rollback',
        description: 'Rollback to previous state using git or backups',
        options: [],
      },
      {
        command: 'npm run migrate:help',
        description: 'Show this help information',
        options: [],
      },
    ];

    commands.forEach(cmd => {
      console.log(`📋 ${cmd.command}`);
      console.log(`   ${cmd.description}`);
      if (cmd.options.length > 0) {
        cmd.options.forEach(option => {
          console.log(`   ${option}`);
        });
      }
      console.log('');
    });
  }

  private showExamples(): void {
    console.log('💡 Common Usage Examples:');
    console.log('--------------------------\n');
    
    console.log('🟢 **First-time migration:**');
    console.log('   npm run migrate:extract');
    console.log('   npm run migrate:review');
    console.log('   npm run migrate:validate');
    console.log('   npm run migrate:generate-rules');
    console.log('   npm run migrate:apply:dry-run  # Test first');
    console.log('   npm run migrate:apply\n');
    
    console.log('🔄 **Test changes before applying:**');
    console.log('   npm run migrate:apply:dry-run\n');
    
    console.log('🚀 **Full automated pipeline (with human review):**');
    console.log('   npm run migrate:full-pipeline\n');
    
    console.log('📊 **Check progress:**');
    console.log('   npm run migrate:status\n');
    
    console.log('🔙 **Rollback if needed:**');
    console.log('   npm run migrate:rollback\n');
    
    console.log('🔍 **Re-validate after fixes:**');
    console.log('   npm run migrate:validate');
    console.log('   npm run migrate:generate-rules');
    console.log('   npm run migrate:apply\n');
  }

  private showTroubleshooting(): void {
    console.log('🛠️  Troubleshooting:');
    console.log('--------------------\n');
    
    const issues = [
      {
        problem: 'Stage fails with "file not found" error',
        solution: 'Run previous stages first. Each stage depends on outputs from previous stages.',
      },
      {
        problem: 'Validation shows blocking errors',
        solution: 'Review and fix issues in reports/migration-validation.json before proceeding.',
      },
      {
        problem: 'Migration applies but build fails',
        solution: 'Use "npm run migrate:rollback" and check validation warnings.',
      },
      {
        problem: 'Too many values to review manually',
        solution: 'Use auto-mapping features in Stage 2 review interface.',
      },
      {
        problem: 'Git working directory not clean',
        solution: 'Commit or stash changes before running migration.',
      },
      {
        problem: 'Need to restart migration from beginning',
        solution: 'Use git to revert to pre-migration state and re-run extract stage.',
      },
    ];

    issues.forEach(issue => {
      console.log(`❓ **Problem:** ${issue.problem}`);
      console.log(`✅ **Solution:** ${issue.solution}\n`);
    });
    
    console.log('📞 **Need more help?**');
    console.log('   - Check reports/ directory for detailed logs');
    console.log('   - Review migration-*.md files for specific stage guidance');
    console.log('   - Use --dry-run flags to test changes safely\n');
  }

  showStatus(): void {
    console.log('📊 Migration Status');
    console.log('==================\n');
    
    this.checkStageCompletions();
    this.showRecentActivity();
    this.showNextSteps();
  }

  private checkStageCompletions(): void {
    const reportFiles = [
      { stage: 1, file: 'migration-discovery.json', name: 'Discovery & Extraction' },
      { stage: 2, file: 'migration-mappings.json', name: 'Human Review' },
      { stage: 3, file: 'migration-validation.json', name: 'Validation' },
      { stage: 4, file: 'migration-rules.json', name: 'Translation Rules' },
      { stage: 5, file: 'migration-result.json', name: 'Application' },
    ];

    console.log('🔍 Stage Completion Status:');
    console.log('---------------------------\n');

    const reportsDir = path.join(process.cwd(), 'reports');
    
    reportFiles.forEach(({ stage, file, name }) => {
      const filePath = path.join(reportsDir, file);
      const exists = fs.existsSync(filePath);
      const icon = exists ? '✅' : '❌';
      const status = exists ? 'Complete' : 'Not started';
      
      console.log(`Stage ${stage}: ${icon} ${name} - ${status}`);
      
      if (exists) {
        try {
          const stats = fs.statSync(filePath);
          console.log(`         Last updated: ${stats.mtime.toLocaleString()}`);
        } catch (error) {
          // Ignore stat errors
        }
      }
      console.log('');
    });
  }

  private showRecentActivity(): void {
    console.log('📅 Recent Activity:');
    console.log('------------------\n');
    
    const historyPath = path.join(process.cwd(), 'reports', 'migration-history.json');
    
    if (fs.existsSync(historyPath)) {
      try {
        const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
        const recent = history.slice(-3); // Last 3 entries
        
        recent.forEach((entry: any, index: number) => {
          console.log(`${index + 1}. ${new Date(entry.appliedAt).toLocaleString()}`);
          console.log(`   Migration ID: ${entry.migrationId}`);
          console.log(`   Rules applied: ${entry.rulesApplied}`);
          console.log(`   Files modified: ${entry.filesModified}`);
          console.log('');
        });
      } catch (error) {
        console.log('   No migration history found\n');
      }
    } else {
      console.log('   No migration history found\n');
    }
  }

  private showNextSteps(): void {
    console.log('📋 Suggested Next Steps:');
    console.log('------------------------\n');
    
    const reportsDir = path.join(process.cwd(), 'reports');
    
    // Check what stage to run next
    if (!fs.existsSync(path.join(reportsDir, 'migration-discovery.json'))) {
      console.log('1. Run: npm run migrate:extract');
      console.log('   Start the migration by discovering hardcoded values\n');
    } else if (!fs.existsSync(path.join(reportsDir, 'migration-mappings.json'))) {
      console.log('1. Run: npm run migrate:review');
      console.log('   Review and map extracted values to semantic tokens\n');
    } else if (!fs.existsSync(path.join(reportsDir, 'migration-validation.json'))) {
      console.log('1. Run: npm run migrate:validate');
      console.log('   Validate migration readiness\n');
    } else if (!fs.existsSync(path.join(reportsDir, 'migration-rules.json'))) {
      console.log('1. Run: npm run migrate:generate-rules');
      console.log('   Generate transformation rules\n');
    } else if (!fs.existsSync(path.join(reportsDir, 'migration-result.json'))) {
      console.log('1. Run: npm run migrate:apply:dry-run');
      console.log('   Test the migration application');
      console.log('2. Run: npm run migrate:apply');
      console.log('   Apply the migration\n');
    } else {
      console.log('✅ Migration pipeline appears complete!');
      console.log('');
      console.log('Consider:');
      console.log('- Testing your application thoroughly');
      console.log('- Running visual regression tests');
      console.log('- Cleaning up temporary migration files');
      console.log('- Documenting the migration for your team\n');
    }
  }
}

// Handle command line arguments
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  const helper = new MigrationHelper();
  
  switch (command.toLowerCase()) {
    case 'status':
      helper.showStatus();
      break;
    case 'help':
    default:
      helper.showHelp();
      break;
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { MigrationHelper };