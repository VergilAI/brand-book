"use client"

import { useState } from 'react'
import { Checkbox, CheckboxWithLabel, AnimatedCheckbox } from './checkbox'

export function CheckboxDemo() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const features = [
    { id: 'gamification', label: 'Gamification', description: 'Learn through interactive games' },
    { id: 'progress', label: 'Progress Tracking', description: 'Monitor your learning journey' },
    { id: 'certificates', label: 'Certificates', description: 'Earn certificates upon completion' },
    { id: 'offline', label: 'Offline Mode', description: 'Download courses for offline access' },
  ]
  
  const allSelected = selectedFeatures.length === features.length
  const someSelected = selectedFeatures.length > 0 && selectedFeatures.length < features.length
  
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedFeatures(features.map(f => f.id))
    } else {
      setSelectedFeatures([])
    }
  }
  
  const handleFeatureToggle = (featureId: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedFeatures(prev => [...prev, featureId])
    } else {
      setSelectedFeatures(prev => prev.filter(id => id !== featureId))
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-spacing-xl space-y-spacing-xl">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-spacing-sm">
          Course Preferences
        </h2>
        <p className="text-text-secondary">
          Customize your learning experience by selecting the features you want
        </p>
      </div>
      
      <div className="bg-bg-secondary rounded-lg p-spacing-lg space-y-spacing-md">
        <div className="pb-spacing-sm border-b border-border-subtle">
          <CheckboxWithLabel
            label="Select all features"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={handleSelectAll}
          />
        </div>
        
        <div className="space-y-spacing-md">
          {features.map(feature => (
            <CheckboxWithLabel
              key={feature.id}
              label={feature.label}
              description={feature.description}
              checked={selectedFeatures.includes(feature.id)}
              onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-bg-warning rounded-lg p-spacing-lg">
        <CheckboxWithLabel
          label="I agree to the terms and conditions"
          description="You must agree to our terms of service and privacy policy to continue"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
      </div>
      
      <button
        disabled={!agreedToTerms || selectedFeatures.length === 0}
        className={cn(
          "w-full h-12 px-spacing-lg rounded-lg font-semibold transition-all duration-normal",
          "bg-bg-brand text-text-inverse",
          "hover:bg-bg-brandEmphasis hover:shadow-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
          "disabled:opacity-disabled disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        Save Preferences ({selectedFeatures.length} features selected)
      </button>
      
      <div className="text-sm text-text-secondary">
        <p className="font-medium mb-spacing-xs">Selected features:</p>
        <pre className="bg-bg-tertiary rounded-md p-spacing-sm">
          {JSON.stringify(selectedFeatures, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Helper function - should be imported from utils
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}