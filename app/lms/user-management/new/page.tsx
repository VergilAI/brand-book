'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, AlertCircle } from 'lucide-react'
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
import { Checkbox } from '@/components/atomic/checkbox'
import { initialRoles } from '@/lib/lms/roles-data'
import { mockUsers } from '@/lib/lms/mock-data'

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  department: string
  manager: string
  role: 'student' | 'instructor' | 'administrator' | 'super_admin' | 'manager'
  reportsTo: string
  severity: 'low' | 'medium' | 'high'
  sendWelcomeEmail: boolean
  autoEnrollCourses: boolean
  tempPassword: string
}

interface Course {
  id: string
  title: string
  mandatory: boolean
  severity: ('low' | 'medium' | 'high')[]
}

const availableCourses: Course[] = [
  { id: '1', title: 'AI Safety Fundamentals', mandatory: true, severity: ['high', 'medium'] },
  { id: '2', title: 'Data Privacy and Security', mandatory: true, severity: ['high'] },
  { id: '3', title: 'Introduction to Machine Learning', mandatory: false, severity: ['low', 'medium', 'high'] },
  { id: '4', title: 'Ethics in AI Development', mandatory: true, severity: ['high', 'medium'] },
  { id: '5', title: 'Company Onboarding', mandatory: true, severity: ['low', 'medium', 'high'] }
]

