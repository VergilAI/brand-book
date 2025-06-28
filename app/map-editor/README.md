# Map Editor - Phase 1 Implementation

## Overview

A React-based territory map editor for creating and editing game maps with territory-based gameplay. The editor provides an SVG canvas with pan/zoom functionality, drawing tools, and a complete UI for map creation.

## Architecture

### Core Technologies
- **React 18** with TypeScript
- **Zustand** for state management
- **SVG** for rendering canvas and territories
- **Tailwind CSS** for styling
- **Lucide React** for icons

### State Management
The editor uses Zustand for centralized state management with the following key stores:

- `useMapEditor` - Main editor state and actions
- `usePointerPosition` - Mouse/pointer position tracking with coordinate transformations

## File Structure

```
app/map-editor/
├── components/
│   ├── canvas/
│   │   ├── MapCanvas.tsx        # Main canvas with interaction handling
│   │   └── GridOverlay.tsx      # Dynamic grid rendering
│   ├── tools/
│   │   └── ToolPalette.tsx      # Tool selection and settings
│   └── panels/
│       └── PropertiesPanel.tsx  # Territory property editing
├── hooks/
│   ├── useMapEditor.ts          # Main Zustand store
│   └── usePointerPosition.ts    # Position tracking hook
├── types/
│   └── editor.ts                # TypeScript type definitions
├── page.tsx                     # Main page layout
└── layout.tsx                   # Route layout
```

## Core Features

### 1. Tools System

#### Available Tools
- **Select (V)** - Select and manipulate territories
- **Move/Pan (H)** - Pan the canvas view
- **Draw Territory (P)** - Create new territories by drawing polygons
- **Edit Borders (B)** - *Future: Edit territory borders*
- **Sea Routes (C)** - *Future: Create connections between territories*

#### Tool Implementation
```typescript
export type ToolType = 'select' | 'pen' | 'border' | 'connect' | 'move'
```

### 2. Drawing System

#### Territory Creation
- Click-based polygon drawing
- Live preview with dashed lines
- Snap-to-grid option (configurable)
- Auto-close when clicking near start point
- Minimum 3 points required for valid territory

#### Drawing States
```typescript
interface DrawingState {
  isDrawing: boolean
  currentPath: Point[]
  previewPath: string
  snapToGrid: boolean
  autoClose: boolean
}
```

#### Visual Feedback
- **Preview lines** - Dashed blue lines showing current path
- **Live cursor line** - Line from last point to cursor position
- **Close indicator** - Pulsing circle when near start point for closing
- **Drawing points** - Visual markers for each placed point
- **Cursor indicator** - Shows exact cursor position when drawing

### 3. Pan and Zoom System

#### Zoom Implementation
- **Mouse wheel zoom** with 2% increments (0.98/1.02 multiplier)
- **Zoom-to-cursor** - Zooms toward/away from cursor position
- **Zoom range** - 10% to 500% (0.1x to 5.0x)
- **Smooth zoom** - Low sensitivity for precise control

#### Pan Implementation
- **Move tool** - Dedicated pan tool with grab cursor
- **Shift+drag** - Pan while using other tools
- **Middle mouse** - Universal pan gesture
- **Coordinate transformation** - Proper SVG coordinate handling

#### Mathematical Implementation
```typescript
// Zoom-to-cursor calculation
const mouseInSVG = {
  x: store.view.pan.x + (mouseX / svgWidth) * viewBoxWidth,
  y: store.view.pan.y + (mouseY / svgHeight) * viewBoxHeight
}

const newPan = {
  x: mouseInSVG.x - (mouseX / svgWidth) * (900 / newZoom),
  y: mouseInSVG.y - (mouseY / svgHeight) * (500 / newZoom)
}
```

### 4. Grid System

#### Grid Features
- **Dynamic rendering** - Only renders visible grid lines plus padding
- **Major/minor lines** - Minor lines every gridSize, major every 5x gridSize
- **Configurable size** - 5-50 pixel grid spacing
- **Origin marker** - Visual indicator at (0,0) coordinates
- **Performance optimized** - Extends beyond viewport for smooth panning

#### Grid Implementation
```typescript
// Extended grid coverage for smooth panning
const padding = Math.max(width, height) * 2
const startX = Math.floor((x - padding) / gridSize) * gridSize
const endX = Math.ceil((x + width + padding) / gridSize) * gridSize
```

### 5. Event Handling

#### Pointer Events
- **Unified handling** - Single pointer event system for mouse/touch
- **Tool-based routing** - Different behavior per active tool
- **Capture handling** - Proper pointer capture for dragging
- **Multi-button support** - Left, middle, right mouse button handling

#### Keyboard Shortcuts
- **V** - Select tool
- **P** - Pen/draw tool  
- **H** - Move/pan tool
- **G** - Toggle grid
- **Escape** - Cancel drawing or clear selection
- **Enter** - Finish drawing (when drawing)
- **Delete/Backspace** - Delete selected territories

#### Scroll Prevention
```typescript
// Prevents page scrolling when over canvas
useEffect(() => {
  const preventScroll = (e: WheelEvent) => {
    e.preventDefault()
    return false
  }
  
  canvasElement.addEventListener('wheel', preventScroll, { passive: false })
}, [])
```

