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

5. **Graph Constellation** (`/components/vergil/graph-constellation.tsx`)
   - Interactive D3.js-based graph visualization
   - Support for basic animated graph display
   - Force simulation with customizable physics

6. **Graph Constellation Persistent** (`/components/vergil/graph-constellation-persistent.tsx`)
   - **Advanced Interactive Graph System** - Sophisticated staged animation system with persistent state
   - **Floating Motion System** - Organic "petals on water" floating motion for all nodes
   - **Smart Hover Interactions** - Active view highlighting with smooth transitions
   - **Stage-based Animation** - Progressive revelation of graph elements across stages
   - **Smooth Transition Management** - Eliminates jarring movements between interaction states

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
- **Graph Constellation** (`/app/elements/graph-constellation/page.tsx`) - Interactive graph system documentation and demos

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
│   │   ├── iris/          # Iris pattern documentation
│   │   └── graph-constellation/ # Graph system documentation
│   └── motion/            # Animation and motion
│       └── breathing/     # Breathing effects guide
├── components/
│   ├── ui/                # Base UI components
│   ├── docs/              # Documentation components  
│   └── vergil/            # Brand-specific components
│       ├── neural-network.tsx    # Network visualization
│       ├── iris-pattern.tsx      # Iris pattern component
│       ├── vergil-logo.tsx       # Official logo component
│       ├── dynamic-logo.tsx      # Advanced logo with effects
│       ├── graph-constellation.tsx # Basic graph component
│       └── graph-constellation-persistent.tsx # Advanced graph system
├── public/
│   ├── logos/             # Logo assets
│   │   ├── vergil-logo.svg       # Primary logo (white)
│   │   ├── vergil-logo.png       # Primary logo PNG
│   │   ├── vergil-mark.svg       # Logo mark only (white)
│   │   ├── vergil-mark.png       # Logo mark PNG
│   │   ├── vergil-wordmark.svg   # Wordmark only (white)
│   │   └── vergil-wordmark.png   # Wordmark PNG
│   └── data/              # Graph data files
│       ├── graph-animated.json   # Basic animated graph data
│       └── graph-staged.json     # Staged animation graph data
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

# Graph Constellation Persistent Animation System - Implementation Report

## Overview

This document provides a complete technical specification for the Graph Constellation Persistent Animation System, a React/D3.js component that displays an interactive graph with staged animations, smooth floating motion ("petals on water" effect), and sophisticated hover interactions.

## Core Features

### 1. **Staged Animation System**
- Nodes and relationships appear progressively across multiple stages
- Each element has `animationStage`, `animationOrder`, and optional `animationDelay` properties
- Forward navigation shows smooth entrance animations
- Backward navigation shows elements immediately without animation
- Relationships only appear after both connected nodes are visible

### 2. **Floating Motion System**
- All visible nodes exhibit smooth, organic floating motion when not being interacted with
- Sinusoidal movement patterns with individual phase offsets create natural, non-synchronized motion
- Boundary-aware movement prevents nodes from drifting off-canvas
- Motion pauses during hover/drag interactions and resumes smoothly afterward

### 3. **Interactive Hover System**
- **Active View**: Hovering highlights the hovered node, its direct connections, and their relationships
- **Visual Hierarchy**: Non-connected elements fade to low opacity (20% for nodes, 10% for relationships)
- **Smooth Transitions**: 300ms fade-in, 400ms fade-out with easing
- **Size Changes**: Subtle node growth (radius 20→24) on hover

### 4. **Smooth Transition Management**
- Progressive smoothing prevents jarring movements when transitioning between states
- 1-second transition periods with interpolation from very gentle (2%) to normal (10%) smoothing
- Eliminates "jiggle" effects when resuming floating motion after interactions

## Technical Architecture

### Component Structure
```typescript
interface GraphConstellationPersistentProps {
  data: GraphData
  width?: number
  height?: number
  currentStage: number
  stageDuration?: number
  onStageComplete?: (stage: number) => void
  initialSettings?: Partial<DisplaySettings>
}
```

### Key Data Structures

#### Node Interface
```typescript
interface GraphNode {
  id: string
  label: string
  type: string
  properties: Record<string, any>
  position: { x: number | null, y: number | null, fixed: boolean }
  
  // Animation properties
  animationStage?: number  // Which stage this node appears in (0, 1, 2, etc.)
  animationOrder?: number  // Order within the stage
  animationDelay?: number  // Additional delay within stage
  
  // D3 properties (managed internally)
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  vx?: number
  vy?: number
}
```

