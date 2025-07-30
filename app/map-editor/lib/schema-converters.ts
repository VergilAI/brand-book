import {
  DatabaseSchema,
  TableDefinition,
  ColumnDefinition,
  ForeignKeyDefinition,
  parseSQLType,
  SQL_TO_VISUAL_TYPE_MAP,
  VISUAL_TO_SQL_TYPE_MAP,
  inferRelationshipType,
} from '../types/json-schema-types';
import {
  TableRow,
  TableMetadata,
  TableRelationship,
} from '../types/database-types';
import { MapItem } from '../types';

// Constants for visual layout
const TABLE_WIDTH = 300;
const TABLE_SPACING_X = 400;
const TABLE_SPACING_Y = 300;
const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 40;
const NAME_HEIGHT = 50;
const GRID_COLUMNS = 3;

// Helper function to generate unique IDs
function generateId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert a JSON database schema to visual map items and relationships
 */
export function schemaToVisual(schema: DatabaseSchema): {
  items: Record<string, MapItem>;
  relationships: TableRelationship[];
} {
  const items: Record<string, MapItem> = {};
  const relationships: TableRelationship[] = [];
  
  // First pass: collect all foreign key columns
  const foreignKeyColumns = new Map<string, Set<string>>();
  schema.tables.forEach(table => {
    if (table.foreign_keys) {
      const columnSet = new Set<string>();
      table.foreign_keys.forEach(fk => {
        columnSet.add(fk.column);
      });
      foreignKeyColumns.set(table.name, columnSet);
    }
  });

  // Create visual tables from schema
  schema.tables.forEach((table, index) => {
    const tableId = generateId('table');
    
    // Use display position if available, otherwise calculate position in grid layout
    let x: number, y: number, width: number, zIndex: number;
    
    if (table.display?.position) {
      x = table.display.position.x;
      y = table.display.position.y;
      width = table.display.size?.width || TABLE_WIDTH;
      zIndex = table.display.zIndex ?? index;
    } else {
      // Fallback to grid layout
      const col = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      x = 100 + (col * TABLE_SPACING_X);
      y = 100 + (row * TABLE_SPACING_Y);
      width = TABLE_WIDTH;
      zIndex = index;
    }
    
    // Get foreign key columns for this table
    const tableFKColumns = foreignKeyColumns.get(table.name) || new Set();
    
    // Convert columns to table rows
    const rows: TableRow[] = table.columns.map(column => {
      // Use the full SQL type directly to preserve parameters
      // This ensures we preserve types like varchar(255), decimal(10,2), etc.
      const visualType = column.type.toLowerCase();
      
      // Determine key type
      let keyType = '';
      if (column.primary_key && tableFKColumns.has(column.name)) {
        keyType = 'PK,FK';
      } else if (column.primary_key) {
        keyType = 'PK';
      } else if (tableFKColumns.has(column.name)) {
        keyType = 'FK';
      }
      
      return {
        key: keyType,
        name: column.name,
        type: visualType,
        nullable: column.nullable,
        primaryKey: column.primary_key,
        autoIncrement: column.auto_increment,
        default: column.default,
      };
    });
    
    // Create table metadata
    const metadata: TableMetadata = {
      type: 'database-table',
      tableName: table.name,
      rows: rows,
      columns: ['key', 'name', 'type'],
      width: width,
      nameHeight: NAME_HEIGHT,
      headerHeight: HEADER_HEIGHT,
      rowHeight: ROW_HEIGHT,
    };
    
    // Create map item
    items[tableId] = {
      id: tableId,
      type: 'table',
      coordinates: [[x, y]],
      metadata: metadata,
      color: '#f3f4f6',
      borderColor: '#e5e7eb',
      zIndex: zIndex,
    };
  });
  
  // Create relationships from foreign keys
  const tableIdMap: Record<string, string> = {};
  Object.values(items).forEach(item => {
    if (item.metadata?.tableName) {
      tableIdMap[item.metadata.tableName] = item.id;
    }
  });
  
  schema.tables.forEach((table, tableIndex) => {
    if (!table.foreign_keys) return;
    
    const targetTableId = tableIdMap[table.name]; // Table with the foreign key
    if (!targetTableId) return;
    
    table.foreign_keys.forEach(fk => {
      const sourceTableId = tableIdMap[fk.references.table]; // Table being referenced
      if (!sourceTableId) return;
      
      // Find row indices
      const targetItem = items[targetTableId]; // Has the foreign key
      const sourceItem = items[sourceTableId]; // Has the primary key
      
      const targetRowIndex = targetItem.metadata?.rows.findIndex(
        row => row.name === fk.column // Foreign key column
      ) ?? 0;
      
      const sourceRowIndex = sourceItem.metadata?.rows.findIndex(
        row => row.name === fk.references.column // Primary key column
      ) ?? 0;
      
      // Determine relationship type
      const targetTable = schema.tables.find(t => t.name === table.name)!;
      const sourceTable = schema.tables.find(t => t.name === fk.references.table)!;
      const relationshipType = inferRelationshipType(targetTable, sourceTable, fk);
      
      // Create relationship arrow FROM source (primary key) TO target (foreign key)
      relationships.push({
        id: generateId('relationship'),
        fromTable: sourceTableId, // Arrow starts at referenced table
        fromRow: sourceRowIndex, // Primary key row
        fromSide: 'right',
        toTable: targetTableId, // Arrow ends at table with foreign key
        toRow: targetRowIndex, // Foreign key row
        toSide: 'left',
        relationshipType: relationshipType,
        constraintName: fk.name,
        onDelete: fk.on_delete,
        onUpdate: fk.on_update,
      });
    });
  });
  
  return { items, relationships };
}

