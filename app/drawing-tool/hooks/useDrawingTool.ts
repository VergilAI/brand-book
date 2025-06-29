"use client"

import { create } from 'zustand'
import { DrawingToolState, BezierPoint, Shape, Point } from '../types/drawing'
import { SnapState, SnapResult } from '../types/snapping'
import { getSnapCandidates, getAlignmentGuides, snapPointToAngle } from '../utils/snapping'

const createEmptyDocument = () => ({
  version: "1.0",
  metadata: {
    name: "Untitled Drawing",
    author: "Drawing Tool",
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  shapes: {},
  settings: {
    canvasWidth: 1000,
    canvasHeight: 1000,
    backgroundColor: '#FFFFFF'
  }
})

export const useDrawingTool = create<DrawingToolState>((set, get) => ({
  // Initial state
  document: createEmptyDocument(),
  
  selection: {
    shapes: new Set()
  },
  
  tool: 'select',
  
  drawing: {
    isDrawing: false,
    bezierPath: [],
    previewPath: '',
    autoClose: true,
    showControlPoints: true,
    isDraggingHandle: false,
    dragStartPoint: undefined
  },
  
  editing: {
    isEditing: false,
    editingShapeId: null,
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
  
  snapping: {
    activeSnaps: [],
    indicators: [],
    hoveredSnapTargets: new Set(),
    isSnapping: false,
    temporaryDisabled: false,
    settings: {
      enabled: true,
      vertexSnap: true,
      edgeSnap: true,
      centerSnap: true,
      gridSnap: false, // Grid snapping OFF by default
      guideSnap: true,
      snapDistance: 15,
      showSnapIndicators: true,
      angleSnap: true,
      angleSnapIncrement: 45
    }
  } as SnapState,
  
  // Tool actions
  setTool: (tool) => set({ tool }),
  
  // Shape actions
  updateShape: (id, updates) => set(state => ({
    document: {
      ...state.document,
      shapes: {
        ...state.document.shapes,
        [id]: {
          ...state.document.shapes[id],
          ...updates
        }
      },
      metadata: {
        ...state.document.metadata,
        modified: new Date().toISOString()
      }
    }
  })),
  
  addShape: (shape) => set(state => ({
    document: {
      ...state.document,
      shapes: {
        ...state.document.shapes,
        [shape.id]: shape
      },
      metadata: {
        ...state.document.metadata,
        modified: new Date().toISOString()
      }
    }
  })),
  
  deleteShape: (id) => set(state => {
    const { [id]: deleted, ...remainingShapes } = state.document.shapes
    const newSelection = new Set(state.selection.shapes)
    newSelection.delete(id)
    
    return {
      document: {
        ...state.document,
        shapes: remainingShapes,
        metadata: {
          ...state.document.metadata,
          modified: new Date().toISOString()
        }
      },
      selection: {
        shapes: newSelection
      }
    }
  }),
  
  // Selection actions
  selectShape: (id, multi = false) => set(state => {
    const newSelection = new Set(multi ? state.selection.shapes : [])
    
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    
    return {
      selection: {
        shapes: newSelection
      }
    }
  }),
  
  clearSelection: () => set(state => ({
    selection: {
      shapes: new Set()
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
      // Need at least 3 points for a valid shape
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
    
    // Create new shape
    const id = `shape-${Date.now()}`
    const path = bezierPathToSvgClosed(state.drawing.bezierPath)
    const centerPoints = state.drawing.bezierPath.map(bp => ({ x: bp.x, y: bp.y }))
    const center = calculateCenter(centerPoints)
    
    const newShape: Shape = {
      id,
      name: `Shape ${Object.keys(state.document.shapes).length + 1}`,
      fillPath: path,
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 1,
      center
    }
    
    set(state => ({
      document: {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [id]: newShape
        },
        metadata: {
          ...state.document.metadata,
          modified: new Date().toISOString()
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
        shapes: new Set([id])
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
  
  // Shape movement
  moveShapes: (shapeIds: string[], deltaX: number, deltaY: number) => set(state => {
    const updatedShapes = { ...state.document.shapes }
    
    shapeIds.forEach(id => {
      const shape = updatedShapes[id]
      if (shape) {
        // Move center point
        updatedShapes[id] = {
          ...shape,
          center: {
            x: shape.center.x + deltaX,
            y: shape.center.y + deltaY
          },
          // Move the path by transforming the SVG path
          fillPath: moveSvgPath(shape.fillPath, deltaX, deltaY)
        }
      }
    })
    
    return {
      document: {
        ...state.document,
        shapes: updatedShapes,
        metadata: {
          ...state.document.metadata,
          modified: new Date().toISOString()
        }
      }
    }
  }),
  
  // Area selection
  selectShapesInArea: (startX: number, startY: number, endX: number, endY: number, multi = false) => set(state => {
    const minX = Math.min(startX, endX)
    const maxX = Math.max(startX, endX)
    const minY = Math.min(startY, endY)
    const maxY = Math.max(startY, endY)
    
    const shapesInArea = Object.values(state.document.shapes).filter(shape => {
      const { x, y } = shape.center
      return x >= minX && x <= maxX && y >= minY && y <= maxY
    })
    
    const newSelection = new Set(multi ? state.selection.shapes : [])
    shapesInArea.forEach(shape => {
      if (newSelection.has(shape.id)) {
        newSelection.delete(shape.id)
      } else {
        newSelection.add(shape.id)
      }
    })
    
    return {
      selection: {
        shapes: newSelection
      }
    }
  }),
  
  // Editing actions
  startEditingShape: (shapeId) => set(state => {
    const shape = state.document.shapes[shapeId]
    if (!shape) return state
    
    // Parse the SVG path to extract vertices
    const vertexPositions = parseSvgPathToBezierPoints(shape.fillPath)
    
    return {
      editing: {
        ...state.editing,
        isEditing: true,
        editingShapeId: shapeId,
        selectedVertices: new Set(),
        vertexPositions
      },
      tool: 'select' // Switch to select tool when editing
    }
  }),
  
  stopEditingShape: () => set(state => {
    if (!state.editing.isEditing || !state.editing.editingShapeId) return state
    
    // Apply the edited vertices back to the shape
    const newPath = bezierPathToSvgClosed(state.editing.vertexPositions)
    const centerPoints = state.editing.vertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      document: {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath,
            center: newCenter
          }
        },
        metadata: {
          ...state.document.metadata,
          modified: new Date().toISOString()
        }
      },
      editing: {
        ...state.editing,
        isEditing: false,
        editingShapeId: null,
        selectedVertices: new Set(),
        vertexPositions: []
      }
    }
  }),
  
  updateVertexPosition: (vertexIndex, position) => set(state => {
    if (!state.editing.isEditing) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    if (vertexIndex >= 0 && vertexIndex < newVertexPositions.length) {
      const oldVertex = newVertexPositions[vertexIndex]
      const deltaX = position.x - oldVertex.x
      const deltaY = position.y - oldVertex.y
      
      // Create updated vertex with control points moved relatively
      const updatedVertex = {
        ...oldVertex,
        x: position.x,
        y: position.y,
        controlPoints: oldVertex.controlPoints ? {
          in: oldVertex.controlPoints.in ? {
            x: oldVertex.controlPoints.in.x + deltaX,
            y: oldVertex.controlPoints.in.y + deltaY
          } : undefined,
          out: oldVertex.controlPoints.out ? {
            x: oldVertex.controlPoints.out.x + deltaX,
            y: oldVertex.controlPoints.out.y + deltaY
          } : undefined
        } : {}
      }
      
      newVertexPositions[vertexIndex] = updatedVertex
    }
    
    // Update the shape in real-time
    const newPath = bezierPathToSvgClosed(newVertexPositions)
    const centerPoints = newVertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      document: state.editing.editingShapeId ? {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath,
            center: newCenter
          }
        }
      } : state.document
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
    
    // Update the shape in real-time
    const newPath = bezierPathToSvgClosed(newVertexPositions)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      document: state.editing.editingShapeId ? {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath
          }
        }
      } : state.document
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
  })),
  
  toggleVertexBezier: (vertexIndex) => set(state => {
    if (!state.editing.isEditing) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    if (vertexIndex >= 0 && vertexIndex < newVertexPositions.length) {
      const vertex = { ...newVertexPositions[vertexIndex] }
      
      if (!vertex.controlPoints || (!vertex.controlPoints.in && !vertex.controlPoints.out)) {
        // Convert to bezier - add control points
        const prevIndex = vertexIndex === 0 ? newVertexPositions.length - 1 : vertexIndex - 1
        const nextIndex = vertexIndex === newVertexPositions.length - 1 ? 0 : vertexIndex + 1
        const prevVertex = newVertexPositions[prevIndex]
        const nextVertex = newVertexPositions[nextIndex]
        
        vertex.controlPoints = {}
        
        // Calculate the angle between previous and next vertices
        const dx1 = vertex.x - prevVertex.x
        const dy1 = vertex.y - prevVertex.y
        const dx2 = nextVertex.x - vertex.x
        const dy2 = nextVertex.y - vertex.y
        
        // Calculate the tangent direction (perpendicular to the angle bisector)
        const angle1 = Math.atan2(dy1, dx1)
        const angle2 = Math.atan2(dy2, dx2)
        let tangentAngle = (angle1 + angle2) / 2
        
        // Handle the case where angles wrap around
        if (Math.abs(angle1 - angle2) > Math.PI) {
          tangentAngle += Math.PI
        }
        
        // Calculate control point distance based on neighboring vertices
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        const controlDist = Math.min(dist1, dist2) * 0.3
        
        // Create control points along the tangent
        vertex.controlPoints.in = {
          x: vertex.x - Math.cos(tangentAngle) * controlDist,
          y: vertex.y - Math.sin(tangentAngle) * controlDist
        }
        vertex.controlPoints.out = {
          x: vertex.x + Math.cos(tangentAngle) * controlDist,
          y: vertex.y + Math.sin(tangentAngle) * controlDist
        }
      } else {
        // Convert to straight - remove control points
        vertex.controlPoints = {}
      }
      
      newVertexPositions[vertexIndex] = vertex
    }
    
    // Update the shape in real-time
    const newPath = bezierPathToSvgClosed(newVertexPositions)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      document: state.editing.editingShapeId ? {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath
          }
        }
      } : state.document
    }
  }),
  
  addVertexOnEdge: (edgeIndex, position) => set(state => {
    if (!state.editing.isEditing) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    
    // Insert new vertex after the edge index
    const newVertex: BezierPoint = {
      x: position.x,
      y: position.y,
      type: 'anchor',
      controlPoints: {}
    }
    
    // Insert at the correct position
    newVertexPositions.splice(edgeIndex + 1, 0, newVertex)
    
    // Update the shape in real-time
    const newPath = bezierPathToSvgClosed(newVertexPositions)
    const centerPoints = newVertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions
      },
      document: state.editing.editingShapeId ? {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath,
            center: newCenter
          }
        }
      } : state.document
    }
  }),
  
  deleteVertex: (vertexIndex) => set(state => {
    if (!state.editing.isEditing) return state
    
    // Don't allow deletion if it would result in less than 3 vertices
    if (state.editing.vertexPositions.length <= 3) return state
    
    const newVertexPositions = [...state.editing.vertexPositions]
    newVertexPositions.splice(vertexIndex, 1)
    
    // Clear selection if the deleted vertex was selected
    const newSelection = new Set(state.editing.selectedVertices)
    newSelection.delete(vertexIndex)
    // Adjust indices of selected vertices after the deleted one
    const adjustedSelection = new Set<number>()
    newSelection.forEach(idx => {
      if (idx < vertexIndex) {
        adjustedSelection.add(idx)
      } else if (idx > vertexIndex) {
        adjustedSelection.add(idx - 1)
      }
    })
    
    // Update the shape in real-time
    const newPath = bezierPathToSvgClosed(newVertexPositions)
    const centerPoints = newVertexPositions.map(bp => ({ x: bp.x, y: bp.y }))
    const newCenter = calculateCenter(centerPoints)
    
    return {
      editing: {
        ...state.editing,
        vertexPositions: newVertexPositions,
        selectedVertices: adjustedSelection
      },
      document: state.editing.editingShapeId ? {
        ...state.document,
        shapes: {
          ...state.document.shapes,
          [state.editing.editingShapeId]: {
            ...state.document.shapes[state.editing.editingShapeId],
            fillPath: newPath,
            center: newCenter
          }
        }
      } : state.document
    }
  }),
  
  // Snapping actions
  updateSnapSettings: (settings) => set(state => ({
    snapping: {
      ...state.snapping,
      settings: {
        ...state.snapping.settings,
        ...settings
      }
    }
  })),
  
  toggleSnapping: () => set(state => ({
    snapping: {
      ...state.snapping,
      settings: {
        ...state.snapping.settings,
        enabled: !state.snapping.settings.enabled
      }
    }
  })),
  
  setTemporarySnapDisabled: (disabled) => set(state => ({
    snapping: {
      ...state.snapping,
      temporaryDisabled: disabled
    }
  }))
}))

