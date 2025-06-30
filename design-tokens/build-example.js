/**
 * Example build script for transforming design tokens
 * This demonstrates how to convert YAML tokens to various formats
 * 
 * In a real implementation, you would use a tool like:
 * - Style Dictionary (https://amzn.github.io/style-dictionary/)
 * - Theo (https://github.com/salesforce-ux/theo)
 * - Design Tokens (https://github.com/design-tokens/community-group)
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Example function to load and merge all token files
function loadTokens() {
  const tokensPath = path.join(__dirname, 'source');
  const mainTokens = yaml.load(fs.readFileSync(path.join(tokensPath, 'tokens.yaml'), 'utf8'));
  
  // In a real build, you would merge all imported files
  const colors = yaml.load(fs.readFileSync(path.join(tokensPath, 'colors.yaml'), 'utf8'));
  const typography = yaml.load(fs.readFileSync(path.join(tokensPath, 'typography.yaml'), 'utf8'));
  const spacing = yaml.load(fs.readFileSync(path.join(tokensPath, 'spacing.yaml'), 'utf8'));
  const animations = yaml.load(fs.readFileSync(path.join(tokensPath, 'animations.yaml'), 'utf8'));
  const shadows = yaml.load(fs.readFileSync(path.join(tokensPath, 'shadows.yaml'), 'utf8'));
  
  return {
    ...mainTokens,
    ...colors,
    ...typography,
    ...spacing,
    ...animations,
    ...shadows
  };
}

// Example: Generate CSS Custom Properties
function generateCSS(tokens) {
  let css = ':root {\n';
  
  // Colors
  if (tokens.colors) {
    css += '  /* Brand Colors */\n';
    css += `  --color-brand-purple: ${tokens.colors.brand.purple.value};\n`;
    css += `  --color-brand-purple-light: ${tokens.colors.brand.purple-light.value};\n`;
    css += `  --color-brand-purple-lighter: ${tokens.colors.brand.purple-lighter.value};\n`;
    css += `  --color-brand-purple-lightest: ${tokens.colors.brand.purple-lightest.value};\n`;
    css += '\n';
    
    css += '  /* Neutral Colors */\n';
    css += `  --color-neutral-black: ${tokens.colors.neutral.black.value};\n`;
    css += `  --color-neutral-white: ${tokens.colors.neutral.white.value};\n`;
    css += `  --color-neutral-off-black: ${tokens.colors.neutral['off-black'].value};\n`;
    css += `  --color-neutral-off-white: ${tokens.colors.neutral['off-white'].value};\n`;
    css += '\n';
  }
  
  // Spacing
  if (tokens.spacing) {
    css += '  /* Spacing Scale */\n';
    Object.entries(tokens.spacing.scale).forEach(([key, token]) => {
      css += `  --spacing-${key}: ${token.value};\n`;
    });
    css += '\n';
  }
  
  // Typography
  if (tokens.typography) {
    css += '  /* Font Families */\n';
    css += `  --font-display: ${tokens.typography.families.display.value};\n`;
    css += `  --font-sans: ${tokens.typography.families.sans.value};\n`;
    css += `  --font-mono: ${tokens.typography.families.mono.value};\n`;
    css += '\n';
    
    css += '  /* Font Sizes */\n';
    Object.entries(tokens.typography.sizes).forEach(([key, token]) => {
      css += `  --font-size-${key}: ${token.value};\n`;
    });
    css += '\n';
  }
  
  css += '}\n';
  
  return css;
}

// Example: Generate TypeScript tokens
function generateTypeScript(tokens) {
  let ts = '// Auto-generated from design tokens\n\n';
  ts += 'export const tokens = {\n';
  
  // Colors
  if (tokens.colors) {
    ts += '  colors: {\n';
    ts += '    brand: {\n';
    ts += `      purple: '${tokens.colors.brand.purple.value}',\n`;
    ts += `      purpleLight: '${tokens.colors.brand['purple-light'].value}',\n`;
    ts += `      purpleLighter: '${tokens.colors.brand['purple-lighter'].value}',\n`;
    ts += `      purpleLightest: '${tokens.colors.brand['purple-lightest'].value}',\n`;
    ts += '    },\n';
    ts += '    neutral: {\n';
    ts += `      black: '${tokens.colors.neutral.black.value}',\n`;
    ts += `      white: '${tokens.colors.neutral.white.value}',\n`;
    ts += `      offBlack: '${tokens.colors.neutral['off-black'].value}',\n`;
    ts += `      offWhite: '${tokens.colors.neutral['off-white'].value}',\n`;
    ts += '    },\n';
    ts += '  },\n';
  }
  
  // Spacing
  if (tokens.spacing) {
    ts += '  spacing: {\n';
    Object.entries(tokens.spacing.scale).forEach(([key, token]) => {
      ts += `    '${key}': '${token.value}',\n`;
    });
    ts += '  },\n';
  }
  
  // Typography
  if (tokens.typography) {
    ts += '  typography: {\n';
    ts += '    families: {\n';
    ts += `      display: "${tokens.typography.families.display.value}",\n`;
    ts += `      sans: "${tokens.typography.families.sans.value}",\n`;
    ts += `      mono: "${tokens.typography.families.mono.value}",\n`;
    ts += '    },\n';
    ts += '    sizes: {\n';
    Object.entries(tokens.typography.sizes).forEach(([key, token]) => {
      ts += `      ${key}: '${token.value}',\n`;
    });
    ts += '    },\n';
    ts += '  },\n';
  }
  
  ts += '} as const;\n\n';
  ts += 'export type Tokens = typeof tokens;\n';
  
  return ts;
}

// Example: Generate Tailwind config extension
function generateTailwindConfig(tokens) {
  const config = {
    theme: {
      extend: {
        colors: {},
        spacing: {},
        fontFamily: {},
        fontSize: {},
        animation: {},
        boxShadow: {}
      }
    }
  };
  
  // Add colors
  if (tokens.colors) {
    config.theme.extend.colors = {
      'vergil-purple': tokens.colors.brand.purple.value,
      'vergil-purple-light': tokens.colors.brand['purple-light'].value,
      'vergil-purple-lighter': tokens.colors.brand['purple-lighter'].value,
      'vergil-purple-lightest': tokens.colors.brand['purple-lightest'].value,
      'vergil-off-black': tokens.colors.neutral['off-black'].value,
      'vergil-off-white': tokens.colors.neutral['off-white'].value,
    };
  }
  
  // Add animations
  if (tokens.animations) {
    config.theme.extend.animation = {
      'vergil-breathing': `breathing ${tokens.animations.duration.breathing.value} ease-in-out infinite`,
      'vergil-pulse': `pulse-glow ${tokens.animations.duration.pulse.value} ease-in-out infinite`,
      'vergil-gradient': `gradient-shift ${tokens.animations.duration.gradient.value} linear infinite`,
    };
  }
  
  return `module.exports = ${JSON.stringify(config, null, 2)}`;
}

// Example usage
if (require.main === module) {
  console.log('Loading design tokens...');
  const tokens = loadTokens();
  
  console.log('Generating CSS...');
  const css = generateCSS(tokens);
  console.log(css);
  
  console.log('\nGenerating TypeScript...');
  const ts = generateTypeScript(tokens);
  console.log(ts);
  
  console.log('\nGenerating Tailwind config...');
  const tailwind = generateTailwindConfig(tokens);
  console.log(tailwind);
  
  console.log('\nNote: This is just an example. Use a proper token build tool for production.');
}