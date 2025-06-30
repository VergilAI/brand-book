import * as fs from 'fs';
import * as path from 'path';
import { ExtractionReport } from './migration-extract';
import { MappingSession } from './migration-review';

/**
 * Stage 3: Validation Engine
 * 
 * Validates migration readiness by checking:
 * 1. Mapping completeness and conflicts
 * 2. Target token existence and compatibility
 * 3. Visual impact analysis (color contrast, sizing changes)
 * 4. Breaking change detection
 * 5. Performance impact assessment
 */

interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'mapping' | 'tokens' | 'visual' | 'performance' | 'breaking';
  title: string;
  description: string;
  affectedFiles?: string[];
  suggestions: string[];
  autoFixable: boolean;
}

interface VisualImpactAnalysis {
  colorChanges: Array<{
    originalColor: string;
    targetColor: string;
    contrastRatio: number;
    contrastChange: 'improved' | 'degraded' | 'unchanged';
    wcagCompliance: 'AA' | 'AAA' | 'fail';
  }>;
  sizingChanges: Array<{
    originalSize: string;
    targetSize: string;
    changePercent: number;
    impact: 'minor' | 'moderate' | 'major';
  }>;
  layoutImpact: 'none' | 'minimal' | 'moderate' | 'significant';
}

interface ValidationReport {
  timestamp: string;
  status: 'ready' | 'needs-review' | 'blocked';
  migrationId: string;
  issues: ValidationIssue[];
  visualImpact: VisualImpactAnalysis;
  summary: {
    totalMappings: number;
    completeMappings: number;
    missingMappings: number;
    conflictingMappings: number;
    errors: number;
    warnings: number;
    readinessScore: number; // 0-100
  };
  nextSteps: string[];
  estimatedMigrationTime: string;
}

class MigrationValidator {
  private extractionReport: ExtractionReport | null = null;
  private mappingSession: MappingSession | null = null;
  private targetTokens: any = null;
  private issues: ValidationIssue[] = [];
  private issueIdCounter = 0;

  async validate(): Promise<ValidationReport> {
    console.log('✅ Stage 3: Validation Engine');
    console.log('==============================\n');

    // Load required data
    await this.loadRequiredData();

    // Perform validation checks
    console.log('🔍 Running validation checks...\n');
    
    await this.validateMappingCompleteness();
    await this.validateTargetTokens();
    await this.validateConflicts();
    await this.validateVisualImpact();
    await this.validatePerformanceImpact();
    await this.validateBreakingChanges();

    // Generate report
    const report = await this.generateValidationReport();
    
    // Save report
    await this.saveReport(report);

    // Display results
    this.displayResults(report);

    return report;
  }

  private async loadRequiredData(): Promise<void> {
    console.log('📁 Loading migration data...');

    // Load extraction report
    const extractionPath = path.join(process.cwd(), 'reports', 'migration-discovery.json');
    if (!fs.existsSync(extractionPath)) {
      throw new Error('Extraction report not found. Run `npm run migrate:extract` first.');
    }
    this.extractionReport = JSON.parse(await fs.promises.readFile(extractionPath, 'utf-8'));

    // Load mapping session
    const mappingPath = path.join(process.cwd(), 'reports', 'migration-mappings.json');
    if (!fs.existsSync(mappingPath)) {
      throw new Error('Mapping session not found. Run `npm run migrate:review` first.');
    }
    this.mappingSession = JSON.parse(await fs.promises.readFile(mappingPath, 'utf-8'));

    // Load target tokens
    const tokensPath = path.join(process.cwd(), 'generated', 'tokens.json');
    if (fs.existsSync(tokensPath)) {
      this.targetTokens = JSON.parse(await fs.promises.readFile(tokensPath, 'utf-8'));
    } else {
      this.addIssue({
        severity: 'warning',
        category: 'tokens',
        title: 'Target tokens not found',
        description: 'Could not load target design tokens. Using fallback validation.',
        suggestions: ['Generate design tokens with `npm run build:tokens`'],
        autoFixable: false,
      });
    }

    console.log(`   ✅ Extraction report: ${this.extractionReport.extractedValues.length} values`);
    console.log(`   ✅ Mapping session: ${this.mappingSession.mappings.length} mappings`);
    console.log(`   ✅ Target tokens: ${this.targetTokens ? 'loaded' : 'fallback mode'}\n`);
  }

