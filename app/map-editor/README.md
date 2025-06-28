# Map Editor - Phase 2 Implementation

## Overview

A professional React-based territory map editor for creating and editing game maps with territory-based gameplay. The editor provides an SVG canvas with pan/zoom functionality, advanced drawing tools, professional snapping system, and a complete UI for map creation.

## Recent Updates (Phase 2)

### 🧲 Professional Snapping System
- **Magnetic alignment** with visual feedback for precise territory placement
- **Multiple snap modes**: Vertices, edges, centers, grid, and angle constraints
- **Smart guides** show alignment with other territories
- **Works everywhere**: Drawing, editing vertices, and moving territories
- See [Snapping System Documentation](/docs/snapping-system.md) for details

### ✏️ Advanced Shape Editing
- **Double-click to edit** any territory
- **Full bezier control** - Convert any vertex between straight and curved
- **Add/delete vertices** - Click edges to add, DELETE key to remove
- **Industry-standard** controls matching Illustrator/Figma

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
- **Select (V)** - Select and manipulate territories with area selection and drag-to-move
- **Move/Pan (H)** - Pan the canvas view
- **Draw Territory (P)** - Create new territories by drawing polygons
- **Edit Borders (B)** - *Future: Edit territory borders*
- **Sea Routes (C)** - *Future: Create connections between territories*

#### Tool Implementation
```typescript
export type ToolType = 'select' | 'pen' | 'border' | 'connect' | 'move'
```

### 2. Drawing System

#### Unified Bezier Drawing System
- **All territories use bezier paths** - No separate polygon/bezier modes
- **Click for straight lines** - Single click places anchor point with straight segment
- **Click + Drag for curves** - Drag to pull out bezier control handles
- **Industry-standard UX** - Same behavior as Illustrator, Figma, Sketch
- **Live preview** - See curves form as you drag handles

#### Drawing Workflow
```typescript
interface DrawingState {
  isDrawing: boolean
  bezierPath: BezierPoint[]  // All paths are bezier-ready
  previewPath: string
  snapToGrid: boolean
  showControlPoints: boolean
  isDraggingHandle: boolean
  dragStartPoint?: Point
}

interface BezierPoint extends Point {
  type: 'anchor'
  controlPoints: {
    in?: Point   // Control handle for incoming curve
    out?: Point  // Control handle for outgoing curve
  }
}
```

#### Visual Feedback
- **Preview lines** - Dashed blue lines showing current path
- **Live cursor line** - Line from last point to cursor position
- **Control handles** - Purple lines show bezier handles while dragging
- **Close indicator** - Pulsing circle when near start point for closing
- **Anchor points** - Blue circles mark each placed point
- **Cursor indicator** - Shows exact cursor position when drawing

#### Technical Implementation
- **SVG Path Generation** - Automatically generates smooth cubic bezier curves (C commands)
- **Fallback to Lines** - Points without control handles render as straight lines (L commands)
- **Path Movement** - Advanced SVG path parser correctly transforms all coordinate types
- **Hit Detection** - Robust polygon approximation for accurate selection of curved territories

### 3. Pan and Zoom System

#### Zoom Implementation
- **Mouse wheel zoom** with 8% increments (0.92/1.08 multiplier)
- **Zoom-to-cursor** - Accurate zooms toward/away from cursor position with dynamic aspect ratio
- **Zoom range** - 10% to 500% (0.1x to 5.0x)
- **Responsive zoom** - Dynamic sensitivity for precise control

#### Pan Implementation
- **Move tool** - Dedicated pan tool with grab cursor
- **Shift+drag** - Pan while using other tools
- **Middle mouse** - Universal pan gesture
- **Coordinate transformation** - Proper SVG coordinate handling

#### Mathematical Implementation
```typescript
// Dynamic aspect ratio zoom-to-cursor calculation
const svgAspectRatio = rect.width / rect.height
const baseWidth = 1000
const baseHeight = baseWidth / svgAspectRatio

const mouseInSVG = {
  x: store.view.pan.x + normalizedX * currentViewBoxWidth,
  y: store.view.pan.y + normalizedY * currentViewBoxHeight
}

const newPan = {
  x: mouseInSVG.x - normalizedX * newViewBoxWidth,
  y: mouseInSVG.y - normalizedY * newViewBoxHeight
}
```

### 4. Selection System

#### Territory Selection Features
- **Click-to-select** - Single click selects individual territories
- **Multi-select** - Ctrl/Cmd+click to add/remove from selection
- **Area selection** - Click and drag to select multiple territories with rectangle
- **Live preview** - Shows which territories will be selected during area selection
- **Canvas-bounded** - Area selection constrained to canvas boundaries

#### Territory Movement
- **Click-and-drag** - Immediately drag any territory to move (auto-selects if needed)
- **Multi-territory movement** - Move all selected territories together
- **Movement threshold** - 3px threshold prevents accidental movement during clicks
- **Selection preservation** - Multi-selection maintained during group movement

#### Hit Detection
- **Point-in-polygon** - Accurate hit detection using ray casting algorithm
- **Edge-perfect** - Works precisely at territory boundaries
- **Shape-agnostic** - Handles any polygon shape, concave or convex

#### Visual Feedback States

