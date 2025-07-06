# Map Editor Hooks

## Core Hooks

### useMapEditor
Main editor state using Zustand. This is the single source of truth.
```typescript
interface MapEditorStore {
  map: MapData
  selection: Set<string>
  tool: ToolType
  // Actions are methods, not separate
  setTool: (tool: ToolType) => void
  updateTerritory: (id: string, updates: Partial<Territory>) => void
}
```

### useDrawing
Handles path creation. Returns current path and methods.
- Supports both click-to-add and drag modes
- Auto-closes paths when near start point (10px)
- Simplifies paths on completion (Douglas-Peucker)

### useSelection
Selection logic separated from rendering.
- Rectangle selection with spatial index
- Keyboard navigation (Tab/Shift+Tab)
- Selection groups for bulk operations

### useHistory
Undo/redo with efficient diffing.
- Stores deltas, not full snapshots
- Groups related operations (e.g., multi-select move)
- Max 50 entries to prevent memory issues

## Hook Rules
1. Hooks return `[state, actions]` tuple
2. Actions are stable (wrapped in useCallback)
3. Heavy computations in useMemo
4. Side effects only in useEffect

## Common Patterns
```typescript
// Derive state instead of syncing
const validationErrors = useMemo(() => 
  validateMap(map), [map])

// Stable callbacks for event handlers  
const handleClick = useCallback((id: string) => {
  store.select(id)
}, []) // store from zustand is stable
```