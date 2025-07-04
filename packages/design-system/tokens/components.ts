/**
 * Vergil Design System - Component Tokens
 * Component-specific design tokens
 */

import { spacing, borderRadius, fontSize, fontWeight, lineHeight, duration, easing } from './primitives';
import { semanticColors, semanticShadows, semanticSpacing, interactiveStates } from './semantic';

// Button tokens
export const button = {
  // Sizes
  size: {
    sm: {
      height: '32px',
      paddingX: spacing.sm,
      paddingY: spacing.xs,
      fontSize: fontSize.sm,
      borderRadius: borderRadius.sm,
    },
    md: {
      height: '40px',
      paddingX: spacing.md,
      paddingY: spacing.sm,
      fontSize: fontSize.base,
      borderRadius: borderRadius.sm,
    },
    lg: {
      height: '48px',
      paddingX: spacing.lg,
      paddingY: spacing.sm,
      fontSize: fontSize.lg,
      borderRadius: borderRadius.md,
    },
  },
  
  // Variants
  variant: {
    primary: {
      background: semanticColors.interactive.primary.default,
      color: semanticColors.text.inverse,
      border: 'none',
      hover: {
        background: semanticColors.interactive.primary.hover,
      },
      pressed: {
        background: semanticColors.interactive.primary.pressed,
      },
      disabled: {
        background: semanticColors.interactive.primary.disabled,
        color: semanticColors.text.disabled,
      },
    },
    secondary: {
      background: semanticColors.interactive.secondary.default,
      color: semanticColors.text.primary,
      border: `1px solid ${semanticColors.border.default}`,
      hover: {
        background: semanticColors.interactive.secondary.hover,
      },
      pressed: {
        background: semanticColors.interactive.secondary.pressed,
      },
      disabled: {
        background: semanticColors.interactive.secondary.disabled,
        color: semanticColors.text.disabled,
      },
    },
    ghost: {
      background: 'transparent',
      color: semanticColors.text.primary,
      border: 'none',
      hover: {
        background: semanticColors.interactive.secondary.hover,
      },
      pressed: {
        background: semanticColors.interactive.secondary.pressed,
      },
      disabled: {
        color: semanticColors.text.disabled,
      },
    },
    destructive: {
      background: semanticColors.interactive.destructive.default,
      color: semanticColors.text.inverse,
      border: 'none',
      hover: {
        background: semanticColors.interactive.destructive.hover,
      },
      pressed: {
        background: semanticColors.interactive.destructive.pressed,
      },
      disabled: {
        background: semanticColors.interactive.destructive.disabled,
        color: semanticColors.text.disabled,
      },
    },
    success: {
      background: semanticColors.interactive.success.default,
      color: semanticColors.text.inverse,
      border: 'none',
      hover: {
        background: semanticColors.interactive.success.hover,
      },
      pressed: {
        background: semanticColors.interactive.success.pressed,
      },
      disabled: {
        background: semanticColors.interactive.success.disabled,
        color: semanticColors.text.disabled,
      },
    },
  },
  
  // Common properties
  fontWeight: fontWeight.medium,
  transition: `all ${duration.fast} ${easing.out}`,
  cursor: 'pointer',
  disabledCursor: 'not-allowed',
} as const;

// Card tokens
export const card = {
  // Variants
  variant: {
    default: {
      background: semanticColors.background.elevated,
      border: `1px solid ${semanticColors.border.subtle}`,
      borderRadius: borderRadius.md,
      shadow: semanticShadows.card,
      padding: semanticSpacing.component.md,
    },
    interactive: {
      background: semanticColors.background.elevated,
      border: `1px solid ${semanticColors.border.subtle}`,
      borderRadius: borderRadius.md,
      shadow: semanticShadows.card,
      padding: semanticSpacing.component.md,
      hover: {
        shadow: semanticShadows.cardHover,
        transform: 'translateY(-2px)',
      },
      transition: `all ${duration.normal} ${easing.out}`,
    },
    neural: {
      background: 'linear-gradient(135deg, rgba(123, 0, 255, 0.05) 0%, rgba(153, 51, 255, 0.05) 100%)',
      border: `1px solid ${semanticColors.border.emphasis}`,
      borderRadius: borderRadius.lg,
      shadow: semanticShadows.brandSm,
      padding: semanticSpacing.component.lg,
    },
    outlined: {
      background: 'transparent',
      border: `2px solid ${semanticColors.border.default}`,
      borderRadius: borderRadius.md,
      shadow: 'none',
      padding: semanticSpacing.component.md,
    },
  },
  
  // Common properties
  overflow: 'hidden',
} as const;

// Input tokens
export const input = {
  // Sizes
  size: {
    sm: {
      height: '32px',
      paddingX: spacing.sm,
      fontSize: fontSize.sm,
      borderRadius: borderRadius.sm,
    },
    md: {
      height: '40px',
      paddingX: spacing.md,
      fontSize: fontSize.base,
      borderRadius: borderRadius.sm,
    },
    lg: {
      height: '48px',
      paddingX: spacing.lg,
      fontSize: fontSize.lg,
      borderRadius: borderRadius.md,
    },
  },
  
  // States
  state: {
    default: {
      background: semanticColors.background.elevated,
      border: `1px solid ${semanticColors.border.default}`,
      color: semanticColors.text.primary,
    },
    hover: {
      border: `1px solid ${semanticColors.border.brand}`,
    },
    focus: {
      border: `1px solid ${semanticColors.border.focus}`,
      outline: semanticShadows.focus,
    },
    error: {
      border: `1px solid ${semanticColors.border.error}`,
      focus: {
        outline: semanticShadows.focusError,
      },
    },
    disabled: {
      background: semanticColors.background.disabled,
      color: semanticColors.text.disabled,
      cursor: 'not-allowed',
    },
  },
  
  // Common properties
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.normal,
  transition: `all ${duration.fast} ${easing.out}`,
} as const;

