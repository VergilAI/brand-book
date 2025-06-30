import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

interface ComponentInfo {
  name: string;
  path: string;
  category: 'ui' | 'vergil' | 'landing' | 'lms' | 'docs' | 'other';
  hasStory: boolean;
  hasTest: boolean;
  hasMainFile: boolean;
  hasIndex: boolean;
  storyCompleteness: number; // 0-100%
  testCoverage: number; // 0-100% 
  tokenUsage: number; // 0-100%
  documentationScore: number; // 0-100%
  typeScriptScore: number; // 0-100%
  healthScore: number; // 0-100% overall
  hardcodedFindings: HardcodedFinding[];
  recommendations: string[];
}

interface HardcodedFinding {
  type: 'hex-color' | 'rgb-color' | 'hsl-color' | 'pixel-value' | 'arbitrary-tailwind' | 'inline-style' | 'magic-number' | 'font-family' | 'box-shadow';
  value: string;
  file: string;
  line: number;
  column: number;
  context: string;
}

interface CoverageReport {
  timestamp: string;
  summary: {
    totalComponents: number;
    storybookCoverage: number;
    testCoverage: number;
    v2TokenAdoption: number;
    averageHealthScore: number;
    componentsWithIssues: number;
  };
  components: ComponentInfo[];
  trends: {
    previousReport?: string;
    improvements: string[];
    regressions: string[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    components: string[];
  }[];
}

class CoverageReportGenerator {
  private componentsDir = path.join(process.cwd(), 'components');
  private reportsDir = path.join(process.cwd(), 'reports');
  private components: ComponentInfo[] = [];
  private hardcodedFindings: HardcodedFinding[] = [];

  async generate(): Promise<void> {
    console.log('🔍 Generating component coverage report...\n');

    // Ensure reports directory exists
    await this.ensureReportsDir();

    // Scan for hardcoded values first
    await this.scanHardcodedValues();

    // Discover and analyze components
    await this.discoverComponents();

    // Analyze each component
    for (const component of this.components) {
      await this.analyzeComponent(component);
    }

    // Generate reports
    const report = this.buildReport();
    await this.generateReports(report);

    console.log('✅ Coverage report generation complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Total components: ${report.summary.totalComponents}`);
    console.log(`   - Storybook coverage: ${report.summary.storybookCoverage}%`);
    console.log(`   - Test coverage: ${report.summary.testCoverage}%`);
    console.log(`   - V2 token adoption: ${report.summary.v2TokenAdoption}%`);
    console.log(`   - Average health score: ${report.summary.averageHealthScore}%`);
    console.log(`\n📄 Reports generated in: ${this.reportsDir}`);
  }

  private async ensureReportsDir(): Promise<void> {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  private async scanHardcodedValues(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scanner = spawn('tsx', ['scripts/scan-hardcoded-values.ts'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let stdout = '';
      scanner.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      scanner.on('close', (code) => {
        if (code === 0) {
          // Parse the hardcoded values from the report file
          this.loadHardcodedFindings();
          resolve();
        } else {
          console.warn('⚠️  Warning: Could not scan hardcoded values');
          resolve(); // Continue without hardcoded findings
        }
      });

      scanner.on('error', () => {
        console.warn('⚠️  Warning: Could not scan hardcoded values');
        resolve(); // Continue without hardcoded findings
      });
    });
  }

  private loadHardcodedFindings(): void {
    try {
      const reportPath = path.join(this.reportsDir, 'hardcoded-values.md');
      if (fs.existsSync(reportPath)) {
        // This is a simplified approach - in a real implementation,
        // we'd parse the markdown or have the scanner output JSON
        console.log('📋 Loaded hardcoded values from scan');
      }
    } catch (error) {
      console.warn('⚠️  Could not load hardcoded findings');
    }
  }

  private async discoverComponents(): Promise<void> {
    const categories = ['ui', 'vergil', 'landing', 'lms', 'docs'];
    
    for (const category of categories) {
      const categoryPath = path.join(this.componentsDir, category);
      if (!fs.existsSync(categoryPath)) continue;

      const items = await fs.promises.readdir(categoryPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('_')) {
          // Component directory
          this.components.push({
            name: item.name,
            path: path.join(categoryPath, item.name),
            category: category as ComponentInfo['category'],
            hasStory: false,
            hasTest: false,
            hasMainFile: false,
            hasIndex: false,
            storyCompleteness: 0,
            testCoverage: 0,
            tokenUsage: 0,
            documentationScore: 0,
            typeScriptScore: 0,
            healthScore: 0,
            hardcodedFindings: [],
            recommendations: []
          });
        } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
          // Standalone component file
          const componentName = path.parse(item.name).name;
          if (!componentName.includes('.stories') && !componentName.includes('.test')) {
            this.components.push({
              name: componentName,
              path: path.join(categoryPath, item.name),
              category: category as ComponentInfo['category'],
              hasStory: false,
              hasTest: false,
              hasMainFile: true,
              hasIndex: false,
              storyCompleteness: 0,
              testCoverage: 0,
              tokenUsage: 0,
              documentationScore: 0,
              typeScriptScore: 0,
              healthScore: 0,
              hardcodedFindings: [],
              recommendations: []
            });
          }
        }
      }
    }
  }