#### Relationship Interface
```typescript
interface GraphRelationship {
  id: string
  source: string | GraphNode
  target: string | GraphNode
  type: string
  properties: Record<string, any>
  
  // Animation properties
  animationStage?: number
  animationOrder?: number
  animationDelay?: number
}
```

#### Floating State Management
```typescript
interface FloatingState {
  baseX: number        // Stable center point for floating
  baseY: number        // Stable center point for floating
  offsetX: number      // Current floating offset
  offsetY: number      // Current floating offset
  phaseX: number       // Random phase offset for X movement
  phaseY: number       // Random phase offset for Y movement
  amplitudeX: number   // Movement amplitude for X (6-14 pixels)
  amplitudeY: number   // Movement amplitude for Y (6-14 pixels)
}
```

### Core State Management

#### Essential Refs
```typescript
const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null)
const currentStageRef = useRef<number>(currentStage)  // Prevents stale closures
const floatingMotionRef = useRef<NodeJS.Timeout | null>(null)
const isHoveredRef = useRef<boolean>(false)
const workingNodesRef = useRef<GraphNode[]>([])
const motionTimeRef = useRef<number>(0)
const transitionStartTimeRef = useRef<number>(0)
const isTransitioningRef = useRef<boolean>(false)
const nodeFloatingStatesRef = useRef<Map<string, FloatingState>>(new Map())
```

#### Element References
```typescript
const elementsRef = useRef<{
  allNodeGroups?: d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>
  allLinks?: d3.Selection<SVGLineElement, GraphRelationship, SVGGElement, unknown>
  allLinkLabels?: d3.Selection<SVGTextElement, GraphRelationship, SVGGElement, unknown>
  setupHoverHandlers?: (currentStage: number) => void
}>({})
```

## Implementation Details

### 1. Floating Motion Algorithm

#### Core Motion Calculation
```typescript
const applyFloatingMotion = useCallback(() => {
  if (!simulationRef.current || isHoveredRef.current || workingNodesRef.current.length === 0) {
    return
  }

  // Stop D3 force simulation
  const simulation = simulationRef.current
  simulation.alpha(0).stop()

  // Increment global time
  motionTimeRef.current += 0.02

  nodes.forEach(node => {
    // Only apply to visible nodes
    if ((node.animationStage ?? 0) <= currentStageRef.current && node.x !== undefined && node.y !== undefined) {
      
      // Initialize floating state if needed
      if (!nodeFloatingStatesRef.current.has(node.id)) {
        nodeFloatingStatesRef.current.set(node.id, {
          baseX: node.x,
          baseY: node.y,
          offsetX: 0,
          offsetY: 0,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          amplitudeX: 6 + Math.random() * 8,  // 6-14 pixel range
          amplitudeY: 6 + Math.random() * 8
        })
      }

      const floatingState = nodeFloatingStatesRef.current.get(node.id)!
      
      // Calculate sinusoidal movement
      const timeX = motionTimeRef.current + floatingState.phaseX
      const timeY = motionTimeRef.current + floatingState.phaseY
      
      const newOffsetX = Math.sin(timeX * 1.0) * floatingState.amplitudeX
      const newOffsetY = Math.sin(timeY * 0.8) * floatingState.amplitudeY
      
      // Add gentle drift
      const driftX = Math.sin(timeX * 0.15) * 1.0
      const driftY = Math.cos(timeY * 0.12) * 1.0
      
      // Calculate target position
      let targetX = floatingState.baseX + newOffsetX + driftX
      let targetY = floatingState.baseY + newOffsetY + driftY
      
      // Boundary enforcement with gentle reflection
      const margin = 30
      if (targetX < margin) {
        floatingState.baseX = Math.min(floatingState.baseX + 1, width / 2)
        targetX = floatingState.baseX + newOffsetX
      }
      // ... similar for other boundaries
      
      // Apply smooth interpolation with transition handling
      let smoothing = 0.1
      if (isTransitioningRef.current) {
        const transitionDuration = 1000
        const elapsed = motionTimeRef.current - transitionStartTimeRef.current
        const progress = Math.min(elapsed / (transitionDuration * 0.02), 1)
        smoothing = 0.02 + (0.08 * progress)  // 0.02 → 0.1
        
        if (progress >= 1) {
          isTransitioningRef.current = false
        }
      }
      
      node.x = node.x + (targetX - node.x) * smoothing
      node.y = node.y + (targetY - node.y) * smoothing
    }
  })

  // Update visual positions
  if (elementsRef.current.allNodeGroups) {
    elementsRef.current.allNodeGroups
      .filter((d: GraphNode) => (d.animationStage ?? 0) <= currentStageRef.current)
      .attr('transform', (d: GraphNode) => `translate(${d.x ?? 0},${d.y ?? 0}) scale(1)`)
  }

  // Update relationship positions
  if (elementsRef.current.allLinks) {
    elementsRef.current.allLinks
      .attr('x1', d => (d.source as GraphNode).x ?? 0)
      .attr('y1', d => (d.source as GraphNode).y ?? 0)
      .attr('x2', d => (d.target as GraphNode).x ?? 0)
      .attr('y2', d => (d.target as GraphNode).y ?? 0)
  }
}, [width, height])
```

