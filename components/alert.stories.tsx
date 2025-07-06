import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { useState } from 'react';
import { Brain, Zap, Shield, Sparkles, Activity, Database, Layers } from 'lucide-react';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern alert component with semantic token system. Features subtle animations, variant-specific styling, and optional dismissible functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Alert variant determining color scheme and icon',
      table: {
        type: { summary: 'info | success | warning | error' },
        defaultValue: { summary: 'info' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational alert using semantic info tokens for consistent theming.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your operation completed successfully. The alert uses semantic success tokens.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please review this warning message. Uses semantic warning color tokens.
      </AlertDescription>
    </Alert>
  ),
};

export const Error: Story = {
  render: () => (
    <Alert variant="error">
      <AlertTitle>Error Occurred</AlertTitle>
      <AlertDescription>
        Something went wrong. This alert uses semantic error tokens for visual hierarchy.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert variant="info">
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          Check out our latest AI model improvements in the dashboard.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <AlertTitle>Model Training Complete</AlertTitle>
        <AlertDescription>
          Your model achieved 96.8% accuracy on the validation set.
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTitle>Resource Usage High</AlertTitle>
        <AlertDescription>
          You've used 85% of your monthly GPU hours. Consider upgrading your plan.
        </AlertDescription>
      </Alert>
      
      <Alert variant="error">
        <AlertTitle>Connection Failed</AlertTitle>
        <AlertDescription>
          Unable to connect to the inference server. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'info' as const, title: 'Tip', message: 'Use keyboard shortcuts for faster navigation.' },
      { id: 2, variant: 'success' as const, title: 'Saved', message: 'Your preferences have been updated.' },
      { id: 3, variant: 'warning' as const, title: 'Heads up', message: 'This action cannot be undone.' },
      { id: 4, variant: 'error' as const, title: 'Failed', message: 'Please check your input and try again.' },
    ]);

    return (
      <div className="space-y-4 w-full max-w-xl">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            dismissible
            onDismiss={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
          >
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
        {alerts.length === 0 && (
          <p className="text-center text-[var(--text-secondary)]">
            All alerts dismissed! Refresh to see them again.
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Dismissible alerts with smooth animations and interactive dismiss buttons.',
      },
    },
  },
};

export const AISystemAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert variant="info">
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Brain className="h-4 w-4 inline" />
            Model Architecture Updated
          </span>
        </AlertTitle>
        <AlertDescription>
          New transformer blocks have been added to improve context understanding.
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 inline" />
            Training Completed
          </span>
        </AlertTitle>
        <AlertDescription>
          Model converged after 47 epochs. Final loss: 0.0142, Accuracy: 98.3%
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 inline" />
            High Memory Usage
          </span>
        </AlertTitle>
        <AlertDescription>
          GPU memory at 92%. Consider reducing batch size to prevent OOM errors.
        </AlertDescription>
      </Alert>
      
      <Alert variant="error">
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Database className="h-4 w-4 inline" />
            Dataset Error
          </span>
        </AlertTitle>
        <AlertDescription>
          Corrupted data detected in training batch 1247. Skipping affected samples.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI-themed alerts with custom icons for machine learning workflows.',
      },
    },
  },
};

export const SecurityAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert variant="success" dismissible>
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 inline" />
            Security Scan Complete
          </span>
        </AlertTitle>
        <AlertDescription>
          No vulnerabilities detected. All dependencies are up to date.
        </AlertDescription>
      </Alert>
      
      <Alert variant="error" dismissible>
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 inline" />
            Authentication Failed
          </span>
        </AlertTitle>
        <AlertDescription>
          Invalid API key. Please check your credentials and try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <Alert variant="info" className="max-w-2xl">
      <AlertTitle>
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 inline" />
          New Features in Vergil 3.0
        </span>
      </AlertTitle>
      <AlertDescription>
        <p className="mb-3">
          We're excited to announce the release of Vergil 3.0 with groundbreaking improvements:
        </p>
        <ul className="space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-[var(--text-brand)] mt-0.5">•</span>
            <span><strong>Multi-modal Understanding:</strong> Process text, images, and audio in a single model</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--text-brand)] mt-0.5">•</span>
            <span><strong>70% Faster Inference:</strong> Optimized architecture reduces latency significantly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--text-brand)] mt-0.5">•</span>
            <span><strong>Extended Context:</strong> Support for up to 128K tokens in a single prompt</span>
          </li>
        </ul>
        <p className="mt-3 text-[var(--text-secondary)]">
          <a href="#" className="text-[var(--text-brand)] hover:underline">
            Read the full changelog →
          </a>
        </p>
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex alert with rich content, lists, and semantic typography tokens.',
      },
    },
  },
};

export const LiveNotification: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-xl">
      <Alert variant="info" dismissible>
        <AlertTitle>
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 inline animate-pulse" />
            Live Training Progress
          </span>
        </AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Epoch 12/50</span>
              <span className="text-[var(--text-brand)]">24%</span>
            </div>
            <div className="w-full bg-[var(--bg-emphasis)] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-[var(--gradient-consciousness)] rounded-full transition-all duration-500"
                style={{ width: '24%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Loss: 0.342</span>
              <span>ETA: 2h 14m</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Alert with live progress indicator using semantic tokens and animations.',
      },
    },
  },
};