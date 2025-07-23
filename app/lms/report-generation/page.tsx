'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Button } from '@/components/atomic/button'
import { Progress } from '@/components/atomic/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs'
import { Textarea } from '@/components/textarea'
import { mockUsers, getUsersByRole, User } from '@/lib/lms/mock-data'
import { initialRoles } from '@/lib/lms/roles-data'
import { 
  Users, TrendingUp, AlertCircle, Award, Activity, Target, Zap, X, Info,
  FileText, MessageSquare, ChevronRight, Download, RefreshCw, Share2, BarChart3,
  Loader2, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ContextWindow, 
  ContextWindowTrigger, 
  ContextWindowProvider, 
  ContextWindowLayout,
  useContextWindow 
} from '@/components/context-window'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'
import { ChartContainer, ChartTooltipContent, ChartLegendContent, ChartTooltip, ChartLegend } from '@/components/ui/chart'

// Vergil color palette for charts
const CHART_COLORS = {
  primary: '#7B00FF', // Vergil Purple
  secondary: '#0087FF', // Blue
  success: '#0F8A0F', // Green  
  warning: '#FFC700', // Yellow
  danger: '#E51C23', // Red
  info: '#3B82F6', // Synaptic Blue
  purple50: '#F3E6FF',
  purple100: '#E6CCFF',
  purple200: '#D199FF',
  purple300: '#BB66FF',
  purple400: '#A64DFF',
  purple500: '#9933FF',
}

// Chart configuration
const chartConfig = {
  ahead: { label: "Ahead", color: CHART_COLORS.success },
  on_track: { label: "On Track", color: CHART_COLORS.primary },
  at_risk: { label: "At Risk", color: CHART_COLORS.warning },
  behind: { label: "Behind", color: CHART_COLORS.danger },
  completion: { label: "Completion", color: CHART_COLORS.primary },
  team: { label: "Team Average", color: CHART_COLORS.secondary },
  target: { label: "Target", color: CHART_COLORS.info },
}

// Get subordinates for a user based on role hierarchy
function getSubordinates(userId: string): User[] {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  const roleHierarchy: Record<string, string[]> = {
    '1': ['2'], // Super Admin -> Admins
    '2': ['3', '4'], // Admin -> Managers & Instructors
    '3': [], // Manager -> Team members
    '4': [], // Instructor -> Students
  }
  
  const subordinateRoles = roleHierarchy[user.roleId] || []
  
  let subordinates: User[] = []
  subordinateRoles.forEach(roleId => {
    subordinates = [...subordinates, ...getUsersByRole(roleId)]
  })
  
  // For managers and instructors, simulate some team members
  if (user.roleId === '3' || user.roleId === '4') {
    const teamSize = 3 + Math.floor(Number(userId.slice(1)) % 5)
    const startIdx = (Number(userId.slice(1)) * 3) % mockUsers.length
    const teamMembers = mockUsers.slice(startIdx, startIdx + teamSize)
      .filter(u => u.roleId !== '1' && u.roleId !== '2' && u.id !== userId)
    subordinates = [...subordinates, ...teamMembers]
  }
  
  return Array.from(new Map(subordinates.map(s => [s.id, s])).values())
}

// Calculate all subordinates recursively
function getAllSubordinatesRecursive(userId: string, visited = new Set<string>()): User[] {
  if (visited.has(userId)) return []
  visited.add(userId)
  
  const directSubordinates = getSubordinates(userId)
  let allSubordinates = [...directSubordinates]
  
  directSubordinates.forEach(sub => {
    const subSubordinates = getAllSubordinatesRecursive(sub.id, visited)
    allSubordinates = [...allSubordinates, ...subSubordinates]
  })
  
  return Array.from(new Map(allSubordinates.map(s => [s.id, s])).values())
}

