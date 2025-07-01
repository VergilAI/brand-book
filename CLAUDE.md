# Vergil Design System - AI Development Guide

## 🗺️ Current System Overview

### What We've Built

1. **Centralized Token System**
   - Source: `/design-tokens/active/source/*.yaml` (YAML files define everything)
   - Generated: `/generated/` (CSS, TS, SCSS auto-generated)
   - THIS is your single source of truth

2. **Component Scaffolding Tool**
   - Command: `npm run create:component ComponentName -- --category=ui`
   - Automatically creates files with correct structure and tokens

3. **Enforcement System** (ACTIVE!)
   - ESLint catches hardcoded values
   - Pre-commit hooks block bad code
   - CI/CD validates everything

4. **Version Management System**
   - All tokens are versioned (currently v2.1.0-dev)
   - @docs/versioning-system.md - Complete versioning documentation
   - @docs/migration-dashboard-spec.md - Migration dashboard plans

5. **Reporting & Tracking**
   - `npm run report:all` shows system health
   - `npm run scan:hardcoded` finds violations
   - Current state: 2,323 hardcoded values to fix

## 🎯 How to Build New Components

### Step 1: Always Use the Scaffolding Tool

```bash
npm run create:component MyButton -- --category=ui
```

This creates:
- `components/ui/MyButton/MyButton.tsx` (with tokens pre-imported)
- `components/ui/MyButton/MyButton.stories.tsx` (Storybook ready)
- `components/ui/MyButton/MyButton.test.tsx` (test structure)
- `components/ui/MyButton/index.ts` (exports)

The component already uses tokens! No hardcoded values.

### Step 2: Only Use Tokens from Generated Files

When styling, ONLY use:
- Colors: `text-vergil-purple` or `style={{ color: tokens.colors.brand.purple }}`
- Spacing: `p-4` (maps to token) or `style={{ padding: tokens.spacing.scale[4] }}`
- Never: `text-[#7B00FF]` or `p-[16px]`

Your tokens live in:
- CSS: `var(--vergil-colors-brand-purple)`
- TypeScript: `import { tokens } from '@/generated/tokens'`
- Tailwind: Automatically configured from tokens

### Step 3: Build Your Storybook Story

The generated story file has the structure. Just fill in:
- Different variants
- Interactive controls
- Usage examples
- NO hardcoded values!

## 🔄 How to Port Existing Components

> 📖 **Note on Versioning**: Our design system uses a sophisticated versioning system. If you need to understand how token versions work, how to create new versions, or how the migration system operates, see @docs/versioning-system.md

### The Manual Migration Process

1. **Pick a Component to Migrate**
   - Start with simple ones (Button, Card)
   - Look at `/components/ui/button.tsx`

2. **Run the Scanner on That File**
   ```bash
   npm run scan:hardcoded
   ```
   Find all violations in that component

3. **Create the New Version**
   ```bash
   npm run create:component Button -- --category=ui
   ```

4. **Copy Logic, Replace Styles**
   - Copy the component logic
   - Replace EVERY hardcoded value with tokens
   - Use the scanner report as your checklist

5. **Verify It's Clean**
   - ESLint will tell you if you missed anything
   - The component should have ZERO violations

### Example Migration

**Old Button (with violations):**
```tsx
<button className="bg-[#7B00FF] px-[16px] py-[8px]">
```

**New Button (token-based):**
```tsx
<button className="bg-vergil-purple px-4 py-2">
```

## 📚 Token Reference

Open these files to see available tokens:
- `/generated/tokens.ts` - See all tokens in TypeScript
- `/generated/tokens.css` - See all CSS variables
- Storybook Token Browser - Visual reference

Common tokens you'll use:
- **Colors**: vergil-purple, vergil-off-black, vergil-off-white
- **Spacing**: spacing-1 through spacing-64 (4px increments)
- **Radii**: radius-sm, radius-md, radius-lg
- **Shadows**: shadow-sm, shadow-md, shadow-lg

## 🎨 How to Create New Tokens

### Creating a New Color Token

1. **Edit `/design-tokens/active/source/colors.yaml`:**
   ```yaml
   colors:
     brand:
       purple: "#7B00FF"
       # Add your new color:
       purple-dark: "#5500CC"
   ```

2. **Build tokens:**
   ```bash
   npm run build:tokens
   ```

