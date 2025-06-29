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
const GRID_CONFIG = {
  REFERENCE_SIZE: 40,          // Base unit in world coordinates
  LEVELS_VISIBLE: 4,           // Always show exactly 4 grid levels
  SUBDIVISION_FACTOR: 4,       // Each level is 4x the previous
  MIN_OPACITY: 0.01,          // Don't render below this opacity
  STROKE_COLOR: '#94A3B8',    // Slate-400 for subtle grid
  STROKE_OPACITY: 0.08         // Very subtle opacity
}

// Calculate opacity based on apparent size
function calculateLevelOpacity(level: number, zoom: number): number {
  const levelSize = GRID_CONFIG.REFERENCE_SIZE * Math.pow(4, level)
  const apparentSize = levelSize * zoom // How big it appears on screen
  const normalizedSize = apparentSize / GRID_CONFIG.REFERENCE_SIZE
  
  // Opacity peaks when apparent size equals reference size
  // Fades out when too small (< 0.25x) or too large (> 4x)
  let opacity = 0
  
  if (normalizedSize < 0.25) {
    opacity = 0 // Too small to see
  } else if (normalizedSize < 1) {
    // Fade in as size approaches reference
    opacity = (normalizedSize - 0.25) / 0.75
  } else if (normalizedSize < 4) {
    // Full opacity when close to reference size
    opacity = 1
  } else if (normalizedSize < 16) {
    // Fade out as it gets too large
    opacity = 1 - (normalizedSize - 4) / 12
  } else {
    opacity = 0 // Too large
  }
  
  return Math.max(0, Math.min(1, opacity)) * GRID_CONFIG.STROKE_OPACITY
}

// Get visible grid levels based on zoom
function getVisibleLevels(zoom: number): number[] {
  // Calculate which level has spacing closest to reference size
  // When zoom = 1, level 0 (40px) is at reference
  // When zoom = 4, level -1 (10px) appears as 40px
  // When zoom = 0.25, level 1 (160px) appears as 40px
  const idealLevel = -Math.log(zoom) / Math.log(4)
  const centerLevel = Math.round(idealLevel)
  
  // Always show 4 consecutive levels centered around the ideal level
  return [
    centerLevel - 1,
    centerLevel,
    centerLevel + 1,
    centerLevel + 2
  ]
}

// Calculate grid levels with proper opacity
function calculateGridLevels(zoom: number): GridLevel[] {
  const visibleLevels = getVisibleLevels(zoom)
  const levels: GridLevel[] = []
  
  visibleLevels.forEach(level => {
    const spacing = GRID_CONFIG.REFERENCE_SIZE * Math.pow(4, level)
    const opacity = calculateLevelOpacity(level, zoom)
    
    if (opacity > GRID_CONFIG.MIN_OPACITY) {
      levels.push({
        spacing,
        opacity,
        lineWidth: 1,
        color: GRID_CONFIG.STROKE_COLOR
      })
    }
  })
  
  return levels.reverse() // Draw coarsest first
}

export const HierarchicalGrid = React.memo(function HierarchicalGrid({ width, height, zoom, pan, gridType = 'lines' }: HierarchicalGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
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
    
    // Convert to canvas pixels with rounding to prevent sub-pixel issues
    const canvasX = Math.round(normalizedX * width * 2) / 2  // Snap to half-pixels
    const canvasY = Math.round(normalizedY * height * 2) / 2
    
    return { x: canvasX, y: canvasY }
  }, [width, height, zoom, pan])
  
  // Draw grid lines
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
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
    const levels = calculateGridLevels(zoom)
    
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