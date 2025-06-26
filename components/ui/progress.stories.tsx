import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { useState, useEffect } from 'react';
import { Button } from './button';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Progress bar component for showing completion status. Built on Radix UI Progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const ProgressStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Not started</span>
          <span>0%</span>
        </div>
        <Progress value={0} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>In progress</span>
          <span>45%</span>
        </div>
        <Progress value={45} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Almost there</span>
          <span>80%</span>
        </div>
        <Progress value={80} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Complete</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
      if (isRunning && progress < 100) {
        const timer = setTimeout(() => {
          setProgress(prev => Math.min(prev + 2, 100));
        }, 100);
        return () => clearTimeout(timer);
      } else if (progress >= 100) {
        setIsRunning(false);
      }
    }, [progress, isRunning]);

    const handleStart = () => {
      setProgress(0);
      setIsRunning(true);
    };

    return (
      <div className="space-y-4 w-full max-w-md">
        <Progress value={progress} />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{progress}% complete</span>
          <Button 
            onClick={handleStart} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? 'Running...' : 'Start'}
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated progress bar that fills over time.',
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <span className="text-sm font-medium">Default</span>
        <Progress value={70} />
      </div>
      
      <div className="space-y-2">
        <span className="text-sm font-medium">Thicker</span>
        <Progress value={70} className="h-4" />
      </div>
      
      <div className="space-y-2">
        <span className="text-sm font-medium">Cosmic Purple</span>
        <Progress 
          value={70} 
          className="h-3 [&>[data-slot='progress-indicator']]:bg-cosmic-purple" 
        />
      </div>
      
      <div className="space-y-2">
        <span className="text-sm font-medium">Gradient</span>
        <Progress 
          value={70} 
          className="h-3 [&>[data-slot='progress-indicator']]:bg-gradient-to-r [&>[data-slot='progress-indicator']]:from-cosmic-purple [&>[data-slot='progress-indicator']]:to-electric-violet" 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars with custom styling including different heights and colors.',
      },
    },
  },
};

export const AITrainingProgress: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Model Training Progress</h4>
          <span className="text-sm text-muted-foreground">Epoch 7/10</span>
        </div>
        <Progress value={70} />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Time Elapsed:</span>
            <span className="ml-2 font-medium">2h 34m</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time Remaining:</span>
            <span className="ml-2 font-medium">~1h 06m</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Data Processing</h4>
          <span className="text-sm text-muted-foreground">45,231 / 100,000</span>
        </div>
        <Progress value={45} className="[&>[data-slot='progress-indicator']]:bg-phosphor-cyan" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">GPU Memory Usage</h4>
          <span className="text-sm text-muted-foreground">11.2 / 16 GB</span>
        </div>
        <Progress 
          value={70} 
          className="[&>[data-slot='progress-indicator']]:bg-destructive" 
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI training and resource usage progress indicators.',
      },
    },
  },
};

export const CourseProgress: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-lg">
      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Introduction to Machine Learning</h4>
          <span className="text-sm font-medium">78%</span>
        </div>
        <Progress value={78} />
        <p className="text-sm text-muted-foreground">
          12 of 15 lessons completed
        </p>
      </div>
      
      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Deep Learning Fundamentals</h4>
          <span className="text-sm font-medium">45%</span>
        </div>
        <Progress value={45} />
        <p className="text-sm text-muted-foreground">
          9 of 20 lessons completed
        </p>
      </div>
      
      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Natural Language Processing</h4>
          <span className="text-sm font-medium">100%</span>
        </div>
        <Progress value={100} className="[&>[data-slot='progress-indicator']]:bg-green-600" />
        <p className="text-sm text-green-600 font-medium">
          Course completed! 🎉
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Course completion progress as used in Vergil Learn LMS.',
      },
    },
  },
};