/**
 * Vergil Design System - Shadow Tokens
 * Depth and elevation system
 */

export const shadows = {
  // Base shadows
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Brand shadows (with color)
  cosmic: '0 4px 20px -2px rgba(99, 102, 241, 0.25)',
  electric: '0 4px 20px -2px rgba(167, 139, 250, 0.25)',
  neural: '0 0 30px -5px rgba(129, 140, 248, 0.3)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  innerLg: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',
  
  // Glow effects
  glow: {
    cosmic: '0 0 20px rgba(99, 102, 241, 0.5)',
    electric: '0 0 20px rgba(167, 139, 250, 0.5)',
    phosphor: '0 0 20px rgba(16, 185, 129, 0.5)',
    synaptic: '0 0 20px rgba(59, 130, 246, 0.5)',
  },
} as const;

// Type exports
export type ShadowToken = keyof typeof shadows;
export type GlowShadow = keyof typeof shadows.glow;