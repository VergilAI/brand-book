/**
 * Vergil Design System ESLint Rules - Token Enforcement
 * Custom ESLint rules to enforce token-first development
 */

const noHardcodedColors = require('./rules/no-hardcoded-colors');
const noHardcodedSpacing = require('./rules/no-hardcoded-spacing');
const noArbitraryTailwind = require('./rules/no-arbitrary-tailwind');
const requireDesignTokens = require('./rules/require-design-tokens');
const noDeprecatedTokens = require('./rules/no-deprecated-tokens');

module.exports = {
  configs: {
    recommended: {
      plugins: ['@vergil/tokens'],
      rules: {
        '@vergil/tokens/no-hardcoded-colors': 'error',
        '@vergil/tokens/no-hardcoded-spacing': 'error',
        '@vergil/tokens/no-arbitrary-tailwind': 'error',
        '@vergil/tokens/require-design-tokens': 'warn',
        '@vergil/tokens/no-deprecated-tokens': 'warn',
      },
    },
    strict: {
      plugins: ['@vergil/tokens'],
      rules: {
        '@vergil/tokens/no-hardcoded-colors': 'error',
        '@vergil/tokens/no-hardcoded-spacing': 'error',
        '@vergil/tokens/no-arbitrary-tailwind': 'error',
        '@vergil/tokens/require-design-tokens': 'error',
        '@vergil/tokens/no-deprecated-tokens': 'error',
      },
    },
  },
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
    'no-hardcoded-spacing': noHardcodedSpacing,
    'no-arbitrary-tailwind': noArbitraryTailwind,
    'require-design-tokens': requireDesignTokens,
    'no-deprecated-tokens': noDeprecatedTokens,
  },
  processors: {},
};