'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, ChevronDown, MoreVertical, Plus, Download, Trash2, UserCheck, AlertTriangle, X, Check, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'administrator'
  status: 'ahead' | 'on_track' | 'falling_behind' | 'drastically_behind'
  severity: 'low' | 'medium' | 'high'
  avatar?: string
  lastLogin: string
  joinDate: string
  coursesEnrolled: number
  coursesCompleted: number
  overallProgress: number
  certificatesEarned: number
  totalHours: number
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'student',
    status: 'ahead',
    severity: 'high',
    lastLogin: '2024-01-15T10:30:00',
    joinDate: '2023-06-15',
    coursesEnrolled: 5,
    coursesCompleted: 3,
    overallProgress: 72,
    certificatesEarned: 2,
    totalHours: 45.5
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@company.com',
    role: 'instructor',
    status: 'on_track',
    severity: 'low',
    lastLogin: '2024-01-15T14:20:00',
    joinDate: '2023-03-20',
    coursesEnrolled: 0,
    coursesCompleted: 0,
    overallProgress: 0,
    certificatesEarned: 0,
    totalHours: 120
  },
  {
    id: '3',
    name: 'Emma Thompson',
    email: 'emma.t@company.com',
    role: 'student',
    status: 'falling_behind',
    severity: 'medium',
    lastLogin: '2024-01-01T09:00:00',
    joinDate: '2023-09-10',
    coursesEnrolled: 3,
    coursesCompleted: 1,
    overallProgress: 45,
    certificatesEarned: 1,
    totalHours: 22.3
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'administrator',
    status: 'on_track',
    severity: 'low',
    lastLogin: '2024-01-15T16:45:00',
    joinDate: '2023-01-05',
    coursesEnrolled: 0,
    coursesCompleted: 0,
    overallProgress: 0,
    certificatesEarned: 0,
    totalHours: 0
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@company.com',
    role: 'student',
    status: 'drastically_behind',
    severity: 'high',
    lastLogin: '2023-12-20T11:30:00',
    joinDate: '2023-08-22',
    coursesEnrolled: 2,
    coursesCompleted: 0,
    overallProgress: 12,
    certificatesEarned: 0,
    totalHours: 5.5
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'student',
    status: 'on_track',
    severity: 'medium',
    lastLogin: '2024-01-15T09:15:00',
    joinDate: '2023-07-20',
    coursesEnrolled: 4,
    coursesCompleted: 2,
    overallProgress: 50,
    certificatesEarned: 1,
    totalHours: 28.7
  },
  {
    id: '7',
    name: 'Rachel Green',
    email: 'rachel.g@company.com',
    role: 'instructor',
    status: 'on_track',
    severity: 'low',
    lastLogin: '2024-01-14T16:30:00',
    joinDate: '2023-02-10',
    coursesEnrolled: 0,
    coursesCompleted: 0,
    overallProgress: 0,
    certificatesEarned: 0,
    totalHours: 95
  },
  {
    id: '8',
    name: 'Alex Johnson',
    email: 'alex.j@company.com',
    role: 'student',
    status: 'on_track',
    severity: 'low',
    lastLogin: '2024-01-15T11:45:00',
    joinDate: '2023-09-05',
    coursesEnrolled: 3,
    coursesCompleted: 2,
    overallProgress: 67,
    certificatesEarned: 2,
    totalHours: 34.2
  }
]

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof User>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showBulkActions, setShowBulkActions] = useState(false)

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return filtered
  }, [searchQuery, sortField, sortDirection])

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
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrator': return 'default'
      case 'instructor': return 'secondary'
      case 'student': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ahead': return 'default' // Will use custom class
      case 'on_track': return 'default' // Already using custom class
      case 'falling_behind': return 'default' // Will use custom class
      case 'drastically_behind': return 'default' // Will use custom class
      default: return 'outline'
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vergil-off-black mb-2">User Management</h1>
          <p className="text-vergil-off-black/70">Manage users, roles, and training severity levels</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Link href="/lms/user-management" className="pb-4 px-1 border-b-2 border-vergil-purple text-vergil-purple font-medium text-sm">
              Users
            </Link>
            <Link href="/lms/user-management/organisation-overview" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Organisation Overview
            </Link>
            <Link href="/lms/user-management/roles" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Roles
            </Link>
            <Link href="/lms/user-management/analytics" className="pb-4 px-1 border-b-2 border-transparent text-vergil-off-black/60 hover:text-vergil-purple hover:border-vergil-purple/30 font-medium text-sm transition-all">
              Analytics
            </Link>
          </nav>
        </div>


        {/* Filters and Actions */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vergil-off-black/40 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>


              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Link href="/lms/user-management/new">
                  <Button size="sm" className="bg-vergil-purple hover:bg-vergil-purple-lighter">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </Link>
              </div>
            </div>

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
                  <Button variant="outline" size="sm" className="text-vergil-error border-vergil-error/20 hover:bg-vergil-error/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
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
                      {sortField === 'name' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Role
                      {sortField === 'role' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Status
                      {sortField === 'status' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('overallProgress')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Progress
                      {sortField === 'overallProgress' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('lastLogin')}
                      className="flex items-center gap-1 text-xs font-medium text-vergil-off-black/60 uppercase tracking-wider hover:text-vergil-off-black"
                    >
                      Last Active
                      {sortField === 'lastLogin' && (
                        <ChevronDown className={`w-3 h-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
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
                  <tr key={user.id} className="hover:bg-vergil-off-white/50 transition-colors">
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
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'ahead' ? (
                        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300">
                          {getStatusLabel(user.status)}
                        </Badge>
                      ) : user.status === 'on_track' ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {getStatusLabel(user.status)}
                        </Badge>
                      ) : user.status === 'falling_behind' ? (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                          {getStatusLabel(user.status)}
                        </Badge>
                      ) : user.status === 'drastically_behind' ? (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          {getStatusLabel(user.status)}
                        </Badge>
                      ) : (
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-vergil-purple-lighter h-2 rounded-full transition-all"
                            style={{ width: `${user.overallProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-vergil-off-black/60 min-w-[3ch]">
                          {user.overallProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-vergil-off-black/60">{formatDate(user.lastLogin)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/lms/user-management/${user.id}`}>
                          <Button variant="ghost" size="sm" className="text-vergil-purple hover:text-vergil-purple-lighter">
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-vergil-purple hover:text-vergil-purple-lighter">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-vergil-off-black/60 hover:text-vergil-off-black">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-vergil-off-black/60">
              Showing {filteredAndSortedUsers.length} of {mockUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}