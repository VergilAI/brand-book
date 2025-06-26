import type { Meta, StoryObj } from '@storybook/react';
import { VergilLogo } from './vergil-logo';

const meta = {
  title: 'Brand/VergilLogo',
  component: VergilLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Official Vergil logo component with multiple variants and sizes. All logos are white by default and should be used on dark or colored backgrounds.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['logo', 'mark', 'wordmark', 'white', 'dark'],
      description: 'Logo variant',
      table: {
        type: { summary: 'logo | mark | wordmark | white | dark' },
        defaultValue: { summary: 'logo' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Logo size',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'md' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable breathing animation',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded-lg bg-deep-space">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VergilLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'logo',
    size: 'md',
    animated: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <VergilLogo variant="logo" />
        </div>
        <p className="text-sm font-medium">Full Logo</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <VergilLogo variant="mark" />
        </div>
        <p className="text-sm font-medium">Mark Only</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <VergilLogo variant="wordmark" />
        </div>
        <p className="text-sm font-medium">Wordmark Only</p>
      </div>
    </div>
  ),
  decorators: [],
};

export const AllSizes: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-8 items-end">
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <VergilLogo size="sm" />
        </div>
        <p className="text-sm font-medium">Small</p>
      </div>
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <VergilLogo size="md" />
        </div>
        <p className="text-sm font-medium">Medium</p>
      </div>
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <VergilLogo size="lg" />
        </div>
        <p className="text-sm font-medium">Large</p>
      </div>
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <VergilLogo size="xl" />
        </div>
        <p className="text-sm font-medium">Extra Large</p>
      </div>
    </div>
  ),
  decorators: [],
};

export const Animated: Story = {
  args: {
    variant: 'logo',
    size: 'lg',
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo with breathing animation for living system effect.',
      },
    },
  },
};

export const OnBrandColors: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-8 bg-cosmic-purple rounded-lg">
        <VergilLogo variant="logo" />
      </div>
      <div className="p-8 bg-electric-violet rounded-lg">
        <VergilLogo variant="logo" />
      </div>
      <div className="p-8 consciousness-gradient rounded-lg">
        <VergilLogo variant="logo" />
      </div>
    </div>
  ),
  decorators: [],
  parameters: {
    docs: {
      description: {
        story: 'Logo on various brand color backgrounds.',
      },
    },
  },
};