/**
 * Token Generator Script
 * Generates CSS variables, Tailwind config, TypeScript types, and JSON from design tokens
 */

import * as fs from 'fs';
import * as path from 'path';
import { tokens } from '../tokens';
import * as primitives from '../tokens/primitives';
import * as semantic from '../tokens/semantic';
import * as components from '../tokens/components';

// Ensure output directory exists
const outputDir = path.join(__dirname, '../generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate CSS Variables with new token structure
function generateCSSVariables() {
  let css = '/* Vergil Design System - Generated CSS Variables */\n\n';
  css += ':root {\n';
  
  // Primitive tokens
  css += '  /* === Primitive Tokens === */\n\n';
  
  // Colors
  css += '  /* Colors */\n';
  Object.entries(primitives.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      css += `  --${toKebabCase(key)}: ${value};\n`;
    } else if (typeof value === 'object' && value !== null) {
      // Handle color scales (e.g., purple: { 50: '#...', 100: '#...', ... })
      css += `  /* ${key} scale */\n`;
      Object.entries(value).forEach(([shade, color]) => {
        css += `  --color-${key}-${shade}: ${color};\n`;
      });
    }
  });
  
  // Spacing
  css += '\n  /* Spacing */\n';
  Object.entries(primitives.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });
  
  // Typography
  css += '\n  /* Typography - Font Families */\n';
  Object.entries(primitives.fontFamily).forEach(([key, value]) => {
    css += `  --font-${key}: ${value};\n`;
  });
  
  css += '\n  /* Typography - Font Sizes */\n';
  Object.entries(primitives.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value};\n`;
  });
  
  css += '\n  /* Typography - Font Weights */\n';
  Object.entries(primitives.fontWeight).forEach(([key, value]) => {
    css += `  --font-weight-${key}: ${value};\n`;
  });
  
  css += '\n  /* Typography - Line Heights */\n';
  Object.entries(primitives.lineHeight).forEach(([key, value]) => {
    css += `  --line-height-${key}: ${value};\n`;
  });
  
  css += '\n  /* Typography - Letter Spacing */\n';
  Object.entries(primitives.letterSpacing).forEach(([key, value]) => {
    css += `  --letter-spacing-${key}: ${value};\n`;
  });
  
  // Shadows
  css += '\n  /* Shadows */\n';
  Object.entries(primitives.shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });
  
  // Border Radius
  css += '\n  /* Border Radius */\n';
  Object.entries(primitives.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  
  // Border Width
  css += '\n  /* Border Width */\n';
  Object.entries(primitives.borderWidth).forEach(([key, value]) => {
    css += `  --border-width-${key}: ${value};\n`;
  });
  
  // Durations
  css += '\n  /* Animation Durations */\n';
  Object.entries(primitives.duration).forEach(([key, value]) => {
    css += `  --duration-${key}: ${value};\n`;
  });
  
  // Gradients
  css += '\n  /* Gradients */\n';
  Object.entries(primitives.gradients).forEach(([key, value]) => {
    css += `  --gradient-${toKebabCase(key)}: ${value};\n`;
  });
  
  // Semantic tokens
  css += '\n  /* === Semantic Tokens === */\n\n';
  
  // Text colors
  css += '  /* Text Colors */\n';
  Object.entries(semantic.semanticColors.text).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });
  
  // Background colors
  css += '\n  /* Background Colors */\n';
  Object.entries(semantic.semanticColors.background).forEach(([key, value]) => {
    css += `  --bg-${key}: ${value};\n`;
  });
  
  // Border colors
  css += '\n  /* Border Colors */\n';
  Object.entries(semantic.semanticColors.border).forEach(([key, value]) => {
    css += `  --border-${key}: ${value};\n`;
  });
  
  // Semantic shadows
  css += '\n  /* Semantic Shadows */\n';
  Object.entries(semantic.semanticShadows).forEach(([key, value]) => {
    css += `  --shadow-${toKebabCase(key)}: ${value};\n`;
  });
  
  css += '}\n\n';
  
  // Generate utility classes
  css += '/* === Utility Classes === */\n\n';
  
  // Text color utilities
  css += '/* Text Colors */\n';
  Object.keys(semantic.semanticColors.text).forEach((key) => {
    css += `.text-${key} { color: var(--text-${key}); }\n`;
  });
  
  // Background color utilities
  css += '\n/* Background Colors */\n';
  Object.keys(semantic.semanticColors.background).forEach((key) => {
    css += `.bg-${key} { background-color: var(--bg-${key}); }\n`;
  });
  
  // Border color utilities
  css += '\n/* Border Colors */\n';
  Object.keys(semantic.semanticColors.border).forEach((key) => {
    css += `.border-${key} { border-color: var(--border-${key}); }\n`;
  });
  
  // Shadow utilities
  css += '\n/* Shadows */\n';
  Object.keys(semantic.semanticShadows).forEach((key) => {
    css += `.shadow-${toKebabCase(key)} { box-shadow: var(--shadow-${toKebabCase(key)}); }\n`;
  });
  
  // Component-specific classes
  css += '\n/* === Component Classes === */\n\n';
  
  // Button classes
  css += '/* Buttons */\n';
  Object.entries(components.button.size).forEach(([size, props]) => {
    css += `.btn-${size} {\n`;
    css += `  height: ${props.height};\n`;
    css += `  padding-left: ${props.paddingX};\n`;
    css += `  padding-right: ${props.paddingX};\n`;
    css += `  padding-top: ${props.paddingY};\n`;
    css += `  padding-bottom: ${props.paddingY};\n`;
    css += `  font-size: ${props.fontSize};\n`;
    css += `  border-radius: ${props.borderRadius};\n`;
    css += '}\n';
  });
  
  // Card classes
  css += '\n/* Cards */\n';
  Object.entries(components.card.variant).forEach(([variant, props]) => {
    css += `.card-${variant} {\n`;
    css += `  background: ${props.background};\n`;
    css += `  border: ${props.border};\n`;
    css += `  border-radius: ${props.borderRadius};\n`;
    css += `  box-shadow: ${props.shadow};\n`;
    css += `  padding: ${props.padding};\n`;
    if (props.transition) {
      css += `  transition: ${props.transition};\n`;
    }
    css += '}\n';
  });
  
  fs.writeFileSync(path.join(outputDir, 'tokens.css'), css);
  console.log('✅ Generated CSS variables and utility classes');
}

// Generate Tailwind Config Plugin
function generateTailwindPlugin() {
  const plugin = `// Vergil Design System - Tailwind Plugin
// Generated from design tokens

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addBase, addComponents, addUtilities, theme }) {
  // Add base token variables
  addBase({
    ':root': {
      ${Object.entries(primitives.colors)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `'--${toKebabCase(key)}': '${value}'`;
          } else if (typeof value === 'object' && value !== null) {
            return Object.entries(value)
              .map(([shade, color]) => `'--color-${key}-${shade}': '${color}'`)
              .join(',\n      ');
          }
          return '';
        })
        .filter(Boolean)
        .join(',\n      ')},
      ${Object.entries(primitives.spacing)
        .map(([key, value]) => `'--spacing-${key}': '${value}'`)
        .join(',\n      ')},
      ${Object.entries(primitives.fontSize)
        .map(([key, value]) => `'--font-size-${key}': '${value}'`)
        .join(',\n      ')},
    }
  });

  // Add component styles
  addComponents({
    // Button components
    ${Object.entries(components.button.variant)
      .map(([variant, props]) => `
    '.btn-${variant}': {
      backgroundColor: '${props.background}',
      color: '${props.color}',
      border: '${props.border}',
      fontWeight: '${components.button.fontWeight}',
      transition: '${components.button.transition}',
      cursor: '${components.button.cursor}',
      '&:hover': {
        backgroundColor: '${props.hover?.background || props.background}',
      },
      '&:active': {
        backgroundColor: '${props.pressed?.background || props.background}',
      },
      '&:disabled': {
        backgroundColor: '${props.disabled?.background || props.background}',
        color: '${props.disabled?.color || props.color}',
        cursor: '${components.button.disabledCursor}',
      },
    }`)
      .join(',')},

    // Card components
    ${Object.entries(components.card.variant)
      .map(([variant, props]) => `
    '.card-${variant}': {
      backgroundColor: '${props.background}',
      border: '${props.border}',
      borderRadius: '${props.borderRadius}',
      boxShadow: '${props.shadow}',
      padding: '${props.padding}',
      ${props.transition ? `transition: '${props.transition}',` : ''}
      ${props.hover ? `
      '&:hover': {
        boxShadow: '${props.hover.shadow}',
        transform: '${props.hover.transform}',
      },` : ''}
    }`)
      .join(',')},
  });

  // Add utilities
  addUtilities({
    // Text utilities
    ${Object.entries(semantic.semanticColors.text)
      .map(([key, value]) => `
    '.text-${key}': {
      color: '${value}',
    }`)
      .join(',')},

    // Background utilities
    ${Object.entries(semantic.semanticColors.background)
      .map(([key, value]) => `
    '.bg-${key}': {
      backgroundColor: '${value}',
    }`)
      .join(',')},

    // Border utilities
    ${Object.entries(semantic.semanticColors.border)
      .map(([key, value]) => `
    '.border-${key}': {
      borderColor: '${value}',
    }`)
      .join(',')},

    // Shadow utilities
    ${Object.entries(semantic.semanticShadows)
      .map(([key, value]) => `
    '.shadow-${toKebabCase(key)}': {
      boxShadow: '${value}',
    }`)
      .join(',')},
  });
}, {
  theme: {
    extend: {
      colors: {
        // Primitive colors
        ${Object.entries(primitives.colors)
          .map(([key, value]) => {
            if (typeof value === 'string') {
              return `'${toKebabCase(key)}': '${value}'`;
            } else if (typeof value === 'object' && value !== null) {
              // Handle color scales
              return `'${key}': {
          ${Object.entries(value)
            .map(([shade, color]) => `'${shade}': '${color}'`)
            .join(',\n          ')}
        }`;
            }
            return '';
          })
          .filter(Boolean)
          .join(',\n        ')},
        
        // Semantic text colors
        text: {
          ${Object.entries(semantic.semanticColors.text)
            .map(([key, value]) => `'${key}': '${value}'`)
            .join(',\n          ')},
        },
        
        // Semantic background colors
        bg: {
          ${Object.entries(semantic.semanticColors.background)
            .map(([key, value]) => `'${key}': '${value}'`)
            .join(',\n          ')},
        },
        
        // Semantic border colors
        border: {
          ${Object.entries(semantic.semanticColors.border)
            .map(([key, value]) => `'${key}': '${value}'`)
            .join(',\n          ')},
        },
      },
      
      spacing: {
        ${Object.entries(primitives.spacing)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      fontSize: {
        ${Object.entries(primitives.fontSize)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      fontWeight: {
        ${Object.entries(primitives.fontWeight)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      lineHeight: {
        ${Object.entries(primitives.lineHeight)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      letterSpacing: {
        ${Object.entries(primitives.letterSpacing)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      borderRadius: {
        ${Object.entries(primitives.borderRadius)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      boxShadow: {
        ${Object.entries(primitives.shadows)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
        ${Object.entries(semantic.semanticShadows)
          .map(([key, value]) => `'${toKebabCase(key)}': '${value}'`)
          .join(',\n        ')},
      },
      
      transitionDuration: {
        ${Object.entries(primitives.duration)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      transitionTimingFunction: {
        ${Object.entries(primitives.easing)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      backgroundImage: {
        ${Object.entries(primitives.gradients)
          .map(([key, value]) => `'${toKebabCase(key)}': '${value}'`)
          .join(',\n        ')},
      },
      
      zIndex: {
        ${Object.entries(primitives.zIndex)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
      
      opacity: {
        ${Object.entries(primitives.opacity)
          .map(([key, value]) => `'${key}': '${value}'`)
          .join(',\n        ')},
      },
    },
  },
});
`;

  fs.writeFileSync(path.join(outputDir, '..', 'tailwind-plugin.js'), plugin);
  console.log('✅ Generated Tailwind plugin');
}

// Generate TypeScript types
function generateTypeScriptTypes() {
  let types = `// Vergil Design System - Generated TypeScript Types

// Primitive token types
export interface PrimitiveTokens {
  colors: {
    ${Object.keys(primitives.colors).map(key => `${key}: string;`).join('\n    ')}
  };
  spacing: {
    ${Object.keys(primitives.spacing).map(key => `'${key}': string;`).join('\n    ')}
  };
  fontSize: {
    ${Object.keys(primitives.fontSize).map(key => `'${key}': string;`).join('\n    ')}
  };
  fontWeight: {
    ${Object.keys(primitives.fontWeight).map(key => `${key}: string;`).join('\n    ')}
  };
  lineHeight: {
    ${Object.keys(primitives.lineHeight).map(key => `${key}: string;`).join('\n    ')}
  };
  letterSpacing: {
    ${Object.keys(primitives.letterSpacing).map(key => `${key}: string;`).join('\n    ')}
  };
  borderRadius: {
    ${Object.keys(primitives.borderRadius).map(key => `'${key}': string;`).join('\n    ')}
  };
  shadows: {
    ${Object.keys(primitives.shadows).map(key => `${key}: string;`).join('\n    ')}
  };
  duration: {
    ${Object.keys(primitives.duration).map(key => `${key}: string;`).join('\n    ')}
  };
  easing: {
    ${Object.keys(primitives.easing).map(key => `${key}: string;`).join('\n    ')}
  };
  gradients: {
    ${Object.keys(primitives.gradients).map(key => `${key}: string;`).join('\n    ')}
  };
}

// Semantic token types
export interface SemanticTokens {
  colors: {
    text: {
      ${Object.keys(semantic.semanticColors.text).map(key => `${key}: string;`).join('\n      ')}
    };
    background: {
      ${Object.keys(semantic.semanticColors.background).map(key => `${key}: string;`).join('\n      ')}
    };
    border: {
      ${Object.keys(semantic.semanticColors.border).map(key => `${key}: string;`).join('\n      ')}
    };
  };
  shadows: {
    ${Object.keys(semantic.semanticShadows).map(key => `${key}: string;`).join('\n    ')}
  };
}

// Component token types
export interface ComponentTokens {
  button: {
    size: {
      ${Object.keys(components.button.size).map(key => `${key}: { height: string; paddingX: string; paddingY: string; fontSize: string; borderRadius: string; };`).join('\n      ')}
    };
    variant: {
      ${Object.keys(components.button.variant).map(key => `${key}: object;`).join('\n      ')}
    };
  };
  card: {
    variant: {
      ${Object.keys(components.card.variant).map(key => `${key}: object;`).join('\n      ')}
    };
  };
  input: {
    size: {
      ${Object.keys(components.input.size).map(key => `${key}: object;`).join('\n      ')}
    };
    state: {
      ${Object.keys(components.input.state).map(key => `${key}: object;`).join('\n      ')}
    };
  };
  modal: {
    size: {
      ${Object.keys(components.modal.size).map(key => `${key}: object;`).join('\n      ')}
    };
  };
  toast: {
    variant: {
      ${Object.keys(components.toast.variant).map(key => `${key}: object;`).join('\n      ')}
    };
  };
  badge: {
    size: {
      ${Object.keys(components.badge.size).map(key => `${key}: object;`).join('\n      ')}
    };
    variant: {
      ${Object.keys(components.badge.variant).map(key => `${key}: object;`).join('\n      ')}
    };
  };
}

// All tokens
export interface DesignTokens {
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
  components: ComponentTokens;
}
`;

  fs.writeFileSync(path.join(outputDir, 'tokens.d.ts'), types);
  console.log('✅ Generated TypeScript types');
}

// Generate JSON tokens with new structure
function generateJSON() {
  const tokenData = {
    primitives: {
      colors: primitives.colors,
      spacing: primitives.spacing,
      fontSize: primitives.fontSize,
      fontWeight: primitives.fontWeight,
      lineHeight: primitives.lineHeight,
      letterSpacing: primitives.letterSpacing,
      borderRadius: primitives.borderRadius,
      borderWidth: primitives.borderWidth,
      borderColor: primitives.borderColor,
      shadows: primitives.shadows,
      duration: primitives.duration,
      easing: primitives.easing,
      gradients: primitives.gradients,
      zIndex: primitives.zIndex,
      opacity: primitives.opacity,
    },
    semantic: {
      colors: semantic.semanticColors,
      spacing: semantic.semanticSpacing,
      shadows: semantic.semanticShadows,
      interactiveStates: semantic.interactiveStates,
      animations: semantic.animations,
      layout: semantic.layout,
    },
    components: {
      button: components.button,
      card: components.card,
      input: components.input,
      modal: components.modal,
      navigation: components.navigation,
      toast: components.toast,
      badge: components.badge,
    },
    // Legacy tokens for backwards compatibility
    legacy: tokens,
  };

  fs.writeFileSync(
    path.join(outputDir, 'tokens.json'),
    JSON.stringify(tokenData, null, 2)
  );
  console.log('✅ Generated JSON tokens');
}

// Utility function
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// Run all generators
console.log('🚀 Starting token generation...\n');
generateCSSVariables();
generateTailwindPlugin();
generateTypeScriptTypes();
generateJSON();
console.log('\n✨ All tokens generated successfully!');