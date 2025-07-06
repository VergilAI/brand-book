"use client"

import React, { useState } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { cn } from '@/lib/utils'
import { ChevronDown, Settings } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton/IconButton'

export function ToolbarSettings() {
  const store = useMapEditor()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <IconButton
        icon={<Settings />}
        onClick={() => setIsOpen(!isOpen)}
        active={isOpen}
        title="Settings"
        size="sm"
        variant="ghost"
      />
      
      {isOpen && (
        <>
          {/* Click outside to close */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Settings dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-30">
            <div className="p-4 space-y-4">
              {/* Grid Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Grid</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={store.view.showGrid}
                      onChange={() => store.toggleGrid()}
                      className="rounded"
                    />
                    <span className="text-sm">Show Grid</span>
                  </label>
                  
                  {store.view.showGrid && (
                    <div className="flex items-center gap-2 pl-6">
                      <label className="text-sm text-gray-600">Size:</label>
                      <input
                        type="number"
                        value={store.view.gridSize}
                        onChange={(e) => store.setGridSize(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-sm border rounded"
                        min="5"
                        max="50"
                        step="5"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Snapping Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Snapping</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Distance:</span>
                    <input
                      type="number"
                      value={store.snapping.settings.snapDistance}
                      onChange={(e) => store.updateSnapSettings({ snapDistance: Number(e.target.value) })}
                      className="w-16 px-2 py-1 text-sm border rounded"
                      min="5"
                      max="50"
                      step="5"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
              </div>
              
              {/* Drawing Options */}
              {store.tool === 'pen' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Drawing</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={store.drawing.showControlPoints}
                      onChange={(e) => store.setShowControlPoints(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show Control Points</span>
                  </label>
                  <div className="text-xs text-gray-500 mt-2 pl-6">
                    <div>• Click: Straight lines</div>
                    <div>• Click + Drag: Curves</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}