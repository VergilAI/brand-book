# Component Inventory

This document provides a comprehensive list of all components in the LMS system and tracks whether they use centralized semantic tokens.

## Component Status Overview

Total Components: **70**  
Using Semantic Tokens: **32** (46%)  
Not Using Semantic Tokens: **38** (54%)

## Component List

### UI Primitives (Core Components)

| Component | Description | Uses Semantic Tokens |
|-----------|-------------|---------------------|
| `alert.tsx` | Alert/notification component | ✅ |
| `avatar.tsx` | User avatar display | ✅ |
| `atomic/avatar.tsx` | New atomic avatar component with proper sizing | ✅ |
| `badge.tsx` | Badge/tag component | ✅ |
| `button.tsx` | Button component with variants | ✅ |
| `card.tsx` | Card with multiple variants | ✅ |
| `checkbox.tsx` | Checkbox input | ✅ |
| `collapsible.tsx` | Collapsible/expandable content | ✅ |
| `dialog.tsx` | Modal dialog component | ✅ |
| `dropdown-menu.tsx` | Dropdown menu component | ✅ |
| `input.tsx` | Text input component | ✅ |
| `label.tsx` | Form label component | ✅ |
| `popover.tsx` | Popover/floating content | ✅ |
| `progress.tsx` | Progress bar component | ✅ |
| `select.tsx` | Select dropdown component | ✅ |
| `slider.tsx` | Range slider component | ✅ |
| `switch.tsx` | Toggle switch component | ✅ |
| `tabs.tsx` | Tab navigation component | ✅ |
| `textarea.tsx` | Multi-line text input | ✅ |
| `tooltip.tsx` | Tooltip component | ✅ |

### LMS Components

| Component | Description | Uses Semantic Tokens |
|-----------|-------------|---------------------|
| `ChapterCard.tsx` | Chapter display card | ❌ |
| `course-detail.tsx` | Course detail view | ✅ |
| `course-overview.tsx` | Course overview display | ✅ |
| `course-section.tsx` | Course section component | ✅ |
| `KnowledgePointAnalytics.tsx` | Analytics for knowledge points | ❌ |
| `LearnModal.tsx` | Modal for learning content | ❌ |
| `lesson-card.tsx` | Individual lesson card | ✅ |
| `lesson-modal.tsx` | Modal for lesson content | ✅ |
| `lesson-viewer.tsx` | Lesson content viewer | ✅ |
| `LessonRow.tsx` | Lesson row display | ❌ |
| `lms-header.tsx` | LMS header navigation | ✅ |
| `lms-sidebar.tsx` | LMS sidebar navigation | ✅ |
| `new-course-overview.tsx` | New course overview design | ✅ |
| `student-dashboard.tsx` | Student dashboard view | ✅ |
| `test-interface.tsx` | Test/quiz interface | ✅ |
| `TestInterface.tsx` | Alternative test interface | ✅ |

### Game Components

| Component | Description | Uses Semantic Tokens |
|-----------|-------------|---------------------|
| `connect-cards-game.tsx` | Card matching game | ❌ |
| `flashcard-game.tsx` | Flashcard study game | ❌ |
| `game-interface.tsx` | Generic game interface | ❌ |
| `game-launcher.tsx` | Game selection/launch interface | ❌ |
| `game-type-card.tsx` | Game type selection card | ❌ |
| `jeopardy-board.tsx` | Jeopardy game board | ❌ |
| `jeopardy-buzzer.tsx` | Jeopardy buzzer component | ❌ |
| `jeopardy-clue.tsx` | Jeopardy clue display | ❌ |
| `jeopardy-game.tsx` | Main Jeopardy game component | ❌ |
| `jeopardy-multiplayer-game.tsx` | Multiplayer Jeopardy variant | ❌ |
| `jeopardy-player-setup.tsx` | Player setup for Jeopardy | ❌ |
| `jeopardy-players-display.tsx` | Players display for Jeopardy | ❌ |
| `jeopardy-score.tsx` | Score display for Jeopardy | ❌ |
| `millionaire-audience-poll.tsx` | Audience poll for Millionaire | ❌ |
| `millionaire-game.tsx` | Who Wants to Be a Millionaire | ❌ |
| `millionaire-lifelines.tsx` | Lifelines for Millionaire game | ❌ |
| `millionaire-progress.tsx` | Progress indicator for Millionaire | ❌ |
| `millionaire-question.tsx` | Question display for Millionaire | ❌ |
| `territory-conquest.tsx` | Territory conquest game | ❌ |
| `optimized-territory-map.tsx` | Optimized territory map | ❌ |

### Admin Components

| Component | Description | Uses Semantic Tokens |
|-----------|-------------|---------------------|
| `admin/admin-dashboard.tsx` | Main admin dashboard | ❌ |
| `admin/admin-layout.tsx` | Admin panel layout wrapper | ❌ |
| `admin/analytics-dashboard.tsx` | Analytics and reporting dashboard | ❌ |
| `admin/course-builder.tsx` | Course creation/editing interface | ❌ |
| `admin/course-management.tsx` | Course management interface | ❌ |
| `admin/data-table.tsx` | Data table component | ❌ |
| `admin/flashcard-lesson-editor.tsx` | Editor for flashcard lessons | ❌ |
| `admin/material-lesson-editor.tsx` | Editor for material lessons | ❌ |
| `admin/metric-card.tsx` | Metric display card | ❌ |
| `admin/rich-text-editor.tsx` | Rich text editor component | ❌ |
| `admin/rpg-lesson-editor.tsx` | Editor for RPG-style lessons | ❌ |
| `admin/test-lesson-editor.tsx` | Editor for test/quiz lessons | ❌ |
| `admin/user-management.tsx` | User management interface | ❌ |

### Utility Components

| Component | Description | Uses Semantic Tokens |
|-----------|-------------|---------------------|
| `debug-panel.tsx` | Debug information panel | ❌ |
| `user-management-header.tsx` | Header for user management | ❌ |
| `vergil-logo.tsx` | Vergil brand logo component | ❌ |

## Notes

### What are Semantic Tokens?
Semantic tokens are design tokens that describe the purpose or meaning of a value rather than its appearance. For example:
- ❌ **Non-semantic**: `color-blue-500`, `spacing-4`
- ✅ **Semantic**: `color-primary`, `color-error`, `spacing-card-padding`

### Current Status
Currently, all components use hard-coded Tailwind classes or direct color values from the theme. No components have been migrated to use centralized semantic tokens yet.

### Migration Priority
When implementing semantic tokens, consider prioritizing:
1. **UI Primitives** - These form the foundation and are used by all other components
2. **Admin Components** - Consistent theming is critical for admin interfaces
3. **LMS Components** - Core application components
4. **Game Components** - Can be migrated last as they often have unique styling needs

### Semantic Token Categories to Implement
- **Colors**: primary, secondary, error, warning, success, neutral
- **Typography**: heading, body, caption, code
- **Spacing**: component padding, gaps, margins
- **Borders**: radius, width, color
- **Shadows**: elevation levels
- **Motion**: duration, easing

---

*Last updated: July 4, 2025 - Semantic token migration in progress*