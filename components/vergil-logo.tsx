'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface VergilLogoProps {
  variant?: 'logo' | 'mark' | 'wordmark' | 'inverse' | 'dark' | 'colored'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
  color?: 'brand' | 'primary' | 'secondary' | 'inverse'
}

const sizeConfig = {
  xs: { logo: { width: 60, height: 18 }, mark: { width: 18, height: 18 } },
  sm: { logo: { width: 80, height: 24 }, mark: { width: 24, height: 24 } },
  md: { logo: { width: 120, height: 36 }, mark: { width: 32, height: 32 } },
  lg: { logo: { width: 160, height: 48 }, mark: { width: 48, height: 48 } },
  xl: { logo: { width: 200, height: 60 }, mark: { width: 64, height: 64 } }
}

export function VergilLogo({ 
  variant = 'logo',
  size = 'md',
  animated = false,
  className,
  color = 'primary'
}: VergilLogoProps) {
  const isMarkOnly = variant === 'mark' || variant === 'colored'
  const dimensions = isMarkOnly ? sizeConfig[size].mark : sizeConfig[size].logo
  
  // Logo selection based on variant and color
  const getLogoSrc = () => {
    if (variant === 'inverse') {
      return isMarkOnly ? '/logos/vergil-mark.svg' : '/logos/vergil-logo.svg'
    }
    if (variant === 'dark' || color === 'primary') {
      return isMarkOnly ? '/logos/vergil-mark-black.svg' : '/logos/vergil-logo-black.svg'
    }
    if (variant === 'colored') {
      return '/logos/vergil-mark.svg' // Always use colored mark
    }
    return isMarkOnly ? '/logos/vergil-mark.svg' : '/logos/vergil-logo.svg'
  }

  const getAltText = () => {
    const base = isMarkOnly ? 'Vergil Mark' : 'Vergil Logo'
    if (variant === 'inverse') return `${base} (Inverse)`
    if (variant === 'dark') return `${base} (Dark)`
    if (variant === 'colored') return 'Vergil Mark (Colored)'
    return base
  }

  // Color filter classes using semantic tokens
  const colorClasses = {
    brand: 'brightness-0 saturate-100 [filter:invert(14%)_sepia(94%)_saturate(7496%)_hue-rotate(268deg)_brightness(99%)_contrast(125%)]',
    primary: '', // Default color
    secondary: 'opacity-60',
    inverse: 'brightness-0 invert'
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center transition-all duration-normal",
        animated && "animate-breathing",
        className
      )}
    >
      <Image
        src={getLogoSrc()}
        alt={getAltText()}
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          "max-w-full h-auto transition-all duration-fast",
          variant !== 'colored' && colorClasses[color],
          "select-none"
        )}
        priority={size === 'lg' || size === 'xl'}
        draggable={false}
      />
    </div>
  )
}