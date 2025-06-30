#!/usr/bin/env node

/**
 * Interactive Token Editor CLI
 * Provides a terminal-based interface for editing design tokens
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import readline from 'readline';
import { TokenParser } from './parser.js';
import { TokenValidator } from './validator.js';
import { TokenExporter } from './exporter.js';
import {
  TokenDefinition,
  TokenRegistry,
  TokenCategory,
  TokenValueType,
  EditorSession,
  ValidationReport
} from './types.js';

interface CLIColors {
  reset: string;
  bright: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  gray: string;
}

class TokenEditor {
  private rl: readline.Interface;
  private parser: TokenParser;
  private validator: TokenValidator;
  private exporter: TokenExporter;
  private registry: TokenRegistry | null = null;
  private session: EditorSession;
  private colors: CLIColors;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    this.parser = new TokenParser();
    this.validator = new TokenValidator();
    this.exporter = new TokenExporter();

    this.session = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      unsavedChanges: [],
      viewState: {
        category: 'colors',
        filter: {},
        sortBy: 'name',
        sortOrder: 'asc'
      }
    };

    // Terminal colors
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      gray: '\x1b[90m'
    };

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.rl.on('line', (input) => {
      this.handleCommand(input.trim());
    });

    this.rl.on('close', () => {
      this.handleExit();
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      this.handleExit();
    });
  }

  async start(): Promise<void> {
    this.showWelcome();
    await this.loadTokens();
    this.showMainMenu();
    this.rl.prompt();
  }

  private showWelcome(): void {
    console.clear();
    console.log(this.colorize('bright', '╔══════════════════════════════════════════════════════════════╗'));
    console.log(this.colorize('bright', '║              Vergil Design System - Token Editor            ║'));
    console.log(this.colorize('bright', '╚══════════════════════════════════════════════════════════════╝'));
    console.log();
    console.log(this.colorize('cyan', 'Interactive token editing and management system'));
    console.log(this.colorize('gray', 'Type "help" for available commands, "exit" to quit'));
    console.log();
  }

  private async loadTokens(): Promise<void> {
    console.log(this.colorize('blue', '🔄 Loading tokens...'));
    try {
      this.registry = await this.parser.parseAll();
      console.log(this.colorize('green', `✅ Loaded ${this.registry.metadata.totalTokens} tokens`));
      if (this.registry.metadata.deprecated > 0) {
        console.log(this.colorize('yellow', `⚠️  ${this.registry.metadata.deprecated} deprecated tokens found`));
      }
    } catch (error) {
      console.log(this.colorize('red', `❌ Failed to load tokens: ${error}`));
      process.exit(1);
    }
  }

  private showMainMenu(): void {
    console.log();
    console.log(this.colorize('bright', '📋 Main Menu:'));
    console.log(this.colorize('cyan', '  browse    - Browse tokens by category'));
    console.log(this.colorize('cyan', '  search    - Search tokens'));
    console.log(this.colorize('cyan', '  add       - Add new token'));
    console.log(this.colorize('cyan', '  edit      - Edit existing token'));
    console.log(this.colorize('cyan', '  delete    - Delete token'));
    console.log(this.colorize('cyan', '  validate  - Validate all tokens'));
    console.log(this.colorize('cyan', '  export    - Export tokens'));
    console.log(this.colorize('cyan', '  status    - Show session status'));
    console.log(this.colorize('cyan', '  save      - Save changes'));
    console.log(this.colorize('cyan', '  help      - Show detailed help'));
    console.log(this.colorize('cyan', '  exit      - Exit editor'));
    console.log();
  }

  private async handleCommand(input: string): Promise<void> {
    const [command, ...args] = input.split(' ');

    switch (command.toLowerCase()) {
      case 'help':
      case 'h':
        this.showHelp();
        break;
      case 'browse':
      case 'b':
        await this.handleBrowse(args);
        break;
      case 'search':
      case 's':
        await this.handleSearch(args);
        break;
      case 'add':
      case 'a':
        await this.handleAdd(args);
        break;
      case 'edit':
      case 'e':
        await this.handleEdit(args);
        break;
      case 'delete':
      case 'd':
        await this.handleDelete(args);
        break;
      case 'validate':
      case 'v':
        await this.handleValidate();
        break;
      case 'export':
        await this.handleExport(args);
        break;
      case 'status':
        this.showStatus();
        break;
      case 'save':
        await this.handleSave();
        break;
      case 'menu':
      case 'm':
        this.showMainMenu();
        break;
      case 'clear':
        console.clear();
        this.showWelcome();
        break;
      case 'exit':
      case 'quit':
      case 'q':
        this.handleExit();
        return;
      case '':
        // Empty command, just show prompt again
        break;
      default:
        console.log(this.colorize('red', `Unknown command: ${command}`));
        console.log(this.colorize('gray', 'Type "help" for available commands'));
        break;
    }

    this.rl.prompt();
  }

  private showHelp(): void {
    console.log();
    console.log(this.colorize('bright', '📖 Detailed Help:'));
    console.log();
    
    console.log(this.colorize('bright', 'BROWSING:'));
    console.log('  browse              - Show all categories');
    console.log('  browse colors       - Browse color tokens');
    console.log('  browse spacing      - Browse spacing tokens');
    console.log('  browse [category]   - Browse specific category');
    console.log();

    console.log(this.colorize('bright', 'SEARCHING:'));
    console.log('  search purple       - Search for tokens containing "purple"');
    console.log('  search --type color - Search by token type');
    console.log('  search --regex ^btn - Search using regex pattern');
    console.log();

    console.log(this.colorize('bright', 'EDITING:'));
    console.log('  add                 - Interactive token creation');
    console.log('  edit token-name     - Edit specific token');
    console.log('  delete token-name   - Delete specific token');
    console.log();

    console.log(this.colorize('bright', 'UTILITIES:'));
    console.log('  validate            - Run validation checks');
    console.log('  export css          - Export as CSS');
    console.log('  export ts           - Export as TypeScript');
    console.log('  save                - Save all changes');
    console.log('  status              - Show session info');
    console.log();
  }

  private async handleBrowse(args: string[]): Promise<void> {
    if (!this.registry) return;

    if (args.length === 0) {
      // Show all categories
      this.showCategories();
      return;
    }

    const category = args[0] as TokenCategory;
    if (!this.registry.categories[category]) {
      console.log(this.colorize('red', `Invalid category: ${category}`));
      this.showCategories();
      return;
    }

    this.session.viewState.category = category;
    this.showTokensInCategory(category);
  }

  private showCategories(): void {
    if (!this.registry) return;

    console.log();
    console.log(this.colorize('bright', '📁 Token Categories:'));
    console.log();

    for (const [name, group] of Object.entries(this.registry.categories)) {
      const count = group.tokens.length;
      const deprecated = group.tokens.filter(t => t.deprecated).length;
      
      console.log(
        `${this.colorize('cyan', name.padEnd(12))} ` +
        `${count.toString().padStart(3)} tokens` +
        (deprecated > 0 ? this.colorize('yellow', ` (${deprecated} deprecated)`) : '')
      );
      
      if (group.description) {
        console.log(`${this.colorize('gray', '  ' + group.description)}`);
      }
      console.log();
    }
  }

  private showTokensInCategory(category: TokenCategory): void {
    if (!this.registry) return;

    const group = this.registry.categories[category];
    console.log();
    console.log(this.colorize('bright', `🎨 ${category.toUpperCase()} (${group.tokens.length} tokens):`));
    console.log();

    // Sort tokens based on current sort settings
    const sortedTokens = [...group.tokens].sort((a, b) => {
      const factor = this.session.viewState.sortOrder === 'asc' ? 1 : -1;
      switch (this.session.viewState.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * factor;
        case 'type':
          return a.type.localeCompare(b.type) * factor;
        default:
          return 0;
      }
    });

    for (const token of sortedTokens.slice(0, 20)) { // Limit display
      this.displayToken(token);
    }

    if (sortedTokens.length > 20) {
      console.log(this.colorize('gray', `... and ${sortedTokens.length - 20} more tokens`));
      console.log(this.colorize('gray', 'Use search to filter tokens'));
    }
    console.log();
  }

  private displayToken(token: TokenDefinition): void {
    const nameColor = token.deprecated ? 'yellow' : 'white';
    const typeColor = this.getTypeColor(token.type);
    
    console.log(
      `${this.colorize(nameColor, token.name.padEnd(25))} ` +
      `${this.colorize(typeColor, token.type.padEnd(10))} ` +
      `${this.colorize('gray', token.value)}`
    );

    if (token.comment) {
      console.log(`${this.colorize('dim', '  // ' + token.comment)}`);
    }

    if (token.deprecated) {
      console.log(`${this.colorize('yellow', '  ⚠️  DEPRECATED')}`);
    }
  }

  private getTypeColor(type: TokenValueType): keyof CLIColors {
    const typeColors: Record<TokenValueType, keyof CLIColors> = {
      color: 'magenta',
      spacing: 'blue',
      fontSize: 'green',
      fontWeight: 'green',
      lineHeight: 'green',
      shadow: 'cyan',
      borderRadius: 'blue',
      animation: 'yellow',
      timing: 'yellow',
      custom: 'white'
    };
    return typeColors[type] || 'white';
  }

  private async handleSearch(args: string[]): Promise<void> {
    if (!this.registry) return;

    if (args.length === 0) {
      console.log(this.colorize('red', 'Please provide a search query'));
      console.log(this.colorize('gray', 'Example: search purple'));
      return;
    }

    const query = args.join(' ').toLowerCase();
    const results: TokenDefinition[] = [];

    // Search across all categories
    for (const category of Object.values(this.registry.categories)) {
      for (const token of category.tokens) {
        if (
          token.name.toLowerCase().includes(query) ||
          token.value.toLowerCase().includes(query) ||
          token.comment?.toLowerCase().includes(query) ||
          token.path.toLowerCase().includes(query)
        ) {
          results.push(token);
        }
      }
    }

    console.log();
    if (results.length === 0) {
      console.log(this.colorize('yellow', `No tokens found matching "${query}"`));
    } else {
      console.log(this.colorize('bright', `🔍 Found ${results.length} tokens matching "${query}":`));
      console.log();
      
      for (const token of results.slice(0, 10)) {
        this.displayToken(token);
      }

      if (results.length > 10) {
        console.log(this.colorize('gray', `... and ${results.length - 10} more results`));
      }
    }
    console.log();
  }

  private async handleAdd(args: string[]): Promise<void> {
    console.log();
    console.log(this.colorize('bright', '➕ Add New Token'));
    console.log();

    // Interactive token creation
    const name = await this.askQuestion('Token name (kebab-case): ');
    if (!name) return;

    const categories = Object.keys(this.registry?.categories || {});
    console.log('Available categories:', categories.join(', '));
    const category = await this.askQuestion('Category: ') as TokenCategory;
    
    const value = await this.askQuestion('Value: ');
    const comment = await this.askQuestion('Comment (optional): ');

    // Create new token
    const newToken: TokenDefinition = {
      name,
      path: name,
      category,
      type: this.parser.inferType?.(name, value) || 'custom',
      value,
      cssVar: `--${name}`,
      comment: comment || undefined
    };

    // Add to registry
    if (this.registry) {
      this.registry.categories[category].tokens.push(newToken);
      this.session.unsavedChanges.push({
        type: 'add',
        timestamp: new Date().toISOString(),
        tokenPath: name,
        newValue: newToken
      });

      console.log(this.colorize('green', `✅ Token "${name}" added successfully`));
      console.log(this.colorize('yellow', '⚠️  Remember to save your changes'));
    }
  }

  private async handleEdit(args: string[]): Promise<void> {
    if (!this.registry || args.length === 0) {
      console.log(this.colorize('red', 'Please specify a token name to edit'));
      return;
    }

    const tokenName = args[0];
    let foundToken: TokenDefinition | null = null;

    // Find token
    for (const category of Object.values(this.registry.categories)) {
      foundToken = category.tokens.find(t => t.name === tokenName);
      if (foundToken) break;
    }

    if (!foundToken) {
      console.log(this.colorize('red', `Token "${tokenName}" not found`));
      return;
    }

    console.log();
    console.log(this.colorize('bright', `✏️  Edit Token: ${tokenName}`));
    console.log();
    this.displayToken(foundToken);
    console.log();

    const newValue = await this.askQuestion(`New value (current: ${foundToken.value}): `);
    const newComment = await this.askQuestion(`New comment (current: ${foundToken.comment || 'none'}): `);

    if (newValue) foundToken.value = newValue;
    if (newComment) foundToken.comment = newComment;

    this.session.unsavedChanges.push({
      type: 'update',
      timestamp: new Date().toISOString(),
      tokenPath: tokenName,
      newValue: foundToken
    });

    console.log(this.colorize('green', '✅ Token updated successfully'));
    console.log(this.colorize('yellow', '⚠️  Remember to save your changes'));
  }

  private async handleDelete(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log(this.colorize('red', 'Please specify a token name to delete'));
      return;
    }

    const tokenName = args[0];
    const confirm = await this.askQuestion(
      this.colorize('red', `Are you sure you want to delete "${tokenName}"? (y/N): `)
    );

    if (confirm.toLowerCase() !== 'y') {
      console.log('Deletion cancelled');
      return;
    }

    // Find and remove token
    if (this.registry) {
      for (const category of Object.values(this.registry.categories)) {
        const index = category.tokens.findIndex(t => t.name === tokenName);
        if (index !== -1) {
          const deletedToken = category.tokens.splice(index, 1)[0];
          
          this.session.unsavedChanges.push({
            type: 'delete',
            timestamp: new Date().toISOString(),
            tokenPath: tokenName,
            oldValue: deletedToken
          });

          console.log(this.colorize('green', `✅ Token "${tokenName}" deleted`));
          console.log(this.colorize('yellow', '⚠️  Remember to save your changes'));
          return;
        }
      }
    }

    console.log(this.colorize('red', `Token "${tokenName}" not found`));
  }

  private async handleValidate(): Promise<void> {
    if (!this.registry) return;

    console.log();
    console.log(this.colorize('blue', '🔍 Validating tokens...'));

    const report = await this.validator.validateRegistry(this.registry);
    this.displayValidationReport(report);
  }

  private displayValidationReport(report: ValidationReport): void {
    console.log();
    console.log(this.colorize('bright', '📊 Validation Report:'));
    console.log();

    if (report.summary.errorCount === 0 && report.summary.warningCount === 0) {
      console.log(this.colorize('green', '✅ All tokens are valid!'));
    } else {
      if (report.summary.errorCount > 0) {
        console.log(this.colorize('red', `❌ ${report.summary.errorCount} errors found:`));
        for (const error of report.errors.slice(0, 5)) {
          console.log(`   ${this.colorize('red', '•')} ${error.message}`);
        }
        if (report.errors.length > 5) {
          console.log(`   ${this.colorize('gray', `... and ${report.errors.length - 5} more errors`)}`);
        }
        console.log();
      }

      if (report.summary.warningCount > 0) {
        console.log(this.colorize('yellow', `⚠️  ${report.summary.warningCount} warnings found:`));
        for (const warning of report.warnings.slice(0, 3)) {
          console.log(`   ${this.colorize('yellow', '•')} ${warning.message}`);
        }
        if (report.warnings.length > 3) {
          console.log(`   ${this.colorize('gray', `... and ${report.warnings.length - 3} more warnings`)}`);
        }
      }
    }

    console.log(`Coverage: ${report.summary.coverage.toFixed(1)}%`);
    console.log();
  }

  private async handleExport(args: string[]): Promise<void> {
    const format = args[0] || 'css';
    console.log();
    console.log(this.colorize('blue', `📤 Exporting tokens as ${format}...`));

    if (this.registry) {
      try {
        const result = await this.exporter.export(this.registry, { format: format as any });
        console.log(this.colorize('green', `✅ Exported ${result.metadata.tokenCount} tokens`));
        console.log(this.colorize('gray', `File: ${result.filename}`));
      } catch (error) {
        console.log(this.colorize('red', `❌ Export failed: ${error}`));
      }
    }
  }

  private showStatus(): void {
    console.log();
    console.log(this.colorize('bright', '📈 Session Status:'));
    console.log();
    console.log(`Session ID: ${this.session.id}`);
    console.log(`Started: ${new Date(this.session.startTime).toLocaleString()}`);
    console.log(`Total tokens: ${this.registry?.metadata.totalTokens || 0}`);
    console.log(`Unsaved changes: ${this.session.unsavedChanges.length}`);
    console.log(`Current category: ${this.session.viewState.category}`);
    console.log();

    if (this.session.unsavedChanges.length > 0) {
      console.log(this.colorize('yellow', 'Pending changes:'));
      for (const change of this.session.unsavedChanges.slice(0, 5)) {
        console.log(`  ${change.type}: ${change.tokenPath}`);
      }
      if (this.session.unsavedChanges.length > 5) {
        console.log(`  ... and ${this.session.unsavedChanges.length - 5} more`);
      }
      console.log();
    }
  }

  private async handleSave(): Promise<void> {
    if (this.session.unsavedChanges.length === 0) {
      console.log(this.colorize('gray', 'No changes to save'));
      return;
    }

    console.log();
    console.log(this.colorize('blue', `💾 Saving ${this.session.unsavedChanges.length} changes...`));

    try {
      // Export updated tokens
      if (this.registry) {
        await this.exporter.export(this.registry, { format: 'css' });
        await this.exporter.export(this.registry, { format: 'ts' });
        
        this.session.unsavedChanges = [];
        console.log(this.colorize('green', '✅ Changes saved successfully'));
      }
    } catch (error) {
      console.log(this.colorize('red', `❌ Save failed: ${error}`));
    }
  }

  private handleExit(): void {
    if (this.session.unsavedChanges.length > 0) {
      console.log();
      console.log(this.colorize('yellow', `⚠️  You have ${this.session.unsavedChanges.length} unsaved changes`));
      console.log(this.colorize('gray', 'Consider saving before exiting'));
    }

    console.log();
    console.log(this.colorize('cyan', 'Thanks for using the Token Editor! 👋'));
    this.rl.close();
    process.exit(0);
  }

  private async askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private colorize(color: keyof CLIColors, text: string): string {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }
}

// Main CLI entry point
if (typeof require !== 'undefined' && require.main === module) {
  const editor = new TokenEditor();
  editor.start().catch(console.error);
}

export { TokenEditor };