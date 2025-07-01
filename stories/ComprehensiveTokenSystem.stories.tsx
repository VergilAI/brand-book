import type { Meta, StoryObj } from '@storybook/react'
import { useGlobals } from 'storybook/preview-api'
import { 
  TokenBrowser, 
  VersionComparison, 
  MigrationTable, 
  VersionMetadata,
  TokenGrid,
  TokenSwatch
} from '../components/storybook'
import type { VersionInfo, MigrationItem } from '../components/storybook'

const meta = {
  title: 'Storybook Integration/Complete Token System',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The complete Storybook integration demonstrating all token visualization and version management features working together.'
      }
    }
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Complete token datasets for both versions
const v1TokenData = [
  {
    name: 'cosmic-purple',
    value: '#6366F1',
    cssVar: '--cosmic-purple',
    usage: 'Primary brand color (deprecated)',
    category: 'color' as const,
    deprecated: true,
    examples: ['Legacy buttons', 'Old components'],
    rules: ['DEPRECATED - Use vergil-purple instead']
  },
  {
    name: 'deep-space',
    value: '#0F172A',
    cssVar: '--deep-space',
    usage: 'Dark background color',
    category: 'color' as const,
    examples: ['Dark backgrounds', 'Night theme'],
    rules: ['Primary dark background', 'Good for dark mode']
  },
  {
    name: 'pure-light',
    value: '#FFFFFF',
    cssVar: '--pure-light',
    usage: 'Pure white background',
    category: 'color' as const,
    examples: ['Light backgrounds', 'Cards'],
    rules: ['Main light background', 'Ensure text contrast']
  }
]

const v2TokenData = [
  // Brand colors
  {
    name: 'vergil-purple',
    value: '#7B00FF',
    cssVar: '--vergil-purple',
    usage: 'Primary brand purple',
    category: 'color' as const,
    examples: ['Primary buttons', 'Brand elements'],
    rules: ['Primary brand identity', 'CTA buttons']
  },
  {
    name: 'vergil-purple-light',
    value: '#9933FF',
    cssVar: '--vergil-purple-light',
    usage: 'Light purple for hover states',
    category: 'color' as const,
    examples: ['Button hover', 'Interactive feedback'],
    rules: ['Hover states only', 'Interactive elements']
  },
  // Neutral colors
  {
    name: 'vergil-full-black',
    value: '#000000',
    cssVar: '--vergil-full-black',
    usage: 'Full black - backgrounds only',
    category: 'color' as const,
    examples: ['Dark mode backgrounds', 'Hero sections'],
    rules: ['Backgrounds only', 'Never for text', 'OLED optimized']
  },
  {
    name: 'vergil-off-black',
    value: '#1D1D1F',
    cssVar: '--vergil-off-black',
    usage: 'Primary text color',
    category: 'color' as const,
    examples: ['Body text', 'Headlines'],
    rules: ['Primary text on light', 'Apple-inspired']
  },
  {
    name: 'vergil-full-white',
    value: '#FFFFFF',
    cssVar: '--vergil-full-white',
    usage: 'Full white - backgrounds only',
    category: 'color' as const,
    examples: ['Page backgrounds', 'Cards'],
    rules: ['Backgrounds only', 'Never for text']
  },
  {
    name: 'vergil-off-white',
    value: '#F5F5F7',
    cssVar: '--vergil-off-white',
    usage: 'Off-white for text on dark',
    category: 'color' as const,
    examples: ['Text on dark', 'Soft containers'],
    rules: ['Text on dark backgrounds', 'Soft sections']
  },
  // Attention colors
  {
    name: 'vergil-emphasis-bg',
    value: '#F0F0F2',
    cssVar: '--vergil-emphasis-bg',
    usage: 'Attention background',
    category: 'color' as const,
    breaking: true,
    examples: ['Cookie banners', 'System notifications'],
    rules: ['NEW in v2.0', 'Temporary UI elements', 'Apple-inspired']
  },
  {
    name: 'vergil-emphasis-text',
    value: '#303030',
    cssVar: '--vergil-emphasis-text',
    usage: 'Text on emphasis backgrounds',
    category: 'color' as const,
    breaking: true,
    examples: ['Header text', 'Notification text'],
    rules: ['Use on emphasis-bg only', 'Attention hierarchy']
  },
  // Functional colors
  {
    name: 'vergil-success',
    value: '#0F8A0F',
    cssVar: '--vergil-success',
    usage: 'Success states',
    category: 'color' as const,
    examples: ['Success messages', 'Valid inputs'],
    rules: ['Success feedback only', 'WCAG AA compliant']
  },
  {
    name: 'vergil-error',
    value: '#E51C23',
    cssVar: '--vergil-error',
    usage: 'Error states',
    category: 'color' as const,
    examples: ['Error messages', 'Delete buttons'],
    rules: ['Error feedback only', 'Destructive actions']
  },
  {
    name: 'vergil-warning',
    value: '#FFC700',
    cssVar: '--vergil-warning',
    usage: 'Warning states',
    category: 'color' as const,
    examples: ['Warning messages', 'Caution alerts'],
    rules: ['Warning feedback only', 'Important notices']
  },
  {
    name: 'vergil-info',
    value: '#0087FF',
    cssVar: '--vergil-info',
    usage: 'Info states',
    category: 'color' as const,
    examples: ['Info messages', 'Help text'],
    rules: ['Informational feedback', 'Neutral notices']
  }
]

