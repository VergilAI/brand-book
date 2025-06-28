# Map Editor Core Libraries

## Purpose
Shared libraries used by the map editor for geometry, validation, and data management.

## Critical Context
- All coordinates are integers (pixel-based)
- Borders are shared edges between exactly 2 territories  
- Validation must match game requirements exactly
- Performance is critical - these run on every edit

## Key Files

### optimized-map-data.ts
The canonical map data format. **DO NOT MODIFY** without updating:
- Game component (`components/lms/optimized-territory-map.tsx`)
- Validation (`map-validation.ts`)
- Sample data

### map-validation.ts
Validation rules that maps must pass:
- Borders lie on territory edges (5px tolerance)
- No orphan borders or territories
- All territories connected
- **Sea routes exempt from edge validation**

### Border Detection Algorithm
```typescript
// Two edges match if points align in reverse order
// Edge from A: [(10,10), (20,20)]
// Edge from B: [(20,20), (10,10)]
// These form one border
```

## Performance Requirements
- Border detection: O(n²) but <100ms for 100 territories
- Validation: <100ms for complete check
- Path operations: Immediate (<16ms)

## Common Issues
1. **Floating point errors**: Always round to integers
2. **Duplicate borders**: Check both territory combinations
3. **Edge direction**: Shared edges have opposite winding