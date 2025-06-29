# Template Shape Library Implementation Plan

## Overview
Create a comprehensive template shape library for the map editor that allows users to quickly insert pre-defined shapes into their maps. The library will be organized by categories and provide both basic geometric shapes and specialized diagram elements.

## User Experience Vision

### 1. Library Panel
- **Location**: Left sidebar, below existing tools
- **Toggle**: Collapsible panel with icon button
- **Search**: Quick filter by shape name or category
- **Preview**: Visual grid of shape thumbnails
- **Categories**: Expandable sections for organization

### 2. Shape Insertion Flow
1. User opens library panel
2. Browses or searches for desired shape
3. Clicks shape to select it
4. Cursor changes to placement mode
5. Click on canvas to place shape
6. Shape is placed with snapping support
7. Automatically switches to select tool
8. Shape is selected for immediate editing

### 3. Categories Structure

#### Basic Shapes
- Rectangle
- Square
- Circle
- Ellipse
- Triangle (equilateral, right, isosceles)
- Pentagon
- Hexagon
- Octagon
- Star (5-point, 6-point, 8-point)
- Diamond
- Parallelogram
- Trapezoid

#### Arrows & Connectors
- Simple arrow (→ ← ↑ ↓)
- Double arrow (↔ ↕)
- Curved arrow
- Corner arrow (L-shaped)
- Circular arrow
- Block arrow
- Chevron

#### UML Diagrams
- Class box (with sections)
- Interface box
- Package
- Component
- Node
- Use case (oval)
- Actor (stick figure)
- Database cylinder
- Cloud shape

#### Flowchart
- Process (rectangle)
- Decision (diamond)
- Terminal (rounded rectangle)
- Data (parallelogram)
- Document
- Manual input
- Preparation (hexagon)
- Connector (circle)

#### Geographic
- Country outlines (simplified)
- Continent shapes
- Island
- Lake
- Mountain range (stylized)
- River (curved path)

#### Game-Specific
- Territory hex
- Territory square
- Castle/fortress icon
- City marker
- Port symbol
- Mountain pass
- Bridge

#### Custom/User
- Recent shapes (last 10 used)
- Saved templates
- Import from selection

## Technical Architecture

### 1. Shape Definition Format
```typescript
interface TemplateShape {
  id: string
  name: string
  category: ShapeCategory
  tags: string[]
  icon: string // SVG path for thumbnail
  defaultSize: { width: number; height: number }
  path: string | (() => string) // SVG path or generator
  anchors?: AnchorPoint[] // Connection points
  resizable: boolean
  maintainAspectRatio: boolean
  bezierComplexity: 'simple' | 'complex'
}

interface ShapeCategory {
  id: string
  name: string
  icon: string
  order: number
}
```

### 2. Component Structure
```
components/
├── template-library/
│   ├── TemplateLibraryPanel.tsx    // Main panel component
│   ├── CategorySection.tsx          // Expandable category
│   ├── ShapeGrid.tsx               // Grid of shape thumbnails
│   ├── ShapeThumbnail.tsx          // Individual shape preview
│   ├── ShapeSearch.tsx             // Search/filter component
│   └── PlacementCursor.tsx         // Custom cursor during placement
├── shapes/
│   ├── definitions/
│   │   ├── basic-shapes.ts         // Basic shape definitions
│   │   ├── uml-shapes.ts           // UML shape definitions
│   │   ├── flowchart-shapes.ts     // Flowchart definitions
│   │   └── index.ts                // Shape registry
│   ├── generators/
│   │   ├── polygon.ts              // n-sided polygon generator
│   │   ├── star.ts                 // Star shape generator
│   │   └── curved.ts               // Bezier shape helpers
│   └── ShapeLibrary.ts             // Shape management class
```

### 3. State Management
```typescript
interface TemplateLibraryState {
  isOpen: boolean
  selectedCategory: string | null
  searchQuery: string
  recentShapes: string[] // Shape IDs
  customShapes: TemplateShape[]
  placementMode: {
    active: boolean
    shapeId: string | null
    preview: {
      position: Point
      size: Size
      rotation: number
    } | null
  }
}
```

