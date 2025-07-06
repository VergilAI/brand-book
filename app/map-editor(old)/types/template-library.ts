import type { Point } from '@/lib/lms/optimized-map-data'

export interface TemplateShape {
  id: string
  name: string
  category: string
  tags: string[]
  icon: string // SVG path for thumbnail
  defaultSize: { width: number; height: number }
  path: string | ((size: { width: number; height: number }) => string) // SVG path or generator
  anchors?: AnchorPoint[] // Connection points for future use
  resizable: boolean
  maintainAspectRatio: boolean
  bezierComplexity: 'simple' | 'complex'
}

export interface AnchorPoint {
  id: string
  position: { x: number; y: number } // Relative position (0-1)
  type: 'input' | 'output' | 'both'
}

export interface ShapeCategory {
  id: string
  name: string
  icon: string
  order: number
}

export interface TemplateLibraryState {
  isOpen: boolean
  selectedCategory: string | 'all'
  searchQuery: string
  recentShapes: string[] // Shape IDs
  customShapes: TemplateShape[]
  placementMode: {
    active: boolean
    shapeId: string | null
    preview: {
      position: Point
      size: { width: number; height: number }
      rotation: number
    } | null
  }
}

export const SHAPE_CATEGORIES: ShapeCategory[] = [
  { id: 'basic', name: 'Basic Shapes', icon: '□', order: 1 },
  { id: 'arrows', name: 'Arrows & Connectors', icon: '→', order: 2 },
  { id: 'uml', name: 'UML Diagrams', icon: '⬚', order: 3 },
  { id: 'flowchart', name: 'Flowchart', icon: '◇', order: 4 },
  { id: 'geographic', name: 'Geographic', icon: '🗺', order: 5 },
  { id: 'game', name: 'Game Elements', icon: '🏰', order: 6 },
  { id: 'custom', name: 'Custom', icon: '⭐', order: 7 }
]