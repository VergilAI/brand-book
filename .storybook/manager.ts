import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/internal/theming';

// Configure Storybook's UI
addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Vergil Design System',
    brandUrl: '/',
    brandTarget: '_self',
    colorPrimary: '#7B00FF',
    colorSecondary: '#7B00FF',
    
    // UI
    appBg: '#F5F5F7',
    appContentBg: '#FFFFFF',
    appBorderColor: '#E5E5E7',
    appBorderRadius: 8,
    
    // Typography
    fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontCode: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    
    // Text colors
    textColor: '#1D1D1F',
    textInverseColor: '#F5F5F7',
    
    // Toolbar default and active colors
    barTextColor: '#6C6C6D',
    barSelectedColor: '#7B00FF',
    barBg: '#FFFFFF',
    
    // Form colors
    inputBg: '#FFFFFF',
    inputBorder: '#E5E5E7',
    inputTextColor: '#1D1D1F',
    inputBorderRadius: 6,
  },
});

// Custom addons temporarily disabled
// import './addons/version-switcher';
// import './addons/toolbar-version-switcher';