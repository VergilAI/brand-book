# JSON Schema Specification for Database Diagrams

This document defines the exact JSON structure that the visual diagram editor must generate for the db-editor-orm system.

## Overview

The JSON schema represents a complete database structure including tables, columns, relationships, and visual positioning. Every database design must be represented as a single JSON object with specific required fields.

## Root Structure

```json
{
  "metadata": { /* Required: Database metadata */ },
  "tables": [ /* Required: Array of table objects */ ]
}
```

### Metadata Object (Required)

The metadata object contains database-level configuration:

```json
{
  "metadata": {
    "name": "string",      // Optional: Database name (e.g., "BlogDatabase")
    "dialect": "string",   // Required: "postgresql" or "sqlite"
    "version": "string"    // Required: Schema version (e.g., "1.0")
  }
}
```

**Dialect values**:
- `"postgresql"` - For PostgreSQL databases
- `"sqlite"` - For SQLite databases

## Table Structure

Each table in the `tables` array must follow this structure:

```json
{
  "name": "string",           // Required: Table name
  "columns": [ /* array */ ], // Required: Array of column objects (min 1)
  "foreign_keys": [ /* array */ ], // Optional: Array of foreign key objects
  "display": { /* object */ }      // Optional: Visual positioning data
}
```

### Table Naming Rules
- Must contain only letters, numbers, and underscores
- Cannot start with a number
- Examples: `users`, `blog_posts`, `order_items`
- Invalid: `123table`, `user-accounts`, `my table`

### Display Object (Optional)

For visual diagram positioning:

```json
{
  "display": {
    "position": {
      "x": 100,    // X coordinate in pixels
      "y": 200     // Y coordinate in pixels
    },
    "size": {
      "width": 250,   // Width in pixels
      "height": 300   // Height in pixels
    },
    "zIndex": 1      // Layer order (higher = on top)
  }
}
```

## Column Structure

Each column in the `columns` array must follow this structure:

```json
{
  "name": "string",              // Required: Column name
  "type": "string",              // Required: Data type
  "nullable": true/false,        // Optional: Default is true
  "primary_key": true/false,     // Optional: Default is false
  "auto_increment": true/false,  // Optional: Default is false
  "default": "string"            // Optional: Default value
}
```

### Column Naming Rules
- Same as table naming rules
- Must be unique within the table

### Data Types

The `type` field must be one of these values:

#### Integer Types
- `"integer"` or `"int"` - Standard integer
- `"bigint"` - Large integer
- `"smallint"` - Small integer

#### Decimal Types
- `"decimal(precision,scale)"` - Example: `"decimal(10,2)"`
- `"numeric(precision,scale)"` - Same as decimal
- `"real"` - Floating point
- `"double precision"` or `"double"` - Double precision float

#### Text Types
- `"varchar(length)"` - Variable character, Example: `"varchar(255)"`
- `"char(length)"` - Fixed character, Example: `"char(10)"`
- `"text"` - Unlimited text

#### Date/Time Types
- `"date"` - Date only
- `"time"` - Time only
- `"timestamp"` - Date and time
- `"timestamptz"` - Timestamp with timezone (PostgreSQL only)

#### Boolean Type
- `"boolean"` or `"bool"` - True/false values

#### Binary Types
- `"bytea"` - Binary data (PostgreSQL)
- `"blob"` - Binary data (SQLite)

#### Other Types
- `"uuid"` - UUID type
- `"json"` or `"jsonb"` - JSON data

### Primary Key Rules

**CRITICAL**: Every table MUST have exactly ONE primary key column!

```json
{
  "name": "id",
  "type": "integer",
  "nullable": false,        // Primary keys must be non-nullable
  "primary_key": true,      // This MUST be set to true
  "auto_increment": true    // Optional, common for integer PKs
}
```

**Rules**:
1. Each table must have exactly one column with `"primary_key": true`
2. Primary key columns must have `"nullable": false`
3. Only one column per table can have `"primary_key": true`
4. Auto-increment can only be used on integer-type primary keys

### Default Values

Default values must be appropriate for the column type:

```json
// Boolean defaults
{ "type": "boolean", "default": "true" }   // or "false"

// Numeric defaults
{ "type": "integer", "default": "0" }
{ "type": "decimal(10,2)", "default": "0.00" }

// String defaults
{ "type": "varchar(255)", "default": "'active'" }  // Note: quoted strings
{ "type": "text", "default": "''" }                // Empty string

// Date/Time defaults
{ "type": "timestamp", "default": "CURRENT_TIMESTAMP" }
{ "type": "date", "default": "CURRENT_DATE" }

// NULL default (only for nullable columns)
{ "type": "varchar(255)", "nullable": true, "default": null }
```

## Foreign Key Structure

Foreign keys define relationships between tables:

```json
{
  "name": "string",           // Required: Constraint name
  "column": "string",         // Required: Local column name
  "references": {             // Required: Reference object
    "table": "string",        // Required: Referenced table name
    "column": "string"        // Required: Referenced column name
  },
  "on_delete": "string",      // Optional: "CASCADE", "SET NULL", "RESTRICT", "NO ACTION"
  "on_update": "string"       // Optional: Same options as on_delete
}
```

