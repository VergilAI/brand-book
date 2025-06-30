import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ChevronDown, X, Globe, Check } from 'lucide-react'

const meta = {
  title: 'Foundation/Vergil Color System',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Color definitions for v2 system
const colorSystemV2 = {
  neutrals: {
    title: "Apple-Inspired Neutral Palette",
    description: "A sophisticated monochrome system with clear usage rules",
    colors: [
      {
        name: "vergil-full-black",
        hex: "#000000",
        cssVar: "--vergil-full-black",
        usage: "Full black - backgrounds only",
        rules: [
          "Use exclusively for backgrounds",
          "Never use for text",
          "Can contain off-white sections or containers",
          "Creates maximum contrast for hero sections"
        ],
        examples: ["Dark mode backgrounds", "Hero sections", "Footer backgrounds"]
      },
      {
        name: "vergil-off-black",
        hex: "#1D1D1F",
        cssVar: "--vergil-off-black",
        usage: "Off-black - primary text color",
        rules: [
          "Primary text on white/off-white backgrounds",
          "Icons on light backgrounds",
          "Never use on dark backgrounds",
          "Provides softer reading experience than pure black"
        ],
        examples: ["Body text", "Headlines", "Navigation text", "Form labels"]
      },
      {
        name: "vergil-full-white",
        hex: "#FFFFFF",
        cssVar: "--vergil-full-white",
        usage: "Full white - backgrounds only",
        rules: [
          "Use exclusively for backgrounds",
          "Never use for text",
          "Primary page background",
          "Card backgrounds on dark themes"
        ],
        examples: ["Page backgrounds", "Modal backgrounds", "Card backgrounds"]
      },
      {
        name: "vergil-off-white",
        hex: "#F5F5F7",
        cssVar: "--vergil-off-white",
        usage: "Off-white - text on dark, soft containers",
        rules: [
          "Text on dark backgrounds",
          "Soft background sections",
          "Container backgrounds on white",
          "Footer backgrounds on light themes"
        ],
        examples: ["Text on dark", "Section backgrounds", "Code block backgrounds"]
      }
    ]
  },
  brand: {
    title: "Brand Purple Palette",
    description: "The complete Vergil purple color system with semantic variations",
    colors: [
      {
        name: "vergil-purple",
        hex: "#7B00FF",
        cssVar: "--vergil-purple",
        usage: "Primary brand purple",
        rules: [
          "Primary brand identity",
          "CTA buttons and primary actions",
          "Brand emphasis and highlights",
          "Interactive elements"
        ],
        examples: ["Primary buttons", "Brand logos", "Active states", "Links"]
      },
      {
        name: "vergil-purple-light",
        hex: "#9933FF",
        cssVar: "--vergil-purple-light",
        usage: "Light purple for hover states",
        rules: [
          "Hover states for primary elements",
          "Secondary brand emphasis",
          "Light theme accents",
          "Interactive feedback"
        ],
        examples: ["Button hover", "Link hover", "Selected states", "Focus rings"]
      },
      {
        name: "vergil-purple-lighter",
        hex: "#BB66FF",
        cssVar: "--vergil-purple-lighter",
        usage: "Lighter purple for dark themes",
        rules: [
          "Primary color on dark backgrounds",
          "Dark theme interactive elements",
          "Gradient midpoints",
          "Softer brand presence"
        ],
        examples: ["Dark mode buttons", "Dark theme text", "Gradient colors", "Badges"]
      },
      {
        name: "vergil-purple-lightest",
        hex: "#D199FF",
        cssVar: "--vergil-purple-lightest",
        usage: "Lightest purple for subtle accents",
        rules: [
          "Secondary text on dark backgrounds",
          "Subtle brand hints",
          "Background tints",
          "Disabled states on dark"
        ],
        examples: ["Dark mode secondary text", "Background accents", "Disabled elements", "Subtle borders"]
      },
      {
        name: "cosmic-purple (deprecated)",
        hex: "#6366F1",
        cssVar: "--cosmic-purple",
        usage: "Legacy v1 purple - DO NOT USE",
        rules: [
          "DEPRECATED - Use vergil-purple instead",
          "Only for backward compatibility",
          "Will be removed in future versions",
          "Too muted for brand identity"
        ],
        examples: ["Legacy components only"]
      }
    ]
  },
  attention: {
    title: "Subtle Attention Hierarchy",
    description: "Apple's sophisticated system for drawing attention without being obtrusive",
    colors: [
      {
        name: "vergil-emphasis-bg",
        hex: "#F0F0F2",
        cssVar: "--vergil-emphasis-bg",
        usage: "Temporary headers needing attention",
        rules: [
          "Use for temporary UI elements",
          "Must be separated from main off-white by white",
          "Slightly darker than main background",
          "Draws gentle attention"
        ],
        examples: [
          "Region selection headers",
          "Cookie consent banners", 
          "System notifications",
          "Update prompts",
          "Beta feature announcements"
        ]
      },
      {
        name: "vergil-emphasis-input-bg",
        hex: "#FAFAFC",
        cssVar: "--vergil-emphasis-input-bg",
        usage: "Interactive elements within emphasis areas",
        rules: [
          "Dropdowns, inputs, selects in emphasis headers",
          "Only appears within emphasis-bg areas",
          "Must use vergil-emphasis-input-text for text/icons",
          "Creates subtle depth hierarchy"
        ],
        examples: [
          "Country/region selectors",
          "Language dropdowns",
          "Currency selectors",
          "Timezone pickers"
        ]
      },
      {
        name: "vergil-emphasis-text",
        hex: "#303030",
        cssVar: "--vergil-emphasis-text",
        usage: "Text directly on emphasis-bg",
        rules: [
          "Use for text directly on emphasis-bg",
          "General content in emphasis areas",
          "Not for interactive elements",
          "Slightly darker than off-black"
        ],
        examples: [
          "Header descriptions",
          "Notification text",
          "Banner content",
          "General emphasis area text"
        ]
      },
      {
        name: "vergil-emphasis-input-text",
        hex: "#323232",
        cssVar: "--vergil-emphasis-input-text",
        usage: "Text inside interactive elements",
        rules: [
          "Only inside emphasis-input-bg elements",
          "Darker than emphasis-text",
          "Creates higher contrast",
          "Indicates actionable content"
        ],
        examples: [
          "Dropdown text",
          "Input field text",
          "Selected values",
          "Interactive labels"
        ]
      },
      {
        name: "vergil-emphasis-button-hover",
        hex: "#272729",
        cssVar: "--vergil-emphasis-button-hover",
        usage: "Button hover state in emphasis areas",
        rules: [
          "Hover state for buttons in emphasis areas",
          "Default state uses vergil-off-black",
          "Text color: vergil-full-white only",
          "Creates subtle attention draw"
        ],
        examples: [
          "Continue button hover",
          "Accept button hover",
          "Save preferences hover",
          "Confirm action hover"
        ]
      },
      {
        name: "vergil-footnote-text",
        hex: "#6C6C6D",
        cssVar: "--vergil-footnote-text",
        usage: "Small print on off-white backgrounds",
        rules: [
          "Use only on off-white backgrounds",
          "Footer text and copyright notices",
          "Terms and conditions",
          "Less important information"
        ],
        examples: [
          "Legal footnotes",
          "Copyright text",
          "Version numbers",
          "Last updated dates"
        ]
      }
    ]
  },
  functional: {
    title: "Functional Colors",
    description: "Semantic colors for system states and user feedback",
    colors: [
      {
        name: "vergil-success",
        hex: "#0F8A0F",
        cssVar: "--vergil-success",
        usage: "Success states and positive feedback",
        rules: [
          "Success messages and confirmations",
          "Positive actions completed",
          "Valid form inputs",
          "Achievement indicators"
        ],
        examples: ["Success alerts", "Checkmarks", "Valid inputs", "Progress complete"]
      },
      {
        name: "vergil-error",
        hex: "#E51C23",
        cssVar: "--vergil-error",
        usage: "Error states and critical alerts",
        rules: [
          "Error messages and alerts",
          "Invalid form inputs",
          "Destructive actions",
          "Critical system states"
        ],
        examples: ["Error messages", "Invalid inputs", "Delete buttons", "System failures"]
      },
      {
        name: "vergil-warning",
        hex: "#FFC700",
        cssVar: "--vergil-warning",
        usage: "Warning states and cautions",
        rules: [
          "Warning messages and alerts",
          "Caution indicators",
          "Pending states",
          "Important notices"
        ],
        examples: ["Warning alerts", "Caution icons", "Pending actions", "Important tips"]
      },
      {
        name: "vergil-info",
        hex: "#0087FF",
        cssVar: "--vergil-info",
        usage: "Informational states and notices",
        rules: [
          "Info messages and tooltips",
          "Help content",
          "Neutral system feedback",
          "Educational content"
        ],
        examples: ["Info alerts", "Tooltips", "Help text", "System notices"]
      }
    ]
  },
  gradients: {
    title: "Brand Gradients",
    description: "Official Vergil gradients for different use cases",
    colors: [
      {
        name: "Consciousness Gradient",
        hex: "#7B00FF → #9933FF → #BB66FF",
        cssVar: "consciousness-gradient",
        usage: "Hero sections and special AI effects",
        rules: [
          "Primary brand gradient",
          "Hero sections and landing pages",
          "AI visualization effects",
          "Special moments of intelligence"
        ],
        examples: ["Hero backgrounds", "Loading states", "AI animations", "Special effects"]
      },
      {
        name: "Dark Theme Gradient",
        hex: "#BB66FF → #D199FF",
        cssVar: "dark-theme-gradient",
        usage: "Progress bars and UI elements in dark theme",
        rules: [
          "Dark theme UI elements only",
          "Progress indicators",
          "Interactive elements on dark",
          "Softer gradient for better contrast"
        ],
        examples: ["Dark mode progress bars", "Dark theme buttons", "Selected states", "Active indicators"]
      }
    ]
  }
}

// Apple-style region selector component
const RegionSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('Hungary')
  
  const regions = [
    'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Hungary', 'Japan', 'China'
  ]
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-vergil-emphasis-input-bg text-vergil-emphasis-input-text rounded-md hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-vergil-full-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => {
                setSelected(region)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-vergil-off-white transition-colors flex items-center justify-between"
            >
              <span className={region === selected ? 'text-vergil-emphasis-input-text font-medium' : 'text-vergil-off-black'}>
                {region}
              </span>
              {region === selected && <Check className="w-4 h-4 text-vergil-purple" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Main story component
export const V2NeutralColors: Story = {
  render: () => {
    const [showRegionBar, setShowRegionBar] = useState(true)
    const [acceptedCookies, setAcceptedCookies] = useState(false)
    
    return (
      <div className="min-h-screen bg-vergil-full-white">
        {/* Apple-style region selection header */}
        {showRegionBar && (
          <div className="bg-vergil-emphasis-bg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-vergil-off-black">
                Choose your region to see localized content and online shopping options.
              </p>
              <div className="flex items-center gap-3">
                <RegionSelector />
                <button
                  onClick={() => setShowRegionBar(false)}
                  className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-emphasis-button-hover transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={() => setShowRegionBar(false)}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-vergil-off-black" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation bar */}
        <nav className="bg-vergil-full-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold text-vergil-off-black">Vergil</h1>
              <div className="flex gap-6">
                <a href="#" className="text-vergil-off-black hover:text-vergil-purple transition-colors">Store</a>
                <a href="#" className="text-vergil-off-black hover:text-vergil-purple transition-colors">Products</a>
                <a href="#" className="text-vergil-off-black hover:text-vergil-purple transition-colors">Support</a>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-vergil-off-black mb-4">
              Color System v2: Apple-Inspired Design
            </h1>
            <p className="text-lg text-vergil-off-black opacity-80">
              A sophisticated monochrome palette with subtle attention hierarchies
            </p>
          </div>
          
          {/* Color system sections */}
          {Object.entries(colorSystemV2).map(([key, section]) => (
            <div key={key} className="mb-16">
              <h2 className="text-2xl font-semibold text-vergil-off-black mb-2">{section.title}</h2>
              <p className="text-vergil-off-black opacity-70 mb-8">{section.description}</p>
              
              <div className="grid gap-6">
                {section.colors.map(color => (
                  <div key={color.name} className="bg-vergil-off-white rounded-lg p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Color swatch */}
                      <div>
                        {key === 'gradients' ? (
                          <div 
                            className="w-full h-24 rounded-md mb-4 border border-gray-200"
                            style={{ 
                              background: color.name === 'Consciousness Gradient' 
                                ? 'linear-gradient(135deg, #7B00FF, #9933FF, #BB66FF)'
                                : 'linear-gradient(90deg, #BB66FF, #D199FF)'
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-24 rounded-md mb-4 border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          />
                        )}
                        <h3 className="font-semibold text-vergil-off-black">{color.name}</h3>
                        <p className="text-sm text-vergil-footnote-text mt-1">{color.hex}</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                          {color.cssVar}
                        </code>
                      </div>
                      
                      {/* Usage rules */}
                      <div>
                        <h4 className="font-medium text-vergil-off-black mb-3">Usage Rules</h4>
                        <ul className="space-y-2">
                          {color.rules.map((rule, idx) => (
                            <li key={idx} className="text-sm text-vergil-off-black flex items-start gap-2">
                              <span className="text-vergil-purple mt-0.5">•</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Examples */}
                      <div>
                        <h4 className="font-medium text-vergil-off-black mb-3">Use Cases</h4>
                        <div className="flex flex-wrap gap-2">
                          {color.examples.map((example, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-vergil-full-white px-3 py-1 rounded-full border border-gray-200"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Live examples section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-vergil-off-black mb-8">Live Examples</h2>
            
            <div className="space-y-8">
              {/* Cookie consent example */}
              {!acceptedCookies && (
                <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                  <h3 className="font-medium text-vergil-off-black mb-2">Cookie Consent Banner</h3>
                  <p className="text-sm text-vergil-off-black mb-4">
                    We use cookies to provide you with a better experience. By continuing to browse, you agree to our use of cookies.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setAcceptedCookies(true)}
                      className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-emphasis-button-hover transition-colors"
                    >
                      Accept All Cookies
                    </button>
                    <button className="px-4 py-2 bg-vergil-full-white text-vergil-off-black text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                      Manage Preferences
                    </button>
                  </div>
                </div>
              )}
              
              {/* Update notification example */}
              <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                <h3 className="font-medium text-vergil-off-black mb-2">System Update Available</h3>
                <p className="text-sm text-vergil-off-black mb-4">
                  Version 2.1.0 is now available with improved performance and new features.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-vergil-footnote-text">Released 2 days ago</span>
                  <button className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-emphasis-button-hover transition-colors">
                    Update Now
                  </button>
                </div>
              </div>
              
              {/* Beta feature announcement */}
              <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-vergil-off-black mb-2">Try Our New AI Assistant (Beta)</h3>
                    <p className="text-sm text-vergil-off-black mb-4">
                      Experience the next generation of intelligent assistance with early access to our beta program.
                    </p>
                    <button className="text-sm text-vergil-purple hover:underline">
                      Learn more →
                    </button>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <X className="w-4 h-4 text-vergil-off-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Usage guidelines */}
          <div className="bg-vergil-off-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-vergil-off-black mb-6">Implementation Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-vergil-off-black mb-4">When to Use Emphasis Colors</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-vergil-purple mt-0.5">•</span>
                    <div>
                      <strong>Region/Language Selection:</strong> Guide users to localize their experience
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vergil-purple mt-0.5">•</span>
                    <div>
                      <strong>Cookie Consent:</strong> Legal requirements that need acknowledgment
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vergil-purple mt-0.5">•</span>
                    <div>
                      <strong>System Updates:</strong> Important but non-urgent notifications
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vergil-purple mt-0.5">•</span>
                    <div>
                      <strong>Beta Features:</strong> Optional new functionality announcements
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vergil-purple mt-0.5">•</span>
                    <div>
                      <strong>Maintenance Notices:</strong> Upcoming service interruptions
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-vergil-off-black mb-4">Color Relationships</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-vergil-full-white rounded-md">
                    <p className="font-medium mb-2">Main Content Hierarchy:</p>
                    <p>vergil-white → vergil-off-white → vergil-emphasis-bg</p>
                    <p className="text-vergil-footnote-text mt-1">Each step draws slightly more attention</p>
                  </div>
                  
                  <div className="p-4 bg-vergil-full-white rounded-md">
                    <p className="font-medium mb-2">Text Contrast Hierarchy:</p>
                    <p>vergil-footnote → vergil-text → vergil-emphasis-text</p>
                    <p className="text-vergil-footnote-text mt-1">Increasing importance and contrast</p>
                  </div>
                  
                  <div className="p-4 bg-vergil-full-white rounded-md">
                    <p className="font-medium mb-2">Separation Rule:</p>
                    <p className="text-vergil-error">Never place vergil-off-white directly on vergil-emphasis-bg</p>
                    <p className="text-vergil-footnote-text mt-1">Always separate with vergil-white</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-vergil-off-white border-t border-gray-200 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-vergil-footnote-text text-sm">
              © 2024 Vergil AI. All rights reserved. | Privacy Policy | Terms of Service | Cookie Preferences
            </p>
          </div>
        </footer>
      </div>
    )
  }
}