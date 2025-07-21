import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { 
  ContextWindow, 
  ContextWindowTrigger, 
  ContextWindowProvider, 
  ContextWindowLayout 
} from './index'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Progress } from '@/components/progress'
import { Badge } from '@/components/badge'
import { TreeKnowledgeGraph } from '@/components/knowledge-graph/tree-knowledge-graph'
import { KnowledgeTreeCard } from '@/components/knowledge-tree-card'
import { KnowledgeGraphPreview } from '@/components/knowledge-graph/knowledge-graph-preview'
import { JourneyProvider } from '@/components/knowledge-graph/journey-context'
import { useContextWindow } from './index'

const meta = {
  title: 'Components/ContextWindow',
  component: ContextWindow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A sliding panel that provides contextual information and actions. Used for displaying supplementary content without leaving the main view.',
      },
    },
  },
  decorators: [
    (Story) => (
      <JourneyProvider>
        <ContextWindowProvider>
          <ContextWindowLayout className="min-h-screen bg-gray-50">
            <Story />
          </ContextWindowLayout>
        </ContextWindowProvider>
      </JourneyProvider>
    ),
  ],
} satisfies Meta<typeof ContextWindow>

export default meta
type Story = StoryObj<typeof meta>

// Helper component for main content
const MainContent = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Main Application Content</h1>
    <p className="text-gray-600 mb-6">
      This is the main content area. Click the toggle button on the right to open the context window.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Feature One</h2>
        <p className="text-gray-600">Description of the first feature.</p>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Feature Two</h2>
        <p className="text-gray-600">Description of the second feature.</p>
      </Card>
    </div>
  </div>
)

// Empty state content
const EmptyStateContent = () => (
  <div className="h-full flex flex-col">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold">Context Panel</h3>
    </div>
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No content selected</h4>
        <p className="text-sm text-gray-500">Select an item to view details</p>
      </div>
    </div>
  </div>
)

// User details content
const UserDetailsContent = () => (
  <div className="h-full flex flex-col">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold">User Profile</h3>
    </div>
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
          JD
        </div>
        <div>
          <h4 className="text-lg font-semibold">John Doe</h4>
          <p className="text-sm text-gray-600">john.doe@example.com</p>
        </div>
      </div>
      
      <div>
        <h5 className="text-sm font-semibold mb-2">Progress Overview</h5>
        <Progress value={75} label="Overall Progress" showPercentage variant="success" />
      </div>
      
      <div>
        <h5 className="text-sm font-semibold mb-2">Badges</h5>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="default">Team Lead</Badge>
        </div>
      </div>
      
      <div>
        <h5 className="text-sm font-semibold mb-2">Actions</h5>
        <div className="space-y-2">
          <Button className="w-full" variant="secondary">Send Message</Button>
          <Button className="w-full" variant="secondary">View Full Profile</Button>
        </div>
      </div>
    </div>
  </div>
)

// Knowledge graph content
const KnowledgeGraphContent = () => {
  const knowledgePoints = [
    { id: 'kp1', title: 'Basics', progress: 100, dependencies: [] },
    { id: 'kp2', title: 'Arrays', progress: 80, dependencies: ['kp1'] },
    { id: 'kp3', title: 'Objects', progress: 60, dependencies: ['kp1'] },
    { id: 'kp4', title: 'Functions', progress: 40, dependencies: ['kp2', 'kp3'] },
    { id: 'kp5', title: 'Async', progress: 20, dependencies: ['kp4'] },
    { id: 'kp6', title: 'Promises', progress: 0, dependencies: ['kp5'] },
  ]

  return (
    <div className="h-full overflow-auto bg-secondary p-4">
      <KnowledgeTreeCard
        title="JavaScript Learning Path"
        subtitle="Core programming concepts"
        userName="Student"
        knowledgePoints={knowledgePoints}
        showStats={true}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <>
      <MainContent />
      <ContextWindowTrigger />
      <ContextWindow>
        <EmptyStateContent />
      </ContextWindow>
    </>
  ),
}

export const WithUserDetails: Story = {
  render: () => (
    <>
      <MainContent />
      <ContextWindowTrigger />
      <ContextWindow>
        <UserDetailsContent />
      </ContextWindow>
    </>
  ),
}

export const WithKnowledgeGraph: Story = {
  render: () => (
    <>
      <MainContent />
      <ContextWindowTrigger />
      <ContextWindow>
        <KnowledgeGraphContent />
      </ContextWindow>
    </>
  ),
}

