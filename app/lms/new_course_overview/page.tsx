'use client'

import { LMSHeader } from '@/components/lms/lms-header'
import { NewCourseOverview } from '@/components/lms/new-course-overview'
import { useCourseData } from './hooks/useCourseData'

export default function NewCourseOverviewPage() {
  // Load course data from JSON files
  const { course, loading, error } = useCourseData('course-1')

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <LMSHeader currentView="course" />
      
      <main className="w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vergil-purple mx-auto mb-4"></div>
              <p className="text-vergil-off-black/60">Loading course data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Course</h2>
              <p className="text-vergil-off-black/60">{error}</p>
            </div>
          </div>
        ) : (
          <NewCourseOverview course={course || undefined} />
        )}
      </main>
    </div>
  )
}