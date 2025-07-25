// Database-specific types for the map editor when used as a database editor

export interface TableRow {
  key: string;
  name: string;
  type: string;
  // Additional properties from JSON schema
  nullable?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  default?: string;
}

export interface TableMetadata {
  tableName: string;
  rows: TableRow[];
  columns: string[];
  width: number;
  nameHeight: number;
  headerHeight: number;
  rowHeight: number;
}

export interface TableRelationship {
  id: string;
  fromTable: string;
  fromRow: number;
  fromSide: 'left' | 'right';
  toTable: string;
  toRow: number;
  toSide: 'left' | 'right';
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
  // Additional properties from JSON schema
  constraintName?: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export const parseRelationshipType = (type: RelationshipType): { from: 'one' | 'many', to: 'one' | 'many' } => {
  const parts = type.split('-to-');
  return {
    from: parts[0] as 'one' | 'many',
    to: parts[1] as 'one' | 'many'
  };
};

export const combineRelationshipType = (from: 'one' | 'many', to: 'one' | 'many'): RelationshipType => {
  return `${from}-to-${to}` as RelationshipType;
};