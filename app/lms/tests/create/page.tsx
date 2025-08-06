"use client"

import { TestCreator } from '@/components/test-creator'
import { useSearchParams } from 'next/navigation'

export default function CreateTestPage() {
  const searchParams = useSearchParams()
  const fromCourseGenerator = searchParams.get('from') === 'course-generator'
  const returnStep = searchParams.get('step') || 'generating'

  return (
    <div className="min-h-screen bg-secondary"> {/* #F5F5F7 */}
      <TestCreator 
        fromCourseGenerator={fromCourseGenerator}
        returnStep={returnStep}
      />
    </div>
  )
}