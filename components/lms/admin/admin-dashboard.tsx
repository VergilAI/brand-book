'use client'

import { useState } from 'react'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Calendar,
  Clock,
  Award,
  UserPlus,
  FileText,
  Trophy
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MetricCard } from '@/components/lms/admin/metric-card'
import { DataTable } from '@/components/lms/admin/data-table'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  enrollmentCount: number
  completionRate: number
  lastModified: string
  status: 'published' | 'draft'
  instructor: string
}

interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  type: 'enrollment' | 'completion' | 'creation' | 'update'
}

export function AdminDashboard() {
  // Mock data
  const metrics = {
    totalUsers: 3847,
    totalCourses: 24,
    avgCompletionRate: 68,
    monthlyActiveUsers: 2341,
    trends: {
      users: { value: 12, isPositive: true },
      courses: { value: 8, isPositive: true },
      completion: { value: 5, isPositive: true },
      activity: { value: 23, isPositive: true }
    }
  }

  const recentCourses: Course[] = [
    {
      id: '1',
      title: 'AI Fundamentals',
      enrollmentCount: 1234,
      completionRate: 78,
      lastModified: '2 hours ago',
      status: 'published',
      instructor: 'Dr. Sarah Kim'
    },
    {
      id: '2',
      title: 'Advanced Machine Learning',
      enrollmentCount: 856,
      completionRate: 65,
      lastModified: '1 day ago',
      status: 'published',
      instructor: 'Prof. Michael Rodriguez'
    },
    {
      id: '3',
      title: 'Data Science Essentials',
      enrollmentCount: 2103,
      completionRate: 82,
      lastModified: '3 days ago',
      status: 'published',
      instructor: 'Dr. Lisa Zhang'
    },
    {
      id: '4',
      title: 'Neural Networks Deep Dive',
      enrollmentCount: 0,
      completionRate: 0,
      lastModified: '5 minutes ago',
      status: 'draft',
      instructor: 'Dr. James Wilson'
    }
  ]

  const recentActivity: Activity[] = [
    {
      id: '1',
      user: 'John Doe',
      action: 'completed',
      target: 'AI Fundamentals - Module 3',
      timestamp: '5 minutes ago',
      type: 'completion'
    },
    {
      id: '2',
      user: 'Jane Smith',
      action: 'enrolled in',
      target: 'Advanced Machine Learning',
      timestamp: '12 minutes ago',
      type: 'enrollment'
    },
    {
      id: '3',
      user: 'Dr. James Wilson',
      action: 'created',
      target: 'Neural Networks Deep Dive',
      timestamp: '15 minutes ago',
      type: 'creation'
    },
    {
      id: '4',
      user: 'Emily Chen',
      action: 'achieved 100% in',
      target: 'Data Science Quiz #3',
      timestamp: '1 hour ago',
      type: 'completion'
    },
    {
      id: '5',
      user: 'Michael Brown',
      action: 'updated',
      target: 'Cloud Computing Basics - Lesson 4',
      timestamp: '2 hours ago',
      type: 'update'
    }
  ]

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'enrollment':
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'completion':
        return <Award className="h-4 w-4 text-green-500" />
      case 'creation':
        return <Plus className="h-4 w-4 text-purple-500" />
      case 'update':
        return <Edit className="h-4 w-4 text-orange-500" />
    }
  }

  const courseColumns = [
    {
      key: 'title',
      label: 'Course Title',
      sortable: true,
      render: (course: Course) => (
        <div>
          <div className="font-medium">{course.title}</div>
          <div className="text-xs text-muted-foreground">by {course.instructor}</div>
        </div>
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
      label: 'Completion Rate',
      sortable: true,
      render: (course: Course) => (
        <div className="flex items-center gap-3">
          <Progress value={course.completionRate} className="w-20 h-2" />
          <span className="text-sm font-medium">{course.completionRate}%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (course: Course) => (
        <Badge 
          variant={course.status === 'published' ? 'default' : 'secondary'}
          className={course.status === 'published' ? 'bg-green-100 text-green-800' : ''}
        >
          {course.status}
        </Badge>
      )
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sortable: true
    }
  ]

  const courseActions = [
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
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your LMS.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button className="bg-cosmic-purple hover:bg-cosmic-purple/90">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Active Users"
          value={metrics.totalUsers.toLocaleString()}
          description="Currently enrolled students"
          icon={Users}
          trend={metrics.trends.users}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Total Courses"
          value={metrics.totalCourses}
          description="Published courses"
          icon={BookOpen}
          trend={metrics.trends.courses}
          iconColor="text-green-500"
        />
        <MetricCard
          title="Avg Completion Rate"
          value={`${metrics.avgCompletionRate}%`}
          description="Across all courses"
          icon={TrendingUp}
          trend={metrics.trends.completion}
          iconColor="text-purple-500"
        />
        <MetricCard
          title="Monthly Active Users"
          value={metrics.monthlyActiveUsers.toLocaleString()}
          description="Unique logins this month"
          icon={Activity}
          trend={metrics.trends.activity}
          iconColor="text-orange-500"
        />
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/lms/admin/courses/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
            <Link href="/lms/admin/users/new">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </Link>
            <Link href="/lms/admin/analytics">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in your LMS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p>
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Course management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Recent courses and their performance</CardDescription>
                </div>
                <Link href="/lms/admin/courses">
                  <Button variant="outline" size="sm">
                    View All Courses
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentCourses}
                columns={courseColumns}
                searchable={false}
                actions={courseActions}
                keyExtractor={(course) => course.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key metrics for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3">Top Performing Courses</h3>
              <div className="space-y-3">
                {recentCourses
                  .filter(c => c.status === 'published')
                  .sort((a, b) => b.completionRate - a.completionRate)
                  .slice(0, 3)
                  .map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                          index === 0 && "bg-yellow-100 text-yellow-800",
                          index === 1 && "bg-gray-100 text-gray-800",
                          index === 2 && "bg-orange-100 text-orange-800"
                        )}>
                          {index + 1}
                        </div>
                        <span className="text-sm">{course.title}</span>
                      </div>
                      <Badge variant="outline">{course.completionRate}%</Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">User Engagement</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Daily Active Users</span>
                    <span className="text-sm font-medium">892</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Weekly Active Users</span>
                    <span className="text-sm font-medium">1,847</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Monthly Active Users</span>
                    <span className="text-sm font-medium">2,341</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Award className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">152 Certificates Earned</div>
                    <div className="text-xs text-muted-foreground">This month</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">89% Pass Rate</div>
                    <div className="text-xs text-muted-foreground">All assessments</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">+23% Growth</div>
                    <div className="text-xs text-muted-foreground">User engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}