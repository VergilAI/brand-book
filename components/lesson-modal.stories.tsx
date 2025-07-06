import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LessonModal } from './lesson-modal'
import { Button } from './button'
import type { Lesson } from '@/lib/lms/game-types'

const meta: Meta<typeof LessonModal> = {
  title: 'LMS/LessonModal',
  component: LessonModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A modal component for displaying lesson details, available learning activities, and progress tracking.'
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls the visibility of the modal'
    },
    onClose: {
      action: 'onClose',
      description: 'Callback when the modal is closed'
    },
    onSelectGame: {
      action: 'onSelectGame',
      description: 'Callback when a game type is selected'
    }
  }
}

export default meta
type Story = StoryObj<typeof LessonModal>

// Sample lesson data with varying proficiency levels
const sampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Introduction to React Hooks',
  description: 'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks',
  estimatedTime: 45,
  availableGameTypes: [
    'written-material',
    'video',
    'flashcards',
    'millionaire',
    'jeopardy',
    'connect-cards'
  ],
  knowledgePoints: [
    {
      id: 'kp-1',
      title: 'Understanding useState',
      description: 'Learn how to manage component state with the useState hook',
      proficiency: 85
    },
    {
      id: 'kp-2',
      title: 'Using useEffect',
      description: 'Master side effects and lifecycle methods with useEffect',
      proficiency: 65
    },
    {
      id: 'kp-3',
      title: 'Creating Custom Hooks',
      description: 'Build reusable logic with custom React hooks',
      proficiency: 45
    },
    {
      id: 'kp-4',
      title: 'Hook Rules and Best Practices',
      description: 'Follow React Hook rules and implement best practices',
      proficiency: 30
    }
  ]
}

// Helper component to wrap modal with state
const ModalWrapper = ({ 
  lesson, 
  initialOpen = false,
  ...props 
}: { 
  lesson: Lesson
  initialOpen?: boolean
  onSelectGame?: (gameTypeId: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <>
      <div className="min-h-screen bg-bg-secondary p-8 flex items-center justify-center">
        <Button 
          onClick={() => setIsOpen(true)}
          size="lg"
          className="mx-auto"
        >
          Open Lesson Modal
        </Button>
      </div>
      <LessonModal
        lesson={lesson}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectGame={props.onSelectGame}
      />
    </>
  )
}

// Default modal open story
export const DefaultOpen: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: sampleLesson
  }
}

// Modal with high proficiency (mastered)
export const MasteredLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced TypeScript patterns and techniques',
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 85 + Math.random() * 15 // 85-100%
      }))
    }
  }
}

// Modal with low proficiency (new lesson)
export const NewLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Getting Started with GraphQL',
      description: 'An introduction to GraphQL APIs and schema design',
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: Math.random() * 20 // 0-20%
      }))
    }
  }
}

// Modal with mixed proficiency levels
export const MixedProgress: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: sampleLesson
  }
}

// Modal with limited game types (content only)
export const ContentOnlyLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Reading: The History of JavaScript',
      description: 'Explore the evolution of JavaScript from its inception to modern ES6+',
      availableGameTypes: ['written-material', 'audio-material', 'video']
    }
  }
}

// Modal with quiz games only
export const QuizOnlyLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Quick Assessment: React Concepts',
      description: 'Test your knowledge of React fundamentals',
      estimatedTime: 15,
      availableGameTypes: ['flashcards', 'connect-cards']
    }
  }
}

// Modal with interactive games
export const InteractiveGamesLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Game Time: JavaScript Challenges',
      description: 'Learn JavaScript through fun, interactive games',
      availableGameTypes: ['millionaire', 'jeopardy', 'connect-cards']
    }
  }
}

// Modal with many knowledge points
export const ManyKnowledgePoints: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Comprehensive CSS Grid Layout',
      description: 'Master every aspect of CSS Grid with detailed examples',
      estimatedTime: 90,
      knowledgePoints: [
        {
          id: 'kp-1',
          title: 'Grid Container Properties',
          description: 'Understanding display: grid and container properties',
          proficiency: 75
        },
        {
          id: 'kp-2',
          title: 'Grid Item Properties',
          description: 'Positioning and sizing grid items',
          proficiency: 60
        },
        {
          id: 'kp-3',
          title: 'Grid Lines and Areas',
          description: 'Working with named lines and grid areas',
          proficiency: 45
        },
        {
          id: 'kp-4',
          title: 'Auto-placement Algorithm',
          description: 'How CSS Grid automatically places items',
          proficiency: 30
        },
        {
          id: 'kp-5',
          title: 'Responsive Grid Layouts',
          description: 'Creating responsive designs with Grid',
          proficiency: 55
        },
        {
          id: 'kp-6',
          title: 'Grid vs Flexbox',
          description: 'When to use Grid vs Flexbox',
          proficiency: 80
        },
        {
          id: 'kp-7',
          title: 'Subgrid Features',
          description: 'Using CSS Subgrid for nested layouts',
          proficiency: 20
        },
        {
          id: 'kp-8',
          title: 'Grid Animations',
          description: 'Animating grid layouts and transitions',
          proficiency: 15
        }
      ]
    }
  }
}

