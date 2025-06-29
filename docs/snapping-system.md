# Snapping System Documentation

## Overview

The snapping system provides magnetic alignment assistance for precise shape creation and positioning in both the Map Editor and Drawing Tool. It offers real-time visual feedback and multiple snapping modes to enhance productivity and accuracy.

## Features

### Core Snapping Types

1. **Vertex Snapping**
   - Snaps to existing shape/territory vertices
   - Priority: 1 (highest)
   - Visual: Red/pink circle indicator
   - Color: `#FF0066`

2. **Edge Snapping**
   - Snaps to nearest point on shape edges
   - Includes automatic midpoint detection
   - Priority: 3 (2 for midpoints)
   - Visual: Blue circle (green for midpoints)
   - Colors: `#0066FF` (edge), `#00FF66` (midpoint)

3. **Center Snapping**
   - Snaps to shape/territory center points
   - Priority: 4
   - Visual: Orange crosshair
   - Color: `#FF6600`

4. **Grid Snapping**
   - Aligns to grid intersections
   - Priority: 5 (lowest)
   - Visual: Gray circle
   - Color: `#666666`

5. **Angle Snapping**
   - Constrains to 45° increments
   - Active during drawing operations
   - Visual: Orange dashed line
   - Color: `#FF6600`

### Alignment Guides

- **Horizontal/Vertical Alignment**: Blue dashed lines appear when aligning with other elements
- **Aligned Element Highlighting**: Shows which vertices/centers you're aligning with
- **Smart Deduplication**: Prevents duplicate guide lines at same positions

## User Interface

### Keyboard Shortcuts

- **S** - Toggle snapping on/off
- **Alt** (hold) - Temporarily disable snapping
- **G** - Toggle grid visibility

### Visual Indicators

1. **Snap Points**: Colored circles showing active snap targets
2. **Snap Lines**: Dashed lines from cursor to snap point
3. **Alignment Guides**: Extended dashed lines for alignment
4. **Status Indicator**: "Snap ON" badge in bottom center when active

### Settings Panel

Located in the Tool Palette with the following options:
- Master enable/disable toggle
- Individual snap type toggles:
  - Vertices - Snap to shape vertices
  - Edges - Snap to shape edges and midpoints
  - Centers - Snap to shape center points
  - Grid - Snap to grid intersections (OFF by default)
  - Angles (45°) - Constrain to 45-degree increments
- Snap distance adjustment (5-50px)
- Visual feedback controls

## Technical Implementation

### Architecture

```
snapping-system/
├── types/snapping.ts          # Type definitions
├── utils/snapping.ts          # Core algorithms
├── hooks/useSnapping.ts       # React integration
└── components/
    └── SnapIndicators.tsx     # Visual feedback
```

### Core Types

```typescript
interface SnapResult {
  point: Point
  type: 'vertex' | 'edge' | 'edge-midpoint' | 'center' | 'grid' | 'guide'
  target?: {
    territoryId/shapeId: string
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
  angleSnap: boolean
  angleSnapIncrement: number
}
```

### Key Algorithms

#### 1. Snap Point Detection
```typescript
function getSnapCandidates(
  point: Point,
  shapes: Shape[],
  settings: SnapSettings,
  gridSize: number,
  excludeIds?: string[]
): SnapResult[]
```
- Collects all potential snap points within range
- Filters by enabled snap types
- Sorts by priority, then distance
- Returns best candidate

#### 2. Edge Snapping
```typescript
function getClosestPointOnSegment(
  point: Point,
  start: Point,
  end: Point
): { point: Point; distance: number }
```
- Calculates perpendicular projection onto line segment
- Clamps to segment bounds
- Detects midpoints automatically

#### 3. Alignment Guide Generation
```typescript
function getAlignmentGuides(
  point: Point,
  shapes: Shape[],
  threshold: number = 5
): { guides: Line[], alignedElements: AlignedElement[] }
```
- Checks horizontal/vertical alignment
- Deduplicates overlapping guides
- Returns both guides and aligned elements

### State Management

The snapping state is integrated into the main store (Zustand):

```typescript
snapping: {
  activeSnaps: SnapResult[]
  indicators: SnapIndicator[]
  hoveredSnapTargets: Set<string>
  settings: SnapSettings
  isSnapping: boolean
  temporaryDisabled: boolean
}
```

