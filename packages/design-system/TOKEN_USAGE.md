# Vergil Design System - Token Usage Guide

## Overview

The Vergil Design System uses a three-tier token architecture:

1. **Primitive Tokens**: Raw design values (colors, spacing, typography, etc.)
2. **Semantic Tokens**: Purpose-based tokens that reference primitives
3. **Component Tokens**: Component-specific design decisions

## Token Generation

Run the token generation script to update all token outputs:

```bash
npm run tokens:generate
```

This generates:
- CSS custom properties (`tokens.css`)
- Tailwind plugin configuration (`tailwind-plugin.js`)
- TypeScript types (`tokens.d.ts`)
- JSON documentation (`tokens.json`)

## Usage in Code

### CSS Variables

All tokens are available as CSS custom properties:

```css
/* Primitive tokens */
.element {
  color: var(--vergil-purple);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Semantic tokens */
.card {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-card);
}
```

### Tailwind Classes

The plugin provides Tailwind utilities for all tokens:

```jsx
// Primitive colors
<div className="bg-vergil-purple text-vergil-off-white">

// Semantic colors
<div className="bg-bg-primary text-text-primary border-border-default">

// Shadows
<div className="shadow-card hover:shadow-card-hover">

// Spacing (using primitive tokens)
<div className="p-md gap-lg">

// Component classes
<button className="btn-primary btn-md">
<div className="card-interactive">
```

### TypeScript

Import token types for type-safe token usage:

```typescript
import type { 
  PrimitiveTokens, 
  SemanticTokens, 
  ComponentTokens 
} from '@/packages/design-system/generated/tokens';

// Use token values in styled components or CSS-in-JS
const buttonStyles = {
  backgroundColor: tokens.primitives.colors.vergilPurple,
  padding: tokens.primitives.spacing.md,
};
```

## Token Categories

### Primitive Tokens

#### Colors
- Brand: `vergilPurple`, `vergilOffBlack`, `vergilOffWhite`
- Primary: `cosmicPurple`, `electricViolet`, `luminousIndigo`
- Accent: `phosphorCyan`, `synapticBlue`, `neuralPink`
- Foundation: `pureLight`, `softLight`, `whisperGray`, etc.
- Semantic: `success`, `warning`, `error`, `info`

#### Spacing
- `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px)

#### Typography
- Font sizes: `xs` to `9xl`
- Font weights: `thin` to `black`
- Line heights: `none` to `loose`
- Letter spacing: `tighter` to `widest`

#### Effects
- Shadows: `none`, `sm`, `md`, `lg`, `xl`
- Border radius: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`
- Transitions: `instant`, `fast`, `normal`, `slow`, `slower`, `slowest`

### Semantic Tokens

#### Colors
- Text: `primary`, `secondary`, `tertiary`, `inverse`, `brand`, etc.
- Background: `primary`, `secondary`, `elevated`, `overlay`, etc.
- Border: `default`, `subtle`, `focus`, `brand`, `error`

#### Interactive States
- Hover, pressed, disabled, focus states for interactive elements

#### Layout
- Component spacing: `xs`, `sm`, `md`, `lg`
- Layout spacing: `gap`, `section`, `container`, `page`, `hero`
- Container sizes: `xs` to `7xl`

### Component Tokens

Pre-configured tokens for common components:

- **Button**: Sizes (sm, md, lg) and variants (primary, secondary, ghost, destructive)
- **Card**: Variants (default, interactive, neural, outlined)
- **Input**: Sizes and states (default, hover, focus, error, disabled)
- **Modal**: Sizes and structure tokens
- **Toast**: Variants for different notification types
- **Badge**: Sizes and variants

## Best Practices

1. **Always use tokens** instead of arbitrary values
2. **Start with semantic tokens** before falling back to primitives
3. **Use component classes** for consistent component styling
4. **Extend tokens** in token files, not in components
5. **Document new tokens** with clear naming and purpose

## Extending the System

To add new tokens:

1. Add primitive values to `/tokens/primitives.ts`
2. Create semantic mappings in `/tokens/semantic.ts`
3. Define component tokens in `/tokens/components.ts`
4. Run `npm run tokens:generate`
5. The new tokens will be available in all outputs

## Migration from Hard-coded Values

Replace hard-coded values with tokens:

```jsx
// ❌ Before
<div className="bg-[#7B00FF] p-[16px] text-[#F5F5F7]">

// ✅ After
<div className="bg-vergil-purple p-md text-vergil-off-white">
// or
<div className="bg-bg-brand p-component-md text-text-inverse">
```

## Token Naming Convention

- **Primitive**: Direct names (`vergil-purple`, `spacing-md`)
- **Semantic**: Purpose-based (`text-primary`, `bg-elevated`)
- **Component**: Component-specific (`btn-primary`, `card-interactive`)
- **State**: State modifiers (`hover`, `pressed`, `disabled`, `focus`)