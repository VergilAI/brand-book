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
  
  // Create visual tables from schema
  schema.tables.forEach((table, index) => {
    const tableId = generateId('table');
    
    // Calculate position in grid layout
    const col = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    const x = 100 + (col * TABLE_SPACING_X);
    const y = 100 + (row * TABLE_SPACING_Y);
    
    // Convert columns to table rows
    const rows: TableRow[] = table.columns.map(column => {
      const parsedType = parseSQLType(column.type);
      const visualType = SQL_TO_VISUAL_TYPE_MAP[parsedType.baseType.toLowerCase()] || 'text';
      
      return {
        key: column.primary_key ? '🔑' : '',
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
      width: TABLE_WIDTH,
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
      zIndex: index,
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
    
    const fromTableId = tableIdMap[table.name];
    if (!fromTableId) return;
    
    table.foreign_keys.forEach(fk => {
      const toTableId = tableIdMap[fk.references.table];
      if (!toTableId) return;
      
      // Find row indices
      const fromItem = items[fromTableId];
      const toItem = items[toTableId];
      
      const fromRowIndex = fromItem.metadata?.rows.findIndex(
        row => row.name === fk.column
      ) ?? 0;
      
      const toRowIndex = toItem.metadata?.rows.findIndex(
        row => row.name === fk.references.column
      ) ?? 0;
      
      // Determine relationship type
      const fromTable = schema.tables.find(t => t.name === table.name)!;
      const toTable = schema.tables.find(t => t.name === fk.references.table)!;
      const relationshipType = inferRelationshipType(fromTable, toTable, fk);
      
      // Create relationship
      relationships.push({
        id: generateId('relationship'),
        fromTable: fromTableId,
        fromRow: fromRowIndex,
        fromSide: 'right',
        toTable: toTableId,
        toRow: toRowIndex,
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
    .filter(item => item.metadata?.type === 'database-table' && item.metadata?.tableName)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  
  sortedItems.forEach(item => {
    const metadata = item.metadata as TableMetadata;
    
    // Convert table rows to columns
    const columns: ColumnDefinition[] = metadata.rows.map(row => {
      // Map visual type back to SQL type
      let sqlType = VISUAL_TO_SQL_TYPE_MAP[row.type] || 'varchar(255)';
      
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
    const tableForeignKeys = relationships
      .filter(rel => rel.fromTable === item.id)
      .map(rel => {
        const fromRow = metadata.rows[rel.fromRow];
        const toItem = items[rel.toTable];
        const toRow = toItem.metadata?.rows[rel.toRow];
        
        if (!fromRow || !toRow || !toItem.metadata?.tableName) {
          return null;
        }
        
        const fk: ForeignKeyDefinition = {
          name: rel.constraintName || `fk_${metadata.tableName}_${fromRow.name}`,
          column: fromRow.name,
          references: {
            table: toItem.metadata.tableName,
            column: toRow.name,
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