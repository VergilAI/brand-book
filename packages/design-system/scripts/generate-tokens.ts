/**
 * Token Generator Script
 * Generates CSS variables, Tailwind config, and JSON from design tokens
 */

import * as fs from 'fs';
import * as path from 'path';
import { tokens } from '../tokens';

// Ensure output directory exists
const outputDir = path.join(__dirname, '../generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate CSS Variables
function generateCSSVariables() {
  let css = ':root {\n';
  
  // Colors
  Object.entries(tokens.colors.primary).forEach(([key, value]) => {
    css += `  --color-primary-${toKebabCase(key)}: ${value};\n`;
  });
  
  // Legacy colors (if they exist)
  if (tokens.colors.legacy) {
    Object.entries(tokens.colors.legacy).forEach(([key, value]) => {
      css += `  --color-legacy-${toKebabCase(key)}: ${value};\n`;
    });
  }
  
  // Emphasis colors
  if (tokens.colors.emphasis) {
    Object.entries(tokens.colors.emphasis).forEach(([key, value]) => {
      css += `  --color-emphasis-${toKebabCase(key)}: ${value};\n`;
    });
  }
  
  Object.entries(tokens.colors.foundation).forEach(([key, value]) => {
    css += `  --color-foundation-${toKebabCase(key)}: ${value};\n`;
  });
  
  Object.entries(tokens.colors.semantic).forEach(([key, value]) => {
    css += `  --color-semantic-${key}: ${value};\n`;
  });
  
  // Typography
  Object.entries(tokens.typography.fonts).forEach(([key, value]) => {
    css += `  --font-${key}: ${value};\n`;
  });
  
  Object.entries(tokens.typography.sizes).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  
  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      css += `  --shadow-${key}: ${value};\n`;
    }
  });
  
  // Radii
  Object.entries(tokens.radii).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  
  css += '}\n';
  
  // Dark mode overrides
  css += '\n.dark {\n';
  css += '  /* Dark mode color overrides can be added here */\n';
  css += '}\n';
  
  fs.writeFileSync(path.join(outputDir, 'tokens.css'), css);
  console.log('✅ Generated CSS variables');
}

// Generate Tailwind Config
function generateTailwindConfig() {
  const config = {
    theme: {
      extend: {
        colors: {
          // Primary brand colors
          'vergil-purple': tokens.colors.primary.vergilPurple,
          'vergil-purple-light': tokens.colors.primary.vergilPurpleLight,
          'vergil-purple-lighter': tokens.colors.primary.vergilPurpleLighter,
          'vergil-purple-lightest': tokens.colors.primary.vergilPurpleLightest,
          
          // Foundation colors
          'vergil-full-black': tokens.colors.foundation.fullBlack,
          'vergil-off-black': tokens.colors.foundation.offBlack,
          'vergil-full-white': tokens.colors.foundation.fullWhite,
          'vergil-off-white': tokens.colors.foundation.offWhite,
          
          // Emphasis hierarchy
          'vergil-footnote-text': tokens.colors.emphasis.footnoteText,
          'vergil-emphasis-bg': tokens.colors.emphasis.bg,
          'vergil-emphasis-input-bg': tokens.colors.emphasis.inputBg,
          'vergil-emphasis-text': tokens.colors.emphasis.text,
          'vergil-emphasis-input-text': tokens.colors.emphasis.inputText,
          'vergil-emphasis-button-hover': tokens.colors.emphasis.buttonHover,
          
          // Semantic colors
          'vergil-success': tokens.colors.semantic.success,
          'vergil-error': tokens.colors.semantic.error,
          'vergil-warning': tokens.colors.semantic.warning,
          'vergil-info': tokens.colors.semantic.info,
          
          // Legacy (deprecated)
          'cosmic-purple': tokens.colors.legacy.cosmicPurple,
        },
        fontFamily: tokens.typography.fonts,
        fontSize: tokens.typography.sizes,
        spacing: tokens.spacing,
        boxShadow: {
          ...tokens.shadows,
          ...Object.entries(tokens.shadows.glow).reduce((acc, [key, value]) => ({
            ...acc,
            [`glow-${key}`]: value,
          }), {}),
        },
        borderRadius: tokens.radii,
        animation: Object.keys(tokens.animations.keyframes).reduce((acc, key) => ({
          ...acc,
          [key]: `${key} ${tokens.animations.durations[key] || '1s'} ${tokens.animations.easings.smooth} infinite`,
        }), {}),
        keyframes: tokens.animations.keyframes,
      },
    },
  };
  
  const configString = `// Generated Tailwind config extensions
export const tailwindTokens = ${JSON.stringify(config, null, 2)};
`;
  
  fs.writeFileSync(path.join(outputDir, 'tailwind-tokens.js'), configString);
  console.log('✅ Generated Tailwind config');
}

// Generate JSON tokens
function generateJSON() {
  fs.writeFileSync(
    path.join(outputDir, 'tokens.json'),
    JSON.stringify(tokens, null, 2)
  );
  console.log('✅ Generated JSON tokens');
}

// Utility function
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Run all generators
generateCSSVariables();
generateTailwindConfig();
generateJSON();

console.log('\n✨ All tokens generated successfully!');