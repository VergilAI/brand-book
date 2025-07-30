// Re-export all types
export * from './database-types'
export * from './editor'
export * from './json-schema-types'
export * from './snapping'
export * from './template-library'

// Define MapItem interface
export interface MapItem {
  id: string;
  type: 'table' | 'territory';
  coordinates: number[][];
  metadata?: any;
  color?: string;
  borderColor?: string;
  zIndex?: number;
}