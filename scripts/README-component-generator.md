# Vergil Design System Component Generator

A comprehensive CLI tool that generates components following the centralized V2 token system and mandatory component structure from CLAUDE.md.

## Features

- ✅ **V2 Token Enforcement**: All generated components use only V2 tokens, no hardcoded values
- ✅ **Mandatory Structure**: Follows exact component structure requirements
- ✅ **Complete Scaffolding**: Generates component, stories, tests, and exports
- ✅ **Class Variance Authority**: Built-in CVA integration for variant systems  
- ✅ **Accessibility**: Includes accessibility considerations and tests
- ✅ **TypeScript**: Full TypeScript support with proper interfaces
- ✅ **Interactive & Non-Interactive**: CLI arguments or interactive prompts
- ✅ **Category Validation**: Enforces proper component categorization

## Usage

### Quick Start (Non-Interactive)

```bash
# Basic UI component
npm run create:component MyButton -- --category=ui --variants=true --sizes=true --interactive=true

# Brand component  
npm run create:component MyVisualization -- --category=vergil --variants=false --sizes=false --interactive=false

# LMS component
npm run create:component MyCourseCard -- --category=lms --variants=true --sizes=false --interactive=true
```

### Interactive Mode

```bash
npm run create:component MyComponent
# Follow the interactive prompts
```

## Component Categories

| Category | Path | Description | Examples |
|----------|------|-------------|----------|
| `ui` | `components/ui/` | Core UI components | Button, Card, Input, Select |
| `vergil` | `components/vergil/` | Brand-specific components | VergilLogo, RadialHeatmap, StreamgraphBackground |
| `landing` | `components/landing/` | Landing page components (approved) | LearnHero, UserJourneyCarousel, Navigation |
| `lms` | `components/lms/` | LMS-specific components | CourseCard, GameInterface, LessonViewer |
| `docs` | `components/docs/` | Documentation components | CodeBlock, ComponentPreview, DocsLayout |

## CLI Options

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| `--category` | string | Component category (required) | `--category=ui` |
| `--variants` | boolean | Include CVA variant system | `--variants=true` |
| `--sizes` | boolean | Include size system (sm/md/lg) | `--sizes=true` |  
| `--interactive` | boolean | Interactive component with motion | `--interactive=true` |
| `--description` | string | Component description | `--description="My component"` |

## Generated Files

Each component generates the following structure:

```
components/[category]/ComponentName/
├── ComponentName.tsx          # Component implementation
├── ComponentName.stories.tsx  # Storybook stories with all variants
├── ComponentName.test.tsx     # Jest tests with accessibility checks
└── index.ts                   # Exports
```

## V2 Token System Integration

The generator enforces V2 token usage exclusively:

### ✅ Generated Code Uses V2 Tokens

```tsx
// Colors
bg-vergil-purple
text-vergil-off-white  
border-vergil-emphasis-bg
bg-vergil-error

// Typography
text-body-md
text-h1
text-caption

// Spacing  
space-4
space-8
space-12
```

### ❌ Never Generates Hardcoded Values

```tsx
// These are NEVER generated
bg-[#6366F1]
text-[16px]
bg-blue-500
text-red-600
```

## Component Features

### Variant System (when enabled)

```tsx
const componentVariants = cva(
  'base-styles-using-v2-tokens',
  {
    variants: {
      variant: {
        default: 'bg-vergil-off-white hover:bg-vergil-emphasis-bg',
        primary: 'bg-vergil-purple text-vergil-off-white',
        secondary: 'bg-transparent border-vergil-purple',
        destructive: 'bg-vergil-error text-vergil-off-white',
        ghost: 'border-transparent hover:bg-vergil-emphasis-bg',
      },
      size: { // Only if sizes enabled
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-4 text-body-md', 
        lg: 'h-12 px-6 text-body-lg',
      },
    },
  }
);
```

### Interactive Components (when enabled)

- Framer Motion integration
- `whileHover` and `whileTap` animations
- Proper button semantics
- Loading states with spinners

### Accessibility Features

- Proper HTML semantics
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Storybook Integration

Generated stories include:

- **Default**: Basic component usage
- **All Variants**: Each variant with proper documentation
- **All Sizes**: Each size option (if enabled)
- **Interactive States**: Disabled, loading (if interactive)
- **Token Showcase**: Demonstrates V2 token usage with documentation

## Testing Features

Generated tests cover:

- Basic rendering and content
- Variant and size application
- Interactive functionality (clicks, disabled states)
- Ref forwarding
- **V2 Token Validation**: Ensures only V2 tokens are used
- **Accessibility Standards**: Basic a11y checks

## Advanced Usage

### Custom Component Types

The generator adapts based on options:

```bash
# Simple display component
npm run create:component StatusBadge -- --category=ui --variants=true

# Complex interactive component  
npm run create:component InteractiveChart -- --category=vergil --interactive=true --variants=true --sizes=true

# Landing page component (with warning)
npm run create:component CustomHero -- --category=landing
# ⚠️ Warning: Landing components are fully approved. Only create if explicitly required.
```

### Component Naming Conventions

- Must start with uppercase letter
- Only letters and numbers allowed
- Example: `MyButton`, `UserCard123`, `APIStatus`

## Integration with Existing System

### Follows CLAUDE.md Standards

- **Mandatory Structure**: Exact folder and file structure
- **Token-First Development**: V2 tokens only
- **Component Categories**: Respects hierarchy and precedence
- **CVA Integration**: Class Variance Authority for variants

### Works with Existing Tools

- **Storybook**: Generated stories appear in organized categories
- **Jest**: Tests run with existing test suite
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind**: V2 token classes work with existing Tailwind config

## Troubleshooting

### Common Issues

1. **Component already exists**
   - CLI will prompt to overwrite
   - Or choose a different name

2. **Invalid category**
   - Use one of: ui, vergil, landing, lms, docs
   - Interactive mode shows all options

3. **Invalid component name**
   - Must start with uppercase letter
   - Only letters and numbers allowed

### Validation

The generator includes built-in validation:

- Component name format
- Category validity  
- File path conflicts
- Landing component warnings

## Examples

See the generated example components:

- `/components/ui/ExampleButton/` - Full-featured interactive button
- `/components/ui/ExampleCard/` - Simple card with variants
- `/components/vergil/ExampleVisualization/` - Brand component

## Contributing

When modifying the generator:

1. Update token mappings in `V2_TOKEN_IMPORTS`
2. Add new component categories to `COMPONENT_CATEGORIES`
3. Update templates to follow latest patterns
4. Test with all option combinations
5. Update this documentation

## Related Files

- `/scripts/create-component.ts` - Main CLI implementation  
- `/CLAUDE.md` - Project-wide standards and requirements
- `/components/CLAUDE.md` - Component library documentation
- `/tailwind.config.js` - V2 token definitions