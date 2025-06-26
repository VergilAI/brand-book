# Brand Book Module

## Overview

The Vergil Brand Book is a comprehensive design system documentation site that serves as the definitive guide to Vergil's brand identity, visual language, and design principles. It embodies the "living intelligence" philosophy through breathing animations and organic interactions.

## Module Structure

```
app/brand/
├── page.tsx            # Brand book home
├── brand/              # Brand foundation
│   ├── foundation/     # Mission, vision, values
│   └── voice-tone/     # Communication guidelines
├── visual/             # Visual identity
│   ├── colors/         # Color system
│   ├── typography/     # Font system
│   └── logo/           # Logo guidelines
├── elements/           # Design elements
│   ├── iris/           # Iris pattern docs
│   ├── iris-rays/      # Iris rays visualization
│   ├── graph/          # Basic graph
│   ├── graph-constellation/  # Advanced graph
│   └── heatmap/        # Heatmap components
├── motion/             # Animation system
│   ├── breathing/      # Living system effects
│   └── streamgraph/    # Streamgraph animations
├── components/         # Component demos
│   ├── button/         # Button variations
│   └── landing/        # Landing components
├── demo/               # Interactive demos
│   ├── hero/           # Hero section demo
│   └── test-heatmap/   # Heatmap testing
└── layout.tsx          # Brand book layout

Related components in:
- /components/vergil/   # Brand-specific components
- /components/docs/     # Documentation components
```

## Key Brand Elements

### 1. Color System
```css
/* Primary Palette */
--cosmic-purple: #6366F1
--electric-violet: #A78BFA
--luminous-indigo: #818CF8

/* Accent Colors */
--phosphor-cyan: #10B981
--synaptic-blue: #3B82F6
--neural-pink: #F472B6

/* Foundation */
--deep-space: #0F172A
--pure-light: #FFFFFF
```

### 2. Typography
- **Sans**: Inter (body text)
- **Display**: Lato (headings)
- **Serif**: Georgia (quotes)

### 3. Logo Usage
- **CRITICAL**: All logos are white - always use on dark/colored backgrounds
- Never place white logos on light backgrounds
- Available: vergil-logo.svg, vergil-mark.svg, vergil-wordmark.svg

### 4. Living System Animations
- `breathing` - Subtle scale (1-1.03) with opacity
- `pulse-glow` - Opacity pulse for highlights
- `gradient-shift` - Animated gradient backgrounds
- `synaptic-pulse` - Neural element animations

## Brand Components

### Neural Network (`/components/vergil/neural-network.tsx`)
- SVG-based visualization with animated connections
- Floating particles with deterministic positioning
- Default configuration included

### Iris Pattern (`/components/vergil/iris-pattern.tsx`)
- Multi-layered pattern representing consciousness
- Variants: default, cosmic, electric, synaptic
- Sizes: sm, md, lg, xl
- Breathing animations

### Graph Constellation Persistent (`/components/vergil/graph-constellation-persistent.tsx`)
- Advanced interactive graph with staged animations
- Floating "petals on water" motion
- Hover interactions with connected node highlighting
- See detailed implementation docs in component

## Usage Guidelines

### For Brand Consistency
1. Always use white logos on colored backgrounds
2. Apply breathing animations for living feel
3. Use brand color tokens consistently
4. Follow established typography scale

### For Developers
1. Use VergilLogo or DynamicLogo components
2. Reference color system with proper contrast
3. Apply IrisPattern for backgrounds
4. Use GraphConstellationPersistent for data viz

## Common Patterns

```tsx
// Logo usage
<VergilLogo variant="logo" className="w-32" />

// Card with breathing
<Card variant="interactive">
  <CardContent>...</CardContent>
</Card>

// Iris background
<IrisPattern variant="cosmic" size="lg" />

// Graph visualization
<GraphConstellationPersistent
  data={graphData}
  currentStage={0}
  width={1200}
  height={500}
/>
```

## Living System Philosophy

The brand book embodies "living" design:
- Elements breathe and pulse subtly
- Neural patterns create organic connections
- Gradients flow naturally
- Everything responds to interaction
- Interface feels intelligent and alive