'use client'

import { Menu, User, ChevronDown, Settings, LogOut, Shield, BarChart3, Database, Users } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'

interface LMSHeaderProps {
  onMenuToggle: () => void
  currentView: 'dashboard' | 'course' | 'lesson'
}

export function LMSHeader({ onMenuToggle, currentView }: LMSHeaderProps) {
  
  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex.chen@company.com",
    avatar: "/avatars/alex.jpg",
    role: "Super Admin",
    overallProgress: 68
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="flex h-14 items-center px-4 lg:px-6">
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
          
          <div className="flex items-center gap-2">
            <VergilLogo variant="mark-black" size="sm" />
            <div className="text-lg font-semibold text-vergil-off-black">
              Vergil Learn
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Management Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-vergil-purple/20 text-vergil-purple hover:bg-vergil-purple/5 hover:text-vergil-purple"
            onClick={() => window.location.href = '/lms/user-management'}
          >
            <Users className="mr-2 h-4 w-4" />
            User Management
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
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-3 w-3 text-vergil-purple" />
                    <span className="text-xs font-medium text-vergil-purple">{user.role}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
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