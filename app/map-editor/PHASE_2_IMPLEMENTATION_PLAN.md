# Phase 2: Advanced Map Editing & Border Management Implementation Plan

## Overview

Phase 2 transforms the map editor from a basic territory creation tool into a sophisticated map editing system with bezier curves, vertex editing, smart border creation, and advanced validation. This phase focuses on professional-grade editing capabilities that enable complex, organic territory shapes with intelligent border sharing.

## Core Design Principles

1. **Organic Shape Creation** - Move beyond rigid polygons to smooth, natural territory boundaries
2. **Intelligent Border Management** - Automatic detection and sharing of borders between territories
3. **Real-time Validation** - Immediate feedback on territory validity and connections
4. **Professional Editing Tools** - Vertex-level control with industry-standard UX patterns
5. **Connected Territory Logic** - Smart group operations respecting territory relationships

## Phase 2A: Enhanced Drawing System (Week 1-2)

### 2A.1: Bezier Curve Drawing System (Days 1-3)

#### Goals:
- Replace rigid polygon drawing with smooth bezier curves
- Support both straight lines and curved segments
- Live preview of curve adjustments

#### Technical Implementation:
```typescript
interface BezierPoint extends Point {
  type: 'anchor' | 'control'
  controlPoints?: {
    in?: Point
    out?: Point
  }
}

interface CurveDrawingState {
  points: BezierPoint[]
  currentMode: 'straight' | 'curve'
  previewCurve: string // SVG path with curves
  showControlPoints: boolean
}
```

#### Features:
- **Curve Mode Toggle** - Switch between straight lines and bezier curves
- **Control Point Manipulation** - Drag to adjust curve tension and direction
- **Smooth Path Generation** - Convert points to smooth SVG bezier paths
- **Live Curve Preview** - Real-time curve rendering while drawing

#### Deliverables:
- [ ] Bezier curve drawing tool
- [ ] Control point UI system
- [ ] Smooth path generation algorithm
- [ ] Curve preview rendering

### 2A.2: Advanced Snapping System (Days 4-5)

#### Goals:
- Extend snapping beyond grid to territory elements
- Precision tools for professional map creation
- Visual feedback for snap targets

#### Snapping Types:
```typescript
type SnapTarget = {
  type: 'grid' | 'vertex' | 'edge' | 'center' | 'midpoint'
  point: Point
  territoryId?: string
  distance: number
}

interface SnapSettings {
  enabled: boolean
  snapToGrid: boolean
  snapToVertices: boolean
  snapToEdges: boolean
  snapToCenters: boolean
  snapToMidpoints: boolean
  snapDistance: number // pixels
}
```

#### Features:
- **Vertex Snapping** - Snap to existing territory vertices
- **Edge Snapping** - Snap to points along territory borders
- **Center Snapping** - Snap to territory centers
- **Midpoint Snapping** - Snap to edge midpoints
- **Smart Snap Distance** - Zoom-aware snap tolerance
- **Visual Snap Indicators** - Highlight snap targets and preview lines

#### Deliverables:
- [ ] Multi-target snapping system
- [ ] Snap target detection algorithm
- [ ] Visual snap feedback UI
- [ ] Snap settings panel

### 2A.3: Path Enhancement Tools (Days 6-7)

#### Goals:
- Professional path editing capabilities
- Automatic shape optimization
- Template-based territory creation

#### Features:
```typescript
interface PathTools {
  smoothing: {
    enabled: boolean
    strength: number // 0-100
    preserveCorners: boolean
  }
  simplification: {
    tolerance: number
    preserveShape: boolean
  }
  templates: TemplateShape[]
}

type TemplateShape = {
  id: string
  name: string
  path: string
  preview: string
  category: 'basic' | 'geographic' | 'custom'
}
```

