# Components Library Documentation

## Current Component Structure

### UI Components (`/components/ui/`)
Core UI components with unified design system:
- `button.tsx` - Button with variants (default, secondary, ghost, destructive, outline, link)
- `card.tsx` - **UNIFIED CARD SYSTEM** with all variants:
  - `default` - Basic card with shadow
  - `interactive` - Hover effects with breathing animation
  - `neural` - Gradient background for AI/neural content
  - `feature` - Feature display with hover lift (replaces FeatureCard)
  - `metric` - Metrics display with hover shadow (replaces MetricCard)  
  - `problem` - Problem/solution layout (replaces ProblemCard)
  - `gradient` - Consciousness gradient background
  - `outlined` - Border emphasis variant
- `badge.tsx` - Badge component (used in Vergil Learn)
- `sidebar.tsx` - Sidebar navigation system
- `separator.tsx` - Visual separator (used in Vergil Learn)
- `breadcrumb.tsx` - Breadcrumb navigation

### Vergil Brand Components (`/components/vergil/`)
Brand-specific components expressing living intelligence:
- `vergil-logo.tsx` - Official logo component (variants: logo, mark, wordmark)
- `dynamic-logo.tsx` - Logo with color filters and animations
- `neural-network.tsx` - SVG neural network visualization
- `graph-constellation.tsx` - Basic D3 graph
- `graph-constellation-persistent.tsx` - Advanced graph with floating motion
- `vergil-sidebar.tsx` - Brand book navigation sidebar
- `LayeringIcons/` - Z-order manipulation icons for map editor:
  - `BringToFrontIcon` - Move element to top layer
  - `BringForwardIcon` - Move element up one layer
  - `SendBackwardIcon` - Move element down one layer
  - `SendToBackIcon` - Move element to bottom layer
  - `CopyIcon` - Copy element icon
  - `DuplicateIcon` - Duplicate element icon

### Landing Components (`/components/landing/`)
**APPROVED Vergil Learn components (DO NOT MODIFY)**:
- `navigation.tsx` - Main navigation bar (used in Vergil Learn)
- `learn-hero.tsx` - Hero section with RadialHeatmap integration (used in Vergil Learn)
- `user-journey-carousel.tsx` - Journey visualization with GraphConstellation (used in Vergil Learn)
- `learn-footer.tsx` - Footer with compliance badges (used in Vergil Learn)
- `hero-section.tsx` - Modular hero section with brand variants
- `section.tsx` - Content section wrapper
- `content-transformation.tsx` - Before/after visualization

**Archived** (`/components/landing/_archived/`):
- `feature-card.tsx` - DEPRECATED: Use Card with variant="feature"
- `problem-card.tsx` - DEPRECATED: Use Card with variant="problem"
- `cta-section.tsx` - DEPRECATED: Use Section with CTA content

### LMS Components (`/components/lms/`)
Learning Management System components:
- `course-card.tsx` - Course display card
- `course-carousel.tsx` - Horizontal course browser
- `lesson-card.tsx` - Individual lesson card
- `dashboard-layout.tsx` - LMS dashboard structure
- `course-layout.tsx` - Course page layout
- `video-lesson.tsx` - Video lesson player

### Documentation Components (`/components/docs/`)
Documentation and preview components:
- `docs-layout.tsx` - Documentation page layout
- `component-preview.tsx` - Live component demo wrapper
- `code-block.tsx` - Code syntax highlighting

## Component Standards

### TypeScript & Props
- All components are fully typed
- Props include JSDoc documentation
- Use interfaces over types for props
- Export prop types for reuse

### Accessibility
- WCAG AA compliance required
- Proper ARIA labels
- Keyboard navigation support
- Focus management

### Animation Guidelines
- Use `breathing` class for living feel
- Keep animations subtle (scale 1-1.03)
- Respect prefers-reduced-motion
- Performance over complexity

### Styling Approach
- Tailwind CSS v4 utilities
- CVA for variant management
- CSS variables for theming
- Mobile-first responsive design

## Common Patterns

### Component Structure
```tsx
interface ComponentProps {
  variant?: 'default' | 'special'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function Component({
  variant = 'default',
  size = 'md',
  className,
  children
}: ComponentProps) {
  return (
    <div className={cn(
      componentVariants({ variant, size }),
      className
    )}>
      {children}
    </div>
  )
}
```

### Variant Management (CVA)
```tsx
const componentVariants = cva(
  'base-styles',
  {
    variants: {
      variant: {
        default: 'default-styles',
        special: 'special-styles'
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)
```

### Animation Classes
```css
.breathing {
  animation: breathing 4s ease-in-out infinite;
}

@keyframes breathing {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.03); 
    opacity: 1; 
  }
}
```

## Best Practices

1. **Composition over Inheritance**
   - Build complex components from simple ones
   - Use compound component patterns
   - Keep components focused

2. **Performance**
   - Lazy load heavy components
   - Optimize re-renders with memo
   - Use dynamic imports for code splitting

3. **Testing**
   - Write tests for interactive components
   - Test accessibility features
   - Verify animation performance

4. **Documentation**
   - Include usage examples
   - Document all props
   - Show common patterns
   - Note accessibility features

## Component Guidelines

### Creating New Components
1. Determine category (ui, vergil, landing, lms, docs)
2. Follow naming convention: kebab-case.tsx
3. Include TypeScript types and JSDoc
4. Export from category index file

### Component Requirements
- Full TypeScript typing
- Accessibility compliance (WCAG AA)
- Responsive design
- Dark mode support (where applicable)
- Performance optimized

### Import Patterns
```typescript
// Primitives
import { Button } from '@/components/ui/button'

// Brand components  
import { NeuralNetwork } from '@/components/vergil/neural-network'

// Landing patterns
import { HeroSection } from '@/components/landing/hero-section'

// Module-specific
import { CourseCard } from '@/components/lms/course-card'
```

## Migration Notes

### Current Issues
1. **Inconsistent Structure**: Components don't follow standard folder structure
2. **Missing Stories**: No Storybook stories exist
3. **Limited Tests**: Minimal test coverage
4. **Mixed Concerns**: Some components mix brand and generic functionality

### Future Structure (Post-Migration)
```
packages/design-system/
├── primitives/     # Generic UI (Button, Card, Input)
├── brand/          # Vergil-specific (NeuralNetwork, Logo)
└── patterns/       # Compositions (HeroSection, CTASection)

components/
├── brand-book/     # Brand book specific only
├── vergil-learn/   # Vergil Learn specific only
├── vergil-main/    # Vergil Main specific only
└── lms/            # LMS specific only
```

### Migration Priority
1. **High**: Button, Card, Badge (most reused)
2. **Medium**: Brand components (NeuralNetwork, Logo)
3. **Low**: Module-specific components

## Component Best Practices

### Props Design
- Use discriminated unions for variants
- Provide sensible defaults
- Document all props with JSDoc
- Use forwardRef for DOM elements

### Styling
- Use Tailwind classes with CVA
- Never use inline styles
- Apply design tokens only
- Support className override

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Performance
- Lazy load heavy components
- Memoize expensive calculations
- Use React.memo judiciously
- Optimize re-renders