import type { Meta, StoryObj } from '@storybook/react'
import { useGlobals } from 'storybook/preview-api'
import { TokenGrid, TokenSwatch, MigrationTable, VersionComparison } from '../../components/storybook'
import type { MigrationItem } from '../../components/storybook'

const meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color tokens across different versions of the Vergil Design System. Use the version switcher in the toolbar to see different token sets.'
      }
    }
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Version 1 Color Tokens (Legacy)
const v1ColorTokens = [
  {
    name: 'cosmic-purple',
    value: '#6366F1',
    cssVar: '--cosmic-purple',
    usage: 'Primary brand color (deprecated)',
    category: 'brand' as const,
    deprecated: true,
    examples: ['Legacy buttons', 'Old brand elements'],
    rules: ['DEPRECATED - Use vergil-purple instead', 'Only for backward compatibility']
  },
  {
    name: 'deep-space',
    value: '#0F172A',
    cssVar: '--deep-space',
    usage: 'Dark background color',
    category: 'neutral' as const,
    examples: ['Dark mode backgrounds', 'Night theme'],
    rules: ['Primary dark background', 'Good contrast with light text']
  },
  {
    name: 'pure-light',
    value: '#FFFFFF',
    cssVar: '--pure-light',
    usage: 'Pure white background',
    category: 'neutral' as const,
    examples: ['Light backgrounds', 'Cards', 'Modals'],
    rules: ['Use for main backgrounds', 'Ensure proper text contrast']
  }
]

// Version 2 Color Tokens (Current)
const v2ColorTokens = [
  // Brand Colors
  {
    name: 'vergil-purple',
    value: '#7B00FF',
    cssVar: '--vergil-purple',
    usage: 'Primary brand purple',
    category: 'brand' as const,
    examples: ['Primary buttons', 'Brand elements', 'Active states'],
    rules: ['Primary brand identity', 'CTA buttons', 'Interactive elements']
  },
  {
    name: 'vergil-purple-light',
    value: '#9933FF',
    cssVar: '--vergil-purple-light',
    usage: 'Light purple for hover states',
    category: 'brand' as const,
    examples: ['Button hover', 'Link hover', 'Focus states'],
    rules: ['Hover states for primary elements', 'Interactive feedback']
  },
  {
    name: 'vergil-purple-lighter',
    value: '#BB66FF',
    cssVar: '--vergil-purple-lighter',
    usage: 'Lighter purple for dark themes',
    category: 'brand' as const,
    examples: ['Dark mode buttons', 'Dark theme text'],
    rules: ['Primary color on dark backgrounds', 'Dark theme elements']
  },
  {
    name: 'vergil-purple-lightest',
    value: '#D199FF',
    cssVar: '--vergil-purple-lightest',
    usage: 'Lightest purple for subtle accents',
    category: 'brand' as const,
    examples: ['Dark mode secondary text', 'Subtle borders'],
    rules: ['Secondary text on dark', 'Disabled states on dark']
  },

  // Neutral Colors
  {
    name: 'vergil-full-black',
    value: '#000000',
    cssVar: '--vergil-full-black',
    usage: 'Full black - backgrounds only',
    category: 'neutral' as const,
    examples: ['Dark mode backgrounds', 'Hero sections'],
    rules: ['Use exclusively for backgrounds', 'Never use for text', 'Creates maximum contrast']
  },
  {
    name: 'vergil-off-black',
    value: '#1D1D1F',
    cssVar: '--vergil-off-black',
    usage: 'Off-black - primary text color',
    category: 'neutral' as const,
    examples: ['Body text', 'Headlines', 'Navigation text'],
    rules: ['Primary text on light backgrounds', 'Never use on dark backgrounds']
  },
  {
    name: 'vergil-full-white',
    value: '#FFFFFF',
    cssVar: '--vergil-full-white',
    usage: 'Full white - backgrounds only',
    category: 'neutral' as const,
    examples: ['Page backgrounds', 'Modal backgrounds', 'Card backgrounds'],
    rules: ['Use exclusively for backgrounds', 'Never use for text']
  },
  {
    name: 'vergil-off-white',
    value: '#F5F5F7',
    cssVar: '--vergil-off-white',
    usage: 'Off-white - text on dark, soft containers',
    category: 'neutral' as const,
    examples: ['Text on dark', 'Section backgrounds'],
    rules: ['Text on dark backgrounds', 'Soft background sections']
  },

  // Attention Colors
  {
    name: 'vergil-emphasis-bg',
    value: '#F0F0F2',
    cssVar: '--vergil-emphasis-bg',
    usage: 'Temporary headers needing attention',
    category: 'attention' as const,
    examples: ['Region selection headers', 'Cookie consent', 'System notifications'],
    rules: ['Temporary UI elements', 'Must be separated from off-white by white']
  },
  {
    name: 'vergil-emphasis-text',
    value: '#303030',
    cssVar: '--vergil-emphasis-text',
    usage: 'Text directly on emphasis-bg',
    category: 'attention' as const,
    examples: ['Header descriptions', 'Notification text', 'Banner content'],
    rules: ['Use for text directly on emphasis-bg', 'Not for interactive elements']
  },

  // Functional Colors
  {
    name: 'vergil-success',
    value: '#0F8A0F',
    cssVar: '--vergil-success',
    usage: 'Success states and positive feedback',
    category: 'functional' as const,
    examples: ['Success alerts', 'Valid inputs', 'Progress complete'],
    rules: ['Success messages only', 'Positive actions completed']
  },
  {
    name: 'vergil-error',
    value: '#E51C23',
    cssVar: '--vergil-error',
    usage: 'Error states and critical alerts',
    category: 'functional' as const,
    examples: ['Error messages', 'Invalid inputs', 'Delete buttons'],
    rules: ['Error messages only', 'Destructive actions', 'Critical alerts']
  },
  {
    name: 'vergil-warning',
    value: '#FFC700',
    cssVar: '--vergil-warning',
    usage: 'Warning states and cautions',
    category: 'functional' as const,
    examples: ['Warning alerts', 'Caution icons', 'Important tips'],
    rules: ['Warning messages only', 'Caution indicators']
  },
  {
    name: 'vergil-info',
    value: '#0087FF',
    cssVar: '--vergil-info',
    usage: 'Informational states and notices',
    category: 'functional' as const,
    examples: ['Info alerts', 'Tooltips', 'Help text'],
    rules: ['Info messages only', 'Neutral system feedback']
  }
]