// Component that shows both compact and expanded states
const KnowledgeGraphWithStates = () => {
  const { state, expand, compact } = useContextWindow()
  const knowledgePoints = [
    { id: 'kp1', title: 'ML Basics', progress: 100, dependencies: [] },
    { id: 'kp2', title: 'Types of ML', progress: 85, dependencies: ['kp1'] },
    { id: 'kp3', title: 'Applications', progress: 70, dependencies: ['kp2'] },
    { id: 'kp4', title: 'Linear Algebra', progress: 60, dependencies: [] },
    { id: 'kp5', title: 'Statistics', progress: 30, dependencies: [] },
    { id: 'kp6', title: 'Linear Regression', progress: 0, dependencies: ['kp4', 'kp5'] },
  ]

  if (state === 'compact') {
    return (
      <div className="h-full overflow-auto bg-secondary p-spacing-md">
        <KnowledgeGraphPreview
          knowledgePoints={knowledgePoints}
          userName="Alex"
          courseTitle="Machine Learning"
          onExpand={expand}
        />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-secondary p-spacing-md">
      <KnowledgeTreeCard
        title="Machine Learning Path"
        subtitle="Your personalized journey"
        userName="Alex"
        knowledgePoints={knowledgePoints}
        showStats={true}
        onCompact={compact}
      />
    </div>
  )
}

export const CompactKnowledgeGraph: Story = {
  render: () => (
    <>
      <MainContent />
      <ContextWindowTrigger />
      <ContextWindow>
        <KnowledgeGraphWithStates />
      </ContextWindow>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows the compact preview state of the knowledge graph with the ability to expand to full view.',
      },
    },
  },
}

export const CustomWidth: Story = {
  render: () => {
    // This would require modifying the context window component to accept width prop
    return (
      <>
        <MainContent />
        <ContextWindowTrigger />
        <ContextWindow>
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Custom Width Panel</h3>
            </div>
            <div className="flex-1 p-6">
              <p className="text-gray-600">
                This demonstrates how the context window can contain different types of content.
              </p>
            </div>
          </div>
        </ContextWindow>
      </>
    )
  },
}

export const DifferentSizes: Story = {
  render: () => {
    const [size, setSize] = useState<'compact' | 'medium' | 'large'>('medium')
    
    return (
      <>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Context Window Size Demo</h1>
          <div className="flex gap-2 mb-4">
            <Button 
              variant={size === 'compact' ? 'primary' : 'secondary'}
              onClick={() => setSize('compact')}
            >
              Compact
            </Button>
            <Button 
              variant={size === 'medium' ? 'primary' : 'secondary'}
              onClick={() => setSize('medium')}
            >
              Medium
            </Button>
            <Button 
              variant={size === 'large' ? 'primary' : 'secondary'}
              onClick={() => setSize('large')}
            >
              Large
            </Button>
          </div>
          <p>Current size: {size}</p>
        </div>
        <ContextWindowLayout compactSize={size} expandedSize={size}>
          <ContextWindowTrigger />
          <ContextWindow>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Size: {size}</h3>
              <p>This context window is set to {size} size.</p>
            </div>
          </ContextWindow>
        </ContextWindowLayout>
      </>
    )
  },
}

export const WithInteractiveContent: Story = {
  render: () => {
    const InteractiveContent = () => {
      const [count, setCount] = useState(0)
      
      return (
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Interactive Demo</h3>
          </div>
          <div className="flex-1 p-6 space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-2">Counter Example</h4>
              <p className="text-2xl font-bold mb-4">{count}</p>
              <div className="flex gap-2">
                <Button onClick={() => setCount(count + 1)} size="sm">Increment</Button>
                <Button onClick={() => setCount(count - 1)} size="sm" variant="secondary">Decrement</Button>
                <Button onClick={() => setCount(0)} size="sm" variant="ghost">Reset</Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-medium mb-2">Form Example</h4>
              <input 
                type="text" 
                placeholder="Enter text..." 
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea 
                placeholder="Enter description..." 
                className="w-full mt-2 px-3 py-2 border rounded-md"
                rows={3}
              />
              <Button className="mt-2" size="sm">Submit</Button>
            </Card>
          </div>
        </div>
      )
    }
    
    return (
      <>
        <MainContent />
        <ContextWindowTrigger />
        <ContextWindow>
          <InteractiveContent />
        </ContextWindow>
      </>
    )
  },
}