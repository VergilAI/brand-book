import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { HardcodedValue, ExtractionReport } from './migration-extract';

/**
 * Stage 2: Human Review Interface
 * 
 * Interactive CLI for reviewing extracted values and mapping them to semantic tokens:
 * 1. Present extracted values with context
 * 2. Allow human mapping to target design tokens
 * 3. Provide suggestions and auto-mapping capabilities
 * 4. Save mapping decisions for validation stage
 */

interface TokenMapping {
  temporaryToken: string;
  targetToken: string;
  semanticName: string;
  category: string;
  confidence: 'auto' | 'human-verified' | 'human-custom';
  notes?: string;
  reviewedBy?: string;
  reviewedAt: string;
}

interface MappingSession {
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  totalValues: number;
  mappedValues: number;
  skippedValues: number;
  mappings: TokenMapping[];
  targetTokens: TargetTokenSet;
}

interface TargetTokenSet {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  animations: Record<string, string>;
}

class MigrationReviewer {
  private rl: readline.Interface;
  private session: MappingSession;
  private extractionReport: ExtractionReport | null = null;
  private targetTokens: TargetTokenSet;
  private currentValueIndex = 0;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.session = {
      sessionId: this.generateSessionId(),
      startedAt: new Date().toISOString(),
      totalValues: 0,
      mappedValues: 0,
      skippedValues: 0,
      mappings: [],
      targetTokens: this.loadTargetTokens(),
    };

