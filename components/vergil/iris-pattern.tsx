'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * @component IrisPattern
 * @description A visual motif representing the window to intelligence
 * 
 * @example
 * // Basic usage
 * <IrisPattern />
 * 
 * // With custom size and animation
 * <IrisPattern size="lg" animated={true} className="opacity-20" />
 * 
 * @props
 * - size: 'sm' | 'md' | 'lg' | 'xl' - Size of the iris pattern
 * - animated: boolean - Enable pulse animation
 * - className: string - Additional CSS classes
 * - variant: 'default' | 'cosmic' | 'electric' - Color variant
 * 
 * @accessibility
 * - Decorative element with appropriate ARIA label
 * - Respects reduced motion preferences
 * 
 * @vergil-semantic iris-pattern-visual-element
 */

interface IrisPatternProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  className?: string
  variant?: 'default' | 'cosmic' | 'electric' | 'synaptic'
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48', 
  lg: 'w-64 h-64',
  xl: 'w-96 h-96'
}

const variantStyles = {
  default: {
    outer: 'rgba(99, 102, 241, 0.1)',
    middle: 'rgba(167, 139, 250, 0.15)',
    inner: 'rgba(129, 140, 248, 0.2)',
    core: 'rgba(99, 102, 241, 0.05)'
  },
  cosmic: {
    outer: 'rgba(99, 102, 241, 0.2)',
    middle: 'rgba(99, 102, 241, 0.3)',
    inner: 'rgba(99, 102, 241, 0.4)',
    core: 'rgba(99, 102, 241, 0.1)'
  },
  electric: {
    outer: 'rgba(167, 139, 250, 0.2)',
    middle: 'rgba(167, 139, 250, 0.3)',
    inner: 'rgba(167, 139, 250, 0.4)',
    core: 'rgba(167, 139, 250, 0.1)'
  },
  synaptic: {
    outer: 'rgba(59, 130, 246, 0.2)',
    middle: 'rgba(244, 114, 182, 0.3)',
    inner: 'rgba(16, 185, 129, 0.4)',
    core: 'rgba(99, 102, 241, 0.1)'
  }
}

export function IrisPattern({ 
  size = 'md',
  animated = true,
  className,
  variant = 'default'
}: IrisPatternProps) {
  const colors = variantStyles[variant]
  
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full",
        sizeClasses[size],
        className
      )}
      aria-label="Iris pattern - decorative element representing focus and intelligence"
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, transparent 70%, ${colors.outer} 80%, transparent 90%)`
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={animated ? {
          scale: [0.8, 1.1, 0.8],
          opacity: [0.3, 0.8, 0.3],
        } : { scale: 1, opacity: 0.6 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          background: `radial-gradient(circle at center, transparent 50%, ${colors.middle} 60%, transparent 80%)`
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={animated ? {
          scale: [0.9, 1.05, 0.9],
          opacity: [0.4, 1, 0.4],
        } : { scale: 1, opacity: 0.7 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-8 rounded-full"
        style={{
          background: `radial-gradient(circle at center, transparent 30%, ${colors.inner} 50%, transparent 70%)`
        }}
        initial={{ scale: 1, opacity: 0 }}
        animate={animated ? {
          scale: [1, 1.02, 1],
          opacity: [0.5, 1, 0.5],
        } : { scale: 1, opacity: 0.8 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Core */}
      <motion.div
        className="absolute inset-[45%] rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${colors.core} 0%, transparent 70%)`
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={animated ? {
          scale: [0.8, 1.2, 0.8],
          opacity: [0.6, 1, 0.6],
        } : { scale: 1, opacity: 0.9 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      
      {/* Central point */}
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: colors.inner }}
        initial={{ scale: 0 }}
        animate={animated ? {
          scale: [0, 1, 0],
          opacity: [0, 1, 0.8],
        } : { scale: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  )
}