### 2. Hover Interaction System

#### Active View Implementation
```typescript
const setupHoverHandlers = (currentStageValue: number) => {
  allNodeGroups
    .on('mouseover', function(event, d) {
      // Stop floating motion
      isHoveredRef.current = true
      if (floatingMotionRef.current) {
        clearInterval(floatingMotionRef.current)
        floatingMotionRef.current = null
      }
      
      // Reactivate D3 force simulation
      simulationRef.current?.alpha(0.1).restart()
      
      // Subtle size increase
      d3.select(this).select('circle')
        .transition()
        .duration(150)
        .attr('r', 24)

      // Build connected node set
      const connectedNodeIds = new Set([d.id])
      data.relationships.forEach(rel => {
        const sourceId = typeof rel.source === 'string' ? rel.source : rel.source
        const targetId = typeof rel.target === 'string' ? rel.target : rel.target
        
        if (sourceId === d.id) connectedNodeIds.add(targetId)
        else if (targetId === d.id) connectedNodeIds.add(sourceId)
      })

      // Apply active view to nodes
      allNodeGroups
        .transition()
        .duration(300)
        .ease(d3.easeCubicInOut)
        .style('opacity', (node: GraphNode) => {
          const isVisible = (node.animationStage ?? 0) <= currentStageValue
          if (!isVisible) return 0
          return connectedNodeIds.has(node.id) ? 1 : 0.2
        })

      // Apply active view to relationships
      allLinks.each(function(l) {
        const sourceId = (l.source as GraphNode).id
        const targetId = (l.target as GraphNode).id
        const isDirectlyConnected = sourceId === d.id || targetId === d.id
        
        // Check visibility
        const sourceNode = data.nodes.find(n => n.id === sourceId)
        const targetNode = data.nodes.find(n => n.id === targetId)
        const isVisible = (l.animationStage ?? 0) <= currentStageValue && 
                          (sourceNode?.animationStage ?? 0) <= currentStageValue && 
                          (targetNode?.animationStage ?? 0) <= currentStageValue
        
        const opacity = isVisible ? (isDirectlyConnected ? 1 : 0.1) : 0
        
        d3.select(this)
          .transition()
          .duration(300)
          .ease(d3.easeCubicInOut)
          .style('opacity', opacity)
      })
    })
    .on('mouseout', function(event, d) {
      // Resume floating motion with smooth transition
      isHoveredRef.current = false
      setTimeout(() => {
        if (!isHoveredRef.current) {
          // Reset all node positions and floating states
          setTimeout(() => {
            workingNodesRef.current.forEach(node => {
              if ((node.animationStage ?? 0) <= currentStageValue) {
                const floatingState = nodeFloatingStatesRef.current.get(node.id)
                if (floatingState) {
                  floatingState.baseX = node.x
                  floatingState.baseY = node.y
                  floatingState.offsetX = 0
                  floatingState.offsetY = 0
                } else {
                  // Create missing state
                  nodeFloatingStatesRef.current.set(node.id, {
                    baseX: node.x,
                    baseY: node.y,
                    offsetX: 0,
                    offsetY: 0,
                    phaseX: Math.random() * Math.PI * 2,
                    phaseY: Math.random() * Math.PI * 2,
                    amplitudeX: 6 + Math.random() * 8,
                    amplitudeY: 6 + Math.random() * 8
                  })
                }
                
                // Clear fixed positioning
                node.fx = null
                node.fy = null
              }
            })
          }, 50)
          
          // Start smooth transition back to floating
          if (floatingMotionRef.current) {
            clearInterval(floatingMotionRef.current)
          }
          isTransitioningRef.current = true
          transitionStartTimeRef.current = motionTimeRef.current
          floatingMotionRef.current = setInterval(applyFloatingMotion, 50)
        }
      }, 500)
      
      // Reset visual elements
      d3.select(this).select('circle')
        .transition()
        .duration(150)
        .attr('r', 20)

      allNodeGroups
        .transition()
        .duration(400)
        .ease(d3.easeCubicInOut)
        .style('opacity', (node: GraphNode) => {
          return (node.animationStage ?? 0) <= currentStageValue ? 1 : 0
        })

      allLinks
        .transition()
        .duration(400)
        .ease(d3.easeCubicInOut)
        .style('opacity', l => (l.animationStage ?? 0) <= currentStageValue ? 0.6 : 0)
    })
}
```

