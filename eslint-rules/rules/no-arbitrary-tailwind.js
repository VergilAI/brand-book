/**
 * Rule: no-arbitrary-tailwind
 * Prevents the use of arbitrary Tailwind classes using bracket notation
 * Suggests using design tokens or standard Tailwind classes instead
 */

const { getTailwindSuggestion } = require('../utils/token-suggestions');

// Common arbitrary patterns to detect
const ARBITRARY_PATTERNS = {
  // Color patterns: bg-[#000], text-[rgb(0,0,0)]
  color: /(?:bg|text|border|ring|shadow|from|to|via)-\[([^\]]*(?:#[0-9a-fA-F]+|rgb|hsl|color)[^\]]*)\]/g,
  
  // Spacing patterns: p-[10px], m-[1rem]
  spacing: /(?:p|m|gap|w|h|top|right|bottom|left|inset|space)-\[([^\]]*(?:\d+(?:px|rem|em|%))[^\]]*)\]/g,
  
  // Font patterns: text-[14px], leading-[1.5]
  typography: /(?:text|leading|tracking)-\[([^\]]*(?:\d+(?:px|rem|em)|[\d.]+)[^\]]*)\]/g,
  
  // Generic arbitrary pattern
  generic: /([a-z-]+)-\[([^\]]+)\]/g,
};

const ALLOWED_ARBITRARY = [
  // URL patterns
  /url\(/,
  // CSS functions that should be allowed
  /calc\(/,
  /var\(/,
  /min\(/,
  /max\(/,
  /clamp\(/,
  // Complex gradients that don't map to tokens
  /linear-gradient/,
  /radial-gradient/,
  /conic-gradient/,
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow arbitrary Tailwind CSS classes',
      category: 'Design Tokens',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowedPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of allowed arbitrary patterns (regex strings)',
          },
          strictMode: {
            type: 'boolean',
            description: 'Whether to disallow all arbitrary values',
            default: false,
          },
          suggestAlternatives: {
            type: 'boolean',
            description: 'Whether to suggest standard alternatives',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      arbitraryValue: 'Arbitrary Tailwind class "{{class}}" found. Use design tokens or standard classes instead.',
      arbitraryValueWithSuggestion: 'Arbitrary Tailwind class "{{class}}" found. Consider using: {{suggestion}}',
      arbitraryColor: 'Arbitrary color class "{{class}}" with value "{{value}}" found. Use color tokens instead.',
      arbitrarySpacing: 'Arbitrary spacing class "{{class}}" with value "{{value}}" found. Use spacing tokens instead.',
      arbitraryTypography: 'Arbitrary typography class "{{class}}" with value "{{value}}" found. Use typography tokens instead.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedPatterns = (options.allowedPatterns || []).map(p => new RegExp(p));
    const strictMode = options.strictMode || false;
    const suggestAlternatives = options.suggestAlternatives !== false;

    function isAllowedArbitrary(value) {
      return ALLOWED_ARBITRARY.some(pattern => pattern.test(value)) ||
             allowedPatterns.some(pattern => pattern.test(value));
    }

    function checkArbitraryClasses(node, className) {
      if (typeof className !== 'string') return;

      // In strict mode, flag all arbitrary values
      if (strictMode) {
        const genericMatches = [...className.matchAll(ARBITRARY_PATTERNS.generic)];
        genericMatches.forEach(match => {
          const [fullClass, property, value] = match;
          
          if (isAllowedArbitrary(value)) return;

          const suggestion = suggestAlternatives ? getTailwindSuggestion(property, value) : null;
          
          context.report({
            node,
            messageId: suggestion ? 'arbitraryValueWithSuggestion' : 'arbitraryValue',
            data: {
              class: fullClass,
              suggestion,
            },
            fix: suggestion ? (fixer) => {
              return fixer.replaceText(node, `"${className.replace(fullClass, suggestion)}"`);
            } : null,
          });
        });
        return;
      }

      // Check specific patterns
      Object.entries(ARBITRARY_PATTERNS).forEach(([type, pattern]) => {
        if (type === 'generic') return; // Skip generic in non-strict mode

        let match;
        while ((match = pattern.exec(className)) !== null) {
          const [fullClass, value] = match;
          
          if (isAllowedArbitrary(value)) continue;

          const messageId = `arbitrary${type.charAt(0).toUpperCase() + type.slice(1)}`;
          const suggestion = suggestAlternatives ? getTailwindSuggestion(type, value) : null;
          
          context.report({
            node,
            messageId: suggestion ? `${messageId}WithSuggestion` : messageId,
            data: {
              class: fullClass,
              value,
              suggestion,
            },
            fix: suggestion ? (fixer) => {
              return fixer.replaceText(node, `"${className.replace(fullClass, suggestion)}"`);
            } : null,
          });
        }
      });
    }

    return {
      // Check className props
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value) {
          if (node.value.type === 'Literal') {
            checkArbitraryClasses(node.value, node.value.value);
          } else if (node.value.type === 'JSXExpressionContainer') {
            // Handle template literals and expressions
            const expression = node.value.expression;
            if (expression.type === 'TemplateLiteral') {
              expression.quasis.forEach(quasi => {
                checkArbitraryClasses(quasi, quasi.value.raw);
              });
            } else if (expression.type === 'Literal') {
              checkArbitraryClasses(expression, expression.value);
            }
          }
        }
      },

      // Check class attributes in regular HTML/JSX
      Literal(node) {
        // Check if this literal is used in a className context
        if (node.parent && node.parent.type === 'JSXAttribute' && 
            node.parent.name && node.parent.name.name === 'className') {
          checkArbitraryClasses(node, node.value);
        }
      },

      // Check template literals that might contain classes
      TemplateLiteral(node) {
        // Check if this is in a className context
        if (node.parent && node.parent.type === 'JSXExpressionContainer' &&
            node.parent.parent && node.parent.parent.type === 'JSXAttribute' &&
            node.parent.parent.name && node.parent.parent.name.name === 'className') {
          node.quasis.forEach(quasi => {
            checkArbitraryClasses(quasi, quasi.value.raw);
          });
        }

        // Check styled-components or similar CSS-in-JS
        if (node.parent && node.parent.type === 'TaggedTemplateExpression') {
          node.quasis.forEach(quasi => {
            // Look for @apply directives with arbitrary values
            const applyPattern = /@apply\s+([^;]+)/g;
            let match;
            while ((match = applyPattern.exec(quasi.value.raw)) !== null) {
              checkArbitraryClasses(quasi, match[1]);
            }
          });
        }
      },
    };
  },
};