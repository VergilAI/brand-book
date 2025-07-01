# Vergil Design System - Versioning System Documentation

## 📚 Overview

The Vergil Design System uses a sophisticated versioning system to manage design tokens across different releases, track breaking changes, and provide smooth migration paths. This system ensures that changes to the design system are predictable, traceable, and backwards-compatible when needed.

## 🏗️ Architecture

### Directory Structure
```
design-tokens/
├── active/                     # Current development version
│   ├── source/                 # YAML token definitions
│   │   ├── colors.yaml
│   │   ├── spacing.yaml
│   │   ├── typography.yaml
│   │   └── ...
│   └── metadata.json          # Version metadata
├── versions/                  # Archived versions
│   ├── v1.0.0/
│   │   ├── source/
│   │   ├── generated/
│   │   └── metadata.json
│   └── v2.0.0/
│       ├── source/
│       ├── generated/
│       └── metadata.json
└── version-config.json        # Global version configuration
```

### Key Components

1. **Active Directory**: Where all current development happens
2. **Version Archives**: Immutable snapshots of released versions
3. **Metadata Tracking**: Comprehensive information about each version
4. **Migration Rules**: Automated transformations between versions

## 🚀 How to Use Versioning

### Daily Development Workflow

1. **All token changes go in the active directory**:
   ```bash
   # Edit tokens in:
   /design-tokens/active/source/colors.yaml
   ```

2. **Build tokens from active source**:
   ```bash
   npm run build:tokens
   ```

3. **Check current version**:
   ```bash
   npm run version:info
   ```

### Creating a New Version

When you're ready to release a new version of the design system:

1. **Review current changes**:
   ```bash
   npm run version:diff           # Compare with last release
   ```

2. **Create the version**:
   ```bash
   npm run version:create
   ```
   
   This will prompt you for:
   - Version type (major/minor/patch)
   - Breaking changes description
   - Migration notes

3. **What happens automatically**:
   - Current active tokens are archived to `/versions/vX.X.X/`
   - Version number is incremented
   - Metadata is generated with timestamps and change tracking
   - Active directory is prepared for next development cycle

### Version Commands

```bash
# List all versions
npm run version:list

# Get info about current version
npm run version:info

# Create a new version
npm run version:create

# Compare versions
npm run version:diff v2.0.0

# Check for breaking changes
npm run version:check-breaking

# Activate a specific version (for testing)
npm run version:activate v2.0.0
```

## 📋 Version Metadata

Each version contains a `metadata.json` file with:

```json
{
  "version": "2.1.0",
  "createdAt": "2025-06-30T23:49:12.345Z",
  "createdBy": "system",
  "status": "active",
  "description": "Added new semantic color system",
  "breakingChanges": [
    {
      "type": "removed",
      "tokens": ["colors.primary"],
      "migration": "Use colors.brand.purple instead"
    }
  ],
  "stats": {
    "totalTokens": 256,
    "tokensByCategory": {
      "colors": 89,
      "spacing": 24,
      "typography": 45
    }
  },
  "compatibility": {
    "minimumVersion": "2.0.0",
    "deprecations": []
  }
}
```

## 🔄 Migration System

### How Migrations Work

1. **Extraction Phase**: Analyzes codebase for token usage
2. **Review Phase**: Maps old tokens to new tokens
3. **Validation Phase**: Ensures all mappings are correct
4. **Application Phase**: Applies changes across codebase

### Migration Commands

```bash
# Full migration pipeline
npm run migrate:full-pipeline

# Individual steps
npm run migrate:extract        # Find all token usage
npm run migrate:review         # Review and map tokens
npm run migrate:validate       # Validate mappings
npm run migrate:apply          # Apply changes

# Check migration status
npm run migrate:status

# Rollback if needed
npm run migrate:rollback
```

### Migration Rules

Migration rules are stored in `migration-rules.json`:

```json
{
  "colorMappings": {
    "#7B00FF": "colors.brand.purple",
    "rgb(123, 0, 255)": "colors.brand.purple"
  },
  "renameMappings": {
    "colors.primary": "colors.brand.purple",
    "spacing.xs": "spacing.1"
  }
}
```

## 🛡️ Version Safety Features

