# Token Migration Status

## Overview

This document tracks the progress of migrating from arbitrary values to semantic design tokens across the codebase.

## Current Status

- **Total occurrences of arbitrary values**: ~1,141
- **Components manually migrated**: 2
  - ✅ `KnowledgePointAnalytics.tsx` - Color values migrated to CSS variables
  - ✅ `dialog.tsx` - Spacing and z-index values migrated to tokens

## Migration Progress by Category

### 🎨 Color Values
- **Status**: In Progress
- **Pattern**: `#RRGGBB` → `var(--color-token-name)`
- **Common values to migrate**:
  - `#7B00FF` → `vergil-purple`
  - `#10B981` → `success`
  - `#EF4444` → `error`
  - `#F59E0B` → `warning`

### 📏 Spacing Values
- **Status**: In Progress
- **Pattern**: `p-[Npx]` → `p-token`
- **Common values to migrate**:
  - `p-4`, `m-4` → `p-md`, `m-md` (if 4 = 16px)
  - `gap-8` → `gap-xl` (if 8 = 32px)
  - `space-y-4` → `space-y-md`

### 🎭 Shadow Values
- **Status**: Not Started
- **Pattern**: `shadow-{sm|md|lg|xl}` → `shadow-{semantic}`
- **Mappings**:
  - `shadow-sm` → `shadow-card`
  - `shadow-md` → `shadow-cardHover`
  - `shadow-lg` → `shadow-dropdown`
  - `shadow-xl` → `shadow-modal`

## High-Priority Files

Based on component usage and visual impact:

### 1. Core UI Components
- [ ] `/components/button.tsx`
- [ ] `/components/card.tsx`
- [ ] `/components/input.tsx`
- [ ] `/components/select.tsx`
- [ ] `/components/badge.tsx`

### 2. LMS Components
- [ ] `/components/course-overview.tsx`
- [ ] `/components/lesson-card.tsx`
- [ ] `/components/course-section.tsx`
- [ ] `/components/student-dashboard.tsx`
- [ ] `/components/lms-header.tsx`

### 3. Game Components
- [ ] `/components/flashcard-game.tsx`
- [ ] `/components/millionaire-game.tsx`
- [ ] `/components/jeopardy-game.tsx`
- [ ] `/components/territory-conquest.tsx`

### 4. Admin Components
- [ ] `/components/admin/admin-dashboard.tsx`
- [ ] `/components/admin/course-builder.tsx`
- [ ] `/components/admin/analytics-dashboard.tsx`

## Migration Tools

1. **Automated Script**: `/scripts/migrate-to-tokens.js`
   - Run with: `node scripts/migrate-to-tokens.js`
   - Generates report: `MIGRATION_REPORT.json`

2. **Manual Guide**: `TOKEN_MIGRATION_GUIDE.md`
   - Reference for manual migrations
   - Common patterns and pitfalls

## Next Steps

1. **Phase 1**: Migrate core UI components (Button, Card, Input)
2. **Phase 2**: Migrate high-traffic LMS components
3. **Phase 3**: Migrate game interfaces
4. **Phase 4**: Migrate admin interfaces
5. **Phase 5**: Clean up any remaining arbitrary values

## Notes

- Some values like `p-4` might be standard Tailwind classes (16px), not arbitrary values
- Focus on actual arbitrary values first: `p-[24px]`, `bg-[#hexcode]`, etc.
- Test each component after migration to ensure visual consistency
- Update Storybook stories alongside component migrations