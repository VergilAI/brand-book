/**
 * Vergil Design System - Animation Tokens
 * Living system animations and transitions
 */

export const animations = {
  // Durations
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
    
    // Living system durations
    breathing: '4000ms',
    pulse: '2000ms',
    float: '6000ms',
  },
  
  // Easings
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom easings
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    snappy: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  // Living animations
  keyframes: {
    breathing: {
      '0%, 100%': { 
        transform: 'scale(1)', 
        opacity: '0.8' 
      },
      '50%': { 
        transform: 'scale(1.03)', 
        opacity: '1' 
      }
    },
    
    pulseGlow: {
      '0%, 100%': { 
        opacity: '0.5' 
      },
      '50%': { 
        opacity: '1' 
      }
    },
    
    gradientShift: {
      '0%, 100%': {
        backgroundPosition: '0% 50%'
      },
      '50%': {
        backgroundPosition: '100% 50%'
      }
    },
    
    synapticPulse: {
      '0%': {
        transform: 'scale(0.8)',
        opacity: '0'
      },
      '50%': {
        transform: 'scale(1.1)',
        opacity: '0.8'
      },
      '100%': {
        transform: 'scale(1)',
        opacity: '0'
      }
    },
    
    float: {
      '0%, 100%': {
        transform: 'translateY(0px)'
      },
      '50%': {
        transform: 'translateY(-10px)'
      }
    },
  },
  
  // Presets
  presets: {
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
      duration: '300ms',
      easing: 'easeOut',
    },
    
    slideUp: {
      from: { 
        opacity: '0',
        transform: 'translateY(10px)' 
      },
      to: { 
        opacity: '1',
        transform: 'translateY(0)' 
      },
      duration: '300ms',
      easing: 'easeOut',
    },
    
    scaleIn: {
      from: { 
        opacity: '0',
        transform: 'scale(0.95)' 
      },
      to: { 
        opacity: '1',
        transform: 'scale(1)' 
      },
      duration: '200ms',
      easing: 'easeOut',
    },
  },
} as const;

// Type exports
export type AnimationDuration = keyof typeof animations.durations;
export type AnimationEasing = keyof typeof animations.easings;
export type AnimationKeyframe = keyof typeof animations.keyframes;
export type AnimationPreset = keyof typeof animations.presets;