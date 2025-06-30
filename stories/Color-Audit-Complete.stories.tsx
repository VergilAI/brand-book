import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

const meta = {
  title: 'Foundation/Color Audit - Complete System',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Complete color inventory with exact file locations
const colorInventory = {
  // Brand v1 Colors (Currently in Use)
  brandV1: {
    title: "Brand v1 Colors (Current Implementation)",
    colors: [
      {
        name: "cosmic-purple",
        hex: "#6366F1",
        cssVar: "--cosmic-purple",
        usage: 58,
        locations: [
          {
            file: "app/drawing-tool/components/canvas/DrawingCanvas.tsx",
            lines: [810, 1255],
            context: "Primary selection color for shapes",
            route: "/drawing-tool",
            section: "Canvas - Shape selection"
          },
          {
            file: "app/brand/motion/streamgraph/page.tsx",
            line: 43,
            context: "Color palette array for streamgraph visualization",
            route: "/brand/motion/streamgraph",
            section: "Streamgraph color scheme"
          },
          {
            file: "Multiple landing components",
            context: "bg-cosmic-purple, text-cosmic-purple classes",
            route: "/vergil-learn, /vergil-main",
            section: "CTAs, headers, links"
          }
        ]
      },
      {
        name: "electric-violet",
        hex: "#A78BFA",
        cssVar: "--electric-violet",
        usage: 21,
        locations: [
          {
            file: "app/brand/motion/streamgraph/page.tsx",
            line: 43,
            context: "Secondary color in palette",
            route: "/brand/motion/streamgraph",
            section: "Visualization colors"
          },
          {
            file: "components/vergil/neural-network.tsx",
            context: "Node connections and animations",
            route: "Various pages using NeuralNetwork component",
            section: "Background effects"
          }
        ]
      },
      {
        name: "luminous-indigo",
        hex: "#818CF8",
        cssVar: "--luminous-indigo",
        usage: 15,
        locations: [
          {
            file: "app/brand/motion/streamgraph/page.tsx",
            line: 43,
            context: "Tertiary color in palette",
            route: "/brand/motion/streamgraph",
            section: "Data visualization"
          }
        ]
      },
      {
        name: "phosphor-cyan",
        hex: "#10B981",
        cssVar: "--phosphor-cyan",
        usage: 28,
        locations: [
          {
            file: "components/lms/territory-conquest.tsx",
            context: "Player 2 color",
            route: "/lms game modules",
            section: "Territory game - Player colors"
          }
        ]
      },
      {
        name: "synaptic-blue",
        hex: "#3B82F6",
        cssVar: "--synaptic-blue",
        usage: 52,
        locations: [
          {
            file: "Multiple UI components",
            context: "Info states, links, interactive elements",
            route: "Throughout application",
            section: "Interactive elements"
          }
        ]
      },
      {
        name: "neural-pink",
        hex: "#F472B6",
        cssVar: "--neural-pink",
        usage: 10,
        locations: [
          {
            file: "app/brand/motion/streamgraph/page.tsx",
            line: 43,
            context: "Accent color in palette",
            route: "/brand/motion/streamgraph",
            section: "Data visualization"
          }
        ]
      }
    ]
  },

  // Mystery Colors (Not in Brand Book)
  mysteryColors: {
    title: "Mystery Colors - Need Migration",
    colors: [
      {
        name: "selection-purple",
        hex: "#8B5CF6",
        cssVar: "--selection-purple",
        usage: 27,
        locations: [
          {
            file: "app/drawing-tool/components/canvas/DrawingCanvas.tsx",
            lines: [810, 867, 876, 893, 902, 1040, 1049],
            context: "Hover/pre-selection state for shapes",
            route: "/drawing-tool",
            section: "Canvas - Hover states"
          },
          {
            file: "app/map-editor/components/drawing/BezierDrawTool.tsx",
            lines: [114, 126, 139, 155],
            context: "Bezier curve control handles",
            route: "/map-editor",
            section: "Bezier drawing tool - Control points"
          },
          {
            file: "app/map-editor/components/canvas/MapCanvas.tsx",
            lines: [1255, 1358, 1367, 1384, 1393, 1531, 1540],
            context: "Shape hover/selection states",
            route: "/map-editor",
            section: "Canvas - Interactive states"
          },
          {
            file: "components/lms/territory-conquest.tsx",
            line: 23,
            context: "Player 6 color",
            route: "/lms territory game",
            section: "Player colors"
          },
          {
            file: "components/vergil/iris-rays.tsx",
            line: 52,
            context: "Secondary ray color",
            route: "Components using IrisRays",
            section: "Background animation"
          },
          {
            file: "components/vergil/light-rays.tsx",
            lines: [70, 76],
            context: "Violet ray color",
            route: "Components using LightRays",
            section: "Background effects"
          }
        ]
      },
      {
        name: "gray-500",
        hex: "#6B7280",
        cssVar: "--gray-500",
        usage: 25,
        locations: [
          {
            file: "app/map-editor/components/panels/FloatingPropertiesPanel.tsx",
            lines: [130, 141, 150, 160],
            context: "Border color for layer icons",
            route: "/map-editor",
            section: "Properties panel - Layer controls"
          },
          {
            file: "components/lms/territory-conquest.tsx",
            line: 223,
            context: "Border/outline color",
            route: "/lms territory game",
            section: "Territory borders"
          },
          {
            file: "components/vergil/graph-constellation.tsx",
            lines: [331, 503, 717],
            context: "Node label color",
            route: "Pages with GraphConstellation",
            section: "Graph node labels"
          }
        ]
      },
      {
        name: "orange-brand",
        hex: "#FF6600",
        cssVar: "--orange-brand",
        usage: 8,
        locations: [
          {
            file: "app/drawing-tool/hooks/useSnapping.ts",
            lines: [118, 173, 225],
            context: "Center snap indicator color",
            route: "/drawing-tool",
            section: "Snapping system - Center snap visualization"
          },
          {
            file: "app/map-editor/hooks/useSnapping.ts",
            lines: [118, 153, 188],
            context: "Center snap indicator color",
            route: "/map-editor",
            section: "Snapping system - Center snap visualization"
          },
          {
            file: "app/drawing-tool/components/canvas/SnapIndicators.tsx",
            line: 20,
            context: "Center snap indicator check",
            route: "/drawing-tool",
            section: "Snap indicators display"
          }
        ]
      },
      {
        name: "blue-dark",
        hex: "#1E40AF",
        cssVar: "--blue-dark",
        usage: 8,
        locations: [
          {
            file: "app/drawing-tool/components/canvas/DrawingCanvas.tsx",
            lines: [923, 934],
            context: "Selected vertex color",
            route: "/drawing-tool",
            section: "Vertex selection state"
          },
          {
            file: "app/map-editor/components/panels/FloatingPropertiesPanel.tsx",
            lines: [131, 161],
            context: "Layer icon border color",
            route: "/map-editor",
            section: "Properties panel - Layer indicators"
          },
          {
            file: "app/map-editor/components/canvas/MapCanvas.tsx",
            line: 1414,
            context: "Selected vertex color",
            route: "/map-editor",
            section: "Vertex editing - Selection state"
          }
        ]
      },
      {
        name: "cyan-bright",
        hex: "#06B6D4",
        cssVar: "--cyan-bright",
        usage: 2,
        locations: [
          {
            file: "app/brand/motion/streamgraph/page.tsx",
            line: 43,
            context: "Additional color in palette",
            route: "/brand/motion/streamgraph",
            section: "Data visualization"
          }
        ]
      }
    ]
  },

  // Brand v2 Colors (Not Yet Implemented)
  brandV2: {
    title: "Brand v2 - Monochrome System (TO BE IMPLEMENTED)",
    colors: [
      {
        name: "vergil-purple",
        hex: "#7B00FF",
        cssVar: "--vergil-purple",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Should replace cosmic-purple (#6366F1)",
            route: "All routes",
            section: "Primary brand color everywhere"
          }
        ]
      },
      {
        name: "vergil-text",
        hex: "#1D1D1F",
        cssVar: "--vergil-text",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Should replace all #000000 usage",
            route: "All routes",
            section: "All black text"
          }
        ]
      },
      {
        name: "vergil-white",
        hex: "#F5F5F7",
        cssVar: "--vergil-white",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Should replace all #FFFFFF usage",
            route: "All routes",
            section: "All white text/backgrounds"
          }
        ]
      },
      {
        name: "vergil-purple-lighter",
        hex: "#BB66FF",
        cssVar: "--vergil-purple-lighter",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Dark theme primary purple",
            route: "All routes",
            section: "Dark theme elements"
          }
        ]
      },
      {
        name: "vergil-purple-lightest",
        hex: "#D199FF",
        cssVar: "--vergil-purple-lightest",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Dark theme secondary purple",
            route: "All routes",
            section: "Dark theme accents"
          }
        ]
      }
    ]
  },

  // Functional Colors
  functionalColors: {
    title: "Functional Colors (Semantic)",
    colors: [
      {
        name: "vergil-success",
        hex: "#0F8A0F",
        cssVar: "--vergil-success",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Should replace phosphor-cyan for success states",
            route: "All routes",
            section: "Success messages, confirmations"
          }
        ]
      },
      {
        name: "vergil-error",
        hex: "#E51C23",
        cssVar: "--vergil-error",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Error states, delete actions",
            route: "All routes",
            section: "Error messages, destructive actions"
          }
        ]
      },
      {
        name: "vergil-warning",
        hex: "#FFC700",
        cssVar: "--vergil-warning",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Warning messages only",
            route: "All routes",
            section: "Warning states"
          }
        ]
      },
      {
        name: "vergil-info",
        hex: "#0087FF",
        cssVar: "--vergil-info",
        usage: 0,
        locations: [
          {
            file: "NOT YET IMPLEMENTED",
            context: "Should replace synaptic-blue for info states",
            route: "All routes",
            section: "Info messages, tooltips"
          }
        ]
      }
    ]
  },

  // Pure Colors (Backwards Compatibility)
  pureColors: {
    title: "Pure Colors (Should Migrate to Apple-Inspired)",
    colors: [
      {
        name: "pure-white",
        hex: "#FFFFFF",
        cssVar: "--pure-white",
        usage: 29,
        locations: [
          {
            file: "Multiple components",
            context: "text-white, bg-white classes",
            route: "Throughout application",
            section: "Should use vergil-white (#F5F5F7)"
          }
        ]
      },
      {
        name: "pure-black",
        hex: "#000000",
        cssVar: "--pure-black",
        usage: 13,
        locations: [
          {
            file: "app/drawing-tool/components/canvas/DrawingCanvas.tsx",
            line: 810,
            context: "Default shape stroke color",
            route: "/drawing-tool",
            section: "Should use vergil-text (#1D1D1F)"
          }
        ]
      }
    ]
  }
}

