const fs = require('fs');
const path = require('path');

// Read and parse CSV
const csvPath = '/Users/danielpapp/Downloads/vergil_demo_db_v2.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Parse CSV headers
const headers = lines[0].split(',');

// Parse all rows
const rows = lines.slice(1).map(line => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  const row = {};
  headers.forEach((header, index) => {
    row[header] = values[index] || '';
  });
  return row;
});

// Extract tables (entities)
const tables = [];
const tableIdMap = {}; // Map LucidChart IDs to table names

rows.forEach(row => {
  if (row['Shape Library'] === 'Entity Relationship' && row.Name.includes('Entity')) {
    const tableId = row.Id;
    const tableName = row['Text Area 1'].toLowerCase().replace(/\s+/g, '_');
    
    tableIdMap[tableId] = tableName;
    
    // Parse columns from text areas
    const columns = [];
    let i = 2;
    
    while (i <= 40) { // Check up to Text Area 40
      const keyArea = row[`Text Area ${i}`]?.trim() || '';
      const nameArea = row[`Text Area ${i + 1}`]?.trim() || '';
      const typeArea = row[`Text Area ${i + 2}`]?.trim() || '';
      
      // Skip completely empty entries
      if (!keyArea && !nameArea && !typeArea) {
        i++;
        if (i > 40 || (!row[`Text Area ${i}`] && !row[`Text Area ${i + 1}`] && !row[`Text Area ${i + 2}`])) {
          break;
        }
        continue;
      }
      
      // Handle different patterns in the CSV
      if ((keyArea || keyArea === '') && nameArea && typeArea) {
        // Standard pattern: key, name, type
        const mappedType = mapDataType(typeArea);
        if (!mappedType) {
          i += 3;
          continue; // Skip if type mapping returns null
        }
        
        const column = {
          name: nameArea,
          type: mappedType,
          nullable: !keyArea.includes('PK'), // Primary keys are not nullable
          primary_key: keyArea.includes('PK')
        };
        
        // Handle auto-increment for id columns
        if (nameArea === 'id' && keyArea.includes('PK')) {
          column.auto_increment = true;
        }
        
        // Handle defaults
        if (nameArea === 'created_at' || nameArea === 'updated_at' || nameArea === 'last_updated' || nameArea === 'earned_at' || nameArea === 'time_of_interaction') {
          column.default = 'CURRENT_TIMESTAMP';
        } else if (typeArea === 'bool' && nameArea.includes('veracity')) {
          column.default = 'false';
        }
        
        columns.push(column);
        i += 3;
      } else if (!keyArea && nameArea && typeArea) {
        // Pattern without key: empty, name, type
        const column = {
          name: nameArea,
          type: mapDataType(typeArea),
          nullable: true,
          primary_key: false
        };
        
        // Handle defaults
        if (nameArea === 'created_at' || nameArea === 'updated_at' || nameArea === 'last_updated') {
          column.default = 'CURRENT_TIMESTAMP';
        }
        
        columns.push(column);
        i += 3;
      } else {
        // Try next position
        i++;
      }
    }
    
    tables.push({
      lucidId: tableId,
      name: tableName,
      columns: columns,
      foreign_keys: []
    });
  }
});

// Extract relationships
const relationships = [];
rows.forEach(row => {
  if (row.Name === 'Line' && row['Line Source'] && row['Line Destination']) {
    const sourceId = row['Line Source'];
    const destId = row['Line Destination'];
    const sourceArrow = row['Source Arrow'];
    const destArrow = row['Destination Arrow'];
    
    // In ERD notation: One arrow = 1, Many arrow = many
    // The many side gets the foreign key
    if (sourceArrow === 'CFN ERD One Arrow' && destArrow === 'CFN ERD Many Arrow') {
      relationships.push({
        fromTable: sourceId,
        toTable: destId,
        type: 'one-to-many'
      });
    }
  }
});