    this.targetTokens = this.loadTargetTokens();
  }

  async review(): Promise<void> {
    console.log('🔍 Stage 2: Human Review Interface');
    console.log('===================================\n');

    try {
      // Load extraction report
      await this.loadExtractionReport();
      
      // Initialize session
      this.session.totalValues = this.extractionReport!.extractedValues.length;
      
      console.log(`📋 Review Session Started`);
      console.log(`   Session ID: ${this.session.sessionId}`);
      console.log(`   Values to review: ${this.session.totalValues}\n`);

      // Show available commands
      this.showHelp();

      // Start interactive review
      await this.startInteractiveReview();

      // Save final session
      await this.saveSession();

      console.log('\n✅ Review session completed!');
      console.log(`📊 Results:`);
      console.log(`   - Mapped: ${this.session.mappedValues}`);
      console.log(`   - Skipped: ${this.session.skippedValues}`);
      console.log(`   - Remaining: ${this.session.totalValues - this.session.mappedValues - this.session.skippedValues}`);

    } catch (error) {
      console.error('❌ Review failed:', error);
    } finally {
      this.rl.close();
    }
  }

  private async loadExtractionReport(): Promise<void> {
    const reportPath = path.join(process.cwd(), 'reports', 'migration-discovery.json');
    
    if (!fs.existsSync(reportPath)) {
      throw new Error('No extraction report found. Run `npm run migrate:extract` first.');
    }

    const reportContent = await fs.promises.readFile(reportPath, 'utf-8');
    this.extractionReport = JSON.parse(reportContent);
    console.log(`📁 Loaded extraction report: ${this.extractionReport!.extractedValues.length} values`);
  }

  private loadTargetTokens(): TargetTokenSet {
    // Load target design tokens from various sources
    const tokenSources = [
      path.join(process.cwd(), 'design-tokens', 'active', 'source', 'colors.yaml'),
      path.join(process.cwd(), 'design-tokens', 'active', 'source', 'spacing.yaml'),
      path.join(process.cwd(), 'design-tokens', 'active', 'source', 'typography.yaml'),
      path.join(process.cwd(), 'design-tokens', 'active', 'source', 'shadows.yaml'),
      path.join(process.cwd(), 'generated', 'tokens.json'),
    ];

    // Start with default token set
    let tokens: TargetTokenSet = {
      colors: {
        'vergil-purple': '#7B00FF',
        'vergil-off-black': '#1D1D1F',
        'vergil-off-white': '#F5F5F7',
        'cosmic-purple': '#6366F1',
        'neural-blue': '#3B82F6',
        'quantum-green': '#10B981',
        'plasma-pink': '#EC4899',
        'void-black': '#000000',
        'light-white': '#FFFFFF',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
      },
      typography: {
        'text-xs': '0.75rem',
        'text-sm': '0.875rem',
        'text-base': '1rem',
        'text-lg': '1.125rem',
        'text-xl': '1.25rem',
        'text-2xl': '1.5rem',
        'text-3xl': '1.875rem',
        'text-4xl': '2.25rem',
      },
      shadows: {
        'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'rounded-none': '0px',
        'rounded-sm': '0.125rem',
        'rounded': '0.25rem',
        'rounded-md': '0.375rem',
        'rounded-lg': '0.5rem',
        'rounded-xl': '0.75rem',
        'rounded-2xl': '1rem',
        'rounded-3xl': '1.5rem',
        'rounded-full': '9999px',
      },
      animations: {
        'duration-75': '75ms',
        'duration-100': '100ms',
        'duration-150': '150ms',
        'duration-200': '200ms',
        'duration-300': '300ms',
        'duration-500': '500ms',
        'duration-700': '700ms',
        'duration-1000': '1000ms',
      },
    };

    // Try to load from existing token files
    try {
      const generatedTokensPath = path.join(process.cwd(), 'generated', 'tokens.json');
      if (fs.existsSync(generatedTokensPath)) {
        const generatedTokens = JSON.parse(fs.readFileSync(generatedTokensPath, 'utf-8'));
        // Merge with default tokens
        tokens = this.mergeTokenSets(tokens, this.convertGeneratedTokens(generatedTokens));
      }
    } catch (error) {
      console.warn('⚠️  Could not load generated tokens, using defaults');
    }

    return tokens;
  }

  private mergeTokenSets(target: TargetTokenSet, source: Partial<TargetTokenSet>): TargetTokenSet {
    return {
      colors: { ...target.colors, ...source.colors },
      spacing: { ...target.spacing, ...source.spacing },
      typography: { ...target.typography, ...source.typography },
      shadows: { ...target.shadows, ...source.shadows },
      borderRadius: { ...target.borderRadius, ...source.borderRadius },
      animations: { ...target.animations, ...source.animations },
    };
  }

  private convertGeneratedTokens(generated: any): Partial<TargetTokenSet> {
    // Convert generated token format to our format
    const converted: Partial<TargetTokenSet> = {};

    if (generated.color) {
      converted.colors = Object.entries(generated.color).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
    }

    if (generated.spacing) {
      converted.spacing = Object.entries(generated.spacing).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);
    }

    return converted;
  }

  private generateSessionId(): string {
    return `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private showHelp(): void {
    console.log('📖 Commands:');
    console.log('  [number] - Select a suggested token by number');
    console.log('  custom   - Enter a custom token name');
    console.log('  skip     - Skip this value for now');
    console.log('  auto     - Auto-map similar values');
    console.log('  search   - Search available tokens');
    console.log('  list     - List all available tokens');
    console.log('  help     - Show this help');
    console.log('  quit     - Save and exit');
    console.log('  stats    - Show session statistics\n');
  }

  private async startInteractiveReview(): Promise<void> {
    const values = this.extractionReport!.extractedValues;
    
    while (this.currentValueIndex < values.length) {
      const currentValue = values[this.currentValueIndex];
      await this.reviewValue(currentValue);
    }
  }

  private async reviewValue(value: HardcodedValue): Promise<void> {
    console.clear();
    this.showProgress();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Show value details
    console.log(`🎯 Reviewing: ${value.type.toUpperCase()}`);
    console.log(`   Value: ${value.value}`);
    console.log(`   Usages: ${value.usages.length} files`);
    console.log(`   Temporary Token: ${value.temporaryToken}\n`);

    // Show usage examples
    console.log('📝 Usage Examples:');
    value.usages.slice(0, 3).forEach((usage, i) => {
      console.log(`   ${i + 1}. ${usage.file}:${usage.line}`);
      console.log(`      ${usage.context}`);
    });
    if (value.usages.length > 3) {
      console.log(`   ... and ${value.usages.length - 3} more`);
    }
    console.log('');

    // Show suggestions
    const suggestions = this.generateTokenSuggestions(value);
    if (suggestions.length > 0) {
      console.log('💡 Suggested Tokens:');
      suggestions.forEach((suggestion, i) => {
        console.log(`   ${i + 1}. ${suggestion.token} (${suggestion.value}) - ${suggestion.reason}`);
      });
      console.log('');
    }

    // Get user input
    const answer = await this.askQuestion('Choose action (number/custom/skip/auto/search/help): ');
    await this.handleAnswer(answer, value, suggestions);
  }

  private showProgress(): void {
    const progress = Math.round((this.currentValueIndex / this.session.totalValues) * 100);
    const bar = '█'.repeat(Math.floor(progress / 2)) + '░'.repeat(50 - Math.floor(progress / 2));
    
    console.log(`Progress: [${bar}] ${progress}% (${this.currentValueIndex}/${this.session.totalValues})`);
    console.log(`Mapped: ${this.session.mappedValues} | Skipped: ${this.session.skippedValues}`);
  }

  private generateTokenSuggestions(value: HardcodedValue): Array<{token: string, value: string, reason: string}> {
    const suggestions: Array<{token: string, value: string, reason: string}> = [];
    const targetTokens = this.targetTokens[value.type as keyof TargetTokenSet] || {};

    // Exact value matches
    Object.entries(targetTokens).forEach(([token, tokenValue]) => {
      if (tokenValue === value.value) {
        suggestions.push({
          token,
          value: tokenValue,
          reason: 'Exact match'
        });
      }
    });

    // Similar value matches (for spacing, colors, etc.)
    if (value.type === 'spacing') {
      const numericValue = parseFloat(value.value);
      Object.entries(targetTokens).forEach(([token, tokenValue]) => {
        const targetNumeric = parseFloat(tokenValue);
        if (Math.abs(numericValue - targetNumeric) < 0.1) {
          suggestions.push({
            token,
            value: tokenValue,
            reason: `Similar value (${tokenValue})`
          });
        }
      });
    }

    // Context-based suggestions
    if (value.suggestedNames) {
      value.suggestedNames.forEach(name => {
        const matchingToken = Object.keys(targetTokens).find(token => 
          token.includes(name) || name.includes(token)
        );
        if (matchingToken) {
          suggestions.push({
            token: matchingToken,
            value: targetTokens[matchingToken],
            reason: 'Name similarity'
          });
        }
      });
    }

    // Remove duplicates and limit to top 5
    const unique = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.token === suggestion.token)
    );

    return unique.slice(0, 5);
  }

  private async handleAnswer(
    answer: string, 
    value: HardcodedValue, 
    suggestions: Array<{token: string, value: string, reason: string}>
  ): Promise<void> {
    const trimmed = answer.trim().toLowerCase();

    switch (trimmed) {
      case 'skip':
        this.session.skippedValues++;
        this.currentValueIndex++;
        break;

      case 'help':
        this.showHelp();
        await this.askQuestion('Press Enter to continue...');
        break;

      case 'quit':
        await this.saveSession();
        process.exit(0);

      case 'stats':
        this.showStats();
        await this.askQuestion('Press Enter to continue...');
        break;

      case 'auto':
        await this.autoMapSimilarValues(value);
        break;

      case 'search':
        await this.searchTokens(value);
        break;

      case 'list':
        this.listAvailableTokens(value.type);
        await this.askQuestion('Press Enter to continue...');
        break;

      case 'custom':
        await this.handleCustomMapping(value);
        break;

      default:
        // Check if it's a number selection
        const num = parseInt(trimmed);
        if (!isNaN(num) && num > 0 && num <= suggestions.length) {
          await this.createMapping(value, suggestions[num - 1].token, 'human-verified');
        } else {
          console.log('❌ Invalid option. Type "help" for commands.');
          await this.askQuestion('Press Enter to try again...');
        }
        break;
    }
  }

  private async autoMapSimilarValues(value: HardcodedValue): Promise<void> {
    console.log(`🤖 Auto-mapping values similar to "${value.value}"...`);
    
    const values = this.extractionReport!.extractedValues;
    const similarValues = values.filter(v => 
      v.type === value.type && 
      v.value === value.value &&
      !this.session.mappings.find(m => m.temporaryToken === v.temporaryToken)
    );

    if (similarValues.length === 0) {
      console.log('No similar values found.');
      await this.askQuestion('Press Enter to continue...');
      return;
    }

    const suggestions = this.generateTokenSuggestions(value);
    if (suggestions.length === 0) {
      console.log('No suitable auto-mapping suggestions found.');
      await this.askQuestion('Press Enter to continue...');
      return;
    }

    console.log(`Found ${similarValues.length} similar values.`);
    console.log(`Best suggestion: ${suggestions[0].token} (${suggestions[0].reason})`);
    
    const confirm = await this.askQuestion('Apply this mapping to all similar values? (y/n): ');
    
    if (confirm.toLowerCase() === 'y') {
      for (const similarValue of similarValues) {
        await this.createMapping(similarValue, suggestions[0].token, 'auto');
      }
      console.log(`✅ Auto-mapped ${similarValues.length} values`);
    }

    await this.askQuestion('Press Enter to continue...');
  }

  private async searchTokens(value: HardcodedValue): Promise<void> {
    const query = await this.askQuestion('Enter search term: ');
    const targetTokens = this.targetTokens[value.type as keyof TargetTokenSet] || {};
    
    const matches = Object.entries(targetTokens).filter(([token, tokenValue]) =>
      token.toLowerCase().includes(query.toLowerCase()) ||
      tokenValue.toLowerCase().includes(query.toLowerCase())
    );

    if (matches.length === 0) {
      console.log('No matches found.');
    } else {
      console.log(`\n🔍 Search results for "${query}":`);
      matches.forEach(([token, tokenValue], i) => {
        console.log(`   ${i + 1}. ${token} = ${tokenValue}`);
      });
      
      const selection = await this.askQuestion('\nSelect token number (or Enter to cancel): ');
      const num = parseInt(selection);
      
      if (!isNaN(num) && num > 0 && num <= matches.length) {
        await this.createMapping(value, matches[num - 1][0], 'human-verified');
        return;
      }
    }

    await this.askQuestion('Press Enter to continue...');
  }

  private listAvailableTokens(type: string): void {
    const targetTokens = this.targetTokens[type as keyof TargetTokenSet] || {};
    
    console.log(`\n📋 Available ${type} tokens:`);
    Object.entries(targetTokens).forEach(([token, value]) => {
      console.log(`   ${token} = ${value}`);
    });
  }

  private async handleCustomMapping(value: HardcodedValue): Promise<void> {
    const customToken = await this.askQuestion('Enter custom token name: ');
    
    if (customToken.trim()) {
      await this.createMapping(value, customToken.trim(), 'human-custom');
    } else {
      console.log('❌ Token name cannot be empty.');
      await this.askQuestion('Press Enter to continue...');
    }
  }

  private async createMapping(value: HardcodedValue, targetToken: string, confidence: TokenMapping['confidence']): Promise<void> {
    const mapping: TokenMapping = {
      temporaryToken: value.temporaryToken,
      targetToken,
      semanticName: targetToken,
      category: value.category || value.type,
      confidence,
      reviewedAt: new Date().toISOString(),
    };

    // Add notes for custom mappings
    if (confidence === 'human-custom') {
      const notes = await this.askQuestion('Add notes (optional): ');
      if (notes.trim()) {
        mapping.notes = notes.trim();
      }
    }

    this.session.mappings.push(mapping);
    this.session.mappedValues++;
    this.currentValueIndex++;

    console.log(`✅ Mapped ${value.temporaryToken} → ${targetToken}`);
    
    // Auto-save progress every 10 mappings
    if (this.session.mappings.length % 10 === 0) {
      await this.saveSession();
      console.log('💾 Progress saved');
    }
  }

  private showStats(): void {
    console.log('\n📊 Session Statistics:');
    console.log(`   Session ID: ${this.session.sessionId}`);
    console.log(`   Started: ${new Date(this.session.startedAt).toLocaleString()}`);
    console.log(`   Total Values: ${this.session.totalValues}`);
    console.log(`   Mapped: ${this.session.mappedValues}`);
    console.log(`   Skipped: ${this.session.skippedValues}`);
    console.log(`   Remaining: ${this.session.totalValues - this.session.mappedValues - this.session.skippedValues}`);
    
    if (this.session.mappings.length > 0) {
      const confidenceCounts = this.session.mappings.reduce((acc, m) => {
        acc[m.confidence] = (acc[m.confidence] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('\n   Mapping Confidence:');
      Object.entries(confidenceCounts).forEach(([confidence, count]) => {
        console.log(`     ${confidence}: ${count}`);
      });
    }
  }

  private async saveSession(): Promise<void> {
    const sessionsDir = path.join(process.cwd(), 'reports', 'migration-sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }

    this.session.completedAt = new Date().toISOString();
    
    const sessionPath = path.join(sessionsDir, `${this.session.sessionId}.json`);
    await fs.promises.writeFile(sessionPath, JSON.stringify(this.session, null, 2));

    // Also save the latest session as current
    const currentPath = path.join(process.cwd(), 'reports', 'migration-mappings.json');
    await fs.promises.writeFile(currentPath, JSON.stringify(this.session, null, 2));
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, resolve);
    });
  }
}

// Execute if run directly
if (require.main === module) {
  const reviewer = new MigrationReviewer();
  reviewer.review().catch(console.error);
}

export { MigrationReviewer, TokenMapping, MappingSession };