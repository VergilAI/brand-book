'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { VergilLogo } from './vergil-logo'
import { ChevronRight, Users, Building2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserManagementHeaderProps {
  noMargin?: boolean
  showBreadcrumb?: boolean
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  pattern: string | string[]
}

export function UserManagementHeader({ 
  noMargin = false,
  showBreadcrumb = true 
}: UserManagementHeaderProps) {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    {
      href: '/lms/user-management',
      label: 'Users',
      icon: <Users className="w-4 h-4" />,
      pattern: ['/lms/user-management', '/lms/user-management/u']
    },
    {
      href: '/lms/user-management/organisation-overview',
      label: 'Organisation Overview',
      icon: <Building2 className="w-4 h-4" />,
      pattern: '/lms/user-management/organisation-overview'
    },
    {
      href: '/lms/user-management/roles',
      label: 'Roles & Permissions',
      icon: <Shield className="w-4 h-4" />,
      pattern: '/lms/user-management/roles'
    }
  ]

  const isActive = (item: NavItem) => {
    if (Array.isArray(item.pattern)) {
      // For Users tab: exact match or user profile paths
      return item.pattern.some(p => {
        if (p === '/lms/user-management') {
          // Only match exact path, not subpaths like organisation-overview
          return pathname === p
        }
        // For user profile paths
        return pathname.startsWith(p)
      })
    }
    // For single pattern items: exact match or subpaths
    return pathname === item.pattern || pathname.startsWith(item.pattern + '/')
  }

  const getBreadcrumb = () => {
    if (pathname.includes('/lms/user-management/u/')) {
      return 'User Profile'
    }
    const activeItem = navItems.find(item => isActive(item))
    return activeItem?.label || 'User Management'
  }

  return (
    <header className={cn(
      "bg-primary border-b border-default transition-all duration-normal",
      !noMargin && "mb-6"
    )}>
      {/* Top Bar */}
      {showBreadcrumb && (
        <div className="px-6 py-3 border-b border-subtle">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/lms" className="flex items-center gap-2 text-secondary hover:text-brand transition-colors group">
              <span className="group-hover:opacity-80 transition-opacity">
                <VergilLogo variant="mark" size="xs" color="primary" />
              </span>
              <span>Vergil LMS</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-tertiary" />
            <Link href="/lms/user-management" className="text-secondary hover:text-brand transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3 text-tertiary" />
            <span className="text-primary font-medium">{getBreadcrumb()}</span>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="px-6">
        <div className="flex items-center justify-center -mb-[1px]">
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
              const active = isActive(item)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-fast",
                    "border-b-2 hover:text-brand",
                    active ? [
                      "text-brand border-brand",
                      "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-brand",
                      "after:shadow-brand-glow after:animate-pulse-glow"
                    ] : [
                      "text-secondary border-transparent",
                      "hover:border-brand/30"
                    ]
                  )}
                >
                  <span className={cn(
                    "transition-all duration-fast",
                    active && "animate-breathing"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}