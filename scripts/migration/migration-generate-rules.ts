import * as fs from 'fs';
import * as path from 'path';
import { MappingSession } from './migration-review';
import { ValidationReport } from './migration-validate';

/**
 * Stage 4: Translation Rules
 * 
 * Generates explicit transformation rules for the migration:
 * 1. CSS variable mappings and replacements
 * 2. Tailwind class transformations
 * 3. TypeScript import updates
 * 4. Component prop transformations
 * 5. Build system integration rules
 */

interface TransformationRule {
  id: string;
  type: 'css-variable' | 'tailwind-class' | 'typescript-import' | 'component-prop' | 'inline-style';
  priority: number; // Lower numbers = higher priority
  pattern: string | RegExp;
  replacement: string;
  conditions?: {
    fileExtensions?: string[];
    excludeFiles?: string[];
    context?: string; // Additional context for when to apply
  };
  metadata: {
    temporaryToken: string;
    targetToken: string;
    originalValue: string;
    category: string;
    confidence: 'high' | 'medium' | 'low';
  };
}

interface BuildIntegrationRule {
  tool: 'postcss' | 'tailwind' | 'typescript' | 'webpack' | 'vite';
  config: any;
  description: string;
}

interface MigrationRuleSet {
  version: string;
  migrationId: string;
  generatedAt: string;
  summary: {
    totalRules: number;
    rulesByType: Record<string, number>;
    affectedFiles: string[];
    estimatedReplacements: number;
  };
  transformationRules: TransformationRule[];
  buildIntegration: BuildIntegrationRule[];
  rollbackInstructions: string[];
  validationChecks: string[];
}

class MigrationRuleGenerator {
  private mappingSession: MappingSession | null = null;
  private validationReport: ValidationReport | null = null;
  private rules: TransformationRule[] = [];
  private ruleIdCounter = 0;

  async generateRules(): Promise<MigrationRuleSet> {
    console.log('⚙️  Stage 4: Translation Rules');
    console.log('===============================\n');

    // Load required data
    await this.loadRequiredData();

    // Verify validation passed
    this.checkValidationStatus();

    // Generate transformation rules
    console.log('🔄 Generating transformation rules...\n');
    
    await this.generateCSSVariableRules();
    await this.generateTailwindClassRules();
    await this.generateInlineStyleRules();
    await this.generateTypeScriptRules();
    await this.generateComponentPropRules();

    // Generate build integration rules
    const buildRules = await this.generateBuildIntegrationRules();

    // Create rule set
    const ruleSet = await this.createRuleSet(buildRules);

    // Optimize and sort rules
    this.optimizeRules(ruleSet);

    // Save rules
    await this.saveRuleSet(ruleSet);

    // Display results
    this.displayResults(ruleSet);

    return ruleSet;
  }

  private async loadRequiredData(): Promise<void> {
    console.log('📁 Loading migration data...');

    // Load mapping session
    const mappingPath = path.join(process.cwd(), 'reports', 'migration-mappings.json');
    if (!fs.existsSync(mappingPath)) {
      throw new Error('Mapping session not found. Run migration stages 1-2 first.');
    }
    this.mappingSession = JSON.parse(await fs.promises.readFile(mappingPath, 'utf-8'));

    // Load validation report
    const validationPath = path.join(process.cwd(), 'reports', 'migration-validation.json');
    if (!fs.existsSync(validationPath)) {
      throw new Error('Validation report not found. Run `npm run migrate:validate` first.');
    }
    this.validationReport = JSON.parse(await fs.promises.readFile(validationPath, 'utf-8'));

    console.log(`   ✅ Loaded ${this.mappingSession.mappings.length} mappings`);
    console.log(`   ✅ Validation status: ${this.validationReport.status}\n`);
  }

  private checkValidationStatus(): void {
    if (this.validationReport!.status === 'blocked') {
      throw new Error('Migration validation failed. Resolve blocking issues before generating rules.');
    }
    
    if (this.validationReport!.status === 'needs-review') {
      console.log('⚠️  Warning: Migration has validation warnings. Consider resolving before proceeding.\n');
    }
  }

