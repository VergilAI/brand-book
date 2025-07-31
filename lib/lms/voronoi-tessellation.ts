import { Delaunay } from 'd3-delaunay'

export interface Point {
  x: number
  y: number
}

export interface Edge {
  start: Point
  end: Point
}

export interface Polygon {
  vertices: Point[]
  edges: Edge[]
}

export interface VoronoiSeed {
  id: string
  point: Point
  territoryId: string
}

export interface ContinentBoundary {
  id: string
  name: string
  outline: Point[]
  holes?: Point[][] // For lakes or internal boundaries
}

export interface VoronoiTerritory {
  id: string
  seed: Point
  cell: Polygon
  svgPath: string
  continentId: string
  neighbors: string[]
}

// Continent boundary definitions (simplified for elegant shapes)
export const CONTINENT_BOUNDARIES: ContinentBoundary[] = [
  {
    id: 'north-america',
    name: 'North America',
    outline: [
      { x: 50, y: 50 },   // Alaska
      { x: 120, y: 40 },  // Northern Canada
      { x: 200, y: 45 },  // Greenland area
      { x: 220, y: 80 },  // Eastern coast
      { x: 210, y: 120 }, // US East
      { x: 180, y: 140 }, // Florida
      { x: 160, y: 160 }, // Gulf of Mexico
      { x: 140, y: 175 }, // Central America
      { x: 120, y: 170 }, // Mexico West
      { x: 90, y: 150 },  // California
      { x: 70, y: 120 },  // Pacific Northwest
      { x: 45, y: 80 },   // Alaska West
    ]
  },
  {
    id: 'south-america',
    name: 'South America',
    outline: [
      { x: 140, y: 175 }, // Connection to Central America
      { x: 160, y: 185 }, // Caribbean
      { x: 180, y: 200 }, // Guyana
      { x: 200, y: 220 }, // Brazil Northeast
      { x: 210, y: 280 }, // Brazil East
      { x: 200, y: 320 }, // Brazil South
      { x: 180, y: 350 }, // Uruguay
      { x: 160, y: 370 }, // Argentina
      { x: 150, y: 390 }, // Argentina South
      { x: 140, y: 380 }, // Chile
      { x: 130, y: 340 }, // Chile North
      { x: 125, y: 300 }, // Peru
      { x: 120, y: 260 }, // Ecuador
      { x: 125, y: 220 }, // Colombia
      { x: 135, y: 195 }, // Venezuela
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    outline: [
      { x: 280, y: 60 },  // Iceland
      { x: 320, y: 70 },  // Norway
      { x: 360, y: 75 },  // Scandinavia
      { x: 380, y: 85 },  // Finland
      { x: 400, y: 95 },  // Russia West
      { x: 410, y: 110 }, // Russia South
      { x: 400, y: 130 }, // Ukraine
      { x: 380, y: 140 }, // Balkans
      { x: 360, y: 145 }, // Italy
      { x: 340, y: 150 }, // Southern Europe
      { x: 320, y: 145 }, // Spain
      { x: 300, y: 140 }, // France
      { x: 290, y: 120 }, // UK
      { x: 285, y: 100 }, // Scotland
      { x: 280, y: 80 },  // Back to Iceland
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    outline: [
      { x: 320, y: 150 }, // Connection to Europe
      { x: 360, y: 155 }, // North Africa East
      { x: 380, y: 160 }, // Egypt
      { x: 390, y: 180 }, // Red Sea
      { x: 395, y: 200 }, // Horn of Africa
      { x: 390, y: 240 }, // East Africa
      { x: 385, y: 280 }, // Tanzania
      { x: 375, y: 320 }, // Southern Africa
      { x: 360, y: 350 }, // South Africa
      { x: 340, y: 360 }, // Cape
      { x: 320, y: 355 }, // Namibia
      { x: 300, y: 340 }, // Angola
      { x: 285, y: 320 }, // Central Africa
      { x: 280, y: 290 }, // Congo
      { x: 275, y: 260 }, // Cameroon
      { x: 270, y: 230 }, // West Africa
      { x: 275, y: 200 }, // Sahara
      { x: 285, y: 170 }, // Algeria
      { x: 300, y: 155 }, // Morocco
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    outline: [
      { x: 400, y: 95 },  // From Europe
      { x: 450, y: 90 },  // Siberia West
      { x: 520, y: 85 },  // Siberia Central
      { x: 580, y: 80 },  // Siberia East
      { x: 620, y: 85 },  // Far East
      { x: 640, y: 100 }, // Kamchatka
      { x: 650, y: 120 }, // Japan area
      { x: 645, y: 140 }, // Korea
      { x: 630, y: 160 }, // China East
      { x: 610, y: 180 }, // China South
      { x: 580, y: 200 }, // Southeast Asia
      { x: 560, y: 220 }, // India East
      { x: 540, y: 240 }, // India South
      { x: 520, y: 250 }, // Arabian Sea
      { x: 500, y: 240 }, // Middle East
      { x: 480, y: 220 }, // Iran
      { x: 460, y: 200 }, // Central Asia
      { x: 450, y: 180 }, // Kazakhstan
      { x: 440, y: 160 }, // Ural
      { x: 430, y: 140 }, // Russia Central
      { x: 420, y: 120 }, // Russia West
      { x: 410, y: 110 }, // Back to Europe connection
    ]
  },
  {
    id: 'oceania',
    name: 'Oceania',
    outline: [
      { x: 580, y: 280 }, // Indonesia
      { x: 620, y: 285 }, // New Guinea
      { x: 650, y: 290 }, // Pacific Islands
      { x: 680, y: 320 }, // Australia Northeast
      { x: 690, y: 360 }, // Australia East
      { x: 685, y: 400 }, // Australia Southeast
      { x: 650, y: 420 }, // Australia South
      { x: 600, y: 415 }, // Australia West
      { x: 570, y: 390 }, // Australia Northwest
      { x: 560, y: 350 }, // Australia North
      { x: 565, y: 320 }, // Northern Australia
      { x: 575, y: 300 }, // Back to Indonesia
    ]
  }
]

// Voronoi seed points strategically placed within continents
export const VORONOI_SEEDS: VoronoiSeed[] = [
  // North America (9 territories)
  { id: 'alaska-seed', point: { x: 70, y: 70 }, territoryId: 'alaska' },
  { id: 'northwest-territory-seed', point: { x: 120, y: 65 }, territoryId: 'northwest-territory' },
  { id: 'greenland-seed', point: { x: 180, y: 60 }, territoryId: 'greenland' },
  { id: 'alberta-seed', point: { x: 105, y: 95 }, territoryId: 'alberta' },
  { id: 'ontario-seed', point: { x: 140, y: 95 }, territoryId: 'ontario' },
  { id: 'quebec-seed', point: { x: 170, y: 90 }, territoryId: 'quebec' },
  { id: 'western-us-seed', point: { x: 110, y: 125 }, territoryId: 'western-us' },
  { id: 'eastern-us-seed', point: { x: 155, y: 125 }, territoryId: 'eastern-us' },
  { id: 'central-america-seed', point: { x: 150, y: 165 }, territoryId: 'central-america' },

  // South America (4 territories)
  { id: 'venezuela-seed', point: { x: 135, y: 205 }, territoryId: 'venezuela' },
  { id: 'brazil-seed', point: { x: 175, y: 250 }, territoryId: 'brazil' },
  { id: 'peru-seed', point: { x: 135, y: 260 }, territoryId: 'peru' },
  { id: 'argentina-seed', point: { x: 155, y: 320 }, territoryId: 'argentina' },

  // Europe (7 territories)
  { id: 'iceland-seed', point: { x: 285, y: 75 }, territoryId: 'iceland' },
  { id: 'great-britain-seed', point: { x: 295, y: 110 }, territoryId: 'great-britain' },
  { id: 'western-europe-seed', point: { x: 320, y: 125 }, territoryId: 'western-europe' },
  { id: 'northern-europe-seed', point: { x: 350, y: 105 }, territoryId: 'northern-europe' },
  { id: 'southern-europe-seed', point: { x: 350, y: 135 }, territoryId: 'southern-europe' },
  { id: 'ukraine-seed', point: { x: 390, y: 120 }, territoryId: 'ukraine' },
  { id: 'scandinavia-seed', point: { x: 340, y: 85 }, territoryId: 'scandinavia' },

  // Africa (6 territories)
  { id: 'north-africa-seed', point: { x: 300, y: 180 }, territoryId: 'north-africa' },
  { id: 'egypt-seed', point: { x: 350, y: 180 }, territoryId: 'egypt' },
  { id: 'east-africa-seed', point: { x: 370, y: 220 }, territoryId: 'east-africa' },
  { id: 'congo-seed', point: { x: 320, y: 250 }, territoryId: 'congo' },
  { id: 'south-africa-seed', point: { x: 340, y: 320 }, territoryId: 'south-africa' },
  { id: 'madagascar-seed', point: { x: 390, y: 280 }, territoryId: 'madagascar' },

  // Asia (12 territories)
  { id: 'ural-seed', point: { x: 440, y: 120 }, territoryId: 'ural' },
  { id: 'siberia-seed', point: { x: 500, y: 110 }, territoryId: 'siberia' },
  { id: 'yakutsk-seed', point: { x: 560, y: 105 }, territoryId: 'yakutsk' },
  { id: 'kamchatka-seed', point: { x: 620, y: 110 }, territoryId: 'kamchatka' },
  { id: 'irkutsk-seed', point: { x: 540, y: 130 }, territoryId: 'irkutsk' },
  { id: 'mongolia-seed', point: { x: 520, y: 150 }, territoryId: 'mongolia' },
  { id: 'japan-seed', point: { x: 630, y: 150 }, territoryId: 'japan' },
  { id: 'afghanistan-seed', point: { x: 470, y: 170 }, territoryId: 'afghanistan' },
  { id: 'china-seed', point: { x: 550, y: 170 }, territoryId: 'china' },
  { id: 'middle-east-seed', point: { x: 420, y: 190 }, territoryId: 'middle-east' },
  { id: 'india-seed', point: { x: 500, y: 210 }, territoryId: 'india' },
  { id: 'siam-seed', point: { x: 570, y: 210 }, territoryId: 'siam' },

  // Oceania (4 territories)
  { id: 'indonesia-seed', point: { x: 580, y: 290 }, territoryId: 'indonesia' },
  { id: 'new-guinea-seed', point: { x: 620, y: 310 }, territoryId: 'new-guinea' },
  { id: 'western-australia-seed', point: { x: 620, y: 360 }, territoryId: 'western-australia' },
  { id: 'eastern-australia-seed', point: { x: 660, y: 360 }, territoryId: 'eastern-australia' },
]

// Utility functions for geometric operations
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
        (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
      inside = !inside
    }
  }
  return inside
}

export function clipPolygonToContinent(voronoiCell: Point[], continentBoundary: Point[]): Point[] {
  // Sutherland-Hodgman clipping algorithm (simplified)
  let clippedPolygon = [...voronoiCell]
  
  for (let i = 0; i < continentBoundary.length; i++) {
    const clipVertex1 = continentBoundary[i]
    const clipVertex2 = continentBoundary[(i + 1) % continentBoundary.length]
    
    const inputList = clippedPolygon
    clippedPolygon = []
    
    if (inputList.length === 0) continue
    
    let s = inputList[inputList.length - 1]
    
    for (const e of inputList) {
      if (isInside(e, clipVertex1, clipVertex2)) {
        if (!isInside(s, clipVertex1, clipVertex2)) {
          const intersection = getIntersection(s, e, clipVertex1, clipVertex2)
          if (intersection) clippedPolygon.push(intersection)
        }
        clippedPolygon.push(e)
      } else if (isInside(s, clipVertex1, clipVertex2)) {
        const intersection = getIntersection(s, e, clipVertex1, clipVertex2)
        if (intersection) clippedPolygon.push(intersection)
      }
      s = e
    }
  }
  
  return clippedPolygon
}

function isInside(point: Point, clipVertex1: Point, clipVertex2: Point): boolean {
  // Check if point is on the inside of the clipping edge
  return (clipVertex2.x - clipVertex1.x) * (point.y - clipVertex1.y) - 
         (clipVertex2.y - clipVertex1.y) * (point.x - clipVertex1.x) >= 0
}

function getIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x)
  if (Math.abs(denom) < 1e-10) return null
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom
  
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  }
}

