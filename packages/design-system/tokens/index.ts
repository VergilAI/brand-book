/**
 * Vergil Design System - Token Exports
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animations';
export * from './shadows';
export * from './radii';

// Re-export all tokens as a single object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, semanticSpacing } from './spacing';
import { animations } from './animations';
import { shadows } from './shadows';
import { radii } from './radii';

export const tokens = {
  colors,
  typography,
  spacing,
  semanticSpacing,
  animations,
  shadows,
  radii,
} as const;

// Utility type for all tokens
export type DesignToken = typeof tokens;