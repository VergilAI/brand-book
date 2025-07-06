/**
 * Vergil Design System - Semantic Tokens
 * Purpose-based tokens that reference primitive values
 */

import { colors, spacing, shadows, borderRadius, borderWidth, borderColor, opacity, duration, easing, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './primitives';

// Semantic Colors
export const semanticColors = {
  // Text colors
  text: {
    primary: colors.gray[850],      // Off-black
    secondary: colors.gray[450],    // Footnote gray
    tertiary: colors.gray[400],     // Placeholders
    emphasis: colors.gray[750],     // Emphasis text
    inverse: colors.gray[50],       // Off-white
    brand: colors.purple[400],      // Brand purple (changed from 600)
    brandLight: colors.purple[500], // Hover states
    success: colors.green[600],     // Success
    warning: colors.yellow[500],    // Warning
    error: colors.red[500],         // Error
    info: colors.blue[600],         // Info
    disabled: colors.gray[300],     // Disabled text
  },
  
  // Background colors
  background: {
    primary: colors.white,          // Primary background
    secondary: colors.gray[50],     // Off-white containers
    emphasis: colors.gray[100],     // Emphasis sections
    emphasisInput: colors.gray[25], // Emphasis input backgrounds
    inverse: colors.black,          // Dark mode primary
    brand: colors.purple[400],      // Brand backgrounds (changed from 600)
    brandLight: colors.purple[50],  // Light brand backgrounds
    elevated: colors.white,         // Elevated surfaces
    overlay: `rgba(0, 0, 0, ${opacity.backdrop})`, // Modal backdrops
    disabled: colors.gray[100],     // Disabled backgrounds
    // Semantic backgrounds
    errorLight: colors.red[50],     // Error message backgrounds
    warningLight: colors.yellow[50], // Warning message backgrounds
    successLight: colors.green[50],  // Success message backgrounds
    infoLight: colors.blue[50],     // Info message backgrounds
  },
  
  // Border colors
  border: {
    default: borderColor.default,
    subtle: borderColor.subtle,
    emphasis: `rgba(166, 77, 255, 0.1)`, // Purple-tinted borders (updated to purple-400)
    focus: borderColor.focus,
    brand: colors.purple[400],
    error: colors.red[300],         // Error borders
    warning: colors.yellow[300],    // Warning borders
    success: colors.green[300],     // Success borders
    info: colors.blue[300],         // Info borders
    disabled: colors.gray[200],
  },
  
  // Interactive states
  interactive: {
    primary: {
      default: colors.purple[400],  // Brand purple (changed from 600)
      hover: colors.purple[500],    // Hover state
      pressed: colors.purple[700],  // Pressed state
      disabled: colors.gray[300],
    },
    secondary: {
      default: colors.gray[850],    // Off-black
      hover: colors.gray[800],      // Button hover
      pressed: colors.gray[900],    // Near black
      disabled: colors.gray[300],
    },
    destructive: {
      default: colors.red[500],     // Error
      hover: colors.red[600],       // Darker red
      pressed: colors.red[700],     // Even darker
      disabled: colors.gray[300],
    },
    success: {
      default: colors.green[600],   // Success
      hover: colors.green[700],     // Darker green
      pressed: colors.green[800],   // Even darker
      disabled: colors.gray[300],
    },
  },
  
  // Icon colors
  icon: {
    primary: colors.gray[850],      // Primary icons
    secondary: colors.gray[500],    // Secondary icons
    brand: colors.purple[400],      // Brand icons (changed from 600)
    error: colors.red[400],         // Error icons
    warning: colors.yellow[400],    // Warning icons
    success: colors.green[400],     // Success icons
    info: colors.blue[400],         // Info icons
    disabled: colors.gray[300],     // Disabled icons
  },
} as const;

// Semantic Spacing
export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacing.xs,    // 4px - icon padding
    sm: spacing.sm,    // 8px - tight internal spacing
    md: spacing.md,    // 16px - default component padding
    lg: spacing.lg,    // 24px - comfortable component padding
  },
  
  // Layout spacing
  layout: {
    gap: spacing.md,        // 16px - default gap between elements
    section: spacing.lg,    // 24px - between sections
    container: spacing.xl,  // 32px - container padding
    page: spacing['2xl'],   // 48px - page-level spacing
    hero: spacing['3xl'],   // 64px - hero sections
  },
  
  // Grid spacing
  grid: {
    gap: spacing.md,      // 16px - default grid gap
    gutter: spacing.lg,   // 24px - grid gutter
  },
} as const;

