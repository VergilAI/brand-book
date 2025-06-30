import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Foundation/Vergil Color System',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Complete Vergil Color System - Monochrome First
const vergilColorSystem = {
  // Core Brand Colors
  core: {
    primary: {
      50: '#F3E5FF',   // Lightest tint
      100: '#E6CCFF',  // Very light
      200: '#D199FF',  // vergil-purple-lightest - Dark theme secondary
      300: '#BB66FF',  // vergil-purple-lighter - Dark theme primary
      400: '#9933FF',  // vergil-purple-light - Hover states
      500: '#7B00FF',  // vergil-purple - Main brand purple
      600: '#6600CC',  // Dark medium
      700: '#520099',  // Dark
      800: '#3D0066',  // Very dark
      900: '#290033',  // Darkest
    },
    // Deprecated - cosmic-purple from v1
    deprecated: {
      'cosmic-purple': '#6366F1', // DEPRECATED - Use vergil-purple (#7B00FF) instead
    },
    // Functional yellow - NOT a secondary color
    functional: {
      warning: '#FFC700',    // Warning messages only
    },
    // Consciousness Gradient (for hero sections and special effects)
    gradient: {
      start: '#7B00FF',
      mid: '#9933FF',
      end: '#BB66FF',
      // Muted versions for backgrounds
      mutedStart: 'rgba(123, 0, 255, 0.15)',
      mutedMid: 'rgba(153, 51, 255, 0.10)',
      mutedEnd: 'rgba(187, 102, 255, 0.05)',
    },
    // RadialHeatmap Colors - Beautiful muted gradients
    visualization: {
      indigo: {
        base: 'rgba(99, 102, 241, 0.4)',
        glow: 'rgba(99, 102, 241, 0.8)',
        highlight: 'rgba(129, 140, 248, 0.6)'
      },
      purple: {
        base: 'rgba(168, 85, 247, 0.4)',
        glow: 'rgba(168, 85, 247, 0.8)',
        highlight: 'rgba(196, 181, 253, 0.6)'
      },
      pink: {
        base: 'rgba(236, 72, 153, 0.4)',
        glow: 'rgba(236, 72, 153, 0.8)',
        highlight: 'rgba(244, 114, 182, 0.6)'
      },
      orange: {
        base: 'rgba(251, 146, 60, 0.4)',
        glow: 'rgba(251, 146, 60, 0.8)',
        highlight: 'rgba(254, 215, 170, 0.6)'
      },
      blue: {
        base: 'rgba(59, 130, 246, 0.4)',
        glow: 'rgba(59, 130, 246, 0.8)',
        highlight: 'rgba(96, 165, 250, 0.6)'
      },
      violet: {
        base: 'rgba(139, 92, 246, 0.4)',
        glow: 'rgba(139, 92, 246, 0.8)',
        highlight: 'rgba(167, 139, 250, 0.6)'
      },
      fuchsia: {
        base: 'rgba(217, 70, 239, 0.4)',
        glow: 'rgba(217, 70, 239, 0.8)',
        highlight: 'rgba(232, 121, 249, 0.6)'
      }
    }
  },
  
  // Semantic Colors
  semantic: {
    success: {
      50: '#E6F7E6',
      100: '#C4E9C4',
      200: '#8ED18E',
      300: '#58B958',
      400: '#2FA12F',
      500: '#0F8A0F',  // Main success green
      600: '#0C6E0C',
      700: '#095209',
      800: '#063606',
      900: '#031A03',
    },
    error: {
      50: '#FFE5E5',
      100: '#FFCCCC',
      200: '#FF9999',
      300: '#FF6666',
      400: '#FF3333',
      500: '#E51C23',  // Main error red (Material inspired)
      600: '#CC0000',
      700: '#990000',
      800: '#660000',
      900: '#330000',
    },
    warning: {
      500: '#FFC700',  // Main warning yellow
    },
    info: {
      50: '#E5F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B7FF',
      400: '#339FFF',
      500: '#0087FF',  // Main info blue
      600: '#006FCC',
      700: '#005799',
      800: '#003F66',
      900: '#002733',
    }
  },
  
  // Neutral Colors - Apple-Inspired
  neutral: {
    primary: {
      'vergil-full-black': '#000000',     // Backgrounds only, never text
      'vergil-off-black': '#1D1D1F',      // Primary text color
      'vergil-full-white': '#FFFFFF',     // Backgrounds only, never text  
      'vergil-off-white': '#F5F5F7',      // Text on dark, soft containers
    },
    scale: {
      0: '#FFFFFF',    // vergil-full-white
      50: '#FAFAFA',   
      100: '#F5F5F7',  // vergil-off-white
      200: '#E5E5E7',  // Apple-inspired light gray
      300: '#D1D1D3',
      400: '#A1A1A6',
      500: '#8E8E93',  // Apple mid-gray
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#1D1D1F',  // vergil-off-black
      950: '#000000',  // vergil-full-black
    }
  },
  
  // Interface Colors (for UI elements)
  interface: {
    background: {
      light: '#FFFFFF',
      lightAlt: '#FAFAFA',
      lightMuted: '#F5F5F7',
      dark: '#000000',
      darkAlt: '#1D1D1F',
      darkMuted: '#2C2C2E',
    },
    text: {
      primary: {
        light: '#1D1D1F',
        dark: '#F5F5F7',
      },
      secondary: {
        light: '#636366',
        dark: '#A1A1A6',
      },
      tertiary: {
        light: '#8E8E93',
        dark: '#636366',
      },
      disabled: {
        light: '#C7C7CC',
        dark: '#48484A',
      }
    },
    border: {
      light: '#E5E5E7',
      dark: '#3A3A3C',
    },
    hover: {
      light: 'rgba(123, 0, 255, 0.08)',
      dark: 'rgba(187, 102, 255, 0.16)', // Lighter purple for better contrast
    },
    active: {
      light: 'rgba(123, 0, 255, 0.12)',
      dark: 'rgba(187, 102, 255, 0.24)', // Lighter purple for better contrast
    },
    // Dark theme specific purples with better contrast
    purple: {
      darkPrimary: '#BB66FF', // Much lighter for dark backgrounds
      darkSecondary: '#D199FF', // Even lighter for text/icons
      darkHover: 'rgba(187, 102, 255, 0.2)',
      darkActive: 'rgba(187, 102, 255, 0.3)',
    }
  },
  
  // Special Effects
  effects: {
    glow: {
      purple: 'rgba(123, 0, 255, 0.5)',
      yellow: 'rgba(255, 199, 0, 0.5)',
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(0, 0, 0, 0.25)',
    },
    blur: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(0, 0, 0, 0.8)',
    }
  }
}

