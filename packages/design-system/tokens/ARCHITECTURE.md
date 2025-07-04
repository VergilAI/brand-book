# Design Token Architecture

## Overview

This document defines the comprehensive semantic token architecture for the Vergil design system. The architecture follows a three-tier structure:

1. **Primitive Tokens**: Raw values (base layer)
2. **Semantic Tokens**: Purpose-based references to primitives (abstraction layer)
3. **Component Tokens**: Component-specific references to semantic tokens (implementation layer)

## Token Structure

```
primitives/
├── colors.ts         # Raw color values
├── spacing.ts        # Raw spacing values
├── typography.ts     # Raw type values
├── motion.ts         # Raw animation values
├── elevation.ts      # Raw shadow values
└── ...

semantic/
├── colors.ts         # Semantic color mappings
├── spacing.ts        # Semantic spacing mappings
├── typography.ts     # Semantic type mappings
├── motion.ts         # Semantic motion mappings
├── elevation.ts      # Semantic elevation mappings
└── ...

components/
├── button.ts         # Button-specific tokens
├── card.ts           # Card-specific tokens
├── input.ts          # Input-specific tokens
└── ...
```

## 1. Color Tokens

### Primitive Colors

```typescript
// primitives/colors.ts
export const colors = {
  // Brand colors
  purple: {
    50: '#F3E8FF',
    100: '#E4D1FF',
    200: '#C9A3FF',
    300: '#AD75FF',
    400: '#9147FF',
    500: '#7B00FF', // Primary brand purple
    600: '#6200CC',
    700: '#4A0099',
    800: '#310066',
    900: '#190033',
  },
  
  // Neutrals (Apple-inspired)
  gray: {
    0: '#FFFFFF',
    50: '#F5F5F7',   // vergil-off-white
    100: '#E8E8ED',
    200: '#D2D2D7',
    300: '#B7B7BE',
    400: '#8E8E93',
    500: '#64646E',
    600: '#48484A',
    700: '#363639',
    800: '#1D1D1F',  // vergil-off-black
    900: '#000000',
  },
  
  // Functional colors
  red: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#DC2626',
  },
  green: {
    50: '#F0FDF4',
    500: '#10B981',
    700: '#059669',
  },
  blue: {
    50: '#EFF6FF',
    500: '#3B82F6',
    700: '#1D4ED8',
  },
  amber: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#D97706',
  },
}
```

### Semantic Colors

```typescript
// semantic/colors.ts
export const semanticColors = {
  // Brand
  brand: {
    primary: colors.purple[500],
    secondary: colors.gray[800],
    accent: colors.purple[400],
  },
  
  // Text
  text: {
    primary: colors.gray[800],
    secondary: colors.gray[600],
    tertiary: colors.gray[500],
    inverse: colors.gray[0],
    brand: colors.purple[500],
  },
  
  // Backgrounds
  background: {
    primary: colors.gray[0],
    secondary: colors.gray[50],
    tertiary: colors.gray[100],
    inverse: colors.gray[800],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Surfaces
  surface: {
    primary: colors.gray[0],
    secondary: colors.gray[50],
    elevated: colors.gray[0],
    subdued: colors.gray[100],
  },
  
  // Interactive
  interactive: {
    primary: colors.purple[500],
    primaryHover: colors.purple[600],
    primaryActive: colors.purple[700],
    secondary: colors.gray[200],
    secondaryHover: colors.gray[300],
    secondaryActive: colors.gray[400],
  },
  
  // Feedback
  feedback: {
    error: colors.red[500],
    errorSubtle: colors.red[50],
    warning: colors.amber[500],
    warningSubtle: colors.amber[50],
    success: colors.green[500],
    successSubtle: colors.green[50],
    info: colors.blue[500],
    infoSubtle: colors.blue[50],
  },
  
  // Borders
  border: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    strong: 'rgba(0, 0, 0, 0.2)',
    focus: colors.purple[500],
    error: colors.red[500],
  },
  
  // Attention (from spec)
  attention: {
    background: 'rgba(123, 0, 255, 0.08)',
    dropdownBackground: 'rgba(123, 0, 255, 0.04)',
    text: colors.purple[500],
    button: colors.purple[500],
  },
}
```

### Component Colors

