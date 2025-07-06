"use client"

import React, { useEffect } from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { IconButtonWithTooltip } from '../ui/IconButton'
import { cn } from '@/lib/utils'
import { 
  Circle,
  Square
} from 'lucide-react'
import { GridIcon } from '../ui/MapIcons'
import type { SnapState } from '../../types/snapping'

// Custom icon components

const CenterSnapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2 L8 14 M2 8 L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const AngleSnapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {/* Horizontal line */}
    <path d="M2 13 L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* 45 degree line (no arrow) */}
    <path d="M2 13 L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Arc showing the angle - larger radius for more distance from origin */}
    <path d="M 8.5 13 A 6.5 6.5 0 0 0 6.596 8.404" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)


interface SnapOption {
  id: keyof SnapState['settings']
  icon: React.ReactNode
  title: string
  description: string
  tooltip: string
}

const snapOptions: SnapOption[] = [
  { 
    id: 'vertexSnap', 
    icon: <Circle className="w-4 h-4" strokeWidth={2} fill="none" />, 
    title: 'Vertex Snap',
    description: 'Snap to vertices',
    tooltip: 'Snap to territory corner points and shape vertices'
  },
  { 
    id: 'edgeSnap', 
    icon: <Square className="w-4 h-4" strokeWidth={2} fill="none" />, 
    title: 'Edge Snap',
    description: 'Snap to edges',
    tooltip: 'Snap to the middle or along territory edges' 
  },
  { 
    id: 'centerSnap', 
    icon: <CenterSnapIcon />, 
    title: 'Center Snap',
    description: 'Snap to centers',
    tooltip: 'Snap to the center point of territories'
  },
  { 
    id: 'gridSnap', 
    icon: <GridIcon />, 
    title: 'Grid Snap',
    description: 'Snap to grid',
    tooltip: 'Snap to grid intersection points'
  },
  { 
    id: 'angleSnap', 
    icon: <AngleSnapIcon />, 
    title: 'Angle Snap',
    description: 'Snap to 45° angles',
    tooltip: 'Constrain drawing and movement to 45-degree angle increments'
  }
]

export function ToolbarSnappingSettings() {
  const store = useMapEditor()
  const isEnabled = store.snapping.settings.enabled
  
  // Auto-close when snapping is disabled
  useEffect(() => {
    if (!isEnabled) {
      // Settings will be hidden automatically by the parent
    }
  }, [isEnabled])
  
  if (!isEnabled) return null
  
  return (
    <div className="relative">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 animate-in slide-in-from-left-2 fade-in duration-200">
        {snapOptions.map(option => {
          const isEnabled = store.snapping.settings[option.id]
          
          // Special handling for GridIcon which accepts enabled prop
          const icon = option.id === 'gridSnap' ? (
            <GridIcon enabled={isEnabled} />
          ) : (
            <div className={cn(
              "w-4 h-4",
              isEnabled ? "text-brand" : "text-secondary"
            )}>
              {option.icon}
            </div>
          )
          
          return (
            <IconButtonWithTooltip
              key={option.id}
              icon={icon}
              onClick={() => {
                store.updateSnapSettings({
                  [option.id]: !store.snapping.settings[option.id]
                })
              }}
              active={false}
              tooltip={option.tooltip}
              tooltipSide="bottom"
              size="sm"
              variant="ghost"
              className={cn(
                "transition-colors",
                isEnabled && "hover:bg-brand/10"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}