# Map Editor Module

## Purpose
Visual editor for creating territory-based maps with optimized border system.

## Key Context
- Maps use separate border elements (each border rendered once)
- Territories are fills only, borders are separate entities
- Real-time validation ensures data integrity
- Export format matches `lib/lms/optimized-map-data.ts`

## Architecture
- SVG-based canvas for precise vector editing
- State managed by Zustand (lightweight, TypeScript-friendly)
- Validation runs in Web Worker for performance
- All geometry operations use integer coordinates for precision

## Critical Rules
1. **NEVER** create overlapping borders - each edge shared by exactly 2 territories
2. **ALWAYS** validate before export - invalid maps break gameplay
3. **Sea routes** are decorative only - don't affect edge validation
4. Borders must lie on actual territory edges (5px tolerance)

## File Structure
```
map-editor/
├── components/     # React components
├── hooks/         # Editor state and logic
├── lib/           # Geometry and validation
└── page.tsx       # Main editor page
```

## Development Workflow
1. Check existing map format in `lib/lms/optimized-map-data.ts`
2. Use validation from `lib/lms/map-validation.ts`
3. Test with sample maps before implementing new features
4. Performance target: 60fps with 100+ territories

## Common Tasks
- Adding tool: Create in `components/tools/`, register in `ToolPalette.tsx`
- New validation: Extend `lib/lms/map-validation.ts`, add UI in `ValidationPanel.tsx`
- Export format: Modify `lib/export/formats.ts`, maintain backward compatibility