```typescript
// components/button.ts
export const buttonTokens = {
  primary: {
    background: semanticColors.interactive.primary,
    backgroundHover: semanticColors.interactive.primaryHover,
    backgroundActive: semanticColors.interactive.primaryActive,
    text: semanticColors.text.inverse,
    border: 'transparent',
  },
  secondary: {
    background: semanticColors.interactive.secondary,
    backgroundHover: semanticColors.interactive.secondaryHover,
    backgroundActive: semanticColors.interactive.secondaryActive,
    text: semanticColors.text.primary,
    border: semanticColors.border.default,
  },
  ghost: {
    background: 'transparent',
    backgroundHover: semanticColors.attention.background,
    backgroundActive: semanticColors.attention.dropdownBackground,
    text: semanticColors.text.primary,
    border: 'transparent',
  },
}
```

## 2. Spacing Tokens

### Primitive Spacing

```typescript
// primitives/spacing.ts
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
}
```

### Semantic Spacing

```typescript
// semantic/spacing.ts
export const semanticSpacing = {
  // From spec
  xs: spacing[1],   // 4px - micro-adjustments
  sm: spacing[2],   // 8px - tight spacing
  md: spacing[4],   // 16px - PRIMARY default
  lg: spacing[6],   // 24px - PRIMARY comfortable
  xl: spacing[8],   // 32px - loose spacing
  '2xl': spacing[12], // 48px - large sections
  '3xl': spacing[16], // 64px - hero sections
  
  // Component-specific
  component: {
    padding: {
      xs: spacing[1],
      sm: spacing[2],
      md: spacing[4],
      lg: spacing[6],
    },
    gap: {
      xs: spacing[1],
      sm: spacing[2],
      md: spacing[4],
      lg: spacing[6],
    },
  },
  
  // Layout
  layout: {
    gutter: spacing[6],
    section: spacing[16],
    container: spacing[20],
  },
}
```

## 3. Typography Tokens

### Primitive Typography

```typescript
// primitives/typography.ts
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Fira Code, Monaco, Consolas, monospace',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
}
```

### Semantic Typography

```typescript
// semantic/typography.ts
export const semanticTypography = {
  // Headings
  heading: {
    '1': {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    '2': {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    '3': {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.normal,
    },
    '4': {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
  
  // Body
  body: {
    large: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
    },
    default: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
    small: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
  },
  
  // UI
  ui: {
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
  },
}
```

## 4. Motion Tokens

### Primitive Motion

```typescript
// primitives/motion.ts
export const motion = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '750ms',
  },
  
  // Easings (from spec)
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },
}
```

### Semantic Motion

```typescript
// semantic/motion.ts
export const semanticMotion = {
  // Micro-interactions
  micro: {
    duration: motion.duration.fast,
    easing: motion.easing.easeOut,
  },
  
  // Standard transitions
  standard: {
    duration: motion.duration.normal,
    easing: motion.easing.easeOut,
  },
  
  // Emphasis animations
  emphasis: {
    duration: motion.duration.slow,
    easing: motion.easing.easeOutBack,
  },
  
  // Page transitions
  page: {
    duration: motion.duration.slower,
    easing: motion.easing.easeInOut,
  },
  
  // Loading states
  loading: {
    duration: motion.duration.slowest,
    easing: motion.easing.linear,
  },
}
```

## 5. Elevation Tokens

### Primitive Elevation

```typescript
// primitives/elevation.ts
export const elevation = {
  // Shadows (from spec)
  shadow: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  },
  
  // Z-index (from spec)
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
    tooltip: 1600,
  },
}
```

### Semantic Elevation

```typescript
// semantic/elevation.ts
export const semanticElevation = {
  // Surface elevation
  surface: {
    flat: {
      shadow: elevation.shadow.none,
      zIndex: elevation.zIndex.base,
    },
    raised: {
      shadow: elevation.shadow.sm,
      zIndex: elevation.zIndex.base,
    },
    elevated: {
      shadow: elevation.shadow.md,
      zIndex: elevation.zIndex.base,
    },
    floating: {
      shadow: elevation.shadow.lg,
      zIndex: elevation.zIndex.dropdown,
    },
  },
  
  // Interactive elevation
  interactive: {
    rest: elevation.shadow.sm,
    hover: elevation.shadow.md,
    active: elevation.shadow.sm,
  },
  
  // Modal elevation
  modal: {
    backdrop: {
      shadow: elevation.shadow.none,
      zIndex: elevation.zIndex.overlay,
    },
    content: {
      shadow: elevation.shadow.xl,
      zIndex: elevation.zIndex.modal,
    },
  },
}
```

