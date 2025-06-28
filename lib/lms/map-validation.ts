import type { MapData, Territory, Border, Point } from './optimized-map-data'

export interface ValidationError {
  type: 'BORDER_MISMATCH' | 'MISSING_BORDER' | 'ORPHAN_BORDER' | 'INVALID_PATH' | 
        'DISCONNECTED_TERRITORY' | 'OVERLAPPING_TERRITORIES' | 'INVALID_TOPOLOGY'
  severity: 'error' | 'warning'
  territoryIds?: string[]
  borderId?: string
  message: string
  details?: any
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  stats: {
    totalTerritories: number
    totalBorders: number
    validBorders: number
    invalidBorders: number
    orphanBorders: number
  }
}

// SVG path parsing utilities
interface PathSegment {
  type: 'M' | 'L' | 'Q' | 'C' | 'Z'
  points: Point[]
}

function parseSVGPath(pathData: string): PathSegment[] {
  const segments: PathSegment[] = []
  const commands = pathData.match(/[MLQCZ][^MLQCZ]*/g) || []
  
  commands.forEach(cmd => {
    const type = cmd[0] as PathSegment['type']
    const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number)
    const points: Point[] = []
    
    for (let i = 0; i < coords.length; i += 2) {
      if (!isNaN(coords[i]) && !isNaN(coords[i + 1])) {
        points.push({ x: coords[i], y: coords[i + 1] })
      }
    }
    
    if (points.length > 0 || type === 'Z') {
      segments.push({ type, points })
    }
  })
  
  return segments
}

function getPathPoints(pathData: string): Point[] {
  const segments = parseSVGPath(pathData)
  const points: Point[] = []
  
  segments.forEach(segment => {
    if (segment.type !== 'Z') {
      points.push(...segment.points)
    }
  })
  
  return points
}

function getPathPerimeter(pathData: string): Point[] {
  const segments = parseSVGPath(pathData)
  const perimeter: Point[] = []
  let currentPoint: Point | null = null
  
  segments.forEach(segment => {
    switch (segment.type) {
      case 'M':
        if (segment.points[0]) {
          currentPoint = segment.points[0]
          perimeter.push(currentPoint)
        }
        break
      case 'L':
        segment.points.forEach(point => {
          perimeter.push(point)
          currentPoint = point
        })
        break
      case 'Q':
      case 'C':
        // For curves, we'll sample points along the curve
        // For validation, we'll just use the control points and end point
        segment.points.forEach(point => perimeter.push(point))
        if (segment.points.length > 0) {
          currentPoint = segment.points[segment.points.length - 1]
        }
        break
    }
  })
  
  return perimeter
}

function pointDistance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

function pointToLineDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = point.x - lineStart.x
  const B = point.y - lineStart.y
  const C = lineEnd.x - lineStart.x
  const D = lineEnd.y - lineStart.y
  
  const dot = A * C + B * D
  const lenSq = C * C + D * D
  let param = -1
  
  if (lenSq !== 0) {
    param = dot / lenSq
  }
  
  let xx, yy
  
  if (param < 0) {
    xx = lineStart.x
    yy = lineStart.y
  } else if (param > 1) {
    xx = lineEnd.x
    yy = lineEnd.y
  } else {
    xx = lineStart.x + param * C
    yy = lineStart.y + param * D
  }
  
  const dx = point.x - xx
  const dy = point.y - yy
  return Math.sqrt(dx * dx + dy * dy)
}

function isPointNearPath(point: Point, pathPoints: Point[], tolerance: number = 5): boolean {
  // Check if point is close to any line segment in the path
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const distance = pointToLineDistance(point, pathPoints[i], pathPoints[i + 1])
    if (distance <= tolerance) {
      return true
    }
  }
  return false
}

function isBorderOnTerritoryEdge(borderPath: string, territoryPath: string, tolerance: number = 5): boolean {
  const borderPoints = getPathPoints(borderPath)
  const territoryPerimeter = getPathPerimeter(territoryPath)
  
  if (borderPoints.length === 0 || territoryPerimeter.length === 0) {
    return false
  }
  
  // Check if at least 80% of border points are near the territory perimeter
  let nearCount = 0
  for (const borderPoint of borderPoints) {
    if (isPointNearPath(borderPoint, territoryPerimeter, tolerance)) {
      nearCount++
    }
  }
  
  const nearPercentage = nearCount / borderPoints.length
  return nearPercentage >= 0.8
}

// Bounding box calculations
interface BoundingBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

function getPathBoundingBox(pathData: string): BoundingBox {
  const points = getPathPoints(pathData)
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  }
  
  let minX = points[0].x
  let minY = points[0].y
  let maxX = points[0].x
  let maxY = points[0].y
  
  points.forEach(point => {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  })
  
  return { minX, minY, maxX, maxY }
}

function boundingBoxesOverlap(box1: BoundingBox, box2: BoundingBox): boolean {
  return !(box1.maxX < box2.minX || box2.maxX < box1.minX ||
           box1.maxY < box2.minY || box2.maxY < box1.minY)
}

