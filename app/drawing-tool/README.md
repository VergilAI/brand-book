# Drawing Tool

A professional bezier-based vector drawing tool built with React and TypeScript. Create smooth shapes with industry-standard bezier curve controls.

## Features

### 🎨 Advanced Drawing
- **Unified Bezier System** - Every shape supports bezier curves
- **Click for straight lines** - Simple click to place vertices
- **Click + Drag for curves** - Drag to create smooth bezier curves
- **Live preview** - See your shape form in real-time
- **Snap to grid** - Precise alignment when enabled

### ✏️ Professional Editing
- **Double-click to edit** - Enter vertex editing mode
- **Vertex manipulation** - Drag vertices to reshape
- **Bezier control handles** - Adjust curve strength and direction
- **Add vertices** - Click on edges to insert new points
- **Delete vertices** - Select and delete with Delete/Backspace
- **Convert vertex types** - Press SPACE to toggle between straight and curved

### 🎯 Selection & Movement
- **Click to select** - Single shapes
- **Ctrl/Cmd+click** - Multi-select shapes
- **Area selection** - Drag to select multiple shapes
- **Drag to move** - Move selected shapes together
- **Visual feedback** - Clear selection states

### 🛠️ Tools
- **Select (V)** - Select and manipulate shapes
- **Move/Pan (H)** - Navigate the canvas
- **Draw (P)** - Create new shapes

### 🎨 Shape Properties
- **Fill color** - Customizable fill
- **Stroke color** - Border color
- **Stroke width** - Border thickness
- **Opacity** - Transparency control
- **Shape naming** - Organize your shapes

## Keyboard Shortcuts

### General
- **V** - Select tool
- **P** - Pen/draw tool  
- **H** - Move/pan tool
- **G** - Toggle grid
- **ESC** - Cancel current operation
- **Enter** - Finish drawing/editing
- **Delete/Backspace** - Delete selected items

### Editing Mode
- **SPACE** - Toggle selected vertices between straight/bezier
- **Delete** - Delete selected vertices
- **Click edge** - Add new vertex
- **ESC** - Exit without saving
- **Enter** - Save changes and exit

### Navigation
- **Mouse wheel** - Zoom in/out
- **Shift + drag** - Pan while using other tools
- **Middle mouse** - Pan

## Technical Details

### Architecture
- **State Management**: Zustand for centralized state
- **Rendering**: SVG for resolution-independent graphics
- **Coordinate System**: Three-tier (screen, SVG, grid)
- **Path Generation**: Cubic bezier curves with fallback

### File Structure
```
drawing-tool/
├── components/
│   ├── canvas/
│   │   ├── DrawingCanvas.tsx    # Main drawing surface
│   │   └── GridOverlay.tsx      # Dynamic grid
│   ├── tools/
│   │   └── ToolPalette.tsx      # Tool selection
│   └── panels/
│       └── PropertiesPanel.tsx  # Shape properties
├── hooks/
│   ├── useDrawingTool.ts        # Main state store
│   └── usePointerPosition.ts    # Coordinate tracking
├── types/
│   └── drawing.ts               # TypeScript definitions
└── page.tsx                     # Main page layout
```

### Performance Features
- Dynamic grid rendering (only visible lines)
- Efficient path updates during editing
- Zoom-aware interaction areas
- Minimal re-renders with targeted updates

## Future Enhancements
- Export to SVG/PNG
- Import SVG files
- Layers system
- Path operations (union, intersection, etc.)
- Text tool
- Gradient fills
- Shadow/blur effects
- Undo/redo system
- Copy/paste shapes
- Align/distribute tools

## Usage

Navigate to `/drawing-tool` to start creating. The tool provides a professional vector drawing experience similar to industry-standard software like Adobe Illustrator or Figma, but simplified for quick shape creation.