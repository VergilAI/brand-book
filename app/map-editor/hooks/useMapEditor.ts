"use client"

import { create } from 'zustand'
import { MapEditorState, BezierPoint } from '../types/editor'
import type { Territory, Point } from '@/lib/lms/optimized-map-data'

const createEmptyMap = () => ({
  version: "1.0",
  metadata: {
    name: "New Map",
    author: "Map Editor",
    created: new Date().toISOString()
  },
  territories: {},
  borders: {},
  continents: {}
})

export const useMapEditor = create<MapEditorState>((set, get) => ({
  // Initial state
  map: createEmptyMap(),
  
  selection: {
    territories: new Set(),
    borders: new Set()
  },
  
  tool: 'select',
  
  drawing: {
    isDrawing: false,
    bezierPath: [],
    previewPath: '',
    snapToGrid: true,
    autoClose: true,
    showControlPoints: true,
    isDraggingHandle: false,
    dragStartPoint: undefined
  },
  
  editing: {
    isEditing: false,
    editingTerritoryId: null,
    selectedVertices: new Set(),
    isDraggingVertex: false,
    isDraggingHandle: false,
    draggedVertex: null,
    draggedHandle: null,
    vertexPositions: []
  },
  
  view: {
    zoom: 1,
    pan: { x: -450, y: -250 }, // Center the initial view
    showGrid: true,
    gridSize: 10
  },
  
  // Tool actions
  setTool: (tool) => set({ tool }),
  
  // Territory actions
  updateTerritory: (id, updates) => set(state => ({
    map: {
      ...state.map,
      territories: {
        ...state.map.territories,
        [id]: {
          ...state.map.territories[id],
          ...updates
        }
      }
    }
  })),
  
  addTerritory: (territory) => set(state => ({
    map: {
      ...state.map,
      territories: {
        ...state.map.territories,
        [territory.id]: territory
      }
    }
  })),
  
  deleteTerritory: (id) => set(state => {
    const { [id]: deleted, ...remainingTerritories } = state.map.territories
    const newSelection = new Set(state.selection.territories)
    newSelection.delete(id)
    
    return {
      map: {
        ...state.map,
        territories: remainingTerritories
      },
      selection: {
        ...state.selection,
        territories: newSelection
      }
    }
  }),
  
  // Selection actions
  selectTerritory: (id, multi = false) => set(state => {
    const newSelection = new Set(multi ? state.selection.territories : [])
    
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    
    return {
      selection: {
        ...state.selection,
        territories: newSelection
      }
    }
  }),
  
  clearSelection: () => set(state => ({
    selection: {
      territories: new Set(),
      borders: new Set()
    }
  })),
  
  // Drawing actions
  startDrawing: (point) => set(state => {
    const bezierPoint: BezierPoint = {
      ...point,
      type: 'anchor',
      controlPoints: {}
    }
    return {
      drawing: {
        ...state.drawing,
        isDrawing: true,
        bezierPath: [bezierPoint],
        previewPath: `M ${point.x} ${point.y}`
      }
    }
  }),
  
  addBezierPoint: (point, controlOut) => set(state => {
    const bezierPoint: BezierPoint = {
      ...point,
      type: 'anchor',
      controlPoints: controlOut ? { out: controlOut } : {}
    }
    
    const newBezierPath = [...state.drawing.bezierPath, bezierPoint]
    
    return {
      drawing: {
        ...state.drawing,
        bezierPath: newBezierPath,
        previewPath: bezierPathToSvg(newBezierPath)
      }
    }
  }),
  
  finishDrawing: () => {
    const state = get()
    
    // Check if we have enough points
    if (state.drawing.bezierPath.length < 3) {
      // Need at least 3 points for a valid territory
      set(state => ({
        drawing: {
          ...state.drawing,
          isDrawing: false,
          bezierPath: [],
          previewPath: '',
          isDraggingHandle: false,
          dragStartPoint: undefined
        }
      }))
      return
    }
    
    // Create new territory
    const id = `territory-${Date.now()}`
    const path = bezierPathToSvg(state.drawing.bezierPath) + ' Z' // Close the path
    const centerPoints = state.drawing.bezierPath.map(bp => ({ x: bp.x, y: bp.y }))
    const center = calculateCenter(centerPoints)
    
    const newTerritory: Territory = {
      id,
      name: `Territory ${Object.keys(state.map.territories).length + 1}`,
      continent: 'unassigned',
      center,
      fillPath: path,
      borderSegments: []
    }
    
    set(state => ({
      map: {
        ...state.map,
        territories: {
          ...state.map.territories,
          [id]: newTerritory
        }
      },
      drawing: {
        ...state.drawing,
        isDrawing: false,
        bezierPath: [],
        previewPath: '',
        isDraggingHandle: false,
        dragStartPoint: undefined
      },
      tool: 'select',
      selection: {
        territories: new Set([id]),
        borders: new Set()
      }
    }))
  },
  
  cancelDrawing: () => set(state => ({
    drawing: {
      ...state.drawing,
      isDrawing: false,
      bezierPath: [],
      previewPath: '',
      isDraggingHandle: false,
      dragStartPoint: undefined
    }
  })),
  
  // View actions
  setZoom: (zoom) => set(state => ({
    view: { ...state.view, zoom }
  })),
  
  setPan: (pan) => set(state => ({
    view: { ...state.view, pan }
  })),
  
  toggleGrid: () => set(state => ({
    view: { ...state.view, showGrid: !state.view.showGrid }
  })),
  
  setGridSize: (gridSize) => set(state => ({
    view: { ...state.view, gridSize }
  })),
  
  // Drawing settings
  setSnapToGrid: (snapToGrid) => set(state => ({
    drawing: { ...state.drawing, snapToGrid }
  })),
  
  setShowControlPoints: (showControlPoints) => set(state => ({
    drawing: { ...state.drawing, showControlPoints }
  })),
  
  updateBezierControlPoint: (pointIndex, controlType, position) => set(state => {
    const newBezierPath = [...state.drawing.bezierPath]
    const point = newBezierPath[pointIndex]
    if (point) {
      if (!point.controlPoints) {
        point.controlPoints = {}
      }
      point.controlPoints[controlType] = position
      newBezierPath[pointIndex] = point
    }
    
    return {
      drawing: {
        ...state.drawing,
        bezierPath: newBezierPath,
        previewPath: bezierPathToSvg(newBezierPath)
      }
    }
  }),
  
  // Handle dragging for bezier control points
  startDraggingHandle: (point) => set(state => ({
    drawing: {
      ...state.drawing,
      isDraggingHandle: true,
      dragStartPoint: point
    }
  })),
  
  updateDragHandle: (point) => set(state => {
    if (!state.drawing.isDraggingHandle || !state.drawing.dragStartPoint) {
      return state
    }
    
    // Calculate control point offset from the anchor point
    const dragStart = state.drawing.dragStartPoint
    const offset = {
      x: point.x - dragStart.x,
      y: point.y - dragStart.y
    }
    
    // Update the last point's out control handle
    const newBezierPath = [...state.drawing.bezierPath]
    const lastIndex = newBezierPath.length - 1
    if (lastIndex >= 0) {
      const lastPoint = { ...newBezierPath[lastIndex] }
      if (!lastPoint.controlPoints) {
        lastPoint.controlPoints = {}
      }
      lastPoint.controlPoints.out = {
        x: dragStart.x + offset.x,
        y: dragStart.y + offset.y
      }
      // Also set symmetric in control for next point
      lastPoint.controlPoints.in = {
        x: dragStart.x - offset.x,
        y: dragStart.y - offset.y
      }
      newBezierPath[lastIndex] = lastPoint
    }
    
    return {
      drawing: {
        ...state.drawing,
        bezierPath: newBezierPath,
        previewPath: bezierPathToSvg(newBezierPath)
      }
    }
  }),
  
  endDraggingHandle: (point) => set(state => {
    // Just finish dragging, don't add a new point (it was already added on pointer down)
    return {
      drawing: {
        ...state.drawing,
        isDraggingHandle: false,
        dragStartPoint: undefined
      }
    }
  }),
  
  // Territory movement
  moveTerritories: (territoryIds: string[], deltaX: number, deltaY: number) => set(state => {
    const updatedTerritories = { ...state.map.territories }
    
    territoryIds.forEach(id => {
      const territory = updatedTerritories[id]
      if (territory) {
        // Move center point
        updatedTerritories[id] = {
          ...territory,
          center: {
            x: territory.center.x + deltaX,
            y: territory.center.y + deltaY
          },
          // Move the path by transforming the SVG path
          fillPath: moveSvgPath(territory.fillPath, deltaX, deltaY)
        }
      }
    })
    
    return {
      map: {
        ...state.map,
        territories: updatedTerritories
      }
    }
  }),
  
  // Area selection
  selectTerritoriesInArea: (startX: number, startY: number, endX: number, endY: number, multi = false) => set(state => {
    const minX = Math.min(startX, endX)
    const maxX = Math.max(startX, endX)
    const minY = Math.min(startY, endY)
    const maxY = Math.max(startY, endY)
    
    const territoriesInArea = Object.values(state.map.territories).filter(territory => {
      const { x, y } = territory.center
      return x >= minX && x <= maxX && y >= minY && y <= maxY
    })
    
    const newSelection = new Set(multi ? state.selection.territories : [])
    territoriesInArea.forEach(territory => {
      if (newSelection.has(territory.id)) {
        newSelection.delete(territory.id)
      } else {
        newSelection.add(territory.id)
      }
    })
    
    return {
      selection: {
        ...state.selection,
        territories: newSelection
      }
    }
  }),
  
  // Editing actions
  startEditingTerritory: (territoryId) => set(state => {
    const territory = state.map.territories[territoryId]
    if (!territory) return state
    
    // Parse the SVG path to extract vertices
    const vertexPositions = parseSvgPathToBezierPoints(territory.fillPath)
    
    return {
      editing: {
        ...state.editing,
        isEditing: true,
        editingTerritoryId: territoryId,
        selectedVertices: new Set(),
        vertexPositions
      },
      tool: 'select' // Switch to select tool when editing
    }
  }),
  
  stopEditingTerritory: () => set(state => {
    if (!state.editing.isEditing || !state.editing.editingTerritoryId) return state
    
    // Apply the edited vertices back to the territory
    const newPath = bezierPathToSvg(state.editing.vertexPositions) + ' Z'
    const centerPoints = state.editing.vertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      map: {
        ...state.map,
        territories: {
          ...state.map.territories,
          [state.editing.editingTerritoryId]: {
            ...state.map.territories[state.editing.editingTerritoryId],
            fillPath: newPath,
            center: newCenter
          }
        }
      },
      editing: {
        ...state.editing,
        isEditing: false,
        editingTerritoryId: null,
        selectedVertices: new Set(),
        vertexPositions: []
      }
    }
  }),
  
  updateVertexPosition: (vertexIndex, position) => set(state => {
    if (!state.editing.isEditing) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    if (vertexIndex >= 0 && vertexIndex < newVertexPositions.length) {
      newVertexPositions[vertexIndex] = {
        ...newVertexPositions[vertexIndex],
        x: position.x,
        y: position.y
      }
    }
    
    // Update the territory in real-time
    const newPath = bezierPathToSvg(newVertexPositions) + ' Z'
    const centerPoints = newVertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      map: state.editing.editingTerritoryId ? {
        ...state.map,
        territories: {
          ...state.map.territories,
          [state.editing.editingTerritoryId]: {
            ...state.map.territories[state.editing.editingTerritoryId],
            fillPath: newPath,
            center: newCenter
          }
        }
      } : state.map
    }
  }),
  
  updateControlHandle: (vertexIndex, handleType, position) => set(state => {
    if (!state.editing.isEditing) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    if (vertexIndex >= 0 && vertexIndex < newVertexPositions.length) {
      const vertex = { ...newVertexPositions[vertexIndex] }
      if (!vertex.controlPoints) {
        vertex.controlPoints = {}
      }
      vertex.controlPoints[handleType] = position
      newVertexPositions[vertexIndex] = vertex
    }
    
    // Update the territory in real-time
    const newPath = bezierPathToSvg(newVertexPositions) + ' Z'
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      map: state.editing.editingTerritoryId ? {
        ...state.map,
        territories: {
          ...state.map.territories,
          [state.editing.editingTerritoryId]: {
            ...state.map.territories[state.editing.editingTerritoryId],
            fillPath: newPath
          }
        }
      } : state.map
    }
  }),
  
  selectVertex: (vertexIndex, multi = false) => set(state => {
    const newSelection = new Set(multi ? state.editing.selectedVertices : [])
    
    if (newSelection.has(vertexIndex)) {
      newSelection.delete(vertexIndex)
    } else {
      newSelection.add(vertexIndex)
    }
    
    return {
      editing: {
        ...state.editing,
        selectedVertices: newSelection
      }
    }
  }),
  
  clearVertexSelection: () => set(state => ({
    editing: {
      ...state.editing,
      selectedVertices: new Set()
    }
  })),
  
  startDraggingVertex: (vertexIndex) => set(state => ({
    editing: {
      ...state.editing,
      isDraggingVertex: true,
      draggedVertex: vertexIndex
    }
  })),
  
  startDraggingControlHandle: (vertexIndex, handleType) => set(state => ({
    editing: {
      ...state.editing,
      isDraggingHandle: true,
      draggedHandle: { vertex: vertexIndex, type: handleType }
    }
  })),
  
  endDragging: () => set(state => ({
    editing: {
      ...state.editing,
      isDraggingVertex: false,
      isDraggingHandle: false,
      draggedVertex: null,
      draggedHandle: null
    }
  }))
}))