// Component to display color swatches
const ColorGrid = ({ 
  title, 
  colors, 
  showHex = true 
}: { 
  title: string
  colors: Record<string, any>
  showHex?: boolean 
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Object.entries(colors).map(([key, value]) => {
        if (typeof value === 'string') {
          return (
            <div key={key} className="space-y-2">
              <div 
                className="h-16 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: value }}
              />
              <div className="text-xs">
                <div className="font-medium">{key}</div>
                {showHex && <div className="text-gray-500">{value}</div>}
              </div>
            </div>
          )
        }
        return null
      })}
    </div>
  </div>
)

// Component to show light/dark theme comparison
const ThemeComparison = ({ 
  lightBg, 
  darkBg, 
  content 
}: { 
  lightBg: string
  darkBg: string
  content: React.ReactNode 
}) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div 
      className="p-6 rounded-lg border"
      style={{ backgroundColor: lightBg }}
    >
      <div className="text-sm font-medium mb-2" style={{ color: vergilColorSystem.interface.text.primary.light }}>
        Light Theme
      </div>
      {content('light')}
    </div>
    <div 
      className="p-6 rounded-lg border"
      style={{ backgroundColor: darkBg, borderColor: vergilColorSystem.interface.border.dark }}
    >
      <div className="text-sm font-medium mb-2" style={{ color: vergilColorSystem.interface.text.primary.dark }}>
        Dark Theme
      </div>
      {content('dark')}
    </div>
  </div>
)

