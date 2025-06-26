# Unified Component System Proposal

## Overview

This document proposes a unified, scalable component architecture that supports multiple Vergil products while maintaining consistency and allowing for product-specific customization.

## Core Architecture Principles

### 1. **Multi-Brand Design System**
```
@vergil/design-system/
├── core/               # Shared across all products
├── brands/            
│   ├── vergil-learn/   # Vergil Learn specific
│   ├── vergil-main/    # Vergil Main specific
│   └── vergil-lms/     # LMS specific
└── tokens/            
    ├── core/           # Shared tokens
    └── brands/         # Brand-specific tokens
```

### 2. **Component Precedence**
1. **Vergil Learn**: Final/approved components (highest priority)
2. **Brand Book**: Mostly approved (second priority)
3. **LMS**: Draft but unique components valid (third priority)

### 3. **Token System per Brand**
Each brand can override:
- Colors
- Typography
- Spacing
- Animations
- Component variants

## Unified Component List

### Core System Components

#### 1. Foundation Components
These are the atomic building blocks used across all Vergil products.

| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **Button** | Universal button component | default, primary, secondary, ghost, destructive, link | ✅ Approved (used in Vergil Learn) |
| **Card** | Unified card system | default, interactive, feature, metric, problem | 🔄 Consolidate existing cards |
| **Badge** | Status/label indicator | default, secondary, success, warning, error | ✅ Approved (used in Vergil Learn) |
| **Input** | Form input field | text, email, password, number | ✅ Keep as is |
| **Select** | Dropdown selection | single, multi, searchable | ✅ Keep as is |
| **Dialog** | Modal dialog | default, sheet, alert | ✅ Keep as is |
| **Separator** | Visual divider | horizontal, vertical | ✅ Approved (used in Vergil Learn) |
| **Tooltip** | Information tooltip | default, rich | ✅ Keep as is |

#### 2. Layout Components
Structural components for page organization.

| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **Container** | Content wrapper | default, fluid, narrow | 🆕 New unified |
| **Section** | Page section | default, muted, gradient, dark | ✅ Keep from landing |
| **Grid** | Grid layout system | 2-col, 3-col, 4-col, responsive | 🆕 New unified |
| **Stack** | Vertical/horizontal stack | vertical, horizontal | 🆕 New unified |

#### 3. Navigation Components
Unified navigation system with product variants.

| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **NavBar** | Main navigation | vergil-learn, vergil-main, lms | 🔄 Unify Navigation + LMSHeader |
| **SideBar** | Side navigation | default, collapsible, mobile | ✅ Keep existing |
| **Breadcrumb** | Path navigation | default | ✅ Keep as is |
| **Footer** | Page footer | vergil-learn, vergil-main, minimal | ✅ Keep LearnFooter as base |

#### 4. Form Components
Complete form control suite.

| Component | Description | Status |
|-----------|-------------|---------|
| **Form** | Form wrapper with validation | ✅ Keep as is |
| **Checkbox** | Checkbox input | ✅ Keep as is |
| **Radio** | Radio button | 🆕 Add from Radix |
| **Switch** | Toggle switch | ✅ Keep as is |
| **Slider** | Range slider | ✅ Keep as is |
| **TextArea** | Multi-line input | ✅ Keep as is |
| **Label** | Form label | ✅ Keep as is |

#### 5. Feedback Components
User feedback and status indicators.

| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **Alert** | Alert message | info, success, warning, error | ✅ Keep as is |
| **Toast** | Temporary notification | default, success, error | 🆕 Add |
| **Progress** | Progress indicator | linear, circular | ✅ Keep as is |
| **Skeleton** | Loading placeholder | text, card, image | ✅ Keep as is |
| **Spinner** | Loading spinner | default, overlay | 🆕 Extract from Button |

### Brand Components (Vergil-Specific)

#### 1. Identity Components
| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **VergilLogo** | Brand logo | logo, mark, wordmark | ✅ Approved |
| **DynamicLogo** | Animated logo | cosmic, electric, neural | ✅ Keep for demos |

#### 2. Visual Pattern Components
| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **IrisPattern** | Signature pattern | default, cosmic, electric, synaptic | ✅ Approved (used in Vergil Learn) |
| **NeuralNetwork** | Neural visualization | default, animated | ✅ Keep as is |
| **RadialHeatmap** | Data visualization | default | ✅ Approved (used in Vergil Learn) |
| **LightRays** | Background pattern | apple, consciousness | ✅ Keep as is |

#### 3. Data Visualization Components
| Component | Description | Variants | Status |
|-----------|-------------|----------|---------|
| **GraphConstellation** | Interactive graph | basic, persistent, fullscreen | ✅ Approved (persistent used in VL) |
| **StreamGraph** | Animated stream | default | ✅ Keep as is |

