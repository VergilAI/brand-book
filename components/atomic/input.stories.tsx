import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'
import { InputDemo } from './input-demo'
import { InputComparison } from './input-comparison'

const meta = {
  title: 'Atomic/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
      description: 'Shows error state styling',
    },
    success: {
      control: 'boolean',
      description: 'Shows success state styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here...',
  },
}

export const WithValue: Story = {
  args: {
    value: 'Hello, world!',
    onChange: () => {},
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Enter email...',
    error: true,
    value: 'invalid-email',
    onChange: () => {},
  },
}

export const Success: Story = {
  args: {
    placeholder: 'Enter email...',
    success: true,
    value: 'valid@email.com',
    onChange: () => {},
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'This input is disabled',
    disabled: true,
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number...',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'your@email.com',
  },
}

export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-spacing-md">
      <div>
        <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
          Email Address
        </label>
        <Input type="email" placeholder="your@email.com" />
      </div>
      <div>
        <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
          Password
        </label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div>
        <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
          Confirm Password
        </label>
        <Input type="password" placeholder="Confirm password..." />
      </div>
    </div>
  ),
}

export const ValidationStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-spacing-md">
      <div>
        <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
          Default State
        </label>
        <Input placeholder="Normal input..." />
      </div>
      <div>
        <label className="text-sm font-medium text-text-error mb-spacing-xs block">
          Error State
        </label>
        <Input 
          error 
          value="Invalid input" 
          onChange={() => {}}
        />
        <p className="text-sm text-text-error mt-spacing-xs">
          This field contains an error
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-text-success mb-spacing-xs block">
          Success State
        </label>
        <Input 
          success 
          value="Valid input" 
          onChange={() => {}}
        />
        <p className="text-sm text-text-success mt-spacing-xs">
          Looks good!
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-text-disabled mb-spacing-xs block">
          Disabled State
        </label>
        <Input disabled placeholder="Disabled input..." />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-[400px] space-y-spacing-lg">
      <div>
        <p className="text-sm font-medium text-text-secondary mb-spacing-sm">
          Standard Size (48px height)
        </p>
        <Input placeholder="Standard input with 48px height..." />
        <p className="text-xs text-text-tertiary mt-spacing-xs">
          Optimized for touch targets and accessibility
        </p>
      </div>
    </div>
  ),
}

export const MobileOptimized: Story = {
  render: () => (
    <div className="w-[350px] space-y-spacing-md">
      <div className="text-center mb-spacing-lg">
        <h3 className="text-lg font-semibold text-text-primary">Mobile-Optimized Input</h3>
        <p className="text-sm text-text-secondary mt-spacing-xs">
          16px font size prevents zoom on mobile devices
        </p>
      </div>
      <Input 
        type="email" 
        placeholder="Enter your email..."
        className="w-full"
      />
      <Input 
        type="tel" 
        placeholder="Phone number..."
        className="w-full"
      />
      <p className="text-xs text-text-tertiary text-center">
        48px height provides comfortable touch targets
      </p>
    </div>
  ),
}

export const InteractiveDemo: Story = {
  render: () => <InputDemo />,
  parameters: {
    layout: 'fullscreen',
  },
}

export const Comparison: Story = {
  render: () => <InputComparison />,
  parameters: {
    layout: 'fullscreen',
  },
}

// Desktop viewport example
export const DesktopViewport: Story = {
  render: () => (
    <div className="w-[400px] space-y-spacing-md p-spacing-lg bg-bg-surface rounded-lg">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Desktop Input Size</h3>
      <Input placeholder="Desktop optimized input (48px height)..." />
      <p className="text-xs text-text-secondary">
        Compact 48px height ideal for desktop forms
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Input as it appears on desktop with optimized sizing',
      },
    },
  },
}

// Mobile viewport example
export const MobileViewport: Story = {
  render: () => (
    <div className="w-full max-w-[350px] space-y-spacing-md p-spacing-lg bg-bg-surface rounded-lg">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Mobile Input Size</h3>
      <Input placeholder="Mobile optimized input..." />
      <p className="text-xs text-text-secondary">
        16px font prevents zoom, 48px height for easy touch
      </p>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Input as it appears on mobile with touch-friendly sizing',
      },
    },
  },
}

// Responsive comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-spacing-xl max-w-[800px]">
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Desktop Optimization</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="grid gap-spacing-md max-w-[400px]">
            <div>
              <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
                Standard Input (48px)
              </label>
              <Input placeholder="Perfect for desktop forms..." />
            </div>
            <div className="text-xs text-text-secondary space-y-1">
              <p>• 48px height for comfortable interaction</p>
              <p>• 16px font size for readability</p>
              <p>• Optimized padding for desktop use</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Mobile Optimization</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="grid gap-spacing-md max-w-[350px]">
            <div>
              <label className="text-sm font-medium text-text-primary mb-spacing-xs block">
                Touch-Friendly Input
              </label>
              <Input placeholder="Optimized for mobile..." />
            </div>
            <div className="text-xs text-text-secondary space-y-1">
              <p>• 48px height meets touch target guidelines</p>
              <p>• 16px font prevents mobile zoom</p>
              <p>• Generous padding for finger taps</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Form Layout Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-lg">
          <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-md">Desktop Form</h4>
            <div className="space-y-spacing-sm">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
              <Input type="email" placeholder="Email address" />
            </div>
          </div>
          
          <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-md">Mobile Form</h4>
            <div className="space-y-spacing-md">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
              <Input type="email" placeholder="Email address" />
            </div>
            <p className="text-xs text-text-tertiary mt-spacing-sm">
              Note: Same inputs with adjusted spacing
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive comparison of input sizing and layout across different viewports',
      },
    },
  },
}