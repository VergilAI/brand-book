"use client"

import React from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { ToolbarSettings } from './ToolbarSettings'
import { 
  MousePointer2, 
  Pen, 
  Link,
  Hand,
  Library,
  Table2
} from 'lucide-react'
import { SnappingIcon, GridIcon } from '@/components/vergil/LayeringIcons'
import type { ToolType } from '../../types/editor'

interface Tool {
  id: ToolType
  name: string
  icon: React.ReactNode
  shortcut?: string
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: <MousePointer2 />, shortcut: 'V' },
  { id: 'move', name: 'Pan', icon: <Hand />, shortcut: 'H' },
  { id: 'pen', name: 'Draw Territory', icon: <Pen />, shortcut: 'D' },
  { id: 'connect', name: 'Sea Routes', icon: <Link />, shortcut: 'C' },
]

export function Toolbar() {
  const store = useMapEditor()
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
        {/* Main tools */}
        <div className="flex items-center gap-1">
          {tools.map(tool => (
            <IconButton
              key={tool.id}
              icon={tool.icon}
              onClick={() => store.setTool(tool.id)}
              active={store.tool === tool.id}
              title={`${tool.name} (${tool.shortcut})`}
              rightSubscript={tool.shortcut}
              size="sm"
              variant="ghost"
            />
          ))}
        </div>
        
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Grid toggle */}
        <IconButton
          icon={<GridIcon enabled={store.view.showGrid} />}
          onClick={() => store.toggleGrid()}
          active={false}
          title="Toggle Grid (G)"
          rightSubscript="G"
          size="sm"
          variant="ghost"
        />
        
        {/* Snapping toggle */}
        <IconButton
          icon={<SnappingIcon enabled={store.snapping.settings.enabled} />}
          onClick={() => store.toggleSnapping()}
          active={false}
          title="Toggle Snapping (S)"
          rightSubscript="S"
          size="sm"
          variant="ghost"
        />
        
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Library toggle */}
        <IconButton
          icon={<Library />}
          onClick={() => store.toggleTemplateLibrary()}
          active={store.templateLibrary.isOpen}
          title="Toggle Shape Library (L)"
          rightSubscript="L"
          size="sm"
          variant="ghost"
        />
        
        {/* Territory Table toggle */}
        <IconButton
          icon={<Table2 />}
          onClick={() => store.toggleTerritoryTable()}
          active={store.territoryTable.isOpen}
          title="Toggle Territory Table (T)"
          rightSubscript="T"
          size="sm"
          variant="ghost"
        />
        
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Settings */}
        <ToolbarSettings />
      </div>
    </div>
  )
}