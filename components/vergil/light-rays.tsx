'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface LightRaysProps {
  className?: string
  rayCount?: number
  rayStartDistance?: number
  colorVariant?: 'apple' | 'consciousness'
}

/**
 * LightRays - Iris-like pattern with radial rays emanating from center
 * 
 * Creates an iris-like pattern with:
 * - Circular radial gradient from black through blue to cyan/white
 * - Individual rays emanating outward from center
 * - Semi-randomized ray positioning and intensity
 * - Organic, iris-like appearance
 */
export function LightRays({ 
  className,
  rayCount = 24,
  rayStartDistance = 8,
  colorVariant = 'apple'
}: LightRaysProps) {
  
  // Memoize ray generation to prevent recalculation on every render
  const rays = useMemo(() => {
    // Use a fixed seed approach for consistent randomization
    const generateDeterministicRandom = (seed: number) => {
      let value = Math.sin(seed) * 10000
      return value - Math.floor(value)
    }
    
    return Array.from({ length: rayCount }, (_, i) => {
      const baseAngle = (i * (360 / rayCount)) // Even spacing based on ray count
      const randomOffset = (generateDeterministicRandom(i * 7.3) - 0.5) * 8 // Deterministic offset
      const angle = baseAngle + randomOffset
      
      return {
        angle,
        opacity: 0.2 + generateDeterministicRandom(i * 3.7) * 0.6, // Deterministic opacity 0.2-0.8
        width: 0.8 + generateDeterministicRandom(i * 5.1) * 2.2, // Deterministic width 0.8-3px
        length: 60 + generateDeterministicRandom(i * 2.9) * 30, // Deterministic length variation (SVG units)
        intensity: generateDeterministicRandom(i * 4.3) * 0.5 + 0.3 // Deterministic intensity
      }
    })
  }, [rayCount])

  // Color palettes
  const colorPalettes = {
    apple: [
      '#FF6B6B', // Apple red
      '#4ECDC4', // Aqua blue
      '#45B7D1', // Sky blue
      '#96CEB4', // Mint green
      '#FFEAA7', // Soft yellow
      '#DDA0DD', // Plum
      '#F39C12', // Orange
      '#E74C3C', // Deep red
      '#9B59B6', // Purple
      '#1ABC9C', // Teal
      '#3498DB', // Blue
      '#E67E22'  // Burnt orange
    ],
    consciousness: [
      '#6366F1', // cosmic-purple
      '#8B5CF6', // violet
      '#A78BFA', // electric-violet
      '#C084FC', // light violet
      '#DDD6FE', // very light violet
      '#818CF8', // luminous-indigo
      '#6366F1', // cosmic-purple (repeat for variation)
      '#8B5CF6'  // violet (repeat for variation)
    ]
  }

  const currentColors = colorPalettes[colorVariant]

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-white", className)}>

      {/* Organic CSS-based rays with selected color palette */}
      {rays.map((ray, index) => {
        const colorIndex = index % currentColors.length
        const rayColor = currentColors[colorIndex]
        
        return (
          <div
            key={index}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `conic-gradient(from ${ray.angle}deg at center,
                transparent 0deg,
                ${rayColor}${Math.round(ray.opacity * 0.9 * 255).toString(16).padStart(2, '0')} ${ray.width * 0.3}deg,
                ${rayColor}${Math.round(ray.opacity * 0.7 * 255).toString(16).padStart(2, '0')} ${ray.width * 0.6}deg,
                ${rayColor}${Math.round(ray.opacity * 0.5 * 255).toString(16).padStart(2, '0')} ${ray.width}deg,
                transparent ${ray.width * 1.2}deg,
                transparent 360deg
              )`,
              filter: 'blur(0.8px)',
              maskImage: `radial-gradient(circle at center, 
                transparent ${rayStartDistance}%, 
                black ${rayStartDistance + 7}%, 
                black ${ray.length}%, 
                transparent ${ray.length + 15}%
              )`,
              mixBlendMode: 'multiply'
            }}
          />
        )
      })}
    </div>
  )
}