import type { Meta, StoryObj } from '@storybook/react'
import { MillionaireGame } from './millionaire-game'

const meta = {
  title: 'LMS/Millionaire Game',
  component: MillionaireGame,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MillionaireGame>

export default meta
type Story = StoryObj<typeof meta>

const sampleQuestions = [
  {
    id: '1',
    question: 'What is the primary function of a neural network\'s activation function?',
    answers: {
      A: 'To store weights',
      B: 'To introduce non-linearity',
      C: 'To reduce overfitting',
      D: 'To initialize parameters'
    },
    correctAnswer: 'B' as const,
    difficulty: 1
  },
  {
    id: '2',
    question: 'Which programming paradigm does JavaScript primarily support?',
    answers: {
      A: 'Only object-oriented',
      B: 'Only functional',
      C: 'Multi-paradigm',
      D: 'Only procedural'
    },
    correctAnswer: 'C' as const,
    difficulty: 2
  },
  {
    id: '3',
    question: 'What does the "S" in SOLID principles stand for?',
    answers: {
      A: 'Single Responsibility',
      B: 'Structured Programming',
      C: 'System Design',
      D: 'Software Architecture'
    },
    correctAnswer: 'A' as const,
    difficulty: 3
  },
  {
    id: '4',
    question: 'In React, what is the purpose of the useEffect hook?',
    answers: {
      A: 'To manage state',
      B: 'To handle side effects',
      C: 'To optimize performance',
      D: 'To create context'
    },
    correctAnswer: 'B' as const,
    difficulty: 4
  },
  {
    id: '5',
    question: 'What is the time complexity of binary search?',
    answers: {
      A: 'O(n)',
      B: 'O(n²)',
      C: 'O(log n)',
      D: 'O(1)'
    },
    correctAnswer: 'C' as const,
    difficulty: 5
  },
  {
    id: '6',
    question: 'Which HTTP status code indicates "Not Found"?',
    answers: {
      A: '400',
      B: '404',
      C: '500',
      D: '503'
    },
    correctAnswer: 'B' as const,
    difficulty: 6
  },
  {
    id: '7',
    question: 'What design pattern is commonly used in Redux?',
    answers: {
      A: 'Singleton',
      B: 'Observer',
      C: 'Flux',
      D: 'Factory'
    },
    correctAnswer: 'C' as const,
    difficulty: 7
  },
  {
    id: '8',
    question: 'In machine learning, what does "overfitting" mean?',
    answers: {
      A: 'Model performs poorly on training data',
      B: 'Model memorizes training data too well',
      C: 'Model has too few parameters',
      D: 'Model trains too quickly'
    },
    correctAnswer: 'B' as const,
    difficulty: 8
  },
  {
    id: '9',
    question: 'What is the purpose of a Docker container?',
    answers: {
      A: 'Version control',
      B: 'Code compilation',
      C: 'Application isolation',
      D: 'Database management'
    },
    correctAnswer: 'C' as const,
    difficulty: 9
  },
  {
    id: '10',
    question: 'Which algorithm is commonly used for recommendation systems?',
    answers: {
      A: 'Quicksort',
      B: 'Collaborative filtering',
      C: 'Binary search',
      D: 'Depth-first search'
    },
    correctAnswer: 'B' as const,
    difficulty: 10
  },
  {
    id: '11',
    question: 'What does CAP theorem deal with in distributed systems?',
    answers: {
      A: 'Consistency, Availability, Partition tolerance',
      B: 'Caching, Authentication, Performance',
      C: 'Concurrency, Atomicity, Persistence',
      D: 'Clustering, Analytics, Processing'
    },
    correctAnswer: 'A' as const,
    difficulty: 11
  },
  {
    id: '12',
    question: 'In cryptography, what type of encryption uses the same key for encryption and decryption?',
    answers: {
      A: 'Asymmetric',
      B: 'Symmetric',
      C: 'Hashing',
      D: 'Public key'
    },
    correctAnswer: 'B' as const,
    difficulty: 12
  },
  {
    id: '13',
    question: 'What is the main advantage of GraphQL over REST?',
    answers: {
      A: 'Faster execution',
      B: 'Better security',
      C: 'Query flexibility',
      D: 'Simpler implementation'
    },
    correctAnswer: 'C' as const,
    difficulty: 13
  },
  {
    id: '14',
    question: 'Which consensus algorithm does Bitcoin use?',
    answers: {
      A: 'Proof of Stake',
      B: 'Proof of Work',
      C: 'Delegated Proof of Stake',
      D: 'Proof of Authority'
    },
    correctAnswer: 'B' as const,
    difficulty: 14
  },
  {
    id: '15',
    question: 'What is the theoretical limit of quantum supremacy in qubits?',
    answers: {
      A: 'Around 50 qubits',
      B: 'Exactly 100 qubits',
      C: 'Over 1000 qubits',
      D: 'Under 20 qubits'
    },
    correctAnswer: 'A' as const,
    difficulty: 15
  }
]

export const Default: Story = {
  args: {
    questions: sampleQuestions,
    onGameEnd: (winnings, status) => {
      console.log(`Game ended with status: ${status}, winnings: $${winnings}`)
    }
  },
}

export const ShortGame: Story = {
  args: {
    questions: sampleQuestions.slice(0, 5),
    onGameEnd: (winnings, status) => {
      console.log(`Game ended with status: ${status}, winnings: $${winnings}`)
    }
  },
}

export const InContainer: Story = {
  args: {
    questions: sampleQuestions,
    className: 'max-w-7xl mx-auto',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-br from-mist-gray/5 to-stone-gray/10 p-8">
        <Story />
      </div>
    ),
  ],
}