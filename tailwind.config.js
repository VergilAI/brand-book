/** @type {import('tailwindcss').Config} */
const vergilTokensPlugin = require('./packages/design-system/tailwind-plugin');

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vergil Brand Colors
        'cosmic-purple': '#6366F1',
        'electric-violet': '#A78BFA',
        'luminous-indigo': '#818CF8',
        'phosphor-cyan': '#10B981',
        'synaptic-blue': '#3B82F6',
        'neural-pink': '#F472B6',
        'pure-light': '#FFFFFF',
        'soft-light': '#FAFAFA',
        'whisper-gray': '#F8F9FA',
        'mist-gray': '#E5E7EB',
        'stone-gray': '#9CA3AF',
        'deep-space': '#0F172A',
        
        // Selection & Tool colors
        'selection-purple': 'var(--selection-purple)',
        'selection-primary': 'var(--selection-primary)',
        
        // Gray scale (to replace Tailwind defaults)
        'gray-400': 'var(--gray-400)',
        'gray-500': 'var(--gray-500)',
        'gray-600': 'var(--gray-600)',
        'gray-700': 'var(--gray-700)',
        'gray-800': 'var(--gray-800)',
        'gray-900': 'var(--gray-900)',
        
        // Additional colors found in codebase
        'orange-brand': 'var(--orange-brand)',
        'blue-dark': 'var(--blue-dark)',
        'blue-bright': 'var(--blue-bright)',
        'blue-light': 'var(--blue-light)',
        'blue-gray': 'var(--blue-gray)',
        'blue-medium': 'var(--blue-medium)',
        'cyan-bright': 'var(--cyan-bright)',
        
        // Brand v2 - Monochrome System
        'vergil-purple': 'var(--vergil-purple)',
        'vergil-purple-light': 'var(--vergil-purple-light)',
        'vergil-purple-lighter': 'var(--vergil-purple-lighter)',
        'vergil-purple-lightest': 'var(--vergil-purple-lightest)',
        
        // Apple-Inspired Neutral Palette
        'vergil-full-black': 'var(--vergil-full-black)',
        'vergil-off-black': 'var(--vergil-off-black)',
        'vergil-full-white': 'var(--vergil-full-white)',
        'vergil-off-white': 'var(--vergil-off-white)',
        
        // Subtle Attention Hierarchy
        'vergil-footnote-text': 'var(--vergil-footnote-text)',
        'vergil-emphasis-bg': 'var(--vergil-emphasis-bg)',
        'vergil-emphasis-input-bg': 'var(--vergil-emphasis-input-bg)',
        'vergil-emphasis-text': 'var(--vergil-emphasis-text)',
        'vergil-emphasis-input-text': 'var(--vergil-emphasis-input-text)',
        'vergil-emphasis-button-hover': 'var(--vergil-emphasis-button-hover)',
        
        // Functional Colors v2
        'vergil-success': 'var(--vergil-success)',
        'vergil-error': 'var(--vergil-error)',
        'vergil-warning': 'var(--vergil-warning)',
        'vergil-info': 'var(--vergil-info)',
        
        // Legacy
        'pure-black': 'var(--pure-black)',
        'pure-white': 'var(--pure-white)',
        
        // shadcn/ui theme integration - these use CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        // Display sizes
        'display-xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        
        // Heading sizes
        'h1': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'h2': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '2rem' }],
        'h4': ['1.25rem', { lineHeight: '1.75rem' }],
        
        // Body sizes
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'body-md': ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        
        // Small sizes
        'caption': ['0.75rem', { lineHeight: '1rem' }],
        'overline': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }],
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'breathing': 'breathing 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'synaptic-pulse': 'synaptic-pulse 3s ease-in-out infinite',
        'neural-flow': 'neural-flow 2s linear infinite',
        'iris-pulse': 'iris-pulse 6s ease-in-out infinite',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'synaptic-pulse': {
          '0%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        'neural-flow': {
          '0%': { strokeDashoffset: '100', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0' },
        },
        'iris-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '33%': { transform: 'scale(1.05)', opacity: '0.8' },
          '66%': { transform: 'scale(1.02)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'natural': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      backdropBlur: {
        'neural': '10px',
      },
    },
  },
  plugins: [vergilTokensPlugin, require("tailwindcss-animate")],
}