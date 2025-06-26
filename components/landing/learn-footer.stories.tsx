import type { Meta, StoryObj } from '@storybook/react';
import { LearnFooter } from './learn-footer';

const meta = {
  title: 'Vergil Learn/LearnFooter',
  component: LearnFooter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Footer component for Vergil Learn with compliance badges, links, and brand information.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LearnFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-deep-space flex flex-col">
        <div className="flex-1" />
        <Story />
      </div>
    ),
  ],
};

export const OnLightBackground: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Footer on a light background to show contrast.',
      },
    },
  },
};