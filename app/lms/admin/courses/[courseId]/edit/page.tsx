'use client'

import { use } from 'react'
import { CourseBuilder } from '@/components/lms/admin/course-builder'

interface EditCoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = use(params)
  
  return <CourseBuilder courseId={courseId} />
}