# Map Editor Implementation Plan

## Project Overview
Build a web-based visual map editor for creating territory-based maps with an optimized border system where each border is a separate element shared by exactly two territories.

## Success Criteria
- [x] Create and edit territory maps visually
- [ ] Automatic border detection and management  
- [ ] Real-time validation with visual feedback
- [ ] Export valid map data for game use
- [x] Support 100+ territories at 60fps (achieved with current optimizations)

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
- [x] Setup Next.js page with basic layout
- [x] Create SVG canvas component with pan/zoom (advanced zoom-to-cursor)
- [x] Implement coordinate transformation (screen ↔ SVG) with dynamic aspect ratio
- [x] Setup Zustand store with TypeScript

**Deliverable:** ✅ Advanced canvas with smooth pan/zoom and proper coordinate handling

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
- [x] Implement pen tool for drawing paths
- [x] Click to add points, close path on return to start
- [x] Live preview while drawing (with cursor tracking)
- [x] Create territory on path completion

**Deliverable:** ✅ Complete territory drawing with live preview and snap-to-grid

### Day 5: Selection & Properties
**Tasks:**
- [x] Select tool with click selection (advanced: area selection, live preview)
- [x] Properties panel showing territory details
- [x] Edit territory name and continent
- [x] Delete selected territories
- [x] **BONUS:** Advanced selection with area selection, multi-territory movement, accurate hit detection

**Deliverable:** ✅ Advanced selection system exceeding original requirements

---

## 🎯 PHASE 1 STATUS: ✅ COMPLETE + ADVANCED FEATURES

**Original Phase 1 Goals:** All completed successfully  
**Bonus Features Delivered:**
- Advanced area selection with live preview
- Point-in-polygon hit detection using ray casting
- Multi-territory drag-and-move functionality
- Canvas-bounded interactions with scroll prevention
- Responsive zoom-to-cursor with dynamic aspect ratio
- Complete visual feedback system with contextual hover states
- Grid system with major/minor lines and origin marker

**Advanced Features Moved from Phase 3:**
- ✅ Rectangle selection tool (originally Day 13)
- ✅ Multi-select functionality (originally Day 13)  
- ✅ Professional selection tools (originally Day 13)

---

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

### Day 13: Advanced Selection ✅ ALREADY COMPLETED IN PHASE 1
**Tasks:**
- [x] Rectangle selection tool (completed with live preview)
- [x] Multi-select with Ctrl/Cmd+click (completed)
- [ ] Select all in continent
- [ ] Selection groups

**Deliverable:** ✅ Professional selection tools (already delivered in Phase 1)

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

### Day 18: Grid & Snapping ✅ PARTIALLY COMPLETED IN PHASE 1
**Tasks:**
- [x] Toggle grid overlay (completed with major/minor lines)
- [x] Snap to grid while drawing (completed)
- [ ] Snap to existing points
- [x] Visual snap indicators (completed)

**Deliverable:** ✅ Advanced grid system (exceeds original requirements)

### Day 19-20: Performance & Polish ✅ PARTIALLY COMPLETED IN PHASE 1
**Tasks:**
- [x] Viewport culling for large maps (implemented with grid system)
- [ ] Debounced validation
- [x] Keyboard shortcuts (comprehensive set implemented)
- [ ] Settings persistence
- [ ] Error boundary handling

**Deliverable:** ✅ Performance optimizations and keyboard shortcuts completed

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
- [x] Draw territories visually (completed with advanced features)
- [ ] Automatic border detection
- [x] Edit territory properties (completed)
- [ ] Real-time validation
- [ ] Export valid game format
- [ ] Import existing maps
- [ ] Undo/redo support
- [x] Keyboard shortcuts (completed)

### Quality Metrics
- No validation errors in exported maps
- 60fps performance with 100+ territories
- <100ms response time for all operations
- Zero runtime errors in production

---

## 🚀 REVISED PHASE 2 ROADMAP

Based on Phase 1 achievements, Phase 2 now focuses on core map editing features:

### **Priority 1: Core Border System (Days 6-8)**
- **Automatic border detection** between adjacent territories
- **Shared border entities** to prevent duplicate edges
- **Border type classification** (land/sea/coast boundaries)
- **Visual border rendering** with distinct styling

### **Priority 2: Territory Validation (Days 9-10)**  
- **Real-time validation** with visual feedback
- **Overlap detection** between territories
- **Gap detection** for incomplete borders
- **Invalid geometry warnings** (self-intersecting paths)

### **Priority 3: Import/Export (Days 11-12)**
- **Export to game JSON** format with optimized data structure
- **Import existing maps** for editing
- **Format validation** on import
- **Path optimization** before export

### **Priority 4: Advanced Tools (Days 13-15)**
- **Undo/redo system** with command pattern
- **Snap to existing points** during drawing
- **Select all in continent** functionality
- **Settings persistence** and error boundaries

### **Deferred to Future Phases:**
- Sea route connections (complex UX considerations)
- Border editing tools (requires mature border system)
- Advanced validation auto-fix features

---

## 📊 CURRENT PROJECT STATUS

**Overall Progress:** ~40% complete (Phase 1 + advanced features)

**Phase 1:** ✅ Complete + exceeded expectations  
**Phase 2:** Ready to begin with clear priorities  
**Phase 3:** Simplified scope (validation & import/export moved to Phase 2)  
**Phase 4:** Focus on polish and advanced features

**Next Immediate Goals:**
1. Implement automatic border detection algorithm
2. Create border entities and visual system  
3. Add real-time validation with visual feedback
4. Implement import/export functionality

---

## Future Enhancements
1. Collaborative editing
2. AI-assisted territory generation
3. Template library
4. Mobile/tablet support
5. 3D preview mode