# Token Migration Guide

This guide explains how to migrate from arbitrary values to semantic design tokens in our codebase.

## Quick Reference

### Color Migrations

Replace arbitrary hex values with semantic color tokens:

| Old Value | New Token | Usage |
|-----------|-----------|--------|
| `#7B00FF` | `vergil-purple` | Brand primary color |
| `#6366F1` | `cosmic-purple` | Secondary brand color |
| `#10B981` | `success` | Success states |
| `#F59E0B` | `warning` | Warning states |
| `#EF4444` | `error` | Error states |
| `#1D1D1F` | `vergil-off-black` | Primary text |
| `#F5F5F7` | `vergil-off-white` | Light backgrounds |

#### Examples:
```tsx
// ❌ Old
<div className="bg-[#7B00FF]" />
<div style={{ color: '#10B981' }} />

// ✅ New
<div className="bg-vergil-purple" />
<div style={{ color: 'var(--color-success)' }} />
```

### Spacing Migrations

Replace arbitrary pixel values with spacing tokens:

| Old Value | New Token | Actual Value |
|-----------|-----------|-------------|
| `p-[4px]` | `p-xs` | 4px |
| `p-[8px]` | `p-sm` | 8px |
| `p-[16px]` | `p-md` | 16px |
| `p-[24px]` | `p-lg` | 24px |
| `p-[32px]` | `p-xl` | 32px |
| `p-[48px]` | `p-2xl` | 48px |
| `p-[64px]` | `p-3xl` | 64px |

This applies to all spacing utilities: `p-`, `m-`, `px-`, `py-`, `mx-`, `my-`, `gap-`, `space-x-`, `space-y-`

#### Examples:
```tsx
// ❌ Old
<div className="p-[24px] gap-[32px]" />
<div className="mx-[16px] my-[8px]" />

// ✅ New
<div className="p-lg gap-xl" />
<div className="mx-md my-sm" />
```

### Shadow Migrations

Replace Tailwind's default shadows with semantic shadows:

| Old Shadow | New Shadow | Usage |
|------------|------------|--------|
| `shadow-sm`, `shadow` | `shadow-card` | Card components |
| `shadow-md` | `shadow-cardHover` | Card hover states |
| `shadow-lg` | `shadow-dropdown` | Dropdowns, select menus |
| `shadow-xl`, `shadow-2xl` | `shadow-modal` | Modals, dialogs |

#### Examples:
```tsx
// ❌ Old
<Card className="shadow-md hover:shadow-lg" />
<Dialog className="shadow-xl" />

// ✅ New
<Card className="shadow-card hover:shadow-cardHover" />
<Dialog className="shadow-modal" />
```

### Z-Index Migrations

Replace arbitrary z-index values with semantic tokens:

| Old Value | New Token | Usage |
|-----------|-----------|--------|
| `z-50` | `z-modal` | Modals, dialogs |
| `z-40` | `z-overlay` | Overlays, backdrops |
| `z-30` | `z-dropdown` | Dropdowns, popovers |
| `z-20` | `z-sticky` | Sticky headers |
| `z-10` | `z-base` | Base elevated elements |

## Migration Patterns

### 1. Using CSS Variables in JavaScript

When you need color values in JavaScript (e.g., for SVG fills, canvas drawing):

```tsx
// ❌ Old
const color = '#7B00FF';

// ✅ New
const color = 'var(--color-vergil-purple)';
```

### 2. Background and Text Colors

```tsx
// ❌ Old
<div className="bg-[#F5F5F7] text-[#1D1D1F]" />

// ✅ New
<div className="bg-vergil-off-white text-vergil-off-black" />

// Or use semantic tokens
<div className="bg-bg-primary text-text-primary" />
```

### 3. Component-Level Spacing

Use semantic spacing tokens for consistent component spacing:

```tsx
// ❌ Old
<Card className="p-6 space-y-4">
  <div className="mb-2">Title</div>
  <div className="mt-4">Content</div>
</Card>

// ✅ New
<Card className="p-lg space-y-md">
  <div className="mb-sm">Title</div>
  <div className="mt-md">Content</div>
</Card>
```

### 4. Layout Spacing

For larger layout spacing, use the layout-specific tokens:

```tsx
// ❌ Old
<div className="gap-[16px] p-[48px]">

// ✅ New
<div className="gap-layout-gap p-layout-page">
```

## Running the Migration Script

We've provided an automated migration script to help with the conversion:

```bash
# Run the migration script
node scripts/migrate-to-tokens.js

# The script will:
# 1. Find all .tsx files
# 2. Replace arbitrary values with tokens
# 3. Generate a migration report
# 4. Save changes to files
```

## Manual Migration Checklist

When migrating components manually:

1. **Search for arbitrary values**:
   - Look for patterns like `bg-[#`, `text-[#`, `border-[#`
   - Look for patterns like `p-[`, `m-[`, `gap-[`
   - Look for inline styles with hex colors

2. **Replace with tokens**:
   - Use the reference tables above
   - Check `tokens.json` for the full list of available tokens

3. **Test the component**:
   - Ensure visual appearance remains the same
   - Check hover/focus states still work
   - Verify responsive behavior

4. **Update Storybook stories**:
   - Ensure stories use tokens instead of arbitrary values
   - Update any color/spacing controls to use token values

## Common Pitfalls

1. **Don't mix tokens and arbitrary values**:
   ```tsx
   // ❌ Bad
   <div className="p-lg mb-[12px]" />
   
   // ✅ Good
   <div className="p-lg mb-sm" />
   ```

2. **Use semantic tokens when available**:
   ```tsx
   // ❌ Okay
   <div className="bg-vergil-off-white" />
   
   // ✅ Better
   <div className="bg-bg-primary" />
   ```

3. **Don't forget CSS variables in JavaScript**:
   ```tsx
   // ❌ Old
   const styles = { backgroundColor: '#7B00FF' };
   
   // ✅ New
   const styles = { backgroundColor: 'var(--color-vergil-purple)' };
   ```

## Next Steps

1. Run the migration script on your branch
2. Review the changes and test components
3. Update any missed patterns manually
4. Commit with message: "refactor: migrate to semantic design tokens"