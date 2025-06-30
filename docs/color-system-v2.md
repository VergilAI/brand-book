# Color System v2 Documentation

## Overview

The Vergil Color System v2 is an Apple-inspired monochrome palette with subtle attention hierarchies. This system moves beyond pure blacks and whites to create a sophisticated, comfortable visual experience.

## Color System Updates (December 2024)

### Key Changes Made

1. **Corrected Color Naming & Hierarchy**
   - Renamed `vergil-emphasis-dropdown-bg` → `vergil-emphasis-input-bg` (#FAFAFC)
     - Clarified it's for ALL interactive elements (dropdowns, inputs, selects, etc.)
     - Only appears within emphasis-bg areas
   
2. **Split Emphasis Text Colors**
   - `vergil-emphasis-text` (#303030) - Text directly on emphasis-bg
   - `vergil-emphasis-input-text` (#323232) - Text inside emphasis-input-bg elements
   - Creates proper contrast hierarchy for readability

3. **Fixed Button Color Logic**
   - **Removed** `vergil-emphasis-button` - it was redundant (just vergil-off-black)
   - **Kept** `vergil-emphasis-button-hover` (#272729) - the actual hover state color
   - Buttons now use:
     - Default: `bg-vergil-off-black` 
     - Hover: `hover:bg-vergil-emphasis-button-hover`
     - Text: Always `vergil-full-white`

## Complete Color Reference

### Brand Purple Palette

| Color Name | Hex Value | CSS Variable | Usage |
|------------|-----------|--------------|--------|
| vergil-purple | #7B00FF | --vergil-purple | Primary brand identity, CTAs, interactive elements |
| vergil-purple-light | #9933FF | --vergil-purple-light | Hover states, secondary emphasis |
| vergil-purple-lighter | #BB66FF | --vergil-purple-lighter | Dark theme primary, gradient midpoints |
| vergil-purple-lightest | #D199FF | --vergil-purple-lightest | Dark theme secondary, subtle accents |
| cosmic-purple (deprecated) | #6366F1 | --cosmic-purple | DEPRECATED - Do not use, kept for backward compatibility |

### Neutral Palette

| Color Name | Hex Value | CSS Variable | Usage |
|------------|-----------|--------------|--------|
| vergil-full-black | #000000 | --vergil-full-black | Backgrounds only, never text |
| vergil-off-black | #1D1D1F | --vergil-off-black | Primary text, button defaults |
| vergil-full-white | #FFFFFF | --vergil-full-white | Backgrounds only, never text |
| vergil-off-white | #F5F5F7 | --vergil-off-white | Text on dark, soft containers |

### Subtle Attention Hierarchy

| Color Name | Hex Value | CSS Variable | Usage |
|------------|-----------|--------------|--------|
| vergil-emphasis-bg | #F0F0F2 | --vergil-emphasis-bg | Temporary headers needing attention |
| vergil-emphasis-input-bg | #FAFAFC | --vergil-emphasis-input-bg | Interactive elements within emphasis areas |
| vergil-emphasis-text | #303030 | --vergil-emphasis-text | General text on emphasis-bg |
| vergil-emphasis-input-text | #323232 | --vergil-emphasis-input-text | Text inside interactive elements |
| vergil-emphasis-button-hover | #272729 | --vergil-emphasis-button-hover | Button hover state only |
| vergil-footnote-text | #6C6C6D | --vergil-footnote-text | Small text on off-white backgrounds |

### Functional Colors

| Color Name | Hex Value | CSS Variable | Usage |
|------------|-----------|--------------|--------|
| vergil-success | #0F8A0F | --vergil-success | Success states, positive feedback |
| vergil-error | #E51C23 | --vergil-error | Error states, critical alerts |
| vergil-warning | #FFC700 | --vergil-warning | Warning states, cautions |
| vergil-info | #0087FF | --vergil-info | Informational states, notices |

**Note:** The Functional Yellow Scale has been removed. Only the warning yellow (#FFC700) remains as part of the functional colors.

## Usage Rules

### 1. Background Hierarchy
```
vergil-full-white → vergil-off-white → vergil-emphasis-bg
```
Each step draws slightly more attention without being jarring.

### 2. Text Hierarchy
```
vergil-footnote-text → vergil-off-black → vergil-emphasis-text → vergil-emphasis-input-text
```
Increasing importance and contrast through subtle darkness shifts.

### 3. Separation Rule
**Critical**: Never place `vergil-off-white` directly adjacent to `vergil-emphasis-bg`. Always separate with `vergil-full-white` to prevent the subtle color difference from being jarring.

### 4. Interactive Elements
- Background: `vergil-emphasis-input-bg`
- Text/Icons: `vergil-emphasis-input-text`
- Creates higher contrast for actionable items

## Common Use Cases

### Region/Language Selectors
```html
<!-- Container -->
<div class="bg-vergil-emphasis-bg">
  <!-- Dropdown -->
  <div class="bg-vergil-emphasis-input-bg text-vergil-emphasis-input-text">
    Hungary
  </div>
  <!-- Button -->
  <button class="bg-vergil-off-black hover:bg-vergil-emphasis-button-hover text-vergil-full-white">
    Continue
  </button>
</div>
```

### Cookie Consent Banners
```html
<div class="bg-vergil-emphasis-bg">
  <p class="text-vergil-emphasis-text">We use cookies...</p>
  <button class="bg-vergil-off-black hover:bg-vergil-emphasis-button-hover text-vergil-full-white">
    Accept All
  </button>
</div>
```

### System Notifications
- Update prompts
- Beta feature announcements
- Maintenance notices
- Subscription reminders

## Implementation Examples

### Tailwind CSS
```jsx
// Emphasis area with interactive elements
<div className="bg-vergil-emphasis-bg p-6">
  <p className="text-vergil-emphasis-text">Choose your region</p>
  <select className="bg-vergil-emphasis-input-bg text-vergil-emphasis-input-text">
    <option>United States</option>
  </select>
  <button className="bg-vergil-off-black hover:bg-vergil-emphasis-button-hover text-vergil-full-white">
    Continue
  </button>
</div>

// Footer with footnote text
<footer className="bg-vergil-off-white">
  <p className="text-vergil-footnote-text text-sm">
    © 2024 Vergil AI. All rights reserved.
  </p>
</footer>
```

### CSS Variables
```css
.emphasis-header {
  background: var(--vergil-emphasis-bg);
  color: var(--vergil-emphasis-text);
}

.emphasis-button {
  background: var(--vergil-off-black);
  color: var(--vergil-full-white);
}

.emphasis-button:hover {
  background: var(--vergil-emphasis-button-hover);
}
```

## Design Philosophy

This color system embodies Apple's approach to subtle attention management:

1. **Barely Perceptible Shifts**: Color differences are subtle enough to not consciously register, yet distinct enough to create clear hierarchy

2. **Contextual Emphasis**: Interactive elements receive slightly different treatment only when they need attention

3. **Comfortable Reading**: Off-blacks and off-whites reduce eye strain compared to pure black/white contrasts

4. **Professional Restraint**: The system avoids alarming colors or stark contrasts, maintaining a calm, sophisticated interface

## Files Reference

- **CSS Variables**: `/app/globals.css`
- **Tailwind Tokens**: `/tailwind.config.js`
- **Storybook Demo**: `/stories/ColorSystemV2.stories.tsx`
- **Brand Book Page**: `/app/brand/visual/colors-v2/page.tsx`

## See Also

- [Color System v2 Storybook](../stories/ColorSystemV2.stories.tsx) - Interactive demos
- [Brand Book Colors v2](../app/brand/visual/colors-v2/page.tsx) - Visual documentation