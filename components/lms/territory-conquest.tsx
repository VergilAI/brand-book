"use client"

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { 
  TerritoryGraph, 
  GameTerritory,
  TerritoryConnection 
} from '@/lib/lms/territory-conquest-data'
import { 
  generateVoronoiTessellation,
  VORONOI_SEEDS,
  CONTINENT_BOUNDARIES,
  type VoronoiTerritory 
} from '@/lib/lms/voronoi-tessellation'

const PLAYER_COLORS = {
  player1: '#6366F1', // cosmic-purple
  player2: '#E11D48', // rose-600
  player3: '#10B981', // emerald-500
  player4: '#F59E0B', // amber-500
  player5: '#3B82F6', // blue-500
  player6: '#8B5CF6', // violet-500
} as const

export type TerritoryState = 'idle' | 'hovered' | 'selected' | 'selectable' | 'disabled'

export interface TerritoryStateInfo {
  state: TerritoryState
  isClickable: boolean
  isSelected: boolean
  isSelectable: boolean
}

interface TerritoryConquestProps {
  graph: TerritoryGraph
  gameState: Map<string, GameTerritory>
  currentPlayer: keyof typeof PLAYER_COLORS
  onTerritoryClick: (territoryId: string) => void
  onTerritoryHover?: (territoryId: string | null) => void
  onTerritorySelect?: (territoryId: string | null) => void
  selectedTerritories?: string[]
  selectableTerritories?: string[]
  clickableTerritories?: string[]
  className?: string
  multiSelect?: boolean
}