// Helper functions
function pathToSvg(points: Point[], close = false): string {
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  
  if (close) {
    path += ' Z'
  }
  
  return path
}

function calculateCenter(points: Point[]): Point {
  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }),
    { x: 0, y: 0 }
  )
  
  return {
    x: Math.round(sum.x / points.length),
    y: Math.round(sum.y / points.length)
  }
}

function moveSvgPath(path: string, deltaX: number, deltaY: number): string {
  // SVG path transformation - moves all coordinates by delta
  // Use regex to match commands and their parameters
  const result = path.replace(/([MLHVCSQTAZ])\s*((?:[-\d.]+\s*,?\s*)+)/gi, (match, command, params) => {
    const cmd = command.toUpperCase()
    
    // Handle commands that don't have coordinates
    if (cmd === 'Z') {
      return command
    }
    
    // Split parameters into numbers
    const numbers = params.match(/[-\d.]+/g) || []
    const transformed: string[] = []
    
    // Transform coordinates based on command type
    switch (cmd) {
      case 'M': // moveto (x y)
      case 'L': // lineto (x y)
        for (let i = 0; i < numbers.length; i += 2) {
          transformed.push((parseFloat(numbers[i]) + deltaX).toString())
          if (i + 1 < numbers.length) {
            transformed.push((parseFloat(numbers[i + 1]) + deltaY).toString())
          }
        }
        break
        
      case 'C': // cubic bezier (x1 y1 x2 y2 x y)
        for (let i = 0; i < numbers.length; i += 2) {
          transformed.push((parseFloat(numbers[i]) + deltaX).toString())
          if (i + 1 < numbers.length) {
            transformed.push((parseFloat(numbers[i + 1]) + deltaY).toString())
          }
        }
        break
        
      case 'Q': // quadratic bezier (x1 y1 x y)
      case 'S': // smooth cubic bezier (x2 y2 x y)
      case 'T': // smooth quadratic bezier (x y)
        for (let i = 0; i < numbers.length; i += 2) {
          transformed.push((parseFloat(numbers[i]) + deltaX).toString())
          if (i + 1 < numbers.length) {
            transformed.push((parseFloat(numbers[i + 1]) + deltaY).toString())
          }
        }
        break
        
      case 'H': // horizontal lineto (x)
        for (const num of numbers) {
          transformed.push((parseFloat(num) + deltaX).toString())
        }
        break
        
      case 'V': // vertical lineto (y)
        for (const num of numbers) {
          transformed.push((parseFloat(num) + deltaY).toString())
        }
        break
        
      case 'A': // arc (rx ry x-axis-rotation large-arc-flag sweep-flag x y)
        for (let i = 0; i < numbers.length; i += 7) {
          // First 5 parameters are not coordinates
          transformed.push(numbers[i]) // rx
          transformed.push(numbers[i + 1]) // ry
          transformed.push(numbers[i + 2]) // x-axis-rotation
          transformed.push(numbers[i + 3]) // large-arc-flag
          transformed.push(numbers[i + 4]) // sweep-flag
          // Last 2 are coordinates
          transformed.push((parseFloat(numbers[i + 5]) + deltaX).toString()) // x
          transformed.push((parseFloat(numbers[i + 6]) + deltaY).toString()) // y
        }
        break
    }
    
    return command + ' ' + transformed.join(' ')
  })
  
  return result
}

