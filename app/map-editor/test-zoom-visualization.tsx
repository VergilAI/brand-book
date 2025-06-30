"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useSmoothZoomController } from './hooks/useSmoothZoomController'
import type { Point } from '@/lib/lms/optimized-map-data'

export default function TestZoomVisualization() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [zoomHistory, setZoomHistory] = useState<Array<{
    timestamp: number
    zoom: number
    pan: Point
    mousePos: { x: number, y: number }
    delta: number
  }>>([])
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  const {
    wheelZoom,
    currentZoom,
    targetZoom
  } = useSmoothZoomController({
    zoom,
    pan,
    setZoom,
    setPan
  })
  
  // Track mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [])
  
  // Handle wheel events
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const center = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    
    const delta = -e.deltaY
    wheelZoom(delta, center, containerSize)
    
    // Log zoom event
    setZoomHistory(prev => [...prev.slice(-19), {
      timestamp: Date.now(),
      zoom: currentZoom,
      pan: { ...pan },
      mousePos: center,
      delta
    }])
  }, [containerSize, wheelZoom, currentZoom, pan])
  
  // Calculate viewBox
  const aspectRatio = containerSize.width / containerSize.height
  const baseWidth = 1000
  const baseHeight = baseWidth / aspectRatio
  const viewBoxWidth = baseWidth / zoom
  const viewBoxHeight = baseHeight / zoom
  const viewBox = `${pan.x} ${pan.y} ${viewBoxWidth} ${viewBoxHeight}`
  
  // Convert mouse position to SVG coordinates
  const mouseToSVG = () => {
    const normalizedX = mousePosition.x / containerSize.width
    const normalizedY = mousePosition.y / containerSize.height
    
    return {
      x: pan.x + normalizedX * viewBoxWidth,
      y: pan.y + normalizedY * viewBoxHeight
    }
  }
  
  const svgMouse = mouseToSVG()
  
  // Test grid pattern
  const gridSize = 50
  const gridLines = []
  
  // Calculate visible grid bounds
  const startX = Math.floor(pan.x / gridSize) * gridSize
  const endX = Math.ceil((pan.x + viewBoxWidth) / gridSize) * gridSize
  const startY = Math.floor(pan.y / gridSize) * gridSize
  const endY = Math.ceil((pan.y + viewBoxHeight) / gridSize) * gridSize
  
  for (let x = startX; x <= endX; x += gridSize) {
    gridLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        stroke="#ddd"
        strokeWidth="1"
      />
    )
  }
  
  for (let y = startY; y <= endY; y += gridSize) {
    gridLines.push(
      <line
        key={`h-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke="#ddd"
        strokeWidth="1"
      />
    )
  }
  
  return (
    <div className="w-full h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Zoom Visualization Test</h1>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="col-span-2">
            <div 
              ref={canvasRef}
              className="relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden"
              style={{ height: '600px' }}
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
            >
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full"
                viewBox={viewBox}
              >
                {/* Grid */}
                <g className="grid">{gridLines}</g>
                
                {/* Origin marker */}
                <circle cx="0" cy="0" r="10" fill="red" opacity="0.5" />
                <text x="15" y="5" fontSize="14" fill="red">Origin (0,0)</text>
                
                {/* Test shapes */}
                <rect x="100" y="100" width="200" height="150" fill="blue" opacity="0.3" />
                <circle cx="400" cy="300" r="100" fill="green" opacity="0.3" />
                <polygon points="600,100 700,250 500,250" fill="purple" opacity="0.3" />
                
                {/* Mouse position in SVG */}
                <circle cx={svgMouse.x} cy={svgMouse.y} r="5" fill="orange" />
                <line 
                  x1={svgMouse.x - 20} 
                  y1={svgMouse.y} 
                  x2={svgMouse.x + 20} 
                  y2={svgMouse.y} 
                  stroke="orange" 
                  strokeWidth="2"
                />
                <line 
                  x1={svgMouse.x} 
                  y1={svgMouse.y - 20} 
                  x2={svgMouse.x} 
                  y2={svgMouse.y + 20} 
                  stroke="orange" 
                  strokeWidth="2"
                />
              </svg>
              
              {/* Mouse position overlay */}
              <div 
                className="absolute w-1 h-1 bg-red-500"
                style={{ 
                  left: `${mousePosition.x}px`, 
                  top: `${mousePosition.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>
          
          {/* Debug info */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Current State</h3>
              <div className="space-y-1 text-sm font-mono">
                <div>Zoom: {zoom.toFixed(4)}</div>
                <div>Current: {currentZoom.toFixed(4)}</div>
                <div>Target: {targetZoom.toFixed(4)}</div>
                <div>Pan: ({pan.x.toFixed(2)}, {pan.y.toFixed(2)})</div>
                <div>ViewBox: {viewBoxWidth.toFixed(0)}x{viewBoxHeight.toFixed(0)}</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Mouse Position</h3>
              <div className="space-y-1 text-sm font-mono">
                <div>Screen: ({mousePosition.x.toFixed(0)}, {mousePosition.y.toFixed(0)})</div>
                <div>SVG: ({svgMouse.x.toFixed(2)}, {svgMouse.y.toFixed(2)})</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Zoom History</h3>
              <div className="space-y-1 text-xs font-mono max-h-64 overflow-y-auto">
                {zoomHistory.slice(-10).reverse().map((entry, i) => (
                  <div key={entry.timestamp} className={i === 0 ? 'text-blue-600' : 'text-gray-600'}>
                    Δ{entry.delta > 0 ? '+' : ''}{entry.delta.toFixed(0)} → {entry.zoom.toFixed(3)} @ ({entry.mousePos.x.toFixed(0)}, {entry.mousePos.y.toFixed(0)})
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setZoom(1)
                    setPan({ x: -500, y: -300 })
                  }}
                  className="w-full px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reset View
                </button>
                <button
                  onClick={() => {
                    const center = { x: containerSize.width / 2, y: containerSize.height / 2 }
                    wheelZoom(100, center, containerSize)
                  }}
                  className="w-full px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Zoom In (Center)
                </button>
                <button
                  onClick={() => {
                    const center = { x: containerSize.width / 2, y: containerSize.height / 2 }
                    wheelZoom(-100, center, containerSize)
                  }}
                  className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Zoom Out (Center)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}