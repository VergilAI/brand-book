import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Progress } from './progress'
import { ArrowRight, BookOpen, Clock, TrendingUp, Users, Zap } from 'lucide-react'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component with multiple variants for content presentation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is a basic card with default styling</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">
          Card content goes here. It can contain any React components or HTML elements.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-[800px]">
      <Card variant="default" className="h-[200px]">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard card appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Classic elevated design</p>
        </CardContent>
      </Card>

      <Card variant="interactive" className="h-[200px]">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Hover and click me!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Responds to user interaction</p>
        </CardContent>
      </Card>

      <Card variant="neural" className="h-[200px]">
        <CardHeader>
          <CardTitle>Neural</CardTitle>
          <CardDescription>AI-themed gradient style</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Perfect for AI features</p>
        </CardContent>
      </Card>

      <Card variant="feature" className="h-[200px]">
        <CardHeader>
          <CardTitle>Feature</CardTitle>
          <CardDescription>Hover for elevation effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Great for feature highlights</p>
        </CardContent>
      </Card>

      <Card variant="metric" className="h-[200px]">
        <CardHeader>
          <CardTitle>Metric</CardTitle>
          <CardDescription>Subtle background style</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Ideal for stats and metrics</p>
        </CardContent>
      </Card>

      <Card variant="problem" className="h-[200px]">
        <CardHeader>
          <CardTitle>Problem</CardTitle>
          <CardDescription>Structured content card</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Good for educational content</p>
        </CardContent>
      </Card>

      <Card variant="gradient" className="h-[200px]">
        <CardHeader>
          <CardTitle>Gradient</CardTitle>
          <CardDescription>Bold gradient background</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Eye-catching and vibrant</p>
        </CardContent>
      </Card>

      <Card variant="outlined" className="h-[200px]">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Transparent with border</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Minimal and clean</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-[400px]">
      <Card size="sm">
        <CardContent>
          <p className="text-sm font-medium">Small Card</p>
          <p className="text-xs text-text-secondary">Compact padding for dense layouts</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <p className="text-sm font-medium">Default Card</p>
          <p className="text-xs text-text-secondary">Standard padding for most use cases</p>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardContent>
          <p className="text-sm font-medium">Large Card</p>
          <p className="text-xs text-text-secondary">Spacious padding for prominent content</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const WithoutHeaderFooter: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-[600px]">
      <Card>
        <CardContent className="pt-6">
          <p className="font-medium">Content Only Card</p>
          <p className="text-sm text-text-secondary mt-2">
            Sometimes you just need the content area without header or footer sections.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
          <CardDescription>No content or footer sections</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm">Main content area</p>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-text-secondary">Footer only, no header</span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Title without description</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium mb-4">Hover States</p>
        <div className="grid grid-cols-3 gap-4">
          <Card variant="interactive" className="h-[120px]">
            <CardContent className="pt-6 text-center">
              <p className="text-sm">Hover me!</p>
              <p className="text-xs text-text-secondary mt-1">Scale & shadow effect</p>
            </CardContent>
          </Card>

          <Card variant="feature" className="h-[120px]">
            <CardContent className="pt-6 text-center">
              <p className="text-sm">Feature hover</p>
              <p className="text-xs text-text-secondary mt-1">Elevation effect</p>
            </CardContent>
          </Card>

          <Card variant="gradient" className="h-[120px]">
            <CardContent className="pt-6 text-center">
              <p className="text-sm">Gradient hover</p>
              <p className="text-xs mt-1">Enhanced shadow</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-4">Focus States</p>
        <Card variant="interactive" className="w-[300px]">
          <CardContent className="pt-6">
            <p className="text-sm">Tab to focus this card</p>
            <p className="text-xs text-text-secondary mt-1">Focus ring will appear</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6 max-w-[800px]">
      {/* Course Card */}
      <Card variant="feature" className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Introduction to React</CardTitle>
              <CardDescription>Learn the fundamentals of React development</CardDescription>
            </div>
            <Badge variant="success">Enrolled</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={65} className="h-2" />
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                12 lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                4h 30m
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                1,234 students
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continue Learning</Button>
        </CardFooter>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="metric">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-text-secondary">Total Students</p>
              </div>
              <Users className="h-8 w-8 text-text-tertiary" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="metric">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-text-secondary">Completion Rate</p>
              </div>
              <Zap className="h-8 w-8 text-text-tertiary" />
            </div>
            <Progress value={89} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card variant="metric">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-text-secondary">Average Rating</p>
              </div>
              <div className="text-brand">★★★★★</div>
            </div>
            <p className="mt-4 text-sm text-text-tertiary">Based on 456 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Neural AI Card */}
      <Card variant="neural">
        <CardHeader>
          <CardTitle>AI Learning Assistant</CardTitle>
          <CardDescription>Powered by advanced neural networks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm">Active and ready to help</span>
            </div>
            <p className="text-sm opacity-90">
              Get personalized learning recommendations and instant answers to your questions.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full">
            Start Conversation
          </Button>
        </CardFooter>
      </Card>

      {/* Problem Card */}
      <Card variant="problem">
        <CardHeader>
          <CardTitle>Challenge: Array Manipulation</CardTitle>
          <CardDescription>Difficulty: Medium</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">
              Write a function that removes duplicates from an array while preserving the original order.
            </p>
            <div className="bg-bg-secondary p-3 rounded-md">
              <code className="text-xs">
                removeDuplicates([1, 2, 2, 3, 4, 4, 5]) // [1, 2, 3, 4, 5]
              </code>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Badge variant="default">Arrays</Badge>
          <Button size="sm">
            Solve Challenge
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
}

export const GridLayouts: Story = {
  render: () => (
    <div className="space-y-8 max-w-[1000px]">
      <div>
        <p className="text-sm font-medium mb-4">Feature Grid</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: 'Comprehensive Curriculum', desc: 'Structured learning paths' },
            { icon: Users, title: 'Community Support', desc: 'Learn with peers' },
            { icon: Zap, title: 'Interactive Exercises', desc: 'Practice as you learn' },
          ].map((feature, i) => (
            <Card key={i} variant="feature">
              <CardContent className="pt-6 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-3 text-brand" />
                <p className="font-medium mb-1">{feature.title}</p>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-4">Masonry Layout</p>
        <div className="columns-2 gap-4">
          <Card className="mb-4 break-inside-avoid">
            <CardHeader>
              <CardTitle>Short Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Brief content here</p>
            </CardContent>
          </Card>

          <Card className="mb-4 break-inside-avoid" variant="outlined">
            <CardHeader>
              <CardTitle>Medium Card</CardTitle>
              <CardDescription>With some additional content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This card has more content to demonstrate varying heights in a masonry layout.</p>
              <Button size="sm" className="mt-4">Learn more</Button>
            </CardContent>
          </Card>

          <Card className="mb-4 break-inside-avoid" variant="gradient">
            <CardHeader>
              <CardTitle>Tall Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">Extended content for demonstration:</p>
              <ul className="text-sm space-y-1">
                <li>• Feature one</li>
                <li>• Feature two</li>
                <li>• Feature three</li>
                <li>• Feature four</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">Action</Button>
            </CardFooter>
          </Card>

          <Card className="mb-4 break-inside-avoid" variant="metric">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">42</p>
              <p className="text-sm text-text-secondary">Active now</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
}