import * as fs from 'fs';
import * as path from 'path';

interface HistoricalReport {
  timestamp: string;
  summary: {
    totalComponents: number;
    storybookCoverage: number;
    testCoverage: number;
    v2TokenAdoption: number;
    averageHealthScore: number;
    componentsWithIssues: number;
  };
}

interface TrendData {
  current: HistoricalReport;
  previous?: HistoricalReport;
  trends: {
    totalComponents: { value: number; trend: 'up' | 'down' | 'stable' };
    storybookCoverage: { value: number; trend: 'up' | 'down' | 'stable' };
    testCoverage: { value: number; trend: 'up' | 'down' | 'stable' };
    v2TokenAdoption: { value: number; trend: 'up' | 'down' | 'stable' };
    averageHealthScore: { value: number; trend: 'up' | 'down' | 'stable' };
    componentsWithIssues: { value: number; trend: 'up' | 'down' | 'stable' };
  };
  insights: string[];
}

class CoverageTrendTracker {
  private reportsDir = path.join(process.cwd(), 'reports');
  private trendsDir = path.join(this.reportsDir, 'trends');

  async trackTrends(): Promise<void> {
    console.log('📈 Tracking coverage trends...\n');

    // Ensure trends directory exists
    await this.ensureTrendsDir();

    // Load current report
    const currentReport = await this.loadCurrentReport();
    if (!currentReport) {
      console.log('❌ No current report found. Please run npm run report:coverage first.');
      return;
    }

    // Load previous report
    const previousReport = await this.loadPreviousReport();

    // Calculate trends
    const trendData = this.calculateTrends(currentReport, previousReport);

    // Archive current report
    await this.archiveReport(currentReport);

    // Generate trend report
    await this.generateTrendReport(trendData);

    console.log('✅ Trend tracking complete!\n');
    console.log('📊 Trends:');
    Object.entries(trendData.trends).forEach(([key, trend]) => {
      const icon = trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️';
      console.log(`   ${icon} ${key}: ${trend.value}% (${trend.trend})`);
    });
  }

  private async ensureTrendsDir(): Promise<void> {
    if (!fs.existsSync(this.trendsDir)) {
      fs.mkdirSync(this.trendsDir, { recursive: true });
    }
  }

  private async loadCurrentReport(): Promise<HistoricalReport | null> {
    try {
      const reportPath = path.join(this.reportsDir, 'coverage-detailed.json');
      if (!fs.existsSync(reportPath)) return null;

      const data = JSON.parse(await fs.promises.readFile(reportPath, 'utf-8'));
      return {
        timestamp: data.timestamp,
        summary: data.summary
      };
    } catch (error) {
      console.error('Error loading current report:', error);
      return null;
    }
  }

