'use client'

import { use } from 'react'
import { TestInterface } from '@/components/test-interface'

interface TestPageProps {
  params: Promise<{
    courseId: string
    testId: string
  }>
}

export default function TestPage({ params }: TestPageProps) {
  const { courseId, testId } = use(params)

  return (
    <TestInterface 
      courseId={courseId} 
      testId={testId} 
    />
  )
}