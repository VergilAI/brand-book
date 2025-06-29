"use client"

import React, { useEffect, useRef, useCallback } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'

interface HierarchicalGridProps {
  width: number
  height: number
  zoom: number
  pan: { x: number; y: number }
  gridType?: 'lines' | 'dots'
}

// Grid level configuration
interface GridLevel {
  spacing: number
  opacity: number
  lineWidth: number
  color: string
}

// Grid configuration constants
const getGridConfig = () => {
  // Check for debug override
  if (typeof window !== 'undefined' && (window as any).__GRID_DEBUG_CONFIG) {
    const debug = (window as any).__GRID_DEBUG_CONFIG
    return {
      REFERENCE_SIZE: debug.referenceSize || 10,
      LEVELS_VISIBLE: debug.levelsVisible || 4,
      SUBDIVISION_FACTOR: debug.subdivisionFactor || 4,
      MIN_OPACITY: debug.minOpacity || 0.01,
      STROKE_COLOR: debug.strokeColor || '#94A3B8',
      STROKE_OPACITY: debug.strokeOpacity || 0.28,
      MIN_LEVEL: debug.minLevel ?? 0,
      OPACITY_CURVE: debug.opacityCurve || 'sigmoid',
      CURVE_STEEPNESS: debug.curveSteepness || 4,
      MAX_VISIBLE_GRIDS: debug.maxVisibleGrids || 3
    }
  }
  
  // Default configuration
  return {
    REFERENCE_SIZE: 10,          // Base unit in world coordinates - matches snap grid
    LEVELS_VISIBLE: 4,           // Always show exactly 4 grid levels
    SUBDIVISION_FACTOR: 4,       // Each level is 4x the previous
    MIN_OPACITY: 0.01,          // Don't render below this opacity
    STROKE_COLOR: '#94A3B8',    // Slate-400 for subtle grid
    STROKE_OPACITY: 0.28,        // More visible grid
    MIN_LEVEL: 0,               // Minimum grid level (0 = reference size)
    OPACITY_CURVE: 'sigmoid',    // Opacity curve type
    CURVE_STEEPNESS: 4,         // Steepness of the sigmoid curve
    MAX_VISIBLE_GRIDS: 3        // Maximum number of grids visible at once
  }
}

// Apply opacity curve function
function applyOpacityCurve(x: number, curve: string, steepness: number): number {
  // x is normalized opacity from 0 to 1
  switch (curve) {
    case 'sigmoid':
      // S-curve: slow start/end, fast middle
      const k = steepness
      return 1 / (1 + Math.exp(-k * (x - 0.5) * 2))
    
    case 'exponential':
      // Fast drop-off
      return Math.pow(x, 1 / steepness)
    
    case 'step':
      // More discrete levels
      if (x < 0.3) return 0
      if (x < 0.7) return 0.5
      return 1
    
    case 'linear':
    default:
      return x
  }
}

// Calculate opacity based on apparent size
function calculateLevelOpacity(level: number, zoom: number, config: ReturnType<typeof getGridConfig>): number {
  const levelSize = config.REFERENCE_SIZE * Math.pow(config.SUBDIVISION_FACTOR, level)
  const apparentSize = levelSize * zoom // How big it appears on screen
  const normalizedSize = apparentSize / config.REFERENCE_SIZE
  
  // Calculate base opacity based on size
  let baseOpacity = 0
  
  if (normalizedSize < 0.25) {
    baseOpacity = 0 // Too small to see
  } else if (normalizedSize < 1) {
    // Fade in as size approaches reference
    baseOpacity = (normalizedSize - 0.25) / 0.75
  } else if (normalizedSize < 4) {
    // Full opacity when close to reference size
    baseOpacity = 1
  } else if (normalizedSize < 16) {
    // Fade out as it gets too large
    baseOpacity = 1 - (normalizedSize - 4) / 12
  } else {
    baseOpacity = 0 // Too large
  }
  
  // Apply the opacity curve
  const curvedOpacity = applyOpacityCurve(baseOpacity, config.OPACITY_CURVE, config.CURVE_STEEPNESS)
  
  return Math.max(0, Math.min(1, curvedOpacity)) * config.STROKE_OPACITY
}

