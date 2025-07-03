'use client'

import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Clock, 
  CheckCircle, 
  FileText, 
  Download, 
  Play, 
  Pause,
  Volume2,
  Maximize,
  Home
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'

interface LessonViewerProps {
  courseId: string
  lessonId: string
}

interface Lesson {
  id: string
  title: string
  content: string
  type: 'lesson' | 'test' | 'game' | 'material'
  duration: string
  progress: number
  completed: boolean
  materials: {
    id: string
    title: string
    type: 'pdf' | 'video' | 'link'
    url: string
  }[]
  nextLesson?: {
    id: string
    title: string
  }
  previousLesson?: {
    id: string
    title: string
  }
}

interface Course {
  id: string
  title: string
  progress: number
}

export function LessonViewer({ courseId, lessonId }: LessonViewerProps) {
  const [lessonProgress, setLessonProgress] = useState(45)
  const [videoPlaying, setVideoPlaying] = useState(false)

  // Mock data
  const course: Course = {
    id: courseId,
    title: 'Cybersecurity Awareness Training',
    progress: 65
  }

  const lesson: Lesson = {
    id: lessonId,
    title: 'What is Information Security?',
    content: `
      <h2>Introduction to Information Security</h2>
      
      <p>Information Security (INFOSEC) is the practice of protecting information from unauthorized access, use, disclosure, disruption, modification, or destruction. In healthcare organizations, this protection extends to both technical systems and the sensitive data they contain, including personally identifiable information (PII) and protected health information (PHI).</p>
      
      <h3>The CIA Triad</h3>
      
      <p>Information security is built on three fundamental principles known as the CIA triad:</p>
      
      <ul>
        <li><strong>Confidentiality:</strong> Ensuring that information is accessible only to those authorized to have access. This prevents unauthorized disclosure of sensitive data.</li>
        <li><strong>Integrity:</strong> Maintaining the accuracy, completeness, and reliability of information. This ensures data hasn't been altered or corrupted without authorization.</li>
        <li><strong>Availability:</strong> Ensuring that authorized users have access to information and associated assets when required. This means systems and data must be accessible when needed.</li>
      </ul>
      
      <h3>Real-World Example: Banking ATM Security</h3>
      
      <p>Consider how a banking ATM demonstrates the CIA triad:</p>
      
      <ul>
        <li><strong>Confidentiality:</strong> PIN numbers are encrypted and not displayed on screen</li>
        <li><strong>Integrity:</strong> Transaction amounts cannot be altered once confirmed</li>
        <li><strong>Availability:</strong> The ATM must be operational 24/7 for customer access</li>
      </ul>
      
      <h3>Threats, Vulnerabilities, and Risk</h3>
      
      <p>Understanding these key concepts is essential:</p>
      
      <ul>
        <li><strong>Threat:</strong> Any potential danger that could exploit a vulnerability (natural disasters, cyber attacks, human error)</li>
        <li><strong>Vulnerability:</strong> A weakness in a system, procedure, or control that could be exploited</li>
        <li><strong>Risk:</strong> The potential for loss or damage when a threat exploits a vulnerability</li>
      </ul>
      
      <p><strong>Risk Formula:</strong> Threat × Vulnerability = Risk</p>
      
      <blockquote>
        "Security is not a product, but a process. It's a series of practices and behaviors that protect against threats." - Bruce Schneier, Security Technologist
      </blockquote>
      
      <h3>Security Controls Framework</h3>
      
      <p>Organizations implement three types of security controls:</p>
      
      <ul>
        <li><strong>Management Controls:</strong> Policies, procedures, risk assessments, and compliance frameworks</li>
        <li><strong>Operational Controls:</strong> Security awareness training, personnel security, and physical security measures</li>
        <li><strong>Technical Controls:</strong> Firewalls, encryption, access controls, and monitoring systems</li>
      </ul>
      
      <h3>Looking Forward</h3>
      
      <p>As we progress through this cybersecurity awareness training, you'll learn practical ways to apply these concepts in your daily work. Remember, everyone in the organization plays a crucial role in maintaining information security.</p>
    `,
    type: 'lesson',
    duration: '15 min',
    progress: 45,
    completed: false,
    materials: [
      {
        id: 'mat-1',
        title: 'CIA Triad Reference Guide',
        type: 'pdf',
        url: '/materials/cia-triad-guide.pdf'
      },
      {
        id: 'mat-2',
        title: 'NIST Cybersecurity Framework',
        type: 'link',
        url: 'https://www.nist.gov/cyberframework'
      },
      {
        id: 'mat-3',
        title: 'Information Security Basics Video',
        type: 'video',
        url: '/videos/infosec-intro.mp4'
      }
    ],
    nextLesson: {
      id: 'lesson-1-2',
      title: 'Threats and Vulnerabilities'
    },
    previousLesson: undefined
  }

  const breadcrumbs = [
    { title: 'Dashboard', href: '/lms' },
    { title: course.title, href: `/lms/course/${courseId}` },
    { title: lesson.title, href: '#' }
  ]

  const handleMarkComplete = () => {
    setLessonProgress(100)
    // Handle lesson completion logic
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText
      case 'video':
        return Play
      case 'link':
        return FileText
      default:
        return FileText
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            <div className="text-sm text-muted-foreground">
              {breadcrumbs.map((item, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                    {item.title}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              {lesson.duration}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Progress</span>
              <div className="w-24">
                <Progress value={lessonProgress} className="h-2" />
              </div>
              <span className="text-sm">{lessonProgress}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 max-w-4xl mx-auto p-6">
          <div className="space-y-8">
            {/* Lesson header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cosmic-purple to-electric-violet rounded-lg flex items-center justify-center">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{lesson.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">Lesson</Badge>
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span>{course.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video player placeholder */}
            {lesson.materials.some(m => m.type === 'video') && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20" />
                  <Button
                    size="lg"
                    className="bg-white/90 text-black hover:bg-white z-10"
                    onClick={() => setVideoPlaying(!videoPlaying)}
                  >
                    {videoPlaying ? (
                      <Pause className="h-6 w-6 mr-2" />
                    ) : (
                      <Play className="h-6 w-6 mr-2" />
                    )}
                    {videoPlaying ? 'Pause' : 'Play'} Video
                  </Button>
                  
                  {/* Video controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Progress value={30} className="h-1" />
                    </div>
                    <span className="text-sm">2:34 / 8:45</span>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Lesson content */}
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </CardContent>
            </Card>

            {/* Associated materials */}
            {lesson.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {lesson.materials.map((material) => {
                      const Icon = getMaterialIcon(material.type)
                      return (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{material.title}</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {material.type}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            {material.type === 'link' ? 'Open' : 'Download'}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-gray-50 p-6">
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted-foreground/20"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${lessonProgress}, 100`}
                        className="text-cosmic-purple"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{lessonProgress}%</span>
                    </div>
                  </div>
                  
                  {lessonProgress < 100 ? (
                    <Button 
                      onClick={handleMarkComplete}
                      className="w-full bg-cosmic-purple hover:bg-cosmic-purple/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lesson.previousLesson && (
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">Previous</div>
                      <div className="font-medium truncate">{lesson.previousLesson.title}</div>
                    </div>
                  </Button>
                )}
                
                {lesson.nextLesson && (
                  <Button 
                    className="w-full justify-start bg-cosmic-purple hover:bg-cosmic-purple/90"
                    disabled={lessonProgress < 100}
                  >
                    <div className="text-left flex-1">
                      <div className="text-xs opacity-90">Next</div>
                      <div className="font-medium truncate">{lesson.nextLesson.title}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{course.title}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Keep learning to improve your progress!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}