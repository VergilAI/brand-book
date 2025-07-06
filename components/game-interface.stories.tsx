import type { Meta, StoryObj } from '@storybook/react'
import { GameInterface } from './game-interface'
import { useState } from 'react'
import { Button } from './button'

const meta = {
  title: 'LMS/GameInterface',
  component: GameInterface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive game interface component for educational games in the LMS system. Supports multiple game types, difficulty levels, and state management.',
      },
    },
  },
  argTypes: {
    courseId: {
      description: 'The ID of the course containing this game',
      control: 'text',
    },
    gameId: {
      description: 'The unique identifier for this game',
      control: 'text',
    },
    gameType: {
      description: 'The type of game being played',
      control: 'select',
      options: ['matching', 'quiz', 'puzzle', 'drag-drop'],
    },
    title: {
      description: 'The title of the game',
      control: 'text',
    },
    description: {
      description: 'A brief description of the game',
      control: 'text',
    },
    difficulty: {
      description: 'The difficulty level of the game',
      control: 'select',
      options: ['easy', 'medium', 'hard'],
    },
    onExit: {
      description: 'Callback function when the user exits the game',
      action: 'exited',
    },
  },
} satisfies Meta<typeof GameInterface>

export default meta
type Story = StoryObj<typeof meta>

// Default story showing the game interface in its initial state
export const Default: Story = {
  args: {
    courseId: 'ai-fundamentals',
    gameId: 'concepts-matching',
    gameType: 'matching',
    title: 'AI Concepts Matching Game',
    description: 'Match AI concepts with their definitions',
    difficulty: 'medium',
  },
}

// Loading state story
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when the game is initializing',
      },
    },
  },
}

// Ready state with instructions
export const Ready: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the ready state with game instructions',
      },
    },
  },
  render: (args) => {
    // Force the component to stay in ready state
    const [key, setKey] = useState(0)
    return (
      <div>
        <GameInterface {...args} key={key} />
        <Button 
          onClick={() => setKey(k => k + 1)}
          className="fixed bottom-4 right-4 z-[1001]"
        >
          Reset to Ready State
        </Button>
      </div>
    )
  },
}

// Playing state
export const Playing: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the game in active playing state',
      },
    },
  },
  render: (args) => {
    return <GameInterface {...args} />
  },
}

// Paused state
export const Paused: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the game in paused state with overlay',
      },
    },
  },
  render: (args) => {
    return <GameInterface {...args} />
  },
}

// Completed state
export const Completed: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the game completion screen with score and statistics',
      },
    },
  },
  render: (args) => {
    return <GameInterface {...args} />
  },
}

// Different game types
export const QuizGame: Story = {
  args: {
    ...Default.args,
    gameType: 'quiz',
    title: 'Machine Learning Quiz',
    description: 'Test your knowledge of machine learning concepts',
  },
}

export const PuzzleGame: Story = {
  args: {
    ...Default.args,
    gameType: 'puzzle',
    title: 'Neural Network Puzzle',
    description: 'Solve puzzles to understand neural network architectures',
  },
}

export const DragDropGame: Story = {
  args: {
    ...Default.args,
    gameType: 'drag-drop',
    title: 'Algorithm Sorting Challenge',
    description: 'Drag and drop algorithms to their correct categories',
  },
}

// Different difficulty levels
export const EasyDifficulty: Story = {
  args: {
    ...Default.args,
    difficulty: 'easy',
    title: 'Beginner AI Concepts',
    description: 'A gentle introduction to AI concepts for beginners',
  },
  parameters: {
    docs: {
      description: {
        story: 'Easy difficulty: 5 lives, 50 points per match, generous time bonus',
      },
    },
  },
}

export const MediumDifficulty: Story = {
  args: {
    ...Default.args,
    difficulty: 'medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium difficulty: 3 lives, 100 points per match, moderate time bonus',
      },
    },
  },
}

export const HardDifficulty: Story = {
  args: {
    ...Default.args,
    difficulty: 'hard',
    title: 'Advanced AI Challenge',
    description: 'Test your expertise with advanced AI concepts',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hard difficulty: 1 life, 200 points per match, high time bonus',
      },
    },
  },
}

// Sound variations
export const SoundEnabled: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with sound enabled (default state)',
      },
    },
  },
}

export const SoundDisabled: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with sound disabled - click the sound button to toggle',
      },
    },
  },
}

// Score and lives variations
export const HighScore: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with high score and streak bonus',
      },
    },
  },
  render: (args) => {
    return <GameInterface {...args} />
  },
}

export const LowLives: Story = {
  args: {
    ...Default.args,
    difficulty: 'hard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with only one life remaining (hard difficulty)',
      },
    },
  },
}

// Interactive story showing state transitions
export const InteractiveDemo: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing all game states. The game will automatically progress through loading → ready → playing states. Click "Complete Game (Demo)" to see the completion screen.',
      },
    },
  },
  render: (args) => {
    const [showGame, setShowGame] = useState(false)
    const [gameKey, setGameKey] = useState(0)

    if (!showGame) {
      return (
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-lg">
          <div className="text-center space-y-lg">
            <h2 className="text-2xl font-bold text-text-primary">
              Interactive Game Demo
            </h2>
            <p className="text-text-secondary max-w-md">
              This demo will show you all the game states. The game will automatically
              progress from loading to ready state, then you can start playing.
            </p>
            <Button 
              onClick={() => setShowGame(true)}
              className="btn-primary"
              size="lg"
            >
              Launch Game
            </Button>
          </div>
        </div>
      )
    }

    return (
      <>
        <GameInterface 
          {...args} 
          key={gameKey}
          onExit={() => {
            setShowGame(false)
            setGameKey(k => k + 1)
          }}
        />
      </>
    )
  },
}

// Custom exit handler
export const WithCustomExit: Story = {
  args: {
    ...Default.args,
    onExit: () => {
      alert('Custom exit handler called!')
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with a custom exit handler that shows an alert',
      },
    },
  },
}

// Mobile responsive view
export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Game interface optimized for mobile devices',
      },
    },
  },
}

// Tablet responsive view
export const TabletView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Game interface optimized for tablet devices',
      },
    },
  },
}

// Long game title and description
export const LongContent: Story = {
  args: {
    ...Default.args,
    title: 'Advanced Machine Learning and Deep Neural Network Architecture Matching Challenge',
    description: 'An comprehensive educational game designed to test your understanding of complex machine learning algorithms, deep neural network architectures, and their practical applications in real-world scenarios',
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with long title and description to test text overflow handling',
      },
    },
  },
}

// Different course contexts
export const DataScienceCourse: Story = {
  args: {
    courseId: 'data-science-101',
    gameId: 'statistics-quiz',
    gameType: 'quiz',
    title: 'Statistics Fundamentals Quiz',
    description: 'Test your understanding of statistical concepts',
    difficulty: 'medium',
  },
}

export const CybersecurityCourse: Story = {
  args: {
    courseId: 'cybersecurity-basics',
    gameId: 'encryption-puzzle',
    gameType: 'puzzle',
    title: 'Encryption Methods Puzzle',
    description: 'Solve puzzles to learn about encryption techniques',
    difficulty: 'hard',
  },
}

// Edge cases
export const MinimalProps: Story = {
  args: {
    courseId: 'test-course',
    gameId: 'test-game',
  },
  parameters: {
    docs: {
      description: {
        story: 'Game with only required props, using all default values',
      },
    },
  },
}