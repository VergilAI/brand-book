# Token Migration Report: Vergil Design System

## Executive Summary

This report provides a comprehensive analysis of the current token usage in the Vergil Design System codebase and identifies areas that need migration to a semantic token system. The analysis reveals a mix of well-structured design tokens alongside numerous arbitrary values that should be systematized.

## Current State Analysis

### 1. Color System

#### Well-Structured Tokens Currently in Use:
- **Brand Colors**: cosmic-purple, electric-violet, luminous-indigo, phosphor-cyan, synaptic-blue, neural-pink
- **Foundation Colors**: pure-light, soft-light, whisper-gray, mist-gray, stone-gray, deep-space
- **Vergil v2 Colors**: vergil-purple (#7B00FF), vergil-off-black, vergil-off-white, emphasis hierarchy
- **Semantic Colors**: success, error, warning, info
- **ShadCN UI Integration**: primary, secondary, accent, muted, destructive, border, input, ring

#### Arbitrary Color Values Found:
- **19 files** contain hard-coded hex values, RGB, or HSL values
- Common arbitrary values:
  - `#8B5CF6` - Used for selection states (map editor, drawing tools, territory games)
  - `#FF6600` - Orange brand color
  - `#1E40AF`, `#0066FF`, `#60A5FA`, `#2563EB` - Various blues
  - `#06B6D4` - Cyan bright
  - Role system uses predefined color array with raw hex values

### 2. Spacing System

#### Current Issues:
- **33 files** contain arbitrary spacing values
- Common patterns found:
  - `p-[24px]`, `m-[16px]`, `gap-[32px]`
  - `w-[300px]`, `h-[500px]`, `max-h-[90vh]`
  - Mixed use of Tailwind defaults and arbitrary values

#### No Systematic Spacing Scale:
- No defined spacing tokens in globals.css or tailwind.config.js
- Relying on Tailwind's default scale with many exceptions

### 3. Typography System

#### Well-Structured:
- Font families: font-sans (Inter), font-display (Lato), font-serif (Georgia)
- Font sizes defined in tailwind.config.js:
  - Display: display-xl, display-lg, display-md
  - Headings: h1, h2, h3, h4
  - Body: body-lg, body-md, body-sm
  - Small: caption, overline

#### Issues:
- No line-height or letter-spacing tokens
- No font-weight tokens

### 4. Shadow System

#### Existing Shadow Tokens (in packages/design-system/tokens/shadows.ts):
- Base shadows: sm, base, md, lg, xl, 2xl
- Brand shadows: cosmic, electric, neural
- Inner shadows: inner, innerLg
- Glow effects: cosmic, electric, phosphor, synaptic

#### Issues:
- Shadow tokens defined in package but not integrated into Tailwind config
- Components use default Tailwind shadows (shadow-xs, shadow-sm) not custom tokens

### 5. Animation & Motion

#### Well-Structured:
- Timing functions: ease-smooth, ease-bounce, ease-natural
- Animations: breathing, pulse-glow, gradient-shift, synaptic-pulse, neural-flow
- Durations implicitly defined in keyframes

#### Missing:
- No explicit duration tokens
- No delay tokens

### 6. Border & Radius

#### Current State:
- Border radius uses CSS variable: `--radius` (0.625rem)
- Tailwind extends with lg, md, sm variants
- No border width tokens
- No systematic approach to border colors

## Migration Requirements

### 1. Color Token Migration

#### Immediate Actions:
1. **Replace arbitrary hex values** with semantic tokens:
   ```tsx
   // ❌ Current
   <div className="bg-[#8B5CF6]" />
   
   // ✅ Proposed
   <div className="bg-selection-primary" />
   ```

2. **Create semantic color tokens** for common use cases:
   ```css
   --color-selection-primary: var(--vergil-purple);
   --color-selection-hover: var(--vergil-purple-light);
   --color-border-default: var(--mist-gray);
   --color-border-emphasis: var(--vergil-purple);
   ```

3. **Consolidate role colors** into semantic tokens

### 2. Spacing Token System

#### Proposed Spacing Scale:
```css
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
  --space-32: 8rem;    /* 128px */
}
```

#### Migration Examples:
```tsx
// ❌ Current
<div className="p-[24px] m-[16px] gap-[32px]" />

// ✅ Proposed
<div className="p-6 m-4 gap-8" />
```

### 3. Size Token System

#### Fixed Dimensions:
```css
:root {
  /* Component sizes */
  --size-button-sm: 2rem;     /* 32px */
  --size-button-md: 2.25rem;  /* 36px */
  --size-button-lg: 2.5rem;   /* 40px */
  
  /* Layout sizes */
  --size-sidebar: 16rem;      /* 256px */
  --size-modal-sm: 24rem;     /* 384px */
  --size-modal-md: 32rem;     /* 512px */
  --size-modal-lg: 48rem;     /* 768px */
  
  /* Max heights */
  --max-height-modal: 90vh;
  --max-height-dropdown: 20rem;
}
```

### 4. Shadow Integration

```javascript
// tailwind.config.js
shadows: {
  xs: 'var(--shadow-sm)',
  sm: 'var(--shadow-base)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  'brand': 'var(--shadow-cosmic)',
  'glow': 'var(--shadow-glow-cosmic)',
}
```

### 5. Component-Specific Tokens

#### Modal System:
```css
--modal-padding: var(--space-8);
--modal-radius: var(--radius-lg);
--modal-shadow: var(--shadow-xl);
```

#### Card System:
```css
--card-padding: var(--space-6);
--card-gap: var(--space-4);
--card-radius: var(--radius);
--card-shadow-default: var(--shadow-sm);
--card-shadow-hover: var(--shadow-md);
```

## Priority Migration Areas

### Phase 1 (High Priority):
1. **Color consolidation** - Replace all arbitrary hex/rgb values
2. **Spacing standardization** - Implement spacing scale
3. **Component dimensions** - Define size tokens for common patterns

### Phase 2 (Medium Priority):
1. **Shadow integration** - Connect shadow tokens to Tailwind
2. **Border system** - Create border width and color tokens
3. **Animation tokens** - Define duration and delay scales

### Phase 3 (Low Priority):
1. **Typography refinement** - Add weight and leading tokens
2. **Breakpoint tokens** - Standardize responsive breakpoints
3. **Z-index scale** - Create layering system

## Migration Strategy

1. **Create token definition file** (`tokens/index.css`):
   - Define all CSS custom properties
   - Group by category (color, space, size, etc.)

2. **Update Tailwind config** to reference CSS variables:
   ```javascript
   spacing: {
     0: 'var(--space-0)',
     1: 'var(--space-1)',
     // ...
   }
   ```

3. **Component-by-component migration**:
   - Start with high-traffic components (Button, Card, Modal)
   - Use find-and-replace for common patterns
   - Test thoroughly after each migration

4. **Lint rules** to prevent new arbitrary values:
   - ESLint plugin to flag `[value]` syntax
   - Pre-commit hooks to check for violations

## Affected Files Summary

- **19 files** with arbitrary color values
- **33 files** with arbitrary spacing values
- **1 file** with arbitrary shadow values
- **Total unique files**: ~40-50 requiring updates

## Benefits of Migration

1. **Consistency**: Enforced design system across all components
2. **Maintainability**: Central token management
3. **Theming**: Easier to implement dark mode and brand variations
4. **Performance**: Reduced CSS bundle size through reuse
5. **Developer Experience**: Faster development with semantic tokens

## Next Steps

1. Review and approve proposed token structure
2. Create comprehensive token definition file
3. Update Tailwind configuration
4. Begin phased migration starting with Phase 1
5. Implement linting rules to maintain consistency
6. Document token usage guidelines

---

*This report was generated on 2025-07-03 based on analysis of the current codebase.*