  private async analyzeComponent(component: ComponentInfo): Promise<void> {
    // Check for story file
    component.hasStory = await this.hasStoryFile(component);
    
    // Check for test file
    component.hasTest = await this.hasTestFile(component);
    
    // Check for main component file
    if (!component.hasMainFile) {
      component.hasMainFile = await this.hasMainFile(component);
    }
    
    // Check for index file
    component.hasIndex = await this.hasIndexFile(component);

    // Analyze story completeness
    component.storyCompleteness = await this.analyzeStoryCompleteness(component);

    // Analyze test coverage (simplified)
    component.testCoverage = await this.analyzeTestCoverage(component);

    // Analyze token usage
    component.tokenUsage = await this.analyzeTokenUsage(component);

    // Analyze documentation
    component.documentationScore = await this.analyzeDocumentation(component);

    // Analyze TypeScript usage
    component.typeScriptScore = await this.analyzeTypeScript(component);

    // Calculate health score
    component.healthScore = this.calculateHealthScore(component);

    // Add recommendations
    component.recommendations = this.generateComponentRecommendations(component);
  }

  private async hasStoryFile(component: ComponentInfo): Promise<boolean> {
    const storyPaths = [
      path.join(path.dirname(component.path), `${component.name}.stories.tsx`),
      path.join(component.path, `${component.name}.stories.tsx`),
      `${component.path}.stories.tsx`
    ];

    for (const storyPath of storyPaths) {
      if (fs.existsSync(storyPath)) return true;
    }
    return false;
  }

  private async hasTestFile(component: ComponentInfo): Promise<boolean> {
    const testPaths = [
      path.join(path.dirname(component.path), `${component.name}.test.tsx`),
      path.join(component.path, `${component.name}.test.tsx`),
      `${component.path}.test.tsx`
    ];

    for (const testPath of testPaths) {
      if (fs.existsSync(testPath)) return true;
    }
    return false;
  }

  private async hasMainFile(component: ComponentInfo): Promise<boolean> {
    const mainPaths = [
      path.join(component.path, `${component.name}.tsx`),
      `${component.path}.tsx`
    ];

    for (const mainPath of mainPaths) {
      if (fs.existsSync(mainPath)) return true;
    }
    return false;
  }

  private async hasIndexFile(component: ComponentInfo): Promise<boolean> {
    const indexPath = path.join(path.dirname(component.path), 'index.ts');
    return fs.existsSync(indexPath);
  }

