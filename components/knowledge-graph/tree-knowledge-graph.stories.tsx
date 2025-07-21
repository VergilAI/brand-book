import type { Meta, StoryObj } from '@storybook/react'
import { TreeKnowledgeGraph } from './tree-knowledge-graph'
import { JourneyProvider } from './journey-context'
import { useState } from 'react'

const meta = {
  title: 'LMS/TreeKnowledgeGraph',
  component: TreeKnowledgeGraph,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An interactive tree-based knowledge graph visualization with journey animations and dependency tracking.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <JourneyProvider>
        <div className="h-screen p-4 bg-gray-50">
          <Story />
        </div>
      </JourneyProvider>
    ),
  ],
} satisfies Meta<typeof TreeKnowledgeGraph>

export default meta
type Story = StoryObj<typeof meta>

// Comprehensive knowledge points with complex dependencies
const complexKnowledgePoints = [
  // Foundation level
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
  // Math foundations
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
  // Algorithms
  {
    id: 'kp-7',
    title: 'Linear Regression',
    progress: 25,
    dependencies: ['kp-4', 'kp-6'],
    hardDependencies: ['kp-4', 'kp-6'],
    dependencyDetails: {
      'kp-4': { type: 'hard' as const, requiredElo: 85 },
      'kp-6': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-8',
    title: 'Logistic Regression',
    progress: 15,
    dependencies: ['kp-7'],
    hardDependencies: ['kp-7'],
    dependencyDetails: {
      'kp-7': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-9',
    title: 'Decision Trees',
    progress: 0,
    dependencies: ['kp-2', 'kp-6'],
    dependencyDetails: {
      'kp-2': { type: 'soft' as const, requiredElo: 65 },
      'kp-6': { type: 'hard' as const, requiredElo: 75 }
    }
  },
  // Neural Networks
  {
    id: 'kp-10',
    title: 'Perceptron',
    progress: 0,
    dependencies: ['kp-4', 'kp-7'],
    dependencyDetails: {
      'kp-4': { type: 'hard' as const, requiredElo: 80 },
      'kp-7': { type: 'soft' as const, requiredElo: 70 }
    }
  },
  {
    id: 'kp-11',
    title: 'Activation Functions',
    progress: 0,
    dependencies: ['kp-10'],
    hardDependencies: ['kp-10'],
    dependencyDetails: {
      'kp-10': { type: 'hard' as const, requiredElo: 80 }
    }
  },
  {
    id: 'kp-12',
    title: 'Backpropagation',
    progress: 0,
    dependencies: ['kp-10', 'kp-11'],
    hardDependencies: ['kp-10', 'kp-11'],
    dependencyDetails: {
      'kp-10': { type: 'hard' as const, requiredElo: 80 },
      'kp-11': { type: 'hard' as const, requiredElo: 80 }
    }
  },
]

// Lesson information for nodes
const sampleLessons = {
  'kp-1': [
    { chapterId: 'ch-1', chapterTitle: 'Fundamentals', lessonId: 'l-1', lessonTitle: 'What is Machine Learning?' },
  ],
  'kp-2': [
    { chapterId: 'ch-1', chapterTitle: 'Fundamentals', lessonId: 'l-2', lessonTitle: 'Types of Machine Learning' },
  ],
  'kp-7': [
    { chapterId: 'ch-2', chapterTitle: 'Algorithms', lessonId: 'l-3', lessonTitle: 'Linear Regression Basics' },
    { chapterId: 'ch-2', chapterTitle: 'Algorithms', lessonId: 'l-4', lessonTitle: 'Advanced Linear Regression' },
  ],
}

export const Default: Story = {
  args: {
    userName: 'Student',
    knowledgePoints: complexKnowledgePoints,
    availableLessons: sampleLessons,
  },
}

export const WithSelection: Story = {
  args: {
    userName: 'Student',
    knowledgePoints: complexKnowledgePoints,
    selectedNodeId: 'kp-7',
    availableLessons: sampleLessons,
  },
}

export const WithJourney: Story = {
  args: {
    userName: 'Student',
    knowledgePoints: complexKnowledgePoints,
    showJourney: true,
    availableLessons: sampleLessons,
  },
}

export const SimpleGraph: Story = {
  args: {
    userName: 'Beginner',
    knowledgePoints: complexKnowledgePoints.slice(0, 6),
  },
}

export const NoProgress: Story = {
  args: {
    userName: 'New Student',
    knowledgePoints: complexKnowledgePoints.map(kp => ({ ...kp, progress: 0 })),
  },
}

export const CompletelyMastered: Story = {
  args: {
    userName: 'Expert',
    knowledgePoints: complexKnowledgePoints.map(kp => ({ ...kp, progress: 100 })),
  },
}

// Interactive example with state
export const Interactive: Story = {
  render: (args) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null)
    
    return (
      <TreeKnowledgeGraph
        {...args}
        selectedNodeId={selectedNode}
        onNodeSelect={setSelectedNode}
        onLessonClick={(lessonId) => alert(`Opening lesson: ${lessonId}`)}
      />
    )
  },
  args: {
    userName: 'Interactive User',
    knowledgePoints: complexKnowledgePoints,
    availableLessons: sampleLessons,
  },
}