'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface UserManagementHeaderProps {
  noMargin?: boolean
}

export function UserManagementHeader({ noMargin = false }: UserManagementHeaderProps) {
  const pathname = usePathname()
  
  // Determine active tab based on current path
  const isUsersActive = pathname === '/lms/user-management' || pathname.includes('/lms/user-management/u')
  const isOrgOverviewActive = pathname === '/lms/user-management/organisation-overview'
  const isRolesActive = pathname === '/lms/user-management/roles'

  return (
    <div className={`${noMargin ? '' : 'mb-6'} border-b border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/logos/vergil-mark-black.svg" alt="Vergil Logo" className="h-8 w-8" />
          <span className="text-sm font-medium text-vergil-off-black/60">
            Vergil Learning Management System → User Management
            {pathname.includes('/lms/user-management/u') && ' → User Profile'}
          </span>
        </div>
      </div>
      <nav className="flex justify-center">
        <div className="flex space-x-8">
          <Link 
            href="/lms/user-management" 
            className={`pb-4 px-1 border-b-2 ${
              isUsersActive 
                ? 'border-vergil-purple text-vergil-purple' 
                : 'border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30'
            } font-medium text-sm transition-all`}
          >
            Users
          </Link>
          <Link 
            href="/lms/user-management/organisation-overview" 
            className={`pb-4 px-1 border-b-2 ${
              isOrgOverviewActive 
                ? 'border-vergil-purple text-vergil-purple' 
                : 'border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30'
            } font-medium text-sm transition-all`}
          >
            Organisation Overview
          </Link>
          <Link 
            href="/lms/user-management/roles" 
            className={`pb-4 px-1 border-b-2 ${
              isRolesActive 
                ? 'border-vergil-purple text-vergil-purple' 
                : 'border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30'
            } font-medium text-sm transition-all`}
          >
            Roles
          </Link>
        </div>
      </nav>
    </div>
  )
}