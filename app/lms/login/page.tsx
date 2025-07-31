"use client"

import { useRouter } from 'next/navigation'
import { LoginScreen } from '@/components/login-screen'
import { useState } from 'react'
import { authAPI } from '@/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authAPI.login(data)
      
      if (response.success) {
        // Login successful
        console.log('Login successful:', response.tokens)
        
        // Redirect to course overview page
        router.push('/lms/new_course_overview')
      } else {
        // Login failed
        setError(response.error || 'Invalid email or password. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupClick = () => {
    router.push('/lms/signup')
  }

  const handleForgotPasswordClick = () => {
    // TODO: Implement forgot password flow
    console.log('Forgot password clicked')
    // router.push('/lms/forgot-password')
  }

  return (
    <LoginScreen
      onSubmit={handleLogin}
      onSignupClick={handleSignupClick}
      onForgotPasswordClick={handleForgotPasswordClick}
      isLoading={isLoading}
      error={error}
    />
  )
}