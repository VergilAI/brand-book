import type { Meta, StoryObj } from '@storybook/react'
import { KnowledgeGraphPreview } from './knowledge-graph-preview'

// Type definition for KnowledgePoint
interface KnowledgePoint {
  id: string
  title: string
  progress: number
  dependencies?: string[]
  dependencyDetails?: Record<string, { type: 'hard' | 'soft', requiredElo: number }>
}

const meta: Meta<typeof KnowledgeGraphPreview> = {
  title: 'Knowledge/KnowledgeGraphPreview',
  component: KnowledgeGraphPreview,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample knowledge points data
const sampleKnowledgePoints: KnowledgePoint[] = [
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
    dependencyDetails: {
      'kp-1': { type: 'hard', requiredElo: 80 }
    }
  },
  {
    id: 'kp-3',
    title: 'Applications',
    progress: 70,
    dependencies: ['kp-2'],
    dependencyDetails: {
      'kp-2': { type: 'soft', requiredElo: 60 }
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
    dependencyDetails: {
      'kp-5': { type: 'hard', requiredElo: 75 }
    }
  },
  {
    id: 'kp-7',
    title: 'Linear Regression',
    progress: 0,
    dependencies: ['kp-4', 'kp-6'],
    dependencyDetails: {
      'kp-4': { type: 'hard', requiredElo: 85 },
      'kp-6': { type: 'hard', requiredElo: 80 }
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

export const NoUserName: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints,
    courseTitle: 'Advanced Neural Networks',
  },
}

export const HighProgress: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints.map(kp => ({
      ...kp,
      progress: Math.min(100, kp.progress + 20)
    })),
    userName: 'Sarah',
    courseTitle: 'Deep Learning Mastery',
  },
}

export const ComplexDependencies: Story = {
  args: {
    knowledgePoints: [
      { id: '1', title: 'Calculus', progress: 100, dependencies: [] },
      { id: '2', title: 'Linear Algebra', progress: 90, dependencies: [] },
      { id: '3', title: 'Probability', progress: 85, dependencies: [] },
      { id: '4', title: 'Statistics', progress: 80, dependencies: ['3'] },
      { id: '5', title: 'Optimization', progress: 70, dependencies: ['1', '2'] },
      { id: '6', title: 'ML Theory', progress: 60, dependencies: ['4', '5'] },
      { id: '7', title: 'Neural Networks', progress: 40, dependencies: ['5', '6'] },
      { id: '8', title: 'Deep Learning', progress: 20, dependencies: ['7'] },
      { id: '9', title: 'CNNs', progress: 10, dependencies: ['8'] },
      { id: '10', title: 'RNNs', progress: 5, dependencies: ['8'] },
      { id: '11', title: 'Transformers', progress: 0, dependencies: ['10'] },
    ],
    userName: 'Michael',
    courseTitle: 'Complete AI Engineering Path',
  },
}

export const MinimalProgress: Story = {
  args: {
    knowledgePoints: sampleKnowledgePoints.map(kp => ({
      ...kp,
      progress: kp.progress > 0 ? 10 : 0
    })),
    userName: 'New Student',
    courseTitle: 'Getting Started with ML',
  },
}