'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  BookOpen, 
  Clock, 
  Flame, 
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Trophy,
  Target,
  Activity
} from 'lucide-react'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'

export function StudentDashboard() {
  // Mock data
  const user = {
    name: 'Alex Chen',
    level: 12,
    xp: 2340,
    xpToNextLevel: 3000,
    rank: 23,
    totalStudents: 145,
    streak: 7,
    coursesCompleted: 4,
    totalCourses: 12,
    hoursThisWeek: 8.5,
    activeCourses: 3
  }

  const stats = [
    {
      label: 'Courses Completed',
      value: `${user.coursesCompleted}`,
      subValue: `/ ${user.totalCourses}`,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Hours This Week',
      value: user.hoursThisWeek.toString(),
      subValue: 'hrs',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Learning Streak',
      value: user.streak.toString(),
      subValue: 'days',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Active Courses',
      value: user.activeCourses.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const courses = [
    {
      id: 1,
      title: 'Cybersecurity Awareness Training',
      nextLesson: 'Module 4: Social Engineering',
      progress: 65,
      dueDate: '2025-01-15',
      color: 'purple'
    },
    {
      id: 2,
      title: 'AI Security & Governance',
      nextLesson: 'Ethics in AI Development',
      progress: 30,
      dueDate: null,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Phishing Detection & Response',
      nextLesson: 'Final Assessment',
      progress: 85,
      dueDate: '2025-01-10',
      color: 'green'
    }
  ]

  const achievements = [
    { id: 1, name: 'Quick Learner', description: 'Complete 5 lessons in one day', icon: Zap, unlocked: true },
    { id: 2, name: 'Perfect Score', description: 'Score 100% on any test', icon: Star, unlocked: true },
    { id: 3, name: 'Consistency King', description: 'Maintain a 30-day streak', icon: Trophy, progress: 7, total: 30 },
    { id: 4, name: 'Knowledge Master', description: 'Complete 10 courses', icon: Award, progress: 4, total: 10 }
  ]

  const recentActivity = [
    { id: 1, action: 'Completed', item: 'Password Security Best Practices', course: 'Cybersecurity Awareness', time: '2 hours ago', icon: CheckCircle },
    { id: 2, action: 'Started', item: 'Module 7: Network Security', course: 'Cyber Security Fundamentals', time: '1 day ago', icon: BookOpen },
    { id: 3, action: 'Achieved', item: 'Perfect Score', course: 'AI Security Quiz', time: '3 days ago', icon: Trophy }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                You're on a {user.streak}-day learning streak 🔥
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Your Rank</p>
                <p className="text-3xl font-bold text-purple-600">#{user.rank}</p>
                <p className="text-sm text-gray-500">of {user.totalStudents} learners</p>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <motion.div 
            className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">{user.level}</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Level {user.level} Scholar</p>
                  <p className="text-gray-600">{user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Level</p>
                <p className="text-2xl font-bold text-purple-600">{user.xpToNextLevel - user.xp} XP</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className="absolute right-0 -top-6 text-sm font-medium text-purple-600">
                {Math.round((user.xp / user.xpToNextLevel) * 100)}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={cn(
                "bg-white rounded-xl p-6 border",
                stat.borderColor
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
                {stat.subValue && (
                  <span className="text-lg font-normal text-gray-500 ml-1">{stat.subValue}</span>
                )}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        course.color === 'purple' && "bg-purple-100",
                        course.color === 'blue' && "bg-blue-100",
                        course.color === 'green' && "bg-green-100"
                      )}>
                        <BookOpen className={cn(
                          "h-6 w-6",
                          course.color === 'purple' && "text-purple-600",
                          course.color === 'blue' && "text-blue-600",
                          course.color === 'green' && "text-green-600"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Next: {course.nextLesson}</p>
                          </div>
                          {course.dueDate && (
                            <Badge variant="secondary" className="ml-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due {new Date(course.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full transition-all",
                                course.color === 'purple' && "bg-purple-600",
                                course.color === 'blue' && "bg-blue-600",
                                course.color === 'green' && "bg-green-600"
                              )}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {courses.filter(c => c.dueDate).map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{course.nextLesson}</p>
                      </div>
                      <Badge variant="destructive">
                        {new Date(course.dueDate!).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      achievement.unlocked 
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        achievement.unlocked ? "bg-yellow-500" : "bg-gray-300"
                      )}>
                        <achievement.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          achievement.unlocked ? "text-gray-900" : "text-gray-500"
                        )}>
                          {achievement.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        {achievement.progress && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-yellow-500 h-1.5 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      activity.icon === CheckCircle && "bg-green-100",
                      activity.icon === BookOpen && "bg-blue-100",
                      activity.icon === Trophy && "bg-yellow-100"
                    )}>
                      <activity.icon className={cn(
                        "h-4 w-4",
                        activity.icon === CheckCircle && "text-green-600",
                        activity.icon === BookOpen && "text-blue-600",
                        activity.icon === Trophy && "text-yellow-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{activity.action}</span>{' '}
                        <span className="text-gray-700">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}