// Semantic Shadows
export const semanticShadows = {
  // UI element shadows
  card: shadows.sm,
  cardHover: shadows.md,
  dropdown: shadows.lg,
  modal: shadows.xl,
  popover: shadows.lg,
  toast: shadows.md,
  
  // Brand shadows
  brandSm: shadows.brandSm,
  brandMd: shadows.brandMd,
  brandLg: shadows.brandLg,
  brandGlow: shadows.brandGlow,
  
  // Focus shadows
  focus: `0 0 0 3px rgba(166, 77, 255, 0.2)`, // Vergil purple focus ring (updated to purple-400)
  focusError: `0 0 0 3px rgba(229, 28, 35, 0.2)`, // Error focus ring (using red-500)
  focusSuccess: `0 0 0 3px rgba(15, 138, 15, 0.2)`, // Success focus ring (using green-600)
} as const;

// Interactive States
export const interactiveStates = {
  // Hover states
  hover: {
    opacity: 1 - opacity.hover,
    scale: 1.02,
    duration: duration.fast,
    easing: easing.out,
  },
  
  // Pressed/Active states
  pressed: {
    opacity: 1 - opacity.pressed,
    scale: 0.98,
    duration: duration.instant,
    easing: easing.out,
  },
  
  // Disabled states
  disabled: {
    opacity: opacity.disabled,
    cursor: 'not-allowed',
  },
  
  // Focus states
  focus: {
    outline: `2px solid ${borderColor.focus}`,
    outlineOffset: '2px',
    borderRadius: borderRadius.sm,
  },
} as const;

// Animation presets
export const animations = {
  // Transitions
  transition: {
    fast: `all ${duration.fast} ${easing.out}`,
    normal: `all ${duration.normal} ${easing.out}`,
    slow: `all ${duration.slow} ${easing.out}`,
  },
  
  // Fade animations
  fadeIn: {
    duration: duration.normal,
    easing: easing.out,
  },
  fadeOut: {
    duration: duration.fast,
    easing: easing.out,
  },
  
  // Scale animations
  scaleIn: {
    duration: duration.normal,
    easing: easing.outBack,
  },
  scaleOut: {
    duration: duration.fast,
    easing: easing.out,
  },
  
  // Slide animations
  slideIn: {
    duration: duration.normal,
    easing: easing.outQuart,
  },
  slideOut: {
    duration: duration.fast,
    easing: easing.out,
  },
} as const;

// Typography tokens
export const typography = {
  // Font families
  font: {
    body: fontFamily.primary,
    heading: fontFamily.primary,
    mono: fontFamily.mono,
  },
  
  // Text styles - Semantic combinations
  text: {
    // Body styles
    body: {
      sm: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
      md: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
      lg: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
    },
    
    // Heading styles
    heading: {
      h1: {
        fontSize: fontSize['4xl'],
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
      },
      h2: {
        fontSize: fontSize['3xl'],
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
      },
      h3: {
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.normal,
      },
      h4: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.normal,
      },
      h5: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.normal,
      },
      h6: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.normal,
      },
    },
    
    // UI text styles
    ui: {
      label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
      caption: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
      button: {
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.wide,
      },
      code: {
        fontFamily: fontFamily.mono,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.normal,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
      },
    },
    
    // Display styles
    display: {
      fontSize: fontSize['5xl'],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
  },
} as const;

// Layout tokens
export const layout = {
  // Container widths
  container: {
    xs: '20rem',     // 320px
    sm: '24rem',     // 384px
    md: '28rem',     // 448px
    lg: '32rem',     // 512px
    xl: '36rem',     // 576px
    '2xl': '42rem',  // 672px
    '3xl': '48rem',  // 768px
    '4xl': '56rem',  // 896px
    '5xl': '64rem',  // 1024px
    '6xl': '72rem',  // 1152px
    '7xl': '80rem',  // 1280px
    full: '100%',
  },
  
  // Breakpoints
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Type exports
export type TextColor = keyof typeof semanticColors.text;
export type BackgroundColor = keyof typeof semanticColors.background;
export type BorderColorSemantic = keyof typeof semanticColors.border;
export type InteractiveColor = keyof typeof semanticColors.interactive;
export type ComponentSpacing = keyof typeof semanticSpacing.component;
export type LayoutSpacing = keyof typeof semanticSpacing.layout;
export type GridSpacing = keyof typeof semanticSpacing.grid;
export type SemanticShadow = keyof typeof semanticShadows;
export type AnimationPreset = keyof typeof animations;
export type ContainerSize = keyof typeof layout.container;
export type Breakpoint = keyof typeof layout.breakpoint;