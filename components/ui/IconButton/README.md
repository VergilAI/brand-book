# IconButton Component

A flexible icon button component that supports keyboard shortcuts and numeric indicators, perfect for toolbars and action panels.

## Features

- Central icon display
- Optional left subscript for keyboard shortcuts
- Optional right subscript for numeric indicators
- Multiple variants (default, ghost, solid, outline)
- Active/selected state support
- Three sizes (sm, md, lg)
- Full accessibility support
- Consistent with Vergil Design System

## Usage

```tsx
import { IconButton } from '@/components/ui/IconButton'
import { Bold } from 'lucide-react'

// Basic usage
<IconButton icon={<Bold />} />

// With keyboard shortcut
<IconButton icon={<Bold />} leftSubscript="B" />

// With numeric indicator
<IconButton icon={<List />} rightSubscript="1" />

// With both subscripts
<IconButton icon={<Save />} leftSubscript="S" rightSubscript="1" />

// Active state
<IconButton icon={<Bold />} active={true} />

// Different variants
<IconButton icon={<Bold />} variant="ghost" />
<IconButton icon={<Bold />} variant="solid" />
<IconButton icon={<Bold />} variant="outline" />

// Different sizes
<IconButton icon={<Bold />} size="sm" />
<IconButton icon={<Bold />} size="lg" />
```

## Toolbar Example

```tsx
const TextFormattingToolbar = () => {
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  
  return (
    <div className="flex gap-1 p-2 border rounded-lg">
      <IconButton 
        icon={<Bold />} 
        leftSubscript="B"
        active={bold}
        onClick={() => setBold(!bold)}
      />
      <IconButton 
        icon={<Italic />} 
        leftSubscript="I"
        active={italic}
        onClick={() => setItalic(!italic)}
      />
      <IconButton icon={<Link />} leftSubscript="K" />
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | ReactNode | required | The icon to display |
| leftSubscript | string | - | Text to show in bottom-left (typically keyboard shortcut) |
| rightSubscript | string | - | Text to show in bottom-right (typically number) |
| variant | 'default' \| 'ghost' \| 'solid' \| 'outline' | 'default' | Visual style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| active | boolean | false | Whether the button is in active/selected state |
| disabled | boolean | false | Whether the button is disabled |
| onClick | function | - | Click handler |
| className | string | - | Additional CSS classes |

## Accessibility

- Subscripts include appropriate aria-labels for screen readers
- Full keyboard navigation support
- Focus visible indicators
- Disabled state handling

## Design Considerations

- Subscripts are rendered with reduced opacity (50%) to appear as hints
- Active states have distinct visual feedback per variant
- Icons are automatically sized based on button size
- Consistent spacing and alignment across all sizes