# Component Coverage Reporting System

The Vergil Design System includes a comprehensive automated coverage reporting system that analyzes component quality, design token adoption, and overall system health.

## Overview

The coverage reporting system provides visibility into:

- **Storybook Coverage**: Which components have stories and how complete they are
- **Test Coverage**: Which components have unit tests and their quality
- **V2 Token Adoption**: Usage of design tokens vs. hardcoded values
- **Component Health Scores**: Overall quality metrics (0-100%)
- **Documentation Quality**: TypeScript definitions and JSDoc comments
- **Actionable Recommendations**: Prioritized improvement suggestions

## Usage

### Generate All Reports

```bash
npm run report:coverage
```

This command generates four types of reports in the `/reports` directory:

1. **coverage-summary.md** - High-level overview and key insights
2. **coverage-detailed.json** - Machine-readable detailed data
3. **coverage-by-component.md** - Individual component analysis
4. **coverage-dashboard.html** - Interactive visual dashboard

### Report Files

#### Summary Report (`coverage-summary.md`)
- Overview metrics and trends
- Health score distribution
- Top performing components
- Priority recommendations
- Next steps

#### Detailed Report (`coverage-detailed.json`)
- Complete component data in JSON format
- Suitable for automated processing
- Historical trend tracking data
- Raw metrics for custom analysis

#### Component Report (`coverage-by-component.md`)
- Individual component breakdown
- Specific recommendations per component
- Detailed scoring explanations
- File existence checks

#### Dashboard (`coverage-dashboard.html`)
- Interactive charts and visualizations
- Filterable component tables
- Visual health score indicators
- Category breakdowns

## Health Score Calculation

Each component receives a health score (0-100%) based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| Has Story | 20% | Storybook story exists |
| Has Test | 20% | Unit test exists |
| Story Completeness | 15% | Multiple variants, controls, docs |
| Test Coverage | 15% | Multiple test cases, render tests |
| Token Usage | 20% | V2 tokens vs hardcoded values |
| Documentation | 10% | JSDoc, props, README |
| TypeScript | 20% | Proper typing, interfaces |

### Health Score Ranges

- **90-100%**: Excellent - Component meets all standards
- **70-89%**: Good - Minor improvements needed
- **50-69%**: Fair - Several issues to address
- **0-49%**: Needs Work - Major improvements required

## Component Analysis

The system analyzes components in these categories:

- **UI Components** (`/components/ui/`) - Core design system primitives
- **Vergil Components** (`/components/vergil/`) - Brand-specific components
- **Landing Components** (`/components/landing/`) - Landing page components
- **LMS Components** (`/components/lms/`) - Learning management system components
- **Documentation Components** (`/components/docs/`) - Documentation utilities

## Token Usage Analysis

The system identifies:

### V2 Design Tokens (Preferred)
- `vergil-purple`, `vergil-off-black`, `vergil-off-white`
- `vergil-emphasis-bg`, `vergil-emphasis-dropdown-bg`
- `vergil-emphasis-text`, `vergil-emphasis-button`
- `cosmic-purple`, `neural-blue`

### Hardcoded Values (To Replace)
- Hex colors (`#7B00FF`)
- RGB/RGBA values (`rgb(123, 0, 255)`)
- Arbitrary Tailwind classes (`bg-[#7B00FF]`)
- Inline styles with hardcoded values

## Recommendations System

The system generates prioritized recommendations:

### High Priority
- Missing Storybook stories
- Missing unit tests
- Components with health scores < 50%

### Medium Priority
- Low token adoption (< 50%)
- Incomplete story variants
- Missing component exports

### Low Priority
- Documentation improvements
- TypeScript enhancements
- Performance optimizations

## Integration with CI/CD

The coverage report can be integrated into your CI/CD pipeline:

```bash
# In your CI script
npm run report:coverage

# Check if health score meets minimum threshold
node -e "
  const report = require('./reports/coverage-detailed.json');
  if (report.summary.averageHealthScore < 70) {
    console.error('Health score below threshold');
    process.exit(1);
  }
"
```

## Viewing the Dashboard

Open the generated HTML dashboard in your browser:

```bash
open reports/coverage-dashboard.html
```

The dashboard includes:
- Real-time metrics cards
- Interactive charts (Chart.js)
- Sortable component tables
- Color-coded health indicators
- Responsive design for mobile/desktop

## Historical Tracking

The system supports trend tracking by comparing reports over time:

1. Archive previous reports: `mv reports/coverage-detailed.json reports/coverage-$(date +%Y%m%d).json`
2. Generate new report: `npm run report:coverage`
3. Compare metrics to identify improvements and regressions

## Customization

### Adding New Metrics

Extend the `ComponentInfo` interface in `scripts/generate-coverage-report.ts`:

```typescript
interface ComponentInfo {
  // existing fields...
  customMetric: number;
}
```

### Modifying Health Score Weights

Update the weights in the `calculateHealthScore` method:

```typescript
const weights = {
  hasStory: 20,
  hasTest: 20,
  // ... modify as needed
};
```

### Adding New Token Patterns

Update the `v2Tokens` array in the `analyzeTokenUsage` method:

```typescript
const v2Tokens = [
  'vergil-purple',
  'your-new-token',
  // ...
];
```

## Best Practices

1. **Run Regularly**: Generate reports weekly or before releases
2. **Set Targets**: Aim for >80% average health score
3. **Prioritize Issues**: Address high-priority recommendations first
4. **Track Progress**: Compare reports over time
5. **Team Reviews**: Discuss results in design system meetings

## Troubleshooting

### Common Issues

**"No components found"**
- Check that components exist in expected directories
- Verify component naming conventions

**"Hardcoded scan failed"**
- Ensure `tsx` is installed
- Check that scan script exists and is executable

**"Reports not generated"**
- Verify write permissions in `/reports` directory
- Check for filesystem space issues

**"Dashboard not loading"**
- Ensure Chart.js CDN is accessible
- Check browser console for JavaScript errors

## Contributing

To improve the coverage reporting system:

1. Add new analysis methods in `CoverageReportGenerator`
2. Extend report templates with additional metrics
3. Enhance the HTML dashboard with new visualizations
4. Add support for additional file types or patterns

---

*Part of the Vergil Design System documentation*