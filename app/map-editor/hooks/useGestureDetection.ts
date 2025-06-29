"use client"

import { useCallback, useRef } from 'react'

export interface GestureState {
  type: 'pan' | 'zoom' | 'none'
  isPinching: boolean
  isSpacePanning: boolean
  velocity: { x: number; y: number }
  lastEventTime: number
  wheelTimeout: NodeJS.Timeout | null
}

interface GestureDetectionOptions {
  onPan?: (deltaX: number, deltaY: number, velocity: { x: number; y: number }) => void
  onZoom?: (scale: number, center: { x: number; y: number }) => void
  onGestureStart?: () => void
  onGestureEnd?: () => void
  onSpacePanStart?: () => void
}

export function useGestureDetection(options: GestureDetectionOptions) {
  const gestureState = useRef<GestureState>({
    type: 'none',
    isPinching: false,
    isSpacePanning: false,
    velocity: { x: 0, y: 0 },
    lastEventTime: 0,
    wheelTimeout: null
  })
  
  const lastMousePos = useRef({ x: 0, y: 0 })
  const velocityHistory = useRef<{ x: number; y: number; time: number }[]>([])
  
  const calculateVelocity = useCallback((deltaX: number, deltaY: number) => {
    const now = Date.now()
    const deltaTime = now - gestureState.current.lastEventTime
    
    if (deltaTime > 0) {
      const velocity = {
        x: deltaX / deltaTime * 1000, // pixels per second
        y: deltaY / deltaTime * 1000,
        time: now
      }
      
      // Keep a history of velocities for smoothing
      velocityHistory.current.push(velocity)
      if (velocityHistory.current.length > 5) {
        velocityHistory.current.shift()
      }
      
      // Calculate average velocity
      const avgVelocity = velocityHistory.current.reduce((acc, v) => ({
        x: acc.x + v.x / velocityHistory.current.length,
        y: acc.y + v.y / velocityHistory.current.length
      }), { x: 0, y: 0 })
      
      gestureState.current.velocity = avgVelocity
      gestureState.current.lastEventTime = now
    }
  }, [])
  
  const handleWheel = useCallback((e: WheelEvent, svgElement: SVGSVGElement | null) => {
    if (!svgElement) return
    
    // Clear any existing timeout
    if (gestureState.current.wheelTimeout) {
      clearTimeout(gestureState.current.wheelTimeout)
    }
    
    // Detect pinch zoom (trackpad) vs scroll wheel
    const isPinchZoom = e.ctrlKey || e.metaKey
    
    if (isPinchZoom) {
      // Pinch zoom on trackpad
      e.preventDefault()
      
      const rect = svgElement.getBoundingClientRect()
      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      // Convert deltaY to a scale factor
      // Trackpad pinch gives smaller deltas, so we amplify them
      const scaleDelta = e.deltaY * -0.01
      const scale = 1 + scaleDelta
      
      if (gestureState.current.type !== 'zoom') {
        gestureState.current.type = 'zoom'
        gestureState.current.isPinching = true
        options.onGestureStart?.()
      }
      
      options.onZoom?.(scale, center)
      
      // Clear pinching state after a delay
      gestureState.current.wheelTimeout = setTimeout(() => {
        gestureState.current.isPinching = false
        gestureState.current.type = 'none'
        options.onGestureEnd?.()
      }, 150)
    } else {
      // Two-finger pan on trackpad or regular scroll
      e.preventDefault()
      
      // Calculate velocity for inertia
      calculateVelocity(-e.deltaX, -e.deltaY)
      
      if (gestureState.current.type !== 'pan') {
        gestureState.current.type = 'pan'
        options.onGestureStart?.()
      }
      
      options.onPan?.(-e.deltaX, -e.deltaY, gestureState.current.velocity)
      
      // Clear panning state after a delay
      gestureState.current.wheelTimeout = setTimeout(() => {
        if (gestureState.current.type === 'pan') {
          gestureState.current.type = 'none'
          options.onGestureEnd?.()
        }
      }, 150)
    }
  }, [options, calculateVelocity])
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault()
      gestureState.current.isSpacePanning = true
      options.onSpacePanStart?.()
    }
  }, [options])
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      gestureState.current.isSpacePanning = false
      velocityHistory.current = []
      gestureState.current.velocity = { x: 0, y: 0 }
    }
  }, [])
  
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (gestureState.current.isSpacePanning && e.button === 0) {
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      gestureState.current.lastEventTime = Date.now()
      velocityHistory.current = []
      options.onGestureStart?.()
    }
  }, [options])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gestureState.current.isSpacePanning && e.buttons === 1) {
      const deltaX = e.clientX - lastMousePos.current.x
      const deltaY = e.clientY - lastMousePos.current.y
      
      calculateVelocity(deltaX, deltaY)
      
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      options.onPan?.(deltaX, deltaY, gestureState.current.velocity)
    }
  }, [options, calculateVelocity])
  
  const handleMouseUp = useCallback(() => {
    if (gestureState.current.isSpacePanning) {
      options.onGestureEnd?.()
    }
  }, [options])
  
  const isGesturing = useCallback(() => {
    return gestureState.current.type !== 'none' || 
           gestureState.current.isSpacePanning
  }, [])
  
  const getVelocity = useCallback(() => {
    return gestureState.current.velocity
  }, [])
  
  const getCursor = useCallback(() => {
    if (gestureState.current.isSpacePanning) {
      return 'grab'
    }
    if (gestureState.current.type === 'pan') {
      return 'grabbing'
    }
    if (gestureState.current.type === 'zoom') {
      return 'zoom-in'
    }
    return 'default'
  }, [])
  
  return {
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isGesturing,
    getVelocity,
    getCursor,
    gestureState: gestureState.current
  }
}