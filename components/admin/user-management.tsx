'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  MoreVertical,
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Shield,
  ShieldCheck,
  Eye,
  Key,
  Users,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Badge } from '@/components/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atomic/avatar'
import { Progress } from '@/components/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Alert, AlertDescription } from '@/components/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atomic/tooltip'
import { DataTable } from '@/components/admin/data-table'
import { MetricCard } from '@/components/admin/metric-card'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'administrator'
  status: 'active' | 'inactive' | 'suspended'
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

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'instructor' | 'administrator'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showAddUser, setShowAddUser] = useState(false)

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      role: 'student',
      status: 'active',
      severity: 'medium',
      avatar: '/avatars/alex.jpg',
      lastLogin: '2 hours ago',
      joinDate: '2025-06-15',
      coursesEnrolled: 5,
      coursesCompleted: 3,
      overallProgress: 68,
      certificatesEarned: 3,
      totalHours: 42
    },
    {
      id: '2',
      name: 'Dr. Sarah Kim',
      email: 'sarah.kim@university.edu',
      role: 'instructor',
      status: 'active',
      severity: 'low',
      lastLogin: '1 hour ago',
      joinDate: '2025-01-20',
      coursesEnrolled: 2,
      coursesCompleted: 2,
      overallProgress: 100,
      certificatesEarned: 5,
      totalHours: 156
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      role: 'student',
      status: 'active',
      severity: 'high',
      lastLogin: '5 minutes ago',
      joinDate: '2025-06-28',
      coursesEnrolled: 3,
      coursesCompleted: 1,
      overallProgress: 45,
      certificatesEarned: 1,
      totalHours: 28
    },
    {
      id: '4',
      name: 'Michael Thompson',
      email: 'mike.thompson@corp.com',
      role: 'student',
      status: 'inactive',
      severity: 'medium',
      lastLogin: '2 weeks ago',
      joinDate: '2025-04-10',
      coursesEnrolled: 7,
      coursesCompleted: 4,
      overallProgress: 72,
      certificatesEarned: 4,
      totalHours: 89
    },
    {
      id: '5',
      name: 'Admin User',
      email: 'admin@vergil.ai',
      role: 'administrator',
      status: 'active',
      severity: 'low',
      lastLogin: 'Just now',
      joinDate: '2025-01-01',
      coursesEnrolled: 0,
      coursesCompleted: 0,
      overallProgress: 0,
      certificatesEarned: 0,
      totalHours: 0
    },
    {
      id: '6',
      name: 'Jennifer Park',
      email: 'j.park@techcorp.com',
      role: 'instructor',
      status: 'active',
      severity: 'low',
      lastLogin: '3 days ago',
      joinDate: '2025-02-15',
      coursesEnrolled: 1,
      coursesCompleted: 1,
      overallProgress: 100,
      certificatesEarned: 2,
      totalHours: 67
    },
    {
      id: '7',
      name: 'David Wilson',
      email: 'david.w@suspended.com',
      role: 'student',
      status: 'suspended',
      severity: 'high',
      lastLogin: '1 month ago',
      joinDate: '2025-06-05',
      coursesEnrolled: 2,
      coursesCompleted: 0,
      overallProgress: 15,
      certificatesEarned: 0,
      totalHours: 8
    }
  ]

  const userMetrics = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    students: users.filter(u => u.role === 'student').length,
    instructors: users.filter(u => u.role === 'instructor').length,
    avgProgress: Math.round(users.reduce((acc, u) => acc + u.overallProgress, 0) / users.length),
    newThisMonth: 3
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesSeverity = filterSeverity === 'all' || user.severity === filterSeverity
    
    return matchesSearch && matchesRole && matchesStatus && matchesSeverity
  })

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.size} users?`)) {
      setSelectedUsers(new Set())
    }
  }

  const handleBulkChangeRole = (newRole: string) => {
    if (confirm(`Change role to ${newRole} for ${selectedUsers.size} users?`)) {
      setSelectedUsers(new Set())
    }
  }

  const handleBulkChangeSeverity = (newSeverity: string) => {
    if (confirm(`Change training severity to ${newSeverity} for ${selectedUsers.size} users?`)) {
      // This would update the severity in the backend
      console.log('Bulk change severity:', selectedUsers, newSeverity)
      setSelectedUsers(new Set())
    }
  }

  const handleBulkEnroll = () => {
    // Open course selection modal
    console.log('Bulk enroll users:', selectedUsers)
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'administrator':
        return <ShieldCheck className="h-4 w-4 text-red-500" />
      case 'instructor':
        return <Shield className="h-4 w-4 text-blue-500" />
      case 'student':
        return <User className="h-4 w-4 text-green-500" />
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'administrator':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'instructor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getSeverityIcon = (severity: User['severity']) => {
    switch (severity) {
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'high':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getSeverityColor = (severity: User['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getSeverityDescription = (severity: User['severity']) => {
    switch (severity) {
      case 'low':
        return 'Basic training requirements'
      case 'medium':
        return 'Standard training rigor'
      case 'high':
        return 'Enhanced training requirements'
    }
  }

  const tableColumns = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-cosmic-purple to-electric-violet text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {getRoleIcon(user.role)}
          <Badge className={getRoleColor(user.role)}>
            {user.role}
          </Badge>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: User) => (
        <Badge className={getStatusColor(user.status)}>
          {user.status}
        </Badge>
      )
    },
    {
      key: 'severity',
      label: 'Training Severity',
      render: (user: User) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                {getSeverityIcon(user.severity)}
                <Badge className={getSeverityColor(user.severity)}>
                  {user.severity}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getSeverityDescription(user.severity)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      key: 'coursesEnrolled',
      label: 'Courses',
      sortable: true,
      render: (user: User) => (
        <div className="text-center">
          <div className="font-medium">{user.coursesEnrolled}</div>
          <div className="text-xs text-muted-foreground">
            {user.coursesCompleted} completed
          </div>
        </div>
      )
    },
    {
      key: 'overallProgress',
      label: 'Progress',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Progress value={user.overallProgress} className="w-16 h-2" />
          <span className="text-sm font-medium">{user.overallProgress}%</span>
        </div>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (user: User) => (
        <div className="text-sm">
          <div>{user.lastLogin}</div>
          <div className="text-xs text-muted-foreground">
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </div>
        </div>
      )
    }
  ]

  const tableActions = [
    {
      label: 'View Profile',
      icon: <Eye className="h-4 w-4" />,
      onClick: (user: User) => {
        window.location.href = `/lms/admin/users/${user.id}`
      }
    },
    {
      label: 'Edit User',
      icon: <Edit className="h-4 w-4" />,
      onClick: (user: User) => {
        // Open edit modal
      }
    },
    {
      label: 'Reset Password',
      icon: <Key className="h-4 w-4" />,
      onClick: (user: User) => {
        if (confirm(`Reset password for ${user.name}?`)) {
          // Handle password reset
        }
      }
    },
    {
      label: 'Change Severity',
      icon: <AlertCircle className="h-4 w-4" />,
      onClick: (user: User) => {
        // This would open a severity selection modal
        console.log('Change severity for:', user.name)
      }
    },
    {
      label: 'Suspend User',
      icon: <UserX className="h-4 w-4" />,
      onClick: (user: User) => {
        if (confirm(`Suspend ${user.name}?`)) {
          // Handle suspension
        }
      }
    },
    {
      label: 'Delete User',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          // Handle delete
        }
      }
    }
  ]

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: handleBulkDelete
    },
    {
      label: 'Enroll in Course',
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      onClick: handleBulkEnroll
    },
    {
      label: 'Change to Student',
      icon: <User className="h-4 w-4 mr-2" />,
      onClick: () => handleBulkChangeRole('student')
    },
    {
      label: 'Set High Severity',
      icon: <XCircle className="h-4 w-4 mr-2" />,
      onClick: () => handleBulkChangeSeverity('high')
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, permissions, and training severity levels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button className="bg-cosmic-purple hover:bg-cosmic-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={userMetrics.totalUsers}
          description="All registered users"
          icon={Users}
          iconColor="text-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Users"
          value={userMetrics.activeUsers}
          description="Currently active"
          icon={UserCheck}
          iconColor="text-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Students"
          value={userMetrics.students}
          description="Enrolled students"
          icon={User}
          iconColor="text-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Avg Progress"
          value={`${userMetrics.avgProgress}%`}
          description="Across all students"
          icon={Award}
          iconColor="text-orange-500"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="instructor">Instructors</SelectItem>
                <SelectItem value="administrator">Administrators</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={(value: any) => setFilterSeverity(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    High
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedUsers.size > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>{selectedUsers.size} users selected</span>
            <div className="flex gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* User table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={filteredUsers}
            columns={tableColumns}
            searchable={false}
            actions={tableActions}
            bulkActions={bulkActions}
            keyExtractor={(user) => user.id}
          />
        </CardContent>
      </Card>

      {/* Severity status info */}
      <Card>
        <CardHeader>
          <CardTitle>Training Severity Levels</CardTitle>
          <CardDescription>Understanding training requirements based on user risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium text-green-800">Low Severity</div>
                <div className="text-sm text-green-600">Basic compliance training</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-yellow-50">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="font-medium text-yellow-800">Medium Severity</div>
                <div className="text-sm text-yellow-600">Standard training + assessments</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="font-medium text-red-800">High Severity</div>
                <div className="text-sm text-red-600">Enhanced training + monitoring</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User activity overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>Latest user actions and logins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers
                .filter(u => u.status === 'active')
                .sort((a, b) => {
                  // Sort by last login (most recent first)
                  const timeMap: Record<string, number> = {
                    'Just now': 0,
                    '5 minutes ago': 5,
                    '1 hour ago': 60,
                    '2 hours ago': 120
                  }
                  return (timeMap[a.lastLogin] || 999) - (timeMap[b.lastLogin] || 999)
                })
                .slice(0, 5)
                .map((user) => (
                  <div key={user.id} className="flex items-center gap-3 text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-cosmic-purple to-electric-violet text-white text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last login {user.lastLogin}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{user.overallProgress}% progress</div>
                      <Progress value={user.overallProgress} className="w-20 h-1 mt-1" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by role and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">By Role</h4>
                <div className="space-y-3">
                  {['student', 'instructor', 'administrator'].map((role) => {
                    const count = users.filter(u => u.role === role).length
                    const percentage = (count / users.length) * 100
                    return (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role as User['role'])}
                          <span className="text-sm capitalize">{role}s</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">By Status</h4>
                <div className="space-y-3">
                  {['active', 'inactive', 'suspended'].map((status) => {
                    const count = users.filter(u => u.status === status).length
                    const percentage = (count / users.length) * 100
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">By Training Severity</h4>
                <div className="space-y-3">
                  {['low', 'medium', 'high'].map((severity) => {
                    const count = users.filter(u => u.severity === severity).length
                    const percentage = (count / users.length) * 100
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(severity as User['severity'])}
                          <span className="text-sm capitalize">{severity}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}