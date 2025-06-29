import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'
import { 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Save,
  Download,
  Copy,
  Trash2,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square
} from 'lucide-react'

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'solid', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    active: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <Bold />,
    variant: 'default',
    size: 'md',
  },
}

export const WithLeftSubscript: Story = {
  args: {
    icon: <Bold />,
    leftSubscript: 'B',
    variant: 'default',
    size: 'md',
  },
}

export const WithRightSubscript: Story = {
  args: {
    icon: <List />,
    rightSubscript: '1',
    variant: 'default',
    size: 'md',
  },
}

export const WithBothSubscripts: Story = {
  args: {
    icon: <Save />,
    leftSubscript: 'S',
    rightSubscript: '1',
    variant: 'default',
    size: 'md',
  },
}

export const ActiveState: Story = {
  args: {
    icon: <Bold />,
    leftSubscript: 'B',
    active: true,
    variant: 'default',
    size: 'md',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <IconButton icon={<Bold />} variant="default" />
      <IconButton icon={<Bold />} variant="ghost" />
      <IconButton icon={<Bold />} variant="solid" />
      <IconButton icon={<Bold />} variant="outline" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Bold />} size="sm" leftSubscript="B" />
      <IconButton icon={<Bold />} size="md" leftSubscript="B" />
      <IconButton icon={<Bold />} size="lg" leftSubscript="B" />
    </div>
  ),
}

export const TextFormattingToolbar: Story = {
  render: () => {
    const [activeFormats, setActiveFormats] = React.useState({
      bold: false,
      italic: false,
      underline: false,
    })

    return (
      <div className="flex gap-1 p-2 border rounded-lg bg-background">
        <IconButton 
          icon={<Bold />} 
          leftSubscript="B"
          active={activeFormats.bold}
          onClick={() => setActiveFormats(prev => ({ ...prev, bold: !prev.bold }))}
        />
        <IconButton 
          icon={<Italic />} 
          leftSubscript="I"
          active={activeFormats.italic}
          onClick={() => setActiveFormats(prev => ({ ...prev, italic: !prev.italic }))}
        />
        <IconButton 
          icon={<Underline />} 
          leftSubscript="U"
          active={activeFormats.underline}
          onClick={() => setActiveFormats(prev => ({ ...prev, underline: !prev.underline }))}
        />
        <div className="w-px bg-border mx-1" />
        <IconButton icon={<Link2 />} leftSubscript="K" />
        <IconButton icon={<List />} />
        <IconButton icon={<ListOrdered />} rightSubscript="7" />
        <div className="w-px bg-border mx-1" />
        <IconButton icon={<AlignLeft />} />
        <IconButton icon={<AlignCenter />} />
        <IconButton icon={<AlignRight />} />
      </div>
    )
  },
}

export const MediaControlsToolbar: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = React.useState(false)

    return (
      <div className="flex gap-2 p-2 border rounded-lg bg-background">
        <IconButton icon={<ChevronLeft />} size="sm" />
        <IconButton 
          icon={isPlaying ? <Pause /> : <Play />}
          variant="solid"
          onClick={() => setIsPlaying(!isPlaying)}
        />
        <IconButton icon={<Square />} size="sm" />
        <IconButton icon={<ChevronRight />} size="sm" />
      </div>
    )
  },
}

export const ActionToolbar: Story = {
  render: () => (
    <div className="flex gap-2 p-2 border rounded-lg bg-background">
      <IconButton icon={<Undo />} leftSubscript="Z" />
      <IconButton icon={<Redo />} leftSubscript="Y" />
      <div className="w-px bg-border mx-1" />
      <IconButton icon={<Save />} leftSubscript="S" />
      <IconButton icon={<Copy />} leftSubscript="C" />
      <IconButton icon={<Download />} />
      <div className="w-px bg-border mx-1" />
      <IconButton icon={<Search />} leftSubscript="F" />
      <IconButton icon={<Settings />} />
      <IconButton icon={<Trash2 />} variant="ghost" className="text-destructive hover:text-destructive" />
    </div>
  ),
}

export const CodeEditorToolbar: Story = {
  render: () => (
    <div className="flex gap-1 p-2 border rounded-lg bg-background">
      <IconButton icon={<Code />} leftSubscript="E" />
      <IconButton icon={<Quote />} />
      <IconButton icon={<Image />} />
      <div className="w-px bg-border mx-1" />
      <IconButton icon={<Bold />} leftSubscript="B" />
      <IconButton icon={<Italic />} leftSubscript="I" />
      <IconButton icon={<Link2 />} leftSubscript="K" />
    </div>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="flex gap-4">
      <IconButton icon={<Bold />} disabled />
      <IconButton icon={<Bold />} variant="ghost" disabled />
      <IconButton icon={<Bold />} variant="solid" disabled />
      <IconButton icon={<Bold />} variant="outline" disabled />
    </div>
  ),
}

export const InteractiveDemo: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null)
    
    const tools = [
      { id: 'bold', icon: <Bold />, leftSubscript: 'B' },
      { id: 'italic', icon: <Italic />, leftSubscript: 'I' },
      { id: 'underline', icon: <Underline />, leftSubscript: 'U' },
      { id: 'code', icon: <Code />, leftSubscript: 'E' },
    ]

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {tools.map(tool => (
            <IconButton
              key={tool.id}
              icon={tool.icon}
              leftSubscript={tool.leftSubscript}
              active={selected === tool.id}
              onClick={() => setSelected(selected === tool.id ? null : tool.id)}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Selected: {selected || 'None'}
        </p>
      </div>
    )
  },
}