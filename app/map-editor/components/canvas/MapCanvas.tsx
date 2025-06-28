"use client"

import React, { useCallback, useRef, useEffect } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { usePointerPosition } from '../../hooks/usePointerPosition'
import { GridOverlay } from './GridOverlay'
import { cn } from '@/lib/utils'
import type { Territory, Point } from '@/lib/lms/optimized-map-data'

// Helper function to parse SVG path into polygon points
function parsePathToPoints(pathString: string): Point[] {
  const points: Point[] = []
  const commands = pathString.match(/[ML]\s*[-\d.]+\s+[-\d.]+/g) || []
  
  commands.forEach(command => {
    const match = command.match(/[ML]\s*([-\d.]+)\s+([-\d.]+)/)
    if (match) {
      points.push({
        x: parseFloat(match[1]),
        y: parseFloat(match[2])
      })
    }
  })
  
  return points
}

// Ray casting algorithm for point-in-polygon detection
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false
  
  let inside = false
  const x = point.x
  const y = point.y
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y
    
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  
  return inside
}

// Helper function to check if point is inside territory using accurate polygon detection
function isPointInTerritory(point: Point, territory: Territory): boolean {
  const polygonPoints = parsePathToPoints(territory.fillPath)
  return isPointInPolygon(point, polygonPoints)
}

// Helper function to clamp selection coordinates within canvas bounds
function clampToCanvasBounds(point: Point, viewBox: { x: number, y: number, width: number, height: number }): Point {
  return {
    x: Math.max(viewBox.x, Math.min(viewBox.x + viewBox.width, point.x)),
    y: Math.max(viewBox.y, Math.min(viewBox.y + viewBox.height, point.y))
  }
}

interface MapCanvasProps {
  className?: string
}

