/**
 * Vergil Design System - Primitive Tokens
 * Raw design values that form the foundation of the system
 */

// Spacing - Apple-inspired 8px base system with emphasis on 16px and 24px
export const spacing = {
  xs: '4px',    // micro-adjustments, icon padding
  sm: '8px',    // tight spacing, small gaps
  md: '16px',   // PRIMARY - default spacing for most UI elements
  lg: '24px',   // PRIMARY - comfortable spacing, section gaps
  xl: '32px',   // loose spacing, major sections
  '2xl': '48px', // large sections, page-level spacing
  '3xl': '64px', // hero sections, major layout breaks
} as const;

// Colors - Comprehensive color scales from design system
export const colors = {
  // Purple Scale - Brand color progression
  purple: {
    50: '#F3E6FF',      // Lightest purple - subtle backgrounds
    100: '#E6CCFF',     // Very light purple - hover backgrounds
    200: '#D199FF',     // Light purple - dark theme secondary
    300: '#BB66FF',     // Medium light purple - dark theme primary
    400: '#A64DFF',     // Medium purple - decorative elements
    500: '#9933FF',     // Default purple - hover states
    600: '#7B00FF',     // Brand purple - primary brand moments
    700: '#6600CC',     // Dark purple - pressed states
    800: '#520099',     // Darker purple - high contrast
    900: '#3D0066',     // Darkest purple - text on light
  },
  
  // Red Scale - Destructive and error states
  red: {
    50: '#FEF2F2',      // Lightest red - error backgrounds
    100: '#FEE2E2',     // Very light red - error containers
    200: '#FECACA',     // Light red - error highlights
    300: '#FCA5A5',     // Medium light red - error borders
    400: '#F87171',     // Medium red - error icons
    500: '#E51C23',     // Default error - primary error states
    600: '#DC2626',     // Dark red - error text
    700: '#B91C1C',     // Darker red - pressed states
    800: '#991B1B',     // Very dark red - high contrast
    900: '#7F1D1D',     // Darkest red - text on light
  },
  
  // Yellow Scale - Caution and warning states
  yellow: {
    50: '#FFFEF0',      // Lightest yellow - warning backgrounds
    100: '#FFFDE0',     // Very light yellow - warning containers
    200: '#FFFAB8',     // Light yellow - warning highlights
    300: '#FFF490',     // Medium light yellow - warning borders
    400: '#FFEB3B',     // Medium yellow - warning icons
    500: '#FFC700',     // Default warning - primary warning states
    600: '#FFB300',     // Dark yellow - warning text
    700: '#FF8F00',     // Darker yellow - pressed states
    800: '#FF6F00',     // Very dark yellow - high contrast
    900: '#E65100',     // Darkest yellow - text on light
  },
  
  // Green Scale - Positive and success states
  green: {
    50: '#F0FDF4',      // Lightest green - success backgrounds
    100: '#DCFCE7',     // Very light green - success containers
    200: '#BBF7D0',     // Light green - success highlights
    300: '#86EFAC',     // Medium light green - success borders
    400: '#4ADE80',     // Medium green - success icons
    500: '#22C55E',     // Default green - positive feedback
    600: '#0F8A0F',     // Brand success - primary success states
    700: '#15803D',     // Dark green - success text
    800: '#166534',     // Darker green - pressed states
    900: '#14532D',     // Darkest green - text on light
  },
  
  // Blue Scale - Informational and link states
  blue: {
    50: '#EFF6FF',      // Lightest blue - info backgrounds
    100: '#DBEAFE',     // Very light blue - info containers
    200: '#BFDBFE',     // Light blue - info highlights
    300: '#93C5FD',     // Medium light blue - info borders
    400: '#60A5FA',     // Medium blue - info icons
    500: '#3B82F6',     // Default blue - links
    600: '#0087FF',     // Brand info - primary info states
    700: '#1D4ED8',     // Dark blue - info text
    800: '#1E40AF',     // Darker blue - pressed states
    900: '#1E3A8A',     // Darkest blue - text on light
  },
  
  // Gray Scale - 16-step grayscale incorporating Apple values
  gray: {
    25: '#FAFAFC',      // Near white - emphasis inputs
    50: '#F5F5F7',      // Off-white - soft containers
    100: '#F0F0F2',     // Emphasis bg - attention areas
    150: '#E5E5E7',     // Light gray - subtle borders
    200: '#D4D4D8',     // Gray 200 - dividers
    300: '#A3A3A8',     // Gray 300 - disabled text
    400: '#71717A',     // Gray 400 - placeholders
    450: '#6C6C6D',     // Footnote gray - small text
    500: '#52525B',     // Gray 500 - secondary icons
    600: '#3F3F46',     // Gray 600 - tertiary text
    700: '#323232',     // Emphasis input text
    750: '#303030',     // Emphasis text
    800: '#272729',     // Button hover - interaction
    850: '#1D1D1F',     // Off-black - primary text
    900: '#18181B',     // Near black - high emphasis
    950: '#000000',     // Full black - backgrounds only
  },
  
  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
  
  // Legacy colors for backwards compatibility
  vergilPurple: '#A64DFF', // Changed from purple-600 to purple-400
  vergilOffBlack: '#1D1D1F',
  vergilOffWhite: '#F5F5F7',
  cosmicPurple: '#6366F1',
  electricViolet: '#A78BFA',
  luminousIndigo: '#818CF8',
  phosphorCyan: '#10B981',
  synapticBlue: '#3B82F6',
  neuralPink: '#F472B6',
} as const;