/**
 * Convert visual map items and relationships back to JSON schema format
 */
export function visualToSchema(
  items: Record<string, MapItem>,
  relationships: TableRelationship[],
  dialect: DatabaseSchema['metadata']['dialect'] = 'postgresql',
  version: string = '1.0',
  name: string = 'New Database Schema'
): DatabaseSchema {
  const tables: TableDefinition[] = [];
  
  // Sort tables by zIndex to maintain order
  const sortedItems = Object.values(items)
    .filter(item => item.metadata?.tableName) // Just check for tableName, not type
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  sortedItems.forEach(item => {
    const metadata = item.metadata as TableMetadata;
    
    // Convert table rows to columns
    const columns: ColumnDefinition[] = metadata.rows.map(row => {
      // Map visual type back to SQL type
      // First check if we have a direct mapping, otherwise use the type as-is
      let sqlType = VISUAL_TO_SQL_TYPE_MAP[row.type] || row.type;
      
      // Handle special cases
      if (row.primaryKey && row.autoIncrement) {
        if (dialect === 'postgresql') {
          sqlType = 'integer'; // Will use SERIAL
        }
      }
      
      return {
        name: row.name,
        type: sqlType,
        nullable: row.nullable ?? true,
        primary_key: row.primaryKey,
        auto_increment: row.autoIncrement,
        default: row.default,
      };
    });
    
    // Find foreign keys for this table
    // According to spec: Arrow FROM primary key TO foreign key means 
    // the foreign key goes on the TARGET table (where arrow ends)
    const tableForeignKeys = relationships
      .filter(rel => rel.toTable === item.id) // This table is the TARGET of the arrow
      .map(rel => {
        const fromItem = items[rel.fromTable]; // Source table (has the primary key)
        const fromRow = fromItem.metadata?.rows[rel.fromRow]; // Source column (primary key)
        const toRow = metadata.rows[rel.toRow]; // Local column (foreign key)
        
        if (!fromRow || !toRow || !fromItem.metadata?.tableName) {
          return null;
        }
        
        const fk: ForeignKeyDefinition = {
          name: rel.constraintName || `fk_${metadata.tableName}_${toRow.name}`,
          column: toRow.name, // Local column in THIS table
          references: {
            table: fromItem.metadata.tableName, // References the SOURCE table
            column: fromRow.name, // References the column in SOURCE table
          },
          on_delete: rel.onDelete,
          on_update: rel.onUpdate,
        };
        
        return fk;
      })
      .filter((fk): fk is ForeignKeyDefinition => fk !== null);
    
    const table: TableDefinition = {
      name: metadata.tableName,
      columns: columns,
    };
    
    if (tableForeignKeys.length > 0) {
      table.foreign_keys = tableForeignKeys;
    }
    
    // Add display information
    if (item.coordinates && item.coordinates.length > 0) {
      table.display = {
        position: {
          x: item.coordinates[0][0],
          y: item.coordinates[0][1],
        },
        size: {
          width: metadata.width || TABLE_WIDTH,
          height: (metadata.rows.length * ROW_HEIGHT) + NAME_HEIGHT + HEADER_HEIGHT,
        },
        zIndex: item.zIndex,
      };
    }
    
    tables.push(table);
  });
  
  return {
    metadata: {
      name: name,
      dialect: dialect,
      version: version,
    },
    tables: tables,
  };
}

/**
 * Load a JSON schema from a file path
 */
export async function loadSchemaFromFile(filePath: string): Promise<DatabaseSchema> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load schema: ${response.statusText}`);
    }
    const schema = await response.json();
    return schema as DatabaseSchema;
  } catch (error) {
    console.error('Error loading schema:', error);
    throw error;
  }
}

/**
 * Save a schema to local storage (for demo purposes)
 * In production, this would save to a backend API
 */
export function saveSchemaToStorage(
  key: string,
  schema: DatabaseSchema
): void {
  try {
    localStorage.setItem(`db-schema-${key}`, JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error('Error saving schema:', error);
    throw error;
  }
}

/**
 * Load a schema from local storage
 */
export function loadSchemaFromStorage(key: string): DatabaseSchema | null {
  try {
    const data = localStorage.getItem(`db-schema-${key}`);
    if (!data) return null;
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Error loading schema from storage:', error);
    return null;
  }
}

/**
 * List all saved schemas in local storage
 */
export function listSavedSchemas(): string[] {
  const schemas: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('db-schema-')) {
      schemas.push(key.replace('db-schema-', ''));
    }
  }
  return schemas;
}