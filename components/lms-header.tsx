'use client'

import { useState } from 'react'
import { Menu, ChevronDown, ChevronRight, LogOut, Shield, Users, BookOpen, Home, Settings, HelpCircle, Bell } from 'lucide-react'
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
  
  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    avatar: "/avatars/alex.jpg",
    role: "Super Admin",
    initials: "AC"
  }

  // Default breadcrumbs if none provided
  const defaultBreadcrumbs = [
    { label: 'Dashboard', href: '/lms' },
    ...(currentView === 'course' ? [{ label: 'Courses', href: '/lms/courses' }] : []),
    ...(currentView === 'lesson' ? [
      { label: 'Courses', href: '/lms/courses' },
      { label: 'Course Name', href: '/lms/course/1' }
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
            <div className="flex items-center gap-3">
              <VergilLogo variant="mark" size="sm" color="primary" />
              <span className="hidden sm:block text-xl font-semibold text-gray-900">
                Vergil Learn
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>

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