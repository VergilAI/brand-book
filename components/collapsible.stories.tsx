import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { Button } from './button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collapsible component that allows content to be toggled between visible and hidden states.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
          Click to toggle
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="rounded-md border border-border-default bg-bg-secondary p-4">
            <p className="text-sm text-text-secondary">
              This is the collapsible content. It can contain any React components or HTML elements.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const ControlledState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <div className="w-[400px]">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Controlled Collapsible</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="mt-4 rounded-md border border-border-default bg-bg-secondary p-4">
              <p className="text-sm text-text-secondary">
                This collapsible is controlled by state. Current state: {isOpen ? 'Open' : 'Closed'}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
}

export const WithDifferentTriggerStyles: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[400px]">
      {/* Text trigger */}
      <Collapsible>
        <CollapsibleTrigger className="text-brand hover:underline">
          Simple text trigger
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-bg-brandLight rounded-md">
            <p className="text-sm">Content with text trigger</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Button trigger */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="default" size="sm" className="w-full">
            Button Trigger
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-bg-secondary rounded-md">
            <p className="text-sm">Content with button trigger</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Icon button trigger */}
      <Collapsible>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
            </Button>
          </CollapsibleTrigger>
          <span className="text-sm font-medium">Icon button trigger</span>
        </div>
        <CollapsibleContent>
          <div className="mt-2 ml-8 p-4 bg-bg-secondary rounded-md">
            <p className="text-sm">Content with icon button trigger</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const AnimatedTransitions: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-brand transition-transform duration-500 data-[state=open]:scale-150" />
          Smooth animations
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 bg-bg-secondary rounded-md transform transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className="text-sm">Animated item {i}</p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const NestedCollapsibles: Story = {
  render: () => (
    <div className="w-[500px]">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center gap-2 font-semibold">
          <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
          Parent Section
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="ml-6 mt-2 space-y-4">
            <p className="text-sm text-text-secondary">Parent content here</p>
            
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm">
                <ChevronRight className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-90" />
                Child Section 1
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-5 mt-2 p-3 bg-bg-secondary rounded-md">
                  <p className="text-sm">Nested content 1</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm">
                <ChevronRight className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-90" />
                Child Section 2
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-5 mt-2 p-3 bg-bg-secondary rounded-md">
                  <p className="text-sm">Nested content 2</p>
                  
                  <Collapsible className="mt-3">
                    <CollapsibleTrigger className="flex items-center gap-2 text-xs">
                      <ChevronRight className="h-2 w-2 transition-transform duration-200 data-[state=open]:rotate-90" />
                      Deeply nested
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 mt-2 p-2 bg-bg-emphasis rounded">
                        <p className="text-xs">Deep nested content</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const MultipleItems: Story = {
  render: () => {
    const sections = [
      { id: 1, title: 'Getting Started', content: 'Learn the basics of our platform' },
      { id: 2, title: 'Advanced Features', content: 'Explore powerful tools and integrations' },
      { id: 3, title: 'Best Practices', content: 'Tips and tricks for optimal usage' },
      { id: 4, title: 'Troubleshooting', content: 'Common issues and their solutions' },
    ]

    return (
      <div className="w-[500px] space-y-2">
        {sections.map((section) => (
          <Collapsible key={section.id}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-bg-secondary p-4 hover:bg-bg-emphasis transition-colors">
              <span className="font-medium">{section.title}</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <p className="text-sm text-text-secondary">{section.content}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    )
  },
}

export const WithComplexContent: Story = {
  render: () => (
    <div className="w-[600px]">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 bg-bg-elevated border border-border-default rounded-lg cursor-pointer hover:border-border-emphasis transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-consciousness flex items-center justify-center text-white font-semibold">
                AI
              </div>
              <div>
                <h3 className="font-semibold">Advanced Settings</h3>
                <p className="text-sm text-text-secondary">Configure AI behavior and preferences</p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 p-6 bg-bg-secondary rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Model Type</label>
                <select className="mt-1 w-full p-2 border border-border-default rounded-md">
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                  <option>Claude</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  className="mt-1 w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">System Prompt</label>
              <textarea
                className="mt-1 w-full p-2 border border-border-default rounded-md"
                rows={3}
                placeholder="Enter system prompt..."
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm">Save Settings</Button>
              <Button size="sm" variant="ghost">Reset to Default</Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Collapsible>
        <CollapsibleTrigger disabled className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          Disabled trigger
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-bg-secondary rounded-md">
            <p className="text-sm">This content cannot be accessed</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
          Enabled trigger
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-bg-secondary rounded-md">
            <p className="text-sm">This content is accessible</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}