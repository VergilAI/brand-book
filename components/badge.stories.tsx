import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { CheckCircle, AlertCircle, XCircle, Info, Sparkles, TrendingUp, Users, Zap, Award, Clock } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern badge component using semantic token system. Features smooth animations, multiple variants, sizes, and styles with optional icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'brand'],
      description: 'Semantic color variant',
      table: {
        type: { summary: 'default | success | warning | error | info | brand' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    style: {
      control: 'select',
      options: ['solid', 'outline', 'subtle'],
      description: 'Visual style',
      table: {
        type: { summary: 'solid | outline | subtle' },
        defaultValue: { summary: 'solid' },
      },
    },
    icon: {
      control: false,
      description: 'Lucide icon component',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Icon position',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    pulse: {
      control: 'boolean',
      description: 'Enable pulse animation',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Make badge interactive (adds hover/click effects)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Solid Style</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="success" icon={CheckCircle}>Success</Badge>
          <Badge variant="warning" icon={AlertCircle}>Warning</Badge>
          <Badge variant="error" icon={XCircle}>Error</Badge>
          <Badge variant="info" icon={Info}>Info</Badge>
          <Badge variant="brand" icon={Sparkles}>Brand</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Outline Style</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default" style="outline">Default</Badge>
          <Badge variant="success" style="outline" icon={CheckCircle}>Success</Badge>
          <Badge variant="warning" style="outline" icon={AlertCircle}>Warning</Badge>
          <Badge variant="error" style="outline" icon={XCircle}>Error</Badge>
          <Badge variant="info" style="outline" icon={Info}>Info</Badge>
          <Badge variant="brand" style="outline" icon={Sparkles}>Brand</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Subtle Style</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default" style="subtle">Default</Badge>
          <Badge variant="success" style="subtle" icon={CheckCircle}>Success</Badge>
          <Badge variant="warning" style="subtle" icon={AlertCircle}>Warning</Badge>
          <Badge variant="error" style="subtle" icon={XCircle}>Error</Badge>
          <Badge variant="info" style="subtle" icon={Info}>Info</Badge>
          <Badge variant="brand" style="subtle" icon={Sparkles}>Brand</Badge>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm" variant="brand" icon={Sparkles}>Small</Badge>
      <Badge size="md" variant="brand" icon={Sparkles}>Medium</Badge>
      <Badge size="lg" variant="brand" icon={Sparkles}>Large</Badge>
    </div>
  ),
};

export const WithAnimations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Badge variant="error" pulse icon={AlertCircle}>System Alert</Badge>
        <Badge variant="warning" pulse icon={Clock}>Processing</Badge>
        <Badge variant="brand" pulse icon={Zap}>Live</Badge>
      </div>
      <div className="flex gap-4">
        <Badge variant="success" interactive icon={CheckCircle}>Click Me</Badge>
        <Badge variant="info" interactive icon={Info}>Hover Me</Badge>
        <Badge variant="brand" interactive icon={Award} onClick={() => alert('Badge clicked!')}>
          Interactive
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges with pulse animations and interactive states.',
      },
    },
  },
};

export const IconPositions: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Badge icon={Users} iconPosition="left">Icon Left</Badge>
        <Badge icon={Users} iconPosition="right">Icon Right</Badge>
      </div>
      <div className="flex gap-4">
        <Badge variant="brand" icon={TrendingUp} iconPosition="left" size="lg">
          Growth Rate
        </Badge>
        <Badge variant="success" icon={Award} iconPosition="right" size="lg">
          Achievement Unlocked
        </Badge>
      </div>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Course Status</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" icon={CheckCircle}>Published</Badge>
          <Badge variant="warning" icon={AlertCircle}>Draft</Badge>
          <Badge variant="error" icon={XCircle}>Archived</Badge>
          <Badge variant="info" icon={Clock}>Scheduled</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">User Levels</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" size="sm">Beginner</Badge>
          <Badge variant="info" size="sm">Intermediate</Badge>
          <Badge variant="brand" size="sm">Advanced</Badge>
          <Badge variant="brand" size="sm" icon={Award}>Expert</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-3">System Status</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" pulse icon={CheckCircle}>Operational</Badge>
          <Badge variant="warning" pulse icon={AlertCircle}>Degraded</Badge>
          <Badge variant="error" pulse icon={XCircle}>Outage</Badge>
          <Badge variant="info" icon={Info}>Maintenance</Badge>
        </div>
      </div>
    </div>
  ),
};

export const ComplianceBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="default" style="outline" size="sm">SOC 2 Type II</Badge>
        <Badge variant="default" style="outline" size="sm">GDPR</Badge>
        <Badge variant="default" style="outline" size="sm">CCPA</Badge>
        <Badge variant="default" style="outline" size="sm">HIPAA</Badge>
      </div>
      <div className="text-xs text-text-secondary">
        Used in Vergil Learn footer for compliance certifications
      </div>
    </div>
  ),
};

export const AIModelBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="brand" icon={Sparkles}>GPT-4</Badge>
        <Badge variant="brand" icon={Sparkles}>Claude 3</Badge>
        <Badge variant="info" icon={Zap}>Gemini Pro</Badge>
        <Badge variant="default">LLaMA 2</Badge>
        <Badge variant="default">Mistral</Badge>
        <Badge variant="default" style="outline">Custom Model</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" size="sm" icon={CheckCircle}>Model Verified</Badge>
        <Badge variant="warning" size="sm" icon={AlertCircle}>Training</Badge>
        <Badge variant="info" size="sm" pulse icon={Zap}>Processing</Badge>
      </div>
    </div>
  ),
};

export const InteractiveBadges: Story = {
  render: () => {
    const handleClick = (label: string) => {
      alert(`${label} badge clicked!`);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="brand" 
            interactive 
            icon={Sparkles}
            onClick={() => handleClick('Filter')}
          >
            Filter by AI
          </Badge>
          <Badge 
            variant="success" 
            interactive 
            icon={CheckCircle}
            onClick={() => handleClick('Active')}
          >
            Active Only
          </Badge>
          <Badge 
            variant="info" 
            interactive 
            icon={Users}
            onClick={() => handleClick('Team')}
          >
            Team Members
          </Badge>
        </div>
        <p className="text-sm text-text-secondary">
          Click any badge to see the interaction
        </p>
      </div>
    );
  },
};