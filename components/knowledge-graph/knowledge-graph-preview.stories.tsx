import type { Meta, StoryObj } from '@storybook/react'
import { KnowledgeGraphPreview } from './knowledge-graph-preview'
import { JourneyProvider } from './journey-context'

const meta = {
  title: 'LMS/KnowledgeGraphPreview',
  component: KnowledgeGraphPreview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A compact preview of the knowledge graph that shows progress and allows journey planning.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <JourneyProvider>
        <div className="max-w-md">
          <Story />
        </div>
      </JourneyProvider>
    ),
  ],
} satisfies Meta<typeof KnowledgeGraphPreview>

export default meta
type Story = StoryObj<typeof meta>

// Sample knowledge points
const sampleKnowledgePoints = [
  {
    id: 'kp-1',
    title: 'ML Definition',
    progress: 100,
    dependencies: [],
  },
  {
    id: 'kp-2',
    title: 'Types of ML',
    progress: 85,
    dependencies: ['kp-1'],
    hardDependencies: ['kp-1'],
    dependencyDetails: {
      'kp-1': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-3',
    title: 'Applications',
    progress: 70,
    dependencies: ['kp-2'],
    dependencyDetails: {
      'kp-2': { type: 'soft' as const, requiredElo: 60 }
    }
  },
  {
    id: 'kp-4',
    title: 'Linear Algebra',
    progress: 60,
    dependencies: [],
  },
  {
    id: 'kp-5',
    title: 'Probability',
    progress: 45,
    dependencies: [],
  },
  {
    id: 'kp-6',
    title: 'Statistics',
    progress: 30,
    dependencies: ['kp-5'],
    hardDependencies: ['kp-5'],
    dependencyDetails: {
      'kp-5': { type: 'hard' as const, requiredElo: 75 }
    }
  },
  {
    id: 'kp-7',
    title: 'Linear Regression',
    progress: 0,
    dependencies: ['kp-4', 'kp-6'],
    hardDependencies: ['kp-4', 'kp-6'],
    dependencyDetails: {
      'kp-4': { type: 'hard' as const, requiredElo: 85 },
      'kp-6': { type: 'hard' as const, requiredElo: 80 }
    }
  },
]

export const Default: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints,
    userName: 'Alex',
    courseTitle: 'Introduction to Machine Learning',
  },
}

export const WithNoProgress: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints.map(kp => ({ ...kp, progress: 0 })),
    userName: 'New Student',
    courseTitle: 'Introduction to Machine Learning',
  },
}

export const FullyCompleted: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints.map(kp => ({ ...kp, progress: 100 })),
    userName: 'Expert',
    courseTitle: 'Introduction to Machine Learning',
  },
}

export const MinimalNodes: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints.slice(0, 3),
    userName: 'Student',
    courseTitle: 'Quick Course',
  },
}

export const WithExpandHandler: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints,
    userName: 'Alex',
    courseTitle: 'Introduction to Machine Learning',
    onExpand: () => alert('Expanding to full view!'),
  },
}