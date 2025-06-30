'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VergilLogo } from '@/components/vergil/vergil-logo'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

/**
 * @component HeroSection
 * @description Modular hero section with Vergil brand variants and layouts
 * 
 * @example
 * // Consciousness variant with split layout
 * <HeroSection 
 *   variant="consciousness" 
 *   layout="split"
 *   title="AI Orchestration Platform"
 *   subtitle="The future of intelligent systems"
 *   primaryCta="Get Started"
 *   secondaryCta="Watch Demo"
 * />
 * 
 * @props
 * - variant: 'default' | 'consciousness' | 'neural' | 'cosmic' - Visual theme
 * - layout: 'centered' | 'split' | 'minimal' - Layout structure  
 * - size: 'sm' | 'md' | 'lg' | 'xl' - Height and spacing
 * - backgroundPattern: boolean - Show background patterns
 * - animated: boolean - Enable breathing animations
 * 
 * @accessibility
 * - Semantic heading structure
 * - Focus management for CTAs
 * - Reduced motion support
 * 
 * @vergil-semantic hero-section-component
 */

const heroVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        consciousness: "bg-gradient-to-br from-background via-muted/30 to-background",
        neural: "bg-deep-space text-pure-light",
        cosmic: "consciousness-gradient",
      },
      layout: {
        centered: "text-center",
        split: "text-left",
        minimal: "text-center",
      },
      size: {
        sm: "py-12 md:py-16",
        md: "py-16 md:py-24", 
        lg: "py-24 md:py-32",
        xl: "py-32 md:py-40 lg:py-48",
      },
    },
    defaultVariants: {
      variant: "consciousness",
      layout: "centered", 
      size: "lg",
    },
  }
)

interface HeroSectionProps extends VariantProps<typeof heroVariants> {
  title: string
  subtitle?: string
  description?: string
  badge?: string
  primaryCta?: string
  primaryCtaHref?: string
  secondaryCta?: string
  secondaryCtaHref?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  backgroundPattern?: boolean
  animated?: boolean
  className?: string
  children?: React.ReactNode
}

