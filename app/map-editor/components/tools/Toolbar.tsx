"use client"

import React, { useState, useEffect } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { IconButtonWithTooltip } from '../ui/IconButton'
import { ToolbarSettings } from './ToolbarSettings'
import { ToolbarSnappingSettings } from './ToolbarSnappingSettings'
import { cn } from '@/lib/utils'
import { 
  MousePointer2, 
  Pen, 
  Link,
  Hand,
  Library,
  Table2
} from 'lucide-react'
import { SnappingIcon, GridIcon } from '../ui/MapIcons'
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
  const [showSnappingSettings, setShowSnappingSettings] = useState(false)
  
  // Show snapping settings when snapping is enabled
  useEffect(() => {
    if (store.snapping.settings.enabled) {
      setShowSnappingSettings(true)
    } else {
      setShowSnappingSettings(false)
    }
  }, [store.snapping.settings.enabled])
  
  const handleSnappingToggle = () => {
    if (!store.snapping.settings.enabled) {
      // Enable snapping and show settings
      store.toggleSnapping()
    } else {
      // Disable snapping (settings will auto-hide)
      store.toggleSnapping()
    }
  }
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-subtle">
          {/* Main tools */}
          <div className="flex items-center gap-1">
            {tools.map(tool => (
              <IconButtonWithTooltip
                key={tool.id}
                icon={tool.icon}
                onClick={() => store.setTool(tool.id)}
                active={store.tool === tool.id}
                tooltip={`${tool.name} - ${tool.shortcut === 'V' ? 'Select and move territories' : tool.shortcut === 'H' ? 'Pan around the canvas' : tool.shortcut === 'D' ? 'Draw new territory shapes' : 'Create sea routes between territories'}`}
                rightSubscript={tool.shortcut}
                size="sm"
                variant="ghost"
                className={cn(
                  "transition-colors",
                  store.tool === tool.id && "hover:bg-brand/10"
                )}
              />
            ))}
          </div>
          
          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Grid toggle */}
          <IconButtonWithTooltip
            icon={<GridIcon enabled={store.view.showGrid} />}
            onClick={() => store.toggleGrid()}
            active={false}
            tooltip="Toggle Grid - Show or hide the alignment grid"
            rightSubscript="G"
            size="sm"
            variant="ghost"
            className={cn(
              "transition-colors",
              store.view.showGrid && "hover:bg-brand/10"
            )}
          />
          
          {/* Snapping toggle */}
          <IconButtonWithTooltip
            icon={<SnappingIcon enabled={store.snapping.settings.enabled} />}
            onClick={handleSnappingToggle}
            active={false}
            tooltip="Toggle Snapping - Enable automatic alignment to edges, vertices, and grid"
            rightSubscript="S"
            size="sm"
            variant="ghost"
            className={cn(
              "transition-colors",
              store.snapping.settings.enabled && "hover:bg-brand/10"
            )}
          />
          
          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Library toggle */}
          <IconButtonWithTooltip
            icon={<Library />}
            onClick={() => store.toggleTemplateLibrary()}
            active={store.templateLibrary.isOpen}
            tooltip="Shape Library - Access pre-made shapes and templates"
            rightSubscript="L"
            size="sm"
            variant="ghost"
            className={cn(
              "transition-colors",
              store.templateLibrary.isOpen && "hover:bg-brand/10"
            )}
          />
          
          {/* Territory Table toggle */}
          <IconButtonWithTooltip
            icon={<Table2 />}
            onClick={() => store.toggleTerritoryTable()}
            active={store.territoryTable.isOpen}
            tooltip="Territory Table - View and manage all territories in a table format"
            rightSubscript="T"
            size="sm"
            variant="ghost"
            className={cn(
              "transition-colors",
              store.territoryTable.isOpen && "hover:bg-brand/10"
            )}
          />
          
          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />
          
          {/* Settings */}
          <ToolbarSettings />
        </div>
        
        {/* Snapping Settings Extension */}
        {showSnappingSettings && <ToolbarSnappingSettings />}
      </div>
    </div>
  )
}