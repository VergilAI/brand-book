/**
 * Rule: require-design-tokens
 * Requires import of design tokens when styling properties are used
 * Ensures token imports are available for use
 */

const { getRequiredTokenImport } = require('../utils/token-suggestions');

const STYLING_IMPORTS = [
  'styled-components',
  '@emotion/styled',
  '@emotion/css',
  'stitches',
  'styled-jsx',
];

const STYLING_PROPERTIES = [
  'color', 'backgroundColor', 'borderColor', 'boxShadow',
  'fontSize', 'fontFamily', 'fontWeight', 'lineHeight',
  'margin', 'padding', 'gap', 'width', 'height',
  'borderRadius', 'borderWidth',
];

const TOKEN_IMPORT_PATTERNS = [
  '@/tokens',
  '../tokens',
  './tokens',
  'generated/tokens',
  'design-tokens',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require design token imports when using styling',
      category: 'Design Tokens',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          tokenImportPaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of valid token import paths',
          },
          requiredImports: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of required token imports',
          },
          autoImport: {
            type: 'boolean',
            description: 'Whether to auto-import tokens',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingTokenImport: 'Design tokens should be imported when using styling properties. Add: import { tokens } from "{{importPath}}"',
      missingSpecificTokenImport: 'Missing required token import: {{import}}',
      unusedTokenImport: 'Imported design tokens but not using them. Consider using tokens for styling.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const tokenImportPaths = options.tokenImportPaths || TOKEN_IMPORT_PATTERNS;
    const requiredImports = options.requiredImports || ['tokens'];
    const autoImport = options.autoImport !== false;

    let hasTokenImport = false;
    let hasStyleUsage = false;
    let hasStylingImport = false;
    let importedTokens = new Set();
    let usedTokens = new Set();
    let firstStylingUsage = null;

    return {
      // Track imports
      ImportDeclaration(node) {
        const source = node.source.value;
        
        // Check for design token imports
        if (tokenImportPaths.some(path => source.includes(path) || path.includes(source))) {
          hasTokenImport = true;
          
          // Track specific imported tokens
          node.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier') {
              importedTokens.add(spec.imported.name);
            } else if (spec.type === 'ImportDefaultSpecifier') {
              importedTokens.add('default');
            } else if (spec.type === 'ImportNamespaceSpecifier') {
              importedTokens.add('*');
            }
          });
        }

        // Check for styling library imports
        if (STYLING_IMPORTS.some(lib => source.includes(lib))) {
          hasStylingImport = true;
        }
      },

      // Track token usage
      MemberExpression(node) {
        if (node.object && node.object.name === 'tokens') {
          usedTokens.add(node.property.name || node.property.value);
        }
      },

      // Track styling property usage
      Property(node) {
        const key = node.key.name || node.key.value;
        if (STYLING_PROPERTIES.includes(key)) {
          hasStyleUsage = true;
          if (!firstStylingUsage) {
            firstStylingUsage = node;
          }
        }
      },

      // Track JSX style props
      JSXAttribute(node) {
        if (node.name.name === 'style' || node.name.name === 'className') {
          hasStyleUsage = true;
          if (!firstStylingUsage) {
            firstStylingUsage = node;
          }
        }
      },

      // Track styled-components usage
      TaggedTemplateExpression(node) {
        if (node.tag && (
          (node.tag.name && node.tag.name.startsWith('styled')) ||
          (node.tag.object && node.tag.object.name === 'styled') ||
          (node.tag.callee && node.tag.callee.name === 'styled')
        )) {
          hasStylingImport = true;
          hasStyleUsage = true;
          if (!firstStylingUsage) {
            firstStylingUsage = node;
          }
        }
      },

      // Report at end of file
      'Program:exit'(node) {
        // If using styling but no token import
        if ((hasStyleUsage || hasStylingImport) && !hasTokenImport) {
          const targetNode = firstStylingUsage || node.body[0] || node;
          const preferredImportPath = tokenImportPaths[0] || '@/tokens';
          
          context.report({
            node: targetNode,
            messageId: 'missingTokenImport',
            data: {
              importPath: preferredImportPath,
            },
            fix: autoImport ? (fixer) => {
              // Add import at the top of the file
              const importStatement = `import { tokens } from "${preferredImportPath}";\n`;
              
              // Find the best place to insert the import
              let insertPosition = 0;
              const firstNode = node.body[0];
              
              if (firstNode) {
                // Insert after existing imports
                const lastImportIndex = node.body.findLastIndex(n => n.type === 'ImportDeclaration');
                if (lastImportIndex >= 0) {
                  insertPosition = node.body[lastImportIndex].range[1];
                  return fixer.insertTextAfterRange([insertPosition, insertPosition], `\n${importStatement}`);
                } else {
                  insertPosition = firstNode.range[0];
                  return fixer.insertTextBeforeRange([insertPosition, insertPosition], importStatement);
                }
              }
              
              return fixer.insertTextAfter(node, importStatement);
            } : null,
          });
        }

        // Check for missing specific imports
        if (hasTokenImport) {
          requiredImports.forEach(requiredImport => {
            if (!importedTokens.has(requiredImport) && 
                !importedTokens.has('*') && 
                !importedTokens.has('default')) {
              context.report({
                node: node.body[0] || node,
                messageId: 'missingSpecificTokenImport',
                data: {
                  import: requiredImport,
                },
              });
            }
          });
        }

        // Warn about unused token imports (optional)
        if (hasTokenImport && !hasStyleUsage && usedTokens.size === 0) {
          const firstImport = node.body.find(n => 
            n.type === 'ImportDeclaration' && 
            tokenImportPaths.some(path => n.source.value.includes(path))
          );
          
          if (firstImport) {
            context.report({
              node: firstImport,
              messageId: 'unusedTokenImport',
            });
          }
        }
      },
    };
  },
};