export function HeroSection({
  variant,
  layout,
  size,
  title,
  subtitle,
  description,
  badge,
  primaryCta,
  primaryCtaHref = "#",
  secondaryCta,
  secondaryCtaHref = "#",
  onPrimaryClick,
  onSecondaryClick,
  backgroundPattern = true,
  animated = true,
  className,
  children,
  ...props
}: HeroSectionProps) {
  
  const isNeuralVariant = variant === 'neural'
  const isCosmicVariant = variant === 'cosmic'
  const isSplitLayout = layout === 'split'
  
  return (
    <section 
      className={cn(heroVariants({ variant, layout, size }), className)}
      {...props}
    >
      {/* Background Patterns */}
      {backgroundPattern && (
        <div className="absolute inset-0 overflow-hidden">
          {isNeuralVariant && (
            <div className="absolute inset-0 opacity-20">
              {/* Neural pattern removed - use gradient background instead */}
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-electric-violet/10 to-transparent" />
            </div>
          )}
          
          {(variant === 'consciousness' || isCosmicVariant) && (
            <>
              <div className="absolute top-10 right-10 opacity-10">
                {/* Consciousness gradient pattern */}
                <div className="w-96 h-96 rounded-full bg-gradient-to-br from-cosmic-purple/30 to-transparent blur-3xl" />
              </div>
              <div className="absolute bottom-20 left-10 opacity-5">
                {/* Electric gradient pattern */}
                <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-electric-violet/30 to-transparent blur-3xl" />
              </div>
            </>
          )}
          
          {variant === 'default' && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />
          )}
        </div>
      )}

      <div className="container relative z-10">
        <div className={cn(
          "mx-auto",
          isSplitLayout 
            ? "grid gap-8 lg:grid-cols-2 lg:gap-16 items-center" 
            : "max-w-4xl"
        )}>
          
          {/* Content */}
          <div className={cn(
            "space-y-6",
            !isSplitLayout && "text-center"
          )}>
            
            {/* Badge */}
            {badge && (
              <div className={cn(
                "flex",
                !isSplitLayout && "justify-center"
              )}>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "gap-2 px-4 py-2 text-sm font-medium",
                    animated && "animate-breathing"
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  {badge}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1 className={cn(
              "font-bold tracking-tight",
              size === 'xl' ? "text-4xl md:text-6xl lg:text-7xl" :
              size === 'lg' ? "text-3xl md:text-5xl lg:text-6xl" :
              size === 'md' ? "text-2xl md:text-4xl lg:text-5xl" :
              "text-xl md:text-3xl lg:text-4xl"
            )}>
              {title.split(' ').map((word, index) => {
                // Make last word gradient for impact
                const isLastWord = index === title.split(' ').length - 1
                return (
                  <span 
                    key={index}
                    className={isLastWord ? "gradient-text" : ""}
                  >
                    {word}{index < title.split(' ').length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className={cn(
                "font-medium text-muted-foreground",
                size === 'xl' ? "text-xl md:text-2xl" :
                size === 'lg' ? "text-lg md:text-xl" :
                "text-base md:text-lg"
              )}>
                {subtitle}
              </p>
            )}

            {/* Description */}
            {description && (
              <p className={cn(
                "text-muted-foreground leading-relaxed",
                size === 'xl' ? "text-lg md:text-xl max-w-3xl" :
                size === 'lg' ? "text-base md:text-lg max-w-2xl" :
                "text-sm md:text-base max-w-xl",
                !isSplitLayout && "mx-auto"
              )}>
                {description}
              </p>
            )}

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <div className={cn(
                "flex flex-col sm:flex-row gap-4",
                !isSplitLayout && "justify-center"
              )}>
                {primaryCta && (
                  <Button
                    size={size === 'xl' ? 'lg' : 'default'}
                    className={cn(
                      "gap-2 font-semibold",
                      animated && "hover:animate-breathing"
                    )}
                    onClick={onPrimaryClick}
                    asChild={!onPrimaryClick}
                  >
                    {onPrimaryClick ? (
                      <>
                        {primaryCta}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <a href={primaryCtaHref}>
                        {primaryCta}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </Button>
                )}
                
                {secondaryCta && (
                  <Button
                    variant="outline"
                    size={size === 'xl' ? 'lg' : 'default'}
                    className="gap-2"
                    onClick={onSecondaryClick}
                    asChild={!onSecondaryClick}
                  >
                    {onSecondaryClick ? (
                      <>
                        <Play className="h-4 w-4" />
                        {secondaryCta}
                      </>
                    ) : (
                      <a href={secondaryCtaHref}>
                        <Play className="h-4 w-4" />
                        {secondaryCta}
                      </a>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Custom children */}
            {children}
          </div>

          {/* Visual Element for Split Layout */}
          {isSplitLayout && (
            <div className="relative">
              <div className={cn(
                "relative rounded-2xl p-8 shadow-2xl",
                isNeuralVariant ? "bg-muted/10 backdrop-blur-sm" :
                isCosmicVariant ? "bg-background/80 backdrop-blur-sm" :
                "bg-muted/50"
              )}>
                {/* Logo showcase */}
                <div className="flex items-center justify-center h-64">
                  <div className={cn(
                    "p-8 rounded-xl",
                    variant === 'consciousness' && "consciousness-gradient",
                    variant === 'cosmic' && "awakening-gradient", 
                    variant === 'neural' && "synaptic-gradient",
                    variant === 'default' && "bg-muted/20"
                  )}>
                    <VergilLogo 
                      variant="logo" 
                      size="xl" 
                      animated={animated}
                    />
                  </div>
                </div>
                
                {/* Floating elements */}
                {animated && (
                  <>
                    <div className="absolute -top-4 -right-4 animate-breathing">
                      {/* Electric glow effect */}
                      <div className="w-16 h-16 rounded-full bg-electric-violet/30 blur-xl" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 animate-pulse-glow">
                      {/* Synaptic glow effect */}
                      <div className="w-16 h-16 rounded-full bg-synaptic-blue/30 blur-xl" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}