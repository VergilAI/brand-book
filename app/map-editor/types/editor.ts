// Core types for the map editor

import type { MapData, Territory, Border, Point } from '@/lib/lms/optimized-map-data'

export type ToolType = 'select' | 'pen' | 'border' | 'connect' | 'move'

export interface DrawingState {
  isDrawing: boolean
  currentPath: Point[]
  previewPath: string
  snapToGrid: boolean
  autoClose: boolean
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

export interface MapEditorState {
  // Map data
  map: MapData
  
  // Selection
  selection: SelectionState
  
  // Active tool
  tool: ToolType
  
  // Drawing state
  drawing: DrawingState
  
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
  addDrawingPoint: (point: Point) => void
  finishDrawing: () => void
  cancelDrawing: () => void
  
  // View actions
  setZoom: (zoom: number) => void
  setPan: (pan: Point) => void
  toggleGrid: () => void
  setGridSize: (size: number) => void
  setSnapToGrid: (snap: boolean) => void
}

export interface PointerPosition {
  screen: Point // Screen coordinates
  svg: Point    // SVG coordinates
  grid: Point   // Snapped to grid
}