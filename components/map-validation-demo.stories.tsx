import type { Meta, StoryObj } from '@storybook/react'
import { OptimizedTerritoryMap } from './optimized-territory-map'
import { validateMap, suggestFixes } from '@/lib/lms/map-validation'
import { SAMPLE_MAP_DATA, type MapData } from '@/lib/lms/optimized-map-data'

const meta = {
  title: 'LMS/Games/MapValidation',
  component: OptimizedTerritoryMap,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptimizedTerritoryMap>

export default meta
type Story = StoryObj<typeof meta>

// Create an invalid map for testing
const INVALID_MAP_DATA: MapData = {
  ...SAMPLE_MAP_DATA,
  borders: {
    ...SAMPLE_MAP_DATA.borders,
    // This border claims to connect alaska and greenland but doesn't actually touch both
    "b_invalid": {
      id: "b_invalid",
      path: "M 400 200 L 450 220", // Random line in the middle
      territories: ["alaska", "greenland"],
      type: "land",
      points: [{x: 400, y: 200}, {x: 450, y: 220}]
    }
  },
  territories: {
    ...SAMPLE_MAP_DATA.territories,
    "alaska": {
      ...SAMPLE_MAP_DATA.territories.alaska,
      borderSegments: [...SAMPLE_MAP_DATA.territories.alaska.borderSegments, "b_invalid"]
    },
    "greenland": {
      ...SAMPLE_MAP_DATA.territories.greenland,
      borderSegments: [...SAMPLE_MAP_DATA.territories.greenland.borderSegments, "b_invalid"]
    },
    // Territory with missing border reference
    "orphan-territory": {
      id: "orphan-territory",
      name: "Orphan Territory",
      continent: "europe",
      center: { x: 600, y: 300 },
      fillPath: "M 580 280 L 620 280 L 620 320 L 580 320 Z",
      borderSegments: ["non-existent-border"] // This border doesn't exist
    }
  }
}

// Validation demo component
const ValidationDemo = ({ mapData, title }: { mapData: MapData, title: string }) => {
  const validation = validateMap(mapData)
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-medium text-sm text-gray-700">Validation Status</h3>
            <div className={`text-2xl font-bold ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
              {validation.valid ? '✓ Valid' : '✗ Invalid'}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-700">Statistics</h3>
            <div className="text-xs space-y-1">
              <div>Territories: {validation.stats.totalTerritories}</div>
              <div>Borders: {validation.stats.totalBorders}</div>
              <div>Valid Borders: {validation.stats.validBorders}</div>
              <div>Invalid Borders: {validation.stats.invalidBorders}</div>
            </div>
          </div>
        </div>
        
        {validation.errors.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-sm text-red-700 mb-2">Errors ({validation.errors.length})</h3>
            <div className="bg-red-50 rounded p-3 max-h-40 overflow-y-auto">
              <ul className="text-xs space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    <strong>{error.type}:</strong> {error.message}
                    {error.details && (
                      <div className="ml-4 text-red-500 text-xs mt-1">
                        {JSON.stringify(error.details, null, 2)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {validation.warnings.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-yellow-700 mb-2">Warnings ({validation.warnings.length})</h3>
            <div className="bg-yellow-50 rounded p-3 max-h-40 overflow-y-auto">
              <ul className="text-xs space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-600">
                    <strong>{warning.type}:</strong> {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const ValidMap: Story = {
  render: () => (
    <div className="space-y-8">
      <ValidationDemo mapData={SAMPLE_MAP_DATA} title="Valid Map" />
      <OptimizedTerritoryMap />
    </div>
  ),
}

export const InvalidMap: Story = {
  render: () => (
    <div className="space-y-8">
      <ValidationDemo mapData={INVALID_MAP_DATA} title="Invalid Map (with errors)" />
      <div className="text-sm text-gray-600 text-center">
        The map component will show validation errors instead of rendering
      </div>
    </div>
  ),
}

// Demo showing auto-fix suggestions
const AutoFixDemo = () => {
  const validation = validateMap(INVALID_MAP_DATA)
  const fixedMap = suggestFixes(INVALID_MAP_DATA, validation)
  const fixedValidation = validateMap(fixedMap)
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <ValidationDemo mapData={INVALID_MAP_DATA} title="Original (Invalid)" />
        <ValidationDemo mapData={fixedMap} title="After Auto-Fix" />
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Auto-Fix Applied:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Removed orphan borders that reference non-existent territories</li>
          <li>• Removed missing border references from territories</li>
          <li>• Note: Border alignment issues need manual fixing in map editor</li>
        </ul>
      </div>
    </div>
  )
}

export const AutoFix: Story = {
  render: () => <AutoFixDemo />,
}

// Real-time validation checker
const ValidationChecker = () => {
  const validation = validateMap(SAMPLE_MAP_DATA)
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Map Validation Report</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-3xl font-bold text-gray-700">{validation.stats.totalTerritories}</div>
            <div className="text-sm text-gray-600">Territories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-3xl font-bold text-gray-700">{validation.stats.totalBorders}</div>
            <div className="text-sm text-gray-600">Borders</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className={`text-3xl font-bold ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
              {validation.valid ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Validation</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Validation Rules Checked:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All territories have valid SVG paths</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Borders connect exactly 2 territories</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Border paths lie on territory edges (within tolerance)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>No orphan borders or territories</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Continent references are valid</span>
              </li>
            </ul>
          </div>
          
          {validation.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold text-yellow-700 mb-2">Warnings:</h3>
              <ul className="space-y-1 text-sm">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-600">
                    • {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <OptimizedTerritoryMap />
    </div>
  )
}

export const ValidationReport: Story = {
  render: () => <ValidationChecker />,
}