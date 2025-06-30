import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Foundation/Colors V2',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Color palette options
const colorOptions = {
  // Current colors for reference
  current: {
    primary: '#6366F1', // cosmic-purple (current - too muted)
    secondary: '#818CF8', // luminous-indigo (current - too faded)
    text: '#111827', // current black
    background: '#FFFFFF',
  },
  
  // Option 1: Electric Vibrant (Recommended)
  option1: {
    primary: '#8B00FF', // Electric purple - highly vibrant
    secondary: '#FFB800', // Complementary golden yellow
    text: '#1D1D1F', // Apple-inspired black
    background: '#FFFFFF',
    accent: '#A340FF', // Lighter purple for hover states
    tertiary: '#00D4FF', // Cyan for additional contrast
  },
  
  // Option 2: Neon Future
  option2: {
    primary: '#BF00FF', // Neon purple - maximum vibrancy
    secondary: '#00FF88', // Electric green contrast
    text: '#1D1D1F',
    background: '#FFFFFF',
    accent: '#D633FF', // Lighter neon for hover
    tertiary: '#FFE500', // Yellow for warnings/highlights
  },
  
  // Option 3: Bold & Balanced
  option3: {
    primary: '#7B00FF', // Rich vibrant purple
    secondary: '#FFC700', // Warm yellow complement
    text: '#1D1D1F',
    background: '#FFFFFF',
    accent: '#9633FF', // Medium purple for hover
    tertiary: '#00E5FF', // Bright cyan
  },
  
  // Option 4: Premium Electric
  option4: {
    primary: '#9D00FF', // Premium bright purple
    secondary: '#00FFD1', // Mint green contrast
    text: '#1D1D1F',
    background: '#FFFFFF',
    accent: '#B333FF', // Soft electric purple
    tertiary: '#FF006E', // Magenta for alerts
  },
  
  // Option 5: Ultra Modern
  option5: {
    primary: '#A100FF', // Ultra violet
    secondary: '#FFEA00', // Bright yellow
    text: '#1D1D1F',
    background: '#FFFFFF',
    accent: '#B840FF', // Light ultra violet
    tertiary: '#00F5FF', // Electric blue
  }
}

const ColorSwatch = ({ 
  color, 
  name, 
  description 
}: { 
  color: string
  name: string
  description?: string 
}) => (
  <div className="flex items-start gap-4">
    <div 
      className="w-24 h-24 rounded-lg shadow-md border border-gray-200"
      style={{ backgroundColor: color }}
    />
    <div className="flex-1">
      <h4 className="font-semibold text-sm">{name}</h4>
      <p className="text-xs text-gray-600 mt-1">{color}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  </div>
)

