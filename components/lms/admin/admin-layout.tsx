'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { LMSHeader } from '@/components/lms/lms-header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavigation = [
  {
    title: 'Dashboard',
    href: '/lms/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and metrics'
  },
  {
    title: 'Courses',
    href: '/lms/admin/courses',
    icon: BookOpen,
    description: 'Manage courses'
  },
  {
    title: 'Users',
    href: '/lms/admin/users',
    icon: Users,
    description: 'User management'
  },
  {
    title: 'Analytics',
    href: '/lms/admin/analytics',
    icon: BarChart3,
    description: 'Reports and insights'
  },
  {
    title: 'Settings',
    href: '/lms/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <LMSHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView="dashboard"
      />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:transform-none lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className="relative z-40 flex h-full flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
              <h2 className="font-semibold">Admin Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/lms/admin/dashboard' && pathname?.startsWith(item.href))
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-cosmic-purple/10 text-cosmic-purple"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div>{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </nav>
            
            {/* Admin badge */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10 rounded-lg">
                <div className="w-2 h-2 bg-cosmic-purple rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Administrator</div>
                  <div className="text-xs text-muted-foreground">Full access</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}