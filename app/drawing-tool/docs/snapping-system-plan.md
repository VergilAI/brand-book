# Auto-Snapping System Plan

## Overview
Implement a comprehensive snapping system that helps users create precise shapes and maintain alignment. The system will provide visual feedback and magnetic snapping to key points and guidelines.

## Core Snapping Features

### 1. Vertex Snapping
**What**: Snap to existing vertices of any shape
**When**: Drawing new points or moving vertices/shapes
**Visual Feedback**: 
- Highlight target vertex with a circle
- Show snap indicator (small square or crosshair)
- Display "snap line" from cursor to snap point
**Distance**: 10-15px (zoom-adjusted)

### 2. Edge Snapping
**What**: Snap to the nearest point on any edge
**When**: Drawing or moving operations
**Visual Feedback**:
- Highlight the edge being snapped to
- Show perpendicular indicator line
- Display snap point on the edge
**Features**:
- Snap to midpoint of edges (with special indicator)
- Snap to edge intersections

### 3. Center Snapping
**What**: Snap to shape centers
**When**: Drawing or moving
**Visual Feedback**:
- Show center point with crosshair
- Radial guidelines from center
**Distance**: 15-20px (larger than vertex snap)

### 4. Grid Snapping (Enhanced)
**Current**: Basic grid snapping exists
**Enhancements**:
- Sub-grid snapping (half-grid points)
- Angle snapping (45°, 90° increments)
- Grid intersection highlighting

### 5. Alignment Guides
**What**: Dynamic guidelines that appear during operations
**Types**:
- Horizontal alignment (top, center, bottom)
- Vertical alignment (left, center, right)
- Equal spacing guides
**Visual**:
- Dashed lines extending across canvas
- Measurement labels showing distances

### 6. Smart Guides
**What**: Context-aware snapping suggestions
**Features**:
- Extension lines from existing edges
- Parallel/perpendicular suggestions
- Equal distance indicators
- Angle matching (snap to same angle as nearby edge)

## Implementation Architecture

### 1. Snapping Engine
```typescript
interface SnapResult {
  point: Point
  type: 'vertex' | 'edge' | 'center' | 'grid' | 'guide'
  target?: {
    shapeId: string
    elementType: 'vertex' | 'edge' | 'center'
    elementIndex?: number
  }
  distance: number
  priority: number
}

interface SnapSettings {
  enabled: boolean
  vertexSnap: boolean
  edgeSnap: boolean
  centerSnap: boolean
  gridSnap: boolean
  guideSnap: boolean
  snapDistance: number
  showSnapIndicators: boolean
}
```

### 2. Snap Detection Algorithm
1. **Collect Snap Candidates**
   - Get all vertices within snap distance
   - Get all edges within snap distance
   - Get all centers within snap distance
   - Calculate grid points near cursor

2. **Priority System**
   - Vertex: Priority 1 (highest)
   - Edge midpoint: Priority 2
   - Edge: Priority 3
   - Center: Priority 4
   - Grid: Priority 5 (lowest)

3. **Conflict Resolution**
   - Choose highest priority snap
   - If same priority, choose closest
   - Allow modifier keys to filter snap types

### 3. Visual Feedback System
```typescript
interface SnapIndicator {
  type: 'point' | 'line' | 'guide'
  geometry: Point | Line
  style: {
    color: string
    width: number
    pattern?: 'solid' | 'dashed'
  }
}
```

## UI/UX Design

### 1. Snap Toggles
- Main snap on/off toggle
- Individual snap type toggles
- Keyboard shortcuts:
  - `S` - Toggle all snapping
  - `Alt` - Temporarily disable snapping
  - `Shift` - Snap to grid only
  - `Ctrl/Cmd` - Increase snap strength

### 2. Visual Indicators
- **Snap Preview**: Ghost of where point will snap
- **Snap Strength**: Larger indicators for stronger snaps
- **Multi-snap**: Show multiple snap options when available
- **Measurements**: Show distances when snapping

### 3. Settings Panel
```
[✓] Enable Snapping (S)
  [✓] Snap to Vertices
  [✓] Snap to Edges
  [✓] Snap to Centers
  [✓] Snap to Grid
  [✓] Show Alignment Guides
  
  Snap Distance: [15] px
  Guide Color: [#0066FF]
  □ Show measurements
  □ Snap to angles
```

## Performance Considerations

### 1. Spatial Indexing
- Use quadtree for shapes
- Cache frequently accessed snap points
- Update index on shape changes only

### 2. Optimization Strategies
- Limit search radius
- Use bounding box pre-filtering
- Debounce snap calculations
- LOD system for complex shapes

### 3. Frame Budget
- Target: <2ms per frame for snap calculation
- Progressive enhancement (add features as performance allows)
- Disable complex snapping at low zoom levels

## Implementation Phases

### Phase 1: Core Snapping (Week 1)
1. Implement snap detection engine
2. Add vertex snapping
3. Add edge snapping
4. Create visual feedback system
5. Add snap settings to UI

### Phase 2: Advanced Features (Week 2)
1. Add center snapping
2. Implement alignment guides
3. Add smart guides
4. Enhance grid snapping
5. Add measurement display

### Phase 3: Polish & Optimization (Week 3)
1. Performance optimization
2. Refined visual feedback
3. Keyboard shortcuts
4. User preferences
5. Testing & bug fixes

## Technical Implementation Details

### 1. Snap Detection Functions
```typescript
// Find nearest vertex within snap distance
function findNearestVertex(point: Point, shapes: Shape[], maxDistance: number): SnapResult | null

// Find nearest point on any edge
function findNearestEdgePoint(point: Point, shapes: Shape[], maxDistance: number): SnapResult | null

// Find nearest shape center
function findNearestCenter(point: Point, shapes: Shape[], maxDistance: number): SnapResult | null

// Get all snap candidates sorted by priority and distance
function getSnapCandidates(point: Point, settings: SnapSettings): SnapResult[]
```

### 2. Integration Points
- Drawing tool: Snap while creating vertices
- Edit mode: Snap while moving vertices
- Selection tool: Snap while moving shapes
- All tools: Show snap indicators on hover

### 3. State Management
```typescript
interface SnapState {
  activeSnaps: SnapResult[]
  indicators: SnapIndicator[]
  hoveredSnapTargets: Set<string>
  settings: SnapSettings
}
```

## Success Metrics
- Snap accuracy: <1px error
- Performance: <2ms calculation time
- User satisfaction: Reduced time to create aligned shapes
- Discoverability: 80% of users find and use snapping

## Future Enhancements
1. **Magnetic Guides**: User-defined guidelines
2. **Snap Templates**: Common angles/distances
3. **Path Snapping**: Snap along bezier paths
4. **Dimension Constraints**: Lock distances/angles
5. **Smart Distribute**: Auto-spacing tools
6. **Snap History**: Remember recent snap points
7. **Custom Snap Points**: User-defined snap targets

## Inspiration & References
- Adobe Illustrator smart guides
- Figma snapping system
- Sketch alignment guides
- Affinity Designer snapping
- CAD software precision tools