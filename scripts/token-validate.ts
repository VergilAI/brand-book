#!/usr/bin/env node

/**
 * Validate Tokens Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';

const commands = new TokenCommands();

program
  .name('token-validate')
  .description('Validate design tokens for consistency and best practices')
  .version('1.0.0');

program
  .option('--fix', 'Attempt to automatically fix issues', false)
  .action(async (options) => {
    try {
      await commands.validateTokens({ fix: options.fix });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();