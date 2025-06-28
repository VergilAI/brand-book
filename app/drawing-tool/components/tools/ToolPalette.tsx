"use client"

import React from 'react'
import { useDrawingTool } from '../../hooks/useDrawingTool'
import { cn } from '@/lib/utils'
import { 
  MousePointer2, 
  Pen, 
  Hand,
  Grid3x3,
  Magnet,
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
      
      <div className="h-px bg-gray-200 my-1" />
      
      {/* Snapping Settings */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => store.toggleSnapping()}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded transition-colors",
            "hover:bg-gray-100",
            store.snapping.settings.enabled && "bg-blue-50 text-blue-700"
          )}
          title="Toggle Snapping (S)"
        >
          <Magnet size={20} className={store.snapping.settings.enabled ? "" : "opacity-50"} />
          <span className="text-sm">Snapping</span>
          <span className="ml-auto text-xs text-gray-500">S</span>
        </button>
        
        {store.snapping.settings.enabled && (
          <div className="pl-8 pr-3 space-y-1 text-xs">
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={store.snapping.settings.vertexSnap}
                onChange={(e) => store.updateSnapSettings({ vertexSnap: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Vertices</span>
            </label>
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={store.snapping.settings.edgeSnap}
                onChange={(e) => store.updateSnapSettings({ edgeSnap: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Edges</span>
            </label>
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={store.snapping.settings.centerSnap}
                onChange={(e) => store.updateSnapSettings({ centerSnap: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Centers</span>
            </label>
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={store.snapping.settings.gridSnap}
                onChange={(e) => store.updateSnapSettings({ gridSnap: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Grid</span>
            </label>
            <label className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={store.snapping.settings.angleSnap}
                onChange={(e) => store.updateSnapSettings({ angleSnap: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Angles (45°)</span>
            </label>
            <div className="flex items-center gap-2 py-1">
              <span>Distance:</span>
              <input
                type="number"
                value={store.snapping.settings.snapDistance}
                onChange={(e) => store.updateSnapSettings({ snapDistance: Number(e.target.value) })}
                className="w-12 px-1 py-0.5 text-xs border rounded"
                min="5"
                max="50"
                step="5"
              />
              <span className="text-gray-500">px</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}