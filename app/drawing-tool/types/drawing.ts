// Core types for the drawing tool

import type { SnapState } from './snapping'

export interface Point {
  x: number
  y: number
}

export type ToolType = 'select' | 'pen' | 'move'

export interface BezierPoint extends Point {
  type: 'anchor'
  controlPoints: {
    in?: Point
    out?: Point
  }
}

export interface Shape {
  id: string
  name: string
  fillPath: string
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  center: Point
}

export interface DrawingState {
  isDrawing: boolean
  bezierPath: BezierPoint[]
  previewPath: string
  autoClose: boolean
  showControlPoints: boolean
  isDraggingHandle: boolean
  dragStartPoint?: Point
}

export interface EditingState {
  isEditing: boolean
  editingShapeId: string | null
  selectedVertices: Set<number>
  isDraggingVertex: boolean
  isDraggingHandle: boolean
  draggedVertex: number | null
  draggedHandle: { vertex: number, type: 'in' | 'out' } | null
  vertexPositions: BezierPoint[]
}

export interface SelectionState {
  shapes: Set<string>
}

export interface ViewState {
  zoom: number
  pan: Point
  showGrid: boolean
  gridSize: number
}

export interface DrawingDocument {
  version: string
  metadata: {
    name: string
    author: string
    created: string
    modified: string
  }
  shapes: Record<string, Shape>
  settings: {
    canvasWidth: number
    canvasHeight: number
    backgroundColor: string
  }
}

export interface DrawingToolState {
  // Document data
  document: DrawingDocument
  
  // Selection
  selection: SelectionState
  
  // Active tool
  tool: ToolType
  
  // Drawing state
  drawing: DrawingState
  
  // Editing state
  editing: EditingState
  
  // View state
  view: ViewState
  
  // Snapping state
  snapping: SnapState
  
  // Actions
  setTool: (tool: ToolType) => void
  updateShape: (id: string, updates: Partial<Shape>) => void
  addShape: (shape: Shape) => void
  deleteShape: (id: string) => void
  selectShape: (id: string, multi?: boolean) => void
  clearSelection: () => void
  
  // Drawing actions
  startDrawing: (point: Point) => void
  addBezierPoint: (point: Point, controlOut?: Point) => void
  finishDrawing: () => void
  cancelDrawing: () => void
  setShowControlPoints: (show: boolean) => void
  updateBezierControlPoint: (pointIndex: number, controlType: 'in' | 'out', position: Point) => void
  startDraggingHandle: (point: Point) => void
  updateDragHandle: (point: Point) => void
  endDraggingHandle: (point: Point) => void
  
  // View actions
  setZoom: (zoom: number) => void
  setPan: (pan: Point) => void
  toggleGrid: () => void
  setGridSize: (size: number) => void
  
  // Shape movement and area selection
  moveShapes: (shapeIds: string[], deltaX: number, deltaY: number) => void
  selectShapesInArea: (startX: number, startY: number, endX: number, endY: number, multi?: boolean) => void
  
  // Editing actions
  startEditingShape: (shapeId: string) => void
  stopEditingShape: () => void
  updateVertexPosition: (vertexIndex: number, position: Point) => void
  updateControlHandle: (vertexIndex: number, handleType: 'in' | 'out', position: Point) => void
  selectVertex: (vertexIndex: number, multi?: boolean) => void
  clearVertexSelection: () => void
  startDraggingVertex: (vertexIndex: number) => void
  startDraggingControlHandle: (vertexIndex: number, handleType: 'in' | 'out') => void
  endDragging: () => void
  toggleVertexBezier: (vertexIndex: number) => void
  addVertexOnEdge: (edgeIndex: number, position: Point) => void
  deleteVertex: (vertexIndex: number) => void
  
  // Snapping actions
  updateSnapSettings: (settings: Partial<SnapState['settings']>) => void
  toggleSnapping: () => void
  setTemporarySnapDisabled: (disabled: boolean) => void
}

export interface PointerPosition {
  screen: Point // Screen coordinates
  svg: Point    // SVG coordinates
}