'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'

interface FormData {
  name: string
  email: string
  phone: string
  location: string
  department: string
  manager: string
  role: 'student' | 'instructor' | 'administrator'
  severity: 'low' | 'medium' | 'high'
  sendWelcomeEmail: boolean
  autoEnrollCourses: boolean
  tempPassword: string
}

interface Course {
  id: string
  title: string
  mandatory: boolean
  severity: 'low' | 'medium' | 'high'[]
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
    severity: 'low',
    sendWelcomeEmail: true,
    autoEnrollCourses: true,
    tempPassword: ''
  })
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, tempPassword: password })
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
      console.log('Creating user:', {
        ...formData,
        enrolledCourses: selectedCourses
      })
      router.push('/lms/user-management')
    }, 1000)
  }

  const getSuggestedCourses = () => {
    return availableCourses.filter(course => 
      course.mandatory && course.severity.includes(formData.severity)
    )
  }

  const handleAutoEnroll = (checked: boolean) => {
    setFormData({ ...formData, autoEnrollCourses: checked })
    
    if (checked) {
      const mandatoryCourses = getSuggestedCourses().map(c => c.id)
      setSelectedCourses(mandatoryCourses)
    } else {
      setSelectedCourses([])
    }
  }

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId))
    } else {
      setSelectedCourses([...selectedCourses, courseId])
    }
  }

  return (
    <div className="min-h-screen bg-vergil-off-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lms/user-management" className="inline-flex items-center gap-2 text-vergil-purple hover:text-vergil-purple-lighter mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to User Management
          </Link>
          
          <h1 className="text-3xl font-bold text-vergil-off-black mb-2">Create New User</h1>
          <p className="text-vergil-off-black/70">Add a new user to the learning management system</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Full Name <span className="text-vergil-error">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-vergil-error' : ''}
                    placeholder="John Smith"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-vergil-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Email Address <span className="text-vergil-error">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-vergil-error' : ''}
                    placeholder="john.smith@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-vergil-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Department <span className="text-vergil-error">*</span>
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={errors.department ? 'border-vergil-error' : ''}
                    placeholder="Engineering"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-vergil-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Manager
                  </label>
                  <Input
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
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
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    User Role <span className="text-vergil-error">*</span>
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as FormData['role'] })}
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="administrator">Administrator</option>
                  </Select>
                  <p className="mt-1 text-sm text-vergil-off-black/60">
                    {formData.role === 'student' && 'Can access and complete assigned courses'}
                    {formData.role === 'instructor' && 'Can create and manage course content'}
                    {formData.role === 'administrator' && 'Full system access and user management'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-vergil-off-black mb-1">
                    Training Severity <span className="text-vergil-error">*</span>
                  </label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value as FormData['severity'] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                  <p className="mt-1 text-sm text-vergil-off-black/60">
                    {formData.severity === 'low' && 'Standard training pace with flexible deadlines'}
                    {formData.severity === 'medium' && 'Accelerated training with priority support'}
                    {formData.severity === 'high' && 'Intensive training with strict deadlines and monitoring'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-vergil-off-black mb-1">
                  Temporary Password <span className="text-vergil-error">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.tempPassword}
                    onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                    className={errors.tempPassword ? 'border-vergil-error' : ''}
                    placeholder="Enter temporary password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
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
          {formData.role === 'student' && (
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-vergil-off-black">Course Enrollment</h2>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="auto-enroll"
                      checked={formData.autoEnrollCourses}
                      onCheckedChange={handleAutoEnroll}
                    />
                    <label htmlFor="auto-enroll" className="text-sm text-vergil-off-black cursor-pointer">
                      Auto-enroll in mandatory courses
                    </label>
                  </div>
                </div>
                
                {formData.autoEnrollCourses && getSuggestedCourses().length > 0 && (
                  <div className="mb-4 p-3 bg-vergil-emphasis-bg rounded-lg">
                    <p className="text-sm text-vergil-emphasis-text">
                      Based on <Badge variant="warning" className="inline-flex mx-1">{formData.severity} severity</Badge> 
                      level, the following mandatory courses will be assigned:
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {availableCourses.map((course) => {
                    const isRecommended = course.severity.includes(formData.severity) && course.mandatory
                    const isSelected = selectedCourses.includes(course.id)
                    
                    return (
                      <div
                        key={course.id}
                        className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'border-vergil-purple bg-vergil-purple/5' : 'border-gray-200 hover:bg-vergil-off-white/50'
                        }`}
                        onClick={() => toggleCourse(course.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleCourse(course.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <p className="font-medium text-vergil-off-black">{course.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {course.mandatory && (
                                  <Badge variant="secondary" className="text-xs">Mandatory</Badge>
                                )}
                                {isRecommended && (
                                  <Badge variant="outline" className="text-xs">Recommended</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {course.severity.map((sev) => (
                              <Badge
                                key={sev}
                                variant={sev === 'high' ? 'destructive' : sev === 'medium' ? 'warning' : 'success'}
                                className="text-xs"
                              >
                                {sev}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <p className="mt-4 text-sm text-vergil-off-black/60">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </Card>
          )}

          {/* Notifications */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-vergil-off-black mb-4">Notifications</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="welcome-email"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => setFormData({ ...formData, sendWelcomeEmail: checked as boolean })}
                  />
                  <div>
                    <label htmlFor="welcome-email" className="text-vergil-off-black cursor-pointer">
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
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vergil-purple hover:bg-vergil-purple-lighter"
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