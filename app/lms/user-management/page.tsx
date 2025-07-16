'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown, MoreVertical, Plus, Download, Upload, Trash2, UserCheck, AlertTriangle, X, Check, Mail, FileText, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { UserManagementHeader } from '@/components/user-management-header'
import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Select } from '@/components/select'
import { Badge } from '@/components/badge'
import { Checkbox } from '@/components/atomic/checkbox'
import { Progress } from '@/components/progress'
import { ImportUsersModal } from '@/components/import-users-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { mockUsers, getRoleName, type User } from '@/lib/lms/mock-data'
import { initialRoles } from '@/lib/lms/roles-data'

// Map status for compatibility with existing UI
const mapStatus = (status: string): 'ahead' | 'on_track' | 'falling_behind' | 'drastically_behind' => {
  switch (status) {
    case 'ahead': return 'ahead'
    case 'on_track': return 'on_track'
    case 'at_risk': return 'falling_behind'
    case 'behind': return 'drastically_behind'
    default: return 'on_track'
  }
}

// Transform the unified mock data to match the expected format
const users = mockUsers.map(user => ({
  ...user,
  status: mapStatus(user.status),
  overallProgress: user.completionRate,
  severity: user.severity || 'low'
}))

interface FilterState {
  roles: string[]
  statuses: string[]
  progressRanges: string[]
}

