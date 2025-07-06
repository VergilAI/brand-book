import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress'
import React from 'react'

const meta: Meta<typeof Progress> = {
  title: 'Atomic/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  args: {
    value: 50,
    max: 100,
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    value: 60,
  },
}

export const WithLabel: Story = {
  args: {
    value: 75,
    label: 'Upload Progress',
  },
}

export const WithPercentage: Story = {
  args: {
    value: 33,
    showPercentage: true,
  },
}

export const WithLabelAndPercentage: Story = {
  args: {
    value: 66,
    label: 'Course Completion',
    showPercentage: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Small (8px)</h3>
        <Progress size="sm" value={40} showPercentage />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Medium (12px)</h3>
        <Progress size="md" value={60} showPercentage />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Large (16px)</h3>
        <Progress size="lg" value={80} showPercentage />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Default</h3>
        <Progress variant="default" value={70} showPercentage />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Success</h3>
        <Progress variant="success" value={100} label="Completed!" showPercentage />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Warning</h3>
        <Progress variant="warning" value={45} label="Storage Usage" showPercentage />
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-spacing-sm">Error</h3>
        <Progress variant="error" value={90} label="Memory Usage" showPercentage />
      </div>
    </div>
  ),
}

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 10
        })
      }, 500)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="space-y-spacing-md">
        <Progress
          value={progress}
          label="Loading..."
          showPercentage
          variant={progress === 100 ? 'success' : 'default'}
        />
        <button
          onClick={() => setProgress(0)}
          className="px-spacing-md py-spacing-sm bg-primary text-primary rounded-md hover:bg-emphasis transition-colors duration-normal"
        >
          Reset
        </button>
      </div>
    )
  },
}

export const CustomColors: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <Progress
        value={85}
        label="Custom Styled Progress"
        showPercentage
        className="bg-brand/20"
        indicatorClassName="bg-gradient-to-r from-brand to-brand-accent"
      />
    </div>
  ),
}

export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <Progress
        value={65}
        label="Accessible Progress Bar"
        showPercentage
        aria-label="Course progress: 65% complete"
      />
      <p className="text-sm text-secondary">
        This progress bar includes proper ARIA attributes for screen readers.
      </p>
    </div>
  ),
}

// Background color fix demonstration
export const BackgroundColorFix: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div className="p-spacing-lg bg-bg-surface rounded-lg">
        <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Light Background</h3>
        <Progress value={60} label="Progress on light bg" showPercentage />
        <p className="text-xs text-text-secondary mt-spacing-xs">
          Background uses bg-secondary (light gray) for visibility
        </p>
      </div>
      
      <div className="p-spacing-lg bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-spacing-sm">Dark Background</h3>
        <Progress value={60} label="Progress on dark bg" showPercentage />
        <p className="text-xs text-gray-300 mt-spacing-xs">
          Background remains visible on dark surfaces
        </p>
      </div>
      
      <div className="p-spacing-lg bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
        <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Colored Background</h3>
        <Progress value={60} label="Progress on colored bg" showPercentage />
        <p className="text-xs text-text-secondary mt-spacing-xs">
          Consistent visibility across different backgrounds
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the background color fix ensuring progress bars are visible on various backgrounds',
      },
    },
  },
}

// Desktop viewport example
export const DesktopViewport: Story = {
  render: () => (
    <div className="max-w-lg space-y-spacing-lg p-spacing-lg bg-bg-surface rounded-lg">
      <h3 className="text-sm font-medium text-text-primary">Desktop Progress Bars</h3>
      <div className="space-y-spacing-md">
        <Progress size="sm" value={40} label="Small (8px)" showPercentage />
        <Progress size="md" value={60} label="Medium (12px)" showPercentage />
        <Progress size="lg" value={80} label="Large (16px)" showPercentage />
      </div>
      <p className="text-xs text-text-secondary">
        Multiple sizes available for different desktop contexts
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Progress bars optimized for desktop viewing',
      },
    },
  },
}

// Mobile viewport example
export const MobileViewport: Story = {
  render: () => (
    <div className="space-y-spacing-lg p-spacing-lg bg-bg-surface rounded-lg">
      <h3 className="text-sm font-medium text-text-primary">Mobile Progress Bars</h3>
      <div className="space-y-spacing-md">
        <Progress size="md" value={60} label="Course Progress" showPercentage />
        <Progress size="lg" value={80} label="Module Completion" showPercentage />
      </div>
      <p className="text-xs text-text-secondary">
        Larger sizes (md/lg) recommended for better mobile visibility
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Progress bars sized for mobile touch interfaces',
      },
    },
  },
}

// Responsive comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-spacing-xl">
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Desktop Usage</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-lg">
            <div className="space-y-spacing-sm">
              <h4 className="text-sm text-text-secondary">Compact Data View</h4>
              <Progress size="sm" value={75} showPercentage />
              <p className="text-xs text-text-tertiary">Small (8px) - Perfect for data tables and lists</p>
            </div>
            
            <div className="space-y-spacing-sm">
              <h4 className="text-sm text-text-secondary">Standard Forms</h4>
              <Progress size="md" value={50} label="Upload Progress" showPercentage />
              <p className="text-xs text-text-tertiary">Medium (12px) - Balanced for most use cases</p>
            </div>
            
            <div className="space-y-spacing-sm">
              <h4 className="text-sm text-text-secondary">Featured Progress</h4>
              <Progress size="lg" value={90} label="Course Completion" showPercentage variant="success" />
              <p className="text-xs text-text-tertiary">Large (16px) - For primary progress indicators</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Mobile Usage</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-lg">
            <div className="space-y-spacing-sm">
              <h4 className="text-sm text-text-secondary">Minimum Recommended Size</h4>
              <Progress size="md" value={65} label="Lesson Progress" showPercentage />
              <p className="text-xs text-text-tertiary">Medium (12px) - Minimum for good mobile visibility</p>
            </div>
            
            <div className="space-y-spacing-sm">
              <h4 className="text-sm text-text-secondary">Optimal Mobile Size</h4>
              <Progress size="lg" value={80} label="Module Completion" showPercentage variant="success" />
              <p className="text-xs text-text-tertiary">Large (16px) - Best for primary mobile progress indicators</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Real-World Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-lg">
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-md">Course Card</h4>
            <div className="space-y-spacing-sm">
              <div className="flex justify-between text-sm">
                <span>Introduction to React</span>
                <span className="text-text-secondary">75%</span>
              </div>
              <Progress size="sm" value={75} />
            </div>
          </div>
          
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-md">Lesson Viewer</h4>
            <div className="space-y-spacing-sm">
              <Progress size="md" value={45} label="Video Progress" showPercentage />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive comparison of progress bar sizing and usage across desktop and mobile viewports',
      },
    },
  },
}