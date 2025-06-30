module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  plugins: [],
  rules: {
    // Basic rules for now - custom plugin can be added later
    '@next/next/no-img-element': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Custom token rules (to be implemented when plugin is ready)
    // '@vergil/tokens/no-hardcoded-colors': 'error',
    // '@vergil/tokens/no-hardcoded-spacing': 'error',
    // '@vergil/tokens/no-arbitrary-tailwind': 'error',
    // '@vergil/tokens/require-design-tokens': 'warn',
    // '@vergil/tokens/no-deprecated-tokens': 'warn',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      // More lenient rules for stories and tests
      files: ['**/*.stories.*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        // Custom token rules would be lenient here
      },
    },
    {
      // Configuration files can have more flexibility
      files: [
        '*.config.*',
        'tailwind.config.*',
        'next.config.*',
        'postcss.config.*',
        'scripts/**/*',
        'eslint-rules/**/*',
      ],
      rules: {
        // Disable strict rules for config files
      },
    },
  ],
};