import type { Meta, StoryObj } from '@storybook/react';
import { NeuralNetwork } from './neural-network';

const meta = {
  title: 'Brand/NeuralNetwork',
  component: NeuralNetwork,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated neural network visualization with customizable nodes, edges, and floating particles. Represents AI and neural connections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Network width',
      table: {
        defaultValue: { summary: '400' },
      },
    },
    height: {
      control: { type: 'range', min: 150, max: 600, step: 50 },
      description: 'Network height',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    nodeCount: {
      control: { type: 'range', min: 3, max: 12, step: 1 },
      description: 'Number of nodes (when using default config)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof NeuralNetwork>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 400,
    height: 300,
    animated: true,
  },
};

export const Large: Story = {
  args: {
    width: 600,
    height: 400,
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger neural network for hero sections or featured displays.',
      },
    },
  },
};

export const Static: Story = {
  args: {
    width: 400,
    height: 300,
    animated: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Neural network without animations for reduced motion preferences.',
      },
    },
  },
};

export const CustomConfiguration: Story = {
  args: {
    width: 500,
    height: 350,
    animated: true,
    nodes: [
      { id: 'input1', x: 50, y: 100, type: 'input' },
      { id: 'input2', x: 50, y: 200, type: 'input' },
      { id: 'hidden1', x: 200, y: 75, type: 'hidden' },
      { id: 'hidden2', x: 200, y: 150, type: 'hidden' },
      { id: 'hidden3', x: 200, y: 225, type: 'hidden' },
      { id: 'output1', x: 350, y: 125, type: 'output' },
      { id: 'output2', x: 350, y: 175, type: 'output' },
    ],
    edges: [
      { source: 'input1', target: 'hidden1' },
      { source: 'input1', target: 'hidden2' },
      { source: 'input2', target: 'hidden2' },
      { source: 'input2', target: 'hidden3' },
      { source: 'hidden1', target: 'output1' },
      { source: 'hidden2', target: 'output1' },
      { source: 'hidden2', target: 'output2' },
      { source: 'hidden3', target: 'output2' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Neural network with custom node and edge configuration.',
      },
    },
  },
};

export const AsBackground: Story = {
  render: () => (
    <div className="relative w-full h-96 bg-deep-space rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <NeuralNetwork width={800} height={400} animated={true} />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h3 className="text-3xl font-bold mb-2">AI-Powered Platform</h3>
          <p className="text-gray-300">Neural networks working in the background</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Neural network used as an animated background element.',
      },
    },
  },
};

export const ResponsiveSizes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <NeuralNetwork width={200} height={150} />
        </div>
        <p className="text-sm font-medium">Small</p>
      </div>
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <NeuralNetwork width={300} height={225} />
        </div>
        <p className="text-sm font-medium">Medium</p>
      </div>
      <div className="text-center">
        <div className="p-4 bg-deep-space rounded-lg mb-2">
          <NeuralNetwork width={400} height={300} />
        </div>
        <p className="text-sm font-medium">Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Neural network in various sizes for different use cases.',
      },
    },
  },
};