### Product-Specific Components

#### Vergil Learn Components
| Component | Description | Status |
|-----------|-------------|---------|
| **LearnHero** | Hero section with heatmap | ✅ Final/Approved |
| **UserJourneyCarousel** | Journey visualization | ✅ Final/Approved |
| **ContentTransformation** | Before/after display | ✅ Keep as is |

#### LMS Components
| Component | Description | Status |
|-----------|-------------|---------|
| **CourseCard** | Course display | ✅ Keep (unique to LMS) |
| **LessonViewer** | Lesson content viewer | ✅ Keep (unique to LMS) |
| **GameInterface** | Learning games | ✅ Keep (unique to LMS) |
| **TestInterface** | Assessment UI | ✅ Keep (unique to LMS) |
| **DataTable** | Admin data table | ✅ Keep (unique to LMS) |
| **RichTextEditor** | Content editor | ✅ Keep (unique to LMS) |

### Deprecated Components
These components should be removed or archived:
- All components in `/components/landing/archive/`
- `ProblemCard` (use unified Card)
- `FeatureCard` (use unified Card)
- `CTASection` (use Section with CTA variant)

## Implementation Structure

### 1. Package Structure
```
packages/
├── @vergil/core/              # Core design system
│   ├── components/            # Base components
│   ├── tokens/                # Core tokens
│   └── utils/                 # Shared utilities
│
├── @vergil/brand-vergil-learn/   # Vergil Learn brand
│   ├── components/            # VL-specific components
│   ├── tokens/                # VL token overrides
│   └── theme.ts               # VL theme config
│
├── @vergil/brand-vergil-main/    # Vergil Main brand
│   ├── components/            # VM-specific components
│   ├── tokens/                # VM token overrides
│   └── theme.ts               # VM theme config
│
└── @vergil/brand-lms/         # LMS brand
    ├── components/            # LMS-specific components
    ├── tokens/                # LMS token overrides
    └── theme.ts               # LMS theme config
```

### 2. Token Architecture
```typescript
// Core tokens (shared)
const coreTokens = {
  // Base scale that all brands use
  spacing: { /* 0-96 scale */ },
  radii: { /* border radius scale */ },
  shadows: { /* shadow scale */ },
  animation: { /* core animations */ }
}

// Brand-specific tokens
const vergilLearnTokens = {
  ...coreTokens,
  colors: {
    primary: 'cosmic-purple',
    secondary: 'electric-violet',
    // VL-specific colors
  },
  typography: {
    fontFamily: 'Inter',
    // VL-specific typography
  }
}

const vergilMainTokens = {
  ...coreTokens,
  colors: {
    primary: 'deep-space',
    secondary: 'phosphor-cyan',
    // VM-specific colors
  },
  typography: {
    fontFamily: 'Lato',
    // VM-specific typography
  }
}
```

### 3. Component Theming
```typescript
// Component with theme support
export const Button = ({ variant, theme = 'vergil-learn', ...props }) => {
  const tokens = useThemeTokens(theme);
  
  return (
    <button
      className={cn(
        buttonVariants({ variant }),
        tokens.buttonOverrides
      )}
      {...props}
    />
  );
};
```

## Migration Plan

### Phase 1: Core Setup (Week 1)
1. Create package structure
2. Set up core token system
3. Migrate approved Vergil Learn components

### Phase 2: Component Consolidation (Week 2)
1. Unify Card components
2. Unify Navigation components
3. Create new Grid/Stack/Container components

### Phase 3: Brand Packages (Week 3)
1. Create vergil-learn brand package
2. Create vergil-main brand package
3. Create lms brand package

### Phase 4: Documentation (Week 4)
1. Create Storybook stories for all components
2. Document theming system
3. Create migration guides

## Benefits

1. **Consistency**: Shared core components ensure consistency
2. **Flexibility**: Each product can have its own visual identity
3. **Scalability**: Easy to add new products/brands
4. **Efficiency**: Reuse core components across products
5. **AI-Friendly**: Clear structure for AI assistants to understand

## Usage Examples

### For Developers
```typescript
// Import from core
import { Button, Card } from '@vergil/core';

// Import brand-specific
import { LearnHero } from '@vergil/brand-vergil-learn';

// Use with theme
<ThemeProvider theme="vergil-learn">
  <Button variant="primary">Learn More</Button>
</ThemeProvider>
```

### For AI Assistants (Claude)
```typescript
// When building for Vergil Learn
import { components } from '@vergil/brand-vergil-learn';

// When building for Vergil Main
import { components } from '@vergil/brand-vergil-main';

// Core components work everywhere
import { Button, Card, Input } from '@vergil/core';
```

This unified system provides a scalable foundation for all Vergil products while maintaining the flexibility for each product to have its own identity.