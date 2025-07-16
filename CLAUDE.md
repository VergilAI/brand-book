# LMS Brand Book - Development Guide

## About CLAUDE.md Files

CLAUDE.md files are prompt engineering tools that provide context to Claude AI:
- **Root CLAUDE.md**: Always loaded when working in this directory
- **Sub-folder CLAUDE.md**: Only loaded when working in that specific sub-folder
- **Purpose**: Provide directory structure, key file locations, and critical rules
- **Updates**: Update whenever substantive changes are made or important decisions documented
- **Style**: Keep COMPACT and TERSE - only essential information

## Project Structure

```
/components/              # All UI components (atomic, molecular, organisms)
/packages/design-system/  # Central design system
  ├── tokens/            # All design tokens (primitives, semantic, component)
  ├── tailwind-plugin.js # Tailwind integration
  └── index.ts           # Token exports
/app/                    # Next.js app directory
/lib/                    # Utilities and helpers
```

## 🚨 CRITICAL RULES

### 1. Component Location
- **ALL components MUST be created in `/components/`**
- **NO components in `/app/` or other directories**
- **NO inline components - everything must be reusable**

### 2. Token Usage
- **ALL styling MUST use tokens from `/packages/design-system/`**
- **NO hardcoded values for:**
  - Colors (use `text-primary`, `bg-secondary`, etc.)
  - Spacing (use `spacing-sm`, `spacing-md`, etc.)
  - Typography (use `text-lg`, `font-medium`, etc.)
  - Shadows (use `shadow-sm`, `shadow-elevated`, etc.)
  - Border radius (use `rounded-md`, `rounded-lg`, etc.)
  - Animations (use `duration-normal`, `ease-out`, etc.)

### 2a. Spacing Token Usage - CRITICAL

The Tailwind configuration supports TWO spacing conventions. **You MUST be consistent**:

**Option 1 - With prefix (PREFERRED in this codebase):**
```tsx
// ✅ CORRECT - Uses spacing- prefix
<div className="p-spacing-lg space-y-spacing-md gap-spacing-sm">
```

**Option 2 - Without prefix:**
```tsx
// ⚠️ ALSO WORKS but check existing patterns first
<div className="p-4 space-y-6 gap-2">
```

**BEFORE creating any component:**
1. Check neighboring components for the pattern they use
2. Test your spacing utilities in the browser DevTools
3. If a spacing class produces no CSS, you're using the wrong convention

**Available spacing tokens:**
- `spacing-xs` (4px) 
- `spacing-sm` (8px)
- `spacing-md` (16px) 
- `spacing-lg` (24px)
- `spacing-xl` (32px)
- `spacing-2xl` (48px)
- `spacing-3xl` (64px)

**Common mistake:** Using `space-y-spacing-md` when the config only supports `space-y-4`. Always verify which convention is active by checking an existing working component.

### 3. Tailwind Version
- **ONLY Tailwind CSS v3 is allowed**
- **NO Tailwind CSS v4** - The project is configured for v3 and must remain compatible

### 4. Component Creation Process
- **ALWAYS check shadcn/ui first** before creating any new component
- **Use shadcn/ui components as the base** and adapt them to our design system
- **Process:**
  1. Check if shadcn/ui has the component you need
  2. Copy the shadcn/ui implementation
  3. Replace their styling with our design tokens
  4. Adapt to follow our spacing and sizing guidelines
- **shadcn/ui reference:** https://ui.shadcn.com/docs/components

## Component Design Guidelines

### Responsive Design Philosophy
**Desktop First, Mobile Enhanced**: Components are optimized for desktop efficiency by default, then enhanced for mobile accessibility. This means:
- Desktop gets standard desktop sizes (32-36px button heights)
- Mobile gets larger, touch-friendly components (48px+ heights)
- Use `sm:` prefix for desktop sizing (Tailwind mobile-first approach)
- Match modern desktop apps like Slack, VS Code (32-36px), not mobile sizes

### Core Principles
1. **Responsive Spacing** - Compact on desktop, generous on mobile
2. **Clear Hierarchy** - Bold typography and purposeful sizing
3. **Bright & Clean** - White backgrounds with high contrast
4. **Smart Sizing** - Desktop: 32-36px standard, Mobile: 48px+ for touch

### Button Implementation
```tsx
// ✅ CORRECT
<Button 
  variant="primary"
  size="md"
  className="shadow-brand-sm hover:shadow-brand-md"
>

// ❌ WRONG
<button 
  className="h-10 px-4 bg-blue-500 rounded-md"
>
```

