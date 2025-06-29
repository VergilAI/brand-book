"use client"

import React, { useCallback, useRef, useEffect } from 'react'
import { useDrawingTool } from '../../hooks/useDrawingTool'
import { usePointerPosition } from '../../hooks/usePointerPosition'
import { useSnapping } from '../../hooks/useSnapping'
import { GridOverlay } from './GridOverlay'
import { SnapIndicators } from './SnapIndicators'
import { cn } from '@/lib/utils'
import type { Shape, Point, BezierPoint } from '../../types/drawing'
import type { SnapIndicator } from '../../types/snapping'

// Helper function to parse SVG path into polygon points
function parsePathToPoints(pathString: string): Point[] {
  const points: Point[] = []
  let currentX = 0
  let currentY = 0
  
  console.log('Parsing path:', pathString)
  
  // Match all path commands - updated regex to handle commas and decimals better
  const commandRegex = /([MLCQZ])\s*([^MLCQZ]*)/gi
  let match
  
  while ((match = commandRegex.exec(pathString)) !== null) {
    const command = match[1].toUpperCase()
    const coordsStr = match[2].trim()
    
    console.log('Found command:', command, 'with coords:', coordsStr)
    
    if (command === 'Z') {
      continue // Close path, no coordinates
    }
    
    // Split by whitespace or comma and parse numbers
    const coords = coordsStr.split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n))
    console.log('Parsed coords:', coords)
    
    switch (command) {
      case 'M': // Move to
      case 'L': // Line to
        if (coords.length >= 2) {
          currentX = coords[0]
          currentY = coords[1]
          points.push({ x: currentX, y: currentY })
        }
        break
        
      case 'C': // Cubic bezier
        if (coords.length >= 6) {
          // For hit detection, just use the end point
          // The curve interpolation was causing issues
          currentX = coords[4]
          currentY = coords[5]
          points.push({ x: currentX, y: currentY })
        }
        break
        
      case 'Q': // Quadratic bezier
        if (coords.length >= 4) {
          currentX = coords[2]
          currentY = coords[3]
          points.push({ x: currentX, y: currentY })
        }
        break
    }
  }
  
  console.log('Final points extracted:', points)
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

// Helper function to check if point is inside shape using accurate polygon detection
function isPointInShape(point: Point, shape: Shape): boolean {
  const polygonPoints = parsePathToPoints(shape.fillPath)
  if (polygonPoints.length < 3) {
    console.warn('Shape has less than 3 points:', shape.id, 'path:', shape.fillPath, 'parsed points:', polygonPoints)
    return false
  }
  return isPointInPolygon(point, polygonPoints)
}

// Helper function to clamp selection coordinates within canvas bounds
function clampToCanvasBounds(point: Point, viewBox: { x: number, y: number, width: number, height: number }): Point {
  return {
    x: Math.max(viewBox.x, Math.min(viewBox.x + viewBox.width, point.x)),
    y: Math.max(viewBox.y, Math.min(viewBox.y + viewBox.height, point.y))
  }
}

interface DrawingCanvasProps {
  className?: string
}

