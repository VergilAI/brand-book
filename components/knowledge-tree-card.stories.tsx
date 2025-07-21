import type { Meta, StoryObj } from '@storybook/react'
import { KnowledgeTreeCard } from './knowledge-tree-card'

const meta = {
  title: 'LMS/KnowledgeTreeCard',
  component: KnowledgeTreeCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KnowledgeTreeCard>

export default meta
type Story = StoryObj<typeof meta>

// Sample knowledge points with dependencies
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
    hardDependencies: ['kp-6'],
    dependencyDetails: {
      'kp-2': { type: 'soft' as const, requiredElo: 65 },
      'kp-6': { type: 'hard' as const, requiredElo: 75 }
    }
  },
  {
    id: 'kp-10',
    title: 'Random Forests',
    progress: 0,
    dependencies: ['kp-9'],
    hardDependencies: ['kp-9'],
    dependencyDetails: {
      'kp-9': { type: 'hard' as const, requiredElo: 85 }
    }
  },
  {
    id: 'kp-11',
    title: 'Neural Networks',
    progress: 0,
    dependencies: ['kp-4', 'kp-7'],
    dependencyDetails: {
      'kp-4': { type: 'hard' as const, requiredElo: 90 },
      'kp-7': { type: 'soft' as const, requiredElo: 70 }
    }
  },
  {
    id: 'kp-12',
    title: 'Deep Learning',
    progress: 0,
    dependencies: ['kp-11'],
    hardDependencies: ['kp-11'],
    dependencyDetails: {
      'kp-11': { type: 'hard' as const, requiredElo: 85 }
    }
  }
]

// Sample lesson information
const sampleLessons = {
  'kp-1': [
    {
      chapterId: 'ch-1',
      chapterTitle: 'Chapter 1: Fundamentals',
      lessonId: 'lesson-1-1',
      lessonTitle: 'What is Machine Learning?'
    }
  ],
  'kp-2': [
    {
      chapterId: 'ch-1',
      chapterTitle: 'Chapter 1: Fundamentals',
      lessonId: 'lesson-1-1',
      lessonTitle: 'What is Machine Learning?'
    }
  ],
  'kp-3': [
    {
      chapterId: 'ch-1',
      chapterTitle: 'Chapter 1: Fundamentals',
      lessonId: 'lesson-1-2',
      lessonTitle: 'ML in Practice'
    }
  ],
  'kp-4': [
    {
      chapterId: 'ch-2',
      chapterTitle: 'Chapter 2: Mathematical Foundations',
      lessonId: 'lesson-2-1',
      lessonTitle: 'Linear Algebra Basics'
    }
  ],
  'kp-5': [
    {
      chapterId: 'ch-2',
      chapterTitle: 'Chapter 2: Mathematical Foundations',
      lessonId: 'lesson-2-2',
      lessonTitle: 'Probability Theory'
    }
  ],
  'kp-6': [
    {
      chapterId: 'ch-2',
      chapterTitle: 'Chapter 2: Mathematical Foundations',
      lessonId: 'lesson-2-3',
      lessonTitle: 'Statistical Concepts'
    }
  ],
  'kp-7': [
    {
      chapterId: 'ch-3',
      chapterTitle: 'Chapter 3: Algorithms',
      lessonId: 'lesson-3-1',
      lessonTitle: 'Linear Models'
    }
  ],
  'kp-8': [
    {
      chapterId: 'ch-3',
      chapterTitle: 'Chapter 3: Algorithms',
      lessonId: 'lesson-3-1',
      lessonTitle: 'Linear Models'
    }
  ],
  'kp-9': [
    {
      chapterId: 'ch-3',
      chapterTitle: 'Chapter 3: Algorithms',
      lessonId: 'lesson-3-2',
      lessonTitle: 'Tree-based Models'
    }
  ],
  'kp-10': [
    {
      chapterId: 'ch-3',
      chapterTitle: 'Chapter 3: Algorithms',
      lessonId: 'lesson-3-2',
      lessonTitle: 'Tree-based Models'
    }
  ],
  'kp-11': [
    {
      chapterId: 'ch-4',
      chapterTitle: 'Chapter 4: Neural Networks',
      lessonId: 'lesson-4-1',
      lessonTitle: 'Introduction to Neural Networks'
    }
  ],
  'kp-12': [
    {
      chapterId: 'ch-4',
      chapterTitle: 'Chapter 4: Neural Networks',
      lessonId: 'lesson-4-2',
      lessonTitle: 'Deep Learning Architectures'
    }
  ]
}