// Modal with short lesson (single knowledge point)
export const ShortLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Quick Tip: Array Destructuring',
      description: 'Learn how to use array destructuring in JavaScript',
      estimatedTime: 10,
      knowledgePoints: [
        {
          id: 'kp-1',
          title: 'Array Destructuring Syntax',
          description: 'Extract values from arrays into distinct variables',
          proficiency: 0
        }
      ]
    }
  }
}

// Modal showing progress tab
export const ProgressTabView: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedTab, setSelectedTab] = useState<'games' | 'progress'>('progress')
    
    return (
      <>
        <div className="min-h-screen bg-bg-secondary p-8 flex items-center justify-center">
          <Button 
            onClick={() => {
              setIsOpen(true)
              setSelectedTab('progress')
            }}
            size="lg"
            className="mx-auto"
          >
            Open Modal (Progress Tab)
          </Button>
        </div>
        <LessonModal
          lesson={sampleLesson}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    )
  },
  args: {
    lesson: sampleLesson
  }
}

// Modal with completed lesson (100% proficiency)
export const CompletedLesson: Story = {
  render: (args) => <ModalWrapper {...args} initialOpen={true} />,
  args: {
    lesson: {
      ...sampleLesson,
      title: 'Completed: Basic HTML Elements',
      description: 'You have mastered all HTML elements!',
      knowledgePoints: sampleLesson.knowledgePoints.map(kp => ({
        ...kp,
        proficiency: 100
      }))
    }
  }
}

// Modal with loading simulation
export const LoadingState: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 2000)
    
    if (isLoading) {
      return (
        <div className="min-h-screen bg-bg-secondary p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border-brand mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading lesson data...</p>
          </div>
        </div>
      )
    }
    
    return (
      <LessonModal
        lesson={sampleLesson}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    )
  },
  args: {
    lesson: sampleLesson
  }
}

// Interactive example with game selection
export const InteractiveExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedGame, setSelectedGame] = useState<string | null>(null)
    
    return (
      <>
        <div className="min-h-screen bg-bg-secondary p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Interactive Lesson Modal Example</h1>
            <p className="text-text-secondary mb-8">
              Click the button to open the modal and select a learning activity.
            </p>
            
            <Button 
              onClick={() => setIsOpen(true)}
              size="lg"
              className="mb-8"
            >
              Open Lesson Modal
            </Button>
            
            {selectedGame && (
              <div className="bg-bg-primary rounded-lg p-6 border border-border-default">
                <h2 className="text-lg font-semibold mb-2">Selected Game:</h2>
                <p className="text-text-brand font-medium">{selectedGame}</p>
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <LessonModal
          lesson={sampleLesson}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectGame={(gameId) => {
            setSelectedGame(gameId)
            setIsOpen(false)
          }}
        />
      </>
    )
  }
}

// Modal with different sizes demonstration
export const ResponsiveSizes: Story = {
  render: () => {
    const [modalSize, setModalSize] = useState<'default' | 'small' | 'large'>('default')
    const [isOpen, setIsOpen] = useState(false)
    
    const lessonBySize = {
      small: {
        ...sampleLesson,
        title: 'Quick Lesson',
        knowledgePoints: sampleLesson.knowledgePoints.slice(0, 2),
        availableGameTypes: ['flashcards', 'written-material']
      },
      default: sampleLesson,
      large: {
        ...sampleLesson,
        title: 'Comprehensive Course Module',
        knowledgePoints: [...sampleLesson.knowledgePoints, ...sampleLesson.knowledgePoints],
        availableGameTypes: [
          'written-material',
          'video',
          'audio-material',
          'flashcards',
          'millionaire',
          'jeopardy',
          'connect-cards'
        ]
      }
    }
    
    return (
      <>
        <div className="min-h-screen bg-bg-secondary p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Modal Size Examples</h1>
            <div className="flex gap-4 mb-8">
              <Button
                onClick={() => {
                  setModalSize('small')
                  setIsOpen(true)
                }}
                variant="secondary"
              >
                Small Content
              </Button>
              <Button
                onClick={() => {
                  setModalSize('default')
                  setIsOpen(true)
                }}
                variant="secondary"
              >
                Default Content
              </Button>
              <Button
                onClick={() => {
                  setModalSize('large')
                  setIsOpen(true)
                }}
                variant="secondary"
              >
                Large Content
              </Button>
            </div>
          </div>
        </div>
        
        <LessonModal
          lesson={lessonBySize[modalSize]}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    )
  }
}