'use client'

import { cn } from '@/lib/utils'

interface IrisRaysProps {
  variant?: 'default' | 'cosmic' | 'electric' | 'synaptic' | 'awakening'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'moderate' | 'intense'
  animated?: boolean
  className?: string
}

/**
 * IrisRays - Advanced iris-like pattern with radiating light rays
 * 
 * A sophisticated visual component that creates an iris-like pattern using
 * layered CSS gradients and SVG ray overlays. Represents consciousness,
 * intelligence awakening, and the window to deeper understanding.
 * 
 * @param variant - Color scheme variant
 * @param size - Component size
 * @param intensity - Visual intensity level
 * @param animated - Enable breathing animation
 * @param className - Additional CSS classes
 */
export function IrisRays({
  variant = 'default',
  size = 'md',
  intensity = 'moderate',
  animated = true,
  className
}: IrisRaysProps) {
  
  // Size configurations
  const sizeConfig = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48', 
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  }

  // Variant color schemes
  const variantConfig = {
    default: {
      primary: '#6366F1', // cosmic-purple
      secondary: '#A78BFA', // electric-violet
      accent: '#818CF8', // luminous-indigo
      highlight: '#10B981' // phosphor-cyan
    },
    cosmic: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      highlight: '#C084FC'
    },
    electric: {
      primary: '#A78BFA',
      secondary: '#818CF8',
      accent: '#6366F1',
      highlight: '#DDD6FE'
    },
    synaptic: {
      primary: '#F472B6',
      secondary: '#EC4899',
      accent: '#BE185D',
      highlight: '#FDF2F8'
    },
    awakening: {
      primary: '#10B981',
      secondary: '#06B6D4',
      accent: '#3B82F6',
      highlight: '#67E8F9'
    }
  }

  const colors = variantConfig[variant]
  
  // Intensity configurations
  const intensityConfig = {
    subtle: { opacity: 0.6, rayOpacity: 0.3, blur: 2 },
    moderate: { opacity: 0.8, rayOpacity: 0.5, blur: 1 },
    intense: { opacity: 1, rayOpacity: 0.7, blur: 0 }
  }

  const intensitySettings = intensityConfig[intensity]

  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden',
        sizeConfig[size],
        animated && 'animate-pulse-slow',
        className
      )}
    >
      {/* Base iris gradient layers */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 25%, ${colors.highlight}40 0%, transparent 50%),
            radial-gradient(circle at 65% 75%, ${colors.accent}30 0%, transparent 60%), 
            radial-gradient(circle at 50% 50%, ${colors.primary} 0%, ${colors.secondary} 40%, ${colors.accent} 70%, transparent 100%)
          `,
          opacity: intensitySettings.opacity,
          filter: intensitySettings.blur > 0 ? `blur(${intensitySettings.blur}px)` : 'none'
        }}
      />

      {/* SVG ray overlay */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 200"
        style={{ opacity: intensitySettings.rayOpacity }}
      >
        <defs>
          {/* Gradient definitions for rays */}
          <radialGradient id={`ray-gradient-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
            <stop offset="30%" stopColor={colors.secondary} stopOpacity="0.4" />
            <stop offset="60%" stopColor={colors.accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor={colors.highlight} stopOpacity="0" />
          </radialGradient>
          
          {/* Linear gradients for individual rays */}
          <linearGradient id={`ray-linear-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Central light source */}
        <circle
          cx="100"
          cy="100"
          r="20"
          fill={`url(#ray-gradient-${variant})`}
          className={animated ? 'animate-pulse' : ''}
        />

        {/* Radiating light rays */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30) - 90 // Start from top, every 30 degrees
          const length = 80
          const x1 = 100
          const y1 = 100
          const x2 = 100 + Math.cos(angle * Math.PI / 180) * length
          const y2 = 100 + Math.sin(angle * Math.PI / 180) * length
          
          return (
            <g key={i}>
              {/* Main ray */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#ray-linear-${variant})`}
                strokeWidth="2"
                strokeLinecap="round"
                className={animated ? 'animate-pulse-slow' : ''}
                style={{ 
                  animationDelay: animated ? `${i * 0.1}s` : '0s',
                  filter: 'blur(0.5px)'
                }}
              />
              
              {/* Secondary ray (slightly offset) */}
              <line
                x1={x1}
                y1={y1}
                x2={100 + Math.cos((angle + 5) * Math.PI / 180) * (length * 0.7)}
                y2={100 + Math.sin((angle + 5) * Math.PI / 180) * (length * 0.7)}
                stroke={colors.accent}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeLinecap="round"
                className={animated ? 'animate-pulse-slow' : ''}
                style={{ 
                  animationDelay: animated ? `${i * 0.15}s` : '0s'
                }}
              />
            </g>
          )
        })}

        {/* Subtle particle effects */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45
          const radius = 40 + (i % 3) * 10
          const x = 100 + Math.cos(angle * Math.PI / 180) * radius
          const y = 100 + Math.sin(angle * Math.PI / 180) * radius
          
          return (
            <circle
              key={`particle-${i}`}
              cx={x}
              cy={y}
              r={1 + (i % 2)}
              fill={colors.highlight}
              opacity="0.6"
              className={animated ? 'animate-pulse' : ''}
              style={{ 
                animationDelay: animated ? `${i * 0.2}s` : '0s'
              }}
            />
          )
        })}
      </svg>

      {/* Outer rim highlight */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg at 50% 50%,
            ${colors.primary}20 0deg,
            transparent 45deg,
            ${colors.secondary}20 90deg,
            transparent 135deg,
            ${colors.accent}20 180deg,
            transparent 225deg,
            ${colors.highlight}20 270deg,
            transparent 315deg,
            ${colors.primary}20 360deg
          )`,
          opacity: 0.4
        }}
      />

      {/* Breathing animation overlay */}
      {animated && (
        <div 
          className="absolute inset-2 rounded-full animate-iris-pulse"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.primary}10 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}