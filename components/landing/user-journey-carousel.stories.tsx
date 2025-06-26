import type { Meta, StoryObj } from '@storybook/react';
import { UserJourneyCarousel } from './user-journey-carousel';

const meta = {
  title: 'Vergil Learn/UserJourneyCarousel',
  component: UserJourneyCarousel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive user journey visualization with GraphConstellationPersistent. Shows the transformation from struggling to mastery through Vergil Learn.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserJourneyCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-[800px] bg-gradient-to-b from-deep-space to-deep-space/95">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'The complete user journey carousel with three stages: Struggling, Building, and Mastery. Each stage reveals different parts of the knowledge graph.',
      },
    },
  },
};

export const StageOne: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-[800px] bg-gradient-to-b from-deep-space to-deep-space/95">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'First stage - "The Struggling Developer" with initial graph nodes.',
      },
    },
  },
};

export const CompactView: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-5xl mx-auto bg-gradient-to-b from-deep-space to-deep-space/95">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'User journey carousel in a constrained container.',
      },
    },
  },
};