// Get visible grid levels based on zoom
function getVisibleLevels(zoom: number, config: ReturnType<typeof getGridConfig>): number[] {
  // Calculate which level has spacing closest to reference size
  const idealLevel = -Math.log(zoom) / Math.log(config.SUBDIVISION_FACTOR)
  const centerLevel = Math.round(idealLevel)
  
  // Show the configured number of consecutive levels centered around the ideal level
  const levels: number[] = []
  const halfLevels = Math.floor(config.LEVELS_VISIBLE / 2)
  const startLevel = centerLevel - halfLevels + (config.LEVELS_VISIBLE % 2 === 0 ? 1 : 0)
  
  for (let i = 0; i < config.LEVELS_VISIBLE; i++) {
    const level = startLevel + i
    // Only add levels that are >= minLevel
    if (level >= config.MIN_LEVEL) {
      levels.push(level)
    }
  }
  
  return levels
}

// Calculate grid levels with proper opacity
function calculateGridLevels(zoom: number, config: ReturnType<typeof getGridConfig>): GridLevel[] {
  const visibleLevels = getVisibleLevels(zoom, config)
  const allLevels: GridLevel[] = []
  
  visibleLevels.forEach(level => {
    const spacing = config.REFERENCE_SIZE * Math.pow(config.SUBDIVISION_FACTOR, level)
    const opacity = calculateLevelOpacity(level, zoom, config)
    
    if (opacity > config.MIN_OPACITY) {
      allLevels.push({
        spacing,
        opacity,
        lineWidth: 1,
        color: config.STROKE_COLOR
      })
    }
  })
  
  // Sort by opacity (highest first) and limit to MAX_VISIBLE_GRIDS
  allLevels.sort((a, b) => b.opacity - a.opacity)
  const limitedLevels = allLevels.slice(0, config.MAX_VISIBLE_GRIDS)
  
  // Sort by spacing for rendering (coarsest first)
  return limitedLevels.sort((a, b) => b.spacing - a.spacing)
}

