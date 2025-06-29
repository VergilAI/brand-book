"use client"

import React from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Trash2, X } from 'lucide-react'

export function FloatingPropertiesPanel() {
  const store = useMapEditor()
  const selectedTerritoryIds = Array.from(store.selection.territories)
  
  if (selectedTerritoryIds.length === 0) {
    return null
  }
  
  if (selectedTerritoryIds.length === 1) {
    const territoryId = selectedTerritoryIds[0]
    const territory = store.map.territories[territoryId]
    
    if (!territory) return null
    
    return (
      <div className="absolute right-4 top-20 z-20 w-80">
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Territory Properties</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => store.deleteTerritory(territoryId)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Territory"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => store.clearSelection()}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={territory.name}
                  onChange={(e) => store.updateTerritory(territoryId, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Territory name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Continent
                </label>
                <select
                  value={territory.continent}
                  onChange={(e) => store.updateTerritory(territoryId, { continent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="unassigned">Unassigned</option>
                  <option value="north-america">North America</option>
                  <option value="south-america">South America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="australia">Australia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center Point
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(territory.center.x)}
                      onChange={(e) => store.updateTerritory(territoryId, { 
                        center: { ...territory.center, x: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(territory.center.y)}
                      onChange={(e) => store.updateTerritory(territoryId, { 
                        center: { ...territory.center, y: Number(e.target.value) }
                      })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Z-Index (Layer Order)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={territory.zIndex || 0}
                    onChange={(e) => store.updateTerritory(territoryId, { 
                      zIndex: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => store.sendToBack(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Send to Back"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="6" y="2" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="2" y="6" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.sendBackward(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Send Backward"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.bringForward(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Bring Forward"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="4" y="4" width="8" height="8" fill="#60A5FA" stroke="#2563EB"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => store.bringToFront(territoryId)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                      title="Bring to Front"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="6" width="8" height="8" fill="#E5E7EB" stroke="#6B7280"/>
                        <rect x="6" y="2" width="8" height="8" fill="#3B82F6" stroke="#1E40AF"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  
  // Multiple selection
  return (
    <div className="absolute right-4 top-20 z-20 w-80">
      <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Multiple Selection ({selectedTerritoryIds.length})
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  selectedTerritoryIds.forEach(id => store.deleteTerritory(id))
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                title="Delete All Selected"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => store.clearSelection()}
                className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Continent
              </label>
              <select
                onChange={(e) => {
                  selectedTerritoryIds.forEach(id => 
                    store.updateTerritory(id, { continent: e.target.value })
                  )
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Select continent...</option>
                <option value="north-america">North America</option>
                <option value="south-america">South America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="australia">Australia</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Selected territories:</p>
              <div className="max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {selectedTerritoryIds.map(id => {
                    const territory = store.map.territories[id]
                    return territory ? (
                      <li key={id} className="truncate">
                        • {territory.name || 'Unnamed'}
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => store.clearSelection()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}