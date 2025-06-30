#!/usr/bin/env node

/**
 * Add Token Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';
import { TokenCategory, TokenValueType } from './token-manager/types.js';

const commands = new TokenCommands();

program
  .name('token-add')
  .description('Add a new design token')
  .version('1.0.0');

program
  .argument('<name>', 'Token name (kebab-case)')
  .argument('<value>', 'Token value')
  .requiredOption('-c, --category <category>', 'Token category', 'colors')
  .option('-t, --type <type>', 'Token type (inferred if not provided)')
  .option('--comment <comment>', 'Token description/comment')
  .option('--semantic', 'Mark as semantic token', false)
  .action(async (name: string, value: string, options) => {
    try {
      await commands.addToken({
        name,
        value,
        category: options.category as TokenCategory,
        type: options.type as TokenValueType,
        comment: options.comment,
        semantic: options.semantic
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();