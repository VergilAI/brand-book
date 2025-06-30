#!/usr/bin/env node

/**
 * Token Migration Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';

const commands = new TokenCommands();

program
  .name('token-migrate')
  .description('Migrate tokens between versions')
  .version('1.0.0');

program
  .command('plan')
  .description('Generate migration plan between versions')
  .argument('<from-version>', 'Source version')
  .argument('<to-version>', 'Target version')
  .action(async (fromVersion: string, toVersion: string) => {
    try {
      const plan = await commands.generateMigrationPlan(fromVersion, toVersion);
      
      console.log(`📋 Migration Plan: ${fromVersion} → ${toVersion}`);
      console.log(`   Operations: ${plan.operations.length}`);
      console.log(`   Breaking changes: ${plan.impact.breakingChanges}`);
      console.log(`   Estimated effort: ${plan.impact.estimatedEffort}`);
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('apply')
  .description('Apply migration (placeholder)')
  .option('--dry-run', 'Show what would be changed without applying')
  .action(async (options) => {
    try {
      console.log('🔄 Token migration apply...');
      
      if (options.dryRun) {
        console.log('   Running in dry-run mode (no changes will be made)');
      }
      
      console.log('   Migration apply functionality not yet implemented');
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();