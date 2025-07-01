export interface KnowledgePoint {
  id: string
  title: string
  description: string
  proficiency: number // 0-100 percentage
}

export interface Lesson {
  id: string
  title: string
  description: string
  knowledgePoints: KnowledgePoint[]
  availableGameTypes: string[] // IDs of available game types from game-types.ts
  estimatedTime: number // in minutes
  completed: boolean
}

export interface Chapter {
  id: string
  title: string
  description: string
  order: number
  progress: number // 0-100 percentage
  estimatedTime: string // human readable like "2 hours"
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  totalLessons: number
  completedLessons: number
  progress: number // 0-100 percentage
  chapters: Chapter[]
}

export interface FilterState {
  chapters: string[]
  completionStatus: string[]
  knowledgePoints: string[]
}

export interface SortState {
  field: string | null
  direction: 'asc' | 'desc' | null
}

// Extended lesson type for filtered views that includes chapter context
export interface LessonWithChapter extends Lesson {
  chapterTitle: string
  chapterId: string
  chapterOrder: number
}