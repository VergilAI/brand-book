/**
 * Vergil Design System - Color Tokens V2
 * Apple-Inspired Monochrome System with Emphasis Hierarchy
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    vergilPurple: '#7B00FF',        // THE brand purple
    vergilPurpleLight: '#9933FF',   // Hover states
    vergilPurpleLighter: '#BB66FF', // Dark theme primary
    vergilPurpleLightest: '#D199FF', // Dark theme secondary
  },
  
  // Legacy Colors (DEPRECATED - kept for backward compatibility)
  legacy: {
    cosmicPurple: '#6366F1', // DEPRECATED - use primary.vergilPurple instead
  },
  
  // Foundation Colors - Apple-inspired neutral palette
  foundation: {
    fullBlack: '#000000',    // Full black - backgrounds only
    offBlack: '#1D1D1F',     // Off-black - primary text
    fullWhite: '#FFFFFF',    // Full white - backgrounds only
    offWhite: '#F5F5F7',     // Off-white - text on dark, containers
  },
  
  // Emphasis Hierarchy - Subtle attention system
  emphasis: {
    footnoteText: '#6C6C6D',      // Small footnote text on off-white bg
    bg: '#F0F0F2',                // Temporary headers needing attention
    inputBg: '#FAFAFC',           // Interactive elements within emphasis areas
    text: '#303030',              // Text directly on emphasis-bg
    inputText: '#323232',         // Darker text inside emphasis-input-bg
    buttonHover: '#272729',       // Button hover state
  },
  
  // Semantic Colors V2
  semantic: {
    success: '#0F8A0F',
    error: '#E51C23',
    warning: '#FFC700',
    info: '#0087FF',
  },
  
  // Gradients - Updated with new purple
  gradients: {
    consciousness: 'linear-gradient(135deg, #7B00FF 0%, #9933FF 50%, #BB66FF 100%)',
    awakening: 'linear-gradient(90deg, #7B00FF 0%, #0087FF 100%)',
    synaptic: 'linear-gradient(135deg, #9933FF 0%, #BB66FF 100%)',
    lightRay: 'radial-gradient(circle at center, rgba(123, 0, 255, 0.1) 0%, transparent 70%)',
  },
} as const;

// Type exports
export type ColorToken = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type LegacyColor = keyof typeof colors.legacy;
export type FoundationColor = keyof typeof colors.foundation;
export type EmphasisColor = keyof typeof colors.emphasis;
export type SemanticColor = keyof typeof colors.semantic;
export type GradientColor = keyof typeof colors.gradients;