#### Path Enhancement Features:
- **Auto-smoothing** - Convert jagged drawn paths to smooth curves
- **Path Simplification** - Reduce vertex count while preserving shape
- **Template Shapes** - Quick insert circles, rectangles, hexagons, stars
- **Shape Morphing** - Blend between shapes

#### Template Library:
- **Basic Shapes** - Circle, square, triangle, hexagon, octagon
- **Geographic Shapes** - Island, peninsula, bay, mountain range
- **Custom Templates** - User-saved favorite shapes

#### Deliverables:
- [ ] Path smoothing algorithm
- [ ] Path simplification tool
- [ ] Template shape system
- [ ] Shape insertion workflow

### 2A.4: Drawing Mode Enhancements (Days 8-10)

#### Goals:
- Enhanced drawing workflow
- Professional tool switching
- Advanced drawing options

#### Enhanced Drawing Features:
- **Multi-point Selection** - Select and manipulate multiple points
- **Point Insertion** - Click edge to add new points
- **Point Deletion** - Right-click to remove points
- **Curve Conversion** - Convert straight segments to curves and vice versa
- **Drawing Constraints** - Lock to angles, maintain proportions

#### Tool Modes:
```typescript
type DrawingMode = 
  | 'freehand'    // Draw smooth curves following mouse
  | 'polygon'     // Click to place vertices
  | 'bezier'      // Place anchors with control points
  | 'template'    // Insert predefined shapes
  | 'trace'       // Trace over background image
```

#### Deliverables:
- [ ] Enhanced drawing modes
- [ ] Point manipulation tools
- [ ] Drawing constraints system
- [ ] Mode switching UI

## Phase 2B: Vertex & Shape Editing (Week 3-4)

### 2B.1: Vertex Editing System (Days 11-13)

#### Goals:
- Precise control over territory shapes
- Intuitive vertex manipulation
- Professional editing experience

#### Vertex Editing Features:
```typescript
interface VertexEditState {
  mode: 'select' | 'edit'
  selectedVertices: Set<string>
  hoveredVertex?: string
  dragState?: {
    startPos: Point
    originalPositions: Map<string, Point>
  }
}

interface Vertex {
  id: string
  territoryId: string
  position: Point
  type: 'anchor' | 'control'
  index: number
  controlPoints?: {
    in?: Point
    out?: Point
  }
}
```

#### Features:
- **Vertex Selection** - Click/drag select individual or multiple vertices
- **Vertex Dragging** - Move vertices with real-time shape updates
- **Control Point Editing** - Adjust bezier curve control points
- **Vertex Addition** - Click edges to insert new vertices
- **Vertex Deletion** - Remove vertices while maintaining shape validity
- **Vertex Properties** - Edit vertex type, constraints, etc.

#### Visual Feedback:
- **Vertex Handles** - Distinct styling for different vertex types
- **Selection Indicators** - Clear visual selection state
- **Control Point Lines** - Show bezier control relationships
- **Shape Preview** - Live preview during editing

#### Deliverables:
- [ ] Vertex selection system
- [ ] Vertex manipulation tools
- [ ] Control point editing
- [ ] Vertex addition/deletion

### 2B.2: Territory Transformation Tools (Days 14-15)

#### Goals:
- Shape-level transformations
- Maintain shape integrity during edits
- Professional transformation handles

#### Transformation Features:
```typescript
interface TransformState {
  mode: 'move' | 'scale' | 'rotate' | 'skew'
  handles: TransformHandle[]
  transformMatrix: DOMMatrix
  constrainProportions: boolean
  pivotPoint: Point
}

type TransformHandle = {
  type: 'corner' | 'edge' | 'rotation' | 'pivot'
  position: Point
  cursor: string
}
```

#### Features:
- **Bounding Box Handles** - Corner and edge resize handles
- **Proportional Scaling** - Maintain aspect ratio option
- **Rotation Handle** - Rotate around custom pivot point
- **Smart Constraints** - Snap to angles, maintain connections
- **Transform Preview** - Live preview with ghost outline

