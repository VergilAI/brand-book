"use client"

import { useRef, useCallback, useEffect } from 'react'
import type { Point } from '@/lib/lms/optimized-map-data'

interface ZoomConfig {
  minZoom: number
  maxZoom: number
  zoomSpeed: number
  smoothingFactor: number
}

interface UseSmoothZoomProps {
  zoom: number
  pan: Point
  setZoom: (zoom: number) => void
  setPan: (pan: Point) => void
  config?: Partial<ZoomConfig>
}

const defaultConfig: ZoomConfig = {
  minZoom: 0.1,
  maxZoom: 5,
  zoomSpeed: 0.002,
  smoothingFactor: 0.15
}

export function useSmoothZoom({
  zoom,
  pan,
  setZoom,
  setPan,
  config = {}
}: UseSmoothZoomProps) {
  const animationFrame = useRef<number | null>(null)
  const targetZoom = useRef(zoom)
  const targetPan = useRef(pan)
  const currentZoom = useRef(zoom)
  const currentPan = useRef(pan)
  const isAnimating = useRef(false)
  
  const finalConfig = { ...defaultConfig, ...config }
  
  // Smooth animation loop
  const animate = useCallback(() => {
    const zoomDiff = targetZoom.current - currentZoom.current
    const panDiffX = targetPan.current.x - currentPan.current.x
    const panDiffY = targetPan.current.y - currentPan.current.y
    
    // Check if we're close enough to target
    const threshold = 0.001
    if (Math.abs(zoomDiff) < threshold && 
        Math.abs(panDiffX) < threshold && 
        Math.abs(panDiffY) < threshold) {
      // Snap to final values
      currentZoom.current = targetZoom.current
      currentPan.current = targetPan.current
      setZoom(targetZoom.current)
      setPan(targetPan.current)
      isAnimating.current = false
      animationFrame.current = null
      return
    }
    
    // Apply easing
    currentZoom.current += zoomDiff * finalConfig.smoothingFactor
    currentPan.current = {
      x: currentPan.current.x + panDiffX * finalConfig.smoothingFactor,
      y: currentPan.current.y + panDiffY * finalConfig.smoothingFactor
    }
    
    // Update state
    setZoom(currentZoom.current)
    setPan(currentPan.current)
    
    // Continue animation
    animationFrame.current = requestAnimationFrame(animate)
  }, [setZoom, setPan, finalConfig.smoothingFactor])
  
  // Handle zoom with smooth interpolation
  const smoothZoom = useCallback((
    delta: number,
    center: { x: number; y: number },
    viewportSize: { width: number; height: number },
    baseSize: { width: number; height: number }
  ) => {
    // Calculate scale factor
    const scaleFactor = 1 + delta * finalConfig.zoomSpeed
    const newZoom = Math.max(
      finalConfig.minZoom, 
      Math.min(finalConfig.maxZoom, targetZoom.current * scaleFactor)
    )
    
    // Calculate the aspect ratio for accurate positioning
    const aspectRatio = viewportSize.width / viewportSize.height
    const baseHeight = baseSize.width / aspectRatio
    
    // Current and new viewBox dimensions
    const currentViewBoxWidth = baseSize.width / targetZoom.current
    const currentViewBoxHeight = baseHeight / targetZoom.current
    const newViewBoxWidth = baseSize.width / newZoom
    const newViewBoxHeight = baseHeight / newZoom
    
    // Normalized mouse position (0 to 1)
    const normalizedX = center.x / viewportSize.width
    const normalizedY = center.y / viewportSize.height
    
    // Mouse position in SVG coordinates
    const mouseInSVG = {
      x: targetPan.current.x + normalizedX * currentViewBoxWidth,
      y: targetPan.current.y + normalizedY * currentViewBoxHeight
    }
    
    // Calculate new pan to keep mouse position fixed
    const newPan = {
      x: mouseInSVG.x - normalizedX * newViewBoxWidth,
      y: mouseInSVG.y - normalizedY * newViewBoxHeight
    }
    
    // Update targets
    targetZoom.current = newZoom
    targetPan.current = newPan
    
    // Start animation if not already running
    if (!isAnimating.current) {
      isAnimating.current = true
      animate()
    }
  }, [animate, finalConfig])
  
  // Handle instant zoom (for gesture-based zooming)
  const instantZoom = useCallback((
    newZoom: number,
    center: { x: number; y: number },
    viewportSize: { width: number; height: number },
    baseSize: { width: number; height: number }
  ) => {
    const clampedZoom = Math.max(
      finalConfig.minZoom, 
      Math.min(finalConfig.maxZoom, newZoom)
    )
    
    // Calculate the aspect ratio
    const aspectRatio = viewportSize.width / viewportSize.height
    const baseHeight = baseSize.width / aspectRatio
    
    // Current and new viewBox dimensions
    const currentViewBoxWidth = baseSize.width / zoom
    const currentViewBoxHeight = baseHeight / zoom
    const newViewBoxWidth = baseSize.width / clampedZoom
    const newViewBoxHeight = baseHeight / clampedZoom
    
    // Normalized mouse position
    const normalizedX = center.x / viewportSize.width
    const normalizedY = center.y / viewportSize.height
    
    // Mouse position in SVG coordinates
    const mouseInSVG = {
      x: pan.x + normalizedX * currentViewBoxWidth,
      y: pan.y + normalizedY * currentViewBoxHeight
    }
    
    // Calculate new pan
    const newPan = {
      x: mouseInSVG.x - normalizedX * newViewBoxWidth,
      y: mouseInSVG.y - normalizedY * newViewBoxHeight
    }
    
    // Update immediately for gestures
    setZoom(clampedZoom)
    setPan(newPan)
    
    // Update refs to stay in sync
    targetZoom.current = clampedZoom
    targetPan.current = newPan
    currentZoom.current = clampedZoom
    currentPan.current = newPan
  }, [zoom, pan, setZoom, setPan, finalConfig])
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])
  
  // Sync refs when props change externally
  useEffect(() => {
    if (!isAnimating.current) {
      currentZoom.current = zoom
      currentPan.current = pan
      targetZoom.current = zoom
      targetPan.current = pan
    }
  }, [zoom, pan])
  
  return {
    smoothZoom,
    instantZoom,
    isAnimating: isAnimating.current
  }
}