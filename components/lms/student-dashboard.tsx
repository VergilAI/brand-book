'use client'

import { useState } from 'react'
import { 
  Book, 
  Play, 
  Clock, 
  Award, 
  TrendingUp, 
  Grid, 
  List, 
  Search, 
  Filter,
  Star,
  Users,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  lastAccessed: string
  estimatedTime: string
  instructor: string
  rating: number
  enrolledStudents: number
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function StudentDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'last-accessed' | 'progress' | 'alphabetical'>('last-accessed')

  // Mock user data
  const user = {
    name: "Alex Chen",
    totalCourses: 12,
    completedCourses: 4,
    inProgressCourses: 5,
    overallProgress: 68,
    totalHours: 145,
    certificatesEarned: 4
  }

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Cybersecurity Awareness Training',
      description: 'Comprehensive employee cybersecurity education program covering phishing, social engineering, and security best practices.',
      thumbnail: '/course-thumbnails/cybersecurity-awareness.jpg',
      progress: 65,
      status: 'in-progress',
      lastAccessed: '2 hours ago',
      estimatedTime: '3 hours',
      instructor: 'CISO Jennifer Martinez',
      rating: 4.8,
      enrolledStudents: 3947,
      category: 'Cybersecurity',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'AI Security & Governance',
      description: 'Responsible AI use in higher education - ethics, risk assessment, procurement, and compliance with emerging regulations.',
      thumbnail: '/course-thumbnails/ai-security.jpg',
      progress: 30,
      status: 'in-progress',
      lastAccessed: '1 day ago',
      estimatedTime: '2.5 hours',
      instructor: 'Dr. Sarah Chen',
      rating: 4.9,
      enrolledStudents: 1892,
      category: 'AI Compliance',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'ISO 27001 Implementation',
      description: 'Master information security management systems, risk assessment, and ISO 27001 compliance requirements.',
      thumbnail: '/course-thumbnails/iso27001.jpg',
      progress: 100,
      status: 'completed',
      lastAccessed: '3 days ago',
      estimatedTime: '4 hours',
      instructor: 'Michael Harrison, CISSP',
      rating: 4.7,
      enrolledStudents: 2456,
      category: 'Compliance',
      difficulty: 'advanced'
    },
    {
      id: '4',
      title: 'SOC 2 Compliance Training',
      description: 'Understanding SOC 2 Type II requirements, controls implementation, and audit preparation for service organizations.',
      thumbnail: '/course-thumbnails/soc2.jpg',
      progress: 0,
      status: 'not-started',
      lastAccessed: 'Never',
      estimatedTime: '3.5 hours',
      instructor: 'Lisa Rodriguez, CPA',
      rating: 4.6,
      enrolledStudents: 1234,
      category: 'Compliance',
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: 'Phishing Detection & Response',
      description: 'Advanced phishing recognition, incident response procedures, and building a security-aware culture.',
      thumbnail: '/course-thumbnails/phishing.jpg',
      progress: 85,
      status: 'in-progress',
      lastAccessed: '5 hours ago',
      estimatedTime: '2 hours',
      instructor: 'David Kim, Security Analyst',
      rating: 4.5,
      enrolledStudents: 2834,
      category: 'Cybersecurity',
      difficulty: 'beginner'
    },
    {
      id: '6',
      title: 'Data Privacy & GDPR',
      description: 'Comprehensive data protection training covering GDPR, CCPA, and privacy-by-design principles.',
      thumbnail: '/course-thumbnails/privacy.jpg',
      progress: 100,
      status: 'completed',
      lastAccessed: '1 week ago',
      estimatedTime: '3 hours',
      instructor: 'Dr. Amanda Foster, Privacy Officer',
      rating: 4.4,
      enrolledStudents: 3156,
      category: 'Privacy',
      difficulty: 'intermediate'
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress - a.progress
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      case 'last-accessed':
      default:
        return a.lastAccessed === 'Never' ? 1 : -1
    }
  })

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{user.overallProgress}%</p>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
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
                      strokeDasharray={`${user.overallProgress}, 100`}
                      className="text-cosmic-purple"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-cosmic-purple" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                  <p className="text-2xl font-bold">{user.completedCourses}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{user.inProgressCourses}</p>
                </div>
                <Book className="h-8 w-8 text-electric-violet" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                  <p className="text-2xl font-bold">{user.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-phosphor-cyan" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course filters and controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-accessed">Last Accessed</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Course grid/list */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {sortedCourses.map((course) => (
          <Card key={course.id} className={cn(
            "overflow-hidden hover:shadow-lg transition-shadow",
            viewMode === 'list' && "flex flex-row"
          )}>
            <div className={cn(
              "bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20 p-6 flex items-center justify-center",
              viewMode === 'list' ? "w-48 flex-shrink-0" : "h-32"
            )}>
              <Book className="h-12 w-12 text-cosmic-purple" />
            </div>
            
            <div className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents.toLocaleString()} students</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{course.estimatedTime}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(course.status)}>
                    {course.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                    <span className="text-muted-foreground">({course.enrolledStudents})</span>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {course.lastAccessed !== 'Never' ? `Last accessed ${course.lastAccessed}` : 'Not started'}
                  </div>
                  <Button 
                    size="sm"
                    className={cn(
                      course.status === 'not-started' && "bg-cosmic-purple hover:bg-cosmic-purple/90",
                      course.status === 'in-progress' && "bg-electric-violet hover:bg-electric-violet/90",
                      course.status === 'completed' && "bg-green-600 hover:bg-green-700"
                    )}
                    onClick={() => window.location.href = `/lms/course/${course.id}`}
                  >
                    {course.status === 'not-started' && (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Course
                      </>
                    )}
                    {course.status === 'in-progress' && (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </>
                    )}
                    {course.status === 'completed' && (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Review
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}