  private async analyzeStoryCompleteness(component: ComponentInfo): Promise<number> {
    if (!component.hasStory) return 0;

    try {
      const storyPaths = [
        path.join(path.dirname(component.path), `${component.name}.stories.tsx`),
        path.join(component.path, `${component.name}.stories.tsx`),
        `${component.path}.stories.tsx`
      ];

      let storyContent = '';
      for (const storyPath of storyPaths) {
        if (fs.existsSync(storyPath)) {
          storyContent = await fs.promises.readFile(storyPath, 'utf-8');
          break;
        }
      }

      if (!storyContent) return 0;

      let score = 20; // Base score for having a story

      // Check for multiple stories/variants
      const storyCount = (storyContent.match(/export const \w+/g) || []).length;
      if (storyCount > 1) score += 20;
      if (storyCount > 3) score += 20;

      // Check for controls/args
      if (storyContent.includes('args:') || storyContent.includes('argTypes:')) {
        score += 20;
      }

      // Check for documentation
      if (storyContent.includes('parameters:') && storyContent.includes('docs:')) {
        score += 20;
      }

      return Math.min(score, 100);
    } catch (error) {
      return 0;
    }
  }

  private async analyzeTestCoverage(component: ComponentInfo): Promise<number> {
    if (!component.hasTest) return 0;

    try {
      const testPaths = [
        path.join(path.dirname(component.path), `${component.name}.test.tsx`),
        path.join(component.path, `${component.name}.test.tsx`),
        `${component.path}.test.tsx`
      ];

      let testContent = '';
      for (const testPath of testPaths) {
        if (fs.existsSync(testPath)) {
          testContent = await fs.promises.readFile(testPath, 'utf-8');
          break;
        }
      }

      if (!testContent) return 0;

      let score = 25; // Base score for having tests

      // Check for multiple test cases
      const testCount = (testContent.match(/it\(|test\(/g) || []).length;
      if (testCount > 2) score += 25;
      if (testCount > 5) score += 25;

      // Check for different types of tests
      if (testContent.includes('render') || testContent.includes('screen')) score += 25;

      return Math.min(score, 100);
    } catch (error) {
      return 0;
    }
  }

  private async analyzeTokenUsage(component: ComponentInfo): Promise<number> {
    try {
      let componentContent = '';
      const filePaths = [
        path.join(component.path, `${component.name}.tsx`),
        `${component.path}.tsx`,
        component.path
      ];

      for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
          componentContent = await fs.promises.readFile(filePath, 'utf-8');
          break;
        }
      }

      if (!componentContent) return 0;

      // Count V2 tokens vs hardcoded values
      const v2Tokens = [
        'vergil-purple', 'vergil-off-black', 'vergil-off-white',
        'vergil-emphasis-bg', 'vergil-emphasis-dropdown-bg', 
        'vergil-emphasis-text', 'vergil-emphasis-button',
        'cosmic-purple', 'neural-blue'
      ];

      const hardcodedPatterns = [
        /#([0-9a-fA-F]{3}){1,2}/g, // Hex colors
        /rgba?\s*\(/g, // RGB colors
        /\[([^\]]+)\]/g, // Arbitrary Tailwind values
      ];

      let tokenCount = 0;
      let hardcodedCount = 0;

      // Count token usage
      v2Tokens.forEach(token => {
        const matches = componentContent.match(new RegExp(token, 'g'));
        if (matches) tokenCount += matches.length;
      });

      // Count hardcoded values
      hardcodedPatterns.forEach(pattern => {
        const matches = componentContent.match(pattern);
        if (matches) hardcodedCount += matches.length;
      });

      if (tokenCount + hardcodedCount === 0) return 50; // Neutral score if no styling

      return Math.round((tokenCount / (tokenCount + hardcodedCount)) * 100);
    } catch (error) {
      return 0;
    }
  }

