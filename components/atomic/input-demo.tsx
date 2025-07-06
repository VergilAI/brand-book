import React, { useState } from 'react'
import { Input } from './input'

export function InputDemo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value === '') {
      setEmailError(false)
      setEmailSuccess(false)
    } else if (emailRegex.test(value)) {
      setEmailError(false)
      setEmailSuccess(true)
    } else {
      setEmailError(true)
      setEmailSuccess(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  return (
    <div className="max-w-md mx-auto p-spacing-xl space-y-spacing-lg">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Sign In
        </h2>
        <p className="text-text-secondary">
          Experience our new spacious input design
        </p>
      </div>

      <form className="space-y-spacing-md">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-text-primary mb-spacing-xs"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            success={emailSuccess}
            aria-describedby="email-hint"
          />
          {emailError && (
            <p id="email-hint" className="mt-spacing-xs text-sm text-text-error">
              Please enter a valid email address
            </p>
          )}
          {emailSuccess && (
            <p id="email-hint" className="mt-spacing-xs text-sm text-text-success">
              Email looks good!
            </p>
          )}
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-text-primary mb-spacing-xs"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="pt-spacing-sm">
          <button
            type="submit"
            className="w-full h-12 px-spacing-lg bg-bg-brand text-text-inverse font-medium rounded-md hover:bg-interactive-primary-hover transition-colors duration-normal"
            onClick={(e) => {
              e.preventDefault()
              console.log('Form submitted:', { email, password })
            }}
          >
            Sign In
          </button>
        </div>
      </form>

      <div className="border-t border-border-default pt-spacing-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-md">
          Input Features
        </h3>
        <ul className="space-y-spacing-sm text-sm text-text-secondary">
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            48px height for comfortable touch targets
          </li>
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            16px font size prevents mobile zoom
          </li>
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            Clear focus states with ring-2 ring-border-focus
          </li>
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            Error and success validation states
          </li>
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            Semantic tokens for consistent theming
          </li>
          <li className="flex items-start">
            <span className="text-text-brand mr-spacing-sm">✓</span>
            Spacious padding for easy interaction
          </li>
        </ul>
      </div>
    </div>
  )
}