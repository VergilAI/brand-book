'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { VergilLogo } from '@/components/lms/vergil-logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate login process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation
      if (email === 'demo@vergil.ai' && password === 'demo123') {
        // Redirect to LMS dashboard
        window.location.href = '/lms'
      } else {
        setError('Invalid email or password. Try demo@vergil.ai / demo123')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid = email && password && isValidEmail(email)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to main site */}
        <div className="flex items-center justify-center">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vergil
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <VergilLogo variant="mark" size="lg" animated={true} />
            <div>
              <div className="text-2xl font-bold">Vergil Learn</div>
              <div className="text-sm text-muted-foreground">Learning Management System</div>
            </div>
          </div>
        </div>

        {/* Login form */}
        <Card className="border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? 'border-red-300 focus:border-red-500' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? 'border-red-300 focus:border-red-500' : ''}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/lms/forgot-password"
                  className="text-sm text-cosmic-purple hover:text-cosmic-purple/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/90"
                disabled={!isFormValid || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-2">Demo Credentials</div>
                <div className="space-y-1 text-blue-700">
                  <div><strong>Email:</strong> demo@vergil.ai</div>
                  <div><strong>Password:</strong> demo123</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/lms/signup"
                className="text-cosmic-purple hover:text-cosmic-purple/80 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="text-center">
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Need help? Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}