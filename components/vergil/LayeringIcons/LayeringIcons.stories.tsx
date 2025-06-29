import type { Meta, StoryObj } from '@storybook/react'
import {
  BringToFrontIcon,
  BringForwardIcon,
  SendBackwardIcon,
  SendToBackIcon,
  CopyIcon,
  DuplicateIcon,
  PasteIcon,
  SelectAllIcon,
  GridIcon,
  SnappingIcon
} from './LayeringIcons'

const meta = {
  title: 'Vergil/LayeringIcons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 12, max: 64, step: 4 },
      defaultValue: 16,
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof BringToFrontIcon>

export default meta
type Story = StoryObj<typeof meta>

export const AllIcons: Story = {
  render: (args) => (
    <div className="grid grid-cols-4 gap-8 p-8 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <BringToFrontIcon {...args} />
        <span className="text-sm font-medium">Bring to Front</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BringForwardIcon {...args} />
        <span className="text-sm font-medium">Bring Forward</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SendBackwardIcon {...args} />
        <span className="text-sm font-medium">Send Backward</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SendToBackIcon {...args} />
        <span className="text-sm font-medium">Send to Back</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CopyIcon {...args} />
        <span className="text-sm font-medium">Copy</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DuplicateIcon {...args} />
        <span className="text-sm font-medium">Duplicate</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PasteIcon {...args} />
        <span className="text-sm font-medium">Paste</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SelectAllIcon {...args} />
        <span className="text-sm font-medium">Select All</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <GridIcon {...args} />
        <span className="text-sm font-medium">Grid</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SnappingIcon {...args} />
        <span className="text-sm font-medium">Snapping</span>
      </div>
    </div>
  ),
  args: {
    size: 24,
  },
}

export const SmallIcons: Story = {
  render: () => (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <BringToFrontIcon size={16} />
      <BringForwardIcon size={16} />
      <SendBackwardIcon size={16} />
      <SendToBackIcon size={16} />
      <CopyIcon size={16} />
      <DuplicateIcon size={16} />
      <PasteIcon size={16} />
      <SelectAllIcon size={16} />
      <GridIcon size={16} />
      <SnappingIcon size={16} />
    </div>
  ),
}

export const LargeIcons: Story = {
  render: () => (
    <div className="flex gap-6 p-6 bg-white rounded-lg shadow-sm">
      <BringToFrontIcon size={48} />
      <BringForwardIcon size={48} />
      <SendBackwardIcon size={48} />
      <SendToBackIcon size={48} />
      <CopyIcon size={48} />
      <DuplicateIcon size={48} />
      <PasteIcon size={48} />
      <SelectAllIcon size={48} />
      <GridIcon size={48} />
      <SnappingIcon size={48} />
    </div>
  ),
}

export const InContextMenu: Story = {
  render: () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-64">
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <BringToFrontIcon size={16} />
        Bring to Front
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <BringForwardIcon size={16} />
        Bring Forward
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <SendBackwardIcon size={16} />
        Send Backward
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <SendToBackIcon size={16} />
        Send to Back
      </button>
      <div className="border-t border-gray-200 my-1"></div>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <CopyIcon size={16} />
        Copy
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <DuplicateIcon size={16} />
        Duplicate
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <PasteIcon size={16} />
        Paste
      </button>
      <div className="border-t border-gray-200 my-1"></div>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <SelectAllIcon size={16} />
        Select All
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <GridIcon size={16} />
        Show Grid
      </button>
      <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2">
        <SnappingIcon size={16} enabled={true} />
        Enable Snapping
      </button>
    </div>
  ),
}

export const WithCustomStyles: Story = {
  render: () => (
    <div className="flex gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <BringToFrontIcon size={32} className="opacity-50 hover:opacity-100 transition-opacity" />
        <span className="text-xs">Opacity</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BringForwardIcon size={32} className="rotate-45" />
        <span className="text-xs">Rotated</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SendBackwardIcon size={32} className="scale-150" />
        <span className="text-xs">Scaled</span>
      </div>
    </div>
  ),
}

export const SnappingStates: Story = {
  render: () => (
    <div className="flex gap-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <SnappingIcon size={32} enabled={true} />
        <span className="text-sm font-medium">Enabled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SnappingIcon size={32} enabled={false} />
        <span className="text-sm font-medium">Disabled</span>
      </div>
    </div>
  ),
}