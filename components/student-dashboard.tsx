'use client'

import { useState, useEffect } from 'react'
import { 
  Book, 
  Trophy, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Star,
  ChevronRight,
  Users,
  BarChart,
  Brain,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface Course {
  id: string
  title: string
  progress: number
  nextLesson: string
  dueDate?: string
  thumbnail?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  total?: number
}

interface Activity {
  id: string
  type: 'lesson' | 'test' | 'achievement'
  title: string
  course: string
  timestamp: string
  score?: number
}

export function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week')

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Mock user data with semantic tokens
  const user = {
    name: "Alex Chen",
    level: 12,
    xp: 2340,
    xpToNextLevel: 3000,
    streak: 7,
    totalCourses: 12,
    completedCourses: 4,
    hoursThisWeek: 8.5,
    rank: 23,
    totalStudents: 145
  }

  // Mock courses in progress
  const coursesInProgress: Course[] = [
    {
      id: '1',
      title: 'Cybersecurity Awareness Training',
      progress: 65,
      nextLesson: 'Module 4: Social Engineering',
      dueDate: '2025-01-15'
    },
    {
      id: '2',
      title: 'AI Security & Governance',
      progress: 30,
      nextLesson: 'Ethics in AI Development'
    },
    {
      id: '3',
      title: 'Phishing Detection & Response',
      progress: 85,
      nextLesson: 'Final Assessment',
      dueDate: '2025-01-10'
    }
  ]

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Quick Learner',
      description: 'Complete 5 lessons in one day',
      icon: 'zap',
      unlocked: true
    },
    {
      id: '2',
      title: 'Perfect Score',
      description: 'Score 100% on any test',
      icon: 'star',
      unlocked: true
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: 'fire',
      unlocked: false,
      progress: 7,
      total: 30
    },
    {
      id: '4',
      title: 'Knowledge Master',
      description: 'Complete 10 courses',
      icon: 'brain',
      unlocked: false,
      progress: 4,
      total: 10
    }
  ]

  // Mock recent activity
  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'Completed Password Security Best Practices',
      course: 'Cybersecurity Awareness',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'test',
      title: 'Passed Module 3 Quiz',
      course: 'Cybersecurity Awareness',
      timestamp: '3 hours ago',
      score: 92
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Unlocked "Quick Learner" badge',
      course: 'General',
      timestamp: '1 day ago'
    }
  ]

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson':
        return <CheckCircle className="h-5 w-5 text-text-success" />
      case 'test':
        return <BarChart className="h-5 w-5 text-text-info" />
      case 'achievement':
        return <Trophy className="h-5 w-5 text-text-warning" />
    }
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container mx-auto p-spacing-lg space-y-spacing-xl">
        {/* Header Section */}
        <motion.div 
          className="space-y-spacing-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">
                Welcome back, {user.name}!
              </h1>
              <p className="text-text-secondary mt-spacing-xs">
                You're on a {user.streak}-day learning streak 🔥
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-tertiary text-sm">Rank</p>
              <p className="text-2xl font-bold text-text-brand">
                #{user.rank} <span className="text-text-secondary text-base font-normal">/ {user.totalStudents}</span>
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <Card variant="neural" className="p-spacing-md">
            <div className="flex items-center justify-between mb-spacing-sm">
              <div className="flex items-center gap-spacing-sm">
                <div className="w-12 h-12 rounded-full bg-bg-brand flex items-center justify-center">
                  <span className="text-text-inverse font-bold">{user.level}</span>
                </div>
                <div>
                  <p className="text-text-primary font-medium">Level {user.level} Scholar</p>
                  <p className="text-text-secondary text-sm">{user.xp} / {user.xpToNextLevel} XP</p>
                </div>
              </div>
              <Sparkles className="h-6 w-6 text-text-brand" />
            </div>
            <Progress 
              value={(user.xp / user.xpToNextLevel) * 100} 
              className="h-3 bg-bg-emphasis"
            />
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-spacing-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence>
            {[
              {
                title: 'Courses Completed',
                value: user.completedCourses,
                total: user.totalCourses,
                icon: <Award className="h-6 w-6" />,
                color: 'text-text-success'
              },
              {
                title: 'Hours This Week',
                value: user.hoursThisWeek,
                unit: 'hrs',
                icon: <Clock className="h-6 w-6" />,
                color: 'text-text-info'
              },
              {
                title: 'Learning Streak',
                value: user.streak,
                unit: 'days',
                icon: <Zap className="h-6 w-6" />,
                color: 'text-text-warning'
              },
              {
                title: 'Active Courses',
                value: coursesInProgress.length,
                icon: <Book className="h-6 w-6" />,
                color: 'text-text-brand'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="metric" className="h-full">
                  <CardContent className="p-spacing-md">
                    <div className="flex items-start justify-between">
                      <div className="space-y-spacing-xs">
                        <p className="text-text-secondary text-sm">{stat.title}</p>
                        <div className="flex items-baseline gap-spacing-xs">
                          <p className="text-3xl font-bold text-text-primary">
                            {isLoading ? (
                              <span className="inline-block w-12 h-8 bg-bg-emphasis animate-pulse rounded" />
                            ) : (
                              stat.value
                            )}
                          </p>
                          {stat.unit && (
                            <span className="text-text-secondary text-sm">{stat.unit}</span>
                          )}
                          {stat.total && (
                            <span className="text-text-tertiary text-sm">/ {stat.total}</span>
                          )}
                        </div>
                      </div>
                      <div className={cn("p-2 rounded-lg bg-bg-emphasis", stat.color)}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-spacing-lg">
          {/* Course Progress Section */}
          <motion.div 
            className="lg:col-span-2 space-y-spacing-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">Continue Learning</h2>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-spacing-sm">
              {coursesInProgress.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card variant="interactive" className="group">
                    <CardContent className="p-spacing-md">
                      <div className="flex items-center gap-spacing-md">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-bg-brand to-[var(--color-purple-500)] flex items-center justify-center flex-shrink-0">
                          <Book className="h-8 w-8 text-text-inverse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-spacing-xs">
                            <div className="flex-1 mr-spacing-sm">
                              <h3 className="font-medium text-text-primary truncate">
                                {course.title}
                              </h3>
                              <p className="text-text-secondary text-sm">
                                Next: {course.nextLesson}
                              </p>
                            </div>
                            {course.dueDate && (
                              <Badge variant="secondary" className="text-text-warning border-border-warning bg-bg-warningLight">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due {new Date(course.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-spacing-xs">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-text-tertiary">Progress</span>
                              <span className="text-text-primary font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-3" />
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
                        >
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Upcoming Deadlines */}
            <Card variant="outlined" className="mt-spacing-lg">
              <CardHeader className="pb-spacing-sm">
                <CardTitle className="text-lg flex items-center gap-spacing-sm">
                  <AlertCircle className="h-5 w-5 text-text-warning" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-spacing-sm">
                {coursesInProgress
                  .filter(course => course.dueDate)
                  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                  .map(course => (
                    <div key={course.id} className="flex items-center justify-between py-spacing-xs">
                      <div>
                        <p className="text-text-primary text-sm font-medium">{course.title}</p>
                        <p className="text-text-tertiary text-xs">{course.nextLesson}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(course.dueDate!).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="space-y-spacing-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Achievements Section */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-spacing-sm">
                  <Trophy className="h-5 w-5 text-text-warning" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-spacing-sm">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "p-spacing-lg rounded-lg border transition-all duration-normal",
                      achievement.unlocked 
                        ? "bg-bg-successLight border-border-success" 
                        : "bg-bg-secondary border-border-subtle opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-spacing-md">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        achievement.unlocked ? "bg-bg-brand" : "bg-bg-emphasis"
                      )}>
                        {achievement.icon === 'zap' && <Zap className="h-5 w-5 text-text-inverse" />}
                        {achievement.icon === 'star' && <Star className="h-5 w-5 text-text-inverse" />}
                        {achievement.icon === 'fire' && <Zap className="h-5 w-5 text-text-inverse" />}
                        {achievement.icon === 'brain' && <Brain className="h-5 w-5 text-text-inverse" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          achievement.unlocked ? "text-text-primary" : "text-text-tertiary"
                        )}>
                          {achievement.title}
                        </p>
                        <p className="text-text-tertiary text-xs">{achievement.description}</p>
                        {!achievement.unlocked && achievement.progress && (
                          <div className="mt-spacing-xs">
                            <Progress 
                              value={(achievement.progress / achievement.total!) * 100} 
                              className="h-1.5"
                            />
                            <p className="text-text-tertiary text-xs mt-1">
                              {achievement.progress} / {achievement.total}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-spacing-sm">
                  <TrendingUp className="h-5 w-5 text-text-info" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-spacing-sm">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-spacing-sm py-spacing-xs"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm">{activity.title}</p>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs mt-1 inline-flex">
                          Score: {activity.score}%
                        </Badge>
                      )}
                      <p className="text-text-tertiary text-xs mt-1">
                        {activity.course} • {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}