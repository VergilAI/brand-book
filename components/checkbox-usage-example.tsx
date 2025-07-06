"use client"

import { Checkbox, CheckboxWithLabel, AnimatedCheckbox } from '@/components/atomic/checkbox'

export function CheckboxUsageExample() {
  return (
    <div className="p-spacing-lg space-y-spacing-lg">
      <h2 className="text-2xl font-bold text-text-primary">
        Checkbox Component Usage Examples
      </h2>
      
      {/* Basic checkbox */}
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-semibold text-text-primary">Basic Checkbox</h3>
        <Checkbox />
      </div>
      
      {/* Checkbox with label */}
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-semibold text-text-primary">Checkbox with Label</h3>
        <CheckboxWithLabel 
          label="Enable notifications"
          description="Receive updates about your courses"
        />
      </div>
      
      {/* Size variations */}
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-semibold text-text-primary">Size Variations</h3>
        <div className="flex gap-spacing-md items-center">
          <AnimatedCheckbox size="small" />
          <AnimatedCheckbox size="default" />
          <AnimatedCheckbox size="large" />
        </div>
      </div>
      
      {/* Style variants */}
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-semibold text-text-primary">Style Variants</h3>
        <div className="flex gap-spacing-md items-center">
          <AnimatedCheckbox variant="default" defaultChecked />
          <AnimatedCheckbox variant="brand" defaultChecked />
          <AnimatedCheckbox variant="success" defaultChecked />
          <AnimatedCheckbox variant="error" defaultChecked />
        </div>
      </div>
      
      {/* States */}
      <div className="space-y-spacing-sm">
        <h3 className="text-lg font-semibold text-text-primary">States</h3>
        <div className="flex gap-spacing-lg">
          <Checkbox />
          <Checkbox defaultChecked />
          <Checkbox indeterminate />
          <Checkbox disabled />
          <Checkbox disabled defaultChecked />
        </div>
      </div>
    </div>
  )
}