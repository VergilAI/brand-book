# Migration Dashboard Specification

## 🎯 Purpose

An internal web-based dashboard to help developers track and manage the migration from hardcoded values to the centralized token system. This tool will provide real-time visibility into migration progress, identify problem areas, and guide developers through the cleanup process.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js (already in use)
- **Route**: `/internal/migration-dashboard`
- **Data Source**: File system scanning + existing reports
- **Update Frequency**: Real-time on page load + WebSocket for live updates
- **Authentication**: Basic auth or IP restriction (internal only)

### Data Collection
1. **Real-time Scanning**: On-demand file analysis
2. **Cached Reports**: Use existing report files for performance
3. **Git Integration**: Show last modified info and blame data
4. **Live Reload**: WebSocket connection for file watcher updates

## 📊 Dashboard Sections

### 1. Executive Summary Header
```
┌─────────────────────────────────────────────────────────────┐
│  Migration Progress Dashboard                    [Refresh]   │
│  Last Updated: 2025-01-01 10:00:00 AM                      │
├─────────────────────────────────────────────────────────────┤
│  Overall Health Score: 68%                    🟡 Warning    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [████████████████████░░░░░░░░░░░░░] 68%                   │
└─────────────────────────────────────────────────────────────┘
```

**Metrics Displayed:**
- Overall token adoption percentage
- Health score with color coding (🟢 >80%, 🟡 50-80%, 🔴 <50%)
- Progress bar visualization
- Auto-refresh timestamp

### 2. Key Metrics Grid
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Components  │ Hardcoded   │ Token       │ Coverage    │
│ 82 total    │ 2,323       │ 1,847       │ 37%         │
│ ↑ 5 this wk │ ↓ 127       │ ↑ 234       │ ↑ 3.2%      │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Colors      │ Spacing     │ Typography  │ Shadows     │
│ 156 found   │ 892 found   │ 234 found   │ 89 found    │
│ 78 in TS    │ 445 in CSS  │ 112 in both │ 45 in YAML  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Features:**
- Click any metric for detailed breakdown
- Week-over-week change indicators
- Hover for trend sparklines
- Export data as CSV

### 3. Component Health Matrix

**Interactive Table View:**
```
Component Name     | Status | Coverage | Violations | Actions
-------------------|--------|----------|------------|----------
Button             | 🟢     | 100%     | 0          | [View]
Card               | 🟡     | 67%      | 12         | [Fix] [View]
Navigation         | 🔴     | 23%      | 45         | [Fix] [View]
UserJourneyCarousel| 🔴     | 12%      | 89         | [Fix] [View]
```

**Features:**
- Sortable columns
- Filter by status/category
- Search functionality
- Batch selection for bulk operations
- Export selected components

**Expandable Row Details:**
```
▼ Card Component
  ├─ File: /components/ui/Card.tsx
  ├─ Last Modified: 2 days ago by @developer
  ├─ Violations:
  │   ├─ Colors: 4 (#7B00FF, #1D1D1F, rgb(255,255,255), #F5F5F7)
  │   ├─ Spacing: 6 (16px, 24px, 32px, 1rem, 2rem, 40px)
  │   └─ Shadows: 2 (custom box-shadow definitions)
  ├─ Token Usage:
  │   ├─ Correct: var(--vergil-purple), spacing-4, radius-md
  │   └─ Missing: colors.surface, spacing.card, shadows.card
  └─ Quick Actions: [Open in Editor] [Generate Fix] [View History]
```

### 4. Color Analysis Panel

**Visual Color Inventory:**
```
┌─ Color Distribution ────────────────────────────────────────┐
│                                                             │
│  Hardcoded Colors Found:                                    │
│  ┌────────┐ #7B00FF (45 instances) → vergil-purple        │
│  │        │ Used in: Button, Card, Navigation              │
│  └────────┘ [Replace All] [View Locations]                 │
│                                                             │
│  ┌────────┐ #1D1D1F (23 instances) → vergil-off-black     │
│  │        │ Used in: Typography, Borders                   │
│  └────────┘ [Replace All] [View Locations]                 │
│                                                             │
│  Source Distribution:                                       │
│  ├─ TypeScript files: 78 colors (45%)                     │
│  ├─ CSS/SCSS files: 52 colors (32%)                       │
│  ├─ Both TS + CSS: 23 colors (14%)                        │
│  └─ Already in YAML: 15 colors (9%)                       │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Color swatches with hex/rgb values
- Suggested token mappings
- One-click replacement actions
- Visual diff between old and new
- Confidence scores for mappings

### 5. Directory Heat Map

**Tree View with Violation Density:**
```
📁 /app
  📁 brand (🟢 12 violations)
    📄 page.tsx (🟢 2)
    📄 layout.tsx (🟢 0)
  📁 vergil-main (🔴 234 violations)
    📄 page.tsx (🔴 89)
    📁 sections (🔴 145)
      📄 hero.tsx (🔴 67)
      📄 features.tsx (🔴 78)
📁 /components
  📁 ui (🟡 456 violations)
    📄 button.tsx (🟢 0) ✓
    📄 card.tsx (🟡 23)
    📄 input.tsx (🔴 45)