### 3. Staged Animation System

#### Stage Transition Logic
```typescript
const updateStageVisibility = useCallback(() => {
  const { allNodeGroups, allLinks, allLinkLabels } = elementsRef.current
  const isGoingBackwards = currentStage < previousStageRef.current
  
  // Update previous stage reference
  previousStageRef.current = currentStage

  // Update hover handlers with current stage
  if (elementsRef.current.setupHoverHandlers) {
    elementsRef.current.setupHoverHandlers(currentStage)
  }

  // Handle initial visibility
  if (allNodeGroups) {
    if (isGoingBackwards) {
      // Show all nodes up to current stage immediately
      allNodeGroups.style('opacity', (d: GraphNode) => 
        (d.animationStage ?? 0) <= currentStage ? 1 : 0)
    } else {
      // Hide current stage nodes initially (they'll animate in)
      allNodeGroups.style('opacity', (d: GraphNode) => 
        (d.animationStage ?? 0) < currentStage ? 1 : 0)
    }
  }

  // Set relationship visibility (only previous stages initially)
  if (allLinks) {
    allLinks.style('opacity', (d: GraphRelationship) => {
      const sourceNode = data.nodes.find(n => n.id === (typeof d.source === 'string' ? d.source : d.source.id))
      const targetNode = data.nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id))
      const sourceStage = sourceNode?.animationStage ?? 0
      const targetStage = targetNode?.animationStage ?? 0
      const relStage = d.animationStage ?? 0
      
      return relStage < currentStage && sourceStage <= currentStage && targetStage <= currentStage ? 0.6 : 0
    })
  }

  // Skip animation when going backwards
  if (isGoingBackwards) {
    if (allNodeGroups) {
      allNodeGroups.style('opacity', (d: GraphNode) => (d.animationStage ?? 0) <= currentStage ? 1 : 0)
    }
    return
  }

  // Animate current stage elements
  const currentStageNodes = data.nodes.filter(n => (n.animationStage ?? 0) === currentStage)
  const currentStageRelationships = data.relationships.filter(r => (r.animationStage ?? 0) === currentStage)

  const sortedNodes = [...currentStageNodes].sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))
  const sortedRelationships = [...currentStageRelationships].sort((a, b) => (a.animationOrder || 0) - (b.animationOrder || 0))

  const stepDuration = stageDuration / Math.max(sortedNodes.length + sortedRelationships.length, 1)

  // Animate nodes
  sortedNodes.forEach((node, i) => {
    const delay = (node.animationDelay || 0) + (node.animationOrder || i) * stepDuration
    
    setTimeout(() => {
      allNodeGroups
        .filter((d: GraphNode) => d.id === node.id)
        .transition()
        .duration(300)
        .style('opacity', 1)
        .attr('transform', function(d) {
          return `translate(${(d as GraphNode).x ?? 0},${(d as GraphNode).y ?? 0}) scale(1)`
        })
        .ease(d3.easeBackOut.overshoot(1.5))
    }, delay)
  })

  // Animate relationships (only after connected nodes are visible)
  sortedRelationships.forEach((rel, i) => {
    const sourceNode = data.nodes.find(n => n.id === rel.source)
    const targetNode = data.nodes.find(n => n.id === rel.target)
    const sourceStage = sourceNode?.animationStage ?? 0
    const targetStage = targetNode?.animationStage ?? 0
    
    if (sourceStage <= currentStage && targetStage <= currentStage) {
      // Calculate delay based on latest connected node animation
      let latestNodeDelay = 0
      
      if (sourceStage === currentStage) {
        const sourceNodeIndex = sortedNodes.findIndex(n => n.id === sourceNode?.id)
        if (sourceNodeIndex >= 0) {
          latestNodeDelay = Math.max(latestNodeDelay, 
            (sourceNode?.animationDelay || 0) + (sourceNode?.animationOrder || sourceNodeIndex) * stepDuration + 300)
        }
      }
      
      if (targetStage === currentStage) {
        const targetNodeIndex = sortedNodes.findIndex(n => n.id === targetNode?.id)
        if (targetNodeIndex >= 0) {
          latestNodeDelay = Math.max(latestNodeDelay, 
            (targetNode?.animationDelay || 0) + (targetNode?.animationOrder || targetNodeIndex) * stepDuration + 300)
        }
      }
      
      const relationshipDelay = latestNodeDelay + (rel.animationDelay || 0) + (rel.animationOrder || i) * (stepDuration * 0.5)
      
      setTimeout(() => {
        allLinks
          .filter((d: GraphRelationship) => d.id === rel.id)
          .transition()
          .duration(200)
          .style('opacity', 0.6)
          .ease(d3.easeQuadOut)
      }, relationshipDelay)
    }
  })
}, [data, currentStage, stageDuration])
```

