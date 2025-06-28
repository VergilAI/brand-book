"use client"

import React, { useCallback, useRef, useEffect } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { usePointerPosition } from '../../hooks/usePointerPosition'
import { GridOverlay } from './GridOverlay'
import { cn } from '@/lib/utils'

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
  
  // Handle pointer events based on current tool
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    updatePosition(e)
    
    if (e.button === 1 || (e.button === 0 && e.shiftKey) || (e.button === 0 && store.tool === 'move')) {
      // Middle mouse, Shift+left click, or move tool for pan
      isDragging.current = true
      lastPan.current = store.view.pan
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
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
    updatePosition(e)
    
    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      
      store.setPan({
        x: lastPan.current.x - dx / store.view.zoom,
        y: lastPan.current.y - dy / store.view.zoom
      })
    }
  }, [store, updatePosition])
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }, [])
  
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
  const viewBox = `${store.view.pan.x} ${store.view.pan.y} ${baseWidth / store.view.zoom} ${baseHeight / store.view.zoom}`
  
  return (
    <div 
      ref={canvasRef}
      className={cn("relative w-full h-full overflow-hidden bg-gray-100", className)}
      onWheel={handleWheel}
    >
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        viewBox={viewBox}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          cursor: isDragging.current ? 'grabbing' : 
                  store.tool === 'move' ? 'grab' :
                  store.tool === 'pen' ? 'crosshair' : 
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
            
            return (
              <path
                key={territory.id}
                d={territory.fillPath}
                fill={isSelected ? '#E0E7FF' : '#FFFFFF'}
                stroke={isSelected ? '#6366F1' : '#000000'}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer hover:fill-gray-50"
                onClick={(e) => {
                  if (store.tool === 'select') {
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