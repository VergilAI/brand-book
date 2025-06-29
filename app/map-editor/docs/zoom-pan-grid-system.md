# Map Editor: Zoom, Pan, Gesture & Grid System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Grid System](#grid-system)
3. [Zoom System](#zoom-system)
4. [Pan System](#pan-system)
5. [Gesture Detection](#gesture-detection)
6. [Implementation Details](#implementation-details)
7. [Configuration & Customization](#configuration--customization)
8. [Troubleshooting](#troubleshooting)

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
  REFERENCE_SIZE: 40,          // Base unit in world coordinates
  LEVELS_VISIBLE: 4,           // Always show exactly 4 grid levels
  SUBDIVISION_FACTOR: 4,       // Each level is 4x the previous
  MIN_OPACITY: 0.01,          // Don't render below this opacity
  STROKE_COLOR: '#94A3B8',    // Slate-400 for subtle grid
  STROKE_OPACITY: 0.08        // Very subtle opacity
}
```

### Grid Levels

- **Level 0**: Base unit (40px at zoom 1.0)
- **Level 1**: 160px (4× Level 0)
- **Level 2**: 640px (4× Level 1)
- **Level n**: 40 × 4^n pixels

### Level Selection Algorithm

```typescript
function getVisibleLevels(zoom: number): number[] {
  // Calculate which level has spacing closest to reference size
  const idealLevel = -Math.log(zoom) / Math.log(4)
  const centerLevel = Math.round(idealLevel)
  
  // Always show 4 consecutive levels
  return [
    centerLevel - 1,  // Finest level
    centerLevel,      // Primary level
    centerLevel + 1,  // Secondary level
    centerLevel + 2   // Coarsest level
  ]
}
```

### Opacity Calculation

Grid lines fade in/out based on their apparent size:

```typescript
function calculateLevelOpacity(level: number, zoom: number): number {
  const levelSize = GRID_CONFIG.REFERENCE_SIZE * Math.pow(4, level)
  const apparentSize = levelSize * zoom
  const normalizedSize = apparentSize / GRID_CONFIG.REFERENCE_SIZE
  
  // Opacity transitions
  if (normalizedSize < 0.25) return 0      // Too small
  if (normalizedSize < 1) return (normalizedSize - 0.25) / 0.75
  if (normalizedSize < 4) return 1         // Optimal
  if (normalizedSize < 16) return 1 - (normalizedSize - 4) / 12
  return 0  // Too large
}
```

### Canvas Rendering

The grid is rendered on a separate Canvas 2D layer for performance:

```typescript
// Coordinate transformation
const svgToCanvas = (x: number, y: number) => {
  const normalizedX = (x - pan.x) / viewBoxWidth
  const normalizedY = (y - pan.y) / viewBoxHeight
  
  // Snap to half-pixels for sharp rendering
  const canvasX = Math.round(normalizedX * width * 2) / 2
  const canvasY = Math.round(normalizedY * height * 2) / 2
  
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
// In HierarchicalGrid.tsx
const GRID_CONFIG = {
  REFERENCE_SIZE: 40,      // Change base grid size
  STROKE_COLOR: '#94A3B8', // Change grid color
  STROKE_OPACITY: 0.08     // Change opacity
}

// For dot grid instead of lines
<HierarchicalGrid gridType="dots" />
```

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

## Troubleshooting

### Common Issues

1. **Grid appears jittery during zoom**
   - Check coordinate rounding in svgToCanvas
   - Ensure pan values are rounded to prevent sub-pixel movement

2. **Zoom feels sluggish**
   - Increase smoothingFactor (max 1.0)
   - Increase zoomSpeed

3. **Gestures getting confused**
   - Adjust gesture detection thresholds
   - Increase gestureTimeout delay

4. **Grid lines too prominent**
   - Reduce STROKE_OPACITY
   - Adjust canvas opacity
   - Change STROKE_COLOR to lighter shade

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