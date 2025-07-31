import { apiClient } from './base-client'

// Course Structure Types
export interface KnowledgePointResponse {
  id: number
  name: string
  description: string
  proficiency: number
}

export interface LessonResponse {
  id: number
  name: string
  description: string
  order: number
  completed: boolean
  knowledge_points: KnowledgePointResponse[]
}

export interface ChapterResponse {
  id: number
  name: string
  description: string
  order: number
  progress: number
  lessons: LessonResponse[]
}

export interface CourseResponse {
  id: number
  name: string
  description: string
  category: string
  difficulty: string
  duration: number
  progress: number
  completed_lessons: number
  total_lessons: number
  chapters: ChapterResponse[]
}

// API Client for Course Structure
class CourseStructureAPI {
  // Get course by ID with full structure
  async getCourse(courseId: number): Promise<CourseResponse> {
    return apiClient.get<CourseResponse>(`/api/v1/courses/${courseId}`)
  }

  // Get all courses for a user
  async getUserCourses(): Promise<CourseResponse[]> {
    return apiClient.get<CourseResponse[]>('/api/v1/courses')
  }

  // Get specific chapter
  async getChapter(courseId: number, chapterId: number): Promise<ChapterResponse> {
    return apiClient.get<ChapterResponse>(`/api/v1/courses/${courseId}/chapters/${chapterId}`)
  }

  // Get specific lesson
  async getLesson(courseId: number, chapterId: number, lessonId: number): Promise<LessonResponse> {
    return apiClient.get<LessonResponse>(`/api/v1/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`)
  }

  // Update lesson progress
  async updateLessonProgress(
    courseId: number,
    chapterId: number,
    lessonId: number,
    data: {
      completed?: boolean
      knowledge_point_updates?: Array<{ id: number; proficiency: number }>
    }
  ): Promise<{
    success: boolean
    lesson: LessonResponse
    chapter_progress: number
    course_progress: number
  }> {
    return apiClient.put(
      `/api/v1/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/progress`,
      data
    )
  }

  // Transform backend response to frontend format
  transformCourse(response: CourseResponse): any {
    return {
      id: response.id.toString(),
      title: response.name,
      description: response.description,
      category: response.category,
      difficulty: response.difficulty,
      duration: response.duration,
      progress: response.progress,
      completedLessons: response.completed_lessons,
      totalLessons: response.total_lessons,
      chapters: response.chapters.map(chapter => ({
        id: chapter.id.toString(),
        title: chapter.name,
        description: chapter.description,
        progress: chapter.progress,
        lessons: chapter.lessons.map(lesson => ({
          id: lesson.id.toString(),
          title: lesson.name,
          description: lesson.description,
          completed: lesson.completed,
          knowledgePoints: lesson.knowledge_points.map(kp => ({
            id: kp.id.toString(),
            title: kp.name,
            description: kp.description,
            proficiency: kp.proficiency
          }))
        }))
      }))
    }
  }
}

export const courseStructureAPI = new CourseStructureAPI()