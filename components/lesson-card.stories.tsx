import type { Meta, StoryObj } from '@storybook/react'
import { LessonCard } from './lesson-card'
import type { Lesson } from '@/lib/lms/game-types'

// Extended Lesson type to include additional properties used by LessonCard
interface ExtendedLesson extends Lesson {
  type?: 'video' | 'quiz' | 'interactive' | 'reading'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

const meta = {
  title: 'LMS/LessonCard',
  component: LessonCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLocked: {
      control: 'boolean',
      description: 'Whether the lesson is locked',
    },
    sectionNumber: {
      control: 'number',
      description: 'Section number in the course',
    },
    lessonNumber: {
      control: 'number',
      description: 'Lesson number within the section',
    },
  },
} satisfies Meta<typeof LessonCard>

export default meta
type Story = StoryObj<typeof meta>

// Mock data
const mockKnowledgePoints = [
  {
    id: 'kp1',
    title: 'Basic Concepts',
    description: 'Understanding fundamental principles',
    proficiency: 0,
  },
  {
    id: 'kp2',
    title: 'Advanced Topics',
    description: 'Exploring complex scenarios',
    proficiency: 0,
  },
  {
    id: 'kp3',
    title: 'Practical Applications',
    description: 'Real-world implementation',
    proficiency: 0,
  },
  {
    id: 'kp4',
    title: 'Best Practices',
    description: 'Industry standards and guidelines',
    proficiency: 0,
  },
]

const baseLessonData: ExtendedLesson = {
  id: 'lesson1',
  title: 'Introduction to React Hooks',
  description: 'Learn the fundamentals of React Hooks and how they revolutionize state management in functional components.',
  knowledgePoints: mockKnowledgePoints,
  availableGameTypes: ['written-material', 'flashcards', 'millionaire', 'connect-cards'],
  estimatedTime: 15,
  type: 'reading',
  difficulty: 'beginner',
}

export const Default: Story = {
  args: {
    lesson: baseLessonData,
    sectionNumber: 1,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const LockedLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Advanced State Management',
      description: 'Deep dive into complex state management patterns using Redux and Context API.',
      difficulty: 'advanced',
    },
    sectionNumber: 3,
    lessonNumber: 5,
    isLocked: true,
  },
}

export const CompletedLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Component Lifecycle',
      description: 'Master the component lifecycle methods and their modern equivalents in hooks.',
      knowledgePoints: mockKnowledgePoints.map(kp => ({
        ...kp,
        proficiency: 100,
      })),
      difficulty: 'intermediate',
    },
    sectionNumber: 2,
    lessonNumber: 3,
    isLocked: false,
  },
}

export const InProgressLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Custom Hooks Development',
      description: 'Create your own custom hooks to share logic between components.',
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 85 },
        { ...mockKnowledgePoints[1], proficiency: 60 },
        { ...mockKnowledgePoints[2], proficiency: 40 },
        { ...mockKnowledgePoints[3], proficiency: 20 },
      ],
      estimatedTime: 20,
    },
    sectionNumber: 2,
    lessonNumber: 4,
    isLocked: false,
  },
}

export const VideoLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'React Performance Optimization',
      description: 'Watch expert tutorials on optimizing React applications for maximum performance.',
      type: 'video',
      estimatedTime: 30,
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 75 },
        { ...mockKnowledgePoints[1], proficiency: 75 },
      ],
    },
    sectionNumber: 4,
    lessonNumber: 2,
    isLocked: false,
  },
}

export const QuizLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics with interactive quizzes.',
      type: 'quiz',
      difficulty: 'beginner',
      estimatedTime: 10,
      availableGameTypes: ['flashcards', 'millionaire', 'jeopardy', 'connect-cards'],
    },
    sectionNumber: 1,
    lessonNumber: 5,
    isLocked: false,
  },
}

export const InteractiveLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Building a Todo App',
      description: 'Interactive coding exercise to build a fully functional Todo application.',
      type: 'interactive',
      difficulty: 'intermediate',
      estimatedTime: 45,
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 30 },
        { ...mockKnowledgePoints[1], proficiency: 15 },
        { ...mockKnowledgePoints[2], proficiency: 0 },
      ],
    },
    sectionNumber: 3,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const ReadingLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'React Documentation Deep Dive',
      description: 'Comprehensive reading material covering React documentation and best practices.',
      type: 'reading',
      estimatedTime: 25,
      knowledgePoints: mockKnowledgePoints.map(kp => ({
        ...kp,
        proficiency: 50,
      })),
    },
    sectionNumber: 2,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const BeginnerDifficulty: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Getting Started with React',
      description: 'Perfect for beginners - learn React from scratch with simple examples.',
      difficulty: 'beginner',
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 20 },
        { ...mockKnowledgePoints[1], proficiency: 10 },
      ],
    },
    sectionNumber: 1,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const IntermediateDifficulty: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'State Management Patterns',
      description: 'Intermediate concepts for managing application state effectively.',
      difficulty: 'intermediate',
      type: 'video',
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 65 },
        { ...mockKnowledgePoints[1], proficiency: 70 },
        { ...mockKnowledgePoints[2], proficiency: 60 },
      ],
    },
    sectionNumber: 2,
    lessonNumber: 2,
    isLocked: false,
  },
}

