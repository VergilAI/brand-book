"use client"

import { useState, useCallback, useRef } from 'react'
import type { Point, PointerPosition } from '../types/drawing'

export function usePointerPosition() {
  const [position, setPosition] = useState<PointerPosition>({
    screen: { x: 0, y: 0 },
    svg: { x: 0, y: 0 }
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
    const svg = { x: svgPoint.x, y: svgPoint.y }
    
    setPosition({ screen, svg })
  }, [])
  
  return {
    position,
    updatePosition,
    svgRef
  }
}

