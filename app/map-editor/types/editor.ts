// Core types for the map editor

import type { MapData, Territory, Border, Point } from '@/lib/lms/optimized-map-data'

export type ToolType = 'select' | 'pen' | 'border' | 'connect' | 'move'

export interface BezierPoint extends Point {
  type: 'anchor'
  controlPoints: {
    in?: Point
    out?: Point
  }
}

export interface DrawingState {
  isDrawing: boolean
  bezierPath: BezierPoint[]
  previewPath: string
  snapToGrid: boolean
  autoClose: boolean
  showControlPoints: boolean
  isDraggingHandle: boolean
  dragStartPoint?: Point
}

export interface SelectionState {
  territories: Set<string>
  borders: Set<string>
}

export interface ViewState {
  zoom: number
  pan: Point
  showGrid: boolean
  gridSize: number
}

export interface EditingState {
  isEditing: boolean
  editingTerritoryId: string | null
  selectedVertices: Set<number>
  isDraggingVertex: boolean
  isDraggingHandle: boolean
  draggedVertex: number | null
  draggedHandle: { vertex: number, type: 'in' | 'out' } | null
  vertexPositions: BezierPoint[]
}

export interface MapEditorState {
  // Map data
  map: MapData
  
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
  
  // Actions
  setTool: (tool: ToolType) => void
  updateTerritory: (id: string, updates: Partial<Territory>) => void
  addTerritory: (territory: Territory) => void
  deleteTerritory: (id: string) => void
  selectTerritory: (id: string, multi?: boolean) => void
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
  setSnapToGrid: (snap: boolean) => void
  
  // Territory movement and area selection
  moveTerritories: (territoryIds: string[], deltaX: number, deltaY: number) => void
  selectTerritoriesInArea: (startX: number, startY: number, endX: number, endY: number, multi?: boolean) => void
  
  // Editing actions
  startEditingTerritory: (territoryId: string) => void
  stopEditingTerritory: () => void
  updateVertexPosition: (vertexIndex: number, position: Point) => void
  updateControlHandle: (vertexIndex: number, handleType: 'in' | 'out', position: Point) => void
  selectVertex: (vertexIndex: number, multi?: boolean) => void
  clearVertexSelection: () => void
  startDraggingVertex: (vertexIndex: number) => void
  startDraggingControlHandle: (vertexIndex: number, handleType: 'in' | 'out') => void
  endDragging: () => void
}

export interface PointerPosition {
  screen: Point // Screen coordinates
  svg: Point    // SVG coordinates
  grid: Point   // Snapped to grid
}