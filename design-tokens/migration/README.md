# Migration Staging Area

This directory is used for staging and testing migrations between design token versions. It provides a safe space to develop and validate migration strategies before creating new versions.

## Directory Structure

```
migration/
├── staging/                    # Active migration work
│   ├── from-v2.0.0/           # Migration artifacts from specific version
│   │   ├── diff.json          # Detailed changes
│   │   ├── breaking-changes.json  # Breaking change analysis
│   │   ├── migration-script.js     # Automated migration script
│   │   └── guide.md           # Human-readable migration guide
│   └── to-v2.1.0/             # Migration targets
├── templates/                  # Reusable migration templates
├── scripts/                    # Migration automation scripts
└── README.md                   # This file
```

## Migration Development Workflow

### 1. Start Migration Development
```bash
# Initialize migration between versions
npm run migration:init --from v2.0.0 --to v2.1.0
```

This creates:
- Staging directory for the migration
- Diff analysis between versions
- Breaking change detection
- Template migration script

### 2. Develop Migration Strategy
```bash
# Analyze differences
npm run migration:analyze v2.0.0 v2.1.0

# Generate migration script template
npm run migration:generate-script v2.0.0 v2.1.0

# Test migration locally
npm run migration:test v2.0.0 v2.1.0
```

### 3. Validate Migration
```bash
# Run migration validation
npm run migration:validate v2.0.0 v2.1.0

# Check backward compatibility
npm run migration:check-compat v2.0.0 v2.1.0

# Generate migration report
npm run migration:report v2.0.0 v2.1.0
```

## Migration Types

### 1. Safe Migrations
- **Token additions** - New tokens that don't conflict
- **Value refinements** - Small adjustments that don't break layouts
- **Documentation updates** - Comments and metadata changes

### 2. Breaking Migrations
- **Token removals** - Deprecated tokens being removed
- **Token renames** - Name changes requiring find/replace
- **Value changes** - Significant color/spacing/typography changes
- **Structure changes** - Token hierarchy reorganization

### 3. Complex Migrations
- **System overhauls** - Major design system changes
- **Platform changes** - New output formats or build processes
- **Tooling changes** - Build script or validation changes

## Migration Artifacts

### diff.json
Complete technical diff between versions:
```json
{
  "added": [...],
  "removed": [...],
  "changed": [...],
  "renamed": [...]
}
```

### breaking-changes.json
Breaking change analysis:
```json
{
  "breakingChanges": [
    {
      "type": "removed",
      "token": "colors.legacy.cosmic-purple",
      "impact": "high",
      "affectedFiles": [...],
      "migrationPath": "..."
    }
  ]
}
```

### migration-script.js
Automated migration script:
```javascript
module.exports = {
  name: "v2.0.0 to v2.1.0",
  transforms: [
    {
      type: "rename",
      from: "cosmic-purple",
      to: "vergil-purple"
    }
  ]
}
```

### guide.md
Human-readable migration guide with:
- Overview of changes
- Step-by-step migration instructions
- Code examples
- Common pitfalls
- Testing recommendations

## Testing Migrations

### Automated Testing
```bash
# Run all migration tests
npm run migration:test-all

# Test specific migration
npm run migration:test v2.0.0 v2.1.0

# Validate migration output
npm run migration:validate-output
```

### Manual Testing
1. **Create test branch** from target codebase
2. **Apply migration script** to test files
3. **Build and test** application
4. **Visual regression testing** with Storybook
5. **Document issues** and refine migration

## Best Practices

### 1. Plan Breaking Changes
- **Batch breaking changes** into major versions
- **Provide deprecation warnings** in minor versions
- **Create comprehensive migration guides**
- **Test migrations on real codebases**

### 2. Automate What's Possible
- **Token renames** can be automated with find/replace
- **Value changes** need manual review and testing
- **Structure changes** require custom migration logic

### 3. Document Everything
- **Clear migration instructions** for developers
- **Examples** of before/after code
- **Timeline** for deprecation and removal
- **Support channels** for migration help

### 4. Validate Thoroughly
- **Automated tests** for migration scripts
- **Visual regression tests** for UI changes
- **Performance impact** assessment
- **Accessibility** validation after migration