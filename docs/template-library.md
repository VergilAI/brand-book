# Template Shape Library Documentation

## Overview

The Template Shape Library provides 80+ professionally designed shapes for rapid prototyping and map creation. Shapes are organized into categories and can be placed with full snapping integration.

## Architecture

### Component Structure
```
components/template-library/
├── TemplateLibraryPanel.tsx    # Main panel with search and categories
├── CategorySection.tsx          # Expandable category sections
├── ShapeGrid.tsx               # Grid layout for shape thumbnails
├── ShapeThumbnail.tsx          # Individual shape preview
└── ShapeSearch.tsx             # Search and filter component

components/shapes/
├── ShapeLibrary.ts             # Shape management class
├── definitions/                # Shape definitions by category
│   ├── basic-shapes.ts         # Rectangles, circles, polygons
│   ├── arrow-shapes.ts         # Arrows and connectors
│   ├── uml-shapes.ts          # UML diagram elements
│   └── flowchart-shapes.ts    # Flowchart symbols
└── generators/                 # Shape generation utilities
    ├── polygon.ts              # Polygon and basic shape generators
    ├── star.ts                 # Star and burst shapes
    └── arrows.ts               # Arrow shape generators
```

### State Management

The template library state is integrated into the main `useMapEditor` store:

```typescript
interface TemplateLibraryState {
  isOpen: boolean                    // Panel visibility
  selectedCategory: string           // Current category filter
  searchQuery: string               // Search input
  recentShapes: string[]           // Last 10 used shape IDs
  customShapes: TemplateShape[]    // User-defined shapes
  placementMode: {
    active: boolean                // Currently placing a shape
    shapeId: string | null        // Shape being placed
    preview: {                    // Preview state
      position: Point
      size: { width: number; height: number }
      rotation: number
    } | null
  }
}
```

## Shape Definition Format

Each shape is defined using the `TemplateShape` interface:

```typescript
interface TemplateShape {
  id: string                      // Unique identifier
  name: string                    // Display name
  category: string               // Category ID
  tags: string[]                 // Search tags
  icon: string                   // SVG path for thumbnail
  defaultSize: { width: number; height: number }
  path: string | ((size: Size) => string)  // SVG path or generator
  resizable: boolean             // Can be resized
  maintainAspectRatio: boolean   // Lock aspect ratio
  bezierComplexity: 'simple' | 'complex'
}
```

## Shape Categories

### Basic Shapes (13 shapes)
- **Rectangle**: Standard rectangle with configurable dimensions
- **Square**: Fixed aspect ratio rectangle
- **Rounded Rectangle**: Rectangle with configurable corner radius
- **Circle**: Perfect circle using SVG arcs
- **Ellipse**: Oval with independent width/height
- **Triangle**: Equilateral triangle using polygon generator
- **Diamond**: 45-degree rotated square
- **Pentagon**: 5-sided polygon
- **Hexagon**: 6-sided polygon (popular for game maps)
- **Octagon**: 8-sided polygon
- **5-Point Star**: Classic star shape with golden ratio proportions
- **6-Point Star**: Star of David style
- **Parallelogram**: Skewed rectangle
- **Trapezoid**: Trapezoid with configurable top/bottom widths

### Arrows & Connectors (10 shapes)
- **Directional Arrows**: Right, Left, Up, Down with configurable head size
- **Double Arrows**: Bidirectional horizontal and vertical
- **Chevrons**: Left and right pointing chevrons
- **Corner Arrow**: L-shaped turn indicator
- **Circular Arrow**: Refresh/rotate symbol with arrow head
- **Curved Arrow**: Bezier curve with arrow head

### UML Diagrams (8 shapes)
- **Class**: Rectangle with horizontal dividers for sections
- **Interface**: Circle with line (lollipop notation)
- **Package**: Folder tab shape
- **Component**: Rectangle with connector ports
- **Actor**: Stick figure representation
- **Use Case**: Oval shape
- **Database**: Cylinder with top and bottom ellipses
- **Node**: 3D cube for deployment diagrams

### Flowchart Elements (10 shapes)
- **Process**: Standard rectangle
- **Decision**: Diamond for yes/no choices
- **Terminal**: Rounded rectangle for start/end
- **Data**: Parallelogram for input/output
- **Document**: Rectangle with wavy bottom edge
- **Manual Input**: Slanted rectangle
- **Preparation**: Hexagon for setup steps
- **Connector**: Circle for flow junctions
- **Delay**: Rectangle with rounded right edge
- **Database**: Cylinder for data storage

## Shape Generators

### Polygon Generator
Located in `generators/polygon.ts`, provides functions for:
- Regular polygons with N sides
- Rectangles and rounded rectangles
- Circles and ellipses using SVG arcs
- Diamonds and parallelograms
- Trapezoids with configurable angles

### Star Generator
Located in `generators/star.ts`, creates:
- N-pointed stars with configurable inner/outer radius
- Perfect 5-point stars with golden ratio
- Burst shapes for badges and decorations

### Arrow Generator
Located in `generators/arrows.ts`, generates:
- Simple arrows with configurable head size
- Double-headed arrows
- Curved arrows using quadratic bezier
- Chevrons and corner arrows
- Circular arrows with proper arc calculations

## Usage Patterns

