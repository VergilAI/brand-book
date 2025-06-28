export interface Continent {
  id: string
  name: string
  color: string // Base continent color for visual grouping
  bonusArmies: number // Bonus for controlling entire continent
}

export interface TerritoryNode {
  id: string
  name: string
  continentId: string
  center: { x: number; y: number }
  // SVG path data for rendering
  path: string
  // Optional army placement point if different from center
  armyPosition?: { x: number; y: number }
}

export interface TerritoryConnection {
  from: string
  to: string
  type: 'land' | 'sea'
  // Optional path for sea routes (dotted lines)
  seaPath?: string
}

export interface TerritoryGraph {
  territories: Map<string, TerritoryNode>
  connections: TerritoryConnection[]
  continents: Map<string, Continent>
}

export interface GameTerritory extends TerritoryNode {
  owner?: string
  armies: number
}

// Define continents
export const CONTINENTS: Continent[] = [
  { id: 'north-america', name: 'North America', color: '#E5E7EB', bonusArmies: 5 },
  { id: 'south-america', name: 'South America', color: '#F3F4F6', bonusArmies: 2 },
  { id: 'europe', name: 'Europe', color: '#E5E7EB', bonusArmies: 5 },
  { id: 'africa', name: 'Africa', color: '#F3F4F6', bonusArmies: 3 },
  { id: 'asia', name: 'Asia', color: '#E5E7EB', bonusArmies: 7 },
  { id: 'oceania', name: 'Oceania', color: '#F3F4F6', bonusArmies: 2 },
]

