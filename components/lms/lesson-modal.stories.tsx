import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LessonModal } from './lesson-modal'
import type { Lesson } from '@/lib/lms/game-types'

const meta: Meta<typeof LessonModal> = {
  title: 'LMS/LessonModal',
  component: LessonModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modal for selecting learning activities and viewing lesson progress.',
      },
    },
  },
  tags: ['autodocs'],
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
    'audio-material',
    'video',
    'flashcards',
    'millionaire',
    'jeopardy',
    'speed-rounds',
    'timed-test',
    'crossword',
    'concept-matching',
    'territory-conquest',
    'case-study',
    'role-playing',
    'escape-room'
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

const InteractiveLessonModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>
        Open Lesson Modal
      </Button>
      
      <LessonModal
        lesson={sampleLesson}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectGame={(gameTypeId) => {
          console.log(`Selected game: ${gameTypeId}`)
          setIsOpen(false)
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <InteractiveLessonModal />,
}

export const NewLesson: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const newLesson = {
      ...sampleLesson,
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 0
      }))
    }
    
    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>
          Open New Lesson Modal
        </Button>
        
        <LessonModal
          lesson={newLesson}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectGame={(gameTypeId) => {
            console.log(`Selected game: ${gameTypeId}`)
            setIsOpen(false)
          }}
        />
      </div>
    )
  },
}

export const MasteredLesson: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const masteredLesson = {
      ...sampleLesson,
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 95
      }))
    }
    
    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>
          Open Mastered Lesson Modal
        </Button>
        
        <LessonModal
          lesson={masteredLesson}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectGame={(gameTypeId) => {
            console.log(`Selected game: ${gameTypeId}`)
            setIsOpen(false)
          }}
        />
      </div>
    )
  },
}

export const LimitedActivities: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const limitedLesson = {
      ...sampleLesson,
      availableGameTypes: [
        'written-material',
        'flashcards',
        'speed-rounds',
        'concept-matching'
      ]
    }
    
    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>
          Open Limited Activities Modal
        </Button>
        
        <LessonModal
          lesson={limitedLesson}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectGame={(gameTypeId) => {
            console.log(`Selected game: ${gameTypeId}`)
            setIsOpen(false)
          }}
        />
      </div>
    )
  },
}