### 6. Coordinate Systems

#### Three Coordinate Systems
1. **Screen coordinates** - Mouse position relative to browser window
2. **SVG coordinates** - Position within the SVG viewport
3. **Grid coordinates** - Snapped positions aligned to grid

#### Transformation Logic
```typescript
// Screen to SVG transformation
const rect = svgElement.getBoundingClientRect()
const svgX = store.view.pan.x + ((clientX - rect.left) / rect.width) * viewBoxWidth
const svgY = store.view.pan.y + ((clientY - rect.top) / rect.height) * viewBoxHeight

// Grid snapping
const gridX = Math.round(svgX / gridSize) * gridSize
const gridY = Math.round(svgY / gridSize) * gridSize
```

## State Structure

### Map Data
```typescript
interface GameMap {
  version: string
  metadata: {
    name: string
    author: string
    created: string
  }
  territories: Record<string, Territory>
  borders: Record<string, Border>
  continents: Record<string, Continent>
}
```

### Territory Structure
```typescript
interface Territory {
  id: string
  name: string
  continent: string
  center: Point
  fillPath: string        // SVG path for territory shape
  borderSegments: string[] // Border IDs that form territory boundary
}
```

### View State
```typescript
interface ViewState {
  zoom: number           // 0.1 to 5.0
  pan: Point            // Current pan offset
  showGrid: boolean     // Grid visibility
  gridSize: number      // Grid spacing in pixels
}
```

## User Interface

### Layout
- **Left sidebar** (256px) - Tools and properties
- **Main canvas** - Full remaining width
- **Top toolbar** - Import/Export buttons

### Canvas Overlays
- **Position display** - Bottom-left coordinate readout
- **Zoom display** - Bottom-right zoom percentage
- **Center button** - Reset view to origin

### Tool Palette
- **Tool buttons** - Visual tool selection with icons
- **Keyboard shortcuts** - Displayed on hover
- **Grid controls** - Toggle and size adjustment
- **Drawing options** - Snap-to-grid when drawing

### Properties Panel
- **Territory selection** - Shows selected territory count
- **Property editing** - Name and continent assignment
- **Multi-selection** - Bulk operations support

## Performance Optimizations

### Grid Rendering
- **Viewport culling** - Only renders visible grid lines
- **Extended padding** - Smooth panning without re-render
- **Efficient loops** - Minimal DOM elements created

### Event Optimization
- **Memoized callbacks** - useCallback for event handlers
- **Pointer capture** - Efficient drag handling
- **Passive prevention** - Controlled scroll prevention

### State Updates
- **Immutable patterns** - Zustand best practices
- **Minimal re-renders** - Targeted state updates
- **Efficient selections** - Set-based territory selection

## Browser Compatibility

### Event Support
- **Pointer Events** - Modern pointer event API
- **Wheel Events** - Mouse wheel with preventDefault
- **Keyboard Events** - Global keyboard shortcuts

### SVG Features
- **ViewBox manipulation** - Dynamic viewport control
- **Path rendering** - Complex territory shapes
- **Coordinate transformations** - Accurate mouse tracking

## Development Guidelines

### Adding New Tools
1. Add tool type to `ToolType` union
2. Implement tool logic in `MapCanvas` event handlers
3. Add tool to `ToolPalette` tools array
4. Add keyboard shortcut handling

### Extending Drawing
1. Modify `DrawingState` interface for new features
2. Update drawing actions in `useMapEditor`
3. Add visual feedback in `MapCanvas` render

### Performance Considerations
- Use `useCallback` for event handlers
- Minimize state updates during drag operations
- Implement viewport culling for large datasets
- Consider virtualization for 1000+ territories

## Known Issues & Limitations

### Current Limitations
- No border editing implementation
- No sea route connections
- No undo/redo system
- No file import/export functionality
- No territory validation (overlaps, gaps)

### Browser Specific
- **Safari** - Pointer events may need polyfill for older versions
- **Mobile** - Touch gestures not fully optimized
- **Firefox** - Minor SVG rendering differences

## Future Enhancements (Phase 2+)

### Planned Features
- **Border editing** - Modify territory boundaries
- **Sea routes** - Connect non-adjacent territories
- **Import/Export** - JSON and image format support
- **Undo/Redo** - Command pattern implementation
- **Validation** - Territory overlap detection
- **Templates** - Pre-built map layouts
- **Collaboration** - Real-time multi-user editing

### Performance Improvements
- **Virtualization** - Handle 1000+ territories
- **WebGL rendering** - GPU-accelerated graphics
- **Web Workers** - Background processing
- **Incremental saves** - Auto-save functionality

## Testing Strategy

### Unit Tests
- State management logic
- Coordinate transformations
- Drawing algorithms
- Event handling

### Integration Tests
- Tool interactions
- Pan/zoom behavior
- Drawing workflows
- Keyboard shortcuts

### E2E Tests
- Complete territory creation
- Multi-territory operations
- Import/export workflows
- Performance benchmarks

---

*Last updated: 2025-06-28*
*Version: Phase 1 Complete*