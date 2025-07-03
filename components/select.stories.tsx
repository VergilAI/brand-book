import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown select component built on Radix UI. Provides accessible, customizable select functionality.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="nuxt">Nuxt.js</SelectItem>
          <SelectItem value="svelte">SvelteKit</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a technology" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Backend</SelectLabel>
          <SelectItem value="node">Node.js</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="go">Go</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Database</SelectLabel>
          <SelectItem value="postgres">PostgreSQL</SelectItem>
          <SelectItem value="mysql">MySQL</SelectItem>
          <SelectItem value="mongodb">MongoDB</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select with grouped options and separators for better organization.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Select>
        <SelectTrigger size="sm" className="w-[150px]">
          <SelectValue placeholder="Small select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small1">Small Option 1</SelectItem>
          <SelectItem value="small2">Small Option 2</SelectItem>
        </SelectContent>
      </Select>
      
      <Select>
        <SelectTrigger size="default" className="w-[180px]">
          <SelectValue placeholder="Default select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default1">Default Option 1</SelectItem>
          <SelectItem value="default2">Default Option 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div className="space-y-4">
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select with disabled items" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Available Option</SelectItem>
          <SelectItem value="option2" disabled>Disabled Option</SelectItem>
          <SelectItem value="option3">Another Available</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const AIModelSelector: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label htmlFor="ai-model">AI Model</Label>
        <Select defaultValue="gpt4">
          <SelectTrigger id="ai-model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>OpenAI Models</SelectLabel>
              <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Anthropic Models</SelectLabel>
              <SelectItem value="claude3">Claude 3 Opus</SelectItem>
              <SelectItem value="claude2">Claude 2.1</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Open Source</SelectLabel>
              <SelectItem value="llama2">LLaMA 2</SelectItem>
              <SelectItem value="mistral">Mistral 7B</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="temperature">Temperature</Label>
        <Select defaultValue="0.7">
          <SelectTrigger id="temperature">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0 (Deterministic)</SelectItem>
            <SelectItem value="0.3">0.3 (Focused)</SelectItem>
            <SelectItem value="0.7">0.7 (Balanced)</SelectItem>
            <SelectItem value="1">1.0 (Creative)</SelectItem>
            <SelectItem value="1.5">1.5 (Very Creative)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI model and parameter selection example for Vergil platform.',
      },
    },
  },
};

export const CourseSelector: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="course">Select Course</Label>
      <Select>
        <SelectTrigger id="course">
          <SelectValue placeholder="Choose a course to enroll" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Beginner Courses</SelectLabel>
            <SelectItem value="intro-ai">Introduction to AI</SelectItem>
            <SelectItem value="python-basics">Python Basics</SelectItem>
            <SelectItem value="ml-fundamentals">ML Fundamentals</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Intermediate Courses</SelectLabel>
            <SelectItem value="deep-learning">Deep Learning</SelectItem>
            <SelectItem value="nlp">Natural Language Processing</SelectItem>
            <SelectItem value="computer-vision">Computer Vision</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Advanced Courses</SelectLabel>
            <SelectItem value="transformers">Transformer Architecture</SelectItem>
            <SelectItem value="rl">Reinforcement Learning</SelectItem>
            <SelectItem value="mlops">MLOps & Deployment</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Course selection dropdown as used in Vergil Learn LMS.',
      },
    },
  },
};