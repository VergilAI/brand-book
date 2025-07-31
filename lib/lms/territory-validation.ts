import { TerritoryGraph, getNeighbors } from './territory-conquest-data'
import { VoronoiTerritory } from './voronoi-tessellation'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  statistics: {
    totalTerritories: number
    connectedComponents: number
    isolatedTerritories: string[]
    averageNeighbors: number
    continentConnectivity: Record<string, number>
  }
}

export interface GraphVoronoiMapping {
  territoryId: string
  hasGraphNode: boolean
  hasVoronoiCell: boolean
  graphNeighbors: string[]
  voronoiNeighbors: string[]
  neighborMismatches: string[]
}

export function validateGraphVoronoiConsistency(
  graph: TerritoryGraph,
  voronoiTerritories: VoronoiTerritory[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Create lookup maps
  const voronoiMap = new Map<string, VoronoiTerritory>()
  voronoiTerritories.forEach(t => voronoiMap.set(t.id, t))
  
  const mappings: GraphVoronoiMapping[] = []
  
  // Check each territory in the graph
  Array.from(graph.territories.keys()).forEach(territoryId => {
    const hasGraphNode = graph.territories.has(territoryId)
    const hasVoronoiCell = voronoiMap.has(territoryId)
    const graphNeighbors = getNeighbors(territoryId, graph)
    const voronoiNeighbors = voronoiMap.get(territoryId)?.neighbors || []
    
    // Find neighbor mismatches
    const neighborMismatches: string[] = []
    
    // Check for graph neighbors not in Voronoi
    graphNeighbors.forEach(neighbor => {
      if (!voronoiNeighbors.includes(neighbor)) {
        neighborMismatches.push(`Graph has ${neighbor}, Voronoi missing`)
      }
    })
    
    // Check for Voronoi neighbors not in graph
    voronoiNeighbors.forEach(neighbor => {
      if (!graphNeighbors.includes(neighbor)) {
        neighborMismatches.push(`Voronoi has ${neighbor}, Graph missing`)
      }
    })
    
    mappings.push({
      territoryId,
      hasGraphNode,
      hasVoronoiCell,
      graphNeighbors,
      voronoiNeighbors,
      neighborMismatches
    })
    
    // Generate errors and warnings
    if (!hasVoronoiCell) {
      errors.push(`Territory ${territoryId} exists in graph but missing Voronoi cell`)
    }
    
    if (neighborMismatches.length > 0) {
      warnings.push(`Territory ${territoryId} neighbor mismatch: ${neighborMismatches.join(', ')}`)
    }
  })
  
  // Check for Voronoi territories not in graph
  voronoiTerritories.forEach(territory => {
    if (!graph.territories.has(territory.id)) {
      errors.push(`Territory ${territory.id} has Voronoi cell but missing from graph`)
    }
  })
  
  // Calculate statistics
  const statistics = calculateGraphStatistics(graph, voronoiTerritories)
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    statistics
  }
}

function calculateGraphStatistics(
  graph: TerritoryGraph,
  voronoiTerritories: VoronoiTerritory[]
): ValidationResult['statistics'] {
  const territories = Array.from(graph.territories.keys())
  const totalTerritories = territories.length
  
  // Calculate connected components using DFS
  const visited = new Set<string>()
  const components: string[][] = []
  
  territories.forEach(territoryId => {
    if (!visited.has(territoryId)) {
      const component: string[] = []
      dfsVisit(territoryId, graph, visited, component)
      components.push(component)
    }
  })
  
  // Find isolated territories (components of size 1)
  const isolatedTerritories = components
    .filter(comp => comp.length === 1)
    .map(comp => comp[0])
  
  // Calculate average neighbors
  let totalNeighbors = 0
  territories.forEach(territoryId => {
    totalNeighbors += getNeighbors(territoryId, graph).length
  })
  const averageNeighbors = totalNeighbors / totalTerritories
  
  // Calculate continent connectivity
  const continentConnectivity: Record<string, number> = {}
  Array.from(graph.continents.keys()).forEach(continentId => {
    const continentTerritories = territories.filter(tId => {
      const territory = graph.territories.get(tId)
      return territory?.continentId === continentId
    })
    
    // Count connections within continent
    let internalConnections = 0
    continentTerritories.forEach(tId => {
      const neighbors = getNeighbors(tId, graph)
      neighbors.forEach(neighborId => {
        const neighbor = graph.territories.get(neighborId)
        if (neighbor?.continentId === continentId && tId < neighborId) {
          // Count each connection once (tId < neighborId prevents double counting)
          internalConnections++
        }
      })
    })
    
    continentConnectivity[continentId] = internalConnections
  })
  
  return {
    totalTerritories,
    connectedComponents: components.length,
    isolatedTerritories,
    averageNeighbors,
    continentConnectivity
  }
}

function dfsVisit(
  territoryId: string,
  graph: TerritoryGraph,
  visited: Set<string>,
  component: string[]
) {
  visited.add(territoryId)
  component.push(territoryId)
  
  const neighbors = getNeighbors(territoryId, graph)
  neighbors.forEach(neighborId => {
    if (!visited.has(neighborId)) {
      dfsVisit(neighborId, graph, visited, component)
    }
  })
}

export function generateValidationReport(result: ValidationResult): string {
  let report = '# Territory Graph Validation Report\n\n'
  
  report += `## Overall Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`
  
  if (result.errors.length > 0) {
    report += '## ❌ Errors\n'
    result.errors.forEach(error => {
      report += `- ${error}\n`
    })
    report += '\n'
  }
  
  if (result.warnings.length > 0) {
    report += '## ⚠️ Warnings\n'
    result.warnings.forEach(warning => {
      report += `- ${warning}\n`
    })
    report += '\n'
  }
  
  report += '## 📊 Statistics\n'
  report += `- **Total Territories**: ${result.statistics.totalTerritories}\n`
  report += `- **Connected Components**: ${result.statistics.connectedComponents}\n`
  report += `- **Average Neighbors**: ${result.statistics.averageNeighbors.toFixed(2)}\n`
  
  if (result.statistics.isolatedTerritories.length > 0) {
    report += `- **Isolated Territories**: ${result.statistics.isolatedTerritories.join(', ')}\n`
  }
  
  report += '\n### Continent Connectivity\n'
  Object.entries(result.statistics.continentConnectivity).forEach(([continent, connections]) => {
    report += `- **${continent}**: ${connections} internal connections\n`
  })
  
  return report
}

// Helper function to suggest fixes for common issues
export function suggestFixes(result: ValidationResult): string[] {
  const suggestions: string[] = []
  
  if (result.statistics.connectedComponents > 1) {
    suggestions.push('Add sea routes to connect isolated continents')
  }
  
  if (result.statistics.isolatedTerritories.length > 0) {
    suggestions.push(`Connect isolated territories: ${result.statistics.isolatedTerritories.join(', ')}`)
  }
  
  if (result.statistics.averageNeighbors < 2) {
    suggestions.push('Consider adding more connections - territories should have at least 2-3 neighbors on average')
  }
  
  if (result.warnings.length > 5) {
    suggestions.push('Adjust Voronoi seed positions to better match logical graph connections')
  }
  
  // Check for continents with low connectivity
  Object.entries(result.statistics.continentConnectivity).forEach(([continent, connections]) => {
    const continentSize = Object.keys(result.statistics.continentConnectivity).length
    if (connections < continentSize - 1) {
      suggestions.push(`${continent} may need more internal connections for better gameplay`)
    }
  })
  
  return suggestions
}