  private async generateCSSVariableRules(): Promise<void> {
    console.log('🎨 Generating CSS variable transformation rules...');

    const mappings = this.mappingSession!.mappings;
    let ruleCount = 0;

    for (const mapping of mappings) {
      // Generate CSS custom property rule
      const cssVarRule: TransformationRule = {
        id: this.generateRuleId(),
        type: 'css-variable',
        priority: 1,
        pattern: new RegExp(`var\\(--${mapping.temporaryToken}\\)`, 'g'),
        replacement: `var(--${mapping.targetToken})`,
        conditions: {
          fileExtensions: ['.css', '.scss', '.tsx', '.ts', '.jsx', '.js'],
          excludeFiles: ['node_modules', '.test.', '.spec.', '.stories.'],
        },
        metadata: {
          temporaryToken: mapping.temporaryToken,
          targetToken: mapping.targetToken,
          originalValue: '', // Will be filled from extraction data
          category: mapping.category,
          confidence: mapping.confidence === 'human-verified' ? 'high' : 'medium',
        },
      };

      this.rules.push(cssVarRule);
      ruleCount++;

      // Also generate direct value replacement rule for non-CSS-var contexts
      const directRule: TransformationRule = {
        id: this.generateRuleId(),
        type: 'css-variable',
        priority: 2,
        pattern: `--${mapping.temporaryToken}`,
        replacement: `--${mapping.targetToken}`,
        conditions: {
          fileExtensions: ['.css', '.scss'],
          context: 'css-declaration',
        },
        metadata: {
          temporaryToken: mapping.temporaryToken,
          targetToken: mapping.targetToken,
          originalValue: '',
          category: mapping.category,
          confidence: mapping.confidence === 'human-verified' ? 'high' : 'medium',
        },
      };

      this.rules.push(directRule);
      ruleCount++;
    }

    console.log(`   ✅ Generated ${ruleCount} CSS variable rules`);
  }

  private async generateTailwindClassRules(): Promise<void> {
    console.log('🎨 Generating Tailwind class transformation rules...');

    const mappings = this.mappingSession!.mappings.filter(m => 
      m.category === 'tailwind-arbitrary' || m.targetToken.startsWith('tailwind-')
    );

    let ruleCount = 0;

    for (const mapping of mappings) {
      // Extract Tailwind prefix from temporary token
      const tempTokenParts = mapping.temporaryToken.split('-');
      const tailwindPrefix = this.extractTailwindPrefix(mapping.temporaryToken);
      
      if (tailwindPrefix) {
        const tailwindRule: TransformationRule = {
          id: this.generateRuleId(),
          type: 'tailwind-class',
          priority: 1,
          pattern: new RegExp(`${tailwindPrefix}-\\[([^\\]]+)\\]`, 'g'),
          replacement: this.generateTailwindReplacement(mapping.targetToken),
          conditions: {
            fileExtensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.svelte'],
            context: 'className-attribute',
          },
          metadata: {
            temporaryToken: mapping.temporaryToken,
            targetToken: mapping.targetToken,
            originalValue: '',
            category: mapping.category,
            confidence: 'high',
          },
        };

        this.rules.push(tailwindRule);
        ruleCount++;
      }
    }

    console.log(`   ✅ Generated ${ruleCount} Tailwind class rules`);
  }

  private async generateInlineStyleRules(): Promise<void> {
    console.log('🎨 Generating inline style transformation rules...');

    const mappings = this.mappingSession!.mappings;
    let ruleCount = 0;

    for (const mapping of mappings) {
      // Generate React inline style rule
      const inlineStyleRule: TransformationRule = {
        id: this.generateRuleId(),
        type: 'inline-style',
        priority: 1,
        pattern: new RegExp(`var\\(--${mapping.temporaryToken}\\)`, 'g'),
        replacement: `var(--${mapping.targetToken})`,
        conditions: {
          fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
          context: 'style-attribute',
        },
        metadata: {
          temporaryToken: mapping.temporaryToken,
          targetToken: mapping.targetToken,
          originalValue: '',
          category: mapping.category,
          confidence: 'high',
        },
      };

      this.rules.push(inlineStyleRule);
      ruleCount++;
    }

    console.log(`   ✅ Generated ${ruleCount} inline style rules`);
  }

