import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component for labeling and categorization. Supports multiple variants and can be used as a link.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'default | secondary | destructive | outline' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">
        <CheckCircle />
        Success
      </Badge>
      <Badge variant="secondary">
        <Info />
        Info
      </Badge>
      <Badge variant="destructive">
        <XCircle />
        Error
      </Badge>
      <Badge variant="outline">
        <AlertCircle />
        Warning
      </Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Course Status:</span>
        <Badge variant="default">Active</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="destructive">Archived</Badge>
        <Badge variant="outline">Pending Review</Badge>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">User Level:</span>
        <Badge variant="default">Beginner</Badge>
        <Badge variant="secondary">Intermediate</Badge>
        <Badge variant="default">Advanced</Badge>
        <Badge variant="outline">Expert</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common badge usage patterns for status indicators and categorization.',
      },
    },
  },
};

export const AsLinkExample: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge asChild variant="default">
        <a href="#" className="cursor-pointer">
          Clickable Badge
        </a>
      </Badge>
      <Badge asChild variant="secondary">
        <a href="#" className="cursor-pointer">
          <Info />
          Learn More
        </a>
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges rendered as anchor elements using the asChild prop for clickable tags.',
      },
    },
  },
};

export const ComplianceBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline">SOC 2 Type II</Badge>
        <Badge variant="outline">GDPR</Badge>
        <Badge variant="outline">CCPA</Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        Used in Vergil Learn footer for compliance certifications
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compliance badges as used in the Vergil Learn footer component.',
      },
    },
  },
};

export const AIModelBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default" className="bg-cosmic-purple">GPT-4</Badge>
      <Badge variant="default" className="bg-electric-violet">Claude 3</Badge>
      <Badge variant="default" className="bg-synaptic-blue">Gemini Pro</Badge>
      <Badge variant="secondary">LLaMA 2</Badge>
      <Badge variant="secondary">Mistral</Badge>
      <Badge variant="outline">Custom Model</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI model badges with custom colors for different AI providers.',
      },
    },
  },
};