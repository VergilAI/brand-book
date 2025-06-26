/**
 * Vergil Design System - Color Tokens
 * Living Intelligence Color Palette
 */

export const colors = {
  // Primary Palette - The consciousness spectrum
  primary: {
    cosmicPurple: '#6366F1',
    electricViolet: '#A78BFA', 
    luminousIndigo: '#818CF8',
  },
  
  // Accent Colors - Neural energy
  accent: {
    phosphorCyan: '#10B981',
    synapticBlue: '#3B82F6',
    neuralPink: '#F472B6',
  },
  
  // Foundation Colors - The canvas
  foundation: {
    pureLight: '#FFFFFF',
    softLight: '#FAFAFA',
    whisperGray: '#F8F9FA',
    mistGray: '#E5E7EB',
    stoneGray: '#9CA3AF',
    deepSpace: '#0F172A',
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Gradients - Living patterns
  gradients: {
    consciousness: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #818CF8 100%)',
    awakening: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
    synaptic: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
    lightRay: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
  },
} as const;

// Type exports
export type ColorToken = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type AccentColor = keyof typeof colors.accent;
export type FoundationColor = keyof typeof colors.foundation;
export type SemanticColor = keyof typeof colors.semantic;
export type GradientColor = keyof typeof colors.gradients;