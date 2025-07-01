import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * @component VergilLogo
 * @description Official Vergil logo component with multiple variants
 * 
 * @example
 * // Basic usage
 * <VergilLogo />
 * 
 * // Different variants
 * <VergilLogo variant="mark" size="lg" animated={true} />
 * 
 * @props
 * - variant: 'logo' | 'mark' | 'wordmark' | 'white' | 'dark' - Logo variation
 * - size: 'sm' | 'md' | 'lg' | 'xl' - Size of the logo
 * - animated: boolean - Enable breathing animation
 * - className: string - Additional CSS classes
 * 
 * @accessibility
 * - Proper alt text for each variant
 * - Respects reduced motion preferences
 * 
 * @vergil-semantic brand-logo-component
 */

interface VergilLogoProps {
  variant?: 'logo' | 'mark' | 'mark-dark' | 'wordmark' | 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
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

export function VergilLogo({ 
  variant = 'logo',
  size = 'md',
  animated = false,
  className 
}: VergilLogoProps) {
  const logoSrc = {
    logo: '/logos/vergil-logo.svg',
    mark: '/logos/vergil-mark.svg',
    'mark-dark': '/logos/vergil-mark-black.svg',
    wordmark: '/logos/vergil-wordmark.svg',
    white: '/logos/vergil-logo-white.svg',
    dark: '/logos/vergil-logo-black.svg'
  }

  const altText = {
    logo: 'Vergil Logo',
    mark: 'Vergil Mark',
    'mark-dark': 'Vergil Mark (Dark)',
    wordmark: 'Vergil Wordmark',
    white: 'Vergil Logo (White)',
    dark: 'Vergil Logo (Dark)'
  }

  const isMarkOnly = variant === 'mark' || variant === 'mark-dark'
  const dimensions = isMarkOnly ? markSizeConfig[size] : sizeConfig[size]

  return (
    <Image
      src={logoSrc[variant]}
      alt={altText[variant]}
      width={dimensions.width}
      height={dimensions.height}
      className={cn(
        "max-w-full h-auto",
        animated && "breathing",
        className
      )}
      priority={variant === 'logo' && size === 'lg'} // Prioritize main logo
    />
  )
}