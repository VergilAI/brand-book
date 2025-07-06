import type { Point, Territory } from '@/lib/lms/optimized-map-data'
import type { Line, SnapResult, SnapSettings } from '../types/snapping'
import { BezierPoint } from '../types/editor'

// Calculate distance between two points
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Find nearest vertex within snap distance
export function findNearestVertex(
  point: Point,
  territories: Territory[],
  maxDistance: number,
  excludeTerritoryId?: string
): SnapResult | null {
  let nearest: SnapResult | null = null
  let minDist = maxDistance

  territories.forEach(territory => {
    if (territory.id === excludeTerritoryId) return

    const vertices = parseSvgPathToPoints(territory.fillPath)
    vertices.forEach((vertex, index) => {
      const dist = distance(point, vertex)
      if (dist < minDist) {
        minDist = dist
        nearest = {
          point: vertex,
          type: 'vertex',
          target: {
            territoryId: territory.id,
            elementType: 'vertex',
            elementIndex: index
          },
          distance: dist,
          priority: 1
        }
      }
    })
  })

  return nearest
}

// Find nearest point on edge
export function findNearestEdgePoint(
  point: Point,
  territories: Territory[],
  maxDistance: number,
  excludeTerritoryId?: string
): SnapResult | null {
  let nearest: SnapResult | null = null
  let minDist = maxDistance

  territories.forEach(territory => {
    if (territory.id === excludeTerritoryId) return

    const vertices = parseSvgPathToPoints(territory.fillPath)
    for (let i = 0; i < vertices.length; i++) {
      const start = vertices[i]
      const end = vertices[(i + 1) % vertices.length]
      
      // Find closest point on line segment
      const closest = getClosestPointOnSegment(point, start, end)
      const dist = closest.distance

      if (dist < minDist) {
        minDist = dist
        
        // Check if it's the midpoint
        const midpoint = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        }
        const isMidpoint = distance(closest.point, midpoint) < 2

        nearest = {
          point: closest.point,
          type: isMidpoint ? 'edge-midpoint' : 'edge',
          target: {
            territoryId: territory.id,
            elementType: 'edge',
            elementIndex: i
          },
          distance: dist,
          priority: isMidpoint ? 2 : 3
        }
      }
    }
  })

  return nearest
}

// Find nearest territory center
export function findNearestCenter(
  point: Point,
  territories: Territory[],
  maxDistance: number,
  excludeTerritoryId?: string
): SnapResult | null {
  let nearest: SnapResult | null = null
  let minDist = maxDistance

  territories.forEach(territory => {
    if (territory.id === excludeTerritoryId) return

    const dist = distance(point, territory.center)
    if (dist < minDist) {
      minDist = dist
      nearest = {
        point: territory.center,
        type: 'center',
        target: {
          territoryId: territory.id,
          elementType: 'center'
        },
        distance: dist,
        priority: 4
      }
    }
  })

  return nearest
}

// Find nearest grid point
export function findNearestGridPoint(
  point: Point,
  gridSize: number,
  maxDistance: number
): SnapResult | null {
  const snappedX = Math.round(point.x / gridSize) * gridSize
  const snappedY = Math.round(point.y / gridSize) * gridSize
  const snappedPoint = { x: snappedX, y: snappedY }
  const dist = distance(point, snappedPoint)

  if (dist < maxDistance) {
    return {
      point: snappedPoint,
      type: 'grid',
      distance: dist,
      priority: 5
    }
  }

  return null
}

// Get all snap candidates sorted by priority and distance
export function getSnapCandidates(
  point: Point,
  territories: Territory[],
  settings: SnapSettings,
  gridSize: number,
  excludeTerritoryId?: string
): SnapResult[] {
  const candidates: SnapResult[] = []

  if (!settings.enabled) return candidates

  // Collect all snap candidates
  if (settings.vertexSnap) {
    const vertex = findNearestVertex(point, territories, settings.snapDistance, excludeTerritoryId)
    if (vertex) candidates.push(vertex)
  }

  if (settings.edgeSnap) {
    const edge = findNearestEdgePoint(point, territories, settings.snapDistance, excludeTerritoryId)
    if (edge) candidates.push(edge)
  }

  if (settings.centerSnap) {
    const center = findNearestCenter(point, territories, settings.snapDistance, excludeTerritoryId)
    if (center) candidates.push(center)
  }

  if (settings.gridSnap) {
    const grid = findNearestGridPoint(point, gridSize, settings.snapDistance)
    if (grid) candidates.push(grid)
  }

  // Sort by priority (lower is better), then by distance
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority
    }
    return a.distance - b.distance
  })

  return candidates
}

