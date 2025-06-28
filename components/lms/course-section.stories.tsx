import type { Meta, StoryObj } from '@storybook/react'
import { CourseSection } from './course-section'
import type { Section } from '@/lib/lms/game-types'

const meta: Meta<typeof CourseSection> = {
  title: 'LMS/CourseSection',
  component: CourseSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Expandable section component containing multiple lessons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'Whether the section is expanded',
    },
    sectionNumber: {
      control: 'number',
      description: 'Section number for display',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleSection: Section = {
  id: 'section-1',
  title: 'Introduction to AI & Machine Learning',
  description: 'Master the fundamentals of artificial intelligence and machine learning through interactive lessons.',
  order: 1,
  lessons: [
    {
      id: 'lesson-1',
      title: 'What is Artificial Intelligence?',
      description: 'Explore the history, concepts, and applications of AI.',
      estimatedTime: 20,
      availableGameTypes: ['written-material', 'video', 'flashcards', 'millionaire'],
      knowledgePoints: [
        {
          id: 'kp-1-1',
          title: 'AI Definition',
          description: 'Understanding what AI means',
          proficiency: 100
        },
        {
          id: 'kp-1-2',
          title: 'History of AI',
          description: 'Key milestones in AI development',
          proficiency: 85
        },
        {
          id: 'kp-1-3',
          title: 'AI Applications',
          description: 'Real-world uses of AI',
          proficiency: 90
        }
      ]
    },
    {
      id: 'lesson-2',
      title: 'Machine Learning Basics',
      description: 'Learn the fundamental concepts of machine learning.',
      estimatedTime: 30,
      availableGameTypes: ['written-material', 'flashcards', 'speed-rounds', 'concept-matching'],
      knowledgePoints: [
        {
          id: 'kp-2-1',
          title: 'ML Fundamentals',
          description: 'Core concepts of machine learning',
          proficiency: 70
        },
        {
          id: 'kp-2-2',
          title: 'Supervised Learning',
          description: 'Learning with labeled data',
          proficiency: 65
        },
        {
          id: 'kp-2-3',
          title: 'Unsupervised Learning',
          description: 'Learning patterns in unlabeled data',
          proficiency: 40
        }
      ]
    },
    {
      id: 'lesson-3',
      title: 'Neural Networks Introduction',
      description: 'Discover how neural networks work and their applications.',
      estimatedTime: 45,
      availableGameTypes: ['written-material', 'video', 'role-playing', 'escape-room'],
      knowledgePoints: [
        {
          id: 'kp-3-1',
          title: 'Neural Network Architecture',
          description: 'Understanding layers and neurons',
          proficiency: 0
        },
        {
          id: 'kp-3-2',
          title: 'Activation Functions',
          description: 'How neurons process information',
          proficiency: 0
        },
        {
          id: 'kp-3-3',
          title: 'Training Process',
          description: 'Backpropagation and optimization',
          proficiency: 0
        }
      ]
    }
  ]
}

export const Default: Story = {
  args: {
    section: sampleSection,
    sectionNumber: 1,
    isExpanded: true,
  },
}

export const Collapsed: Story = {
  args: {
    section: sampleSection,
    sectionNumber: 1,
    isExpanded: false,
  },
}

export const CompletedSection: Story = {
  args: {
    section: {
      ...sampleSection,
      lessons: sampleSection.lessons.map(lesson => ({
        ...lesson,
        knowledgePoints: lesson.knowledgePoints.map(kp => ({
          ...kp,
          proficiency: 95
        }))
      }))
    },
    sectionNumber: 1,
    isExpanded: true,
  },
}

export const NewSection: Story = {
  args: {
    section: {
      ...sampleSection,
      lessons: sampleSection.lessons.map(lesson => ({
        ...lesson,
        knowledgePoints: lesson.knowledgePoints.map(kp => ({
          ...kp,
          proficiency: 0
        }))
      }))
    },
    sectionNumber: 2,
    isExpanded: true,
  },
}

export const MultipleSections: Story = {
  render: () => {
    const sections = [
      sampleSection,
      {
        ...sampleSection,
        id: 'section-2',
        title: 'Deep Learning & Advanced Concepts',
        description: 'Dive deeper into complex neural networks and cutting-edge AI techniques.',
        order: 2,
      },
      {
        ...sampleSection,
        id: 'section-3',
        title: 'Practical AI Applications',
        description: 'Apply your knowledge to real-world problems and projects.',
        order: 3,
      }
    ]
    
    return (
      <div className="space-y-4 p-8 bg-mist-gray/5">
        {sections.map((section, index) => (
          <CourseSection
            key={section.id}
            section={section}
            sectionNumber={index + 1}
            isExpanded={index === 0}
            onStartLesson={(lessonId, gameTypeId) => {
              console.log(`Starting lesson ${lessonId} with game ${gameTypeId}`)
            }}
          />
        ))}
      </div>
    )
  },
}