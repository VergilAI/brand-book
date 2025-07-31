import type { Meta, StoryObj } from '@storybook/react'
import { LoginScreen } from './login-screen'

const meta = {
  title: 'Components/Auth/LoginScreen',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The LoginScreen component provides a complete authentication interface following Vergil's brand guidelines.

## Features
- Clean, minimal design with proper spacing and typography
- Email and password validation
- Show/hide password toggle
- Loading states
- Error handling
- Links to signup and forgot password
- Fully accessible with keyboard navigation

## Design Principles
- Desktop: 36px button height for efficiency
- Mobile: 48px button height for touch targets
- Uses semantic color tokens throughout
- Follows Vergil's spacing system (4px, 8px, 16px, 24px)
- Vergil purple (#7B00FF) for primary actions
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Login submitted:', data)
    },
    onSignupClick: () => {
      console.log('Navigate to signup')
    },
    onForgotPasswordClick: () => {
      console.log('Navigate to forgot password')
    }
  }
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
}

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "Invalid email or password. Please try again."
  }
}

export const FilledForm: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    // Simulate filled form for visual testing
    const emailInput = canvasElement.querySelector('#email') as HTMLInputElement
    const passwordInput = canvasElement.querySelector('#password') as HTMLInputElement
    
    if (emailInput) {
      emailInput.value = 'user@example.com'
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    if (passwordInput) {
      passwordInput.value = 'password123'
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}

export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
}

export const TabletView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
}