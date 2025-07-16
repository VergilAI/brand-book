// Vergil Design System - Tailwind Plugin
// Generated from design tokens

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addBase, addComponents, addUtilities, theme }) {
  // Add base token variables
  addBase({
    ':root': {
      '--color-purple-50': '#F3E6FF',
      '--color-purple-100': '#E6CCFF',
      '--color-purple-200': '#D199FF',
      '--color-purple-300': '#BB66FF',
      '--color-purple-400': '#A64DFF',
      '--color-purple-500': '#9933FF',
      '--color-purple-600': '#7B00FF',
      '--color-purple-700': '#6600CC',
      '--color-purple-800': '#520099',
      '--color-purple-900': '#3D0066',
      '--color-red-50': '#FEF2F2',
      '--color-red-100': '#FEE2E2',
      '--color-red-200': '#FECACA',
      '--color-red-300': '#FCA5A5',
      '--color-red-400': '#F87171',
      '--color-red-500': '#E51C23',
      '--color-red-600': '#DC2626',
      '--color-red-700': '#B91C1C',
      '--color-red-800': '#991B1B',
      '--color-red-900': '#7F1D1D',
      '--color-yellow-50': '#FFFEF0',
      '--color-yellow-100': '#FFFDE0',
      '--color-yellow-200': '#FFFAB8',
      '--color-yellow-300': '#FFF490',
      '--color-yellow-400': '#FFEB3B',
      '--color-yellow-500': '#FFC700',
      '--color-yellow-600': '#FFB300',
      '--color-yellow-700': '#FF8F00',
      '--color-yellow-800': '#FF6F00',
      '--color-yellow-900': '#E65100',
      '--color-green-50': '#F0FDF4',
      '--color-green-100': '#DCFCE7',
      '--color-green-200': '#BBF7D0',
      '--color-green-300': '#86EFAC',
      '--color-green-400': '#4ADE80',
      '--color-green-500': '#22C55E',
      '--color-green-600': '#0F8A0F',
      '--color-green-700': '#15803D',
      '--color-green-800': '#166534',
      '--color-green-900': '#14532D',
      '--color-blue-50': '#EFF6FF',
      '--color-blue-100': '#DBEAFE',
      '--color-blue-200': '#BFDBFE',
      '--color-blue-300': '#93C5FD',
      '--color-blue-400': '#60A5FA',
      '--color-blue-500': '#3B82F6',
      '--color-blue-600': '#0087FF',
      '--color-blue-700': '#1D4ED8',
      '--color-blue-800': '#1E40AF',
      '--color-blue-900': '#1E3A8A',
      '--color-gray-25': '#FAFAFC',
      '--color-gray-50': '#F5F5F7',
      '--color-gray-100': '#F0F0F2',
      '--color-gray-150': '#E5E5E7',
      '--color-gray-200': '#D4D4D8',
      '--color-gray-300': '#A3A3A8',
      '--color-gray-400': '#71717A',
      '--color-gray-450': '#6C6C6D',
      '--color-gray-500': '#52525B',
      '--color-gray-600': '#3F3F46',
      '--color-gray-700': '#323232',
      '--color-gray-750': '#303030',
      '--color-gray-800': '#272729',
      '--color-gray-850': '#1D1D1F',
      '--color-gray-900': '#18181B',
      '--color-gray-950': '#000000',
      '--white': '#FFFFFF',
      '--black': '#000000',
      '--transparent': 'transparent',
      '--current': 'currentColor',
      '--vergil-purple': '#A64DFF',
      '--vergil-off-black': '#1D1D1F',
      '--vergil-off-white': '#F5F5F7',
      '--cosmic-purple': '#6366F1',
      '--electric-violet': '#A78BFA',
      '--luminous-indigo': '#818CF8',
      '--phosphor-cyan': '#10B981',
      '--synaptic-blue': '#3B82F6',
      '--neural-pink': '#F472B6',
      '--spacing-xs': '4px',
      '--spacing-sm': '8px',
      '--spacing-md': '16px',
      '--spacing-lg': '24px',
      '--spacing-xl': '32px',
      '--spacing-2xl': '48px',
      '--spacing-3xl': '64px',
      '--font-size-xs': '12px',
      '--font-size-sm': '14px',
      '--font-size-base': '16px',
      '--font-size-lg': '20px',
      '--font-size-xl': '24px',
      '--font-size-2xl': '30px',
      '--font-size-3xl': '36px',
      '--font-size-4xl': '48px',
      '--font-size-5xl': '60px',
    }
  });

  // Add component styles
  addComponents({
    // Button components
    
    '.btn-primary': {
      backgroundColor: '#A64DFF',
      color: '#F5F5F7',
      border: 'none',
      fontWeight: '500',
      transition: 'all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#9933FF',
      },
      '&:active': {
        backgroundColor: '#6600CC',
      },
      '&:disabled': {
        backgroundColor: '#A3A3A8',
        color: '#A3A3A8',
        cursor: 'not-allowed',
      },
    },
    '.btn-secondary': {
      backgroundColor: '#1D1D1F',
      color: '#1D1D1F',
      border: '1px solid rgba(0,0,0,0.1)',
      fontWeight: '500',
      transition: 'all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#272729',
      },
      '&:active': {
        backgroundColor: '#18181B',
      },
      '&:disabled': {
        backgroundColor: '#A3A3A8',
        color: '#A3A3A8',
        cursor: 'not-allowed',
      },
    },
    '.btn-ghost': {
      backgroundColor: 'transparent',
      color: '#1D1D1F',
      border: 'none',
      fontWeight: '500',
      transition: 'all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#272729',
      },
      '&:active': {
        backgroundColor: '#18181B',
      },
      '&:disabled': {
        backgroundColor: 'transparent',
        color: '#A3A3A8',
        cursor: 'not-allowed',
      },
    },
    '.btn-destructive': {
      backgroundColor: '#E51C23',
      color: '#F5F5F7',
      border: 'none',
      fontWeight: '500',
      transition: 'all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#DC2626',
      },
      '&:active': {
        backgroundColor: '#B91C1C',
      },
      '&:disabled': {
        backgroundColor: '#A3A3A8',
        color: '#A3A3A8',
        cursor: 'not-allowed',
      },
    },
    '.btn-success': {
      backgroundColor: '#0F8A0F',
      color: '#F5F5F7',
      border: 'none',
      fontWeight: '500',
      transition: 'all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#15803D',
      },
      '&:active': {
        backgroundColor: '#166534',
      },
      '&:disabled': {
        backgroundColor: '#A3A3A8',
        color: '#A3A3A8',
        cursor: 'not-allowed',
      },
    },

    // Card components
    
    '.card-default': {
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      padding: '16px',
      
      
    },
    '.card-interactive': {
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      padding: '16px',
      transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      
      '&:hover': {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        transform: 'translateY(-2px)',
      },
    },
    '.card-neural': {
      backgroundColor: 'linear-gradient(135deg, rgba(123, 0, 255, 0.05) 0%, rgba(153, 51, 255, 0.05) 100%)',
      border: '1px solid rgba(166, 77, 255, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(166, 77, 255, 0.1)',
      padding: '24px',
      
      
    },
    '.card-outlined': {
      backgroundColor: 'transparent',
      border: '2px solid rgba(0,0,0,0.1)',
      borderRadius: '8px',
      boxShadow: 'none',
      padding: '16px',
      
      
    },
  });

  // Add utilities
  addUtilities({
    // Text utilities
    
    '.text-primary': {
      color: '#1D1D1F',
    },
    '.text-secondary': {
      color: '#6C6C6D',
    },
    '.text-tertiary': {
      color: '#71717A',
    },
    '.text-emphasis': {
      color: '#303030',
    },
    '.text-inverse': {
      color: '#F5F5F7',
    },
    '.text-brand': {
      color: '#A64DFF',
    },
    '.text-brandLight': {
      color: '#9933FF',
    },
    '.text-success': {
      color: '#0F8A0F',
    },
    '.text-warning': {
      color: '#FFC700',
    },
    '.text-error': {
      color: '#E51C23',
    },
    '.text-info': {
      color: '#0087FF',
    },
    '.text-disabled': {
      color: '#A3A3A8',
    },

    // Background utilities
    
    '.bg-primary': {
      backgroundColor: '#FFFFFF',
    },
    '.bg-secondary': {
      backgroundColor: '#F5F5F7',
    },
    '.bg-emphasis': {
      backgroundColor: '#F0F0F2',
    },
    '.bg-emphasisInput': {
      backgroundColor: '#FAFAFC',
    },
    '.bg-inverse': {
      backgroundColor: '#000000',
    },
    '.bg-brand': {
      backgroundColor: '#A64DFF',
    },
    '.bg-brandLight': {
      backgroundColor: '#F3E6FF',
    },
    '.bg-elevated': {
      backgroundColor: '#FFFFFF',
    },
    '.bg-overlay': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    '.bg-disabled': {
      backgroundColor: '#F0F0F2',
    },
    '.bg-errorLight': {
      backgroundColor: '#FEF2F2',
    },
    '.bg-warningLight': {
      backgroundColor: '#FFFEF0',
    },
    '.bg-successLight': {
      backgroundColor: '#F0FDF4',
    },
    '.bg-infoLight': {
      backgroundColor: '#EFF6FF',
    },

    // Border utilities
    
    '.border-default': {
      borderColor: 'rgba(0,0,0,0.1)',
    },
    '.border-subtle': {
      borderColor: 'rgba(0,0,0,0.05)',
    },
    '.border-emphasis': {
      borderColor: 'rgba(166, 77, 255, 0.1)',
    },
    '.border-focus': {
      borderColor: '#007AFF',
    },
    '.border-brand': {
      borderColor: '#A64DFF',
    },
    '.border-error': {
      borderColor: '#FCA5A5',
    },
    '.border-warning': {
      borderColor: '#FFF490',
    },
    '.border-success': {
      borderColor: '#86EFAC',
    },
    '.border-info': {
      borderColor: '#93C5FD',
    },
    '.border-disabled': {
      borderColor: '#D4D4D8',
    },

    // Shadow utilities
    
    '.shadow-card': {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    },
    '.shadow-card-hover': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    '.shadow-dropdown': {
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    '.shadow-modal': {
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },
    '.shadow-popover': {
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    },
    '.shadow-toast': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    '.shadow-brand-sm': {
      boxShadow: '0 2px 4px rgba(166, 77, 255, 0.1)',
    },
    '.shadow-brand-md': {
      boxShadow: '0 4px 8px rgba(166, 77, 255, 0.12)',
    },
    '.shadow-brand-lg': {
      boxShadow: '0 8px 16px rgba(166, 77, 255, 0.16)',
    },
    '.shadow-brand-glow': {
      boxShadow: '0 0 24px rgba(166, 77, 255, 0.4)',
    },
    '.shadow-focus': {
      boxShadow: '0 0 0 3px rgba(166, 77, 255, 0.2)',
    },
    '.shadow-focus-error': {
      boxShadow: '0 0 0 3px rgba(229, 28, 35, 0.2)',
    },
    '.shadow-focus-success': {
      boxShadow: '0 0 0 3px rgba(15, 138, 15, 0.2)',
    },

    // Animation duration utilities (custom to avoid conflicts)
    
    '.animate-duration-instant': {
      animationDuration: '0ms',
    },
    '.transition-duration-instant': {
      transitionDuration: '0ms',
    },
    '.animate-duration-fast': {
      animationDuration: '100ms',
    },
    '.transition-duration-fast': {
      transitionDuration: '100ms',
    },
    '.animate-duration-normal': {
      animationDuration: '200ms',
    },
    '.transition-duration-normal': {
      transitionDuration: '200ms',
    },
    '.animate-duration-slow': {
      animationDuration: '300ms',
    },
    '.transition-duration-slow': {
      transitionDuration: '300ms',
    },
    '.animate-duration-slower': {
      animationDuration: '400ms',
    },
    '.transition-duration-slower': {
      transitionDuration: '400ms',
    },
    '.animate-duration-slowest': {
      animationDuration: '500ms',
    },
    '.transition-duration-slowest': {
      transitionDuration: '500ms',
    },

    // Animation timing utilities (custom to avoid conflicts)
    
    '.animate-timing-out': {
      animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    '.transition-timing-out': {
      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    '.animate-timing-inOut': {
      animationTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
    },
    '.transition-timing-inOut': {
      transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
    },
    '.animate-timing-outBack': {
      animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    '.transition-timing-outBack': {
      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    '.animate-timing-outQuart': {
      animationTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    '.transition-timing-outQuart': {
      transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    '.animate-timing-natural': {
      animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    '.transition-timing-natural': {
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    '.animate-timing-linear': {
      animationTimingFunction: 'linear',
    },
    '.transition-timing-linear': {
      transitionTimingFunction: 'linear',
    },
  });
}, {
  theme: {
    extend: {
      colors: {
        // Primitive colors
        'purple': {
          '50': '#F3E6FF',
          '100': '#E6CCFF',
          '200': '#D199FF',
          '300': '#BB66FF',
          '400': '#A64DFF',
          '500': '#9933FF',
          '600': '#7B00FF',
          '700': '#6600CC',
          '800': '#520099',
          '900': '#3D0066'
        },
        'red': {
          '50': '#FEF2F2',
          '100': '#FEE2E2',
          '200': '#FECACA',
          '300': '#FCA5A5',
          '400': '#F87171',
          '500': '#E51C23',
          '600': '#DC2626',
          '700': '#B91C1C',
          '800': '#991B1B',
          '900': '#7F1D1D'
        },
        'yellow': {
          '50': '#FFFEF0',
          '100': '#FFFDE0',
          '200': '#FFFAB8',
          '300': '#FFF490',
          '400': '#FFEB3B',
          '500': '#FFC700',
          '600': '#FFB300',
          '700': '#FF8F00',
          '800': '#FF6F00',
          '900': '#E65100'
        },
        'green': {
          '50': '#F0FDF4',
          '100': '#DCFCE7',
          '200': '#BBF7D0',
          '300': '#86EFAC',
          '400': '#4ADE80',
          '500': '#22C55E',
          '600': '#0F8A0F',
          '700': '#15803D',
          '800': '#166534',
          '900': '#14532D'
        },
        'blue': {
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3B82F6',
          '600': '#0087FF',
          '700': '#1D4ED8',
          '800': '#1E40AF',
          '900': '#1E3A8A'
        },
        'gray': {
          '25': '#FAFAFC',
          '50': '#F5F5F7',
          '100': '#F0F0F2',
          '150': '#E5E5E7',
          '200': '#D4D4D8',
          '300': '#A3A3A8',
          '400': '#71717A',
          '450': '#6C6C6D',
          '500': '#52525B',
          '600': '#3F3F46',
          '700': '#323232',
          '750': '#303030',
          '800': '#272729',
          '850': '#1D1D1F',
          '900': '#18181B',
          '950': '#000000'
        },
        'white': '#FFFFFF',
        'black': '#000000',
        'transparent': 'transparent',
        'current': 'currentColor',
        'vergil-purple': '#A64DFF',
        'vergil-off-black': '#1D1D1F',
        'vergil-off-white': '#F5F5F7',
        'cosmic-purple': '#6366F1',
        'electric-violet': '#A78BFA',
        'luminous-indigo': '#818CF8',
        'phosphor-cyan': '#10B981',
        'synaptic-blue': '#3B82F6',
        'neural-pink': '#F472B6',
        
        // Semantic text colors
        text: {
          'primary': '#1D1D1F',
          'secondary': '#6C6C6D',
          'tertiary': '#71717A',
          'emphasis': '#303030',
          'inverse': '#F5F5F7',
          'brand': '#A64DFF',
          'brandLight': '#9933FF',
          'success': '#0F8A0F',
          'warning': '#FFC700',
          'error': '#E51C23',
          'info': '#0087FF',
          'disabled': '#A3A3A8',
        },
        
        // Semantic background colors
        bg: {
          'primary': '#FFFFFF',
          'secondary': '#F5F5F7',
          'emphasis': '#F0F0F2',
          'emphasisInput': '#FAFAFC',
          'inverse': '#000000',
          'brand': '#A64DFF',
          'brandLight': '#F3E6FF',
          'elevated': '#FFFFFF',
          'overlay': 'rgba(0, 0, 0, 0.5)',
          'disabled': '#F0F0F2',
          'errorLight': '#FEF2F2',
          'warningLight': '#FFFEF0',
          'successLight': '#F0FDF4',
          'infoLight': '#EFF6FF',
        },
        
        // Semantic border colors
        border: {
          'default': 'rgba(0,0,0,0.1)',
          'subtle': 'rgba(0,0,0,0.05)',
          'emphasis': 'rgba(166, 77, 255, 0.1)',
          'focus': '#007AFF',
          'brand': '#A64DFF',
          'error': '#FCA5A5',
          'warning': '#FFF490',
          'success': '#86EFAC',
          'info': '#93C5FD',
          'disabled': '#D4D4D8',
        },
      },
      
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        'spacing-xs': '4px',
        'spacing-sm': '8px',
        'spacing-md': '16px',
        'spacing-lg': '24px',
        'spacing-xl': '32px',
        'spacing-2xl': '48px',
        'spacing-3xl': '64px',
      },
      
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '30px',
        '3xl': '36px',
        '4xl': '48px',
        '5xl': '60px',
      },
      
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      
      lineHeight: {
        'tight': '1.25',
        'normal': '1.5',
        'relaxed': '1.625',
      },
      
      letterSpacing: {
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
      },
      
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '50%',
      },
      
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'brandSm': '0 2px 4px rgba(166, 77, 255, 0.1)',
        'brandMd': '0 4px 8px rgba(166, 77, 255, 0.12)',
        'brandLg': '0 8px 16px rgba(166, 77, 255, 0.16)',
        'brandGlow': '0 0 24px rgba(166, 77, 255, 0.4)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'dropdown': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'popover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'toast': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'brand-sm': '0 2px 4px rgba(166, 77, 255, 0.1)',
        'brand-md': '0 4px 8px rgba(166, 77, 255, 0.12)',
        'brand-lg': '0 8px 16px rgba(166, 77, 255, 0.16)',
        'brand-glow': '0 0 24px rgba(166, 77, 255, 0.4)',
        'focus': '0 0 0 3px rgba(166, 77, 255, 0.2)',
        'focus-error': '0 0 0 3px rgba(229, 28, 35, 0.2)',
        'focus-success': '0 0 0 3px rgba(15, 138, 15, 0.2)',
      },
      
      backgroundImage: {
        'consciousness': 'linear-gradient(135deg, #A64DFF 0%, #BB66FF 50%, #D199FF 100%)',
        'ambient': 'radial-gradient(circle at center, rgba(166, 77, 255, 0.1) 0%, transparent 70%)',
        'awakening': 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
        'synaptic': 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
        'light-ray': 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
      },
      
      zIndex: {
        'base': '0',
        'dropdown': '1000',
        'sticky': '1100',
        'overlay': '1200',
        'modal': '1300',
        'popover': '1400',
        'toast': '1500',
        'tooltip': '1600',
      },
      
      opacity: {
        'disabled': '0.4',
        'hover': '0.05',
        'pressed': '0.1',
        'backdrop': '0.5',
        'loading': '0.6',
      },
    },
  },
});
