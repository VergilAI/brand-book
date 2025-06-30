/**
 * Token Suggestion Utilities
 * Helper functions to suggest appropriate design tokens for hardcoded values
 */

// Note: tokens import is for reference only in suggestions
// const { tokens } = require('../../generated/tokens');

// Color value to token mapping
const COLOR_SUGGESTIONS = {
  // Exact matches
  '#7B00FF': 'tokens.colors.brand.purple',
  '#9933FF': 'tokens.colors.brand.purpleLight',
  '#BB66FF': 'tokens.colors.brand.purpleLighter',
  '#D199FF': 'tokens.colors.brand.purpleLightest',
  '#1D1D1F': 'tokens.colors.neutral.offBlack',
  '#F5F5F7': 'tokens.colors.neutral.offWhite',
  '#000000': 'tokens.colors.neutral.black',
  '#FFFFFF': 'tokens.colors.neutral.white',
  '#F0F0F2': 'tokens.colors.emphasis.bg',
  '#FAFAFC': 'tokens.colors.emphasis.inputBg',
  '#303030': 'tokens.colors.emphasis.text',
  '#6C6C6D': 'tokens.colors.emphasis.footnote',
  '#0F8A0F': 'tokens.colors.functional.success',
  '#E51C23': 'tokens.colors.functional.error',
  '#FFC700': 'tokens.colors.functional.warning',
  '#0087FF': 'tokens.colors.functional.info',
  
  // Legacy colors (deprecated)
  '#6366F1': 'tokens.colors.brand.purple', // cosmic-purple
  '#A78BFA': 'tokens.colors.brand.purpleLight', // electric-violet
  '#818CF8': 'tokens.colors.brand.purpleLighter', // luminous-indigo
  '#10B981': 'tokens.colors.functional.success', // phosphor-cyan
  '#3B82F6': 'tokens.colors.functional.info', // synaptic-blue
  '#F472B6': 'tokens.colors.brand.purpleLightest', // neural-pink
};

// Common color approximations
const COLOR_APPROXIMATIONS = {
  // Black variations
  'black': 'tokens.colors.neutral.offBlack',
  '#000': 'tokens.colors.neutral.offBlack',
  'rgb(0,0,0)': 'tokens.colors.neutral.offBlack',
  'rgb(0, 0, 0)': 'tokens.colors.neutral.offBlack',
  
  // White variations
  'white': 'tokens.colors.neutral.offWhite',
  '#fff': 'tokens.colors.neutral.offWhite',
  '#ffffff': 'tokens.colors.neutral.offWhite',
  'rgb(255,255,255)': 'tokens.colors.neutral.offWhite',
  'rgb(255, 255, 255)': 'tokens.colors.neutral.offWhite',
  
  // Purple variations
  'purple': 'tokens.colors.brand.purple',
  '#800080': 'tokens.colors.brand.purple',
  '#663399': 'tokens.colors.brand.purple',
  
  // Gray variations
  'gray': 'tokens.colors.emphasis.footnote',
  'grey': 'tokens.colors.emphasis.footnote',
  '#808080': 'tokens.colors.emphasis.footnote',
  '#666666': 'tokens.colors.emphasis.footnote',
  '#999999': 'tokens.colors.emphasis.footnote',
  
  // Common system colors
  'red': 'tokens.colors.functional.error',
  'green': 'tokens.colors.functional.success',
  'blue': 'tokens.colors.functional.info',
  'yellow': 'tokens.colors.functional.warning',
  'orange': 'tokens.colors.functional.warning',
};