const versionInfo: VersionInfo = {
  version: 'v2.0.0',
  name: 'Apple-Inspired Monochrome System',
  releaseDate: '2024-06-30',
  status: 'current',
  description: 'Complete redesign with Apple-inspired attention hierarchy and sophisticated color usage rules',
  breaking: true,
  tokensAdded: 9,
  tokensModified: 3,
  tokensRemoved: 0,
  contributors: ['Design Team', 'Frontend Team', 'Accessibility Team'],
  changelog: [
    'Introduced Apple-inspired attention hierarchy',
    'Added vergil-purple family for stronger brand identity',
    'Implemented sophisticated emphasis system',
    'Improved WCAG AA compliance across all tokens',
    'Optimized for OLED displays with true black'
  ],
  compatibility: {
    browsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
    frameworks: ['React 18+', 'Vue 3+', 'Angular 15+'],
    dependencies: {
      'tailwindcss': '^4.0.0',
      '@storybook/react': '^7.0.0'
    }
  },
  performance: {
    bundleSize: '12KB (-15%)',
    loadTime: '< 50ms',
    improvements: [
      'Reduced complexity while adding features',
      'Better tree-shaking support',
      'Optimized CSS variable names'
    ]
  },
  accessibility: {
    wcagLevel: 'AA',
    improvements: [
      'All combinations meet WCAG AA standards',
      'High contrast mode support',
      'Better screen reader compatibility'
    ]
  }
}

const migrationData: MigrationItem[] = [
  {
    oldToken: { name: 'cosmic-purple', value: '#6366F1', cssVar: '--cosmic-purple' },
    newToken: { name: 'vergil-purple', value: '#7B00FF', cssVar: '--vergil-purple' },
    status: 'replaced',
    category: 'brand',
    notes: 'More vibrant purple for stronger brand identity',
    migrationGuide: 'Replace all instances of cosmic-purple with vergil-purple'
  },
  {
    oldToken: { name: 'deep-space', value: '#0F172A', cssVar: '--deep-space' },
    newToken: { name: 'vergil-full-black', value: '#000000', cssVar: '--vergil-full-black' },
    status: 'breaking',
    category: 'neutral',
    notes: 'True black for OLED optimization - breaking change',
    migrationGuide: 'Update backgrounds and ensure proper text contrast'
  },
  {
    oldToken: { name: 'vergil-emphasis-bg', value: '#F0F0F2', cssVar: '--vergil-emphasis-bg' },
    status: 'new',
    category: 'attention',
    notes: 'New Apple-inspired attention hierarchy system'
  }
]

