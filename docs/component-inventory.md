# Component Inventory - V2 Color System Adoption Status

This document provides a comprehensive overview of all React components in the design system and their current V2 color adoption status.

## Summary

- **Total Components Analyzed**: 100+
- **V2 Color Adoption**: 0% (No components currently using V2 colors)
- **Components with Storybook**: 31
- **Components with Hardcoded Hex Values**: 20

## Key Findings

1. **No V2 Adoption Yet**: None of the components are using the new V2 color tokens (vergil-purple, vergil-off-black, etc.)
2. **Widespread V1 Usage**: Most components still use V1 colors like cosmic-purple, electric-violet, etc.
3. **Hardcoded Values**: Several visualization components have hardcoded hex values that need updating
4. **UI Components Ready**: Core UI components use shadcn/ui tokens, making them easier to update

## Component Status by Directory

### UI Components (`/components/ui/`)

| Component | Path | Storybook | V2 Status | Notes |
|-----------|------|-----------|-----------|-------|
| Alert | `/ui/alert.tsx` | ✅ | ❌ | Uses shadcn tokens (primary, secondary, etc.) |
| Avatar | `/ui/avatar.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Badge | `/ui/badge.tsx` | ✅ | ❌ | Uses shadcn tokens |
| Breadcrumb | `/ui/breadcrumb.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Button | `/ui/button.tsx` | ✅ | ❌ | Uses shadcn tokens |
| Card | `/ui/card.tsx` | ✅ | ❌ | Uses cosmic-purple, electric-violet in variants |
| Checkbox | `/ui/checkbox.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Collapsible | `/ui/collapsible.tsx` | ❌ | ❌ | Minimal styling |
| Dialog | `/ui/dialog.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Dropdown Menu | `/ui/dropdown-menu.tsx` | ❌ | ❌ | Uses shadcn tokens |
| IconButton | `/ui/IconButton/IconButton.tsx` | ✅ | ❌ | Custom component, needs review |
| Input | `/ui/input.tsx` | ✅ | ❌ | Uses shadcn tokens |
| Label | `/ui/label.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Popover | `/ui/popover.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Progress | `/ui/progress.tsx` | ✅ | ❌ | Uses shadcn tokens |
| Select | `/ui/select.tsx` | ✅ | ❌ | Uses shadcn tokens |
| Separator | `/ui/separator.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Sheet | `/ui/sheet.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Sidebar | `/ui/sidebar.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Skeleton | `/ui/skeleton.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Slider | `/ui/slider.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Switch | `/ui/switch.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Tabs | `/ui/tabs.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Textarea | `/ui/textarea.tsx` | ❌ | ❌ | Uses shadcn tokens |
| Tooltip | `/ui/tooltip.tsx` | ❌ | ❌ | Uses shadcn tokens |

**Key Updates Needed:**
- Card component has V1 colors in variants (cosmic-purple, electric-violet)
- Most components rely on shadcn tokens which map to CSS variables

### Vergil Brand Components (`/components/vergil/`)

| Component | Path | Storybook | V2 Status | Notes |
|-----------|------|-----------|-----------|-------|
| Dynamic Logo | `/vergil/dynamic-logo.tsx` | ❌ | ❌ | Needs V2 color support |
| Graph Constellation | `/vergil/graph-constellation.tsx` | ❌ | ❌ | Has hardcoded #6366F1 |
| Graph Visualization | `/vergil/graph-visualization.tsx` | ❌ | ❌ | Has hardcoded hex values |
| Iris Rays | `/vergil/iris-rays.tsx` | ❌ | ❌ | Has hardcoded hex values |
| Layering Icons | `/vergil/LayeringIcons/LayeringIcons.tsx` | ✅ | ❌ | Has hardcoded #000000, #1d1d1d |
| Light Rays | `/vergil/light-rays.tsx` | ❌ | ❌ | Has hardcoded hex values |
| Radial Heatmap | `/vergil/radial-heatmap.tsx` | ✅ | ❌ | Has hardcoded hex values |
| Streamgraph Background | `/vergil/streamgraph-background.tsx` | ❌ | ❌ | Has hardcoded hex values |
| Vergil Logo | `/vergil/vergil-logo.tsx` | ✅ | ❌ | Logo component |
| Vergil Sidebar | `/vergil-sidebar.tsx` | ❌ | ❌ | Uses shadcn tokens |

**Key Updates Needed:**
- Remove all hardcoded hex values
- Update to use V2 brand colors (vergil-purple instead of #6366F1)
- Update LayeringIcons to use vergil-off-black instead of #1d1d1d

### Landing Components (`/components/landing/`)

| Component | Path | Storybook | V2 Status | Notes |
|-----------|------|-----------|-----------|-------|
| Content Transformation | `/landing/content-transformation.tsx` | ❌ | ❌ | Has hardcoded #7B00FF (matches V2!) |
| Hero Section | `/landing/hero-section.tsx` | ❌ | ❌ | Uses V1 colors |
| Learn Footer | `/landing/learn-footer.tsx` | ✅ | ❌ | Approved component, uses V1 colors |
| Learn Hero | `/landing/learn-hero.tsx` | ✅ | ❌ | Approved component, uses V1 colors |
| Navigation | `/landing/navigation.tsx` | ✅ | ❌ | Uses cosmic-purple, has hardcoded #1d1d1d |
| Section | `/landing/section.tsx` | ❌ | ❌ | Generic wrapper |
| User Journey Carousel | `/landing/user-journey-carousel.tsx` | ✅ | ❌ | Approved component, has hardcoded #1d1d1d |

**Key Updates Needed:**
- Navigation uses both V1 colors and hardcoded values
- Content Transformation already uses #7B00FF which matches vergil-purple!
- All approved components need V2 updates while maintaining functionality

### LMS Components (`/components/lms/`)

| Component | Path | Storybook | V2 Status | Notes |
|-----------|------|-----------|-----------|-------|
| Connect Cards Game | `/lms/connect-cards-game.tsx` | ✅ | ❌ | Uses V1 colors |
| Course Detail | `/lms/course-detail.tsx` | ❌ | ❌ | Uses V1 colors |
| Course Overview | `/lms/course-overview.tsx` | ✅ | ❌ | Uses V1 colors |
| Course Section | `/lms/course-section.tsx` | ✅ | ❌ | Uses V1 colors |
| Flashcard Game | `/lms/flashcard-game.tsx` | ✅ | ❌ | Uses V1 colors |
| Game Interface | `/lms/game-interface.tsx` | ❌ | ❌ | Uses V1 colors |
| Game Type Card | `/lms/game-type-card.tsx` | ✅ | ❌ | Uses V1 colors |
| Jeopardy Game | `/lms/jeopardy-game.tsx` | ✅ | ❌ | Uses V1 colors |
| Lesson Card | `/lms/lesson-card.tsx` | ✅ | ❌ | Uses cosmic-purple, electric-violet |
| Lesson Modal | `/lms/lesson-modal.tsx` | ✅ | ❌ | Uses V1 colors |
| LMS Header | `/lms/lms-header.tsx` | ✅ | ❌ | Uses V1 colors |
| Map Validation Demo | `/lms/map-validation-demo.tsx` | ✅ | ❌ | Demo component |
| Millionaire Game | `/lms/millionaire-game.tsx` | ✅ | ❌ | Uses V1 colors |
| Optimized Territory Map | `/lms/optimized-territory-map.tsx` | ✅ | ❌ | Has hardcoded hex values |
| Student Dashboard | `/lms/student-dashboard.tsx` | ✅ | ❌ | Uses cosmic-purple, electric-violet, phosphor-cyan |
| Territory Conquest | `/lms/territory-conquest.tsx` | ✅ | ❌ | Has hardcoded hex values |

**Key Updates Needed:**
- Heavy use of V1 colors throughout
- Game components need careful color updates
- Territory maps have hardcoded values

### Archived Components (`/components/landing/_archived/`)

These components are deprecated and should not be updated:
- comparison-table.tsx
- cta-section.tsx
- faqs-section.tsx
- feature-card.tsx (replaced by Card variant="feature")
- final-cta.tsx
- five-pillars.tsx
- how-it-works.tsx
- pricing-section.tsx
- problem-card.tsx (replaced by Card variant="problem")
- roi-calculator.tsx
- security-compliance.tsx
- use-cases-carousel.tsx

## Priority Update Order

### Phase 1: Core UI Components
1. **Card Component** - Update variants to use V2 colors
2. **Button Component** - Ensure primary uses vergil-purple
3. **Badge Component** - Update color variants
4. **Input/Select/Form Components** - Use V2 emphasis colors

### Phase 2: Approved Landing Components
1. **Navigation** - Critical, visible on all pages
2. **Learn Hero** - Main landing component
3. **Learn Footer** - Footer consistency
4. **User Journey Carousel** - Interactive showcase

### Phase 3: Brand Components
1. **Vergil Logo** - Ensure proper color handling
2. **Layering Icons** - Update hardcoded values
3. **Radial Heatmap** - Update visualization colors
4. **Graph Components** - Update all hardcoded hex values

### Phase 4: LMS Components
1. **Student Dashboard** - High visibility
2. **Lesson Card** - Core learning component
3. **Course Overview** - Course listing page
4. **Game Components** - Update game interfaces

## Implementation Guidelines

### 1. Color Token Mapping

| V1 Color | V2 Replacement | Usage |
|----------|----------------|-------|
| cosmic-purple (#6366F1) | vergil-purple (#7B00FF) | Primary brand, CTAs |
| electric-violet (#A78BFA) | vergil-purple-light (#9933FF) | Hover states |
| pure-light (#FFFFFF) | vergil-full-white (#FFFFFF) | Backgrounds only |
| deep-space (#0F172A) | vergil-off-black (#1D1D1F) | Primary text |
| mist-gray (#E5E7EB) | vergil-emphasis-bg (#F0F0F2) | Subtle backgrounds |
| stone-gray (#9CA3AF) | vergil-footnote-text (#6C6C6D) | Secondary text |

### 2. Text Color Rules

- **On white/off-white backgrounds**: Use `vergil-off-black`
- **On dark backgrounds**: Use `vergil-off-white`
- **For emphasis areas**: Use `vergil-emphasis-text`
- **For footnotes/copyright**: Use `vergil-footnote-text`

### 3. Background Rules

- **Primary background**: `vergil-full-white`
- **Section backgrounds**: `vergil-off-white`
- **Emphasis/attention**: `vergil-emphasis-bg`
- **Dark sections**: `vergil-full-black`

### 4. Interactive Elements

- **Primary buttons**: `bg-vergil-purple hover:bg-vergil-purple-light`
- **Inputs in emphasis**: `bg-vergil-emphasis-input-bg text-vergil-emphasis-input-text`
- **Links**: `text-vergil-purple hover:text-vergil-purple-light`

## Testing Checklist

- [ ] Visual regression tests for each updated component
- [ ] Dark mode compatibility (where applicable)
- [ ] Accessibility contrast ratios meet WCAG AA
- [ ] Hover/focus states properly defined
- [ ] No hardcoded hex values remain
- [ ] Storybook stories updated with V2 examples

## Notes

1. The Card component already has a good variant system - just needs color updates
2. Many components use shadcn/ui tokens which will need CSS variable updates
3. Visualization components (graphs, heatmaps) have the most hardcoded values
4. Some components already use values that match V2 (e.g., #7B00FF, #1d1d1d)
5. Priority should be given to high-visibility components like Navigation and Dashboard