# Z-Order Hit Detection Documentation

## Issue Summary

We encountered a critical bug where hit detection for territories was partially inverted. When clicking on overlapping territories, the system would sometimes select or act upon the wrong territory - often selecting the bottom-most territory instead of the top-most visible one.

## Root Cause

The issue stemmed from a mismatch between rendering order and hit detection order:

1. **Rendering Order**: Territories are rendered sorted by `zIndex` in ascending order
   ```typescript
   Object.values(store.map.territories)
     .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
     .map(territory => ...)
   ```
   This means territories with higher zIndex values are rendered last (on top).

2. **Hit Detection (Broken)**: Was only reversing the unsorted array
   ```typescript
   // WRONG - doesn't respect zIndex ordering
   Object.values(store.map.territories).reverse().find(...)
   ```

3. **Hit Detection (Fixed)**: Now sorts by zIndex first, then reverses
   ```typescript
   // CORRECT - matches visual stacking order
   Object.values(store.map.territories)
     .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
     .reverse()
     .find(...)
   ```

## The Fix

We updated all hit detection locations in `MapCanvas.tsx` to:
1. First sort territories by zIndex (ascending)
2. Then reverse the array to check from highest to lowest
3. This ensures hit detection matches the visual stacking order exactly

### Fixed Locations:
- Line ~330: Right-click context menu hit detection
- Line ~446: Left-click selection hit detection

## Critical Rules for Future Development

### 1. Always Match Rendering and Hit Detection Order
```typescript
// Rendering (bottom to top)
territories.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

// Hit detection (top to bottom)
territories
  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
  .reverse()
```

### 2. Use Consistent Z-Index Defaults
Always use `(territory.zIndex || 0)` to handle undefined zIndex values consistently.

### 3. Test Overlapping Territories
When modifying hit detection or rendering code, always test with:
- Multiple overlapping territories
- Different z-order configurations
- Both left-click and right-click actions
- Context menu operations on stacked territories

### 4. Consider Performance
Sorting arrays repeatedly can be expensive. For future optimizations:
- Consider caching sorted territory arrays
- Update cache only when territories are added/removed or zIndex changes
- Use the cached sorted array for both rendering and hit detection

### 5. Document Z-Order Behavior
Any new interactive features should clearly document:
- How they handle overlapping territories
- Whether they act on single or multiple territories
- Which territory is selected when multiple overlap

## Example Test Case

To verify z-order hit detection is working correctly:

1. Create three overlapping triangles at the same position
2. Set their zIndex values: Triangle A = 0, Triangle B = 1, Triangle C = 2
3. Click on the overlapping area - Triangle C should be selected
4. Right-click on the same area - context menu should act on Triangle C
5. Send Triangle C to back - now Triangle B should be on top
6. Verify all clicks now select/act on Triangle B

## Code Pattern Reference

```typescript
// ALWAYS use this pattern for hit detection on territories:
const clickedTerritory = Object.values(store.map.territories)
  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))  // Sort by z-order
  .reverse()                                           // Check top-most first
  .find(territory => isPointInTerritory(point, territory))

// NEVER do this:
const clickedTerritory = Object.values(store.map.territories)
  .reverse()  // Wrong! Doesn't respect z-order
  .find(territory => isPointInTerritory(point, territory))
```

## Related Files
- `/app/map-editor/components/canvas/MapCanvas.tsx` - Main canvas with hit detection
- `/app/map-editor/hooks/useMapEditor.ts` - Z-order management actions
- `/lib/lms/optimized-map-data.ts` - Territory interface with zIndex property