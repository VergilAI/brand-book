# Safe Token Migration Guide

This guide explains how to use the safe, non-breaking token migration system to convert hardcoded values to design tokens without any visual changes or broken UI.

## Overview

The safe migration system ensures your UI never breaks during the migration process by:
1. **Creating CSS definitions first** - All temporary tokens are defined before use
2. **Validating before replacing** - Ensures tokens resolve correctly
3. **Atomic operations** - All-or-nothing approach
4. **Easy rollback** - Git-based recovery at any stage

## Quick Start

```bash
# 1. Run safe extraction (non-breaking)
npm run migrate:extract:safe

# 2. Review and map tokens visually
npm run migrate:review:visual

# 3. Validate mappings
npm run migrate:validate

# 4. Apply final migration
npm run migrate:apply
```

## Detailed Process

### Step 1: Safe Extraction

```bash
npm run migrate:extract:safe
```

This command:
- Creates a backup git commit for easy rollback
- Scans your codebase for hardcoded values
- Generates `styles/migration-tokens.css` with all temporary token definitions
- Updates `app/globals.css` to import the migration tokens
- Validates that all tokens are properly defined
- Only then replaces hardcoded values with CSS variables
- Creates a discovery report in `reports/migration-discovery.json`

**Example of what happens:**

Before:
```css
.button {
  border-radius: 8px;
  background: #7B00FF;
}
```

Generated `styles/migration-tokens.css`:
```css
:root {
  --temp-radius-1: 8px;
  --temp-color-1: #7B00FF;
}
```

After (with CSS already loaded):
```css
.button {
  border-radius: var(--temp-radius-1);
  background: var(--temp-color-1);
}
```

**Your UI remains exactly the same!**

### Step 2: Visual Review

```bash
npm run migrate:review:visual
```

This opens a web-based interface at `http://localhost:3333` where you can:
- See all extracted tokens grouped by value
- Preview colors, spacing, and other values visually
- Map temporary tokens to semantic names
- Bulk approve similar values
- Track progress with a visual progress bar

Features:
- **Smart grouping** - Tokens with the same value are grouped together
- **Context display** - See where each token is used
- **Bulk actions** - Approve multiple tokens at once
- **Auto-save** - Your progress is saved automatically
- **Resume anytime** - Close and reopen to continue where you left off

### Step 3: Validate Mappings

```bash
npm run migrate:validate
```

This ensures:
- All temporary tokens have semantic mappings
- No naming conflicts exist
- Token names follow conventions
- Values are appropriate for their types

### Step 4: Apply Migration

```bash
npm run migrate:apply
```

This final step:
- Generates semantic token definitions in your design system
- Updates all files to use semantic tokens instead of temporary ones
- Removes the temporary migration files
- Creates a final git commit

## Rollback Options

At any stage, you can rollback:

```bash
# Check the backup commit hash from the extraction output
git reset --hard <backup-commit-hash>

# Or use the migration rollback command
npm run migrate:rollback
```

## Common Scenarios

### Scenario 1: Partial Migration

If you only want to migrate certain types of values:

```bash
# Extract only colors
npm run migrate:extract:safe -- --type color

# Extract only spacing
npm run migrate:extract:safe -- --type spacing
```

### Scenario 2: Exclude Certain Files

```bash
# Exclude specific directories
npm run migrate:extract:safe -- --exclude "tests,stories"
```

### Scenario 3: Test First

```bash
# Run extraction on a single file to test
npm run migrate:extract:safe -- --files "components/Button.tsx"
```

## What Makes This Safe?

1. **CSS First** - Temporary tokens are defined in CSS before any replacements
2. **Import Order** - Migration CSS is imported early in the cascade
3. **Validation** - System verifies tokens resolve before proceeding
4. **Atomic Updates** - Either all replacements succeed or none do
5. **Git Integration** - Automatic backup commits for easy recovery

## Troubleshooting

### Issue: Styles still broken after extraction

**Solution**: Check that `styles/migration-tokens.css` exists and is imported in `app/globals.css`

```bash
# Verify the file exists
ls -la styles/migration-tokens.css

# Check globals.css includes the import
grep "migration-tokens" app/globals.css
```

### Issue: Can't access review interface

**Solution**: Ensure port 3333 is available

```bash
# Check if port is in use
lsof -i :3333

# Use a different port
PORT=4444 npm run migrate:review:visual
```

### Issue: Lost progress in review

**Solution**: Check for saved session file

```bash
# Session is saved here
cat reports/migration-review-session.json
```

## Best Practices

1. **Review the discovery report first**
   ```bash
   cat reports/migration-discovery-summary.md
   ```

2. **Start with high-confidence replacements**
   - Focus on CSS properties first
   - Then Tailwind arbitrary values
   - Finally JS/TS values

3. **Use semantic naming conventions**
   - Colors: `brand-purple`, `surface-primary`
   - Spacing: `spacing-xs`, `spacing-md`
   - Radius: `radius-sm`, `radius-full`

4. **Group related tokens**
   - All shades of a color together
   - Spacing scale in order
   - Related component tokens

5. **Test incrementally**
   - Run visual regression tests after extraction
   - Verify no style changes occurred
   - Document any intentional changes

## Advanced Usage

### Custom Token Naming

Create a naming configuration:

```json
{
  "color": {
    "#7B00FF": "brand-purple",
    "#6366F1": "legacy-purple"
  },
  "spacing": {
    "16px": "spacing-md",
    "24px": "spacing-lg"
  }
}
```

### Integration with CI/CD

```yaml
# .github/workflows/token-migration.yml
name: Token Migration Check
on: [pull_request]

jobs:
  check-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run scan:hardcoded
      - run: npm run validate-tokens
```

## Next Steps

After successful migration:

1. **Remove migration files**
   ```bash
   rm styles/migration-tokens.css
   # Remove import from globals.css
   ```

2. **Update documentation**
   - Document new token names
   - Update component examples
   - Create migration guide for team

3. **Set up enforcement**
   ```bash
   # Enable ESLint rules
   npm run lint:tokens
   ```

4. **Monitor adoption**
   ```bash
   npm run report:coverage
   ```

## Summary

The safe migration system ensures:
- ✅ Zero visual breaking changes
- ✅ Easy rollback at any stage
- ✅ Visual review interface
- ✅ Automated validation
- ✅ Git integration for safety

Your UI stays intact throughout the entire process!