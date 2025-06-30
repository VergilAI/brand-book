'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  TrendingUp,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  RefreshCw,
  Lock
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
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
  phone?: string
  location?: string
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
  department?: string
  manager?: string
  bio?: string
}

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

const mockUser: User = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  role: 'student',
  status: 'active',
  severity: 'high',
  lastLogin: '2024-01-15T10:30:00',
  joinDate: '2023-06-15',
  coursesEnrolled: 5,
  coursesCompleted: 3,
  overallProgress: 72,
  certificatesEarned: 2,
  totalHours: 45.5,
  department: 'Engineering',
  manager: 'John Smith',
  bio: 'Senior Software Engineer passionate about AI and machine learning. Always eager to learn new technologies.'
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'AI Safety Fundamentals',
    progress: 100,
    status: 'completed',
    lastAccessed: '2024-01-10T14:30:00',
    timeSpent: 12.5
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    progress: 65,
    status: 'in_progress',
    dueDate: '2024-02-01',
    lastAccessed: '2024-01-15T10:30:00',
    timeSpent: 8.3
  },
  {
    id: '3',
    title: 'Data Privacy and Security',
    progress: 30,
    status: 'in_progress',
    dueDate: '2024-01-25',
    lastAccessed: '2024-01-12T16:20:00',
    timeSpent: 3.2
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'lesson_completed',
    title: 'Completed lesson: Neural Networks Basics',
    timestamp: '2024-01-15T10:30:00',
    details: 'Advanced Machine Learning - Module 3'
  },
  {
    id: '2',
    type: 'test_passed',
    title: 'Passed assessment with 92%',
    timestamp: '2024-01-14T15:45:00',
    details: 'AI Safety Fundamentals - Final Exam'
  },
  {
    id: '3',
    type: 'certificate_earned',
    title: 'Earned certificate',
    timestamp: '2024-01-14T16:00:00',
    details: 'AI Safety Fundamentals'
  }
]

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(mockUser)
  const [activeTab, setActiveTab] = useState('overview')

  const handleSave = () => {
    console.log('Saving user data:', userData)
    setIsEditing(false)
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
    }
  }

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lms/user-management" className="inline-flex items-center gap-2 text-vergil-purple hover:text-vergil-purple-lighter mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to User Management
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vergil-purple to-vergil-purple-lighter flex items-center justify-center text-vergil-full-white text-2xl font-medium">
                {userData.avatar ? (
                  <Image src={userData.avatar} alt={userData.name} width={80} height={80} className="rounded-full" />
                ) : (
                  userData.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-vergil-off-black mb-2">{userData.name}</h1>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant={getRoleBadgeVariant(userData.role)}>{userData.role}</Badge>
                  <Badge variant={getStatusBadgeVariant(userData.status)}>{userData.status}</Badge>
                  <Badge variant={getSeverityBadgeVariant(userData.severity)}>
                    {userData.severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {userData.severity} severity
                  </Badge>
                </div>
                <p className="text-vergil-off-black/60">Member since {formatDate(userData.joinDate)}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="bg-vergil-purple hover:bg-vergil-purple-lighter">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync User Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-vergil-error">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Info */}
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-vergil-off-black mb-4">User Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Email</label>
                      {isEditing ? (
                        <Input type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                      ) : (
                        <p className="flex items-center gap-2 text-vergil-off-black">
                          <Mail className="w-4 h-4 text-vergil-off-black/40" />
                          {userData.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Phone</label>
                      {isEditing ? (
                        <Input type="tel" value={userData.phone || ''} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
                      ) : (
                        <p className="flex items-center gap-2 text-vergil-off-black">
                          <Phone className="w-4 h-4 text-vergil-off-black/40" />
                          {userData.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Location</label>
                      {isEditing ? (
                        <Input value={userData.location || ''} onChange={(e) => setUserData({...userData, location: e.target.value})} />
                      ) : (
                        <p className="flex items-center gap-2 text-vergil-off-black">
                          <MapPin className="w-4 h-4 text-vergil-off-black/40" />
                          {userData.location || 'Not provided'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Department</label>
                      {isEditing ? (
                        <Input value={userData.department || ''} onChange={(e) => setUserData({...userData, department: e.target.value})} />
                      ) : (
                        <p className="text-vergil-off-black">{userData.department || 'Not assigned'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Role</label>
                      {isEditing ? (
                        <Select value={userData.role} onValueChange={(value) => setUserData({...userData, role: value as User['role']})}>
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="administrator">Administrator</option>
                        </Select>
                      ) : (
                        <Badge variant={getRoleBadgeVariant(userData.role)}>{userData.role}</Badge>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Training Severity</label>
                      {isEditing ? (
                        <Select value={userData.severity} onValueChange={(value) => setUserData({...userData, severity: value as User['severity']})}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </Select>
                      ) : (
                        <Badge variant={getSeverityBadgeVariant(userData.severity)}>
                          {userData.severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {userData.severity}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {userData.bio && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-vergil-off-black/60 mb-1">Bio</label>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vergil-purple/20"
                          rows={3}
                          value={userData.bio}
                          onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        />
                      ) : (
                        <p className="text-vergil-off-black">{userData.bio}</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Stats */}
              <div className="space-y-6">
                <Card variant="metric">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-vergil-off-black mb-4">Learning Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-vergil-off-black/60">Overall Progress</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-vergil-purple h-2 rounded-full transition-all"
                              style={{ width: `${userData.overallProgress}%` }}
                            />
                          </div>
                          <span className="text-2xl font-bold text-vergil-off-black">{userData.overallProgress}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-vergil-off-black/60">Courses</p>
                          <p className="text-xl font-bold text-vergil-off-black">{userData.coursesCompleted}/{userData.coursesEnrolled}</p>
                        </div>
                        <div>
                          <p className="text-sm text-vergil-off-black/60">Certificates</p>
                          <p className="text-xl font-bold text-vergil-off-black">{userData.certificatesEarned}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-vergil-off-black/60">Total Learning Time</p>
                        <p className="text-xl font-bold text-vergil-off-black">{userData.totalHours} hours</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-vergil-off-black mb-4">Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-vergil-off-black/40" />
                        <span className="text-vergil-off-black/60">Last login:</span>
                        <span className="text-vergil-off-black">{formatDateTime(userData.lastLogin)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-vergil-off-black/40" />
                        <span className="text-vergil-off-black/60">Joined:</span>
                        <span className="text-vergil-off-black">{formatDate(userData.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Enrolled Courses</h2>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:bg-vergil-off-white/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-vergil-off-black mb-1">{course.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-vergil-off-black/60 mb-3">
                            <span>Last accessed: {formatDateTime(course.lastAccessed)}</span>
                            <span>Time spent: {course.timeSpent}h</span>
                            {course.dueDate && (
                              <span className="text-vergil-warning">Due: {formatDate(course.dueDate)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  course.status === 'completed' ? 'bg-vergil-success' : 'bg-vergil-purple'
                                }`}
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-vergil-off-black min-w-[3ch]">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <Badge variant={course.status === 'completed' ? 'success' : 'secondary'}>
                          {course.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'certificate_earned' ? 'bg-vergil-purple/10 text-vergil-purple' :
                        activity.type === 'test_passed' ? 'bg-vergil-success/10 text-vergil-success' :
                        'bg-vergil-off-white text-vergil-off-black'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-vergil-off-black">{activity.title}</p>
                        {activity.details && (
                          <p className="text-sm text-vergil-off-black/60 mt-1">{activity.details}</p>
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
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-vergil-off-black mb-4">User Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-vergil-off-black mb-3">Account Status</h3>
                    <div className="flex items-center gap-4">
                      <Select 
                        value={userData.status} 
                        onValueChange={(value) => setUserData({...userData, status: value as User['status']})}
                        className="w-48"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </Select>
                      <Badge variant={getStatusBadgeVariant(userData.status)}>{userData.status}</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-vergil-off-black mb-3">Security</h3>
                    <div className="space-y-3">
                      <Button variant="outline">
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </Button>
                      <p className="text-sm text-vergil-off-black/60">
                        Send a password reset link to the user's email address
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-vergil-off-black mb-3">Danger Zone</h3>
                    <div className="p-4 border border-vergil-error/20 rounded-lg bg-vergil-error/5">
                      <p className="text-sm text-vergil-off-black mb-3">
                        Once you delete a user, there is no going back. Please be certain.
                      </p>
                      <Button variant="outline" className="text-vergil-error border-vergil-error/20 hover:bg-vergil-error/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}