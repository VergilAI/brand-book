import type { Meta, StoryObj } from '@storybook/react'
import { VersionMetadata, VersionComparison, MigrationTable } from '../components/storybook'
import type { VersionInfo, MigrationItem } from '../components/storybook'

const meta = {
  title: 'Storybook Integration/Version Management',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive version management system for design tokens with metadata display, breaking change indicators, and migration guides.'
      }
    }
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Sample version data
const v2VersionInfo: VersionInfo = {
  version: 'v2.0.0',
  name: 'Apple-Inspired Monochrome System',
  releaseDate: '2024-06-30',
  status: 'current',
  description: 'Major redesign introducing Apple-inspired monochrome palette with sophisticated attention hierarchy',
  breaking: true,
  tokensAdded: 12,
  tokensModified: 8,
  tokensRemoved: 3,
  contributors: ['Design Team', 'Frontend Team', 'Accessibility Team'],
  migrationGuide: `
# Migration Guide v1 → v2

## Breaking Changes
1. Replace \`cosmic-purple\` with \`vergil-purple\`
2. Replace \`deep-space\` with \`vergil-full-black\`
3. Update text color usage rules

## CSS Updates
\`\`\`css
/* Before */
.button { background: var(--cosmic-purple); }

/* After */
.button { background: var(--vergil-purple); }
\`\`\`

## New Attention System
- Use \`vergil-emphasis-bg\` for temporary UI elements
- Always separate emphasis colors from off-white with pure white
- Follow Apple's subtle attention hierarchy patterns
  `,
  changelog: [
    'Added Apple-inspired attention hierarchy system',
    'Introduced vergil-purple family for better brand identity',
    'Replaced cosmic-purple with more vibrant vergil-purple',
    'Added emphasis colors for subtle UI attention',
    'Improved accessibility compliance to WCAG AA',
    'Optimized for OLED displays with true black',
    'Added comprehensive usage rules and examples'
  ],
  compatibility: {
    browsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
    frameworks: ['React 18+', 'Vue 3+', 'Angular 15+', 'Svelte 4+'],
    dependencies: {
      'tailwindcss': '^4.0.0',
      '@storybook/react': '^7.0.0',
      'typescript': '^5.0.0'
    }
  },
  performance: {
    bundleSize: '12KB (-15% from v1)',
    loadTime: '< 50ms',
    improvements: [
      'Reduced color palette complexity',
      'Optimized CSS variable names',
      'Removed unused legacy tokens',
      'Improved tree-shaking support'
    ]
  },
  accessibility: {
    wcagLevel: 'AA',
    improvements: [
      'All color combinations meet WCAG AA contrast ratios',
      'Added high contrast mode support',
      'Improved color naming for screen readers',
      'Better focus indicators'
    ],
    issues: [
      'Some gradient combinations may not meet AAA standards',
      'Review needed for motion-sensitive animations'
    ]
  }
}

const v1VersionInfo: VersionInfo = {
  version: 'v1.0.0',
  name: 'Original Cosmic System',
  releaseDate: '2024-01-01',
  status: 'deprecated',
  description: 'Initial design system based on cosmic-purple theme',
  breaking: false,
  tokensAdded: 15,
  tokensModified: 0,
  tokensRemoved: 0,
  contributors: ['Initial Design Team'],
  changelog: [
    'Initial release of design system',
    'Established cosmic-purple as primary brand color',
    'Basic color palette for light and dark themes',
    'Foundation typography and spacing tokens'
  ],
  compatibility: {
    browsers: ['Chrome 80+', 'Firefox 75+', 'Safari 13+'],
    frameworks: ['React 16+', 'Vue 2+'],
    dependencies: {
      'tailwindcss': '^3.0.0',
      '@storybook/react': '^6.5.0'
    }
  },
  performance: {
    bundleSize: '14KB',
    loadTime: '< 60ms'
  },
  accessibility: {
    wcagLevel: 'A',
    issues: [
      'Some color combinations below AA contrast standards',
      'Limited high contrast support'
    ]
  }
}

const migrationData: MigrationItem[] = [
  {
    oldToken: {
      name: 'cosmic-purple',
      value: '#6366F1',
      cssVar: '--cosmic-purple'
    },
    newToken: {
      name: 'vergil-purple',
      value: '#7B00FF',
      cssVar: '--vergil-purple'
    },
    status: 'replaced',
    category: 'brand',
    notes: 'Replaced with more vibrant purple that better represents Vergil brand identity',
    migrationGuide: 'find . -name "*.css" -exec sed -i "s/cosmic-purple/vergil-purple/g" {} +'
  },
  {
    oldToken: {
      name: 'deep-space',
      value: '#0F172A',
      cssVar: '--deep-space'
    },
    newToken: {
      name: 'vergil-full-black',
      value: '#000000',
      cssVar: '--vergil-full-black'
    },
    status: 'breaking',
    category: 'neutral',
    notes: 'Breaking change: Replaced with true black for OLED optimization',
    migrationGuide: 'Update all background usages and ensure proper text contrast'
  },
  {
    oldToken: {
      name: 'vergil-emphasis-bg',
      value: '#F0F0F2',
      cssVar: '--vergil-emphasis-bg'
    },
    status: 'new',
    category: 'attention',
    notes: 'New Apple-inspired attention hierarchy system for temporary UI elements'
  }
]

