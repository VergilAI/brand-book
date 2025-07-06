# Tooltip Component

A clear, readable tooltip component built with Radix UI and following the Vergil design system principles.

## Features

- **Clear Typography**: Uses `text-sm` (14px) minimum for excellent readability
- **Generous Padding**: `px-spacing-sm py-spacing-xs` for comfortable reading
- **Semantic Tokens**: All styling uses design system tokens, no hardcoded values
- **Smooth Animations**: Enter/exit animations for a polished experience
- **Flexible Positioning**: Supports all four sides with alignment options
- **High Contrast**: Dark background with white text for maximum readability
- **Accessibility**: Full keyboard navigation support
- **TypeScript**: Fully typed for better developer experience

## Usage

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atomic/tooltip'

// Wrap your app or component tree with TooltipProvider
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Helpful information goes here</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Props

### TooltipProvider

- `delayDuration` (number): Delay in milliseconds before showing tooltip (default: 700ms)
- `skipDelayDuration` (number): How long to disable the delay after a tooltip is shown (default: 300ms)

### TooltipContent

- `side` ("top" | "right" | "bottom" | "left"): Preferred side of trigger (default: "top")
- `align` ("start" | "center" | "end"): Alignment relative to trigger (default: "center")
- `sideOffset` (number): Distance in pixels from trigger (default: 4)
- `hideArrow` (boolean): Whether to hide the arrow (default: false)
- `className` (string): Additional CSS classes

## Examples

### Basic Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover for info</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a helpful tooltip</p>
  </TooltipContent>
</Tooltip>
```

### Icon Button with Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <button className="icon-button">
      <HelpIcon />
    </button>
  </TooltipTrigger>
  <TooltipContent side="right">
    <p>Click for help documentation</p>
  </TooltipContent>
</Tooltip>
```

### Custom Styled Tooltip

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </TooltipTrigger>
  <TooltipContent className="bg-errorLight text-error border border-error">
    <p>This action cannot be undone</p>
  </TooltipContent>
</Tooltip>
```

### Form Field Help

```tsx
<div className="flex items-center gap-spacing-xs">
  <label htmlFor="email">Email</label>
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="help-icon">
        <QuestionMarkIcon />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>We'll use this email for important updates</p>
    </TooltipContent>
  </Tooltip>
</div>
```

## Design Principles

1. **Readability First**: Clear, legible text with sufficient size and contrast
2. **Generous Spacing**: Ample padding for comfortable reading
3. **Semantic Tokens**: All values from the design system, no magic numbers
4. **Smooth Motion**: Subtle animations that feel natural
5. **Flexible**: Works with any trigger element and supports all positions

## Accessibility

- Full keyboard navigation support
- Proper ARIA attributes via Radix UI
- Shows on focus for keyboard users
- Dismissible with Escape key
- Announced to screen readers

## Migration from Old Tooltip

The new tooltip component in `/components/atomic/tooltip.tsx` improves upon the previous version with:

1. Better readability with `text-sm` instead of `text-xs`
2. More generous padding using semantic spacing tokens
3. Cleaner prop interface with TypeScript documentation
4. Improved animation timing using semantic duration tokens
5. Optional arrow hiding capability

To migrate:
1. Update imports to use the atomic version
2. Ensure TooltipProvider wraps your component tree
3. Update any custom styling to use semantic tokens