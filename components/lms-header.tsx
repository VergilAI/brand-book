'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, ChevronDown, ChevronRight, LogOut, Shield, Users, BookOpen, Home, Settings, HelpCircle, Bell, CheckCircle, AlertCircle, Clock, Award, MessageSquare, Calendar } from 'lucide-react'
import { VergilLogo } from '@/components/vergil-logo'
import { Button } from '@/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atomic/avatar'
import { Badge } from '@/components/badge'
import { cn } from '@/lib/utils'

interface LMSHeaderProps {
  onMenuToggle: () => void
  currentView: 'dashboard' | 'course' | 'lesson'
  breadcrumbs?: { label: string; href?: string }[]
}

export function LMSHeader({ onMenuToggle, currentView, breadcrumbs }: LMSHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  
  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    avatar: "/avatars/alex.jpg",
    role: "Super Admin",
    initials: "AC"
  }

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'Assignment Due Soon',
      message: 'Cybersecurity Awareness Training - Module 4 due in 2 days',
      time: '2 hours ago',
      isRead: false,
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You completed 5 courses this month and earned "Learning Champion" badge',
      time: '1 day ago',
      isRead: false,
      icon: <Award className="h-4 w-4" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      type: 'course',
      title: 'New Course Available',
      message: 'AI Security & Governance - Advanced Module is now available',
      time: '2 days ago',
      isRead: true,
      icon: <BookOpen className="h-4 w-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      type: 'feedback',
      title: 'Instructor Feedback',
      message: 'Sarah Johnson commented on your Data Privacy Assessment',
      time: '3 days ago',
      isRead: true,
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Upcoming Session',
      message: 'Virtual workshop on "Advanced Threat Detection" starts in 1 hour',
      time: '5 days ago',
      isRead: true,
      icon: <Calendar className="h-4 w-4" />,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      type: 'system',
      title: 'Course Completion',
      message: 'Congratulations! You successfully completed "Network Security Fundamentals"',
      time: '1 week ago',
      isRead: true,
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Default breadcrumbs if none provided
  const defaultBreadcrumbs = [
    { label: 'Dashboard', href: '/lms' },
    ...(currentView === 'course' ? [{ label: 'Courses', href: '/lms/new_course_overview' }] : []),
    ...(currentView === 'lesson' ? [
      { label: 'Courses', href: '/lms/new_course_overview' },
      { label: 'Course Name', href: '/lms/new_course_overview' }
    ] : [])
  ]

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Logo and brand */}
            <Link href="/lms" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <VergilLogo variant="mark" size="sm" color="primary" />
              <span className="hidden sm:block text-xl font-semibold text-gray-900">
                Vergil Learn
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu open={isNotificationMenuOpen} onOpenChange={setIsNotificationMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-red-50 text-red-700">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer transition-colors",
                        !notification.isRead && "bg-blue-50 hover:bg-blue-100"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-0.5",
                        notification.bgColor
                      )}>
                        <span className={notification.color}>
                          {notification.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm font-medium text-gray-900",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Management Button */}
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:flex items-center gap-2"
              onClick={() => window.location.href = '/lms/user-management'}
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
          
            {/* User menu */}
            <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-medium text-xs">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-400 transition-transform",
                    isUserMenuOpen && "rotate-180"
                  )} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-medium text-sm">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>My Courses</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}