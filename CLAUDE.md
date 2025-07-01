# Vergil Design System - AI Development Guide

## 🗺️ Current System Overview

### What We've Built

1. **Centralized Token System**
   - Source: `/design-tokens/source/*.yaml` (YAML files define everything)
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

1. **Edit `/design-tokens/source/colors.yaml`:**
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

1. **Edit `/design-tokens/source/spacing.yaml`:**
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
- **Styling**: Tailwind CSS v4 (IMPORTANT: v4 syntax, not v3)
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
```typescript
// ❌ NEVER use arbitrary values or hardcoded colors
<div className="bg-[#6366F1]" />
<div className="bg-[#7B00FF]" />
<div style={{ color: '#7B00FF' }} />

// ✅ ALWAYS use design tokens
<div className="bg-vergil-purple" />
<div className="text-vergil-off-black" />
```

### Brand Color Tokens
- **Primary Brand**: `vergil-purple` (#7B00FF) - THE brand color
- **Neutrals**: `vergil-off-black` (#1D1D1F), `vergil-off-white` (#F5F5F7)
- **Source**: `/design-tokens/source/colors.yaml` - SINGLE SOURCE OF TRUTH

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

- `/design-tokens/source/` - YAML token definitions (SINGLE SOURCE OF TRUTH)
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