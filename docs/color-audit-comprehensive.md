# Comprehensive Color Audit - Vergil Design System

Generated: 2025-06-30 // yehhaaa random comment



This document catalogs EVERY color found in the codebase, including:
- Colors defined in our brand book (v1 and v2)
- Colors in globals.css
- Colors in tailwind.config.js
- Locally defined colors in components
- One-off color usage

## 1. Most Used Colors (by frequency)

### Top 10 Hex Colors Found:
1. **#6366F1** (58 occurrences) - cosmic-purple (Brand v1)
2. **#3B82F6** (52 occurrences) - synaptic-blue (Brand v1)
3. **#FFFFFF** (29 occurrences) - pure white
4. **#10B981** (28 occurrences) - phosphor-cyan (Brand v1)
5. **#8B5CF6** (27 occurrences) - NOT IN BRAND BOOK
6. **#E5E7EB** (25 occurrences) - mist-gray (Brand v1)
7. **#6B7280** (25 occurrences) - NOT IN BRAND BOOK
8. **#A78BFA** (21 occurrences) - electric-violet (Brand v1)
9. **#818CF8** (15 occurrences) - luminous-indigo (Brand v1)
10. **#000000** (13 occurrences) - pure black

### Other Notable Colors:
- **#F472B6** (10 occurrences) - neural-pink (Brand v1)
- **#D1D5DB** (9 occurrences) - NOT IN BRAND BOOK
- **#FF6600** (8 occurrences) - NOT IN BRAND BOOK
- **#1E40AF** (8 occurrences) - NOT IN BRAND BOOK
- **#0066FF** (8 occurrences) - NOT IN BRAND BOOK

## 2. Brand Book v1 Colors (globals.css)

### Primary Palette
- `--cosmic-purple: #6366F1` ✓ IN USE
- `--electric-violet: #A78BFA` ✓ IN USE
- `--luminous-indigo: #818CF8` ✓ IN USE

### Accent Colors
- `--phosphor-cyan: #10B981` ✓ IN USE
- `--synaptic-blue: #3B82F6` ✓ IN USE
- `--neural-pink: #F472B6` ✓ IN USE

### Foundation Colors
- `--pure-light: #FFFFFF` ✓ IN USE
- `--soft-light: #FAFAFA` ✓ IN USE
- `--whisper-gray: #F8F9FA` ✓ IN USE
- `--mist-gray: #E5E7EB` ✓ IN USE
- `--stone-gray: #9CA3AF` ✓ IN USE
- `--deep-space: #0F172A` ✓ IN USE

### Additional Colors (globals.css)
- `--luminous-gold: #F59E0B` ✓ IN USE
- `--vivid-red: #EF4444` ✓ IN USE
- `--midnight-black: #1E293B` ✓ IN USE

## 3. Brand Book v2 Colors (from stories)

### Monochrome System
- **Primary Purple**: `#7B00FF` - NOT FOUND IN CODEBASE
- **Text Black**: `#1D1D1F` - NOT FOUND IN CODEBASE
- **Text White**: `#F5F5F7` - NOT FOUND IN CODEBASE

### Functional Colors (v2)
- **Success**: `#0F8A0F` - NOT FOUND IN CODEBASE
- **Error**: `#E51C23` - NOT FOUND IN CODEBASE
- **Warning**: `#FFC700` - NOT FOUND IN CODEBASE
- **Info**: `#0087FF` - NOT FOUND IN CODEBASE
- **Lightbulb**: `#FFB833` - NOT FOUND IN CODEBASE

### Dark Theme Purples (v2)
- **#BB66FF** - NOT FOUND IN CODEBASE
- **#D199FF** - NOT FOUND IN CODEBASE

## 4. RGBA Colors Found

### Most Common:
1. `rgba(99, 102, 241, 0.1)` - cosmic-purple 10% (9 occurrences)
2. `rgba(99, 102, 241, 0.4)` - cosmic-purple 40% (3 occurrences)
3. `rgba(99, 102, 241, 0.3)` - cosmic-purple 30% (3 occurrences)
4. `rgba(99, 102, 241, 0.2)` - cosmic-purple 20% (3 occurrences)
5. `rgba(0, 0, 0, 0.05)` - black 5% (3 occurrences)

### Visualization Colors (RadialHeatmap):
- `rgba(99, 102, 241, 0.4)` - indigo base
- `rgba(168, 85, 247, 0.4)` - purple base
- `rgba(236, 72, 153, 0.4)` - pink base
- `rgba(251, 146, 60, 0.4)` - orange base
- `rgba(59, 130, 246, 0.4)` - blue base
- `rgba(139, 92, 246, 0.4)` - violet base
- `rgba(217, 70, 239, 0.4)` - fuchsia base

## 5. Colors NOT in Any Brand Book

### High Usage Unknown Colors:
1. **#8B5CF6** (27 occurrences) - purple variant
2. **#6B7280** (25 occurrences) - gray variant
3. **#D1D5DB** (9 occurrences) - light gray
4. **#FF6600** (8 occurrences) - orange
5. **#1E40AF** (8 occurrences) - dark blue
6. **#0066FF** (8 occurrences) - bright blue
7. **#9CA3AF** (7 occurrences) - gray (similar to stone-gray)
8. **#60A5FA** (6 occurrences) - light blue
9. **#94A3B8** (5 occurrences) - blue-gray
10. **#2563EB** (4 occurrences) - blue

