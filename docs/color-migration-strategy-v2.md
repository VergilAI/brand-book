# V2 Color Migration Strategy - Complete Approach //comment

## Overview
This document outlines the correct approach for migrating from V1 colors (hex values and old CSS variables) to the V2 semantic color system, with lessons learned from the initial attempt.

## Key Principles

### 1. Understand the Scope First
Before any migration:
- Audit ALL color usage in the codebase
- Identify which colors are intentional (demos, visualizations) vs system colors
- Map out all color variable definitions and their dependencies
- Understand the difference between variable definitions and variable usage

### 2. Clean Migration Strategy

The migration should happen in this exact order:

#### Phase 1: Preparation
1. **Create comprehensive color mapping**
   - Document every hex value in the codebase
   - Map each to its V2 equivalent
   - Identify colors that have NO V2 equivalent
   - Decide which colors to add to V2 BEFORE migration

2. **Audit CSS variable definitions**
   - Find all places where CSS variables are DEFINED (not used)
   - Typically in `globals.css`, theme files, and component-scoped styles
   - Document the inheritance chain (e.g., `--cosmic-purple: #6366F1`)

3. **Create test plan**
   - Screenshot key pages/components before migration
   - List critical visual elements to verify
   - Set up visual regression tests if possible

#### Phase 2: Define V2 System Completely
1. **Finalize V2 colors in Storybook**
   - Add any missing essential colors identified in Phase 1
   - Document each color's purpose clearly
   - Get stakeholder approval on the complete set

2. **Update globals.css with V2 definitions**
   ```css
   :root {
     /* V2 Colors - These are the ONLY system colors */
     --vergil-purple: #7B00FF;
     --vergil-purple-light: #9933FF;
     /* ... etc ... */
   }
   ```

#### Phase 3: Migration Execution

**Critical Insight**: Never replace variable definitions with references to other variables. Only replace USAGE.

1. **Clean up CSS files**
   - Remove ALL old variable definitions (cosmic-purple, etc.)
   - Keep ONLY V2 variable definitions
   - Replace hex values with V2 variables
   - Replace old var() references with V2 var() references

2. **Update TypeScript/TSX files**
   - Replace hex colors with V2 variables
   - Update Tailwind arbitrary values
   - Fix style objects to use CSS variables
   - Update color arrays for charts/visualizations

3. **Update Tailwind config**
   - Remove all old color definitions
   - Add only V2 colors
   - Ensure naming matches CSS variables

#### Phase 4: Validation
1. **Build and test locally**
   - Check for build errors
   - Verify no missing color references
   - Test in both light/dark modes if applicable

2. **Visual verification**
   - Compare against Phase 1 screenshots
   - Check all interactive states
   - Verify gradients and special effects

## What Went Wrong in First Attempt

### 1. Variable Definition Confusion
```css
/* WRONG - Created circular reference */
--cosmic-purple: var(--vergil-purple);

/* RIGHT - Should have been removed entirely */
/* --cosmic-purple should not exist at all */
```

### 2. Incomplete Replacement
- Script replaced some instances but not others
- Didn't handle all contexts (CSS vars, hex, Tailwind classes)
- Left old definitions in place

### 3. No Clear Definition of V2
- Added colors during migration instead of before
- Didn't have complete mapping upfront
- Mixed concerns (defining vs using colors)

## Correct Migration Script Approach

### Script Requirements
1. **Two separate scripts**:
   - `audit-colors.js` - Find all colors, create report
   - `migrate-colors.js` - Execute migration based on approved mapping

2. **Handle all contexts**:
   ```javascript
   // CSS files
   - Variable definitions: --cosmic-purple: #6366F1;
   - Variable usage: var(--cosmic-purple)
   - Hex values: #6366F1

   // TS/TSX files
   - Style objects: { color: '#6366F1' }
   - CSS variables: 'var(--cosmic-purple)'
   - Tailwind arbitrary: 'bg-[#6366F1]'
   - Tailwind classes: 'text-cosmic-purple'
   ```

3. **Validation built-in**:
   - Verify no old variables remain defined
   - Check for unmapped colors
   - Ensure no circular references

### Example Migration Mapping
```javascript
const migrationMap = {
  // Old variable name -> New variable name
  variables: {
    'cosmic-purple': 'vergil-purple',
    'electric-violet': 'vergil-purple-lighter',
    'luminous-indigo': 'vergil-purple-light',
    // ... etc
  },

  // Hex -> CSS variable
  hexColors: {
    '#6366F1': 'vergil-purple',
    '#A78BFA': 'vergil-purple-lighter',
    '#818CF8': 'vergil-purple-light',
    // ... etc
  },

  // Colors to preserve (demos, etc)
  preserveList: [
    '#0077BE', // Ocean palette for streamgraph
    '#FF0066', // Game-specific colors
    // ... etc
  ]
}
```

## Step-by-Step Execution Plan

### Day 1: Audit
1. Run color audit script
2. Review all colors found
3. Categorize: System vs Demo/Special
4. Create complete V2 mapping

### Day 2: Preparation
1. Add any missing colors to V2 system
2. Update Storybook documentation
3. Get approval on complete V2 system
4. Take screenshots of key pages

### Day 3: Migration
1. Create backup/branch
2. Run migration script with --dry-run
3. Review changes
4. Run actual migration
5. Manually verify globals.css is clean

### Day 4: Validation
1. Fix any build errors
2. Visual regression testing
3. Test all interactive states
4. Deploy to staging

## Common Pitfalls to Avoid

1. **Don't migrate partially** - Do it all at once
2. **Don't keep old variables** - Remove them completely
3. **Don't guess mappings** - Audit first, map explicitly
4. **Don't mix definition and usage** - CSS vars are defined in one place, used everywhere else
5. **Don't forget Tailwind** - It has its own color definitions that must align

## Success Criteria

✅ Zero hex colors in system code (only in demos/special cases)
✅ Zero old variable names (cosmic-purple, etc.)
✅ All colors traceable to V2 system
✅ No visual regressions
✅ Clean, maintainable color system

## Recovery Plan

If migration fails:
1. Git reset to pre-migration commit
2. Re-run audit to understand what was missed
3. Update migration script
4. Try again with smaller scope (one module at a time)

## Long-term Maintenance

1. **Linting rules** to prevent hex colors in PRs
2. **Storybook** as single source of truth
3. **Documentation** for when to add new colors
4. **Regular audits** to prevent color sprawl