export function polygonToSVGPath(polygon: Point[]): string {
  if (polygon.length === 0) return ''
  
  let path = `M ${polygon[0].x} ${polygon[0].y}`
  for (let i = 1; i < polygon.length; i++) {
    path += ` L ${polygon[i].x} ${polygon[i].y}`
  }
  path += ' Z'
  return path
}

// Main tessellation generator
export interface SeaRoute {
  from: string
  to: string
  path: string
  connectionPoints: {
    fromPoint: Point
    toPoint: Point
  }
}

export function generateVoronoiTessellation(
  seeds: VoronoiSeed[],
  continentBoundaries: ContinentBoundary[],
  boundingBox: { width: number; height: number }
): { territories: VoronoiTerritory[]; seaRoutes: SeaRoute[] } {
  // Prepare points for Delaunay triangulation
  const points: [number, number][] = seeds.map(seed => [seed.point.x, seed.point.y])
  
  // Generate Voronoi diagram using D3
  const delaunay = Delaunay.from(points)
  const voronoi = delaunay.voronoi([0, 0, boundingBox.width, boundingBox.height])
  
  const territories: VoronoiTerritory[] = []
  
  seeds.forEach((seed, index) => {
    // Get raw Voronoi cell
    const cellPolygon = voronoi.cellPolygon(index)
    if (!cellPolygon) return
    
    const rawCell = cellPolygon.map(([x, y]) => ({ x, y }))
    
    // Find the continent this seed belongs to
    const continent = continentBoundaries.find(cont => 
      pointInPolygon(seed.point, cont.outline)
    )
    
    if (!continent) return
    
    // Clip the Voronoi cell to the continent boundary
    const clippedCell = clipPolygonToContinent(rawCell, continent.outline)
    
    // Convert to edges
    const edges: Edge[] = []
    for (let i = 0; i < clippedCell.length; i++) {
      const start = clippedCell[i]
      const end = clippedCell[(i + 1) % clippedCell.length]
      edges.push({ start, end })
    }
    
    territories.push({
      id: seed.territoryId,
      seed: seed.point,
      cell: {
        vertices: clippedCell,
        edges: edges
      },
      svgPath: polygonToSVGPath(clippedCell),
      continentId: continent.id,
      neighbors: [] // Will be calculated separately
    })
  })
  
  // Calculate neighbors based on shared edges
  territories.forEach(territory => {
    territory.neighbors = territories
      .filter(other => other.id !== territory.id)
      .filter(other => shareEdge(territory.cell, other.cell))
      .map(other => other.id)
  })
  
  // Generate dynamic sea routes
  const seaRoutes = generateSeaRoutes(territories, continentBoundaries)
  
  return { territories, seaRoutes }
}

