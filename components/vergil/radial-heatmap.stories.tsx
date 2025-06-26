import type { Meta, StoryObj } from '@storybook/react';
import { RadialHeatmap } from './radial-heatmap';

const meta = {
  title: 'Brand/RadialHeatmap',
  component: RadialHeatmap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated radial heatmap visualization with organic blob shapes. Used in Vergil Learn hero section for skill visualization.',
      },
    },
    backgrounds: {
      default: 'deep-space',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Heatmap data with labels and values',
    },
    size: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Heatmap size (width and height)',
      table: {
        defaultValue: { summary: '500' },
      },
    },
    animate: {
      control: 'boolean',
      description: 'Enable organic blob animations',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    colorScheme: {
      control: 'select',
      options: ['default', 'cosmic', 'electric', 'thermal'],
      description: 'Color scheme',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof RadialHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultData = [
  { label: 'React', value: 0.9, category: 'frontend' },
  { label: 'TypeScript', value: 0.85, category: 'language' },
  { label: 'Node.js', value: 0.8, category: 'backend' },
  { label: 'Python', value: 0.75, category: 'language' },
  { label: 'AWS', value: 0.7, category: 'cloud' },
  { label: 'Docker', value: 0.65, category: 'devops' },
  { label: 'GraphQL', value: 0.6, category: 'api' },
  { label: 'MongoDB', value: 0.55, category: 'database' },
];

export const Default: Story = {
  args: {
    data: defaultData,
    size: 500,
    animate: true,
    colorScheme: 'default',
  },
};

export const SkillsVisualization: Story = {
  args: {
    data: [
      { label: 'AI/ML', value: 0.95, category: 'core' },
      { label: 'Neural Networks', value: 0.9, category: 'core' },
      { label: 'Data Science', value: 0.85, category: 'core' },
      { label: 'Computer Vision', value: 0.8, category: 'specialized' },
      { label: 'NLP', value: 0.75, category: 'specialized' },
      { label: 'Reinforcement Learning', value: 0.7, category: 'specialized' },
      { label: 'TensorFlow', value: 0.85, category: 'tools' },
      { label: 'PyTorch', value: 0.8, category: 'tools' },
    ],
    size: 600,
    animate: true,
    colorScheme: 'cosmic',
  },
  parameters: {
    docs: {
      description: {
        story: 'AI/ML skills visualization with cosmic color scheme.',
      },
    },
  },
};

export const CompactSize: Story = {
  args: {
    data: defaultData.slice(0, 5),
    size: 300,
    animate: true,
    colorScheme: 'electric',
  },
  parameters: {
    docs: {
      description: {
        story: 'Smaller heatmap for constrained spaces.',
      },
    },
  },
};

export const StaticVisualization: Story = {
  args: {
    data: defaultData,
    size: 500,
    animate: false,
    colorScheme: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Heatmap without animations for static displays or reduced motion.',
      },
    },
  },
};

export const ColorSchemes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="text-center">
        <RadialHeatmap data={defaultData.slice(0, 4)} size={250} colorScheme="default" />
        <p className="text-sm font-medium text-white mt-4">Default</p>
      </div>
      <div className="text-center">
        <RadialHeatmap data={defaultData.slice(0, 4)} size={250} colorScheme="cosmic" />
        <p className="text-sm font-medium text-white mt-4">Cosmic</p>
      </div>
      <div className="text-center">
        <RadialHeatmap data={defaultData.slice(0, 4)} size={250} colorScheme="electric" />
        <p className="text-sm font-medium text-white mt-4">Electric</p>
      </div>
      <div className="text-center">
        <RadialHeatmap data={defaultData.slice(0, 4)} size={250} colorScheme="thermal" />
        <p className="text-sm font-medium text-white mt-4">Thermal</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available color schemes for different contexts.',
      },
    },
  },
};

export const IntegratedInHero: Story = {
  render: () => (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-deep-space to-cosmic-purple/20 rounded-lg overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30">
        <RadialHeatmap data={defaultData} size={700} animate={true} colorScheme="cosmic" />
      </div>
      <div className="relative z-10 p-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          Master Your Skills
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl">
          Visualize your journey from beginner to expert with our living skill matrix
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Radial heatmap integrated as a hero section background element, similar to Vergil Learn.',
      },
    },
  },
};