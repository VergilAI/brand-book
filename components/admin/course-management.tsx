'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreVertical,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Alert, AlertDescription } from '@/components/alert'
import { DataTable } from '@/components/admin/data-table'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  lastModified: string
  enrollmentCount: number
  completionRate: number
  averageRating: number
  totalLessons: number
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnail?: string
}

export function CourseManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())

  // Mock data
  const courses: Course[] = [
    {
      id: '1',
      title: 'AI Fundamentals',
      description: 'Learn the basics of artificial intelligence, machine learning, and neural networks.',
      instructor: 'Dr. Sarah Kim',
      category: 'Technology',
      status: 'published',
      createdAt: '2024-01-15',
      lastModified: '2 hours ago',
      enrollmentCount: 1234,
      completionRate: 78,
      averageRating: 4.8,
      totalLessons: 24,
      duration: '8 hours',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Advanced Machine Learning',
      description: 'Deep dive into advanced ML algorithms, deep learning, and practical applications.',
      instructor: 'Prof. Michael Rodriguez',
      category: 'Technology',
      status: 'published',
      createdAt: '2024-02-10',
      lastModified: '1 day ago',
      enrollmentCount: 856,
      completionRate: 65,
      averageRating: 4.9,
      totalLessons: 32,
      duration: '12 hours',
      difficulty: 'advanced'
    },
    {
      id: '3',
      title: 'Data Science Essentials',
      description: 'Master data analysis, visualization, and statistical modeling techniques.',
      instructor: 'Dr. Lisa Zhang',
      category: 'Technology',
      status: 'published',
      createdAt: '2024-01-20',
      lastModified: '3 days ago',
      enrollmentCount: 2103,
      completionRate: 82,
      averageRating: 4.7,
      totalLessons: 28,
      duration: '10 hours',
      difficulty: 'intermediate'
    },
    {
      id: '4',
      title: 'Leadership in Tech',
      description: 'Develop leadership skills specifically for technology teams and projects.',
      instructor: 'Mark Thompson',
      category: 'Leadership',
      status: 'draft',
      createdAt: '2024-03-01',
      lastModified: '5 hours ago',
      enrollmentCount: 0,
      completionRate: 0,
      averageRating: 0,
      totalLessons: 18,
      duration: '6 hours',
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: 'Cloud Computing Basics',
      description: 'Introduction to cloud platforms, services, and deployment strategies.',
      instructor: 'Jennifer Park',
      category: 'Technology',
      status: 'archived',
      createdAt: '2023-11-10',
      lastModified: '2 months ago',
      enrollmentCount: 1843,
      completionRate: 91,
      averageRating: 4.5,
      totalLessons: 20,
      duration: '7 hours',
      difficulty: 'beginner'
    }
  ]

  const categories = ['All Categories', 'Technology', 'Leadership', 'Soft Skills', 'Business']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCourses.size} courses?`)) {
      // Handle bulk delete
      setSelectedCourses(new Set())
    }
  }

  const handleBulkArchive = () => {
    if (confirm(`Are you sure you want to archive ${selectedCourses.size} courses?`)) {
      // Handle bulk archive
      setSelectedCourses(new Set())
    }
  }

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived':
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

  const tableColumns = [
    {
      key: 'title',
      label: 'Course',
      sortable: true,
      render: (course: Course) => (
        <div>
          <div className="font-medium">{course.title}</div>
          <div className="text-xs text-muted-foreground">
            {course.instructor} • {course.category}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (course: Course) => (
        <Badge className={getStatusColor(course.status)}>
          {course.status}
        </Badge>
      )
    },
    {
      key: 'enrollmentCount',
      label: 'Enrolled',
      sortable: true,
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{course.enrollmentCount.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'completionRate',
      label: 'Completion',
      sortable: true,
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Progress value={course.completionRate} className="w-16 h-2" />
          <span className="text-sm">{course.completionRate}%</span>
        </div>
      )
    },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (course: Course) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{course.averageRating || '-'}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
      )
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sortable: true
    }
  ]

  const tableActions = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (course: Course) => {
        window.location.href = `/lms/admin/courses/${course.id}`
      }
    },
    {
      label: 'Edit Course',
      icon: <Edit className="h-4 w-4" />,
      onClick: (course: Course) => {
        window.location.href = `/lms/admin/courses/${course.id}/edit`
      }
    },
    {
      label: 'View Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: (course: Course) => {
        window.location.href = `/lms/admin/analytics/course/${course.id}`
      }
    },
    {
      label: 'Duplicate',
      icon: <Copy className="h-4 w-4" />,
      onClick: (course: Course) => {
        // Handle duplicate
      }
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (course: Course) => {
        if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
          // Handle delete
        }
      }
    }
  ]

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: handleBulkDelete
    },
    {
      label: 'Archive Selected',
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      onClick: handleBulkArchive
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your courses</p>
        </div>
        <Link href="/lms/admin/courses/new">
          <Button className="bg-cosmic-purple hover:bg-cosmic-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Filters and controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
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
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedCourses.size > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>{selectedCourses.size} courses selected</span>
            <div className="flex gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => action.onClick(Array.from(selectedCourses))}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Course display */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={filteredCourses}
              columns={tableColumns}
              searchable={false}
              actions={tableActions}
              bulkActions={bulkActions}
              keyExtractor={(course) => course.id}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-cosmic-purple/20 to-electric-violet/20 p-4 flex items-end">
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.instructor} • {course.category}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {tableActions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => action.onClick(course)}
                        >
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {course.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.enrollmentCount.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">{course.completionRate}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    Modified {course.lastModified}
                  </div>
                  <Link href={`/lms/admin/courses/${course.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Link href="/lms/admin/courses/new">
              <Button className="bg-cosmic-purple hover:bg-cosmic-purple/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}