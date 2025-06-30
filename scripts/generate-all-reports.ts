import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ExecutiveSummary {
  timestamp: string;
  headline: string;
  status: 'excellent' | 'good' | 'needs-attention' | 'critical';
  keyMetrics: {
    totalComponents: number;
    storybookCoverage: number;
    testCoverage: number;
    v2TokenAdoption: number;
    averageHealthScore: number;
  };
  priorities: string[];
  achievements: string[];
  nextActions: string[];
}

class MasterReportGenerator {
  private reportsDir = path.join(process.cwd(), 'reports');

  async generateAllReports(): Promise<void> {
    console.log('🚀 Generating comprehensive design system reports...\n');

    try {
      // Step 1: Generate coverage report
      console.log('📊 Generating coverage report...');
      await this.runScript('scripts/generate-coverage-report.ts');
      console.log('✅ Coverage report complete\n');

      // Step 2: Track trends
      console.log('📈 Tracking coverage trends...');
      await this.runScript('scripts/track-coverage-trends.ts');
      console.log('✅ Trend tracking complete\n');

      // Step 3: Generate executive summary
      console.log('📋 Generating executive summary...');
      await this.generateExecutiveSummary();
      console.log('✅ Executive summary complete\n');

      // Step 4: Display summary
      await this.displaySummary();

      console.log('🎉 All reports generated successfully!');
      console.log(`📂 Reports available in: ${this.reportsDir}`);
      console.log('\n📄 Available reports:');
      console.log('   - coverage-summary.md (High-level overview)');
      console.log('   - coverage-detailed.json (Machine-readable data)');
      console.log('   - coverage-by-component.md (Individual component analysis)');
      console.log('   - coverage-dashboard.html (Interactive dashboard)');
      console.log('   - coverage-trends.md (Historical trends)');
      console.log('   - executive-summary.md (Leadership summary)');
      console.log('\n💡 Quick view: open reports/coverage-dashboard.html in your browser');

    } catch (error) {
      console.error('❌ Error generating reports:', error);
      process.exit(1);
    }
  }