// Define all territories with their continental assignments
export const TERRITORY_NODES: TerritoryNode[] = [
  // North America (9 territories)
  {
    id: 'alaska',
    name: 'Alaska',
    continentId: 'north-america',
    center: { x: 70, y: 80 },
    path: 'M 40 60 L 100 50 L 110 90 L 80 110 L 50 100 L 40 80 Z'
  },
  {
    id: 'northwest-territory',
    name: 'Northwest Territory',
    continentId: 'north-america',
    center: { x: 150, y: 80 },
    path: 'M 110 60 L 190 60 L 200 100 L 160 110 L 120 100 L 110 80 Z'
  },
  {
    id: 'greenland',
    name: 'Greenland',
    continentId: 'north-america',
    center: { x: 320, y: 60 },
    path: 'M 290 40 L 350 30 L 360 80 L 330 90 L 300 85 L 290 60 Z'
  },
  {
    id: 'alberta',
    name: 'Alberta',
    continentId: 'north-america',
    center: { x: 130, y: 130 },
    path: 'M 100 110 L 160 110 L 165 150 L 130 155 L 95 150 L 95 130 Z'
  },
  {
    id: 'ontario',
    name: 'Ontario',
    continentId: 'north-america',
    center: { x: 190, y: 130 },
    path: 'M 165 110 L 215 110 L 220 150 L 190 155 L 160 150 L 165 130 Z'
  },
  {
    id: 'quebec',
    name: 'Quebec',
    continentId: 'north-america',
    center: { x: 250, y: 130 },
    path: 'M 220 110 L 280 105 L 285 145 L 255 155 L 215 150 L 220 130 Z'
  },
  {
    id: 'western-us',
    name: 'Western United States',
    continentId: 'north-america',
    center: { x: 130, y: 180 },
    path: 'M 95 160 L 165 160 L 170 210 L 130 220 L 90 210 L 90 180 Z'
  },
  {
    id: 'eastern-us',
    name: 'Eastern United States',
    continentId: 'north-america',
    center: { x: 210, y: 180 },
    path: 'M 170 160 L 250 155 L 255 205 L 215 220 L 165 210 L 170 180 Z'
  },
  {
    id: 'central-america',
    name: 'Central America',
    continentId: 'north-america',
    center: { x: 150, y: 250 },
    path: 'M 120 225 L 180 220 L 185 270 L 160 280 L 130 275 L 120 250 Z'
  },

  // South America (4 territories)
  {
    id: 'venezuela',
    name: 'Venezuela',
    continentId: 'south-america',
    center: { x: 180, y: 310 },
    path: 'M 150 285 L 210 280 L 215 330 L 190 340 L 155 335 L 150 310 Z'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    continentId: 'south-america',
    center: { x: 230, y: 360 },
    path: 'M 190 340 L 270 335 L 280 390 L 240 410 L 195 400 L 190 360 Z'
  },
  {
    id: 'peru',
    name: 'Peru',
    continentId: 'south-america',
    center: { x: 170, y: 380 },
    path: 'M 140 355 L 200 350 L 205 400 L 175 415 L 145 410 L 140 380 Z'
  },
  {
    id: 'argentina',
    name: 'Argentina',
    continentId: 'south-america',
    center: { x: 200, y: 440 },
    path: 'M 170 415 L 230 410 L 235 470 L 205 485 L 175 480 L 170 440 Z'
  },

  // Europe (7 territories)
  {
    id: 'iceland',
    name: 'Iceland',
    continentId: 'europe',
    center: { x: 380, y: 90 },
    path: 'M 360 75 L 400 70 L 405 105 L 385 110 L 365 105 L 360 90 Z'
  },
  {
    id: 'great-britain',
    name: 'Great Britain',
    continentId: 'europe',
    center: { x: 420, y: 130 },
    path: 'M 400 115 L 440 110 L 445 145 L 425 150 L 405 145 L 400 130 Z'
  },
  {
    id: 'western-europe',
    name: 'Western Europe',
    continentId: 'europe',
    center: { x: 430, y: 180 },
    path: 'M 405 160 L 455 155 L 460 200 L 435 210 L 400 205 L 405 180 Z'
  },
  {
    id: 'northern-europe',
    name: 'Northern Europe',
    continentId: 'europe',
    center: { x: 480, y: 130 },
    path: 'M 455 110 L 505 105 L 510 150 L 485 155 L 450 150 L 455 130 Z'
  },
  {
    id: 'southern-europe',
    name: 'Southern Europe',
    continentId: 'europe',
    center: { x: 480, y: 180 },
    path: 'M 460 160 L 500 155 L 505 200 L 485 210 L 455 205 L 460 180 Z'
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    continentId: 'europe',
    center: { x: 530, y: 155 },
    path: 'M 510 135 L 550 130 L 555 175 L 535 180 L 505 175 L 510 155 Z'
  },
  {
    id: 'scandinavia',
    name: 'Scandinavia',
    continentId: 'europe',
    center: { x: 480, y: 80 },
    path: 'M 460 60 L 500 55 L 505 100 L 485 105 L 455 100 L 460 80 Z'
  },

  // Africa (6 territories)
  {
    id: 'north-africa',
    name: 'North Africa',
    continentId: 'africa',
    center: { x: 450, y: 250 },
    path: 'M 420 230 L 480 225 L 485 270 L 455 280 L 415 275 L 420 250 Z'
  },
  {
    id: 'egypt',
    name: 'Egypt',
    continentId: 'africa',
    center: { x: 510, y: 250 },
    path: 'M 485 230 L 535 225 L 540 270 L 515 280 L 480 275 L 485 250 Z'
  },
  {
    id: 'east-africa',
    name: 'East Africa',
    continentId: 'africa',
    center: { x: 530, y: 310 },
    path: 'M 505 285 L 555 280 L 560 335 L 535 345 L 500 340 L 505 310 Z'
  },
  {
    id: 'congo',
    name: 'Congo',
    continentId: 'africa',
    center: { x: 480, y: 340 },
    path: 'M 455 320 L 505 315 L 510 360 L 485 370 L 450 365 L 455 340 Z'
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    continentId: 'africa',
    center: { x: 480, y: 400 },
    path: 'M 455 375 L 505 370 L 510 425 L 485 435 L 450 430 L 455 400 Z'
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    continentId: 'africa',
    center: { x: 560, y: 390 },
    path: 'M 545 370 L 575 365 L 580 410 L 565 415 L 540 410 L 545 390 Z'
  },

  // Asia (12 territories)
  {
    id: 'ural',
    name: 'Ural',
    continentId: 'asia',
    center: { x: 580, y: 120 },
    path: 'M 560 100 L 600 95 L 605 140 L 585 145 L 555 140 L 560 120 Z'
  },
  {
    id: 'siberia',
    name: 'Siberia',
    continentId: 'asia',
    center: { x: 640, y: 100 },
    path: 'M 610 80 L 670 75 L 675 120 L 645 125 L 605 120 L 610 100 Z'
  },
  {
    id: 'yakutsk',
    name: 'Yakutsk',
    continentId: 'asia',
    center: { x: 720, y: 80 },
    path: 'M 690 60 L 750 55 L 755 100 L 725 105 L 685 100 L 690 80 Z'
  },
  {
    id: 'kamchatka',
    name: 'Kamchatka',
    continentId: 'asia',
    center: { x: 800, y: 80 },
    path: 'M 770 60 L 830 55 L 835 100 L 805 105 L 765 100 L 770 80 Z'
  },
  {
    id: 'irkutsk',
    name: 'Irkutsk',
    continentId: 'asia',
    center: { x: 700, y: 130 },
    path: 'M 670 110 L 730 105 L 735 150 L 705 155 L 665 150 L 670 130 Z'
  },
  {
    id: 'mongolia',
    name: 'Mongolia',
    continentId: 'asia',
    center: { x: 720, y: 180 },
    path: 'M 690 160 L 750 155 L 755 200 L 725 205 L 685 200 L 690 180 Z'
  },
  {
    id: 'japan',
    name: 'Japan',
    continentId: 'asia',
    center: { x: 820, y: 180 },
    path: 'M 805 160 L 835 155 L 840 200 L 825 205 L 800 200 L 805 180 Z'
  },
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    continentId: 'asia',
    center: { x: 600, y: 180 },
    path: 'M 575 160 L 625 155 L 630 200 L 605 205 L 570 200 L 575 180 Z'
  },
  {
    id: 'china',
    name: 'China',
    continentId: 'asia',
    center: { x: 720, y: 230 },
    path: 'M 690 210 L 750 205 L 755 250 L 725 255 L 685 250 L 690 230 Z'
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    continentId: 'asia',
    center: { x: 570, y: 230 },
    path: 'M 545 210 L 595 205 L 600 250 L 575 255 L 540 250 L 545 230 Z'
  },
  {
    id: 'india',
    name: 'India',
    continentId: 'asia',
    center: { x: 640, y: 280 },
    path: 'M 615 260 L 665 255 L 670 300 L 645 305 L 610 300 L 615 280 Z'
  },
  {
    id: 'siam',
    name: 'Siam',
    continentId: 'asia',
    center: { x: 710, y: 300 },
    path: 'M 685 280 L 735 275 L 740 320 L 715 325 L 680 320 L 685 300 Z'
  },

  // Oceania (4 territories)
  {
    id: 'indonesia',
    name: 'Indonesia',
    continentId: 'oceania',
    center: { x: 750, y: 360 },
    path: 'M 720 340 L 780 335 L 785 380 L 755 385 L 715 380 L 720 360 Z'
  },
  {
    id: 'new-guinea',
    name: 'New Guinea',
    continentId: 'oceania',
    center: { x: 820, y: 360 },
    path: 'M 795 340 L 845 335 L 850 380 L 825 385 L 790 380 L 795 360 Z'
  },
  {
    id: 'western-australia',
    name: 'Western Australia',
    continentId: 'oceania',
    center: { x: 760, y: 430 },
    path: 'M 730 410 L 790 405 L 795 450 L 765 455 L 725 450 L 730 430 Z'
  },
  {
    id: 'eastern-australia',
    name: 'Eastern Australia',
    continentId: 'oceania',
    center: { x: 830, y: 430 },
    path: 'M 800 410 L 860 405 L 865 450 L 835 455 L 795 450 L 800 430 Z'
  },
]

