'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Clock,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { Card } from '@/components/card'
import { cn } from '@/lib/utils'

export default function CoursesPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }
  const courses = [
    {
      id: 1,
      title: 'Cybersecurity Awareness Training',
      description: 'Learn essential cybersecurity practices to protect yourself and your organization from digital threats.',
      nextLesson: 'Module 4: Social Engineering',
      progress: 65,
      dueDate: '2025-08-15',
      color: 'purple',
      totalLessons: 8,
      completedLessons: 5,
      estimatedTime: '4 hours remaining'
    },
    {
      id: 2,
      title: 'AI Security & Governance',
      description: 'Understand the security implications and governance frameworks for AI systems.',
      nextLesson: 'Ethics in AI Development',
      progress: 30,
      dueDate: '2025-08-20',
      color: 'blue',
      totalLessons: 6,
      completedLessons: 2,
      estimatedTime: '6 hours remaining'
    },
    {
      id: 3,
      title: 'Phishing Detection & Response',
      description: 'Master the skills to identify, prevent, and respond to phishing attacks.',
      nextLesson: 'Final Assessment',
      progress: 85,
      dueDate: '2025-07-25',
      color: 'green',
      totalLessons: 5,
      completedLessons: 4,
      estimatedTime: '1 hour remaining'
    },
    {
      id: 4,
      title: 'Network Security Fundamentals',
      description: 'Build a solid foundation in network security principles and practices.',
      nextLesson: 'Introduction to Firewalls',
      progress: 10,
      dueDate: '2025-09-01',
      color: 'orange',
      totalLessons: 10,
      completedLessons: 1,
      estimatedTime: '12 hours remaining'
    },
    {
      id: 5,
      title: 'Data Privacy & Protection',
      description: 'Learn about data privacy laws, regulations, and best practices for data protection.',
      nextLesson: 'GDPR Compliance',
      progress: 50,
      dueDate: '2025-08-25',
      color: 'indigo',
      totalLessons: 7,
      completedLessons: 3,
      estimatedTime: '5 hours remaining'
    },
    {
      id: 6,
      title: 'Incident Response Planning',
      description: 'Develop skills to create and implement effective incident response plans.',
      nextLesson: 'Creating Response Teams',
      progress: 0,
      dueDate: '2025-09-15',
      color: 'red',
      totalLessons: 6,
      completedLessons: 0,
      estimatedTime: '8 hours remaining'
    }
  ]

  const handleBackToDashboard = () => {
    window.history.back()
  }

  const handleCourseClick = (courseId: number) => {
    // Navigate to course detail page
    window.location.href = `/lms/course/${courseId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
              <p className="text-gray-600 mt-2">
                Your learning journey at a glance
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progress Overview</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                variant="interactive"
                className="h-full cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="p-6">
                  {/* Course Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      course.color === 'purple' && "bg-purple-100",
                      course.color === 'blue' && "bg-blue-100",
                      course.color === 'green' && "bg-green-100",
                      course.color === 'orange' && "bg-orange-100",
                      course.color === 'indigo' && "bg-indigo-100",
                      course.color === 'red' && "bg-red-100"
                    )}>
                      <BookOpen className={cn(
                        "h-6 w-6",
                        course.color === 'purple' && "text-purple-600",
                        course.color === 'blue' && "text-blue-600",
                        course.color === 'green' && "text-green-600",
                        course.color === 'orange' && "text-orange-600",
                        course.color === 'indigo' && "text-indigo-600",
                        course.color === 'red' && "text-red-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {course.title}
                      </h3>
                      {course.dueDate && (
                        <Badge 
                          variant={new Date(course.dueDate) < new Date() ? "destructive" : "secondary"}
                          className="mb-2"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {formatDate(course.dueDate)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Course Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Next Lesson */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Next Lesson:</p>
                    <p className="text-sm text-gray-600">{course.nextLesson}</p>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <Progress 
                      value={course.progress}
                      label="Progress"
                      showPercentage
                      size="sm"
                      className="bg-gray-200"
                      indicatorClassName={cn(
                        course.color === 'purple' && "bg-purple-600",
                        course.color === 'blue' && "bg-blue-600",
                        course.color === 'green' && "bg-green-600",
                        course.color === 'orange' && "bg-orange-600",
                        course.color === 'indigo' && "bg-indigo-600",
                        course.color === 'red' && "bg-red-600"
                      )}
                    />
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Button 
                    variant="default" 
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCourseClick(course.id)
                    }}
                  >
                    {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}