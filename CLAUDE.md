# Claude Code Project Memory: Vergil Brand Book

## Project Overview

I built a comprehensive brand book and design system documentation site for Vergil, an AI orchestration platform. This evolved from a basic design system into a complete brand book that serves as the definitive guide to Vergil's brand identity, visual language, and design principles.

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

2. **Iris Pattern** (`/components/vergil/iris-pattern.tsx`)
   - Multi-layered iris pattern representing consciousness and intelligence
   - 4 variants: default, cosmic, electric, synaptic
   - 4 sizes: sm, md, lg, xl
   - Staggered breathing animations with configurable timing
   - Represents window to intelligence, focus, and awakening

3. **Vergil Logo** (`/components/vergil/vergil-logo.tsx`)
   - Official logo component with multiple variants
   - Variants: logo, mark, wordmark, white, dark
   - Consistent sizing and animation support
   - Proper accessibility with variant-specific alt text

4. **Dynamic Logo** (`/components/vergil/dynamic-logo.tsx`)
   - Advanced logo component with color and animation effects
   - CSS filter-based color transformations (cosmic-purple, electric-violet, phosphor-cyan)
   - Gradient overlay support (consciousness, awakening, synaptic)
   - Multiple animation types (breathing, pulse, rotate, glow)
   - Used for logo demonstrations and creative variations

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

### Brand Book Pages Structure

#### App Router Pages (`/app/`)
- **Home** (`/app/page.tsx`) - Brand book landing page with logo, core values, and navigation
- **Brand Foundation** (`/app/brand/page.tsx`) - Brand overview and core values showcase
- **Brand Foundation Details** (`/app/brand/foundation/page.tsx`) - Mission, vision, brand personality, core values
- **Voice & Tone** (`/app/brand/voice-tone/page.tsx`) - Communication guidelines for different audiences

#### Visual Identity Section (`/app/visual/`)
- **Color System** (`/app/visual/colors/page.tsx`) - Complete color palette with copy functionality
- **Typography** (`/app/visual/typography/page.tsx`) - Font families, type scale with live examples
- **Logo Guidelines** (`/app/visual/logo/page.tsx`) - Logo usage, colored background strategy, variations

#### Design Elements Section (`/app/elements/`)
- **Iris Pattern** (`/app/elements/iris/page.tsx`) - Iris pattern documentation with variants and usage

#### Motion & Animation Section (`/app/motion/`)
- **Breathing Effects** (`/app/motion/breathing/page.tsx`) - Living design philosophy with animations

### Brand Design Tokens & Styling

#### Updated Color System (`/app/globals.css`)
```css
/* Primary Palette */
--cosmic-purple: #6366F1
--electric-violet: #A78BFA
--luminous-indigo: #818CF8

/* Accent Colors */
--phosphor-cyan: #10B981
--synaptic-blue: #3B82F6
--neural-pink: #F472B6

/* Foundation Colors */
--pure-light: #FFFFFF
--soft-light: #FAFAFA
--whisper-gray: #F8F9FA
--mist-gray: #E5E7EB
--stone-gray: #9CA3AF
--deep-space: #0F172A
```

#### Brand Animation System
- **breathing** - Subtle scale animation (1-1.03) with opacity (0.8-1) over 4s
- **pulse-glow** - Opacity pulse for highlights and focus states
- **gradient-shift** - Animated gradient background with position changes
- **synaptic-pulse** - Scale and opacity pulse for neural elements
- **neural-flow** - Stroke dash animation for connections
- **iris-pulse** - Multi-stage scale animation for iris patterns

#### Brand Gradient System
- **consciousness-gradient** - Purple to violet to indigo (135deg)
- **awakening-gradient** - Purple to blue (90deg)
- **synaptic-gradient** - Violet to pink (135deg)
- **light-ray-gradient** - Radial purple gradient for backgrounds
- **iris-pattern** - Multi-ring radial pattern for depth
- **neural-bg** - Multiple radial gradients for network backgrounds

## Key Technical Decisions