function shareEdge(cell1: Polygon, cell2: Polygon): boolean {
  const tolerance = 2.0 // Allow some tolerance for floating point precision
  
  for (const edge1 of cell1.edges) {
    for (const edge2 of cell2.edges) {
      // Check if edges are approximately the same (in reverse direction)
      if (
        (distance(edge1.start, edge2.end) < tolerance && distance(edge1.end, edge2.start) < tolerance) ||
        (distance(edge1.start, edge2.start) < tolerance && distance(edge1.end, edge2.end) < tolerance)
      ) {
        return true
      }
    }
  }
  return false
}

function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

// Sea route generation using actual territory boundaries
function generateSeaRoutes(
  territories: VoronoiTerritory[],
  continentBoundaries: ContinentBoundary[]
): SeaRoute[] {
  const seaRoutes: SeaRoute[] = []
  
  // Define which territories should have sea connections (from our original graph)
  const seaConnections = [
    { from: 'alaska', to: 'kamchatka' },
    { from: 'greenland', to: 'iceland' },
    { from: 'brazil', to: 'north-africa' },
    { from: 'western-europe', to: 'north-africa' },
    { from: 'southern-europe', to: 'egypt' },
    { from: 'middle-east', to: 'east-africa' },
    { from: 'siam', to: 'indonesia' },
    { from: 'eastern-australia', to: 'peru' }
  ]
  
  seaConnections.forEach(connection => {
    const fromTerritory = territories.find(t => t.id === connection.from)
    const toTerritory = territories.find(t => t.id === connection.to)
    
    if (!fromTerritory || !toTerritory) return
    
    // Find the closest points between the two territories
    const connectionPoints = findOptimalSeaConnection(fromTerritory, toTerritory, continentBoundaries)
    
    if (connectionPoints) {
      // Create a curved sea route path
      const seaPath = createSeaRoutePath(connectionPoints.fromPoint, connectionPoints.toPoint)
      
      seaRoutes.push({
        from: connection.from,
        to: connection.to,
        path: seaPath,
        connectionPoints
      })
    }
  })
  
  return seaRoutes
}