  private async loadPreviousReport(): Promise<HistoricalReport | null> {
    try {
      const files = await fs.promises.readdir(this.trendsDir);
      const reportFiles = files
        .filter(f => f.startsWith('coverage-') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (reportFiles.length === 0) return null;

      const latestFile = reportFiles[0];
      const data = JSON.parse(
        await fs.promises.readFile(path.join(this.trendsDir, latestFile), 'utf-8')
      );

      return data;
    } catch (error) {
      console.warn('Could not load previous report:', error);
      return null;
    }
  }

  private calculateTrends(current: HistoricalReport, previous?: HistoricalReport): TrendData {
    const getTrend = (currentValue: number, previousValue?: number): 'up' | 'down' | 'stable' => {
      if (!previousValue) return 'stable';
      const diff = currentValue - previousValue;
      const threshold = 1; // 1% threshold for significance
      
      if (diff > threshold) return 'up';
      if (diff < -threshold) return 'down';
      return 'stable';
    };

    const trends = {
      totalComponents: {
        value: current.summary.totalComponents,
        trend: getTrend(current.summary.totalComponents, previous?.summary.totalComponents)
      },
      storybookCoverage: {
        value: current.summary.storybookCoverage,
        trend: getTrend(current.summary.storybookCoverage, previous?.summary.storybookCoverage)
      },
      testCoverage: {
        value: current.summary.testCoverage,
        trend: getTrend(current.summary.testCoverage, previous?.summary.testCoverage)
      },
      v2TokenAdoption: {
        value: current.summary.v2TokenAdoption,
        trend: getTrend(current.summary.v2TokenAdoption, previous?.summary.v2TokenAdoption)
      },
      averageHealthScore: {
        value: current.summary.averageHealthScore,
        trend: getTrend(current.summary.averageHealthScore, previous?.summary.averageHealthScore)
      },
      componentsWithIssues: {
        value: current.summary.componentsWithIssues,
        trend: getTrend(current.summary.componentsWithIssues, previous?.summary.componentsWithIssues)
      }
    };

    const insights = this.generateInsights(trends, previous);

    return {
      current,
      previous,
      trends,
      insights
    };
  }

  private generateInsights(trends: TrendData['trends'], previous?: HistoricalReport): string[] {
    const insights: string[] = [];

    if (trends.storybookCoverage.trend === 'up') {
      insights.push('📚 Storybook coverage is improving - great progress on component documentation!');
    } else if (trends.storybookCoverage.trend === 'down') {
      insights.push('⚠️ Storybook coverage has declined - consider prioritizing story creation');
    }

    if (trends.testCoverage.trend === 'up') {
      insights.push('🧪 Test coverage is increasing - component reliability is improving');
    } else if (trends.testCoverage.trend === 'down') {
      insights.push('🚨 Test coverage has decreased - focus on adding unit tests');
    }

    if (trends.v2TokenAdoption.trend === 'up') {
      insights.push('🎨 V2 token adoption is growing - design consistency is improving');
    } else if (trends.v2TokenAdoption.trend === 'down') {
      insights.push('⚠️ V2 token adoption has declined - review recent changes for hardcoded values');
    }

    if (trends.averageHealthScore.trend === 'up') {
      insights.push('💚 Overall component health is improving - keep up the good work!');
    } else if (trends.averageHealthScore.trend === 'down') {
      insights.push('📉 Overall component health has declined - review recent changes');
    }

    if (trends.totalComponents.trend === 'up') {
      insights.push('🆕 New components have been added - ensure they follow design system standards');
    }

    if (trends.componentsWithIssues.trend === 'down') {
      insights.push('🔧 Fewer components have issues - great progress on addressing technical debt!');
    } else if (trends.componentsWithIssues.trend === 'up') {
      insights.push('📋 More components need attention - consider dedicating time to component maintenance');
    }

    if (insights.length === 0) {
      insights.push('📊 Metrics are stable - maintain current practices');
    }

    return insights;
  }

  private async archiveReport(report: HistoricalReport): Promise<void> {
    const timestamp = new Date(report.timestamp).toISOString().split('T')[0];
    const filename = `coverage-${timestamp}.json`;
    const archivePath = path.join(this.trendsDir, filename);

    await fs.promises.writeFile(archivePath, JSON.stringify(report, null, 2));
  }

  private async generateTrendReport(trendData: TrendData): Promise<void> {
    const reportContent = `# Coverage Trends Report

Generated on: ${new Date().toLocaleString()}

## Current vs Previous Report

${trendData.previous ? `
### Comparison Period
- **Current Report**: ${new Date(trendData.current.timestamp).toLocaleString()}
- **Previous Report**: ${new Date(trendData.previous.timestamp).toLocaleString()}
` : '### No Previous Report Available\n\nThis is the first trend report. Run this command again after the next coverage report to see trends.'}

## Metrics Comparison

| Metric | Current | Previous | Trend |
|--------|---------|----------|-------|
| Total Components | ${trendData.trends.totalComponents.value} | ${trendData.previous?.summary.totalComponents || 'N/A'} | ${this.getTrendIcon(trendData.trends.totalComponents.trend)} |
| Storybook Coverage | ${trendData.trends.storybookCoverage.value}% | ${trendData.previous?.summary.storybookCoverage || 'N/A'}% | ${this.getTrendIcon(trendData.trends.storybookCoverage.trend)} |
| Test Coverage | ${trendData.trends.testCoverage.value}% | ${trendData.previous?.summary.testCoverage || 'N/A'}% | ${this.getTrendIcon(trendData.trends.testCoverage.trend)} |
| V2 Token Adoption | ${trendData.trends.v2TokenAdoption.value}% | ${trendData.previous?.summary.v2TokenAdoption || 'N/A'}% | ${this.getTrendIcon(trendData.trends.v2TokenAdoption.trend)} |
| Average Health Score | ${trendData.trends.averageHealthScore.value}% | ${trendData.previous?.summary.averageHealthScore || 'N/A'}% | ${this.getTrendIcon(trendData.trends.averageHealthScore.trend)} |
| Components with Issues | ${trendData.trends.componentsWithIssues.value} | ${trendData.previous?.summary.componentsWithIssues || 'N/A'} | ${this.getTrendIcon(trendData.trends.componentsWithIssues.trend)} |

## Key Insights

${trendData.insights.map(insight => `- ${insight}`).join('\n')}

## Recommendations

${this.generateTrendRecommendations(trendData.trends)}

---

*Generated by Vergil Design System Coverage Trend Tracker*
`;

    await fs.promises.writeFile(
      path.join(this.reportsDir, 'coverage-trends.md'),
      reportContent
    );
  }

  private getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '📈 Improving';
      case 'down': return '📉 Declining';
      case 'stable': return '➡️ Stable';
    }
  }

  private generateTrendRecommendations(trends: TrendData['trends']): string {
    const recommendations: string[] = [];

    if (trends.storybookCoverage.trend === 'down') {
      recommendations.push('- **Priority**: Add Storybook stories for recently added components');
    }

    if (trends.testCoverage.trend === 'down') {
      recommendations.push('- **Priority**: Focus on test coverage for new components');
    }

    if (trends.v2TokenAdoption.trend === 'down') {
      recommendations.push('- **Priority**: Audit recent changes for hardcoded values and replace with tokens');
    }

    if (trends.averageHealthScore.trend === 'down') {
      recommendations.push('- **Priority**: Review components with declining health scores');
    }

    if (trends.componentsWithIssues.trend === 'up') {
      recommendations.push('- **Priority**: Allocate time for component maintenance and technical debt');
    }

    // Positive reinforcement
    if (trends.storybookCoverage.trend === 'up') {
      recommendations.push('- **Continue**: Great progress on Storybook documentation!');
    }

    if (trends.testCoverage.trend === 'up') {
      recommendations.push('- **Continue**: Excellent improvement in test coverage!');
    }

    if (trends.v2TokenAdoption.trend === 'up') {
      recommendations.push('- **Continue**: V2 token migration is progressing well!');
    }

    if (recommendations.length === 0) {
      recommendations.push('- **Maintain**: Continue current practices - metrics are stable');
    }

    return recommendations.join('\n');
  }
}

// Run the trend tracker
const tracker = new CoverageTrendTracker();
tracker.trackTrends().catch(console.error);