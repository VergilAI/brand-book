const path = require('path');

/** @type {import('@storybook/nextjs').StorybookConfig} */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../packages/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: ["../public"],
  features: {
    previewMdx2: true,
  },
  webpackFinal: async (config) => {
    // Add alias for the local design-system package
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@vergil/design-system': path.resolve(__dirname, '../packages/design-system'),
    };
    
    return config;
  },
};

module.exports = config;