3. **Use everywhere:**
   - Tailwind: `bg-brand-purple-dark`
   - CSS: `var(--vergil-colors-brand-purple-dark)`
   - TS: `tokens.colors.brand.purpleDark`

### Creating a New Spacing Token

1. **Edit `/design-tokens/active/source/spacing.yaml`:**
   ```yaml
   spacing:
     scale:
       # Add custom spacing:
       18: "72px"
   ```

2. **Build and use:**
   ```bash
   npm run build:tokens
   ```
   - Tailwind: `p-18`, `m-18`
   - CSS: `var(--vergil-spacing-scale-18)`
   - TS: `tokens.spacing.scale[18]`

## 🎮 Daily Workflow

1. **Need a new component?**
   ```bash
   npm run create:component Name -- --category=ui
   ```

2. **Checking system health?**
   ```bash
   npm run report:all
   ```

3. **Finding what to fix?**
   ```bash
   npm run scan:hardcoded
   ```

4. **Testing your changes?**
   ```bash
   npm run lint:tokens
   ```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 (IMPORTANT: Only use v3 patterns)
- **UI Components**: Custom components + Radix UI primitives
- **Animations**: Framer Motion
- **Data Visualization**: D3.js
- **Component Architecture**: Class Variance Authority (CVA)

## Component Categories

- `/components/ui/` - Core UI components (unified Card, Button, Input, etc.)
- `/components/vergil/` - Brand-specific components (logos, patterns, visualizations)
- `/components/landing/` - Approved landing components (Navigation, LearnHero, UserJourneyCarousel)
- `/components/lms/` - LMS-specific components (CourseCard, LessonViewer, etc.)
- `/components/docs/` - Documentation components

## Key Conventions

### Token-First Development (MANDATORY)

## 🚨 CRITICAL: Token Usage Rules

You MUST use tokens from our generated files. **NO EXCEPTIONS**.

### The ONLY Allowed Token Sources:

1. **Tailwind Classes** (Use for 90% of styling)
   ```jsx
   // ✅ CORRECT - Static styles
   <div className="bg-brand-purple p-4 text-white rounded-md">
   <button className="hover:bg-brand-purple-light">
   ```

2. **TypeScript Tokens** (Use for dynamic/computed values)
   ```jsx
   import { tokens } from '@/generated/tokens';
   
   // ✅ CORRECT - Dynamic styles
   <div style={{ backgroundColor: isActive ? tokens.colors.brand.purple : tokens.colors.gray[200] }}>
   <div style={{ width: `${progress}%`, color: tokens.colors.semantic.text.primary }}>
   ```

3. **CSS Variables** (Use in CSS/SCSS files only)
   ```css
   /* ✅ CORRECT - In CSS files */
   .custom-class {
     background: var(--vergil-colors-brand-purple);
     color: var(--vergil-colors-neutral-off-black);
   }
   ```

### ❌ ABSOLUTELY FORBIDDEN:
```jsx
// ❌ NEVER hardcode colors
<div className="bg-[#7B00FF]">
<div style={{ color: '#7B00FF' }}>
<div style={{ backgroundColor: 'rgb(123, 0, 255)' }}>

// ❌ NEVER import from anywhere else
import colors from '../constants/colors';
import { BRAND_COLORS } from '../config';

// ❌ NEVER use arbitrary Tailwind values
<div className="text-[#1D1D1F] p-[16px]">
```

### 📋 Usage Decision Tree:

1. **Is it a static style?** → Use Tailwind class
2. **Is it dynamic/conditional?** → Import and use `tokens` from `@/generated/tokens`
3. **Is it in a CSS file?** → Use CSS variable `var(--vergil-*)`
4. **Can't find what you need?** → **STOP! Ask the user before proceeding**

### 🛑 If You Need Something Not in Tokens:

**DO NOT**:
- Create new constants
- Hardcode values
- Import from other files

**DO**:
- Stop immediately
- Ask: "I need [specific value] for [purpose], but it's not in the design tokens. Should I add it to the YAML, or how should I proceed?"

### Examples of When to Ask:

```jsx
// Need a specific opacity?
"I need 0.5 opacity for this overlay, but opacity values aren't in the tokens. Should I add opacity scale to the YAML?"

// Need a specific size?
"I need a 72px size for this icon, but spacing.scale doesn't have 72px. Should I add it to spacing tokens?"

// Need a new color?
"This component needs a green color for success states, but I only see brand purples. Should I add semantic colors?"
```

