#!/usr/bin/env node

/**
 * Token Documentation Command
 */

import { program } from 'commander';
import { TokenParser } from './token-manager/parser.js';
import { DocumentationGenerator } from './token-manager/documentation.js';

const parser = new TokenParser();
const docGenerator = new DocumentationGenerator();

program
  .name('token-docs')
  .description('Generate comprehensive token documentation')
  .version('1.0.0');

program
  .option('-o, --output <dir>', 'Output directory', 'docs/tokens')
  .option('--format <formats...>', 'Documentation formats to generate', ['markdown'])
  .option('--include-gallery', 'Include visual token gallery', true)
  .option('--include-accessibility', 'Include accessibility report', true)
  .action(async (options) => {
    try {
      console.log('📖 Generating token documentation...');
      
      const registry = await parser.parseAll();
      const results = await docGenerator.generateAll(registry);

      console.log(`\n✅ Generated ${results.length} documentation files:`);
      for (const result of results) {
        console.log(`   📄 ${result.filename}`);
      }

      console.log(`\n📁 Documentation available at: ${options.output}`);
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();