export function TerritoryConquest({
  graph,
  gameState,
  currentPlayer,
  onTerritoryClick,
  onTerritoryHover,
  onTerritorySelect,
  selectedTerritories = [],
  selectableTerritories = [],
  clickableTerritories,
  className,
  multiSelect = false
}: TerritoryConquestProps) {
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null)
  const [internalSelectedTerritories, setInternalSelectedTerritories] = useState<string[]>([])

  // Generate Voronoi tessellation
  const voronoiData = useMemo(() => {
    try {
      const result = generateVoronoiTessellation(
        VORONOI_SEEDS,
        CONTINENT_BOUNDARIES,
        { width: 900, height: 500 }
      )
      return result
    } catch (error) {
      console.error('Voronoi generation error:', error)
      return { territories: [], seaRoutes: [] }
    }
  }, [])

  const voronoiTerritories = voronoiData.territories
  const dynamicSeaRoutes = voronoiData.seaRoutes

  // Use external selected territories if provided, otherwise use internal state
  const activeSelectedTerritories = selectedTerritories.length > 0 ? selectedTerritories : internalSelectedTerritories

  const getTerritoryState = (territoryId: string): TerritoryStateInfo => {
    const isClickable = clickableTerritories ? clickableTerritories.includes(territoryId) : true
    const isSelected = activeSelectedTerritories.includes(territoryId)
    const isSelectable = selectableTerritories.includes(territoryId)
    const isHovered = hoveredTerritory === territoryId

    let state: TerritoryState
    if (!isClickable) {
      state = 'disabled'
    } else if (isSelected) {
      state = 'selected'
    } else if (isHovered) {
      state = 'hovered'
    } else if (isSelectable) {
      state = 'selectable'
    } else {
      state = 'idle'
    }

    return {
      state,
      isClickable,
      isSelected,
      isSelectable
    }
  }

  const getTerritoryFill = (territoryId: string) => {
    const territoryState = getTerritoryState(territoryId)
    const gameTerritory = gameState.get(territoryId)
    
    // Base color from ownership
    let baseColor = '#FFFFFF'
    if (gameTerritory?.owner) {
      baseColor = PLAYER_COLORS[gameTerritory.owner as keyof typeof PLAYER_COLORS]
    }
    
    // Apply state-based modifications
    switch (territoryState.state) {
      case 'selected':
        return baseColor === '#FFFFFF' ? '#3B82F6' : baseColor // Blue for unowned selected
      case 'selectable':
        return baseColor === '#FFFFFF' ? '#F0F9FF' : baseColor // Light blue tint for selectable
      case 'hovered':
        return baseColor === '#FFFFFF' ? '#F8FAFC' : baseColor // Light gray for hovered
      case 'disabled':
        return baseColor === '#FFFFFF' ? '#F1F5F9' : `${baseColor}80` // Reduced opacity for disabled
      default:
        return baseColor
    }
  }

  const getTerritoryStroke = (territoryId: string) => {
    const territoryState = getTerritoryState(territoryId)
    
    switch (territoryState.state) {
      case 'selected':
        return '#1D4ED8' // Blue stroke for selected
      case 'selectable':
        return '#60A5FA' // Light blue stroke for selectable
      case 'hovered':
        return '#374151' // Dark gray for hovered
      case 'disabled':
        return '#D1D5DB' // Light gray for disabled
      default:
        return '#000000' // Black default
    }
  }

  const getTerritoryStrokeWidth = (territoryId: string) => {
    const territoryState = getTerritoryState(territoryId)
    
    switch (territoryState.state) {
      case 'selected':
        return 4
      case 'selectable':
        return 3
      case 'hovered':
        return 3
      default:
        return 2
    }
  }

  const getContinentFill = (continentId: string) => {
    const continent = graph.continents.get(continentId)
    return continent?.color || '#F3F4F6'
  }

  const handleTerritoryClick = (territoryId: string) => {
    const territoryState = getTerritoryState(territoryId)
    
    if (!territoryState.isClickable) return
    
    // Handle selection logic
    if (onTerritorySelect) {
      let newSelection: string[]
      
      if (multiSelect) {
        if (territoryState.isSelected) {
          // Deselect if already selected
          newSelection = activeSelectedTerritories.filter(id => id !== territoryId)
        } else {
          // Add to selection
          newSelection = [...activeSelectedTerritories, territoryId]
        }
      } else {
        // Single select mode
        newSelection = territoryState.isSelected ? [] : [territoryId]
      }
      
      // Update internal state if not externally controlled
      if (selectedTerritories.length === 0) {
        setInternalSelectedTerritories(newSelection)
      }
      
      // Pass the territory ID that was just toggled
      onTerritorySelect(territoryId)
    }
    
    // Always call the click handler
    onTerritoryClick(territoryId)
  }

  const handleTerritoryHover = (territoryId: string | null) => {
    setHoveredTerritory(territoryId)
    if (onTerritoryHover) {
      onTerritoryHover(territoryId)
    }
  }

  const renderSeaRoutes = () => {
    return dynamicSeaRoutes.map((route, index) => (
      <path
        key={`sea-${route.from}-${route.to}`}
        d={route.path}
        fill="none"
        stroke="#6B7280"
        strokeWidth="2"
        strokeDasharray="8 6"
        opacity="0.6"
        className="pointer-events-none"
        style={{ filter: 'url(#shadow)' }}
      />
    ))
  }

  const renderTerritories = () => {
    // Sort territories so that selected and hovered ones render last (on top)
    const sortedTerritories = [...voronoiTerritories].sort((a, b) => {
      const stateA = getTerritoryState(a.id)
      const stateB = getTerritoryState(b.id)
      
      // Order: normal < selectable < hovered < selected
      const getPriority = (state: TerritoryStateInfo) => {
        if (state.isSelected) return 3
        if (state.state === 'hovered') return 2
        if (state.state === 'selectable') return 1
        return 0
      }
      
      return getPriority(stateA) - getPriority(stateB)
    })
    
    return sortedTerritories.map((territory) => {
      const territoryState = getTerritoryState(territory.id)
      const gameTerritory = gameState.get(territory.id)
      
      return (
        <g key={territory.id} className="territory-group">
          <path
            d={territory.svgPath}
            fill={getTerritoryFill(territory.id)}
            stroke={getTerritoryStroke(territory.id)}
            strokeWidth={getTerritoryStrokeWidth(territory.id)}
            strokeLinejoin="round"
            className={cn(
              "transition-all duration-200 ease-in-out",
              territoryState.isClickable && "cursor-pointer",
              !territoryState.isClickable && "opacity-60",
              territoryState.state === 'hovered' && "brightness-110",
              territoryState.state === 'selected' && "drop-shadow-lg",
              territoryState.state === 'selectable' && "animate-pulse"
            )}
            style={{
              pointerEvents: 'auto',
              filter: territoryState.state === 'hovered' || territoryState.state === 'selected' 
                ? 'url(#glow)' 
                : 'url(#shadow)',
              transform: territoryState.state === 'hovered' || territoryState.state === 'selected'
                ? 'translateY(-2px)' 
                : 'translateY(0)',
              transformOrigin: `${territory.seed.x}px ${territory.seed.y}px`,
            }}
            onMouseEnter={() => handleTerritoryHover(territory.id)}
            onMouseLeave={() => handleTerritoryHover(null)}
            onClick={() => handleTerritoryClick(territory.id)}
          />
          
          {/* Territory name on hover or select */}
          {(territoryState.state === 'hovered' || territoryState.isSelected) && (
            <text
              x={territory.seed.x}
              y={territory.seed.y - 35}
              textAnchor="middle"
              className="pointer-events-none select-none"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                fill: territoryState.isSelected ? '#1D4ED8' : '#000000',
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))'
              }}
            >
              {graph.territories.get(territory.id)?.name || territory.id}
            </text>
          )}
        </g>
      )
    })
  }


  return (
    <div className={cn("relative w-full h-full min-h-[600px]", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 900 500"
          className="w-full h-full max-w-[1200px] max-h-[720px]"
          style={{
            transform: 'perspective(1200px) rotateX(15deg) rotateY(5deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feFlood floodColor="#000000" floodOpacity="0.15"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Continent patterns for subtle visual groups */}
            <pattern id="continent-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="transparent"/>
              <circle cx="10" cy="10" r="1" fill="#000000" opacity="0.05"/>
            </pattern>
          </defs>

          {/* Continent backgrounds */}
          <g className="continent-backgrounds" opacity="0.3">
            {Array.from(graph.continents.values()).map(continent => {
              const voronoiTerritoriesForContinent = voronoiTerritories.filter(
                t => t.continentId === continent.id
              )
              
              if (voronoiTerritoriesForContinent.length === 0) return null
              
              return (
                <g key={`continent-${continent.id}`}>
                  {voronoiTerritoriesForContinent.map(territory => (
                    <path
                      key={`bg-${territory.id}`}
                      d={territory.svgPath}
                      fill={continent.color}
                      stroke="none"
                      opacity="0.2"
                      className="pointer-events-none"
                    />
                  ))}
                </g>
              )
            })}
          </g>

          {/* Sea routes - render first so they appear behind territories */}
          <g className="sea-routes">
            {renderSeaRoutes()}
          </g>

          {/* Territories */}
          <g className="territories">
            {renderTerritories()}
          </g>

          {/* Subtle grid overlay for depth */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.05"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" className="pointer-events-none" />
        </svg>
      </div>

      {/* Current Player Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: PLAYER_COLORS[currentPlayer] }}
          />
          <span className="text-sm font-medium">Player's Turn</span>
        </div>
      </div>

      {/* Continent bonuses */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg max-w-xs">
        <h3 className="text-sm font-semibold mb-2">Continent Bonuses</h3>
        <div className="space-y-1 text-xs">
          {Array.from(graph.continents.values()).map(continent => (
            <div key={continent.id} className="flex justify-between">
              <span>{continent.name}</span>
              <span className="font-medium">+{continent.bonusArmies}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Players</h3>
        <div className="space-y-1">
          {Object.entries(PLAYER_COLORS).map(([player, color]) => (
            <div key={player} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{player.replace('player', 'Player ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game stats */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <div className="text-xs space-y-1">
          <div className="font-semibold">Game Stats</div>
          <div>Territories: {gameState.size}</div>
          <div>Total Armies: {Array.from(gameState.values()).reduce((sum, t) => sum + t.armies, 0)}</div>
        </div>
      </div>
    </div>
  )
}

