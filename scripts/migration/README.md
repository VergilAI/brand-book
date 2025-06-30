# Migration Pipeline Scripts

This directory contains the comprehensive multi-stage migration pipeline system for systematically migrating hardcoded design values to semantic design tokens.

## Scripts Overview

| Script | Purpose | Stage |
|--------|---------|-------|
| `migration-extract.ts` | Discovery & extraction of hardcoded values | 1 |
| `migration-review.ts` | Interactive human review and token mapping | 2 |
| `migration-validate.ts` | Migration readiness validation | 3 |
| `migration-generate-rules.ts` | Transformation rule generation | 4 |
| `migration-apply.ts` | Safe migration application with rollback | 5 |
| `migration-help.ts` | Help system and guidance | Utility |
| `migration-status.ts` | Status checking and progress tracking | Utility |
| `migration-rollback.ts` | Rollback and recovery utilities | Utility |

## Quick Start

```bash
# Complete migration workflow
npm run migrate:extract        # Stage 1: Find hardcoded values
npm run migrate:review         # Stage 2: Map to semantic tokens (interactive)
npm run migrate:validate       # Stage 3: Check readiness
npm run migrate:generate-rules # Stage 4: Create transformation rules
npm run migrate:apply          # Stage 5: Apply migration

# Or run the full pipeline
npm run migrate:full-pipeline
```

## Safety Features

- **Git Integration**: Automatic commit checkpoints at each stage
- **Backup System**: File system backups before any modifications
- **Dry Run Mode**: Test migrations without making changes
- **Rollback Utilities**: Multiple recovery options if issues occur
- **Validation Engine**: Comprehensive pre-flight and post-migration checks

## File Processing

The migration system processes these file types:
- TypeScript/JavaScript: `.ts`, `.tsx`, `.js`, `.jsx`
- Stylesheets: `.css`, `.scss`
- Vue/Svelte: `.vue`, `.svelte`

And detects these hardcoded value types:
- **Colors**: Hex (#7B00FF), RGB/RGBA, HSL/HSLA, named colors
- **Spacing**: px, rem, em, vh, vw units
- **Typography**: font-family, font-size, font-weight, line-height
- **Shadows**: box-shadow, text-shadow
- **Borders**: border-radius, border-width
- **Animations**: durations, timing functions
- **Tailwind Arbitrary**: `bg-[#7B00FF]`, `p-[16px]`, etc.

## Output Files

All migration data is saved to the `reports/` directory:

### Stage Outputs
- `migration-discovery.json` - Extracted values and usage data
- `migration-mappings.json` - Human-reviewed token mappings
- `migration-validation.json` - Validation results and issues
- `migration-rules.json` - Transformation rules for application
- `migration-result.json` - Final migration results and statistics

### Supporting Files
- `migration-*-summary.md` - Human-readable summaries for each stage
- `migration-history.json` - Historical log of all migrations
- `migration-sessions/` - Session backups for resumability

## Error Handling

The system includes comprehensive error handling:

1. **Pre-flight Checks**: Git status, file permissions, disk space
2. **Validation Errors**: Missing tokens, conflicts, breaking changes
3. **Application Errors**: Build failures, test failures, reference errors
4. **Automatic Rollback**: On critical failures, system rolls back automatically
5. **Manual Recovery**: Multiple rollback options available

## Integration Points

### Design Token Systems
- Loads existing tokens from `generated/tokens.json`
- Supports Style Dictionary, Theo, Design Tokens CLI formats
- Works with CSS custom properties and Tailwind themes

### Build Systems
- PostCSS plugin configuration generation
- Tailwind CSS theme extension
- TypeScript path mapping updates
- Webpack/Vite loader compatibility

### Testing
- Pre/post migration test execution
- Build validation after changes
- Visual regression testing hooks
- Accessibility compliance checking

## Command Reference

### Main Pipeline Commands
```bash
npm run migrate:extract           # Start migration pipeline
npm run migrate:review            # Interactive token mapping
npm run migrate:validate          # Check migration readiness
npm run migrate:generate-rules    # Create transformation rules
npm run migrate:apply             # Apply migration
npm run migrate:apply:dry-run     # Test application safely
npm run migrate:full-pipeline     # Run complete pipeline
```

### Utility Commands
```bash
npm run migrate:status            # Check current progress
npm run migrate:help              # Show comprehensive help
npm run migrate:rollback          # Rollback to previous state
```

## Advanced Usage

### Custom Token Mapping
During the review stage, you can:
- Search existing tokens by name or value
- Create custom token names
- Auto-map similar values across the codebase
- Skip values that shouldn't be migrated

### Validation Customization
The validation engine checks:
- Mapping completeness and conflicts
- Target token existence in design system
- Visual impact analysis (color contrast, sizing changes)
- Performance impact estimation
- Breaking change detection

### Rule Generation Options
Transformation rules support:
- CSS variable replacements
- Tailwind class transformations
- Inline style updates
- TypeScript import modifications
- Component prop updates

## Best Practices

### Before Migration
1. Ensure clean git working directory
2. Run full test suite to establish baseline
3. Review design token system completeness
4. Create manual backup if desired

### During Migration
1. Use dry-run mode extensively
2. Take time with human review stage
3. Address validation warnings
4. Test frequently with small batches

### After Migration
1. Run comprehensive testing
2. Perform visual regression testing
3. Monitor build performance
4. Update team documentation
5. Clean up temporary files

## Troubleshooting

### Common Issues

**"File not found" errors**
- Each stage depends on previous outputs
- Run stages in order: extract → review → validate → rules → apply

**Validation blocking errors**
- Review `reports/migration-validation.json` for details
- Fix mapping conflicts or missing tokens
- Re-run validation after fixes

**Build failures after migration**
- Use rollback utility: `npm run migrate:rollback`
- Check validation warnings for potential issues
- Verify design token system completeness

**Large number of values to review**
- Use auto-mapping features in review stage
- Search for existing tokens to speed mapping
- Consider incremental migration approach

### Debug Information
- All operations logged to `reports/` directory
- Detailed error messages with actionable suggestions
- Session persistence allows resuming interrupted reviews
- Multiple rollback options for recovery

### Getting Help
```bash
npm run migrate:help              # Comprehensive help system
npm run migrate:status            # Current progress and next steps
```

## Architecture Notes

### Safety-First Design
The system prioritizes data safety through:
- Non-destructive initial stages (read-only analysis)
- Explicit human approval points
- Comprehensive backup strategies
- Multiple rollback mechanisms
- Extensive validation before changes

### Scalability
Designed to handle large codebases efficiently:
- Memory-conscious file processing
- Parallel rule application where safe
- Incremental backup creation
- Optimized pattern matching algorithms

### Extensibility
Built for customization and extension:
- Pluggable pattern matching
- Custom validation rules
- Flexible transformation rules
- Multiple output formats

---

For comprehensive documentation, see:
- `docs/migration-pipeline-system.md` - Complete system documentation
- `docs/migration-quick-start.md` - Quick start guide with examples