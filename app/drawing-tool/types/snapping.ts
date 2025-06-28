export interface Point {
  x: number
  y: number
}

export interface Line {
  start: Point
  end: Point
}

export interface SnapResult {
  point: Point
  type: 'vertex' | 'edge' | 'edge-midpoint' | 'center' | 'grid' | 'guide'
  target?: {
    shapeId: string
    elementType: 'vertex' | 'edge' | 'center'
    elementIndex?: number
  }
  distance: number
  priority: number
}

export interface SnapSettings {
  enabled: boolean
  vertexSnap: boolean
  edgeSnap: boolean
  centerSnap: boolean
  gridSnap: boolean
  guideSnap: boolean
  snapDistance: number
  showSnapIndicators: boolean
  angleSnap: boolean
  angleSnapIncrement: number // degrees
}

export interface SnapIndicator {
  id: string
  type: 'point' | 'line' | 'guide' | 'measurement'
  geometry: Point | Line
  style: {
    color: string
    width: number
    pattern?: 'solid' | 'dashed'
    radius?: number
  }
  label?: string
}

export interface SnapState {
  activeSnaps: SnapResult[]
  indicators: SnapIndicator[]
  hoveredSnapTargets: Set<string>
  settings: SnapSettings
  isSnapping: boolean
  temporaryDisabled: boolean
}