import { create } from 'storybook/internal/theming/create';

export default create({
  base: 'dark',
  
  // Brand colors
  colorPrimary: '#6366F1', // cosmic-purple
  colorSecondary: '#A78BFA', // electric-violet

  // UI
  appBg: '#0F172A', // deep-space
  appContentBg: '#1E293B',
  appBorderColor: '#334155',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#F8FAFC',
  textInverseColor: '#0F172A',
  textMutedColor: '#94A3B8',

  // Toolbar default and active colors
  barTextColor: '#CBD5E1',
  barSelectedColor: '#A78BFA',
  barBg: '#1E293B',

  // Form colors
  inputBg: '#1E293B',
  inputBorder: '#334155',
  inputTextColor: '#F8FAFC',
  inputBorderRadius: 4,

  // Brand
  brandTitle: 'Vergil Design System',
  brandUrl: 'https://vergil.ai',
  brandImage: '/logos/vergil-logo.svg',
  brandTarget: '_self',
});