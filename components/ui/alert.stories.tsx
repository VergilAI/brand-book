import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle, CheckCircle, Info, XCircle, Brain, Zap, Shield } from 'lucide-react';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Alert component for displaying important messages. Supports different variants and can include icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'default | destructive' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Default Alert</AlertTitle>
      <AlertDescription>
        This is a default alert message. Use it to display important information to users.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This alert includes an icon to help convey the message type.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again or contact support if the problem persists.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          A new version of the application is available. Refresh to update.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your subscription will expire in 5 days. Please renew to continue using all features.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to connect to the server. Please check your internet connection.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const AISystemAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert>
        <Brain className="h-4 w-4 text-cosmic-purple" />
        <AlertTitle>AI Model Updated</AlertTitle>
        <AlertDescription>
          The AI model has been updated to version 2.0 with improved accuracy and faster response times.
        </AlertDescription>
      </Alert>
      
      <Alert>
        <Zap className="h-4 w-4 text-electric-violet" />
        <AlertTitle>Training Complete</AlertTitle>
        <AlertDescription>
          Your custom model has finished training. Accuracy: 94.2%, Loss: 0.0231
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>GPU Memory Limit Reached</AlertTitle>
        <AlertDescription>
          The model requires more GPU memory than available. Consider using a smaller batch size or model.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI-themed alerts for model training, system updates, and resource management.',
      },
    },
  },
};

export const SecurityAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert>
        <Shield className="h-4 w-4 text-green-600" />
        <AlertTitle>Security Update Applied</AlertTitle>
        <AlertDescription>
          All security patches have been successfully applied. Your system is up to date.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertTitle>Suspicious Activity Detected</AlertTitle>
        <AlertDescription>
          We detected unusual login attempts from an unrecognized location. Please verify your recent activity.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Security-related alerts for compliance and safety notifications.',
      },
    },
  },
};

export const ComplexAlert: Story = {
  render: () => (
    <Alert className="max-w-2xl">
      <Info className="h-4 w-4" />
      <AlertTitle>System Maintenance Scheduled</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          We will be performing system maintenance on Saturday, March 15th from 2:00 AM to 4:00 AM EST.
        </p>
        <p className="font-semibold mb-1">What to expect:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>The platform will be temporarily unavailable</li>
          <li>All running training jobs will be paused and resumed automatically</li>
          <li>API services will return 503 status codes during maintenance</li>
        </ul>
        <p className="mt-2">
          We apologize for any inconvenience. For questions, contact support@vergil.ai
        </p>
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex alert with formatted content including lists and multiple paragraphs.',
      },
    },
  },
};