#### Deliverables:
- [ ] Transform handle system
- [ ] Multi-selection transforms
- [ ] Constraint system
- [ ] Transform preview

### 2B.3: Undo/Redo Command System (Days 16-18)

#### Goals:
- Robust undo/redo for all operations
- Efficient memory usage
- Command pattern implementation

#### Command System:
```typescript
interface Command {
  id: string
  name: string
  timestamp: number
  execute(): void
  undo(): void
  merge?(other: Command): Command | null
}

interface HistoryState {
  commands: Command[]
  currentIndex: number
  maxHistory: number
  groupingTimeout: number
}

// Example commands
class MoveVertexCommand implements Command {
  constructor(
    private territoryId: string,
    private vertexIndex: number,
    private oldPosition: Point,
    private newPosition: Point
  ) {}
}
```

#### Features:
- **All Operations Undoable** - Drawing, editing, transforms, etc.
- **Command Grouping** - Batch related operations
- **Memory Efficient** - Differential storage, cleanup old history
- **Visual History** - Timeline UI showing operation history
- **Selective Undo** - Undo specific operations without losing others

#### Deliverables:
- [ ] Command pattern framework
- [ ] Undo/redo system
- [ ] Command grouping logic
- [ ] History UI panel

## Phase 2C: Border System & Smart Creation (Week 5-6)

### 2C.1: Automatic Border Detection (Days 19-21)

#### Goals:
- Detect shared borders between territories
- Create border entities automatically
- Maintain border relationships

#### Border Detection Algorithm:
```typescript
interface Border {
  id: string
  territoryIds: [string, string] // Exactly two territories
  path: string // SVG path of the shared border
  type: 'land' | 'sea' | 'special'
  properties: {
    length: number
    isCoastal: boolean
    isImpassable: boolean
  }
}

interface BorderDetectionResult {
  borders: Border[]
  gaps: Gap[] // Spaces between territories
  overlaps: Overlap[] // Territory intersections
}
```

#### Detection Features:
- **Edge Proximity Detection** - Find overlapping territory edges
- **Shared Segment Extraction** - Extract common border paths
- **Gap Detection** - Identify spaces between territories
- **Overlap Detection** - Find territory intersections

#### Algorithm Steps:
1. **Segment Extraction** - Break territory paths into edge segments
2. **Spatial Indexing** - Use R-tree for efficient proximity queries
3. **Overlap Testing** - Test segment pairs for overlap
4. **Border Creation** - Generate shared border entities
5. **Validation** - Ensure borders are topologically valid

#### Deliverables:
- [ ] Border detection algorithm
- [ ] Spatial indexing system
- [ ] Border entity creation
- [ ] Gap/overlap detection

### 2C.2: Smart Border Creation While Drawing (Days 22-23)

#### Goals:
- Automatically create shared borders when drawing
- Start new territories from existing borders
- Maintain topological validity

#### Smart Drawing Features:
```typescript
interface SmartDrawingState {
  startBorder?: {
    borderId: string
    position: Point
    territoryId: string
  }
  targetBorder?: {
    borderId: string
    position: Point
    territoryId: string
  }
  sharedSegments: BorderSegment[]
}
```

#### Smart Drawing Workflow:
1. **Border Detection** - Detect when starting/ending on existing borders
2. **Snap to Border** - Snap drawing start/end to border points
3. **Shared Path Creation** - Generate shared border segment
4. **Auto-completion** - Complete territory when returning to border
5. **Validation** - Ensure new territory doesn't create invalid topology

#### Features:
- **Border Highlighting** - Highlight potential snap targets
- **Auto-completion** - Close territory when touching start border
- **Shared Border Creation** - Automatically create shared borders
- **Topology Validation** - Prevent invalid territory creation

#### Deliverables:
- [ ] Smart drawing system
- [ ] Border snap detection
- [ ] Auto-completion logic
- [ ] Shared border creation

