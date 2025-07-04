# Vergil Design System

A comprehensive design token system for the Vergil AI platform, providing consistent design values across all applications.

## Features

- **Three-tier token architecture**: Primitive, Semantic, and Component tokens
- **Multiple output formats**: CSS variables, Tailwind utilities, TypeScript types, and JSON
- **Full Tailwind v3 compatibility**: Custom plugin with all token utilities
- **Type-safe tokens**: Generated TypeScript definitions
- **Component-specific tokens**: Pre-configured styles for common UI patterns

## Installation

From the root directory:

```bash
npm run tokens:generate
```

This command will:
1. Read all token definitions from `/tokens/`
2. Generate CSS custom properties in `/generated/tokens.css`
3. Create a Tailwind plugin at `/tailwind-plugin.js`
4. Generate TypeScript types in `/generated/tokens.d.ts`
5. Output JSON documentation in `/generated/tokens.json`

## Token Structure

### Primitive Tokens (`/tokens/primitives.ts`)
Raw design values that form the foundation:
- Colors (brand, primary, accent, foundation, semantic)
- Spacing (xs to 3xl)
- Typography (sizes, weights, line heights, letter spacing)
- Effects (shadows, borders, transitions)
- Gradients

### Semantic Tokens (`/tokens/semantic.ts`)
Purpose-based tokens that reference primitives:
- Text colors (primary, secondary, tertiary, etc.)
- Background colors (primary, elevated, overlay, etc.)
- Border colors (default, subtle, focus, etc.)
- Interactive states (hover, pressed, disabled, focus)
- Layout spacing (component, layout, grid)

### Component Tokens (`/tokens/components.ts`)
Pre-configured tokens for UI components:
- Button (sizes and variants)
- Card (variants with different styles)
- Input (sizes and states)
- Modal (sizes and structure)
- Toast (notification variants)
- Badge (sizes and variants)
- Navigation (header and menu items)

## Usage

### In Tailwind Classes

```jsx
// Semantic colors
<div className="bg-bg-primary text-text-primary border-border-default">

// Component classes
<button className="btn-primary btn-md">
<div className="card-interactive">

// Primitive values
<div className="p-md gap-lg bg-vergil-purple">

// Shadows
<div className="shadow-card hover:shadow-card-hover">
```

### As CSS Variables

```css
.custom-element {
  background: var(--bg-elevated);
  color: var(--text-primary);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-card);
}
```

### In TypeScript

```typescript
import type { DesignTokens } from '@/packages/design-system/generated/tokens';

// Access token values programmatically
const primaryColor = tokens.primitives.colors.vergilPurple;
```

## Extending the System

To add new tokens:

1. Add primitive values to `/tokens/primitives.ts`
2. Create semantic mappings in `/tokens/semantic.ts`
3. Define component tokens in `/tokens/components.ts`
4. Run `npm run tokens:generate`

## Best Practices

1. **Use semantic tokens first**: They provide better context and maintainability
2. **Avoid arbitrary values**: Always use tokens instead of hard-coded values
3. **Document new tokens**: Include clear descriptions and use cases
4. **Follow naming conventions**: 
   - Primitives: Direct names (e.g., `vergil-purple`)
   - Semantic: Purpose-based (e.g., `text-primary`)
   - Components: Component-specific (e.g., `btn-primary`)

## File Structure

```
packages/design-system/
├── tokens/
│   ├── primitives.ts    # Raw design values
│   ├── semantic.ts      # Purpose-based tokens
│   ├── components.ts    # Component-specific tokens
│   └── index.ts         # Main export file
├── scripts/
│   └── generate-tokens.ts  # Token generation script
├── generated/
│   ├── tokens.css       # CSS custom properties
│   ├── tokens.d.ts      # TypeScript types
│   └── tokens.json      # JSON documentation
├── tailwind-plugin.js   # Tailwind v3 plugin
└── examples/
    └── TokenExample.tsx # Usage examples
```

## Available Scripts

- `npm run generate-tokens`: Generate all token outputs
- `npm run build`: Alias for generate-tokens

## Integration

The design system integrates with the main application through:

1. **Tailwind Config**: Import the plugin in `tailwind.config.js`
2. **Global CSS**: Import tokens in `app/globals.css`
3. **TypeScript**: Import types from generated files

## Documentation

- See `TOKEN_USAGE.md` for detailed usage instructions
- Check `examples/TokenExample.tsx` for implementation examples
- Review `ARCHITECTURE.md` for system design details