function bezierPathToSvg(bezierPoints: BezierPoint[]): string {
  if (bezierPoints.length === 0) return ''
  if (bezierPoints.length === 1) return `M ${bezierPoints[0].x} ${bezierPoints[0].y}`
  
  let path = `M ${bezierPoints[0].x} ${bezierPoints[0].y}`
  
  for (let i = 1; i < bezierPoints.length; i++) {
    const currentPoint = bezierPoints[i]
    const previousPoint = bezierPoints[i - 1]
    
    // Check if we have control points for a curve
    const hasOutControl = previousPoint.controlPoints?.out
    const hasInControl = currentPoint.controlPoints?.in
    
    if (hasOutControl && hasInControl) {
      // Cubic bezier curve
      path += ` C ${previousPoint.controlPoints!.out!.x} ${previousPoint.controlPoints!.out!.y}, ${currentPoint.controlPoints!.in!.x} ${currentPoint.controlPoints!.in!.y}, ${currentPoint.x} ${currentPoint.y}`
    } else if (hasOutControl || hasInControl) {
      // Quadratic bezier curve
      const controlPoint = hasOutControl ? previousPoint.controlPoints!.out! : currentPoint.controlPoints!.in!
      path += ` Q ${controlPoint.x} ${controlPoint.y}, ${currentPoint.x} ${currentPoint.y}`
    } else {
      // Straight line
      path += ` L ${currentPoint.x} ${currentPoint.y}`
    }
  }
  
  return path
}

