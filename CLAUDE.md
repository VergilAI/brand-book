# Vergil Design System - Project Overview

## Project Structure

This repository contains multiple Vergil-related projects:

1. **Brand Book** (`/app/brand/`) - Comprehensive brand guidelines and design system documentation
2. **Vergil Main** (`/app/vergil-main/`) - Main AI infrastructure platform landing page
3. **Vergil Learn** (`/app/vergil-learn/`) - Educational platform landing page
4. **LMS Demo** (`/app/lms/`) - Learning Management System demo interface

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (IMPORTANT: v4 syntax, not v3)
- **UI Components**: Custom components + Radix UI primitives
- **Animations**: Framer Motion
- **Data Visualization**: D3.js
- **Component Architecture**: Class Variance Authority (CVA)

## CRITICAL: Component Architecture Standards

### Component Structure (MANDATORY)
Every component MUST follow this structure:
```
components/
└── ComponentName/
    ├── ComponentName.tsx          // Component implementation
    ├── ComponentName.stories.tsx  // Storybook stories (required)
    ├── ComponentName.test.tsx     // Tests (required)
    ├── ComponentName.module.css   // Styles (if needed)
    └── index.ts                   // Exports
```

### Component Categories & Precedence
1. **Vergil Learn Components** - HIGHEST PRIORITY (fully approved, do not modify)
   - LearnHero, UserJourneyCarousel, Navigation, LearnFooter
2. **Core UI Components** - Unified system (Card with all variants, Button, Input, etc.)
3. **Brand Components** - Vergil-specific (RadialHeatmap, StreamgraphBackground, logos)
4. **Module Components** - Product-specific (LMS CourseCard, GameInterface)

### Unified Card System
The Card component now includes all variants:
- `default` - Basic card
- `interactive` - With hover effects and breathing
- `neural` - With gradient background
- `feature` - For feature displays (replaces FeatureCard)
- `metric` - For metrics (replaces MetricCard)
- `problem` - For problem/solution displays (replaces ProblemCard)
- `gradient` - With consciousness gradient
- `outlined` - With border emphasis

### Token-First Development (MANDATORY)
```typescript
// ❌ NEVER use arbitrary values or hardcoded colors
<div className="bg-[#6366F1]" />
<div className="bg-[#7B00FF]" />
<div style={{ color: '#7B00FF' }} />

// ✅ ALWAYS use V2 design tokens
<div className="bg-vergil-purple" />
<div className="text-vergil-off-black" />
```

**CRITICAL RULE**: Every component MUST use only design tokens. No hardcoded values allowed.

## CLAUDE.md File Guidelines

### Purpose of CLAUDE.md Files
CLAUDE.md files are context documents that get passed to AI assistants when working on specific parts of the codebase. They should contain ONLY the most relevant information for that specific context level.

### Hierarchy and Content Rules

#### Root CLAUDE.md (this file)
- **ONLY** universal, project-wide standards
- Critical architectural decisions
- Mandatory patterns that apply everywhere
- Brief project structure overview
- Links to module-specific CLAUDE.md files

#### Module-level CLAUDE.md (`/app/[module]/CLAUDE.md`)
- Module-specific architecture
- Page structure and routing
- Module-specific components
- Business logic unique to that module
- Module deployment instructions

#### Component-level CLAUDE.md (`/components/[category]/CLAUDE.md`)
- Component library standards
- Specific patterns for that component category
- Props documentation patterns
- Accessibility requirements
- Performance considerations

### Writing Effective CLAUDE.md Files

1. **Be Concise**: Every line should be essential
2. **Be Specific**: Include exact file paths and code examples
3. **Be Current**: Update immediately when patterns change
4. **Be Contextual**: Only include what's needed at that level

Example hierarchy:
```
/CLAUDE.md (root) - Universal standards, component structure
├── /app/lms/CLAUDE.md - LMS routing, features, components
│   └── /app/lms/courses/CLAUDE.md - Course-specific logic
├── /components/CLAUDE.md - Component library overview
│   ├── /components/ui/CLAUDE.md - Primitive patterns
│   └── /components/vergil/CLAUDE.md - Brand component patterns
```

## Key Conventions

### Tailwind CSS v4
- Import syntax: `@import "tailwindcss"` (NOT `@tailwind base/components/utilities`)
- Config file: `tailwind.config.js` (JavaScript, not TypeScript)

