import type { Meta, StoryObj } from '@storybook/react'
import { GridOverlay, DotGridOverlay } from './GridOverlay'
import React, { useState } from 'react'
import { Button } from '@/components/button'
// import { Slider } from '@/components/ui/slider' // TODO: Create or import slider component

const meta = {
  title: 'Map Editor/GridOverlay',
  component: GridOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 600">
          <Story />
        </svg>
      </div>
    ),
  ],
} satisfies Meta<typeof GridOverlay>

export default meta
type Story = StoryObj<typeof meta>

// Interactive demo with zoom control
function InteractiveGrid() {
  const [zoom, setZoom] = useState(1)
  const [gridType, setGridType] = useState<'lines' | 'dots'>('lines')
  const [pan, setPan] = useState({ x: -500, y: -300 })
  
  const viewBox = `${pan.x} ${pan.y} ${1000 / zoom} ${600 / zoom}`
  
  return (
    <>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 600 }}>Grid Controls</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Zoom: {zoom.toFixed(2)}x
          </label>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={0.1}
            max={10}
            step={0.1}
            style={{ width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Pan X: {pan.x}
          </label>
          <Slider
            value={[pan.x]}
            onValueChange={([value]) => setPan(prev => ({ ...prev, x: value }))}
            min={-1000}
            max={1000}
            step={10}
            style={{ width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Pan Y: {pan.y}
          </label>
          <Slider
            value={[pan.y]}
            onValueChange={([value]) => setPan(prev => ({ ...prev, y: value }))}
            min={-1000}
            max={1000}
            step={10}
            style={{ width: '200px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            onClick={() => setGridType('lines')}
            variant={gridType === 'lines' ? 'default' : 'outline'}
            size="sm"
          >
            Lines
          </Button>
          <Button
            onClick={() => setGridType('dots')}
            variant={gridType === 'dots' ? 'default' : 'outline'}
            size="sm"
          >
            Dots
          </Button>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
          <p>Try different zoom levels to see:</p>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Constant grid density</li>
            <li>Smooth transitions</li>
            <li>Visual hierarchy</li>
            <li>Origin markers at high zoom</li>
          </ul>
        </div>
      </div>
      
      <svg width="100%" height="100%" viewBox={viewBox}>
        <GridOverlay
          gridSize={20}
          viewBox={viewBox}
          zoom={zoom}
          gridType={gridType}
        />
        
        {/* Reference shapes to show grid alignment */}
        <rect x={0} y={0} width={100} height={100} fill="#6366F1" opacity={0.2} />
        <circle cx={200} cy={200} r={50} fill="#8B5CF6" opacity={0.2} />
        <rect x={-200} y={-200} width={80} height={80} fill="#EC4899" opacity={0.2} />
      </svg>
    </>
  )
}

export const Default: Story = {
  render: () => <InteractiveGrid />,
}

export const LinesGrid: Story = {
  args: {
    gridSize: 20,
    viewBox: '-500 -300 1000 600',
    zoom: 1,
    gridType: 'lines',
  },
}

export const DotsGrid: Story = {
  args: {
    gridSize: 20,
    viewBox: '-500 -300 1000 600',
    zoom: 1,
    gridType: 'dots',
  },
}

export const ZoomedIn: Story = {
  args: {
    gridSize: 20,
    viewBox: '-100 -60 200 120',
    zoom: 5,
    gridType: 'lines',
  },
}

export const ZoomedOut: Story = {
  args: {
    gridSize: 20,
    viewBox: '-2000 -1200 4000 2400',
    zoom: 0.25,
    gridType: 'lines',
  },
}

export const ExtremeZoomIn: Story = {
  args: {
    gridSize: 20,
    viewBox: '-20 -12 40 24',
    zoom: 25,
    gridType: 'lines',
  },
}

export const ExtremeZoomOut: Story = {
  args: {
    gridSize: 20,
    viewBox: '-5000 -3000 10000 6000',
    zoom: 0.1,
    gridType: 'lines',
  },
}