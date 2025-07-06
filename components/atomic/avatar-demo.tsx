import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

export function AvatarDemo() {
  return (
    <div className="space-y-spacing-lg p-spacing-lg">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-spacing-md">
          Avatar Component Demo
        </h2>
        <p className="text-base text-text-secondary mb-spacing-lg">
          New avatar component with proper sizing following accessibility guidelines.
          All sizes meet WCAG 2.1 Level AA minimum touch target requirements.
        </p>
      </div>

      <div className="space-y-spacing-md">
        <h3 className="text-lg font-medium text-text-primary">Basic Usage</h3>
        <div className="flex items-center gap-spacing-md">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <Avatar>
            <AvatarImage src="/invalid-url.jpg" alt="User" />
            <AvatarFallback>John Doe</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="space-y-spacing-md">
        <h3 className="text-lg font-medium text-text-primary">Size Variants</h3>
        <div className="flex items-end gap-spacing-md">
          <div className="text-center">
            <Avatar size="sm">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Small" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">Small (40px)</p>
          </div>
          
          <div className="text-center">
            <Avatar size="md">
              <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="Medium" />
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">Medium (48px)</p>
          </div>
          
          <div className="text-center">
            <Avatar size="lg">
              <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="Large" />
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">Large (64px)</p>
          </div>
          
          <div className="text-center">
            <Avatar size="xl">
              <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Extra Large" />
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
            <p className="text-xs text-text-tertiary mt-spacing-xs">XL (80px)</p>
          </div>
        </div>
      </div>

      <div className="space-y-spacing-md">
        <h3 className="text-lg font-medium text-text-primary">Initials Extraction</h3>
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
            <AvatarFallback>X</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="space-y-spacing-md">
        <h3 className="text-lg font-medium text-text-primary">Implementation Example</h3>
        <pre className="bg-bg-secondary p-spacing-md rounded-lg overflow-x-auto">
          <code className="text-sm text-text-primary">{`import { Avatar, AvatarImage, AvatarFallback } from '@/components/atomic/avatar'

// Basic usage
<Avatar>
  <AvatarImage src="/path/to/image.jpg" alt="User name" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With size variant
<Avatar size="lg">
  <AvatarImage src="/path/to/image.jpg" alt="User name" />
  <AvatarFallback>John Doe</AvatarFallback>
</Avatar>`}</code>
        </pre>
      </div>
    </div>
  )
}