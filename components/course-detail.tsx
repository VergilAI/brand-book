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
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'
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

  const getTypeColor = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return 'bg-cosmic-purple text-white'
      case 'test':
        return 'bg-electric-violet text-white'
      case 'game':
        return 'bg-phosphor-cyan text-white'
      case 'material':
        return 'bg-neural-pink text-white'
      default:
        return 'bg-cosmic-purple text-white'
    }
  }

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
    }
  }

  const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
  const completedLessons = course.sections.reduce((acc, section) => 
    acc + section.lessons.filter(lesson => lesson.completed).length, 0
  )

  return (
    <div className="space-y-8">
      {/* Course header */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-96 bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20 rounded-lg p-8 flex items-center justify-center">
            <Book className="h-24 w-24 text-cosmic-purple" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground text-lg">{course.description}</p>
              </div>
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course.enrolledStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Certificate</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Course Progress</span>
                <span>{course.progress}% ({completedLessons}/{totalLessons} lessons)</span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>

            <Button size="lg" className="bg-cosmic-purple hover:bg-cosmic-purple/90">
              <Play className="h-5 w-5 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>

        {/* Instructor info */}
        <Card>
          <CardHeader>
            <CardTitle>Meet Your Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                <AvatarFallback className="bg-gradient-to-br from-cosmic-purple to-electric-violet text-white text-lg">
                  {course.instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
                <p className="text-muted-foreground">{course.instructor.title}</p>
                <p className="text-sm mt-2">{course.instructor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.sections.map((section, sectionIndex) => (
                <Card key={section.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {section.expanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold">{sectionIndex + 1}. {section.title}</h3>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{section.lessons.length} lessons</span>
                          <span>{section.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
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
                            className="text-muted-foreground/20"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${section.progress}, 100`}
                            className="text-cosmic-purple"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {section.expanded && (
                    <div className="border-t">
                      {section.lessons.map((lesson, lessonIndex) => {
                        const Icon = getIcon(lesson.type)
                        return (
                          <div
                            key={lesson.id}
                            className={cn(
                              "flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors",
                              lesson.locked && "opacity-50"
                            )}
                          >
                            <div className="flex-shrink-0">
                              {lesson.locked ? (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              ) : lesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>

                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium",
                              getTypeColor(lesson.type)
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {sectionIndex + 1}.{lessonIndex + 1} {lesson.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {lesson.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="capitalize">{lesson.type}</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>

                            {!lesson.locked && (
                              <Button 
                                variant={lesson.completed ? "outline" : "default"}
                                size="sm"
                                className={!lesson.completed ? "bg-cosmic-purple hover:bg-cosmic-purple/90" : ""}
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
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Review
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
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
        <div className="space-y-6">
          {/* Learning objectives */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Certificate */}
          {course.certificate.available && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.certificate.earned ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Award className="h-5 w-5" />
                        <span className="font-medium">Certificate Earned!</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Congratulations on completing {course.title}
                      </p>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Complete all lessons to earn your {course.certificate.title}
                    </p>
                    <div className="p-4 bg-gray-50 border rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress to certificate</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="mt-2 h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium">{course.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Lessons</div>
                  <div className="font-medium">{totalLessons}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Students</div>
                  <div className="font-medium">{course.enrolledStudents.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Category</div>
                  <div className="font-medium">{course.category}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
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