"use client"

import React from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { BringToFrontIcon, BringForwardIcon, SendBackwardIcon, SendToBackIcon } from '@/components/vergil/LayeringIcons'

export function PropertiesPanel() {
  const store = useMapEditor()
  const selectedTerritoryIds = Array.from(store.selection.territories)
  
  if (selectedTerritoryIds.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <p className="text-sm">No selection</p>
          <p className="text-xs mt-1">Select a territory to edit properties</p>
        </div>
      </Card>
    )
  }
  
  if (selectedTerritoryIds.length === 1) {
    const territoryId = selectedTerritoryIds[0]
    const territory = store.map.territories[territoryId]
    
    if (!territory) return null
    
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Territory Properties</h3>
            <button
              onClick={() => store.deleteTerritory(territoryId)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete Territory"
            >
              <Trash2 size={16} />
            </button>
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
                    value={territory.center.x}
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
                    value={territory.center.y}
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
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={territory.zIndex || 0}
                  onChange={(e) => store.updateTerritory(territoryId, { 
                    zIndex: Number(e.target.value)
                  })}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => store.sendToBack(territoryId)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                    title="Send to Back"
                  >
                    <SendToBackIcon size={16} />
                  </button>
                  <button
                    onClick={() => store.sendBackward(territoryId)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                    title="Send Backward"
                  >
                    <SendBackwardIcon size={16} />
                  </button>
                  <button
                    onClick={() => store.bringForward(territoryId)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                    title="Bring Forward"
                  >
                    <BringForwardIcon size={16} />
                  </button>
                  <button
                    onClick={() => store.bringToFront(territoryId)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
                    title="Bring to Front"
                  >
                    <BringToFrontIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG Path
              </label>
              <textarea
                value={territory.fillPath}
                onChange={(e) => store.updateTerritory(territoryId, { fillPath: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                rows={3}
                placeholder="SVG path data"
              />
            </div>
          </div>
        </div>
      </Card>
    )
  }
  
  // Multiple selection
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Multiple Selection ({selectedTerritoryIds.length})
          </h3>
          <button
            onClick={() => {
              selectedTerritoryIds.forEach(id => store.deleteTerritory(id))
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete All Selected"
          >
            <Trash2 size={16} />
          </button>
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
            <p>Selected territories:</p>
            <ul className="mt-1 space-y-1">
              {selectedTerritoryIds.map(id => {
                const territory = store.map.territories[id]
                return territory ? (
                  <li key={id} className="truncate">
                    {territory.name}
                  </li>
                ) : null
              })}
            </ul>
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
  )
}