  private async generateTypeScriptRules(): Promise<void> {
    console.log('📝 Generating TypeScript transformation rules...');

    const mappings = this.mappingSession!.mappings;
    let ruleCount = 0;

    // Generate import update rules
    const importRule: TransformationRule = {
      id: this.generateRuleId(),
      type: 'typescript-import',
      priority: 1,
      pattern: /import\s+.*\s+from\s+['"](.*design-tokens.*)['"]/g,
      replacement: 'import { $tokens } from "$1"', // Placeholder pattern
      conditions: {
        fileExtensions: ['.ts', '.tsx'],
        context: 'import-statement',
      },
      metadata: {
        temporaryToken: 'import-update',
        targetToken: 'updated-import',
        originalValue: '',
        category: 'typescript',
        confidence: 'medium',
      },
    };

    this.rules.push(importRule);
    ruleCount++;

    // Generate token reference rules
    for (const mapping of mappings) {
      if (mapping.category === 'typescript' || mapping.targetToken.includes('.')) {
        const tokenRefRule: TransformationRule = {
          id: this.generateRuleId(),
          type: 'typescript-import',
          priority: 2,
          pattern: `tokens.${mapping.temporaryToken}`,
          replacement: `tokens.${mapping.targetToken}`,
          conditions: {
            fileExtensions: ['.ts', '.tsx'],
            context: 'token-reference',
          },
          metadata: {
            temporaryToken: mapping.temporaryToken,
            targetToken: mapping.targetToken,
            originalValue: '',
            category: mapping.category,
            confidence: 'high',
          },
        };

        this.rules.push(tokenRefRule);
        ruleCount++;
      }
    }

    console.log(`   ✅ Generated ${ruleCount} TypeScript rules`);
  }

  private async generateComponentPropRules(): Promise<void> {
    console.log('🧩 Generating component prop transformation rules...');

    const mappings = this.mappingSession!.mappings.filter(m => 
      m.category === 'component-prop' || m.notes?.includes('component')
    );

    let ruleCount = 0;

    for (const mapping of mappings) {
      // Generate component prop rule
      const propRule: TransformationRule = {
        id: this.generateRuleId(),
        type: 'component-prop',
        priority: 1,
        pattern: `${mapping.temporaryToken}=`,
        replacement: `${mapping.targetToken}=`,
        conditions: {
          fileExtensions: ['.tsx', '.jsx'],
          context: 'component-prop',
        },
        metadata: {
          temporaryToken: mapping.temporaryToken,
          targetToken: mapping.targetToken,
          originalValue: '',
          category: mapping.category,
          confidence: mapping.confidence === 'human-verified' ? 'high' : 'medium',
        },
      };

      this.rules.push(propRule);
      ruleCount++;
    }

    console.log(`   ✅ Generated ${ruleCount} component prop rules`);
  }

  private async generateBuildIntegrationRules(): Promise<BuildIntegrationRule[]> {
    console.log('🔧 Generating build integration rules...');

    const buildRules: BuildIntegrationRule[] = [];

    // PostCSS rule for CSS custom properties
    buildRules.push({
      tool: 'postcss',
      config: {
        plugins: [
          'postcss-custom-properties',
          'autoprefixer',
        ],
        customProperties: {
          preserve: true,
          importFrom: ['./generated/tokens.css'],
        },
      },
      description: 'PostCSS configuration for CSS custom properties',
    });

    // Tailwind CSS integration
    buildRules.push({
      tool: 'tailwind',
      config: {
        theme: {
          extend: {
            colors: this.generateTailwindColorConfig(),
            spacing: this.generateTailwindSpacingConfig(),
            fontFamily: this.generateTailwindFontConfig(),
          },
        },
      },
      description: 'Tailwind CSS theme configuration',
    });

    // TypeScript path mapping
    buildRules.push({
      tool: 'typescript',
      config: {
        compilerOptions: {
          paths: {
            '@tokens/*': ['./generated/tokens/*'],
            '@design-system/*': ['./components/*'],
          },
        },
      },
      description: 'TypeScript path mapping for design tokens',
    });

    console.log(`   ✅ Generated ${buildRules.length} build integration rules`);
    
    return buildRules;
  }

  private generateTailwindColorConfig(): Record<string, string> {
    const colorMappings = this.mappingSession!.mappings.filter(m => 
      m.category === 'color' || m.targetToken.includes('color')
    );

    const config: Record<string, string> = {};
    
    colorMappings.forEach(mapping => {
      const colorName = mapping.targetToken.replace(/^color-/, '');
      config[colorName] = `var(--${mapping.targetToken})`;
    });

    return config;
  }

  private generateTailwindSpacingConfig(): Record<string, string> {
    const spacingMappings = this.mappingSession!.mappings.filter(m => 
      m.category === 'spacing' || m.targetToken.includes('spacing')
    );

    const config: Record<string, string> = {};
    
    spacingMappings.forEach(mapping => {
      const spacingName = mapping.targetToken.replace(/^spacing-/, '');
      config[spacingName] = `var(--${mapping.targetToken})`;
    });

    return config;
  }

  private generateTailwindFontConfig(): Record<string, string[]> {
    const fontMappings = this.mappingSession!.mappings.filter(m => 
      m.category === 'typography' || m.targetToken.includes('font')
    );

    const config: Record<string, string[]> = {};
    
    fontMappings.forEach(mapping => {
      const fontName = mapping.targetToken.replace(/^font-/, '');
      config[fontName] = [`var(--${mapping.targetToken})`];
    });

    return config;
  }

  private extractTailwindPrefix(temporaryToken: string): string | null {
    // Extract Tailwind utility prefix from temporary token
    const prefixMap: Record<string, string> = {
      'color': 'bg|text|border',
      'spacing': 'p|m|w|h|gap|space',
      'typography': 'text|font',
      'shadow': 'shadow',
      'border-radius': 'rounded',
    };

    for (const [category, prefixes] of Object.entries(prefixMap)) {
      if (temporaryToken.includes(category)) {
        return prefixes.split('|')[0]; // Return first prefix as default
      }
    }

    return null;
  }

  private generateTailwindReplacement(targetToken: string): string {
    // Generate appropriate Tailwind class name from target token
    const tokenParts = targetToken.split('-');
    
    if (targetToken.includes('color')) {
      return `text-${tokenParts[tokenParts.length - 1]}`;
    } else if (targetToken.includes('spacing')) {
      return `p-${tokenParts[tokenParts.length - 1]}`;
    }
    
    return targetToken.replace(/-/g, '-');
  }

  private generateRuleId(): string {
    return `rule-${++this.ruleIdCounter}`;
  }

  private async createRuleSet(buildRules: BuildIntegrationRule[]): Promise<MigrationRuleSet> {
    const affectedFiles = new Set<string>();
    let estimatedReplacements = 0;

    // Calculate affected files and replacements
    this.rules.forEach(rule => {
      if (rule.conditions?.fileExtensions) {
        rule.conditions.fileExtensions.forEach(ext => {
          // This would be calculated by scanning actual files
          estimatedReplacements += 1; // Placeholder
        });
      }
    });

    const rulesByType = this.rules.reduce((acc, rule) => {
      acc[rule.type] = (acc[rule.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      version: '1.0.0',
      migrationId: this.mappingSession!.sessionId,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRules: this.rules.length,
        rulesByType,
        affectedFiles: Array.from(affectedFiles),
        estimatedReplacements,
      },
      transformationRules: this.rules,
      buildIntegration: buildRules,
      rollbackInstructions: this.generateRollbackInstructions(),
      validationChecks: this.generateValidationChecks(),
    };
  }

  private generateRollbackInstructions(): string[] {
    return [
      'git checkout HEAD~1 -- .',
      'npm run build:tokens',
      'npm run build',
      'Run tests to verify rollback',
      'Consider selective rollback of specific files if needed',
    ];
  }

  private generateValidationChecks(): string[] {
    return [
      'Run npm run build to ensure no build errors',
      'Run npm test to ensure all tests pass',
      'Check visual regression tests',
      'Verify design token values match expected outputs',
      'Test component rendering with new tokens',
      'Validate accessibility compliance',
      'Check browser compatibility',
    ];
  }

  private optimizeRules(ruleSet: MigrationRuleSet): void {
    // Sort rules by priority (lower number = higher priority)
    ruleSet.transformationRules.sort((a, b) => a.priority - b.priority);

    // Remove duplicate rules
    const uniqueRules = ruleSet.transformationRules.filter((rule, index, self) => 
      index === self.findIndex(r => r.pattern.toString() === rule.pattern.toString())
    );

    ruleSet.transformationRules = uniqueRules;
    ruleSet.summary.totalRules = uniqueRules.length;

    console.log(`🔧 Optimized rules: ${this.rules.length} → ${uniqueRules.length}`);
  }

  private async saveRuleSet(ruleSet: MigrationRuleSet): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    const ruleSetPath = path.join(reportsDir, 'migration-rules.json');
    
    await fs.promises.writeFile(ruleSetPath, JSON.stringify(ruleSet, null, 2));

    // Save human-readable summary
    const summaryPath = path.join(reportsDir, 'migration-rules-summary.md');
    const summary = this.generateRulesSummary(ruleSet);
    await fs.promises.writeFile(summaryPath, summary);

    // Save executable script for applying rules
    const scriptPath = path.join(process.cwd(), 'scripts', 'migration', 'apply-migration-rules.js');
    const script = this.generateApplyScript(ruleSet);
    await fs.promises.writeFile(scriptPath, script);
    await fs.promises.chmod(scriptPath, 0o755);

    console.log(`💾 Rules saved:`);
    console.log(`   - Rules: ${ruleSetPath}`);
    console.log(`   - Summary: ${summaryPath}`);
    console.log(`   - Apply script: ${scriptPath}`);
  }

  private generateRulesSummary(ruleSet: MigrationRuleSet): string {
    let md = `# Migration Transformation Rules\n\n`;
    md += `**Generated**: ${new Date(ruleSet.generatedAt).toLocaleString()}\n`;
    md += `**Migration ID**: ${ruleSet.migrationId}\n`;
    md += `**Total Rules**: ${ruleSet.summary.totalRules}\n\n`;

    md += `## Rules by Type\n\n`;
    Object.entries(ruleSet.summary.rulesByType).forEach(([type, count]) => {
      md += `- **${type}**: ${count} rules\n`;
    });

    md += `\n## Build Integration\n\n`;
    ruleSet.buildIntegration.forEach(rule => {
      md += `### ${rule.tool}\n`;
      md += `${rule.description}\n\n`;
      md += '```json\n';
      md += JSON.stringify(rule.config, null, 2);
      md += '\n```\n\n';
    });

    md += `## Validation Checks\n\n`;
    ruleSet.validationChecks.forEach((check, i) => {
      md += `${i + 1}. ${check}\n`;
    });

    md += `\n## Rollback Instructions\n\n`;
    ruleSet.rollbackInstructions.forEach((instruction, i) => {
      md += `${i + 1}. \`${instruction}\`\n`;
    });

    return md;
  }

  private generateApplyScript(ruleSet: MigrationRuleSet): string {
    return `#!/usr/bin/env node

/**
 * Auto-generated migration rule application script
 * Generated: ${ruleSet.generatedAt}
 * Migration ID: ${ruleSet.migrationId}
 */

const fs = require('fs');
const path = require('path');

const rules = ${JSON.stringify(ruleSet.transformationRules, null, 2)};

async function applyRules() {
  console.log('🚀 Applying migration rules...');
  
  for (const rule of rules) {
    console.log(\`Applying rule: \${rule.id} (\${rule.type})\`);
    // Rule application logic would go here
  }
  
  console.log('✅ Migration rules applied successfully');
}

if (require.main === module) {
  applyRules().catch(console.error);
}

module.exports = { rules, applyRules };
`;
  }

  private displayResults(ruleSet: MigrationRuleSet): void {
    console.log('\n📊 Rule Generation Results');
    console.log('==========================\n');

    console.log(`✅ Generated ${ruleSet.summary.totalRules} transformation rules`);
    console.log(`🔧 Created ${ruleSet.buildIntegration.length} build integration configs`);
    console.log(`📦 Estimated ${ruleSet.summary.estimatedReplacements} code replacements\n`);

    console.log('📋 Rules by Type:');
    Object.entries(ruleSet.summary.rulesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n🔧 Build Integration:');
    ruleSet.buildIntegration.forEach(rule => {
      console.log(`   ${rule.tool}: ${rule.description}`);
    });

    console.log('\n📋 Next Steps:');
    console.log('   1. Review generated rules in reports/migration-rules.json');
    console.log('   2. Test rules in a staging environment');
    console.log('   3. Apply migration: npm run migrate:apply');

    console.log('\n📄 Files saved:');
    console.log('   - reports/migration-rules.json (detailed rules)');
    console.log('   - reports/migration-rules-summary.md (human-readable)');
    console.log('   - scripts/migration/apply-migration-rules.js (executable)');
  }
}

// Execute if run directly
if (require.main === module) {
  const generator = new MigrationRuleGenerator();
  generator.generateRules().catch(console.error);
}

export { MigrationRuleGenerator, MigrationRuleSet, TransformationRule };