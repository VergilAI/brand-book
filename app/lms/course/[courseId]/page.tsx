'use client'

import { useState, use } from 'react'
import { LMSHeader } from '@/components/lms/lms-header'
import { LMSSidebar } from '@/components/lms/lms-sidebar'
import { CourseDetail } from '@/components/lms/course-detail'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default function CoursePage({ params }: CoursePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { courseId } = use(params)

  return (
    <div className="min-h-screen bg-white">
      <LMSHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView="course"
      />
      
      <div className="flex">
        <LMSSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView="course"
        />
        
        <main className="flex-1 lg:pl-0">
          <div className="p-6">
            <CourseDetail courseId={courseId} />
          </div>
        </main>
      </div>
    </div>
  )
}