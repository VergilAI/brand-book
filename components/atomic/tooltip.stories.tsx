import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Atomic/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A clear, readable tooltip component following the Vergil design system with smooth animations and flexible positioning.',
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center justify-center p-spacing-2xl">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip with clear, readable text</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-spacing-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" className="w-full">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip positioned on top</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" className="w-full">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip positioned on right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" className="w-full">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip positioned on bottom</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" className="w-full">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip positioned on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <div className="flex gap-spacing-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Align Start</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            <p>Aligned to the start</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Align Center</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p>Aligned to the center (default)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Align End</Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end">
            <p>Aligned to the end</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Complex Information</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>This tooltip contains longer content that demonstrates how the component handles text wrapping while maintaining excellent readability with proper line height and generous padding.</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const CustomStyles: Story = {
  render: () => (
    <div className="flex gap-spacing-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="primary">Brand Style</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-brand text-inverse shadow-brand-md">
          <p>Brand-colored tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Info Style</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-infoLight text-info border border-info">
          <p>Information tooltip</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Success Style</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-successLight text-success border border-success">
          <p>Success message</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive">Warning Style</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-errorLight text-error border border-error">
          <p>This action cannot be undone</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">No Arrow</Button>
      </TooltipTrigger>
      <TooltipContent hideArrow>
        <p>This tooltip appears without an arrow</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const VariableOffset: Story = {
  render: () => (
    <div className="flex gap-spacing-md">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Default Offset</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>4px offset (default)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Large Offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={12}>
          <p>12px offset from trigger</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">No Offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={0}>
          <p>0px offset (close to trigger)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const InteractiveElements: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <div className="flex gap-spacing-md items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-emphasis transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click for help documentation</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-emphasis transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Important information</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brandLight hover:bg-brand hover:text-inverse transition-colors text-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mark as favorite</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-spacing-md">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-secondary rounded-md cursor-help">
              <span className="text-secondary text-sm">Keyboard Shortcut</span>
              <kbd className="px-spacing-xs py-1 bg-primary border border-default rounded text-xs font-mono">⌘K</kbd>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open command palette</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs bg-brandLight text-brand rounded-md cursor-pointer">
              <span className="text-sm font-medium">Beta Feature</span>
              <span className="text-xs bg-brand text-inverse px-spacing-xs py-0.5 rounded">NEW</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This feature is currently in beta testing</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
}

export const FormFieldHelp: Story = {
  render: () => (
    <div className="space-y-spacing-md">
      <div className="space-y-spacing-xs">
        <div className="flex items-center gap-spacing-xs">
          <label htmlFor="username" className="text-sm font-medium text-primary">
            Username
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-secondary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tertiary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your username must be unique and contain only letters, numbers, and underscores</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          id="username"
          type="text"
          className="w-full h-12 px-spacing-md text-base border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent"
          placeholder="Enter username"
        />
      </div>

      <div className="space-y-spacing-xs">
        <div className="flex items-center gap-spacing-xs">
          <label htmlFor="password" className="text-sm font-medium text-primary">
            Password
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-secondary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tertiary">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          id="password"
          type="password"
          className="w-full h-12 px-spacing-md text-base border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent"
          placeholder="Enter password"
        />
      </div>
    </div>
  ),
}