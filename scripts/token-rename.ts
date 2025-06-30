#!/usr/bin/env node

/**
 * Rename Token Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';

const commands = new TokenCommands();

program
  .name('token-rename')
  .description('Rename a design token and update all references')
  .version('1.0.0');

program
  .argument('<old-name>', 'Current token name')
  .argument('<new-name>', 'New token name')
  .action(async (oldName: string, newName: string) => {
    try {
      await commands.renameToken(oldName, newName);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();