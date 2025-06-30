import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { IconButtonWithTooltip } from '@/components/ui/IconButton/IconButtonWithTooltip'
import { 
  MousePointer2, 
  Pen, 
  Link,
  Hand,
  Grid3x3,
  Library,
  Table2
} from 'lucide-react'

const meta = {
  title: 'Components/IconButton V2',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

// Custom CSS for color options
const colorStyles = `
  <style>
    /* Option 1: Vibrant & Bold */
    .color-option-1 {
      --color-primary: #5B3FF9;
      --color-text: #1D1D1F;
      --color-hover: rgba(91, 63, 249, 0.1);
    }
    
    /* Option 2: Electric & Modern */
    .color-option-2 {
      --color-primary: #6D28D9;
      --color-text: #1D1D1F;
      --color-hover: rgba(109, 40, 217, 0.1);
    }
    
    /* Option 3: Premium & Bold */
    .color-option-3 {
      --color-primary: #6E40C9;
      --color-text: #1D1D1F;
      --color-hover: rgba(110, 64, 201, 0.1);
    }
    
    .icon-button-v2 {
      color: var(--color-text);
      transition: all 200ms ease;
    }
    
    .icon-button-v2:hover {
      background-color: var(--color-hover);
    }
    
    .icon-button-v2.active {
      color: var(--color-primary);
    }
    
    .icon-button-v2.active:hover {
      background-color: var(--color-hover);
    }
  </style>
`

const ToolbarExample = ({ colorClass }: { colorClass: string }) => (
  <div className={`${colorClass} flex items-center gap-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200`}>
    <div className="flex items-center gap-1">
      <IconButton
        icon={<MousePointer2 />}
        active={true}
        size="sm"
        variant="ghost"
        className="icon-button-v2"
      />
      <IconButton
        icon={<Hand />}
        active={false}
        size="sm"
        variant="ghost"
        className="icon-button-v2"
      />
      <IconButton
        icon={<Pen />}
        active={false}
        size="sm"
        variant="ghost"
        className="icon-button-v2"
      />
      <IconButton
        icon={<Link />}
        active={false}
        size="sm"
        variant="ghost"
        className="icon-button-v2"
      />
    </div>
    
    <div className="w-px h-6 bg-gray-300" />
    
    <IconButton
      icon={<Grid3x3 className="w-4 h-4" />}
      active={true}
      size="sm"
      variant="ghost"
      className="icon-button-v2"
    />
    
    <IconButton
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2" strokeOpacity="0.5" />
        </svg>
      }
      active={true}
      size="sm"
      variant="ghost"
      className="icon-button-v2"
    />
  </div>
)

export const ColorOptionsShowcase: Story = {
  render: () => (
    <>
      <div dangerouslySetInnerHTML={{ __html: colorStyles }} />
      <div className="space-y-8 p-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Icon Button Color Options</h2>
          <p className="text-sm text-gray-600 mb-6">
            Comparing different purple shades for active states with #1D1D1F as the base icon color
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Option 1: Vibrant & Bold (#5B3FF9)</h3>
            <ToolbarExample colorClass="color-option-1" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Option 2: Electric & Modern (#6D28D9)</h3>
            <ToolbarExample colorClass="color-option-2" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Option 3: Premium & Bold (#6E40C9)</h3>
            <ToolbarExample colorClass="color-option-3" />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium mb-3">With Tooltips</h3>
          <div className="color-option-1 flex gap-2">
            <IconButtonWithTooltip
              icon={<MousePointer2 />}
              tooltip="Select and move territories"
              active={true}
              size="sm"
              variant="ghost"
              className="icon-button-v2"
            />
            <IconButtonWithTooltip
              icon={<Grid3x3 className="w-4 h-4" />}
              tooltip="Toggle grid visibility"
              active={false}
              size="sm"
              variant="ghost"
              className="icon-button-v2"
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium mb-3">States Comparison</h3>
          <div className="color-option-1 space-y-2">
            <div className="flex items-center gap-4">
              <IconButton
                icon={<MousePointer2 />}
                active={false}
                size="sm"
                variant="ghost"
                className="icon-button-v2"
              />
              <span className="text-xs text-gray-500">Default</span>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                icon={<MousePointer2 />}
                active={false}
                size="sm"
                variant="ghost"
                className="icon-button-v2 hover:bg-[var(--color-hover)]"
                style={{ backgroundColor: 'var(--color-hover)' }}
              />
              <span className="text-xs text-gray-500">Hover</span>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                icon={<MousePointer2 />}
                active={true}
                size="sm"
                variant="ghost"
                className="icon-button-v2"
              />
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                icon={<MousePointer2 />}
                active={true}
                size="sm"
                variant="ghost"
                className="icon-button-v2"
                style={{ backgroundColor: 'var(--color-hover)' }}
              />
              <span className="text-xs text-gray-500">Active + Hover</span>
            </div>
          </div>
        </div>
      </div>
    </>
  ),
}