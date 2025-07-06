'use client'

import { useState } from 'react'
import { LMSHeader } from '@/components/lms-header'
import { LMSSidebar } from '@/components/lms-sidebar'
import { StudentDashboard } from '@/components/student-dashboard'

export default function LMSPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'lesson'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <LMSHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
      />
      
      <div className="flex">
        <LMSSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
        />
        
        <main className="flex-1 lg:pl-0">
          <StudentDashboard />
        </main>
      </div>
    </div>
  )
}