const VersionAwareDisplay = () => {
  const [globals] = useGlobals()
  const currentVersion = globals.version || 'v2'
  const tokens = currentVersion === 'v1' ? v1TokenData : v2TokenData
  
  return (
    <div className="space-y-8">
      {/* Version indicator */}
      <div className={`p-4 rounded-lg border-l-4 ${
        currentVersion === 'v2' 
          ? 'bg-green-50 border-green-400' 
          : 'bg-yellow-50 border-yellow-400'
      }`}>
        <h2 className={`font-semibold mb-2 ${
          currentVersion === 'v2' ? 'text-green-900' : 'text-yellow-900'
        }`}>
          Currently Viewing: {currentVersion === 'v2' ? 'Version 2.0 (Current)' : 'Version 1.0 (Legacy)'}
        </h2>
        <p className={`text-sm ${
          currentVersion === 'v2' ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {currentVersion === 'v2' 
            ? 'This is the current Apple-inspired design system with sophisticated attention hierarchy.'
            : 'This is the legacy design system. Most tokens are deprecated and should be migrated.'
          }
        </p>
      </div>

      {/* Token browser */}
      <TokenBrowser 
        title={`${currentVersion === 'v2' ? 'Current' : 'Legacy'} Token Browser`}
        description={`Interactive browser for ${currentVersion} design tokens`}
        tokens={tokens}
        showLiveEditor={currentVersion === 'v2'}
        showCodeGeneration={true}
        showUsageExamples={true}
        enableHotReload={currentVersion === 'v2'}
      />
    </div>
  )
}

export const InteractiveTokenSystem: Story = {
  render: VersionAwareDisplay,
  parameters: {
    docs: {
      description: {
        story: 'Complete interactive token system that responds to the version switcher. Change versions in the toolbar to see the full experience.'
      }
    }
  }
}

export const SystemOverview: Story = {
  render: () => (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Vergil Design Token System</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive design token system with advanced version management, 
          interactive browsing, and automated migration tools.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Version Management</h3>
          <p className="text-sm text-gray-600 mb-4">
            Track token evolution across versions with breaking change indicators and migration guides.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Current versions</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Deprecated tokens</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Breaking changes</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Interactive Browser</h3>
          <p className="text-sm text-gray-600 mb-4">
            Search, filter, and explore tokens with live preview and code generation.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Advanced search & filtering</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Live preview modes</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span>CSS/JSON export</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Migration Tools</h3>
          <p className="text-sm text-gray-600 mb-4">
            Automated migration guides with step-by-step instructions and code examples.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Token mapping</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>Migration scripts</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span>Breaking change alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current version display */}
      <VersionMetadata versionInfo={versionInfo} compact={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete system overview showing all features and capabilities of the token management system.'
      }
    }
  }
}

export const MigrationWorkflow: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Migration Workflow: v1 → v2</h2>
        <p className="text-gray-600">Complete step-by-step migration process</p>
      </div>

      {/* Step 1: Version comparison */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-4">Step 1: Understand the Changes</h3>
        <VersionComparison
          leftTitle="v1.0 (Current)"
          rightTitle="v2.0 (Target)"
          leftContent={
            <div className="space-y-3">
              <TokenSwatch name="cosmic-purple" value="#6366F1" size="small" deprecated={true} />
              <TokenSwatch name="deep-space" value="#0F172A" size="small" />
              <div className="text-xs text-gray-600 mt-2">
                3 tokens • Limited accessibility • Basic system
              </div>
            </div>
          }
          rightContent={
            <div className="space-y-3">
              <TokenSwatch name="vergil-purple" value="#7B00FF" size="small" />
              <TokenSwatch name="vergil-full-black" value="#000000" size="small" />
              <TokenSwatch name="vergil-emphasis-bg" value="#F0F0F2" size="small" breaking={true} />
              <div className="text-xs text-gray-600 mt-2">
                12 tokens • WCAG AA compliant • Apple-inspired system
              </div>
            </div>
          }
        />
      </div>

      {/* Step 2: Migration table */}
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-4">Step 2: Review Migration Map</h3>
        <MigrationTable
          migrations={migrationData}
          showCategory={true}
          groupByCategory={false}
        />
      </div>

      {/* Step 3: Implementation */}
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-4">Step 3: Implement Changes</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">CSS Updates</h4>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`/* Before */
.button {
  background: var(--cosmic-purple);
  color: var(--pure-light);
}

/* After */
.button {
  background: var(--vergil-purple);
  color: var(--vergil-full-white);
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Automated Script</h4>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`# Replace cosmic-purple
find . -name "*.css" -exec sed -i \\
  "s/cosmic-purple/vergil-purple/g" {} +

# Replace deep-space
find . -name "*.css" -exec sed -i \\
  "s/deep-space/vergil-full-black/g" {} +`}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 4: Validation */}
      <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-4">Step 4: Validate & Test</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded border">
            <h5 className="font-medium mb-2">Accessibility</h5>
            <ul className="space-y-1 text-xs">
              <li>✓ Contrast ratios</li>
              <li>✓ Color blindness</li>
              <li>✓ Screen readers</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded border">
            <h5 className="font-medium mb-2">Browser Support</h5>
            <ul className="space-y-1 text-xs">
              <li>✓ Chrome 90+</li>
              <li>✓ Firefox 88+</li>
              <li>✓ Safari 14+</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded border">
            <h5 className="font-medium mb-2">Performance</h5>
            <ul className="space-y-1 text-xs">
              <li>✓ Bundle size</li>
              <li>✓ Load time</li>
              <li>✓ Tree shaking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete migration workflow showing the step-by-step process of upgrading from v1 to v2 with all tools and validations.'
      }
    }
  }
}