'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * @component DynamicLogo
 * @description Vergil logo with dynamic color and animation effects
 * 
 * @example
 * // Colored logo
 * <DynamicLogo colorScheme="cosmic-purple" animated="pulse" />
 * 
 * // Gradient logo
 * <DynamicLogo gradient="consciousness" animated="rotate" />
 * 
 * @props
 * - variant: 'logo' | 'mark' | 'wordmark' - Logo variation
 * - size: 'sm' | 'md' | 'lg' | 'xl' - Size of the logo
 * - colorScheme: 'cosmic-purple' | 'electric-violet' | 'phosphor-cyan' | 'white' - Color filter
 * - gradient: 'consciousness' | 'awakening' | 'synaptic' - Gradient overlay
 * - animated: 'breathing' | 'pulse' | 'rotate' | 'glow' | false - Animation type
 * - className: string - Additional CSS classes
 * 
 * @vergil-semantic dynamic-brand-logo-component
 */

interface DynamicLogoProps {
  variant?: 'logo' | 'mark' | 'wordmark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  colorScheme?: 'cosmic-purple' | 'electric-violet' | 'phosphor-cyan' | 'white'
  gradient?: 'consciousness' | 'awakening' | 'synaptic' | false
  animated?: 'breathing' | 'pulse' | 'rotate' | 'glow' | false
  className?: string
}

const sizeConfig = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 200, height: 60 },
  xl: { width: 300, height: 90 }
}

const markSizeConfig = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 }
}

const colorFilters = {
  'cosmic-purple': 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(235deg)',
  'electric-violet': 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(260deg)',
  'phosphor-cyan': 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(140deg)',
  'white': 'none'
}

const animationClasses = {
  breathing: 'breathing',
  pulse: 'animate-pulse',
  rotate: 'animate-spin',
  glow: 'animate-pulse drop-shadow-lg'
}

export function DynamicLogo({ 
  variant = 'logo',
  size = 'md',
  colorScheme = 'white',
  gradient = false,
  animated = false,
  className 
}: DynamicLogoProps) {
  const logoSrc = {
    logo: '/logos/vergil-logo.svg',
    mark: '/logos/vergil-mark.svg',
    wordmark: '/logos/vergil-wordmark.svg'
  }

  const isMarkOnly = variant === 'mark'
  const dimensions = isMarkOnly ? markSizeConfig[size] : sizeConfig[size]
  
  const logoElement = (
    <Image
      src={logoSrc[variant]}
      alt={`Vergil ${variant}`}
      width={dimensions.width}
      height={dimensions.height}
      className={cn(
        "max-w-full h-auto",
        animated && animationClasses[animated],
        className
      )}
      style={{
        filter: colorFilters[colorScheme],
        animationDuration: animated === 'rotate' ? '4s' : undefined
      }}
    />
  )

  if (gradient) {
    const gradientClasses = {
      consciousness: 'consciousness-gradient',
      awakening: 'awakening-gradient',
      synaptic: 'synaptic-gradient'
    }

    return (
      <div className={cn(
        "relative inline-block rounded-lg overflow-hidden",
        gradientClasses[gradient]
      )}>
        <div className="p-4">
          {logoElement}
        </div>
      </div>
    )
  }

  return logoElement
}