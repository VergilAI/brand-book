"use client"

import React, { useCallback, useRef, useEffect, useState } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { usePointerPosition } from '../../hooks/usePointerPosition'
import { useSnapping } from '../../hooks/useSnapping'
import { useGestureDetection } from '../../hooks/useGestureDetection'
import { useInertiaScroll } from '../../hooks/useInertiaScroll'
// import { useSmoothZoom } from '../../hooks/useSmoothZoom' // Replaced with useSmoothZoomController
import { useSmoothZoomController } from '../../hooks/useSmoothZoomController'
import { HierarchicalGrid } from './HierarchicalGrid'
import { SnapIndicators } from './SnapIndicators'
import { BezierDrawTool } from '../drawing/BezierDrawTool'
import { TerritoryTablePanel } from '../panels/TerritoryTablePanel'
import { ZoomIndicator } from '../ui/ZoomIndicator'
import { GestureHint } from '../ui/GestureHint'
import { DebugPanel } from '../debug/DebugPanel'
import { cn } from '@/lib/utils'
import styles from './MapCanvas.module.css'
import type { Territory, Point } from '@/lib/lms/optimized-map-data'
import type { BezierPoint } from '../../types/editor'
import type { SnapIndicator } from '../../types/snapping'

// Helper function to move SVG path (needed for shape placement)
function moveSvgPath(path: string, deltaX: number, deltaY: number): string {
  // SVG path transformation - moves all coordinates by delta
  const result = path.replace(/([MLHVCSQTAZ])\s*((?:[-\d.]+\s*,?\s*)+)/gi, (match, command, params) => {
    const cmd = command.toUpperCase()
    
    if (cmd === 'Z') return command
    
    const numbers = params.match(/[-\d.]+/g) || []
    const transformed: string[] = []
    
    switch (cmd) {
      case 'M':
      case 'L':
        for (let i = 0; i < numbers.length; i += 2) {
          transformed.push((parseFloat(numbers[i]) + deltaX).toString())
          if (i + 1 < numbers.length) {
            transformed.push((parseFloat(numbers[i + 1]) + deltaY).toString())
          }
        }
        break
      case 'C':
      case 'Q':
      case 'S':
      case 'T':
        for (let i = 0; i < numbers.length; i += 2) {
          transformed.push((parseFloat(numbers[i]) + deltaX).toString())
          if (i + 1 < numbers.length) {
            transformed.push((parseFloat(numbers[i + 1]) + deltaY).toString())
          }
        }
        break
      case 'H':
        for (const num of numbers) {
          transformed.push((parseFloat(num) + deltaX).toString())
        }
        break
      case 'V':
        for (const num of numbers) {
          transformed.push((parseFloat(num) + deltaY).toString())
        }
        break
      case 'A':
        for (let i = 0; i < numbers.length; i += 7) {
          transformed.push(numbers[i]) // rx
          transformed.push(numbers[i + 1]) // ry
          transformed.push(numbers[i + 2]) // rotation
          transformed.push(numbers[i + 3]) // large-arc
          transformed.push(numbers[i + 4]) // sweep
          transformed.push((parseFloat(numbers[i + 5]) + deltaX).toString()) // x
          transformed.push((parseFloat(numbers[i + 6]) + deltaY).toString()) // y
        }
        break
    }
    
    return command + ' ' + transformed.join(' ')
  })
  
  return result
}

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

