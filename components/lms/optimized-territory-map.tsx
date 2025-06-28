"use client"

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { 
  TerritoryMap, 
  SAMPLE_MAP_DATA,
  type Territory,
  type Border,
  type MapData
} from '@/lib/lms/optimized-map-data'
import { validateMap } from '@/lib/lms/map-validation'

const PLAYER_COLORS = {
  player1: '#6366F1', // cosmic-purple
  player2: '#E11D48', // rose-600
  player3: '#10B981', // emerald-500
  player4: '#F59E0B', // amber-500
  player5: '#3B82F6', // blue-500
  player6: '#8B5CF6', // violet-500
} as const

export type PlayerColor = keyof typeof PLAYER_COLORS

interface GameTerritory {
  owner?: PlayerColor
  armies: number
}

interface OptimizedTerritoryMapProps {
  gameState?: Map<string, GameTerritory>
  currentPlayer?: PlayerColor
  onTerritoryClick?: (territoryId: string) => void
  onTerritoryHover?: (territoryId: string | null) => void
  selectedTerritories?: string[]
  selectableTerritories?: string[]
  className?: string
}

export function OptimizedTerritoryMap({
  gameState = new Map(),
  currentPlayer = 'player1',
  onTerritoryClick,
  onTerritoryHover,
  selectedTerritories = [],
  selectableTerritories = [],
  className
}: OptimizedTerritoryMapProps) {
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Validate map data on load
  const validatedMapData = useMemo(() => {
    const validation = validateMap(SAMPLE_MAP_DATA)
    
    if (!validation.valid) {
      console.error('Map validation failed:', validation)
      setValidationErrors(
        validation.errors.map(e => e.message)
      )
    }
    
    // Log validation results for debugging
    console.log('Map validation:', {
      valid: validation.valid,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
      stats: validation.stats
    })
    
    return SAMPLE_MAP_DATA
  }, [])
  
  // Create map helper instance
  const map = useMemo(() => new TerritoryMap(validatedMapData), [validatedMapData])
  
  // Get state for a territory
  const getTerritoryState = (territoryId: string) => {
    const isSelected = selectedTerritories.includes(territoryId)
    const isSelectable = selectableTerritories.includes(territoryId)
    const isHovered = hoveredTerritory === territoryId
    const owner = gameState.get(territoryId)?.owner
    
    return { isSelected, isSelectable, isHovered, owner }
  }
  
  // Get fill color for territory
  const getTerritoryFill = (territory: Territory) => {
    const state = getTerritoryState(territory.id)
    
    if (state.owner) {
      return PLAYER_COLORS[state.owner]
    }
    
    if (state.isSelected) {
      return '#3B82F6' // Blue for selected
    }
    
    if (state.isHovered) {
      return '#F8FAFC' // Light gray for hover
    }
    
    if (state.isSelectable) {
      return '#F0F9FF' // Light blue for selectable
    }
    
    return '#FFFFFF' // White default
  }
  
  // Get border styling based on connected territories
  const getBorderStyle = (border: Border) => {
    const [t1, t2] = border.territories
    
    // Skip ocean borders for now
    if (t1 === 'ocean' || t2 === 'ocean') {
      return {
        stroke: '#94A3B8',
        strokeWidth: 1,
        opacity: 0.3,
        className: ''
      }
    }
    
    const state1 = getTerritoryState(t1)
    const state2 = getTerritoryState(t2)
    
    // If either territory is selected, highlight the border
    if (state1.isSelected || state2.isSelected) {
      return {
        stroke: '#1D4ED8',
        strokeWidth: 4,
        opacity: 1,
        className: ''
      }
    }
    
    // If either is hovered
    if (state1.isHovered || state2.isHovered) {
      return {
        stroke: '#374151',
        strokeWidth: 3,
        opacity: 1,
        className: ''
      }
    }
    
    // If either is selectable
    if (state1.isSelectable || state2.isSelectable) {
      return {
        stroke: '#60A5FA',
        strokeWidth: 3,
        opacity: 1,
        className: 'animate-pulse'
      }
    }
    
    // Sea routes
    if (border.type === 'sea') {
      return {
        stroke: '#6B7280',
        strokeWidth: 2,
        opacity: 0.6,
        strokeDasharray: '8 6',
        className: ''
      }
    }
    
    // Default land border
    return {
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 1,
      className: ''
    }
  }
  
  const handleTerritoryHover = (territoryId: string | null) => {
    setHoveredTerritory(territoryId)
    onTerritoryHover?.(territoryId)
  }
  
  // Sort borders for rendering order
  const sortedBorders = useMemo(() => {
    return Object.values(SAMPLE_MAP_DATA.borders).sort((a, b) => {
      const styleA = getBorderStyle(a)
      const styleB = getBorderStyle(b)
      
      // Render sea routes first, then regular borders, then highlighted ones last
      if (a.type === 'sea' && b.type !== 'sea') return -1
      if (b.type === 'sea' && a.type !== 'sea') return 1
      
      // Highlighted borders on top
      return (styleA.strokeWidth || 0) - (styleB.strokeWidth || 0)
    })
  }, [hoveredTerritory, selectedTerritories, selectableTerritories, gameState])
  
  // Show validation errors if any
  if (validationErrors.length > 0) {
    return (
      <div className={cn("relative w-full h-full min-h-[600px]", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
            <h3 className="text-red-800 font-semibold mb-2">Map Validation Errors</h3>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-red-600">
              Please fix these errors in the map data.
            </p>
          </div>
        </div>
      </div>
    )
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
          </defs>

          {/* Continent backgrounds */}
          <g className="continent-backgrounds" opacity="0.15">
            {Object.values(SAMPLE_MAP_DATA.continents).map(continent => (
              <g key={continent.id}>
                {continent.territories.map(territoryId => {
                  const territory = SAMPLE_MAP_DATA.territories[territoryId]
                  if (!territory) return null
                  return (
                    <path
                      key={`bg-${territoryId}`}
                      d={territory.fillPath}
                      fill={continent.color}
                      stroke="none"
                      className="pointer-events-none"
                    />
                  )
                })}
              </g>
            ))}
          </g>

          {/* Territory fills */}
          <g className="territory-fills">
            {Object.values(SAMPLE_MAP_DATA.territories).map(territory => {
              const state = getTerritoryState(territory.id)
              return (
                <path
                  key={territory.id}
                  d={territory.fillPath}
                  fill={getTerritoryFill(territory)}
                  className={cn(
                    "transition-all duration-200 ease-in-out cursor-pointer",
                    state.isHovered && "brightness-110",
                    state.isSelected && "drop-shadow-lg"
                  )}
                  style={{
                    filter: state.isHovered || state.isSelected ? 'url(#glow)' : 'url(#shadow)',
                    transform: state.isHovered || state.isSelected ? 'translateY(-2px)' : 'translateY(0)',
                    transformOrigin: `${territory.center.x}px ${territory.center.y}px`,
                  }}
                  onMouseEnter={() => handleTerritoryHover(territory.id)}
                  onMouseLeave={() => handleTerritoryHover(null)}
                  onClick={() => onTerritoryClick?.(territory.id)}
                />
              )
            })}
          </g>

          {/* Borders - rendered on top */}
          <g className="borders">
            {sortedBorders.map(border => {
              const style = getBorderStyle(border)
              return (
                <path
                  key={border.id}
                  d={border.path}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  opacity={style.opacity}
                  className={cn("pointer-events-none", style.className)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}
          </g>

          {/* Territory labels on hover */}
          {hoveredTerritory && SAMPLE_MAP_DATA.territories[hoveredTerritory] && (
            <text
              x={SAMPLE_MAP_DATA.territories[hoveredTerritory].center.x}
              y={SAMPLE_MAP_DATA.territories[hoveredTerritory].center.y - 25}
              textAnchor="middle"
              className="pointer-events-none select-none"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fill: '#000000',
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))'
              }}
            >
              {SAMPLE_MAP_DATA.territories[hoveredTerritory].name}
            </text>
          )}

          {/* Grid overlay */}
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

      {/* Map Info */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg max-w-xs">
        <h3 className="text-sm font-semibold mb-2">{SAMPLE_MAP_DATA.metadata.name}</h3>
        <div className="space-y-1 text-xs">
          <div>Territories: {Object.keys(SAMPLE_MAP_DATA.territories).length}</div>
          <div>Borders: {Object.keys(SAMPLE_MAP_DATA.borders).length}</div>
          <div>Continents: {Object.keys(SAMPLE_MAP_DATA.continents).length}</div>
        </div>
      </div>

      {/* Continent bonuses */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Continent Bonuses</h3>
        <div className="space-y-1 text-xs">
          {Object.values(SAMPLE_MAP_DATA.continents).map(continent => (
            <div key={continent.id} className="flex justify-between">
              <span>{continent.name}</span>
              <span className="font-medium">+{continent.bonus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}