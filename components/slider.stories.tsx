import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './slider'
import React from 'react'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern slider component built with Radix UI and styled with design tokens. Features smooth animations, brand colors, and proper accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'object' },
      description: 'The default value(s) of the slider',
    },
    value: {
      control: { type: 'object' },
      description: 'The controlled value(s) of the slider',
    },
    max: {
      control: { type: 'number' },
      description: 'The maximum value of the slider',
    },
    min: {
      control: { type: 'number' },
      description: 'The minimum value of the slider',
    },
    step: {
      control: { type: 'number' },
      description: 'The stepping interval',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the slider is disabled',
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[300px]',
  },
}

export const WithRange: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    className: 'w-[300px]',
  },
}

export const WithSteps: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
    className: 'w-[300px]',
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    className: 'w-[300px]',
  },
}

export const MinMax: Story = {
  args: {
    defaultValue: [25],
    min: 10,
    max: 50,
    step: 1,
    className: 'w-[300px]',
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState([50])
    
    return (
      <div className="space-y-spacing-md w-[300px]">
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
        <div className="text-center">
          <p className="text-sm text-text-secondary">Value: {value[0]}</p>
        </div>
      </div>
    )
  },
}

export const RangeControlled: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75])
    
    return (
      <div className="space-y-spacing-md w-[300px]">
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
        <div className="text-center">
          <p className="text-sm text-text-secondary">Range: {value[0]} - {value[1]}</p>
        </div>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div>
        <p className="text-sm font-medium text-text-primary mb-spacing-sm">Default Size</p>
        <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />
      </div>
      
      <div>
        <p className="text-sm font-medium text-text-primary mb-spacing-sm">Custom Styled (Larger)</p>
        <Slider 
          defaultValue={[50]} 
          max={100} 
          step={1} 
          className="w-[300px] [&_.relative]:h-3 [&_.block]:h-8 [&_.block]:w-8"
        />
      </div>
    </div>
  ),
}

export const WithLabels: Story = {
  render: () => {
    const [value, setValue] = React.useState([50])
    
    return (
      <div className="w-[400px] space-y-spacing-lg">
        <div>
          <label className="text-sm font-medium text-text-primary mb-spacing-sm block">
            Volume Control
          </label>
          <Slider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            aria-label="Volume"
          />
          <div className="flex justify-between mt-spacing-xs">
            <span className="text-xs text-text-tertiary">0</span>
            <span className="text-xs text-text-brand font-medium">{value[0]}%</span>
            <span className="text-xs text-text-tertiary">100</span>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-text-primary mb-spacing-sm block">
            Price Range
          </label>
          <Slider
            defaultValue={[200, 800]}
            max={1000}
            step={50}
            aria-label="Price range"
          />
          <div className="flex justify-between mt-spacing-xs">
            <span className="text-xs text-text-tertiary">$0</span>
            <span className="text-xs text-text-tertiary">$1000</span>
          </div>
        </div>
      </div>
    )
  },
}

export const ColorVariants: Story = {
  render: () => (
    <div className="space-y-spacing-lg w-[300px]">
      <div>
        <p className="text-sm font-medium text-text-primary mb-spacing-sm">Brand (Default)</p>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      
      <div>
        <p className="text-sm font-medium text-text-primary mb-spacing-sm">Success Variant</p>
        <Slider 
          defaultValue={[75]} 
          max={100} 
          step={1} 
          className="[&_[role=slider]]:border-border-success [&_[data-orientation]_div]:bg-bg-success"
        />
      </div>
      
      <div>
        <p className="text-sm font-medium text-text-primary mb-spacing-sm">Error Variant</p>
        <Slider 
          defaultValue={[25]} 
          max={100} 
          step={1} 
          className="[&_[role=slider]]:border-border-error [&_[data-orientation]_div]:bg-bg-error"
        />
      </div>
    </div>
  ),
}