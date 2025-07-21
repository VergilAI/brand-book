import type { Meta, StoryObj } from '@storybook/react'
import { ProgressNode } from './progress-node'

const meta = {
  title: 'LMS/ProgressNode',
  component: ProgressNode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular progress indicator node used in knowledge graphs. Shows progress percentage with color-coded states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
    size: {
      control: { type: 'number', min: 20, max: 100, step: 5 },
      description: 'Node size in pixels',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ProgressNode>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    progress: 75,
    size: 48,
    title: 'Knowledge Point',
  },
}

export const NotStarted: Story = {
  args: {
    progress: 0,
    size: 48,
    title: 'Not Started',
  },
}

export const InProgress: Story = {
  args: {
    progress: 45,
    size: 48,
    title: 'In Progress',
  },
}

export const NearlyComplete: Story = {
  args: {
    progress: 85,
    size: 48,
    title: 'Nearly Complete',
  },
}

export const Completed: Story = {
  args: {
    progress: 100,
    size: 48,
    title: 'Completed',
  },
}

export const Small: Story = {
  args: {
    progress: 60,
    size: 32,
    title: 'Small Node',
  },
}

export const Large: Story = {
  args: {
    progress: 60,
    size: 64,
    title: 'Large Node',
  },
}

export const WithLabel: Story = {
  args: {
    progress: 75,
    size: 48,
    title: 'Machine Learning',
    showLabel: true,
  },
}

export const WithLongLabel: Story = {
  args: {
    progress: 50,
    size: 48,
    title: 'Advanced Deep Learning Techniques',
    showLabel: true,
  },
}

export const Interactive: Story = {
  args: {
    progress: 30,
    size: 48,
    title: 'Click Me',
    className: 'cursor-pointer hover:scale-110 transition-transform',
  },
}

export const Selected: Story = {
  args: {
    progress: 65,
    size: 48,
    title: 'Selected Node',
    className: 'ring-2 ring-primary scale-110',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="text-center">
        <ProgressNode progress={0} size={48} title="Not Started" />
        <p className="text-sm mt-2">0%</p>
      </div>
      <div className="text-center">
        <ProgressNode progress={25} size={48} title="Beginning" />
        <p className="text-sm mt-2">25%</p>
      </div>
      <div className="text-center">
        <ProgressNode progress={50} size={48} title="Halfway" />
        <p className="text-sm mt-2">50%</p>
      </div>
      <div className="text-center">
        <ProgressNode progress={75} size={48} title="Advanced" />
        <p className="text-sm mt-2">75%</p>
      </div>
      <div className="text-center">
        <ProgressNode progress={100} size={48} title="Mastered" />
        <p className="text-sm mt-2">100%</p>
      </div>
    </div>
  ),
}

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0)
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0
          return prev + 5
        })
      }, 100)
      
      return () => clearInterval(interval)
    }, [])
    
    return (
      <div className="text-center">
        <ProgressNode progress={progress} size={64} title="Animating" />
        <p className="text-sm mt-2">{progress}%</p>
      </div>
    )
  },
}