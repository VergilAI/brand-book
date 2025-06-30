# Vergil Design System

A **centralized, token-first design system** with complete automation, coverage reporting, and quality enforcement. This system ensures every design decision flows from a single source of truth with zero tolerance for hardcoded values.

## 🎯 **The Centralized System**

This design system implements a **"single source of truth"** architecture where:
- ✅ **All design tokens** are centrally defined in YAML
- ✅ **All components** use only design tokens (no hardcoded values)
- ✅ **Complete Storybook coverage** is enforced
- ✅ **Quality metrics** are automatically tracked
- ✅ **Token alignment** is validated in CI/CD

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build design tokens from YAML sources
npm run build:tokens
```

Open [http://localhost:3000](http://localhost:3000) to view the design system.

## 📁 Project Structure

```
vergil-design-system/
├── app/                    # Next.js app router pages
├── components/             # All components (token-first only)
│   ├── ui/                 # Core UI components  
│   ├── vergil/             # Brand-specific components
│   ├── landing/            # Landing page components
│   └── lms/                # LMS-specific components
├── design-tokens/          # 🎯 SINGLE SOURCE OF TRUTH
│   └── source/             # YAML token definitions
├── generated/              # Auto-generated token outputs
├── scripts/                # Automation and validation tools
├── reports/                # Coverage and quality reports  
├── eslint-rules/           # Custom token enforcement rules
└── docs/                   # System documentation
```

## 🎨 **V2 Design Token System**

### Single Source of Truth: `/design-tokens/source/`

All design decisions are defined in YAML files:

```yaml
# colors.yaml - V2 Color System
colors:
  brand:
    purple: "#7B00FF"          # THE brand purple (V2)
    purple-light: "#9933FF"    # Hover states
  
  neutral:
    off-black: "#1D1D1F"       # Apple-inspired primary text
    off-white: "#F5F5F7"       # Container backgrounds
```

### Automated Token Pipeline

```bash
# Build all token formats from YAML
npm run build:tokens

# Generated outputs:
# ├── tokens.css      - CSS custom properties
# ├── tokens.ts       - TypeScript constants  
# ├── tokens.json     - JSON for tools
# ├── tailwind-theme.js - Tailwind config
# └── tokens.scss     - Sass variables
```

### V2 Color System Features

- **Apple-Inspired Monochrome** - Sophisticated neutral palette
- **Brand Purple Evolution** - `#7B00FF` (V2) vs `#6366F1` (deprecated V1)  
- **Subtle Attention Hierarchy** - Emphasis backgrounds and text colors
- **Semantic Aliases** - `colors.semantic.interactive.primary: "{colors.brand.purple}"`

## 🛠 **Essential Commands**

### Component Development

```bash
# Create new component with V2 tokens (MANDATORY)
npm run create:component MyButton

# All components MUST use this tool - no manual creation
npm run create:component MyButton -- --category=ui --variants=true
```

### Quality Assurance

```bash
# Scan for hardcoded values (REQUIRED before commits)
npm run scan:hardcoded

# Validate token alignment between CSS/TypeScript
npm run validate-tokens

# Generate complete coverage reports
npm run report:all
```

### Enforcement

```bash
# Check token violations (MANDATORY in CI/CD)
npm run lint:tokens

# Auto-fix violations where possible
npm run lint:fix
```

## 🎯 **Quality Metrics & Reporting**

### Component Health Scoring

Every component gets a health score (0-100%) based on:
- **Storybook Coverage** (20%) - Has complete stories with variants
- **Test Coverage** (20%) - Unit tests and accessibility tests
- **Token Usage** (20%) - Uses V2 tokens vs hardcoded values
- **Documentation** (15%) - JSDoc and usage examples
- **TypeScript** (20%) - Proper typing and interfaces

### Current System Status

```bash
# View health dashboard
npm run report:all

# Key metrics:
# - 82 total components tracked
# - 34% average health score (needs improvement)
# - 37% Storybook coverage  
# - 2% test coverage (critical)
# - 29% V2 token adoption
```

### Enforcement Pipeline

