// Optimized map data structure with separate borders

export interface Point {
  x: number
  y: number
}

export interface Territory {
  id: string
  name: string
  continent: string
  center: Point
  fillPath: string
  borderSegments: string[] // IDs of borders that form this territory
  zIndex?: number // Optional for backward compatibility
}

export interface Border {
  id: string
  path: string
  territories: [string, string] // Always exactly 2 territories
  type: 'land' | 'sea' | 'coast'
  points: Point[] // Simplified points for hit detection
}

export interface Continent {
  id: string
  name: string
  territories: string[]
  bonus: number
  color: string
}

export interface MapData {
  version: string
  metadata: {
    name: string
    author: string
    created: string
  }
  territories: Record<string, Territory>
  borders: Record<string, Border>
  continents: Record<string, Continent>
}

// Helper class for map operations
export class TerritoryMap {
  private data: MapData
  private territoryBordersIndex: Map<string, Set<string>> = new Map()
  
  constructor(data: MapData) {
    this.data = data
    this.buildIndices()
  }
  
  private buildIndices() {
    // Build territory -> borders index
    Object.entries(this.data.territories).forEach(([id, territory]) => {
      this.territoryBordersIndex.set(id, new Set(territory.borderSegments))
    })
  }
  
  getTerritory(id: string): Territory | undefined {
    return this.data.territories[id]
  }
  
  getBorder(id: string): Border | undefined {
    return this.data.borders[id]
  }
  
  getTerritoryBorders(territoryId: string): Border[] {
    const territory = this.data.territories[territoryId]
    if (!territory) return []
    return territory.borderSegments
      .map(id => this.data.borders[id])
      .filter(Boolean)
  }
  
  getNeighbors(territoryId: string): string[] {
    const borders = this.getTerritoryBorders(territoryId)
    const neighbors = new Set<string>()
    
    borders.forEach(border => {
      const [t1, t2] = border.territories
      if (t1 === territoryId) {
        neighbors.add(t2)
      } else {
        neighbors.add(t1)
      }
    })
    
    return Array.from(neighbors)
  }
  
  getBorderBetween(territory1: string, territory2: string): Border | undefined {
    const borders = this.getTerritoryBorders(territory1)
    return borders.find(border => {
      const [t1, t2] = border.territories
      return (t1 === territory1 && t2 === territory2) || 
             (t1 === territory2 && t2 === territory1)
    })
  }
  
  getTerritoryAtPoint(x: number, y: number): string | null {
    // Simple point-in-polygon test using ray casting
    // In production, use a spatial index for performance
    for (const [id, territory] of Object.entries(this.data.territories)) {
      if (this.isPointInPath(x, y, territory.fillPath)) {
        return id
      }
    }
    return null
  }
  
  private isPointInPath(x: number, y: number, svgPath: string): boolean {
    // Simplified - in production use proper SVG path parsing
    // This is a placeholder that always returns false
    return false
  }
}

