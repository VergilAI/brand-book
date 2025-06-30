#!/usr/bin/env node

/**
 * Token Accessibility Command
 */

import { program } from 'commander';
import { TokenParser } from './token-manager/parser.js';
import { AccessibilityChecker } from './token-manager/accessibility.js';

const parser = new TokenParser();
const accessibilityChecker = new AccessibilityChecker();

program
  .name('token-accessibility')
  .description('Check accessibility compliance of color tokens')
  .version('1.0.0');

program
  .option('--format <format>', 'Output format (table, json, markdown)', 'table')
  .option('--level <level>', 'WCAG level to check (AA, AAA)', 'AA')
  .option('--fix', 'Suggest accessible alternatives', false)
  .action(async (options) => {
    try {
      console.log('🔍 Analyzing token accessibility...');
      
      const registry = await parser.parseAll();
      const allTokens = Object.values(registry.categories).flatMap(cat => cat.tokens);
      const report = accessibilityChecker.generateAccessibilityReport(allTokens);

      console.log(`\n📊 Accessibility Report (WCAG ${options.level}):`);
      console.log(`   Total tokens: ${report.summary.total}`);
      console.log(`   AAA compliant: ${report.summary.aaa}`);
      console.log(`   AA compliant: ${report.summary.aa}`);
      console.log(`   Non-compliant: ${report.summary.fail}`);

      if (report.violations.length > 0) {
        console.log(`\n❌ Non-compliant tokens:`);
        for (const token of report.violations) {
          console.log(`   ${token.name}: ${token.accessibility?.contrastRatio?.toFixed(2)}:1`);
          
          if (options.fix) {
            const suggestions = accessibilityChecker.suggestAccessibleAlternatives(
              token.value,
              token.accessibility?.backgroundColor || '#ffffff'
            );
            console.log(`     💡 Try: ${suggestions.darker} (darker) or ${suggestions.lighter} (lighter)`);
          }
        }
      } else {
        console.log(`\n✅ All color tokens are WCAG compliant!`);
      }

      if (options.format === 'json') {
        console.log('\n' + JSON.stringify(report, null, 2));
      }

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();