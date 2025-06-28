import type { Meta, StoryObj } from '@storybook/react'
import { CheckingIndicator } from './checking-indicator'

const meta: Meta<typeof CheckingIndicator> = {
  title: 'UI/CheckingIndicator',
  component: CheckingIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable indicator component for showing loading, checking, success, or error states with animated icons.'
      }
    }
  },
  argTypes: {
    message: {
      description: 'The message to display'
    },
    type: {
      description: 'The type of indicator which affects styling and default icon'
    },
    icon: {
      description: 'Override the default icon for the type'
    }
  }
}

export default meta
type Story = StoryObj<typeof CheckingIndicator>

export const Checking: Story = {
  args: {
    message: "Checking match...",
    type: 'checking'
  }
}

export const Success: Story = {
  args: {
    message: "Match found!",
    type: 'success'
  }
}

export const Error: Story = {
  args: {
    message: "No match found",
    type: 'error'
  }
}

export const Loading: Story = {
  args: {
    message: "Loading data...",
    type: 'loading'
  }
}

export const CustomIcon: Story = {
  args: {
    message: "Processing answer...",
    type: 'checking',
    icon: 'clock'
  }
}

export const GameChecking: Story = {
  args: {
    message: "Checking answer...",
    type: 'checking'
  }
}

export const AnswerCorrect: Story = {
  args: {
    message: "Correct answer!",
    type: 'success'
  }
}

export const AnswerIncorrect: Story = {
  args: {
    message: "Try again",
    type: 'error'
  }
}