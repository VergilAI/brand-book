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
  
  Object.entries(tokens.colors.accent).forEach(([key, value]) => {
    css += `  --color-accent-${toKebabCase(key)}: ${value};\n`;
  });
  
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
          'cosmic-purple': tokens.colors.primary.cosmicPurple,
          'electric-violet': tokens.colors.primary.electricViolet,
          'luminous-indigo': tokens.colors.primary.luminousIndigo,
          'phosphor-cyan': tokens.colors.accent.phosphorCyan,
          'synaptic-blue': tokens.colors.accent.synapticBlue,
          'neural-pink': tokens.colors.accent.neuralPink,
          'deep-space': tokens.colors.foundation.deepSpace,
          'pure-light': tokens.colors.foundation.pureLight,
          'soft-light': tokens.colors.foundation.softLight,
          'whisper-gray': tokens.colors.foundation.whisperGray,
          'mist-gray': tokens.colors.foundation.mistGray,
          'stone-gray': tokens.colors.foundation.stoneGray,
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