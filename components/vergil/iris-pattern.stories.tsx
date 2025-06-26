import type { Meta, StoryObj } from '@storybook/react';
import { IrisPattern } from './iris-pattern';

const meta = {
  title: 'Brand/IrisPattern',
  component: IrisPattern,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Multi-layered iris visualization pattern representing consciousness and intelligence. Features breathing animations and multiple color variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cosmic', 'electric', 'synaptic'],
      description: 'Color variant',
      table: {
        type: { summary: 'default | cosmic | electric | synaptic' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Pattern size',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'md' },
      },
    },
    animate: {
      control: 'boolean',
      description: 'Enable breathing animation',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Pattern opacity',
      table: {
        defaultValue: { summary: '0.8' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof IrisPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    animate: true,
    opacity: 0.8,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="default" size="lg" />
        </div>
        <p className="text-sm font-medium">Default</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="cosmic" size="lg" />
        </div>
        <p className="text-sm font-medium">Cosmic</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="electric" size="lg" />
        </div>
        <p className="text-sm font-medium">Electric</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="synaptic" size="lg" />
        </div>
        <p className="text-sm font-medium">Synaptic</p>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8">
      <div className="text-center">
        <IrisPattern size="sm" variant="cosmic" />
        <p className="text-sm font-medium mt-4">Small</p>
      </div>
      <div className="text-center">
        <IrisPattern size="md" variant="cosmic" />
        <p className="text-sm font-medium mt-4">Medium</p>
      </div>
      <div className="text-center">
        <IrisPattern size="lg" variant="cosmic" />
        <p className="text-sm font-medium mt-4">Large</p>
      </div>
      <div className="text-center">
        <IrisPattern size="xl" variant="cosmic" />
        <p className="text-sm font-medium mt-4">Extra Large</p>
      </div>
    </div>
  ),
};

export const AsBackground: Story = {
  render: () => (
    <div className="relative w-full h-96 bg-deep-space rounded-lg overflow-hidden">
      <IrisPattern 
        variant="electric" 
        size="xl" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        opacity={0.3}
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Content Over Pattern</h3>
          <p className="text-gray-300">The iris pattern works great as a background element</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Iris pattern used as a decorative background element with reduced opacity.',
      },
    },
  },
};

export const AnimationShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="cosmic" size="lg" animate={true} />
        </div>
        <p className="text-sm font-medium">With Animation</p>
      </div>
      <div className="text-center">
        <div className="p-8 bg-deep-space rounded-lg mb-2">
          <IrisPattern variant="cosmic" size="lg" animate={false} />
        </div>
        <p className="text-sm font-medium">Without Animation</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of iris pattern with and without breathing animation.',
      },
    },
  },
};