export const Default: Story = {
  args: {
    title: 'Machine Learning Fundamentals',
    subtitle: 'Master the basics of ML',
    userName: 'Sarah',
    knowledgePoints: sampleKnowledgePoints,
    showStats: true,
  },
}

export const WithLessons: Story = {
  args: {
    title: 'Machine Learning Fundamentals',
    subtitle: 'Master the basics of ML',
    userName: 'Sarah',
    knowledgePoints: sampleKnowledgePoints,
    showStats: true,
    availableLessons: sampleLessons,
    onLessonClick: (lessonId) => {
      console.log('Lesson clicked:', lessonId)
      alert(`Starting lesson: ${lessonId}`)
    },
  },
}

export const SimpleTree: Story = {
  args: {
    title: 'Python Basics',
    userName: 'John',
    knowledgePoints: [
      { id: 'py-1', title: 'Variables', progress: 100 },
      { id: 'py-2', title: 'Data Types', progress: 100 },
      { id: 'py-3', title: 'Functions', progress: 80, dependencies: ['py-1', 'py-2'] },
      { id: 'py-4', title: 'Classes', progress: 60, dependencies: ['py-3'] },
      { id: 'py-5', title: 'Modules', progress: 40, dependencies: ['py-3'] },
      { id: 'py-6', title: 'Decorators', progress: 0, dependencies: ['py-3', 'py-4'] },
    ],
    showStats: false,
  },
}

export const ComplexDependencies: Story = {
  args: {
    title: 'Advanced ML Pipeline',
    userName: 'Alex',
    knowledgePoints: [
      // Foundation
      { id: 'found-1', title: 'Data Collection', progress: 100 },
      { id: 'found-2', title: 'Data Cleaning', progress: 100, dependencies: ['found-1'] },
      { id: 'found-3', title: 'Feature Engineering', progress: 90, dependencies: ['found-2'] },
      
      // Models
      { id: 'model-1', title: 'Baseline Model', progress: 80, dependencies: ['found-3'] },
      { id: 'model-2', title: 'Advanced Model', progress: 60, dependencies: ['model-1', 'found-3'] },
      { id: 'model-3', title: 'Ensemble', progress: 30, dependencies: ['model-1', 'model-2'] },
      
      // Evaluation
      { id: 'eval-1', title: 'Metrics', progress: 70, dependencies: ['model-1'] },
      { id: 'eval-2', title: 'Cross-validation', progress: 50, dependencies: ['eval-1', 'model-2'] },
      { id: 'eval-3', title: 'A/B Testing', progress: 0, dependencies: ['eval-2', 'model-3'] },
      
      // Deployment
      { id: 'deploy-1', title: 'Model Export', progress: 0, dependencies: ['model-3', 'eval-2'] },
      { id: 'deploy-2', title: 'API Creation', progress: 0, dependencies: ['deploy-1'] },
      { id: 'deploy-3', title: 'Monitoring', progress: 0, dependencies: ['deploy-2', 'eval-3'] },
    ],
    showStats: true,
    availableLessons: sampleLessons,
  },
}

export const NoProgress: Story = {
  args: {
    title: 'New Course',
    userName: 'Student',
    knowledgePoints: sampleKnowledgePoints.map(kp => ({ ...kp, progress: 0 })),
    showStats: true,
  },
}

export const AllCompleted: Story = {
  args: {
    title: 'Completed Course',
    userName: 'Graduate',
    knowledgePoints: sampleKnowledgePoints.map(kp => ({ ...kp, progress: 100 })),
    showStats: true,
  },
}