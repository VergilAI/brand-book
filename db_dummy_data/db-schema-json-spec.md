# JSON Database Schema Specification v1.0

## Overview
This specification defines a JSON format for representing relational database schemas. The format supports bidirectional translation between SQL DDL statements, Python representations, and visual diagrams.

## File Structure

```json
{
  "metadata": { ... },
  "tables": [ ... ]
}
```

### Root Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| metadata | object | Yes | Database-level configuration |
| tables | array | Yes | Ordered list of table definitions |

### Metadata Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Display name for the schema |
| dialect | string | Yes | Database type: `postgresql`, `mysql`, `sqlite` |
| version | string | Yes | Schema version (semantic versioning) |

### Table Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Table name (valid SQL identifier) |
| columns | array | Yes | Ordered list of column definitions |
| foreign_keys | array | No | Foreign key constraints |

### Column Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Column name (valid SQL identifier) |
| type | string | Yes | SQL data type with parameters |
| nullable | boolean | Yes | Whether column allows NULL |
| primary_key | boolean | No | Is primary key (default: false) |
| auto_increment | boolean | No | Auto-increment flag (default: false) |
| default | string | No | Default value or SQL expression |

### Foreign Key Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Constraint name |
| column | string | Yes | Source column name |
| references | object | Yes | Target table and column |
| on_delete | string | No | Delete action (default: `RESTRICT`) |
| on_update | string | No | Update action (default: `RESTRICT`) |

### References Object
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| table | string | Yes | Target table name |
| column | string | Yes | Target column name |

## Supported Data Types

### Numeric Types
- `integer` / `int`
- `bigint`
- `smallint`
- `decimal(p,s)` / `numeric(p,s)`
- `real` / `float`
- `double precision`

### String Types
- `varchar(n)`
- `char(n)`
- `text`

### Date/Time Types
- `timestamp`
- `timestamp with time zone`
- `date`
- `time`

### Other Types
- `boolean`
- `uuid` (PostgreSQL)
- `json` / `jsonb` (PostgreSQL)

## Constraints

### Foreign Key Actions
Valid values for `on_delete` and `on_update`:
- `CASCADE`
- `SET NULL`
- `RESTRICT`
- `NO ACTION`

## Translation Rules

### SQL Generation
1. Tables must be created in array order
2. Foreign keys must be added after all referenced tables exist
3. Constraint names must be preserved exactly
4. Auto-increment syntax varies by dialect:
   - PostgreSQL: Use SERIAL type
   - MySQL: AUTO_INCREMENT attribute
   - SQLite: AUTOINCREMENT keyword

### Python Representation
1. Table names → Class names (PascalCase)
2. Column names → Property names (snake_case)
3. Foreign keys → Relationship properties
4. Types → Python/SQLAlchemy type mappings

### Diagram Rendering
1. Table order determines initial layout positions
2. Foreign keys determine relationship arrows
3. Primary keys displayed with key icon
4. Nullable columns shown with different styling

## Validation Rules

1. **Names**: Must be valid SQL identifiers (alphanumeric + underscore, not starting with digit)
2. **Types**: Must include size parameters where required (e.g., `varchar` needs length)
3. **Foreign Keys**: Referenced table must exist in schema
4. **Primary Keys**: Maximum one column per table can have `primary_key: true`
5. **Auto-increment**: Only valid on integer primary keys
6. **Defaults**: Must be valid SQL expressions for the dialect

## Example

```json
{
  "metadata": {
    "name": "User and Posts Schema",
    "dialect": "postgresql",
    "version": "1.0"
  },
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "id",
          "type": "integer",
          "nullable": false,
          "primary_key": true,
          "auto_increment": true
        },
        {
          "name": "email",
          "type": "varchar(255)",
          "nullable": false
        },
        {
          "name": "created_at",
          "type": "timestamp",
          "nullable": false,
          "default": "CURRENT_TIMESTAMP"
        }
      ]
    },
    {
      "name": "posts",
      "columns": [
        {
          "name": "id",
          "type": "integer",
          "nullable": false,
          "primary_key": true,
          "auto_increment": true
        },
        {
          "name": "user_id",
          "type": "integer",
          "nullable": false
        },
        {
          "name": "title",
          "type": "varchar(200)",
          "nullable": false
        },
        {
          "name": "content",
          "type": "text",
          "nullable": true
        }
      ],
      "foreign_keys": [
        {
          "name": "fk_posts_user_id",
          "column": "user_id",
          "references": {
            "table": "users",
            "column": "id"
          },
          "on_delete": "CASCADE",
          "on_update": "CASCADE"
        }
      ]
    }
  ]
}
```

## Error Handling

Implementations must validate and report:
- Invalid JSON syntax
- Missing required fields
- Invalid SQL identifiers
- Type mismatches
- Circular foreign key references
- References to non-existent tables/columns

## Future Considerations (Out of Scope for v1.0)
- Composite primary keys
- Unique constraints
- Check constraints
- Indexes
- Triggers
- Views
- Stored procedures
- Multiple schemas