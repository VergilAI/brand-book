import type { Meta, StoryObj } from '@storybook/react'
import { TokenBrowser } from '../components/storybook/TokenBrowser'

const meta = {
  title: 'Storybook Integration/Token Browser',
  component: TokenBrowser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive token browser with search, filtering, live preview, and code generation capabilities. This represents the ultimate Storybook integration for design token management.'
      }
    }
  },
} satisfies Meta<typeof TokenBrowser>

export default meta
type Story = StoryObj<typeof meta>

export const FullFeatured: Story = {
  args: {
    title: 'Vergil Design Token Browser',
    description: 'Comprehensive design token explorer with advanced filtering, live preview, and code generation',
    showLiveEditor: true,
    showCodeGeneration: true,
    showUsageExamples: true,
    enableHotReload: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete token browser with all features enabled. Try searching, filtering by category or tags, switching view modes, and generating code.'
      }
    }
  }
}

export const SimpleViewer: Story = {
  args: {
    title: 'Simple Token Viewer',
    description: 'Basic token viewing without advanced features',
    showLiveEditor: false,
    showCodeGeneration: false,
    showUsageExamples: false,
    enableHotReload: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified version for basic token viewing and documentation.'
      }
    }
  }
}

export const CodeGenerationFocus: Story = {
  args: {
    title: 'Token Code Generator',
    description: 'Generate CSS variables and export tokens as JSON',
    showLiveEditor: false,
    showCodeGeneration: true,
    showUsageExamples: false,
    enableHotReload: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused on code generation and export functionality. Select tokens to generate CSS or export as JSON.'
      }
    }
  }
}

export const LivePreviewDemo: Story = {
  args: {
    title: 'Live Token Preview',
    description: 'See tokens in action with live preview mode',
    showLiveEditor: true,
    showCodeGeneration: false,
    showUsageExamples: true,
    enableHotReload: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates live preview functionality. Switch to preview mode to see tokens applied to real UI components.'
      }
    }
  }
}