interface SortState {
  field: string | null
  direction: 'asc' | 'desc' | null
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null })
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    roles: [],
    statuses: [],
    progressRanges: []
  })

  // Define progress ranges
  const progressRanges = [
    { id: '0-25', label: '0-25%', min: 0, max: 25 },
    { id: '25-50', label: '25-50%', min: 25, max: 50 },
    { id: '50-75', label: '50-75%', min: 50, max: 75 },
    { id: '75-100', label: '75-100%', min: 75, max: 100 }
  ]

  const filteredAndSortedUsers = useMemo(() => {
    // Define status order for sorting
    const statusOrder = {
      'ahead': 0,
      'on_track': 1,
      'falling_behind': 2,
      'drastically_behind': 3
    }
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = filters.roles.length === 0 || filters.roles.includes(user.role || '')
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(user.status)
      
      const matchesProgress = filters.progressRanges.length === 0 || 
        filters.progressRanges.some(rangeId => {
          const range = progressRanges.find(r => r.id === rangeId)
          if (!range) return false
          return user.overallProgress >= range.min && user.overallProgress <= range.max
        })
      
      return matchesSearch && matchesRole && matchesStatus && matchesProgress
    })

    if (sortState.field && sortState.direction) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortState.field!]
        const bValue = (b as any)[sortState.field!]
        
        // Special handling for status field
        if (sortState.field === 'status') {
          const aOrder = statusOrder[aValue as keyof typeof statusOrder]
          const bOrder = statusOrder[bValue as keyof typeof statusOrder]
          return sortState.direction === 'asc' ? aOrder - bOrder : bOrder - aOrder
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortState.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        return 0
      })
    }

    return filtered
  }, [searchQuery, sortState, filters, progressRanges])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredAndSortedUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleSort = (field: keyof User) => {
    if (sortState.field === field) {
      if (sortState.direction === 'asc') {
        setSortState({ field, direction: 'desc' })
      } else if (sortState.direction === 'desc') {
        setSortState({ field: null, direction: null })
      }
    } else {
      setSortState({ field, direction: 'asc' })
    }
  }

  const getSortIcon = (field: keyof User) => {
    if (sortState.field !== field) return null
    return sortState.direction === 'asc' ? '' : 'rotate-180'
  }

  const activeFiltersCount = filters.roles.length + filters.statuses.length + filters.progressRanges.length

  const getStatusBadgeVariant = (status: string): "error" | "default" | "info" | "success" | "warning" | "brand" => {
    switch (status) {
      case 'ahead': return 'default' // Will use custom class
      case 'on_track': return 'default' // Already using custom class
      case 'falling_behind': return 'default' // Will use custom class
      case 'drastically_behind': return 'default' // Will use custom class
      default: return 'default'
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ahead': return 'Ahead of Time'
      case 'on_track': return 'On Track'
      case 'falling_behind': return 'Falling Behind'
      case 'drastically_behind': return 'Drastically Behind'
      default: return status
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'outline'
    }
  }


  const handleExport = () => {
    // Helper to escape CSV values
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return ''
      const str = String(value)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    // Convert users to CSV format
    const headers = ['Name', 'Email', 'Role', 'Status', 'Progress (%)', 'Courses Enrolled', 'Courses Completed', 'Last Login', 'Join Date']
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedUsers.map(user => [
        escapeCSV(user.name),
        escapeCSV(user.email),
        escapeCSV(user.role),
        escapeCSV(user.status),
        escapeCSV(user.overallProgress),
        escapeCSV(user.coursesEnrolled),
        escapeCSV(user.coursesCompleted),
        escapeCSV(new Date(user.lastLogin).toISOString()),
        escapeCSV(user.joinDate)
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <UserManagementHeader />


        {/* Filters and Actions */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vergil-off-black/40 w-5 h-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </div>


              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-brandLight text-brand border-brand' : ''} // rgba(166, 77, 255, 0.05), #A64DFF
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-brand text-white rounded-full text-xs"> {/* #A64DFF */}
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowImportModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href="/lms/user-management/new">
                  <Button size="sm" variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-secondary rounded-lg"> {/* #F5F5F7 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Role</label> {/* #1D1D1F */}
                    <div className="space-y-2">
                      {initialRoles.map(role => (
                        <label key={role.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={filters.roles.includes(role.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({ ...filters, roles: [...filters.roles, role.name] })
                              } else {
                                setFilters({ ...filters, roles: filters.roles.filter(r => r !== role.name) })
                              }
                            }}
                          />
                          <span className="text-sm">{role.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-2">Status</label>
                    <div className="space-y-2">
                      {['ahead', 'on_track', 'falling_behind', 'drastically_behind'].map(status => (
                        <label key={status} className="flex items-center gap-2">
                          <Checkbox
                            checked={filters.statuses.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({ ...filters, statuses: [...filters.statuses, status] })
                              } else {
                                setFilters({ ...filters, statuses: filters.statuses.filter(s => s !== status) })
                              }
                            }}
                          />
                          <span className="text-sm">{getStatusLabel(status)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Progress Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-2">Progress Range</label>
                    <div className="space-y-2">
                      {progressRanges.map(range => (
                        <label key={range.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={filters.progressRanges.includes(range.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({ ...filters, progressRanges: [...filters.progressRanges, range.id] })
                              } else {
                                setFilters({ ...filters, progressRanges: filters.progressRanges.filter(r => r !== range.id) })
                              }
                            }}
                          />
                          <span className="text-sm">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({ roles: [], statuses: [], progressRanges: [] })}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-vergil-emphasis-bg rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-vergil-emphasis-text">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                    className="text-vergil-emphasis-text hover:text-vergil-off-black"
                  >
                    Clear selection
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="text-vergil-error border-vergil-error/20 hover:bg-vergil-error/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <MoreVertical className="w-4 h-4 mr-2" />
                        More Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                      <DropdownMenuItem>Change Severity</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Enroll in Course</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-vergil-off-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Checkbox
                      checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      User
                      {sortState.field === 'name' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${getSortIcon('name')}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Role
                      {sortState.field === 'role' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${getSortIcon('role')}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Status
                      {sortState.field === 'status' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${getSortIcon('status')}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('overallProgress')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Progress
                      {sortState.field === 'overallProgress' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${getSortIcon('overallProgress')}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('lastLogin')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Last Active
                      {sortState.field === 'lastLogin' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${getSortIcon('lastLogin')}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-vergil-full-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-vergil-off-white/50 transition-all relative ${
                      selectedUsers.includes(user.id) 
                        ? 'bg-vergil-purple/5 shadow-sm ring-2 ring-vergil-purple ring-inset' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/lms/user-management/${user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter flex items-center justify-center text-vergil-full-white font-medium text-sm shrink-0">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
                          ) : (
                            user.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-vergil-off-black">{user.name}</p>
                          <p className="text-sm text-vergil-off-black/60">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-primary"> {/* #1D1D1F */}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'ahead' ? 'info' : user.status === 'on_track' ? 'success' : user.status === 'falling_behind' ? 'warning' : 'destructive'}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={user.overallProgress} className="flex-1" />
                        <span className="text-sm text-secondary min-w-[3ch]"> {/* #6C6C6D */}
                          {user.overallProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary">{formatDate(user.lastLogin)}</p> {/* #6C6C6D */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/lms/user-management/${user.id}`}>
                          <Button variant="ghost" size="sm" className="text-brand hover:text-brandLight"> {/* #A64DFF, #9933FF */}
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-brand hover:text-brandLight"
                          onClick={() => window.location.href = `mailto:${user.email}?subject=Training%20Update`}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.location.href = `/lms/user-management/${user.id}`}>
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}?subject=Training%20Update`}>
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `slack://user?team=T12345&id=${user.id}`}>
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              // Toggle user status
                              const newStatus = user.status === 'active' ? 'inactive' : 'active'
                              console.log(`Toggling user ${user.name} status to ${newStatus}`)
                              // In a real app, this would update the user's status
                            }}>
                              {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              console.log(`Resetting password for ${user.name}`)
                              // In a real app, this would trigger password reset
                            }}>
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${user.name}? This action cannot be undone.`)) {
                                  console.log(`Removing user ${user.name}`)
                                  // In a real app, this would remove the user
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-spacing-lg py-spacing-md border-t border-subtle flex items-center justify-between"> {/* 24px, 16px, rgba(0,0,0,0.05) */}
            <p className="text-sm text-secondary"> {/* #6C6C6D */}
              Showing {filteredAndSortedUsers.length} of {mockUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </Card>

        {/* Import Modal */}
        <ImportUsersModal
          open={showImportModal}
          onOpenChange={setShowImportModal}
          onImport={(users) => {
            // In a real application, this would make an API call
            alert(`Successfully imported ${users.length} users`)
            
            // In a real app, you would refresh the user list here
          }}
          existingEmails={users.map(u => u.email)}
          validRoles={initialRoles.map(r => r.name)}
        />
      </div>
    </div>
  )
}