/**
 * Vergil Design System - Token Exports
 * Central export for all design tokens
 */

// Export all primitive tokens
export * from './primitives';

// Export all semantic tokens
export * from './semantic';

// Export all component tokens
export * from './components';

// Legacy exports for backwards compatibility
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animations';
export * from './shadows';
export * from './radii';

// Re-export all tokens as a single object
import * as primitives from './primitives';
import * as semantic from './semantic';
import * as components from './components';

// Legacy imports
import { colors } from './colors';
import { typography } from './typography';
import { spacing, semanticSpacing } from './spacing';
import { animations } from './animations';
import { shadows } from './shadows';
import { radii } from './radii';

// New comprehensive token object
export const tokens = {
  // New token structure
  primitives,
  semantic,
  components,
  
  // Legacy structure for backwards compatibility
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

// Export specific token types for convenience
export type PrimitiveTokens = typeof primitives;
export type SemanticTokens = typeof semantic;
export type ComponentTokens = typeof components;