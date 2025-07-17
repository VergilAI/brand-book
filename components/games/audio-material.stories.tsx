import type { Meta, StoryObj } from '@storybook/react'
import { AudioMaterial } from './audio-material'
import { AudioMaterialV2 } from './audio-material-v2'

const meta: Meta<typeof AudioMaterial> = {
  title: 'Games/Audio Learning Materials',
  component: AudioMaterial,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AudioMaterial>

export const Original: Story = {
  args: {
    lessonId: 'lesson-1',
    onClose: () => console.log('Closed'),
    onComplete: (score) => console.log('Completed with score:', score),
  },
}

export const Enhanced: StoryObj<typeof AudioMaterialV2> = {
  render: () => (
    <AudioMaterialV2
      lessonId="lesson-1"
      onClose={() => console.log('Closed')}
      onComplete={(score) => console.log('Completed with score:', score)}
    />
  ),
}

export const Comparison = () => (
  <div className="p-8 bg-bg-secondary min-h-screen">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Audio Learning Materials Comparison
        </h1>
        <p className="text-text-secondary">
          Original vs Enhanced Version
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Original Implementation
          </h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>✗ Simulated audio player (no real audio)</p>
            <p>✗ Duplicate TTS buttons</p>
            <p>✗ Manual progress tracking</p>
            <p>✗ Basic visual design</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Enhanced Implementation
          </h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>✓ Real TTS audio with enhanced player</p>
            <p>✓ Single, integrated audio experience</p>
            <p>✓ Automatic progress tracking</p>
            <p>✓ Modern, polished UI design</p>
            <p>✓ Better learning flow</p>
          </div>
        </div>
      </div>
      
      <div className="pt-8 text-center">
        <p className="text-sm text-text-secondary mb-4">
          Click either button below to see the implementations in action
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 bg-bg-primary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => {
              const modal = document.createElement('div')
              modal.innerHTML = '<div id="audio-modal"></div>'
              document.body.appendChild(modal)
              
              // Render original component
              const root = document.getElementById('audio-modal')
              if (root) {
                // In real app, would use React.render
                console.log('Show original audio material')
              }
            }}
          >
            View Original
          </button>
          
          <button
            className="px-4 py-2 bg-text-brand text-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => {
              const modal = document.createElement('div')
              modal.innerHTML = '<div id="audio-modal-v2"></div>'
              document.body.appendChild(modal)
              
              // Render enhanced component
              const root = document.getElementById('audio-modal-v2')
              if (root) {
                // In real app, would use React.render
                console.log('Show enhanced audio material')
              }
            }}
          >
            View Enhanced
          </button>
        </div>
      </div>
    </div>
  </div>
)