### 2C.3: Connected Territory Groups (Days 24-25)

#### Goals:
- Identify connected territory groups
- Move groups together
- Respect territory relationships

#### Group Management:
```typescript
interface TerritoryGroup {
  id: string
  territoryIds: Set<string>
  connections: Map<string, string[]> // territory -> connected territories
  bounds: Rectangle
  isConnected: boolean
}

interface ConnectionGraph {
  nodes: Map<string, Territory>
  edges: Map<string, Border[]>
  groups: TerritoryGroup[]
}
```

#### Features:
- **Connection Detection** - Build graph of territory connections
- **Group Identification** - Find connected components
- **Group Movement** - Move entire groups together
- **Connection Visualization** - Show territory relationships
- **Detachment Tools** - Break connections to separate territories

#### Deliverables:
- [ ] Connection graph system
- [ ] Group detection algorithm
- [ ] Group movement logic
- [ ] Connection visualization

## Phase 2D: Validation & Polish (Week 7-8)

### 2D.1: Real-time Territory Validation (Days 26-27)

#### Goals:
- Live validation during editing
- Clear visual feedback
- Helpful error messages

#### Validation Rules:
```typescript
interface ValidationRule {
  id: string
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  check(territory: Territory, context: ValidationContext): ValidationResult
}

interface ValidationResult {
  valid: boolean
  message: string
  fixes?: AutoFix[]
  affectedElements: string[]
}
```

#### Validation Types:
- **Self-intersection** - Territory path crosses itself
- **Territory Overlap** - Multiple territories occupy same space
- **Gaps** - Spaces between territories that should be connected
- **Invalid Topology** - Broken connections, isolated territories
- **Minimum Size** - Territories too small to be useful
- **Border Mismatch** - Inconsistent shared borders

#### Visual Feedback:
- **Error Highlighting** - Red outline for invalid territories
- **Warning Indicators** - Yellow icons for warnings
- **Problem Tooltips** - Hover to see specific issues
- **Validation Panel** - List all problems with click-to-focus

#### Deliverables:
- [ ] Validation rule engine
- [ ] Real-time validation system
- [ ] Visual feedback UI
- [ ] Validation reporting

### 2D.2: Auto-fix Suggestions (Days 28-29)

#### Goals:
- Automated problem resolution
- One-click fixes for common issues
- Preserve user intent

#### Auto-fix System:
```typescript
interface AutoFix {
  id: string
  name: string
  description: string
  preview: string // Visual preview of fix
  execute(): void
  canUndo: boolean
}

// Example fixes
class FixOverlapFix implements AutoFix {
  name = "Move territory to resolve overlap"
  execute() {
    // Move one territory to eliminate overlap
  }
}

class FillGapFix implements AutoFix {
  name = "Extend territory to fill gap"
  execute() {
    // Extend territory border to close gap
  }
}
```

#### Auto-fix Types:
- **Move to Fix Overlap** - Adjust position to eliminate overlaps
- **Extend to Fill Gap** - Stretch borders to close gaps
- **Simplify Complex Path** - Reduce vertices in overly complex territories
- **Merge Adjacent Territories** - Combine territories that should be one
- **Split Overlapping Territories** - Divide overlapping regions

#### Deliverables:
- [ ] Auto-fix framework
- [ ] Common fix implementations
- [ ] Fix preview system
- [ ] Batch fix operations

### 2D.3: Territory Detachment System (Days 30)

#### Goals:
- Break territory connections
- Allow independent movement
- Reattachment tools

#### Detachment Features:
```typescript
interface DetachmentState {
  detachedTerritories: Set<string>
  originalConnections: Map<string, string[]>
  detachmentHistory: DetachmentOperation[]
}

interface DetachmentOperation {
  territoryId: string
  removedBorders: Border[]
  timestamp: number
}
```

