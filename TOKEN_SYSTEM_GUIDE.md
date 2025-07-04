# Vergil Design System - Token System Guide

## Overview

The Vergil Design System uses a comprehensive token system that provides consistency, maintainability, and scalability across all applications. This guide explains how to use the token system effectively.

## Token Architecture

Our token system follows a three-tier architecture:

```
Primitives → Semantic → Component
```

### 1. Primitive Tokens
Raw design values that form the foundation of our system.

### 2. Semantic Tokens
Purpose-based tokens that reference primitives and adapt to context.

### 3. Component Tokens
Component-specific tokens that ensure consistency across UI elements.

## Quick Start

### Using Tokens in Components

```tsx
// ✅ Good - Using semantic tokens
<div className="bg-bg-primary text-text-primary p-md rounded-lg shadow-card">
  <h2 className="text-2xl font-semibold mb-sm">Title</h2>
  <p className="text-text-secondary">Description text</p>
  <button className="btn-primary btn-md mt-lg">
    Click me
  </button>
</div>

// ❌ Bad - Using arbitrary values
<div className="bg-[#F5F5F7] text-[#1D1D1F] p-[16px] rounded-[12px] shadow-md">
  <h2 className="text-[1.5rem] font-[600] mb-[8px]">Title</h2>
  <p className="text-[#52525B]">Description text</p>
  <button className="bg-[#7B00FF] text-white px-[24px] py-[12px] rounded-[6px] mt-[24px]">
    Click me
  </button>
</div>
```

## Token Categories

### Colors

#### Text Colors
```tsx
text-text-primary      // Primary text (#1D1D1F)
text-text-secondary    // Secondary text (#52525B)
text-text-tertiary     // Tertiary text (#71717A)
text-text-inverse      // Inverse text (#F5F5F7)
text-text-brand        // Brand text (#7B00FF)
text-text-success      // Success text (#10B981)
text-text-warning      // Warning text (#F59E0B)
text-text-error        // Error text (#EF4444)
text-text-info         // Info text (#3B82F6)
text-text-disabled     // Disabled text (#A1A1AA)
```

#### Background Colors
```tsx
bg-bg-primary          // Primary background (#F5F5F7)
bg-bg-secondary        // Secondary background (#F8F9FA)
bg-bg-tertiary         // Tertiary background (#FAFAFA)
bg-bg-inverse          // Inverse background (#1D1D1F)
bg-bg-brand            // Brand background (#7B00FF)
bg-bg-elevated         // Elevated surface (#FFFFFF)
bg-bg-overlay          // Overlay background (rgba)
bg-bg-disabled         // Disabled background (#F4F4F5)
```

#### Border Colors
```tsx
border-border-default  // Default border (10% black)
border-border-subtle   // Subtle border (5% black)
border-border-focus    // Focus border (#007AFF)
border-border-brand    // Brand border (#7B00FF)
border-border-error    // Error border (#EF4444)
```

### Spacing

Following Apple's 8px base system with emphasis on 16px and 24px:

```tsx
// Token  Value   Usage
p-xs     // 4px   - Micro adjustments, icon padding
p-sm     // 8px   - Tight spacing, small gaps
p-md     // 16px  - PRIMARY - Default spacing ⭐
p-lg     // 24px  - PRIMARY - Comfortable spacing ⭐
p-xl     // 32px  - Loose spacing, major sections
p-2xl    // 48px  - Large sections
p-3xl    // 64px  - Hero sections
```

**💡 Pro Tip:** Use `p-md` (16px) and `p-lg` (24px) for 80% of your spacing needs.

### Typography

```tsx
// Font Sizes
text-xs    // 0.75rem
text-sm    // 0.875rem
text-base  // 1rem
text-lg    // 1.125rem
text-xl    // 1.25rem
text-2xl   // 1.5rem
text-3xl   // 1.875rem
text-4xl   // 2.25rem
text-5xl   // 3rem

// Font Weights
font-normal    // 400
font-medium    // 500 - DEFAULT for UI text
font-semibold  // 600 - Headings
font-bold      // 700 - Emphasis

// Line Heights
leading-tight   // 1.25
leading-normal  // 1.5 - DEFAULT
leading-relaxed // 1.625
```

### Shadows

Elevation-based shadow system:

```tsx
shadow-none       // No shadow
shadow-sm         // Subtle elevation
shadow-card       // Card default
shadow-cardHover  // Card hover state
shadow-dropdown   // Dropdowns, menus
shadow-modal      // Modals, overlays
shadow-focus      // Focus ring (brand)
```

### Border Radius

Proportional scaling for organic feel:

