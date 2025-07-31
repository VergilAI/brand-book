import type { Meta, StoryObj } from '@storybook/react'
import { SignupScreen } from './signup-screen'

const meta = {
  title: 'Components/Auth/SignupScreen',
  component: SignupScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The SignupScreen component provides a complete registration interface following Vergil's brand guidelines.

## Features
- First name and last name validation
- Email validation
- Strong password requirements (8+ chars, uppercase, lowercase, numbers)
- Show/hide password toggle
- Loading states
- Error handling
- Terms of service and privacy policy links
- Link back to login
- Fully accessible with keyboard navigation

## Design Principles
- Desktop: 36px button height for efficiency
- Mobile: 48px button height for touch targets
- Uses semantic color tokens throughout
- Follows Vergil's spacing system (4px, 8px, 16px, 24px)
- Vergil purple (#7B00FF) for primary actions
- Two-column layout for name fields to save vertical space

## Validation Rules
- **Names**: At least 2 characters, letters only (with spaces, hyphens, apostrophes)
- **Email**: Valid email format
- **Password**: 8+ characters with uppercase, lowercase, and numbers
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Signup submitted:', data)
    },
    onLoginClick: () => {
      console.log('Navigate to login')
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
    error: "An account with this email already exists."
  }
}

export const FilledForm: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    // Simulate filled form for visual testing
    const firstNameInput = canvasElement.querySelector('#firstName') as HTMLInputElement
    const lastNameInput = canvasElement.querySelector('#lastName') as HTMLInputElement
    const emailInput = canvasElement.querySelector('#email') as HTMLInputElement
    const passwordInput = canvasElement.querySelector('#password') as HTMLInputElement
    
    if (firstNameInput) {
      firstNameInput.value = 'John'
      firstNameInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    if (lastNameInput) {
      lastNameInput.value = 'Doe'
      lastNameInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    if (emailInput) {
      emailInput.value = 'john.doe@example.com'
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    if (passwordInput) {
      passwordInput.value = 'SecurePass123'
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

export const ValidationErrors: Story = {
  name: 'With Validation Errors',
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    // Trigger validation by submitting empty form
    const form = canvasElement.querySelector('form') as HTMLFormElement
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
      submitButton?.click()
    }
  }
}