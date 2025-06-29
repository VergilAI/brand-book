"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { cn } from '@/lib/utils'
import { X, ChevronUp, ChevronDown, MapPin, Globe } from 'lucide-react'
import type { Territory, Continent } from '@/lib/lms/optimized-map-data'
import styles from './ScrollablePanel.module.css'

type SortField = 'name' | 'continent' | 'borderCount' | 'centerX' | 'centerY'
type SortDirection = 'asc' | 'desc'

interface TerritoryTablePanelProps {
  isOpen: boolean
  onClose: () => void
}

export function TerritoryTablePanel({ isOpen, onClose }: TerritoryTablePanelProps) {
  const store = useMapEditor()
  const [activeTab, setActiveTab] = useState<'territories' | 'continents'>('territories')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
  
  // Force enable scrolling
  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl || !isOpen) return
    
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
      // Force scroll the element
      scrollEl.scrollTop += e.deltaY
    }
    
    // Use passive: false to ensure we can stopPropagation
    scrollEl.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      scrollEl.removeEventListener('wheel', handleWheel)
    }
  }, [isOpen])

  // Calculate border counts for each territory
  const territoryBorderCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    
    Object.values(store.map.borders).forEach(border => {
      border.territories.forEach(territoryId => {
        counts[territoryId] = (counts[territoryId] || 0) + 1
      })
    })
    
    return counts
  }, [store.map.borders])

  // Sorted territories
  const sortedTerritories = useMemo(() => {
    const territories = Object.values(store.map.territories)
    
    return territories.sort((a, b) => {
      let compareValue = 0
      
      switch (sortField) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'continent':
          compareValue = a.continent.localeCompare(b.continent)
          break
        case 'borderCount':
          const aCount = territoryBorderCounts[a.id] || 0
          const bCount = territoryBorderCounts[b.id] || 0
          compareValue = aCount - bCount
          break
        case 'centerX':
          compareValue = a.center.x - b.center.x
          break
        case 'centerY':
          compareValue = a.center.y - b.center.y
          break
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue
    })
  }, [store.map.territories, sortField, sortDirection, territoryBorderCounts])

  // Sorted continents
  const sortedContinents = useMemo(() => {
    return Object.values(store.map.continents).sort((a, b) => {
      const compareValue = a.name.localeCompare(b.name)
      return sortDirection === 'asc' ? compareValue : -compareValue
    })
  }, [store.map.continents, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleTerritoryClick = (territory: Territory) => {
    // Select the territory and pan to it
    store.selectTerritory(territory.id, false)
    store.setPan({
      x: territory.center.x - 500,
      y: territory.center.y - 300
    })
  }

  const handleContinentClick = (continent: Continent) => {
    // Select all territories in the continent
    store.clearSelection()
    continent.territories.forEach(territoryId => {
      store.selectTerritory(territoryId, true)
    })

    // Calculate continent bounds and pan to center
    const territories = continent.territories
      .map(id => store.map.territories[id])
      .filter(Boolean)
    
    if (territories.length > 0) {
      const bounds = {
        minX: Math.min(...territories.map(t => t.center.x)),
        maxX: Math.max(...territories.map(t => t.center.x)),
        minY: Math.min(...territories.map(t => t.center.y)),
        maxY: Math.max(...territories.map(t => t.center.y))
      }
      
      const centerX = (bounds.minX + bounds.maxX) / 2
      const centerY = (bounds.minY + bounds.maxY) / 2
      
      store.setPan({
        x: centerX - 500,
        y: centerY - 300
      })
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-3 h-3 opacity-30" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-white border-t border-gray-200 shadow-2xl",
        "transition-transform duration-300 ease-in-out",
        "max-h-[50vh]",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
      data-panel="territory-table"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Territory Overview</h2>
          
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('territories')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === 'territories'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Territories ({Object.keys(store.map.territories).length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('continents')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeTab === 'continents'
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Continents ({Object.keys(store.map.continents).length})
              </div>
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className={cn("overflow-auto", styles.scrollablePanel)}
        style={{ 
          maxHeight: 'calc(50vh - 73px)',
          position: 'relative',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {activeTab === 'territories' ? (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="w-full px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    Territory Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left">
                  <button
                    onClick={() => handleSort('continent')}
                    className="w-full px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    Continent
                    <SortIcon field="continent" />
                  </button>
                </th>
                <th className="text-center">
                  <button
                    onClick={() => handleSort('borderCount')}
                    className="w-full px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    Borders
                    <SortIcon field="borderCount" />
                  </button>
                </th>
                <th className="text-right">
                  <button
                    onClick={() => handleSort('centerX')}
                    className="w-full px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-end gap-2"
                  >
                    X Coord
                    <SortIcon field="centerX" />
                  </button>
                </th>
                <th className="text-right">
                  <button
                    onClick={() => handleSort('centerY')}
                    className="w-full px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-end gap-2"
                  >
                    Y Coord
                    <SortIcon field="centerY" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTerritories.map((territory) => {
                const isSelected = store.selection.territories.has(territory.id)
                const borderCount = territoryBorderCounts[territory.id] || 0
                
                return (
                  <tr
                    key={territory.id}
                    onClick={() => handleTerritoryClick(territory)}
                    className={cn(
                      "hover:bg-gray-50 cursor-pointer transition-colors",
                      isSelected && "bg-blue-50 hover:bg-blue-100"
                    )}
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {territory.name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {territory.continent || 'Unassigned'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                      {borderCount}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                      {Math.round(territory.center.x)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right font-mono">
                      {Math.round(territory.center.y)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Continent Name
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Territories
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedContinents.map((continent) => (
                <tr
                  key={continent.id}
                  onClick={() => handleContinentClick(continent)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {continent.name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {continent.territories.length}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    {continent.bonus}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: continent.color }}
                      />
                      <span className="text-gray-500 font-mono text-xs">
                        {continent.color}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-500 bg-gray-50">
        Press T to toggle • Click row to select and pan
      </div>
    </div>
  )
}