// Sample map data - a simplified world with a few territories
export const SAMPLE_MAP_DATA: MapData = {
  version: "1.0",
  metadata: {
    name: "Simple World",
    author: "System",
    created: "2024-01-01"
  },
  territories: {
    // North America
    "alaska": {
      id: "alaska",
      name: "Alaska",
      continent: "north-america",
      center: { x: 70, y: 70 },
      fillPath: "M 30 50 L 80 40 L 110 60 L 100 90 L 60 100 L 30 80 Z",
      borderSegments: ["b1", "b2", "b4", "b5", "b6", "b16"]
    },
    "northwest-territory": {
      id: "northwest-territory",
      name: "Northwest Territory",
      continent: "north-america",
      center: { x: 150, y: 70 },
      fillPath: "M 110 60 L 190 50 L 200 90 L 180 100 L 100 90 Z",
      borderSegments: ["b2", "b7", "b8", "b9", "b10", "b11"]
    },
    "greenland": {
      id: "greenland",
      name: "Greenland",
      continent: "north-america",
      center: { x: 250, y: 50 },
      fillPath: "M 200 20 L 280 15 L 300 60 L 270 80 L 200 90 L 190 50 Z",
      borderSegments: ["b7", "b12", "b13", "b14", "b15", "b17", "b25"]
    },
    
    // Asia
    "kamchatka": {
      id: "kamchatka",
      name: "Kamchatka",
      continent: "asia",
      center: { x: 750, y: 80 },
      fillPath: "M 720 50 L 780 40 L 790 100 L 750 120 L 710 90 Z",
      borderSegments: ["b16", "b18", "b19", "b20", "b35"]
    },
    "siberia": {
      id: "siberia",
      name: "Siberia",
      continent: "asia",
      center: { x: 650, y: 100 },
      fillPath: "M 600 80 L 710 90 L 750 120 L 700 130 L 620 140 L 580 110 Z",
      borderSegments: ["b19", "b21", "b22", "b23", "b24", "b37"]
    },
    
    // Europe
    "iceland": {
      id: "iceland",
      name: "Iceland",
      continent: "europe",
      center: { x: 350, y: 80 },
      fillPath: "M 320 70 L 380 65 L 385 90 L 340 95 L 315 85 Z",
      borderSegments: ["b25", "b26", "b27", "b28", "b29"]
    },
    "scandinavia": {
      id: "scandinavia",
      name: "Scandinavia",
      continent: "europe",
      center: { x: 450, y: 90 },
      fillPath: "M 420 70 L 480 75 L 490 110 L 440 120 L 410 100 Z",
      borderSegments: ["b30", "b31", "b32", "b33", "b34"]
    }
  },
  borders: {
    // Alaska borders
    "b1": {
      id: "b1",
      path: "M 30 50 L 80 40",
      territories: ["alaska", "ocean"],
      type: "coast",
      points: [{x: 30, y: 50}, {x: 80, y: 40}]
    },
    "b2": {
      id: "b2",
      path: "M 110 60 L 100 90",
      territories: ["alaska", "northwest-territory"],
      type: "land",
      points: [{x: 110, y: 60}, {x: 100, y: 90}]
    },
    "b4": {
      id: "b4",
      path: "M 100 90 L 60 100",
      territories: ["alaska", "ocean"],
      type: "coast",
      points: [{x: 100, y: 90}, {x: 60, y: 100}]
    },
    "b5": {
      id: "b5",
      path: "M 60 100 L 30 80",
      territories: ["alaska", "ocean"],
      type: "coast",
      points: [{x: 60, y: 100}, {x: 30, y: 80}]
    },
    "b6": {
      id: "b6",
      path: "M 30 80 L 30 50",
      territories: ["alaska", "ocean"],
      type: "coast",
      points: [{x: 30, y: 80}, {x: 30, y: 50}]
    },
    
    // Northwest Territory borders
    "b7": {
      id: "b7",
      path: "M 190 50 L 200 90",
      territories: ["northwest-territory", "greenland"],
      type: "land",
      points: [{x: 190, y: 50}, {x: 200, y: 90}]
    },
    "b8": {
      id: "b8",
      path: "M 200 90 L 180 100",
      territories: ["northwest-territory", "ocean"],
      type: "coast",
      points: [{x: 200, y: 90}, {x: 180, y: 100}]
    },
    "b9": {
      id: "b9",
      path: "M 180 100 L 100 90",
      territories: ["northwest-territory", "ocean"],
      type: "coast",
      points: [{x: 180, y: 100}, {x: 100, y: 90}]
    },
    "b10": {
      id: "b10",
      path: "M 110 60 L 190 50",
      territories: ["northwest-territory", "ocean"],
      type: "coast",
      points: [{x: 110, y: 60}, {x: 190, y: 50}]
    },
    
    // Sea connections
    "b16": {
      id: "b16",
      path: "M 110 60 Q 400 20 720 50",
      territories: ["alaska", "kamchatka"],
      type: "sea",
      points: [{x: 110, y: 60}, {x: 400, y: 20}, {x: 720, y: 50}]
    },
    "b25": {
      id: "b25",
      path: "M 270 80 Q 300 85 320 70",
      territories: ["greenland", "iceland"],
      type: "sea",
      points: [{x: 270, y: 80}, {x: 300, y: 85}, {x: 320, y: 70}]
    },
    
    "b11": {
      id: "b11", 
      path: "M 110 60 L 190 50", 
      territories: ["northwest-territory", "ocean"], 
      type: "coast", 
      points: [{x: 110, y: 60}, {x: 190, y: 50}]
    },
    "b12": { id: "b12", path: "M 280 15 L 300 60", territories: ["greenland", "ocean"], type: "coast", points: [] },
    "b13": { id: "b13", path: "M 300 60 L 270 80", territories: ["greenland", "ocean"], type: "coast", points: [] },
    "b14": { id: "b14", path: "M 270 80 L 200 90", territories: ["greenland", "ocean"], type: "coast", points: [] },
    "b15": { id: "b15", path: "M 200 90 L 200 20", territories: ["greenland", "ocean"], type: "coast", points: [] },
    
    "b17": { id: "b17", path: "M 200 20 L 190 50", territories: ["greenland", "ocean"], type: "coast", points: [{x: 200, y: 20}, {x: 190, y: 50}] },
    "b18": { id: "b18", path: "M 780 40 L 790 100", territories: ["kamchatka", "ocean"], type: "coast", points: [] },
    "b19": { id: "b19", path: "M 710 90 L 750 120", territories: ["kamchatka", "siberia"], type: "land", points: [{x: 710, y: 90}, {x: 750, y: 120}] },
    "b20": { id: "b20", path: "M 790 100 L 750 120", territories: ["kamchatka", "ocean"], type: "coast", points: [] },
    
    "b21": { id: "b21", path: "M 600 80 L 710 90", territories: ["siberia", "ocean"], type: "coast", points: [] },
    "b22": { id: "b22", path: "M 700 130 L 620 140", territories: ["siberia", "ocean"], type: "coast", points: [] },
    "b37": { id: "b37", path: "M 750 120 L 700 130", territories: ["siberia", "ocean"], type: "coast", points: [{x: 750, y: 120}, {x: 700, y: 130}] },
    "b23": { id: "b23", path: "M 620 140 L 580 110", territories: ["siberia", "ocean"], type: "coast", points: [] },
    "b24": { id: "b24", path: "M 580 110 L 600 80", territories: ["siberia", "ocean"], type: "coast", points: [] },
    
    "b26": { id: "b26", path: "M 320 70 L 380 65", territories: ["iceland", "ocean"], type: "coast", points: [] },
    "b27": { id: "b27", path: "M 380 65 L 385 90", territories: ["iceland", "ocean"], type: "coast", points: [] },
    "b28": { id: "b28", path: "M 385 90 L 340 95", territories: ["iceland", "ocean"], type: "coast", points: [] },
    "b29": { id: "b29", path: "M 340 95 L 315 85 L 320 70", territories: ["iceland", "ocean"], type: "coast", points: [] },
    
    "b30": { id: "b30", path: "M 420 70 L 480 75", territories: ["scandinavia", "ocean"], type: "coast", points: [] },
    "b31": { id: "b31", path: "M 480 75 L 490 110", territories: ["scandinavia", "ocean"], type: "coast", points: [] },
    "b32": { id: "b32", path: "M 490 110 L 440 120", territories: ["scandinavia", "ocean"], type: "coast", points: [] },
    "b33": { id: "b33", path: "M 440 120 L 410 100", territories: ["scandinavia", "ocean"], type: "coast", points: [] },
    "b34": { id: "b34", path: "M 410 100 L 420 70", territories: ["scandinavia", "ocean"], type: "coast", points: [] },
    "b35": { id: "b35", path: "M 720 50 L 710 90", territories: ["kamchatka", "ocean"], type: "coast", points: [{x: 720, y: 50}, {x: 710, y: 90}] }
  },
  continents: {
    "north-america": {
      id: "north-america",
      name: "North America",
      territories: ["alaska", "northwest-territory", "greenland"],
      bonus: 5,
      color: "#4B5563"
    },
    "asia": {
      id: "asia",
      name: "Asia",
      territories: ["kamchatka", "siberia"],
      bonus: 7,
      color: "#7C3AED"
    },
    "europe": {
      id: "europe",
      name: "Europe",
      territories: ["iceland", "scandinavia"],
      bonus: 5,
      color: "#2563EB"
    }
  }
}