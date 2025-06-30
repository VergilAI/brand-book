# Migration Templates

Reusable templates for common migration scenarios in the design token system.

## Template Types

### 1. Token Rename Template
For simple token name changes with the same values.

### 2. Value Change Template  
For tokens that keep the same name but change values.

### 3. Structure Reorganization Template
For major changes to token hierarchy.

### 4. Breaking Change Template
For removals and major breaking changes.

### 5. Addition Template
For new token additions (typically non-breaking).

## Usage

Templates are used by the migration system to generate migration scripts and guides automatically.

```bash
# Generate migration from template
npm run migration:generate --template token-rename --from 2.0.0 --to 2.1.0
```

Each template includes:
- **Script template** - Automated migration logic
- **Guide template** - Human-readable instructions  
- **Test template** - Validation and testing scenarios
- **Metadata template** - Migration classification and impact