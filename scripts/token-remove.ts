#!/usr/bin/env node

/**
 * Remove Token Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';

const commands = new TokenCommands();

program
  .name('token-remove')
  .description('Remove a design token')
  .version('1.0.0');

program
  .argument('<name>', 'Token name to remove')
  .option('--force', 'Force removal even if other tokens depend on it', false)
  .action(async (name: string, options) => {
    try {
      await commands.removeToken(name, { force: options.force });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();