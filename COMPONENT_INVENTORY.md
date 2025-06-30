# Vergil Design System - Complete Component Inventory

This document provides a comprehensive inventory of all components in the Vergil Design System, organized by category and location. This inventory is designed to help both developers and AI assistants (like Claude) quickly find and use the right components.

## Table of Contents
- [UI Components](#ui-components)
- [Brand Components](#brand-components)
- [Landing Page Components](#landing-page-components)
- [LMS Components](#lms-components)
- [Documentation Components](#documentation-components)
- [Component Organization Strategy](#component-organization-strategy)

## UI Components
Location: `/components/ui/`

### Form Controls
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Button** | `button.tsx` | Core button component | Variants: default, destructive, outline, secondary, ghost, link<br>Sizes: default, sm, lg, icon<br>Loading state support | Universal - CTAs, forms, navigation |
| **Input** | `input.tsx` | Text input field | Full styling, focus states, validation states | Forms, search bars |
| **Select** | `select.tsx` | Dropdown select | Radix UI based, searchable, grouped items<br>Sizes: sm, default | Forms, filters |
| **Checkbox** | `checkbox.tsx` | Checkbox input | Radix UI based, indeterminate state | Forms, settings |
| **Switch** | `switch.tsx` | Toggle switch | Animated transitions | Settings, feature toggles |
| **Slider** | `slider.tsx` | Range slider | Radix UI based | Settings, value selection |
| **Textarea** | `textarea.tsx` | Multi-line text input | Auto-resize option | Forms, comments |
| **Label** | `label.tsx` | Form label | Accessibility support | All form elements |

### Layout & Container
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Card** | `card.tsx` | Content container | Variants: default, interactive, neural<br>Compound: CardHeader, CardTitle, CardDescription, CardContent, CardFooter | Content sections, dashboards |
| **Dialog** | `dialog.tsx` | Modal dialog | Portal-based, backdrop, close button | Modals, confirmations |
| **Sheet** | `sheet.tsx` | Slide-out panel | Multiple positions, backdrop | Mobile menus, side panels |
| **Collapsible** | `collapsible.tsx` | Expandable content | Animated transitions | FAQs, expandable sections |
| **Tabs** | `tabs.tsx` | Tab navigation | Radix UI based, keyboard navigation | Content organization |
| **Separator** | `separator.tsx` | Visual divider | Horizontal/vertical orientation | Content division |

### Navigation
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Breadcrumb** | `breadcrumb.tsx` | Navigation path | Compound components | Page navigation |
| **Dropdown Menu** | `dropdown-menu.tsx` | Dropdown menu | Nested menus, keyboard navigation | User menus, context menus |
| **Sidebar** | `sidebar.tsx` | App sidebar | Collapsible, responsive | Admin layouts |

### Feedback & Status
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Alert** | `alert.tsx` | Alert/notification | Variants: default, destructive<br>Icon support | Form feedback, notifications |
| **Badge** | `badge.tsx` | Label/tag | Variants: default, secondary, destructive, outline | Status indicators, tags |
| **Progress** | `progress.tsx` | Progress bar | Animated fill, customizable colors | Loading, completion tracking |
| **Skeleton** | `skeleton.tsx` | Loading placeholder | Animated shimmer effect | Loading states |
| **Tooltip** | `tooltip.tsx` | Hover tooltip | Positioning, delays | Help text, info |
| **Popover** | `popover.tsx` | Floating content | Positioning, portal-based | Detailed info, menus |

### User
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Avatar** | `avatar.tsx` | User avatar | Image with fallback | User profiles, comments |

## Brand Components
Location: `/components/vergil/`

### Logo Components
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **VergilLogo** | `vergil-logo.tsx` | Official logo | Variants: logo, mark, wordmark, white, dark<br>Sizes: sm, md, lg, xl<br>Animated breathing | Headers, branding |
| **DynamicLogo** | `dynamic-logo.tsx` | Logo with effects | Colors: cosmic-purple, electric-violet, phosphor-cyan<br>Animations: breathing, pulse, rotate, glow | Creative applications |

### Visual Patterns
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **IrisRays** | `iris-rays.tsx` | Iris with light rays | Variants: default, cosmic, electric, synaptic, awakening<br>Intensity: subtle, moderate, intense | Hero sections |
| **LightRays** | `light-rays.tsx` | Radial light pattern | Colors: apple (multicolor), consciousness | Backgrounds |
| **StreamgraphBackground** | `streamgraph-background.tsx` | Animated streamgraph | Flowing data visualization | Background effects |

### Data Visualization
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **GraphConstellation** | `graph-constellation.tsx` | Interactive graph | Force simulation, zoom/pan, staged animations | Data visualization |
| **GraphConstellationPersistent** | `graph-constellation-persistent.tsx` | Advanced graph | Floating motion, staged animations, smooth transitions | Complex visualizations |
| **GraphConstellationFullscreen** | `graph-constellation-fullscreen.tsx` | Fullscreen graph | Enhanced controls, presentation mode | Detailed analysis |
| **GraphVisualization** | `graph-visualization.tsx` | Base graph | Core rendering logic | Foundation component |
| **RadialHeatmap** | `radial-heatmap.tsx` | Radial heatmap | Organic blobs, multi-layer animation | Skill visualization |

## Landing Page Components
Location: `/components/landing/`

### Hero & Sections
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **HeroSection** | `hero-section.tsx` | Modular hero | Variants: default, consciousness, neural, cosmic<br>Layouts: centered, split, minimal | Landing pages |
| **Section** | `section.tsx` | Page section | Variants: default, muted, gradient, dark<br>Sizes: default, lg, xl | Page structure |
| **CTASection** | `cta-section.tsx` | Call-to-action | Primary/secondary CTAs, alignment options | Conversions |
| **LearnHero** | `learn-hero.tsx` | Vergil Learn hero | Video CTA, brand messaging | Vergil Learn landing |

### Content Display
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **FeatureCard** | `feature-card.tsx` | Feature display | Variants: default, gradient, outlined<br>Icon support, hover effects | Feature sections |
| **ProblemCard** | `problem-card.tsx` | Problem display | Icon, description | Problem/solution sections |
| **ContentTransformation** | `content-transformation.tsx` | Before/after view | Transformation visualization | Product demos |
| **UserJourneyCarousel** | `user-journey-carousel.tsx` | Journey carousel | Step-by-step display | Product tours |

### Navigation & Layout
| Component | File | Description | Variants/Features | Usage |
|-----------|------|-------------|-------------------|--------|
| **Navigation** | `navigation.tsx` | Main nav | Desktop pill design, mobile menu, scroll behavior | Site header |
| **LearnFooter** | `learn-footer.tsx` | Vergil Learn footer | Links, copyright, brand info | Page footer |

## LMS Components
Location: `/components/lms/`

### Student Interface
| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **StudentDashboard** | `student-dashboard.tsx` | Student homepage | Course grid/list view, progress tracking, filters | LMS homepage |
| **CourseDetail** | `course-detail.tsx` | Course view | Lesson list, progress, certificates | Course pages |
| **LessonViewer** | `lesson-viewer.tsx` | Lesson content | Video/text content, navigation | Lesson display |
| **GameInterface** | `game-interface.tsx` | Learning games | Types: matching, drag-drop, quiz, puzzle<br>Score, lives, timer | Gamified lessons |
| **TestInterface** | `test-interface.tsx` | Test/quiz UI | Question navigation, timer, scoring | Assessments |

### Admin Interface
| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **AdminDashboard** | `admin/admin-dashboard.tsx` | Admin overview | Analytics, user stats, course management | Admin homepage |
| **AdminLayout** | `admin/admin-layout.tsx` | Admin wrapper | Navigation, user menu | All admin pages |
| **CourseBuilder** | `admin/course-builder.tsx` | Course creation | Drag-drop lessons, content organization | Course creation |
| **CourseManagement** | `admin/course-management.tsx` | Course list | CRUD operations, status management | Course admin |
| **UserManagement** | `admin/user-management.tsx` | User admin | User list, roles, permissions | User admin |
| **AnalyticsDashboard** | `admin/analytics-dashboard.tsx` | Analytics view | Charts, metrics, reports | Analytics |

### Admin Components
| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **DataTable** | `admin/data-table.tsx` | Data table | Sorting, filtering, pagination | Admin lists |
| **MetricCard** | `admin/metric-card.tsx` | Metric display | Value, trend, icon | Dashboards |
| **RichTextEditor** | `admin/rich-text-editor.tsx` | WYSIWYG editor | Formatting, media embeds | Content creation |

### Lesson Editors
| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **MaterialLessonEditor** | `admin/material-lesson-editor.tsx` | Material editor | File uploads, content organization | Material lessons |
| **FlashcardLessonEditor** | `admin/flashcard-lesson-editor.tsx` | Flashcard editor | Card management, preview | Flashcard lessons |
| **RPGLessonEditor** | `admin/rpg-lesson-editor.tsx` | RPG editor | Story branches, choices | Gamified content |
| **TestLessonEditor** | `admin/test-lesson-editor.tsx` | Test editor | Question types, scoring | Assessments |

### Shared LMS Components
| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **LMSHeader** | `lms-header.tsx` | LMS header | User menu, progress, search | All LMS pages |
| **LMSSidebar** | `lms-sidebar.tsx` | LMS sidebar | Course navigation, user sections | LMS navigation |

## Documentation Components
Location: `/components/docs/`

| Component | File | Description | Features | Usage |
|-----------|------|-------------|----------|--------|
| **DocsLayout** | `docs-layout.tsx` | Docs layout | Sidebar navigation, breadcrumbs | Documentation pages |
| **ComponentPreview** | `component-preview.tsx` | Component demo | Styled preview container | Component docs |
| **CodeBlock** | `code-block.tsx` | Code display | Syntax highlighting, copy button | Code examples |

## Component Organization Strategy

### Current Issues
1. **Mixed Locations**: Components are scattered across different directories
2. **Inconsistent Naming**: Some components use kebab-case, others PascalCase
3. **Missing Stories**: Most components lack Storybook documentation
4. **No Clear Hierarchy**: Primitives mixed with complex components

### Proposed Organization

#### 1. Design System Package (`/packages/design-system/`)
**Primitives** - Basic UI elements
- Button, Input, Select, Card, Badge, etc.
- Should be brand-agnostic with theme support

**Brand** - Vergil-specific components
- VergilLogo, RadialHeatmap, StreamgraphBackground
- All visualization components

**Patterns** - Composite components
- HeroSection, FeatureCard, CTASection
- Built from primitives + brand

#### 2. Module Components (`/components/[module]/`)
Keep module-specific components in their respective directories:
- `/components/lms/` - All LMS-specific components
- `/components/docs/` - Documentation components
- `/components/brand-book/` - Brand book specific

### Migration Priority

#### High Priority (Most Reused)
1. Button, Card, Input, Select, Badge
2. VergilLogo, RadialHeatmap
3. HeroSection, FeatureCard
4. Navigation components

#### Medium Priority
1. Data visualization components
2. Form components
3. Layout components

#### Low Priority
1. Module-specific components
2. Rarely used utilities

### For AI Assistants (Claude)

When looking for components:

1. **Basic UI Elements**: Check `/components/ui/` first
2. **Brand Elements**: Look in `/components/vergil/`
3. **Page Sections**: Find in `/components/landing/`
4. **LMS Features**: All in `/components/lms/`

Common component patterns:
```tsx
// Most components support these props
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | ...;
  size?: 'sm' | 'md' | 'lg';
}

// Import examples
import { Button } from '@/components/ui/button';
import { VergilLogo } from '@/components/vergil/vergil-logo';
import { HeroSection } from '@/components/landing/hero-section';
```

This inventory serves as a comprehensive reference for all components in the Vergil Design System, making it easier for both developers and AI assistants to find and use the right components for any task.