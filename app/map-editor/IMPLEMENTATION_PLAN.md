# Map Editor Implementation Plan

## Project Overview
Build a web-based visual map editor for creating territory-based maps with an optimized border system where each border is a separate element shared by exactly two territories.

## Success Criteria
- [ ] Create and edit territory maps visually
- [ ] Automatic border detection and management  
- [ ] Real-time validation with visual feedback
- [ ] Export valid map data for game use
- [ ] Support 100+ territories at 60fps

## Phase 1: Foundation (Days 1-5)

### Day 1-2: Project Setup & Canvas
```bash
# Create structure
app/map-editor/
├── page.tsx
├── layout.tsx
├── components/
│   └── canvas/
│       └── MapCanvas.tsx
└── hooks/
    └── useMapEditor.ts
```

**Tasks:**
- [ ] Setup Next.js page with basic layout
- [ ] Create SVG canvas component with pan/zoom
- [ ] Implement coordinate transformation (screen ↔ SVG)
- [ ] Setup Zustand store with TypeScript

**Deliverable:** Empty canvas that can pan/zoom

### Day 3-4: Basic Drawing
```typescript
// hooks/useDrawing.ts
interface DrawingState {
  isDrawing: boolean
  currentPath: Point[]
  previewPath: string // SVG path string
}
```

**Tasks:**
- [ ] Implement pen tool for drawing paths
- [ ] Click to add points, close path on return to start
- [ ] Live preview while drawing
- [ ] Create territory on path completion

**Deliverable:** Can draw basic territories

### Day 5: Selection & Properties
**Tasks:**
- [ ] Select tool with click selection
- [ ] Properties panel showing territory details
- [ ] Edit territory name and continent
- [ ] Delete selected territories

**Deliverable:** Basic CRUD for territories

## Phase 2: Border System (Days 6-10)

### Day 6-7: Border Detection
```typescript
// lib/geometry/borderDetection.ts
function detectBorders(territories: Territory[]): Border[] {
  // 1. Find all edge segments
  // 2. Group shared segments
  // 3. Create border entities
}
```

**Tasks:**
- [ ] Parse territory paths into segments
- [ ] Implement shared edge detection algorithm
- [ ] Auto-generate borders after drawing
- [ ] Visual display of borders

**Deliverable:** Automatic border creation

### Day 8-9: Border Editing
**Tasks:**
- [ ] Select and edit border properties
- [ ] Border type selector (land/sea/coast)
- [ ] Split/merge border tools
- [ ] Update validation for borders

**Deliverable:** Full border management

### Day 10: Sea Routes
**Tasks:**
- [ ] Connect tool for sea routes
- [ ] Click two territories to connect
- [ ] Curved path generation
- [ ] Coastal point detection

**Deliverable:** Can create sea connections

## Phase 3: Validation & Polish (Days 11-15)

### Day 11-12: Real-time Validation
```typescript
// components/panels/ValidationPanel.tsx
interface ValidationDisplay {
  errors: ErrorDisplay[]
  warnings: WarningDisplay[]
  autoFixAvailable: boolean
}
```

**Tasks:**
- [ ] Integrate validation library
- [ ] Visual error indicators on map
- [ ] Validation panel with error list
- [ ] Click error to highlight element
- [ ] Auto-fix button for fixable issues

**Deliverable:** Live validation feedback

### Day 13: Advanced Selection
**Tasks:**
- [ ] Rectangle selection tool
- [ ] Multi-select with Shift+click
- [ ] Select all in continent
- [ ] Selection groups

**Deliverable:** Professional selection tools

### Day 14-15: Import/Export
**Tasks:**
- [ ] Export to game JSON format
- [ ] Import existing maps
- [ ] Path optimization before export
- [ ] Export validation requirements

**Deliverable:** Complete import/export

## Phase 4: Advanced Features (Days 16-20)

### Day 16-17: Undo/Redo
```typescript
// hooks/useHistory.ts
interface HistoryEntry {
  id: string
  action: string
  timestamp: number
  delta: any // Efficient diff
}
```

**Tasks:**
- [ ] Command pattern for all operations
- [ ] Efficient state diffing
- [ ] Undo/redo UI and shortcuts
- [ ] History panel

**Deliverable:** Full undo/redo support

### Day 18: Grid & Snapping
**Tasks:**
- [ ] Toggle grid overlay
- [ ] Snap to grid while drawing
- [ ] Snap to existing points
- [ ] Visual snap indicators

**Deliverable:** Precision drawing tools

### Day 19-20: Performance & Polish
**Tasks:**
- [ ] Viewport culling for large maps
- [ ] Debounced validation
- [ ] Keyboard shortcuts
- [ ] Settings persistence
- [ ] Error boundary handling

**Deliverable:** Production-ready editor

## Technical Decisions

### State Management
**Zustand** over Redux for simplicity:
```typescript
const useMapStore = create<MapEditorState>((set, get) => ({
  map: createEmptyMap(),
  selection: new Set(),
  
  addTerritory: (territory) => set(state => ({
    map: {
      ...state.map,
      territories: {
        ...state.map.territories,
        [territory.id]: territory
      }
    }
  }))
}))
```

### Validation Strategy
- Run in Web Worker to prevent blocking
- Debounce 200ms after changes
- Visual feedback inline
- Errors prevent export

### Performance Targets
- 60fps with 100 territories
- <100ms validation time
- <50ms for undo/redo
- <1s export with optimization

## Testing Strategy

### Unit Tests
- Geometry algorithms (border detection, intersection)
- Validation rules
- State management actions
- Export/import formats

### Integration Tests  
- Drawing → Border creation → Validation flow
- Import → Edit → Export roundtrip
- Undo/redo consistency

### E2E Tests
- Draw complete map
- Fix validation errors
- Export and verify format

## Risk Mitigation

### Risk: Performance with many territories
**Mitigation:** 
- Virtual viewport rendering
- Spatial indexing for hit detection
- Progressive validation

### Risk: Browser compatibility
**Mitigation:**
- Target modern browsers only
- Polyfill pointer events
- Fallback for SVG filters

### Risk: Complex geometry edge cases
**Mitigation:**
- Extensive test suite
- Conservative algorithms
- Manual override tools

## Definition of Done

### MVP Requirements
- [x] Draw territories visually
- [x] Automatic border detection
- [x] Edit territory properties  
- [x] Real-time validation
- [x] Export valid game format
- [ ] Import existing maps
- [ ] Undo/redo support
- [ ] Keyboard shortcuts

### Quality Metrics
- No validation errors in exported maps
- 60fps performance with 100+ territories
- <100ms response time for all operations
- Zero runtime errors in production

## Future Enhancements
1. Collaborative editing
2. AI-assisted territory generation
3. Template library
4. Mobile/tablet support
5. 3D preview mode