### Integration Points

#### 1. Drawing Operations
- Active during pen tool usage
- Snaps each vertex as placed
- Angle snapping relative to previous point

#### 2. Vertex Editing
- Snaps while dragging vertices
- Excludes current shape from targets
- Works with bezier control handles

#### 3. Shape Movement
- Uses selection center as snap reference
- Excludes selected shapes from targets
- Maintains relative positions

## Performance Considerations

### Optimizations

1. **Spatial Filtering**
   - Only check shapes within snap distance
   - Early exit on first valid snap (when not showing guides)

2. **Deduplication**
   - Track processed guide positions
   - Merge overlapping alignment lines

3. **Lazy Calculation**
   - Only calculate when pointer moves
   - Cache results during drag operations

### Performance Targets

- Snap calculation: <2ms per frame
- Visual update: 60fps maintained
- Memory: Minimal overhead (<1MB)

## Usage Patterns

### Drawing Shapes

1. Enable snapping (S key or UI toggle)
2. Select pen tool
3. Click to place vertices - they'll snap to nearby elements
4. Hold Alt to temporarily disable for fine positioning
5. Alignment guides show relationships

### Editing Vertices

1. Double-click shape to enter edit mode
2. Drag vertices - they snap to alignment points
3. Blue highlights show aligned vertices
4. Orange crosshairs show aligned centers

### Moving Shapes

1. Select one or more shapes
2. Drag to move - center point snaps
3. Alignment guides show relationships
4. Original positions excluded from snapping

## Best Practices

### For Users

1. **Start with Grid**: Use grid snapping for initial layout
2. **Refine with Vertices**: Switch to vertex snapping for precise connections
3. **Use Alt Key**: Hold Alt when you need to place something slightly off-grid
4. **Watch for Guides**: Blue lines indicate alignment opportunities

### For Developers

1. **Exclude Self**: Always exclude shapes being edited from snap targets
2. **Priority Matters**: Respect snap priority for predictable behavior
3. **Visual Feedback**: Always show what's being snapped to
4. **Performance First**: Limit search radius and candidate count

## Troubleshooting

### Common Issues

1. **Snapping Not Working**
   - Check if snapping is enabled (S key)
   - Verify snap types are enabled in settings
   - Increase snap distance if too small

2. **Duplicate Guidelines**
   - Fixed by deduplication algorithm
   - Check excluded shapes list

3. **Performance Issues**
   - Reduce snap distance
   - Disable unnecessary snap types
   - Check shape count in scene

## Future Enhancements

1. **Smart Guides**
   - Equal spacing detection
   - Parallel/perpendicular snapping
   - Pattern continuation

2. **Custom Snap Points**
   - User-defined snap targets
   - Named anchor points
   - Snap point groups

3. **Advanced Constraints**
   - Distance constraints
   - Angle constraints
   - Symmetry guides

## API Reference

### useSnapping Hook

```typescript
const {
  getSnappedPoint,
  getSnappedDrawingPoint,
  isSnappingEnabled,
  snapSettings
} = useSnapping()
```

### Methods

#### getSnappedPoint
```typescript
getSnappedPoint(
  point: Point,
  excludeIds?: string | string[]
): {
  point: Point
  snapResult: SnapResult | null
  indicators: SnapIndicator[]
}
```

#### getSnappedDrawingPoint
```typescript
getSnappedDrawingPoint(
  point: Point,
  previousPoint?: Point
): {
  point: Point
  snapResult: SnapResult | null
  indicators: SnapIndicator[]
}
```

## Version History

- **v1.0.0** - Initial implementation
  - Basic snapping types
  - Visual feedback system
  - Keyboard controls
  - Settings UI

- **v1.1.0** - Movement snapping
  - Added snapping during shape movement
  - Fixed duplicate alignment guides
  - Improved visual feedback for centers

- **v2.0.0** - Major fixes and improvements
  - Fixed grid snapping override issues
  - Removed all hidden Math.round() operations
  - Fixed preview elements not respecting snap settings
  - Added proper coordinate transformation without rounding
  - Grid snapping now OFF by default
  - Fixed angle snapping priority system
  - Improved visual feedback with crosshair for centers
  - Status indicator moved to bottom center
  - Fixed dependency array issues preventing updates