// Helper function to check if point is inside territory using accurate polygon detection
function isPointInTerritory(point: Point, territory: Territory): boolean {
  const polygonPoints = parsePathToPoints(territory.fillPath)
  if (polygonPoints.length < 3) {
    console.warn('Territory has less than 3 points:', territory.id, 'path:', territory.fillPath, 'parsed points:', polygonPoints)
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

interface MapCanvasProps {
  className?: string
}

export function MapCanvas({ className }: MapCanvasProps) {
  const store = useMapEditor()
  const { position, updatePosition, svgRef } = usePointerPosition(
    store.view.gridSize,
    store.drawing.snapToGrid
  )
  const { getSnappedPoint, getSnappedDrawingPoint, isSnappingEnabled } = useSnapping()
  
  const isDragging = useRef(false)
  const lastPan = useRef(store.view.pan)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [showZoomIndicator, setShowZoomIndicator] = useState(false)
  const [zoomDisplayTimer, setZoomDisplayTimer] = useState<NodeJS.Timeout | null>(null)
  
  // Gesture state to prevent confusion between pan and zoom
  const lastGestureType = useRef<'pan' | 'zoom' | null>(null)
  const gestureTimeout = useRef<NodeJS.Timeout | null>(null)
  const initialGestureScale = useRef<number>(1)
  const initialZoom = useRef<number>(1)
  const [gestureHint, setGestureHint] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const [gridType, setGridType] = useState<'lines' | 'dots'>('lines')
  
  // Territory table is managed by the store now
  
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
  
  // Snapping state
  const [snapIndicators, setSnapIndicators] = React.useState<SnapIndicator[]>([])
  
  // Duplicate preview state
  const [duplicatePreviewOffset, setDuplicatePreviewOffset] = React.useState<Point | null>(null)
  
  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{
    show: boolean
    x: number
    y: number
    territoryId: string | null
  }>({ show: false, x: 0, y: 0, territoryId: null })
  
  // Gesture handling
  const inertiaScroll = useInertiaScroll({
    friction: 0.92,
    minVelocity: 0.5,
    onUpdate: (deltaX, deltaY) => {
      store.setPan({
        x: store.view.pan.x - deltaX / store.view.zoom,
        y: store.view.pan.y - deltaY / store.view.zoom
      })
    }
  })
  
  // Enhanced smooth zoom controller
  const {
    wheelZoom,
    pinchZoom,
    setZoomLevel,
    instantPan,
    addPanMomentum,
    endGesture,
    currentZoom,
    targetZoom
  } = useSmoothZoomController({
    zoom: store.view.zoom,
    pan: store.view.pan,
    setZoom: store.setZoom,
    setPan: store.setPan
  })
  
  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    
    const resizeObserver = new ResizeObserver(updateSize)
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current)
    }
    
    return () => {
      window.removeEventListener('resize', updateSize)
      resizeObserver.disconnect()
    }
  }, [])
  
  // Track if user has used gestures (for hints)
  const hasUsedGestures = useRef({
    spacePan: false,
    trackpadPan: false,
    pinchZoom: false
  })
  
  const gesture = useGestureDetection({
    // Disabled - we handle wheel events directly in handleWheel
    onPan: () => {},
    onZoom: () => {},
    onGestureEnd: () => {},
    onSpacePanStart: () => {
      // Show hint for first-time space pan
      if (!hasUsedGestures.current.spacePan) {
        hasUsedGestures.current.spacePan = true
        setGestureHint({ show: true, message: 'Hold Space + drag to pan' })
      }
    }
  })
  
  // Shape placement preview
  const [shapePlacementPreview, setShapePlacementPreview] = React.useState<{ path: string; position: Point } | null>(null)
  
  // Handle pointer events based on current tool
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault() // Prevent default behaviors like text selection
    updatePosition(e)
    
    // Hide context menu on any click
    if (contextMenu.show) {
      setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
    }
    
    // Handle right-click for context menu
    if (e.button === 2) {
      const point = position.svg
      const clickedTerritory = Object.values(store.map.territories).reverse().find(territory => {
        return isPointInTerritory(point, territory)
      })
      
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setContextMenu({
          show: true,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          territoryId: clickedTerritory ? clickedTerritory.id : null
        })
      }
      return
    }
    
    // Handle shape placement mode
    if (store.templateLibrary.placementMode.active && e.button === 0) {
      const rawPoint = position.svg
      const { point: snappedPoint } = getSnappedPoint(rawPoint)
      store.placeShape(snappedPoint)
      setShapePlacementPreview(null)
      setSnapIndicators([])
      return
    }
    
    if (e.button === 1 || (e.button === 0 && e.shiftKey) || (e.button === 0 && store.tool === 'move') || (e.button === 0 && gesture.gestureState.isSpacePanning)) {
      // Middle mouse, Shift+left click, move tool, or Space+drag for pan
      isDragging.current = true
      lastPan.current = store.view.pan
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      e.currentTarget.setPointerCapture(e.pointerId)
      
      // Stop any ongoing inertia
      inertiaScroll.stopInertia()
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
        // Add vertex on edge - apply proper snapping
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
      
      // Check if clicking on any territory (selected or not)
      // Reverse the array to check topmost (last rendered) territories first
      const clickedTerritory = Object.values(store.map.territories).reverse().find(territory => {
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
      const rawPoint = position.svg
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
  }, [store, position, updatePosition, getSnappedPoint, gesture, inertiaScroll])
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isAreaSelecting.current) {
      e.preventDefault() // Prevent text selection during area select
    }
    updatePosition(e)
    
    if (isDragging.current) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      
      instantPan({
        x: lastPan.current.x - dx / store.view.zoom,
        y: lastPan.current.y - dy / store.view.zoom
      })
      
      // Track velocity for inertia
      gesture.handleMouseMove(e as unknown as MouseEvent)
    } else if (store.editing.isDraggingVertex && store.editing.draggedVertex !== null) {
      // Move vertex with snapping
      const rawPoint = position.svg
      const { point: snappedPoint, indicators } = getSnappedPoint(rawPoint)
      setSnapIndicators(indicators)
      store.updateVertexPosition(store.editing.draggedVertex, snappedPoint)
    } else if (store.editing.isDraggingHandle && store.editing.draggedHandle !== null) {
      // Move control handle
      const point = position.svg // Don't snap control handles to grid
      store.updateControlHandle(
        store.editing.draggedHandle.vertex,
        store.editing.draggedHandle.type,
        point
      )
    } else if (isMovingTerritories.current) {
      // Move selected territories with snapping
      const rawPos = position.svg
      
      // Calculate the center of all selected territories for snapping
      const selectedTerritories = Array.from(store.selection.territories)
        .map(id => store.map.territories[id])
        .filter(Boolean)
      
      if (selectedTerritories.length > 0) {
        // Calculate bounding box center of selection
        const bounds = {
          minX: Math.min(...selectedTerritories.map(t => t.center.x)),
          maxX: Math.max(...selectedTerritories.map(t => t.center.x)),
          minY: Math.min(...selectedTerritories.map(t => t.center.y)),
          maxY: Math.max(...selectedTerritories.map(t => t.center.y))
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
          
          // Apply snapping to the center, excluding selected territories
          const excludeIds = selectedTerritories.map(t => t.id)
          const { point: snappedCenter, indicators } = getSnappedPoint(potentialCenter, excludeIds)
          setSnapIndicators(indicators)
          
          // Calculate snapped deltas
          const snappedDeltaX = snappedCenter.x - selectionCenter.x
          const snappedDeltaY = snappedCenter.y - selectionCenter.y
          
          // Move territories with snapped deltas (only if not duplicating)
          if (selectedTerritories.length > 0) {
            if (!e.altKey) {
              store.moveTerritories(
                selectedTerritories.map(t => t.id), 
                snappedDeltaX, 
                snappedDeltaY
              )
              // Update start position based on snapped movement
              moveStartPos.current = {
                x: moveStartPos.current.x + snappedDeltaX,
                y: moveStartPos.current.y + snappedDeltaY
              }
              setDuplicatePreviewOffset(null)
            } else {
              // Show duplicate preview
              setDuplicatePreviewOffset({ x: snappedDeltaX, y: snappedDeltaY })
            }
          }
        }
      }
    } else if (store.drawing.isDraggingHandle && store.tool === 'pen') {
      // Update bezier handle during drag only when using pen tool
      const rawPoint = position.svg
      const previousPoint = store.drawing.bezierPath.length > 1 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 2] : undefined
      
      // Apply snapping for handle drag
      const { point: snappedPoint, indicators } = getSnappedDrawingPoint(rawPoint, previousPoint)
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
      
      areaSelectEnd.current = clampToCanvasBounds(position.svg, viewBounds)
    } else if (store.tool === 'pen' && store.drawing.isDrawing && !store.drawing.isDraggingHandle) {
      // Update snap indicators during pen tool movement when drawing
      const rawPoint = position.svg
      const previousPoint = store.drawing.bezierPath.length > 0 ? 
        store.drawing.bezierPath[store.drawing.bezierPath.length - 1] : undefined
      
      const { indicators } = getSnappedDrawingPoint(rawPoint, previousPoint)
      setSnapIndicators(indicators)
    } else if (store.tool === 'pen' && !store.drawing.isDrawing) {
      // Update snap indicators during pen tool movement when not drawing
      const rawPoint = position.svg
      const { indicators } = getSnappedPoint(rawPoint)
      setSnapIndicators(indicators)
    } else if (store.templateLibrary.placementMode.active && store.templateLibrary.placementMode.shapeId) {
      // Update shape placement preview
      const rawPoint = position.svg
      const { point: snappedPoint, indicators } = getSnappedPoint(rawPoint)
      setSnapIndicators(indicators)
      store.updateShapePreview(snappedPoint)
      
      // Generate preview path
      import('../shapes/ShapeLibrary').then(({ shapeLibrary }) => {
        const shape = shapeLibrary.getShape(store.templateLibrary.placementMode.shapeId!)
        if (shape) {
          const path = shapeLibrary.generateShapePath(shape)
          setShapePlacementPreview({
            path: moveSvgPath(path, snappedPoint.x - shape.defaultSize.width / 2, snappedPoint.y - shape.defaultSize.height / 2),
            position: snappedPoint
          })
        }
      })
    } else {
      // Clear snap indicators when not in a snapping mode
      if (snapIndicators.length > 0) {
        setSnapIndicators([])
      }
    }
  }, [store, updatePosition, position, getSnappedPoint, getSnappedDrawingPoint, gesture])
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
      
      // Inertia disabled to prevent bouncing
      // const velocity = gesture.getVelocity()
      // if (Math.abs(velocity.x) > 50 || Math.abs(velocity.y) > 50) {
      //   inertiaScroll.startInertia(velocity)
      // }
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
      
      store.selectTerritoriesInArea(start.x, start.y, end.x, end.y, e.ctrlKey || e.metaKey)
      
      // Reset area selection
      isAreaSelecting.current = false
      setShowAreaSelect(false)
      e.currentTarget.releasePointerCapture(e.pointerId)
    } else if (isMovingTerritories.current) {
      // Check if Alt/Option key is held for duplicate
      if (e.altKey && hasMoved.current) {
        // Calculate final offset for duplicate
        const finalDeltaX = position.svg.x - moveStartPos.current.x
        const finalDeltaY = position.svg.y - moveStartPos.current.y
        
        // Duplicate selected territories at the new position
        const selectedIds = Array.from(store.selection.territories)
        store.duplicateTerritories(selectedIds, { x: finalDeltaX, y: finalDeltaY })
      }
      
      // Complete territory movement
      isMovingTerritories.current = false
      setSnapIndicators([]) // Clear snap indicators
      setDuplicatePreviewOffset(null) // Clear duplicate preview
      e.currentTarget.releasePointerCapture(e.pointerId)
      
      // Reset hasMoved after a small delay to prevent onClick from firing on drag end
      setTimeout(() => {
        hasMoved.current = false
      }, 10)
    }
  }, [store, position, gesture, inertiaScroll])
  
  // Handle zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!containerSize.width || !containerSize.height) return
    
    // Check if the wheel event is happening over a panel
    const target = e.target as HTMLElement
    const isOverPanel = target.closest('[data-panel]') || 
                       target.closest('.z-50') || // Debug panel has z-50
                       target.closest('.z-40')    // Territory panel has z-40
    
    if (isOverPanel) {
      // Don't handle wheel events over panels
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    
    // Clear gesture timeout
    if (gestureTimeout.current) {
      clearTimeout(gestureTimeout.current)
    }
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const center = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    
    // Detect gesture type based on macOS trackpad behavior:
    // - Pinch zoom: ALWAYS has ctrlKey = true on macOS
    // - Two-finger scroll: No ctrlKey, ANY deltaX or deltaY
    // - Mouse wheel: Larger deltaY values (usually > 50), always integer, no deltaX
    
    const isPinchZoom = e.ctrlKey
    const hasHorizontalMovement = Math.abs(e.deltaX) > 0
    const hasFractionalDelta = (e.deltaY % 1 !== 0) || (e.deltaX % 1 !== 0)
    
    // Mouse wheels typically have larger delta values (> 50) and are always integers
    // Trackpad two-finger scrolls have smaller deltas and often (but not always) fractional
    const isLikelyMouseWheel = !isPinchZoom && 
                               !hasHorizontalMovement && 
                               !hasFractionalDelta && 
                               Math.abs(e.deltaY) > 50
    
    // IMPORTANT: If it's not a pinch zoom and not a mouse wheel, it's a two-finger pan
    const isTwoFingerPan = !isPinchZoom && !isLikelyMouseWheel
    
    
    // Determine gesture type, considering previous gesture for consistency
    let currentGesture: 'pan' | 'zoom' = isTwoFingerPan ? 'pan' : 'zoom'
    
    // If we recently did a different gesture, wait a bit before switching
    if (lastGestureType.current && lastGestureType.current !== currentGesture) {
      // Use previous gesture type for consistency during rapid movements
      currentGesture = lastGestureType.current
    }
    
    if (currentGesture === 'pan') {
      // Two-finger pan on trackpad - direct update, no momentum
      const deltaX = -e.deltaX
      const deltaY = -e.deltaY
      
      instantPan({
        x: store.view.pan.x - deltaX / store.view.zoom,
        y: store.view.pan.y - deltaY / store.view.zoom
      })
    } else {
      // Zoom (either pinch zoom or mouse wheel)
      const delta = -e.deltaY
      wheelZoom(delta, center, containerSize)
      
      // Show zoom indicator
      setShowZoomIndicator(true)
      if (zoomDisplayTimer) {
        clearTimeout(zoomDisplayTimer)
      }
      const timer = setTimeout(() => {
        setShowZoomIndicator(false)
      }, 2000)
      setZoomDisplayTimer(timer)
    }
    
    // Update last gesture type
    lastGestureType.current = currentGesture
    
    // Reset gesture type after a short delay
    gestureTimeout.current = setTimeout(() => {
      lastGestureType.current = null
    }, 100) // 100ms delay to prevent rapid switching
  }, [containerSize, wheelZoom, instantPan, store, store.view.zoom, store.view.pan])
  
  // Safari gesture events support (for better trackpad handling)
  const handleGestureStart = useCallback((e: any) => {
    e.preventDefault()
    lastGestureType.current = 'zoom'
    initialGestureScale.current = e.scale || 1
    initialZoom.current = store.view.zoom
  }, [store.view.zoom])
  
  const handleGestureChange = useCallback((e: any) => {
    e.preventDefault()
    if (!containerSize.width || !containerSize.height) return
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const center = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    
    // Calculate relative scale from the start of the gesture
    const relativeScale = e.scale / initialGestureScale.current
    const targetZoom = initialZoom.current * relativeScale
    
    // Set zoom directly to avoid cumulative multiplication
    setZoomLevel(targetZoom, center, containerSize)
  }, [containerSize, setZoomLevel])
  
  const handleGestureEnd = useCallback((e: any) => {
    e.preventDefault()
    lastGestureType.current = null
    // Trigger zoom momentum
    endGesture()
  }, [endGesture])
  
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
    
    // Add Safari gesture event listeners if available
    if ('GestureEvent' in window) {
      canvasElement.addEventListener('gesturestart', handleGestureStart as any)
      canvasElement.addEventListener('gesturechange', handleGestureChange as any)
      canvasElement.addEventListener('gestureend', handleGestureEnd as any)
    }
    
    return () => {
      canvasElement.removeEventListener('wheel', preventScroll)
      if ('GestureEvent' in window) {
        canvasElement.removeEventListener('gesturestart', handleGestureStart as any)
        canvasElement.removeEventListener('gesturechange', handleGestureChange as any)
        canvasElement.removeEventListener('gestureend', handleGestureEnd as any)
      }
    }
  }, [handleGestureStart, handleGestureChange, handleGestureEnd])

  // Handle double-click for editing
  const handleDoubleClick = useCallback((e: React.MouseEvent, territoryId: string) => {
    e.stopPropagation()
    e.preventDefault()
    if (store.tool === 'select') {
      store.startEditingTerritory(territoryId)
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
      
      // Check for Ctrl/Cmd shortcuts first
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'C') {
          // Copy selected territories
          e.preventDefault()
          if (store.selection.territories.size > 0) {
            store.copyTerritories(Array.from(store.selection.territories))
          }
        } else if (e.key === 'v' || e.key === 'V') {
          // Paste territories at current cursor position
          e.preventDefault()
          store.pasteTerritories(position.svg)
        } else if (e.key === 'd' || e.key === 'D') {
          // Duplicate selected territories with small offset
          e.preventDefault()
          if (store.selection.territories.size > 0) {
            store.duplicateTerritories(Array.from(store.selection.territories))
          }
        } else if (e.key === 's' || e.key === 'S') {
          // Ctrl/Cmd+S - could be used for save in the future
          e.preventDefault()
        }
      } else if (e.key === 'Escape') {
        if (store.templateLibrary.placementMode.active) {
          store.cancelShapePlacement()
          setShapePlacementPreview(null)
          setSnapIndicators([])
        } else if (store.editing.isEditing) {
          store.stopEditingTerritory()
        } else if (store.drawing.isDrawing) {
          store.cancelDrawing()
        } else {
          store.clearSelection()
        }
      } else if (e.key === 'Enter') {
        if (store.editing.isEditing) {
          store.stopEditingTerritory()
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
      } else if (e.key.toLowerCase() === 'd' && !store.editing.isEditing) {
        store.setTool('pen')
      } else if (e.key.toLowerCase() === 'h' && !store.editing.isEditing) {
        store.setTool('move')
      } else if (e.key.toLowerCase() === 'g') {
        if (e.shiftKey) {
          // Shift+G to toggle grid type
          setGridType(prev => prev === 'lines' ? 'dots' : 'lines')
        } else {
          // G to toggle grid visibility
          store.toggleGrid()
        }
      } else if (e.key.toLowerCase() === 's') {
        // Toggle snapping
        store.toggleSnapping()
      } else if (e.key.toLowerCase() === 'l' && !store.editing.isEditing) {
        // Toggle template library
        store.toggleTemplateLibrary()
      } else if (e.key.toLowerCase() === 't' && !store.editing.isEditing) {
        // Toggle territory table panel
        store.toggleTerritoryTable()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.editing.isEditing && store.editing.selectedVertices.size > 0) {
          // Delete selected vertices in editing mode
          // Sort indices in descending order to delete from end to start
          const indices = Array.from(store.editing.selectedVertices).sort((a, b) => b - a)
          indices.forEach(idx => store.deleteVertex(idx))
        } else if (!store.editing.isEditing) {
          // Delete selected territories
          store.selection.territories.forEach(id => store.deleteTerritory(id))
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
  }, [store, position.svg, setGridType])
  
  // Handle gesture keyboard events
  useEffect(() => {
    const handleGestureKeyDown = (e: KeyboardEvent) => {
      gesture.handleKeyDown(e)
    }
    
    const handleGestureKeyUp = (e: KeyboardEvent) => {
      gesture.handleKeyUp(e)
    }
    
    window.addEventListener('keydown', handleGestureKeyDown)
    window.addEventListener('keyup', handleGestureKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleGestureKeyDown)
      window.removeEventListener('keyup', handleGestureKeyUp)
    }
  }, [gesture])
  
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
      className={cn(
        "relative w-full h-full overflow-hidden bg-white",
        styles.canvas,
        gesture.isGesturing() && styles.gesturing,
        className
      )}
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
      onContextMenu={(e) => e.preventDefault()} // Prevent browser context menu
    >
      {/* Canvas grid layer - render as background below SVG */}
      {store.view.showGrid && containerSize.width > 0 && containerSize.height > 0 && (
        <HierarchicalGrid
          width={containerSize.width}
          height={containerSize.height}
          zoom={store.view.zoom}
          pan={store.view.pan}
          gridType={gridType}
        />
      )}
      
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        viewBox={viewBox}
        onPointerDown={(e) => {
          handlePointerDown(e)
          gesture.handleMouseDown(e.nativeEvent as MouseEvent)
        }}
        onPointerMove={(e) => {
          handlePointerMove(e)
          gesture.handleMouseMove(e.nativeEvent as MouseEvent)
        }}
        onPointerUp={(e) => {
          handlePointerUp(e)
          gesture.handleMouseUp()
        }}
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
          cursor: gesture.gestureState.isSpacePanning && !isDragging.current ? 'grab' :
                  isDragging.current ? 'grabbing' : 
                  isMovingTerritories.current ? 'grabbing' :
                  isAreaSelecting.current ? 'crosshair' :
                  store.tool === 'move' ? 'grab' :
                  store.tool === 'pen' ? 'crosshair' :
                  store.tool === 'select' ? 'default' :
                  'default'
        }}
      >
        {/* SVG Grid removed - now using Canvas HierarchicalGrid */}
        
        {/* Existing territories */}
        <g className="territories">
          {Object.values(store.map.territories)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)) // Sort by zIndex
            .map(territory => {
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
                style={{
                  opacity: store.editing.isEditing && store.editing.editingTerritoryId !== territory.id ? 0.3 : 1
                }}
                onClick={(e) => {
                  if (store.tool === 'select' && !hasMoved.current && !store.editing.isEditing) {
                    // Only handle click if we haven't just finished dragging
                    e.stopPropagation()
                    store.selectTerritory(territory.id, e.shiftKey)
                  }
                }}
                onDoubleClick={(e) => handleDoubleClick(e, territory.id)}
              />
            )
          })}
        </g>
        
        {/* Duplicate preview */}
        {duplicatePreviewOffset && store.selection.territories.size > 0 && (
          <g className="duplicate-preview" opacity="0.5">
            {Array.from(store.selection.territories).map(territoryId => {
              const territory = store.map.territories[territoryId]
              if (!territory) return null
              
              // Create a transformed path for the preview
              const transform = `translate(${duplicatePreviewOffset.x}, ${duplicatePreviewOffset.y})`
              
              return (
                <path
                  key={`preview-${territory.id}`}
                  d={territory.fillPath}
                  fill="#6366F1"
                  stroke="#6366F1"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  transform={transform}
                  className="pointer-events-none"
                />
              )
            })}
          </g>
        )}
        
        {/* Shape placement preview */}
        {shapePlacementPreview && (
          <g className="shape-placement-preview">
            <path
              d={shapePlacementPreview.path}
              fill="#6366F1"
              fillOpacity="0.2"
              stroke="#6366F1"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="pointer-events-none"
            />
            <circle
              cx={shapePlacementPreview.position.x}
              cy={shapePlacementPreview.position.y}
              r="4"
              fill="#6366F1"
              className="pointer-events-none"
            />
          </g>
        )}
        
        {/* Vertex editing visualization */}
        {store.editing.isEditing && store.editing.vertexPositions.length > 0 && (
          <g className="vertex-editing">
            {/* Territory edges - for visual feedback when adding vertices */}
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
              const rawPoint = position.svg
              
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
              const rawPoint = position.svg
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
              const rawPoint = position.svg
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
          const rawPoint = position.svg
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
        {position.svg.x}, {position.svg.y}
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
      
      {/* Zoom display - hide when zoom indicator is showing */}
      {!showZoomIndicator && (
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
          {Math.round(currentZoom * 100)}%
        </div>
      )}
      
      {/* Zoom indicator */}
      {showZoomIndicator && <ZoomIndicator zoom={currentZoom} />}
      
      {/* Gesture hint */}
      <GestureHint show={gestureHint.show} message={gestureHint.message} />
      
      {/* Center button */}
      <button
        onClick={() => {
          instantPan({ x: -450, y: -250 })
          setZoomLevel(1)
        }}
        className="absolute bottom-2 right-20 inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
        title="Center map (reset view)"
      >
        Center
      </button>
      
      {/* Snap indicator */}
      {isSnappingEnabled && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
            <rect x="1" y="1" width="4" height="4" fill="currentColor"/>
            <rect x="7" y="1" width="4" height="4" fill="currentColor"/>
            <rect x="1" y="7" width="4" height="4" fill="currentColor"/>
            <rect x="7" y="7" width="4" height="4" fill="currentColor"/>
          </svg>
          Snap ON (S)
        </div>
      )}
      
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
      
      {/* Territory Table Panel */}
      <TerritoryTablePanel 
        isOpen={store.territoryTable.isOpen}
        onClose={() => store.toggleTerritoryTable()}
      />
      
      {/* Debug Panel */}
      <DebugPanel />
      
      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {contextMenu.territoryId ? (
            // Territory-specific context menu
            <>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.bringToFront(contextMenu.territoryId!)
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
              <rect x="6" y="2" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
            </svg>
            Bring to Front
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.bringForward(contextMenu.territoryId!)
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
              <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
            </svg>
            Bring Forward
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.sendBackward(contextMenu.territoryId!)
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
              <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
            </svg>
            Send Backward
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.sendToBack(contextMenu.territoryId!)
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="6" y="2" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
              <rect x="2" y="6" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
            </svg>
            Send to Back
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.copyTerritories([contextMenu.territoryId!])
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="10" height="10" fill="none" stroke="#6B7280" strokeWidth="1.5"/>
              <rect x="4" y="4" width="10" height="10" fill="white" stroke="#3B82F6" strokeWidth="1.5"/>
            </svg>
            Copy
          </button>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              store.duplicateTerritories([contextMenu.territoryId!])
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="8" height="8" fill="none" stroke="#6B7280" strokeWidth="1.5"/>
              <rect x="6" y="6" width="8" height="8" fill="white" stroke="#3B82F6" strokeWidth="1.5"/>
            </svg>
            Duplicate
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
            onClick={() => {
              store.deleteTerritory(contextMenu.territoryId!)
              setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2V3H2V5H3V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V5H14V3H10V2H6ZM5 5H11V12H5V5ZM7 7V10H8V7H7ZM9 7V10H10V7H9Z" fill="#DC2626"/>
            </svg>
            Delete
          </button>
            </>
          ) : (
            // Canvas context menu (no territory selected)
            <>
              <button
                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${
                  store.clipboard && store.clipboard.territories.length > 0
                    ? 'hover:bg-gray-100'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (store.clipboard && store.clipboard.territories.length > 0) {
                    store.pasteTerritories(position.svg)
                    setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
                  }
                }}
                disabled={!store.clipboard || store.clipboard.territories.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="10" height="10" fill="none" stroke={store.clipboard && store.clipboard.territories.length > 0 ? '#6B7280' : '#D1D5DB'} strokeWidth="1.5"/>
                  <rect x="4" y="4" width="10" height="10" fill="white" stroke={store.clipboard && store.clipboard.territories.length > 0 ? '#3B82F6' : '#D1D5DB'} strokeWidth="1.5"/>
                  <path d="M6 8H12M6 10H12M6 12H10" stroke={store.clipboard && store.clipboard.territories.length > 0 ? '#3B82F6' : '#D1D5DB'} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Paste {store.clipboard && store.clipboard.territories.length > 0 ? `(${store.clipboard.territories.length} item${store.clipboard.territories.length > 1 ? 's' : ''})` : ''}
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  store.selectTerritoriesInArea(0, 0, 999999, 999999, false)
                  setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2"/>
                  <rect x="4" y="4" width="3" height="3" fill="#3B82F6"/>
                  <rect x="9" y="4" width="3" height="3" fill="#3B82F6"/>
                  <rect x="4" y="9" width="3" height="3" fill="#3B82F6"/>
                  <rect x="9" y="9" width="3" height="3" fill="#3B82F6"/>
                </svg>
                Select All
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  store.toggleGrid()
                  setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="2" y1="2" x2="14" y2="2" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="2" y1="6" x2="14" y2="6" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="2" y1="10" x2="14" y2="10" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="2" y1="14" x2="14" y2="14" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="2" y1="2" x2="2" y2="14" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="6" y1="2" x2="6" y2="14" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="10" y1="2" x2="10" y2="14" stroke="#6B7280" strokeWidth="1"/>
                  <line x1="14" y1="2" x2="14" y2="14" stroke="#6B7280" strokeWidth="1"/>
                </svg>
                {store.view.showGrid ? 'Hide Grid' : 'Show Grid'}
              </button>
              <button
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  store.toggleSnapping()
                  setContextMenu({ show: false, x: 0, y: 0, territoryId: null })
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" fill={isSnappingEnabled ? '#3B82F6' : '#D1D5DB'}/>
                  <rect x="9" y="2" width="5" height="5" fill={isSnappingEnabled ? '#3B82F6' : '#D1D5DB'}/>
                  <rect x="2" y="9" width="5" height="5" fill={isSnappingEnabled ? '#3B82F6' : '#D1D5DB'}/>
                  <rect x="9" y="9" width="5" height="5" fill={isSnappingEnabled ? '#3B82F6' : '#D1D5DB'}/>
                </svg>
                {isSnappingEnabled ? 'Disable Snapping' : 'Enable Snapping'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

