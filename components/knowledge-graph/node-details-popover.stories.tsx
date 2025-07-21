import type { Meta, StoryObj } from '@storybook/react'
import { NodeDetailsPopover } from './node-details-popover'
import { ProgressNode } from './progress-node'
import { Button } from '@/components/button'

const meta = {
  title: 'LMS/NodeDetailsPopover',
  component: NodeDetailsPopover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popover that displays detailed information about a knowledge graph node, including prerequisites, progress, and available lessons.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-96 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NodeDetailsPopover>

export default meta
type Story = StoryObj<typeof meta>

// Sample knowledge points
const allNodes = [
  {
    id: 'kp-1',
    title: 'ML Definition',
    progress: 100,
    dependencies: [],
  },
  {
    id: 'kp-2',
    title: 'Linear Algebra',
    progress: 85,
    dependencies: [],
  },
  {
    id: 'kp-3',
    title: 'Statistics',
    progress: 70,
    dependencies: [],
  },
  {
    id: 'kp-4',
    title: 'Linear Regression',
    progress: 45,
    dependencies: ['kp-2', 'kp-3'],
    hardDependencies: ['kp-2'],
    dependencyDetails: {
      'kp-2': { type: 'hard' as const, requiredElo: 80 },
      'kp-3': { type: 'soft' as const, requiredElo: 60 },
    },
  },
  {
    id: 'kp-5',
    title: 'Logistic Regression',
    progress: 0,
    dependencies: ['kp-4'],
    hardDependencies: ['kp-4'],
    dependencyDetails: {
      'kp-4': { type: 'hard' as const, requiredElo: 80 },
    },
  },
]

const availableLessons = [
  {
    chapterId: 'ch-1',
    chapterTitle: 'Algorithms',
    lessonId: 'l-1',
    lessonTitle: 'Introduction to Linear Regression',
  },
  {
    chapterId: 'ch-1',
    chapterTitle: 'Algorithms',
    lessonId: 'l-2',
    lessonTitle: 'Advanced Linear Regression',
  },
]

export const Default: Story = {
  args: {
    node: allNodes[3], // Linear Regression
    allNodes: allNodes,
    availableIn: availableLessons,
    children: <ProgressNode progress={45} size={48} title="Linear Regression" />,
  },
}

export const LockedNode: Story = {
  args: {
    node: allNodes[4], // Logistic Regression (locked)
    allNodes: allNodes,
    children: <ProgressNode progress={0} size={48} title="Logistic Regression" />,
  },
}

export const CompletedNode: Story = {
  args: {
    node: allNodes[0], // ML Definition (completed)
    allNodes: allNodes,
    children: <ProgressNode progress={100} size={48} title="ML Definition" />,
  },
}

export const NoPrerequisites: Story = {
  args: {
    node: allNodes[1], // Linear Algebra
    allNodes: allNodes,
    children: <ProgressNode progress={85} size={48} title="Linear Algebra" />,
  },
}

export const WithManyUnlocks: Story = {
  args: {
    node: {
      ...allNodes[2],
      title: 'Core Concept',
    },
    allNodes: [
      ...allNodes,
      {
        id: 'kp-6',
        title: 'Advanced Topic 1',
        progress: 0,
        dependencies: ['kp-3'],
        dependencyDetails: {
          'kp-3': { type: 'hard' as const, requiredElo: 90 },
        },
      },
      {
        id: 'kp-7',
        title: 'Advanced Topic 2',
        progress: 0,
        dependencies: ['kp-3'],
        dependencyDetails: {
          'kp-3': { type: 'soft' as const, requiredElo: 70 },
        },
      },
    ],
    children: <ProgressNode progress={70} size={48} title="Core Concept" />,
  },
}

export const CustomTrigger: Story = {
  args: {
    node: allNodes[3],
    allNodes: allNodes,
    availableIn: availableLessons,
    children: <Button>Click for Details</Button>,
  },
}

export const DifferentSides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16">
      <NodeDetailsPopover
        node={allNodes[3]}
        allNodes={allNodes}
        side="right"
      >
        <Button>Right Side</Button>
      </NodeDetailsPopover>
      
      <NodeDetailsPopover
        node={allNodes[3]}
        allNodes={allNodes}
        side="left"
      >
        <Button>Left Side</Button>
      </NodeDetailsPopover>
      
      <NodeDetailsPopover
        node={allNodes[3]}
        allNodes={allNodes}
        side="top"
      >
        <Button>Top Side</Button>
      </NodeDetailsPopover>
      
      <NodeDetailsPopover
        node={allNodes[3]}
        allNodes={allNodes}
        side="bottom"
      >
        <Button>Bottom Side</Button>
      </NodeDetailsPopover>
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    
    return (
      <div className="text-center">
        <NodeDetailsPopover
          node={allNodes[3]}
          allNodes={allNodes}
          availableIn={availableLessons}
          open={open}
          onOpenChange={setOpen}
          onLessonClick={(lessonId) => {
            alert(`Opening lesson: ${lessonId}`)
            setOpen(false)
          }}
        >
          <ProgressNode 
            progress={45} 
            size={48} 
            title="Linear Regression"
            onClick={() => setOpen(!open)}
            className="cursor-pointer"
          />
        </NodeDetailsPopover>
        <p className="text-sm mt-4">Click the node to toggle popover</p>
      </div>
    )
  },
}