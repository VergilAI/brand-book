"use client"

import React from 'react'
import { DrawingCanvas } from './components/canvas/DrawingCanvas'
import { ToolPalette } from './components/tools/ToolPalette'
import { PropertiesPanel } from './components/panels/PropertiesPanel'

export default function DrawingToolPage() {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left sidebar */}
      <div className="w-64 p-4 space-y-4 bg-white border-r">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Drawing Tool</h1>
          <p className="text-sm text-gray-600">Create bezier shapes and illustrations</p>
        </div>
        
        <ToolPalette />
        
        <PropertiesPanel />
        
        {/* Instructions */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• Select: Click shapes</li>
            <li>• Move: Drag to pan view</li>
            <li>• Draw: Click for lines, drag for curves</li>
            <li>• Edit: Double-click to edit vertices</li>
            <li>• Pan: Shift+drag, middle mouse, or H tool</li>
            <li>• Zoom: Mouse wheel</li>
            <li>• Cancel: Press Escape</li>
          </ul>
        </div>
      </div>
      
      {/* Main canvas area */}
      <div className="flex-1 relative">
        <DrawingCanvas />
        
        {/* Top toolbar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Future: breadcrumb, file name */}
          </div>
          
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white rounded shadow-sm border hover:bg-gray-50">
              Import SVG
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">
              Export SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}