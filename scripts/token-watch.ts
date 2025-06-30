#!/usr/bin/env node

/**
 * Token Watch Command
 */

import { program } from 'commander';
import { IntegrationManager } from './token-manager/integration.js';

program
  .name('token-watch')
  .description('Watch for token changes and auto-rebuild')
  .version('1.0.0');

program
  .option('--storybook', 'Enable Storybook hot reload', true)
  .option('--git', 'Enable git integration', false)
  .option('--auto-commit', 'Auto-commit changes', false)
  .action(async (options) => {
    try {
      console.log('👀 Starting token watch mode...');
      
      const integration = new IntegrationManager({
        storybook: {
          enabled: options.storybook,
          hotReload: options.storybook,
          storiesPath: '.storybook'
        },
        git: {
          enabled: options.git,
          autoCommit: options.autoCommit,
          branchProtection: true
        },
        build: {
          autoRebuild: true,
          outputFormats: ['css', 'ts', 'json'],
          outputDir: 'generated'
        }
      });

      await integration.start();

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n🛑 Shutting down token watcher...');
        await integration.stop();
        process.exit(0);
      });

      // Keep process alive
      process.stdin.resume();
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();