// Helper functions
function calculateCenter(points: Point[]): Point {
  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }),
    { x: 0, y: 0 }
  )
  
  return {
    x: sum.x / points.length,
    y: sum.y / points.length
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

function bezierPathToSvgClosed(bezierPoints: BezierPoint[]): string {
  if (bezierPoints.length === 0) return ''
  if (bezierPoints.length === 1) return `M ${bezierPoints[0].x} ${bezierPoints[0].y}`
  
  let path = `M ${bezierPoints[0].x} ${bezierPoints[0].y}`
  
  // Add all segments
  for (let i = 1; i < bezierPoints.length; i++) {
    path += getBezierSegment(bezierPoints[i - 1], bezierPoints[i])
  }
  
  // Close the path with a segment from last to first
  path += getBezierSegment(bezierPoints[bezierPoints.length - 1], bezierPoints[0])
  path += ' Z'
  
  return path
}

function getBezierSegment(fromPoint: BezierPoint, toPoint: BezierPoint): string {
  // Check if we have control points for a curve
  const hasOutControl = fromPoint.controlPoints?.out
  const hasInControl = toPoint.controlPoints?.in
  
  if (hasOutControl && hasInControl) {
    // Cubic bezier curve - both control points available
    return ` C ${fromPoint.controlPoints!.out!.x} ${fromPoint.controlPoints!.out!.y}, ${toPoint.controlPoints!.in!.x} ${toPoint.controlPoints!.in!.y}, ${toPoint.x} ${toPoint.y}`
  } else if (hasOutControl && !hasInControl) {
    // Only from vertex has control point
    const cp = fromPoint.controlPoints!.out!
    // Calculate a mirrored control point for the to vertex
    const mirroredCp = {
      x: toPoint.x - (cp.x - fromPoint.x) * 0.5,
      y: toPoint.y - (cp.y - fromPoint.y) * 0.5
    }
    return ` C ${cp.x} ${cp.y}, ${mirroredCp.x} ${mirroredCp.y}, ${toPoint.x} ${toPoint.y}`
  } else if (!hasOutControl && hasInControl) {
    // Only to vertex has control point
    const cp = toPoint.controlPoints!.in!
    // Calculate a mirrored control point for the from vertex
    const mirroredCp = {
      x: fromPoint.x + (toPoint.x - cp.x) * 0.5,
      y: fromPoint.y + (toPoint.y - cp.y) * 0.5
    }
    return ` C ${mirroredCp.x} ${mirroredCp.y}, ${cp.x} ${cp.y}, ${toPoint.x} ${toPoint.y}`
  } else {
    // Straight line - neither vertex has control points
    return ` L ${toPoint.x} ${toPoint.y}`
  }
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
      // Cubic bezier curve - both control points available
      path += ` C ${previousPoint.controlPoints!.out!.x} ${previousPoint.controlPoints!.out!.y}, ${currentPoint.controlPoints!.in!.x} ${currentPoint.controlPoints!.in!.y}, ${currentPoint.x} ${currentPoint.y}`
    } else if (hasOutControl && !hasInControl) {
      // Only previous vertex has control point - use it twice for a smooth curve
      const cp = previousPoint.controlPoints!.out!
      // Calculate a mirrored control point for the current vertex
      const mirroredCp = {
        x: currentPoint.x - (cp.x - previousPoint.x) * 0.5,
        y: currentPoint.y - (cp.y - previousPoint.y) * 0.5
      }
      path += ` C ${cp.x} ${cp.y}, ${mirroredCp.x} ${mirroredCp.y}, ${currentPoint.x} ${currentPoint.y}`
    } else if (!hasOutControl && hasInControl) {
      // Only current vertex has control point - use it twice for a smooth curve
      const cp = currentPoint.controlPoints!.in!
      // Calculate a mirrored control point for the previous vertex
      const mirroredCp = {
        x: previousPoint.x + (currentPoint.x - cp.x) * 0.5,
        y: previousPoint.y + (currentPoint.y - cp.y) * 0.5
      }
      path += ` C ${mirroredCp.x} ${mirroredCp.y}, ${cp.x} ${cp.y}, ${currentPoint.x} ${currentPoint.y}`
    } else {
      // Straight line - neither vertex has control points
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