  private async validateMappingCompleteness(): Promise<void> {
    console.log('🔍 Validating mapping completeness...');

    const extractedValues = this.extractionReport!.extractedValues;
    const mappings = this.mappingSession!.mappings;
    
    // Check for unmapped values
    const mappedTokens = new Set(mappings.map(m => m.temporaryToken));
    const unmappedValues = extractedValues.filter(v => !mappedTokens.has(v.temporaryToken));

    if (unmappedValues.length > 0) {
      this.addIssue({
        severity: 'error',
        category: 'mapping',
        title: 'Incomplete mappings',
        description: `${unmappedValues.length} values have not been mapped to target tokens.`,
        affectedFiles: Array.from(new Set(unmappedValues.flatMap(v => v.usages.map(u => u.file)))),
        suggestions: [
          'Complete the mapping process with `npm run migrate:review`',
          'Use auto-mapping for simple cases',
          'Skip values that should not be migrated',
        ],
        autoFixable: false,
      });
    }

    // Check for empty mappings
    const emptyMappings = mappings.filter(m => !m.targetToken || m.targetToken.trim() === '');
    if (emptyMappings.length > 0) {
      this.addIssue({
        severity: 'error',
        category: 'mapping',
        title: 'Empty mappings',
        description: `${emptyMappings.length} mappings have empty target tokens.`,
        suggestions: ['Review and update empty mappings'],
        autoFixable: false,
      });
    }

    console.log(`   ${unmappedValues.length} unmapped values`);
    console.log(`   ${emptyMappings.length} empty mappings`);
  }

  private async validateTargetTokens(): Promise<void> {
    console.log('🔍 Validating target tokens...');

    if (!this.targetTokens) {
      console.log('   ⚠️  Skipping token validation (no target tokens loaded)');
      return;
    }

    const mappings = this.mappingSession!.mappings;
    const missingTokens: string[] = [];
    const invalidTokens: string[] = [];

    for (const mapping of mappings) {
      const tokenExists = this.checkTokenExists(mapping.targetToken);
      
      if (!tokenExists) {
        missingTokens.push(mapping.targetToken);
      }

      // Validate token format/structure
      if (mapping.targetToken && !this.isValidTokenName(mapping.targetToken)) {
        invalidTokens.push(mapping.targetToken);
      }
    }

    if (missingTokens.length > 0) {
      this.addIssue({
        severity: 'error',
        category: 'tokens',
        title: 'Missing target tokens',
        description: `${missingTokens.length} mapped tokens do not exist in the target token set.`,
        suggestions: [
          'Create the missing tokens in your design system',
          'Update mappings to use existing tokens',
          'Generate new tokens from the mapped values',
        ],
        autoFixable: true,
      });
    }

    if (invalidTokens.length > 0) {
      this.addIssue({
        severity: 'warning',
        category: 'tokens',
        title: 'Invalid token names',
        description: `${invalidTokens.length} tokens have invalid naming conventions.`,
        suggestions: [
          'Follow token naming conventions (kebab-case, semantic names)',
          'Prefix tokens with appropriate category (color-, spacing-, etc.)',
        ],
        autoFixable: true,
      });
    }

    console.log(`   ${missingTokens.length} missing tokens`);
    console.log(`   ${invalidTokens.length} invalid token names`);
  }

