"use client"

import React from 'react'
import { useDrawingTool } from '../../hooks/useDrawingTool'

export function PropertiesPanel() {
  const store = useDrawingTool()
  const selectedShapes = Array.from(store.selection.shapes)
  
  if (selectedShapes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-500">Select a shape to edit properties</p>
      </div>
    )
  }
  
  const shape = store.document.shapes[selectedShapes[0]]
  if (!shape) return null
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Shape Properties</h3>
        
        {selectedShapes.length === 1 ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={shape.name}
                onChange={(e) => store.updateShape(shape.id, { name: e.target.value })}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fill Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={shape.fill}
                  onChange={(e) => store.updateShape(shape.id, { fill: e.target.value })}
                  className="w-10 h-8 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={shape.fill}
                  onChange={(e) => store.updateShape(shape.id, { fill: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border rounded font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stroke Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={shape.stroke}
                  onChange={(e) => store.updateShape(shape.id, { stroke: e.target.value })}
                  className="w-10 h-8 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={shape.stroke}
                  onChange={(e) => store.updateShape(shape.id, { stroke: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border rounded font-mono"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stroke Width</label>
              <input
                type="number"
                value={shape.strokeWidth}
                onChange={(e) => store.updateShape(shape.id, { strokeWidth: Number(e.target.value) })}
                className="w-full px-2 py-1 text-sm border rounded"
                min="0"
                max="20"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Opacity</label>
              <input
                type="range"
                value={shape.opacity}
                onChange={(e) => store.updateShape(shape.id, { opacity: Number(e.target.value) })}
                className="w-full"
                min="0"
                max="1"
                step="0.1"
              />
              <div className="text-xs text-gray-500 text-center">{Math.round(shape.opacity * 100)}%</div>
            </div>
            
            <div className="text-xs text-gray-500">
              <div>Position: {Math.round(shape.center.x)}, {Math.round(shape.center.y)}</div>
              <div>ID: {shape.id}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{selectedShapes.length} shapes selected</p>
            <button
              onClick={() => store.clearSelection()}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
      
      {selectedShapes.length > 0 && (
        <div className="pt-3 border-t">
          <button
            onClick={() => selectedShapes.forEach(id => store.deleteShape(id))}
            className="w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete {selectedShapes.length > 1 ? 'Shapes' : 'Shape'}
          </button>
        </div>
      )}
    </div>
  )
}