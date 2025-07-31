import type { Meta, StoryObj } from '@storybook/react'
import { TerritoryConquest } from './territory-conquest'
import { 
  createTerritoryGraph, 
  getNeighbors,
  type GameTerritory,
  type TerritoryGraph 
} from '@/lib/lms/territory-conquest-data'
import { useState } from 'react'

const meta = {
  title: 'LMS/Games/TerritoryConquest',
  component: TerritoryConquest,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TerritoryConquest>

export default meta
type Story = StoryObj<typeof meta>

const PLAYER_COLORS = {
  player1: '#6366F1',
  player2: '#E11D48',
  player3: '#10B981',
  player4: '#F59E0B',
  player5: '#3B82F6',
  player6: '#8B5CF6',
} as const

// Helper to create initial game state
function createInitialGameState(graph: TerritoryGraph): Map<string, GameTerritory> {
  const gameState = new Map<string, GameTerritory>()
  
  Array.from(graph.territories.values()).forEach(territory => {
    gameState.set(territory.id, {
      ...territory,
      armies: 1,
      owner: undefined
    })
  })
  
  return gameState
}

// Basic conquest game
const BasicConquest = () => {
  const graph = createTerritoryGraph()
  const [gameState, setGameState] = useState(() => createInitialGameState(graph))
  const [currentPlayer, setCurrentPlayer] = useState<keyof typeof PLAYER_COLORS>('player1')

  const handleTerritoryClick = (territoryId: string) => {
    setGameState(prev => {
      const newState = new Map(prev)
      const territory = newState.get(territoryId)
      if (territory) {
        newState.set(territoryId, {
          ...territory,
          owner: currentPlayer,
          armies: Math.max(1, territory.armies)
        })
      }
      return newState
    })
    
    // Cycle through players
    const players = Object.keys(PLAYER_COLORS) as Array<keyof typeof PLAYER_COLORS>
    const currentIndex = players.indexOf(currentPlayer)
    const nextIndex = (currentIndex + 1) % players.length
    setCurrentPlayer(players[nextIndex])
  }

  return (
    <TerritoryConquest
      graph={graph}
      gameState={gameState}
      currentPlayer={currentPlayer}
      onTerritoryClick={handleTerritoryClick}
    />
  )
}

export const Default: Story = {
  args: {
    graph: createTerritoryGraph(),
    gameState: new Map(),
    currentPlayer: 'player1',
    onTerritoryClick: () => {},
  },
  render: () => <BasicConquest />,
}

// Story showing Risk-style border constraints
const BorderConstraints = () => {
  const graph = createTerritoryGraph()
  const [gameState, setGameState] = useState(() => {
    const initialState = createInitialGameState(graph)
    // Give player1 a starting territory
    const starter = initialState.get('north-america')
    if (starter) {
      initialState.set('north-america', { ...starter, owner: 'player1', armies: 3 })
    }
    return initialState
  })
  const [currentPlayer] = useState<keyof typeof PLAYER_COLORS>('player1')

  // Calculate clickable territories based on Risk rules
  const clickableTerritories = Array.from(gameState.values())
    .filter(territory => {
      // Can click unowned territories that neighbor owned territories
      if (!territory.owner) {
        const neighbors = getNeighbors(territory.id, graph)
        return neighbors.some(neighborId => {
          const neighbor = gameState.get(neighborId)
          return neighbor?.owner === currentPlayer
        })
      }
      // Can click own territories
      return territory.owner === currentPlayer
    })
    .map(t => t.id)

  const handleTerritoryClick = (territoryId: string) => {
    const territory = gameState.get(territoryId)
    if (!territory) return

    // Only conquer if it's unowned
    if (!territory.owner) {
      setGameState(prev => {
        const newState = new Map(prev)
        newState.set(territoryId, {
          ...territory,
          owner: currentPlayer,
          armies: 1
        })
        return newState
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Risk-Style Conquest</h2>
        <p className="text-sm text-gray-600">You can only conquer territories that border your own</p>
      </div>
      <TerritoryConquest
        graph={graph}
        gameState={gameState}
        currentPlayer={currentPlayer}
        onTerritoryClick={handleTerritoryClick}
        clickableTerritories={clickableTerritories}
      />
    </div>
  )
}

export const WithBorderConstraints: Story = {
  args: {
    graph: createTerritoryGraph(),
    gameState: new Map(),
    currentPlayer: 'player1',
    onTerritoryClick: () => {},
  },
  render: () => <BorderConstraints />,
}

// Story showing territory states
const TerritoryStatesDemo = () => {
  const graph = createTerritoryGraph()
  const [gameState, setGameState] = useState(() => createInitialGameState(graph))
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([])
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null)
  const [currentPlayer] = useState<keyof typeof PLAYER_COLORS>('player1')

  // Define some territories as selectable (e.g., player can attack these)
  const selectableTerritories = ['brazil', 'argentina', 'venezuela', 'egypt', 'north-africa']
  
  // Define clickable territories (player owns these or can interact with them)
  const clickableTerritories = Array.from(gameState.keys()).filter(id => {
    const territory = gameState.get(id)
    return !territory?.owner || territory.owner === currentPlayer || selectableTerritories.includes(id)
  })

  const handleTerritoryClick = (territoryId: string) => {
    const territory = gameState.get(territoryId)
    if (!territory) return

    // Simulate taking control of unowned selectable territories
    if (!territory.owner && selectableTerritories.includes(territoryId)) {
      setGameState(prev => {
        const newState = new Map(prev)
        newState.set(territoryId, {
          ...territory,
          owner: currentPlayer,
          armies: 1
        })
        return newState
      })
    }
  }

  const handleTerritorySelect = (territoryId: string | null) => {
    if (territoryId) {
      setSelectedTerritories(prev => 
        prev.includes(territoryId) 
          ? prev.filter(id => id !== territoryId)
          : [...prev, territoryId]
      )
    }
  }

  const handleTerritoryHover = (territoryId: string | null) => {
    setHoveredTerritory(territoryId)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Territory States Demo</h2>
        <p className="text-sm text-gray-600">
          Hover, select, and interact with territories. Blue territories are selectable for conquest.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <strong>States:</strong>
          <ul className="mt-1 space-y-1">
            <li>🔵 Selectable (can conquer)</li>
            <li>⚪ Idle (neutral)</li>
            <li>🎯 Hovered (mouse over)</li>
            <li>✅ Selected (clicked)</li>
            <li>❌ Disabled (can't interact)</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <strong>Visual Indicators:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Pulsing = Selectable</li>
            <li>• Dashed circle = Available</li>
            <li>• Spinning circle = Selected</li>
            <li>• Thick border = Active state</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <strong>Interactions:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Hover for territory name</li>
            <li>• Click to conquer blue territories</li>
            <li>• Multiple selection support</li>
            <li>• State-based animations</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <strong>Current Status:</strong>
          <ul className="mt-1 space-y-1">
            <li>Hovered: {hoveredTerritory || 'None'}</li>
            <li>Selected: {selectedTerritories.join(', ') || 'None'}</li>
            <li>Selectable: {selectableTerritories.length}</li>
          </ul>
        </div>
      </div>
      
      <TerritoryConquest
        graph={graph}
        gameState={gameState}
        currentPlayer={currentPlayer}
        onTerritoryClick={handleTerritoryClick}
        onTerritoryHover={handleTerritoryHover}
        onTerritorySelect={handleTerritorySelect}
        selectedTerritories={selectedTerritories}
        selectableTerritories={selectableTerritories}
        clickableTerritories={clickableTerritories}
        multiSelect={true}
      />
    </div>
  )
}

export const TerritoryStates: Story = {
  args: {
    graph: createTerritoryGraph(),
    gameState: new Map(),
    currentPlayer: 'player1',
    onTerritoryClick: () => {},
  },
  render: () => <TerritoryStatesDemo />,
}

// Story showing multi-select functionality
const MultiSelectComponent = () => {
  const graph = createTerritoryGraph()
  const gameState = createInitialGameState(graph)
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([])
  const [currentPlayer] = useState<keyof typeof PLAYER_COLORS>('player1')

  // All territories are selectable in this demo
  const selectableTerritories = Array.from(gameState.keys())

  const handleTerritorySelect = (territoryId: string | null) => {
    if (territoryId) {
      setSelectedTerritories(prev => 
        prev.includes(territoryId) 
          ? prev.filter(id => id !== territoryId)
          : [...prev, territoryId]
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Multi-Select Demo</h2>
        <p className="text-sm text-gray-600">
          Click multiple territories to select them. Click again to deselect.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Selected: {selectedTerritories.length > 0 ? selectedTerritories.join(', ') : 'None'}
        </p>
      </div>
      
      <TerritoryConquest
        graph={graph}
        gameState={gameState}
        currentPlayer={currentPlayer}
        onTerritoryClick={() => {}}
        onTerritorySelect={handleTerritorySelect}
        selectedTerritories={selectedTerritories}
        selectableTerritories={selectableTerritories}
        multiSelect={true}
      />
    </div>
  )
}

export const MultiSelectDemo: Story = {
  args: {
    graph: createTerritoryGraph(),
    gameState: new Map(),
    currentPlayer: 'player1',
    onTerritoryClick: () => {},
  },
  render: () => <MultiSelectComponent />,
}