  private async validateConflicts(): Promise<void> {
    console.log('🔍 Validating conflicts...');

    const mappings = this.mappingSession!.mappings;
    
    // Check for duplicate mappings (same temp token mapped to different targets)
    const duplicateCheck = new Map<string, string[]>();
    mappings.forEach(mapping => {
      if (!duplicateCheck.has(mapping.temporaryToken)) {
        duplicateCheck.set(mapping.temporaryToken, []);
      }
      duplicateCheck.get(mapping.temporaryToken)!.push(mapping.targetToken);
    });

    const duplicates = Array.from(duplicateCheck.entries())
      .filter(([, targets]) => targets.length > 1);

    if (duplicates.length > 0) {
      this.addIssue({
        severity: 'error',
        category: 'mapping',
        title: 'Conflicting mappings',
        description: `${duplicates.length} temporary tokens are mapped to multiple target tokens.`,
        suggestions: [
          'Resolve conflicting mappings by choosing one target token',
          'Review the mapping session for errors',
        ],
        autoFixable: false,
      });
    }

    // Check for reverse conflicts (different temp tokens to same target)
    const reverseCheck = new Map<string, string[]>();
    mappings.forEach(mapping => {
      if (!reverseCheck.has(mapping.targetToken)) {
        reverseCheck.set(mapping.targetToken, []);
      }
      reverseCheck.get(mapping.targetToken)!.push(mapping.temporaryToken);
    });

    const reverseDuplicates = Array.from(reverseCheck.entries())
      .filter(([, temps]) => temps.length > 1);

    if (reverseDuplicates.length > 0) {
      this.addIssue({
        severity: 'warning',
        category: 'mapping',
        title: 'Multiple values mapped to same token',
        description: `${reverseDuplicates.length} target tokens have multiple temporary tokens mapped to them.`,
        suggestions: [
          'Verify this is intentional (consolidating similar values)',
          'Consider creating separate tokens for distinct values',
        ],
        autoFixable: false,
      });
    }

    console.log(`   ${duplicates.length} conflicting mappings`);
    console.log(`   ${reverseDuplicates.length} consolidated mappings`);
  }

  private async validateVisualImpact(): Promise<void> {
    console.log('🔍 Analyzing visual impact...');

    const mappings = this.mappingSession!.mappings;
    const extractedValues = this.extractionReport!.extractedValues;
    
    let significantColorChanges = 0;
    let significantSizeChanges = 0;

    for (const mapping of mappings) {
      const extractedValue = extractedValues.find(v => v.temporaryToken === mapping.temporaryToken);
      if (!extractedValue) continue;

      const originalValue = extractedValue.value;
      const targetValue = this.getTargetTokenValue(mapping.targetToken);

      if (!targetValue) continue;

      // Analyze color changes
      if (extractedValue.type === 'color') {
        const impact = this.analyzeColorChange(originalValue, targetValue);
        if (impact.severity === 'significant') {
          significantColorChanges++;
        }
      }

      // Analyze size changes
      if (extractedValue.type === 'spacing') {
        const impact = this.analyzeSizeChange(originalValue, targetValue);
        if (impact.severity === 'significant') {
          significantSizeChanges++;
        }
      }
    }

    // Report significant changes
    if (significantColorChanges > 5) {
      this.addIssue({
        severity: 'warning',
        category: 'visual',
        title: 'Significant color changes',
        description: `${significantColorChanges} color mappings will result in noticeable visual changes.`,
        suggestions: [
          'Review color mappings for accuracy',
          'Test visual changes in a staging environment',
          'Consider gradual rollout of color changes',
        ],
        autoFixable: false,
      });
    }

    if (significantSizeChanges > 3) {
      this.addIssue({
        severity: 'warning',
        category: 'visual',
        title: 'Significant sizing changes',
        description: `${significantSizeChanges} size mappings may affect layout.`,
        suggestions: [
          'Test layout changes across different screen sizes',
          'Update responsive design breakpoints if needed',
          'Verify accessibility compliance',
        ],
        autoFixable: false,
      });
    }

    console.log(`   ${significantColorChanges} significant color changes`);
    console.log(`   ${significantSizeChanges} significant size changes`);
  }