Remember: The tokens are your ONLY source of truth. If it's not in tokens, it doesn't exist until the user decides how to handle it.

## 🎯 Tailwind CSS v3 Patterns

### IMPORTANT: Only Use Tailwind v3 Syntax

We use Tailwind CSS v3. Always use v3 patterns:

#### ✅ Correct v3 Patterns:

**1. Directives in CSS:**
```css
/* In globals.css or any CSS file */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**2. Arbitrary Values with Brackets:**
```jsx
// Only when absolutely necessary and tokens don't exist
<div className="w-[300px] h-[45px]">
```

**3. Color Opacity Modifiers:**
```jsx
// v3 pattern using /opacity
<div className="bg-brand-purple/50 text-neutral-off-black/80">
```

**4. Responsive Prefixes:**
```jsx
<div className="md:flex lg:grid sm:hidden">
```

**5. Dark Mode with class strategy:**
```jsx
<div className="dark:bg-neutral-off-black dark:text-neutral-off-white">
```

#### ❌ Never Use v4 Patterns:

```css
/* ❌ WRONG - v4 import syntax */
@import "tailwindcss";

/* ❌ WRONG - v4 theme function */
.custom { color: theme('colors.brand.purple'); }

/* ❌ WRONG - v4 custom variants */
@custom-variant dark (&:is(.dark *));
```

#### Common v3 Patterns for Token Usage:

**1. Using Generated Token Classes:**
```jsx
// Colors from generated tokens
<div className="bg-brand-purple text-neutral-off-white">
<div className="border-scales-gray-200">

// Spacing from generated tokens  
<div className="p-4 m-8 gap-2">

// Border radius from generated tokens
<div className="rounded-md">
```

**2. Hover/Focus States:**
```jsx
<button className="bg-brand-purple hover:bg-brand-purple-light focus:ring-2 focus:ring-brand-purple/50">
```

**3. Combining with CVA:**
```tsx
const buttonVariants = cva(
  "rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-brand-purple text-white hover:bg-brand-purple-light",
        secondary: "bg-neutral-off-white text-neutral-off-black hover:bg-scales-gray-50"
      }
    }
  }
)
```

**4. Group Hover (v3 syntax):**
```jsx
<div className="group">
  <div className="group-hover:text-brand-purple">
</div>
```

### Brand Color Reference
- **Primary Brand**: `brand-purple` - Use via Tailwind or `tokens.colors.brand.purple`
- **Neutrals**: `neutral-off-black`, `neutral-off-white`
- **Source**: `/design-tokens/active/source/colors.yaml` - SINGLE SOURCE OF TRUTH

### Code Style
- DO NOT add comments unless requested
- Follow existing patterns in neighboring files
- Use existing libraries - check package.json first
- Maintain accessibility (WCAG AA standards)

## Essential Commands

### Component Creation
```bash
npm run create:component ComponentName -- --category=ui
```

### Quality Checks
```bash
npm run scan:hardcoded     # Find hardcoded values
npm run lint:tokens        # Check token violations
npm run report:all         # System health report
```

### Development
```bash
npm run dev               # Start development server
npm run build:tokens      # Build tokens from YAML
npm run storybook         # Start Storybook
```

## Project Structure

- **Brand Book** (`/app/brand/`) - Brand guidelines and design system documentation
- **Vergil Main** (`/app/vergil-main/`) - Main AI platform landing page
- **Vergil Learn** (`/app/vergil-learn/`) - Educational platform landing page
- **LMS Demo** (`/app/lms/`) - Learning Management System demo

## Core System Files

- `/design-tokens/active/source/` - YAML token definitions (SINGLE SOURCE OF TRUTH)
- `/generated/` - Auto-generated token outputs (CSS, TS, JSON, Tailwind)
- `/scripts/` - Automation and validation tools
- `/reports/` - Coverage and quality reports
- `/eslint-rules/` - Token enforcement rules (ACTIVE)

## Current System Status

- **Enforcement**: Active (ESLint + pre-commit hooks)
- **Components**: 82 tracked
- **Token Violations**: 2,323 hardcoded values to fix
- **Storybook Coverage**: 37%
- **V2 Token Adoption**: 29%

## GitHub Repository

**URL**: https://github.com/VergilAI/brand-book