### Tailwind CSS v4 Migration
- **Critical**: This project uses Tailwind CSS v4, not v3
- Import syntax: `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Config is in `tailwind.config.js` (JavaScript, not TypeScript)
- Extended with custom brand colors, typography scale, and animations
- Custom font families: Inter (sans), Lato (display), Georgia (serif)

### Logo Strategy: Colored Background Approach
- **All logos are white by default** - this is intentional for the brand
- **Never place white logos on light backgrounds** - accessibility violation
- **Always use colored backgrounds**: dark (#0F172A), gradients, or brand colors
- **Logo files available**: vergil-logo.svg, vergil-mark.svg, vergil-wordmark.svg
- **No dark logo versions needed** - colored backgrounds solve the contrast issue

### Brand-Focused Documentation
Every component and brand element includes:
- **Comprehensive JSDoc** with examples, props, accessibility notes
- **@vergil-semantic annotations** for AI understanding
- **Usage examples** with copy-paste ready code
- **Brand usage guidelines** with do's and don'ts
- **Accessibility compliance** built-in (WCAG AA standards)
- **Real-world application examples** (headers, business cards, marketing)
- **Interactive demonstrations** with live previews

### Hydration-Safe Animations
- Fixed random position issues in neural network particles
- Used deterministic calculations based on array indices
- Prevents server/client mismatch errors

## Repository Structure

```
vergil-design-system/
├── app/                    # Next.js app router - Brand Book pages
│   ├── page.tsx           # Brand book homepage
│   ├── layout.tsx         # Root layout with updated navigation
│   ├── globals.css        # Brand design tokens and animations
│   ├── brand/             # Brand foundation pages
│   │   ├── page.tsx       # Brand overview
│   │   ├── foundation/    # Mission, vision, values
│   │   └── voice-tone/    # Communication guidelines
│   ├── visual/            # Visual identity system
│   │   ├── colors/        # Color system with palette
│   │   ├── typography/    # Typography with live examples
│   │   └── logo/          # Logo guidelines and strategy
│   ├── elements/          # Design elements
│   │   └── iris/          # Iris pattern documentation
│   └── motion/            # Animation and motion
│       └── breathing/     # Breathing effects guide
├── components/
│   ├── ui/                # Base UI components
│   ├── docs/              # Documentation components  
│   └── vergil/            # Brand-specific components
│       ├── neural-network.tsx    # Network visualization
│       ├── iris-pattern.tsx      # Iris pattern component
│       ├── vergil-logo.tsx       # Official logo component
│       └── dynamic-logo.tsx      # Advanced logo with effects
├── public/
│   └── logos/             # Logo assets
│       ├── vergil-logo.svg       # Primary logo (white)
│       ├── vergil-logo.png       # Primary logo PNG
│       ├── vergil-mark.svg       # Logo mark only (white)
│       ├── vergil-mark.png       # Logo mark PNG
│       ├── vergil-wordmark.svg   # Wordmark only (white)
│       └── vergil-wordmark.png   # Wordmark PNG
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── tailwind.config.js     # Tailwind v4 with brand tokens
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

### For Brand Consistency
1. **Logo Usage**: Always use white logos on colored backgrounds (dark, gradients)
2. **Color Palette**: Use the new brand color names (cosmic-purple, electric-violet, etc.)
3. **Typography**: Follow the established scale with Inter/Lato font families
4. **Animations**: Use breathing effects and living design principles

### For Developers
1. **Logo Implementation**: Use VergilLogo or DynamicLogo components
2. **Color Usage**: Reference the updated color system with proper contrast
3. **Brand Elements**: Use IrisPattern for background elements
4. **Animations**: Apply breathing class for living system effects

### For AI Assistants (Claude Code)
1. **Brand Guidelines**: Always check logo contrast and background requirements
2. **Component Usage**: Use documented brand components for consistency
3. **Color Application**: Follow the accessibility-first approach
4. **Motion Design**: Incorporate breathing animations for brand consistency

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
2. **Hydration**: Fixed with deterministic animations in neural network
3. **Logo Contrast**: CRITICAL - Never place white logos on light backgrounds
4. **Color Implementation**: Use inline styles for color filters when needed
5. **Font Loading**: Custom typography sizes may need inline style fallbacks
6. **Accessibility**: All brand elements maintain WCAG AA contrast standards

## Next Steps for Development

1. **Complete Brand Guidelines**: Finish remaining sections (application examples, digital guidelines)
2. **Logo Asset Creation**: Consider creating dark logo versions if needed for specific use cases
3. **Brand Component Library**: Expand Vergil-specific components
4. **Marketing Templates**: Create templates using the brand guidelines
5. **Team Resources**: Add downloadable brand assets and guidelines
6. **Deploy Brand Book**: Set up CI/CD for team access

## Living System Philosophy

The design system embodies "living" principles:
- Elements breathe and pulse with subtle animations
- Neural network patterns create organic connections  
- Gradients flow and shift naturally
- Everything responds to user interaction
- Interface feels intelligent and alive

This creates a perfect foundation for an AI orchestration platform that feels both powerful and approachable.

---

**Last Updated**: Completed brand book with logo strategy and full visual identity
**Repository**: https://github.com/VergilAI/brand-book
**Status**: Complete brand book ready for team use, with comprehensive logo guidelines and colored background strategy