### Brand Guidelines (V2 TOKEN SYSTEM)
- **Logo Strategy**: All logos are white by default - always use on dark/colored backgrounds
- **Color System V2**: MANDATORY Apple-inspired monochrome palette
  - **Primary Brand**: `vergil-purple` (#7B00FF) - THE brand color
  - **Neutrals**: `vergil-off-black` (#1D1D1F), `vergil-off-white` (#F5F5F7)  
  - **Emphasis**: `vergil-emphasis-bg`, `vergil-emphasis-text`, `vergil-emphasis-button-hover`
  - **DEPRECATED**: `cosmic-purple` (#6366F1) - DO NOT USE V1 colors
  - **Token Source**: `/design-tokens/source/colors.yaml` - SINGLE SOURCE OF TRUTH
- **Animations**: Incorporate "living system" breathing effects using token-based values

### Component Organization
- `/components/ui/` - Core UI components (unified Card, Button, Input, etc.)
- `/components/vergil/` - Brand-specific components (logos, patterns, visualizations)
- `/components/landing/` - Approved landing components (Navigation, LearnHero, UserJourneyCarousel)
- `/components/lms/` - LMS-specific components (CourseCard, LessonViewer, etc.)
- `/components/docs/` - Documentation components
- `/components/landing/_archived/` - Deprecated components (replaced by unified system)

### Code Style
- DO NOT add comments unless requested
- Follow existing patterns in neighboring files
- Use existing libraries - check package.json first
- Maintain accessibility (WCAG AA standards)

## MANDATORY: Centralized Design System Commands

### Component Creation (ALWAYS REQUIRED)
```bash
# NEVER create components manually - ALWAYS use the scaffolding tool
npm run create:component ComponentName -- --category=ui

# This generates: Component.tsx, stories, tests with V2 tokens only
# Manual component creation is FORBIDDEN
```

### Quality Assurance (REQUIRED BEFORE COMMITS)
```bash
npm run scan:hardcoded     # Scan for hardcoded values (REQUIRED)
npm run lint:tokens        # Check token violations (REQUIRED)
npm run validate-tokens    # Ensure CSS/TS alignment (REQUIRED)
```

### Token Management (CENTRALIZED ONLY)
```bash
npm run build:tokens       # Build tokens from YAML sources
npm run watch:tokens       # Watch token sources during development
```

### Coverage & Reporting
```bash
npm run report:all         # Generate complete coverage reports
npm run report:coverage    # Component health scores
npm run report:trends      # Historical trend analysis
```

### Development Commands
```bash
npm run dev               # Start development server
npm run build             # Build for production
npm run start             # Start production server
```

### CRITICAL ENFORCEMENT RULES

1. **NEVER create components manually** - Always use `npm run create:component`
2. **NEVER commit without validation** - Run `npm run lint:tokens` first
3. **NEVER use hardcoded values** - Token-first development only
4. **ALWAYS validate token alignment** - Run `npm run validate-tokens`
5. **ALWAYS check coverage** - Run `npm run report:all` weekly

## Module-Specific Documentation

Each major module has its own CLAUDE.md file with detailed information:

- `/app/brand/CLAUDE.md` - Brand book implementation details
- `/app/vergil-main/CLAUDE.md` - Vergil platform landing documentation
- `/app/vergil-learn/CLAUDE.md` - Vergil Learn landing documentation
- `/app/lms/CLAUDE.md` - LMS module documentation
- `/app/map-editor/CLAUDE.md` - Map editor with z-order management, snapping, templates, copy/paste
- `/components/CLAUDE.md` - Component library documentation
- `/public/data/CLAUDE.md` - Data files documentation

## CENTRALIZED DESIGN SYSTEM DOCUMENTATION

### Core System Files
- `/design-tokens/source/` - YAML token definitions (SINGLE SOURCE OF TRUTH)
- `/generated/` - Auto-generated token outputs (CSS, TS, JSON, Tailwind)
- `/scripts/` - Automation and validation tools
- `/reports/` - Coverage and quality reports
- `/eslint-rules/` - Token enforcement rules
- `/docs/component-inventory.md` - Complete component health tracking

### Additional Documentation
- `/docs/snapping-system.md` - Comprehensive snapping system documentation
- `/docs/template-library.md` - Template shape library documentation
- `/app/map-editor/docs/template-library-plan.md` - Implementation plan and status
- `/docs/hardcoded-values-scanner.md` - Hardcoded value detection system
- `/docs/eslint-token-enforcement.md` - Token enforcement rules documentation

## Deployment

For deploying individual modules, use branch-specific .gitignore files:
- `.gitignore.brand-book` - Deploy only brand book
- `.gitignore.vergil` - Deploy only Vergil platform landing
- `.gitignore.vergil-learn` - Deploy only Vergil Learn landing
- `.gitignore.lms` - Deploy only LMS demo

**Important**: See `README_GITIGNORE.md` for detailed deployment instructions.

### Quick Deployment Steps

1. **Create deployment branch**: `git checkout -b deploy-[module]`
2. **Apply module gitignore**: `cp .gitignore.[module] .gitignore`
3. **Commit and push**: `git add . && git commit -m "Deploy [module]" && git push`
4. **Configure platform** to deploy from the deployment branch

### GitHub Workflow

**Branch Strategy:**
- `main` - Development branch with all modules
- `deploy-brand-book` - Brand book deployment only
- `deploy-vergil` - Vergil platform landing deployment only
- `deploy-vergil-learn` - Vergil Learn landing deployment only
- `deploy-lms` - LMS deployment only

**Important Rules:**
- Never modify .gitignore on main branch
- Don't merge deployment branches back to main
- Update deployment branches by merging from main

**Updating Deployments:**
```bash
# After making changes on main
git checkout deploy-brand-book
git merge main
git push origin deploy-brand-book
```

## GitHub Repository

**URL**: https://github.com/VergilAI/brand-book

**Repository Structure:**
- Single monorepo containing all modules
- Module separation through routing and deployment branches  
- **Centralized design system** with YAML-based token management
- **Automated quality enforcement** through ESLint rules and pre-commit hooks
- **Complete coverage tracking** for components, tokens, and system health
- **Single source of truth** for all design decisions

## SYSTEM QUALITY METRICS

**Current Status** (run `npm run report:all` for latest):
- 82 total components tracked
- 34% average component health score
- 37% Storybook coverage
- 2% test coverage (CRITICAL - needs improvement)
- 29% V2 token adoption (migration in progress)
- 2,323 hardcoded values detected (needs token migration)
- 6,511 ESLint token violations (enforcement active)

**Quality Goals**:
- 100% component health scores
- 100% Storybook coverage (MANDATORY)
- 100% test coverage
- 100% V2 token adoption
- ZERO hardcoded values
- ZERO ESLint violations