// Color swatch component
const ColorSwatch = ({ 
  color, 
  expanded, 
  onToggle 
}: { 
  color: any
  expanded: boolean
  onToggle: () => void
}) => {
  const cssVarValue = `var(${color.cssVar})`
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div 
          className="w-20 h-20 rounded-md shadow-sm border border-gray-200 flex-shrink-0"
          style={{ backgroundColor: color.hex }}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-base">{color.name}</h4>
          <div className="mt-1 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Hex:</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{color.hex}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">CSS:</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{color.cssVar}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Tailwind:</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">
                {color.name.startsWith('vergil-') ? color.name : color.name.replace('--', '')}
              </code>
            </div>
            <div className="text-gray-600">
              <strong>{color.usage}</strong> occurrences found
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          <svg 
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h5 className="font-medium text-sm mb-3">File Locations:</h5>
          <div className="space-y-3">
            {color.locations.map((loc: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded border border-gray-200 text-sm">
                <div className="font-mono text-xs text-blue-600 mb-1">{loc.file}</div>
                {loc.lines && (
                  <div className="text-gray-600 mb-1">
                    Lines: {Array.isArray(loc.lines) ? loc.lines.join(', ') : loc.line}
                  </div>
                )}
                <div className="text-gray-700 mb-2">{loc.context}</div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500">
                    <strong>Route:</strong> {loc.route}
                  </span>
                  <span className="text-gray-500">
                    <strong>Section:</strong> {loc.section}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Main story component
export const CompleteColorAudit: Story = {
  render: () => {
    const [expandedColors, setExpandedColors] = useState<Set<string>>(new Set())
    
    const toggleColor = (colorName: string) => {
      const newExpanded = new Set(expandedColors)
      if (newExpanded.has(colorName)) {
        newExpanded.delete(colorName)
      } else {
        newExpanded.add(colorName)
      }
      setExpandedColors(newExpanded)
    }
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Complete Color Audit</h1>
            <p className="text-lg text-gray-600 mb-2">
              Every color in the codebase is now defined in globals.css and available in Tailwind.
            </p>
            <p className="text-gray-500">
              Click on any color to see exact file locations, line numbers, and usage context.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-amber-900 mb-2">🚨 Migration Required</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Brand v2 colors (#7B00FF, #1D1D1F, #F5F5F7) have 0 implementations</li>
              <li>• Still using Brand v1 cosmic-purple (#6366F1) in 58 places</li>
              <li>• Mystery purple #8B5CF6 appears 27 times (now tokenized as selection-purple)</li>
              <li>• Pure white/black should migrate to Apple-inspired colors</li>
            </ul>
          </div>
          
          {Object.entries(colorInventory).map(([key, section]) => (
            <div key={key} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
              <div className="grid gap-4">
                {section.colors.map((color) => (
                  <ColorSwatch
                    key={color.name}
                    color={color}
                    expanded={expandedColors.has(color.name)}
                    onToggle={() => toggleColor(color.name)}
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-4">How to Use These Colors</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">In CSS/Styled Components:</h4>
                <pre className="bg-gray-50 p-3 rounded overflow-x-auto">
{`/* Use CSS variables */
color: var(--vergil-purple);
background: var(--selection-purple);

/* Or in theme */
color: var(--color-vergil-purple);`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">In Tailwind Classes:</h4>
                <pre className="bg-gray-50 p-3 rounded overflow-x-auto">
{`<!-- Brand colors -->
<div className="text-vergil-purple bg-vergil-white">

<!-- Selection colors -->
<div className="border-selection-purple">

<!-- Functional colors -->
<div className="text-vergil-error bg-vergil-success">`}
                </pre>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Replace all inline color definitions with these tokens</li>
                <li>Migrate from Brand v1 to Brand v2 colors</li>
                <li>Replace #FFFFFF with vergil-white (#F5F5F7)</li>
                <li>Replace #000000 with vergil-text (#1D1D1F)</li>
                <li>Remove any colors not in this system</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }
}