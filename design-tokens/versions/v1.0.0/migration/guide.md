# Migration Guide: v1.0.0 → v2.0.0

## Overview

This migration moves from the legacy CSS custom properties system to the new YAML-based design token system with improved organization and Apple-inspired design language.

## Major Changes

### 🎨 Color System Overhaul

**Brand Colors Updated:**
- `cosmic-purple` (#6366F1) → `vergil-purple` (#7B00FF)
- `electric-violet` (#A78BFA) → `vergil-purple-light` (#9933FF)
- `luminous-indigo` (#818CF8) → `vergil-purple-lighter` (#BB66FF)

**New Monochrome Palette:**
- Added `vergil-off-black` (#1D1D1F) - primary text
- Added `vergil-off-white` (#F5F5F7) - light text/containers
- Subtle attention hierarchy with emphasis colors

### 🏗️ Token Organization

**Old Structure (CSS):**
```css
:root {
  --cosmic-purple: #6366F1;
  --electric-violet: #A78BFA;
}
```

**New Structure (YAML):**
```yaml
colors:
  brand:
    purple:
      value: "#7B00FF"
      comment: "Primary brand purple"
  legacy:
    cosmic-purple:
      value: "#6366F1"
      deprecated: true
```

## Migration Steps

### 1. Update Dependencies
```bash
npm install
npm run build:tokens
```

### 2. Replace Color References

**CSS/SCSS:**
```diff
- background: var(--cosmic-purple);
+ background: var(--color-vergil-purple);
```

**Tailwind Classes:**
```diff
- bg-cosmic-purple
+ bg-vergil-purple
```

### 3. Update Component Styles

The new system provides semantic tokens for better maintainability:

```diff
- color: var(--cosmic-purple);
+ color: var(--color-interactive-primary);
```

### 4. Test Thoroughly

- [ ] Visual regression testing
- [ ] Component library builds correctly
- [ ] No console errors for missing tokens
- [ ] Accessibility contrast still meets standards

## Breaking Changes

1. **Primary purple changed** from #6366F1 to #7B00FF
2. **Token naming convention** now uses semantic structure
3. **Build process** now requires `npm run build:tokens`
4. **Legacy tokens deprecated** (available but will be removed in v3.0.0)

## Compatibility

Legacy tokens are still available with deprecation warnings:
- `cosmic-purple` → use `vergil-purple`
- `electric-violet` → use `vergil-purple-light`
- `luminous-indigo` → use `vergil-purple-lighter`

## Support

For help with this migration:
- Check the design token documentation
- Run `npm run validate-tokens` to check for issues
- Use `npm run scan:hardcoded` to find remaining hardcoded values

Generated: 2025-06-30T21:49:20.518Z