```

**Features:**
- Collapsible tree structure
- Color-coded by violation density
- File-level drill down
- Bulk fix by directory
- Progress indicators for in-progress fixes

### 6. Migration Workflow Assistant

**Step-by-Step Guide:**
```
┌─ Migration Assistant ───────────────────────────────────────┐
│                                                             │
│  Current Focus: Card Component                              │
│                                                             │
│  Step 1/4: Analyzing violations... ✓                       │
│  Step 2/4: Generating token mappings...                    │
│  ├─ #7B00FF → vergil-purple (confidence: 100%)            │
│  ├─ 16px → spacing-4 (confidence: 95%)                    │
│  └─ Custom shadow → shadows.card (confidence: 80%)        │
│                                                             │
│  Step 3/4: Preview changes                                 │
│  [Show Diff] [Edit Mappings] [Apply Changes]              │
│                                                             │
│  Step 4/4: Verify and commit                              │
│  [ ] Run tests                                             │
│  [ ] Update Storybook                                      │
│  [ ] Commit changes                                        │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- AI-powered suggestions
- Side-by-side diff view
- Rollback capability
- Test integration
- Git integration

### 7. Real-Time Activity Feed

**Live Updates:**
```
┌─ Activity Feed ─────────────────────────────────────────────┐
│                                                             │
│  🕐 10:15 AM - Button component migrated by @alice         │
│     └─ 12 violations fixed, 100% coverage achieved        │
│                                                             │
│  🕐 10:12 AM - New violations detected in ProfileCard      │
│     └─ 3 new hardcoded colors introduced                  │
│                                                             │
│  🕐 10:08 AM - Bulk fix applied to /components/landing     │
│     └─ 67 violations fixed across 5 files                 │
│                                                             │
│  [Load More...]                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8. Batch Operations Panel

**Bulk Actions:**
```
┌─ Batch Operations ──────────────────────────────────────────┐
│                                                             │
│  Selected: 12 components (234 violations)                   │
│                                                             │
│  Available Actions:                                         │
│  ├─ [🔄 Auto-fix Colors] Replace all matching colors      │
│  ├─ [📏 Auto-fix Spacing] Convert px to spacing tokens    │
│  ├─ [📝 Generate Report] Export detailed analysis         │
│  ├─ [🏷️ Add TODO Comments] Mark for manual review        │
│  └─ [🚀 Create PR] Batch fixes with review               │
│                                                             │
│  Presets:                                                   │
│  [Quick Win] [Safe Changes] [Full Migration]              │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 UI/UX Design Principles

### Visual Design
- **Dark mode default** with light mode toggle
- **Monaco Editor** integration for code preview
- **Syntax highlighting** for code snippets
- **Responsive design** for various screen sizes
- **Keyboard shortcuts** for power users

### Information Architecture
1. **Progressive disclosure**: Start with summary, drill down for details
2. **Context preservation**: Breadcrumbs and state management
3. **Action-oriented**: Clear CTAs at every level
4. **Feedback loops**: Real-time updates and progress indicators

### Performance Considerations
- **Virtualized lists** for large datasets
- **Lazy loading** for detailed views
- **Background workers** for file scanning
- **Incremental updates** via WebSocket
- **Client-side caching** with IndexedDB

## 🔧 Technical Implementation

### API Endpoints
```typescript
/api/migration/
  ├─ GET /summary - Overall statistics
  ├─ GET /components - Component list with health
  ├─ GET /violations/:componentId - Detailed violations
  ├─ GET /colors - Color inventory and mappings
  ├─ GET /directory-tree - File system analysis
  ├─ POST /fix - Apply automated fixes
  ├─ POST /preview - Preview changes
  └─ WS /live-updates - Real-time feed
```

### Data Models
```typescript
interface ComponentHealth {
  id: string;
  name: string;
  path: string;
  category: 'ui' | 'vergil' | 'landing' | 'lms';
  coverage: number;
  violations: Violation[];
  lastModified: Date;
  status: 'clean' | 'warning' | 'error';
}

interface Violation {
  type: 'color' | 'spacing' | 'typography' | 'shadow';
  value: string;
  line: number;
  column: number;
  context: string;
  suggestedToken?: string;
  confidence?: number;
}

interface ColorMapping {
  hardcoded: string;
  instances: FileLocation[];
  suggestedToken: string;
  category: 'brand' | 'semantic' | 'component';
  autoFixable: boolean;
}
```

### Security & Access Control
- **Internal route only** (/internal/*)
- **Environment-based access** (development/staging only)
- **Read-only by default** with explicit write permissions
- **Audit logging** for all mutations
- **Dry-run mode** for testing fixes

## 🚀 Phased Rollout Plan

### Phase 1: Read-Only Dashboard (Week 1)
- Summary statistics
- Component health matrix
- Color inventory
- Directory heat map

### Phase 2: Interactive Features (Week 2)
- Drill-down views
- Search and filter
- Export functionality
- Real-time updates

### Phase 3: Assisted Migration (Week 3)
- Migration workflow assistant
- Preview capabilities
- Single-file fixes
- Rollback support

### Phase 4: Batch Operations (Week 4)
- Bulk selection
- Batch fixes
- PR generation
- Team activity feed

## 📈 Success Metrics

1. **Adoption Rate**: % of developers using the dashboard
2. **Fix Velocity**: Violations fixed per day
3. **Accuracy**: % of auto-fixes that pass review
4. **Time Saved**: Hours saved vs manual migration
5. **Coverage Growth**: Weekly % increase in token adoption

## 🎯 Key Features Summary

1. **Real-time visibility** into migration progress
2. **Actionable insights** with one-click fixes
3. **Confidence scoring** for automated suggestions
4. **Team collaboration** through activity feeds
5. **Progressive migration** with safety checks
6. **Historical tracking** with trend analysis
7. **Export capabilities** for reporting
8. **Integration points** with existing tools

This dashboard will serve as the command center for your token migration effort, making the process transparent, manageable, and efficient for all developers involved.