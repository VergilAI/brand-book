import type { Meta, StoryObj } from '@storybook/react'
import { LessonCard } from './lesson-card'
import type { Lesson } from '@/lib/lms/game-types'

const meta: Meta<typeof LessonCard> = {
  title: 'LMS/LessonCard',
  component: LessonCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card component for displaying individual lessons with knowledge points and progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLocked: {
      control: 'boolean',
      description: 'Whether the lesson is locked',
    },
    sectionNumber: {
      control: 'number',
      description: 'Section number for display',
    },
    lessonNumber: {
      control: 'number',
      description: 'Lesson number within section',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Introduction to Machine Learning',
  description: 'Learn the fundamental concepts of machine learning, including supervised and unsupervised learning.',
  estimatedTime: 30,
  availableGameTypes: [
    'written-material',
    'video',
    'flashcards',
    'millionaire',
    'speed-rounds',
    'concept-matching',
    'case-study',
    'role-playing'
  ],
  knowledgePoints: [
    {
      id: 'kp-1',
      title: 'What is Machine Learning?',
      description: 'Understanding the basic definition and applications',
      proficiency: 85
    },
    {
      id: 'kp-2',
      title: 'Supervised vs Unsupervised',
      description: 'Differentiating between learning paradigms',
      proficiency: 70
    },
    {
      id: 'kp-3',
      title: 'Common ML Algorithms',
      description: 'Overview of popular algorithms and their uses',
      proficiency: 45
    },
    {
      id: 'kp-4',
      title: 'Training and Testing Data',
      description: 'Understanding data splitting and validation',
      proficiency: 60
    }
  ]
}

export const Default: Story = {
  args: {
    lesson: sampleLesson,
    sectionNumber: 1,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const NewLesson: Story = {
  args: {
    lesson: {
      ...sampleLesson,
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 0
      }))
    },
    sectionNumber: 1,
    lessonNumber: 2,
    isLocked: false,
  },
}

export const Mastered: Story = {
  args: {
    lesson: {
      ...sampleLesson,
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 90
      }))
    },
    sectionNumber: 2,
    lessonNumber: 3,
    isLocked: false,
  },
}

export const Locked: Story = {
  args: {
    lesson: sampleLesson,
    sectionNumber: 3,
    lessonNumber: 1,
    isLocked: true,
  },
}

export const InProgress: Story = {
  args: {
    lesson: {
      ...sampleLesson,
      knowledgePoints: [
        { ...sampleLesson.knowledgePoints[0], proficiency: 100 },
        { ...sampleLesson.knowledgePoints[1], proficiency: 80 },
        { ...sampleLesson.knowledgePoints[2], proficiency: 20 },
        { ...sampleLesson.knowledgePoints[3], proficiency: 0 }
      ]
    },
    sectionNumber: 1,
    lessonNumber: 4,
    isLocked: false,
  },
}

export const LessonGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 max-w-6xl">
      <LessonCard
        lesson={sampleLesson}
        sectionNumber={1}
        lessonNumber={1}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...sampleLesson,
          title: 'Neural Networks Basics',
          knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
            ...kp,
            proficiency: 30
          }))
        }}
        sectionNumber={1}
        lessonNumber={2}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...sampleLesson,
          title: 'Deep Learning Fundamentals',
          knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
            ...kp,
            proficiency: 0
          }))
        }}
        sectionNumber={1}
        lessonNumber={3}
        isLocked={true}
      />
    </div>
  ),
}