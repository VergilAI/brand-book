'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgressAPI } from '@/app/lms/new_course_overview/api/progress-api'
import { courseAPI } from '@/app/lms/new_course_overview/api/course-api'

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const runDebugTest = async () => {
    if (isRunning) return
    setIsRunning(true)
    
    console.log('🔧 MANUAL DEBUG TEST STARTING...')
    console.log('='.repeat(60))
    
    const lessonId = 'lesson-1-1'
    const courseId = 'course-1'
    
    try {
      // Clear existing data first
      console.log('🧹 Clearing existing progress data...')
      localStorage.removeItem(`lesson_progress_${lessonId}`)
      localStorage.removeItem(`user-progress-${courseId}`)
      
      // Test the connect cards completion
      const testResults = [
        { pairId: 'match-0', isCorrect: true, attempts: 1 },
        { pairId: 'match-1', isCorrect: false, attempts: 2 },
        { pairId: 'match-2', isCorrect: true, attempts: 1 }
      ]
      
      console.log('🎯 Step 1: Testing processConnectCardsCompletion...')
      console.log('Test results:', testResults)
      
      const result = await ProgressAPI.processConnectCardsCompletion(lessonId, testResults)
      console.log('✅ Result:', result)
      
      // Check localStorage after processing
      console.log('\n📂 Step 2: Checking localStorage after processing...')
      const lessonData = localStorage.getItem(`lesson_progress_${lessonId}`)
      const courseData = localStorage.getItem(`user-progress-${courseId}`)
      
      console.log('Lesson data:', lessonData ? JSON.parse(lessonData) : '❌ NOT FOUND')
      console.log('Course data:', courseData ? JSON.parse(courseData) : '❌ NOT FOUND')
      
      // Test course loading
      console.log('\n📚 Step 3: Testing course loading with merge...')
      const course = await courseAPI.getCourse(courseId)
      
      console.log('Course loaded:', course)
      
      // Check specific lesson knowledge points
      const lesson = course.chapters[0].lessons[0] // lesson-1-1
      console.log('\n🎯 Step 4: Checking lesson knowledge points:')
      lesson.knowledgePoints.forEach(kp => {
        console.log(`📈 ${kp.id} (${kp.title}): ${kp.proficiency}%`)
      })
      
      // Manual event dispatch test
      console.log('\n📡 Step 5: Testing manual event dispatch...')
      let eventReceived = false
      const handler = (event: CustomEvent) => {
        console.log('✅ Event received:', event.detail)
        eventReceived = true
      }
      
      window.addEventListener('courseProgressUpdated', handler as EventListener)
      window.dispatchEvent(new CustomEvent('courseProgressUpdated', { 
        detail: { courseId, lessonId } 
      }))
      
      setTimeout(() => {
        console.log(`Event system: ${eventReceived ? '✅ Working' : '❌ Failed'}`)
        window.removeEventListener('courseProgressUpdated', handler as EventListener)
        
        console.log('\n🎉 MANUAL TEST COMPLETE!')
        console.log('='.repeat(60))
        setIsRunning(false)
      }, 500)
      
    } catch (error) {
      console.error('❌ Debug test failed:', error)
      setIsRunning(false)
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          🐛 Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 bg-white shadow-xl border-2 border-red-500">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-600">Debug Panel</h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={runDebugTest}
              disabled={isRunning}
              className="w-full bg-red-500 text-white hover:bg-red-600"
              size="sm"
            >
              {isRunning ? '🔄 Running...' : '🧪 Test Progress System'}
            </Button>
            
            <Button
              onClick={() => {
                localStorage.removeItem('lesson_progress_lesson-1-1')
                localStorage.removeItem('user-progress-course-1')
                console.log('🧹 Cleared all progress data')
                window.location.reload()
              }}
              variant="outline"
              className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
              size="sm"
            >
              🗑️ Clear & Reload
            </Button>
            
            <Button
              onClick={() => {
                console.log('📂 Current localStorage:')
                console.log('Lesson:', localStorage.getItem('lesson_progress_lesson-1-1'))
                console.log('Course:', localStorage.getItem('user-progress-course-1'))
              }}
              variant="outline"
              className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              size="sm"
            >
              📂 Check Storage
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            Check browser console for detailed logs
          </div>
        </div>
      </Card>
    </div>
  )
}