// Spacing value to token mapping
const SPACING_SUGGESTIONS = {
  // Direct token matches from our system
  '2px': 'tokens.spacing.scale[0][5]',
  '4px': 'tokens.spacing.scale[1]',
  '8px': 'tokens.spacing.scale[2]',
  '12px': 'tokens.spacing.scale[3]',
  '16px': 'tokens.spacing.scale[4]',
  '20px': 'tokens.spacing.scale[5]',
  '24px': 'tokens.spacing.scale[6]',
  '32px': 'tokens.spacing.scale[8]',
  '40px': 'tokens.spacing.scale[10]',
  '48px': 'tokens.spacing.scale[12]',
  '64px': 'tokens.spacing.scale[16]',
  '80px': 'tokens.spacing.scale[20]',
  '96px': 'tokens.spacing.scale[24]',
  '128px': 'tokens.spacing.scale[32]',
  
  // Common rem equivalents
  '0.25rem': 'tokens.spacing.scale[1]', // 4px
  '0.5rem': 'tokens.spacing.scale[2]', // 8px
  '0.75rem': 'tokens.spacing.scale[3]', // 12px
  '1rem': 'tokens.spacing.scale[4]', // 16px
  '1.25rem': 'tokens.spacing.scale[5]', // 20px
  '1.5rem': 'tokens.spacing.scale[6]', // 24px
  '2rem': 'tokens.spacing.scale[8]', // 32px
  '2.5rem': 'tokens.spacing.scale[10]', // 40px
  '3rem': 'tokens.spacing.scale[12]', // 48px
  '4rem': 'tokens.spacing.scale[16]', // 64px
  
  // Semantic tokens
  '8px': 'tokens.spacing.semantic.component.padding.xs',
  '12px': 'tokens.spacing.semantic.component.padding.sm',
  '16px': 'tokens.spacing.semantic.component.padding.md',
  '24px': 'tokens.spacing.semantic.component.padding.lg',
  '32px': 'tokens.spacing.semantic.component.padding.xl',
};

// Tailwind class suggestions
const TAILWIND_SUGGESTIONS = {
  color: {
    '#7B00FF': 'bg-vergil-purple',
    '#9933FF': 'bg-vergil-purple-light',
    '#1D1D1F': 'bg-vergil-off-black',
    '#F5F5F7': 'bg-vergil-off-white',
    '#000000': 'bg-black',
    '#FFFFFF': 'bg-white',
  },
  spacing: {
    '4px': 'p-1',
    '8px': 'p-2',
    '12px': 'p-3',
    '16px': 'p-4',
    '20px': 'p-5',
    '24px': 'p-6',
    '32px': 'p-8',
    '40px': 'p-10',
    '48px': 'p-12',
    '64px': 'p-16',
  },
  typography: {
    '12px': 'text-xs',
    '14px': 'text-sm',
    '16px': 'text-base',
    '18px': 'text-lg',
    '20px': 'text-xl',
    '24px': 'text-2xl',
    '30px': 'text-3xl',
    '36px': 'text-4xl',
  },
};

/**
 * Get color token suggestion for a given color value
 * @param {string} color - The color value to find a suggestion for
 * @returns {string|null} - Suggested token or null if none found
 */
function getColorSuggestion(color) {
  const normalizedColor = color.toLowerCase().replace(/\s/g, '');
  
  // Check exact matches first
  if (COLOR_SUGGESTIONS[color] || COLOR_SUGGESTIONS[normalizedColor]) {
    return COLOR_SUGGESTIONS[color] || COLOR_SUGGESTIONS[normalizedColor];
  }
  
  // Check approximations
  if (COLOR_APPROXIMATIONS[color] || COLOR_APPROXIMATIONS[normalizedColor]) {
    return COLOR_APPROXIMATIONS[color] || COLOR_APPROXIMATIONS[normalizedColor];
  }
  
  // Try to match RGB values
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const hex = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`.toUpperCase();
    return COLOR_SUGGESTIONS[hex] || getColorSuggestion(hex);
  }
  
  // Try to match hex variations
  if (color.startsWith('#')) {
    const hex3to6 = color.length === 4 ? 
      `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : 
      color;
    return COLOR_SUGGESTIONS[hex3to6.toUpperCase()];
  }
  
  return null;
}

/**
 * Get spacing token suggestion for a given spacing value
 * @param {string} spacing - The spacing value to find a suggestion for
 * @returns {string|null} - Suggested token or null if none found
 */
