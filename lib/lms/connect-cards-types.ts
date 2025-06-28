export interface ConnectCard {
  id: string
  content: string
  matchId: string
  side: 'left' | 'right'
  type: 'text' | 'image'
  hint?: string
  category?: string
}

export interface ConnectCardsPair {
  matchId: string
  leftCard: ConnectCard
  rightCard: ConnectCard
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface ConnectCardsGameState {
  selectedLeftCard: ConnectCard | null
  selectedRightCard: ConnectCard | null
  matchedPairs: Set<string>
  currentAttempt: { left: ConnectCard; right: ConnectCard } | null
  correctAnswers: number
  incorrectAnswers: number
  isCheckingMatch: boolean
  gameCompleted: boolean
  startTime: number
  endTime?: number
}

export interface ConnectCardsGameResult {
  correctAnswers: number
  incorrectAnswers: number
  totalPairs: number
  completionTime: number
  accuracy: number
  score: number
}

export interface ConnectCardsDeck {
  id: string
  title: string
  description: string
  pairs: ConnectCardsPair[]
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // in minutes
  knowledgePoints: string[]
  lessonId: string
}

// Sample data for different subjects
export const sampleLanguagePairs: ConnectCardsPair[] = [
  {
    matchId: 'hello',
    leftCard: {
      id: 'en-hello',
      content: 'Hello',
      matchId: 'hello',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-hello',
      content: 'Hola',
      matchId: 'hello',
      side: 'right',
      type: 'text'
    },
    category: 'greetings',
    difficulty: 'easy'
  },
  {
    matchId: 'goodbye',
    leftCard: {
      id: 'en-goodbye',
      content: 'Goodbye',
      matchId: 'goodbye',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-goodbye',
      content: 'Adiós',
      matchId: 'goodbye',
      side: 'right',
      type: 'text'
    },
    category: 'greetings',
    difficulty: 'easy'
  },
  {
    matchId: 'thank-you',
    leftCard: {
      id: 'en-thanks',
      content: 'Thank you',
      matchId: 'thank-you',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'es-thanks',
      content: 'Gracias',
      matchId: 'thank-you',
      side: 'right',
      type: 'text'
    },
    category: 'politeness',
    difficulty: 'easy'
  }
]

export const sampleMathPairs: ConnectCardsPair[] = [
  {
    matchId: 'equation1',
    leftCard: {
      id: 'eq1-question',
      content: '2 + 3 = ?',
      matchId: 'equation1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq1-answer',
      content: '5',
      matchId: 'equation1',
      side: 'right',
      type: 'text'
    },
    category: 'basic-arithmetic',
    difficulty: 'easy'
  },
  {
    matchId: 'equation2',
    leftCard: {
      id: 'eq2-question',
      content: '7 × 8 = ?',
      matchId: 'equation2',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'eq2-answer',
      content: '56',
      matchId: 'equation2',
      side: 'right',
      type: 'text'
    },
    category: 'multiplication',
    difficulty: 'medium'
  }
]

export const sampleSciencePairs: ConnectCardsPair[] = [
  {
    matchId: 'element1',
    leftCard: {
      id: 'h2o-formula',
      content: 'H₂O',
      matchId: 'element1',
      side: 'left',
      type: 'text'
    },
    rightCard: {
      id: 'h2o-name',
      content: 'Water',
      matchId: 'element1',
      side: 'right',
      type: 'text'
    },
    category: 'chemistry',
    difficulty: 'easy'
  },
  {
    matchId: 'planet1',
    leftCard: {
      id: 'mars-name',
      content: 'Mars',
      matchId: 'planet1',
      side: 'left',
      type: 'text',
      hint: 'The Red Planet'
    },
    rightCard: {
      id: 'mars-position',
      content: '4th planet from Sun',
      matchId: 'planet1',
      side: 'right',
      type: 'text'
    },
    category: 'astronomy',
    difficulty: 'medium'
  }
]

export const sampleDecks: ConnectCardsDeck[] = [
  {
    id: 'spanish-greetings',
    title: 'Spanish Greetings',
    description: 'Learn basic Spanish greeting phrases',
    pairs: sampleLanguagePairs,
    subject: 'Spanish',
    difficulty: 'easy',
    estimatedTime: 3,
    knowledgePoints: ['basic-spanish', 'greetings', 'vocabulary'],
    lessonId: 'spanish-101-lesson-1'
  },
  {
    id: 'basic-math',
    title: 'Basic Math Operations',
    description: 'Practice fundamental arithmetic operations',
    pairs: sampleMathPairs,
    subject: 'Mathematics',
    difficulty: 'easy',
    estimatedTime: 5,
    knowledgePoints: ['arithmetic', 'basic-math', 'equations'],
    lessonId: 'math-101-lesson-2'
  },
  {
    id: 'science-fundamentals',
    title: 'Science Fundamentals',
    description: 'Connect scientific concepts and formulas',
    pairs: sampleSciencePairs,
    subject: 'Science',
    difficulty: 'medium',
    estimatedTime: 4,
    knowledgePoints: ['chemistry', 'astronomy', 'scientific-notation'],
    lessonId: 'science-101-lesson-3'
  }
]