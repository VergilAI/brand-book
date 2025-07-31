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
        component: 'Progress bar component with semantic token system. Features variants, sizes, animations, and optional labels.',
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
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
      table: {
        defaultValue: { summary: '100' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant of the progress bar',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the progress bar',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label text',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Show percentage value',
      table: {
        defaultValue: { summary: 'false' },
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
  render: (args) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress Variants</h3>
        
        <div className="space-y-2">
          <Progress 
            value={60} 
            variant="default" 
            label="Default Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={75} 
            variant="success" 
            label="Success Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={45} 
            variant="warning" 
            label="Warning Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={30} 
            variant="error" 
            label="Error Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={85} 
            variant="default" 
            label="Primary Progress"
            showPercentage
          />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress Sizes</h3>
        
        <div className="space-y-2">
          <Progress 
            value={70} 
            size="sm" 
            label="Small Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={70} 
            size="md" 
            label="Medium Progress"
            showPercentage
          />
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={70} 
            size="lg" 
            label="Large Progress"
            showPercentage
          />
        </div>
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
        <Progress 
          value={progress} 
          variant="default"
          size="lg"
          label="Loading Progress"
          showPercentage
        />
        <div className="flex justify-center">
          <Button 
            onClick={handleStart} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? 'Running...' : 'Start Animation'}
          </Button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated progress bar with shimmer effect that fills over time.',
      },
    },
  },
};

export const WithoutAnimation: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Static Progress (No Animation)</h3>
        
        <Progress 
          value={50} 
          variant="default"
          label="Static Progress"
          showPercentage
        />
        
        <Progress 
          value={75} 
          variant="default"
          label="No Hover Effects"
          showPercentage
        />
      </div>
    </div>
  ),
};

export const AITrainingProgress: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="p-6 bg-bg-secondary rounded-lg space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-lg">Model Training</h4>
          <span className="text-sm text-text-secondary">Epoch 7/10</span>
        </div>
        
        <Progress 
          value={70} 
          variant="default"
          size="lg"
          label="Training Progress"
          showPercentage
        />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-tertiary">Time Elapsed:</span>
            <span className="ml-2 font-medium text-text-primary">2h 34m</span>
          </div>
          <div>
            <span className="text-text-tertiary">Time Remaining:</span>
            <span className="ml-2 font-medium text-text-primary">~1h 06m</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-bg-secondary rounded-lg space-y-4">
        <Progress 
          value={45} 
          variant="success"
          label="Data Processing"
          showPercentage
        />
        <p className="text-sm text-text-secondary">45,231 / 100,000 samples</p>
      </div>
      
      <div className="p-6 bg-bg-secondary rounded-lg space-y-4">
        <Progress 
          value={88} 
          variant="warning"
          label="GPU Memory Usage"
          showPercentage
        />
        <p className="text-sm text-text-warning">14.1 / 16 GB</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'AI training and resource usage progress indicators with semantic colors.',
      },
    },
  },
};

export const CourseProgress: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-lg">
      <div className="p-4 border border-border-primary rounded-lg space-y-3 bg-bg-primary">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Introduction to Machine Learning</h4>
          <span className="text-sm font-medium text-text-brand">78%</span>
        </div>
        <Progress value={78} variant="default" showPercentage={false} />
        <p className="text-sm text-text-secondary">
          12 of 15 lessons completed
        </p>
      </div>
      
      <div className="p-4 border border-border-primary rounded-lg space-y-3 bg-bg-primary">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Deep Learning Fundamentals</h4>
          <span className="text-sm font-medium text-text-warning">45%</span>
        </div>
        <Progress value={45} variant="warning" showPercentage={false} />
        <p className="text-sm text-text-secondary">
          9 of 20 lessons completed
        </p>
      </div>
      
      <div className="p-4 border border-border-primary rounded-lg space-y-3 bg-bg-primary">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Natural Language Processing</h4>
          <span className="text-sm font-medium text-text-success">100%</span>
        </div>
        <Progress value={100} variant="success" showPercentage={false} />
        <p className="text-sm text-text-success font-medium">
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

export const CustomProgress: Story = {
  render: () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
      const uploadTimer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 10;
        });
      }, 500);

      const downloadTimer = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 5;
        });
      }, 700);

      return () => {
        clearInterval(uploadTimer);
        clearInterval(downloadTimer);
      };
    }, []);

    return (
      <div className="space-y-6 w-full max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">File Transfer</h3>
          
          <Progress 
            value={Math.min(uploadProgress, 100)} 
            variant="default"
            label="Upload"
            showPercentage
          />
          
          <Progress 
            value={Math.min(downloadProgress, 100)} 
            variant="success"
            label="Download"
            showPercentage
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom progress bars simulating file upload/download with real-time updates.',
      },
    },
  },
};

export const ProgressStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress States</h3>
        
        <Progress 
          value={0} 
          label="Not Started"
          showPercentage
        />
        
        <Progress 
          value={25} 
          variant="error"
          label="Critical - Action Required"
          showPercentage
        />
        
        <Progress 
          value={50} 
          variant="warning"
          label="In Progress - Attention"
          showPercentage
        />
        
        <Progress 
          value={75} 
          variant="default"
          label="Good Progress"
          showPercentage
        />
        
        <Progress 
          value={100} 
          variant="success"
          label="Completed Successfully"
          showPercentage
        />
      </div>
    </div>
  ),
};