### 1. **Immutable Archives**
Once a version is created, it cannot be modified. This ensures:
- Reproducible builds
- Reliable rollbacks
- Clear audit trail

### 2. **Breaking Change Detection**
The system automatically detects:
- Removed tokens
- Renamed tokens
- Type changes
- Value changes that might break layouts

### 3. **Compatibility Tracking**
Each version specifies:
- Minimum compatible version
- Deprecation warnings
- Migration paths

## 📊 Version Comparison

Use the diff command to see changes between versions:

```bash
npm run version:diff v2.0.0

# Output:
Version Comparison: v2.0.0 → v2.1.0-dev

Added Tokens (12):
  + colors.semantic.success
  + colors.semantic.warning
  + spacing.scale.18

Removed Tokens (3):
  - colors.status.green
  - colors.status.yellow
  - spacing.custom.header

Modified Tokens (5):
  ~ colors.brand.purple: #7C00FF → #7B00FF
  ~ spacing.scale.4: 16px → 1rem
```

## 🏷️ Version Numbering

We follow Semantic Versioning (SemVer):

- **Major (X.0.0)**: Breaking changes, requires migration
- **Minor (0.X.0)**: New features, backwards compatible
- **Patch (0.0.X)**: Bug fixes, no API changes

Development versions append `-dev`:
- `2.1.0-dev` - Current development version
- `2.1.0` - Released version

## 🚨 Important Notes

### For Development

1. **ALWAYS work in `/design-tokens/active/source/`**
   - Never modify versioned archives
   - Never edit the legacy `/design-tokens/source/` (if it exists)

2. **Build Process**
   - The build script reads from active directory
   - Generated files go to `/generated/`
   - Version number is embedded in generated files

3. **Testing Changes**
   - Make changes in active directory
   - Run `npm run build:tokens`
   - Test in your components
   - Create version when ready

### For Releases

1. **Pre-release Checklist**
   - Run `npm run version:check-breaking`
   - Document migration paths
   - Test with sample components
   - Update CHANGELOG

2. **Post-release**
   - Version is automatically archived
   - Active directory ready for next cycle
   - Old version remains accessible

## 🔧 Implementation Details

### Version Manager (`scripts/version-manager.ts`)

The version manager handles:
- Creating new versions
- Archiving current state
- Updating version numbers
- Generating metadata
- Managing compatibility

### Key Functions

```typescript
// Create a new version
createVersion(type: 'major' | 'minor' | 'patch')

// Compare versions
compareVersions(v1: string, v2: string)

// Check breaking changes
detectBreakingChanges(oldTokens: TokenSet, newTokens: TokenSet)

// Generate migration rules
generateMigrationRules(changes: VersionChanges)
```

### Token Build Integration

The build process (`scripts/build-tokens.ts`):
1. Reads from `/design-tokens/active/source/`
2. Embeds version number in output
3. Generates multiple formats (CSS, TS, JSON, SCSS)
4. Maintains version consistency

## 📈 Benefits of This System

1. **Predictable Releases**: Clear versioning and migration paths
2. **Safe Experimentation**: Work in active without affecting releases
3. **Easy Rollbacks**: Previous versions always available
4. **Clear History**: Track what changed and why
5. **Automated Migrations**: Tools to update codebases
6. **Team Collaboration**: Everyone knows the current version

## 🎯 Best Practices

1. **Commit Often**: Version control tracks fine-grained changes
2. **Document Changes**: Use descriptive messages when creating versions
3. **Test Migrations**: Always test on a sample before applying broadly
4. **Version Regularly**: Don't let too many changes accumulate
5. **Communicate Breaks**: Notify team of breaking changes early

## 🆘 Troubleshooting

### Common Issues

1. **"Token not found" after build**
   - Ensure you're editing in `/design-tokens/active/source/`
   - Run `npm run build:tokens` after changes
   - Check for typos in token references

2. **Version creation fails**
   - Ensure git working directory is clean
   - Check for proper permissions
   - Verify no processes are locking files

3. **Migration misses some files**
   - Update file patterns in migration config
   - Check for custom token usage patterns
   - Run extraction with broader search

### Getting Help

- Run `npm run version:info` for current state
- Check `version-config.json` for configuration
- Review metadata.json in each version directory
- See migration logs in `/reports/migration/`