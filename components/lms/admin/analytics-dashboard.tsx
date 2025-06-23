'use client'

import { useState } from 'react'
import { 
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Eye,
  Play,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MetricCard } from '@/components/lms/admin/metric-card'
import { DataTable } from '@/components/lms/admin/data-table'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  kpis: {
    totalEnrollments: number
    completionRate: number
    averageScore: number
    activeUsers: number
    totalHours: number
    certificatesIssued: number
  }
  trends: {
    enrollments: { value: number; isPositive: boolean }
    completion: { value: number; isPositive: boolean }
    scores: { value: number; isPositive: boolean }
    engagement: { value: number; isPositive: boolean }
  }
  coursePerformance: Array<{
    id: string
    title: string
    enrollments: number
    completionRate: number
    averageScore: number
    averageTime: string
    rating: number
    dropoffRate: number
  }>
  userEngagement: {
    dailyActive: number[]
    weeklyActive: number[]
    monthlyActive: number[]
    timeLabels: string[]
  }
  completionData: {
    completed: number
    inProgress: number
    notStarted: number
    dropped: number
  }
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('completions')

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    kpis: {
      totalEnrollments: 12475,
      completionRate: 82,
      averageScore: 87,
      activeUsers: 3542,
      totalHours: 18950,
      certificatesIssued: 2847
    },
    trends: {
      enrollments: { value: 34, isPositive: true },
      completion: { value: 12, isPositive: true },
      scores: { value: 8, isPositive: true },
      engagement: { value: 15, isPositive: true }
    },
    coursePerformance: [
      {
        id: '1',
        title: 'Cybersecurity Awareness Training',
        enrollments: 3947,
        completionRate: 89,
        averageScore: 91,
        averageTime: '3.2 hours',
        rating: 4.8,
        dropoffRate: 8
      },
      {
        id: '2',
        title: 'AI Security & Governance',
        enrollments: 1892,
        completionRate: 76,
        averageScore: 88,
        averageTime: '2.7 hours',
        rating: 4.9,
        dropoffRate: 18
      },
      {
        id: '3',
        title: 'ISO 27001 Implementation',
        enrollments: 2456,
        completionRate: 73,
        averageScore: 85,
        averageTime: '4.1 hours',
        rating: 4.7,
        dropoffRate: 22
      },
      {
        id: '4',
        title: 'SOC 2 Compliance Training',
        enrollments: 1234,
        completionRate: 68,
        averageScore: 82,
        averageTime: '3.8 hours',
        rating: 4.6,
        dropoffRate: 25
      },
      {
        id: '5',
        title: 'Phishing Detection & Response',
        enrollments: 2834,
        completionRate: 92,
        averageScore: 94,
        averageTime: '2.1 hours',
        rating: 4.9,
        dropoffRate: 5
      },
      {
        id: '6',
        title: 'Data Privacy & GDPR',
        enrollments: 3156,
        completionRate: 84,
        averageScore: 86,
        averageTime: '3.3 hours',
        rating: 4.4,
        dropoffRate: 12
      }
    ],
    userEngagement: {
      dailyActive: [120, 135, 148, 142, 156, 171, 165, 158, 173, 182, 195, 201, 188, 196, 204, 218, 225, 231, 245, 238, 252, 267, 274, 281, 295, 302, 318, 325, 331, 345],
      weeklyActive: [890, 912, 934, 956, 978, 995, 1012, 1028, 1045, 1067, 1089, 1112, 1134, 1156],
      monthlyActive: [2341, 2456, 2578, 2689, 2734, 2812],
      timeLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    completionData: {
      completed: 2847,
      inProgress: 3658,
      notStarted: 4124,
      dropped: 1846
    }
  }

  const chartData = {
    completions: [
      { name: 'Week 1', value: 45 },
      { name: 'Week 2', value: 52 },
      { name: 'Week 3', value: 48 },
      { name: 'Week 4', value: 61 },
      { name: 'Week 5', value: 68 },
    ],
    enrollments: [
      { name: 'Week 1', value: 234 },
      { name: 'Week 2', value: 267 },
      { name: 'Week 3', value: 189 },
      { name: 'Week 4', value: 298 },
      { name: 'Week 5', value: 356 },
    ]
  }

  const courseColumns = [
    {
      key: 'title',
      label: 'Course',
      sortable: true,
      render: (course: any) => (
        <div>
          <div className="font-medium">{course.title}</div>
          <div className="text-xs text-muted-foreground">
            {course.enrollments.toLocaleString()} enrollments
          </div>
        </div>
      )
    },
    {
      key: 'completionRate',
      label: 'Completion Rate',
      sortable: true,
      render: (course: any) => (
        <div className="flex items-center gap-2">
          <Progress value={course.completionRate} className="w-16 h-2" />
          <span className="text-sm font-medium">{course.completionRate}%</span>
        </div>
      )
    },
    {
      key: 'averageScore',
      label: 'Avg Score',
      sortable: true,
      render: (course: any) => (
        <div className="text-center">
          <div className="font-medium">{course.averageScore}%</div>
          <div className="text-xs text-muted-foreground">average</div>
        </div>
      )
    },
    {
      key: 'averageTime',
      label: 'Avg Time',
      render: (course: any) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{course.averageTime}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (course: any) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
      )
    },
    {
      key: 'dropoffRate',
      label: 'Dropoff Rate',
      sortable: true,
      render: (course: any) => (
        <Badge 
          variant="outline" 
          className={cn(
            course.dropoffRate > 20 ? 'border-red-200 text-red-700' : 
            course.dropoffRate > 15 ? 'border-yellow-200 text-yellow-700' : 
            'border-green-200 text-green-700'
          )}
        >
          {course.dropoffRate}%
        </Badge>
      )
    }
  ]

  const courseActions = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (course: any) => {
        window.location.href = `/lms/admin/analytics/course/${course.id}`
      }
    },
    {
      label: 'Course Page',
      icon: <BookOpen className="h-4 w-4" />,
      onClick: (course: any) => {
        window.location.href = `/lms/admin/courses/${course.id}`
      }
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Insights and performance metrics for your LMS</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Enrollments"
          value={analyticsData.kpis.totalEnrollments.toLocaleString()}
          description="All time enrollments"
          icon={Users}
          trend={analyticsData.trends.enrollments}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Completion Rate"
          value={`${analyticsData.kpis.completionRate}%`}
          description="Overall completion"
          icon={CheckCircle}
          trend={analyticsData.trends.completion}
          iconColor="text-green-500"
        />
        <MetricCard
          title="Average Score"
          value={`${analyticsData.kpis.averageScore}%`}
          description="Across all assessments"
          icon={Target}
          trend={analyticsData.trends.scores}
          iconColor="text-purple-500"
        />
        <MetricCard
          title="Active Users"
          value={analyticsData.kpis.activeUsers.toLocaleString()}
          description="Monthly active users"
          icon={Activity}
          trend={analyticsData.trends.engagement}
          iconColor="text-orange-500"
        />
        <MetricCard
          title="Learning Hours"
          value={analyticsData.kpis.totalHours.toLocaleString()}
          description="Total time spent"
          icon={Clock}
          trend={{ value: 12, isPositive: true }}
          iconColor="text-cyan-500"
        />
        <MetricCard
          title="Certificates"
          value={analyticsData.kpis.certificatesIssued.toLocaleString()}
          description="Certificates issued"
          icon={Award}
          trend={{ value: 18, isPositive: true }}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Completion Trends</CardTitle>
                <CardDescription>Course completion rates over time</CardDescription>
              </div>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completions">Completions</SelectItem>
                  <SelectItem value="enrollments">Enrollments</SelectItem>
                  <SelectItem value="scores">Test Scores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple chart visualization with bars */}
            <div className="space-y-4">
              {chartData[selectedMetric as keyof typeof chartData]?.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground">{item.name}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cosmic-purple to-electric-violet h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.value / Math.max(...chartData[selectedMetric as keyof typeof chartData].map(d => d.value))) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-right">{item.value}{selectedMetric === 'completions' ? '%' : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Daily active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {analyticsData.userEngagement.dailyActive[analyticsData.userEngagement.dailyActive.length - 1]}
                  </div>
                  <div className="text-xs text-muted-foreground">Daily Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {analyticsData.userEngagement.weeklyActive[analyticsData.userEngagement.weeklyActive.length - 1]}
                  </div>
                  <div className="text-xs text-muted-foreground">Weekly Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {analyticsData.userEngagement.monthlyActive[analyticsData.userEngagement.monthlyActive.length - 1]}
                  </div>
                  <div className="text-xs text-muted-foreground">Monthly Active</div>
                </div>
              </div>
              
              {/* Simple line chart representation */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Daily Active Users (Last 30 Days)</div>
                <div className="h-32 flex items-end gap-1">
                  {analyticsData.userEngagement.dailyActive.slice(-15).map((value, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-t from-cosmic-purple to-electric-violet rounded-sm flex-1 transition-all duration-500"
                      style={{ height: `${(value / Math.max(...analyticsData.userEngagement.dailyActive)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress Distribution</CardTitle>
          <CardDescription>Current status of all enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">{analyticsData.completionData.completed.toLocaleString()}</span>
              </div>
              <Progress 
                value={(analyticsData.completionData.completed / (analyticsData.completionData.completed + analyticsData.completionData.inProgress + analyticsData.completionData.notStarted + analyticsData.completionData.dropped)) * 100} 
                className="h-3"
              />
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>20.5% completion rate</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm text-muted-foreground">{analyticsData.completionData.inProgress.toLocaleString()}</span>
              </div>
              <Progress 
                value={(analyticsData.completionData.inProgress / (analyticsData.completionData.completed + analyticsData.completionData.inProgress + analyticsData.completionData.notStarted + analyticsData.completionData.dropped)) * 100} 
                className="h-3"
              />
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Play className="h-4 w-4" />
                <span>27.4% actively learning</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Not Started</span>
                <span className="text-sm text-muted-foreground">{analyticsData.completionData.notStarted.toLocaleString()}</span>
              </div>
              <Progress 
                value={(analyticsData.completionData.notStarted / (analyticsData.completionData.completed + analyticsData.completionData.inProgress + analyticsData.completionData.notStarted + analyticsData.completionData.dropped)) * 100} 
                className="h-3"
              />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>36.2% yet to begin</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dropped</span>
                <span className="text-sm text-muted-foreground">{analyticsData.completionData.dropped.toLocaleString()}</span>
              </div>
              <Progress 
                value={(analyticsData.completionData.dropped / (analyticsData.completionData.completed + analyticsData.completionData.inProgress + analyticsData.completionData.notStarted + analyticsData.completionData.dropped)) * 100} 
                className="h-3"
              />
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="h-4 w-4" />
                <span>15.9% dropout rate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Performance Analysis</CardTitle>
              <CardDescription>Detailed metrics for each course</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={analyticsData.coursePerformance}
            columns={courseColumns}
            searchable={false}
            actions={courseActions}
            keyExtractor={(course) => course.id}
          />
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Data-driven observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Excellent Security Awareness Engagement</div>
                  <div className="text-sm text-green-700">34% increase in enrollments this month, with Phishing Detection achieving 92% completion rate.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Compliance Training Opportunities</div>
                  <div className="text-sm text-yellow-700">SOC 2 has higher dropout (25%). Consider breaking complex compliance topics into smaller modules.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Top Performing Security Content</div>
                  <div className="text-sm text-blue-700">Phishing Detection maintains 92% completion with 4.9/5 rating - excellent practical training approach.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Suggested actions for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border border-cosmic-purple/20 bg-cosmic-purple/5 rounded-lg">
                <div className="font-medium text-cosmic-purple mb-1">Enhance Compliance Training Effectiveness</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Higher dropout rates in complex compliance courses suggest need for improvement:
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Break ISO 27001 and SOC 2 into shorter, focused modules</li>
                  <li>• Add real-world case studies and practical scenarios</li>
                  <li>• Include interactive compliance assessment tools</li>
                </ul>
              </div>
              
              <div className="p-3 border border-electric-violet/20 bg-electric-violet/5 rounded-lg">
                <div className="font-medium text-electric-violet mb-1">Expand Successful Security Training</div>
                <div className="text-sm text-muted-foreground">
                  Create advanced modules for Phishing Detection and specialized AI security training based on high completion rates and engagement.
                </div>
              </div>
              
              <div className="p-3 border border-phosphor-cyan/20 bg-phosphor-cyan/5 rounded-lg">
                <div className="font-medium text-phosphor-cyan mb-1">Implement Continuous Security Training</div>
                <div className="text-sm text-muted-foreground">
                  Add monthly phishing simulations and micro-learning modules to maintain high security awareness throughout the year.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}