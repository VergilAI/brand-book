# Map Editor: Zoom, Pan, Gesture & Grid System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Grid System](#grid-system)
3. [Zoom System](#zoom-system)
4. [Pan System](#pan-system)
5. [Gesture Detection](#gesture-detection)
6. [Implementation Details](#implementation-details)
7. [Configuration & Customization](#configuration--customization)
8. [Debug Panel](#debug-panel)
9. [Troubleshooting](#troubleshooting)

## Overview

The map editor uses a sophisticated coordinate system that combines SVG for content rendering with Canvas 2D for the grid overlay. The system supports smooth zooming, panning, and gesture detection optimized for both mouse and trackpad inputs.

### Key Features
- **Hierarchical 4×4 Grid**: Always shows exactly 4 grid levels with smooth transitions
- **Smooth Zoom**: Exponential smoothing with zoom-to-cursor
- **Gesture Detection**: Distinguishes between pinch zoom, two-finger pan, and mouse wheel
- **Cross-platform**: Works on macOS trackpads, Windows precision touchpads, and mice

## Grid System

### Hierarchical Grid Architecture

The grid uses a fractal-like structure where each level is a 4×4 subdivision of the previous level.

```typescript
// Grid configuration in components/canvas/HierarchicalGrid.tsx
const GRID_CONFIG = {
  REFERENCE_SIZE: 10,          // Base unit matches snap grid
  LEVELS_VISIBLE: 2,           // Show only 2 grid levels
  SUBDIVISION_FACTOR: 4,       // Each level is 4x the previous
  MIN_OPACITY: 0.01,          // Don't render below this opacity
  STROKE_COLOR: '#94A3B8',    // Slate-400 for subtle grid
  STROKE_OPACITY: 0.18,        // Subtle grid opacity
  MIN_LEVEL: 0,               // No grids smaller than reference
  OPACITY_CURVE: 'sigmoid',    // S-curve transitions
  CURVE_STEEPNESS: 4,         // Transition sharpness
  MAX_VISIBLE_GRIDS: 3        // Maximum simultaneous grids
}
```

### Grid Levels

- **Level 0**: Base unit (10px at zoom 1.0) - matches snap grid
- **Level 1**: 40px (4× Level 0)
- **Level 2**: 160px (4× Level 1)
- **Level n**: 10 × 4^n pixels

With `MIN_LEVEL: 0`, no grids smaller than 10px are shown, preventing visual noise from sub-reference grids.

### Level Selection Algorithm

```typescript
function getVisibleLevels(zoom: number): number[] {
  // Calculate which level has spacing closest to reference size
  const idealLevel = -Math.log(zoom) / Math.log(4)
  const centerLevel = Math.round(idealLevel)
  
  // Show configured number of levels, respecting MIN_LEVEL
  const levels: number[] = []
  const halfLevels = Math.floor(config.LEVELS_VISIBLE / 2)
  const startLevel = centerLevel - halfLevels + (config.LEVELS_VISIBLE % 2 === 0 ? 1 : 0)
  
  for (let i = 0; i < config.LEVELS_VISIBLE; i++) {
    const level = startLevel + i
    if (level >= config.MIN_LEVEL) {
      levels.push(level)
    }
  }
  
  return levels
}
```

### Opacity Calculation

Grid lines use configurable opacity curves for smooth transitions:

```typescript
// Base opacity calculation
function calculateLevelOpacity(level: number, zoom: number, config): number {
  const levelSize = config.REFERENCE_SIZE * Math.pow(config.SUBDIVISION_FACTOR, level)
  const apparentSize = levelSize * zoom
  const normalizedSize = apparentSize / config.REFERENCE_SIZE
  
  // Calculate base opacity
  let baseOpacity = 0
  if (normalizedSize < 0.25) baseOpacity = 0
  else if (normalizedSize < 1) baseOpacity = (normalizedSize - 0.25) / 0.75
  else if (normalizedSize < 4) baseOpacity = 1
  else if (normalizedSize < 16) baseOpacity = 1 - (normalizedSize - 4) / 12
  else baseOpacity = 0
  
  // Apply opacity curve
  const curvedOpacity = applyOpacityCurve(baseOpacity, config.OPACITY_CURVE, config.CURVE_STEEPNESS)
  return Math.max(0, Math.min(1, curvedOpacity)) * config.STROKE_OPACITY
}

// Opacity curve functions
function applyOpacityCurve(x: number, curve: string, steepness: number): number {
  switch (curve) {
    case 'sigmoid':
      // S-curve for smooth transitions
      return 1 / (1 + Math.exp(-steepness * (x - 0.5) * 2))
    case 'exponential':
      // Fast drop-off
      return Math.pow(x, 1 / steepness)
    case 'step':
      // Discrete levels
      if (x < 0.3) return 0
      if (x < 0.7) return 0.5
      return 1
    default:
      return x // Linear
  }
}
```

The system also limits visible grids to `MAX_VISIBLE_GRIDS`, showing only the most opaque levels.

### Canvas Rendering

The grid is rendered on a separate Canvas 2D layer for performance:

```typescript
// Coordinate transformation
const svgToCanvas = (x: number, y: number) => {
  const normalizedX = (x - pan.x) / viewBoxWidth
  const normalizedY = (y - pan.y) / viewBoxHeight
  
  // Direct conversion without half-pixel snapping for proper alignment
  const canvasX = normalizedX * width
  const canvasY = normalizedY * height
  
  return { x: canvasX, y: canvasY }
}
```

## Zoom System

### Smooth Zoom Controller

Located in `hooks/useSmoothZoomController.ts`, this manages all zoom operations.

#### Configuration

```typescript
const defaultConfig = {
  minZoom: 0.1,              // Minimum zoom level (10%)
  maxZoom: 5,                // Maximum zoom level (500%)
  zoomSpeed: 0.004,          // Mouse wheel sensitivity
  smoothingFactor: 0.85,     // Animation smoothing (0-1)
  momentumFriction: 0.92,    // Not used (legacy)
  snapToLevels: undefined    // Optional zoom snap points
}
```

#### Zoom Types

1. **Wheel Zoom**: Mouse wheel or trackpad pinch
   - Small changes (< 0.05): Instant update
   - Large changes: Smooth animation

2. **Pinch Zoom**: Direct gesture input
   - Always instant update
   - No animation during gesture

3. **Programmatic Zoom**: Keyboard shortcuts, buttons
   - Always animated

#### Zoom-to-Cursor Algorithm

```typescript
// Keep the point under the cursor fixed during zoom
const calculatePanAdjustment = (oldZoom, newZoom, zoomCenter, viewportSize, currentPan) => {
  // Convert cursor position to world coordinates
  const normalizedX = zoomCenter.x / viewportSize.width
  const normalizedY = zoomCenter.y / viewportSize.height
  
  const zoomCenterWorld = {
    x: currentPan.x + normalizedX * (baseWidth / oldZoom),
    y: currentPan.y + normalizedY * (baseHeight / oldZoom)
  }
  
  // Calculate new pan to keep cursor position fixed
  return {
    x: zoomCenterWorld.x - normalizedX * (baseWidth / newZoom),
    y: zoomCenterWorld.y - normalizedY * (baseHeight / newZoom)
  }
}
```

## Pan System

### Pan Types

1. **Two-finger trackpad pan**: Direct manipulation
2. **Drag pan**: Click and drag with pan tool
3. **Space+drag pan**: Hold space and drag
4. **Keyboard pan**: Arrow keys (if implemented)

### Implementation

```typescript
// Instant pan (no animation)
const instantPan = (newPan: Point) => {
  panState.current = newPan
  panState.target = newPan
  setPan(newPan)  // Update React state
}

// Animated pan
const animatedPan = (newPan: Point) => {
  panState.target = newPan
  startAnimation()
}
```

## Gesture Detection

### macOS Trackpad Detection

The system distinguishes between different input types:

```typescript
// In handleWheel event
const isPinchZoom = e.ctrlKey  // macOS sends ctrlKey for pinch
const hasFractionalDelta = (e.deltaY % 1 !== 0) || (e.deltaX % 1 !== 0)
const hasHorizontalMovement = Math.abs(e.deltaX) > 0

// Detection logic
const isMouseWheel = !isPinchZoom && !hasFractionalDelta && !hasHorizontalMovement && Math.abs(e.deltaY) > 50
const isTwoFingerPan = !isPinchZoom && !isMouseWheel
```

### Gesture Types

1. **Pinch Zoom**
   - `ctrlKey = true` (macOS)
   - Use deltaY for zoom factor

2. **Two-finger Pan**
   - `ctrlKey = false`
   - Has deltaX and/or deltaY
   - Often fractional values

3. **Mouse Wheel**
   - `ctrlKey = false`
   - Large deltaY (> 50)
   - Integer values
   - No deltaX

### Gesture Consistency

To prevent gesture confusion during rapid movements:

```typescript
let lastGestureType = useRef<'pan' | 'zoom' | null>(null)
const gestureTimeout = useRef<NodeJS.Timeout | null>(null)

// Maintain gesture type for 100ms after last event
if (lastGestureType.current && lastGestureType.current !== currentGesture) {
  currentGesture = lastGestureType.current
}

// Reset after delay
gestureTimeout.current = setTimeout(() => {
  lastGestureType.current = null
}, 100)
```

## Implementation Details

### Coordinate Systems

1. **World Coordinates**: The logical coordinate space
   - Origin at (0, 0)
   - Units in pixels at zoom 1.0

2. **Screen Coordinates**: Physical pixels on screen
   - Origin at top-left of viewport
   - Affected by zoom and pan

3. **SVG ViewBox**: Controls visible area
   ```typescript
   const viewBox = `${pan.x} ${pan.y} ${1000/zoom} ${1000/zoom/aspectRatio}`
   ```

### React Integration

```typescript
// Main component structure
<div className="relative w-full h-full bg-white">
  <svg viewBox={viewBox}>
    {/* Map content */}
  </svg>
  
  {/* Grid overlay - rendered on top */}
  <HierarchicalGrid
    width={containerSize.width}
    height={containerSize.height}
    zoom={zoom}
    pan={pan}
    gridType={gridType}
  />
</div>
```

### Performance Optimizations

1. **Canvas for Grid**: More efficient than SVG for many lines
2. **RequestAnimationFrame**: Smooth 60fps animations
3. **Memoization**: Grid component uses React.memo
4. **Half-pixel Snapping**: Prevents blurry lines
5. **Level Culling**: Only render visible grid levels

## Configuration & Customization

### Modifying Grid Appearance

```typescript
// Default configuration in HierarchicalGrid.tsx
const GRID_CONFIG = {
  REFERENCE_SIZE: 10,         // Base grid size (matches snap grid)
  LEVELS_VISIBLE: 2,          // Number of grid levels
  SUBDIVISION_FACTOR: 4,      // Grid hierarchy factor
  MIN_OPACITY: 0.01,         // Render threshold
  STROKE_COLOR: '#94A3B8',   // Grid color
  STROKE_OPACITY: 0.18,      // Overall opacity
  MIN_LEVEL: 0,              // Minimum grid level
  OPACITY_CURVE: 'sigmoid',   // Transition curve
  CURVE_STEEPNESS: 4,        // Curve steepness
  MAX_VISIBLE_GRIDS: 3       // Maximum grids shown
}

// For dot grid instead of lines
<HierarchicalGrid gridType="dots" />
```

For runtime configuration, use the Debug Panel (see below).

### Adjusting Zoom Behavior

```typescript
// In useSmoothZoomController
const config = {
  zoomSpeed: 0.004,       // Increase for faster zoom
  smoothingFactor: 0.85,  // Decrease for snappier response
  minZoom: 0.05,         // Allow more zoom out
  maxZoom: 10            // Allow more zoom in
}
```

### Adding New Gestures

```typescript
// Example: Double-click to zoom
const handleDoubleClick = (e: MouseEvent) => {
  const center = { x: e.clientX, y: e.clientY }
  const targetZoom = zoom * 2  // Zoom in 2x
  setZoomLevel(targetZoom, center, viewportSize)
}
```

## Debug Panel

The map editor includes a comprehensive debug panel for real-time grid configuration:

### Accessing the Debug Panel

- **Location**: Top-left corner of the map editor
- **Toggle**: Click the bug icon to expand/collapse
- **Availability**: Development mode or when `NEXT_PUBLIC_DEBUG_MODE=true`

### Key Features

1. **Grid Configuration**
   - Base Reference Size (10-200px)
   - Subdivision Factor (2-10)
   - Visible Levels (1-6)
   - Stroke Opacity (0-1 with slider)
   - Grid Color (color picker)

2. **Advanced Controls**
   - Min Level (prevents sub-reference grids)
   - Opacity Curve (linear, sigmoid, exponential, step)
   - Curve Steepness (1-10)
   - Max Visible Grids (1-5)

3. **View Settings**
   - Toggle grid visibility
   - Show snap points (debug visualization)
   - Adjust snap grid size
   - Toggle grid snapping

4. **Real-time State**
   - Current zoom level
   - Pan position
   - Active tool
   - Territory count

### Usage Tips

- Changes apply immediately without page reload
- Use Reset button to restore defaults
- Panel is scrollable with isolated scroll events
- Settings persist until page refresh

For detailed documentation, see `/app/map-editor/docs/debug-panel-system.md`

## Troubleshooting

### Common Issues

1. **Grid appears jittery during zoom**
   - Fixed by removing half-pixel snapping
   - Ensure direct coordinate transformation

2. **Zoom feels sluggish**
   - Increase smoothingFactor (max 1.0)
   - Increase zoomSpeed
   - Check if animation frame is running

3. **Gestures getting confused**
   - System now better distinguishes pinch vs pan
   - Uses gesture consistency timeout
   - Check for ctrlKey on wheel events

4. **Grid lines too prominent**
   - Default opacity reduced to 0.18
   - Use debug panel to adjust
   - Try sigmoid curve for smoother transitions

5. **Grid not aligning with snap points**
   - Ensure REFERENCE_SIZE matches snap grid size
   - Both default to 10px
   - Enable "Show Snap Points" in debug panel

6. **Too many grid lines visible**
   - Reduce LEVELS_VISIBLE (default now 2)
   - Lower MAX_VISIBLE_GRIDS
   - Increase MIN_LEVEL to hide fine grids

### Debug Mode

Add debug output to diagnose issues:

```typescript
// In HierarchicalGrid.tsx drawGrid function
console.log('Grid Debug:', {
  zoom,
  visibleLevels: levels.map(l => ({
    spacing: l.spacing,
    opacity: l.opacity
  })),
  bounds: visibleBounds
})
```

### Browser Compatibility

- Chrome 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Uses GestureEvent API for better pinch detection
- Edge 90+: Full support

### Performance Monitoring

```typescript
// Add to animation loop
const start = performance.now()
drawGrid()
const duration = performance.now() - start

if (duration > 16) {  // Slower than 60fps
  console.warn(`Slow grid render: ${duration}ms`)
}
```

## Future Enhancements

1. **WebGL Grid Renderer**: For even better performance
2. **Adaptive Quality**: Reduce grid detail during rapid zoom
3. **Grid Snapping**: Optionally snap shapes to grid
4. **Custom Grid Patterns**: Hex, triangle, isometric
5. **Grid Measurements**: Show distances/rulers
6. **Touch Support**: Native touch events for tablets

## API Reference

### HierarchicalGrid Props

```typescript
interface HierarchicalGridProps {
  width: number        // Canvas width in pixels
  height: number       // Canvas height in pixels
  zoom: number        // Current zoom level
  pan: Point          // Current pan offset
  gridType?: 'lines' | 'dots'  // Grid style
}
```

### useSmoothZoomController

```typescript
const {
  wheelZoom,      // Handle wheel events
  pinchZoom,      // Handle pinch gestures
  setZoomLevel,   // Programmatic zoom
  instantPan,     // Immediate pan
  animatedPan,    // Smooth pan
  endGesture,     // Complete gesture
  currentZoom,    // Current zoom value
  targetZoom      // Target zoom value
} = useSmoothZoomController(options)
```

### Key Functions

```typescript
// Zoom to specific level
setZoomLevel(targetZoom: number, center?: Point, viewportSize?: Size)

// Handle wheel event
wheelZoom(delta: number, center: Point, viewportSize: Size)

// Handle pinch gesture
pinchZoom(scale: number, center: Point, viewportSize: Size, isActive?: boolean)

// Pan controls
instantPan(position: Point)  // No animation
animatedPan(position: Point)  // With animation
```