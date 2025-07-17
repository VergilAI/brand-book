import { useState, useEffect, useCallback } from 'react'
import { Course } from '@/lib/lms/new-course-types'
import { courseAPI } from '../api/course-api'

export function useCourseData(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)

  const refreshCourse = useCallback(async () => {
    if (courseId) {
      try {
        console.log(`🔄 Refreshing course data for ${courseId}...`)
        const courseData = await courseAPI.getCourse(courseId)
        
        // Debug: Log the proficiency values after refresh
        console.log(`📊 After refresh - Knowledge Point Proficiencies:`)
        courseData.chapters[0]?.lessons[0]?.knowledgePoints?.forEach(kp => {
          console.log(`  📈 ${kp.id} (${kp.title}): ${kp.proficiency}%`)
        })
        
        setCourse(courseData)
        
        // Load user progress
        const progressData = localStorage.getItem(`user-progress-${courseId}`)
        if (progressData) {
          setUserProgress(JSON.parse(progressData))
        }
        
        console.log(`✅ Course data refreshed successfully`)
      } catch (err) {
        console.error('❌ Failed to refresh course:', err)
        setError(err instanceof Error ? err.message : 'Failed to refresh course')
      }
    }
  }, [courseId])

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        setError(null)
        const courseData = await courseAPI.getCourse(courseId)
        setCourse(courseData)
        
        // Load user progress
        const progressData = localStorage.getItem(`user-progress-${courseId}`)
        if (progressData) {
          setUserProgress(JSON.parse(progressData))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course')
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      loadCourse()
    }

    // Listen for progress updates
    const handleProgressUpdate = (event: CustomEvent) => {
      console.log('📡 Received courseProgressUpdated event:', event.detail)
      const { courseId: updatedCourseId } = event.detail
      if (updatedCourseId === courseId) {
        console.log(`🔄 Course progress updated for ${courseId}, refreshing course data...`)
        refreshCourse()
      } else {
        console.log(`ℹ️ Event was for different course: ${updatedCourseId} vs ${courseId}`)
      }
    }

    window.addEventListener('courseProgressUpdated', handleProgressUpdate as EventListener)
    
    return () => {
      window.removeEventListener('courseProgressUpdated', handleProgressUpdate as EventListener)
    }
  }, [courseId, refreshCourse])

  // Debug functions removed for now

  return { course, loading, error, userProgress, refreshCourse }
}