// Map foreign keys to tables based on relationships
relationships.forEach(rel => {
  const fromTableName = tableIdMap[rel.fromTable];
  const toTableName = tableIdMap[rel.toTable];
  
  if (!fromTableName || !toTableName) return;
  
  const toTable = tables.find(t => t.name === toTableName);
  const fromTable = tables.find(t => t.name === fromTableName);
  
  if (!toTable || !fromTable) return;
  
  // Find the foreign key column in the target table
  let fkColumn = null;
  let referencedColumn = 'id'; // Default to id
  
  // Special case: self-referencing relationships
  if (fromTableName === toTableName) {
    // For user table self-reference, it's manager_id
    toTable.columns.forEach(col => {
      if (col.name === 'manager_id' || col.name === 'source_knowledge_point_id' || col.name === 'target_knowledge_point_id') {
        fkColumn = col.name;
      }
    });
  } else {
    // Look for explicit FK columns
    toTable.columns.forEach(col => {
      // Check if column name suggests it's a foreign key to the source table
      if (col.name === `${fromTableName}_id` || 
          col.name === `${fromTableName.slice(0, -1)}_id` ||
          (fromTableName === 'user' && col.name.includes('user_id')) ||
          (fromTableName === 'knowledge_point' && col.name.includes('knowledge_point_id')) ||
          (fromTableName === 'course' && col.name === 'course_id') ||
          (fromTableName === 'chapter' && col.name === 'chapter_id') ||
          (fromTableName === 'lesson' && col.name === 'lesson_id') ||
          (fromTableName === 'achievement' && col.name === 'achievement_id') ||
          (fromTableName === 'role' && col.name === 'role_id') ||
          (fromTableName === 'multiple_choice' && col.name === 'multiple_choice_id') ||
          (fromTableName === 'question_and_answer' && col.name === 'question_and_answer_id') ||
          (fromTableName === 'connect_the_cards' && col.name === 'connect_the_cards_id')) {
        fkColumn = col.name;
      }
    });
  }
  
  if (fkColumn) {
    toTable.foreign_keys.push({
      name: `fk_${toTableName}_${fkColumn}`,
      column: fkColumn,
      references: {
        table: fromTableName,
        column: referencedColumn
      },
      on_delete: 'CASCADE',
      on_update: 'CASCADE'
    });
  }
});

// Calculate positions for visual layout
const TABLES_PER_ROW = 4;
const TABLE_WIDTH = 300;
const TABLE_HEIGHT_BASE = 200;
const TABLE_SPACING_X = 350;
const TABLE_SPACING_Y = 300;
const MARGIN = 50;

tables.forEach((table, index) => {
  const row = Math.floor(index / TABLES_PER_ROW);
  const col = index % TABLES_PER_ROW;
  
  const height = TABLE_HEIGHT_BASE + (table.columns.length * 30);
  
  table.display = {
    position: {
      x: MARGIN + (col * TABLE_SPACING_X),
      y: MARGIN + (row * TABLE_SPACING_Y)
    },
    size: {
      width: TABLE_WIDTH,
      height: height
    },
    zIndex: index + 1
  };
});

// Helper function to map LucidChart types to our types
function mapDataType(type) {
  const typeMap = {
    'uuid': 'uuid',
    'str': 'varchar(255)',
    'text': 'text',
    'texts': 'text',
    'int': 'integer',
    'decimal': 'decimal(10,2)',
    'decimal ': 'decimal(10,2)', // Handle trailing space
    'bool': 'boolean',
    'date': 'date',
    'timestamp': 'timestamp',
    'json': 'json',
    'float (0-1)': 'decimal(3,2)',
    'int / null': 'integer'
  };
  
  // Handle types with parameters
  if (type && type.includes('not a field')) {
    return null; // Skip view fields
  }
  
  return typeMap[type] || 'varchar(255)';
}

// Generate final JSON structure
const schema = {
  metadata: {
    name: 'Vergil Demo Database v2',
    dialect: 'postgresql',
    version: '1.0'
  },
  tables: tables.map(({ lucidId, ...table }) => table) // Remove lucidId from final output
};

// Write to file
const outputPath = path.join(__dirname, '../db_dummy_data/vergil-demo-db-v2.json');
fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

console.log(`Successfully converted to ${outputPath}`);
console.log(`Total tables: ${tables.length}`);
console.log(`Total relationships: ${relationships.length}`);