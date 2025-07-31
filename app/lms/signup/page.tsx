"use client"

import { useRouter } from 'next/navigation'
import { SignupScreen } from '@/components/signup-screen'
import { useState } from 'react'
import { authAPI } from '@/lib/api/auth'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (data: { 
    name: string
    email: string
    password: string 
  }) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authAPI.signup(data)
      
      if (response.success) {
        // Signup successful - user is already logged in
        console.log('Signup successful:', response.data)
        
        // Since registration returns tokens and logs the user in,
        // redirect directly to the course overview
        router.push('/lms/new_course_overview')
      } else {
        // Signup failed
        setError(response.error || 'An error occurred during registration. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = () => {
    router.push('/lms/login')
  }

  return (
    <SignupScreen
      onSubmit={handleSignup}
      onLoginClick={handleLoginClick}
      isLoading={isLoading}
      error={error}
    />
  )
}