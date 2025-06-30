# Vergil Color System - Quick Reference

## ⚠️ IMPORTANT: Apple-Inspired Text Colors

- **NEVER use `text-white`** - Use `text-vergil-white` (#F5F5F7) instead
- **NEVER use `text-black`** - Use `text-vergil-text` (#1D1D1F) instead
- These Apple-inspired colors provide better readability and a more premium feel

## Core Colors

### Monochrome Design System
- **Vergil Purple**: `#7B00FF` - THE singular brand color
- **Text Black**: `#1D1D1F` - Primary text (light theme) - Apple-inspired black
- **Text White**: `#F5F5F7` - Primary text (dark theme) - Apple-inspired off-white, NOT pure white
- **Everything else**: Blacks, whites, and grays only

### Functional Colors (Use Sparingly)
- **Success**: `#0F8A0F` - Confirmations, completed states ONLY
- **Error**: `#E51C23` - Errors, destructive actions, delete ONLY
- **Warning**: `#FFC700` - Warning messages ONLY
- **Info**: `#0087FF` - Information, tips, links ONLY
- **Lightbulb/Active**: `#FFB833` - On states, active indicators ONLY

## Usage Guidelines

### When to Use Vibrant Purple (#7B00FF)
✅ DO:
- Primary CTAs
- Active navigation items
- Selected states
- Progress indicators
- Icon buttons (when active)
- Small accent elements

❌ DON'T:
- Large background areas
- Body text
- Borders (unless active)
- Full-page backgrounds

### Consciousness Gradient
```css
/* Hero sections - Muted */
background: radial-gradient(circle at 20% 50%, rgba(123, 0, 255, 0.08) 0%, transparent 50%);

/* Special moments - Full vibrancy */
background: linear-gradient(135deg, #7B00FF, #9933FF, #BB66FF);
```

### Light vs Dark Theme

| Element | Light Theme | Dark Theme |
|---------|------------|------------|
| Background | `#FFFFFF` | `#000000` |
| Alt Background | `#FAFAFA` | `#1D1D1F` |
| Text Primary | `#1D1D1F` | `#F5F5F7` |
| Text Secondary | `#636366` | `#A1A1A6` |
| Border | `#E5E5E7` | `#3A3A3C` |
| Purple (active) | `#7B00FF` | `#9933FF` |

### Hover States
```css
/* Light theme */
.hover-light {
  background-color: rgba(123, 0, 255, 0.08);
}

/* Dark theme */
.hover-dark {
  background-color: rgba(123, 0, 255, 0.16);
}
```

## Implementation Examples

### Buttons
```jsx
// Primary CTA - IMPORTANT: Use vergil-white, not text-white
<button className="bg-vergil-purple text-vergil-white hover:bg-vergil-purple-600">
  Get Started
</button>

// Secondary
<button className="text-vergil-purple border-vergil-purple hover:bg-vergil-purple/10">
  Learn More
</button>

// Destructive
<button className="bg-vergil-error text-vergil-white hover:bg-vergil-error-600">
  Delete
</button>
```

### Status Messages
```jsx
// Success
<div className="bg-vergil-success/10 border-vergil-success/20 text-vergil-success">
  ✓ Changes saved successfully
</div>

// Error
<div className="bg-vergil-error/10 border-vergil-error/20 text-vergil-error">
  ✕ Something went wrong
</div>
```

### Map Editor Specific
```jsx
// Active tool
<IconButton 
  className="text-vergil-purple bg-vergil-purple/10 hover:bg-vergil-purple/20"
/>

// Inactive tool
<IconButton 
  className="text-vergil-text hover:bg-gray-50"
/>

// Snapping enabled
<SnappingIcon className="text-vergil-purple" />
```

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'vergil-purple': {
          50: '#F3E5FF',
          100: '#E6CCFF',
          200: '#D199FF',
          300: '#BB66FF',
          400: '#9933FF',
          500: '#7B00FF', // Main
          600: '#6600CC',
          700: '#520099',
          800: '#3D0066',
          900: '#290033',
        },
        'vergil-yellow': '#FFC700',
        'vergil-success': '#0F8A0F',
        'vergil-error': '#E51C23',
        'vergil-warning': '#FFA500',
        'vergil-info': '#0087FF',
        'vergil-text': '#1D1D1F',
        'vergil-text-secondary': '#636366',
        'vergil-white': '#F5F5F7', // Use instead of text-white
      }
    }
  }
}
```

## Remember
1. **Monochrome first** - Purple is THE brand color, everything else is black/white/gray
2. **Functional colors are NOT decorative** - Yellow, green, red, blue ONLY for their specific functions
3. **Less is more** - Purple should command attention when used
4. **Consistency** - Same color = same meaning everywhere
5. **Accessibility** - Always check contrast ratios
6. **Theme aware** - Test in both light and dark modes