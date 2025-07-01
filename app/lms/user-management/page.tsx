'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronDown, MoreVertical, Plus, Download, Upload, Trash2, UserCheck, AlertTriangle, X, Check, Mail, FileText, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { UserManagementHeader } from '@/components/lms/user-management-header'
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
import { mockUsers, getRoleName } from '@/lib/lms/mock-data'
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
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])
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

  const handleDownloadTemplate = () => {
    const templateContent = [
      'Name,Email,Role,Phone,Location,Department,Manager',
      'John Doe,john.doe@example.com,Manager,+1 (555) 123-4567,New York,Engineering,Jane Smith',
      'Jane Smith,jane.smith@example.com,Admin,,San Francisco,HR,',
      'Bob Johnson,bob.j@example.com,Instructor,+1 (555) 987-6543,Chicago,Training,John Doe'
    ].join('\n')

    const blob = new Blob([templateContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim())
    const users = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const user: any = {}
      headers.forEach((header, index) => {
        user[header.toLowerCase()] = values[index] || ''
      })
      users.push(user)
    }
    
    return users
  }

  const validateImportData = (importedUsers: any[]): string[] => {
    const errors: string[] = []
    const existingEmails = users.map(u => u.email.toLowerCase())
    const importEmails = new Set<string>()
    const validRoles = initialRoles.map(r => r.name.toLowerCase())

    importedUsers.forEach((user, index) => {
      const rowNum = index + 2 // +2 because row 1 is headers, and index starts at 0
      
      // Check required fields
      if (!user.name || !user.name.trim()) {
        errors.push(`Row ${rowNum}: Name is required`)
      }
      
      if (!user.email || !user.email.trim()) {
        errors.push(`Row ${rowNum}: Email is required`)
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push(`Row ${rowNum}: Invalid email format`)
      } else if (existingEmails.includes(user.email.toLowerCase())) {
        errors.push(`Row ${rowNum}: Email already exists in the system`)
      } else if (importEmails.has(user.email.toLowerCase())) {
        errors.push(`Row ${rowNum}: Duplicate email in import file`)
      } else {
        importEmails.add(user.email.toLowerCase())
      }
      
      if (!user.role || !user.role.trim()) {
        errors.push(`Row ${rowNum}: Role is required`)
      } else if (!validRoles.includes(user.role.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid role. Must be one of: ${mockRoles.map(r => r.name).join(', ')}`)
      }
    })
    
    return errors
  }

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setImportErrors(['File size exceeds 5MB limit'])
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const users = parseCSV(text)
      
      if (users.length === 0) {
        setImportErrors(['No valid data found in file'])
        return
      }
      
      const errors = validateImportData(users)
      setImportErrors(errors)
      
      if (errors.length === 0) {
        // Transform data to match our format
        const transformedUsers = users.map(user => ({
          name: user.name,
          email: user.email,
          role: mockRoles.find(r => r.name.toLowerCase() === user.role.toLowerCase())?.name || user.role,
          phone: user.phone || '',
          location: user.location || '',
          department: user.department || '',
          manager: user.manager || ''
        }))
        setImportPreview(transformedUsers)
      }
      
      setImportFile(file)
    }
    
    reader.readAsText(file)
  }

  const handleImport = () => {
    // In a real application, this would make an API call
    // Process import - would send to API in production
    
    // Simulate successful import
    alert(`Successfully imported ${importPreview.length} users`)
    
    // Reset modal
    setShowImportModal(false)
    setImportFile(null)
    setImportPreview([])
    setImportErrors([])
    
    // In a real app, you would refresh the user list here
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-vergil-purple/10 text-vergil-purple border-vergil-purple' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-vergil-purple text-white rounded-full text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
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

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-vergil-off-white rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-2">Role</label>
                    <div className="space-y-2">
                      {mockRoles.map(role => (
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
                      <span className="font-medium text-sm text-vergil-off-black">
                        {user.role}
                      </span>
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

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-vergil-off-black">Import Users</h3>
                    <p className="text-sm text-vergil-off-black/60 mt-1">
                      Upload a CSV file to import multiple users at once
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowImportModal(false)
                      setImportFile(null)
                      setImportPreview([])
                      setImportErrors([])
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!importFile ? (
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-vergil-off-black mb-2">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <p className="text-sm text-vergil-off-black/60 mb-4">
                        Maximum file size: 5MB
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(file)
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="inline-block">
                        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 cursor-pointer">
                          Select File
                        </span>
                      </label>
                    </div>

                    {/* Template Download */}
                    <Card variant="outlined" className="p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-vergil-purple mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-vergil-off-black mb-1">
                            Need a template?
                          </h4>
                          <p className="text-sm text-vergil-off-black/60 mb-3">
                            Download our CSV template with the correct format and example data
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadTemplate}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Format Requirements */}
                    <div className="bg-vergil-off-white rounded-lg p-4">
                      <h4 className="font-medium text-vergil-off-black mb-2">
                        CSV Format Requirements
                      </h4>
                      <ul className="space-y-1 text-sm text-vergil-off-black/60">
                        <li>• Required columns: Name, Email, Role</li>
                        <li>• Optional columns: Phone, Location, Department, Manager</li>
                        <li>• Roles must be one of: {mockRoles.map(r => r.name).join(', ')}</li>
                        <li>• Dates should be in YYYY-MM-DD format</li>
                        <li>• Email addresses must be unique</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="bg-vergil-off-white rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-vergil-purple" />
                        <div>
                          <p className="font-medium text-vergil-off-black">{importFile.name}</p>
                          <p className="text-sm text-vergil-off-black/60">
                            {(importFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImportFile(null)
                          setImportPreview([])
                          setImportErrors([])
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Errors */}
                    {importErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-900 mb-1">
                              Validation Errors
                            </h4>
                            <ul className="space-y-1 text-sm text-red-700">
                              {importErrors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    {importPreview.length > 0 && (
                      <div>
                        <h4 className="font-medium text-vergil-off-black mb-2">
                          Preview ({importPreview.length} users)
                        </h4>
                        <div className="border border-gray-200 rounded-lg overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-vergil-off-black">Name</th>
                                <th className="px-4 py-2 text-left font-medium text-vergil-off-black">Email</th>
                                <th className="px-4 py-2 text-left font-medium text-vergil-off-black">Role</th>
                                <th className="px-4 py-2 text-left font-medium text-vergil-off-black">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {importPreview.slice(0, 5).map((user, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2">{user.name}</td>
                                  <td className="px-4 py-2">{user.email}</td>
                                  <td className="px-4 py-2">{user.role}</td>
                                  <td className="px-4 py-2">
                                    <Badge variant="success" className="text-xs">Valid</Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {importPreview.length > 5 && (
                            <div className="px-4 py-2 bg-gray-50 text-sm text-vergil-off-black/60">
                              And {importPreview.length - 5} more users...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-vergil-off-black/60">
                    {importFile && importErrors.length === 0 && importPreview.length > 0
                      ? `Ready to import ${importPreview.length} users`
                      : 'Select a file to continue'}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowImportModal(false)
                        setImportFile(null)
                        setImportPreview([])
                        setImportErrors([])
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={!importFile || importErrors.length > 0 || importPreview.length === 0}
                      className="bg-vergil-purple hover:bg-vergil-purple-lighter"
                    >
                      Import Users
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}