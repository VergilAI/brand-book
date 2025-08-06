export type ProcessingStep = 
  | 'upload'
  | 'extracting'
  | 'analyzing'
  | 'structuring'
  | 'generating'
  | 'complete'

export type GameType = 
  | 'flashcards'
  | 'millionaire' 
  | 'jeopardy'
  | 'connectCards'
  | 'test'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface ExtractedContent {
  raw: {
    text: string
    images: Array<{
      id: string
      url: string
      caption?: string
    }>
    tables: Array<{
      id: string
      headers: string[]
      rows: string[][]
    }>
  }
  structured: {
    title: string
    chapters: Chapter[]
    glossary: Term[]
    learningObjectives: string[]
  }
  metadata: {
    totalPages: number
    wordCount: number
    estimatedReadingTime: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    topics: string[]
    language: string
  }
}

export interface Chapter {
  id: string
  title: string
  content: string
  sections: Section[]
  keyPoints: string[]
  suggestedQuestions: number
  order: number
}

export interface Section {
  id: string
  title: string
  content: string
  subsections?: Section[]
}

export interface Term {
  term: string
  definition: string
  context?: string
}

export interface CourseModule {
  id: string
  title: string
  description: string
  learningObjectives: string[]
  content: {
    material: string
    summary: string
    keyPoints: string[]
  }
  activities: {
    flashcards?: FlashcardSet
    millionaire?: MillionaireQuestion[]
    jeopardy?: JeopardyCategory[]
    connectCards?: ConnectPair[]
    testId?: string // Reference to test created via /lms/tests/create
    testQuestions?: any[] // Questions generated via AI modal
  }
  estimatedDuration: number // in minutes
  order: number
}

export interface FlashcardSet {
  id: string
  cards: Flashcard[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  hint?: string
}

export interface MillionaireQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  difficulty: number // 1-15
  explanation?: string
}

export interface JeopardyCategory {
  name: string
  questions: JeopardyQuestion[]
}

export interface JeopardyQuestion {
  id: string
  clue: string
  answer: string
  value: 100 | 200 | 300 | 400 | 500
}

export interface ConnectPair {
  id: string
  left: string
  right: string
  category?: string
}

export interface GeneratedCourse {
  id: string
  title: string
  description: string
  sourceFiles: UploadedFile[]
  modules: CourseModule[]
  metadata: {
    totalDuration: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    topics: string[]
    createdAt: Date
    updatedAt: Date
  }
  status: 'draft' | 'published'
}

export interface PersonalizationSettings {
  targetAudience: string
  tone: string
  difficulty: string
  additionalGuidelines: string
  learningObjectives: string
}

export interface CourseGeneratorState {
  currentStep: ProcessingStep
  uploadedFiles: UploadedFile[]
  extractedContent: ExtractedContent | null
  generatedCourse: GeneratedCourse | null
  personalizationSettings?: PersonalizationSettings
  isProcessing: boolean
  error: string | null
}