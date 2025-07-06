# Map Editor Libraries

## Geometry Module (`/geometry`)

### pathOperations.ts
SVG path manipulation using parsed path data.
- Parse paths to segments: `M`, `L`, `Q`, `C`, `Z`
- Point-on-path detection with tolerance
- Path intersection using Bentley-Ottmann
- Simplification via Douglas-Peucker (ε = 2px default)

### borderDetection.ts
Automatic border detection between territories.
```typescript
// Algorithm:
// 1. Find all intersections between territory paths
// 2. Split paths at intersection points
// 3. For each segment, check if it's shared by exactly 2 territories
// 4. Create border if shared, otherwise it's a coast
```

### snapGrid.ts
Grid snapping logic with sub-pixel precision.
- Snap to nearest grid point if within tolerance (5px)
- Visual indicators for active snap points
- Configurable grid size (default 10px)

## Validation Module (`/validation`)

### realtimeValidator.ts
Wraps core validation for editor use.
- Debounced validation (200ms after last change)
- Visual error mapping (which element has which error)
- Runs in Web Worker to prevent UI blocking

## Export Module (`/export`)

### optimizer.ts
Pre-export optimization steps:
1. Simplify paths (remove redundant points)
2. Normalize coordinate precision (round to integers)
3. Remove duplicate borders
4. Sort for consistent output

### formats.ts
Export format handlers:
- **JSON**: Optimized game format
- **SVG**: Editable vector format
- **PNG**: Preview image via canvas

## Critical Algorithms

### Shared Edge Detection
```typescript
// Two paths share an edge if they have a sequence of points
// that match (within tolerance) in reverse order
function findSharedEdge(path1: Point[], path2: Point[]): Edge | null
```

### Point-in-Polygon
Using ray casting for territory hit testing.
Integer arithmetic for numerical stability.