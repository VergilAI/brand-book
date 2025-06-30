# Active Design Tokens

This directory contains the current development version of design tokens. This is where all active development happens.

## Directory Structure

```
active/
├── source/                     # Source token files (YAML)
├── build/                      # Generated outputs (CSS, JS, etc.)
├── metadata.json               # Current version metadata
├── CHANGELOG.md                # Development changelog
└── README.md                   # This file
```

## Development Workflow

1. **Edit source tokens** in `source/` directory
2. **Build outputs** with `npm run build:tokens`
3. **Validate changes** with `npm run validate-tokens`
4. **Test in components** with development server
5. **Create version** when ready for release

## Active Version

The active directory always represents the next version to be released. The current development version is tracked in `metadata.json`.

## Source Files

- **tokens.yaml** - Main entry point and metadata
- **colors.yaml** - Color system definitions
- **typography.yaml** - Typography scale and styles
- **spacing.yaml** - Spacing and layout tokens
- **animations.yaml** - Motion and timing definitions
- **shadows.yaml** - Elevation and depth system

## Build Outputs

Generated files are automatically created in `build/`:

- **tokens.css** - CSS custom properties
- **tokens.scss** - Sass variables
- **tokens.js** - JavaScript/TypeScript exports
- **tokens.json** - Raw token data
- **tailwind-theme.js** - Tailwind CSS configuration

## Validation

Before committing changes:

```bash
# Validate token syntax and structure
npm run validate-tokens

# Check for breaking changes
npm run version:check-breaking

# Scan for hardcoded values that should use tokens
npm run scan:hardcoded

# Generate coverage report
npm run report:coverage
```

## Creating a New Version

When ready to release the current active development:

```bash
# Create a new version (will prompt for version number)
npm run version:create

# Or specify version directly
npm run version:create --version 2.2.0
```

This will:
1. Validate all tokens
2. Detect breaking changes
3. Generate all build outputs
4. Create immutable version archive
5. Update active to next development version

## Migration Staging

Use the `../migration/` directory to stage and test migrations before version creation:

```bash
# Test migration from specific version
npm run migration:test v2.1.0 v2.2.0

# Preview migration changes
npm run migration:preview
```