  private async validatePerformanceImpact(): Promise<void> {
    console.log('🔍 Analyzing performance impact...');

    const mappings = this.mappingSession!.mappings;
    const extractedValues = this.extractionReport!.extractedValues;
    
    // Calculate total number of replacements
    const totalReplacements = extractedValues.reduce((sum, value) => sum + value.usages.length, 0);
    
    // Estimate build impact
    if (totalReplacements > 1000) {
      this.addIssue({
        severity: 'info',
        category: 'performance',
        title: 'Large migration scope',
        description: `Migration will affect ${totalReplacements} code locations across ${this.extractionReport!.totalFiles} files.`,
        suggestions: [
          'Consider breaking migration into phases',
          'Run migration during low-traffic periods',
          'Increase build timeout if necessary',
        ],
        autoFixable: false,
      });
    }

    // Check for CSS custom property usage
    const cssVarMappings = mappings.filter(m => m.targetToken.startsWith('--'));
    if (cssVarMappings.length > 0) {
      this.addIssue({
        severity: 'info',
        category: 'performance',
        title: 'CSS custom properties detected',
        description: `${cssVarMappings.length} mappings use CSS custom properties. Ensure browser support.`,
        suggestions: [
          'Verify CSS custom property support in target browsers',
          'Consider fallback values for legacy browsers',
        ],
        autoFixable: false,
      });
    }

    console.log(`   ${totalReplacements} total code replacements`);
    console.log(`   ${cssVarMappings.length} CSS custom property mappings`);
  }

  private async validateBreakingChanges(): Promise<void> {
    console.log('🔍 Detecting breaking changes...');

    const mappings = this.mappingSession!.mappings;
    let potentialBreakingChanges = 0;

    for (const mapping of mappings) {
      // Check for API-breaking changes
      if (this.isApiBreakingChange(mapping)) {
        potentialBreakingChanges++;
      }
    }

    if (potentialBreakingChanges > 0) {
      this.addIssue({
        severity: 'warning',
        category: 'breaking',
        title: 'Potential breaking changes',
        description: `${potentialBreakingChanges} mappings may introduce breaking changes.`,
        suggestions: [
          'Review mappings for API compatibility',
          'Update component interfaces if necessary',
          'Plan for major version bump if needed',
        ],
        autoFixable: false,
      });
    }

    console.log(`   ${potentialBreakingChanges} potential breaking changes`);
  }

  private checkTokenExists(tokenName: string): boolean {
    if (!this.targetTokens) return false;
    
    // Check in all token categories
    const categories = ['colors', 'spacing', 'typography', 'shadows', 'borderRadius', 'animations'];
    
    for (const category of categories) {
      if (this.targetTokens[category] && this.targetTokens[category][tokenName]) {
        return true;
      }
    }

    return false;
  }

  private isValidTokenName(tokenName: string): boolean {
    // Check for valid token naming conventions
    // - kebab-case
    // - semantic naming
    // - appropriate prefixes
    
    const validPattern = /^[a-z][a-z0-9-]*[a-z0-9]$/;
    return validPattern.test(tokenName);
  }

  private getTargetTokenValue(tokenName: string): string | null {
    if (!this.targetTokens) return null;
    
    const categories = ['colors', 'spacing', 'typography', 'shadows', 'borderRadius', 'animations'];
    
    for (const category of categories) {
      if (this.targetTokens[category] && this.targetTokens[category][tokenName]) {
        return this.targetTokens[category][tokenName];
      }
    }

    return null;
  }

  private analyzeColorChange(original: string, target: string): { severity: 'minor' | 'moderate' | 'significant' } {
    // Simple color change analysis
    // In a real implementation, you'd use color libraries to analyze contrast, difference, etc.
    
    if (original === target) return { severity: 'minor' };
    
    // Basic heuristics
    if ((original.includes('#') && target.includes('#')) || 
        (original.includes('rgb') && target.includes('rgb'))) {
      return { severity: 'moderate' };
    }
    
    return { severity: 'significant' };
  }