### One-off Colors Found:
- Various shades of yellow: #FFEAA7, #FFD93D, #FFB347, #FF8E53
- Various shades of red: #FF6F61, #FF6B9D, #FF0000, #E74C3C
- Various shades of green: #B7E4C7, #A3D9A5, #96CEB4, #8FD694, #71C671, #5CB85C, #4B9F47, #3D7C2E, #22c55e, #10b981
- Various shades of blue: #67E8F9, #4ECDC4, #45B7D1, #3498DB, #1ABC9C, #0EA5E9, #0E7490, #00FFFF, #00DDEE, #00BBDD, #0099CC, #0077BE
- Various purples: #DDA0DD, #C44569, #BE185D, #9B59B6
- Various grays: #999999, #808080, #666666, #4d4d4d, #333333, #1a1a1a

## 6. CSS Variables (oklch format in globals.css)

The globals.css also defines colors in oklch format for better color manipulation:
- `--primary: oklch(0.627 0.177 265.75)` - cosmic-purple
- `--secondary: oklch(0.756 0.108 265.75)` - electric-violet
- `--accent: oklch(0.705 0.121 265.75)` - luminous-indigo
- `--destructive: oklch(0.708 0.191 22.216)` - neural-pink

## 7. Specific File Locations

### Mystery Purple #8B5CF6 (27 occurrences):
- **app/drawing-tool/components/canvas/DrawingCanvas.tsx** - Used for selection states
- **app/brand/motion/streamgraph/page.tsx** - In color palette array
- **app/map-editor/components/drawing/BezierDrawTool.tsx** - For bezier curve handles

### Brand v2 Purple #7B00FF:
- **0 occurrences found** - Only exists in story documentation

### Common Tailwind Color Classes:
- `text-gray-600`, `text-gray-500`, `text-gray-400` - Throughout all components
- `bg-white`, `bg-gray-50`, `bg-gray-100` - Common backgrounds
- `border-gray-200`, `border-gray-300` - Common borders
- `text-cosmic-purple`, `bg-cosmic-purple` - Using v1 brand color

## 8. Key Findings & Inconsistencies

### Major Issues:
1. **Brand v2 colors are NOT implemented** - The new monochrome system (#7B00FF, #1D1D1F, #F5F5F7) is not being used (0 occurrences)
2. **27 occurrences of #8B5CF6** - This purple is not in any brand book, mainly in drawing/map tools
3. **Many one-off colors** - Over 50 unique colors that aren't part of any system
4. **Still using #FFFFFF and #000000** - Should be using #F5F5F7 and #1D1D1F per v2
5. **Functional colors missing** - The new semantic colors from v2 are not implemented

### Color Sources:
- **globals.css**: Defines Brand v1 colors
- **tailwind.config.js**: References the same Brand v1 colors
- **Component files**: Many locally defined colors not in any system
- **Stories**: Brand v2 colors exist only in documentation, not implementation

## 9. Landing Page Color Usage

### Vergil Learn & Vergil Main Pages:
- **text-white** - Should be text-vergil-white (#F5F5F7)
- **text-gray-300** - Using Tailwind default grays
- **bg-cosmic-purple** - Using Brand v1 purple (#6366F1)
- **bg-black** - Should be bg-vergil-text (#1D1D1F)
- **bg-pure-light** - Correctly using Brand v1 white

### Landing Components (components/landing/):
- Primarily using Tailwind default colors
- Heavy use of gray-XXX classes (not brand colors)
- Using cosmic-purple from v1, not #7B00FF from v2

## 10. Color Migration Map

### V1 → V2 Mapping:
| Current (v1) | Should Be (v2) | Usage |
|--------------|----------------|--------|
| #6366F1 (cosmic-purple) | #7B00FF | Primary brand color |
| #A78BFA (electric-violet) | Remove | Not needed in monochrome |
| #818CF8 (luminous-indigo) | Remove | Not needed in monochrome |
| #10B981 (phosphor-cyan) | #0F8A0F | Success states only |
| #3B82F6 (synaptic-blue) | #0087FF | Info states only |
| #F472B6 (neural-pink) | #E51C23 | Error states only |
| #FFFFFF | #F5F5F7 | All white text/backgrounds |
| #000000 | #1D1D1F | All black text/backgrounds |
| #8B5CF6 (mystery purple) | #9933FF or remove | Needs decision |

## 11. Recommendations

1. **Immediate Actions**:
   - Add Brand v2 colors to globals.css
   - Create Tailwind classes for vergil-purple (#7B00FF), vergil-white (#F5F5F7), vergil-text (#1D1D1F)
   - Document what #8B5CF6 should become

2. **Migration Strategy**:
   - Phase 1: Add v2 colors alongside v1
   - Phase 2: Update components to use v2 colors
   - Phase 3: Remove v1 colors and non-brand colors

3. **Enforcement**:
   - Create linting rules to prevent non-brand colors
   - Add color usage guidelines to component templates
   - Regular audits to catch color drift