## 6. Border & Radius Tokens

### Primitive Borders

```typescript
// primitives/borders.ts
export const borders = {
  // Border widths (from spec)
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
  },
  
  // Border radius (from spec)
  radius: {
    none: '0',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '50%',
  },
}
```

### Semantic Borders

```typescript
// semantic/borders.ts
export const semanticBorders = {
  // Border styles
  border: {
    none: `${borders.width.none} solid transparent`,
    subtle: `${borders.width.thin} solid ${semanticColors.border.subtle}`,
    default: `${borders.width.thin} solid ${semanticColors.border.default}`,
    strong: `${borders.width.thin} solid ${semanticColors.border.strong}`,
    focus: `${borders.width.medium} solid ${semanticColors.border.focus}`,
    error: `${borders.width.thin} solid ${semanticColors.border.error}`,
  },
  
  // Radius by component type
  radius: {
    button: borders.radius.sm,
    input: borders.radius.sm,
    card: borders.radius.md,
    modal: borders.radius.xl,
    badge: borders.radius.xs,
    avatar: borders.radius.full,
  },
}
```

## 7. Opacity Tokens

### Primitive Opacity

```typescript
// primitives/opacity.ts
export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
}
```

### Semantic Opacity

```typescript
// semantic/opacity.ts
export const semanticOpacity = {
  // States (from spec)
  disabled: opacity[40],
  hover: opacity[5],
  pressed: opacity[10],
  backdrop: opacity[50],
  loading: opacity[60],
  
  // Content
  primary: opacity[100],
  secondary: opacity[70],
  tertiary: opacity[50],
}
```

## 8. Sizing Tokens

### Primitive Sizing

```typescript
// primitives/sizing.ts
export const sizing = {
  // Icon sizes
  icon: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  
  // Container widths
  container: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Component heights
  height: {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px',
  },
}
```

### Semantic Sizing

```typescript
// semantic/sizing.ts
export const semanticSizing = {
  // Buttons
  button: {
    height: {
      sm: sizing.height.sm,
      md: sizing.height.md,
      lg: sizing.height.lg,
    },
    minWidth: '80px',
  },
  
  // Inputs
  input: {
    height: {
      sm: sizing.height.sm,
      md: sizing.height.md,
      lg: sizing.height.lg,
    },
  },
  
  // Icons
  icon: {
    default: sizing.icon.md,
    button: sizing.icon.sm,
    input: sizing.icon.sm,
  },
}
```

## Implementation Guidelines

### 1. Token Usage Priority

1. Always use component tokens when available
2. Fall back to semantic tokens for custom components
3. Never use primitive tokens directly in components

### 2. Token Naming Convention

- **Primitives**: Use scale-based names (100, 200, 300)
- **Semantic**: Use purpose-based names (primary, secondary, error)
- **Component**: Use component.variant.property pattern

### 3. Extension Pattern

When adding new tokens:

```typescript
// 1. Add primitive if needed
export const newPrimitive = {
  scale: 'value',
}

// 2. Add semantic mapping
export const semanticNew = {
  purpose: newPrimitive.scale,
}

// 3. Add component mapping
export const componentTokens = {
  component: {
    variant: {
      property: semanticNew.purpose,
    },
  },
}
```

### 4. CSS Custom Properties

All tokens should be available as CSS custom properties:

```css
/* Primitives */
--color-purple-500: #7B00FF;
--spacing-4: 16px;

/* Semantic */
--color-brand-primary: var(--color-purple-500);
--spacing-md: var(--spacing-4);

/* Component */
--button-primary-background: var(--color-brand-primary);
--button-padding: var(--spacing-md);
```

## Migration Strategy

1. **Phase 1**: Implement primitive tokens
2. **Phase 2**: Map semantic tokens to primitives
3. **Phase 3**: Create component token mappings
4. **Phase 4**: Update components to use new tokens
5. **Phase 5**: Remove hardcoded values

## Token Validation

Implement automated validation to ensure:

1. No circular references
2. All semantic tokens reference valid primitives
3. All component tokens reference valid semantic tokens
4. No direct primitive usage in components
5. Consistent naming conventions

## Documentation Requirements

Each token category should include:

1. **Description**: What the token represents
2. **Usage**: When and how to use it
3. **Examples**: Real-world implementation
4. **Do's and Don'ts**: Best practices
5. **Related tokens**: Cross-references