// Typography - Font families
export const fontFamily = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: "'SF Mono', Monaco, 'Cascadia Code', monospace",
} as const;

// Typography - Size scale (1.25 ratio - Major Third)
export const fontSize = {
  xs: '12px',       // captions, fine print, metadata
  sm: '14px',       // secondary text, labels
  base: '16px',     // DEFAULT body text, paragraphs
  lg: '20px',       // large body text, small headings
  xl: '24px',       // h4 headings
  '2xl': '30px',    // h3 headings
  '3xl': '36px',    // h2 headings
  '4xl': '48px',    // h1 headings, page titles
  '5xl': '60px',    // display text, marketing headers
} as const;

// Typography - Font weights
export const fontWeight = {
  normal: '400',    // body text, most content
  medium: '500',    // slightly emphasized text
  semibold: '600',  // subheadings, important labels
  bold: '700',      // headings, strong emphasis
} as const;

// Typography - Line heights
export const lineHeight = {
  tight: '1.25',    // headings, short text
  normal: '1.5',    // DEFAULT body text
  relaxed: '1.625', // long-form content
} as const;

// Typography - Letter spacing
export const letterSpacing = {
  tight: '-0.025em',    // large headings
  normal: '0',          // DEFAULT body text
  wide: '0.025em',      // small caps, buttons
} as const;

// Easing functions - Industry standard curves
export const easing = {
  out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',      // DEFAULT - most UI animations
  inOut: 'cubic-bezier(0.42, 0, 0.58, 1)',          // longer transitions, page changes
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',     // playful micro-interactions
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',        // snappy, responsive feel
  linear: 'linear',                                   // loading states, progress
} as const;

// Shadows - Elevation-based system
export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',     // subtle cards
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',     // elevated elements
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',    // modals, dropdowns
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',  // highest priority
  // Brand shadows
  brandSm: '0 2px 4px rgba(166, 77, 255, 0.1)',
  brandMd: '0 4px 8px rgba(166, 77, 255, 0.12)',
  brandLg: '0 8px 16px rgba(166, 77, 255, 0.16)',
  brandGlow: '0 0 24px rgba(166, 77, 255, 0.4)',
} as const;

// Border widths
export const borderWidth = {
  none: '0',
  thin: '1px',     // DEFAULT - 90% of use cases
  medium: '2px',   // focus states, emphasis
} as const;

// Border colors
export const borderColor = {
  subtle: 'rgba(0,0,0,0.05)',    // barely visible dividers
  default: 'rgba(0,0,0,0.1)',    // standard UI borders
  focus: '#007AFF',              // interactive focus states
} as const;

// Border radius - Apple-style proportional scaling
export const borderRadius = {
  none: '0',
  xs: '4px',     // small elements, badges
  sm: '6px',     // buttons, inputs - DEFAULT for most UI
  md: '8px',     // cards, containers
  lg: '12px',    // large cards, panels
  xl: '16px',    // modals, major sections
  '2xl': '20px', // hero containers
  full: '50%',   // circular elements
} as const;

// Z-index - Semantic layering system
export const zIndex = {
  base: 0,          // default page content
  dropdown: 1000,   // dropdowns, tooltips
  sticky: 1100,     // sticky headers, sidebars
  overlay: 1200,    // modal backdrops
  modal: 1300,      // modal content
  popover: 1400,    // popovers, context menus
  toast: 1500,      // notifications, alerts
  tooltip: 1600,    // tooltips (highest UI layer)
} as const;

// Opacity - Contextual values
export const opacity = {
  disabled: 0.4,    // disabled interactive elements
  hover: 0.05,      // subtle hover overlays
  pressed: 0.1,     // active/pressed states
  backdrop: 0.5,    // modal backdrops
  loading: 0.6,     // loading overlays
} as const;

// Timing/Duration - Animation durations
export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
} as const;

// Gradients - Living patterns
export const gradients = {
  consciousness: 'linear-gradient(135deg, #A64DFF 0%, #BB66FF 50%, #D199FF 100%)', // Using purple scale
  ambient: 'radial-gradient(circle at center, rgba(166, 77, 255, 0.1) 0%, transparent 70%)',
  
  // Legacy gradients for backwards compatibility
  awakening: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
  synaptic: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
  lightRay: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
} as const;

// Stroke patterns - SVG strokeDasharray values
export const strokePattern = {
  none: 'none',              // Solid stroke
  dashed: '3 3',             // Evenly spaced dashes: - - - -
  dotted: '0.1 3',           // True dots (requires stroke-linecap="round"): • • • •
} as const;

// Type exports
export type SpacingToken = keyof typeof spacing;
export type ColorToken = keyof typeof colors;
export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
export type LineHeightToken = keyof typeof lineHeight;
export type LetterSpacingToken = keyof typeof letterSpacing;
export type EasingToken = keyof typeof easing;
export type ShadowToken = keyof typeof shadows;
export type BorderWidthToken = keyof typeof borderWidth;
export type BorderColorToken = keyof typeof borderColor;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ZIndexToken = keyof typeof zIndex;
export type OpacityToken = keyof typeof opacity;
export type DurationToken = keyof typeof duration;
export type GradientToken = keyof typeof gradients;
export type StrokePatternToken = keyof typeof strokePattern;