'use client'

import { useState, useEffect } from 'react'
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
  Home,
  Video,
  FileQuestion,
  Sparkles,
  BookOpen,
  X,
  Minimize
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'

interface LessonViewerProps {
  courseId: string
  lessonId: string
  onClose?: () => void
}

interface Lesson {
  id: string
  title: string
  content: string
  type: 'lesson' | 'test' | 'game' | 'material' | 'video' | 'quiz' | 'interactive'
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

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video
    case 'quiz':
      return FileQuestion
    case 'interactive':
      return Sparkles
    default:
      return BookOpen
  }
}

export function LessonViewer({ courseId, lessonId, onClose }: LessonViewerProps) {
  const [lessonProgress, setLessonProgress] = useState(45)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const LessonIcon = getLessonIcon(lesson.type)

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setLessonProgress(prev => Math.min(prev + 0.5, 95))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-[var(--spacing-lg)] py-[var(--spacing-md)]">
          <div className="flex items-center gap-[var(--spacing-md)]">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Home className="h-4 w-4 mr-[var(--spacing-sm)]" />
              Back to Course
            </Button>
            <div className="text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
              {breadcrumbs.map((item, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-[var(--spacing-sm)]">/</span>}
                  <span className={cn(
                    index === breadcrumbs.length - 1 && "text-[var(--text-primary)] font-[var(--font-weight-medium)]"
                  )}>
                    {item.title}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[var(--spacing-md)]">
            <div className="flex items-center gap-[var(--spacing-xs)] text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
              <Clock className="h-4 w-4" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-[var(--spacing-sm)]">
              <span className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">Progress</span>
              <div className="w-24">
                <Progress value={lessonProgress} className="h-2" />
              </div>
              <span className="text-[var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--text-brand)]">
                {lessonProgress}%
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 max-w-4xl mx-auto p-[var(--spacing-lg)]">
          <div className="space-y-[var(--spacing-xl)]">
            {/* Lesson header */}
            <div className="space-y-[var(--spacing-md)]">
              <div className="flex items-center gap-[var(--spacing-md)]">
                <div className="w-12 h-12 bg-[var(--gradient-consciousness)] rounded-[var(--radius-lg)] flex items-center justify-center shadow-brand-sm">
                  <LessonIcon className="h-6 w-6 text-[var(--text-inverse)]" />
                </div>
                <div>
                  <h1 className="text-[var(--font-size-3xl)] font-[var(--font-weight-bold)] text-[var(--text-primary)]">
                    {lesson.title}
                  </h1>
                  <div className="flex items-center gap-[var(--spacing-md)] text-[var(--font-size-sm)] text-[var(--text-tertiary)]">
                    <Badge variant="secondary" className="text-[var(--font-size-xs)]">
                      {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                    </Badge>
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span>{course.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video player placeholder */}
            {lesson.materials.some(m => m.type === 'video') && (
              <Card variant="neural" className="overflow-hidden">
                <div className="aspect-video bg-[var(--bg-inverse)] flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-[var(--gradient-ambient)]" />
                  <Button
                    size="lg"
                    className="bg-[var(--bg-primary)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-primary)] z-10 shadow-lg"
                    onClick={() => setVideoPlaying(!videoPlaying)}
                  >
                    {videoPlaying ? (
                      <Pause className="h-6 w-6 mr-[var(--spacing-sm)]" />
                    ) : (
                      <Play className="h-6 w-6 mr-[var(--spacing-sm)]" />
                    )}
                    {videoPlaying ? 'Pause' : 'Play'} Video
                  </Button>
                  
                  {/* Video controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-[var(--spacing-md)] bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]">
                    <div className="flex items-center gap-[var(--spacing-md)] text-[var(--text-inverse)]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[var(--text-inverse)] hover:bg-white/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Progress value={30} className="h-1 bg-white/20" />
                      </div>
                      <span className="text-[var(--font-size-sm)]">2:34 / 8:45</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[var(--text-inverse)] hover:bg-white/20"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-4 w-4" />
                        ) : (
                          <Maximize className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Lesson content */}
            <Card variant="default">
              <CardContent className="p-[var(--spacing-xl)]">
                <div 
                  className="prose prose-lg max-w-none 
                    prose-headings:text-[var(--text-primary)]
                    prose-p:text-[var(--text-secondary)]
                    prose-strong:text-[var(--text-emphasis)]
                    prose-ul:text-[var(--text-secondary)]
                    prose-blockquote:text-[var(--text-tertiary)]
                    prose-blockquote:border-[var(--border-brand)]
                    prose-blockquote:bg-[var(--bg-brandLight)]
                    prose-blockquote:rounded-[var(--radius-md)]
                    prose-blockquote:px-[var(--spacing-md)]
                    prose-blockquote:py-[var(--spacing-sm)]
                  "
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </CardContent>
            </Card>

            {/* Associated materials */}
            {lesson.materials.length > 0 && (
              <Card variant="feature">
                <CardHeader>
                  <CardTitle className="text-[var(--font-size-xl)]">Additional Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-[var(--spacing-md)]">
                    {lesson.materials.map((material) => {
                      const Icon = getMaterialIcon(material.type)
                      return (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-[var(--spacing-md)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-default)] transition-all duration-[var(--duration-normal)] group"
                        >
                          <div className="flex items-center gap-[var(--spacing-md)]">
                            <div className="w-10 h-10 bg-[var(--bg-emphasis)] rounded-[var(--radius-md)] flex items-center justify-center group-hover:bg-[var(--gradient-consciousness)] group-hover:text-[var(--text-inverse)] transition-all duration-[var(--duration-normal)]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-[var(--font-weight-medium)] text-[var(--text-primary)]">
                                {material.title}
                              </div>
                              <div className="text-[var(--font-size-sm)] text-[var(--text-tertiary)] capitalize">
                                {material.type}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="group-hover:border-[var(--border-brand)] group-hover:text-[var(--text-brand)]"
                          >
                            <Download className="h-4 w-4 mr-[var(--spacing-sm)]" />
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
        <aside className="w-80 border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-[var(--spacing-lg)]">
          <div className="space-y-[var(--spacing-lg)]">
            {/* Progress */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="text-[var(--font-size-lg)]">Lesson Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-[var(--spacing-md)]">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-[var(--border-subtle)]"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#progress-gradient)"
                        strokeWidth="2"
                        strokeDasharray={`${lessonProgress}, 100`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progress-gradient" gradientTransform="rotate(90)">
                          <stop offset="0%" stopColor="var(--color-purple-600)" />
                          <stop offset="50%" stopColor="var(--color-purple-500)" />
                          <stop offset="100%" stopColor="var(--color-purple-300)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--text-brand)]">
                        {lessonProgress}%
                      </span>
                    </div>
                  </div>
                  
                  {lessonProgress < 100 ? (
                    <Button 
                      onClick={handleMarkComplete}
                      className="w-full bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)] shadow-brand-sm hover:shadow-brand-md"
                    >
                      <CheckCircle className="h-4 w-4 mr-[var(--spacing-sm)]" />
                      Mark as Complete
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-[var(--spacing-sm)] text-[var(--text-success)]">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-[var(--font-weight-medium)]">Completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[var(--font-size-lg)]">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-[var(--spacing-sm)]">
                {lesson.previousLesson && (
                  <Button variant="secondary" className="w-full justify-start group">
                    <ChevronLeft className="h-4 w-4 mr-[var(--spacing-sm)] group-hover:-translate-x-1 transition-transform duration-[var(--duration-normal)]" />
                    <div className="text-left">
                      <div className="text-[var(--font-size-xs)] text-[var(--text-tertiary)]">Previous</div>
                      <div className="font-[var(--font-weight-medium)] truncate">{lesson.previousLesson.title}</div>
                    </div>
                  </Button>
                )}
                
                {lesson.nextLesson && (
                  <Button 
                    className="w-full justify-start bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)] group"
                    disabled={lessonProgress < 100}
                  >
                    <div className="text-left flex-1">
                      <div className="text-[var(--font-size-xs)] opacity-90">Next</div>
                      <div className="font-[var(--font-weight-medium)] truncate">{lesson.nextLesson.title}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-[var(--spacing-sm)] group-hover:translate-x-1 transition-transform duration-[var(--duration-normal)]" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course progress */}
            <Card variant="feature">
              <CardHeader>
                <CardTitle className="text-[var(--font-size-lg)]">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-[var(--spacing-sm)]">
                  <div className="flex items-center justify-between text-[var(--font-size-sm)]">
                    <span className="text-[var(--text-secondary)] truncate flex-1">{course.title}</span>
                    <span className="font-[var(--font-weight-medium)] text-[var(--text-brand)]">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="text-[var(--font-size-xs)] text-[var(--text-tertiary)]">
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