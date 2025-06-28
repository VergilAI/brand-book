"use client"

import { useState, useCallback, useRef } from 'react'
import type { Point, PointerPosition } from '../types/drawing'

export function usePointerPosition(gridSize: number, snapToGrid: boolean) {
  const [position, setPosition] = useState<PointerPosition>({
    screen: { x: 0, y: 0 },
    svg: { x: 0, y: 0 },
    grid: { x: 0, y: 0 }
  })
  
  const svgRef = useRef<SVGSVGElement>(null)
  
  const updatePosition = useCallback((event: React.PointerEvent) => {
    if (!svgRef.current) return
    
    // Get screen coordinates
    const screen = { x: event.clientX, y: event.clientY }
    
    // Convert to SVG coordinates
    const pt = svgRef.current.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    
    const ctm = svgRef.current.getScreenCTM()
    if (!ctm) return
    
    const svgPoint = pt.matrixTransform(ctm.inverse())
    const svg = { x: Math.round(svgPoint.x), y: Math.round(svgPoint.y) }
    
    // Calculate grid-snapped position
    const grid = snapToGrid
      ? {
          x: Math.round(svg.x / gridSize) * gridSize,
          y: Math.round(svg.y / gridSize) * gridSize
        }
      : svg
    
    setPosition({ screen, svg, grid })
  }, [gridSize, snapToGrid])
  
  return {
    position,
    updatePosition,
    svgRef
  }
}

export function snapToGridPoint(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }
}