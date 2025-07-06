'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Book, 
  FileText, 
  Gamepad2, 
  ClipboardList, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Download,
  CheckCircle,
  Circle,
  Lock,
  Calendar,
  BarChart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atomic/avatar'
import { cn } from '@/lib/utils'

interface CourseDetailProps {
  courseId: string
}

interface Lesson {
  id: string
  title: string
  type: 'lesson' | 'test' | 'game' | 'material'
  completed: boolean
  locked: boolean
  duration: string
  description: string
}

interface Section {
  id: string
  title: string
  description: string
  progress: number
  expanded: boolean
  lessons: Lesson[]
  estimatedTime: string
}

interface Course {
  id: string
  title: string
  description: string
  longDescription: string
  instructor: {
    name: string
    avatar: string
    title: string
    bio: string
  }
  thumbnail: string
  progress: number
  rating: number
  enrolledStudents: number
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  learningObjectives: string[]
  sections: Section[]
  certificate: {
    available: boolean
    earned: boolean
    title: string
  }
}

export function CourseDetail({ courseId }: CourseDetailProps) {
  // Mock course data
  const [course, setCourse] = useState<Course>({
    id: courseId,
    title: 'Cybersecurity Awareness Training',
    description: 'Comprehensive employee cybersecurity education program covering phishing, social engineering, and security best practices.',
    longDescription: 'This comprehensive cybersecurity awareness course provides healthcare professionals and employees with essential knowledge to protect information systems and sensitive data from internal and external threats. The course combines engaging content with interactive elements using the Psychological Security approach to ensure effective learning and practical application. Participants will learn to recognize, respond to, and report cybersecurity threats while building a culture of security awareness throughout the organization.',
    instructor: {
      name: 'CISO Jennifer Martinez',
      avatar: '/avatars/jennifer-martinez.jpg',
      title: 'Chief Information Security Officer',
      bio: 'Jennifer has over 15 years of experience in cybersecurity and information risk management. She holds CISSP and CISM certifications and specializes in security awareness training and incident response.'
    },
    thumbnail: '/course-thumbnails/cybersecurity-awareness.jpg',
    progress: 65,
    rating: 4.8,
    enrolledStudents: 3947,
    estimatedTime: '3 hours',
    difficulty: 'beginner',
    category: 'Cybersecurity',
    learningObjectives: [
      'Define information systems security and the CIA triad',
      'Identify federal regulations governing IT security in healthcare',
      'Recognize and respond to cybersecurity threats and phishing attacks',
      'Implement security best practices for physical and digital environments',
      'Protect personally identifiable information (PII) and protected health information (PHI)',
      'Understand encryption requirements and insider threat indicators',
      'Follow proper incident reporting procedures and apply remote work security measures'
    ],
    sections: [
      {
        id: 'section-1',
        title: 'Information Security Fundamentals',
        description: 'Get started with the basic concepts of information security and the CIA triad.',
        progress: 100,
        expanded: true,
        estimatedTime: '45 min',
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What is Information Security?',
            type: 'lesson',
            completed: true,
            locked: false,
            duration: '15 min',
            description: 'Define information security and understand the CIA triad: Confidentiality, Integrity, Availability.'
          },
          {
            id: 'lesson-1-2',
            title: 'Threats and Vulnerabilities',
            type: 'lesson',
            completed: true,
            locked: false,
            duration: '12 min',
            description: 'Identify types of security threats and understand risk assessment fundamentals.'
          },
          {
            id: 'lesson-1-3',
            title: 'Security Controls Framework',
            type: 'lesson',
            completed: true,
            locked: false,
            duration: '10 min',
            description: 'Learn about management, operational, and technical security controls.'
          },
          {
            id: 'lesson-1-4',
            title: 'Information Security Knowledge Check',
            type: 'test',
            completed: true,
            locked: false,
            duration: '8 min',
            description: 'Test your understanding of CIA triad and security control categorization.'
          }
        ]
      },
      {
        id: 'section-2',
        title: 'Federal Regulations & Organizational Governance',
        description: 'Understand healthcare-specific privacy laws and organizational security governance.',
        progress: 60,
        expanded: false,
        estimatedTime: '40 min',
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Federal IT Security Legislation',
            type: 'lesson',
            completed: true,
            locked: false,
            duration: '15 min',
            description: 'Learn about NIST frameworks, FISMA, and key cybersecurity legislation.'
          },
          {
            id: 'lesson-2-2',
            title: 'Healthcare Privacy Laws',
            type: 'lesson',
            completed: true,
            locked: false,
            duration: '12 min',
            description: 'Understand HIPAA, Privacy Act requirements, and healthcare-specific regulations.'
          },
          {
            id: 'lesson-2-3',
            title: 'Organizational Security Structure',
            type: 'lesson',
            completed: false,
            locked: false,
            duration: '8 min',
            description: 'Explore CIO/CISO roles and organizational cybersecurity governance.'
          },
          {
            id: 'test-2-1',
            title: 'Regulations Knowledge Check',
            type: 'test',
            completed: false,
            locked: true,
            duration: '5 min',
            description: 'Assess your understanding of oversight responsibilities and policy hierarchy.'
          }
        ]
      },
      {
        id: 'section-3',
        title: 'Email & Internet Security',
        description: 'Learn to recognize phishing attacks and implement safe internet practices.',
        progress: 0,
        expanded: false,
        estimatedTime: '50 min',
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'Cyber Crime and Social Engineering',
            type: 'lesson',
            completed: false,
            locked: true,
            duration: '15 min',
            description: 'Understand common cyber crimes and social engineering techniques.'
          },
          {
            id: 'lesson-3-2',
            title: 'Phishing Attack Recognition',
            type: 'lesson',
            completed: false,
            locked: true,
            duration: '18 min',
            description: 'Learn to identify phishing, spear phishing, and whaling attacks.'
          },
          {
            id: 'game-3-1',
            title: 'Phishing Email Simulator',
            type: 'game',
            completed: false,
            locked: true,
            duration: '12 min',
            description: 'Interactive phishing email identification and response training.'
          },
          {
            id: 'test-3-1',
            title: 'Phishing Recognition Test',
            type: 'test',
            completed: false,
            locked: true,
            duration: '5 min',
            description: 'Test your ability to recognize and respond to phishing attempts.'
          }
        ]
      },
      {
        id: 'section-4',
        title: 'Incident Reporting & Response',
        description: 'Learn proper incident reporting procedures and immediate response measures.',
        progress: 0,
        expanded: false,
        estimatedTime: '25 min',
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'Types of Reportable Incidents',
            type: 'lesson',
            completed: false,
            locked: true,
            duration: '10 min',
            description: 'Identify security and privacy incidents that require reporting.'
          },
          {
            id: 'lesson-4-2',
            title: 'Incident Response Procedures',
            type: 'lesson',
            completed: false,
            locked: true,
            duration: '10 min',
            description: 'Learn proper reporting procedures and immediate response protocols.'
          },
          {
            id: 'test-4-1',
            title: 'Incident Response Assessment',
            type: 'test',
            completed: false,
            locked: true,
            duration: '5 min',
            description: 'Verify your understanding of incident identification and reporting procedures.'
          }
        ]
      }
    ],
    certificate: {
      available: true,
      earned: false,
      title: 'Cybersecurity Awareness Certificate'
    }
  })

  const toggleSection = (sectionId: string) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    }))
  }

  const getIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return Book
      case 'test':
        return ClipboardList
      case 'game':
        return Gamepad2
      case 'material':
        return FileText
      default:
        return Book
    }
  }

  const getTypeBadgeVariant = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return 'default'
      case 'test':
        return 'info'
      case 'game':
        return 'brand'
      case 'material':
        return 'default'
      default:
        return 'default'
    }
  }

  const getDifficultyBadgeVariant = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'success'
      case 'intermediate':
        return 'warning'
      case 'advanced':
        return 'error'
    }
  }

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
  const completedLessons = course.sections.reduce((acc, section) => 
    acc + section.lessons.filter(lesson => lesson.completed).length, 0
  )

  return (
    <div className="space-y-[var(--spacing-xl)]">
      {/* Course header */}
      <div className="space-y-[var(--spacing-lg)]">
        <div className="flex flex-col lg:flex-row gap-[var(--spacing-lg)]">
          <Card variant="gradient" className="lg:w-96 flex items-center justify-center">
            <Book className="h-24 w-24" />
          </Card>
          
          <div className="flex-1 space-y-[var(--spacing-md)]">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[var(--font-size-3xl)] font-[var(--font-weight-bold)] tracking-[var(--letter-spacing-tight)]">
                  {course.title}
                </h1>
                <p className="text-[var(--text-secondary)] text-[var(--font-size-lg)] mt-[var(--spacing-sm)]">
                  {course.description}
                </p>
              </div>
              <Badge variant={getDifficultyBadgeVariant(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-md)] text-[var(--font-size-sm)]">
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Clock className="h-4 w-4 text-[var(--text-tertiary)]" />
                <span>{course.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Users className="h-4 w-4 text-[var(--text-tertiary)]" />
                <span>{course.enrolledStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Star className="h-4 w-4 fill-[var(--color-yellow-500)] text-[var(--color-yellow-500)]" />
                <span>{course.rating}/5</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <Award className="h-4 w-4 text-[var(--text-tertiary)]" />
                <span>Certificate</span>
              </div>
            </div>

            <div className="space-y-[var(--spacing-sm)]">
              <div className="flex items-center justify-between text-[var(--font-size-sm)]">
                <span>Course Progress</span>
                <span className="font-[var(--font-weight-medium)]">
                  {course.progress}% ({completedLessons}/{totalLessons} lessons)
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>

            <Button size="lg" className="bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)]">
              <Play className="h-5 w-5 mr-[var(--spacing-sm)]" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Instructor info */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Meet Your Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-[var(--spacing-md)]">
              <Avatar className="h-16 w-16">
                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                <AvatarFallback className="bg-[var(--gradient-consciousness)] text-[var(--text-inverse)] text-[var(--font-size-lg)]">
                  {course.instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-[var(--font-weight-semibold)] text-[var(--font-size-lg)]">
                  {course.instructor.name}
                </h3>
                <p className="text-[var(--text-secondary)]">{course.instructor.title}</p>
                <p className="text-[var(--font-size-sm)] mt-[var(--spacing-sm)]">{course.instructor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-xl)]">
        <div className="lg:col-span-2 space-y-[var(--spacing-lg)]">
          <div>
            <h2 className="text-[var(--font-size-2xl)] font-[var(--font-weight-bold)] mb-[var(--spacing-md)]">
              Course Content
            </h2>
            <div className="space-y-[var(--spacing-md)]">
              {course.sections.map((section, sectionIndex) => (
                <Card key={section.id} variant="interactive" className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-[var(--spacing-lg)] flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors duration-[var(--duration-normal)]"
                  >
                    <div className="flex items-center gap-[var(--spacing-md)]">
                      {section.expanded ? (
                        <ChevronDown className="h-5 w-5 text-[var(--text-tertiary)]" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-[var(--text-tertiary)]" />
                      )}
                      <div className="text-left">
                        <h3 className="font-[var(--font-weight-semibold)] text-[var(--font-size-base)]">
                          {sectionIndex + 1}. {section.title}
                        </h3>
                        <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                          {section.description}
                        </p>
                        <div className="flex items-center gap-[var(--spacing-md)] mt-[var(--spacing-xs)] text-[var(--font-size-xs)] text-[var(--text-tertiary)]">
                          <span>{section.lessons.length} lessons</span>
                          <span>{section.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-[var(--spacing-md)]">
                      <div className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                        {section.progress}%
                      </div>
                      <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-[var(--border-subtle)]"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${section.progress}, 100`}
                            className="text-[var(--text-brand)]"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {section.expanded && (
                    <div className="border-t border-[var(--border-subtle)]">
                      {section.lessons.map((lesson, lessonIndex) => {
                        const Icon = getIcon(lesson.type)
                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "flex items-center gap-[var(--spacing-md)] p-[var(--spacing-lg)] border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-secondary)] transition-colors duration-[var(--duration-normal)]",
                              lesson.locked && "opacity-50"
                            )}
                          >
                            <div className="flex-shrink-0">
                              {lesson.locked ? (
                                <Lock className="h-5 w-5 text-[var(--text-tertiary)]" />
                              ) : lesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-[var(--text-success)]" />
                              ) : (
                                <Circle className="h-5 w-5 text-[var(--text-tertiary)]" />
                              )}
                            </div>

                            <div className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-full)] bg-[var(--bg-emphasis)]">
                              <Icon className="h-4 w-4 text-[var(--text-brand)]" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-[var(--font-weight-medium)] truncate">
                                {sectionIndex + 1}.{lessonIndex + 1} {lesson.title}
                              </h4>
                              <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)] line-clamp-1">
                                {lesson.description}
                              </p>
                              <div className="flex items-center gap-[var(--spacing-sm)] mt-[var(--spacing-xs)] text-[var(--font-size-xs)] text-[var(--text-tertiary)]">
                                <Badge variant={getTypeBadgeVariant(lesson.type)} className="text-[var(--font-size-xs)]">
                                  {lesson.type}
                                </Badge>
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>

                            {!lesson.locked && (
                              <Button 
                                variant={lesson.completed ? "secondary" : "primary"}
                                size="sm"
                                className={!lesson.completed ? "bg-[var(--bg-brand)] hover:opacity-90 text-[var(--text-inverse)]" : ""}
                                onClick={() => {
                                  if (lesson.type === 'lesson') {
                                    window.location.href = `/lms/course/${courseId}/lesson/${lesson.id}`
                                  } else if (lesson.type === 'test') {
                                    window.location.href = `/lms/course/${courseId}/test/${lesson.id}`
                                  } else if (lesson.type === 'game') {
                                    window.location.href = `/lms/course/${courseId}/game/${lesson.id}`
                                  }
                                }}
                              >
                                {lesson.completed ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-[var(--spacing-sm)]" />
                                    Review
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-[var(--spacing-sm)]" />
                                    Start
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-[var(--spacing-lg)]">
          {/* Learning objectives */}
          <Card variant="feature">
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-[var(--spacing-sm)]">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-[var(--spacing-sm)] text-[var(--font-size-sm)]">
                    <CheckCircle className="h-4 w-4 text-[var(--text-success)] mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Certificate */}
          {course.certificate.available && (
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-[var(--spacing-sm)]">
                  <Award className="h-5 w-5" />
                  Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.certificate.earned ? (
                  <div className="space-y-[var(--spacing-md)]">
                    <div className="p-[var(--spacing-md)] bg-[var(--bg-successLight)] border border-[var(--border-success)] rounded-[var(--radius-md)]">
                      <div className="flex items-center gap-[var(--spacing-sm)] text-[var(--text-success)]">
                        <Award className="h-5 w-5" />
                        <span className="font-[var(--font-weight-medium)]">Certificate Earned!</span>
                      </div>
                      <p className="text-[var(--font-size-sm)] text-[var(--text-success)] mt-[var(--spacing-xs)]">
                        Congratulations on completing {course.title}
                      </p>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-[var(--spacing-sm)]" />
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-[var(--spacing-md)]">
                    <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                      Complete all lessons to earn your {course.certificate.title}
                    </p>
                    <div className="p-[var(--spacing-md)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
                      <div className="flex items-center justify-between text-[var(--font-size-sm)]">
                        <span>Progress to certificate</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="mt-[var(--spacing-sm)] h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course details */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-[var(--spacing-md)]">
              <div className="grid grid-cols-2 gap-[var(--spacing-md)] text-[var(--font-size-sm)]">
                <div>
                  <div className="text-[var(--text-secondary)]">Duration</div>
                  <div className="font-[var(--font-weight-medium)]">{course.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-[var(--text-secondary)]">Lessons</div>
                  <div className="font-[var(--font-weight-medium)]">{totalLessons}</div>
                </div>
                <div>
                  <div className="text-[var(--text-secondary)]">Students</div>
                  <div className="font-[var(--font-weight-medium)]">{course.enrolledStudents.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[var(--text-secondary)]">Category</div>
                  <div className="font-[var(--font-weight-medium)]">{course.category}</div>
                </div>
              </div>
              
              <div className="pt-[var(--spacing-md)] border-t border-[var(--border-subtle)]">
                <p className="text-[var(--font-size-sm)] text-[var(--text-secondary)]">
                  {course.longDescription}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}