export const CompleteColorSystem: Story = {
  render: () => (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Vergil Color System</h1>
        <p className="text-lg text-gray-600 mb-2">
          A monochrome-first design system built on purple, black, and white - creating sophisticated elegance through restraint.
        </p>
        <p className="text-gray-500">
          Purple dominates as our singular brand color, with semantic colors used only for functional purposes.
        </p>
      </div>

      {/* Design Philosophy */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Design Philosophy</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">🎨 Monochrome-First Design</h4>
              <p className="text-sm text-gray-600">
                Purple (#7B00FF) is our singular brand color. Everything else is black, white, or gray. 
                This restraint creates sophistication and ensures purple always commands attention 
                when used.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌗 Theme Adaptability</h4>
              <p className="text-sm text-gray-600">
                Every color has light and dark theme variants. Purple remains vibrant in both, 
                while backgrounds shift from white to true black for OLED optimization.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">♿ Accessibility First</h4>
              <p className="text-sm text-gray-600">
                All color combinations meet WCAG AA standards. Text colors are carefully chosen 
                (#1D1D1F for light, #F5F5F7 for dark) for optimal readability.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">🧩 Semantic Consistency</h4>
              <p className="text-sm text-gray-600">
                Success is always green, errors always red, warnings always orange. Users learn 
                the system once and it works everywhere.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌊 Gradient Intelligence</h4>
              <p className="text-sm text-gray-600">
                The consciousness gradient represents Vergil's AI nature - flowing, dynamic, and 
                intelligent. Used sparingly for maximum impact.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🍎 Platform Inspiration</h4>
              <p className="text-sm text-gray-600">
                Neutral colors inspired by Apple's design system provide a premium, refined base 
                that lets the purple shine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Brand Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Purple Scale - Our Singular Brand Color</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {Object.entries(vergilColorSystem.core.primary).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div 
                className="h-16 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: value }}
              />
              <div className="text-xs">
                <div className="font-medium">
                  {key === '500' && 'vergil-purple'}
                  {key === '400' && 'vergil-purple-light'}
                  {key === '300' && 'vergil-purple-lighter'}
                  {key === '200' && 'vergil-purple-lightest'}
                  {!['200', '300', '400', '500'].includes(key) && key}
                </div>
                <div className="text-gray-500">{value}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Deprecated cosmic-purple */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Deprecated Color</h4>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: vergilColorSystem.core.deprecated['cosmic-purple'] }}
            />
            <div>
              <div className="font-medium">cosmic-purple (DEPRECATED)</div>
              <div className="text-sm text-gray-600">{vergilColorSystem.core.deprecated['cosmic-purple']}</div>
              <div className="text-xs text-red-600 mt-1">Use vergil-purple (#7B00FF) instead</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Consciousness Gradient */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Consciousness Gradient</h3>
        <div className="space-y-4">
          <div 
            className="h-32 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${vergilColorSystem.core.gradient.start}, ${vergilColorSystem.core.gradient.mid}, ${vergilColorSystem.core.gradient.end})`
            }}
          />
          <div 
            className="h-32 rounded-lg border border-gray-200"
            style={{
              background: `linear-gradient(135deg, ${vergilColorSystem.core.gradient.mutedStart}, ${vergilColorSystem.core.gradient.mutedMid}, ${vergilColorSystem.core.gradient.mutedEnd})`
            }}
          />
          <p className="text-sm text-gray-600">
            Top: Full vibrancy for hero sections and special moments. 
            Bottom: Muted version for backgrounds and subtle effects.
          </p>
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div 
              className="h-16 rounded-lg mb-2"
              style={{ backgroundColor: vergilColorSystem.semantic.success[500] }}
            />
            <div className="text-sm">
              <div className="font-medium">Success</div>
              <div className="text-gray-500">{vergilColorSystem.semantic.success[500]}</div>
            </div>
          </div>
          <div>
            <div 
              className="h-16 rounded-lg mb-2"
              style={{ backgroundColor: vergilColorSystem.semantic.error[500] }}
            />
            <div className="text-sm">
              <div className="font-medium">Error/Delete</div>
              <div className="text-gray-500">{vergilColorSystem.semantic.error[500]}</div>
            </div>
          </div>
          <div>
            <div 
              className="h-16 rounded-lg mb-2"
              style={{ backgroundColor: vergilColorSystem.semantic.warning[500] }}
            />
            <div className="text-sm">
              <div className="font-medium">Warning</div>
              <div className="text-gray-500">{vergilColorSystem.semantic.warning[500]}</div>
            </div>
          </div>
          <div>
            <div 
              className="h-16 rounded-lg mb-2"
              style={{ backgroundColor: vergilColorSystem.semantic.info[500] }}
            />
            <div className="text-sm">
              <div className="font-medium">Info</div>
              <div className="text-gray-500">{vergilColorSystem.semantic.info[500]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neutral Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Neutral Colors - Apple-Inspired</h3>
        <p className="text-sm text-gray-600 mb-6">
          A sophisticated monochrome system with clear usage rules. Never use pure white/black for text.
        </p>
        
        {/* Primary Neutrals */}
        <div className="grid gap-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Full Black */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-md border border-gray-300"
                  style={{ backgroundColor: vergilColorSystem.neutral.primary['vergil-full-black'] }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">vergil-full-black</h4>
                  <p className="text-sm text-gray-600">{vergilColorSystem.neutral.primary['vergil-full-black']}</p>
                  <p className="text-xs text-gray-500 mt-2">Backgrounds only, never for text</p>
                  <div className="text-xs mt-1">
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">Dark mode bg</span>
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded ml-1">Hero sections</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Off Black */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-md border border-gray-300"
                  style={{ backgroundColor: vergilColorSystem.neutral.primary['vergil-off-black'] }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">vergil-off-black</h4>
                  <p className="text-sm text-gray-600">{vergilColorSystem.neutral.primary['vergil-off-black']}</p>
                  <p className="text-xs text-gray-500 mt-2">Primary text color on light backgrounds</p>
                  <div className="text-xs mt-1">
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">Body text</span>
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded ml-1">Headlines</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Full White */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-md border border-gray-300"
                  style={{ backgroundColor: vergilColorSystem.neutral.primary['vergil-full-white'] }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">vergil-full-white</h4>
                  <p className="text-sm text-gray-600">{vergilColorSystem.neutral.primary['vergil-full-white']}</p>
                  <p className="text-xs text-gray-500 mt-2">Backgrounds only, never for text</p>
                  <div className="text-xs mt-1">
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">Page bg</span>
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded ml-1">Cards</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Off White */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-md border border-gray-300"
                  style={{ backgroundColor: vergilColorSystem.neutral.primary['vergil-off-white'] }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">vergil-off-white</h4>
                  <p className="text-sm text-gray-600">{vergilColorSystem.neutral.primary['vergil-off-white']}</p>
                  <p className="text-xs text-gray-500 mt-2">Text on dark backgrounds, soft containers</p>
                  <div className="text-xs mt-1">
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">Dark text</span>
                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded ml-1">Sections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full Neutral Scale */}
        <h4 className="font-medium mb-3">Complete Neutral Scale</h4>
        <ColorGrid title="" colors={vergilColorSystem.neutral.scale} showHex={true} />
      </div>

      {/* Visualization Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Visualization Colors (RadialHeatmap Palette)</h3>
        <p className="text-sm text-gray-600 mb-4">
          These beautiful muted gradients are perfect for data visualizations, skill matrices, and AI-powered analytics.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(vergilColorSystem.core.visualization).map(([name, colors]) => (
            <div key={name} className="space-y-2">
              <div 
                className="h-24 rounded-lg relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.base}, ${colors.highlight}, ${colors.glow})`
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
                    mixBlendMode: 'overlay'
                  }}
                />
              </div>
              <div className="text-sm">
                <div className="font-medium capitalize">{name}</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Base: {colors.base}</div>
                  <div>Glow: {colors.glow}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Examples */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Application</h3>
        
        <ThemeComparison
          lightBg={vergilColorSystem.interface.background.light}
          darkBg={vergilColorSystem.interface.background.darkAlt}
          content={(theme) => (
            <div className="space-y-3">
              <button
                className="px-4 py-2 rounded-md font-medium"
                style={{ 
                  backgroundColor: theme === 'light' 
                    ? vergilColorSystem.core.primary[500]
                    : vergilColorSystem.interface.purple.darkPrimary,
                  color: vergilColorSystem.interface.text.primary.dark // #F5F5F7
                }}
              >
                Primary Button
              </button>
              <div 
                className="p-3 rounded border"
                style={{ 
                  borderColor: theme === 'light' 
                    ? vergilColorSystem.interface.border.light 
                    : vergilColorSystem.interface.border.dark,
                  backgroundColor: theme === 'light'
                    ? 'rgba(123, 0, 255, 0.05)'
                    : 'rgba(187, 102, 255, 0.1)',
                  color: theme === 'light'
                    ? vergilColorSystem.interface.text.primary.light
                    : vergilColorSystem.interface.text.primary.dark
                }}
              >
                <div className="font-medium flex items-center justify-between">
                  <span>Course Progress</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: theme === 'light'
                        ? 'rgba(123, 0, 255, 0.1)'
                        : 'rgba(187, 102, 255, 0.2)',
                      color: theme === 'light'
                        ? vergilColorSystem.core.primary[500]
                        : vergilColorSystem.interface.purple.darkSecondary
                    }}
                  >
                    Active
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-sm mb-1" style={{ 
                    color: theme === 'light'
                      ? vergilColorSystem.interface.text.secondary.light
                      : vergilColorSystem.interface.text.secondary.dark
                  }}>
                    Introduction to AI
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ 
                        backgroundColor: theme === 'light'
                          ? '#E5E5E7'
                          : '#3A3A3C'
                      }}
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '85%',
                          background: theme === 'light'
                            ? `linear-gradient(90deg, ${vergilColorSystem.core.primary[500]}, ${vergilColorSystem.core.primary[400]})`
                            : `linear-gradient(90deg, ${vergilColorSystem.interface.purple.darkPrimary}, ${vergilColorSystem.interface.purple.darkSecondary})`
                        }}
                      />
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        color: theme === 'light'
                          ? vergilColorSystem.core.primary[500]
                          : vergilColorSystem.interface.purple.darkSecondary
                      }}
                    >
                      85%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      {/* Usage Guidelines */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Usage Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Primary Purple</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Primary CTAs</li>
              <li>• Active states</li>
              <li>• Key navigation</li>
              <li>• Progress indicators</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Functional Colors</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Yellow (#FFC700) - Warnings only</li>
              <li>• Green (#0F8A0F) - Success only</li>
              <li>• Red (#E51C23) - Errors only</li>
              <li>• Blue (#0087FF) - Info only</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Consciousness Gradient</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Hero sections</li>
              <li>• Loading states</li>
              <li>• AI visualization</li>
              <li>• Special moments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Implementation Recommendation</h3>
        <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
          <pre>{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Core brand purples
        'vergil-purple': '#7B00FF',
        'vergil-purple-light': '#9933FF',
        'vergil-purple-lighter': '#BB66FF',
        'vergil-purple-lightest': '#D199FF',
        
        // Deprecated (remove in next major version)
        'cosmic-purple': '#6366F1', // Use vergil-purple instead
        
        // Semantic
        'vergil-success': '#0F8A0F',
        'vergil-error': '#E51C23',
        'vergil-warning': '#FFC700',
        'vergil-info': '#0087FF',
        
        // Text
        'vergil-text': '#1D1D1F',
        'vergil-text-secondary': '#636366',
        'vergil-white': '#F5F5F7', // Apple-inspired off-white
        
        // Add full scales...
      }
    }
  }
}`}</pre>
        </div>
      </div>
    </div>
  ),
}