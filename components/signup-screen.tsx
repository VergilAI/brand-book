"use client"

import * as React from "react"
import { Button } from "@/components/atomic/button"
import { Input } from "@/components/atomic/input"
import { Label } from "@/components/atomic/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/card"
import { Eye, EyeOff, Mail, Lock, User } from "@vergil/design-system/icons"
import { VergilLogo } from "@/components/vergil-logo"
import { cn } from "@/lib/utils"

export interface SignupScreenProps {
  onSubmit?: (data: { 
    name: string
    email: string
    password: string 
  }) => void
  onLoginClick?: () => void
  isLoading?: boolean
  error?: string
  className?: string
}

export function SignupScreen({
  onSubmit,
  onLoginClick,
  isLoading = false,
  error,
  className
}: SignupScreenProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: ""
  })
  const [fieldErrors, setFieldErrors] = React.useState({
    name: "",
    email: "",
    password: ""
  })

  const validateName = (name: string) => {
    if (!name) return "Name is required"
    if (name.length < 2) return "Name must be at least 2 characters"
    if (!/^[a-zA-Z\s-']+$/.test(name)) return "Name can only contain letters, spaces, hyphens, and apostrophes"
    return ""
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nameError = validateName(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    setFieldErrors({
      name: nameError,
      email: emailError,
      password: passwordError
    })

    if (!nameError && !emailError && !passwordError && onSubmit) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field error when user starts typing
    setFieldErrors(prev => ({ ...prev, [field]: "" }))
  }

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      "bg-bg-secondary", // #F5F5F7
      "p-spacing-lg", // 24px
      className
    )}>
      <Card 
        className="w-full max-w-md"
        variant="default"
      >
        <CardHeader className="space-y-spacing-lg text-center"> {/* 24px */}
          <div className="flex justify-center">
            <VergilLogo size="lg" variant="logo" />
          </div>
          <div className="space-y-spacing-sm"> {/* 8px */}
            <CardTitle className="text-2xl font-bold text-text-primary"> {/* #1D1D1F */}
              Create Account
            </CardTitle>
            <CardDescription className="text-text-secondary"> {/* #6C6C6D */}
              Sign up to get started with your learning journey
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-spacing-md"> {/* 16px */}
            {/* General error message */}
            {error && (
              <div className="p-spacing-sm bg-bg-errorLight border border-border-error rounded-md"> {/* 8px, #FEF2F2, #FCA5A5 */}
                <p className="text-sm text-text-error"> {/* #E51C23 */}
                  {error}
                </p>
              </div>
            )}

            {/* Name field */}
            <div className="space-y-spacing-xs"> {/* 4px */}
              <Label 
                htmlFor="name"
                required
                error={fieldErrors.name}
              >
                Full Name
              </Label>
              <div className="relative">
                <User className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none z-10 transition-opacity",
                  formData.name ? "opacity-0" : "text-text-tertiary"
                )} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={!!fieldErrors.name}
                  disabled={isLoading}
                  className="pl-12"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-spacing-xs"> {/* 4px */}
              <Label 
                htmlFor="email"
                required
                error={fieldErrors.email}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none z-10 transition-opacity",
                  formData.email ? "opacity-0" : "text-text-tertiary"
                )} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={!!fieldErrors.email}
                  disabled={isLoading}
                  className="pl-12 pr-4"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-spacing-xs"> {/* 4px */}
              <Label 
                htmlFor="password"
                required
                error={fieldErrors.password}
                helpText="Must be at least 8 characters with uppercase, lowercase, and numbers"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none z-10 transition-opacity",
                  formData.password ? "opacity-0" : "text-text-tertiary"
                )} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={!!fieldErrors.password}
                  disabled={isLoading}
                  className="pl-12 pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-emphasis rounded transition-colors z-10"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-tertiary" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="text-sm text-text-secondary"> {/* #6C6C6D */}
              By signing up, you agree to our{" "}
              <a href="#" className="text-text-brand hover:text-text-brandLight transition-colors"> {/* #7B00FF, #9933FF */}
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-text-brand hover:text-text-brandLight transition-colors"> {/* #7B00FF, #9933FF */}
                Privacy Policy
              </a>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-spacing-md"> {/* 16px */}
            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm text-text-secondary"> {/* #6C6C6D */}
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-text-brand hover:text-text-brandLight font-medium transition-colors" /* #7B00FF, #9933FF */
                disabled={isLoading}
              >
                Sign in
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}