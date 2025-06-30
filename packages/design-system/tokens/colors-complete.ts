/**
 * Vergil Design System - Complete Color Tokens
 * This file contains ALL color tokens to maintain alignment with CSS variables
 */

export const colorsComplete = {
  // Primary Brand Colors V2
  primary: {
    vergilPurple: '#7B00FF',        // THE brand purple
    vergilPurpleLight: '#9933FF',   // Hover states
    vergilPurpleLighter: '#BB66FF', // Dark theme primary
    vergilPurpleLightest: '#D199FF', // Dark theme secondary
  },
  
  // Legacy Primary Palette (v1 colors for backward compatibility)
  legacy: {
    cosmicPurple: '#6366F1',    // DEPRECATED - use primary.vergilPurple
    electricViolet: '#A78BFA',
    luminousIndigo: '#818CF8',
  },
  
  // Accent Colors
  accent: {
    phosphorCyan: '#10B981',
    synapticBlue: '#3B82F6',
    neuralPink: '#F472B6',
  },
  
  // Foundation Colors
  foundation: {
    fullBlack: '#000000',      // Full black - backgrounds only
    offBlack: '#1D1D1F',       // Off-black - primary text
    fullWhite: '#FFFFFF',      // Full white - backgrounds only
    offWhite: '#F5F5F7',       // Off-white - text on dark, containers
    pureLight: '#FFFFFF',      // Alias for fullWhite
    softLight: '#FAFAFA',
    whisperGray: '#F8F9FA',
    mistGray: '#E5E7EB',
    stoneGray: '#9CA3AF',
    deepSpace: '#0F172A',
  },
  
  // Emphasis Hierarchy
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
  
  // Additional Colors
  additional: {
    luminousGold: '#F59E0B',
    vividRed: '#EF4444',
    midnightBlack: '#1E293B',
  },
  
  // Tool-specific Colors
  tools: {
    selectionPurple: '#8B5CF6',
    selectionPrimary: '#6366F1',
    mapSelection: '#8B5CF6',
    drawingSelection: '#8B5CF6',
    bezierHandle: '#8B5CF6',
    territoryPlayer6: '#8B5CF6',
    vertexSelected: '#1E40AF',
    snapCenter: '#FF6600',
  },
  
  // Blue Variants
  blues: {
    blueDark: '#1E40AF',
    blueBright: '#0066FF',
    blueLight: '#60A5FA',
    blueGray: '#94A3B8',
    blueMedium: '#2563EB',
    cyanBright: '#06B6D4',
  },
  
  // Brand Colors
  brand: {
    orangeBrand: '#FF6600',
  },
  
  // Gray Scale
  grays: {
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },
  
  // Pure Colors
  pure: {
    pureBlack: '#000000',
    pureWhite: '#FFFFFF',
  },
  
  // Legacy Numbered Variants (for backward compatibility)
  legacyVariants: {
    vergilPurple500: '#6366F1',
    vergilViolet500: '#A78BFA',
    vergilIndigo500: '#818CF8',
    vergilCyan500: '#10B981',
    vergilBlue500: '#3B82F6',
  },
  
  // Direct Mappings (for CSS variable alignment)
  // These are duplicates but needed for exact CSS variable matching
  cosmicPurple: '#6366F1',
  electricViolet: '#A78BFA',
  luminousIndigo: '#818CF8',
  phosphorCyan: '#10B981',
  synapticBlue: '#3B82F6',
  neuralPink: '#F472B6',
  pureLight: '#FFFFFF',
  softLight: '#FAFAFA',
  whisperGray: '#F8F9FA',
  mistGray: '#E5E7EB',
  stoneGray: '#9CA3AF',
  deepSpace: '#0F172A',
  vergilPurple: '#7B00FF',
  vergilPurpleLight: '#9933FF',
  vergilPurpleLighter: '#BB66FF',
  vergilPurpleLightest: '#D199FF',
  vergilFullBlack: '#000000',
  vergilOffBlack: '#1D1D1F',
  vergilFullWhite: '#FFFFFF',
  vergilOffWhite: '#F5F5F7',
  vergilFootnoteText: '#6C6C6D',
  vergilEmphasisBg: '#F0F0F2',
  vergilEmphasisInputBg: '#FAFAFC',
  vergilEmphasisText: '#303030',
  vergilEmphasisInputText: '#323232',
  vergilEmphasisButtonHover: '#272729',
  vergilSuccess: '#0F8A0F',
  vergilError: '#E51C23',
  vergilWarning: '#FFC700',
  vergilInfo: '#0087FF',
  vergilText: '#1D1D1F',
  vergilWhite: '#F5F5F7',
  pureBlack: '#000000',
  pureWhite: '#FFFFFF',
  
  // Gradients
  gradients: {
    consciousness: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #818CF8 100%)',
    awakening: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
    synaptic: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
    lightRay: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
  },
} as const;

// Type exports
export type ColorToken = keyof typeof colorsComplete;
export type PrimaryColor = keyof typeof colorsComplete.primary;
export type LegacyColor = keyof typeof colorsComplete.legacy;
export type AccentColor = keyof typeof colorsComplete.accent;
export type FoundationColor = keyof typeof colorsComplete.foundation;
export type EmphasisColor = keyof typeof colorsComplete.emphasis;
export type SemanticColor = keyof typeof colorsComplete.semantic;
export type AdditionalColor = keyof typeof colorsComplete.additional;
export type ToolColor = keyof typeof colorsComplete.tools;
export type BlueColor = keyof typeof colorsComplete.blues;
export type BrandColor = keyof typeof colorsComplete.brand;
export type GrayColor = keyof typeof colorsComplete.grays;
export type PureColor = keyof typeof colorsComplete.pure;
export type LegacyVariantColor = keyof typeof colorsComplete.legacyVariants;
export type GradientColor = keyof typeof colorsComplete.gradients;