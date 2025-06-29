# Hierarchical Grid and Smooth Zoom System

## Overview

This document describes the complete specification and implementation plan for a sophisticated hierarchical grid system with smooth zooming. The system maintains exactly 4 visible grid levels at any time, uses a 4×4 subdivision pattern, and provides buttery-smooth zoom interactions.

## Table of Contents

1. [Grid System Architecture](#grid-system-architecture)
2. [Zoom System Design](#zoom-system-design)
3. [Implementation Plan](#implementation-plan)
4. [Technical Specifications](#technical-specifications)
5. [Performance Considerations](#performance-considerations)
6. [Integration Guide](#integration-guide)

## Grid System Architecture

### Core Concept

A fractal-like grid where each level is a 4×4 subdivision of the previous level. The system maintains constant visual density by always showing exactly 4 grid levels, smoothly transitioning between them as you zoom.

### Mathematical Foundation

#### Grid Levels
- **Level 0**: Base unit (reference size)
- **Level 1**: 4× larger (contains 4×4 Level 0 squares)
- **Level 2**: 16× larger (contains 4×4 Level 1 squares)
- **Level n**: 4^n × base unit

#### Key Constants
```typescript
const GRID_CONFIG = {
  REFERENCE_SIZE: 40,          // Base unit in world coordinates
  LEVELS_VISIBLE: 4,           // Always show exactly 4 grid levels
  SUBDIVISION_FACTOR: 4,       // Each level is 4x the previous
  MIN_OPACITY: 0.01,          // Don't render below this opacity
  STROKE_COLOR: '#000000',    // Pure black lines
  STROKE_OPACITY: 0.15        // Max line opacity
}
```

#### Opacity Formula
```typescript
function calculateOpacity(level: number, zoom: number): number {
  const levelSize = GRID_CONFIG.REFERENCE_SIZE * Math.pow(4, level)
  const apparentSize = levelSize / zoom
  const normalizedSize = apparentSize / GRID_CONFIG.REFERENCE_SIZE
  
  // Opacity transitions from 0 to 1 as size goes from 0.25x to 1x reference
  const rawOpacity = (normalizedSize - 0.25) / 0.75
  return clamp(rawOpacity, 0, 1) * GRID_CONFIG.STROKE_OPACITY
}
```

#### Level Selection Algorithm
```typescript
function getVisibleLevels(zoom: number): number[] {
  // Find the primary level (closest to reference size)
  const primaryLevel = Math.round(Math.log(zoom) / Math.log(4))
  
  // Always show 4 consecutive levels
  return [
    primaryLevel - 1,  // Finest (fading in as we zoom in)
    primaryLevel,      // Primary (optimal opacity)
    primaryLevel + 1,  // Secondary (optimal to fading)
    primaryLevel + 2   // Coarsest (fading out as we zoom in)
  ].filter(level => level >= 0) // Don't go below Level 0
}
```

### Rendering Architecture

#### Canvas 2D Implementation
```typescript
class HierarchicalGrid {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  
  render(zoom: number, pan: Point, viewport: Viewport) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Set up coordinate transform
    this.ctx.save()
    this.ctx.translate(viewport.width/2, viewport.height/2)
    this.ctx.scale(zoom, zoom)
    this.ctx.translate(-pan.x, -pan.y)
    
    // Calculate visible bounds in world coordinates
    const bounds = this.getVisibleBounds(viewport, zoom, pan)
    
    // Get active levels and render each
    const levels = getVisibleLevels(zoom)
    
    this.ctx.strokeStyle = GRID_CONFIG.STROKE_COLOR
    this.ctx.lineWidth = 1 / zoom  // Constant visual width
    
    for (const level of levels) {
      const opacity = calculateOpacity(level, zoom)
      if (opacity > GRID_CONFIG.MIN_OPACITY) {
        this.drawGridLevel(level, opacity, bounds)
      }
    }
    
    this.ctx.restore()
  }
  
  private drawGridLevel(level: number, opacity: number, bounds: Bounds) {
    const spacing = GRID_CONFIG.REFERENCE_SIZE * Math.pow(4, level)
    
    this.ctx.globalAlpha = opacity
    this.ctx.beginPath()
    
    // Vertical lines
    const startX = Math.floor(bounds.left / spacing) * spacing
    const endX = Math.ceil(bounds.right / spacing) * spacing
    
    for (let x = startX; x <= endX; x += spacing) {
      this.ctx.moveTo(x, bounds.top)
      this.ctx.lineTo(x, bounds.bottom)
    }
    
    // Horizontal lines
    const startY = Math.floor(bounds.top / spacing) * spacing
    const endY = Math.ceil(bounds.bottom / spacing) * spacing
    
    for (let y = startY; y <= endY; y += spacing) {
      this.ctx.moveTo(bounds.left, y)
      this.ctx.lineTo(bounds.right, y)
    }
    
    this.ctx.stroke()
  }
}
```

## Zoom System Design

### Core Principles

1. **Zoom to Cursor**: Always zoom toward/away from the cursor position
2. **Momentum-based**: Natural acceleration and deceleration
3. **Frame-perfect**: Use requestAnimationFrame for 60fps
4. **Predictive**: Anticipate zoom direction for grid transitions

### Zoom Configuration
```typescript
const ZOOM_CONFIG = {
  // Zoom limits
  minZoom: 0.1,
  maxZoom: 100,
  
  // Physics
  acceleration: 0.2,        // How quickly zoom responds
  friction: 0.85,          // Velocity decay
  snapThreshold: 0.001,    // When to stop animating
  
  // Input scaling
  wheelSensitivity: 0.002,  // Trackpad/wheel input scaling
  pinchSensitivity: 0.01,   // Touch pinch scaling
  keyboardStep: 1.2,        // Zoom in/out factor for +/- keys
  
  // Grid integration
  gridLevelThreshold: 0.05  // Preload grid level when within 5% of transition
}
```

### Smooth Zoom Controller
```typescript
class SmoothZoomController {
  private animationFrame: number | null = null
  private zoomState: ZoomState = {
    current: 1,
    target: 1,
    velocity: 0,
    lastTimestamp: 0,
    focalPoint: { x: 0, y: 0 }
  }
  
  handleWheelEvent(event: WheelEvent) {
    // Detect input type (trackpad vs mouse wheel)
    const isPrecisionDevice = Math.abs(event.deltaY) < 50
    const multiplier = isPrecisionDevice 
      ? ZOOM_CONFIG.wheelSensitivity 
      : ZOOM_CONFIG.wheelSensitivity * 3
    
    // Calculate zoom delta
    const delta = -event.deltaY * multiplier
    const zoomFactor = Math.exp(delta)
    
    // Update target zoom
    this.zoomState.target *= zoomFactor
    this.zoomState.target = clamp(
      this.zoomState.target,
      ZOOM_CONFIG.minZoom,
      ZOOM_CONFIG.maxZoom
    )
    
    // Update focal point (cursor position in world coordinates)
    this.updateFocalPoint(event.clientX, event.clientY)
    
    // Start animation if not running
    if (!this.animationFrame) {
      this.startZoomAnimation()
    }
  }
  
  private startZoomAnimation() {
    const animate = (timestamp: number) => {
      const deltaTime = Math.min(timestamp - this.zoomState.lastTimestamp, 16)
      this.zoomState.lastTimestamp = timestamp
      
      // Calculate zoom physics
      const zoomDiff = this.zoomState.target - this.zoomState.current
      const acceleration = zoomDiff * ZOOM_CONFIG.acceleration
      
      // Update velocity with acceleration and friction
      this.zoomState.velocity += acceleration
      this.zoomState.velocity *= ZOOM_CONFIG.friction
      
      // Update current zoom
      const previousZoom = this.zoomState.current
      this.zoomState.current += this.zoomState.velocity
      
      // Apply focal point correction to keep cursor stable
      this.applyFocalPointCorrection(previousZoom)
      
      // Preload grid levels for smooth transitions
      this.preloadGridLevels()
      
      // Continue or stop animation
      if (Math.abs(this.zoomState.velocity) > ZOOM_CONFIG.snapThreshold ||
          Math.abs(zoomDiff) > ZOOM_CONFIG.snapThreshold) {
        this.animationFrame = requestAnimationFrame(animate)
      } else {
        this.zoomState.current = this.zoomState.target
        this.zoomState.velocity = 0
        this.animationFrame = null
      }
      
      // Trigger render
      this.onZoomChange(this.zoomState.current)
    }
    
    this.animationFrame = requestAnimationFrame(animate)
  }
  
  private applyFocalPointCorrection(previousZoom: number) {
    // Calculate pan adjustment to keep focal point stable
    const zoomRatio = this.zoomState.current / previousZoom
    const panAdjustment = {
      x: this.focalPoint.x * (1 - zoomRatio),
      y: this.focalPoint.y * (1 - zoomRatio)
    }
    
    // Apply pan adjustment
    this.onPanChange(panAdjustment)
  }
}
```

## Implementation Plan

### Phase 1: Core Grid Engine (2-3 days)

1. **Canvas Setup**
   - Create dedicated canvas element for grid
   - Layer beneath SVG content
   - Match viewport dimensions
   - Handle resize events

2. **Coordinate System**
   - Implement world-to-screen transforms
   - Origin (0,0) at canvas center
   - Sync with SVG coordinate system

3. **Basic Grid Renderer**
   - Implement `drawGridLevel` function
   - Test with fixed zoom levels
   - Verify line alignment

### Phase 2: Dynamic Level Management (2-3 days)

1. **Level Selection**
   - Implement `getVisibleLevels` algorithm
   - Calculate opacity for each level
   - Handle edge cases (extreme zoom)

2. **Opacity Transitions**
   - Implement smooth opacity calculations
   - Test transition smoothness
   - Optimize for performance

3. **Render Pipeline**
   - Complete render loop
   - Add viewport culling
   - Implement dirty rectangle optimization

### Phase 3: Smooth Zoom System (3-4 days)

1. **Zoom Controller**
   - Implement `SmoothZoomController` class
   - Add wheel event handling
   - Implement momentum physics

2. **Focal Point Zoom**
   - Calculate cursor world coordinates
   - Implement pan corrections
   - Test zoom-to-cursor accuracy

3. **Animation Loop**
   - Set up requestAnimationFrame
   - Implement velocity calculations
   - Add friction and snap-to-rest

### Phase 4: Integration & Polish (2-3 days)

1. **React Integration**
   - Create `useHierarchicalGrid` hook
   - Add canvas component
   - Connect to map editor state

2. **Performance Optimization**
   - Add performance monitoring
   - Implement quality settings
   - Optimize for low-end devices

3. **Additional Features**
   - Keyboard shortcuts (Ctrl+0, +/-)
   - Double-click zoom
   - Touch/pinch support
   - Zoom indicator UI

## Technical Specifications

### Data Structures
```typescript
interface GridState {
  zoom: number
  pan: Point
  visibleLevels: number[]
  levelOpacities: Map<number, number>
}

interface ZoomState {
  current: number
  target: number
  velocity: number
  lastTimestamp: number
  focalPoint: Point
}

interface Point {
  x: number
  y: number
}

interface Bounds {
  left: number
  top: number
  right: number
  bottom: number
}
```

### Performance Targets
- 60fps during zoom/pan operations
- < 16ms render time per frame
- < 50MB memory usage
- Works on integrated graphics

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

### Optimization Strategies

1. **Viewport Culling**
   - Only draw lines within visible bounds
   - Add 10% padding for smooth panning

2. **Level-of-Detail**
   - Skip sub-pixel lines
   - Reduce density at extreme zooms

3. **Canvas Optimizations**
   - Use `beginPath()` once per level
   - Batch all lines before `stroke()`
   - Disable anti-aliasing for crisp lines

4. **Memory Management**
   - No object allocation in render loop
   - Reuse coordinate arrays
   - Clear references after use

### Performance Monitoring
```typescript
class PerformanceMonitor {
  private frameTimes: number[] = []
  
  measureFrame(callback: () => void) {
    const start = performance.now()
    callback()
    const duration = performance.now() - start
    
    this.frameTimes.push(duration)
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift()
    }
    
    if (duration > 16) {
      console.warn(`Slow frame: ${duration.toFixed(2)}ms`)
    }
  }
  
  getAverageFPS(): number {
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    return 1000 / avg
  }
}
```

## Integration Guide

### React Component
```typescript
export function MapEditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<HierarchicalGrid>(null)
  const zoomRef = useRef<SmoothZoomController>(null)
  
  const { zoom, pan, updateTransform } = useMapEditor()
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    // Initialize systems
    gridRef.current = new HierarchicalGrid(canvasRef.current)
    zoomRef.current = new SmoothZoomController({
      onZoomChange: (newZoom) => {
        updateTransform({ zoom: newZoom })
        gridRef.current?.render(newZoom, pan, viewport)
      },
      onPanChange: (panDelta) => {
        updateTransform({ 
          pan: { 
            x: pan.x + panDelta.x, 
            y: pan.y + panDelta.y 
          } 
        })
      }
    })
    
    // Connect events
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomRef.current?.handleWheelEvent(e)
    }
    
    canvasRef.current.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      canvasRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
```

### Usage Example
```typescript
// In your map editor component
<div className="relative w-full h-full">
  <MapEditorCanvas />  {/* Grid layer */}
  <MapSVGContent />    {/* Content layer */}
  <MapUIOverlay />     {/* UI layer */}
</div>
```

## Future Enhancements

1. **Grid Customization**
   - Configurable subdivision factor (3×3, 5×5)
   - Custom color schemes
   - Multiple grid types (hex, triangle)

2. **Advanced Features**
   - Grid snapping with visual feedback
   - Ruler/measurement tools
   - Grid-aligned guides

3. **Performance Features**
   - WebGL renderer for extreme performance
   - Worker-based grid generation
   - Progressive rendering for large viewports

## Conclusion

This hierarchical grid and smooth zoom system provides a professional, performant foundation for the map editor. The fractal-like structure ensures visual consistency at any zoom level, while the physics-based zoom creates a natural, responsive feel. The implementation is optimized for performance while maintaining visual quality, making it suitable for both high-end and low-end devices.