### 4. Critical Implementation Notes

#### Avoiding Stale Closures
```typescript
// WRONG - causes stale closure issues
const applyFloatingMotion = useCallback(() => {
  // Using currentStage directly here captures stale values
  nodes.forEach(node => {
    if (node.animationStage <= currentStage) { /* ... */ }
  })
}, [currentStage]) // This causes the callback to recreate with stale values

// RIGHT - using refs to avoid stale closures
const currentStageRef = useRef<number>(currentStage)
useEffect(() => {
  currentStageRef.current = currentStage
}, [currentStage])

const applyFloatingMotion = useCallback(() => {
  nodes.forEach(node => {
    if (node.animationStage <= currentStageRef.current) { /* ... */ }
  })
}, [width, height]) // currentStage removed from dependencies
```

#### Position Synchronization
```typescript
// After drag ends, ensure floating state matches final position
.on('end', (event, d) => {
  const finalX = d.fx
  const finalY = d.fy
  
  // Update floating state immediately
  const floatingState = nodeFloatingStatesRef.current.get(d.id)
  if (floatingState && finalX !== null && finalY !== null) {
    floatingState.baseX = finalX
    floatingState.baseY = finalY
    floatingState.offsetX = 0
    floatingState.offsetY = 0
  }
  
  // Update D3 node position
  d.x = finalX
  d.y = finalY
})
```

#### Transition Management
```typescript
// Start smooth transition when resuming floating motion
const startTransition = () => {
  isTransitioningRef.current = true
  transitionStartTimeRef.current = motionTimeRef.current
}

// In floating motion: progressive smoothing
if (isTransitioningRef.current) {
  const elapsed = motionTimeRef.current - transitionStartTimeRef.current
  const progress = Math.min(elapsed / (1000 * 0.02), 1)
  smoothing = 0.02 + (0.08 * progress)  // 2% → 10% over 1 second
  
  if (progress >= 1) {
    isTransitioningRef.current = false
  }
}
```

## Data Format Requirements

### Graph Data Structure
```json
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "Display Name",
      "type": "node_type",
      "animationStage": 0,
      "animationOrder": 1,
      "animationDelay": 200,
      "properties": {},
      "position": { "x": null, "y": null, "fixed": false }
    }
  ],
  "relationships": [
    {
      "id": "unique_rel_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "type": "relationship_type",
      "animationStage": 0,
      "animationOrder": 2,
      "properties": {}
    }
  ],
  "metadata": {
    "version": "1.0",
    "stages": [
      {
        "stage": 0,
        "title": "Stage Title",
        "description": "Stage description"
      }
    ]
  }
}
```

## Performance Considerations

### Optimization Strategies
1. **50ms Animation Interval**: Balance between smoothness and performance
2. **Conditional Updates**: Only update visual elements for visible nodes
3. **Ref-based State**: Avoid unnecessary re-renders from stale closures
4. **Throttled Debugging**: Log only every ~100 frames to prevent console spam
5. **Boundary Caching**: Cache boundary calculations to reduce repeated math

### Memory Management
```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    if (floatingMotionRef.current) {
      clearInterval(floatingMotionRef.current)
    }
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current)
    }
  }
}, [])
```

## Usage Example

```tsx
<GraphConstellationPersistent
  data={graphData}
  width={1200}
  height={500}
  currentStage={currentStage}
  stageDuration={2000}
  onStageComplete={(stage) => console.log(`Stage ${stage} complete`)}
  initialSettings={{
    showNodeLabels: true,
    showRelationshipLabels: false,
    showControls: false
  }}
/>
```

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
5. **Graph Visualizations**: Use GraphConstellationPersistent for advanced interactive graphs

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

