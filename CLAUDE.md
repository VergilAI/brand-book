# Claude Code Project Memory: Vergil Design System

## Project Overview

I built a comprehensive design system documentation site for Vergil, an AI orchestration platform. This is a living design system that serves as both a component showcase and a reference for AI assistants like Claude Code when building Vergil products.

## What Was Built

### Core Infrastructure
- **Next.js 14 + App Router** - Modern React framework with file-based routing
- **TypeScript** - Type safety throughout the codebase
- **Tailwind CSS v4** - Utility-first CSS framework (important: using v4 syntax)
- **Framer Motion** - Animation library for living system effects
- **Radix UI** - Accessible primitive components
- **Class Variance Authority (CVA)** - Component variant management

### Design System Components

#### UI Components (`/components/ui/`)
1. **Button** (`/components/ui/button.tsx`)
   - Multiple variants: default, secondary, ghost, destructive, outline, link
   - Sizes: sm, md, lg, icon
   - Loading state with spinner
   - Hover effects and animations
   - Full TypeScript support with JSDoc

2. **Card** (`/components/ui/card.tsx`)
   - Base Card component with variants: default, interactive, neural
   - Compound components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   - Interactive variant has hover effects and breathing animation

#### Vergil-Specific Components (`/components/vergil/`)
1. **Neural Network** (`/components/vergil/neural-network.tsx`)
   - SVG-based neural network visualization
   - Animated synaptic connections with gradients
   - Floating particles with deterministic positioning (to avoid hydration issues)
   - Customizable nodes and edges
   - Built-in default network configuration

#### Documentation Components (`/components/docs/`)
1. **DocsLayout** (`/components/docs/docs-layout.tsx`)
   - Responsive navigation with mobile menu
   - Sidebar navigation for desktop
   - Search placeholder (cmd+k ready)
   - Breadcrumb support

2. **ComponentPreview** (`/components/docs/component-preview.tsx`)
   - Live component demonstration wrapper
   - Styled preview container

3. **CodeBlock** (`/components/docs/code-block.tsx`)
   - Syntax highlighting ready (Prism.js removed to avoid build issues)
   - Copy-to-clipboard functionality
   - Line numbers support
   - Multiple language support

### Pages Structure

#### App Router Pages (`/app/`)
- **Home** (`/app/page.tsx`) - Hero section, neural network demo, feature cards
- **Components Index** (`/app/components/page.tsx`) - Component library overview
- **Button Documentation** (`/app/components/button/page.tsx`) - Complete button docs with examples
- **AI Guide** (`/app/ai-guide/page.tsx`) - How to use with AI assistants

### Design Tokens & Styling

#### Custom CSS Variables (`/app/globals.css`)
```css
--vergil-purple-500: #6366F1
--vergil-violet-500: #A78BFA  
--vergil-indigo-500: #818CF8
--vergil-cyan-500: #10B981
--vergil-blue-500: #3B82F6
```

#### Custom Animations
- **vergil-breathing** - Subtle scale animation (1-1.03) over 4s
- **vergil-pulse** - Opacity pulse for highlights
- **vergil-gradient** - Animated gradient background

## Key Technical Decisions

### Tailwind CSS v4 Migration
- **Critical**: This project uses Tailwind CSS v4, not v3
- Import syntax: `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Config is in `tailwind.config.js` (JavaScript, not TypeScript)
- Some utility classes work differently than v3

### AI-Optimized Documentation
Every component includes:
- **Comprehensive JSDoc** with examples, props, accessibility notes
- **@vergil-semantic annotations** for AI understanding
- **Usage examples** with copy-paste ready code
- **Props tables** with types and descriptions
- **Accessibility guidelines** built-in

### Hydration-Safe Animations
- Fixed random position issues in neural network particles
- Used deterministic calculations based on array indices
- Prevents server/client mismatch errors

## Repository Structure

```
vergil-design-system/
├── app/                    # Next.js app router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout with DocsLayout
│   ├── globals.css        # Global styles and animations
│   ├── components/        # Component documentation pages
│   └── ai-guide/          # AI usage guide
├── components/
│   ├── ui/                # Base UI components
│   ├── docs/              # Documentation components  
│   └── vergil/            # Vergil-specific components
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── tailwind.config.js     # Tailwind v4 configuration
└── next.config.mjs        # Next.js configuration
```

## Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production  
npm run start  # Start production server
```

## GitHub Repository

**URL**: https://github.com/VergilAI/brand-book
- Successfully initialized and pushed
- Ready for team collaboration
- CI/CD deployment ready

## How to Use This for Future Development

### For Developers
1. **Component Usage**: Import from documented paths
2. **Styling**: Use Tailwind classes + custom Vergil animations
3. **New Components**: Follow JSDoc + @vergil-semantic pattern
4. **Colors**: Use standard Tailwind colors (purple-600, violet-500, etc.)

### For AI Assistants (Claude Code)
1. **Component Discovery**: Read JSDoc comments and @vergil-semantic annotations
2. **Usage Patterns**: Copy examples from documentation pages
3. **Props Reference**: Use props tables for correct implementation
4. **Composition**: Follow established patterns for complex components

### Common Patterns to Follow

#### Button Implementation
```tsx
<Button variant="default" size="md" loading={false}>
  Click me
</Button>
```

#### Card Composition
```tsx
<Card variant="interactive">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

#### Neural Network Usage
```tsx
<NeuralNetwork animated={true} />
// Uses default configuration, fully self-contained
```

## Known Issues & Solutions

1. **Tailwind v4**: Must use correct import syntax and config format
2. **Hydration**: Fixed with deterministic animations
3. **Color Variables**: Use standard Tailwind classes, not CSS variables in classNames
4. **Build Errors**: Removed Prism.js to avoid SSR issues

## Next Steps for Development

1. **Add More Components**: Input, Select, Modal, Table, Navigation
2. **Implement Search**: Real cmd+k functionality
3. **Add Syntax Highlighting**: Reimplement Prism.js properly for SSR
4. **Create Foundation Pages**: Colors, Typography, Spacing documentation
5. **Add Component Variants**: Expand existing components
6. **Deploy**: Set up CI/CD for automatic deployment

## Living System Philosophy

The design system embodies "living" principles:
- Elements breathe and pulse with subtle animations
- Neural network patterns create organic connections  
- Gradients flow and shift naturally
- Everything responds to user interaction
- Interface feels intelligent and alive

This creates a perfect foundation for an AI orchestration platform that feels both powerful and approachable.

---

**Last Updated**: Initial commit to GitHub
**Repository**: https://github.com/VergilAI/brand-book
**Status**: Production-ready foundation, expandable for full design system