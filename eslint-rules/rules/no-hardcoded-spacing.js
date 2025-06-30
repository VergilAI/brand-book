/**
 * Rule: no-hardcoded-spacing
 * Prevents the use of hardcoded spacing values (px, rem, em values)
 * Suggests using design tokens instead
 */

const { getSpacingSuggestion } = require('../utils/token-suggestions');

const SPACING_PATTERNS = {
  // Pixel values: 10px, 1.5px
  px: /\b\d+(?:\.\d+)?px\b/g,
  // Rem values: 1rem, 1.5rem
  rem: /\b\d+(?:\.\d+)?rem\b/g,
  // Em values: 1em, 1.5em
  em: /\b\d+(?:\.\d+)?em\b/g,
  // Percentage: 50%, 100%
  percent: /\b\d+(?:\.\d+)?%\b/g,
  // Viewport units: 50vw, 100vh
  viewport: /\b\d+(?:\.\d+)?v[wh]\b/g,
};

const ALLOWED_VALUES = [
  '0', '0px', '0rem', '0em', '0%',
  '100%', '50%', '25%', '75%', // Common percentages
  '100vw', '100vh', '50vw', '50vh', // Common viewport units
  'auto', 'inherit', 'initial', 'unset',
  'var(', 'calc(', 'min(', 'max(', 'clamp(',
];

const SPACING_PROPERTIES = [
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'gap', 'rowGap', 'columnGap',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'top', 'right', 'bottom', 'left',
  'inset', 'insetBlock', 'insetInline',
  'borderRadius', 'borderWidth',
  'fontSize', 'lineHeight', 'letterSpacing',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded spacing values',
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
            description: 'Array of allowed hardcoded spacing values',
          },
          allowedProperties: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of properties to ignore',
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
      hardcodedSpacing: 'Hardcoded spacing "{{value}}" found in {{property}}. Use design tokens instead.',
      hardcodedSpacingWithSuggestion: 'Hardcoded spacing "{{value}}" found in {{property}}. Consider using token: {{suggestion}}',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedValues = new Set([...ALLOWED_VALUES, ...(options.allowedValues || [])]);
    const ignoredProperties = new Set(options.allowedProperties || []);
    const suggestTokens = options.suggestTokens !== false;

    function isAllowedValue(value) {
      if (allowedValues.has(value)) return true;
      return ALLOWED_VALUES.some(allowed => value.includes(allowed));
    }

    function isSpacingProperty(property) {
      if (ignoredProperties.has(property)) return false;
      return SPACING_PROPERTIES.some(prop => 
        property.toLowerCase().includes(prop.toLowerCase())
      );
    }

    function checkForHardcodedSpacing(node, value, property) {
      if (typeof value !== 'string') return;
      if (!isSpacingProperty(property)) return;

      Object.entries(SPACING_PATTERNS).forEach(([type, pattern]) => {
        let match;
        while ((match = pattern.exec(value)) !== null) {
          const spacing = match[0];
          
          if (isAllowedValue(spacing)) continue;

          const suggestion = suggestTokens ? getSpacingSuggestion(spacing) : null;
          
          context.report({
            node,
            messageId: suggestion ? 'hardcodedSpacingWithSuggestion' : 'hardcodedSpacing',
            data: {
              value: spacing,
              property,
              suggestion,
            },
            fix: suggestion ? (fixer) => {
              // Try to auto-fix with token suggestion
              const newValue = value.replace(spacing, suggestion);
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
                const property = prop.key.name || prop.key.value || 'unknown';
                checkForHardcodedSpacing(prop.value, prop.value.value, property);
              }
            });
          }
        }
      },

      // Check className props for arbitrary Tailwind values
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value && node.value.type === 'Literal') {
          const className = node.value.value;
          
          // Look for arbitrary Tailwind values with spacing
          const arbitraryPattern = /([a-z-]+)-\[([^\]]+)\]/g;
          let match;
          while ((match = arbitraryPattern.exec(className)) !== null) {
            const property = match[1];
            const value = match[2];
            checkForHardcodedSpacing(node.value, value, property);
          }

          // Look for specific Tailwind spacing classes
          const spacingClassPattern = /(?:^|\s)((?:m|p|gap|w|h|top|right|bottom|left|inset)-\d+)(?:\s|$)/g;
          while ((match = spacingClassPattern.exec(className)) !== null) {
            const spacingClass = match[1];
            // Allow standard Tailwind spacing scale (these map to tokens)
            if (!/-(0|px|0\.5|1|2|3|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/.test(spacingClass)) {
              context.report({
                node: node.value,
                messageId: 'hardcodedSpacing',
                data: {
                  value: spacingClass,
                  property: 'className',
                },
              });
            }
          }
        }
      },

      // Check CSS-in-JS style objects
      Property(node) {
        if (node.value && node.value.type === 'Literal') {
          const property = node.key.name || node.key.value || 'unknown';
          checkForHardcodedSpacing(node.value, node.value.value, property);
        }
      },

      // Check template literals for styled-components
      TemplateLiteral(node) {
        node.quasis.forEach(quasi => {
          const cssText = quasi.value.raw;
          // Simple CSS property detection
          const cssPropertyPattern = /([a-z-]+)\s*:\s*([^;]+)/g;
          let match;
          while ((match = cssPropertyPattern.exec(cssText)) !== null) {
            const property = match[1];
            const value = match[2].trim();
            checkForHardcodedSpacing(quasi, value, property);
          }
        });
      },
    };
  },
};