// Main validation function
export function validateMap(mapData: MapData): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []
  
  const territoryIds = new Set(Object.keys(mapData.territories))
  const borderIds = new Set(Object.keys(mapData.borders))
  
  let validBorders = 0
  let invalidBorders = 0
  let orphanBorders = 0
  
  // 1. Validate all territories have valid paths
  for (const [id, territory] of Object.entries(mapData.territories)) {
    try {
      const segments = parseSVGPath(territory.fillPath)
      if (segments.length === 0) {
        errors.push({
          type: 'INVALID_PATH',
          severity: 'error',
          territoryIds: [id],
          message: `Territory ${id} has invalid SVG path`,
          details: { path: territory.fillPath }
        })
      }
    } catch (e) {
      errors.push({
        type: 'INVALID_PATH',
        severity: 'error',
        territoryIds: [id],
        message: `Territory ${id} has unparseable SVG path`,
        details: { path: territory.fillPath, error: e }
      })
    }
  }
  
  // 2. Validate borders
  for (const [borderId, border] of Object.entries(mapData.borders)) {
    const [t1, t2] = border.territories
    
    // Check if territories exist
    if (t1 !== 'ocean' && !territoryIds.has(t1)) {
      errors.push({
        type: 'ORPHAN_BORDER',
        severity: 'error',
        borderId,
        message: `Border ${borderId} references non-existent territory ${t1}`
      })
      orphanBorders++
      continue
    }
    
    if (t2 !== 'ocean' && !territoryIds.has(t2)) {
      errors.push({
        type: 'ORPHAN_BORDER',
        severity: 'error',
        borderId,
        message: `Border ${borderId} references non-existent territory ${t2}`
      })
      orphanBorders++
      continue
    }
    
    // Skip ocean borders and sea routes for edge validation
    if (t1 === 'ocean' || t2 === 'ocean' || border.type === 'sea') {
      validBorders++
      continue
    }
    
    // Validate border is actually on the edge of both territories
    const territory1 = mapData.territories[t1]
    const territory2 = mapData.territories[t2]
    
    if (territory1 && territory2) {
      const onTerritory1Edge = isBorderOnTerritoryEdge(border.path, territory1.fillPath)
      const onTerritory2Edge = isBorderOnTerritoryEdge(border.path, territory2.fillPath)
      
      if (!onTerritory1Edge || !onTerritory2Edge) {
        errors.push({
          type: 'BORDER_MISMATCH',
          severity: 'error',
          borderId,
          territoryIds: [t1, t2],
          message: `Border ${borderId} does not lie on the edge of both territories`,
          details: {
            onTerritory1Edge,
            onTerritory2Edge,
            borderPath: border.path
          }
        })
        invalidBorders++
      } else {
        validBorders++
      }
    }
  }
  
  // 3. Check for missing borders
  for (const [id, territory] of Object.entries(mapData.territories)) {
    const declaredBorders = new Set(territory.borderSegments)
    
    // Check if all declared borders exist
    for (const borderId of declaredBorders) {
      if (!borderIds.has(borderId)) {
        errors.push({
          type: 'MISSING_BORDER',
          severity: 'error',
          territoryIds: [id],
          borderId,
          message: `Territory ${id} references non-existent border ${borderId}`
        })
      }
    }
    
    // Check if territory appears in appropriate borders
    let foundBorders = 0
    for (const [borderId, border] of Object.entries(mapData.borders)) {
      if (border.territories.includes(id)) {
        foundBorders++
        if (!declaredBorders.has(borderId)) {
          warnings.push({
            type: 'MISSING_BORDER',
            severity: 'warning',
            territoryIds: [id],
            borderId,
            message: `Territory ${id} appears in border ${borderId} but doesn't declare it`
          })
        }
      }
    }
    
    if (foundBorders === 0) {
      errors.push({
        type: 'DISCONNECTED_TERRITORY',
        severity: 'error',
        territoryIds: [id],
        message: `Territory ${id} has no borders connecting it to other territories`
      })
    }
  }
  
  // 4. Check for overlapping territories (basic bounding box check)
  const territoryArray = Object.entries(mapData.territories)
  for (let i = 0; i < territoryArray.length; i++) {
    for (let j = i + 1; j < territoryArray.length; j++) {
      const [id1, territory1] = territoryArray[i]
      const [id2, territory2] = territoryArray[j]
      
      const box1 = getPathBoundingBox(territory1.fillPath)
      const box2 = getPathBoundingBox(territory2.fillPath)
      
      if (boundingBoxesOverlap(box1, box2)) {
        // If bounding boxes overlap, check if they share a border
        const sharedBorder = Object.values(mapData.borders).find(border => {
          const [t1, t2] = border.territories
          return (t1 === id1 && t2 === id2) || (t1 === id2 && t2 === id1)
        })
        
        if (!sharedBorder) {
          warnings.push({
            type: 'OVERLAPPING_TERRITORIES',
            severity: 'warning',
            territoryIds: [id1, id2],
            message: `Territories ${id1} and ${id2} have overlapping bounding boxes but no shared border`
          })
        }
      }
    }
  }
  
  // 5. Validate continents
  for (const [continentId, continent] of Object.entries(mapData.continents)) {
    for (const territoryId of continent.territories) {
      if (!territoryIds.has(territoryId)) {
        errors.push({
          type: 'INVALID_TOPOLOGY',
          severity: 'error',
          territoryIds: [territoryId],
          message: `Continent ${continentId} references non-existent territory ${territoryId}`
        })
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalTerritories: territoryIds.size,
      totalBorders: borderIds.size,
      validBorders,
      invalidBorders,
      orphanBorders
    }
  }
}

// Helper function to fix common issues
export function suggestFixes(mapData: MapData, validation: ValidationResult): MapData {
  const fixed = JSON.parse(JSON.stringify(mapData)) as MapData
  
  // Remove orphan borders
  validation.errors
    .filter(e => e.type === 'ORPHAN_BORDER' && e.borderId)
    .forEach(error => {
      delete fixed.borders[error.borderId!]
    })
  
  // Remove references to missing borders from territories
  validation.errors
    .filter(e => e.type === 'MISSING_BORDER' && e.borderId && e.territoryIds)
    .forEach(error => {
      const territory = fixed.territories[error.territoryIds![0]]
      if (territory) {
        territory.borderSegments = territory.borderSegments.filter(
          id => id !== error.borderId
        )
      }
    })
  
  return fixed
}