  private async runScript(scriptPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('tsx', [scriptPath], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async generateExecutiveSummary(): Promise<void> {
    try {
      // Load the detailed coverage report
      const coverageReportPath = path.join(this.reportsDir, 'coverage-detailed.json');
      const coverageData = JSON.parse(await fs.promises.readFile(coverageReportPath, 'utf-8'));

      // Load trends if available
      let trendsData = null;
      const trendsReportPath = path.join(this.reportsDir, 'coverage-trends.md');
      if (fs.existsSync(trendsReportPath)) {
        // Parse trends from markdown (simplified)
        const trendsContent = await fs.promises.readFile(trendsReportPath, 'utf-8');
        trendsData = this.parseTrendsFromMarkdown(trendsContent);
      }

      const summary = this.buildExecutiveSummary(coverageData, trendsData);
      await this.writeExecutiveSummary(summary);

    } catch (error) {
      console.error('Error generating executive summary:', error);
      throw error;
    }
  }

  private parseTrendsFromMarkdown(content: string): any {
    // Simplified trend parsing - extract insights
    const insights = content.match(/## Key Insights\n\n(.*?)\n\n## Recommendations/s);
    return {
      insights: insights ? insights[1].split('\n').filter(line => line.trim()) : []
    };
  }

  private buildExecutiveSummary(coverageData: any, trendsData: any): ExecutiveSummary {
    const metrics = coverageData.summary;
    
    // Determine overall status
    let status: ExecutiveSummary['status'] = 'critical';
    if (metrics.averageHealthScore >= 85) status = 'excellent';
    else if (metrics.averageHealthScore >= 70) status = 'good';
    else if (metrics.averageHealthScore >= 50) status = 'needs-attention';

    // Generate headline
    const headline = this.generateHeadline(metrics, status);

    // Identify top priorities
    const priorities = this.identifyPriorities(metrics, coverageData.components);

    // Identify achievements
    const achievements = this.identifyAchievements(metrics, trendsData);

    // Generate next actions
    const nextActions = this.generateNextActions(metrics, coverageData.recommendations);

    return {
      timestamp: new Date().toISOString(),
      headline,
      status,
      keyMetrics: {
        totalComponents: metrics.totalComponents,
        storybookCoverage: metrics.storybookCoverage,
        testCoverage: metrics.testCoverage,
        v2TokenAdoption: metrics.v2TokenAdoption,
        averageHealthScore: metrics.averageHealthScore
      },
      priorities,
      achievements,
      nextActions
    };
  }

  private generateHeadline(metrics: any, status: ExecutiveSummary['status']): string {
    const componentCount = metrics.totalComponents;
    const healthScore = metrics.averageHealthScore;

    switch (status) {
      case 'excellent':
        return `Design System in Excellent Shape: ${componentCount} components with ${healthScore}% average health score`;
      case 'good':
        return `Design System Performing Well: ${componentCount} components with ${healthScore}% health score`;
      case 'needs-attention':
        return `Design System Needs Attention: ${componentCount} components with ${healthScore}% health score requires improvement`;
      case 'critical':
        return `Design System Requires Immediate Action: ${componentCount} components with ${healthScore}% health score needs urgent attention`;
    }
  }

  private identifyPriorities(metrics: any, components: any[]): string[] {
    const priorities: string[] = [];

    if (metrics.testCoverage < 50) {
      priorities.push(`Critical: Test coverage at ${metrics.testCoverage}% - need comprehensive testing strategy`);
    } else if (metrics.testCoverage < 80) {
      priorities.push(`High: Test coverage at ${metrics.testCoverage}% - expand unit testing`);
    }

    if (metrics.storybookCoverage < 60) {
      priorities.push(`High: Storybook coverage at ${metrics.storybookCoverage}% - improve component documentation`);
    }

    if (metrics.v2TokenAdoption < 70) {
      priorities.push(`Medium: V2 token adoption at ${metrics.v2TokenAdoption}% - accelerate design token migration`);
    }

    const criticalComponents = components.filter(c => c.healthScore < 30).length;
    if (criticalComponents > 0) {
      priorities.push(`High: ${criticalComponents} components in critical state - immediate refactoring needed`);
    }

    if (metrics.componentsWithIssues > metrics.totalComponents * 0.8) {
      priorities.push(`Medium: ${metrics.componentsWithIssues} components have issues - schedule maintenance sprint`);
    }

    return priorities.slice(0, 5); // Top 5 priorities
  }

  private identifyAchievements(metrics: any, trendsData: any): string[] {
    const achievements: string[] = [];

    if (metrics.averageHealthScore >= 80) {
      achievements.push('Strong overall component health score demonstrates mature design system');
    }

    if (metrics.storybookCoverage >= 80) {
      achievements.push('Excellent Storybook coverage enables effective component development');
    }

    if (metrics.testCoverage >= 80) {
      achievements.push('High test coverage ensures component reliability and stability');
    }

    if (metrics.v2TokenAdoption >= 80) {
      achievements.push('Strong V2 token adoption maintains design consistency');
    }

    // Add trend-based achievements
    if (trendsData?.insights) {
      trendsData.insights.forEach((insight: string) => {
        if (insight.includes('improving') || insight.includes('increasing') || insight.includes('growing')) {
          achievements.push(insight.replace(/📚|🧪|🎨|💚|🆕|🔧/g, '').trim());
        }
      });
    }

    if (achievements.length === 0) {
      achievements.push('Foundation established for design system improvement');
    }

    return achievements.slice(0, 4); // Top 4 achievements
  }

  private generateNextActions(metrics: any, recommendations: any[]): string[] {
    const actions: string[] = [];

    // High priority actions
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
    highPriorityRecs.forEach(rec => {
      actions.push(`Immediate: ${rec.action} (${rec.components.length} components)`);
    });

    // Medium priority actions
    const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
    mediumPriorityRecs.slice(0, 2).forEach(rec => {
      actions.push(`Next sprint: ${rec.action} (${rec.components.length} components)`);
    });

    // Strategic actions
    if (metrics.averageHealthScore < 70) {
      actions.push('Strategic: Establish component health improvement targets and timeline');
    }

    if (metrics.testCoverage < 50) {
      actions.push('Strategic: Implement comprehensive testing strategy and guidelines');
    }

    return actions.slice(0, 6); // Top 6 actions
  }

  private async writeExecutiveSummary(summary: ExecutiveSummary): Promise<void> {
    const statusEmoji = {
      excellent: '🟢',
      good: '🟡',
      'needs-attention': '🟠',
      critical: '🔴'
    };

    const content = `# Design System Executive Summary

${statusEmoji[summary.status]} **${summary.headline}**

*Generated on: ${new Date(summary.timestamp).toLocaleString()}*

## Status Overview

**Current Status**: ${summary.status.toUpperCase().replace('-', ' ')}

The Vergil Design System consists of **${summary.keyMetrics.totalComponents} components** with an average health score of **${summary.keyMetrics.averageHealthScore}%**.

## Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Total Components** | ${summary.keyMetrics.totalComponents} | ${this.getMetricStatus(summary.keyMetrics.totalComponents, 'count')} |
| **Storybook Coverage** | ${summary.keyMetrics.storybookCoverage}% | ${this.getMetricStatus(summary.keyMetrics.storybookCoverage, 'percentage')} |
| **Test Coverage** | ${summary.keyMetrics.testCoverage}% | ${this.getMetricStatus(summary.keyMetrics.testCoverage, 'percentage')} |
| **V2 Token Adoption** | ${summary.keyMetrics.v2TokenAdoption}% | ${this.getMetricStatus(summary.keyMetrics.v2TokenAdoption, 'percentage')} |
| **Average Health Score** | ${summary.keyMetrics.averageHealthScore}% | ${this.getMetricStatus(summary.keyMetrics.averageHealthScore, 'health')} |

## Top Priorities

${summary.priorities.map((priority, index) => `${index + 1}. ${priority}`).join('\n')}

## Key Achievements

${summary.achievements.map(achievement => `- ${achievement}`).join('\n')}

## Immediate Next Actions

${summary.nextActions.map((action, index) => `${index + 1}. ${action}`).join('\n')}

## Recommendations

### For Leadership
- **Investment**: ${this.getInvestmentRecommendation(summary.keyMetrics)}
- **Timeline**: ${this.getTimelineRecommendation(summary.keyMetrics)}
- **Resources**: ${this.getResourceRecommendation(summary.keyMetrics)}

### For Development Teams
- Focus on high-priority components with health scores below 50%
- Prioritize test coverage for critical user-facing components
- Continue V2 token migration to maintain design consistency
- Regular component maintenance to prevent technical debt

## Impact Assessment

### Business Impact
${this.getBusinessImpact(summary.keyMetrics)}

### Technical Impact
${this.getTechnicalImpact(summary.keyMetrics)}

### User Experience Impact
${this.getUserExperienceImpact(summary.keyMetrics)}

---

## Quick Actions Dashboard

| Priority | Action | Owner | Timeline |
|----------|--------|-------|----------|
| 🔴 Critical | ${summary.priorities[0] || 'Address component health scores'} | Dev Team | This Sprint |
| 🟡 High | ${summary.priorities[1] || 'Improve test coverage'} | Dev Team | Next Sprint |
| 🟢 Medium | ${summary.priorities[2] || 'Continue token migration'} | Design Team | Next Month |

---

*For detailed analysis, see the full coverage reports in the /reports directory.*

**Next Report**: Schedule next assessment in 2 weeks to track progress.
`;

    await fs.promises.writeFile(
      path.join(this.reportsDir, 'executive-summary.md'),
      content
    );
  }

  private getMetricStatus(value: number, type: 'percentage' | 'health' | 'count'): string {
    if (type === 'count') return `${value} components`;
    
    if (type === 'health') {
      if (value >= 85) return '🟢 Excellent';
      if (value >= 70) return '🟡 Good';
      if (value >= 50) return '🟠 Needs Attention';
      return '🔴 Critical';
    }

    // percentage
    if (value >= 80) return '🟢 Strong';
    if (value >= 60) return '🟡 Moderate';
    if (value >= 40) return '🟠 Weak';
    return '🔴 Critical';
  }

  private getInvestmentRecommendation(metrics: any): string {
    if (metrics.averageHealthScore < 50) {
      return 'High - Significant investment needed to improve system reliability and maintainability';
    } else if (metrics.averageHealthScore < 70) {
      return 'Medium - Moderate investment to reach production-ready standards';
    } else {
      return 'Low - Maintenance investment with focus on continuous improvement';
    }
  }

  private getTimelineRecommendation(metrics: any): string {
    if (metrics.testCoverage < 30 && metrics.storybookCoverage < 40) {
      return '3-6 months for foundational improvements';
    } else if (metrics.averageHealthScore < 60) {
      return '1-3 months for significant improvements';
    } else {
      return 'Ongoing maintenance with quarterly reviews';
    }
  }

  private getResourceRecommendation(metrics: any): string {
    const criticalIssues = metrics.componentsWithIssues / metrics.totalComponents;
    
    if (criticalIssues > 0.8) {
      return 'Dedicated design system team (2-3 developers) for 1-2 sprints';
    } else if (criticalIssues > 0.5) {
      return 'Part-time focus from 1-2 developers across multiple sprints';
    } else {
      return 'Regular maintenance as part of ongoing development cycles';
    }
  }

  private getBusinessImpact(metrics: any): string {
    if (metrics.averageHealthScore >= 70) {
      return 'Positive - Consistent UI/UX accelerates development and reduces maintenance costs';
    } else if (metrics.averageHealthScore >= 50) {
      return 'Neutral - System provides value but needs improvement to maximize ROI';
    } else {
      return 'Negative - Low quality components may slow development and increase bug reports';
    }
  }

  private getTechnicalImpact(metrics: any): string {
    if (metrics.testCoverage >= 70 && metrics.v2TokenAdoption >= 70) {
      return 'Strong - Well-tested, consistent components reduce technical debt';
    } else if (metrics.testCoverage >= 40 || metrics.v2TokenAdoption >= 50) {
      return 'Moderate - Some consistency but needs improvement for reliability';
    } else {
      return 'Weak - Inconsistent components increase maintenance burden';
    }
  }

  private getUserExperienceImpact(metrics: any): string {
    if (metrics.v2TokenAdoption >= 80) {
      return 'Excellent - Consistent design language provides cohesive user experience';
    } else if (metrics.v2TokenAdoption >= 60) {
      return 'Good - Mostly consistent with some visual inconsistencies';
    } else {
      return 'Poor - Inconsistent styling may confuse users and reduce trust';
    }
  }

  private async displaySummary(): Promise<void> {
    try {
      const summaryPath = path.join(this.reportsDir, 'executive-summary.md');
      const content = await fs.promises.readFile(summaryPath, 'utf-8');
      
      // Extract key information for console display
      const headline = content.match(/\*\*(.*?)\*\*/)?.[1] || 'Design System Report Generated';
      const keyMetrics = content.match(/## Key Metrics\n\n(.*?)\n\n## Top Priorities/s)?.[1] || '';
      
      console.log('\n' + '='.repeat(80));
      console.log('📊 EXECUTIVE SUMMARY');
      console.log('='.repeat(80));
      console.log(`\n${headline}\n`);
      
      if (keyMetrics) {
        console.log('KEY METRICS:');
        console.log(keyMetrics.replace(/\|/g, '').replace(/\n/g, '\n'));
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
      
    } catch (error) {
      console.log('\n📋 Executive summary generated successfully!');
    }
  }
}

// Run the master report generator
const generator = new MasterReportGenerator();
generator.generateAllReports().catch(console.error);