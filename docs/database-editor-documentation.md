# Database Editor Documentation

## Overview

The Database Editor is a visual tool for designing database schemas with an intuitive drag-and-drop interface. Built on top of the Map Editor infrastructure, it provides specialized functionality for creating and managing database tables, fields, and relationships.

## Key Features

### 1. Table Management
- **Visual Tables**: Database tables are rendered as visual cards with headers and rows
- **Table Creation**: Click the "Table" tool (keyboard shortcut: P) to add new tables
- **Drag & Drop**: Move tables around the canvas by dragging the header
- **Table Properties**: Click any table to view/edit its properties in the floating panel

### 2. Field Management
- **Three Columns**: Each table has Key, Name, and Type columns
- **Inline Editing**: 
  - Single-click to select a table
  - Double-click any cell to edit its content
  - Press Enter or click away to save changes
- **Data Types**: Support for multiple data types with visual color coding:
  - `text` (Blue)
  - `number` (Green)
  - `boolean` (Purple)
  - `date` (Orange)
  - `json` (Pink)
  - `uuid` (Cyan)
  - `timestamp` (Red)
  - `enum` (Yellow)
  - `array` (Indigo)
  - `object` (Rose)

### 3. Relationship Management
- **Visual Relationships**: Draw connections between tables to represent foreign key relationships
- **Connection Points**: Each row has connection dots on both sides
- **Relationship Types**:
  - One-to-One: Single line endings on both sides
  - One-to-Many: Single line on one side, crow's foot on the other
  - Many-to-Many: Crow's foot notation on both sides
- **Interactive Editing**: Click any relationship to edit its type through the properties panel

### 4. Properties Panel
The floating properties panel appears when selecting tables or relationships:

#### Table Properties
- **Table Name**: Displays the current table name
- **Row Count**: Shows the number of fields/rows in the table
- **Relationships**: Lists all incoming and outgoing relationships with:
  - Connected table names
  - Field names involved
  - Relationship types

#### Relationship Properties
- **From/To Information**: Shows source and target table/field details
- **Type Editing**: Two dropdowns to independently control each end:
  - "From End": Controls the source side (One/Many)
  - "To End": Controls the target side (One/Many)
- **Delete Option**: Remove relationships directly from the panel

## User Interface

### Canvas Controls
- **Pan**: Click and drag on empty space or hold Space + drag
- **Zoom**: 
  - Mouse wheel or trackpad pinch
  - Keyboard: Cmd/Ctrl + Plus/Minus
  - Reset zoom: Cmd/Ctrl + 0
- **Selection**:
  - Click to select single items
  - Drag to create area selection
  - Cmd/Ctrl + Click for multi-select

### Keyboard Shortcuts
- **P**: Activate Table tool
- **Space**: Hold for panning mode
- **Delete/Backspace**: Delete selected items
- **Cmd/Ctrl + Z**: Undo
- **Cmd/Ctrl + Shift + Z**: Redo
- **Cmd/Ctrl + A**: Select all
- **Escape**: Clear selection

### Visual Indicators
- **Selected Tables**: Purple border
- **Hovered Tables**: Light gray background
- **Selected Relationships**: Thicker purple line
- **Connection Points**: Visible on hover, purple when active

## Technical Implementation

### Architecture
- **React + TypeScript**: Type-safe component architecture
- **SVG Rendering**: All visual elements rendered as SVG for crisp scaling
- **Zustand State Management**: Centralized state for tables and relationships
- **Context API**: Relationship state shared via React Context

### Component Structure
```
/components/diagram-tool/
├── canvas/MapCanvas.tsx         # Main canvas component
├── panels/FloatingPropertiesPanel.tsx  # Properties editor
└── TypeCombobox.tsx            # Data type selector

/app/map-editor/
├── contexts/RelationshipContext.tsx  # Relationship state
├── types/database-types.ts     # TypeScript definitions
└── hooks/useMapEditor.ts       # Main state management
```

### Data Structures

#### Table Metadata
```typescript
interface TableMetadata {
  tableName: string;
  rows: TableRow[];
  columns: string[];  // ['key', 'name', 'type']
  width: number;      // Visual width
  nameHeight: number; // Header height
  headerHeight: number;
  rowHeight: number;  // Height per row
}

interface TableRow {
  key: string;
  name: string;
  type: string;
}
```

#### Relationships
```typescript
interface TableRelationship {
  id: string;
  fromTable: string;  // Table ID
  fromRow: number;    // Row index
  fromSide: 'left' | 'right';
  toTable: string;
  toRow: number;
  toSide: 'left' | 'right';
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
```

## Best Practices

### Performance
- Tables are rendered efficiently using SVG foreignObject for editable content
- Relationship lines update in real-time as tables move
- Canvas uses pointer capture for smooth dragging

### User Experience
- Double-click for editing provides clear interaction model
- Visual feedback on all interactive elements
- Consistent color coding for data types
- Properties panel provides contextual information

### Data Integrity
- Relationships maintain referential integrity
- Deleting tables removes associated relationships
- Type changes are validated and consistent

## Future Enhancements

Potential areas for expansion:
- Export to SQL DDL statements
- Import from existing database schemas
- Additional data types and constraints
- Field validation rules
- Index management
- Table templates/presets

## Troubleshooting

### Common Issues
1. **Can't edit cells**: Ensure you're double-clicking and in edit mode
2. **Relationships not connecting**: Check that you're clicking on connection dots
3. **Properties panel not showing**: Click on table/relationship to select it

### Browser Compatibility
- Tested on Chrome, Firefox, Safari, Edge
- Requires modern browser with SVG support
- Touch devices supported for basic operations