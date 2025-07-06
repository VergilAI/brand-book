'use client'

import { useState } from 'react'
import { Menu, ChevronDown, ChevronRight, LogOut, Shield, Users, BookOpen, Home, Settings, HelpCircle } from 'lucide-react'
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
    <header 
      className="sticky top-0 z-50 bg-primary border-b border-subtle shadow-card"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      <div className="flex h-20 items-center" style={{ paddingLeft: 'var(--spacing-2xl)', paddingRight: 'var(--spacing-2xl)' }}>
        {/* Left section with logo and navigation */}
        <div className="flex items-center flex-1" style={{ gap: 'var(--spacing-lg)' }}>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden transition-all duration-200 hover:bg-emphasis"
            onClick={onMenuToggle}
            style={{
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Menu className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
          </Button>
          
          {/* Logo and brand */}
          <div 
            className="flex items-center" 
            style={{ gap: 'var(--spacing-sm)' }}
          >
            <VergilLogo variant="mark" size="sm" color="primary" />
            <span 
              className="font-semibold hidden sm:block"
              style={{ 
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)'
              }}
            >
              Vergil Learn
            </span>
          </div>

        </div>

        {/* Right section with actions */}
        <div className="flex items-center" style={{ gap: 'var(--spacing-md)' }}>

          {/* User Management Button */}
          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:flex items-center transition-all duration-200"
            onClick={() => window.location.href = '/lms/user-management'}
            style={{
              borderColor: 'var(--border-emphasis)',
              color: 'var(--text-brand)',
              backgroundColor: 'transparent',
              padding: `var(--spacing-sm) var(--spacing-md)`,
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              gap: 'var(--spacing-xs)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-brandLight)'
              e.currentTarget.style.borderColor = 'var(--border-brand)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-emphasis)'
            }}
          >
            <Users className="h-4 w-4" />
            User Management
          </Button>
          
          {/* User menu */}
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center transition-all duration-200"
                style={{
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isUserMenuOpen ? 'var(--bg-emphasis)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isUserMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-emphasis)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isUserMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback 
                    className="text-white font-medium"
                    style={{ 
                      background: 'var(--gradient-consciousness)',
                      fontSize: 'var(--font-size-xs)'
                    }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <div 
                    style={{ 
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {user.name}
                  </div>
                  <div 
                    className="capitalize"
                    style={{ 
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {user.role}
                  </div>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-tertiary)' }} 
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 animate-in fade-in-0 zoom-in-95"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: `1px solid var(--border-subtle)`,
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: 'var(--spacing-sm)'
              }}
            >
              <DropdownMenuLabel 
                className="font-normal"
                style={{ padding: 'var(--spacing-md)' }}
              >
                <div className="flex items-center" style={{ gap: 'var(--spacing-md)' }}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback 
                      className="text-white font-medium"
                      style={{ 
                        background: 'var(--gradient-consciousness)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col" style={{ gap: 'var(--spacing-xs)' }}>
                    <p 
                      style={{ 
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {user.name}
                    </p>
                    <p 
                      style={{ 
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {user.email}
                    </p>
                    <div className="flex items-center" style={{ gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)' }}>
                      <Shield className="h-3 w-3" style={{ color: 'var(--text-brand)' }} />
                      <span 
                        style={{ 
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--text-brand)'
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator 
                style={{ 
                  backgroundColor: 'var(--border-subtle)',
                  margin: `var(--spacing-sm) 0`
                }} 
              />
              <DropdownMenuItem 
                className="flex items-center cursor-pointer transition-colors duration-200"
                style={{ 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 'var(--spacing-sm)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-emphasis)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Home className="h-4 w-4" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer transition-colors duration-200"
                style={{ 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 'var(--spacing-sm)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-emphasis)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <BookOpen className="h-4 w-4" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>My Courses</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer transition-colors duration-200"
                style={{ 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 'var(--spacing-sm)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-emphasis)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Settings className="h-4 w-4" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator 
                style={{ 
                  backgroundColor: 'var(--border-subtle)',
                  margin: `var(--spacing-sm) 0`
                }} 
              />
              <DropdownMenuItem 
                className="flex items-center cursor-pointer transition-colors duration-200"
                style={{ 
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-sm)',
                  gap: 'var(--spacing-sm)',
                  color: 'var(--text-error)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-errorLight)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <LogOut className="h-4 w-4" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

    </header>
  )
}