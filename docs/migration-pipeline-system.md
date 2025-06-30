# Multi-Stage Migration Pipeline System

## Overview

The Migration Pipeline System provides a comprehensive, safe, and systematic approach to migrating hardcoded design values to semantic design tokens. The system is built around five carefully orchestrated stages that ensure data integrity, human oversight, and rollback capabilities.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Stage 1       │    │   Stage 2       │    │   Stage 3       │
│   Discovery     │───▶│   Human Review  │───▶│   Validation    │
│   & Extraction  │    │   Interface     │    │   Engine        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Stage 4       │    │   Stage 5       │    │   Rollback      │
│   Translation   │───▶│   Application   │───▶│   & Recovery    │
│   Rules         │    │   Engine        │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Stage Details

### Stage 1: Discovery & Extraction
**Command:** `npm run migrate:extract`

Automatically scans the entire codebase to identify hardcoded design values and temporarily replaces them with placeholder tokens.

**Features:**
- Comprehensive pattern matching for colors, spacing, typography, shadows, animations
- Intelligent filtering to avoid false positives (URLs, imports, etc.)
- Temporary token generation with semantic categorization
- Git checkpoint creation for safe rollback
- Detailed discovery reporting

**Outputs:**
- `reports/migration-discovery.json` - Detailed extraction data
- `reports/migration-discovery-summary.md` - Human-readable summary
- Modified source files with temporary tokens

**Example Output:**
```json
{
  "extractedValues": [
    {
      "id": "extracted_color_1",
      "type": "color",
      "value": "#7B00FF",
      "temporaryToken": "unnamed-color-1",
      "usages": [
        {
          "file": "components/Button.tsx",
          "line": 15,
          "context": "backgroundColor: '#7B00FF'",
          "confidence": "high"
        }
      ],
      "suggestedNames": ["primary-color", "brand-purple"]
    }
  ]
}
```

### Stage 2: Human Review Interface
**Command:** `npm run migrate:review`

Interactive CLI that guides humans through mapping temporary tokens to semantic design token names.

**Features:**
- Contextual presentation of each hardcoded value
- Intelligent suggestions based on value similarity and naming patterns
- Auto-mapping capabilities for similar values
- Search and browse available target tokens
- Session persistence and resumability
- Confidence tracking (auto vs human-verified)

**Interactive Commands:**
- `[number]` - Select suggested token
- `custom` - Enter custom token name
- `skip` - Skip for now
- `auto` - Auto-map similar values
- `search` - Search available tokens
- `help` - Show commands

**Outputs:**
- `reports/migration-mappings.json` - Final mapping decisions
- `reports/migration-sessions/` - Session backup files

### Stage 3: Validation Engine
**Command:** `npm run migrate:validate`

Comprehensive validation to ensure migration readiness and detect potential issues.

**Validation Categories:**
- **Mapping Completeness:** Ensures all values are mapped
- **Target Token Existence:** Verifies tokens exist in design system
- **Conflict Detection:** Identifies conflicting mappings
- **Visual Impact Analysis:** Assesses color/sizing changes
- **Performance Impact:** Estimates build and runtime effects
- **Breaking Change Detection:** Identifies API-breaking changes

**Outputs:**
- `reports/migration-validation.json` - Detailed validation results
- `reports/migration-validation-summary.md` - Human-readable report
- Readiness score (0-100) and status (ready/needs-review/blocked)

**Example Validation Issue:**
```json
{
  "severity": "error",
  "category": "mapping",
  "title": "Missing target tokens",
  "description": "5 mapped tokens do not exist in the target token set.",
  "suggestions": [
    "Create the missing tokens in your design system",
    "Update mappings to use existing tokens"
  ],
  "autoFixable": true
}
```

### Stage 4: Translation Rules
**Command:** `npm run migrate:generate-rules`

Generates explicit transformation rules that define exactly how code will be modified.

**Rule Types:**
- **CSS Variable Rules:** `var(--temp-token)` → `var(--semantic-token)`
- **Tailwind Class Rules:** `bg-[#7B00FF]` → `bg-primary`
- **Inline Style Rules:** React/Vue inline style transformations
- **TypeScript Import Rules:** Token import statement updates
- **Component Prop Rules:** Component property name changes

**Build Integration:**
- PostCSS configuration for CSS custom properties
- Tailwind CSS theme extension
- TypeScript path mapping
- Webpack/Vite integration hints

**Outputs:**
- `reports/migration-rules.json` - Complete rule set
- `reports/migration-rules-summary.md` - Human-readable rules
- `scripts/migration/apply-migration-rules.js` - Executable script

### Stage 5: Application Engine
**Command:** `npm run migrate:apply`

Safe execution of the migration with comprehensive rollback capabilities.

**Safety Features:**
- Pre-flight checks (git status, permissions, disk space)
- Automatic backup creation (git commits + file system)
- Staged application with checkpoints after each rule type
- Real-time validation during application
- Post-migration verification (build, tests, reference checking)
- Comprehensive error handling and rollback

**Application Stages:**
1. **Preparation:** Load rules, run pre-flight checks
2. **Backup:** Create git commits and file system backups
3. **Application:** Apply rules by type with checkpoints
4. **Validation:** Run build, tests, and reference checks
5. **Cleanup:** Remove temporary files, update documentation

