#!/usr/bin/env node

/**
 * Find Token Command
 */

import { program } from 'commander';
import { TokenCommands } from './token-manager/commands.js';
import { TokenCategory, TokenValueType } from './token-manager/types.js';

const commands = new TokenCommands();

program
  .name('token-find')
  .description('Search for design tokens')
  .version('1.0.0');

program
  .argument('<query>', 'Search query')
  .option('-c, --category <categories...>', 'Filter by categories')
  .option('-t, --type <types...>', 'Filter by token types')
  .option('--deprecated [value]', 'Filter by deprecated status (true/false)')
  .option('--semantic [value]', 'Filter by semantic status (true/false)')
  .option('--regex', 'Use regex pattern matching', false)
  .option('--case-sensitive', 'Case sensitive search', false)
  .action(async (query: string, options) => {
    try {
      const searchOptions = {
        category: options.category as TokenCategory[],
        type: options.type as TokenValueType[],
        deprecated: options.deprecated === 'true' ? true : options.deprecated === 'false' ? false : undefined,
        semantic: options.semantic === 'true' ? true : options.semantic === 'false' ? false : undefined,
        regex: options.regex,
        caseSensitive: options.caseSensitive
      };

      await commands.findTokens(query, searchOptions);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();