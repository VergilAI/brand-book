import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox, CheckboxWithLabel, AnimatedCheckbox } from './checkbox'

const meta = {
  title: 'Atomic/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The controlled checked state of the checkbox',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The uncontrolled default checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Basic checkbox
export const Default: Story = {
  args: {},
}

// Checked state
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
}

// Disabled states
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-md">
      <div className="flex items-center gap-spacing-md">
        <Checkbox disabled />
        <span className="text-text-secondary">Unchecked disabled</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <Checkbox disabled defaultChecked />
        <span className="text-text-secondary">Checked disabled</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <Checkbox disabled indeterminate />
        <span className="text-text-secondary">Indeterminate disabled</span>
      </div>
    </div>
  ),
}

// Controlled checkbox example
export const Controlled: Story = {
  render: () => {
    const ControlledExample = () => {
      const [checked, setChecked] = useState(false)
      
      return (
        <div className="flex flex-col gap-spacing-md">
          <div className="flex items-center gap-spacing-md">
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
            />
            <span className="text-text-primary">
              Controlled checkbox (checked: {checked ? 'true' : 'false'})
            </span>
          </div>
          <button
            onClick={() => setChecked(!checked)}
            className="px-spacing-md py-spacing-sm bg-bg-brand text-text-inverse rounded-md hover:bg-bg-brandEmphasis transition-colors duration-normal"
          >
            Toggle checkbox
          </button>
        </div>
      )
    }
    
    return <ControlledExample />
  },
}

// Checkbox with label
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-lg">
      <CheckboxWithLabel
        label="Accept terms and conditions"
      />
      <CheckboxWithLabel
        label="Subscribe to newsletter"
        description="Get weekly updates about new courses and features"
      />
      <CheckboxWithLabel
        label="Enable notifications"
        description="We'll send you important updates about your learning progress"
        defaultChecked
      />
    </div>
  ),
}

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-lg">
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox size="small" defaultChecked />
        <span className="text-text-secondary">Small (20px with 40px click target)</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox size="default" defaultChecked />
        <span className="text-text-secondary">Default (24px with 44px click target)</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox size="large" defaultChecked />
        <span className="text-text-secondary">Large (32px with 56px click target)</span>
      </div>
    </div>
  ),
}

// Style variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-lg">
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox variant="default" defaultChecked />
        <span className="text-text-secondary">Default variant</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox variant="brand" defaultChecked />
        <span className="text-text-secondary">Brand variant</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox variant="success" defaultChecked />
        <span className="text-text-secondary">Success variant</span>
      </div>
      <div className="flex items-center gap-spacing-md">
        <AnimatedCheckbox variant="error" defaultChecked />
        <span className="text-text-secondary">Error variant</span>
      </div>
    </div>
  ),
}

// Form example
export const FormExample: Story = {
  render: () => {
    const FormExample = () => {
      const [formData, setFormData] = useState({
        terms: false,
        newsletter: false,
        notifications: true,
      })
      
      return (
        <div className="w-96 space-y-spacing-lg">
          <h3 className="text-xl font-semibold text-text-primary">Account Settings</h3>
          
          <div className="space-y-spacing-md">
            <CheckboxWithLabel
              label="Accept terms and conditions"
              description="You must accept our terms to continue"
              checked={formData.terms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, terms: checked as boolean }))
              }
            />
            
            <CheckboxWithLabel
              label="Subscribe to newsletter"
              description="Receive updates about new courses and features"
              checked={formData.newsletter}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, newsletter: checked as boolean }))
              }
            />
            
            <CheckboxWithLabel
              label="Enable notifications"
              description="Get notified about your learning progress"
              checked={formData.notifications}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, notifications: checked as boolean }))
              }
            />
          </div>
          
          <div className="pt-spacing-md border-t border-border-subtle">
            <p className="text-sm text-text-secondary">
              Form data: {JSON.stringify(formData, null, 2)}
            </p>
          </div>
        </div>
      )
    }
    
    return <FormExample />
  },
}

// Accessibility demo
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-spacing-lg p-spacing-lg bg-bg-secondary rounded-lg max-w-md">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          Accessibility Features
        </h3>
        <ul className="space-y-spacing-xs text-text-secondary">
          <li>• Minimum 24px checkbox size for visibility</li>
          <li>• 44px+ click target for easy interaction</li>
          <li>• Clear focus ring (ring-2 ring-border-focus)</li>
          <li>• Keyboard navigation support</li>
          <li>• Screen reader friendly with proper ARIA attributes</li>
          <li>• High contrast checked/unchecked states</li>
        </ul>
      </div>
      
      <div className="space-y-spacing-md">
        <p className="text-sm text-text-secondary">Try tabbing through these checkboxes:</p>
        <CheckboxWithLabel label="First option" />
        <CheckboxWithLabel label="Second option" defaultChecked />
        <CheckboxWithLabel label="Third option" indeterminate />
      </div>
    </div>
  ),
}

