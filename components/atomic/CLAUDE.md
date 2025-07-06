# Atomic Components

## What Are Atomic Components?
Smallest, indivisible UI building blocks. Pure, single-purpose components with no dependencies on business logic.

## Component List

### Inputs & Controls
- `alert.tsx` - Notifications and messages
- `button.tsx` - Interactive buttons with variants
- `checkbox.tsx` - Checkbox input control
- `input.tsx` - Text input field
- `label.tsx` - Form field labels
- `select.tsx` - Dropdown selection
- `textarea.tsx` - Multi-line text input
- `switch.tsx` - Toggle switch control

### Display
- `avatar.tsx` - User avatar display
- `badge.tsx` - Status indicators and tags
- `card.tsx` - Content container
- `progress.tsx` - Progress indicators
- `tooltip.tsx` - Hover information

### Layout & Navigation
- `collapsible.tsx` - Expandable content sections
- `dialog.tsx` - Modal overlays
- `dropdown-menu.tsx` - Contextual menus
- `popover.tsx` - Floating content panels
- `tabs.tsx` - Tab navigation

## Design Principles

### 1. Token-First Styling
```tsx
// ✅ CORRECT
className="text-primary bg-secondary spacing-md"

// ❌ WRONG
className="text-gray-900 bg-gray-100 p-4"
```

### 2. Minimum Touch Targets
- Buttons/inputs: `h-12` (48px) minimum
- Clickable areas: 48x48px minimum
- Generous padding: `px-spacing-lg`

### 3. Component Composition
```tsx
// Atomic components compose into molecules
<Card>
  <Badge />
  <Button />
</Card>
```

### 4. State Handling
- Hover: `hover:bg-emphasis`
- Focus: `focus-visible:ring-2`
- Active: `active:scale-[0.98]`
- Disabled: `disabled:opacity-50`

## Common Patterns

### Variant Props
```tsx
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}
```

### Forwarding Refs
```tsx
const Component = forwardRef<HTMLElement, Props>((props, ref) => {
  // Implementation
})
```

### Semantic HTML
- Use correct elements (`button`, `input`, `label`)
- Include ARIA attributes
- Support keyboard navigation

## Usage Notes
- Import from `/components/` not relative paths
- Check shadcn/ui first before creating new atomics
- All atomics must work in isolation
- No business logic or API calls
- Props for all customization needs