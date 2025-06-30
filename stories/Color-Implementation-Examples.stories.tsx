import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Foundation/Color Implementation Examples',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Hero Section Example
const HeroExample = () => (
  <div className="relative min-h-[600px] bg-white overflow-hidden">
    {/* Muted consciousness gradient background */}
    <div 
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(123, 0, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 199, 0, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 30%, rgba(187, 102, 255, 0.06) 0%, transparent 50%)
        `
      }}
    />
    
    {/* Content */}
    <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
      <h1 className="text-5xl font-bold mb-4" style={{ color: '#1D1D1F' }}>
        Train Your <span style={{ color: '#7B00FF' }}>People</span>
      </h1>
      <p className="text-xl mb-8" style={{ color: '#636366' }}>
        Your greatest asset deserves the best training.
      </p>
      
      {/* Vibrant CTA */}
      <button
        className="px-8 py-3 rounded-full text-white font-medium transition-all transform hover:scale-105"
        style={{ 
          background: 'linear-gradient(135deg, #7B00FF, #9933FF)',
          boxShadow: '0 4px 20px rgba(123, 0, 255, 0.3)'
        }}
      >
        Book Demo
      </button>
      
      {/* Floating elements with vibrant accents */}
      <div className="absolute right-0 top-20 space-y-4">
        <div 
          className="w-48 h-32 rounded-lg backdrop-blur-sm"
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(123, 0, 255, 0.2)'
          }}
        >
          <div className="p-4">
            <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: '#FFC700' }} />
            <div className="text-sm font-medium" style={{ color: '#1D1D1F' }}>AI Analytics</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Dashboard Example
const DashboardExample = () => (
  <div className="grid grid-cols-2 gap-6 p-6">
    {/* Light Theme */}
    <div className="space-y-4">
      <h3 className="font-semibold">Light Theme</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Muted gradient overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            background: 'radial-gradient(circle at top right, rgba(123, 0, 255, 0.03) 0%, transparent 40%)'
          }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium" style={{ color: '#1D1D1F' }}>Course Progress</h4>
            <span className="text-sm px-2 py-1 rounded-full" style={{ 
              backgroundColor: 'rgba(123, 0, 255, 0.1)',
              color: '#7B00FF'
            }}>
              Active
            </span>
          </div>
          
          {/* Progress bars with vibrant purple */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: '#636366' }}>Introduction to AI</span>
                <span style={{ color: '#7B00FF' }}>85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: '85%',
                    background: 'linear-gradient(90deg, #7B00FF, #9933FF)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Dark Theme */}
    <div className="space-y-4">
      <h3 className="font-semibold">Dark Theme</h3>
      <div className="rounded-lg shadow-sm border p-6" style={{ 
        backgroundColor: '#1D1D1F',
        borderColor: '#3A3A3C'
      }}>
        {/* Muted gradient overlay - stronger in dark theme */}
        <div 
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background: 'radial-gradient(circle at top right, rgba(187, 102, 255, 0.2) 0%, transparent 40%)'
          }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium" style={{ color: '#F5F5F7' }}>Course Progress</h4>
            <span className="text-sm px-2 py-1 rounded-full" style={{ 
              backgroundColor: 'rgba(187, 102, 255, 0.2)',
              color: '#BB66FF'
            }}>
              Active
            </span>
          </div>
          
          {/* Progress bars with vibrant purple */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: '#A1A1A6' }}>Introduction to AI</span>
                <span style={{ color: '#BB66FF' }}>85%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#3A3A3C' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: '85%',
                    background: 'linear-gradient(90deg, #BB66FF, #D199FF)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Component States Example
const ComponentStatesExample = () => (
  <div className="p-6 space-y-6">
    <h3 className="font-semibold mb-4">Component States with Semantic Colors</h3>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Success State */}
      <div className="space-y-2">
        <button className="w-full px-4 py-2 rounded-md text-white font-medium" 
          style={{ backgroundColor: '#0F8A0F' }}>
          Save Changes
        </button>
        <div className="p-3 rounded-md" style={{ 
          backgroundColor: 'rgba(15, 138, 15, 0.1)',
          border: '1px solid rgba(15, 138, 15, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#0F8A0F' }}>✓ Saved successfully</p>
        </div>
      </div>
      
      {/* Error State */}
      <div className="space-y-2">
        <button className="w-full px-4 py-2 rounded-md text-white font-medium" 
          style={{ backgroundColor: '#E51C23' }}>
          Delete Item
        </button>
        <div className="p-3 rounded-md" style={{ 
          backgroundColor: 'rgba(229, 28, 35, 0.1)',
          border: '1px solid rgba(229, 28, 35, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#E51C23' }}>✕ Error occurred</p>
        </div>
      </div>
      
      {/* Warning State */}
      <div className="space-y-2">
        <button className="w-full px-4 py-2 rounded-md font-medium" 
          style={{ 
            backgroundColor: '#FFA500',
            color: '#1D1D1F'
          }}>
          Review Required
        </button>
        <div className="p-3 rounded-md" style={{ 
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#CC8400' }}>⚠ Please review</p>
        </div>
      </div>
      
      {/* Info State */}
      <div className="space-y-2">
        <button className="w-full px-4 py-2 rounded-md text-white font-medium" 
          style={{ backgroundColor: '#0087FF' }}>
          Learn More
        </button>
        <div className="p-3 rounded-md" style={{ 
          backgroundColor: 'rgba(0, 135, 255, 0.1)',
          border: '1px solid rgba(0, 135, 255, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#0087FF' }}>ⓘ New feature</p>
        </div>
      </div>
    </div>
  </div>
)

// Map Editor Toolbar Example
const MapEditorExample = () => (
  <div className="p-6 bg-gray-50">
    <h3 className="font-semibold mb-4">Map Editor with Vibrant Accents</h3>
    
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 inline-flex items-center gap-1">
      {/* Inactive buttons */}
      <button className="p-2 rounded hover:bg-gray-50 transition-colors" style={{ color: '#1D1D1F' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 10 L10 3 L17 10 L10 17 Z" />
        </svg>
      </button>
      
      {/* Active button with vibrant purple */}
      <button 
        className="p-2 rounded transition-colors" 
        style={{ 
          color: '#7B00FF',
          backgroundColor: 'rgba(123, 0, 255, 0.1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="7" />
        </svg>
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Secondary action with yellow */}
      <button 
        className="px-3 py-1 rounded text-sm font-medium transition-colors" 
        style={{ 
          backgroundColor: '#FFC700',
          color: '#1D1D1F'
        }}
      >
        New
      </button>
    </div>
  </div>
)

export const PracticalImplementation: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Reconciling Vibrant & Muted</h1>
        <p className="text-gray-600 mb-8">
          The key is using vibrant colors for small, interactive elements while keeping large surfaces muted.
          This creates energy without overwhelming the interface.
        </p>
      </div>
      
      <HeroExample />
      <DashboardExample />
      <ComponentStatesExample />
      <MapEditorExample />
      
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h2 className="text-xl font-semibold">Key Implementation Principles</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium">🎯 Strategic Vibrancy</h4>
            <p className="text-sm text-gray-600">
              Use #7B00FF at full strength for buttons, active states, and small UI elements. 
              Never use it for large background areas.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">🌫️ Muted Backgrounds</h4>
            <p className="text-sm text-gray-600">
              The consciousness gradient at 3-15% opacity creates atmosphere without distraction. 
              Perfect for hero sections and empty states.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">🌓 Dark Theme Strategy</h4>
            <p className="text-sm text-gray-600">
              In dark mode, use lighter purples (#BB66FF primary, #D199FF secondary) for better 
              contrast. Backgrounds use rgba(187, 102, 255, 0.1-0.2) instead of the base purple.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
}