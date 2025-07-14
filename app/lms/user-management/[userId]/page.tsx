'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { UserManagementHeader } from '@/components/user-management-header'
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  BookOpen, 
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  Edit2,
  MessageSquare,
  User as UserIcon,
  Plus,
  X,
  RefreshCw,
  Trash2,
  MapPin,
  Lock
} from 'lucide-react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { mockUsers, getRoleName, type User } from '@/lib/lms/mock-data'
import { initialRoles } from '@/lib/lms/roles-data'


interface Course {
  id: string
  title: string
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  dueDate?: string
  lastAccessed: string
  timeSpent: number
}

interface Activity {
  id: string
  type: 'course_started' | 'course_completed' | 'lesson_completed' | 'test_passed' | 'certificate_earned'
  title: string
  timestamp: string
  details?: string
}


const mockCourses: Course[] = [
  {
    id: '1',
    title: 'AI Safety Fundamentals',
    progress: 100,
    status: 'completed',
    lastAccessed: '2025-07-12T14:30:00',
    timeSpent: 12.5
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    progress: 65,
    status: 'in_progress',
    dueDate: '2025-08-01',
    lastAccessed: '2025-07-13T10:30:00',
    timeSpent: 8.3
  },
  {
    id: '3',
    title: 'Data Privacy and Security',
    progress: 30,
    status: 'in_progress',
    dueDate: '2025-08-25',
    lastAccessed: '2025-07-11T16:20:00',
    timeSpent: 3.2
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'lesson_completed',
    title: 'Completed lesson: Neural Networks Basics',
    timestamp: '2025-07-13T10:30:00',
    details: 'Advanced Machine Learning - Module 3'
  },
  {
    id: '2',
    type: 'test_passed',
    title: 'Passed assessment with 92%',
    timestamp: '2025-07-12T15:45:00',
    details: 'AI Safety Fundamentals - Final Exam'
  },
  {
    id: '3',
    type: 'certificate_earned',
    title: 'Earned certificate',
    timestamp: '2025-07-12T16:00:00',
    details: 'AI Safety Fundamentals'
  }
]

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  
  // Find the actual user from mock data
  const user = mockUsers.find(u => u.id === userId)
  const userRole = user ? initialRoles.find(r => r.id === user.roleId) : null
  
  // Convert status for display
  const getUserStatus = () => {
    if (!user) return 'inactive'
    if (user.status === 'on_track' || user.status === 'ahead') return 'active'
    if (user.status === 'at_risk') return 'inactive'
    return 'suspended'
  }
  
  // Calculate manager (get first admin or super admin)
  const getManager = () => {
    if (!userRole || userRole.parentRole === null) return null
    const managers = mockUsers.filter(u => u.roleId === userRole.parentRole)
    return managers.length > 0 ? managers[0].name : null
  }
  
  // Default values for non-existent users
  const defaultUser = {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@company.com',
    phone: 'Not provided',
    location: 'Not provided',
    roleId: '5',
    role: 'Employee',
    status: 'inactive' as const,
    severity: user?.severity || 'low' as const,
    avatar: '',
    lastLogin: new Date().toISOString(),
    joinDate: new Date().toISOString(),
    coursesEnrolled: 0,
    coursesCompleted: 0,
    overallProgress: 0,
    certificatesEarned: 0,
    totalHours: 0,
    completionRate: 0
  }
  
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(user ? {
    ...user,
    role: getRoleName(user.roleId, initialRoles).toLowerCase(),
    roleId: user.roleId,
    location: 'San Francisco, CA',
    department: 'Not assigned',
    manager: getManager(),
    status: getUserStatus(),
    overallProgress: user.completionRate || user.overallProgress || 0
  } : defaultUser)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAssignSubordinateModal, setShowAssignSubordinateModal] = useState(false)
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false)
  const [selectedSubordinates, setSelectedSubordinates] = useState<string[]>([])
  const [selectedManager, setSelectedManager] = useState('')
  const [userSubordinates, setUserSubordinates] = useState<string[]>(() => {
    // Initialize subordinates based on demo data
    if (userData.roleId === '2') return ['u3', 'u4', 'u5'] // Admin has some subordinates
    if (userData.roleId === '3') return ['u6', 'u7', 'u8'] // Manager has some subordinates
    if (userData.roleId === '4') return ['u10', 'u11'] // Instructor has some subordinates
    return []
  })
  
  // Redirect if user not found
  useEffect(() => {
    if (!user) {
      // User not found - could redirect to user management page
      // Optionally redirect to user management page
      // router.push('/lms/user-management')
    }
  }, [user, userId])

  const handleSave = () => {
    // Save user data logic would go here
    setIsEditing(false)
  }

  const getRoleBadgeVariant = (role: string) => {
    const roleLower = role.toLowerCase()
    if (roleLower.includes('admin')) return 'default'
    if (roleLower.includes('manager')) return 'secondary'
    if (roleLower.includes('instructor')) return 'secondary'
    return 'outline'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'suspended': return 'destructive'
      default: return 'outline'
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
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'course_started': return <BookOpen className="w-4 h-4" />
      case 'course_completed': return <Award className="w-4 h-4" />
      case 'lesson_completed': return <BookOpen className="w-4 h-4" />
      case 'test_passed': return <TrendingUp className="w-4 h-4" />
      case 'certificate_earned': return <Award className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <UserManagementHeader />
        
       
        <div className="mb-6">
          <Link href="/lms/user-management" className="inline-flex items-center gap-2 text-vergil-off-black/60 hover:text-vergil-off-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to User Management
          </Link>
        </div>
        
       
        <div className="mb-8">
          <div className="bg-primary rounded-xl border border-subtle p-spacing-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-brand flex items-center justify-center text-inverse text-3xl font-semibold shadow-lg">
                  {userData.avatar ? (
                    <Image src={userData.avatar} alt={userData.name} width={96} height={96} className="rounded-full" />
                  ) : (
                    userData.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-spacing-xs">{userData.name}</h1>
                  <p className="text-lg font-medium text-secondary mb-spacing-sm">{userRole?.name || 'Employee'}</p>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={userData.status === 'active' ? 'success' : userData.status === 'inactive' ? 'warning' : 'destructive'}
                      className="text-xs"
                    >
                      {userData.status}
                    </Badge>
                    {userData.severity === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Priority
                      </Badge>
                    )}
                    <span className="text-sm text-vergil-off-black/50">Last logged in: {formatDateTime(userData.lastLogin)}</span>
                  </div>
                </div>
              </div>
            
              <div className="flex gap-1 pr-4">
                {isEditing ? (
                  <>
                    <Button variant="secondary" size="sm" className="text-xs px-2 py-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave} size="sm" className="bg-vergil-purple hover:bg-vergil-purple/90 text-xs px-2 py-1">
                      <Save className="w-3 h-3 mr-1" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${userData.email}?subject=Training%20Progress%20Update`}
                      className="border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20 text-xs px-2 py-1"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Send Email
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => window.location.href = `slack://user?team=T12345&id=${userData.id}`}
                      className="border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20 text-xs px-2 py-1"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Slack Message
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="border-vergil-off-black/10 text-xs px-2 py-1">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Lock className="w-4 h-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync User Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

       
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Contact Information</h2>
                  
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-vergil-purple" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-vergil-off-black/60 mb-1">Email Address</p>
                          {isEditing ? (
                            <Input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} className="h-8" />
                          ) : (
                            <p className="text-sm font-medium text-vergil-off-black">{userData.email}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-vergil-purple" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-vergil-off-black/60 mb-1">Phone Number</p>
                          {isEditing ? (
                            <Input type="tel" value={userData.phone || ''} onChange={(e) => setUserData({...userData, phone: e.target.value})} className="h-8" />
                          ) : (
                            <p className="text-sm font-medium text-vergil-off-black">{userData.phone || 'Not provided'}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-vergil-purple" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-vergil-off-black/60 mb-1">Location</p>
                          {isEditing ? (
                            <Input value={(userData as any).location || ''} onChange={(e) => setUserData({...userData, location: e.target.value} as any)} className="h-8" />
                          ) : (
                            <p className="text-sm font-medium text-vergil-off-black">{(userData as any).location || 'Not provided'}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vergil-purple/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-vergil-purple" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-vergil-off-black/60 mb-1">Manager</p>
                          {isEditing ? (
                            <Input value={(userData as any).manager || ''} onChange={(e) => setUserData({...userData, manager: e.target.value} as any)} className="h-8" />
                          ) : (
                            <p className="text-sm font-medium text-vergil-off-black">{(userData as any).manager || 'Not assigned'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              
             
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Progress Overview</h2>
                    
                   
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-vergil-off-black">Overall Progress</span>
                        <span className="text-2xl font-bold" style={{ 
                          color: userData.overallProgress >= 80 ? '#10B981' : 
                                 userData.overallProgress >= 60 ? '#F59E0B' : '#EF4444' 
                        }}>
                          {userData.overallProgress}%
                        </span>
                      </div>
                      <Progress value={userData.overallProgress} className="h-3" />
                    </div>
                    
                   
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-emphasis rounded-lg p-spacing-sm text-center">
                        <p className="text-2xl font-bold text-brand">{userData.coursesCompleted}</p>
                        <p className="text-xs text-secondary">Completed</p>
                      </div>
                      <div className="bg-emphasis rounded-lg p-spacing-sm text-center">
                        <p className="text-2xl font-bold text-info">{userData.coursesEnrolled - userData.coursesCompleted}</p>
                        <p className="text-xs text-secondary">In Progress</p>
                      </div>
                      <div className="bg-emphasis rounded-lg p-spacing-sm text-center">
                        <p className="text-2xl font-bold text-tertiary">{Math.max(0, 10 - userData.coursesEnrolled)}</p>
                        <p className="text-xs text-secondary">Not Started</p>
                      </div>
                    </div>
                  </div>
                </Card>

             
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Role & Status</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-vergil-off-black/60 mb-2">Role</p>
                        {isEditing ? (
                          <Select value={userData.roleId} onValueChange={(value) => setUserData({...userData, roleId: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {initialRoles.map(role => (
                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm font-medium text-vergil-off-black">{userRole?.name || 'Employee'}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs text-vergil-off-black/60 mb-2">Status</p>
                        {isEditing ? (
                          <Select value={(userData as any).status} onValueChange={(value) => setUserData({...userData, status: value} as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="default" 
                            className={`text-xs ${
                              userData.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              userData.status === 'inactive' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                              'bg-red-100 text-red-700 border-red-200'
                            }`}
                          >
                            {userData.status}
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs text-vergil-off-black/60 mb-2">Training Priority</p>
                        {isEditing ? (
                          <Select value={userData.severity} onValueChange={(value) => setUserData({...userData, severity: value} as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="default"
                            className={`text-xs ${
                              userData.severity === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                              userData.severity === 'medium' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {userData.severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {userData.severity} priority
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
            </div>
            
           
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
             
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Manager</h2>
                  {(userData as any).manager ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-vergil-purple flex items-center justify-center text-vergil-off-white font-semibold">
                          {(userData as any).manager.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-vergil-off-black">{(userData as any).manager}</p>
                          <p className="text-sm text-vergil-off-black/60">Manager</p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAssignManagerModal(true)}
                        className="w-full"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Change Manager
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-vergil-off-black/60 mb-4">No manager assigned</p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowAssignManagerModal(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Manager
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

             
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-vergil-off-black">Subordinates</h2>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowAssignSubordinateModal(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {(() => {
                    // Get users who report to this user
                    const subordinates = mockUsers.filter(u => userSubordinates.includes(u.id))
                    
                    if (subordinates.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-sm text-vergil-off-black/60">No subordinates assigned</p>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="space-y-3">
                        {subordinates.map(subordinate => {
                          const subRole = initialRoles.find(r => r.id === subordinate.roleId)
                          return (
                            <div key={subordinate.id} className="flex items-center justify-between p-3 bg-vergil-off-white/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-vergil-purple/10 flex items-center justify-center text-vergil-purple font-medium text-sm">
                                  {subordinate.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-vergil-off-black">{subordinate.name}</p>
                                  <p className="text-xs text-vergil-off-black/60">{subRole?.name || 'Employee'}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUserSubordinates(prev => prev.filter(id => id !== subordinate.id))
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card className="border-vergil-off-black/10">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Courses Enrolled</h2>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-vergil-off-white/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-vergil-off-black">{course.title}</h3>
                        <Badge 
                          variant="default" 
                          className={`text-xs ${
                            course.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            course.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {course.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Progress value={course.progress} className="flex-1" />
                          <span className="text-sm font-semibold text-primary min-w-[3ch]">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-secondary">
                          <span>Last accessed: {formatDateTime(course.lastAccessed)}</span>
                          {course.dueDate && (
                            <span className="text-warning font-medium">Due: {formatDate(course.dueDate)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-subtle">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-primary mb-spacing-md">Recent Activity</h2>
                <div className="space-y-3">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-spacing-sm p-spacing-md bg-emphasis rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'certificate_earned' ? 'bg-brandLight' :
                        activity.type === 'test_passed' ? 'bg-successLight' :
                        'bg-infoLight'
                      }`}>
                        <div className={`${
                          activity.type === 'certificate_earned' ? 'text-vergil-purple' :
                          activity.type === 'test_passed' ? 'text-emerald-700' :
                          'text-blue-700'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-vergil-off-black">{activity.title}</p>
                        {activity.details && (
                          <p className="text-xs text-vergil-off-black/60 mt-1">{activity.details}</p>
                        )}
                        <p className="text-xs text-vergil-off-black/40 mt-2">{formatDateTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-vergil-off-black/10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-vergil-off-black mb-2">Account Status</p>
                      <div className="flex items-center gap-3">
                        <Select 
                          value={(userData as any).status} 
                          onValueChange={(value) => setUserData({...userData, status: value} as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-vergil-off-black/10">
                      <p className="text-sm font-medium text-vergil-off-black mb-3">Security Actions</p>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start border-vergil-off-black/10 hover:bg-vergil-purple/5 hover:border-vergil-purple/20"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Send Password Reset Link
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-red-200 bg-red-50/30">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
                  <p className="text-sm text-red-700 mb-4">
                    Deleting a user account is permanent and cannot be undone. All associated data will be lost.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="text-red-600 border-red-300 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User Account
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
       
        {showAssignManagerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-vergil-off-black">Assign Manager</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAssignManagerModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-2">
                      Select Manager
                    </label>
                    <Select
                      value={selectedManager}
                      onValueChange={setSelectedManager}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a manager..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          // Get current user's role hierarchy level
                          const currentUserRole = initialRoles.find(r => r.id === userData.roleId)
                          if (!currentUserRole) return null
                          
                          // Define role hierarchy (1=Super Admin, 2=Admin, 3=Manager, 4=Instructor)
                          const roleHierarchy: Record<string, number> = {
                            '1': 1, // Super Admin
                            '2': 2, // Admin
                            '3': 3, // Manager
                            '4': 4  // Instructor
                          }
                          
                          const currentUserLevel = roleHierarchy[userData.roleId] || 999
                          
                          // Filter users who can be managers
                          const availableManagers = mockUsers.filter(u => {
                            // Skip current user
                            if (u.id === userId) return false
                            
                            // Get potential manager's level
                            const managerLevel = roleHierarchy[u.roleId] || 999
                            
                            // Only show users at higher hierarchy levels (lower number = higher in hierarchy)
                            return managerLevel < currentUserLevel
                          })
                          
                          if (availableManagers.length === 0) {
                            return (
                              <SelectItem value="none" disabled>
                                No eligible managers available
                              </SelectItem>
                            )
                          }
                          
                          return availableManagers.map(manager => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name} - {getRoleName(manager.roleId, initialRoles)}
                            </SelectItem>
                          ))
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAssignManagerModal(false)
                      setSelectedManager('')
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedManager) {
                        const manager = mockUsers.find(u => u.id === selectedManager)
                        if (manager) {
                          setUserData({...userData, manager: manager.name})
                        }
                      }
                      setShowAssignManagerModal(false)
                      setSelectedManager('')
                    }}
                    className="flex-1 bg-vergil-purple hover:bg-vergil-purple/90"
                    disabled={!selectedManager}
                  >
                    Assign Manager
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
       
        {showAssignSubordinateModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAssignSubordinateModal(false)
              setSelectedSubordinates([])
            }}
          >
            <Card 
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-vergil-off-black">Assign Subordinate</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAssignSubordinateModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-vergil-off-black mb-2">
                      Select Team Members
                    </label>
                    <div className="space-y-2 max-h-64 overflow-y-auto border border-vergil-off-black/10 rounded-lg p-3">
                      {(() => {
                        // Get current user's role hierarchy level
                        const currentUserRole = initialRoles.find(r => r.id === userData.roleId)
                        if (!currentUserRole) return null
                        
                        // Define role hierarchy (1=Super Admin, 2=Admin, 3=Manager, 4=Instructor)
                        const roleHierarchy: Record<string, number> = {
                          '1': 1, // Super Admin
                          '2': 2, // Admin
                          '3': 3, // Manager
                          '4': 4  // Instructor
                        }
                        
                        const currentUserLevel = roleHierarchy[userData.roleId] || 999
                        
                        // Filter users who can be subordinates
                        const availableSubordinates = mockUsers.filter(u => {
                          // Skip current user
                          if (u.id === userId) return false
                          
                          // Skip users already assigned as subordinates
                          if (userSubordinates.includes(u.id)) return false
                          
                          // Get potential subordinate's level
                          const subLevel = roleHierarchy[u.roleId] || 999
                          
                          // Only show users at lower hierarchy levels (higher number = lower in hierarchy)
                          return subLevel > currentUserLevel
                        })
                        
                        if (availableSubordinates.length === 0) {
                          return (
                            <p className="text-sm text-vergil-off-black/60 text-center py-4">
                              No eligible team members available
                            </p>
                          )
                        }
                        
                        return availableSubordinates.map(subordinate => (
                          <label
                            key={subordinate.id}
                            className="flex items-center gap-3 p-2 rounded hover:bg-vergil-off-white cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubordinates.includes(subordinate.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSubordinates(prev => [...prev, subordinate.id])
                                } else {
                                  setSelectedSubordinates(prev => prev.filter(id => id !== subordinate.id))
                                }
                              }}
                              className="w-4 h-4 text-vergil-purple focus:ring-vergil-purple/50 rounded"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-8 h-8 rounded-full bg-vergil-purple/10 flex items-center justify-center text-vergil-purple font-medium text-xs">
                                {subordinate.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-vergil-off-black">{subordinate.name}</p>
                                <p className="text-xs text-vergil-off-black/60">{getRoleName(subordinate.roleId, initialRoles)}</p>
                              </div>
                            </div>
                          </label>
                        ))
                      })()}
                    </div>
                    {selectedSubordinates.length > 0 && (
                      <p className="text-xs text-vergil-off-black/60 mt-2">
                        {selectedSubordinates.length} team member{selectedSubordinates.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAssignSubordinateModal(false)
                      setSelectedSubordinates([])
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedSubordinates.length > 0) {
                        setUserSubordinates(prev => [...prev, ...selectedSubordinates])
                      }
                      setShowAssignSubordinateModal(false)
                      setSelectedSubordinates([])
                    }}
                    className="flex-1 bg-vergil-purple hover:bg-vergil-purple/90"
                    disabled={selectedSubordinates.length === 0}
                  >
                    Assign {selectedSubordinates.length > 0 ? `${selectedSubordinates.length} ` : ''}Subordinate{selectedSubordinates.length > 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