function ReportGenerationContent() {
  const [selectedUserId, setSelectedUserId] = useState('u1') // Default to Super Admin
  const [viewMode, setViewMode] = useState<'direct' | 'all'>('all') // Toggle for direct vs all subordinates
  
  const currentUser = useMemo(() => {
    return mockUsers.find(u => u.id === selectedUserId) || mockUsers[0]
  }, [selectedUserId])
  
  const currentUserRole = useMemo(() => {
    return initialRoles.find(r => r.id === currentUser.roleId)
  }, [currentUser])
  
  const allSubordinates = useMemo(() => {
    if (viewMode === 'all') {
      return getAllSubordinatesRecursive(currentUser.id)
    } else {
      return getSubordinates(currentUser.id)
    }
  }, [currentUser, viewMode])
  
  // Aggregate metrics
  const metrics = useMemo(() => {
    const teamSize = allSubordinates.length
    const avgProgress = teamSize > 0 
      ? Math.round(allSubordinates.reduce((acc, u) => acc + u.completionRate, 0) / teamSize)
      : 0
    
    const statusBreakdown = allSubordinates.reduce((acc, u) => {
      acc[u.status] = (acc[u.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const atRiskCount = (statusBreakdown['at_risk'] || 0) + (statusBreakdown['behind'] || 0)
    const onTrackPercentage = teamSize > 0 
      ? Math.round(((statusBreakdown['on_track'] || 0) + (statusBreakdown['ahead'] || 0)) / teamSize * 100)
      : 0
    
    return {
      teamSize,
      avgProgress,
      statusBreakdown,
      atRiskCount,
      onTrackPercentage,
    }
  }, [allSubordinates])
  
  // Progress distribution data for histogram
  const progressDistribution = useMemo(() => {
    const ranges = [
      { name: '0-20%', min: 0, max: 20, count: 0 },
      { name: '21-40%', min: 21, max: 40, count: 0 },
      { name: '41-60%', min: 41, max: 60, count: 0 },
      { name: '61-80%', min: 61, max: 80, count: 0 },
      { name: '81-100%', min: 81, max: 100, count: 0 },
    ]
    
    allSubordinates.forEach(user => {
      const range = ranges.find(r => user.completionRate >= r.min && user.completionRate <= r.max)
      if (range) range.count++
    })
    
    return ranges
  }, [allSubordinates])
  
  // Role-based progress data
  const roleProgress = useMemo(() => {
    const roleData: Record<string, { total: number, sum: number, users: User[] }> = {}
    
    allSubordinates.forEach(user => {
      const role = initialRoles.find(r => r.id === user.roleId)?.name || 'Unknown'
      if (!roleData[role]) {
        roleData[role] = { total: 0, sum: 0, users: [] }
      }
      roleData[role].total++
      roleData[role].sum += user.completionRate
      roleData[role].users.push(user)
    })
    
    return Object.entries(roleData).map(([role, data]) => ({
      role,
      average: Math.round(data.sum / data.total),
      count: data.total,
      atRisk: data.users.filter(u => u.status === 'at_risk' || u.status === 'behind').length
    }))
  }, [allSubordinates])
  
  // Time series data (simulated)
  const timeSeriesData = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))
      const variance = Math.random() * 10 - 5
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        individual: Math.max(0, Math.min(100, currentUser.completionRate + variance)),
        team: Math.max(0, Math.min(100, metrics.avgProgress + variance)),
        target: 85,
      }
    })
  }, [currentUser.completionRate, metrics.avgProgress])
  
  // Skill radar data - aggregate skills across all team members
  const skillRadarData = useMemo(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return [
        { skill: 'AI Definition', value: 85, fullMark: 100 },
        { skill: 'Search Algorithms', value: 65, fullMark: 100 },
        { skill: 'Machine Learning', value: 70, fullMark: 100 },
        { skill: 'Neural Networks', value: 45, fullMark: 100 },
        { skill: 'Model Evaluation', value: 80, fullMark: 100 },
        { skill: 'Problem Solving', value: 75, fullMark: 100 },
      ]
    }
    
    // Load course data to get knowledge points
    const courseDataString = localStorage.getItem('course-ai-fundamentals')
    if (!courseDataString) {
      // Fallback data
      return [
        { skill: 'AI Definition', value: 85, fullMark: 100 },
        { skill: 'Search Algorithms', value: 65, fullMark: 100 },
        { skill: 'Machine Learning', value: 70, fullMark: 100 },
        { skill: 'Neural Networks', value: 45, fullMark: 100 },
        { skill: 'Model Evaluation', value: 80, fullMark: 100 },
        { skill: 'Problem Solving', value: 75, fullMark: 100 },
      ]
    }
    
    try {
      const courseData = JSON.parse(courseDataString)
      const skillMap = new Map<string, { total: number, count: number }>()
      
      // Aggregate all knowledge points across chapters
      courseData.chapters.forEach((chapter: any) => {
        chapter.lessons.forEach((lesson: any) => {
          lesson.knowledgePoints.forEach((kp: any) => {
            // Simulate team average with some variance
            const teamAvg = Math.max(0, Math.min(100, kp.proficiency + (Math.random() * 20 - 10)))
            
            if (!skillMap.has(kp.title)) {
              skillMap.set(kp.title, { total: 0, count: 0 })
            }
            const skill = skillMap.get(kp.title)!
            skill.total += teamAvg
            skill.count += 1
          })
        })
      })
      
      // Convert to radar chart format - take top 8 skills
      const radarData = Array.from(skillMap.entries())
        .map(([skill, data]) => ({
          skill: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
          value: Math.round(data.total / data.count),
          fullMark: 100
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
      
      return radarData
    } catch (e) {
      // Return fallback data on error
      return [
        { skill: 'AI Definition', value: 85, fullMark: 100 },
        { skill: 'Search Algorithms', value: 65, fullMark: 100 },
        { skill: 'Machine Learning', value: 70, fullMark: 100 },
        { skill: 'Neural Networks', value: 45, fullMark: 100 },
        { skill: 'Model Evaluation', value: 80, fullMark: 100 },
        { skill: 'Problem Solving', value: 75, fullMark: 100 },
      ]
    }
  }, [])
  
  // Knowledge points matrix data
  const knowledgeMatrixData = useMemo(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return {
        chapters: [
          {
            title: 'Introduction to AI',
            lessons: [
              {
                title: 'What is AI?',
                knowledgePoints: [
                  { title: 'AI Definition', avgProficiency: 85, learnerCount: metrics.teamSize },
                  { title: 'History of AI', avgProficiency: 90, learnerCount: metrics.teamSize },
                  { title: 'AI Applications', avgProficiency: 75, learnerCount: metrics.teamSize },
                ]
              }
            ]
          }
        ]
      }
    }
    
    // Load course data to get knowledge points
    const courseDataString = localStorage.getItem('course-ai-fundamentals')
    if (!courseDataString) {
      // Fallback sample data if no course data found
      return {
        chapters: [
          {
            title: 'Introduction to AI',
            lessons: [
              {
                title: 'What is AI?',
                knowledgePoints: [
                  { title: 'AI Definition', avgProficiency: 85, learnerCount: metrics.teamSize },
                  { title: 'History of AI', avgProficiency: 90, learnerCount: metrics.teamSize },
                  { title: 'AI Applications', avgProficiency: 75, learnerCount: metrics.teamSize },
                ]
              },
              {
                title: 'Search Algorithms',
                knowledgePoints: [
                  { title: 'Search Methods', avgProficiency: 65, learnerCount: metrics.teamSize },
                  { title: 'Optimization', avgProficiency: 45, learnerCount: metrics.teamSize },
                  { title: 'Constraints', avgProficiency: 60, learnerCount: metrics.teamSize },
                ]
              }
            ]
          },
          {
            title: 'Machine Learning',
            lessons: [
              {
                title: 'ML Basics',
                knowledgePoints: [
                  { title: 'Supervised Learning', avgProficiency: 70, learnerCount: metrics.teamSize },
                  { title: 'Unsupervised Learning', avgProficiency: 55, learnerCount: metrics.teamSize },
                  { title: 'Model Evaluation', avgProficiency: 80, learnerCount: metrics.teamSize },
                ]
              }
            ]
          }
        ]
      }
    }
    
    try {
      const courseData = JSON.parse(courseDataString)
      
      // Aggregate knowledge points across team
      const aggregatedData = courseData.chapters.map((chapter: any) => ({
        title: chapter.title,
        lessons: chapter.lessons.map((lesson: any) => ({
          title: lesson.title,
          knowledgePoints: lesson.knowledgePoints.map((kp: any) => {
            // Simulate team-wide proficiency (in real app, would aggregate from all team members)
            const variance = Math.random() * 20 - 10 // ±10% variance
            const teamAvgProficiency = Math.max(0, Math.min(100, kp.proficiency + variance))
            
            return {
              title: kp.title,
              description: kp.description,
              avgProficiency: Math.round(teamAvgProficiency),
              learnerCount: Math.floor(metrics.teamSize * (0.7 + Math.random() * 0.3)), // 70-100% of team
            }
          })
        }))
      }))
      
      return { chapters: aggregatedData }
    } catch (e) {
      // Return sample data on error
      return {
        chapters: [
          {
            title: 'Introduction to AI',
            lessons: [
              {
                title: 'What is AI?',
                knowledgePoints: [
                  { title: 'AI Definition', avgProficiency: 85, learnerCount: metrics.teamSize },
                  { title: 'History of AI', avgProficiency: 90, learnerCount: metrics.teamSize },
                  { title: 'AI Applications', avgProficiency: 75, learnerCount: metrics.teamSize },
                ]
              }
            ]
          }
        ]
      }
    }
  }, [metrics.teamSize])
  
  return (
    <div className="min-h-screen bg-bg-secondary p-spacing-lg"> {/* #F5F5F7, 24px */}
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-spacing-xl"> {/* 32px */}
          <div className="flex items-center justify-between mb-spacing-md"> {/* 16px */}
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-spacing-xs"> {/* #1D1D1F, 4px */}
                Team Progress Analytics
              </h1>
              <p className="text-text-secondary"> {/* #6C6C6D */}
                {viewMode === 'all' 
                  ? 'Aggregate performance metrics and insights for your entire organization'
                  : 'Performance metrics for your direct reports only'
                }
              </p>
            </div>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'direct' | 'all')}>
              <TabsList variant="default">
                <TabsTrigger value="direct">Direct Reports</TabsTrigger>
                <TabsTrigger value="all">All Team Members</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-spacing-md mb-spacing-lg"> {/* 16px, 24px */}
          <Card>
            <CardContent className="p-spacing-lg"> {/* 24px */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Team Size</p> {/* #6C6C6D */}
                  <p className="text-3xl font-bold text-text-primary">{metrics.teamSize}</p> {/* #1D1D1F */}
                  <p className="text-xs text-text-tertiary mt-1">
                    {viewMode === 'all' ? 'Direct & indirect reports' : 'Direct reports only'}
                  </p> {/* #71717A */}
                </div>
                <div className="p-3 bg-bg-brand/10 rounded-lg"> {/* rgba(123,0,255,0.1) */}
                  <Users className="h-6 w-6 text-text-brand" /> {/* #7B00FF */}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-spacing-lg"> {/* 24px */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Average Progress</p> {/* #6C6C6D */}
                  <p className="text-3xl font-bold text-text-primary">{metrics.avgProgress}%</p> {/* #1D1D1F */}
                  <p className="text-xs text-text-tertiary mt-1">Across all team members</p> {/* #71717A */}
                </div>
                <div className="p-3 bg-bg-success/10 rounded-lg"> {/* rgba(15,138,15,0.1) */}
                  <TrendingUp className="h-6 w-6 text-text-success" /> {/* #0F8A0F */}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-spacing-lg"> {/* 24px */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">On Track</p> {/* #6C6C6D */}
                  <p className="text-3xl font-bold text-text-primary">{metrics.onTrackPercentage}%</p> {/* #1D1D1F */}
                  <p className="text-xs text-text-tertiary mt-1">Meeting targets</p> {/* #71717A */}
                </div>
                <div className="p-3 bg-bg-info/10 rounded-lg"> {/* rgba(0,135,255,0.1) */}
                  <Target className="h-6 w-6 text-text-info" /> {/* #0087FF */}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-spacing-lg"> {/* 24px */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Need Attention</p> {/* #6C6C6D */}
                  <p className="text-3xl font-bold text-text-error">{metrics.atRiskCount}</p> {/* #E51C23 */}
                  <p className="text-xs text-text-tertiary mt-1">At risk or behind</p> {/* #71717A */}
                </div>
                <div className="p-3 bg-bg-error/10 rounded-lg"> {/* rgba(229,28,35,0.1) */}
                  <AlertCircle className="h-6 w-6 text-text-error" /> {/* #E51C23 */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-lg mb-spacing-lg"> {/* 24px */}
          {/* Progress Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Trend</CardTitle>
              <CardDescription>Individual vs team average over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorIndividual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" stroke="#6C6C6D" fontSize={12} />
                    <YAxis stroke="#6C6C6D" fontSize={12} />
                    <ChartTooltip />
                    <ChartLegend />
                    <Area 
                      type="monotone" 
                      dataKey="individual" 
                      stroke={CHART_COLORS.primary} 
                      fillOpacity={1} 
                      fill="url(#colorIndividual)"
                      name="Individual"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="team" 
                      stroke={CHART_COLORS.secondary} 
                      fillOpacity={1} 
                      fill="url(#colorTeam)"
                      name="Team Average"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke={CHART_COLORS.info} 
                      strokeDasharray="5 5"
                      dot={false}
                      name="Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Team Status Distribution</CardTitle>
              <CardDescription>Current performance status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(metrics.statusBreakdown).map(([status, count]) => ({
                        name: status.replace('_', ' '),
                        value: count,
                        status
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {Object.entries(metrics.statusBreakdown).map(([status], index) => (
                        <Cell key={`cell-${index}`} fill={chartConfig[status as keyof typeof chartConfig]?.color || CHART_COLORS.primary} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Progress Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Distribution</CardTitle>
              <CardDescription>Team members grouped by completion percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" stroke="#6C6C6D" fontSize={12} />
                    <YAxis stroke="#6C6C6D" fontSize={12} />
                    <ChartTooltip />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]}>
                      {progressDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.min >= 81 ? CHART_COLORS.success :
                            entry.min >= 61 ? CHART_COLORS.primary :
                            entry.min >= 41 ? CHART_COLORS.warning :
                            CHART_COLORS.danger
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Role Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Role</CardTitle>
              <CardDescription>Average progress and risk metrics by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleProgress} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="role" stroke="#6C6C6D" fontSize={12} />
                    <YAxis stroke="#6C6C6D" fontSize={12} />
                    <ChartTooltip />
                    <ChartLegend />
                    <Bar dataKey="average" fill={CHART_COLORS.primary} name="Average Progress" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="atRisk" fill={CHART_COLORS.danger} name="At Risk Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Skills Spider Chart and Knowledge Matrix Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-lg mb-spacing-lg"> {/* 24px */}
          {/* Team Skills Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Team Skills Overview</CardTitle>
              <CardDescription>Average skill proficiency across all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadarData}>
                    <PolarGrid 
                      gridType="polygon" 
                      radialLines={true}
                      stroke="rgba(0,0,0,0.1)"
                    />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fontSize: 12 }}
                      className="text-text-secondary"
                    />
                    <PolarRadiusAxis 
                      angle={90}
                      domain={[0, 100]}
                      tickCount={5}
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                    />
                    <Radar 
                      name="Team Average" 
                      dataKey="value" 
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <ChartTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Skill Legend */}
              <div className="mt-spacing-md grid grid-cols-2 gap-spacing-sm text-sm"> {/* 16px, 8px */}
                {skillRadarData.slice(0, 4).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-text-secondary truncate mr-2">{skill.skill}:</span>
                    <span className="font-medium text-text-primary">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Top Skills Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency Rankings</CardTitle>
              <CardDescription>Team strengths and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-spacing-lg"> {/* 24px */}
                {skillRadarData.map((skill, index) => {
                  const getVariant = (value: number): "default" | "success" | "warning" | "error" => {
                    if (value >= 80) return 'success'
                    if (value >= 60) return 'default'
                    if (value >= 40) return 'warning'
                    return 'error'
                  }
                  
                  const getSkillLevel = (value: number) => {
                    if (value >= 80) return 'Expert'
                    if (value >= 60) return 'Proficient'
                    if (value >= 40) return 'Developing'
                    return 'Beginner'
                  }
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">{skill.skill}</span>
                        <div className="flex items-center gap-spacing-sm"> {/* 8px */}
                          <span className="text-xs text-text-secondary">{getSkillLevel(skill.value)}</span>
                          <span className="text-sm font-semibold text-text-primary min-w-[45px] text-right">{skill.value}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={skill.value}
                        variant={getVariant(skill.value)}
                        size="sm"
                        className="w-full"
                      />
                    </div>
                  )
                })}
              </div>
              
              {/* Summary Stats */}
              <div className="mt-spacing-lg pt-spacing-lg border-t border-border-subtle grid grid-cols-3 gap-spacing-md text-center"> {/* 24px */}
                <div>
                  <p className="text-xs text-text-tertiary">Strongest</p>
                  <p className="text-sm font-semibold text-text-success">{skillRadarData[0]?.skill}</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Average</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {Math.round(skillRadarData.reduce((acc, s) => acc + s.value, 0) / skillRadarData.length)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Weakest</p>
                  <p className="text-sm font-semibold text-text-error">{skillRadarData[skillRadarData.length - 1]?.skill}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ReportGenerationPage() {
  return (
    <ContextWindowProvider defaultState="closed">
      <ContextWindowLayout compactSize="medium" expandedSize="large">
        <ReportGenerationContent />
        <ContextWindowTrigger />
        <ContextWindow>
          <ContextWindowContent />
        </ContextWindow>
      </ContextWindowLayout>
    </ContextWindowProvider>
  )
}

// Context Window Content Component
function ContextWindowContent() {
  const { state, compact, close } = useContextWindow()
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-spacing-lg border-b border-border-subtle"> {/* 24px, rgba(0,0,0,0.05) */}
        <div className="flex items-center gap-spacing-sm"> {/* 8px */}
          <FileText className="h-5 w-5 text-text-brand" /> {/* #7B00FF */}
          <h2 className="text-lg font-semibold text-text-primary">Generate Report</h2> {/* #1D1D1F */}
        </div>
        <button
          onClick={close}
          className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-bg-emphasis transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ReportGeneratorContent />
      </div>
    </div>
  )
}

// Report Generator Content
function ReportGeneratorContent() {
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'input' | 'processing' | 'configuring' | 'generating' | 'preview'>('input')
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [planningStep, setPlanningStep] = useState(0)
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 })
  
  const placeholders = [
    "Generate a monthly performance report for my direct reports",
    "Show me skill progression trends for the last quarter",
    "Create an executive summary of team learning progress",
    "Build a skills gap analysis for my department",
    "Generate individual progress reports for all team members",
    "Create a training recommendations report based on current skills"
  ]
  
  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  // Load recent reports from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentReports')
    if (stored) {
      setRecentReports(JSON.parse(stored))
    }
  }, [])
  
  const handleGenerate = async () => {
    if (!query.trim()) return
    
    setIsProcessing(true)
    setStep('processing')
    setPlanningStep(1)
    setStepProgress({ 1: 0, 2: 0, 3: 0 })
    
    // Animate step 1 progress
    let progress1 = 0
    const interval1 = setInterval(() => {
      progress1 += 2.5
      setStepProgress(prev => ({ ...prev, 1: Math.min(progress1, 100) }))
      if (progress1 >= 100) {
        clearInterval(interval1)
        setTimeout(() => {
          setPlanningStep(2)
          
          // Animate step 2 progress
          let progress2 = 0
          const interval2 = setInterval(() => {
            progress2 += 2.5
            setStepProgress(prev => ({ ...prev, 2: Math.min(progress2, 100) }))
            if (progress2 >= 100) {
              clearInterval(interval2)
              setTimeout(() => {
                setPlanningStep(3)
                
                // Animate step 3 progress
                let progress3 = 0
                const interval3 = setInterval(() => {
                  progress3 += 2.5
                  setStepProgress(prev => ({ ...prev, 3: Math.min(progress3, 100) }))
                  if (progress3 >= 100) {
                    clearInterval(interval3)
                    setTimeout(() => {
                      setPlanningStep(4)
                      setStep('preview')
                      setIsProcessing(false)
                    }, 300)
                  }
                }, 50)
              }, 300)
            }
          }, 50)
        }, 300)
      }
    }, 50)
  }
  
  const reportTemplates = [
    {
      id: 'weekly',
      title: 'Weekly Summary',
      description: 'Team progress and key metrics',
      prompt: 'Generate a weekly summary report showing team progress, completion rates, and key performance indicators'
    },
    {
      id: 'monthly',
      title: 'Monthly Performance Review',
      description: 'Detailed monthly analysis',
      prompt: 'Create a comprehensive monthly performance report with trends, achievements, and areas for improvement'
    },
    {
      id: 'skills',
      title: 'Skills Gap Analysis',
      description: 'Identify training needs',
      prompt: 'Generate a skills gap analysis report highlighting areas where the team needs additional training'
    },
    {
      id: 'individual',
      title: 'Individual Progress Report',
      description: 'Personal learning journey',
      prompt: 'Create individual progress reports for each team member showing their learning journey and achievements'
    },
    {
      id: 'executive',
      title: 'Executive Dashboard',
      description: 'High-level overview',
      prompt: 'Generate an executive summary dashboard with high-level metrics and strategic insights'
    },
    {
      id: 'training',
      title: 'Training Recommendations',
      description: 'Suggested learning paths',
      prompt: 'Create a report with personalized training recommendations based on current skill levels and goals'
    }
  ]
  
  if (step === 'processing') {
    return (
      <div className="p-spacing-lg">
        <Card className="p-spacing-md overflow-hidden">
          <div className="flex items-center gap-spacing-xs mb-spacing-sm">
            <Sparkles className="h-4 w-4 text-text-brand animate-pulse" />
            <h4 className="text-sm font-semibold text-text-primary">AI Report Generator</h4>
          </div>
          
          <div className="text-sm text-text-secondary mb-spacing-md">
            Generating: "{query}"
          </div>
          
          <div className="space-y-spacing-md">
            {/* Step 1 */}
            {planningStep >= 1 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 1 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 1 ? "bg-bg-brand text-text-inverse animate-pulse" : "bg-bg-success text-text-inverse"
                  )}>
                    {planningStep > 1 ? (
                      "✓"
                    ) : planningStep === 1 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-text-primary">Understanding Your Request</span>
                      {planningStep === 1 && (
                        <span className="text-xs text-text-brand animate-pulse">Analyzing...</span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">Parsing natural language query</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[1]} 
                  className="h-1.5"
                  variant={stepProgress[1] === 100 ? "success" : "default"}
                />
              </div>
            )}
            
            {/* Step 2 */}
            {planningStep >= 2 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 2 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 2 ? "bg-bg-brand text-text-inverse animate-pulse" : "bg-bg-success text-text-inverse"
                  )}>
                    {planningStep > 2 ? (
                      "✓"
                    ) : planningStep === 2 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-text-primary">Collecting Data</span>
                      {planningStep === 2 && (
                        <span className="text-xs text-text-brand animate-pulse">Processing...</span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">Gathering metrics and analytics</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[2]} 
                  className="h-1.5"
                  variant={stepProgress[2] === 100 ? "success" : "default"}
                />
              </div>
            )}
            
            {/* Step 3 */}
            {planningStep >= 3 && (
              <div className={cn(
                "transition-all duration-500 transform",
                planningStep < 3 ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              )}>
                <div className="flex items-start gap-spacing-sm mb-spacing-xs">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    planningStep === 3 ? "bg-bg-brand text-text-inverse animate-pulse" : "bg-bg-success text-text-inverse"
                  )}>
                    {planningStep > 3 ? (
                      "✓"
                    ) : planningStep === 3 ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-spacing-xs">
                      <span className="text-sm font-medium text-text-primary">Generating Report</span>
                      {planningStep === 3 && (
                        <span className="text-xs text-text-brand animate-pulse">Creating...</span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">Building PDF with charts and insights</div>
                  </div>
                </div>
                <Progress 
                  value={stepProgress[3]} 
                  className="h-1.5"
                  variant={stepProgress[3] === 100 ? "success" : "default"}
                />
              </div>
            )}
          </div>
          
          {/* AI Thinking Indicator */}
          {planningStep < 4 && planningStep > 0 && (
            <div className="mt-spacing-md pt-spacing-sm border-t border-border-subtle">
              <div className="flex items-center justify-center gap-spacing-xs text-xs text-text-secondary">
                <div className="flex gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-bg-brand rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-bg-brand rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-1.5 h-1.5 bg-bg-brand rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>AI is thinking</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }
  
  if (step === 'preview') {
    return (
      <div className="p-spacing-lg">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-bg-brand/5 to-bg-brand/10 p-spacing-xl">
            <div className="flex items-center justify-center mb-spacing-md">
              <div className="w-20 h-20 bg-bg-brand/10 rounded-2xl flex items-center justify-center animate-pulse">
                <Sparkles className="h-10 w-10 text-text-brand" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary text-center mb-spacing-sm">
              Report Generated Successfully!
            </h3>
            <p className="text-text-secondary text-center max-w-md mx-auto">
              Your comprehensive analytics report is ready for download
            </p>
          </div>
          
          <CardContent className="p-spacing-xl">
            {/* Report Preview Card */}
            <div className="bg-gradient-to-b from-bg-secondary to-bg-primary rounded-xl p-spacing-lg mb-spacing-lg shadow-sm border border-border-subtle">
              <div className="flex items-start gap-spacing-md">
                <div className="w-14 h-14 bg-bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-7 w-7 text-text-brand" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary mb-1">
                    Monthly Performance Report
                  </h4>
                  <p className="text-sm text-text-secondary mb-spacing-sm">
                    November 2024 • 12 pages • PDF format
                  </p>
                  <div className="flex flex-wrap gap-spacing-xs">
                    <Badge variant="default" className="bg-bg-brand/10 text-text-brand">
                      Team Analytics
                    </Badge>
                    <Badge variant="default" className="bg-bg-success/10 text-text-success">
                      Complete
                    </Badge>
                    <Badge variant="default" className="bg-bg-info/10 text-text-info">
                      Ready
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Mini preview sections */}
              <div className="mt-spacing-lg pt-spacing-lg border-t border-border-subtle">
                <p className="text-xs font-medium text-text-secondary mb-spacing-sm">REPORT CONTENTS</p>
                <div className="space-y-spacing-xs">
                  <div className="flex items-center gap-spacing-sm text-sm">
                    <div className="w-1.5 h-1.5 bg-bg-brand rounded-full"></div>
                    <span className="text-text-primary">Executive Summary</span>
                  </div>
                  <div className="flex items-center gap-spacing-sm text-sm">
                    <div className="w-1.5 h-1.5 bg-bg-brand rounded-full"></div>
                    <span className="text-text-primary">Team Performance Metrics</span>
                  </div>
                  <div className="flex items-center gap-spacing-sm text-sm">
                    <div className="w-1.5 h-1.5 bg-bg-brand rounded-full"></div>
                    <span className="text-text-primary">Skills Analysis & Insights</span>
                  </div>
                  <div className="flex items-center gap-spacing-sm text-sm">
                    <div className="w-1.5 h-1.5 bg-bg-brand rounded-full"></div>
                    <span className="text-text-primary">Recommendations & Next Steps</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-spacing-sm">
              <Button variant="primary" size="lg" className="w-full h-12 text-base font-semibold shadow-brand-sm hover:shadow-brand-md">
                <Download className="h-5 w-5 mr-2" />
                Download PDF Report
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-spacing-sm">
                <Button variant="secondary" size="md" className="flex-1 justify-center">
                  <Share2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Share Report</span>
                </Button>
                <Button variant="ghost" size="md" className="flex-1 justify-center">
                  <RefreshCw className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Regenerate</span>
                </Button>
              </div>
            </div>
            
            {/* Additional Actions */}
            <div className="mt-spacing-lg pt-spacing-lg border-t border-border-subtle">
              <div className="flex items-center justify-between text-sm">
                <button 
                  onClick={() => {
                    setStep('input')
                    setQuery('')
                    setPlanningStep(0)
                    setStepProgress({ 1: 0, 2: 0, 3: 0 })
                  }}
                  className="text-text-brand hover:text-text-brand/80 font-medium transition-colors"
                >
                  ← Generate Another Report
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  View Report History
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-spacing-lg space-y-spacing-lg">
      {/* Natural Language Input */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-md flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-text-brand" />
          What report do you need?
        </h3>
        <div className="space-y-spacing-sm">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="min-h-[120px] resize-none transition-all"
            disabled={isProcessing}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-tertiary">{query.length}/500</p>
            <div className="flex gap-spacing-sm">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setQuery('')}
                disabled={!query || isProcessing}
              >
                Clear
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleGenerate}
                disabled={!query.trim() || isProcessing}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Templates */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-spacing-sm">Quick Templates</h4>
        <div className="grid grid-cols-1 gap-spacing-sm">
          {reportTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setQuery(template.prompt)}
              className="flex items-start gap-spacing-sm p-spacing-md rounded-lg border border-border-subtle hover:border-border-default hover:bg-bg-emphasis transition-all text-left"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{template.title}</p>
                <p className="text-xs text-text-secondary">{template.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-tertiary" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-spacing-sm">Recent Reports</h4>
          <div className="space-y-spacing-sm">
            {recentReports.slice(0, 3).map((report, index) => (
              <Card key={index} className="p-spacing-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-spacing-sm">
                    <FileText className="h-4 w-4 text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{report.title}</p>
                      <p className="text-xs text-text-secondary">Generated {report.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {recentReports.length === 0 && (
        <Card className="p-spacing-xl text-center">
          <BarChart3 className="h-12 w-12 text-text-tertiary mx-auto mb-spacing-md" />
          <h4 className="text-base font-medium text-text-primary mb-spacing-sm">No reports yet</h4>
          <p className="text-sm text-text-secondary">
            Start by describing what report you need or use a template above
          </p>
        </Card>
      )}
    </div>
  )
}