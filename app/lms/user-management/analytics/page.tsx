'use client'

import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vergil-off-black mb-2">User Management</h1>
          <p className="text-vergil-off-black/70">Manage users, roles, and training severity levels</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Link href="/lms/user-management" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Users
            </Link>
            <Link href="/lms/user-management/organisation-overview" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Organisation Overview
            </Link>
            <Link href="/lms/user-management/roles" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Roles
            </Link>
            <Link href="/lms/user-management/analytics" className="pb-4 px-1 border-b-2 border-vergil-purple text-vergil-purple font-medium text-sm">
              Analytics
            </Link>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-vergil-full-white rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-vergil-off-black mb-4">Analytics</h2>
          <p className="text-vergil-off-black/60">This section is under development.</p>
        </div>
      </div>
    </div>
  )
}