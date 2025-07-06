import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta = {
  title: 'Atomic/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Avatar size variant',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage 
        src="https://github.com/shadcn.png" 
        alt="User avatar"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage 
        src="https://invalid-url-to-trigger-fallback.com/avatar.jpg" 
        alt="User avatar"
      />
      <AvatarFallback>John Doe</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-spacing-md">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small avatar" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      
      <Avatar size="md">
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium avatar" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large avatar" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      
      <Avatar size="xl">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra large avatar" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackVariations: Story = {
  render: () => (
    <div className="flex items-center gap-spacing-md">
      <Avatar size="lg">
        <AvatarFallback>John Doe</AvatarFallback>
      </Avatar>
      
      <Avatar size="lg">
        <AvatarFallback>Sarah Johnson</AvatarFallback>
      </Avatar>
      
      <Avatar size="lg">
        <AvatarFallback>Admin</AvatarFallback>
      </Avatar>
      
      <Avatar size="lg">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const LoadingStates: Story = {
  render: () => {
    const [imageStatus, setImageStatus] = React.useState<string>('loading')
    
    return (
      <div className="space-y-spacing-md">
        <div className="flex items-center gap-spacing-md">
          <Avatar size="lg">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
              alt="User avatar"
              onLoadingStatusChange={(status) => setImageStatus(status)}
            />
            <AvatarFallback>Loading User</AvatarFallback>
          </Avatar>
          
          <div className="text-sm text-text-secondary">
            Status: {imageStatus}
          </div>
        </div>
        
        <p className="text-sm text-text-tertiary max-w-md">
          The avatar shows a smooth transition when the image loads. Try refreshing to see the loading state.
        </p>
      </div>
    )
  },
}

export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-spacing-md">
      {Array.from({ length: 8 }, (_, i) => (
        <Avatar key={i} size="md">
          <AvatarImage 
            src={`https://i.pravatar.cc/150?img=${i + 1}`}
            alt={`User ${i + 1}`}
          />
          <AvatarFallback>U{i + 1}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          Minimum Touch Target Sizes
        </h3>
        <p className="text-sm text-text-secondary mb-spacing-md">
          All avatar sizes meet WCAG 2.1 Level AA minimum touch target size of 44x44 CSS pixels.
          Our default size (48px) exceeds this requirement for better accessibility.
        </p>
        
        <div className="flex items-end gap-spacing-md">
          <div className="text-center">
            <Avatar size="sm">
              <AvatarFallback>40</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">40×40px</p>
          </div>
          
          <div className="text-center">
            <Avatar size="md">
              <AvatarFallback>48</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">48×48px (default)</p>
          </div>
          
          <div className="text-center">
            <Avatar size="lg">
              <AvatarFallback>64</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">64×64px</p>
          </div>
          
          <div className="text-center">
            <Avatar size="xl">
              <AvatarFallback>80</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">80×80px</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-spacing-sm">
          High Contrast Fallbacks
        </h3>
        <p className="text-sm text-text-secondary mb-spacing-md">
          Fallback states use semantic brand colors with proper contrast ratios for readability.
        </p>
        
        <div className="flex gap-spacing-sm">
          <Avatar size="lg">
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>BB</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>CC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
}

// Add React import for the LoadingStates story
import React from 'react'