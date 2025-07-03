'use client'

import { use } from 'react'
import { LessonViewer } from '@/components/lesson-viewer'

interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = use(params)

  return (
    <LessonViewer 
      courseId={courseId} 
      lessonId={lessonId} 
    />
  )
}