// Modal tokens
export const modal = {
  // Sizes
  size: {
    sm: {
      width: '400px',
      maxWidth: '90vw',
    },
    md: {
      width: '600px',
      maxWidth: '90vw',
    },
    lg: {
      width: '800px',
      maxWidth: '90vw',
    },
    xl: {
      width: '1200px',
      maxWidth: '90vw',
    },
    fullscreen: {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
    },
  },
  
  // Structure
  backdrop: {
    background: semanticColors.background.overlay,
    backdropFilter: 'blur(4px)',
  },
  content: {
    background: semanticColors.background.elevated,
    borderRadius: borderRadius.xl,
    shadow: semanticShadows.modal,
    padding: semanticSpacing.component.lg,
  },
  header: {
    paddingBottom: semanticSpacing.component.md,
    borderBottom: `1px solid ${semanticColors.border.subtle}`,
  },
  footer: {
    paddingTop: semanticSpacing.component.md,
    borderTop: `1px solid ${semanticColors.border.subtle}`,
  },
  
  // Animation
  animation: {
    duration: duration.normal,
    easing: easing.outQuart,
  },
} as const;

// Navigation tokens
export const navigation = {
  // Header
  header: {
    height: '64px',
    background: semanticColors.background.elevated,
    borderBottom: `1px solid ${semanticColors.border.subtle}`,
    padding: semanticSpacing.layout.container,
    shadow: semanticShadows.card,
  },
  
  // Nav items
  item: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: semanticColors.text.secondary,
    hover: {
      background: semanticColors.interactive.secondary.hover,
      color: semanticColors.text.primary,
    },
    active: {
      background: semanticColors.interactive.primary.default,
      color: semanticColors.text.inverse,
    },
    transition: `all ${duration.fast} ${easing.out}`,
  },
  
  // Mobile menu
  mobile: {
    background: semanticColors.background.elevated,
    shadow: semanticShadows.dropdown,
    borderRadius: borderRadius.lg,
    padding: semanticSpacing.component.md,
  },
} as const;

// Toast/Notification tokens
export const toast = {
  // Variants
  variant: {
    default: {
      background: semanticColors.background.inverse,
      color: semanticColors.text.inverse,
      border: 'none',
    },
    success: {
      background: semanticColors.interactive.success.default,
      color: semanticColors.text.inverse,
      border: 'none',
      icon: semanticColors.icon.success,
    },
    error: {
      background: semanticColors.interactive.destructive.default,
      color: semanticColors.text.inverse,
      border: 'none',
      icon: semanticColors.icon.error,
    },
    warning: {
      background: semanticColors.text.warning,
      color: semanticColors.text.primary,
      border: 'none',
      icon: semanticColors.icon.warning,
    },
    info: {
      background: semanticColors.text.info,
      color: semanticColors.text.inverse,
      border: 'none',
      icon: semanticColors.icon.info,
    },
  },
  
  // Structure
  borderRadius: borderRadius.md,
  padding: semanticSpacing.component.md,
  shadow: semanticShadows.toast,
  maxWidth: '400px',
  
  // Animation
  animation: {
    duration: duration.normal,
    easing: easing.outBack,
  },
} as const;

// Badge tokens
export const badge = {
  // Sizes
  size: {
    sm: {
      height: '20px',
      paddingX: spacing.xs,
      fontSize: fontSize.xs,
      borderRadius: borderRadius.xs,
    },
    md: {
      height: '24px',
      paddingX: spacing.sm,
      fontSize: fontSize.sm,
      borderRadius: borderRadius.xs,
    },
    lg: {
      height: '28px',
      paddingX: spacing.sm,
      fontSize: fontSize.base,
      borderRadius: borderRadius.sm,
    },
  },
  
  // Variants
  variant: {
    default: {
      background: semanticColors.background.secondary,
      color: semanticColors.text.secondary,
      border: 'none',
    },
    primary: {
      background: semanticColors.interactive.primary.default,
      color: semanticColors.text.inverse,
      border: 'none',
    },
    success: {
      background: semanticColors.text.success,
      color: semanticColors.text.inverse,
      border: 'none',
    },
    warning: {
      background: semanticColors.text.warning,
      color: semanticColors.text.inverse,
      border: 'none',
    },
    error: {
      background: semanticColors.text.error,
      color: semanticColors.text.inverse,
      border: 'none',
    },
    outlined: {
      background: 'transparent',
      color: semanticColors.text.primary,
      border: `1px solid ${semanticColors.border.default}`,
    },
  },
  
  // Common properties
  fontWeight: fontWeight.medium,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

// Type exports
export type ButtonSize = keyof typeof button.size;
export type ButtonVariant = keyof typeof button.variant;
export type CardVariant = keyof typeof card.variant;
export type InputSize = keyof typeof input.size;
export type InputState = keyof typeof input.state;
export type ModalSize = keyof typeof modal.size;
export type ToastVariant = keyof typeof toast.variant;
export type BadgeSize = keyof typeof badge.size;
export type BadgeVariant = keyof typeof badge.variant;