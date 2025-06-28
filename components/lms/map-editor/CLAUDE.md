# Map Editor UI Components

## Purpose  
Reusable React components specific to the map editor. These are separate from game components.

## Component Guidelines

### Canvas Components
- Use SVG, not HTML Canvas (need precise vector editing)
- All coordinates in SVG space, not screen space
- React.memo for static overlays (grid, guides)

### Tool Components
Each tool is a finite state machine:
```typescript
type ToolState = 'idle' | 'active' | 'preview'
```

Tools **never** directly modify map data. They dispatch actions to the store.

### Rendering Performance
1. Static elements in separate SVG `<g>` groups
2. `pointer-events: none` on non-interactive elements
3. Use CSS transforms, not attribute updates
4. Virtualize lists over 50 items

## Validation UI
- Errors show as red outline (2px) on affected element
- Warnings show as yellow outline (2px)
- Clicking error in panel highlights element
- Auto-fix shows before/after preview

## Coordinate System
```typescript
// ALWAYS convert mouse to SVG coordinates
const svgPoint = mouseToSVG(event, svgElement)
// NEVER use event.clientX/Y directly
```

## Accessibility
- All tools keyboard accessible
- Status announcements for screen readers
- High contrast mode support
- Focus indicators on all interactive elements