export const CurrentVersionMetadata: Story = {
  render: () => (
    <VersionMetadata 
      versionInfo={v2VersionInfo}
      showBreakingChanges={true}
      showPerformance={true}
      showAccessibility={true}
      showCompatibility={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete metadata display for the current version (v2.0) including breaking changes, performance metrics, and accessibility information.'
      }
    }
  }
}

export const DeprecatedVersionMetadata: Story = {
  render: () => (
    <VersionMetadata 
      versionInfo={v1VersionInfo}
      showBreakingChanges={false}
      showPerformance={true}
      showAccessibility={true}
      showCompatibility={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Metadata display for a deprecated version showing historical information and limitations.'
      }
    }
  }
}

export const CompactVersionDisplay: Story = {
  render: () => (
    <div className="space-y-4">
      <VersionMetadata versionInfo={v2VersionInfo} compact={true} />
      <VersionMetadata versionInfo={v1VersionInfo} compact={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact version display for use in sidebars or headers where space is limited.'
      }
    }
  }
}

export const VersionComparisonStory: Story = {
  render: () => (
    <VersionComparison
      title="Design System Evolution: v1.0 vs v2.0"
      leftTitle="v1.0 (Legacy)"
      rightTitle="v2.0 (Current)"
      leftContent={
        <VersionMetadata 
          versionInfo={v1VersionInfo} 
          compact={true}
          showBreakingChanges={false}
          showPerformance={false}
          showAccessibility={false}
          showCompatibility={false}
        />
      }
      rightContent={
        <VersionMetadata 
          versionInfo={v2VersionInfo} 
          compact={true}
          showBreakingChanges={false}
          showPerformance={false}
          showAccessibility={false}
          showCompatibility={false}
        />
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of version metadata to understand the evolution between versions.'
      }
    }
  }
}

export const ComprehensiveMigrationGuide: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Version Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <VersionMetadata versionInfo={v1VersionInfo} compact={true} />
        <VersionMetadata versionInfo={v2VersionInfo} compact={true} />
      </div>
      
      {/* Migration Table */}
      <MigrationTable
        title="Complete Migration Guide"
        description="Step-by-step guide for migrating from v1.0 to v2.0"
        migrations={migrationData}
        groupByCategory={true}
      />
      
      {/* Breaking Changes Detail */}
      <VersionMetadata 
        versionInfo={v2VersionInfo}
        showBreakingChanges={true}
        showPerformance={false}
        showAccessibility={false}
        showCompatibility={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete migration workflow combining version metadata, migration tables, and breaking change details.'
      }
    }
  }
}

export const AccessibilityFocusedView: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Accessibility Improvements in v2.0</h2>
        <p className="text-blue-700">
          This version significantly improves accessibility compliance and includes comprehensive WCAG AA support.
        </p>
      </div>
      
      <VersionMetadata 
        versionInfo={v2VersionInfo}
        showBreakingChanges={false}
        showPerformance={false}
        showAccessibility={true}
        showCompatibility={false}
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">v1.0 Accessibility</h3>
          <VersionMetadata 
            versionInfo={v1VersionInfo}
            showBreakingChanges={false}
            showPerformance={false}
            showAccessibility={true}
            showCompatibility={false}
            compact={false}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-3">v2.0 Accessibility</h3>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">WCAG AA Compliant</span>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• All color combinations meet contrast standards</li>
              <li>• High contrast mode support added</li>
              <li>• Improved screen reader compatibility</li>
              <li>• Better focus indicators throughout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Focused view on accessibility improvements between versions, highlighting compliance and enhancements.'
      }
    }
  }
}

export const PerformanceMetrics: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-900 mb-2">Performance Improvements in v2.0</h2>
        <p className="text-green-700">
          Optimized token structure and reduced bundle size while maintaining full functionality.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">v1.0 Performance</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="space-y-2 text-sm">
              <div>Bundle Size: <span className="font-mono">14KB</span></div>
              <div>Load Time: <span className="font-mono">&lt; 60ms</span></div>
              <div>Token Count: <span className="font-mono">15</span></div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">v2.0 Performance</h3>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="space-y-2 text-sm">
              <div>Bundle Size: <span className="font-mono text-green-700">12KB (-15%)</span></div>
              <div>Load Time: <span className="font-mono text-green-700">&lt; 50ms (-17%)</span></div>
              <div>Token Count: <span className="font-mono">20 (+33%)</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="text-xs text-green-700">
                ✓ Better tree-shaking support<br/>
                ✓ Optimized CSS variable names<br/>
                ✓ Removed unused legacy tokens
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Performance comparison between versions showing bundle size, load time, and optimization improvements.'
      }
    }
  }
}