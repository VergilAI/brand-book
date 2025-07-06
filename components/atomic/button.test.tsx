import React from 'react'
import { Button, buttonVariants } from './button'

// Test cases to ensure the button component works correctly
export const ButtonTestCases = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
        <div className="flex gap-4 items-center">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button Sizes</h2>
        <div className="flex gap-4 items-center">
          <Button size="md">Medium (48px)</Button>
          <Button size="lg">Large (56px)</Button>
          <Button size="icon">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button States</h2>
        <div className="flex gap-4 items-center">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Icons</h2>
        <div className="flex gap-4 items-center">
          <Button>
            <svg className="mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Image
          </Button>
          <Button variant="secondary">
            Continue
            <svg className="ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}