// Define all connections between territories
export const TERRITORY_CONNECTIONS: TerritoryConnection[] = [
  // North America internal connections
  { from: 'alaska', to: 'northwest-territory', type: 'land' },
  { from: 'alaska', to: 'alberta', type: 'land' },
  { from: 'northwest-territory', to: 'alberta', type: 'land' },
  { from: 'northwest-territory', to: 'ontario', type: 'land' },
  { from: 'northwest-territory', to: 'greenland', type: 'land' },
  { from: 'alberta', to: 'ontario', type: 'land' },
  { from: 'alberta', to: 'western-us', type: 'land' },
  { from: 'ontario', to: 'quebec', type: 'land' },
  { from: 'ontario', to: 'western-us', type: 'land' },
  { from: 'ontario', to: 'eastern-us', type: 'land' },
  { from: 'quebec', to: 'eastern-us', type: 'land' },
  { from: 'greenland', to: 'quebec', type: 'land' },
  { from: 'western-us', to: 'eastern-us', type: 'land' },
  { from: 'western-us', to: 'central-america', type: 'land' },
  { from: 'eastern-us', to: 'central-america', type: 'land' },

  // South America internal connections
  { from: 'venezuela', to: 'brazil', type: 'land' },
  { from: 'venezuela', to: 'peru', type: 'land' },
  { from: 'brazil', to: 'peru', type: 'land' },
  { from: 'brazil', to: 'argentina', type: 'land' },
  { from: 'peru', to: 'argentina', type: 'land' },

  // Europe internal connections
  { from: 'iceland', to: 'scandinavia', type: 'land' },
  { from: 'iceland', to: 'great-britain', type: 'land' },
  { from: 'great-britain', to: 'western-europe', type: 'land' },
  { from: 'great-britain', to: 'northern-europe', type: 'land' },
  { from: 'scandinavia', to: 'northern-europe', type: 'land' },
  { from: 'western-europe', to: 'southern-europe', type: 'land' },
  { from: 'western-europe', to: 'northern-europe', type: 'land' },
  { from: 'northern-europe', to: 'southern-europe', type: 'land' },
  { from: 'northern-europe', to: 'ukraine', type: 'land' },
  { from: 'scandinavia', to: 'ukraine', type: 'land' },
  { from: 'southern-europe', to: 'ukraine', type: 'land' },

  // Africa internal connections
  { from: 'north-africa', to: 'egypt', type: 'land' },
  { from: 'north-africa', to: 'east-africa', type: 'land' },
  { from: 'north-africa', to: 'congo', type: 'land' },
  { from: 'egypt', to: 'east-africa', type: 'land' },
  { from: 'east-africa', to: 'congo', type: 'land' },
  { from: 'east-africa', to: 'south-africa', type: 'land' },
  { from: 'east-africa', to: 'madagascar', type: 'land' },
  { from: 'congo', to: 'south-africa', type: 'land' },
  { from: 'south-africa', to: 'madagascar', type: 'land' },

  // Asia internal connections
  { from: 'ural', to: 'siberia', type: 'land' },
  { from: 'ural', to: 'afghanistan', type: 'land' },
  { from: 'siberia', to: 'yakutsk', type: 'land' },
  { from: 'siberia', to: 'irkutsk', type: 'land' },
  { from: 'siberia', to: 'mongolia', type: 'land' },
  { from: 'yakutsk', to: 'kamchatka', type: 'land' },
  { from: 'yakutsk', to: 'irkutsk', type: 'land' },
  { from: 'irkutsk', to: 'kamchatka', type: 'land' },
  { from: 'irkutsk', to: 'mongolia', type: 'land' },
  { from: 'kamchatka', to: 'japan', type: 'land' },
  { from: 'kamchatka', to: 'mongolia', type: 'land' },
  { from: 'mongolia', to: 'japan', type: 'land' },
  { from: 'mongolia', to: 'china', type: 'land' },
  { from: 'afghanistan', to: 'china', type: 'land' },
  { from: 'afghanistan', to: 'india', type: 'land' },
  { from: 'afghanistan', to: 'middle-east', type: 'land' },
  { from: 'china', to: 'india', type: 'land' },
  { from: 'china', to: 'siam', type: 'land' },
  { from: 'india', to: 'siam', type: 'land' },
  { from: 'india', to: 'middle-east', type: 'land' },

  // Oceania internal connections
  { from: 'indonesia', to: 'new-guinea', type: 'land' },
  { from: 'indonesia', to: 'western-australia', type: 'land' },
  { from: 'new-guinea', to: 'western-australia', type: 'land' },
  { from: 'new-guinea', to: 'eastern-australia', type: 'land' },
  { from: 'western-australia', to: 'eastern-australia', type: 'land' },

  // Inter-continental connections (sea routes)
  { from: 'alaska', to: 'kamchatka', type: 'sea', seaPath: 'M 100 80 Q 450 20 800 80' },
  { from: 'greenland', to: 'iceland', type: 'sea', seaPath: 'M 340 70 Q 360 70 380 85' },
  { from: 'central-america', to: 'venezuela', type: 'land' },
  { from: 'brazil', to: 'north-africa', type: 'sea', seaPath: 'M 260 380 Q 350 320 440 250' },
  { from: 'western-europe', to: 'north-africa', type: 'sea', seaPath: 'M 435 200 Q 440 225 450 250' },
  { from: 'southern-europe', to: 'north-africa', type: 'sea', seaPath: 'M 485 200 Q 475 225 470 250' },
  { from: 'southern-europe', to: 'egypt', type: 'sea', seaPath: 'M 490 200 Q 500 225 510 250' },
  { from: 'ukraine', to: 'ural', type: 'land' },
  { from: 'ukraine', to: 'afghanistan', type: 'land' },
  { from: 'ukraine', to: 'middle-east', type: 'land' },
  { from: 'middle-east', to: 'egypt', type: 'land' },
  { from: 'middle-east', to: 'east-africa', type: 'sea', seaPath: 'M 570 255 Q 550 280 530 310' },
  { from: 'siam', to: 'indonesia', type: 'sea', seaPath: 'M 715 320 Q 730 340 750 360' },
  { from: 'eastern-australia', to: 'peru', type: 'sea', seaPath: 'M 830 450 Q 500 500 170 380' },
]