1. **Pre-commit hooks** - Prevent hardcoded values
2. **ESLint rules** - Catch violations during development
3. **CI/CD validation** - Block PRs with token violations
4. **Coverage reports** - Track progress over time

## 🚫 **What's NOT Allowed**

This system has **zero tolerance** for:

```typescript
// ❌ NEVER ALLOWED
<div className="bg-[#7B00FF]" />           // Arbitrary Tailwind
<div style={{ color: '#7B00FF' }} />       // Inline styles  
<div className="bg-purple-500" />          // Non-token classes
const color = '#7B00FF';                   // Hardcoded hex values

// ✅ ALWAYS REQUIRED
<div className="bg-vergil-purple" />       // Token-based classes
<div className="bg-brand-primary" />       // Semantic tokens
import { tokens } from '@/tokens';         // Token imports
```

## 🛠 **Development Workflow**

### 1. Creating Components (MANDATORY PROCESS)

```bash
# Step 1: ALWAYS use the scaffolding tool
npm run create:component MyButton -- --category=ui

# Step 2: Develop using only V2 tokens  
# Step 3: Validate before committing
npm run lint:tokens
npm run scan:hardcoded
```

### 2. Quality Assurance (REQUIRED)

```bash
# Before any commit
npm run validate-tokens    # Ensure token alignment
npm run lint:tokens       # Check for violations
npm run scan:hardcoded    # Scan for hardcoded values

# Weekly quality review
npm run report:all        # Generate full coverage report
```

### 3. Token Updates (CENTRALIZED ONLY)

```bash
# Update tokens in /design-tokens/source/*.yaml
# Then rebuild everything
npm run build:tokens
npm run validate-tokens
```

## 📊 **Complete NPM Script Reference**

### Essential Commands
```bash
npm run create:component     # Create new component (MANDATORY)
npm run build:tokens         # Build tokens from YAML sources
npm run validate-tokens      # Check CSS/TypeScript alignment
npm run scan:hardcoded       # Find all hardcoded values
npm run lint:tokens          # Enforce token usage rules
npm run report:all           # Generate coverage reports
```

### Development Commands
```bash
npm run dev                  # Start development server
npm run build                # Build for production
npm run watch:tokens         # Watch token sources and rebuild
npm run lint:fix             # Auto-fix ESLint violations
```

### Quality Assurance Commands
```bash
npm run report:coverage      # Component coverage report
npm run report:trends        # Historical trend analysis
npm run test:tokens          # Run token alignment tests
npm run precommit            # Full pre-commit validation
```

## 🎯 **System Architecture Benefits**

### For Developers
- **Zero guesswork** - All design decisions centralized
- **Instant validation** - Catch violations immediately
- **Auto-generation** - Components, stories, tests created automatically
- **Type safety** - Compile-time validation of design tokens

### For Designers  
- **Single source of truth** - Update YAML, everything updates
- **Version control** - Track all design changes
- **Impact analysis** - See what changes when tokens update
- **Living documentation** - Always up-to-date component library

### For Teams
- **Consistency** - Impossible to create non-compliant components
- **Quality metrics** - Data-driven improvement decisions
- **Automation** - Reduce manual maintenance overhead
- **Scalability** - System enforces standards as team grows

## 🔮 **Living System Philosophy**

Vergil's design system embodies **"living intelligence"**:

- **Breathing animations** - Components feel organically alive
- **Neural connectivity** - Visual patterns suggest AI thinking
- **Adaptive responses** - Interface reacts to user presence
- **Gradient consciousness** - Colors flow like thought processes

All powered by the **V2 token system** for perfect consistency.

## 🚀 **Next Steps**

1. **Run quality scan**: `npm run report:all` - See current state
2. **Check violations**: `npm run lint:tokens` - Find issues to fix
3. **Create first component**: `npm run create:component TestButton`
4. **Set up automation**: Add pre-commit hooks for team

---

**Built with systematic precision for the future of AI orchestration.**

*This design system enforces quality through automation, ensures consistency through centralization, and maintains standards through validation.*
