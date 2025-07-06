import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    size: 'md',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    size: 'md',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-20">Small</span>
        <Switch size="sm" />
        <Switch size="sm" defaultChecked />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-20">Medium</span>
        <Switch size="md" />
        <Switch size="md" defaultChecked />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-20">Large</span>
        <Switch size="lg" />
        <Switch size="lg" defaultChecked />
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <label className="flex items-center gap-3 cursor-pointer">
        <Switch id="airplane-mode" />
        <span className="text-sm font-medium">Airplane Mode</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <Switch id="notifications" defaultChecked />
        <span className="text-sm font-medium">Enable Notifications</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <Switch id="dark-mode" size="lg" />
        <span className="text-sm font-medium">Dark Mode</span>
      </label>
    </div>
  ),
}

export const StateExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">Interactive States</h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Switch size="md" />
            <p className="text-xs mt-2 text-gray-600">Default</p>
          </div>
          <div className="text-center">
            <Switch size="md" defaultChecked />
            <p className="text-xs mt-2 text-gray-600">Checked</p>
          </div>
          <div className="text-center">
            <Switch size="md" disabled />
            <p className="text-xs mt-2 text-gray-600">Disabled</p>
          </div>
          <div className="text-center">
            <Switch size="md" disabled defaultChecked />
            <p className="text-xs mt-2 text-gray-600">Disabled On</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-4">Focus & Hover</h3>
        <p className="text-xs text-gray-600 mb-4">Tab to focus, hover to see effects</p>
        <div className="flex items-center gap-6">
          <Switch size="md" />
          <Switch size="md" defaultChecked />
        </div>
      </div>
    </div>
  ),
}