```tsx
rounded-xs   // 4px - Small elements
rounded-sm   // 6px - Buttons, inputs (DEFAULT)
rounded-md   // 8px - Cards
rounded-lg   // 12px - Large cards
rounded-xl   // 16px - Modals
rounded-2xl  // 20px - Hero sections
rounded-full // 50% - Circular
```

### Animation

#### Duration
```tsx
duration-instant  // 0ms
duration-fast     // 100ms - Micro interactions
duration-normal   // 200ms - DEFAULT
duration-slow     // 300ms - Page transitions
duration-slower   // 400ms
duration-slowest  // 500ms - Complex animations
```

#### Easing
```tsx
ease-out      // cubic-bezier(0.25, 0.46, 0.45, 0.94) - DEFAULT (90% of cases)
ease-in-out   // cubic-bezier(0.42, 0, 0.58, 1) - Page transitions
ease-out-back // cubic-bezier(0.34, 1.56, 0.64, 1) - Playful bounces
ease-linear   // linear - Progress bars, loading
```

### Z-Index

Semantic layering with large gaps:

```tsx
z-base      // 0    - Page content
z-dropdown  // 1000 - Dropdowns
z-sticky    // 1100 - Sticky headers
z-overlay   // 1200 - Overlays
z-modal     // 1300 - Modals
z-popover   // 1400 - Popovers
z-toast     // 1500 - Toasts
z-tooltip   // 1600 - Tooltips
```

## Component Classes

Pre-built component classes that combine multiple tokens:

### Buttons
```tsx
// Size variants
btn-sm     // Small button
btn-md     // Medium button (default)
btn-lg     // Large button

// Style variants
btn-primary     // Primary action
btn-secondary   // Secondary action
btn-ghost       // Minimal style
btn-destructive // Dangerous actions

// Usage
<button className="btn-primary btn-md">Save Changes</button>
```

### Cards
```tsx
card-default      // Basic card
card-interactive  // Hoverable card
card-neural       // Gradient background
card-outlined     // Border emphasis

// Usage
<div className="card-interactive">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-text-secondary mt-sm">Card content</p>
</div>
```

### Inputs
```tsx
input           // Base input styles
input-error     // Error state
input-disabled  // Disabled state

// Sizes
input-sm        // Small input
input-md        // Medium input (default)
input-lg        // Large input
```

## Best Practices

### 1. Token Priority
Always use tokens in this order:
1. Component classes (`btn-primary`)
2. Semantic tokens (`bg-bg-primary`)
3. Primitive tokens (`bg-vergil-purple`)
4. Never use arbitrary values (`bg-[#7B00FF]`)

### 2. Spacing Guidelines
- Use `md` (16px) and `lg` (24px) for most spacing
- Use consistent spacing within components
- Prefer padding over margin for component internals

### 3. Color Usage
- Use semantic colors for UI elements
- Reserve brand colors for emphasis
- Maintain proper contrast ratios
- Use `text-text-secondary` for supporting text

### 4. Animation Guidelines
- Default to `ease-out` for most animations
- Use `duration-fast` (100ms) for micro-interactions
- Use `duration-normal` (200ms) for UI transitions
- Reserve `ease-out-back` for delightful moments

### 5. Shadow Usage
- Use `shadow-card` for elevated content
- Add `shadow-cardHover` on interactive cards
- Use `shadow-focus` for focus states
- Avoid mixing shadow styles

## Migration from Arbitrary Values

If you're migrating existing code:

```tsx
// Before
<div className="p-[24px] bg-[#F5F5F7] text-[#1D1D1F] rounded-[8px] shadow-md">

// After
<div className="p-lg bg-bg-primary text-text-primary rounded-md shadow-card">
```

See `TOKEN_MIGRATION_GUIDE.md` for detailed migration instructions.

## Extending the System

To add new tokens:

1. Add to `/packages/design-system/tokens/primitives.ts`
2. Create semantic mappings in `/packages/design-system/tokens/semantic.ts`
3. Run `npm run tokens:generate`
4. New tokens are automatically available

## TypeScript Support

All tokens are fully typed:

```tsx
import { tokens } from '@/packages/design-system/tokens'

// Access token values
const primaryColor = tokens.semantic.colors.text.primary
const mediumSpacing = tokens.primitives.spacing.md
```

## Tools & Commands

- `npm run tokens:generate` - Generate all token outputs
- Token files location: `/packages/design-system/tokens/`
- Generated files: `/packages/design-system/generated/`

## Resources

- [Token Architecture](./packages/design-system/tokens/ARCHITECTURE.md)
- [Migration Guide](./TOKEN_MIGRATION_GUIDE.md)
- [Migration Status](./TOKEN_MIGRATION_STATUS.md)
- [Design Principles](./new_token_spec.md)