"use client"

import { useCallback, useRef, useEffect } from 'react'

interface InertiaOptions {
  friction?: number // 0-1, higher = more friction, stops faster
  minVelocity?: number // Minimum velocity before stopping
  onUpdate: (deltaX: number, deltaY: number) => void
  onComplete?: () => void
}

export function useInertiaScroll(options: InertiaOptions) {
  const {
    friction = 0.95,
    minVelocity = 0.5,
    onUpdate,
    onComplete
  } = options
  
  const animationRef = useRef<number | null>(null)
  const velocityRef = useRef({ x: 0, y: 0 })
  const isAnimatingRef = useRef(false)
  
  const animate = useCallback(() => {
    const velocity = velocityRef.current
    
    // Apply friction
    velocity.x *= friction
    velocity.y *= friction
    
    // Check if velocity is below threshold
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
    
    if (speed < minVelocity) {
      // Stop animation
      velocityRef.current = { x: 0, y: 0 }
      isAnimatingRef.current = false
      animationRef.current = null
      onComplete?.()
      return
    }
    
    // Apply velocity as delta
    const deltaX = velocity.x / 60 // Assuming 60fps
    const deltaY = velocity.y / 60
    
    onUpdate(deltaX, deltaY)
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }, [friction, minVelocity, onUpdate, onComplete])
  
  const startInertia = useCallback((initialVelocity: { x: number; y: number }) => {
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // Set initial velocity
    velocityRef.current = { ...initialVelocity }
    isAnimatingRef.current = true
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate)
  }, [animate])
  
  const stopInertia = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    isAnimatingRef.current = false
  }, [])
  
  const isAnimating = useCallback(() => {
    return isAnimatingRef.current
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return {
    startInertia,
    stopInertia,
    isAnimating
  }
}