import type { Meta, StoryObj } from '@storybook/react'
import { OptimizedTerritoryMap, type PlayerColor } from './optimized-territory-map'
import { useState } from 'react'

const meta = {
  title: 'LMS/Games/OptimizedTerritoryMap',
  component: OptimizedTerritoryMap,
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
} satisfies Meta<typeof OptimizedTerritoryMap>

export default meta
type Story = StoryObj<typeof meta>

// Basic map without any game state
export const EmptyMap: Story = {
  render: () => <OptimizedTerritoryMap />,
}

// Interactive demo with territory selection
const InteractiveDemo = () => {
  const [gameState, setGameState] = useState(new Map())
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>('player1')
  
  const handleTerritoryClick = (territoryId: string) => {
    // Toggle selection
    setSelectedTerritories(prev =>
      prev.includes(territoryId)
        ? prev.filter(id => id !== territoryId)
        : [...prev, territoryId]
    )
    
    // Also assign to current player
    setGameState(prev => {
      const newState = new Map(prev)
      newState.set(territoryId, {
        owner: currentPlayer,
        armies: 1
      })
      return newState
    })
  }
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Optimized Border System Demo</h2>
        <p className="text-sm text-gray-600">
          Click territories to select and assign to current player. 
          Notice how borders are only rendered once!
        </p>
      </div>
      
      <OptimizedTerritoryMap
        gameState={gameState}
        currentPlayer={currentPlayer}
        selectedTerritories={selectedTerritories}
        onTerritoryClick={handleTerritoryClick}
      />
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCurrentPlayer('player1')}
          className={`px-4 py-2 rounded ${currentPlayer === 'player1' ? 'bg-[#6366F1] text-white' : 'bg-gray-200'}`}
        >
          Player 1
        </button>
        <button
          onClick={() => setCurrentPlayer('player2')}
          className={`px-4 py-2 rounded ${currentPlayer === 'player2' ? 'bg-[#E11D48] text-white' : 'bg-gray-200'}`}
        >
          Player 2
        </button>
        <button
          onClick={() => setCurrentPlayer('player3')}
          className={`px-4 py-2 rounded ${currentPlayer === 'player3' ? 'bg-[#10B981] text-white' : 'bg-gray-200'}`}
        >
          Player 3
        </button>
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}

// Demo showing selectable territories
const SelectableDemo = () => {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([])
  const selectableTerritories = ['alaska', 'kamchatka', 'iceland', 'scandinavia']
  
  const handleTerritoryClick = (territoryId: string) => {
    if (selectableTerritories.includes(territoryId)) {
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
        <h2 className="text-lg font-semibold">Selectable Territories</h2>
        <p className="text-sm text-gray-600">
          Blue pulsing territories can be selected. Borders pulse in sync!
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Selectable: Alaska, Kamchatka, Iceland, Scandinavia
        </p>
      </div>
      
      <OptimizedTerritoryMap
        selectedTerritories={selectedTerritories}
        selectableTerritories={selectableTerritories}
        onTerritoryClick={handleTerritoryClick}
      />
    </div>
  )
}

export const Selectable: Story = {
  render: () => <SelectableDemo />,
}

// Demo with pre-populated game state
const GameInProgress = () => {
  const gameState = new Map([
    ['alaska', { owner: 'player1' as PlayerColor, armies: 3 }],
    ['northwest-territory', { owner: 'player1' as PlayerColor, armies: 2 }],
    ['kamchatka', { owner: 'player2' as PlayerColor, armies: 4 }],
    ['siberia', { owner: 'player2' as PlayerColor, armies: 2 }],
    ['iceland', { owner: 'player3' as PlayerColor, armies: 1 }],
    ['scandinavia', { owner: 'player3' as PlayerColor, armies: 3 }],
  ])
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Game in Progress</h2>
        <p className="text-sm text-gray-600">
          Territories owned by different players. Hover to see names.
        </p>
      </div>
      
      <OptimizedTerritoryMap
        gameState={gameState}
        currentPlayer="player1"
      />
    </div>
  )
}

export const GameState: Story = {
  render: () => <GameInProgress />,
}