export default function NewUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    manager: '',
    role: 'student',
    reportsTo: 'none',
    severity: 'low',
    sendWelcomeEmail: true,
    autoEnrollCourses: true,
    tempPassword: ''
  })
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-select mandatory courses when component loads (if auto-enroll is enabled by default)
  useEffect(() => {
    if (formData.autoEnrollCourses) {
      const mandatoryCourses = availableCourses
        .filter(course => course.mandatory)
        .map(c => c.id)
      setSelectedCourses(mandatoryCourses)
    }
  }, []) // Empty dependency array means this runs only once on mount

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, tempPassword: password }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required'
    }
    
    if (!formData.tempPassword.trim()) {
      newErrors.tempPassword = 'Temporary password is required'
    } else if (formData.tempPassword.length < 8) {
      newErrors.tempPassword = 'Password must be at least 8 characters'
    }
    
    // Reports To validation - mandatory for all roles except Super Admin
    if (formData.role !== 'super_admin' && (!formData.reportsTo || formData.reportsTo === 'none')) {
      newErrors.reportsTo = 'Reports To is required for this role'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      // Create user with form data and selected courses
      // In production, this would make an API call
      router.push('/lms/user-management')
    }, 1000)
  }

  const getSuggestedCourses = () => {
    return availableCourses.filter(course => 
      course.mandatory && course.severity.includes(formData.severity)
    )
  }

  const handleAutoEnroll = (checked: boolean) => {
    setFormData(prev => ({ ...prev, autoEnrollCourses: checked }))
    
    if (checked) {
      // Select ALL mandatory courses regardless of severity
      const mandatoryCourses = availableCourses
        .filter(course => course.mandatory)
        .map(c => c.id)
      setSelectedCourses(mandatoryCourses)
    } else {
      setSelectedCourses([])
    }
  }

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId)
      } else {
        return [...prev, courseId]
      }
    })
  }

  return (
    <div className="min-h-screen bg-secondary"> {/* #F5F5F7 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lms/user-management" className="inline-flex items-center gap-2 text-brand hover:text-brandLight mb-spacing-md"> {/* #A64DFF, #9933FF, 16px */}
            <ArrowLeft className="w-4 h-4" />
            Back to User Management
          </Link>
          
          <h1 className="text-3xl font-bold text-primary mb-spacing-xs">Create New User</h1> {/* #1D1D1F, 4px */}
          <p className="text-secondary">Add a new user to the learning management system</p> {/* #6C6C6D */}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-primary mb-spacing-md">Basic Information</h2> {/* #1D1D1F, 16px */}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Full Name <span className="text-error">*</span> {/* #E51C23 */}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={errors.name ? 'border-error' : ''} // #FCA5A5
                    placeholder="John Smith"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error flex items-center gap-1"> {/* #E51C23 */}
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Email Address <span className="text-vergil-error">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-vergil-error' : ''}
                    placeholder="john.smith@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error flex items-center gap-1"> {/* #E51C23 */}
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Department <span className="text-vergil-error">*</span>
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className={errors.department ? 'border-vergil-error' : ''}
                    placeholder="Engineering"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-error flex items-center gap-1"> {/* #E51C23 */}
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Manager
                  </label>
                  <Input
                    value={formData.manager}
                    onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Role and Access */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Role and Access</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    User Role <span className="text-vergil-error">*</span>
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as FormData['role'] }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-sm text-secondary"> {/* #6C6C6D */}
                    {formData.role === 'super_admin' && 'Ultimate system access with all privileges and permissions'}
                    {formData.role === 'administrator' && 'Full system access and user management capabilities'}
                    {formData.role === 'manager' && 'Team management and oversight responsibilities'}
                    {formData.role === 'instructor' && 'Can create and manage course content'}
                    {formData.role === 'student' && 'Can access and complete assigned courses'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-1"> {/* #1D1D1F */}
                    Training Severity <span className="text-vergil-error">*</span>
                  </label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as FormData['severity'] }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-sm text-secondary"> {/* #6C6C6D */}
                    {formData.severity === 'low' && 'Standard training pace with flexible deadlines'}
                    {formData.severity === 'medium' && 'Accelerated training with priority support'}
                    {formData.severity === 'high' && 'Intensive training with strict deadlines and monitoring'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-vergil-off-black mb-1">
                  Reports To {formData.role !== 'super_admin' && <span className="text-vergil-error">*</span>}
                </label>
                <Select
                  value={formData.reportsTo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reportsTo: value }))}
                >
                  <SelectTrigger className={`w-full ${errors.reportsTo ? 'border-vergil-error' : ''}`}>
                    <SelectValue placeholder={formData.role === 'super_admin' ? "Select reporting manager (optional)" : "Select reporting manager"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.role === 'super_admin' && (
                      <SelectItem value="none">None (Top Level)</SelectItem>
                    )}
                    {mockUsers
                      .filter(user => user.roleId !== '4') // Exclude students from being managers
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({initialRoles.find(r => r.id === user.roleId)?.name || 'Unknown Role'})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                {errors.reportsTo && (
                  <p className="mt-1 text-sm text-vergil-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.reportsTo}
                  </p>
                )}
                <p className="mt-1 text-sm text-vergil-off-black/60">
                  {formData.role === 'super_admin' 
                    ? 'Super Admins can optionally report to another user or be at the top level'
                    : 'Select which user this person will report to in the organization hierarchy'
                  }
                </p>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-vergil-off-black mb-1">
                  Temporary Password <span className="text-vergil-error">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.tempPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempPassword: e.target.value }))}
                    className={errors.tempPassword ? 'border-vergil-error' : ''}
                    placeholder="Enter temporary password"
                  />
                  <Button type="button" variant="secondary" onClick={generatePassword}>
                    Generate
                  </Button>
                </div>
                {errors.tempPassword && (
                  <p className="mt-1 text-sm text-vergil-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.tempPassword}
                  </p>
                )}
                <p className="mt-1 text-sm text-vergil-off-black/60">
                  User will be required to change this on first login
                </p>
              </div>
            </div>
          </Card>

          {/* Course Enrollment */}
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-vergil-off-black">Course Enrollment</h2>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="auto-enroll"
                      checked={formData.autoEnrollCourses}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          handleAutoEnroll(checked)
                        }
                      }}
                    />
                    <label htmlFor="auto-enroll" className="text-sm text-vergil-off-black cursor-pointer">
                      Auto-enroll in mandatory courses
                    </label>
                  </div>
                </div>
                
                {formData.autoEnrollCourses && availableCourses.some(c => c.mandatory) && (
                  <div className="mb-4 p-3 bg-emphasis rounded-lg"> {/* #F0F0F2 */}
                    <p className="text-sm text-primary"> {/* #1D1D1F */}
                      All mandatory courses will be automatically assigned to this user.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {availableCourses.map((course) => {
                    const isRecommended = course.severity.includes(formData.severity) && course.mandatory
                    const isSelected = selectedCourses.includes(course.id)
                    
                    return (
                      <label
                        key={course.id}
                        htmlFor={`course-${course.id}`}
                        className={`block p-3 border rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'border-brand bg-brandLight' : 'border-subtle hover:bg-emphasis' // #A64DFF, #F3E6FF, rgba(0,0,0,0.05), #F0F0F2
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`course-${course.id}`}
                              checked={isSelected}
                              onCheckedChange={() => toggleCourse(course.id)}
                            />
                            <div>
                              <p className="font-medium text-primary">{course.title}</p> {/* #1D1D1F */}
                              <div className="flex items-center gap-2 mt-1">
                                {course.mandatory && (
                                  <Badge variant="default" className="text-xs">Mandatory</Badge>
                                )}
                                {isRecommended && (
                                  <Badge variant="info" className="text-xs">Recommended</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {course.severity.map((sev) => (
                              <Badge
                                key={sev}
                                variant={sev === 'high' ? 'error' : sev === 'medium' ? 'warning' : 'success'}
                                className="text-xs"
                              >
                                {sev}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
                
                <p className="mt-4 text-sm text-vergil-off-black/60">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Notifications</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="welcome-email"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        setFormData(prev => ({ ...prev, sendWelcomeEmail: checked }))
                      }
                    }}
                  />
                  <div>
                    <label htmlFor="welcome-email" className="text-primary cursor-pointer"> {/* #1D1D1F */}
                      Send welcome email
                    </label>
                    <p className="text-sm text-vergil-off-black/60">
                      User will receive login credentials and onboarding instructions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/lms/user-management">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}