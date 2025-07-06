"use client"

import { useRef, useCallback, useEffect } from 'react'
import type { Point } from '@/lib/lms/optimized-map-data'

interface ZoomState {
  current: number
  target: number
  velocity: number
  lastScale: number  // For tracking gesture momentum
  isGesturing: boolean  // Track if currently in a gesture
}

interface PanState {
  current: Point
  target: Point
  velocity: Point
}

interface SmoothZoomConfig {
  minZoom: number
  maxZoom: number
  zoomSpeed: number
  smoothingFactor: number
  momentumFriction: number
  snapToLevels?: number[] // Optional zoom levels to snap to
}

const defaultConfig: SmoothZoomConfig = {
  minZoom: 0.1,
  maxZoom: 5,
  zoomSpeed: 0.004,  // Faster zoom speed
  smoothingFactor: 0.85,  // Very direct response (like Figma)
  momentumFriction: 0.92,  // Not used now but kept for compatibility
  snapToLevels: undefined
}

export function useSmoothZoomController({
  zoom: initialZoom,
  pan: initialPan,
  setZoom,
  setPan,
  config = {}
}: {
  zoom: number
  pan: Point
  setZoom: (zoom: number) => void
  setPan: (pan: Point) => void
  config?: Partial<SmoothZoomConfig>
}) {
  const finalConfig = { ...defaultConfig, ...config }
  
  // State refs for smooth animation
  const zoomState = useRef<ZoomState>({
    current: initialZoom,
    target: initialZoom,
    velocity: 0,
    lastScale: 1,
    isGesturing: false
  })
  
  const panState = useRef<PanState>({
    current: initialPan,
    target: initialPan,
    velocity: { x: 0, y: 0 }
  })
  
  const animationFrame = useRef<number | null>(null)
  const lastTimestamp = useRef<number>(0)
  const isAnimating = useRef(false)
  
  // Calculate zoom center adjustment for smooth zoom-to-cursor
  const calculatePanAdjustment = useCallback((
    oldZoom: number,
    newZoom: number,
    zoomCenter: { x: number; y: number },
    viewportSize: { width: number; height: number },
    currentPan: Point
  ): Point => {
    // Calculate aspect ratio
    const aspectRatio = viewportSize.width / viewportSize.height
    const baseWidth = 1000
    const baseHeight = baseWidth / aspectRatio
    
    // Current and new viewBox dimensions
    const currentViewBoxWidth = baseWidth / oldZoom
    const currentViewBoxHeight = baseHeight / oldZoom
    const newViewBoxWidth = baseWidth / newZoom
    const newViewBoxHeight = baseHeight / newZoom
    
    // Normalized zoom center (0 to 1)
    const normalizedX = zoomCenter.x / viewportSize.width
    const normalizedY = zoomCenter.y / viewportSize.height
    
    // Zoom center in SVG coordinates
    const zoomCenterSVG = {
      x: currentPan.x + normalizedX * currentViewBoxWidth,
      y: currentPan.y + normalizedY * currentViewBoxHeight
    }
    
    // Calculate new pan to keep zoom center fixed
    // Round to avoid sub-pixel jitter
    return {
      x: Math.round((zoomCenterSVG.x - normalizedX * newViewBoxWidth) * 1000) / 1000,
      y: Math.round((zoomCenterSVG.y - normalizedY * newViewBoxHeight) * 1000) / 1000
    }
  }, [])
  
  // Animation loop with momentum
  const animate = useCallback((timestamp: number) => {
    if (!lastTimestamp.current) {
      lastTimestamp.current = timestamp
    }
    
    const deltaTime = Math.min((timestamp - lastTimestamp.current) / 1000, 0.1) // Cap at 100ms
    lastTimestamp.current = timestamp
    
    let needsUpdate = false
    
    // Update zoom with simple exponential smoothing (no velocity)
    const zoomDiff = zoomState.current.target - zoomState.current.current
    const zoomThreshold = 0.0001  // Smaller threshold for smoother finish
    
    if (Math.abs(zoomDiff) > zoomThreshold) {
      // Simple exponential smoothing
      zoomState.current.current += zoomDiff * finalConfig.smoothingFactor
      
      // Clamp to bounds
      zoomState.current.current = Math.max(
        finalConfig.minZoom,
        Math.min(finalConfig.maxZoom, zoomState.current.current)
      )
      
      needsUpdate = true
    } else {
      // Snap to target when close enough
      zoomState.current.current = zoomState.current.target
      zoomState.current.velocity = 0
    }
    
    // Update pan with direct interpolation (no velocity for stability)
    const panDiffX = panState.current.target.x - panState.current.current.x
    const panDiffY = panState.current.target.y - panState.current.current.y
    const panThreshold = 0.01
    
    if (Math.abs(panDiffX) > panThreshold || Math.abs(panDiffY) > panThreshold) {
      // Direct interpolation for smooth but stable pan
      panState.current.current.x += panDiffX * finalConfig.smoothingFactor
      panState.current.current.y += panDiffY * finalConfig.smoothingFactor
      
      needsUpdate = true
    } else {
      // Snap to target
      panState.current.current = { ...panState.current.target }
      panState.current.velocity = { x: 0, y: 0 }
    }
    
    // Update React state if needed
    if (needsUpdate) {
      setZoom(zoomState.current.current)
      setPan(panState.current.current)
      animationFrame.current = requestAnimationFrame(animate)
    } else {
      // Animation complete
      isAnimating.current = false
      animationFrame.current = null
      lastTimestamp.current = 0
    }
  }, [setZoom, setPan, finalConfig])
  
  // Start animation if not already running
  const startAnimation = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true
      lastTimestamp.current = 0
      animationFrame.current = requestAnimationFrame(animate)
    }
  }, [animate])
  
  // Smooth zoom with mouse wheel
  const wheelZoom = useCallback((
    delta: number,
    center: { x: number; y: number },
    viewportSize: { width: number; height: number }
  ) => {
    // Calculate scale factor
    const scaleFactor = 1 + delta * finalConfig.zoomSpeed
    let newZoom = zoomState.current.current * scaleFactor  // Use current, not target
    
    // Clamp zoom
    newZoom = Math.max(finalConfig.minZoom, Math.min(finalConfig.maxZoom, newZoom))
    
    // Calculate new pan to keep mouse position fixed
    const newPan = calculatePanAdjustment(
      zoomState.current.current,  // Use current zoom
      newZoom,
      center,
      viewportSize,
      panState.current.current  // Use current pan
    )
    
    // For small changes, update instantly (like Figma)
    const zoomChange = Math.abs(newZoom - zoomState.current.current)
    if (zoomChange < 0.05) {
      // Small change - instant update
      zoomState.current.current = newZoom
      zoomState.current.target = newZoom
      panState.current.current = newPan
      panState.current.target = newPan
      setZoom(newZoom)
      setPan(newPan)
    } else {
      // Larger change - animate
      zoomState.current.target = newZoom
      panState.current.target = newPan
      startAnimation()
    }
  }, [calculatePanAdjustment, finalConfig, setZoom, setPan, startAnimation])
  
  // Pinch zoom with gesture tracking
  const pinchZoom = useCallback((
    scale: number,
    center: { x: number; y: number },
    viewportSize: { width: number; height: number },
    isGestureActive: boolean = true
  ) => {
    let newZoom = zoomState.current.current * scale
    newZoom = Math.max(finalConfig.minZoom, Math.min(finalConfig.maxZoom, newZoom))
    
    // Calculate new pan
    const newPan = calculatePanAdjustment(
      zoomState.current.current,
      newZoom,
      center,
      viewportSize,
      panState.current.current
    )
    
    // Track gesture state
    zoomState.current.isGesturing = isGestureActive
    
    // Always update instantly for pinch zoom
    zoomState.current.current = newZoom
    zoomState.current.target = newZoom
    panState.current.current = newPan
    panState.current.target = newPan
    
    // Clear any velocity to prevent oscillation
    zoomState.current.velocity = 0
    panState.current.velocity = { x: 0, y: 0 }
    
    // Update React state immediately
    setZoom(newZoom)
    setPan(newPan)
  }, [calculatePanAdjustment, finalConfig, setZoom, setPan, startAnimation])
  
  // Set zoom to specific level with animation
  const setZoomLevel = useCallback((
    targetZoom: number,
    center?: { x: number; y: number },
    viewportSize?: { width: number; height: number }
  ) => {
    const clampedZoom = Math.max(finalConfig.minZoom, Math.min(finalConfig.maxZoom, targetZoom))
    
    if (center && viewportSize) {
      // Calculate pan adjustment if center is provided
      const newPan = calculatePanAdjustment(
        zoomState.current.target,
        clampedZoom,
        center,
        viewportSize,
        panState.current.target
      )
      panState.current.target = newPan
    }
    
    zoomState.current.target = clampedZoom
    startAnimation()
  }, [calculatePanAdjustment, finalConfig, startAnimation])
  
  // Update pan with animation
  const animatedPan = useCallback((newPan: Point) => {
    panState.current.target = newPan
    startAnimation()
  }, [startAnimation])
  
  // Instant pan (for dragging)
  const instantPan = useCallback((newPan: Point) => {
    panState.current.current = newPan
    panState.current.target = newPan
    panState.current.velocity = { x: 0, y: 0 }
    setPan(newPan)
  }, [setPan])
  
  // Add pan momentum
  const addPanMomentum = useCallback((velocity: Point) => {
    panState.current.velocity.x += velocity.x
    panState.current.velocity.y += velocity.y
    startAnimation()
  }, [startAnimation])
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])
  
  // Sync with external changes
  useEffect(() => {
    if (!isAnimating.current) {
      zoomState.current.current = initialZoom
      zoomState.current.target = initialZoom
      panState.current.current = initialPan
      panState.current.target = initialPan
    }
  }, [initialZoom, initialPan])
  
  // End gesture
  const endGesture = useCallback(() => {
    if (zoomState.current.isGesturing) {
      zoomState.current.isGesturing = false
      zoomState.current.lastScale = 1
      // Animation already running, just let it smoothly reach target
    }
  }, [])
  
  return {
    wheelZoom,
    pinchZoom,
    setZoomLevel,
    animatedPan,
    instantPan,
    addPanMomentum,
    endGesture,
    isAnimating: isAnimating.current,
    currentZoom: zoomState.current.current,
    targetZoom: zoomState.current.target
  }
}