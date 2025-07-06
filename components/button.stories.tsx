import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { ArrowRight, Download, Loader2 } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Core button component used throughout Vergil products. Supports multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'primary | secondary | ghost' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Button size (sm: 32px desktop/40px mobile, md: 36px desktop/48px mobile, lg: 40px desktop/56px mobile)',
      table: {
        type: { summary: 'sm | md | lg | icon' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Download">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="secondary">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary" aria-label="Download">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
      <Button variant="secondary" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing
      </Button>
      <Button variant="secondary" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Primary</Button>
      <Button variant="secondary" disabled>Disabled Secondary</Button>
      <Button variant="ghost" disabled>Disabled Ghost</Button>
    </div>
  ),
};

export const AsChildExample: Story = {
  render: () => (
    <Button asChild variant="secondary">
      <a href="https://vergil.ai" target="_blank" rel="noopener noreferrer">
        Visit Vergil.ai
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button rendered as an anchor element using the asChild prop.',
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="inline-flex rounded-lg shadow-sm" role="group">
      <Button variant="secondary" className="rounded-r-none">
        Previous
      </Button>
      <Button variant="secondary" className="rounded-none border-l-0">
        Current
      </Button>
      <Button variant="secondary" className="rounded-l-none border-l-0">
        Next
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons grouped together for related actions.',
      },
    },
  },
};

export const DesktopSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Desktop Button Sizes (matching modern apps like Slack, VS Code, GitHub)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 w-24">Small (32px):</span>
            <Button size="sm">Small Button</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 w-24">Medium (36px):</span>
            <Button size="md">Medium Button</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="ghost" size="md">Ghost</Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 w-24">Large (40px):</span>
            <Button size="lg">Large Button</Button>
            <Button variant="secondary" size="lg">Secondary</Button>
            <Button variant="ghost" size="lg">Ghost</Button>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Icon Buttons</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600 w-24">Icon (36px):</span>
          <Button size="icon" aria-label="Add">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
          <Button variant="secondary" size="icon" aria-label="Settings">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modern desktop-optimized button sizes. On mobile viewports, these automatically scale up for better touch targets.',
      },
    },
  },
};