  private async analyzeDocumentation(component: ComponentInfo): Promise<number> {
    try {
      let componentContent = '';
      const filePaths = [
        path.join(component.path, `${component.name}.tsx`),
        `${component.path}.tsx`,
        component.path
      ];

      for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
          componentContent = await fs.promises.readFile(filePath, 'utf-8');
          break;
        }
      }

      if (!componentContent) return 0;

      let score = 0;

      // Check for JSDoc comments
      if (componentContent.includes('/**') || componentContent.includes('*/')); {
        score += 25;
      }

      // Check for interface/type definitions
      if (componentContent.includes('interface ') || componentContent.includes('type ')) {
        score += 25;
      }

      // Check for prop descriptions
      if (componentContent.includes('Props') || componentContent.includes('props')) {
        score += 25;
      }

      // Check for README file
      const readmePath = path.join(path.dirname(component.path), 'README.md');
      if (fs.existsSync(readmePath)) {
        score += 25;
      }

      return score;
    } catch (error) {
      return 0;
    }
  }

  private async analyzeTypeScript(component: ComponentInfo): Promise<number> {
    try {
      let componentContent = '';
      const filePaths = [
        path.join(component.path, `${component.name}.tsx`),
        `${component.path}.tsx`,
        component.path
      ];

      for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
          componentContent = await fs.promises.readFile(filePath, 'utf-8');
          break;
        }
      }

      if (!componentContent) return 0;

      let score = 20; // Base score for TypeScript file

      // Check for proper typing
      if (componentContent.includes('interface ') || componentContent.includes('type ')) {
        score += 30;
      }

      // Check for props typing
      if (componentContent.includes('Props>') || componentContent.includes('props:')) {
        score += 25;
      }

      // Check for generic types
      if (componentContent.includes('<T') || componentContent.includes('React.FC')) {
        score += 25;
      }

      return Math.min(score, 100);
    } catch (error) {
      return 0;
    }
  }

  private calculateHealthScore(component: ComponentInfo): number {
    const weights = {
      hasStory: 20,
      hasTest: 20,
      storyCompleteness: 0.15,
      testCoverage: 0.15,
      tokenUsage: 0.20,
      documentationScore: 0.10,
      typeScriptScore: 0.20
    };

    let score = 0;
    
    if (component.hasStory) score += weights.hasStory;
    if (component.hasTest) score += weights.hasTest;
    
    score += component.storyCompleteness * weights.storyCompleteness;
    score += component.testCoverage * weights.testCoverage;
    score += component.tokenUsage * weights.tokenUsage;
    score += component.documentationScore * weights.documentationScore;
    score += component.typeScriptScore * weights.typeScriptScore;

    return Math.round(score);
  }

  private generateComponentRecommendations(component: ComponentInfo): string[] {
    const recommendations: string[] = [];

    if (!component.hasStory) {
      recommendations.push('Add Storybook story for component documentation and testing');
    }

    if (!component.hasTest) {
      recommendations.push('Add unit tests to ensure component reliability');
    }

    if (component.storyCompleteness < 50) {
      recommendations.push('Improve story completeness with more variants and controls');
    }

    if (component.tokenUsage < 70) {
      recommendations.push('Replace hardcoded values with V2 design tokens');
    }

    if (component.documentationScore < 50) {
      recommendations.push('Add JSDoc comments and prop documentation');
    }

    if (!component.hasIndex) {
      recommendations.push('Add index.ts file for proper exports');
    }

    return recommendations;
  }

  private buildReport(): CoverageReport {
    const totalComponents = this.components.length;
    const componentsWithStories = this.components.filter(c => c.hasStory).length;
    const componentsWithTests = this.components.filter(c => c.hasTest).length;
    const averageTokenUsage = this.components.reduce((sum, c) => sum + c.tokenUsage, 0) / totalComponents;
    const averageHealthScore = this.components.reduce((sum, c) => sum + c.healthScore, 0) / totalComponents;
    const componentsWithIssues = this.components.filter(c => c.healthScore < 70).length;

    const report: CoverageReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents,
        storybookCoverage: Math.round((componentsWithStories / totalComponents) * 100),
        testCoverage: Math.round((componentsWithTests / totalComponents) * 100),
        v2TokenAdoption: Math.round(averageTokenUsage),
        averageHealthScore: Math.round(averageHealthScore),
        componentsWithIssues
      },
      components: this.components.sort((a, b) => b.healthScore - a.healthScore),
      trends: {
        improvements: [],
        regressions: []
      },
      recommendations: this.generateGlobalRecommendations()
    };

    return report;
  }

  private generateGlobalRecommendations(): CoverageReport['recommendations'] {
    const recommendations: CoverageReport['recommendations'] = [];

    // High priority recommendations
    const componentsWithoutStories = this.components.filter(c => !c.hasStory);
    if (componentsWithoutStories.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Add Storybook stories for components missing documentation',
        components: componentsWithoutStories.map(c => c.name)
      });
    }

    const componentsWithoutTests = this.components.filter(c => !c.hasTest);
    if (componentsWithoutTests.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Add unit tests for components lacking test coverage',
        components: componentsWithoutTests.map(c => c.name)
      });
    }

    // Medium priority recommendations
    const componentsWithLowTokenUsage = this.components.filter(c => c.tokenUsage < 50);
    if (componentsWithLowTokenUsage.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Migrate hardcoded values to V2 design tokens',
        components: componentsWithLowTokenUsage.map(c => c.name)
      });
    }

    // Low priority recommendations
    const componentsWithPoorDocs = this.components.filter(c => c.documentationScore < 50);
    if (componentsWithPoorDocs.length > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Improve component documentation and TypeScript definitions',
        components: componentsWithPoorDocs.map(c => c.name)
      });
    }

    return recommendations;
  }

  private async generateReports(report: CoverageReport): Promise<void> {
    // Generate summary markdown
    await this.generateSummaryReport(report);
    
    // Generate detailed JSON
    await this.generateDetailedReport(report);
    
    // Generate component-by-component report
    await this.generateComponentReport(report);
    
    // Generate HTML dashboard
    await this.generateDashboard(report);
  }

  private async generateSummaryReport(report: CoverageReport): Promise<void> {
    const content = `# Component Coverage Summary

Generated on: ${new Date(report.timestamp).toLocaleString()}

## Overview

- **Total Components**: ${report.summary.totalComponents}
- **Storybook Coverage**: ${report.summary.storybookCoverage}%
- **Test Coverage**: ${report.summary.testCoverage}%
- **V2 Token Adoption**: ${report.summary.v2TokenAdoption}% 
- **Average Health Score**: ${report.summary.averageHealthScore}%
- **Components with Issues**: ${report.summary.componentsWithIssues}

## Health Score Distribution

${this.generateHealthScoreDistribution(report)}

## Top Performing Components

${report.components.slice(0, 5).map(c => 
  `- **${c.name}** (${c.category}): ${c.healthScore}%`
).join('\n')}

## Components Needing Attention

${report.components.filter(c => c.healthScore < 70).slice(0, 10).map(c => 
  `- **${c.name}** (${c.category}): ${c.healthScore}% - ${c.recommendations[0] || 'Needs improvement'}`
).join('\n')}

## Recommendations by Priority

### High Priority
${report.recommendations.filter(r => r.priority === 'high').map(r => 
  `- **${r.action}**\n  Components: ${r.components.slice(0, 3).join(', ')}${r.components.length > 3 ? ` (and ${r.components.length - 3} more)` : ''}`
).join('\n\n')}

### Medium Priority
${report.recommendations.filter(r => r.priority === 'medium').map(r => 
  `- **${r.action}**\n  Components: ${r.components.slice(0, 3).join(', ')}${r.components.length > 3 ? ` (and ${r.components.length - 3} more)` : ''}`
).join('\n\n')}

### Low Priority
${report.recommendations.filter(r => r.priority === 'low').map(r => 
  `- **${r.action}**\n  Components: ${r.components.slice(0, 3).join(', ')}${r.components.length > 3 ? ` (and ${r.components.length - 3} more)` : ''}`
).join('\n\n')}

## Next Steps

1. Address high-priority recommendations first
2. Focus on components with health scores below 70%
3. Prioritize adding Storybook stories and tests
4. Continue V2 token migration
5. Improve component documentation

---
*Report generated by Vergil Design System Coverage Tool*
`;

    await fs.promises.writeFile(
      path.join(this.reportsDir, 'coverage-summary.md'),
      content
    );
  }

  private generateHealthScoreDistribution(report: CoverageReport): string {
    const ranges = [
      { min: 90, max: 100, label: 'Excellent (90-100%)' },
      { min: 70, max: 89, label: 'Good (70-89%)' },
      { min: 50, max: 69, label: 'Fair (50-69%)' },
      { min: 0, max: 49, label: 'Needs Work (0-49%)' }
    ];

    return ranges.map(range => {
      const count = report.components.filter(c => 
        c.healthScore >= range.min && c.healthScore <= range.max
      ).length;
      const percentage = Math.round((count / report.summary.totalComponents) * 100);
      return `- ${range.label}: ${count} components (${percentage}%)`;
    }).join('\n');
  }

  private async generateDetailedReport(report: CoverageReport): Promise<void> {
    await fs.promises.writeFile(
      path.join(this.reportsDir, 'coverage-detailed.json'),
      JSON.stringify(report, null, 2)
    );
  }

  private async generateComponentReport(report: CoverageReport): Promise<void> {
    const content = `# Component Coverage by Component

Generated on: ${new Date(report.timestamp).toLocaleString()}

${report.components.map(component => `
## ${component.name} (${component.category})

**Health Score: ${component.healthScore}%**

### Status
- ✅ Story: ${component.hasStory ? '✓' : '✗'}
- ✅ Test: ${component.hasTest ? '✓' : '✗'} 
- ✅ Main File: ${component.hasMainFile ? '✓' : '✗'}
- ✅ Index: ${component.hasIndex ? '✓' : '✗'}

### Scores
- Story Completeness: ${component.storyCompleteness}%
- Test Coverage: ${component.testCoverage}%
- Token Usage: ${component.tokenUsage}%
- Documentation: ${component.documentationScore}%
- TypeScript: ${component.typeScriptScore}%

### Recommendations
${component.recommendations.map(rec => `- ${rec}`).join('\n')}

---
`).join('')}

*Report generated by Vergil Design System Coverage Tool*
`;

    await fs.promises.writeFile(
      path.join(this.reportsDir, 'coverage-by-component.md'),
      content
    );
  }

  private async generateDashboard(report: CoverageReport): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vergil Design System - Coverage Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f7;
            color: #1d1d1f;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
        }
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #7B00FF;
        }
        .metric-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .charts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
        }
        .chart-container {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .component-table {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .health-score {
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
        }
        .health-excellent { background: #34d399; }
        .health-good { background: #60a5fa; }
        .health-fair { background: #fbbf24; }
        .health-poor { background: #f87171; }
        .recommendations {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        .priority-high { border-left: 4px solid #f87171; }
        .priority-medium { border-left: 4px solid #fbbf24; }
        .priority-low { border-left: 4px solid #60a5fa; }
        @media (max-width: 768px) {
            .charts {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vergil Design System</h1>
            <h2>Component Coverage Dashboard</h2>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${report.summary.totalComponents}</div>
                <div class="metric-label">Total Components</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.summary.storybookCoverage}%</div>
                <div class="metric-label">Storybook Coverage</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.summary.testCoverage}%</div>
                <div class="metric-label">Test Coverage</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.summary.v2TokenAdoption}%</div>
                <div class="metric-label">V2 Token Adoption</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${report.summary.averageHealthScore}%</div>
                <div class="metric-label">Average Health Score</div>
            </div>
        </div>

        <div class="charts">
            <div class="chart-container">
                <h3>Health Score Distribution</h3>
                <canvas id="healthChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Coverage by Category</h3>
                <canvas id="categoryChart"></canvas>
            </div>
        </div>

        <div class="component-table">
            <h3 style="padding: 20px 20px 0;">Component Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Category</th>
                        <th>Health Score</th>
                        <th>Story</th>
                        <th>Test</th>
                        <th>Token Usage</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.components.map(c => `
                    <tr>
                        <td><strong>${c.name}</strong></td>
                        <td>${c.category}</td>
                        <td><span class="health-score ${this.getHealthClass(c.healthScore)}">${c.healthScore}%</span></td>
                        <td>${c.hasStory ? '✅' : '❌'}</td>
                        <td>${c.hasTest ? '✅' : '❌'}</td>
                        <td>${c.tokenUsage}%</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="recommendations">
            <h3>Recommendations</h3>
            ${report.recommendations.map(rec => `
            <div class="priority-${rec.priority}" style="padding: 15px; margin: 10px 0; background: #f8f9fa;">
                <h4 style="margin: 0 0 10px;">${rec.action}</h4>
                <p style="margin: 0; color: #666;">
                    <strong>Priority:</strong> ${rec.priority.toUpperCase()} | 
                    <strong>Components:</strong> ${rec.components.slice(0, 3).join(', ')}
                    ${rec.components.length > 3 ? ` (and ${rec.components.length - 3} more)` : ''}
                </p>
            </div>
            `).join('')}
        </div>
    </div>

    <script>
        // Health Score Distribution Chart
        const healthCtx = document.getElementById('healthChart').getContext('2d');
        const healthData = ${JSON.stringify(this.getHealthDistributionData(report))};
        
        new Chart(healthCtx, {
            type: 'doughnut',
            data: {
                labels: healthData.labels,
                datasets: [{
                    data: healthData.values,
                    backgroundColor: ['#34d399', '#60a5fa', '#fbbf24', '#f87171']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Category Coverage Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        const categoryData = ${JSON.stringify(this.getCategoryData(report))};
        
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    label: 'Components',
                    data: categoryData.values,
                    backgroundColor: '#7B00FF'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>`;

    await fs.promises.writeFile(
      path.join(this.reportsDir, 'coverage-dashboard.html'),
      html
    );
  }

  private getHealthClass(score: number): string {
    if (score >= 90) return 'health-excellent';
    if (score >= 70) return 'health-good';
    if (score >= 50) return 'health-fair';
    return 'health-poor';
  }

  private getHealthDistributionData(report: CoverageReport) {
    const ranges = [
      { min: 90, max: 100, label: 'Excellent (90-100%)' },
      { min: 70, max: 89, label: 'Good (70-89%)' },
      { min: 50, max: 69, label: 'Fair (50-69%)' },
      { min: 0, max: 49, label: 'Needs Work (0-49%)' }
    ];

    const labels: string[] = [];
    const values: number[] = [];

    ranges.forEach(range => {
      const count = report.components.filter(c => 
        c.healthScore >= range.min && c.healthScore <= range.max
      ).length;
      labels.push(range.label);
      values.push(count);
    });

    return { labels, values };
  }

  private getCategoryData(report: CoverageReport) {
    const categories = ['ui', 'vergil', 'landing', 'lms', 'docs', 'other'];
    const labels: string[] = [];
    const values: number[] = [];

    categories.forEach(category => {
      const count = report.components.filter(c => c.category === category).length;
      if (count > 0) {
        labels.push(category.toUpperCase());
        values.push(count);
      }
    });

    return { labels, values };
  }
}

// Run the coverage report generator
const generator = new CoverageReportGenerator();
generator.generate().catch(console.error);