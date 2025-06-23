'use client'

import { useState } from 'react'
import { Bell, Menu, Search, User, ChevronDown, Settings, LogOut, BookOpen } from 'lucide-react'
import { VergilLogo } from '@/components/vergil/vergil-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

interface LMSHeaderProps {
  onMenuToggle: () => void
  currentView: 'dashboard' | 'course' | 'lesson'
}

export function LMSHeader({ onMenuToggle, currentView }: LMSHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    avatar: "/avatars/alex.jpg",
    role: "student",
    overallProgress: 68
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <VergilLogo variant="mark" size="sm" animated={true} />
            <div className="hidden lg:block">
              <div className="text-lg font-semibold">Vergil Learn</div>
              <div className="text-xs text-muted-foreground">Learning Management System</div>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav className="hidden md:flex items-center gap-6 mx-8">
          <Button variant="ghost" className="text-sm font-medium">
            <BookOpen className="h-4 w-4 mr-2" />
            My Courses
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            Profile
          </Button>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="w-64 pl-9"
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>

          {/* Progress indicator for students */}
          {user.role === 'student' && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10">
              <div className="text-sm">
                <div className="font-medium">Overall Progress</div>
                <div className="text-xs text-muted-foreground">{user.overallProgress}% Complete</div>
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
                  <span className="text-xs font-medium">{user.overallProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-electric-violet">
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-cosmic-purple to-electric-violet text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}