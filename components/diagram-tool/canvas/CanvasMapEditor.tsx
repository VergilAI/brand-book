"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { HierarchicalGrid } from './HierarchicalGrid'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'
import { useSmoothZoomController } from '@/app/map-editor/hooks/useSmoothZoomController'
import { cn } from '@/lib/utils'

interface CanvasMapEditorProps {
  className?: string
}

export function CanvasMapEditor({ className }: CanvasMapEditorProps) {
  const store = useMapEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [gridType, setGridType] = useState<'lines' | 'dots'>('lines')
  
  // Smooth zoom controller
  const {
    wheelZoom,
    pinchZoom,
    setZoomLevel,
    instantPan,
    addPanMomentum,
    currentZoom,
    targetZoom
  } = useSmoothZoomController({
    zoom: store.view.zoom,
    pan: store.view.pan,
    setZoom: store.setZoom,
    setPan: store.setPan,
    config: {
      minZoom: 0.1,
      maxZoom: 5,
      zoomSpeed: 0.001,
      smoothingFactor: 0.15,
      momentumFriction: 0.92,
      snapToLevels: [0.25, 0.5, 1, 2, 4] // Snap to power of 2 levels
    }
  })
  
  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    
    // Use ResizeObserver for more accurate size tracking
    const resizeObserver = new ResizeObserver(updateSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      window.removeEventListener('resize', updateSize)
      resizeObserver.disconnect()
    }
  }, [])
  
  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return
    
    // Check if it's a zoom gesture (Ctrl/Cmd + wheel)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      
      const rect = containerRef.current.getBoundingClientRect()
      const center = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      
      // Invert delta for natural zoom direction
      const delta = -e.deltaY
      
      wheelZoom(delta, center, containerSize)
    }
  }, [wheelZoom, containerSize])
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g' && e.shiftKey) {
        // Shift+G to toggle grid type
        setGridType(prev => prev === 'lines' ? 'dots' : 'lines')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Calculate viewBox for SVG overlay
  const aspectRatio = containerSize.width / containerSize.height || 16/9
  const baseWidth = 1000
  const baseHeight = baseWidth / aspectRatio
  const viewBoxWidth = baseWidth / store.view.zoom
  const viewBoxHeight = baseHeight / store.view.zoom
  const viewBox = `${store.view.pan.x} ${store.view.pan.y} ${viewBoxWidth} ${viewBoxHeight}`
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-gray-100",
        className
      )}
      onWheel={handleWheel}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Canvas grid layer */}
      {store.view.showGrid && containerSize.width > 0 && containerSize.height > 0 && (
        <HierarchicalGrid
          width={containerSize.width}
          height={containerSize.height}
          zoom={store.view.zoom}
          pan={store.view.pan}
          gridType={gridType}
        />
      )}
      
      {/* SVG overlay for territories and interactions */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={viewBox}
        style={{ cursor: 'default' }}
      >
        {/* Territories and other SVG content will go here */}
        <g className="territories">
          {Object.values(store.map.territories).map(territory => (
            <path
              key={territory.id}
              d={territory.fillPath}
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth={2}
              className="cursor-pointer transition-colors hover:fill-gray-50"
            />
          ))}
        </g>
      </svg>
      
      {/* UI overlays */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
        {Math.round(store.view.pan.x)}, {Math.round(store.view.pan.y)}
      </div>
      
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        {Math.round(currentZoom * 100)}%
      </div>
      
      {/* Grid type indicator */}
      {store.view.showGrid && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          {gridType === 'lines' ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
              <line x1="0" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth="1"/>
              <line x1="0" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1"/>
              <line x1="4" y1="0" x2="4" y2="12" stroke="currentColor" strokeWidth="1"/>
              <line x1="8" y1="0" x2="8" y2="12" stroke="currentColor" strokeWidth="1"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
              <circle cx="2" cy="2" r="1" fill="currentColor"/>
              <circle cx="6" cy="2" r="1" fill="currentColor"/>
              <circle cx="10" cy="2" r="1" fill="currentColor"/>
              <circle cx="2" cy="6" r="1" fill="currentColor"/>
              <circle cx="6" cy="6" r="1" fill="currentColor"/>
              <circle cx="10" cy="6" r="1" fill="currentColor"/>
              <circle cx="2" cy="10" r="1" fill="currentColor"/>
              <circle cx="6" cy="10" r="1" fill="currentColor"/>
              <circle cx="10" cy="10" r="1" fill="currentColor"/>
            </svg>
          )}
          Grid: {gridType === 'lines' ? 'Lines' : 'Dots'} (Shift+G)
        </div>
      )}
      
      {/* Debug info */}
      <div className="absolute top-2 right-2 bg-black/50 text-white rounded px-2 py-1 text-xs font-mono space-y-1">
        <div>Canvas: {containerSize.width}×{containerSize.height}</div>
        <div>Zoom: {currentZoom.toFixed(3)} → {targetZoom.toFixed(3)}</div>
        <div>Grid Spacing: {calculatePrimaryGridSpacing(currentZoom).toFixed(1)}</div>
      </div>
    </div>
  )
}

// Helper to calculate primary grid spacing for debug display
function calculatePrimaryGridSpacing(zoom: number): number {
  const baseSpacing = 50
  const idealSpacing = baseSpacing / zoom
  const log4 = Math.log(idealSpacing) / Math.log(4)
  const roundedLog4 = Math.round(log4)
  return Math.pow(4, roundedLog4)
}