export const HierarchicalGrid = React.memo(function HierarchicalGrid({ width, height, zoom, pan, gridType = 'lines' }: HierarchicalGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const store = useMapEditor()
  
  // Convert SVG coordinates to canvas coordinates
  const svgToCanvas = useCallback((x: number, y: number) => {
    // Match the SVG viewBox calculation from MapCanvas
    const aspectRatio = width / height
    const baseWidth = 1000
    const baseHeight = baseWidth / aspectRatio
    const viewBoxWidth = baseWidth / zoom
    const viewBoxHeight = baseHeight / zoom
    
    // Convert from SVG coordinates to normalized coordinates (0-1)
    const normalizedX = (x - pan.x) / viewBoxWidth
    const normalizedY = (y - pan.y) / viewBoxHeight
    
    // Convert to canvas pixels
    const canvasX = normalizedX * width
    const canvasY = normalizedY * height
    
    return { x: canvasX, y: canvasY }
  }, [width, height, zoom, pan])
  
  // Draw grid lines
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Get current configuration
    const config = getGridConfig()
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Match the exact viewBox calculation from MapCanvas
    const svgAspectRatio = width / height
    const baseWidth = 1000
    const baseHeight = baseWidth / svgAspectRatio
    const viewBoxWidth = baseWidth / zoom
    const viewBoxHeight = baseHeight / zoom
    
    const visibleBounds = {
      left: pan.x,
      right: pan.x + viewBoxWidth,
      top: pan.y,
      bottom: pan.y + viewBoxHeight
    }
    
    // Get grid levels
    const levels = calculateGridLevels(zoom, config)
    
    // Draw debug info (comment out for production)
    /*
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.font = '12px monospace'
    ctx.fillText(`Grid: zoom=${zoom.toFixed(2)}, levels=${levels.length}`, 10, 20)
    ctx.fillText(`Bounds: ${visibleBounds.left.toFixed(0)},${visibleBounds.top.toFixed(0)} to ${visibleBounds.right.toFixed(0)},${visibleBounds.bottom.toFixed(0)}`, 10, 35)
    if (levels.length > 0) {
      ctx.fillText(`Spacing: ${levels[0].spacing.toFixed(0)}, Opacity: ${levels[0].opacity.toFixed(3)}`, 10, 50)
    }
    ctx.restore()
    */
    
    
    // Draw each grid level
    levels.forEach(level => {
      ctx.strokeStyle = level.color
      ctx.lineWidth = level.lineWidth
      ctx.globalAlpha = level.opacity
      
      if (gridType === 'lines') {
        ctx.beginPath()
        
        // Draw vertical lines
        const startX = Math.floor(visibleBounds.left / level.spacing) * level.spacing
        const endX = Math.ceil(visibleBounds.right / level.spacing) * level.spacing
        
        for (let x = startX; x <= endX; x += level.spacing) {
          const start = svgToCanvas(x, visibleBounds.top)
          const end = svgToCanvas(x, visibleBounds.bottom)
          
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
        }
        
        // Draw horizontal lines
        const startY = Math.floor(visibleBounds.top / level.spacing) * level.spacing
        const endY = Math.ceil(visibleBounds.bottom / level.spacing) * level.spacing
        
        for (let y = startY; y <= endY; y += level.spacing) {
          const start = svgToCanvas(visibleBounds.left, y)
          const end = svgToCanvas(visibleBounds.right, y)
          
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
        }
        
        ctx.stroke()
      } else {
        // Draw dots
        const startX = Math.floor(visibleBounds.left / level.spacing) * level.spacing
        const endX = Math.ceil(visibleBounds.right / level.spacing) * level.spacing
        const startY = Math.floor(visibleBounds.top / level.spacing) * level.spacing
        const endY = Math.ceil(visibleBounds.bottom / level.spacing) * level.spacing
        
        const dotRadius = level.lineWidth * 2
        
        for (let x = startX; x <= endX; x += level.spacing) {
          for (let y = startY; y <= endY; y += level.spacing) {
            const pos = svgToCanvas(x, y)
            
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2)
            ctx.fillStyle = level.color
            ctx.fill()
          }
        }
      }
    })
    
    // Draw origin lines if zoomed in enough
    if (zoom > 0.5) {
      const originOpacity = Math.min(0.3, (zoom - 0.5) * 0.6)
      ctx.globalAlpha = originOpacity
      
      // X axis (red)
      const xStart = svgToCanvas(visibleBounds.left, 0)
      const xEnd = svgToCanvas(visibleBounds.right, 0)
      
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(xStart.x, xStart.y)
      ctx.lineTo(xEnd.x, xEnd.y)
      ctx.stroke()
      
      // Y axis (green)
      const yStart = svgToCanvas(0, visibleBounds.top)
      const yEnd = svgToCanvas(0, visibleBounds.bottom)
      
      ctx.strokeStyle = '#10B981'
      ctx.beginPath()
      ctx.moveTo(yStart.x, yStart.y)
      ctx.lineTo(yEnd.x, yEnd.y)
      ctx.stroke()
      
      // Origin marker
      if (zoom > 1) {
        const origin = svgToCanvas(0, 0)
        ctx.fillStyle = '#6366F1'
        ctx.beginPath()
        ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Draw snap grid points for debugging
    if ((window as any).__SHOW_SNAP_POINTS && store) {
      const snapGridSize = store.view.gridSize
      ctx.globalAlpha = 1
      ctx.fillStyle = '#FF0000'
      
      // Calculate snap grid points in view
      const snapStartX = Math.floor(visibleBounds.left / snapGridSize) * snapGridSize
      const snapEndX = Math.ceil(visibleBounds.right / snapGridSize) * snapGridSize
      const snapStartY = Math.floor(visibleBounds.top / snapGridSize) * snapGridSize
      const snapEndY = Math.ceil(visibleBounds.bottom / snapGridSize) * snapGridSize
      
      for (let x = snapStartX; x <= snapEndX; x += snapGridSize) {
        for (let y = snapStartY; y <= snapEndY; y += snapGridSize) {
          const pos = svgToCanvas(x, y)
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    // Reset alpha
    ctx.globalAlpha = 1
  }, [width, height, zoom, pan, gridType, svgToCanvas])
  
  // Set up canvas size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Set canvas size to match container
    canvas.width = width
    canvas.height = height
    
    // Set CSS size to ensure proper scaling
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
  }, [width, height])
  
  // Render grid when dependencies change
  useEffect(() => {
    drawGrid()
  }, [drawGrid])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.5  // Make the entire grid layer more subtle
      }}
    />
  )
})