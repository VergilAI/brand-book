"use client"

import React, { useCallback, useRef } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { usePointerPosition } from '../../hooks/usePointerPosition'
import type { BezierPoint, Point } from '../../types/editor'

interface BezierDrawToolProps {
  onDrawingModeChange: (mode: 'polygon' | 'bezier') => void
  onShowControlPointsChange: (show: boolean) => void
}

export function BezierDrawTool({ 
  onDrawingModeChange, 
  onShowControlPointsChange 
}: BezierDrawToolProps) {
  const store = useMapEditor()
  const isDraggingControl = useRef(false)
  const dragControlInfo = useRef<{
    pointIndex: number
    controlType: 'in' | 'out'
  } | null>(null)

  const handleControlPointDrag = useCallback((
    e: React.PointerEvent,
    pointIndex: number,
    controlType: 'in' | 'out'
  ) => {
    e.stopPropagation()
    isDraggingControl.current = true
    dragControlInfo.current = { pointIndex, controlType }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handleControlPointMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingControl.current || !dragControlInfo.current) return
    
    e.preventDefault()
    
    // Get SVG coordinates from the event
    const svg = e.currentTarget.closest('svg')
    if (!svg) return
    
    const rect = svg.getBoundingClientRect()
    const svgAspectRatio = rect.width / rect.height
    const baseWidth = 1000
    const baseHeight = baseWidth / svgAspectRatio
    const viewBoxWidth = baseWidth / store.view.zoom
    const viewBoxHeight = baseHeight / store.view.zoom
    
    const svgX = store.view.pan.x + ((e.clientX - rect.left) / rect.width) * viewBoxWidth
    const svgY = store.view.pan.y + ((e.clientY - rect.top) / rect.height) * viewBoxHeight
    
    const position = store.drawing.snapToGrid 
      ? { 
          x: Math.round(svgX / store.view.gridSize) * store.view.gridSize, 
          y: Math.round(svgY / store.view.gridSize) * store.view.gridSize 
        }
      : { x: svgX, y: svgY }

    store.updateBezierControlPoint(
      dragControlInfo.current.pointIndex,
      dragControlInfo.current.controlType,
      position
    )
  }, [store])

  const handleControlPointEnd = useCallback((e: React.PointerEvent) => {
    isDraggingControl.current = false
    dragControlInfo.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  const addControlPointsToLastPoint = useCallback(() => {
    if (store.drawing.bezierPath.length === 0) return
    
    const lastIndex = store.drawing.bezierPath.length - 1
    const lastPoint = store.drawing.bezierPath[lastIndex]
    
    // Add default control points
    const controlOffset = 30 // Default distance for control points
    
    const inControl: Point = {
      x: lastPoint.x - controlOffset,
      y: lastPoint.y
    }
    
    const outControl: Point = {
      x: lastPoint.x + controlOffset,
      y: lastPoint.y
    }
    
    store.updateBezierControlPoint(lastIndex, 'in', inControl)
    store.updateBezierControlPoint(lastIndex, 'out', outControl)
  }, [store])

  return (
    <g className="bezier-tool">
      {/* Render bezier path with control points */}
      {store.drawing.isDrawing && store.drawing.mode === 'bezier' && store.drawing.showControlPoints && (
        <g className="control-points">
          {store.drawing.bezierPath.map((point, index) => {
            if (point.type !== 'anchor' || !point.controlPoints) return null
            
            return (
              <g key={`control-${index}`}>
                {/* Control point lines */}
                {point.controlPoints.in && (
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.controlPoints.in.x}
                    y2={point.controlPoints.in.y}
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="pointer-events-none"
                  />
                )}
                {point.controlPoints.out && (
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.controlPoints.out.x}
                    y2={point.controlPoints.out.y}
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="pointer-events-none"
                  />
                )}
                
                {/* In control point */}
                {point.controlPoints.in && (
                  <circle
                    cx={point.controlPoints.in.x}
                    cy={point.controlPoints.in.y}
                    r="4"
                    fill="#8B5CF6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-move"
                    onPointerDown={(e) => handleControlPointDrag(e, index, 'in')}
                    onPointerMove={handleControlPointMove}
                    onPointerUp={handleControlPointEnd}
                  />
                )}
                
                {/* Out control point */}
                {point.controlPoints.out && (
                  <circle
                    cx={point.controlPoints.out.x}
                    cy={point.controlPoints.out.y}
                    r="4"
                    fill="#8B5CF6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-move"
                    onPointerDown={(e) => handleControlPointDrag(e, index, 'out')}
                    onPointerMove={handleControlPointMove}
                    onPointerUp={handleControlPointEnd}
                  />
                )}
                
                {/* Anchor point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#6366F1"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onDoubleClick={addControlPointsToLastPoint}
                />
              </g>
            )
          })}
        </g>
      )}
    </g>
  )
}