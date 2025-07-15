'use client'

import { useState } from 'react'
import { LMSHeader } from '@/components/lms-header'
import { CourseOverviewNew } from '@/components/organism/course-overview-new'
import { useCourseData } from './hooks/useCourseData'
import { Loader2 } from 'lucide-react'

export default function NewCourseOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { course, loading, error } = useCourseData('ai-fundamentals')

  return (
    <div className="min-h-screen bg-bg-primary"> {/* #FFFFFF */}
      <LMSHeader 
        currentView="course" 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <main className="w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center space-y-spacing-md"> {/* 16px */}
              <Loader2 className="h-12 w-12 animate-spin text-text-brand mx-auto" /> {/* #7B00FF */}
              <p className="text-text-secondary text-base"> {/* #6C6C6D, 16px */}
                Loading course data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center space-y-spacing-md"> {/* 16px */}
              <h2 className="text-xl font-semibold text-text-error"> {/* #E51C23 */}
                Error Loading Course
              </h2>
              <p className="text-text-secondary max-w-md"> {/* #6C6C6D */}
                {error}
              </p>
            </div>
          </div>
        ) : (
          <CourseOverviewNew course={course || undefined} />
        )}
      </main>
    </div>
  )
}