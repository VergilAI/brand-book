"use client"

import { create } from 'zustand'
import { MapEditorState } from '../types/editor'
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
    currentPath: [],
    previewPath: '',
    snapToGrid: true,
    autoClose: true
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
  startDrawing: (point) => set(state => ({
    drawing: {
      ...state.drawing,
      isDrawing: true,
      currentPath: [point],
      previewPath: `M ${point.x} ${point.y}`
    }
  })),
  
  addDrawingPoint: (point) => set(state => {
    const newPath = [...state.drawing.currentPath, point]
    const previewPath = pathToSvg(newPath)
    
    return {
      drawing: {
        ...state.drawing,
        currentPath: newPath,
        previewPath
      }
    }
  }),
  
  finishDrawing: () => {
    const state = get()
    if (state.drawing.currentPath.length < 3) {
      // Need at least 3 points for a valid territory
      set(state => ({
        drawing: {
          ...state.drawing,
          isDrawing: false,
          currentPath: [],
          previewPath: ''
        }
      }))
      return
    }
    
    // Create new territory
    const id = `territory-${Date.now()}`
    const path = pathToSvg(state.drawing.currentPath, true) // Close the path
    const center = calculateCenter(state.drawing.currentPath)
    
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
        currentPath: [],
        previewPath: ''
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
      currentPath: [],
      previewPath: ''
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