### 4. Key Features

#### Smart Placement
- Ghost preview follows cursor
- Snapping to grid/vertices/centers
- Size preview with dimensions
- Rotation with Shift+drag
- Escape to cancel placement

#### Shape Customization
- Resize on placement (drag to size)
- Quick color picker
- Stroke width adjustment
- Convert to editable path

#### Library Management
- Save custom shapes from selection
- Import/export shape collections
- Favorite shapes
- Recent shapes history
- Shape usage analytics

### 5. Implementation Phases

#### Phase 1: Core Infrastructure (2-3 days)
- Create shape definition system
- Build basic shapes (rectangle, circle, triangle)
- Implement library panel UI
- Add placement mode mechanics

#### Phase 2: Shape Collection (2-3 days)
- Implement all basic shapes
- Add UML shapes
- Create flowchart shapes
- Build shape generators

#### Phase 3: Advanced Features (2-3 days)
- Search and filtering
- Custom shape saving
- Recent shapes tracking
- Keyboard shortcuts
- Drag-to-size placement

#### Phase 4: Polish & Integration (1-2 days)
- Animation and transitions
- Tooltips and help text
- Performance optimization
- Testing and bug fixes

## User Interface Design

### Panel Layout
```
┌─────────────────────┐
│ 🔍 Search shapes... │
├─────────────────────┤
│ ▼ Basic Shapes      │
│ ┌───┐ ┌───┐ ┌───┐ │
│ │ □ │ │ ○ │ │ △ │ │
│ └───┘ └───┘ └───┘ │
│ ┌───┐ ┌───┐ ┌───┐ │
│ │ ⬟ │ │ ⬢ │ │ ★ │ │
│ └───┘ └───┘ └───┘ │
├─────────────────────┤
│ ▶ UML Diagrams      │
├─────────────────────┤
│ ▶ Flowchart         │
├─────────────────────┤
│ ▼ Recent            │
│ ┌───┐ ┌───┐       │
│ │ ◆ │ │ ▭ │       │
│ └───┘ └───┘       │
└─────────────────────┘
```

### Interaction Patterns

1. **Hover**: Show shape name tooltip
2. **Click**: Enter placement mode
3. **Drag from library**: Drag-and-drop placement
4. **Double-click**: Place at default size
5. **Right-click**: Shape options menu

## Keyboard Shortcuts

- **L** - Toggle library panel
- **/** - Focus search
- **Tab** - Navigate categories
- **Enter** - Select highlighted shape
- **Escape** - Cancel placement
- **R** - Rotate during placement
- **Shift** - Constrain proportions

## Performance Considerations

1. **Lazy Loading**: Load shape definitions on demand
2. **Thumbnail Caching**: Pre-render shape thumbnails
3. **Virtual Scrolling**: For large shape collections
4. **Search Debouncing**: 150ms delay
5. **Preview Optimization**: Use simplified paths

## Integration Points

1. **Snapping System**: Full integration with existing snapping
2. **Undo/Redo**: Each placement is undoable
3. **Copy/Paste**: Shapes can be copied
4. **Selection**: Works with multi-select
5. **Properties**: Editable via properties panel

## Future Enhancements

1. **Shape Morphing**: Animate between shapes
2. **Parametric Shapes**: Adjustable parameters (e.g., star points)
3. **Shape Combinations**: Boolean operations
4. **Cloud Library**: Share shapes online
5. **AI Suggestions**: Recommend shapes based on context
6. **Shape Recognition**: Convert drawings to shapes

## Success Metrics

- Time to place first shape < 5 seconds
- 90% of common shapes available
- Search returns results in < 100ms
- No performance impact on main editor
- Intuitive for new users

## Risks & Mitigations

1. **Risk**: Too many shapes overwhelm users
   - **Mitigation**: Progressive disclosure, good categorization

2. **Risk**: Performance impact with complex shapes
   - **Mitigation**: Simplified previews, lazy loading

3. **Risk**: Inconsistent shape quality
   - **Mitigation**: Standardized creation process

4. **Risk**: Mobile/touch compatibility
   - **Mitigation**: Design desktop-first, enhance later