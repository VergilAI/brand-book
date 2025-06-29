# Map Editor Module

## Purpose
Visual editor for creating territory-based maps with optimized border system.

## Recent Updates (December 2024)
- Professional snapping system v2.0 with visual feedback
- Fixed grid snapping override issues (grid OFF by default)
- Template shape library with 80+ shapes (Basic, Arrows, UML, Flowchart)
- Copy/paste and duplication system with Alt-drag support
- Removed "Edit Borders" tool - functionality integrated into vertex editing
- Draw tool shortcut changed from P to D
- UI consistency improvements with design system buttons
- Snap indicator moved to bottom center
- **NEW**: Advanced hierarchical grid system with debug panel
  - 4×4 fractal subdivisions with configurable levels
  - Base size 10px matching snap grid for perfect alignment
  - Configurable opacity curves (linear, sigmoid, exponential, step)
  - Debug panel for real-time grid customization
  - Smart level limiting to reduce visual noise
  - Toggle with G key, Shift+G for grid type (lines/dots)
- **NEW**: Comprehensive debug panel (development mode)
  - Real-time grid configuration
  - Opacity curve selection and tuning
  - View settings and state monitoring
  - Scrollable with isolated events
- **NEW**: Improved gesture detection
  - Better trackpad pinch vs pan distinction
  - Gesture consistency for smooth transitions
  - Fixed scroll isolation for panels

## Key Context
- Maps use separate border elements (each border rendered once)
- Territories are fills only, borders are separate entities
- Real-time validation ensures data integrity
- Export format matches `lib/lms/optimized-map-data.ts`
- Coordinates now use floating-point precision (no forced rounding)

## Architecture
- SVG-based canvas for precise vector editing
- State managed by Zustand (lightweight, TypeScript-friendly)
- Validation runs in Web Worker for performance
- Coordinates use floating-point for precise positioning

## Critical Rules
1. **NEVER** create overlapping borders - each edge shared by exactly 2 territories
2. **ALWAYS** validate before export - invalid maps break gameplay
3. **Sea routes** are decorative only - don't affect edge validation
4. Borders must lie on actual territory edges (5px tolerance)

## File Structure
```
map-editor/
├── components/     # React components
│   ├── canvas/     # MapCanvas, HierarchicalGrid, SnapIndicators
│   ├── tools/      # ToolPalette, Toolbar
│   ├── panels/     # PropertiesPanel, TerritoryTablePanel
│   ├── debug/      # DebugPanel
│   ├── template-library/  # Shape library components
│   └── shapes/     # Shape definitions and generators
├── hooks/         # Editor state and logic
├── types/         # TypeScript definitions
├── lib/           # Geometry and validation
├── docs/          # Documentation
│   ├── zoom-pan-grid-system.md
│   ├── debug-panel-system.md
│   ├── snapping-system.md
│   └── template-library.md
└── page.tsx       # Main editor page
```

## Development Workflow
1. Check existing map format in `lib/lms/optimized-map-data.ts`
2. Use validation from `lib/lms/map-validation.ts`
3. Test with sample maps before implementing new features
4. Performance target: 60fps with 100+ territories

## Common Tasks
- Adding tool: Create in `components/tools/`, register in `ToolPalette.tsx` (ToolType = 'select' | 'pen' | 'connect' | 'move')
- New validation: Extend `lib/lms/map-validation.ts`, add UI in `ValidationPanel.tsx`
- Export format: Modify `lib/export/formats.ts`, maintain backward compatibility
- Keyboard shortcuts: Update handleKeyDown in `MapCanvas.tsx`
- Adding shapes: Create in `components/shapes/definitions/`, import in `ShapeLibrary.ts`
- Template features: All in `components/template-library/` and `types/template-library.ts`
- Grid customization: Use DebugPanel in development or modify `HierarchicalGrid.tsx` defaults
- Debug features: Add to `components/debug/DebugPanel.tsx`

## New Features (December 2024)

### Template Shape Library
- **Location**: `components/template-library/` and `components/shapes/`
- **80+ shapes**: Basic, Arrows, UML, Flowchart categories
- **Usage**: L key toggles panel, click shape to place
- **Integration**: Full snapping support, becomes editable territory

### Copy/Paste System
- **Standard**: Ctrl/Cmd+C/V for copy/paste
- **Quick duplicate**: Ctrl/Cmd+D
- **Alt-drag**: Hold Alt while dragging to duplicate
- **Implementation**: In `useMapEditor.ts` clipboard state and actions

### Hierarchical Grid System
- **Base size**: 10px (matches snap grid)
- **Subdivision**: 4×4 fractal pattern
- **Levels**: Configurable 1-6 (default 2)
- **Opacity**: 0.18 default with curves
- **Canvas rendering**: Separate layer for performance
- **Debug panel**: Real-time configuration

### Debug Panel
- **Access**: Development mode or `NEXT_PUBLIC_DEBUG_MODE=true`
- **Location**: Top-left corner, collapsible
- **Features**: Grid config, opacity curves, view settings
- **Scroll**: Isolated from canvas with custom implementation