function parseSvgPathToBezierPoints(pathString: string): BezierPoint[] {
  const bezierPoints: BezierPoint[] = []
  let currentX = 0
  let currentY = 0
  let lastControlPoint: Point | null = null
  
  // Match all path commands
  const commandRegex = /([MLCQZ])\s*([^MLCQZ]*)/gi
  let match
  
  while ((match = commandRegex.exec(pathString)) !== null) {
    const command = match[1].toUpperCase()
    const coordsStr = match[2].trim()
    
    if (command === 'Z') {
      continue // Close path, no new points
    }
    
    const coords = coordsStr.split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n))
    
    switch (command) {
      case 'M': // Move to
      case 'L': // Line to
        if (coords.length >= 2) {
          currentX = coords[0]
          currentY = coords[1]
          bezierPoints.push({
            x: currentX,
            y: currentY,
            type: 'anchor',
            controlPoints: {}
          })
        }
        break
        
      case 'C': // Cubic bezier
        if (coords.length >= 6) {
          // Add control point to previous point
          if (bezierPoints.length > 0) {
            const lastPoint = bezierPoints[bezierPoints.length - 1]
            lastPoint.controlPoints.out = { x: coords[0], y: coords[1] }
          }
          
          // Create new point with in control
          currentX = coords[4]
          currentY = coords[5]
          bezierPoints.push({
            x: currentX,
            y: currentY,
            type: 'anchor',
            controlPoints: {
              in: { x: coords[2], y: coords[3] }
            }
          })
        }
        break
        
      case 'Q': // Quadratic bezier
        if (coords.length >= 4) {
          // Convert quadratic to cubic for consistency
          const controlX = coords[0]
          const controlY = coords[1]
          currentX = coords[2]
          currentY = coords[3]
          
          if (bezierPoints.length > 0) {
            const lastPoint = bezierPoints[bezierPoints.length - 1]
            lastPoint.controlPoints.out = { x: controlX, y: controlY }
          }
          
          bezierPoints.push({
            x: currentX,
            y: currentY,
            type: 'anchor',
            controlPoints: {
              in: { x: controlX, y: controlY }
            }
          })
        }
        break
    }
  }
  
  return bezierPoints
}