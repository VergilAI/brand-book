import { apiClient } from './base-client'
import { authAPI } from './auth'

export interface CourseRecommendation {
  next_lesson_id: number | null
  next_lesson_name: string | null
  next_chapter_name: string | null
  reason: string
  course_progress: number
}

class RecommendationsAPI {
  // Get course recommendations for a user
  async getCourseRecommendations(courseId: string): Promise<CourseRecommendation> {
    const user = authAPI.getStoredUser()
    if (!user || !user.id) {
      throw new Error('User not authenticated')
    }

    return apiClient.get<CourseRecommendation>(
      `/api/v1/users/${user.id}/courses/${courseId}/recommendations`
    )
  }

  // Transform recommendation for frontend use
  transformRecommendation(recommendation: CourseRecommendation) {
    return {
      hasNextLesson: recommendation.next_lesson_id !== null,
      nextLessonId: recommendation.next_lesson_id?.toString() || null,
      nextLessonName: recommendation.next_lesson_name,
      nextChapterName: recommendation.next_chapter_name,
      reason: recommendation.reason,
      courseProgress: recommendation.course_progress,
      isCompleted: recommendation.course_progress === 100
    }
  }
}

export const recommendationsAPI = new RecommendationsAPI()