**Default (Unselected):**
- Fill: White (`#FFFFFF`)
- Border: Black (`#000000`, 2px)
- Hover: Light gray fill (`hover:fill-gray-50`)

**Selected:**
- Fill: White (`#FFFFFF`)
- Border: Blue (`#6366F1`, 3px)
- Hover: Light blue fill (`hover:fill-[#E0E7FF]`)

**Area Selection Preview:**
- Fill: Light gray (`#F3F4F6`)
- Border: Purple (`#8B5CF6`, 2.5px, dashed)
- Real-time highlighting during area selection

#### Area Selection Implementation
```typescript
// Live preview calculation during area selection
const minX = Math.min(areaSelectStart.current.x, areaSelectEnd.current.x)
const maxX = Math.max(areaSelectStart.current.x, areaSelectEnd.current.x)
const minY = Math.min(areaSelectStart.current.y, areaSelectEnd.current.y)
const maxY = Math.max(areaSelectStart.current.y, areaSelectEnd.current.y)

const wouldBeSelected = territory.center.x >= minX && territory.center.x <= maxX && 
                       territory.center.y >= minY && territory.center.y <= maxY
```

#### Canvas Isolation
- **User selection prevention** - Prevents text selection outside canvas
- **Event containment** - Area selection bounded to canvas area
- **Scroll prevention** - No page scrolling during canvas interactions
- **Clean cancellation** - Automatic selection cancellation when leaving canvas

### 5. Grid System

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

### 6. Event Handling

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

### 7. Coordinate Systems

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

## How to Use

### Territory Selection Workflows

**Single Territory Selection:**
1. **Select tool (V)** - Ensure selection tool is active
2. **Click territory** - Single click selects individual territory
3. **Drag to move** - Click and drag to move immediately

**Multi-Territory Selection:**
1. **Area selection** - Click and drag on empty space to draw selection rectangle
2. **Live preview** - Purple dashed borders show what will be selected
3. **Release to select** - All territories within rectangle are selected
4. **Multi-select mode** - Hold Ctrl/Cmd while area selecting to add to existing selection

**Territory Movement:**
1. **Select territories** - Use any selection method above
2. **Click and drag** - Click on any selected territory and drag to move all
3. **Selection preserved** - All selected territories remain selected after movement

### Drawing Territories

**Create New Territory:**
1. **Drawing tool (P)** - Switch to pen/drawing tool
2. **Click to start** - First click begins the territory path
3. **Add points with two methods:**
   - **Click only** - Creates straight line to new point
   - **Click and drag** - Creates curved line with bezier handles
4. **Live preview** - See the path forming in real-time:
   - Dashed blue line shows completed segments
   - Dotted line follows cursor for next segment
   - Purple handle lines appear when dragging curves
5. **Close territory** - Click near start point (pulsing circle appears) or press Enter
6. **Auto-switch** - Tool automatically switches to Select after completing territory

**Drawing Tips:**
- **Straight territories** - Just click each corner point
- **Smooth curves** - Click and drag to pull out handles
- **Mixed shapes** - Combine clicks and drags for complex territories
- **Control points** - Toggle visibility in tool palette
- **Snap to grid** - Enable for aligned territories

### Navigation and View Control

**Pan the Canvas:**
- **Move tool (H)** - Dedicated pan tool with grab cursor
- **Shift + drag** - Pan while using any other tool
- **Middle mouse button** - Universal pan gesture

**Zoom Control:**
- **Mouse wheel** - Zoom in/out with 8% increments
- **Zoom to cursor** - Zooms toward/away from cursor position precisely
- **Center button** - Reset view to origin (0,0) at 100% zoom

**Grid Management:**
- **Toggle grid (G)** - Show/hide grid overlay
- **Grid size** - Adjust spacing from 5-50 pixels in tool palette
- **Snap to grid** - Enable when drawing for aligned territories

### Keyboard Shortcuts

- **V** - Select tool (area selection, territory movement)
- **P** - Pen/draw tool (create territories)
- **H** - Move/pan tool (canvas navigation)
- **G** - Toggle grid visibility
- **Escape** - Cancel current drawing or clear selection
- **Enter** - Finish drawing territory (when drawing)
- **Delete/Backspace** - Delete selected territories

### Visual Feedback Reference

**Territory States:**
- **Default** - White fill, black border (2px)
- **Selected** - White fill, blue border (3px)
- **Hover (unselected)** - Light gray fill
- **Hover (selected)** - Light blue fill
- **Area preview** - Light gray fill, purple dashed border (2.5px)

**Drawing States:**
- **Anchor points** - Blue filled circles with white stroke
- **Control handles** - Purple filled circles when dragging
- **Handle lines** - Purple lines connecting handles to anchors
- **Path preview** - Dashed blue line for completed segments
- **Cursor line** - Dotted blue line to current cursor position

**Tool Cursors:**
- **Select** - Default arrow cursor, crosshair during area selection
- **Draw** - Crosshair with position indicator dot
- **Move** - Grab hand cursor, grabbing during pan

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
*Version: Phase 1 Complete with Advanced Selection System*
*Features: Complete territory selection, area selection with live preview, drag-to-move, accurate hit detection, zoom-to-cursor, and canvas isolation*