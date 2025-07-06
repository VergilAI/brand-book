# Hierarchical Grid Implementation

## Overview

A Canvas 2D-based hierarchical grid system has been implemented for the map editor, replacing the previous SVG-based grid. This provides smooth zooming with always exactly 4 grid levels visible and a 4×4 subdivision pattern.

## Key Components

### 1. HierarchicalGrid Component (`components/canvas/HierarchicalGrid.tsx`)

- Canvas-based rendering for performance
- Always shows exactly 4 grid levels
- Each level is 4× the spacing of the finer level
- Automatic opacity fading based on zoom level
- Support for both line and dot grid types

### 2. Smooth Zoom Controller (`hooks/useSmoothZoomController.ts`)

- Enhanced zoom control with momentum
- Smooth transitions between zoom levels
- Support for wheel zoom and pinch gestures
- Optional snap-to-levels functionality
- Zoom-to-cursor positioning

### 3. Integration with MapCanvas

The MapCanvas component has been updated to:
- Use the Canvas-based hierarchical grid
- Implement smooth zoom with momentum
- Show real-time zoom information
- Support grid type switching (lines/dots) with Shift+G

## Features

### Grid Behavior
- **4 Levels Always Visible**: The grid maintains exactly 4 levels of detail at all zoom levels
- **4×4 Subdivision**: Each grid cell subdivides into 4×4 smaller cells
- **Smart Spacing**: Grid spacing adjusts based on powers of 4 to maintain consistency
- **Opacity Fading**: Finer grid levels fade out as you zoom out

### Zoom Features
- **Smooth Transitions**: Zoom changes animate smoothly
- **Momentum**: Scroll gestures include momentum for natural feel
- **Zoom to Cursor**: Zooming centers on the cursor position
- **Level Snapping**: Optional snapping to predefined zoom levels (0.25, 0.5, 1, 2, 4)

### Performance
- Canvas 2D rendering is more performant than SVG for grid rendering
- Animation frame-based updates for smooth 60fps rendering
- Efficient grid line calculation only renders visible lines

## Usage

### Keyboard Shortcuts
- `Ctrl/Cmd + Scroll`: Zoom in/out
- `Shift + G`: Toggle between line and dot grid
- `G`: Toggle grid visibility

### Configuration

The grid spacing is calculated using:
```javascript
function calculateGridSpacing(zoom) {
  const baseSpacing = 50;
  const idealSpacing = baseSpacing / zoom;
  const log4 = Math.log(idealSpacing) / Math.log(4);
  const roundedLog4 = Math.round(log4);
  return Math.pow(4, roundedLog4);
}
```

### Customization

The smooth zoom controller can be configured:
```javascript
{
  minZoom: 0.1,
  maxZoom: 5,
  zoomSpeed: 0.001,
  smoothingFactor: 0.15,
  momentumFriction: 0.92,
  snapToLevels: [0.25, 0.5, 1, 2, 4]
}
```

## Demo

A standalone demo is available at `/app/map-editor/demo-hierarchical-grid.html` showing the grid behavior in isolation.

## Future Enhancements

- Grid alignment indicators
- Customizable grid colors
- Additional grid patterns (isometric, hexagonal)
- Grid density presets