#### Features:
- **Detach Button** - Break selected territory from connections
- **Detachment Preview** - Show what will be disconnected
- **Connection Memory** - Remember original connections for reattachment
- **Reattach Tool** - Reconnect territories by dragging them together
- **Partial Detachment** - Break only specific border connections

#### Deliverables:
- [ ] Territory detachment system
- [ ] Connection memory system
- [ ] Reattachment tools
- [ ] Detachment UI controls

## Technical Architecture

### State Management Extensions:
```typescript
interface Phase2State extends MapEditorState {
  // Bezier drawing
  bezierDrawing: BezierDrawingState
  
  // Vertex editing
  vertexEditing: VertexEditState
  
  // Border management
  borders: Map<string, Border>
  territoryGroups: TerritoryGroup[]
  
  // Validation
  validation: ValidationState
  
  // Commands
  history: HistoryState
  
  // Snapping
  snapping: SnapSettings
}
```

### New Components:
```
components/
├── drawing/
│   ├── BezierDrawTool.tsx
│   ├── SnapIndicators.tsx
│   └── TemplateShapes.tsx
├── editing/
│   ├── VertexEditor.tsx
│   ├── TransformHandles.tsx
│   └── PathTools.tsx
├── borders/
│   ├── BorderVisualizer.tsx
│   ├── ConnectionGraph.tsx
│   └── DetachmentTools.tsx
├── validation/
│   ├── ValidationPanel.tsx
│   ├── ErrorHighlights.tsx
│   └── AutoFixSuggestions.tsx
└── history/
    ├── UndoRedoControls.tsx
    └── HistoryTimeline.tsx
```

### Performance Considerations:
- **Spatial Indexing** - R-tree for efficient territory queries
- **Incremental Validation** - Only validate changed territories
- **Command Batching** - Group related operations
- **Virtual Rendering** - Render only visible elements
- **WebGL Acceleration** - For complex path rendering

## Success Metrics

### Phase 2A Success Criteria:
- [ ] Smooth bezier curve drawing with live preview
- [ ] Multi-target snapping system working accurately
- [ ] Path smoothing produces natural-looking territories
- [ ] Template shape insertion functional

### Phase 2B Success Criteria:
- [ ] Vertex editing allows precise shape control
- [ ] Transform handles work for all operations
- [ ] Undo/redo works for all Phase 2 operations
- [ ] Performance maintains 60fps with complex shapes

### Phase 2C Success Criteria:
- [ ] Automatic border detection works reliably
- [ ] Smart drawing creates shared borders correctly
- [ ] Connected territory groups move together
- [ ] Border relationships visualized clearly

### Phase 2D Success Criteria:
- [ ] Real-time validation catches all major issues
- [ ] Auto-fix suggestions resolve 80% of problems
- [ ] Territory detachment/reattachment works intuitively
- [ ] Overall editing experience feels professional

## Risk Mitigation

### Technical Risks:
1. **Performance with Complex Paths** - Use spatial indexing and LOD
2. **Floating Point Precision** - Implement tolerance-based comparisons  
3. **Complex Border Topology** - Extensive testing with edge cases
4. **Memory Usage with Undo/Redo** - Implement efficient diff storage

### UX Risks:
1. **Tool Complexity** - Progressive disclosure of advanced features
2. **Learning Curve** - Comprehensive onboarding and help system
3. **Feature Discovery** - Clear visual cues and contextual hints

## Timeline Summary

| Phase | Duration | Key Features |
|-------|----------|--------------|
| 2A | Week 1-2 | Bezier curves, advanced snapping, path tools |
| 2B | Week 3-4 | Vertex editing, transforms, undo/redo |
| 2C | Week 5-6 | Border detection, smart creation, groups |
| 2D | Week 7-8 | Validation, auto-fix, detachment |

**Total Duration:** 8 weeks for complete Phase 2 implementation

This phase will transform the map editor into a professional-grade territory creation and editing tool suitable for complex game map development.