function getSpacingSuggestion(spacing) {
  const normalizedSpacing = spacing.toLowerCase().replace(/\s/g, '');
  
  // Check exact matches
  if (SPACING_SUGGESTIONS[normalizedSpacing]) {
    return SPACING_SUGGESTIONS[normalizedSpacing];
  }
  
  // Try to convert rem to px and match
  const remMatch = spacing.match(/^([\d.]+)rem$/);
  if (remMatch) {
    const remValue = parseFloat(remMatch[1]);
    const pxValue = `${remValue * 16}px`;
    if (SPACING_SUGGESTIONS[pxValue]) {
      return SPACING_SUGGESTIONS[pxValue];
    }
  }
  
  // Try to convert px to nearest token
  const pxMatch = spacing.match(/^(\d+)px$/);
  if (pxMatch) {
    const pxValue = parseInt(pxMatch[1]);
    const spacingValues = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256];
    
    // Find closest spacing value
    const closest = spacingValues.reduce((prev, curr) => 
      Math.abs(curr - pxValue) < Math.abs(prev - pxValue) ? curr : prev
    );
    
    const closestKey = `${closest}px`;
    if (SPACING_SUGGESTIONS[closestKey]) {
      return SPACING_SUGGESTIONS[closestKey];
    }
  }
  
  return null;
}

/**
 * Get Tailwind class suggestion for arbitrary values
 * @param {string} property - The CSS property or Tailwind prefix
 * @param {string} value - The arbitrary value
 * @returns {string|null} - Suggested Tailwind class or null if none found
 */
function getTailwindSuggestion(property, value) {
  // Handle color suggestions
  if (property.includes('color') || property.includes('bg') || property.includes('text') || property.includes('border')) {
    const colorSuggestion = TAILWIND_SUGGESTIONS.color[value];
    if (colorSuggestion) {
      // Adapt the suggestion to the property
      if (property.includes('text')) {
        return colorSuggestion.replace('bg-', 'text-');
      }
      if (property.includes('border')) {
        return colorSuggestion.replace('bg-', 'border-');
      }
      return colorSuggestion;
    }
  }
  
  // Handle spacing suggestions
  if (property.includes('p') || property.includes('m') || property.includes('gap') || 
      property.includes('w') || property.includes('h') || property.includes('space')) {
    const spacingSuggestion = TAILWIND_SUGGESTIONS.spacing[value];
    if (spacingSuggestion) {
      // Adapt the suggestion to the property
      if (property.includes('m')) {
        return spacingSuggestion.replace('p-', 'm-');
      }
      if (property.includes('gap')) {
        return spacingSuggestion.replace('p-', 'gap-');
      }
      if (property.includes('w')) {
        return spacingSuggestion.replace('p-', 'w-');
      }
      if (property.includes('h')) {
        return spacingSuggestion.replace('p-', 'h-');
      }
      return spacingSuggestion;
    }
  }
  
  // Handle typography suggestions
  if (property.includes('text') || property.includes('font') || property.includes('leading')) {
    const typographySuggestion = TAILWIND_SUGGESTIONS.typography[value];
    if (typographySuggestion) {
      return typographySuggestion;
    }
  }
  
  return null;
}

/**
 * Get required token import for a given usage context
 * @param {string} context - The usage context
 * @returns {string} - Required import statement
 */
function getRequiredTokenImport(context = 'default') {
  switch (context) {
    case 'colors':
      return 'import { tokens } from "@/tokens"';
    case 'spacing':
      return 'import { tokens } from "@/tokens"';
    case 'typography':
      return 'import { tokens } from "@/tokens"';
    default:
      return 'import { tokens } from "@/tokens"';
  }
}

module.exports = {
  getColorSuggestion,
  getSpacingSuggestion,
  getTailwindSuggestion,
  getRequiredTokenImport,
  COLOR_SUGGESTIONS,
  SPACING_SUGGESTIONS,
  TAILWIND_SUGGESTIONS,
};