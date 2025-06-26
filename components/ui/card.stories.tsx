import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Brain, TrendingUp, Users, Zap } from 'lucide-react';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Unified card system with multiple variants. Replaces FeatureCard, ProblemCard, and MetricCard components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'interactive', 'neural', 'feature', 'metric', 'problem', 'destructive', 'gradient', 'outlined'],
      description: 'Card variant',
      table: {
        type: { summary: 'default | interactive | neural | feature | metric | problem | destructive | gradient | outlined' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Card size',
      table: {
        type: { summary: 'default | sm | lg' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>This is a basic card with default styling.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here. It can contain any type of content.</p>
        </CardContent>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Basic card with shadow</p>
        </CardContent>
      </Card>
      
      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Hover for effects</p>
        </CardContent>
      </Card>
      
      <Card variant="neural">
        <CardHeader>
          <CardTitle>Neural</CardTitle>
        </CardHeader>
        <CardContent>
          <p>AI/ML themed gradient</p>
        </CardContent>
      </Card>
      
      <Card variant="feature">
        <CardHeader>
          <CardTitle>Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Lifts on hover</p>
        </CardContent>
      </Card>
      
      <Card variant="metric">
        <CardHeader>
          <CardTitle>Metric</CardTitle>
        </CardHeader>
        <CardContent>
          <p>For data display</p>
        </CardContent>
      </Card>
      
      <Card variant="problem">
        <CardHeader>
          <CardTitle>Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Full height layout</p>
        </CardContent>
      </Card>
      
      <Card variant="destructive">
        <CardHeader>
          <CardTitle>Destructive</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Warning/error state</p>
        </CardContent>
      </Card>
      
      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Gradient</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Consciousness gradient</p>
        </CardContent>
      </Card>
      
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Border emphasis</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FeatureCardExample: Story = {
  render: () => (
    <Card variant="feature" className="max-w-sm">
      <CardHeader>
        <div className="mb-4">
          <div className="inline-flex p-3 rounded-lg bg-cosmic-purple/10">
            <Brain className="h-6 w-6 text-cosmic-purple" />
          </div>
        </div>
        <CardTitle>AI-Powered Learning</CardTitle>
        <CardDescription>
          Adaptive algorithms that understand your learning style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Our AI continuously adapts to your progress, ensuring optimal learning paths tailored specifically to you.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="px-0">
          Learn more →
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Feature card variant replacing the old FeatureCard component.',
      },
    },
  },
};

export const MetricCardExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-cosmic-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,231</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">↑ 20.1%</span> from last month
          </div>
        </CardContent>
      </Card>
      
      <Card variant="metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-electric-violet" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89.7%</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">↑ 4.3%</span> from last week
          </div>
        </CardContent>
      </Card>
      
      <Card variant="metric">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
          <Zap className="h-4 w-4 text-phosphor-cyan" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24m</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-red-600">↓ 3m</span> per session
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Metric card variant replacing the old MetricCard component.',
      },
    },
  },
};

export const ComplexCard: Story = {
  render: () => (
    <Card variant="interactive" className="max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Neural Network Training</CardTitle>
          <Badge variant="secondary">In Progress</Badge>
        </div>
        <CardDescription>
          Deep learning model optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Training Progress</span>
            <span>78%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-cosmic-purple h-2 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Accuracy</p>
            <p className="font-semibold">94.2%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Loss</p>
            <p className="font-semibold">0.0231</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">Pause</Button>
        <Button size="sm">View Details</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex card with multiple elements and interactions.',
      },
    },
  },
};

export const CardSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card size="sm">
        <CardContent className="pt-4">
          <p>Small card with reduced padding</p>
        </CardContent>
      </Card>
      
      <Card size="default">
        <CardContent className="pt-6">
          <p>Default card with standard padding</p>
        </CardContent>
      </Card>
      
      <Card size="lg">
        <CardContent className="pt-8">
          <p>Large card with increased padding</p>
        </CardContent>
      </Card>
    </div>
  ),
};