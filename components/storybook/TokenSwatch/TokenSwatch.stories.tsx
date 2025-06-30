import type { Meta, StoryObj } from '@storybook/react'
import { TokenSwatch } from './TokenSwatch'

const meta = {
  title: 'Storybook Components/TokenSwatch',
  component: TokenSwatch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component for displaying design tokens with their values, usage guidelines, and status indicators.'
      }
    }
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['color', 'gradient', 'shadow', 'spacing', 'typography']
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    }
  }
} satisfies Meta<typeof TokenSwatch>

export default meta
type Story = StoryObj<typeof meta>

export const ColorToken: Story = {
  args: {
    name: 'vergil-purple',
    value: '#7B00FF',
    cssVar: '--vergil-purple',
    usage: 'Primary brand purple for buttons and interactive elements',
    category: 'color',
    examples: ['Primary buttons', 'Active states', 'Brand elements'],
    rules: [
      'Use for primary call-to-action buttons',
      'Apply to active navigation states',
      'Maintain proper contrast ratios'
    ],
    size: 'medium'
  }
}

export const DeprecatedToken: Story = {
  args: {
    name: 'cosmic-purple',
    value: '#6366F1',
    cssVar: '--cosmic-purple',
    usage: 'Legacy brand color (deprecated)',
    category: 'color',
    deprecated: true,
    examples: ['Legacy components only'],
    rules: [
      'DEPRECATED - Use vergil-purple instead',
      'Only for backward compatibility',
      'Will be removed in future versions'
    ],
    size: 'medium'
  }
}

export const BreakingChangeToken: Story = {
  args: {
    name: 'vergil-emphasis-bg',
    value: '#F0F0F2',
    cssVar: '--vergil-emphasis-bg',
    usage: 'New attention hierarchy background',
    category: 'color',
    breaking: true,
    examples: ['Cookie banners', 'System notifications', 'Region selectors'],
    rules: [
      'NEW in v2.0 - Breaking change',
      'Use for temporary UI elements',
      'Must be separated from off-white by white'
    ],
    size: 'medium'
  }
}

export const GradientToken: Story = {
  args: {
    name: 'consciousness-gradient',
    value: 'linear-gradient(135deg, #7B00FF, #9933FF, #BB66FF)',
    cssVar: '--consciousness-gradient',
    usage: 'Primary brand gradient for hero sections',
    category: 'gradient',
    examples: ['Hero backgrounds', 'Loading states', 'AI animations'],
    rules: [
      'Use sparingly for maximum impact',
      'Reserve for special AI moments',
      'Ensure text readability over gradient'
    ],
    size: 'large'
  }
}

export const SmallSize: Story = {
  args: {
    name: 'vergil-success',
    value: '#0F8A0F',
    cssVar: '--vergil-success',
    usage: 'Success state color',
    category: 'color',
    size: 'small',
    showCode: false
  }
}

export const LargeSize: Story = {
  args: {
    name: 'vergil-error',
    value: '#E51C23',
    cssVar: '--vergil-error',
    usage: 'Error state and destructive actions',
    category: 'color',
    examples: ['Error messages', 'Delete buttons', 'Critical alerts'],
    rules: [
      'Use only for errors and destructive actions',
      'Ensure sufficient contrast for accessibility',
      'Pair with appropriate iconography'
    ],
    size: 'large'
  }
}

export const WithoutCodeDisplay: Story = {
  args: {
    name: 'vergil-warning',
    value: '#FFC700',
    cssVar: '--vergil-warning',
    usage: 'Warning states and cautions',
    category: 'color',
    showCode: false,
    examples: ['Warning alerts', 'Caution messages']
  }
}

export const MinimalDisplay: Story = {
  args: {
    name: 'vergil-info',
    value: '#0087FF',
    category: 'color',
    size: 'small',
    showCode: false
  }
}