### Foreign Key Rules

1. The referenced table must exist in the schema
2. The referenced column must exist in the referenced table
3. The local column must exist in the current table
4. Foreign key names should be descriptive: `fk_[table]_[column]`

### Example Foreign Key

```json
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
```

## Complete Example

Here's a complete example showing a blog database:

```json
{
  "metadata": {
    "name": "BlogDatabase",
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
          "name": "username",
          "type": "varchar(100)",
          "nullable": false
        },
        {
          "name": "created_at",
          "type": "timestamp",
          "nullable": false,
          "default": "CURRENT_TIMESTAMP"
        },
        {
          "name": "is_active",
          "type": "boolean",
          "nullable": false,
          "default": "true"
        }
      ],
      "display": {
        "position": { "x": 100, "y": 100 },
        "size": { "width": 250, "height": 200 },
        "zIndex": 1
      }
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
          "nullable": false
        },
        {
          "name": "published",
          "type": "boolean",
          "nullable": false,
          "default": "false"
        },
        {
          "name": "created_at",
          "type": "timestamp",
          "nullable": false,
          "default": "CURRENT_TIMESTAMP"
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
      ],
      "display": {
        "position": { "x": 400, "y": 100 },
        "size": { "width": 300, "height": 250 },
        "zIndex": 2
      }
    }
  ]
}
```

## Common Validation Errors

The backend will reject schemas with these errors:

1. **No Primary Key**: "Table 'tablename' has no primary key"
   - Fix: Ensure one column has `"primary_key": true`

2. **Multiple Primary Keys**: "Table 'tablename' has multiple primary keys"
   - Fix: Only one column should have `"primary_key": true`

3. **Invalid Table/Column Names**: "must be alphanumeric with underscores, not starting with a digit"
   - Fix: Use only letters, numbers, underscores; don't start with numbers

4. **Invalid Foreign Key Reference**: "references non-existent table"
   - Fix: Ensure referenced table exists in the schema

5. **Empty Table**: "Table 'tablename' has no columns"
   - Fix: Every table must have at least one column

6. **Duplicate Column Names**: "Duplicate column name 'columnname'"
   - Fix: Column names must be unique within a table

7. **Invalid Type Parameters**: "Invalid size parameter"
   - Fix: Use correct format like `varchar(255)`, not `varchar()` or `varchar(abc)`

## Mapping UI Elements to JSON

### Visual Table → JSON Table
- Table name in UI → `table.name`
- Table position → `table.display.position`
- Table size → `table.display.size`

### Visual Column → JSON Column
- Column name → `column.name`
- Data type dropdown → `column.type`
- "Nullable" checkbox → `column.nullable`
- "Primary Key" indicator → `column.primary_key: true` (MUST be set!)
- "Auto Increment" checkbox → `column.auto_increment`
- Default value field → `column.default`

### Visual Relationship → JSON Foreign Key

**CRITICAL: Understanding Arrow Direction**

When drawing relationship arrows in the diagram:
- **Source table**: The table where the arrow STARTS (usually has the primary key)
- **Target table**: The table where the arrow ENDS (usually has the foreign key column)

**The Golden Rule**: 
> **Arrows FROM a primary key TO foreign columns mean the foreign key should be created on the TARGET table**

**Example**:
- Arrow FROM `users.id` TO `posts.user_id`
- This means: "posts.user_id references users.id"
- The foreign key goes in the `posts` table (target), NOT the `users` table (source)

**Correct Interpretation**:
```
Visual: users.id ──────→ posts.user_id

JSON: Add to posts.foreign_keys:
{
  "name": "fk_posts_user_id",
  "column": "user_id",        // Column in TARGET table (posts)
  "references": {
    "table": "users",         // SOURCE table
    "column": "id"            // Column in SOURCE table
  }
}
```

**Common Mistake**:
Don't put the foreign key on the source table! The arrow indicates which table DEPENDS ON the other, and dependencies are represented by foreign keys on the dependent (target) table.

**Mapping Rules**:
- Arrow START point → Referenced table/column (`references.table` and `references.column`)
- Arrow END point → Table that gets the foreign key and the local column (`column`)
- Delete rule → `foreign_key.on_delete`
- Update rule → `foreign_key.on_update`

## Important Notes for Front-End Implementation

1. **Always validate primary keys**: Every table MUST have exactly one primary key
2. **Set nullable correctly**: Primary keys must have `nullable: false`
3. **Handle defaults carefully**: String defaults need quotes, numeric defaults don't
4. **Preserve column order**: The order in the `columns` array matters for some use cases
5. **Use consistent naming**: Follow SQL identifier rules for all names

## Testing Your JSON

You can validate your generated JSON by:
1. Checking it matches the structure in this document
2. Comparing against the example files in `example_jsons/`
3. Running it through the backend validator

Remember: The most common error is forgetting to set `"primary_key": true` on the primary key column!