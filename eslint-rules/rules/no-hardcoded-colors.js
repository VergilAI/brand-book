/**
 * Rule: no-hardcoded-colors
 * Prevents the use of hardcoded color values (hex, rgb, hsl, named colors)
 * Suggests using design tokens instead
 */

const { getColorSuggestion } = require('../utils/token-suggestions');

const COLOR_PATTERNS = {
  // Hex colors: #000, #000000, #000000ff
  hex: /#[0-9a-fA-F]{3,8}\b/g,
  // RGB/RGBA: rgb(0,0,0), rgba(0,0,0,1)
  rgb: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/g,
  // HSL/HSLA: hsl(0,0%,0%), hsla(0,0%,0%,1)
  hsl: /hsla?\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+)?\s*\)/g,
  // CSS named colors (common ones)
  named: /\b(?:black|white|red|green|blue|yellow|purple|orange|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold)\b/gi,
};

const ALLOWED_CONTEXTS = [
  'transparent',
  'inherit',
  'initial',
  'unset',
  'currentColor',
  'var(',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded color values',
      category: 'Design Tokens',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowedValues: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of allowed hardcoded color values',
          },
          suggestTokens: {
            type: 'boolean',
            description: 'Whether to suggest design token alternatives',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      hardcodedColor: 'Hardcoded color "{{color}}" found. Use design tokens instead.',
      hardcodedColorWithSuggestion: 'Hardcoded color "{{color}}" found. Consider using token: {{suggestion}}',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedValues = new Set(options.allowedValues || []);
    const suggestTokens = options.suggestTokens !== false;

    function isAllowedValue(value) {
      if (allowedValues.has(value)) return true;
      return ALLOWED_CONTEXTS.some(allowed => value.includes(allowed));
    }

    function checkForHardcodedColors(node, value) {
      if (typeof value !== 'string') return;

      Object.entries(COLOR_PATTERNS).forEach(([type, pattern]) => {
        let match;
        while ((match = pattern.exec(value)) !== null) {
          const color = match[0];
          
          if (isAllowedValue(color)) continue;

          const suggestion = suggestTokens ? getColorSuggestion(color) : null;
          
          context.report({
            node,
            messageId: suggestion ? 'hardcodedColorWithSuggestion' : 'hardcodedColor',
            data: {
              color,
              suggestion,
            },
            fix: suggestion ? (fixer) => {
              // Try to auto-fix with token suggestion
              const newValue = value.replace(color, suggestion);
              return fixer.replaceText(node, `"${newValue}"`);
            } : null,
          });
        }
      });
    }

    return {
      // Check JSX style props
      JSXExpressionContainer(node) {
        if (node.parent && node.parent.name && node.parent.name.name === 'style') {
          if (node.expression.type === 'ObjectExpression') {
            node.expression.properties.forEach(prop => {
              if (prop.value && prop.value.type === 'Literal') {
                checkForHardcodedColors(prop.value, prop.value.value);
              }
            });
          }
        }
      },

      // Check className props for inline styles
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value && node.value.type === 'Literal') {
          const className = node.value.value;
          // Look for arbitrary Tailwind values with colors
          const arbitraryPattern = /\[([^\]]+)\]/g;
          let match;
          while ((match = arbitraryPattern.exec(className)) !== null) {
            checkForHardcodedColors(node.value, match[1]);
          }
        }
      },

      // Check CSS-in-JS style objects
      Property(node) {
        if (node.value && node.value.type === 'Literal') {
          const key = node.key.name || node.key.value;
          const colorProperties = [
            'background', 'backgroundColor', 'bg',
            'color', 'borderColor', 'border',
            'boxShadow', 'textShadow', 'shadow',
            'fill', 'stroke', 'outline', 'caretColor',
          ];
          
          if (key && typeof key === 'string' && colorProperties.some(prop => key.toLowerCase().includes(prop.toLowerCase()))) {
            checkForHardcodedColors(node.value, node.value.value);
          }
        }
      },

      // Check template literals for styled-components
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          checkForHardcodedColors(quasi, quasi.value.raw);
        });
      },

      // Check regular string literals in style contexts
      Literal(node) {
        if (node.parent && node.parent.type === 'CallExpression') {
          const callee = node.parent.callee;
          if (callee && callee.name && callee.name.includes('style')) {
            checkForHardcodedColors(node, node.value);
          }
        }
      },
    };
  },
};