# Debug Panel System Documentation

## Overview

The map editor includes a sophisticated debug panel that provides real-time control over the hierarchical grid system and various editor settings. This panel is only visible in development mode or when the `NEXT_PUBLIC_DEBUG_MODE` environment variable is set to `true`.

## Features

### Grid Configuration

The debug panel allows fine-tuning of the hierarchical grid system with the following controls:

1. **Base Reference Size** (Default: 10px)
   - The fundamental grid unit size
   - Range: 10-200px
   - Aligns with the snap grid for consistent snapping

2. **Subdivision Factor** (Default: 4)
   - Determines the grid hierarchy (4×4 subdivisions)
   - Range: 2-10
   - Each level is this factor times the previous level

3. **Visible Levels** (Default: 2)
   - Number of grid levels to consider
   - Range: 1-6
   - Fewer levels reduce visual noise

4. **Stroke Opacity** (Default: 0.18)
   - Overall grid line opacity
   - Range: 0-1
   - Includes slider for fine control

5. **Min Render Opacity** (Default: 0.01)
   - Threshold below which grid lines aren't rendered
   - Range: 0-0.1
   - Improves performance by culling faint lines

6. **Grid Color** (Default: #94A3B8)
   - Color picker and hex input
   - Applies to all grid lines

### Advanced Grid Controls

7. **Min Level** (Default: 0)
   - Prevents grids smaller than reference size
   - Range: -2 to 2
   - Level 0 = reference size, positive = larger grids only

8. **Opacity Curve** (Default: sigmoid)
   - Controls how grid opacity transitions:
     - **Linear**: Original linear fade
     - **S-Curve (Sigmoid)**: Smooth transitions with slow start/end
     - **Exponential**: Fast drop-off for secondary grids
     - **Step Function**: Discrete opacity levels

9. **Curve Steepness** (Default: 4)
   - Controls transition sharpness for sigmoid curve
   - Range: 1-10
   - Higher values create sharper transitions

10. **Max Visible Grids** (Default: 3)
    - Hard limit on simultaneous grid levels
    - Range: 1-5
    - Reduces noise at transition points

### View Settings

- **Show Grid**: Toggle grid visibility
- **Show Snap Points**: Debug visualization showing red dots at snap points
- **Snap Grid Size**: Size of the invisible snapping grid (default: 10px)
- **Grid Snapping**: Toggle whether shapes snap to grid

### Current State Display

Real-time information about:
- Current zoom level
- Pan position (x, y)
- Active tool
- Number of territories
- Number of selected territories

## Implementation Details

### Location
- Component: `/app/map-editor/components/debug/DebugPanel.tsx`
- Styles: `/app/map-editor/components/panels/ScrollablePanel.module.css`

### Key Features

1. **Collapsible Design**
   - Click header to expand/collapse
   - Preserves screen space when not in use

2. **Scrollable Content**
   - Uses custom scrollbar styling
   - Isolated scroll events from canvas
   - Maximum height of 70vh

3. **Real-time Updates**
   - Changes apply immediately
   - Grid re-renders on configuration change
   - No page reload required

4. **Reset Functionality**
   - Single button to restore all defaults
   - Helps recover from experimental settings

### Configuration Storage

Debug settings are stored in `window.__GRID_DEBUG_CONFIG` and checked by the HierarchicalGrid component on each render. This allows hot-reloading of grid settings without React state management overhead.

## Usage

### Enabling the Debug Panel

1. **Development Mode**: Automatically visible when `NODE_ENV === 'development'`
2. **Production Debug**: Set `NEXT_PUBLIC_DEBUG_MODE=true` in `.env.local`

### Common Workflows

1. **Reducing Grid Noise**
   - Set Visible Levels to 2
   - Use sigmoid opacity curve
   - Limit Max Visible Grids to 2-3
   - Increase Min Level to 0 or 1

2. **Debugging Snap Alignment**
   - Enable "Show Snap Points"
   - Ensure Base Reference Size matches Snap Grid Size
   - Red dots show exact snap positions

3. **Finding Optimal Settings**
   - Start with defaults
   - Adjust one parameter at a time
   - Use Reset button to return to baseline

### Best Practices

1. **Performance**: Higher opacity and more levels impact rendering performance
2. **Clarity**: Lower opacity (0.1-0.2) keeps grid visible but unobtrusive
3. **Alignment**: Keep reference size as a multiple of snap grid size
4. **Transitions**: Use sigmoid curve with steepness 4-6 for smooth zoom

## Technical Architecture

### Scroll Isolation

The debug panel implements sophisticated scroll isolation to prevent interference with canvas zoom/pan:

```typescript
// Native wheel event with passive: false
scrollEl.addEventListener('wheel', handleWheel, { passive: false })

// Manual scroll implementation
const handleWheel = (e: WheelEvent) => {
  e.stopPropagation()
  scrollEl.scrollTop += e.deltaY
}
```

### Grid Configuration Flow

1. User adjusts setting in debug panel
2. Configuration stored in `window.__GRID_DEBUG_CONFIG`
3. Grid toggled off/on to force re-render
4. HierarchicalGrid reads configuration
5. New settings applied to canvas

## Troubleshooting

### Panel Not Visible
- Check `NODE_ENV` or set `NEXT_PUBLIC_DEBUG_MODE=true`
- Ensure you're on the map editor page
- Look in top-left corner

### Scroll Not Working
- Panel uses custom scroll implementation
- Check browser console for errors
- Ensure content exceeds container height

### Settings Not Applying
- Check if grid is visible (G key)
- Try toggling grid off and on
- Use Reset button and reapply settings

### Performance Issues
- Reduce Visible Levels
- Lower Max Visible Grids
- Increase Min Opacity threshold
- Consider using step function for opacity