import type { Meta, StoryObj } from '@storybook/react';
import { LearnHero } from './learn-hero';

const meta = {
  title: 'Vergil Learn/LearnHero',
  component: LearnHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section for Vergil Learn with integrated RadialHeatmap visualization. Features video CTA and brand messaging.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LearnHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default Learn Hero with RadialHeatmap background animation and video CTA button.',
      },
    },
  },
};

export const WithCustomBackground: Story = {
  decorators: [
    (Story) => (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Learn Hero with a custom gradient background overlay.',
      },
    },
  },
};