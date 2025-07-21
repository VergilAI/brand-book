# Context Window Component

A sliding panel component that provides contextual information and actions without leaving the main view.

## Components

### ContextWindowProvider
Provides context and state management for the context window system.

```tsx
<ContextWindowProvider>
  {/* Your app content */}
</ContextWindowProvider>
```

### ContextWindowLayout
Sets up the layout structure with main content area and portal for the context window.

```tsx
<ContextWindowLayout className="min-h-screen">
  {/* Main content */}
</ContextWindowLayout>
```

### ContextWindow
The actual panel content container. Renders content in the portal.

```tsx
<ContextWindow>
  <div>Your panel content</div>
</ContextWindow>
```

### ContextWindowTrigger
Toggle button that appears on the right edge of the screen.

```tsx
<ContextWindowTrigger />
```

## Usage

```tsx
import { 
  ContextWindowProvider, 
  ContextWindowLayout,
  ContextWindow,
  ContextWindowTrigger 
} from '@/components/context-window'

function MyApp() {
  return (
    <ContextWindowProvider>
      <ContextWindowLayout className="min-h-screen">
        {/* Main app content */}
        <main>
          <h1>My Application</h1>
        </main>

        {/* Toggle button */}
        <ContextWindowTrigger />

        {/* Context panel content */}
        <ContextWindow>
          <div className="p-4">
            <h2>Context Panel</h2>
            <p>Additional information here</p>
          </div>
        </ContextWindow>
      </ContextWindowLayout>
    </ContextWindowProvider>
  )
}
```

## Features

- **Keyboard Shortcut**: Cmd/Ctrl + K to toggle
- **Smooth Animations**: Slide in/out transitions
- **Responsive**: Adapts to different screen sizes
- **Portal Rendering**: Prevents z-index issues
- **State Management**: Built-in open/close state

## API

### useContextWindow Hook

Access context window state and controls:

```tsx
const { isOpen, setIsOpen, toggle } = useContextWindow()
```

- `isOpen`: Boolean indicating if the panel is open
- `setIsOpen`: Function to set open state
- `toggle`: Function to toggle open/close

## Styling

The context window uses design system tokens:
- Width: 480px desktop, 100% mobile
- Background: White
- Border: Default border color
- Shadow: Elevated shadow

## Best Practices

1. **Content Structure**: Always include a header with title
2. **Scrollable Content**: Use `overflow-auto` for long content
3. **Actions**: Place primary actions at the bottom
4. **Empty States**: Provide meaningful empty state UI
5. **Loading States**: Show loading indicators for async content