export function DrawingCanvas({ className }: DrawingCanvasProps) {
  const store = useDrawingTool()
  const { position, updatePosition, svgRef } = usePointerPosition()
  const { getSnappedPoint, getSnappedDrawingPoint, isSnappingEnabled } = useSnapping()
  
  const isDragging = useRef(false)
  const lastPan = useRef(store.view.pan)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Selection box state
  const isAreaSelecting = useRef(false)
  const areaSelectStart = useRef({ x: 0, y: 0 })
  const areaSelectEnd = useRef({ x: 0, y: 0 })
  const [showAreaSelect, setShowAreaSelect] = React.useState(false)
  
  // Shape moving state
  const isMovingShapes = useRef(false)
  const hasMoved = useRef(false)
  const moveStartPos = useRef({ x: 0, y: 0 })
  const shapeMoveOffsets = useRef<Record<string, { x: number, y: number }>>({})
  
  // Snapping state
  const [snapIndicators, setSnapIndicators] = React.useState<SnapIndicator[]>([])
  
  // Store current raw position for rendering (without grid snap)
  const currentRawPosition = useRef<Point>({ x: 0, y: 0 })
  
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
    
    // Handle vertex editing mode
    if (store.editing.isEditing && e.button === 0) {
      const point = position.svg
      
      // Check if clicking on a vertex
      const vertexRadius = 8 / store.view.zoom // Scale with zoom
      const handleRadius = 6 / store.view.zoom
      
      // Check vertices
      for (let i = 0; i < store.editing.vertexPositions.length; i++) {
        const vertex = store.editing.vertexPositions[i]
        const distance = Math.sqrt(Math.pow(point.x - vertex.x, 2) + Math.pow(point.y - vertex.y, 2))
        
        if (distance < vertexRadius) {
          store.selectVertex(i, e.ctrlKey || e.metaKey)
          store.startDraggingVertex(i)
          e.currentTarget.setPointerCapture(e.pointerId)
          return
        }
        
        // Check control handles
        if (vertex.controlPoints?.in) {
          const inDistance = Math.sqrt(
            Math.pow(point.x - vertex.controlPoints.in.x, 2) + 
            Math.pow(point.y - vertex.controlPoints.in.y, 2)
          )
          if (inDistance < handleRadius) {
            store.startDraggingControlHandle(i, 'in')
            e.currentTarget.setPointerCapture(e.pointerId)
            return
          }
        }
        
        if (vertex.controlPoints?.out) {
          const outDistance = Math.sqrt(
            Math.pow(point.x - vertex.controlPoints.out.x, 2) + 
            Math.pow(point.y - vertex.controlPoints.out.y, 2)
          )
          if (outDistance < handleRadius) {
            store.startDraggingControlHandle(i, 'out')
            e.currentTarget.setPointerCapture(e.pointerId)
            return
          }
        }
      }
      
      // Check if clicking on an edge to add a vertex
      const edgeThreshold = 10 / store.view.zoom
      let closestEdge = { index: -1, point: point, distance: Infinity }
      
      for (let i = 0; i < store.editing.vertexPositions.length; i++) {
        const start = store.editing.vertexPositions[i]
        const end = store.editing.vertexPositions[(i + 1) % store.editing.vertexPositions.length]
        
        const { point: closestPoint, distance } = getClosestPointOnSegment(point, start, end)
        
        if (distance < closestEdge.distance) {
          closestEdge = { index: i, point: closestPoint, distance }
        }
      }
      
      if (closestEdge.distance < edgeThreshold) {
        // Add vertex on edge
        // Use the unified snapping system instead of manual grid snapping
        const { point: snappedPoint } = getSnappedPoint(closestEdge.point)
        store.addVertexOnEdge(closestEdge.index, snappedPoint)
        return
      }
      
      // If not clicking on any vertex/handle/edge, clear selection
      store.clearVertexSelection()
      return
    }
    
    if (store.tool === 'select' && e.button === 0) {
      const point = position.svg
      
      // Check if clicking on any shape (selected or not)
      const clickedShape = Object.values(store.document.shapes).find(shape => {
        return isPointInShape(point, shape)
      })
      
      if (clickedShape) {
        // Handle selection logic carefully to preserve multi-selection during drag
        if (!store.selection.shapes.has(clickedShape.id)) {
          // Shape is not selected, so select it
          store.selectShape(clickedShape.id, e.ctrlKey || e.metaKey)
        } else if (e.ctrlKey || e.metaKey) {
          // Shape is already selected and user is holding Ctrl/Cmd, so toggle it off
          store.selectShape(clickedShape.id, true)
          // Don't start dragging if we just deselected the shape
          return
        }
        // If shape is already selected and no modifier key, DON'T call selectShape
        // This preserves the current multi-selection for dragging
        
        // Prepare for potential shape movement
        isMovingShapes.current = true
        hasMoved.current = false
        moveStartPos.current = point
        shapeMoveOffsets.current = {}
        
        // Calculate initial offsets for all currently selected shapes
        store.selection.shapes.forEach(id => {
          const shape = store.document.shapes[id]
          if (shape) {
            shapeMoveOffsets.current[id] = {
              x: shape.center.x - point.x,
              y: shape.center.y - point.y
            }
          }
        })
        
        // Also include the clicked shape if it wasn't already selected
        if (!shapeMoveOffsets.current[clickedShape.id]) {
          shapeMoveOffsets.current[clickedShape.id] = {
            x: clickedShape.center.x - point.x,
            y: clickedShape.center.y - point.y
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
      // Get current SVG position directly from event
      const getCurrentSvgPosition = (): Point => {
        if (!svgRef.current) return { x: 0, y: 0 }
        const pt = svgRef.current.createSVGPoint()
        pt.x = e.clientX
        pt.y = e.clientY
        const ctm = svgRef.current.getScreenCTM()
        if (!ctm) return { x: 0, y: 0 }
        const svgPoint = pt.matrixTransform(ctm.inverse())
        return { x: svgPoint.x, y: svgPoint.y }
      }
      
      const rawPoint = getCurrentSvgPosition()
      const previousPoint = store.drawing.bezierPath.length > 0 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 1] : undefined
      
      // Apply snapping
      const { point: snappedPoint, indicators } = getSnappedDrawingPoint(rawPoint, previousPoint)
      setSnapIndicators(indicators)
      
      if (!store.drawing.isDrawing) {
        // Start drawing with first point
        store.startDrawing(snappedPoint)
      } else {
        // Check if clicking near start point to close path
        const firstPoint = store.drawing.bezierPath[0]
        const distance = Math.sqrt(
          Math.pow(snappedPoint.x - firstPoint.x, 2) + 
          Math.pow(snappedPoint.y - firstPoint.y, 2)
        )
        
        if (distance < 10 && store.drawing.bezierPath.length > 2) {
          store.finishDrawing()
          setSnapIndicators([])
        } else {
          // Add the new point first, then we can drag to create its handles
          store.addBezierPoint(snappedPoint)
          // Set up for potential drag to create handles for this new point
          store.startDraggingHandle(snappedPoint)
        }
      }
    }
  }, [store, position, updatePosition])
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isAreaSelecting.current) {
      e.preventDefault() // Prevent text selection during area select
    }
    updatePosition(e)
    
    // Get current SVG position directly from event
    const getCurrentSvgPosition = (): Point => {
      if (!svgRef.current) return { x: 0, y: 0 }
      const pt = svgRef.current.createSVGPoint()
      pt.x = e.clientX
      pt.y = e.clientY
      const ctm = svgRef.current.getScreenCTM()
      if (!ctm) return { x: 0, y: 0 }
      const svgPoint = pt.matrixTransform(ctm.inverse())
      return { x: svgPoint.x, y: svgPoint.y }
    }
    
    const currentSvgPos = getCurrentSvgPosition()
    currentRawPosition.current = currentSvgPos // Store for rendering
    
    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      
      store.setPan({
        x: lastPan.current.x - dx / store.view.zoom,
        y: lastPan.current.y - dy / store.view.zoom
      })
    } else if (store.editing.isDraggingVertex && store.editing.draggedVertex !== null) {
      // Move vertex with snapping
      const { point: snappedPoint, indicators } = getSnappedPoint(currentSvgPos)
      setSnapIndicators(indicators)
      store.updateVertexPosition(store.editing.draggedVertex, snappedPoint)
    } else if (store.editing.isDraggingHandle && store.editing.draggedHandle !== null) {
      // Move control handle
      store.updateControlHandle(
        store.editing.draggedHandle.vertex,
        store.editing.draggedHandle.type,
        currentSvgPos
      )
    } else if (isMovingShapes.current) {
      // Move selected shapes with snapping
      const rawPos = currentSvgPos
      
      // Calculate the center of all selected shapes for snapping
      const selectedShapes = Array.from(store.selection.shapes)
        .map(id => store.document.shapes[id])
        .filter(Boolean)
      
      if (selectedShapes.length > 0) {
        // Calculate bounding box center of selection
        const bounds = {
          minX: Math.min(...selectedShapes.map(s => s.center.x)),
          maxX: Math.max(...selectedShapes.map(s => s.center.x)),
          minY: Math.min(...selectedShapes.map(s => s.center.y)),
          maxY: Math.max(...selectedShapes.map(s => s.center.y))
        }
        const selectionCenter = {
          x: (bounds.minX + bounds.maxX) / 2,
          y: (bounds.minY + bounds.maxY) / 2
        }
        
        // Calculate raw delta
        const rawDeltaX = rawPos.x - moveStartPos.current.x
        const rawDeltaY = rawPos.y - moveStartPos.current.y
        
        // Check if we've moved enough to start actual movement (3px threshold)
        const distance = Math.sqrt(rawDeltaX * rawDeltaX + rawDeltaY * rawDeltaY)
        if (distance > 3) {
          hasMoved.current = true
        }
        
        // Only apply movement if we've crossed the threshold
        if (hasMoved.current) {
          // Get the potential new center position
          const potentialCenter = {
            x: selectionCenter.x + rawDeltaX,
            y: selectionCenter.y + rawDeltaY
          }
          
          // Apply snapping to the center, excluding selected shapes
          const excludeIds = selectedShapes.map(s => s.id)
          const { point: snappedCenter, indicators } = getSnappedPoint(potentialCenter, excludeIds)
          setSnapIndicators(indicators)
          
          // Calculate snapped deltas
          const snappedDeltaX = snappedCenter.x - selectionCenter.x
          const snappedDeltaY = snappedCenter.y - selectionCenter.y
          
          // Move shapes with snapped deltas
          if (selectedShapes.length > 0) {
            store.moveShapes(
              selectedShapes.map(s => s.id), 
              snappedDeltaX, 
              snappedDeltaY
            )
            // Update start position based on snapped movement
            moveStartPos.current = {
              x: moveStartPos.current.x + snappedDeltaX,
              y: moveStartPos.current.y + snappedDeltaY
            }
          }
        }
      }
    } else if (store.drawing.isDraggingHandle && store.tool === 'pen') {
      // Update bezier handle during drag only when using pen tool
      const previousPoint = store.drawing.bezierPath.length > 1 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 2] : undefined
      
      // Apply snapping for handle drag
      const { point: snappedPoint, indicators } = getSnappedDrawingPoint(currentSvgPos, previousPoint)
      setSnapIndicators(indicators)
      store.updateDragHandle(snappedPoint)
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
      
      areaSelectEnd.current = clampToCanvasBounds(currentSvgPos, viewBounds)
    } else if (store.tool === 'pen' && store.drawing.isDrawing && !store.drawing.isDraggingHandle) {
      // Update snap indicators during pen tool movement when drawing
      const previousPoint = store.drawing.bezierPath.length > 0 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 1] : undefined
      
      const { indicators } = getSnappedDrawingPoint(currentSvgPos, previousPoint)
      setSnapIndicators(indicators)
    } else if (store.tool === 'pen' && !store.drawing.isDrawing) {
      // Update snap indicators during pen tool movement when not drawing
      const { indicators } = getSnappedPoint(currentSvgPos)
      setSnapIndicators(indicators)
    } else {
      // Clear snap indicators when not in a snapping mode
      if (snapIndicators.length > 0) {
        setSnapIndicators([])
      }
    }
  }, [store, updatePosition, getSnappedPoint, getSnappedDrawingPoint])
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (store.editing.isDraggingVertex || store.editing.isDraggingHandle) {
      // End vertex or handle dragging
      store.endDragging()
      setSnapIndicators([]) // Clear snap indicators
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (store.drawing.isDraggingHandle) {
      // End bezier handle dragging and add the point
      const rawPoint = position.svg
      const previousPoint = store.drawing.bezierPath.length > 1 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 2] : undefined
      const { point: snappedPoint } = getSnappedDrawingPoint(rawPoint, previousPoint)
      store.endDraggingHandle(snappedPoint)
      setSnapIndicators([]) // Clear snap indicators
    } else if (isAreaSelecting.current) {
      // Complete area selection
      const start = areaSelectStart.current
      const end = areaSelectEnd.current
      
      store.selectShapesInArea(start.x, start.y, end.x, end.y, e.ctrlKey || e.metaKey)
      
      // Reset area selection
      isAreaSelecting.current = false
      setShowAreaSelect(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (isMovingShapes.current) {
      // Complete shape movement
      isMovingShapes.current = false
      setSnapIndicators([]) // Clear snap indicators
      e.currentTarget.releasePointerCapture(e.pointerId)
      
      // Reset hasMoved after a small delay to prevent onClick from firing on drag end
      setTimeout(() => {
        hasMoved.current = false
      }, 10)
    }
  }, [store, position])
  
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

  // Handle double-click for editing
  const handleDoubleClick = useCallback((e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation()
    e.preventDefault()
    if (store.tool === 'select') {
      store.startEditingShape(shapeId)
    }
  }, [store])
  
  // Helper function to find closest point on line segment
  const getClosestPointOnSegment = (point: Point, start: Point, end: Point): { point: Point, distance: number } => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const lengthSquared = dx * dx + dy * dy
    
    if (lengthSquared === 0) {
      return { point: start, distance: Math.sqrt(Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)) }
    }
    
    let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared
    t = Math.max(0, Math.min(1, t))
    
    const closestPoint = {
      x: start.x + t * dx,
      y: start.y + t * dy
    }
    
    const distance = Math.sqrt(Math.pow(point.x - closestPoint.x, 2) + Math.pow(point.y - closestPoint.y, 2))
    
    return { point: closestPoint, distance }
  }
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (e.key === 'Escape') {
        if (store.editing.isEditing) {
          store.stopEditingShape()
        } else if (store.drawing.isDrawing) {
          store.cancelDrawing()
        } else {
          store.clearSelection()
        }
      } else if (e.key === 'Enter') {
        if (store.editing.isEditing) {
          store.stopEditingShape()
        } else if (store.drawing.isDrawing && store.drawing.bezierPath.length >= 3) {
          store.finishDrawing()
        }
      } else if (e.key === ' ' && store.editing.isEditing) {
        // Space to toggle bezier on selected vertices
        e.preventDefault()
        store.editing.selectedVertices.forEach(idx => {
          store.toggleVertexBezier(idx)
        })
      } else if (e.key.toLowerCase() === 'v' && !store.editing.isEditing) {
        store.setTool('select')
      } else if (e.key.toLowerCase() === 'p' && !store.editing.isEditing) {
        store.setTool('pen')
      } else if (e.key.toLowerCase() === 'h' && !store.editing.isEditing) {
        store.setTool('move')
      } else if (e.key.toLowerCase() === 'g') {
        store.toggleGrid()
      } else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        // Toggle snapping
        store.toggleSnapping()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.editing.isEditing && store.editing.selectedVertices.size > 0) {
          // Delete selected vertices in editing mode
          // Sort indices in descending order to delete from end to start
          const indices = Array.from(store.editing.selectedVertices).sort((a, b) => b - a)
          indices.forEach(idx => store.deleteVertex(idx))
        } else if (!store.editing.isEditing) {
          // Delete selected shapes
          store.selection.shapes.forEach(id => store.deleteShape(id))
        }
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        // Re-enable snapping when Alt is released
        store.setTemporarySnapDisabled(false)
      }
    }
    
    const handleKeyDownForAlt = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        // Temporarily disable snapping while Alt is held
        store.setTemporarySnapDisabled(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', handleKeyDownForAlt)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', handleKeyDownForAlt)
      window.removeEventListener('keyup', handleKeyUp)
    }
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
          // Clear snap indicators when leaving
          setSnapIndicators([])
          handlePointerUp(e)
        }}
        style={{
          cursor: isDragging.current ? 'grabbing' : 
                  isMovingShapes.current ? 'grabbing' :
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
        
        {/* Existing shapes */}
        <g className="shapes">
          {Object.values(store.document.shapes).map(shape => {
            const isSelected = store.selection.shapes.has(shape.id)
            
            // Check if shape would be selected by current area selection
            let wouldBeSelected = false
            if (isAreaSelecting.current && showAreaSelect) {
              const minX = Math.min(areaSelectStart.current.x, areaSelectEnd.current.x)
              const maxX = Math.max(areaSelectStart.current.x, areaSelectEnd.current.x)
              const minY = Math.min(areaSelectStart.current.y, areaSelectEnd.current.y)
              const maxY = Math.max(areaSelectStart.current.y, areaSelectEnd.current.y)
              
              const { x, y } = shape.center
              wouldBeSelected = x >= minX && x <= maxX && y >= minY && y <= maxY
            }
            
            return (
              <path
                key={shape.id}
                d={shape.fillPath}
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
                style={{
                  opacity: store.editing.isEditing && store.editing.editingShapeId !== shape.id ? 0.3 : 1
                }}
                onClick={(e) => {
                  if (store.tool === 'select' && !hasMoved.current && !store.editing.isEditing) {
                    // Only handle click if we haven't just finished dragging
                    e.stopPropagation()
                    store.selectShape(shape.id, e.shiftKey)
                  }
                }}
                onDoubleClick={(e) => handleDoubleClick(e, shape.id)}
              />
            )
          })}
        </g>
        
        {/* Vertex editing visualization */}
        {store.editing.isEditing && store.editing.vertexPositions.length > 0 && (
          <g className="vertex-editing">
            {/* Shape edges - for visual feedback when adding vertices */}
            {store.editing.vertexPositions.map((vertex, index) => {
              const nextVertex = store.editing.vertexPositions[(index + 1) % store.editing.vertexPositions.length]
              return (
                <line
                  key={`edge-${index}`}
                  x1={vertex.x}
                  y1={vertex.y}
                  x2={nextVertex.x}
                  y2={nextVertex.y}
                  stroke="transparent"
                  strokeWidth="20"
                  className="cursor-crosshair"
                  style={{ pointerEvents: 'stroke' }}
                />
              )
            })}
            {/* Control handle lines */}
            {store.editing.vertexPositions.map((vertex, index) => (
              <g key={`vertex-handles-${index}`}>
                {/* In control handle */}
                {vertex.controlPoints?.in && (
                  <>
                    <line
                      x1={vertex.x}
                      y1={vertex.y}
                      x2={vertex.controlPoints.in.x}
                      y2={vertex.controlPoints.in.y}
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      opacity="0.7"
                      className="pointer-events-none"
                    />
                    <circle
                      cx={vertex.controlPoints.in.x}
                      cy={vertex.controlPoints.in.y}
                      r="6"
                      fill="#8B5CF6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="cursor-move"
                      style={{ cursor: 'move' }}
                    />
                  </>
                )}
                
                {/* Out control handle */}
                {vertex.controlPoints?.out && (
                  <>
                    <line
                      x1={vertex.x}
                      y1={vertex.y}
                      x2={vertex.controlPoints.out.x}
                      y2={vertex.controlPoints.out.y}
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      opacity="0.7"
                      className="pointer-events-none"
                    />
                    <circle
                      cx={vertex.controlPoints.out.x}
                      cy={vertex.controlPoints.out.y}
                      r="6"
                      fill="#8B5CF6"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="cursor-move"
                      style={{ cursor: 'move' }}
                    />
                  </>
                )}
              </g>
            ))}
            
            {/* Vertex anchor points */}
            {store.editing.vertexPositions.map((vertex, index) => {
              const hasBezier = vertex.controlPoints && (vertex.controlPoints.in || vertex.controlPoints.out)
              return (
                <g key={`vertex-${index}`}>
                  <circle
                    cx={vertex.x}
                    cy={vertex.y}
                    r="8"
                    fill={store.editing.selectedVertices.has(index) ? '#3B82F6' : '#FFFFFF'}
                    stroke={store.editing.selectedVertices.has(index) ? '#1E40AF' : '#6366F1'}
                    strokeWidth="3"
                    className="cursor-move"
                    style={{ cursor: 'move' }}
                  />
                  {/* Inner dot to indicate bezier vertex */}
                  {hasBezier && (
                    <circle
                      cx={vertex.x}
                      cy={vertex.y}
                      r="3"
                      fill={store.editing.selectedVertices.has(index) ? '#1E40AF' : '#6366F1'}
                      className="pointer-events-none"
                    />
                  )}
                </g>
              )
            })}
          </g>
        )}
        
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
            {!store.drawing.isDraggingHandle && store.drawing.bezierPath.length > 0 && (() => {
              const lastPoint = store.drawing.bezierPath[store.drawing.bezierPath.length - 1]
              const rawPoint = currentRawPosition.current
              
              // Apply snapping to preview line
              const { point: snappedPoint } = getSnappedDrawingPoint(rawPoint, lastPoint)
              const currentPoint = snappedPoint
              
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
            {store.drawing.bezierPath.length > 2 && (() => {
              const firstPoint = store.drawing.bezierPath[0]
              const rawPoint = currentRawPosition.current
              const lastPoint = store.drawing.bezierPath[store.drawing.bezierPath.length - 1]
              
              // Apply snapping
              const { point: snappedPoint } = getSnappedDrawingPoint(rawPoint, lastPoint)
              const distance = Math.sqrt(
                Math.pow(snappedPoint.x - firstPoint.x, 2) + 
                Math.pow(snappedPoint.y - firstPoint.y, 2)
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
            
            {/* Show bezier anchor points */}
            {store.drawing.bezierPath.map((point, index) => (
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
            
            {/* Show control handles when dragging */}
            {store.drawing.isDraggingHandle && store.drawing.dragStartPoint && (() => {
              const dragStart = store.drawing.dragStartPoint
              const rawPoint = currentRawPosition.current
              const previousPoint = store.drawing.bezierPath.length > 1 ? 
                store.drawing.bezierPath[store.drawing.bezierPath.length - 2] : undefined
              
              // Apply snapping to handle
              const { point: snappedPoint } = getSnappedDrawingPoint(rawPoint, previousPoint)
              const currentPoint = snappedPoint
              
              return (
                <g>
                  {/* Handle line */}
                  <line
                    x1={dragStart.x}
                    y1={dragStart.y}
                    x2={currentPoint.x}
                    y2={currentPoint.y}
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                  {/* Handle point */}
                  <circle
                    cx={currentPoint.x}
                    cy={currentPoint.y}
                    r="4"
                    fill="#8B5CF6"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                </g>
              )
            })()}
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
        {store.tool === 'pen' && (() => {
          const rawPoint = currentRawPosition.current
          const lastPoint = store.drawing.isDrawing && store.drawing.bezierPath.length > 0 ? 
            store.drawing.bezierPath[store.drawing.bezierPath.length - 1] : undefined
          
          // Apply snapping to cursor
          const { point: snappedPoint } = lastPoint ? 
            getSnappedDrawingPoint(rawPoint, lastPoint) : 
            getSnappedPoint(rawPoint)
          
          return (
            <circle
              cx={snappedPoint.x}
              cy={snappedPoint.y}
              r="3"
              fill="#6366F1"
              className="pointer-events-none"
            />
          )
        })()}
        
        {/* Snap indicators */}
        <SnapIndicators indicators={snapIndicators} zoom={store.view.zoom} />
      </svg>
      
      {/* Position display */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
        {currentRawPosition.current.x}, {currentRawPosition.current.y}
      </div>
      
      {/* Editing mode indicator */}
      {store.editing.isEditing && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="text-sm font-medium mb-1">Editing Mode</div>
          <div className="text-xs opacity-90 space-y-1">
            <div>• Drag vertices to reshape • Click edge to add vertex</div>
            <div>• Select vertex + SPACE to toggle bezier • DELETE to remove</div>
            <div>• Press ESC to cancel or ENTER to finish</div>
          </div>
        </div>
      )}
      
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
      
      {/* Snap indicator */}
      {isSnappingEnabled && (
        <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
            <rect x="1" y="1" width="4" height="4" fill="currentColor"/>
            <rect x="7" y="1" width="4" height="4" fill="currentColor"/>
            <rect x="1" y="7" width="4" height="4" fill="currentColor"/>
            <rect x="7" y="7" width="4" height="4" fill="currentColor"/>
          </svg>
          Snap ON (S)
        </div>
      )}
    </div>
  )
}