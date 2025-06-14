/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        'cosmic-purple': '#6366F1',
        'electric-violet': '#A78BFA', 
        'luminous-indigo': '#818CF8',
        
        // Accent Colors
        'phosphor-cyan': '#10B981',
        'synaptic-blue': '#3B82F6',
        'neural-pink': '#F472B6',
        
        // Foundation Colors
        'pure-light': '#FFFFFF',
        'soft-light': '#FAFAFA',
        'whisper-gray': '#F8F9FA',
        'mist-gray': '#E5E7EB',
        'stone-gray': '#9CA3AF',
        'deep-space': '#0F172A',
        
        // Legacy aliases for backward compatibility
        'vergil-purple-500': '#6366F1',
        'vergil-violet-500': '#A78BFA',
        'vergil-indigo-500': '#818CF8',
        'vergil-cyan-500': '#10B981',
        'vergil-blue-500': '#3B82F6',
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
}