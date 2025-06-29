import type { Meta, StoryObj } from '@storybook/react'
import { MapCanvas } from './MapCanvas'

const meta = {
  title: 'Map Editor/MapCanvas',
  component: MapCanvas,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithInstructions: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <Story />
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '300px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Zoom & Grid Controls</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Smooth Zoom:</strong> Ctrl/Cmd + Scroll</li>
            <li><strong>Pinch Zoom:</strong> Trackpad gesture</li>
            <li><strong>Pan:</strong> Space + Drag or Middle-click</li>
            <li><strong>Toggle Grid:</strong> Press G</li>
            <li><strong>Switch Grid Type:</strong> Shift + G</li>
          </ul>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            The grid dynamically adjusts density based on zoom level for optimal visibility.
          </p>
        </div>
      </div>
    ),
  ],
}