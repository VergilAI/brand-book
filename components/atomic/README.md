# Atomic Components

This directory contains the most fundamental UI building blocks of the design system. These components are:

- Small, focused, and single-purpose
- Highly reusable across the application
- Follow strict design token usage
- Accessible by default

## Label Component

The Label component is a fundamental form element that provides accessible text labels for form controls.

### Features

- **Clear Typography**: Uses `text-base` (16px) by default for optimal readability
- **Proper Spacing**: Automatic `mb-spacing-xs` spacing from associated inputs
- **Semantic Tokens Only**: No hardcoded values, only design system tokens
- **Required Field Indicators**: Red asterisk with proper accessibility attributes
- **Error States**: Built-in error variant and message display
- **Help Text**: Optional descriptive text below the label
- **Multiple Sizes**: Small, medium (default), and large variants
- **Fully Accessible**: Proper ARIA attributes and screen reader support

### Usage

```tsx
import { Label } from '@/components/atomic/label'
import { Input } from '@/components/input'

// Basic usage
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />

// Required field
<Label htmlFor="username" required>
  Username
</Label>
<Input id="username" />

// With error
<Label 
  htmlFor="password" 
  required
  error="Password must be at least 8 characters"
>
  Password
</Label>
<Input id="password" type="password" />

// With help text
<Label 
  htmlFor="api-key"
  helpText="You can find your API key in settings"
>
  API Key
</Label>
<Input id="api-key" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error' \| 'success' \| 'warning' \| 'info'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Label size |
| `required` | `boolean` | `false` | Shows red asterisk when true |
| `error` | `string` | `undefined` | Error message to display |
| `helpText` | `string` | `undefined` | Help text to display |
| `htmlFor` | `string` | `undefined` | ID of the associated form control |

### Design Decisions

1. **Default 16px font size**: Prevents mobile zoom issues and ensures readability
2. **Consistent spacing**: Uses `mb-spacing-xs` to maintain visual rhythm
3. **Error priority**: When both error and helpText are provided, only error shows
4. **Semantic structure**: Wraps in a div to contain label, error, and help text
5. **Accessible indicators**: Required asterisk has `aria-label="required"`
6. **Alert role**: Error messages use `role="alert"` for screen readers