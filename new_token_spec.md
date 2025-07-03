# Design Token System Specification

## Spacing Tokens

**Apple-inspired 8px base system with emphasis on 16px and 24px for primary spacing.**

```css
--space-xs: 4px     /* micro-adjustments, icon padding */
--space-sm: 8px     /* tight spacing, small gaps */
--space-md: 16px    /* PRIMARY - default spacing for most UI elements */
--space-lg: 24px    /* PRIMARY - comfortable spacing, section gaps */
--space-xl: 32px    /* loose spacing, major sections */
--space-2xl: 48px   /* large sections, page-level spacing */
--space-3xl: 64px   /* hero sections, major layout breaks */
```

**Usage:** Lean heavily into `16px` and `24px` for 80% of your spacing decisions. Use smaller values only for fine-tuning and larger values for major layout sections.

## Easing Tokens

**Industry standard easing functions for smooth, natural animations.**

```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94)      /* DEFAULT - most UI animations */
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)         /* longer transitions, page changes */
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)    /* playful micro-interactions */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)       /* snappy, responsive feel */
--linear: linear                                        /* loading states, progress */
```

**Usage:** Use `ease-out` as your default for 90% of animations. Reserve `ease-out-back` for delightful micro-interactions and `linear` only for mechanical/loading states.

## Shadow Tokens

**Elevation-based shadow system for depth hierarchy.**

```css
--shadow-none: none
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)     /* subtle cards */
--shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)     /* elevated elements */
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)    /* modals, dropdowns */
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)  /* highest priority */
```

**Usage:** Use layered shadows to create realistic depth. Start with `shadow-sm` for most elevated content and progressively increase for higher priority elements.

## Border Tokens

**Apple-inspired minimal borders - use sparingly and only when necessary.**

```css
--border-none: 0
--border-thin: 1px                                    /* DEFAULT - 90% of use cases */
--border-medium: 2px                                  /* focus states, emphasis */

--border-subtle: rgba(0,0,0,0.05)                     /* barely visible dividers */
--border-default: rgba(0,0,0,0.1)                     /* standard UI borders */
--border-focus: #007AFF                               /* interactive focus states */
```

**Usage:** Avoid borders when possible - prefer shadows, spacing, or background differences. When borders are necessary, use `1px` thickness and subtle colors that don't compete for attention.

## Border Radius Tokens

**Apple-style proportional scaling for human, organic feel.**

```css
--radius-xs: 4px      /* small elements, badges */
--radius-sm: 6px      /* buttons, inputs - DEFAULT for most UI */
--radius-md: 8px      /* cards, containers */
--radius-lg: 12px     /* large cards, panels */
--radius-xl: 16px     /* modals, major sections */
--radius-2xl: 20px    /* hero containers */
--radius-full: 50%    /* circular elements */
```

**Usage:** Choose radius proportional to element size - larger elements get larger radius. Use `6px` as your default for most interactive elements. Create family relationships where all elements feel designed by the same hand.

## Z-Index Tokens

**Semantic layering system with large gaps for flexibility.**

```css
--z-base: 0           /* default page content */
--z-dropdown: 1000    /* dropdowns, tooltips */
--z-sticky: 1100      /* sticky headers, sidebars */
--z-overlay: 1200     /* modal backdrops */
--z-modal: 1300       /* modal content */
--z-popover: 1400     /* popovers, context menus */
--z-toast: 1500       /* notifications, alerts */
--z-tooltip: 1600     /* tooltips (highest UI layer) */
```

**Usage:** Use semantic names, not arbitrary numbers. The 100-point gaps allow for micro-adjustments without breaking the hierarchy. Solve layering with proper DOM structure before reaching for higher z-index values.

## Opacity Tokens

**Contextual opacity - avoid systematic opacity for text hierarchy.**

```css
--opacity-disabled: 0.4        /* disabled interactive elements */
--opacity-hover: 0.05          /* subtle hover overlays */
--opacity-pressed: 0.1         /* active/pressed states */
--opacity-backdrop: 0.5        /* modal backdrops */
--opacity-loading: 0.6         /* loading overlays */
```

**Usage:** Use actual colors for text hierarchy instead of opacity percentages. Reserve opacity for interaction states, loading conditions, and when you need elements to adapt to any background color.