export const AdvancedDifficulty: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Advanced React Patterns',
      description: 'Master complex React patterns and architectural decisions.',
      difficulty: 'advanced',
      type: 'interactive',
      estimatedTime: 60,
      knowledgePoints: mockKnowledgePoints.map(kp => ({
        ...kp,
        proficiency: 90,
      })),
    },
    sectionNumber: 5,
    lessonNumber: 3,
    isLocked: false,
  },
}

export const LowProficiency: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Introduction to JSX',
      description: 'Understanding JSX syntax and how it works under the hood.',
      knowledgePoints: mockKnowledgePoints.map(kp => ({
        ...kp,
        proficiency: 10,
      })),
    },
    sectionNumber: 1,
    lessonNumber: 2,
    isLocked: false,
  },
}

export const HighProficiency: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'React Best Practices',
      description: 'You\'ve mastered this topic! Review the best practices anytime.',
      knowledgePoints: mockKnowledgePoints.map(kp => ({
        ...kp,
        proficiency: 95,
      })),
      difficulty: 'intermediate',
    },
    sectionNumber: 4,
    lessonNumber: 5,
    isLocked: false,
  },
}

export const ManyKnowledgePoints: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Comprehensive React Guide',
      description: 'A complete guide covering all aspects of React development.',
      knowledgePoints: [
        { id: 'kp1', title: 'Components', description: 'React components', proficiency: 80 },
        { id: 'kp2', title: 'Props', description: 'Component props', proficiency: 75 },
        { id: 'kp3', title: 'State', description: 'Component state', proficiency: 70 },
        { id: 'kp4', title: 'Hooks', description: 'React hooks', proficiency: 65 },
        { id: 'kp5', title: 'Context', description: 'Context API', proficiency: 60 },
        { id: 'kp6', title: 'Routing', description: 'React Router', proficiency: 55 },
        { id: 'kp7', title: 'Forms', description: 'Form handling', proficiency: 50 },
      ],
      estimatedTime: 90,
      difficulty: 'advanced',
    },
    sectionNumber: 6,
    lessonNumber: 1,
    isLocked: false,
  },
}

export const ShortLesson: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Quick React Tips',
      description: 'Five-minute tips to improve your React code.',
      estimatedTime: 5,
      knowledgePoints: [mockKnowledgePoints[0]],
      type: 'video',
    },
    sectionNumber: 1,
    lessonNumber: 3,
    isLocked: false,
  },
}

// Interactive story showing state changes
export const InteractiveStateChanges: Story = {
  args: {
    lesson: {
      ...baseLessonData,
      title: 'Interactive Lesson Demo',
      description: 'Click the button to see the modal interaction. This lesson demonstrates all available game types.',
      knowledgePoints: [
        { ...mockKnowledgePoints[0], proficiency: 45 },
        { ...mockKnowledgePoints[1], proficiency: 50 },
        { ...mockKnowledgePoints[2], proficiency: 40 },
      ],
      availableGameTypes: ['written-material', 'audio-material', 'video', 'flashcards', 'millionaire', 'jeopardy', 'connect-cards'],
      type: 'interactive',
      difficulty: 'intermediate',
    },
    sectionNumber: 2,
    lessonNumber: 5,
    isLocked: false,
    onStartLesson: (lessonId) => {
      console.log(`Starting lesson with game type: ${lessonId}`)
      alert(`Starting lesson with game type: ${lessonId}`)
    },
  },
}

// Grid layout example
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'React Basics',
          knowledgePoints: mockKnowledgePoints.map(kp => ({ ...kp, proficiency: 0 })),
        }}
        sectionNumber={1}
        lessonNumber={1}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'Component State',
          type: 'video',
          knowledgePoints: mockKnowledgePoints.map(kp => ({ ...kp, proficiency: 50 })),
        }}
        sectionNumber={1}
        lessonNumber={2}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'Advanced Patterns',
          difficulty: 'advanced',
          knowledgePoints: mockKnowledgePoints.map(kp => ({ ...kp, proficiency: 85 })),
        }}
        sectionNumber={1}
        lessonNumber={3}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'Performance Tips',
          type: 'interactive',
          knowledgePoints: mockKnowledgePoints.map(kp => ({ ...kp, proficiency: 100 })),
        }}
        sectionNumber={1}
        lessonNumber={4}
        isLocked={false}
      />
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'Testing React Apps',
          type: 'quiz',
        }}
        sectionNumber={1}
        lessonNumber={5}
        isLocked={true}
      />
      <LessonCard
        lesson={{
          ...baseLessonData,
          title: 'Deployment Guide',
          difficulty: 'intermediate',
        }}
        sectionNumber={1}
        lessonNumber={6}
        isLocked={true}
      />
    </div>
  ),
}