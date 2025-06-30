/**
 * Rule: no-deprecated-tokens
 * Warns about usage of deprecated color tokens and suggests v2 alternatives
 * Helps migration from v1 to v2 color system
 */

// Deprecated tokens mapping to new tokens
const DEPRECATED_TOKENS = {
  // V1 Color system -> V2 replacements
  'cosmic-purple': 'vergil-purple',
  'electric-violet': 'vergil-purple-light',
  'luminous-indigo': 'vergil-purple-lighter',
  'phosphor-cyan': 'vergil-success',
  'synaptic-blue': 'vergil-info',
  'neural-pink': 'vergil-purple-lightest',
  
  // CSS custom properties
  '--cosmic-purple': '--vergil-purple',
  '--electric-violet': '--vergil-purple-light',
  '--luminous-indigo': '--vergil-purple-lighter',
  
  // Token path references
  'colors.legacy.cosmic-purple': 'colors.brand.purple',
  'colors.legacy.electric-violet': 'colors.brand.purple-light',
  'colors.legacy.luminous-indigo': 'colors.brand.purple-lighter',
  'colors.legacy.phosphor-cyan': 'colors.functional.success',
  'colors.legacy.synaptic-blue': 'colors.functional.info',
  'colors.legacy.neural-pink': 'colors.brand.purple-lightest',
  
  // Tailwind classes
  'bg-cosmic-purple': 'bg-vergil-purple',
  'text-cosmic-purple': 'text-vergil-purple',
  'border-cosmic-purple': 'border-vergil-purple',
  'bg-electric-violet': 'bg-vergil-purple-light',
  'text-electric-violet': 'text-vergil-purple-light',
  'border-electric-violet': 'border-vergil-purple-light',
  'bg-luminous-indigo': 'bg-vergil-purple-lighter',
  'text-luminous-indigo': 'text-vergil-purple-lighter',
  'border-luminous-indigo': 'border-vergil-purple-lighter',
};

const DEPRECATED_PATTERNS = [
  // Direct token references
  /\b(cosmic-purple|electric-violet|luminous-indigo|phosphor-cyan|synaptic-blue|neural-pink)\b/g,
  
  // CSS custom properties
  /var\(--(?:cosmic-purple|electric-violet|luminous-indigo|phosphor-cyan|synaptic-blue|neural-pink)\)/g,
  
  // Token path access
  /tokens\.colors\.legacy\.[a-zA-Z-]+/g,
  
  // Tailwind classes with deprecated colors
  /(?:bg|text|border|ring|shadow|from|to|via)-(cosmic-purple|electric-violet|luminous-indigo|phosphor-cyan|synaptic-blue|neural-pink)/g,
];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn about deprecated design tokens',
      category: 'Design Tokens',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          customDeprecated: {
            type: 'object',
            description: 'Custom deprecated token mappings',
          },
          errorOnDeprecated: {
            type: 'boolean',
            description: 'Treat deprecated usage as error instead of warning',
            default: false,
          },
          autoFix: {
            type: 'boolean',
            description: 'Whether to auto-fix deprecated tokens',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      deprecatedToken: 'Token "{{deprecated}}" is deprecated. Use "{{replacement}}" instead.',
      deprecatedTokenNoReplacement: 'Token "{{deprecated}}" is deprecated and should be removed.',
      deprecatedColorSystem: 'Using deprecated v1 color system. Migrate to v2 color tokens.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const customDeprecated = options.customDeprecated || {};
    const errorOnDeprecated = options.errorOnDeprecated || false;
    const autoFix = options.autoFix !== false;

    const allDeprecated = { ...DEPRECATED_TOKENS, ...customDeprecated };

    function checkDeprecatedUsage(node, text) {
      if (typeof text !== 'string') return;

      Object.entries(allDeprecated).forEach(([deprecated, replacement]) => {
        if (text.includes(deprecated)) {
          const messageId = replacement ? 'deprecatedToken' : 'deprecatedTokenNoReplacement';
          const reportData = { deprecated };
          if (replacement) {
            reportData.replacement = replacement;
          }

          context.report({
            node,
            messageId,
            data: reportData,
            fix: autoFix && replacement ? (fixer) => {
              const newText = text.replace(new RegExp(deprecated, 'g'), replacement);
              if (node.type === 'Literal') {
                return fixer.replaceText(node, `"${newText}"`);
              } else if (node.type === 'TemplateElement') {
                return fixer.replaceText(node, newText);
              }
              return null;
            } : null,
          });
        }
      });

      // Check for pattern matches
      DEPRECATED_PATTERNS.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const deprecated = match[0];
          const replacement = allDeprecated[deprecated] || allDeprecated[match[1]];
          
          if (replacement) {
            context.report({
              node,
              messageId: 'deprecatedToken',
              data: { deprecated, replacement },
              fix: autoFix ? (fixer) => {
                const newText = text.replace(deprecated, replacement);
                if (node.type === 'Literal') {
                  return fixer.replaceText(node, `"${newText}"`);
                } else if (node.type === 'TemplateElement') {
                  return fixer.replaceText(node, newText);
                }
                return null;
              } : null,
            });
          }
        }
      });
    }

    return {
      // Check string literals
      Literal(node) {
        if (typeof node.value === 'string') {
          checkDeprecatedUsage(node, node.value);
        }
      },

      // Check template literals
      TemplateElement(node) {
        checkDeprecatedUsage(node, node.value.raw);
      },

      // Check JSX className attributes
      JSXAttribute(node) {
        if (node.name.name === 'className' && node.value) {
          if (node.value.type === 'Literal') {
            checkDeprecatedUsage(node.value, node.value.value);
          } else if (node.value.type === 'JSXExpressionContainer' && 
                     node.value.expression.type === 'Literal') {
            checkDeprecatedUsage(node.value.expression, node.value.expression.value);
          }
        }
      },

      // Check member expressions for token access
      MemberExpression(node) {
        if (node.object && node.object.name === 'tokens' && 
            node.property && node.property.name) {
          const tokenPath = `tokens.${node.property.name}`;
          if (tokenPath.includes('legacy')) {
            context.report({
              node,
              messageId: 'deprecatedColorSystem',
            });
          }
        }

        // Check for nested token access like tokens.colors.legacy.cosmicPurple
        if (node.object && node.object.type === 'MemberExpression') {
          const fullPath = getFullMemberPath(node);
          if (fullPath.includes('legacy') || allDeprecated[fullPath]) {
            const replacement = allDeprecated[fullPath];
            if (replacement) {
              context.report({
                node,
                messageId: 'deprecatedToken',
                data: { deprecated: fullPath, replacement },
              });
            } else {
              context.report({
                node,
                messageId: 'deprecatedColorSystem',
              });
            }
          }
        }
      },

      // Check import statements for deprecated token imports
      ImportSpecifier(node) {
        const importedName = node.imported.name;
        if (allDeprecated[importedName]) {
          context.report({
            node,
            messageId: 'deprecatedToken',
            data: {
              deprecated: importedName,
              replacement: allDeprecated[importedName],
            },
          });
        }
      },
    };

    function getFullMemberPath(node) {
      const parts = [];
      let current = node;
      
      while (current && current.type === 'MemberExpression') {
        if (current.property) {
          parts.unshift(current.property.name || current.property.value);
        }
        current = current.object;
      }
      
      if (current && current.name) {
        parts.unshift(current.name);
      }
      
      return parts.join('.');
    }
  },
};