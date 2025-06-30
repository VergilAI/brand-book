# Using Generated Design Tokens

This guide shows how to use the generated design tokens from the build pipeline.

## Import Options

### CSS Custom Properties
```css
/* Import the CSS variables */
@import '../generated/tokens.css';

.my-component {
  color: var(--vergil-colors-brand-purple);
  padding: var(--vergil-spacing-scale-4);
  border-radius: var(--vergil-spacing-radius-DEFAULT);
  box-shadow: var(--vergil-shadows-elevation-2);
}
```

### TypeScript Constants
```typescript
import { tokens, getCSSVar } from '../generated/tokens';

// Direct access to token values
const primaryColor = tokens.colors.brand.purple; // '#7B00FF'
const defaultSpacing = tokens.spacing.scale[4]; // '16px'

// Generate CSS variables
const purpleVar = getCSSVar('colors.brand.purple'); // 'var(--vergil-colors-brand-purple)'
```

### Tailwind Configuration
```javascript
// tailwind.config.js
const vergilTokens = require('./generated/tailwind-theme');

module.exports = {
  theme: {
    extend: {
      ...vergilTokens
    }
  }
}
```

### SCSS Variables
```scss
@import '../generated/tokens.scss';

.my-component {
  color: $vergil-colors-brand-purple;
  padding: $vergil-spacing-scale-4;
  border-radius: $vergil-spacing-radius-DEFAULT;
}
```

## Token Reference Examples

### Colors
```typescript
// Brand colors
tokens.colors.brand.purple          // '#7B00FF'
tokens.colors.brand.purpleLight     // '#9933FF'

// Semantic colors
tokens.colors.semantic.text.primary     // '#1D1D1F'
tokens.colors.semantic.background.primary // '#FFFFFF'

// Functional colors
tokens.colors.functional.success     // '#0F8A0F'
tokens.colors.functional.error       // '#E51C23'
```

### Spacing
```typescript
// Scale values
tokens.spacing.scale[0]     // '0px'
tokens.spacing.scale[4]     // '16px'
tokens.spacing.scale[8]     // '32px'

// Semantic spacing
tokens.spacing.semantic.component.padding.md  // '16px'
tokens.spacing.semantic.layout.section.lg     // '128px'

// Border radius
tokens.spacing.radius.sm       // '4px'
tokens.spacing.radius.DEFAULT  // '10px'
tokens.spacing.radius.full     // '9999px'
```

### Shadows
```typescript
// Elevation shadows
tokens.shadows.elevation[1]    // '0 1px 3px rgba(0, 0, 0, 0.05)'
tokens.shadows.elevation[4]    // '0 6px 16px rgba(0, 0, 0, 0.1)'

// Brand shadows
tokens.shadows.brand.md        // '0 4px 16px rgba(123, 0, 255, 0.12)'
tokens.shadows.brand.glow.lg   // '0 0 64px rgba(123, 0, 255, 0.5)'

// Semantic shadows
tokens.shadows.semantic.interactive.hover // '0 4px 12px rgba(0, 0, 0, 0.08)'
```

### Typography
```typescript
// Font families
tokens.typography.families.sans     // 'Inter', -apple-system, ...
tokens.typography.families.display  // 'Lato', -apple-system, ...

// Font sizes
tokens.typography.sizes.sm    // '14px'
tokens.typography.sizes.lg    // '18px'
tokens.typography.sizes['4xl'] // '36px'

// Font weights
tokens.typography.weights.regular  // '400'
tokens.typography.weights.bold     // '700'
```

### Animations
```typescript
// Duration
tokens.animations.duration.fast      // '150ms'
tokens.animations.duration.breathing // '4000ms'

// Easing
tokens.animations.easing.smooth  // 'cubic-bezier(0.4, 0, 0.2, 1)'
tokens.animations.easing.bounce  // 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
```

## Build Commands

- `npm run build:tokens` - Build tokens once
- `npm run watch:tokens` - Watch for changes and rebuild automatically

## Token Reference Resolution

The build system automatically resolves token references:

```yaml
# In YAML source
semantic:
  text:
    primary:
      value: "{neutral.off-black}"  # References another token
```

Becomes:
```typescript
tokens.colors.semantic.text.primary // '#1D1D1F' (resolved value)
```

## CSS Variable Helper

Use the `getCSSVar` helper for type-safe CSS variable generation:

```typescript
import { getCSSVar } from '../generated/tokens';

const styles = {
  color: getCSSVar('colors.brand.purple'),
  padding: getCSSVar('spacing.scale.4')
};
```

This ensures you only reference tokens that actually exist and generates the correct CSS variable names.