// Migration mapping
const colorMigrations: MigrationItem[] = [
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
    notes: 'Replaced with more vibrant purple that better represents the Vergil brand identity',
    migrationGuide: 'Replace all instances of cosmic-purple with vergil-purple'
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
    status: 'replaced',
    category: 'neutral',
    notes: 'Replaced with true black for better OLED support and more dramatic contrast',
    migrationGuide: 'Replace deep-space with vergil-full-black for backgrounds'
  },
  {
    oldToken: {
      name: 'pure-light',
      value: '#FFFFFF',
      cssVar: '--pure-light'
    },
    newToken: {
      name: 'vergil-full-white',
      value: '#FFFFFF',
      cssVar: '--vergil-full-white'
    },
    status: 'unchanged',
    category: 'neutral',
    notes: 'Renamed for consistency but value remains the same',
    migrationGuide: 'Replace pure-light with vergil-full-white'
  },
  {
    oldToken: {
      name: 'vergil-purple-light',
      value: '#9933FF',
      cssVar: '--vergil-purple-light'
    },
    status: 'new',
    category: 'brand',
    notes: 'New hover state color for better interactive feedback'
  },
  {
    oldToken: {
      name: 'vergil-emphasis-bg',
      value: '#F0F0F2',
      cssVar: '--vergil-emphasis-bg'
    },
    status: 'new',
    category: 'attention',
    notes: 'New Apple-inspired attention hierarchy system'
  }
]

// Version-aware story component
const VersionAwareColorTokens = () => {
  const [globals] = useGlobals()
  const currentVersion = globals.version || 'v2'
  
  const tokens = currentVersion === 'v1' ? v1ColorTokens : v2ColorTokens
  
  return (
    <div className="space-y-8">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Currently Viewing: {currentVersion === 'v1' ? 'Version 1.0 (Legacy)' : 'Version 2.0 (Current)'}
        </h3>
        <p className="text-sm text-blue-700">
          {currentVersion === 'v1' 
            ? 'This is the legacy color system. Many tokens are deprecated.' 
            : 'This is the current Apple-inspired color system with sophisticated attention hierarchy.'
          }
        </p>
      </div>
      
      <TokenGrid
        title={`${currentVersion === 'v1' ? 'Legacy' : 'Current'} Color Tokens`}
        description={`Color tokens for ${currentVersion === 'v1' ? 'Version 1.0' : 'Version 2.0'} of the Vergil Design System`}
        tokens={tokens}
        columns={3}
        showSearch={true}
        showFilter={true}
      />
    </div>
  )
}

export const VersionAwareTokens: Story = {
  render: VersionAwareColorTokens,
  parameters: {
    docs: {
      description: {
        story: 'This story automatically updates based on the version selected in the toolbar. Switch between v1 and v2 to see the evolution of our color system.'
      }
    }
  }
}

export const ComparisonView: Story = {
  render: () => (
    <VersionComparison
      title="Color System Evolution: V1 vs V2"
      leftTitle="Version 1.0 (Legacy)"
      rightTitle="Version 2.0 (Current)"
      leftContent={
        <div className="space-y-4">
          <TokenSwatch
            name="cosmic-purple"
            value="#6366F1"
            cssVar="--cosmic-purple"
            usage="Primary brand color (deprecated)"
            deprecated={true}
            size="medium"
          />
          <TokenSwatch
            name="deep-space"
            value="#0F172A"
            cssVar="--deep-space"
            usage="Dark background color"
            size="medium"
          />
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <TokenSwatch
            name="vergil-purple"
            value="#7B00FF"
            cssVar="--vergil-purple"
            usage="Primary brand purple"
            size="medium"
          />
          <TokenSwatch
            name="vergil-full-black"
            value="#000000"
            cssVar="--vergil-full-black"
            usage="Full black - backgrounds only"
            size="medium"
          />
        </div>
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of color tokens between versions. Use the overlay mode to quickly switch between versions.'
      }
    }
  }
}

export const MigrationGuide: Story = {
  render: () => (
    <MigrationTable
      title="Color Token Migration Guide"
      description="Complete guide for migrating from Version 1.0 to Version 2.0 color tokens"
      migrations={colorMigrations}
      groupByCategory={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive migration guide showing how color tokens have changed between versions, including replacement mappings and migration instructions.'
      }
    }
  }
}

export const AllColorTokens: Story = {
  render: () => (
    <div className="space-y-12">
      <TokenGrid
        title="Version 2.0 - Current Color System"
        description="Complete set of color tokens in the current design system"
        tokens={v2ColorTokens}
        columns={4}
        showSearch={true}
        showFilter={true}
        groupByCategory={true}
      />
      
      <TokenGrid
        title="Version 1.0 - Legacy Color System"
        description="Legacy color tokens (deprecated)"
        tokens={v1ColorTokens}
        columns={3}
        showSearch={false}
        showFilter={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all color tokens across both versions for reference and comparison.'
      }
    }
  }
}