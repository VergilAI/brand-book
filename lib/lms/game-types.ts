import { 
  FileText, 
  Volume2, 
  Video, 
  Link, 
  Layers, 
  DollarSign, 
  Zap, 
  Clock, 
  Timer, 
  List, 
  FileEdit, 
  Type, 
  Hash, 
  Grid3x3, 
  Shuffle, 
  Puzzle, 
  Map, 
  Bot, 
  MessageSquare, 
  Briefcase, 
  Users, 
  Gamepad2, 
  Trophy, 
  Home,
  Gavel
} from 'lucide-react'

export interface GameType {
  id: string
  name: string
  description: string
  icon: any
  category: 'content' | 'quiz' | 'game' | 'chat' | 'test'
  requiresAI?: boolean
  hasRewards?: boolean
  isTimed?: boolean
}

export const gameTypes: GameType[] = [
  // Content Types
  {
    id: 'written-material',
    name: 'Written Material',
    description: 'Read comprehensive text content',
    icon: FileText,
    category: 'content'
  },
  {
    id: 'audio-material',
    name: 'Audio Material',
    description: 'Have content read out loud',
    icon: Volume2,
    category: 'content'
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Watch educational videos',
    icon: Video,
    category: 'content'
  },
  {
    id: 'user-linked',
    name: 'User Linked Content',
    description: 'Content linked by users',
    icon: Link,
    category: 'content'
  },

  // Quiz Games
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Classic flashcard learning',
    icon: Layers,
    category: 'quiz'
  },
  {
    id: 'millionaire',
    name: 'Who Wants to Be a Millionaire',
    description: 'Win in-game currency with progressive questions',
    icon: DollarSign,
    category: 'quiz',
    hasRewards: true
  },
  {
    id: 'jeopardy',
    name: 'Jeopardy Game',
    description: 'Answer in question format to win rewards',
    icon: Trophy,
    category: 'quiz',
    hasRewards: true
  },
  {
    id: 'speed-rounds',
    name: 'Speed Rounds',
    description: 'Timed rounds of multiple choice questions',
    icon: Zap,
    category: 'quiz',
    isTimed: true
  },

  // Test Types
  {
    id: 'timed-test',
    name: 'Timed Test',
    description: 'Complete test within time limit',
    icon: Clock,
    category: 'test',
    isTimed: true
  },
  {
    id: 'untimed-test',
    name: 'Untimed Test',
    description: 'Take your time to complete',
    icon: Timer,
    category: 'test'
  },

  // Game Types
  {
    id: 'crossword',
    name: 'Crossword Puzzles',
    description: 'Solve knowledge-based crosswords',
    icon: Grid3x3,
    category: 'game'
  },
  {
    id: 'concept-matching',
    name: 'Concept Matching',
    description: 'Match related concepts together',
    icon: Shuffle,
    category: 'game'
  },
  {
    id: 'connect-cards',
    name: 'Connect Cards',
    description: 'Duolingo-style card matching game',
    icon: Puzzle,
    category: 'game'
  },
  {
    id: 'odd-one-out',
    name: 'Odd One Out',
    description: 'Identify which concept doesn\'t belong',
    icon: Puzzle,
    category: 'game'
  },
  {
    id: 'territory-conquest',
    name: 'Territory Conquest',
    description: 'Conquer territories by answering questions',
    icon: Map,
    category: 'game',
    requiresAI: true
  },
  {
    id: 'optimized-territory-map',
    name: 'Optimized Territory Map',
    description: 'Efficient border-based territory system',
    icon: Map,
    category: 'game',
    requiresAI: true
  },

  // Chat Based Games
  {
    id: 'case-study',
    name: 'Case Study Chat',
    description: 'Analyze real-world scenarios',
    icon: Briefcase,
    category: 'chat',
    requiresAI: true
  },
  {
    id: 'open-chat',
    name: 'Open Topic Chat',
    description: 'Explore topics through conversation',
    icon: MessageSquare,
    category: 'chat',
    requiresAI: true
  },
  {
    id: 'role-playing',
    name: 'Role Playing Game',
    description: 'Learn through character interactions',
    icon: Gamepad2,
    category: 'chat',
    requiresAI: true
  },
  {
    id: 'shark-tank',
    name: 'Shark Tank Format',
    description: 'Pitch ideas and defend concepts',
    icon: Users,
    category: 'chat',
    requiresAI: true
  },
  {
    id: 'escape-room',
    name: 'Escape Room',
    description: 'Solve knowledge-based puzzles to escape',
    icon: Home,
    category: 'chat',
    requiresAI: true
  },
  {
    id: 'debate',
    name: 'Debate Tournament',
    description: 'Argue positions on topics',
    icon: Gavel,
    category: 'chat',
    requiresAI: true
  }
]

export interface AnswerType {
  id: string
  name: string
  description: string
  icon: any
}

export const answerTypes: AnswerType[] = [
  {
    id: 'mcq',
    name: 'Multiple Choice',
    description: 'Select from multiple options',
    icon: List
  },
  {
    id: 'long-answer',
    name: 'Long Answer',
    description: 'Detailed written response',
    icon: FileEdit
  },
  {
    id: 'short-answer',
    name: 'Short Answer',
    description: 'Brief written response',
    icon: Type
  },
  {
    id: 'one-word',
    name: 'One Word Answer',
    description: 'Single word response',
    icon: Hash
  }
]

export interface KnowledgePoint {
  id: string
  title: string
  description: string
  proficiency: number // 0-100
}

export interface Lesson {
  id: string
  title: string
  description: string
  knowledgePoints: KnowledgePoint[]
  availableGameTypes: string[] // IDs of available game types
  estimatedTime: number // in minutes
}

export interface Section {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  sections: Section[]
  totalLessons: number
  totalKnowledgePoints: number
}