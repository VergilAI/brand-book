'use client'

import { LMSHeader } from '@/components/lms/lms-header'
import { NewCourseOverview } from '@/components/lms/new-course-overview'

export default function NewCourseOverviewPage() {
  return (
    <div className="min-h-screen bg-vergil-off-white">
      <LMSHeader currentView="course" />
      
      <main className="w-full">
        <NewCourseOverview />
      </main>
    </div>
  )
}