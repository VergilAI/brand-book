# Vergil Design System - Design Tokens

This directory contains the single source of truth for all design decisions in the Vergil Design System.

## Structure

```
design-tokens/
├── source/                 # Source token files (YAML)
│   ├── tokens.yaml        # Main entry point
│   ├── colors.yaml        # Color definitions
│   ├── typography.yaml    # Typography system
│   ├── spacing.yaml       # Spacing and layout
│   ├── animations.yaml    # Motion and transitions
│   └── shadows.yaml       # Elevation system
└── README.md              # This file
```

## Token Categories

### 1. Colors (`colors.yaml`)
- **Brand Colors**: V2 purple system (#7B00FF primary)
- **Neutral Palette**: Apple-inspired monochrome
- **Attention Hierarchy**: Subtle emphasis system
- **Functional Colors**: Success, error, warning, info
- **Semantic Aliases**: Context-specific mappings
- **Gradients**: Brand gradient effects
- **Legacy Colors**: Deprecated V1 colors (for migration)

### 2. Typography (`typography.yaml`)
- **Font Families**: Display (Lato), Sans (Inter), Mono
- **Size Scale**: 12px to 96px using modular scale
- **Font Weights**: 100-900
- **Line Heights**: Tight to loose
- **Letter Spacing**: Tighter to widest
- **Text Styles**: Composed typography patterns

### 3. Spacing (`spacing.yaml`)
- **Base Unit**: 4px grid system
- **Spacing Scale**: 0-64 (0px to 256px)
- **Semantic Spacing**: Component, layout, form, text
- **Border Radius**: sm to full (4px to 9999px)
- **Insets**: Padding patterns (squish, stretch)

### 4. Animations (`animations.yaml`)
- **Durations**: 150ms to 8000ms
- **Easing Functions**: Cubic beziers for natural motion
- **Keyframes**: Living system animations (breathing, pulse, etc.)
- **Transitions**: Predefined transition combinations
- **Animation Classes**: Ready-to-use utilities

### 5. Shadows (`shadows.yaml`)
- **Elevation Levels**: 0-8 (none to extreme)
- **Brand Shadows**: Purple-tinted shadows
- **Layered Shadows**: Complex compositions
- **Inset Shadows**: Inner depth effects
- **Text Shadows**: Typography effects
- **Semantic Shadows**: Context-specific

## Usage

### Token References

Tokens use a dot notation for references:
```yaml
# Direct value
colors.brand.purple: "#7B00FF"

# Reference to another token
colors.semantic.text.primary: "{colors.neutral.off-black}"
```

### In Code

These tokens should be transformed into platform-specific formats:

**CSS Custom Properties:**
```css
:root {
  --color-brand-purple: #7B00FF;
  --spacing-4: 16px;
  --animation-duration-normal: 300ms;
}
```

**JavaScript/TypeScript:**
```typescript
export const tokens = {
  colors: {
    brand: {
      purple: '#7B00FF'
    }
  },
  spacing: {
    scale: {
      4: '16px'
    }
  }
}
```

**Tailwind Config:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'vergil-purple': '#7B00FF',
      }
    }
  }
}
```

## Token Principles

1. **Single Source of Truth**: All design decisions originate here
2. **Semantic Naming**: Tokens describe purpose, not appearance
3. **Systematic Scales**: Consistent, predictable progressions
4. **Platform Agnostic**: YAML format can transform to any platform
5. **Version Controlled**: Track all design system changes
6. **Self-Documenting**: Every token includes a comment

## Making Changes

1. **Never modify generated files** - only edit source YAML files
2. **Follow naming conventions** documented in `tokens.yaml`
3. **Add comments** explaining the purpose of new tokens
4. **Update version** in metadata when making breaking changes
5. **Document migrations** for deprecated tokens

## Token Relationships

```
Primitive Tokens          Semantic Tokens         Component Tokens
     ↓                         ↓                         ↓
colors.brand.purple → colors.interactive.primary → button.primary.background
     ↓                         ↓                         ↓
  #7B00FF                {brand.purple}            {interactive.primary}
```

## Migration from V1

The V1 color system (cosmic-purple: #6366F1) is deprecated. Use the migration guide:

- `cosmic-purple` → `brand.purple` (#7B00FF)
- `electric-violet` → `brand.purple-light` (#9933FF)
- `luminous-indigo` → `brand.purple-lighter` (#BB66FF)

See `colors.yaml` for complete migration mappings.

## Version Management

This design token system includes comprehensive version management:

- **Immutable version archives** - Complete historical snapshots
- **Breaking change detection** - Automated analysis of token changes
- **Migration system** - Guided upgrades between versions
- **Compatibility matrices** - Clear upgrade/downgrade paths

### Quick Start
```bash
# List all versions
npm run version:list

# Compare versions  
npm run version:diff 2.0.0 2.1.0

# Create new version
npm run version:create --version 2.2.0
```

For complete documentation see:
- [Version Management Guide](./VERSION_MANAGEMENT.md)
- [Examples and Use Cases](./EXAMPLES.md)
- [Migration Templates](./migration/templates/)

## Current Versions

- **v1.0.0** - Legacy CSS system (archived)
- **v2.0.0** - YAML system with Apple-inspired design (stable)
- **v2.1.0-dev** - Active development

## Future Enhancements

- [x] ~~Build process to generate platform-specific outputs~~
- [x] ~~Automated migration tools~~
- [x] ~~Version management system~~
- [ ] Token documentation site
- [ ] Figma plugin for design-dev sync
- [ ] Token usage analytics
- [ ] Real-time design-code sync