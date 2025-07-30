// Type definitions for the JSON Database Schema Specification v1.0

export type DatabaseDialect = 'postgresql' | 'mysql' | 'sqlite';

export type ForeignKeyAction = 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

export interface SchemaMetadata {
  name: string;
  dialect: DatabaseDialect;
  version: string;
}

export interface ColumnDefinition {
  name: string;
  type: string; // SQL type with parameters e.g. "varchar(255)", "decimal(10,2)"
  nullable: boolean;
  primary_key?: boolean;
  auto_increment?: boolean;
  default?: string; // Default value or SQL expression
}

export interface ForeignKeyReference {
  table: string;
  column: string;
}

export interface ForeignKeyDefinition {
  name: string;
  column: string;
  references: ForeignKeyReference;
  on_delete?: ForeignKeyAction;
  on_update?: ForeignKeyAction;
}

export interface DisplayPosition {
  x: number;
  y: number;
}

export interface DisplaySize {
  width: number;
  height: number;
}

export interface DisplayInfo {
  position?: DisplayPosition;
  size?: DisplaySize;
  zIndex?: number;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  foreign_keys?: ForeignKeyDefinition[];
  display?: DisplayInfo;
}

export interface DatabaseSchema {
  metadata: SchemaMetadata;
  tables: TableDefinition[];
}

// Helper type for parsing SQL types
export interface ParsedSQLType {
  baseType: string;
  parameters?: string[]; // e.g., ["255"] for varchar(255), ["10", "2"] for decimal(10,2)
}

// Mapping SQL types to our visual editor types
export const SQL_TO_VISUAL_TYPE_MAP: Record<string, string> = {
  // Numeric types
  'integer': 'number',
  'int': 'number',
  'bigint': 'number',
  'smallint': 'number',
  'decimal': 'number',
  'numeric': 'number',
  'real': 'number',
  'float': 'number',
  'double precision': 'number',
  
  // String types
  'varchar': 'text',
  'char': 'text',
  'text': 'text',
  
  // Date/Time types
  'timestamp': 'timestamp',
  'timestamp with time zone': 'timestamp',
  'date': 'date',
  'time': 'date',
  
  // Other types
  'boolean': 'boolean',
  'uuid': 'uuid',
  'json': 'json',
  'jsonb': 'json',
};

// Visual editor types that map back to SQL
export const VISUAL_TO_SQL_TYPE_MAP: Record<string, string> = {
  // Direct SQL type mappings (used by TypeCombobox)
  // String types
  'text': 'text',
  'varchar': 'varchar(255)', // fallback for bare varchar
  'varchar(255)': 'varchar(255)',
  'varchar(50)': 'varchar(50)',
  'char(10)': 'char(10)',
  
  // Numeric types
  'integer': 'integer',
  'int': 'integer', // alias
  'bigint': 'bigint',
  'smallint': 'smallint',
  'decimal': 'decimal(10,2)', // fallback for bare decimal
  'decimal(10,2)': 'decimal(10,2)',
  'numeric': 'numeric(10,2)', // fallback for bare numeric
  'numeric(10,2)': 'numeric(10,2)',
  'real': 'real',
  'float': 'real', // alias
  'double precision': 'double precision',
  
  // Date/Time types
  'date': 'date',
  'time': 'time',
  'timestamp': 'timestamp',
  'timestamp with time zone': 'timestamp with time zone',
  
  // Other types
  'boolean': 'boolean',
  'uuid': 'uuid',
  'json': 'json',
  'jsonb': 'jsonb',
  'array': 'json',
  'enum': 'varchar(50)',
  
  // Legacy abstract type mappings (for backward compatibility)
  'number': 'integer',
  'object': 'json',
};

// Helper function to parse SQL type strings
export function parseSQLType(sqlType: string): ParsedSQLType {
  const match = sqlType.match(/^([^(]+)(?:\(([^)]+)\))?$/);
  if (!match) {
    return { baseType: sqlType };
  }
  
  const [, baseType, params] = match;
  const parameters = params ? params.split(',').map(p => p.trim()) : undefined;
  
  return {
    baseType: baseType.trim(),
    parameters
  };
}

// Helper function to determine relationship type from foreign keys
export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export function inferRelationshipType(
  fromTable: TableDefinition,
  toTable: TableDefinition,
  foreignKey: ForeignKeyDefinition
): RelationshipType {
  // Check if the FK column is also a PK (one-to-one)
  const fkColumn = fromTable.columns.find(col => col.name === foreignKey.column);
  if (fkColumn?.primary_key) {
    return 'one-to-one';
  }
  
  // Check if this is a junction table (many-to-many)
  // Junction tables typically have 2+ FKs and all/most columns are FKs
  const fkCount = fromTable.foreign_keys?.length || 0;
  const columnCount = fromTable.columns.length;
  if (fkCount >= 2 && fkCount >= columnCount - 1) {
    return 'many-to-many';
  }
  
  // Default to one-to-many
  return 'one-to-many';
}