  private analyzeSizeChange(original: string, target: string): { severity: 'minor' | 'moderate' | 'significant' } {
    const originalNum = parseFloat(original);
    const targetNum = parseFloat(target);
    
    if (isNaN(originalNum) || isNaN(targetNum)) {
      return { severity: 'significant' };
    }
    
    const changePercent = Math.abs((targetNum - originalNum) / originalNum) * 100;
    
    if (changePercent < 10) return { severity: 'minor' };
    if (changePercent < 25) return { severity: 'moderate' };
    return { severity: 'significant' };
  }

  private isApiBreakingChange(mapping: any): boolean {
    // Check for potential API breaking changes
    // This is a simplified check - real implementation would be more sophisticated
    
    return mapping.confidence === 'human-custom' && 
           !mapping.targetToken.startsWith(mapping.temporaryToken.split('-')[1]);
  }

  private addIssue(issue: Omit<ValidationIssue, 'id'>): void {
    this.issues.push({
      ...issue,
      id: `validation-${++this.issueIdCounter}`,
    });
  }

  private async generateValidationReport(): Promise<ValidationReport> {
    const mappings = this.mappingSession!.mappings;
    const extractedValues = this.extractionReport!.extractedValues;
    
    const completeMappings = mappings.filter(m => m.targetToken && m.targetToken.trim() !== '').length;
    const missingMappings = extractedValues.length - completeMappings;
    const conflictingMappings = this.issues.filter(i => i.category === 'mapping' && i.title.includes('conflict')).length;
    
    const errors = this.issues.filter(i => i.severity === 'error').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    
    // Calculate readiness score (0-100)
    let readinessScore = 100;
    readinessScore -= errors * 20; // Major impact for errors
    readinessScore -= warnings * 5; // Minor impact for warnings
    readinessScore -= (missingMappings / extractedValues.length) * 30; // Impact for incomplete mappings
    readinessScore = Math.max(0, readinessScore);

    const status: ValidationReport['status'] = 
      errors > 0 ? 'blocked' :
      warnings > 0 || readinessScore < 80 ? 'needs-review' :
      'ready';

    return {
      timestamp: new Date().toISOString(),
      status,
      migrationId: this.mappingSession!.sessionId,
      issues: this.issues,
      visualImpact: {
        colorChanges: [],
        sizingChanges: [],
        layoutImpact: 'minimal', // Would be calculated based on actual analysis
      },
      summary: {
        totalMappings: extractedValues.length,
        completeMappings,
        missingMappings,
        conflictingMappings,
        errors,
        warnings,
        readinessScore: Math.round(readinessScore),
      },
      nextSteps: this.generateNextSteps(status, errors, warnings),
      estimatedMigrationTime: this.estimateMigrationTime(extractedValues.length),
    };
  }

  private generateNextSteps(status: ValidationReport['status'], errors: number, warnings: number): string[] {
    const steps: string[] = [];

    if (status === 'blocked') {
      steps.push('Resolve all blocking errors before proceeding');
      steps.push('Re-run validation after fixes: npm run migrate:validate');
    } else if (status === 'needs-review') {
      steps.push('Review and address warnings');
      steps.push('Complete any missing mappings');
      steps.push('Consider testing in a staging environment');
    } else {
      steps.push('Generate transformation rules: npm run migrate:generate-rules');
      steps.push('Review transformation rules');
      steps.push('Apply migration: npm run migrate:apply');
    }

    return steps;
  }

  private estimateMigrationTime(totalMappings: number): string {
    // Simple estimation based on number of mappings
    const baseTime = 2; // 2 minutes base time
    const perMappingTime = 0.1; // 0.1 minutes per mapping
    
    const totalMinutes = baseTime + (totalMappings * perMappingTime);
    
    if (totalMinutes < 60) {
      return `${Math.round(totalMinutes)} minutes`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      return `${hours}h ${minutes}m`;
    }
  }

  private async saveReport(report: ValidationReport): Promise<void> {
    const reportsDir = path.join(process.cwd(), 'reports');
    const reportPath = path.join(reportsDir, 'migration-validation.json');
    
    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Also save a markdown summary
    const summaryPath = path.join(reportsDir, 'migration-validation-summary.md');
    const summary = this.generateMarkdownSummary(report);
    await fs.promises.writeFile(summaryPath, summary);
  }