function findOptimalSeaConnection(
  fromTerritory: VoronoiTerritory,
  toTerritory: VoronoiTerritory,
  continentBoundaries: ContinentBoundary[]
): { fromPoint: Point; toPoint: Point } | null {
  
  const fromContinent = continentBoundaries.find(c => c.id === fromTerritory.continentId)
  const toContinent = continentBoundaries.find(c => c.id === toTerritory.continentId)
  
  if (!fromContinent || !toContinent) return null
  
  // Find coastal points (vertices that are on continent boundaries)
  const fromCoastalPoints = findCoastalPoints(fromTerritory, fromContinent)
  const toCoastalPoints = findCoastalPoints(toTerritory, toContinent)
  
  // Find the closest pair of coastal points
  let minDistance = Infinity
  let bestConnection: { fromPoint: Point; toPoint: Point } | null = null
  
  fromCoastalPoints.forEach(fromPoint => {
    toCoastalPoints.forEach(toPoint => {
      const dist = distance(fromPoint, toPoint)
      if (dist < minDistance) {
        minDistance = dist
        bestConnection = { fromPoint, toPoint }
      }
    })
  })
  
  return bestConnection
}

function findCoastalPoints(territory: VoronoiTerritory, continent: ContinentBoundary): Point[] {
  const coastalPoints: Point[] = []
  const tolerance = 5.0
  
  // Check which territory vertices are close to the continent boundary
  territory.cell.vertices.forEach(vertex => {
    const isCoastal = continent.outline.some(boundaryPoint => 
      distance(vertex, boundaryPoint) < tolerance
    )
    
    if (isCoastal) {
      coastalPoints.push(vertex)
    }
  })
  
  // If no coastal points found, use the territory seed point
  if (coastalPoints.length === 0) {
    coastalPoints.push(territory.seed)
  }
  
  return coastalPoints
}

function createSeaRoutePath(fromPoint: Point, toPoint: Point): string {
  // Create a curved path for the sea route
  const midX = (fromPoint.x + toPoint.x) / 2
  const midY = (fromPoint.y + toPoint.y) / 2
  
  // Add some curvature based on the distance and direction
  const dx = toPoint.x - fromPoint.x
  const dy = toPoint.y - fromPoint.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Create control point for bezier curve (perpendicular offset)
  const curvature = Math.min(distance * 0.2, 50) // Max curvature of 50px
  const perpX = -dy / distance * curvature
  const perpY = dx / distance * curvature
  
  const controlX = midX + perpX
  const controlY = midY + perpY
  
  return `M ${fromPoint.x} ${fromPoint.y} Q ${controlX} ${controlY} ${toPoint.x} ${toPoint.y}`
}