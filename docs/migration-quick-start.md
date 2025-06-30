# Migration Pipeline Quick Start Guide

## Prerequisites

Before starting the migration, ensure you have:

- ✅ Clean git working directory (`git status` shows no uncommitted changes)
- ✅ Design tokens defined in your system
- ✅ Backup of your current codebase
- ✅ Test suite that runs successfully

## Quick Start (5 Steps)

### Step 1: Extract Hardcoded Values
```bash
npm run migrate:extract
```

This will:
- Scan your entire codebase for hardcoded values
- Replace them with temporary tokens like `var(--unnamed-color-1)`
- Generate a discovery report at `reports/migration-discovery.json`
- Create a git commit checkpoint

**Expected output:**
```
🔄 Stage 1: Discovery & Extraction
=====================================

📁 Found 247 files to analyze
🏷️  Generated 156 temporary tokens
   - color: 45 tokens
   - spacing: 67 tokens
   - typography: 28 tokens
   - shadow: 16 tokens

✅ Stage 1 Complete!
📋 Next steps:
   1. Review the discovery report: reports/migration-discovery.json
   2. Run: npm run migrate:review
```

### Step 2: Review and Map Tokens (Interactive)
```bash
npm run migrate:review
```

This opens an interactive CLI where you'll map each temporary token to a semantic name:

```
🎯 Reviewing: COLOR
   Value: #7B00FF
   Usages: 12 files
   Temporary Token: unnamed-color-1

📝 Usage Examples:
   1. components/Button.tsx:15
      backgroundColor: '#7B00FF'
   2. styles/theme.css:23
      --primary: #7B00FF

💡 Suggested Tokens:
   1. vergil-purple (#7B00FF) - Exact match
   2. primary-color - Name similarity

Choose action (number/custom/skip/auto/search/help): 1
✅ Mapped unnamed-color-1 → vergil-purple
```

**Pro tips:**
- Type `1`, `2`, etc. to select suggested tokens
- Type `auto` to automatically map similar values
- Type `search` to find tokens by name
- Type `skip` to handle later

### Step 3: Validate Migration Readiness
```bash
npm run migrate:validate
```

This checks for issues and gives you a readiness score:

```
✅ Stage 3: Validation Engine
==============================

🔍 Running validation checks...

📊 Validation Results
=====================

✅ Status: READY
🎯 Readiness Score: 95/100
⏱️  Estimated Time: 8m

📈 Summary:
   Complete mappings: 156/156
   Issues: 0 errors, 2 warnings

📋 Next Steps:
   1. Generate transformation rules: npm run migrate:generate-rules
   2. Review transformation rules
   3. Apply migration: npm run migrate:apply
```

### Step 4: Generate Transformation Rules
```bash
npm run migrate:generate-rules
```

This creates the exact rules for how your code will be changed:

```
⚙️  Stage 4: Translation Rules
===============================

🔄 Generating transformation rules...

📊 Rule Generation Results
==========================

✅ Generated 312 transformation rules
🔧 Created 4 build integration configs
📦 Estimated 1,247 code replacements

📋 Rules by Type:
   css-variable: 156
   tailwind-class: 89
   inline-style: 45
   typescript-import: 22

📄 Files saved:
   - reports/migration-rules.json (detailed rules)
   - reports/migration-rules-summary.md (human-readable)
```

### Step 5: Apply Migration
```bash
# Test first (recommended)
npm run migrate:apply:dry-run

# Apply the migration
npm run migrate:apply
```

The dry-run shows what would change without making modifications:

```
🔍 DRY RUN MODE - No files will be modified

🚀 Stage 5: Migration Application
=================================

🔄 Applying transformation rules...
   📝 Would modify: components/Button.tsx
   📝 Would modify: styles/theme.css
   [... 89 more files ...]

✅ All transformation rules applied successfully
🔍 DRY RUN: Skipping build validation

📊 Migration Results
===================

✅ Status: SUCCESS (DRY RUN)
📊 Files Modified: 91 (would be modified)
📋 Rules Applied: 312
```

If the dry-run looks good, apply for real:

```bash
npm run migrate:apply
```

## Alternative: Full Pipeline

Run all stages in sequence (still interactive at Step 2):

```bash
npm run migrate:full-pipeline
```

## Checking Status

At any time, check your progress:

```bash
npm run migrate:status
```

```
📊 Migration Status
==================

🔍 Stage Completion Status:
---------------------------

Stage 1: ✅ Discovery & Extraction - Complete
         Last updated: 12/8/2024, 2:30:15 PM

Stage 2: ✅ Human Review - Complete
         Last updated: 12/8/2024, 2:45:22 PM

Stage 3: ✅ Validation - Complete
         Last updated: 12/8/2024, 2:46:01 PM

Stage 4: ❌ Translation Rules - Not started

📋 Suggested Next Steps:
------------------------

1. Run: npm run migrate:generate-rules
   Generate transformation rules
```

## If Something Goes Wrong

### Rollback
```bash
npm run migrate:rollback
```

This provides options to safely return to a previous state:

```
🔙 Migration Rollback Utility
=============================

📋 Available Rollback Points:
-----------------------------

1. Applied translation rules
   Commit: a1b2c3d4
   Time: 12/8/2024, 3:15:30 PM
   Stage: applying

2. Before migration application  
   Commit: e5f6g7h8
   Time: 12/8/2024, 3:10:15 PM
   Stage: backing-up

3. Manual rollback options
4. Cancel

Choose rollback option (1-4): 2
```

### Get Help
```bash
npm run migrate:help
```

Shows comprehensive help including troubleshooting for common issues.

## What Gets Changed

The migration will transform code like this:

**Before:**
```tsx
// Hardcoded values
const Button = () => (
  <button 
    className="bg-[#7B00FF] text-[#FFFFFF] p-[16px] rounded-[8px]"
    style={{ 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontSize: '14px'
    }}
  >
    Click me
  </button>
);

.custom-element {
  background-color: #7B00FF;
  padding: 16px;
  border-radius: 8px;
}
```

**After:**
```tsx
// Using design tokens
const Button = () => (
  <button 
    className="bg-vergil-purple text-white p-4 rounded-lg"
    style={{ 
      boxShadow: 'var(--shadow-md)',
      fontSize: 'var(--text-sm)'
    }}
  >
    Click me
  </button>
);

.custom-element {
  background-color: var(--vergil-purple);
  padding: var(--spacing-4);
  border-radius: var(--rounded-lg);
}
```

## Tips for Success

1. **Start Small:** Test on a small part of your codebase first
2. **Review Carefully:** Take time in the review stage - it's the most important
3. **Use Dry Run:** Always test with `--dry-run` before applying
4. **Keep Backups:** The system creates them automatically, but have your own too
5. **Test Thoroughly:** Run your full test suite after migration

## Common Patterns

### Large Codebases
For very large codebases (1000+ files), consider:
- Running migration on feature branches
- Migrating components/modules incrementally
- Using the auto-mapping features extensively

### Team Collaboration
- Share the `reports/migration-mappings.json` file for consistent mapping decisions
- Review the validation report as a team
- Create documentation of your semantic token choices

### CI/CD Integration
- Add migration validation to your CI pipeline
- Use dry-run mode for automated testing
- Include rollback procedures in deployment scripts

---

Need help? Run `npm run migrate:help` for comprehensive documentation and troubleshooting.