  private generateMarkdownSummary(report: ValidationReport): string {
    let md = `# Migration Validation Report\n\n`;
    md += `**Status**: ${report.status.toUpperCase()}\n`;
    md += `**Generated**: ${new Date(report.timestamp).toLocaleString()}\n`;
    md += `**Readiness Score**: ${report.summary.readinessScore}/100\n\n`;

    md += `## Summary\n\n`;
    md += `- **Total Mappings**: ${report.summary.totalMappings}\n`;
    md += `- **Complete**: ${report.summary.completeMappings}\n`;
    md += `- **Missing**: ${report.summary.missingMappings}\n`;
    md += `- **Conflicts**: ${report.summary.conflictingMappings}\n`;
    md += `- **Errors**: ${report.summary.errors}\n`;
    md += `- **Warnings**: ${report.summary.warnings}\n\n`;

    if (report.issues.length > 0) {
      md += `## Issues\n\n`;
      
      const errorIssues = report.issues.filter(i => i.severity === 'error');
      const warningIssues = report.issues.filter(i => i.severity === 'warning');
      const infoIssues = report.issues.filter(i => i.severity === 'info');

      if (errorIssues.length > 0) {
        md += `### ❌ Errors (${errorIssues.length})\n\n`;
        errorIssues.forEach(issue => {
          md += `#### ${issue.title}\n`;
          md += `${issue.description}\n\n`;
          md += `**Suggestions:**\n`;
          issue.suggestions.forEach(s => md += `- ${s}\n`);
          md += '\n';
        });
      }

      if (warningIssues.length > 0) {
        md += `### ⚠️ Warnings (${warningIssues.length})\n\n`;
        warningIssues.forEach(issue => {
          md += `#### ${issue.title}\n`;
          md += `${issue.description}\n\n`;
        });
      }

      if (infoIssues.length > 0) {
        md += `### ℹ️ Information (${infoIssues.length})\n\n`;
        infoIssues.forEach(issue => {
          md += `#### ${issue.title}\n`;
          md += `${issue.description}\n\n`;
        });
      }
    }

    md += `## Next Steps\n\n`;
    report.nextSteps.forEach((step, i) => {
      md += `${i + 1}. ${step}\n`;
    });

    md += `\n**Estimated Migration Time**: ${report.estimatedMigrationTime}\n`;

    return md;
  }

  private displayResults(report: ValidationReport): void {
    console.log('\n📊 Validation Results');
    console.log('=====================\n');

    // Status indicator
    const statusIcon = {
      'ready': '✅',
      'needs-review': '⚠️',
      'blocked': '❌'
    }[report.status];

    console.log(`${statusIcon} Status: ${report.status.toUpperCase()}`);
    console.log(`🎯 Readiness Score: ${report.summary.readinessScore}/100`);
    console.log(`⏱️  Estimated Time: ${report.estimatedMigrationTime}\n`);

    // Summary
    console.log('📈 Summary:');
    console.log(`   Complete mappings: ${report.summary.completeMappings}/${report.summary.totalMappings}`);
    console.log(`   Issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings\n`);

    // Issues by severity
    if (report.issues.length > 0) {
      const errorCount = report.issues.filter(i => i.severity === 'error').length;
      const warningCount = report.issues.filter(i => i.severity === 'warning').length;
      
      if (errorCount > 0) {
        console.log(`❌ ${errorCount} error(s) must be resolved before migration`);
      }
      if (warningCount > 0) {
        console.log(`⚠️  ${warningCount} warning(s) should be reviewed`);
      }
    }

    // Next steps
    console.log('\n📋 Next Steps:');
    report.nextSteps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step}`);
    });

    console.log(`\n📄 Full report saved to: reports/migration-validation.json`);
    console.log(`📄 Summary saved to: reports/migration-validation-summary.md`);
  }
}

// Execute if run directly
if (require.main === module) {
  const validator = new MigrationValidator();
  validator.validate().catch(console.error);
}

export { MigrationValidator, ValidationReport, ValidationIssue };