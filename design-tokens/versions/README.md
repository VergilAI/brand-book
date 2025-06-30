# Design Token Versions

This directory contains immutable archives of all design token versions. Each version is a complete snapshot of the design system at a specific point in time.

## Directory Structure

```
versions/
├── v1.0.0/                     # Legacy CSS-based system
│   ├── metadata.json           # Version metadata and compatibility info
│   ├── tokens/                 # Source tokens for this version
│   ├── build/                  # Generated outputs
│   └── migration/              # Migration guides from this version
├── v2.0.0/                     # YAML-based system launch
├── v2.1.0/                     # Next stable release
└── README.md                   # This file
```

## Version Metadata

Each version directory contains:

- **metadata.json** - Version info, breaking changes, compatibility matrix
- **tokens/** - Source token files for this version
- **build/** - All generated platform outputs
- **migration/** - Migration guides and scripts

## Version Naming

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR.MINOR.PATCH** for stable releases
- **MAJOR.MINOR.PATCH-alpha.N** for alpha releases
- **MAJOR.MINOR.PATCH-beta.N** for beta releases
- **MAJOR.MINOR.PATCH-rc.N** for release candidates

### Breaking Changes

A breaking change is defined as:

1. **Token removal** - Any token that existed in a previous version is removed
2. **Token rename** - A token's name changes (value can be the same)
3. **Value change** - A token's value changes in a way that affects visual output
4. **Structure change** - Token hierarchy or organization changes
5. **Platform format change** - Generated output format changes

## Compatibility Matrix

Each version includes a compatibility matrix showing:

- Which versions can be safely upgraded to
- Which migrations are available
- Breaking change impact assessment
- Rollback compatibility

## Usage

### List all versions
```bash
npm run version:list
```

### Compare versions
```bash
npm run version:diff v2.0.0 v2.1.0
```

### Check for breaking changes
```bash
npm run version:check-breaking v2.0.0 v2.1.0
```

### View version details
```bash
npm run version:info v2.1.0
```

## Archive Policy

- **Never modify** version directories once created
- **Never delete** version directories
- **Always preserve** complete build outputs
- **Always include** migration paths to next version