import { 
  FileText, 
  Volume2, 
  Video, 
  Layers, 
  DollarSign, 
  Trophy,
  Puzzle,
  List, 
  FileEdit, 
  Type, 
  Hash,
  MessageSquare
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
    id: 'connect-cards',
    name: 'Connect Cards',
    description: 'Duolingo-style card matching game',
    icon: Puzzle,
    category: 'quiz'
  },

  // AI Chat
  {
    id: 'ai-chat',
    name: 'AI Learning Assistant',
    description: 'Chat with an AI tutor for personalized learning',
    icon: MessageSquare,
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