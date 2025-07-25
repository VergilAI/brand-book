// Core types for the map editor

import type { MapData, Territory, Border, Point } from '@/lib/lms/optimized-map-data'

// Re-export Point for external use
export type { Point }
import type { SnapState } from './snapping'
import type { TemplateLibraryState } from './template-library'

export type ToolType = 'select' | 'pen' | 'connect' | 'move'

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

export interface ClipboardState {
  territories: Territory[]
  offset: Point // Offset from original position for smart paste
}

export interface TerritoryTableState {
  isOpen: boolean
  activeTab: 'territories' | 'continents'
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
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
  
  // Edit mode (view-only vs editable)
  editMode: 'view' | 'edit'
  
  // Snapping state
  snapping: SnapState
  
  // Clipboard state
  clipboard: ClipboardState | null
  
  // Template library state
  templateLibrary: TemplateLibraryState
  
  // Territory table state
  territoryTable: TerritoryTableState
  
  // Actions
  setTool: (tool: ToolType) => void
  updateTerritory: (id: string, updates: Partial<Territory>) => void
  addTerritory: (territory: Territory) => void
  deleteTerritory: (id: string) => void
  selectTerritory: (id: string, multi?: boolean) => void
  clearSelection: () => void
  selectAll: () => void
  
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
  toggleVertexBezier: (vertexIndex: number) => void
  addVertexOnEdge: (edgeIndex: number, position: Point) => void
  deleteVertex: (vertexIndex: number) => void
  
  // Snapping actions
  updateSnapSettings: (settings: Partial<SnapState['settings']>) => void
  toggleSnapping: () => void
  setTemporarySnapDisabled: (disabled: boolean) => void
  
  // Copy/Paste actions
  copyTerritories: (territoryIds: string[]) => void
  pasteTerritories: (cursorPosition?: Point) => void
  duplicateTerritories: (territoryIds: string[], offset?: Point) => void
  
  // Template library actions
  toggleTemplateLibrary: () => void
  setTemplateCategory: (category: string) => void
  setTemplateSearch: (query: string) => void
  startShapePlacement: (shapeId: string) => void
  updateShapePreview: (position: Point) => void
  placeShape: (position: Point) => void
  cancelShapePlacement: () => void
  addRecentShape: (shapeId: string) => void
  
  // Territory table actions
  toggleTerritoryTable: () => void
  setTerritoryTableTab: (tab: 'territories' | 'continents') => void
  setTerritoryTableSort: (column: string, direction: 'asc' | 'desc') => void
  
  // Z-order management actions
  bringToFront: (territoryId: string) => void
  sendToBack: (territoryId: string) => void
  bringForward: (territoryId: string) => void
  sendBackward: (territoryId: string) => void
  
  // Edit mode actions
  setEditMode: (mode: 'view' | 'edit') => void
  
  // Database diagram specific
  clearAll: () => void
  addItem: (item: any) => void
  isDirty: boolean
  currentDiagramPath: string | null
  setDirty: (dirty: boolean) => void
  setCurrentDiagramPath: (path: string | null) => void
}

export interface PointerPosition {
  screen: Point // Screen coordinates
  svg: Point    // SVG coordinates
  grid: Point   // Snapped to grid
}