'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { VergilLogo } from '@/components/vergil-logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Alert, AlertDescription } from '@/components/alert'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate password reset process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <VergilLogo variant="mark" size="lg" animated={true} />
              <div>
                <div className="text-2xl font-bold">Vergil Learn</div>
                <div className="text-sm text-muted-foreground">Learning Management System</div>
              </div>
            </div>
          </div>

          <Card className="border shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Don't see the email? Check your spam folder or try again with a different email address.
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try different email
                </Button>
                
                <Link href="/lms/login">
                  <Button className="w-full bg-cosmic-purple hover:bg-cosmic-purple/90">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-purple/5 via-white to-electric-violet/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center">
          <Link 
            href="/lms/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <VergilLogo variant="mark" size="lg" animated={true} />
            <div>
              <div className="text-2xl font-bold">Vergil Learn</div>
              <div className="text-sm text-muted-foreground">Learning Management System</div>
            </div>
          </div>
        </div>

        <Card className="border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
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
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/90"
                disabled={!email || !isValidEmail(email) || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Sending reset link...' : 'Send reset link'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link
                href="/lms/login"
                className="text-cosmic-purple hover:text-cosmic-purple/80 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

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