**Required specs:**
- Height: Desktop `sm:h-9` (36px default), Mobile `h-12` (48px)
- Sizes: Small 32px, Medium 36px, Large 40px (desktop)
- Padding: Proportional to height (px-4 py-2 for medium)
- Font: `text-sm` or `text-base`, `font-medium` or `font-semibold`
- Radius: `rounded-md` or `rounded-lg`
- Responsive: Base = mobile, `sm:` = desktop (Tailwind mobile-first)

### Card/Container Design
```tsx
// ✅ CORRECT
<Card className="p-spacing-lg space-y-spacing-md">

// ❌ WRONG  
<div className="p-6 space-y-4">
```

**Required specs:**
- Padding: `p-spacing-lg` (32px) or `p-spacing-xl` (48px)
- Internal spacing: `space-y-spacing-md` (24px) minimum
- Radius: `rounded-lg` or `rounded-xl`
- Background: `bg-primary` or `bg-secondary`

### Form Elements
```tsx
// ✅ CORRECT
<Input 
  className="h-12 sm:h-9 px-4 sm:px-3 text-base"
/>

// ❌ WRONG
<input 
  className="h-12 px-6 text-lg"
/>
```

**Required specs:**
- Height: Mobile `h-12` (48px), Desktop `sm:h-9` (36px)
- Padding: Mobile `px-4`, Desktop `sm:px-3`
- Font: `text-base` (16px) prevents mobile zoom
- Spacing between fields: Mobile `space-y-spacing-md`, Desktop `space-y-spacing-sm`

### Typography Hierarchy
```tsx
// Page title
<h1 className="text-3xl font-bold text-primary">

// Section title  
<h2 className="text-2xl font-semibold text-primary">

// Card title
<h3 className="text-xl font-medium text-primary">

// Body text
<p className="text-base text-secondary leading-relaxed">

// Small text
<span className="text-sm text-tertiary">
```

### Spacing Between Elements
- Between cards: `gap-spacing-md` (24px) or `gap-spacing-lg` (32px)
- Between sections: `space-y-spacing-xl` (48px) or `space-y-spacing-2xl` (64px)
- Page padding: `p-spacing-lg` (32px) minimum

### State Management
```tsx
// Hover states
hover:bg-emphasis
hover:border-emphasis
hover:shadow-elevated

// Focus states
focus-visible:ring-2
focus-visible:ring-border-focus
focus-visible:ring-offset-2

// Active states
active:scale-[0.98]
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="p-spacing-md lg:p-spacing-xl">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-lg">
```

## Quick Reference

### DO ✅
- Use semantic token classes
- Use responsive sizing (compact desktop, larger mobile)
- Desktop: 32-36px standard, Mobile: 48px+ for touch
- Match desktop apps (Slack, VS Code) sizing
- Add breathing room between elements
- Test on both desktop and mobile

### DON'T ❌
- Hardcode pixel values
- Make everything large on desktop
- Use opacity for hover states
- Crowd elements together
- Mix shadows and borders
- Create components outside `/components/`

## Example Component Structure
```tsx
// components/course-card.tsx
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'

export function CourseCard() {
  return (
    <Card className="p-spacing-lg space-y-spacing-md">
      <div className="space-y-spacing-sm">
        <h3 className="text-xl font-semibold text-primary">
          Course Title
        </h3>
        <p className="text-base text-secondary leading-relaxed">
          Description with proper line height
        </p>
      </div>
      
      <div className="flex gap-spacing-sm">
        <Badge variant="success">Active</Badge>
        <Badge variant="info">New</Badge>
      </div>
      
      <Button size="lg" className="w-full">
        Start Learning
      </Button>
    </Card>
  )
}
```

## Standard Component Sizes

### Desktop (sm: prefix)
- **Buttons**: 32px (sm), 36px (md), 40px (lg)
- **Inputs**: 36px height
- **Icon Buttons**: 36px square
- **Checkboxes**: 20px visual, 40px click target
- **Avatars**: 32px (sm), 36px (md), 56px (lg)
- **Badges**: Compact padding (px-2.5 py-0.5)

### Mobile (base classes)
- **Buttons**: 40px (sm), 48px (md), 56px (lg)
- **Inputs**: 48px height
- **Icon Buttons**: 48px square
- **Checkboxes**: 28px visual, 52px click target
- **Avatars**: 40px (sm), 48px (md), 64px (lg)
- **Badges**: Generous padding (px-3 py-1)

Remember: **Desktop = professional app sizing, Mobile = touch-friendly sizing**
```

Whenever using a progress bar make sure to use our preexisting progress bar component.