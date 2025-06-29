"use client"

import React from 'react'
import { MapCanvas } from './components/canvas/MapCanvas'
import { ToolPalette } from './components/tools/ToolPalette'
import { PropertiesPanel } from './components/panels/PropertiesPanel'

export default function MapEditorPage() {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left sidebar */}
      <div className="w-64 p-4 space-y-4 bg-white border-r">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Map Editor</h1>
          <p className="text-sm text-gray-600">Create and edit territory maps</p>
        </div>
        
        <ToolPalette />
        
        <PropertiesPanel />
        
        {/* Instructions */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• Select: Click territories</li>
            <li>• Move: Drag to pan view</li>
            <li>• Draw: Click to add points</li>
            <li>• Close: Click near start point</li>
            <li>• Pan: Shift+drag, middle mouse, or H tool</li>
            <li>• Zoom: Mouse wheel</li>
            <li>• Cancel: Press Escape</li>
          </ul>
        </div>
      </div>
      
      {/* Main canvas area */}
      <div className="flex-1 relative">
        <MapCanvas />
        
        {/* Top toolbar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Future: breadcrumb, file name */}
          </div>
          
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-all">
              Import
            </button>
            <button className="inline-flex items-center justify-center h-8 px-3 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all">
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}