# Map Editor Components

## Component Categories

### Canvas Components (`/canvas`)
Core drawing surface and overlays. Canvas uses SVG with React event handlers.
- **MapCanvas.tsx** - Main SVG viewport, handles zoom/pan via transform matrix
- **GridOverlay.tsx** - Snap grid, configurable size (default 10px)
- **SelectionBox.tsx** - Rectangle selection with Shift+drag

### Tool Components (`/tools`)
Each tool is a state machine with enter/exit handlers.
```typescript
interface Tool {
  id: string
  onEnter(): void
  onExit(): void
  onPointerDown(e: PointerEvent): void
  onPointerMove(e: PointerEvent): void
  onPointerUp(e: PointerEvent): void
}
```

### Panel Components (`/panels`)
Dockable panels using Radix UI. State persisted to localStorage.
- Properties: Edit selected items via form inputs
- Validation: Show errors with jump-to navigation
- Layers: Tree view with drag-drop reordering

## Key Patterns

### Selection Management
```typescript
// Always use Set for performance
selectedIds: Set<string>
// Multi-select with Shift, toggle with Ctrl
```

### Canvas Coordinates
```typescript
// Convert screen to SVG coordinates
const pt = svg.createSVGPoint()
pt.x = e.clientX
pt.y = e.clientY
const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())
```

### Tool State
Tools use `useReducer` for complex state. Actions are typed unions.

## Performance Rules
1. Memoize expensive renders with `React.memo`
2. Use `pointer-events: none` on non-interactive elements
3. Debounce validation updates (200ms)
4. Virtual rendering for >50 territories