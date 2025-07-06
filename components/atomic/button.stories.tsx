import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Atomic/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'The visual style of the button',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'The size of the button (sm: 32px desktop/40px mobile, md: 36px desktop/48px mobile, lg: 40px desktop/56px mobile)',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as child element',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Primary button - default
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

// Secondary button
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

// Ghost button
export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

// Small size
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

// Large size
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

// Icon button
export const Icon: Story = {
  args: {
    size: 'icon',
    children: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

// With icon on left
export const WithIconLeft: Story = {
  args: {
    children: (
      <>
        <svg className="mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upload Image
      </>
    ),
  },
}

// With icon on right
export const WithIconRight: Story = {
  args: {
    variant: 'secondary',
    children: (
      <>
        Continue
        <svg className="ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    ),
  },
}

// Full width button
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    className: 'w-full',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

// Button group example
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="ghost">Cancel</Button>
      <Button variant="secondary">Save as Draft</Button>
      <Button>Publish</Button>
    </div>
  ),
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
        <div className="flex gap-4 items-center">
          <Button size="sm">Small (32px)</Button>
          <Button size="md">Medium (36px)</Button>
          <Button size="lg">Large (40px)</Button>
          <Button size="icon">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">States</h3>
        <div className="flex gap-4 items-center">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
}

// Desktop-optimized buttons
export const DesktopOptimized: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Modern desktop button sizes like Slack, VS Code, and GitHub:</p>
      <div className="flex gap-4 items-center">
        <Button size="sm">Small (32px)</Button>
        <Button size="md">Medium (36px)</Button>
        <Button size="lg">Large (40px)</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Desktop-optimized button sizes matching modern desktop applications',
      },
    },
  },
}

// Desktop viewport example
export const DesktopViewport: Story = {
  args: {
    children: 'Desktop Button',
    size: 'md',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Button as it appears on desktop (36px height for medium size)',
      },
    },
  },
}

// Mobile viewport example
export const MobileViewport: Story = {
  args: {
    children: 'Mobile Button',
    size: 'md',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Button as it appears on mobile (48px height for medium size)',
      },
    },
  },
}

// Responsive comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Desktop Sizes</h3>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Small (32px):</span>
              <Button size="sm">Small</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Medium (36px):</span>
              <Button size="md">Medium</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="ghost" size="md">Ghost</Button>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Large (40px):</span>
              <Button size="lg">Large</Button>
              <Button variant="secondary" size="lg">Secondary</Button>
              <Button variant="ghost" size="lg">Ghost</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Mobile Sizes</h3>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-3">
            <p className="text-xs text-gray-600 mb-3">On mobile devices (max-width: 640px), buttons automatically scale up for better touch targets</p>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Small (40px):</span>
              <Button size="sm">Small</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Medium (48px):</span>
              <Button size="md">Medium</Button>
              <Button variant="secondary" size="md">Secondary</Button>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-600 w-20">Large (56px):</span>
              <Button size="lg">Large</Button>
              <Button variant="secondary" size="lg">Secondary</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Icon Buttons</h3>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex gap-4 items-center">
            <div>
              <p className="text-xs text-gray-600 mb-2">Desktop (36px)</p>
              <Button size="icon">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Mobile (48px)</p>
              <Button size="icon">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of button sizes across desktop and mobile viewports',
      },
    },
  },
}