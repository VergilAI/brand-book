"use client"

import React from 'react'
import { useMapEditor } from '../../hooks/useMapEditor'
import { Card } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { ChevronDown, ChevronRight, Bug } from 'lucide-react'
import styles from '../panels/ScrollablePanel.module.css'

interface GridDebugConfig {
  referenceSize: number
  subdivisionFactor: number
  levelsVisible: number
  strokeOpacity: number
  minOpacity: number
  strokeColor: string
  minLevel: number
  opacityCurve: 'linear' | 'sigmoid' | 'exponential' | 'step'
  curveSteepness: number
  maxVisibleGrids: number
}

export function DebugPanel() {
  const store = useMapEditor()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [gridConfig, setGridConfig] = React.useState<GridDebugConfig>({
    referenceSize: 10,
    subdivisionFactor: 4,
    levelsVisible: 2,
    strokeOpacity: 0.18,
    minOpacity: 0.01,
    strokeColor: '#94A3B8',
    minLevel: 0,
    opacityCurve: 'sigmoid',
    curveSteepness: 4,
    maxVisibleGrids: 3
  })
  
  // Force enable scrolling
  React.useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl || !isExpanded) return
    
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation()
      // Force scroll the element
      scrollEl.scrollTop += e.deltaY
    }
    
    // Use passive: false to ensure we can stopPropagation
    scrollEl.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      scrollEl.removeEventListener('wheel', handleWheel)
    }
  }, [isExpanded])

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_DEBUG_MODE) {
    return null
  }

  const updateGridConfig = (key: keyof GridDebugConfig, value: number | string) => {
    const newConfig = { ...gridConfig, [key]: value }
    setGridConfig(newConfig)
    
    // Store in window for HierarchicalGrid to access
    if (typeof window !== 'undefined') {
      (window as any).__GRID_DEBUG_CONFIG = newConfig
      // Force re-render of grid by toggling it off and on
      if (store.view.showGrid) {
        store.toggleGrid()
        setTimeout(() => store.toggleGrid(), 0)
      }
    }
  }

  return (
    <Card 
      className="absolute top-4 left-4 z-50 bg-background/95 backdrop-blur-sm border shadow-lg"
      data-panel="debug"
      style={{ isolation: 'isolate' }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      <div className="p-3" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors flex-shrink-0"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Bug className="w-4 h-4" />
          Debug Panel
        </button>
        
        {isExpanded && (
          <div 
            ref={scrollRef}
            className={`mt-4 space-y-4 min-w-[280px] overflow-y-scroll pr-2 flex-1 ${styles.scrollablePanel}`}
            style={{ 
              maxHeight: '400px',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              position: 'relative'
            }}
          >
            {/* Grid Configuration */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Hierarchical Grid</h3>
              
              <div className="space-y-2">
                <Label className="text-xs">Base Reference Size</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.referenceSize}
                    onChange={(e) => updateGridConfig('referenceSize', parseFloat(e.target.value) || 40)}
                    className="h-8 text-xs"
                    min={10}
                    max={200}
                    step={10}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Subdivision Factor</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.subdivisionFactor}
                    onChange={(e) => updateGridConfig('subdivisionFactor', parseInt(e.target.value) || 4)}
                    className="h-8 text-xs"
                    min={2}
                    max={10}
                    step={1}
                  />
                  <span className="text-xs text-muted-foreground">{gridConfig.subdivisionFactor}×{gridConfig.subdivisionFactor} grid</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Visible Levels</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.levelsVisible}
                    onChange={(e) => updateGridConfig('levelsVisible', parseInt(e.target.value) || 4)}
                    className="h-8 text-xs"
                    min={1}
                    max={6}
                    step={1}
                  />
                  <span className="text-xs text-muted-foreground">levels</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Stroke Opacity</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.strokeOpacity}
                    onChange={(e) => updateGridConfig('strokeOpacity', parseFloat(e.target.value) || 0.08)}
                    className="h-8 text-xs"
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <input
                    type="range"
                    value={gridConfig.strokeOpacity}
                    onChange={(e) => updateGridConfig('strokeOpacity', parseFloat(e.target.value))}
                    className="flex-1"
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Min Render Opacity</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.minOpacity}
                    onChange={(e) => updateGridConfig('minOpacity', parseFloat(e.target.value) || 0.01)}
                    className="h-8 text-xs"
                    min={0}
                    max={0.1}
                    step={0.001}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Grid Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={gridConfig.strokeColor}
                    onChange={(e) => updateGridConfig('strokeColor', e.target.value)}
                    className="h-8 w-16"
                  />
                  <Input
                    type="text"
                    value={gridConfig.strokeColor}
                    onChange={(e) => updateGridConfig('strokeColor', e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Min Level (0 = reference size)</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.minLevel}
                    onChange={(e) => updateGridConfig('minLevel', parseInt(e.target.value) || 0)}
                    className="h-8 text-xs"
                    min={-2}
                    max={2}
                    step={1}
                  />
                  <span className="text-xs text-muted-foreground">level</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Opacity Curve</Label>
                <select
                  value={gridConfig.opacityCurve}
                  onChange={(e) => updateGridConfig('opacityCurve', e.target.value)}
                  className="w-full h-8 text-xs rounded-md border bg-background px-2"
                >
                  <option value="linear">Linear</option>
                  <option value="sigmoid">S-Curve (Sigmoid)</option>
                  <option value="exponential">Exponential</option>
                  <option value="step">Step Function</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Curve Steepness</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.curveSteepness}
                    onChange={(e) => updateGridConfig('curveSteepness', parseFloat(e.target.value) || 4)}
                    className="h-8 text-xs"
                    min={1}
                    max={10}
                    step={0.5}
                  />
                  <input
                    type="range"
                    value={gridConfig.curveSteepness}
                    onChange={(e) => updateGridConfig('curveSteepness', parseFloat(e.target.value))}
                    className="flex-1"
                    min={1}
                    max={10}
                    step={0.5}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Max Visible Grids</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={gridConfig.maxVisibleGrids}
                    onChange={(e) => updateGridConfig('maxVisibleGrids', parseInt(e.target.value) || 3)}
                    className="h-8 text-xs"
                    min={1}
                    max={5}
                    step={1}
                  />
                  <span className="text-xs text-muted-foreground">grids</span>
                </div>
              </div>
            </div>

            {/* View Settings */}
            <div className="space-y-3 border-t pt-3">
              <h3 className="text-sm font-semibold">View Settings</h3>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Grid</Label>
                <Switch
                  checked={store.view.showGrid}
                  onCheckedChange={() => store.toggleGrid()}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Snap Points (Debug)</Label>
                <Switch
                  checked={!!(window as any).__SHOW_SNAP_POINTS}
                  onCheckedChange={(checked) => {
                    (window as any).__SHOW_SNAP_POINTS = checked
                    // Force re-render
                    if (store.view.showGrid) {
                      store.toggleGrid()
                      setTimeout(() => store.toggleGrid(), 0)
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Snap Grid Size</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={store.view.gridSize}
                    onChange={(e) => store.setGridSize(parseInt(e.target.value) || 10)}
                    className="h-8 text-xs"
                    min={5}
                    max={100}
                    step={5}
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Grid Snapping</Label>
                <Switch
                  checked={store.snapping.settings.gridSnap}
                  onCheckedChange={(checked) => store.updateSnapSettings({ gridSnap: checked })}
                />
              </div>
            </div>

            {/* Current State */}
            <div className="space-y-2 border-t pt-3">
              <h3 className="text-sm font-semibold">Current State</h3>
              <div className="text-xs space-y-1 font-mono">
                <div>Zoom: {store.view.zoom.toFixed(3)}</div>
                <div>Pan: ({store.view.pan.x.toFixed(0)}, {store.view.pan.y.toFixed(0)})</div>
                <div>Tool: {store.tool}</div>
                <div>Territories: {Object.keys(store.map.territories).length}</div>
                <div>Selected: {store.selection.territories.size}</div>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={() => {
                setGridConfig({
                  referenceSize: 10,
                  subdivisionFactor: 4,
                  levelsVisible: 2,
                  strokeOpacity: 0.18,
                  minOpacity: 0.01,
                  strokeColor: '#94A3B8',
                  minLevel: 0,
                  opacityCurve: 'sigmoid',
                  curveSteepness: 4,
                  maxVisibleGrids: 3
                })
                if (typeof window !== 'undefined') {
                  delete (window as any).__GRID_DEBUG_CONFIG
                  // Force re-render of grid by toggling it off and on
                  if (store.view.showGrid) {
                    store.toggleGrid()
                    setTimeout(() => store.toggleGrid(), 0)
                  }
                }
              }}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Reset to Defaults
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}