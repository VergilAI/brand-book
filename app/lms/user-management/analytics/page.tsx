'use client'

import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-secondary"> {/* #F5F5F7 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-spacing-xs">User Management</h1> {/* #1D1D1F, 4px */}
          <p className="text-secondary">Manage users, roles, and training severity levels</p> {/* #6C6C6D */}
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-subtle"> {/* rgba(0,0,0,0.05) */}
            <Link href="/lms/user-management" className="pb-4 px-1 border-b-2 border-transparent text-secondary hover:text-brand hover:border-brand font-medium text-sm transition-all"> {/* #6C6C6D, #A64DFF */}
              Users
            </Link>
            <Link href="/lms/user-management/organisation-overview" className="pb-4 px-1 border-b-2 border-transparent text-secondary hover:text-brand hover:border-brand font-medium text-sm transition-all"> {/* #6C6C6D, #A64DFF */}
              Organisation Overview
            </Link>
            <Link href="/lms/user-management/roles" className="pb-4 px-1 border-b-2 border-transparent text-secondary hover:text-brand hover:border-brand font-medium text-sm transition-all"> {/* #6C6C6D, #A64DFF */}
              Roles
            </Link>
            <Link href="/lms/user-management/analytics" className="pb-4 px-1 border-b-2 border-brand text-brand font-medium text-sm"> {/* #A64DFF */}
              Analytics
            </Link>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-primary rounded-lg p-12 text-center"> {/* #FFFFFF */}
          <h2 className="text-2xl font-semibold text-primary mb-spacing-md">Analytics</h2> {/* #1D1D1F, 16px */}
          <p className="text-secondary">This section is under development.</p> {/* #6C6C6D */}
        </div>
      </div>
    </div>
  )
}