#### Graph Constellation Usage
```tsx
<GraphConstellationPersistent
  data={stagedData}
  width={1200}
  height={500}
  currentStage={currentStage}
  stageDuration={2000}
  onStageComplete={(stage) => console.log(`Stage ${stage} complete`)}
  initialSettings={{
    showNodeLabels: true,
    showRelationshipLabels: false,
    showControls: false
  }}
/>
```

## Known Issues & Solutions

1. **Tailwind v4**: Must use correct import syntax and config format
2. **Hydration**: Fixed with deterministic animations in neural network
3. **Logo Contrast**: CRITICAL - Never place white logos on light backgrounds
4. **Color Implementation**: Use inline styles for color filters when needed
5. **Font Loading**: Custom typography sizes may need inline style fallbacks
6. **Accessibility**: All brand elements maintain WCAG AA contrast standards
7. **Stale Closures**: Use refs for values that change in useCallback dependencies
8. **Position Synchronization**: Ensure floating states match D3 positions after interactions

## SHADCN/UI INTEGRATION PLAN

### Overview
Port the entire Vergil Design System to use shadcn/ui as the foundational component library while maintaining all brand-specific customizations, tokens, and the "living intelligence" philosophy.

### Phase 1: Foundation Setup (shadcn/ui Installation & Configuration)

#### 1.1 Install shadcn/ui
```bash
npx shadcn@latest init
```

#### 1.2 Configure shadcn/ui with Vergil Brand Tokens
- **File**: `components.json`
  - Set custom CSS variables for Vergil color system
  - Configure Radix color scales to match brand palette
  - Set up custom radius, typography, and spacing tokens

#### 1.3 Update Tailwind Configuration
- **File**: `tailwind.config.js`
  - Extend shadcn/ui theme with Vergil brand tokens
  - Maintain custom animations (breathing, pulse-glow, gradient-shift)
  - Preserve custom utilities (.consciousness-gradient, .brand-card)
  - Add shadcn/ui color system integration

#### 1.4 CSS Variables Integration
- **File**: `app/globals.css`
  - Map Vergil color tokens to shadcn/ui CSS variables
  - Maintain existing custom properties
  - Add shadcn/ui base styles with brand overrides

### Phase 2: Core Component Migration

#### 2.1 Button Component Enhancement
- **Current**: `/components/ui/button.tsx` (CVA-based)
- **Action**: Replace with shadcn/ui Button + Vergil customizations
- **Additions**:
  - Vergil brand variants (cosmic, electric, synaptic)
  - Living system animations (breathing effect)
  - Loading states with Vergil spinner
  - Neural glow effects for interactive states

#### 2.2 Card Component Migration
- **Current**: `/components/ui/card.tsx`
- **Action**: Use shadcn/ui Card as base + brand enhancements
- **Additions**:
  - Neural variant with network background
  - Interactive breathing animations
  - Consciousness gradient borders
  - Iris pattern backgrounds

#### 2.3 Expand Core Component Library
Add shadcn/ui components with Vergil brand integration:

**Essential Components** (Phase 2A):
- **Badge** - With Vergil color variants and animations
- **Alert** - Living system alerts with breathing effects
- **Avatar** - With Iris pattern placeholders
- **Separator** - Neural connection styling
- **Skeleton** - Consciousness-themed loading states

**Form Components** (Phase 2B):
- **Input** - Synaptic focus states and neural borders
- **Textarea** - Multi-line with living resize animations
- **Select** - Dropdown with consciousness gradient
- **Checkbox/Radio** - Iris-inspired selection states
- **Switch** - Neural toggle with electric animations
- **Label** - Phosphor glow on focus

**Navigation Components** (Phase 2C):
- **NavigationMenu** - Enhanced docs navigation
- **Breadcrumb** - Neural path visualization
- **Tabs** - Synaptic transition animations
- **Pagination** - Consciousness flow design

### Phase 3: Advanced Component System

#### 3.1 Data Display Components
- **Table** - Neural grid system with hover effects
- **Command** - AI-inspired command palette (cmd+k)
- **Dialog/Sheet** - Consciousness-themed modals
- **Popover/Tooltip** - Living information overlays
- **Collapsible** - Breathing expand/collapse animations

#### 3.2 Feedback Components
- **Toast** - Neural notification system
- **Progress** - Synaptic loading animations
- **Sonner** - Advanced toast system with brand integration