// Click target visualization
export const ClickTargetDemo: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <p className="text-text-secondary max-w-md">
        The checkboxes have generous click targets that extend beyond their visual boundaries. 
        Try clicking anywhere in the highlighted areas:
      </p>
      
      <div className="flex gap-spacing-xl">
        <div className="relative">
          <div className="absolute -inset-2.5 bg-bg-brandLight rounded-md opacity-50" />
          <Checkbox />
          <p className="text-xs text-text-secondary mt-spacing-md">Default (44px)</p>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-2 bg-bg-brandLight rounded-md opacity-50" />
          <AnimatedCheckbox size="small" />
          <p className="text-xs text-text-secondary mt-spacing-md">Small (40px)</p>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-3 bg-bg-brandLight rounded-md opacity-50" />
          <AnimatedCheckbox size="large" />
          <p className="text-xs text-text-secondary mt-spacing-md">Large (56px)</p>
        </div>
      </div>
    </div>
  ),
}

// Desktop optimized small checkbox
export const SmallDesktop: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <AnimatedCheckbox size="small" defaultChecked />
      <p className="text-sm text-text-secondary">
        Desktop-optimized checkbox (20px visual, 40px click target)
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact checkbox ideal for desktop interfaces with data-dense layouts',
      },
    },
  },
}

// Desktop viewport example
export const DesktopViewport: Story = {
  render: () => (
    <div className="space-y-spacing-md p-spacing-lg bg-bg-secondary rounded-lg">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Desktop Checkbox Size</h3>
      <div className="space-y-spacing-sm">
        <CheckboxWithLabel label="Option 1" />
        <CheckboxWithLabel label="Option 2" defaultChecked />
        <CheckboxWithLabel label="Option 3" />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Checkbox as it appears on desktop with default sizing',
      },
    },
  },
}

// Mobile viewport example
export const MobileViewport: Story = {
  render: () => (
    <div className="space-y-spacing-md p-spacing-lg bg-bg-secondary rounded-lg">
      <h3 className="text-sm font-medium text-text-primary mb-spacing-sm">Mobile Checkbox Size</h3>
      <div className="space-y-spacing-sm">
        <CheckboxWithLabel label="Option 1" />
        <CheckboxWithLabel label="Option 2" defaultChecked />
        <CheckboxWithLabel label="Option 3" />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Checkbox as it appears on mobile - note the larger click target for easier interaction',
      },
    },
  },
}

// Responsive comparison
export const ResponsiveComparison: Story = {
  render: () => (
    <div className="space-y-spacing-xl">
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Desktop Size Comparison</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-lg">
            <div className="flex items-center gap-spacing-lg">
              <AnimatedCheckbox size="small" defaultChecked />
              <div>
                <p className="text-sm font-medium text-text-primary">Small (Desktop Optimized)</p>
                <p className="text-xs text-text-secondary">20px checkbox, 40px click target - Perfect for desktop</p>
              </div>
            </div>
            
            <div className="flex items-center gap-spacing-lg">
              <AnimatedCheckbox size="default" defaultChecked />
              <div>
                <p className="text-sm font-medium text-text-primary">Default</p>
                <p className="text-xs text-text-secondary">24px checkbox, 44px click target - Balanced for all devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Mobile Size Comparison</h3>
        <div className="p-spacing-lg border border-border-subtle rounded-lg bg-bg-surface">
          <div className="space-y-spacing-lg">
            <div className="flex items-center gap-spacing-lg">
              <AnimatedCheckbox size="default" defaultChecked />
              <div>
                <p className="text-sm font-medium text-text-primary">Default (Mobile Friendly)</p>
                <p className="text-xs text-text-secondary">24px checkbox, 44px click target - Good for mobile</p>
              </div>
            </div>
            
            <div className="flex items-center gap-spacing-lg">
              <AnimatedCheckbox size="large" defaultChecked />
              <div>
                <p className="text-sm font-medium text-text-primary">Large (Mobile Optimized)</p>
                <p className="text-xs text-text-secondary">32px checkbox, 56px click target - Ideal for mobile touch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-spacing-md">
        <h3 className="text-sm font-medium text-text-primary">Usage Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-xs">Desktop</h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Use "small" size for data tables</li>
              <li>• Use "default" for forms</li>
              <li>• Smaller click targets acceptable</li>
            </ul>
          </div>
          
          <div className="p-spacing-md border border-border-subtle rounded-lg bg-bg-secondary">
            <h4 className="text-sm font-medium text-text-primary mb-spacing-xs">Mobile</h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Use "default" size minimum</li>
              <li>• Use "large" for primary actions</li>
              <li>• Ensure 44px+ click targets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of checkbox sizes and recommendations for desktop vs mobile usage',
      },
    },
  },
}