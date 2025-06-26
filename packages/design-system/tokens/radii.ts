/**
 * Vergil Design System - Border Radius Tokens
 * Consistent corner radius system
 */

export const radii = {
  none: '0px',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
  
  // Component-specific radii
  button: '0.375rem',    // 6px
  card: '0.75rem',       // 12px
  modal: '1rem',         // 16px
  input: '0.375rem',     // 6px
} as const;

// Type exports
export type RadiusToken = keyof typeof radii;