import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { Search, Mail, Lock, User, Brain } from 'lucide-react';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Basic input field component with consistent styling and focus states. Supports all native input types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'file'],
      description: 'Input type',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label htmlFor="text">Text Input</Label>
        <Input type="text" id="text" placeholder="Enter text" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email Input</Label>
        <Input type="email" id="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password Input</Label>
        <Input type="password" id="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="number">Number Input</Label>
        <Input type="number" id="number" placeholder="0" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="date">Date Input</Label>
        <Input type="date" id="date" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="file">File Input</Label>
        <Input type="file" id="file" />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-8" />
      </div>
      <div className="relative">
        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="email" placeholder="Email address" className="pl-8" />
      </div>
      <div className="relative">
        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="password" placeholder="Password" className="pl-8" />
      </div>
      <div className="relative">
        <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Username" className="pl-8" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input fields with icon prefixes for better visual context.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label>Default State</Label>
        <Input placeholder="Default input" />
      </div>
      <div className="space-y-1.5">
        <Label>Focused State</Label>
        <Input placeholder="Click to see focus state" />
      </div>
      <div className="space-y-1.5">
        <Label>Disabled State</Label>
        <Input placeholder="Disabled input" disabled />
      </div>
      <div className="space-y-1.5">
        <Label>Invalid State</Label>
        <Input placeholder="Invalid input" aria-invalid="true" />
      </div>
    </div>
  ),
};

export const AIPromptInput: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-lg">
      <div className="space-y-1.5">
        <Label htmlFor="prompt" className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cosmic-purple" />
          AI Prompt
        </Label>
        <Input 
          id="prompt"
          placeholder="Describe what you want to learn..."
          className="h-12 px-4 text-base"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="model-config">Model Configuration</Label>
        <Input 
          id="model-config"
          placeholder="temperature=0.7, max_tokens=1000"
          className="font-mono text-sm"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI-themed input examples for prompt engineering and model configuration.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label htmlFor="fullname">Full Name</Label>
        <Input id="fullname" placeholder="John Doe" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-email">Email Address</Label>
        <Input id="form-email" type="email" placeholder="john@example.com" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-password">Password</Label>
        <Input id="form-password" type="password" placeholder="••••••••" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input id="confirm-password" type="password" placeholder="••••••••" required />
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing typical input field usage.',
      },
    },
  },
};