# Vergil Design System - Component Standards

## Component Structure

Every component in the Vergil Design System MUST follow this exact structure:

```
components/
└── ComponentName/
    ├── ComponentName.tsx          // Component implementation
    ├── ComponentName.stories.tsx  // Storybook stories (required)
    ├── ComponentName.test.tsx     // Tests (required)
    ├── ComponentName.module.css   // Styles (if needed)
    └── index.ts                   // Exports
```

## Component Categories

### 1. Primitives (`packages/design-system/primitives/`)
Basic, unstyled or minimally styled components that serve as building blocks.
- Examples: Button, Input, Card, Badge
- Should be highly reusable and customizable
- Must work with all brand themes

### 2. Brand Components (`packages/design-system/brand/`)
Vergil-specific components that embody our living intelligence philosophy.
- Examples: NeuralNetwork, IrisPattern, VergilLogo
- Include breathing animations and organic interactions
- Express unique brand identity

### 3. Patterns (`packages/design-system/patterns/`)
Composite components built from primitives and brand components.
- Examples: HeroSection, FeatureGrid, CTASection
- Solve specific UI problems
- Provide consistent layouts

### 4. Module Components (`components/[module]/`)
Components specific to a particular application module.
- Examples: CourseCard (LMS), ColorPalette (brand-book)
- Not intended for reuse outside their module
- Can have module-specific business logic

## Component Implementation Standards

### 1. TypeScript Requirements

```typescript
// ALWAYS include comprehensive TypeScript types
export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * JSDoc description for every prop
   * @default 'default'
   */
  variant?: 'default' | 'secondary' | 'destructive';
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the component is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Component children
   */
  children?: React.ReactNode;
}
```

### 2. Component Template

```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const componentNameVariants = cva(
  // Base styles that always apply
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-purple',
  {
    variants: {
      variant: {
        default: 'bg-cosmic-purple text-white hover:bg-electric-violet',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentNameVariants> {
  loading?: boolean;
}

/**
 * ComponentName - Brief description
 * 
 * @example
 * <ComponentName variant="default" size="md">
 *   Click me
 * </ComponentName>
 */
export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentNameVariants({ variant, size }), className)}
        aria-busy={loading}
        {...props}
      >
        {loading ? <LoadingSpinner /> : children}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### 3. Storybook Requirements

Every component MUST have comprehensive Storybook documentation:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Detailed component description with use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      description: 'Visual style variant',
      table: {
        type: { summary: 'default | secondary | destructive' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      description: 'Size variant',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="destructive">Destructive</ComponentName>
    </div>
  ),
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

// Interactive states
export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName>Normal</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
      <ComponentName loading>Loading</ComponentName>
    </div>
  ),
};
```

### 4. Testing Standards

Every component MUST have tests covering:

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Rendering tests
  it('renders children correctly', () => {
    render(<ComponentName>Test content</ComponentName>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  // Variant tests
  it('applies variant classes correctly', () => {
    const { container } = render(
      <ComponentName variant="secondary">Content</ComponentName>
    );
    expect(container.firstChild).toHaveClass('bg-secondary');
  });

  // Size tests
  it('applies size classes correctly', () => {
    const { container } = render(
      <ComponentName size="lg">Content</ComponentName>
    );
    expect(container.firstChild).toHaveClass('h-12', 'px-6');
  });

  // Interaction tests
  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<ComponentName onClick={handleClick}>Click me</ComponentName>);
    await user.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Accessibility tests
  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<ComponentName>Focusable</ComponentName>);
    
    await user.tab();
    expect(screen.getByText('Focusable')).toHaveFocus();
  });

  // Loading state tests
  it('shows loading state correctly', () => {
    render(<ComponentName loading>Content</ComponentName>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  // Ref forwarding
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ComponentName ref={ref}>Content</ComponentName>);
    expect(ref.current).toBeInTheDocument();
  });
});
```

## Accessibility Standards

Every component MUST meet WCAG AA compliance:

1. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Focus indicators must be visible
   - Tab order must be logical

2. **Screen Reader Support**
   - Proper ARIA labels and roles
   - Meaningful alt text for images
   - Status announcements for dynamic content

3. **Color Contrast**
   - Text must meet 4.5:1 contrast ratio
   - Large text must meet 3:1 contrast ratio
   - Don't rely on color alone to convey information

4. **Motion**
   - Respect `prefers-reduced-motion`
   - Provide pause/stop controls for animations
   - Avoid flashing content

## Styling Guidelines

### 1. Token-First Approach

```typescript
// ❌ NEVER use arbitrary values
className="bg-[#6366F1] text-[14px] p-[16px]"

// ✅ ALWAYS use design tokens
className="bg-cosmic-purple text-sm p-4"
```

### 2. Tailwind Classes with CVA

```typescript
// Use CVA for variant management
const variants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'variant-classes',
      },
    },
  }
);
```

### 3. Animation Classes

```typescript
// Living system animations
className="breathing" // Subtle scale and opacity
className="pulse-glow" // Glowing effect
className="float" // Floating motion
```

## Documentation Requirements

### 1. Component Documentation
- Purpose and use cases
- Props documentation with types
- Usage examples
- Do's and don'ts
- Accessibility notes
- Performance considerations

### 2. Story Documentation
- Interactive controls for all props
- Visual examples of all variants
- State examples (hover, focus, disabled)
- Composition examples
- Edge cases

### 3. Code Comments
- Only add comments when explicitly requested
- Use JSDoc for public APIs
- Keep implementation self-documenting

## Performance Standards

1. **Lazy Loading**
   - Heavy components should be lazy loaded
   - Use dynamic imports for code splitting

2. **Memoization**
   - Use React.memo for expensive components
   - Memoize expensive calculations

3. **Bundle Size**
   - Monitor component bundle size
   - Avoid large dependencies
   - Tree-shake unused code

## Naming Conventions

1. **Files**
   - Component files: `PascalCase.tsx`
   - Story files: `PascalCase.stories.tsx`
   - Test files: `PascalCase.test.tsx`
   - Directories: `PascalCase/`

2. **Components**
   - Components: `PascalCase`
   - Props interfaces: `ComponentNameProps`
   - Variants: `componentNameVariants`

3. **Props**
   - Boolean props: `isActive`, `hasError`, `canEdit`
   - Event handlers: `onClick`, `onChange`, `onSubmit`
   - Render props: `renderItem`, `renderHeader`

## Checklist for New Components

- [ ] Follows standard directory structure
- [ ] Has TypeScript interfaces with JSDoc
- [ ] Uses CVA for variant management
- [ ] Includes forwardRef when appropriate
- [ ] Has comprehensive Storybook stories
- [ ] Has full test coverage
- [ ] Meets accessibility standards
- [ ] Uses design tokens exclusively
- [ ] Includes loading and error states
- [ ] Handles edge cases gracefully
- [ ] Exports from index.ts
- [ ] Added to appropriate category

## Component Generator

Use the CLI tool to bootstrap new components:

```bash
# Generate a primitive component
npm run generate:component Button -- --category=primitive

# Generate a brand component
npm run generate:component NeuralNetwork -- --category=brand

# Generate a pattern
npm run generate:component HeroSection -- --category=pattern

# Generate a module component
npm run generate:component CourseCard -- --category=lms
```

This will create all required files with the correct structure and boilerplate.