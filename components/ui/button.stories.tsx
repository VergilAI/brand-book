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
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'default | destructive | outline | secondary | ghost | link' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
      table: {
        type: { summary: 'default | sm | lg | icon' },
        defaultValue: { summary: 'default' },
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
    variant: 'default',
    size: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
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
      <Button size="icon" variant="outline" aria-label="Download">
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
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Default</Button>
      <Button variant="secondary" disabled>Disabled Secondary</Button>
      <Button variant="destructive" disabled>Disabled Destructive</Button>
      <Button variant="outline" disabled>Disabled Outline</Button>
      <Button variant="ghost" disabled>Disabled Ghost</Button>
      <Button variant="link" disabled>Disabled Link</Button>
    </div>
  ),
};

export const AsChildExample: Story = {
  render: () => (
    <Button asChild variant="outline">
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
      <Button variant="outline" className="rounded-r-none">
        Previous
      </Button>
      <Button variant="outline" className="rounded-none border-l-0">
        Current
      </Button>
      <Button variant="outline" className="rounded-l-none border-l-0">
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