**Options:**
- `--dry-run`: Test application without making changes
- Automatic rollback on failure
- Manual rollback utilities

## Usage Examples

### Basic Migration Workflow
```bash
# 1. Extract hardcoded values
npm run migrate:extract

# 2. Review and map tokens (interactive)
npm run migrate:review

# 3. Validate migration readiness
npm run migrate:validate

# 4. Generate transformation rules
npm run migrate:generate-rules

# 5. Test the migration (no changes made)
npm run migrate:apply:dry-run

# 6. Apply the migration
npm run migrate:apply
```

### Full Automated Pipeline
```bash
# Run complete pipeline (interactive at Stage 2)
npm run migrate:full-pipeline
```

### Status and Rollback
```bash
# Check current status
npm run migrate:status

# Get help
npm run migrate:help

# Rollback if needed
npm run migrate:rollback
```

## File Structure

```
scripts/migration/
├── migration-extract.ts          # Stage 1: Discovery & Extraction
├── migration-review.ts           # Stage 2: Human Review Interface  
├── migration-validate.ts         # Stage 3: Validation Engine
├── migration-generate-rules.ts   # Stage 4: Translation Rules
├── migration-apply.ts            # Stage 5: Application Engine
├── migration-help.ts             # Help and guidance system
├── migration-status.ts           # Status checking utility
└── migration-rollback.ts         # Rollback and recovery tools

reports/
├── migration-discovery.json      # Stage 1 output
├── migration-mappings.json       # Stage 2 output
├── migration-validation.json     # Stage 3 output  
├── migration-rules.json          # Stage 4 output
├── migration-result.json         # Stage 5 output
├── migration-history.json        # Historical log
└── migration-sessions/           # Review session backups

backups/
└── migration-{timestamp}/        # File system backups
```

## Error Handling and Recovery

### Automatic Rollback Triggers
- Pre-flight check failures
- File permission errors
- Build failures after application
- Critical validation errors

### Manual Recovery Options
1. **Git-based recovery:** Reset to migration checkpoints
2. **File system restoration:** Restore from backup directories
3. **Selective rollback:** Revert individual files
4. **Progressive recovery:** Fix issues and continue from checkpoint

### Recovery Commands
```bash
# Automated rollback utility
npm run migrate:rollback

# Manual git rollback
git log --oneline --grep="migration"
git reset --hard <commit-hash>

# Restore from backup
cp -r backups/migration-latest/* .
```

## Integration with Existing Systems

### Design Token Systems
- Supports any JSON-based token format
- Integrates with Style Dictionary, Theo, Design Tokens CLI
- Works with CSS custom properties, SCSS variables, JS tokens

### Build Systems
- PostCSS plugin configuration
- Tailwind CSS theme integration
- Webpack/Vite loader compatibility
- TypeScript path mapping

### Testing Integration
- Pre/post migration test running
- Visual regression testing hooks
- Accessibility compliance checking
- Build validation

## Performance Considerations

### Scalability
- Handles codebases with 10,000+ files
- Efficient pattern matching algorithms
- Memory-conscious file processing
- Parallel rule application where safe

### Optimization Features
- Duplicate pattern elimination
- Rule conflict resolution
- Batch file processing
- Incremental backup creation

## Security Features

### Safe Defaults
- Read-only operations in discovery/validation stages
- Explicit confirmation for destructive operations
- Automatic backup creation before changes
- Comprehensive audit logging

### Permission Handling
- File write permission validation
- Git repository status checking
- Backup directory creation
- Error handling for permission issues

## Troubleshooting

### Common Issues

**"File not found" errors**
- Solution: Run previous stages first (each stage depends on previous outputs)

**Validation blocking errors**
- Solution: Review `reports/migration-validation.json` and fix issues before proceeding

**Build failures after migration**
- Solution: Use `npm run migrate:rollback` and review validation warnings

**Too many values to review**
- Solution: Use auto-mapping features in Stage 2 review interface

**Git working directory not clean**
- Solution: Commit or stash changes before running migration

### Debug Information
- All operations logged to `reports/` directory
- Detailed error messages with suggestions
- Session persistence for resumability
- Comprehensive rollback capabilities

## Best Practices

### Before Migration
1. Ensure clean git working directory
2. Run full test suite to establish baseline
3. Review design token system completeness
4. Plan for gradual rollout if needed

### During Migration
1. Use dry-run mode to test changes
2. Review validation warnings carefully
3. Take time with human review stage
4. Create manual checkpoints for large migrations

### After Migration
1. Run comprehensive testing
2. Perform visual regression testing
3. Monitor build performance
4. Update team documentation
5. Clean up temporary migration files

## Advanced Features

### Custom Pattern Matching
Extend the extraction patterns for organization-specific hardcoded value formats.

### Plugin System
Integration points for custom validation rules, transformation patterns, and post-processing.

### Multi-Version Support
Support for migrating between different design token system versions.

### Team Collaboration
Session sharing and collaborative review features for team-based migrations.

---

For additional help, run:
```bash
npm run migrate:help
```