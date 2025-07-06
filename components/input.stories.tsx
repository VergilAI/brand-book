import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { Search, Mail, Lock, User, Brain, Check, AlertCircle } from 'lucide-react';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern input component built with semantic design tokens. Features smooth transitions, Apple-inspired design, and comprehensive size/state variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size variant',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Input variant for different states',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state (overrides variant)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    success: {
      control: 'boolean',
      description: 'Success state (overrides variant)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
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
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label>Small Input</Label>
        <Input size="sm" placeholder="Small size input" />
      </div>
      <div className="space-y-1.5">
        <Label>Medium Input (Default)</Label>
        <Input size="md" placeholder="Medium size input" />
      </div>
      <div className="space-y-1.5">
        <Label>Large Input</Label>
        <Input size="lg" placeholder="Large size input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input components in different sizes using semantic spacing tokens.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label>Default Variant</Label>
        <Input placeholder="Default input" />
      </div>
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-text-error" />
          Error Variant
        </Label>
        <Input variant="error" placeholder="Error state input" />
      </div>
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <Check className="h-4 w-4 text-text-success" />
          Success Variant
        </Label>
        <Input variant="success" placeholder="Success state input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input variants for various states using semantic color tokens.',
      },
    },
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
        <Input placeholder="Default input with hover effect" />
      </div>
      <div className="space-y-1.5">
        <Label>Focused State</Label>
        <Input placeholder="Click to see focus state with shadow" />
      </div>
      <div className="space-y-1.5">
        <Label>Disabled State</Label>
        <Input placeholder="Disabled input" disabled />
      </div>
      <div className="space-y-1.5">
        <Label>Error State</Label>
        <Input error placeholder="Error input with red styling" />
      </div>
      <div className="space-y-1.5">
        <Label>Success State</Label>
        <Input success placeholder="Success input with green styling" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All input states with semantic token styling. Hover over inputs to see smooth transitions.',
      },
    },
  },
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

export const SemanticTokenShowcase: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Semantic Token System</h3>
        <p className="text-text-secondary">
          All inputs use semantic design tokens for colors, spacing, typography, and interactions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Primary Text Color</Label>
          <Input placeholder="Uses text-primary token" />
        </div>
        <div className="space-y-1.5">
          <Label>Secondary Text (Placeholder)</Label>
          <Input placeholder="Uses text-secondary token" />
        </div>
        <div className="space-y-1.5">
          <Label>Emphasis Background</Label>
          <Input placeholder="Uses bg-emphasisInput token" />
        </div>
        <div className="space-y-1.5">
          <Label>Border Colors</Label>
          <Input placeholder="Uses border-default token" />
        </div>
        <div className="space-y-1.5">
          <Label>Focus Shadow</Label>
          <Input placeholder="Uses shadow-focus token" />
        </div>
        <div className="space-y-1.5">
          <Label>Transition Timing</Label>
          <Input placeholder="Uses duration-normal token" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium text-text-emphasis">Size Scale with Spacing Tokens</h4>
        <div className="space-y-2">
          <Input size="sm" placeholder="Small: px-sm py-xs" />
          <Input size="md" placeholder="Medium: px-md py-sm" />
          <Input size="lg" placeholder="Large: px-lg py-md" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of the semantic token system used in the Input component.',
      },
    },
  },
};