// Get alignment guides for a point with aligned elements
export function getAlignmentGuides(
  point: Point,
  territories: Territory[],
  threshold: number = 5,
  excludeTerritoryId?: string
): { guides: Line[], alignedElements: AlignedElement[] } {
  const guides: Line[] = []
  const alignedElements: AlignedElement[] = []
  const processedLines = new Set<string>() // To avoid duplicate guides

  territories.forEach(territory => {
    if (territory.id === excludeTerritoryId) return

    // Check horizontal alignment with center
    if (Math.abs(point.y - territory.center.y) < threshold) {
      const lineKey = `h-${territory.center.y}`
      if (!processedLines.has(lineKey)) {
        processedLines.add(lineKey)
        guides.push({
          start: { x: Math.min(point.x, territory.center.x) - 100, y: territory.center.y },
          end: { x: Math.max(point.x, territory.center.x) + 100, y: territory.center.y }
        })
      }
      alignedElements.push({
        type: 'center',
        point: territory.center,
        territoryId: territory.id
      })
    }

    // Check vertical alignment with center
    if (Math.abs(point.x - territory.center.x) < threshold) {
      const lineKey = `v-${territory.center.x}`
      if (!processedLines.has(lineKey)) {
        processedLines.add(lineKey)
        guides.push({
          start: { x: territory.center.x, y: Math.min(point.y, territory.center.y) - 100 },
          end: { x: territory.center.x, y: Math.max(point.y, territory.center.y) + 100 }
        })
      }
      alignedElements.push({
        type: 'center',
        point: territory.center,
        territoryId: territory.id
      })
    }

    // Check alignment with vertices
    const vertices = parseSvgPathToPoints(territory.fillPath)
    vertices.forEach((vertex, index) => {
      if (Math.abs(point.y - vertex.y) < threshold) {
        const lineKey = `h-${vertex.y}`
        if (!processedLines.has(lineKey)) {
          processedLines.add(lineKey)
          guides.push({
            start: { x: point.x - 100, y: vertex.y },
            end: { x: point.x + 100, y: vertex.y }
          })
        }
        alignedElements.push({
          type: 'vertex',
          point: vertex,
          territoryId: territory.id,
          vertexIndex: index
        })
      }
      if (Math.abs(point.x - vertex.x) < threshold) {
        const lineKey = `v-${vertex.x}`
        if (!processedLines.has(lineKey)) {
          processedLines.add(lineKey)
          guides.push({
            start: { x: vertex.x, y: point.y - 100 },
            end: { x: vertex.x, y: point.y + 100 }
          })
        }
        alignedElements.push({
          type: 'vertex',
          point: vertex,
          territoryId: territory.id,
          vertexIndex: index
        })
      }
    })
  })

  return { guides, alignedElements }
}

export interface AlignedElement {
  type: 'vertex' | 'center'
  point: Point
  territoryId: string
  vertexIndex?: number
}

// Helper: Get closest point on line segment
export function getClosestPointOnSegment(
  point: Point,
  start: Point,
  end: Point
): { point: Point; distance: number } {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) {
    return { point: start, distance: distance(point, start) }
  }

  let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared
  t = Math.max(0, Math.min(1, t))

  const closest = {
    x: start.x + t * dx,
    y: start.y + t * dy
  }

  return {
    point: closest,
    distance: distance(point, closest)
  }
}

// Helper: Parse SVG path to points
export function parseSvgPathToPoints(pathString: string): Point[] {
  const points: Point[] = []
  const commandRegex = /([MLCQZ])\s*([^MLCQZ]*)/gi
  let match

  while ((match = commandRegex.exec(pathString)) !== null) {
    const command = match[1].toUpperCase()
    const coordsStr = match[2].trim()

    if (command === 'Z') continue

    const coords = coordsStr.split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n))

    switch (command) {
      case 'M':
      case 'L':
        if (coords.length >= 2) {
          points.push({ x: coords[0], y: coords[1] })
        }
        break
      case 'C':
        if (coords.length >= 6) {
          points.push({ x: coords[4], y: coords[5] })
        }
        break
      case 'Q':
        if (coords.length >= 4) {
          points.push({ x: coords[2], y: coords[3] })
        }
        break
    }
  }

  return points
}

// Snap angle to nearest increment
export function snapAngle(angle: number, increment: number): number {
  return Math.round(angle / increment) * increment
}

// Get angle between two points in degrees
export function getAngle(p1: Point, p2: Point): number {
  const radians = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  return (radians * 180) / Math.PI
}

// Snap point to angle from origin
export function snapPointToAngle(
  point: Point,
  origin: Point,
  angleIncrement: number
): Point {
  const dist = distance(origin, point)
  const angle = getAngle(origin, point)
  const snappedAngle = snapAngle(angle, angleIncrement)
  const radians = (snappedAngle * Math.PI) / 180

  return {
    x: origin.x + dist * Math.cos(radians),
    y: origin.y + dist * Math.sin(radians)
  }
}