import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern badge component using semantic token system. Features multiple variants for different contexts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'brand'],
      description: 'Semantic color variant',
      table: {
        type: { summary: 'default | success | warning | error | info | brand' },
        defaultValue: { summary: 'default' },
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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">All Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="brand">Brand</Badge>
        </div>
      </div>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Course Status</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Published</Badge>
          <Badge variant="warning">Draft</Badge>
          <Badge variant="error">Archived</Badge>
          <Badge variant="info">Scheduled</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">User Levels</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Beginner</Badge>
          <Badge variant="info">Intermediate</Badge>
          <Badge variant="brand">Advanced</Badge>
          <Badge variant="brand">Expert</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">System Status</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Operational</Badge>
          <Badge variant="warning">Degraded</Badge>
          <Badge variant="error">Outage</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of badges used for different status indicators.',
      },
    },
  },
};

export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Course Management</h3>
          <div className="flex gap-2">
            <Badge variant="success">Active</Badge>
            <Badge variant="info">12 Students</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Example of badges used in a course management interface.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">User Profile</h3>
          <div className="flex gap-2">
            <Badge variant="brand">Pro User</Badge>
            <Badge variant="default">Since 2023</Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Example of badges used in a user profile context.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing badges in context.',
      },
    },
  },
};