#### 3.3 Layout Components
- **ScrollArea** - Custom scrollbars with brand styling
- **Resizable** - Neural split panels
- **AspectRatio** - Responsive brand element containers

### Phase 4: Vergil Brand Integration

#### 4.1 Enhanced Vergil Components
Upgrade existing brand components to use shadcn/ui primitives:

**Neural Network** (`/components/vergil/neural-network.tsx`):
- Use shadcn/ui's accessibility patterns
- Enhanced with Popover for node information
- Command integration for network search
- Dialog for network configuration

**Iris Pattern** (`/components/vergil/iris-pattern.tsx`):
- Badge integration for pattern labels
- Tooltip explanations for consciousness states
- Avatar integration for user representations
- Progress indicators for awakening levels

**Vergil Logo** (`/components/vergil/vergil-logo.tsx`):
- Button variants for logo interactions
- Popover for logo guidelines
- Avatar integration for compact representations

**Graph Constellation Persistent** (`/components/vergil/graph-constellation-persistent.tsx`):
- Enhanced with shadcn/ui Dialog for node details
- Command palette for graph search and navigation
- Tooltip system for relationship information
- Progress indicators for animation stages

#### 4.2 Brand-Specific Components
Create new Vergil components using shadcn/ui primitives:

**ConsciousnessCard** - Advanced Card with:
- Iris pattern backgrounds
- Neural network overlays  
- Breathing animations
- Synaptic border effects

**SynapticInput** - Enhanced Input with:
- Neural focus animations
- Electric border states
- Phosphor glow effects
- AI-inspired placeholders

**AwakeningProgress** - Custom Progress with:
- Consciousness gradient fills
- Breathing pulse animations
- Intelligence level indicators
- Neural pathway visualization

**NeuralDialog** - Enhanced Dialog with:
- Iris pattern overlays
- Synaptic entrance animations
- Consciousness-themed backgrounds
- Living system transitions

### Phase 5: Documentation & Brand Book Enhancement

#### 5.1 Component Documentation Pages
Create comprehensive shadcn/ui + Vergil documentation:

- **`/app/components/`** - Root component library section
- **`/app/components/ui/`** - Core shadcn/ui components with brand
- **`/app/components/vergil/`** - Brand-specific component showcase
- **`/app/components/forms/`** - Form component patterns
- **`/app/components/data/`** - Data display components
- **`/app/components/feedback/`** - User feedback components

#### 5.2 Enhanced Interactive Previews
- **ComponentPreview** upgrades with live code editing
- **Interactive Playground** for component customization
- **Brand Token Visualizer** showing shadcn/ui + Vergil integration
- **Animation Showcase** for living system effects

#### 5.3 Usage Guidelines
- **Component Composition Patterns** with shadcn/ui + Vergil
- **Brand Application Examples** using enhanced components
- **Accessibility Best Practices** with shadcn/ui integration
- **Performance Guidelines** for animated components

### Phase 6: Design Token System

#### 6.1 Token Management
- **Style Dictionary Integration** for systematic token management
- **CSS Variable Mapping** between Vergil tokens and shadcn/ui
- **TypeScript Token Types** for type-safe design system
- **Token Documentation** with interactive examples

#### 6.2 Theme System
- **Dark/Light Mode** support with brand integrity
- **Contrast Variants** maintaining accessibility
- **Animation Preferences** respecting user motion settings
- **Brand Intensity Levels** (subtle, moderate, full)

### Phase 7: Advanced Features

#### 7.1 AI-Enhanced Components
- **Smart Form Validation** with neural feedback
- **Predictive Input** with consciousness-themed suggestions
- **Adaptive Layouts** responding to user behavior
- **Living Data Visualization** with breathing animations

#### 7.2 Advanced Animations
- **Staggered Animations** for component groups
- **Gesture Recognition** for tablet/mobile interactions
- **Sound Design Integration** (optional audio feedback)
- **Haptic Feedback** for supported devices

### Implementation Strategy

#### Technical Approach
1. **Incremental Migration** - Replace components one by one
2. **Backward Compatibility** - Maintain existing API surfaces
3. **Brand Preservation** - All Vergil characteristics retained
4. **Performance Optimization** - Tree-shaking and lazy loading
5. **Type Safety** - Full TypeScript integration

#### Quality Assurance
1. **Visual Regression Testing** - Ensure brand consistency
2. **Accessibility Auditing** - WCAG AA compliance maintained
3. **Performance Monitoring** - Animation impact assessment
4. **Cross-Browser Testing** - Living system compatibility
5. **Mobile Optimization** - Responsive brand experience

