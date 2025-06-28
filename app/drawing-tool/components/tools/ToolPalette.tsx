"use client"

import React from 'react'
import { useDrawingTool } from '../../hooks/useDrawingTool'
import { cn } from '@/lib/utils'
import { 
  MousePointer2, 
  Pen, 
  Hand,
  Grid3x3,
} from 'lucide-react'
import type { ToolType } from '../../types/drawing'

interface Tool {
  id: ToolType
  name: string
  icon: React.ReactNode
  shortcut?: string
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: <MousePointer2 size={20} />, shortcut: 'V' },
  { id: 'move', name: 'Move/Pan', icon: <Hand size={20} />, shortcut: 'H' },
  { id: 'pen', name: 'Draw Shape', icon: <Pen size={20} />, shortcut: 'P' },
]

export function ToolPalette() {
  const store = useDrawingTool()
  
  return (
    <div className="flex flex-col gap-1 p-2 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col gap-1">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => store.setTool(tool.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded transition-colors",
              "hover:bg-gray-100",
              store.tool === tool.id && "bg-blue-100 text-blue-700"
            )}
            title={`${tool.name} (${tool.shortcut})`}
          >
            {tool.icon}
            <span className="text-sm">{tool.name}</span>
            {tool.shortcut && (
              <span className="ml-auto text-xs text-gray-500">{tool.shortcut}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="h-px bg-gray-200 my-1" />
      
      <div className="flex flex-col gap-1">
        <button
          onClick={() => store.toggleGrid()}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded transition-colors",
            "hover:bg-gray-100"
          )}
          title="Toggle Grid (G)"
        >
          {store.view.showGrid ? <Grid3x3 size={20} /> : <Grid3x3 size={20} className="opacity-50" />}
          <span className="text-sm">Grid</span>
          <span className="ml-auto text-xs text-gray-500">G</span>
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1">
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
        
        {store.tool === 'pen' && (
          <>
            <div className="h-px bg-gray-200 my-1" />
            
            {/* Drawing Options */}
            <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.drawing.snapToGrid}
                onChange={(e) => store.setSnapToGrid(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Snap to Grid</span>
            </label>
            
            <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={store.drawing.showControlPoints}
                onChange={(e) => store.setShowControlPoints(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show Control Points</span>
            </label>
            
            <div className="text-xs text-gray-500 px-3 py-1">
              <div>• Click: Straight lines</div>
              <div>• Click + Drag: Curves</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}