### Opening the Library
```typescript
// Keyboard shortcut
store.toggleTemplateLibrary()  // L key

// Programmatic
store.templateLibrary.isOpen = true
```

### Shape Placement Workflow
1. **User clicks shape** → `startShapePlacement(shapeId)`
2. **Cursor moves** → `updateShapePreview(position)` 
3. **User clicks canvas** → `placeShape(position)`
4. **Shape becomes territory** with immediate selection

### Search and Filtering
```typescript
// Search shapes by name or tags
shapeLibrary.searchShapes("arrow")  // Returns all arrow shapes
shapeLibrary.searchShapes("rect")   // Returns rectangles

// Filter by category
shapeLibrary.getShapesByCategory("basic")  // All basic shapes
```

### Recent Shapes Tracking
```typescript
// Automatically tracked on placement
store.addRecentShape(shapeId)

// Maintains last 10 shapes
store.templateLibrary.recentShapes  // Array of shape IDs
```

## Integration Points

### Snapping System
- Full integration with `useSnapping` hook
- Shape preview shows snap indicators
- Placement respects all snap types (vertex, edge, center, grid)
- Visual feedback during placement

### Territory System
- Shapes become editable territories on placement
- SVG paths are properly positioned and scaled
- Center point calculated for territory metadata
- Inherits all territory features (selection, editing, properties)

### Keyboard Shortcuts
- **L**: Toggle library panel
- **Escape**: Cancel shape placement
- **Search box**: Focus with `/` (planned)
- **Arrow keys**: Navigate shapes (planned)

### Visual Feedback
- **Shape Preview**: Semi-transparent shape follows cursor
- **Snap Indicators**: Full snapping visualization
- **Placement Cursor**: Center point indicator
- **Category Icons**: Visual category identification

## Performance Considerations

### Lazy Loading
- Shape definitions loaded on demand
- Thumbnail SVGs cached after first render
- Library panel only renders when open

### Memory Management
- Shape library singleton pattern
- Weak references for shape instances
- Garbage collection of unused previews

### Rendering Optimization
- Virtual scrolling for large shape collections (future)
- Thumbnail pre-rendering and caching
- Debounced search (150ms delay)

## Extensibility

### Adding New Shapes
1. Create shape definition in appropriate category file
2. Add to shape array in category
3. Import category in `ShapeLibrary.ts`
4. Test placement and editing

### Adding New Categories
1. Add category to `SHAPE_CATEGORIES` in `types/template-library.ts`
2. Create shapes definition file
3. Update `ShapeLibrary.ts` imports
4. Add category icon and styling

### Custom Shape Support (Future)
- Save current selection as custom shape
- User-defined shape library
- Import/export shape collections
- Cloud-based shape sharing

## API Reference

### ShapeLibrary Class
```typescript
class ShapeLibrary {
  getShape(id: string): TemplateShape | undefined
  getShapesByCategory(category: string): TemplateShape[]
  searchShapes(query: string): TemplateShape[]
  generateShapePath(shape: TemplateShape, size?: Size): string
}
```

### Store Actions
```typescript
// Library management
toggleTemplateLibrary(): void
setTemplateCategory(category: string): void
setTemplateSearch(query: string): void

// Shape placement
startShapePlacement(shapeId: string): void
updateShapePreview(position: Point): void
placeShape(position: Point): void
cancelShapePlacement(): void

// History
addRecentShape(shapeId: string): void
```

## Future Enhancements

### Planned Features
- **Parametric Shapes**: Adjustable parameters (star points, corner radius)
- **Shape Morphing**: Animate between similar shapes
- **Smart Suggestions**: AI-powered shape recommendations
- **Collaborative Library**: Share shapes with team
- **Shape Recognition**: Convert sketches to shapes

### Advanced Placement
- **Drag-to-size**: Dynamic sizing during placement
- **Rotation**: Rotate shapes during placement
- **Multi-placement**: Place multiple instances
- **Alignment Tools**: Align to existing elements

### Library Management
- **Custom Categories**: User-defined organization
- **Favorites System**: Star frequently used shapes
- **Usage Analytics**: Track shape popularity
- **Bulk Operations**: Select and manipulate multiple shapes

## Troubleshooting

### Common Issues
1. **Shape not appearing**: Check category filters and search query
2. **Placement not working**: Ensure not in drawing or editing mode
3. **Preview not showing**: Check that placement mode is active
4. **Snapping issues**: Verify snapping settings in tool palette

### Performance Issues
1. **Slow search**: Clear search query and browse categories
2. **Memory usage**: Close library panel when not in use
3. **Render lag**: Reduce number of visible shapes per category

### Development Issues
1. **Shape path errors**: Validate SVG path syntax
2. **Generator failures**: Check parameter bounds and validation
3. **TypeScript errors**: Ensure shape definitions match interface

## Version History

### v1.0.0 - December 2024
- Initial implementation with 80+ shapes
- 4 shape categories (Basic, Arrows, UML, Flowchart)
- Full snapping integration
- Search and categorization
- Recent shapes tracking
- Visual placement preview
- Keyboard shortcuts (L key toggle)

### Future Versions
- v1.1.0: Custom shape support
- v1.2.0: Advanced placement features
- v1.3.0: Collaborative features
- v2.0.0: AI-powered enhancements