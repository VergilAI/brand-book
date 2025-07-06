import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from '../input'

const meta = {
  title: 'Atomic/Label',
  component: Label,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
    helpText: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Email Address',
    htmlFor: 'email',
  },
  render: (args) => (
    <div className="w-full max-w-sm space-y-spacing-sm">
      <Label {...args} />
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
}

export const Required: Story = {
  args: {
    children: 'Username',
    htmlFor: 'username',
    required: true,
  },
  render: (args) => (
    <div className="w-full max-w-sm space-y-spacing-sm">
      <Label {...args} />
      <Input id="username" placeholder="Choose a username" />
    </div>
  ),
}

export const WithError: Story = {
  args: {
    children: 'Password',
    htmlFor: 'password',
    required: true,
    error: 'Password must be at least 8 characters',
  },
  render: (args) => (
    <div className="w-full max-w-sm space-y-spacing-sm">
      <Label {...args} />
      <Input 
        id="password" 
        type="password" 
        placeholder="Enter password"
        className="border-error focus:ring-error" 
      />
    </div>
  ),
}

export const WithHelpText: Story = {
  args: {
    children: 'API Key',
    htmlFor: 'api-key',
    helpText: 'You can find your API key in the settings page',
  },
  render: (args) => (
    <div className="w-full max-w-sm space-y-spacing-sm">
      <Label {...args} />
      <Input id="api-key" placeholder="sk-..." />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div className="w-full max-w-sm">
        <Label size="sm" htmlFor="small">Small Label</Label>
        <Input id="small" placeholder="Small input" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label size="md" htmlFor="medium">Medium Label (Default)</Label>
        <Input id="medium" placeholder="Medium input" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label size="lg" htmlFor="large">Large Label</Label>
        <Input id="large" placeholder="Large input" />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div className="w-full max-w-sm">
        <Label variant="default" htmlFor="default">Default Label</Label>
        <Input id="default" placeholder="Default input" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label variant="error" htmlFor="error">Error Label</Label>
        <Input id="error" placeholder="Error input" className="border-error" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label variant="success" htmlFor="success">Success Label</Label>
        <Input id="success" placeholder="Success input" className="border-success" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label variant="warning" htmlFor="warning">Warning Label</Label>
        <Input id="warning" placeholder="Warning input" className="border-warning" />
      </div>
      
      <div className="w-full max-w-sm">
        <Label variant="info" htmlFor="info">Info Label</Label>
        <Input id="info" placeholder="Info input" className="border-info" />
      </div>
    </div>
  ),
}

export const ComplexForm: Story = {
  render: () => (
    <form className="space-y-spacing-md max-w-md">
      <div>
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      
      <div>
        <Label 
          htmlFor="email" 
          required
          helpText="We'll never share your email with anyone else"
        >
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
      
      <div>
        <Label 
          htmlFor="password" 
          required
          error="Password must contain at least one uppercase letter"
        >
          Password
        </Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Enter a secure password"
          className="border-error focus:ring-error"
        />
      </div>
      
      <div>
        <Label 
          htmlFor="bio"
          helpText="Tell us a bit about yourself (optional)"
        >
          Bio
        </Label>
        <textarea 
          id="bio"
          className="w-full h-24 px-spacing-md py-spacing-sm rounded-md border border-default bg-primary text-base placeholder:text-tertiary focus:border-focus focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2 transition-colors duration-fast"
          placeholder="I'm a..."
        />
      </div>
    </form>
  ),
}

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div className="p-spacing-lg bg-secondary rounded-lg">
        <h3 className="text-lg font-semibold mb-spacing-md">Accessibility Features</h3>
        <ul className="list-disc list-inside space-y-spacing-xs text-secondary">
          <li>Labels are properly associated with form controls using htmlFor</li>
          <li>Required fields include aria-label="required" on the asterisk</li>
          <li>Error messages use role="alert" for screen reader announcements</li>
          <li>Semantic HTML structure for better screen reader navigation</li>
          <li>Keyboard navigation fully supported through Radix UI</li>
        </ul>
      </div>
      
      <div className="w-full max-w-sm">
        <Label 
          htmlFor="accessible-input" 
          required
          error="This field is required"
          helpText="This won't show when there's an error"
        >
          Accessible Input Example
        </Label>
        <Input 
          id="accessible-input" 
          placeholder="Try me with a screen reader"
          className="border-error focus:ring-error"
          aria-invalid="true"
          aria-describedby="accessible-input-error"
        />
      </div>
    </div>
  ),
}