// Helper functions
export function createTerritoryGraph(): TerritoryGraph {
  const territories = new Map<string, TerritoryNode>()
  const continents = new Map<string, Continent>()

  // Add all territories to the map
  TERRITORY_NODES.forEach(territory => {
    territories.set(territory.id, territory)
  })

  // Add all continents to the map
  CONTINENTS.forEach(continent => {
    continents.set(continent.id, continent)
  })

  return {
    territories,
    connections: TERRITORY_CONNECTIONS,
    continents
  }
}

export function getNeighbors(territoryId: string, graph: TerritoryGraph): string[] {
  const neighbors: string[] = []
  
  graph.connections.forEach(connection => {
    if (connection.from === territoryId) {
      neighbors.push(connection.to)
    } else if (connection.to === territoryId) {
      neighbors.push(connection.from)
    }
  })
  
  return [...new Set(neighbors)] // Remove duplicates
}

export function getConnection(from: string, to: string, graph: TerritoryGraph): TerritoryConnection | undefined {
  return graph.connections.find(
    conn => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)
  )
}

export function getContinentTerritories(continentId: string, graph: TerritoryGraph): TerritoryNode[] {
  return Array.from(graph.territories.values()).filter(
    territory => territory.continentId === continentId
  )
}

export function isConnected(from: string, to: string, graph: TerritoryGraph): boolean {
  return getNeighbors(from, graph).includes(to)
}