#### Timeline Estimation
- **Phase 1-2**: 2-3 weeks (Foundation + Core Components)
- **Phase 3**: 2 weeks (Advanced Components)
- **Phase 4**: 2-3 weeks (Vergil Brand Integration)
- **Phase 5**: 2 weeks (Documentation)
- **Phase 6-7**: 2-3 weeks (Advanced Features)
- **Total**: 10-13 weeks for complete migration

### Expected Benefits

#### For Developers
- **Comprehensive Component Library** - shadcn/ui completeness + Vergil brand
- **Better Accessibility** - shadcn/ui's accessibility standards + brand compliance
- **Improved DX** - Better TypeScript support and component composition
- **Faster Development** - More pre-built components with brand integration

#### For Brand Consistency
- **Systematic Design Tokens** - Better token management and consistency  
- **Enhanced Brand Expression** - More components to express Vergil personality
- **Living System Enhancement** - More surfaces for breathing animations
- **Brand Guidelines Integration** - Components enforce brand standards

#### For User Experience
- **Richer Interactions** - More interactive component patterns
- **Better Accessibility** - Enhanced screen reader and keyboard support
- **Consistent Experience** - Unified design language across all components
- **Living Intelligence Feel** - Enhanced brand personality expression

### Files to be Modified/Created

#### Configuration Files
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Enhanced with shadcn/ui integration
- `app/globals.css` - CSS variables mapping
- `package.json` - New dependencies

#### Component Library Structure
```
components/
├── ui/                     # shadcn/ui components with Vergil branding
│   ├── button.tsx         # Enhanced Button
│   ├── card.tsx           # Enhanced Card  
│   ├── input.tsx          # New SynapticInput
│   ├── dialog.tsx         # New NeuralDialog
│   ├── progress.tsx       # New AwakeningProgress
│   └── [30+ shadcn components]
├── vergil/                 # Enhanced Vergil components
│   ├── consciousness-card.tsx    # New brand component
│   ├── neural-network.tsx        # Enhanced with shadcn/ui
│   ├── iris-pattern.tsx          # Enhanced with shadcn/ui
│   ├── vergil-logo.tsx           # Enhanced with shadcn/ui
│   └── graph-constellation-persistent.tsx # Enhanced with shadcn/ui
└── compound/               # Complex composed components
    ├── brand-header.tsx    # Header with multiple components
    ├── neural-sidebar.tsx  # Sidebar with living animations
    └── consciousness-layout.tsx # Layout with brand integration
```

#### Documentation Pages
```
app/
├── components/             # New section
│   ├── page.tsx           # Component library overview
│   ├── ui/                # Core component docs
│   ├── vergil/            # Brand component docs
│   ├── forms/             # Form pattern docs
│   ├── data/              # Data display docs
│   └── feedback/          # Feedback component docs
└── design-tokens/         # Enhanced token documentation
    ├── page.tsx           # Token system overview
    ├── colors/            # Color token mapping
    ├── typography/        # Type scale integration
    └── animations/        # Living system token docs
```

This comprehensive plan will transform the Vergil Design System into a world-class component library that maintains the unique "living intelligence" brand while providing developers with the full power and accessibility of shadcn/ui.

## Next Steps for Development

1. **Execute shadcn/ui Integration**: Follow the 7-phase plan outlined above
2. **Component Library Expansion**: Build comprehensive component suite
3. **Design Token System**: Implement systematic token management
4. **Advanced Brand Features**: Create AI-enhanced component experiences
5. **Performance Optimization**: Ensure living animations don't impact performance
6. **Team Training**: Document new patterns and component usage

## Living System Philosophy

The design system embodies "living" principles:
- Elements breathe and pulse with subtle animations
- Neural network patterns create organic connections  
- Gradients flow and shift naturally
- Everything responds to user interaction
- Interface feels intelligent and alive

This creates a perfect foundation for an AI orchestration platform that feels both powerful and approachable.

## Conclusion

This implementation provides a sophisticated, performant graph visualization with smooth animations, natural floating motion, and polished interactions. The key to its success lies in careful state management, avoiding React stale closures, and providing smooth transitions between different interaction states.

The system is designed to handle complex multi-stage animations while maintaining responsive performance and providing users with an intuitive, engaging interface for exploring graph relationships.

---

**Last Updated**: Completed Graph Constellation Persistent Animation System with floating motion, staged animations, and smooth hover interactions
**Repository**: https://github.com/VergilAI/brand-book
**Status**: Complete brand book with advanced graph visualization system ready for team use