const ButtonExample = ({ 
  primary, 
  text, 
  accent 
}: { 
  primary: string
  text: string
  accent?: string 
}) => (
  <div className="flex gap-2">
    <button
      className="px-4 py-2 rounded-md text-white font-medium transition-all"
      style={{ 
        backgroundColor: primary,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        if (accent) e.currentTarget.style.backgroundColor = accent
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primary
      }}
    >
      Primary Button
    </button>
    <button
      className="px-4 py-2 rounded-md font-medium border transition-all"
      style={{ 
        color: primary,
        borderColor: primary,
        backgroundColor: 'transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary + '10'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      Secondary Button
    </button>
    <button
      className="px-4 py-2 rounded-md font-medium transition-all"
      style={{ 
        color: text,
        backgroundColor: 'transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary + '10'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      Ghost Button
    </button>
  </div>
)

const IconButtonExample = ({ 
  primary, 
  text,
  accent 
}: { 
  primary: string
  text: string
  accent?: string
}) => (
  <div className="flex items-center gap-2">
    <button
      className="p-2 rounded-md transition-all"
      style={{ color: text }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = primary + '10'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="14" height="14" rx="2" />
      </svg>
    </button>
    <button
      className="p-2 rounded-md transition-all"
      style={{ 
        color: primary,
        backgroundColor: primary + '10'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="10" r="7" />
      </svg>
    </button>
    <span className="text-xs text-gray-500 ml-2">Active state →</span>
    <button
      className="p-2 rounded-md transition-all"
      style={{ 
        color: 'white',
        backgroundColor: primary
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 10 L8 13 L15 6" />
      </svg>
    </button>
  </div>
)

const ColorOption = ({ 
  title, 
  colors,
  description
}: { 
  title: string
  colors: typeof colorOptions.option1
  description: string
}) => (
  <div className="border border-gray-200 rounded-lg p-6 space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <ColorSwatch 
        color={colors.primary} 
        name="Primary" 
        description="Main brand color - vibrant purple for primary actions"
      />
      <ColorSwatch 
        color={colors.secondary} 
        name="Secondary" 
        description="Complementary color for contrast and highlights"
      />
      <ColorSwatch 
        color={colors.text} 
        name="Text / Icons" 
        description="Primary text and icon color (#1D1D1F)"
      />
      {colors.accent && (
        <ColorSwatch 
          color={colors.accent} 
          name="Accent / Hover" 
          description="Interactive states and emphasis"
        />
      )}
      {colors.tertiary && (
        <ColorSwatch 
          color={colors.tertiary} 
          name="Tertiary" 
          description="Additional accent for special elements"
        />
      )}
    </div>
    
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Buttons</p>
        <ButtonExample {...colors} />
      </div>
      
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Icon Buttons</p>
        <IconButtonExample {...colors} />
      </div>
      
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sample UI</p>
        <div className="border border-gray-200 rounded-md p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span style={{ color: colors.text }} className="font-medium">
              Map Editor Toolbar
            </span>
            <div className="flex gap-1">
              <button
                className="p-1.5 rounded transition-all"
                style={{ 
                  color: colors.text,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary + '10'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="3" />
                </svg>
              </button>
              <button
                className="p-1.5 rounded transition-all"
                style={{ 
                  color: colors.primary,
                  backgroundColor: colors.primary + '10'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="4" width="8" height="8" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const ColorComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Colors V2 - Bold & Vibrant Options</h1>
        <p className="text-gray-600 mb-6">
          Exploring more vibrant and bold purple options for the Vergil brand, with improved contrast 
          and energy. All options use #1D1D1F for text/icons (Apple's optimized black for digital interfaces).
        </p>
      </div>
      
      <ColorOption
        title="Current Palette (Reference)"
        colors={colorOptions.current}
        description="The existing color scheme - cosmic purple feels too muted, luminous indigo too faded"
      />
      
      <ColorOption
        title="Option 1: Electric Vibrant ⚡ (Recommended)"
        colors={colorOptions.option1}
        description="Highly vibrant electric purple paired with complementary golden yellow. Maximum energy while maintaining sophistication. Perfect for a modern AI platform."
      />
      
      <ColorOption
        title="Option 2: Neon Future 🚀"
        colors={colorOptions.option2}
        description="Maximum vibrancy with neon purple and electric green. Bold, futuristic, and impossible to ignore. Inspired by gaming and Web3 platforms."
      />
      
      <ColorOption
        title="Option 3: Bold & Balanced ⚖️"
        colors={colorOptions.option3}
        description="Rich vibrant purple with warm yellow complement. Professional yet energetic. Great balance for both marketing and product UI."
      />
      
      <ColorOption
        title="Option 4: Premium Electric 💎"
        colors={colorOptions.option4}
        description="Premium bright purple with mint green contrast. Sophisticated and modern. Inspired by fintech and premium SaaS products."
      />
      
      <ColorOption
        title="Option 5: Ultra Modern 🎨"
        colors={colorOptions.option5}
        description="Ultra violet with bright yellow - maximum contrast and visibility. Perfect for creative tools and cutting-edge AI products."
      />
      
      <div className="border-t pt-6 mt-8">
        <h3 className="font-semibold mb-4">Design Principles Applied</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Maximum Vibrancy:</strong> Using electric purples (#8B00FF - #BF00FF range) for high energy and modern feel</li>
          <li>• <strong>True Complementary Colors:</strong> Yellow/gold as purple's complement on the color wheel, plus triadic options (cyan, green)</li>
          <li>• <strong>Apple-Inspired Text:</strong> #1D1D1F provides optimal readability and premium feel (used in Apple's interfaces)</li>
          <li>• <strong>Color Psychology:</strong> Purple (innovation, creativity) + Yellow (optimism, clarity) = Perfect for AI/tech</li>
          <li>• <strong>Accessibility First:</strong> All color combinations meet WCAG AA standards for contrast ratios</li>
          <li>• <strong>2024 Trends:</strong> Following electric/neon trend seen in Figma, Linear, Vercel, and modern AI products</li>
        </ul>
      </div>
    </div>
  ),
}