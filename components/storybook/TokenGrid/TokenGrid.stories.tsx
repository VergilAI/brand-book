import type { Meta, StoryObj } from '@storybook/react'
import { TokenGrid } from './TokenGrid'

const meta = {
  title: 'Storybook Components/TokenGrid',
  component: TokenGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A grid component for displaying multiple design tokens with search and filtering capabilities.'
      }
    }
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 3, 4, 5, 6]
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large']
    },
    layout: {
      control: 'select',
      options: ['grid', 'list']
    }
  }
} satisfies Meta<typeof TokenGrid>

export default meta
type Story = StoryObj<typeof meta>

const sampleTokens = [
  {
    name: 'vergil-purple',
    value: '#7B00FF',
    cssVar: '--vergil-purple',
    usage: 'Primary brand purple',
    category: 'brand' as const,
    examples: ['Primary buttons', 'Active states'],
    rules: ['Use for primary CTAs', 'Maintain contrast ratios']
  },
  {
    name: 'vergil-purple-light',
    value: '#9933FF',
    cssVar: '--vergil-purple-light',
    usage: 'Light purple for hover states',
    category: 'brand' as const,
    examples: ['Button hover', 'Link hover'],
    rules: ['Hover states only', 'Interactive feedback']
  },
  {
    name: 'vergil-full-black',
    value: '#000000',
    cssVar: '--vergil-full-black',
    usage: 'Full black - backgrounds only',
    category: 'neutral' as const,
    examples: ['Dark mode backgrounds', 'Hero sections'],
    rules: ['Backgrounds only', 'Never for text']
  },
  {
    name: 'vergil-off-black',
    value: '#1D1D1F',
    cssVar: '--vergil-off-black',
    usage: 'Primary text color',
    category: 'neutral' as const,
    examples: ['Body text', 'Headlines'],
    rules: ['Primary text on light', 'Good readability']
  },
  {
    name: 'vergil-success',
    value: '#0F8A0F',
    cssVar: '--vergil-success',
    usage: 'Success states',
    category: 'functional' as const,
    examples: ['Success alerts', 'Valid inputs'],
    rules: ['Success messages only', 'Positive feedback']
  },
  {
    name: 'vergil-error',
    value: '#E51C23',
    cssVar: '--vergil-error',
    usage: 'Error states',
    category: 'functional' as const,
    examples: ['Error messages', 'Delete buttons'],
    rules: ['Errors only', 'Destructive actions']
  },
  {
    name: 'cosmic-purple',
    value: '#6366F1',
    cssVar: '--cosmic-purple',
    usage: 'Legacy brand color',
    category: 'brand' as const,
    deprecated: true,
    examples: ['Legacy components'],
    rules: ['DEPRECATED', 'Use vergil-purple instead']
  },
  {
    name: 'vergil-emphasis-bg',
    value: '#F0F0F2',
    cssVar: '--vergil-emphasis-bg',
    usage: 'Attention background',
    category: 'attention' as const,
    breaking: true,
    examples: ['Cookie banners', 'Notifications'],
    rules: ['NEW in v2.0', 'Temporary UI elements']
  }
]

export const Default: Story = {
  args: {
    title: 'Design Tokens',
    description: 'Complete collection of design tokens in the Vergil Design System',
    tokens: sampleTokens,
    columns: 4,
    size: 'medium',
    showSearch: true,
    showFilter: true
  }
}

export const WithoutSearch: Story = {
  args: {
    title: 'Color Tokens',
    tokens: sampleTokens.filter(token => token.category === 'brand' || token.category === 'neutral'),
    columns: 3,
    showSearch: false,
    showFilter: false
  }
}

export const GridLayout: Story = {
  args: {
    title: 'Brand Colors - Grid View',
    tokens: sampleTokens.filter(token => token.category === 'brand'),
    columns: 3,
    layout: 'grid',
    size: 'large'
  }
}

export const ListLayout: Story = {
  args: {
    title: 'All Tokens - List View',
    tokens: sampleTokens,
    layout: 'list',
    size: 'small'
  }
}

export const TwoColumnGrid: Story = {
  args: {
    title: 'Functional Colors',
    tokens: sampleTokens.filter(token => token.category === 'functional'),
    columns: 2,
    size: 'large'
  }
}

export const SixColumnGrid: Story = {
  args: {
    title: 'All Tokens - Compact View',
    tokens: sampleTokens,
    columns: 6,
    size: 'small',
    showSearch: false
  }
}

export const FilterableByCategory: Story = {
  args: {
    title: 'Filterable Token Collection',
    description: 'Use the filter dropdown to view tokens by category',
    tokens: sampleTokens,
    columns: 4,
    showFilter: true,
    categories: ['brand', 'neutral', 'functional', 'attention']
  }
}

export const SmallTokensGrid: Story = {
  args: {
    title: 'Compact Token Display',
    tokens: sampleTokens,
    columns: 5,
    size: 'small',
    showSearch: true,
    showFilter: true
  }
}

export const EmptyState: Story = {
  args: {
    title: 'No Tokens Found',
    tokens: [],
    columns: 4,
    showSearch: true,
    showFilter: true
  }
}