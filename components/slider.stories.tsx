import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
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
          <p className="text-sm text-secondary">Value: {value[0]}</p>
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
          <p className="text-sm text-secondary">Range: {value[0]} - {value[1]}</p>
        </div>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-spacing-lg">
      <div>
        <p className="text-sm font-medium text-primary mb-spacing-sm">Default Size</p>
        <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />
      </div>
      
      <div>
        <p className="text-sm font-medium text-primary mb-spacing-sm">Custom Styled (Larger)</p>
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

// Import React for controlled examples
import React from 'react'