export function MapCanvas({ className }: MapCanvasProps) {
  const store = useMapEditor()
  const { position, updatePosition, svgRef } = usePointerPosition(
    store.view.gridSize,
    store.drawing.snapToGrid
  )
  
  const isDragging = useRef(false)
  const lastPan = useRef(store.view.pan)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Selection box state
  const isAreaSelecting = useRef(false)
  const areaSelectStart = useRef({ x: 0, y: 0 })
  const areaSelectEnd = useRef({ x: 0, y: 0 })
  const [showAreaSelect, setShowAreaSelect] = React.useState(false)
  
  // Territory moving state
  const isMovingTerritories = useRef(false)
  const hasMoved = useRef(false)
  const moveStartPos = useRef({ x: 0, y: 0 })
  const territoryMoveOffsets = useRef<Record<string, { x: number, y: number }>>({})
  
  // Handle pointer events based on current tool
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault() // Prevent default behaviors like text selection
    updatePosition(e)
    
    if (e.button === 1 || (e.button === 0 && e.shiftKey) || (e.button === 0 && store.tool === 'move')) {
      // Middle mouse, Shift+left click, or move tool for pan
      isDragging.current = true
      lastPan.current = store.view.pan
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }
    
    if (store.tool === 'select' && e.button === 0) {
      const point = position.svg
      
      // Check if clicking on any territory (selected or not)
      const clickedTerritory = Object.values(store.map.territories).find(territory => {
        return isPointInTerritory(point, territory)
      })
      
      if (clickedTerritory) {
        // Handle selection logic carefully to preserve multi-selection during drag
        if (!store.selection.territories.has(clickedTerritory.id)) {
          // Territory is not selected, so select it
          store.selectTerritory(clickedTerritory.id, e.ctrlKey || e.metaKey)
        } else if (e.ctrlKey || e.metaKey) {
          // Territory is already selected and user is holding Ctrl/Cmd, so toggle it off
          store.selectTerritory(clickedTerritory.id, true)
          // Don't start dragging if we just deselected the territory
          return
        }
        // If territory is already selected and no modifier key, DON'T call selectTerritory
        // This preserves the current multi-selection for dragging
        
        // Prepare for potential territory movement
        isMovingTerritories.current = true
        hasMoved.current = false
        moveStartPos.current = point
        territoryMoveOffsets.current = {}
        
        // Calculate initial offsets for all currently selected territories
        store.selection.territories.forEach(id => {
          const territory = store.map.territories[id]
          if (territory) {
            territoryMoveOffsets.current[id] = {
              x: territory.center.x - point.x,
              y: territory.center.y - point.y
            }
          }
        })
        
        // Also include the clicked territory if it wasn't already selected
        if (!territoryMoveOffsets.current[clickedTerritory.id]) {
          territoryMoveOffsets.current[clickedTerritory.id] = {
            x: clickedTerritory.center.x - point.x,
            y: clickedTerritory.center.y - point.y
          }
        }
        
        e.currentTarget.setPointerCapture(e.pointerId)
      } else {
        // Start area selection on empty space (clamp to canvas bounds)
        const svgAspectRatio = svgRef.current ? 
          svgRef.current.getBoundingClientRect().width / svgRef.current.getBoundingClientRect().height : 
          16/9
        const baseWidth = 1000
        const baseHeight = baseWidth / svgAspectRatio
        const viewBoxWidth = baseWidth / store.view.zoom
        const viewBoxHeight = baseHeight / store.view.zoom
        const viewBounds = {
          x: store.view.pan.x,
          y: store.view.pan.y,
          width: viewBoxWidth,
          height: viewBoxHeight
        }
        
        const clampedPoint = clampToCanvasBounds(point, viewBounds)
        isAreaSelecting.current = true
        areaSelectStart.current = clampedPoint
        areaSelectEnd.current = clampedPoint
        setShowAreaSelect(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }
      return
    }
    
    if (store.tool === 'pen' && e.button === 0) {
      const point = store.drawing.snapToGrid ? position.grid : position.svg
      
      if (!store.drawing.isDrawing) {
        store.startDrawing(point)
      } else {
        // Check if clicking near start point to close path
        const firstPoint = store.drawing.currentPath[0]
        const distance = Math.sqrt(
          Math.pow(point.x - firstPoint.x, 2) + 
          Math.pow(point.y - firstPoint.y, 2)
        )
        
        if (distance < 10 && store.drawing.currentPath.length > 2) {
          store.finishDrawing()
        } else {
          store.addDrawingPoint(point)
        }
      }
    }
  }, [store, position, updatePosition])
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isAreaSelecting.current) {
      e.preventDefault() // Prevent text selection during area select
    }
    updatePosition(e)
    
    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      
      store.setPan({
        x: lastPan.current.x - dx / store.view.zoom,
        y: lastPan.current.y - dy / store.view.zoom
      })
    } else if (isAreaSelecting.current) {
      // Update area selection rectangle (clamp to canvas bounds)
      const svgAspectRatio = svgRef.current ? 
        svgRef.current.getBoundingClientRect().width / svgRef.current.getBoundingClientRect().height : 
        16/9
      const baseWidth = 1000
      const baseHeight = baseWidth / svgAspectRatio
      const viewBoxWidth = baseWidth / store.view.zoom
      const viewBoxHeight = baseHeight / store.view.zoom
      const viewBounds = {
        x: store.view.pan.x,
        y: store.view.pan.y,
        width: viewBoxWidth,
        height: viewBoxHeight
      }
      
      areaSelectEnd.current = clampToCanvasBounds(position.svg, viewBounds)
    } else if (isMovingTerritories.current) {
      // Move selected territories
      const currentPos = position.svg
      const deltaX = currentPos.x - moveStartPos.current.x
      const deltaY = currentPos.y - moveStartPos.current.y
      
      // Check if we've moved enough to start actual movement (3px threshold)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      if (distance > 3) {
        hasMoved.current = true
      }
      
      // Only apply movement if we've crossed the threshold
      if (hasMoved.current) {
        const territoryIds = Array.from(store.selection.territories)
        if (territoryIds.length > 0) {
          store.moveTerritories(territoryIds, deltaX, deltaY)
          moveStartPos.current = currentPos // Update for next frame
        }
      }
    }
  }, [store, updatePosition, position])
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (isAreaSelecting.current) {
      // Complete area selection
      const start = areaSelectStart.current
      const end = areaSelectEnd.current
      
      store.selectTerritoriesInArea(start.x, start.y, end.x, end.y, e.ctrlKey || e.metaKey)
      
      // Reset area selection
      isAreaSelecting.current = false
      setShowAreaSelect(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (isMovingTerritories.current) {
      // Complete territory movement
      isMovingTerritories.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
      
      // Reset hasMoved after a small delay to prevent onClick from firing on drag end
      setTimeout(() => {
        hasMoved.current = false
      }, 10)
    }
  }, [store])
  
  // Handle zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!svgRef.current) return
    
    const scaleFactor = e.deltaY > 0 ? 0.92 : 1.08
    const newZoom = Math.max(0.1, Math.min(5, store.view.zoom * scaleFactor))
    
    // Get mouse position relative to the SVG element
    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Calculate viewBox dimensions based on actual SVG aspect ratio
    const svgAspectRatio = rect.width / rect.height
    const baseWidth = 1000 // Use a base width for consistent scaling
    const baseHeight = baseWidth / svgAspectRatio
    
    // Get current viewBox dimensions
    const currentViewBoxWidth = baseWidth / store.view.zoom
    const currentViewBoxHeight = baseHeight / store.view.zoom
    
    // Convert mouse position to normalized coordinates (0 to 1)
    const normalizedX = mouseX / rect.width
    const normalizedY = mouseY / rect.height
    
    // Calculate mouse position in current SVG coordinates
    const mouseInSVG = {
      x: store.view.pan.x + normalizedX * currentViewBoxWidth,
      y: store.view.pan.y + normalizedY * currentViewBoxHeight
    }
    
    // Calculate new viewBox dimensions
    const newViewBoxWidth = baseWidth / newZoom
    const newViewBoxHeight = baseHeight / newZoom
    
    // Calculate new pan to keep the mouse position fixed during zoom
    const newPan = {
      x: mouseInSVG.x - normalizedX * newViewBoxWidth,
      y: mouseInSVG.y - normalizedY * newViewBoxHeight
    }
    
    // Update both zoom and pan together
    store.setZoom(newZoom)
    store.setPan(newPan)
  }, [store, svgRef])
  
  // Prevent page scrolling when over canvas
  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return
    
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault()
      return false
    }
    
    // Use passive: false to ensure preventDefault works
    canvasElement.addEventListener('wheel', preventScroll, { passive: false })
    
    return () => {
      canvasElement.removeEventListener('wheel', preventScroll)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (e.key === 'Escape') {
        if (store.drawing.isDrawing) {
          store.cancelDrawing()
        } else {
          store.clearSelection()
        }
      } else if (e.key === 'Enter' && store.drawing.isDrawing) {
        if (store.drawing.currentPath.length >= 3) {
          store.finishDrawing()
        }
      } else if (e.key.toLowerCase() === 'v') {
        store.setTool('select')
      } else if (e.key.toLowerCase() === 'p') {
        store.setTool('pen')
      } else if (e.key.toLowerCase() === 'h') {
        store.setTool('move')
      } else if (e.key.toLowerCase() === 'g') {
        store.toggleGrid()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected territories
        store.selection.territories.forEach(id => store.deleteTerritory(id))
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [store])
  
  // Calculate viewBox with dynamic aspect ratio
  const svgAspectRatio = svgRef.current ? 
    svgRef.current.getBoundingClientRect().width / svgRef.current.getBoundingClientRect().height : 
    16/9 // fallback aspect ratio
  const baseWidth = 1000
  const baseHeight = baseWidth / svgAspectRatio
  const viewBoxWidth = baseWidth / store.view.zoom
  const viewBoxHeight = baseHeight / store.view.zoom
  const viewBox = `${store.view.pan.x} ${store.view.pan.y} ${viewBoxWidth} ${viewBoxHeight}`
  
  // Current viewBox bounds for clamping
  const currentViewBounds = {
    x: store.view.pan.x,
    y: store.view.pan.y,
    width: viewBoxWidth,
    height: viewBoxHeight
  }
  
  return (
    <div 
      ref={canvasRef}
      className={cn("relative w-full h-full overflow-hidden bg-gray-100", className)}
      onWheel={handleWheel}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseLeave={() => {
        // Cancel area selection if mouse leaves the canvas container
        if (isAreaSelecting.current) {
          isAreaSelecting.current = false
          setShowAreaSelect(false)
        }
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        viewBox={viewBox}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={(e) => {
          // End any ongoing area selection when leaving the SVG
          if (isAreaSelecting.current) {
            isAreaSelecting.current = false
            setShowAreaSelect(false)
            e.currentTarget.releasePointerCapture(e.pointerId)
          }
          handlePointerUp(e)
        }}
        style={{
          cursor: isDragging.current ? 'grabbing' : 
                  isMovingTerritories.current ? 'grabbing' :
                  isAreaSelecting.current ? 'crosshair' :
                  store.tool === 'move' ? 'grab' :
                  store.tool === 'pen' ? 'crosshair' :
                  store.tool === 'select' ? 'default' :
                  'default'
        }}
      >
        {/* Grid overlay */}
        {store.view.showGrid && (
          <GridOverlay 
            gridSize={store.view.gridSize} 
            viewBox={viewBox}
          />
        )}
        
        {/* Existing territories */}
        <g className="territories">
          {Object.values(store.map.territories).map(territory => {
            const isSelected = store.selection.territories.has(territory.id)
            
            // Check if territory would be selected by current area selection
            let wouldBeSelected = false
            if (isAreaSelecting.current && showAreaSelect) {
              const minX = Math.min(areaSelectStart.current.x, areaSelectEnd.current.x)
              const maxX = Math.max(areaSelectStart.current.x, areaSelectEnd.current.x)
              const minY = Math.min(areaSelectStart.current.y, areaSelectEnd.current.y)
              const maxY = Math.max(areaSelectStart.current.y, areaSelectEnd.current.y)
              
              const { x, y } = territory.center
              wouldBeSelected = x >= minX && x <= maxX && y >= minY && y <= maxY
            }
            
            return (
              <path
                key={territory.id}
                d={territory.fillPath}
                fill="#FFFFFF"
                stroke={isSelected ? '#6366F1' : wouldBeSelected ? '#8B5CF6' : '#000000'}
                strokeWidth={isSelected ? 3 : wouldBeSelected ? 2.5 : 2}
                strokeDasharray={wouldBeSelected && !isSelected ? '3 3' : 'none'}
                className={`cursor-pointer transition-colors ${
                  isSelected 
                    ? 'hover:fill-[#E0E7FF]' 
                    : wouldBeSelected
                    ? 'fill-[#F3F4F6]'
                    : 'hover:fill-gray-50'
                }`}
                onClick={(e) => {
                  if (store.tool === 'select' && !hasMoved.current) {
                    // Only handle click if we haven't just finished dragging
                    e.stopPropagation()
                    store.selectTerritory(territory.id, e.shiftKey)
                  }
                }}
              />
            )
          })}
        </g>
        
        {/* Drawing preview */}
        {store.drawing.isDrawing && (
          <g className="drawing-preview">
            {/* Completed path segments */}
            <path
              d={store.drawing.previewPath}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2"
              strokeDasharray="5 5"
              className="pointer-events-none"
            />
            
            {/* Live preview line from last point to cursor */}
            {store.drawing.currentPath.length > 0 && (() => {
              const lastPoint = store.drawing.currentPath[store.drawing.currentPath.length - 1]
              const currentPoint = store.drawing.snapToGrid ? position.grid : position.svg
              
              return (
                <line
                  x1={lastPoint.x}
                  y1={lastPoint.y}
                  x2={currentPoint.x}
                  y2={currentPoint.y}
                  stroke="#6366F1"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.7"
                  className="pointer-events-none"
                />
              )
            })()}
            
            {/* Show close indicator when near start */}
            {store.drawing.currentPath.length > 2 && (() => {
              const firstPoint = store.drawing.currentPath[0]
              const currentPoint = store.drawing.snapToGrid ? position.grid : position.svg
              const distance = Math.sqrt(
                Math.pow(currentPoint.x - firstPoint.x, 2) + 
                Math.pow(currentPoint.y - firstPoint.y, 2)
              )
              
              return distance < 10 ? (
                <circle
                  cx={firstPoint.x}
                  cy={firstPoint.y}
                  r="8"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                  className="pointer-events-none animate-pulse"
                />
              ) : null
            })()}
            
            {/* Show all drawing points */}
            {store.drawing.currentPath.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#6366F1"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="pointer-events-none"
              />
            ))}
          </g>
        )}
        
        {/* Area selection rectangle */}
        {showAreaSelect && (
          <rect
            x={Math.min(areaSelectStart.current.x, areaSelectEnd.current.x)}
            y={Math.min(areaSelectStart.current.y, areaSelectEnd.current.y)}
            width={Math.abs(areaSelectEnd.current.x - areaSelectStart.current.x)}
            height={Math.abs(areaSelectEnd.current.y - areaSelectStart.current.y)}
            fill="rgba(99, 102, 241, 0.1)"
            stroke="#6366F1"
            strokeWidth="1"
            strokeDasharray="3 3"
            className="pointer-events-none"
            style={{ pointerEvents: 'none' }}
          />
        )}
        
        {/* Cursor position indicator */}
        {store.tool === 'pen' && (
          <circle
            cx={store.drawing.snapToGrid ? position.grid.x : position.svg.x}
            cy={store.drawing.snapToGrid ? position.grid.y : position.svg.y}
            r="3"
            fill="#6366F1"
            className="pointer-events-none"
          />
        )}
      </svg>
      
      {/* Position display */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
        {position.svg.x}, {position.svg.y}
      </div>
      
      {/* Zoom display */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        {Math.round(store.view.zoom * 100)}%
      </div>
      
      {/* Center button */}
      <button
        onClick={() => {
          store.setPan({ x: -450, y: -250 })
          store.setZoom(1)
        }}
        className="absolute bottom-2 right-20 bg-white/90 backdrop-blur-sm rounded px-3 py-1 text-xs hover:bg-white transition-colors border border-gray-200"
        title="Center map (reset view)"
      >
        Center
      </button>
    </div>
  )
}