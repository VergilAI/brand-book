import { DatabaseSchema } from '../types/json-schema-types';

export const DEFAULT_SCHEMA: DatabaseSchema = {
  metadata: {
    dialect: 'postgresql',
    version: '1.0'
  },
  tables: [
    {
      name: 'example_table',
      columns: [
        {
          name: 'id',
          type: 'integer',
          nullable: false,
          primary_key: true,
          auto_increment: true
        },
        {
          name: 'name',
          type: 'varchar(255)',
          nullable: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          nullable: false,
          default: 'CURRENT_TIMESTAMP'
        }
      ]
    }
  ]
};