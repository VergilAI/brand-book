# Design Token Version Management

A comprehensive system for managing design token versions, migrations, and compatibility across the Vergil Design System.

## 🎯 Overview

The version management system provides:

- **Immutable version archives** - Complete snapshots of token systems
- **Semantic versioning** - Clear versioning with breaking change detection  
- **Automated migrations** - Scripts and guides for version transitions
- **Compatibility matrices** - Clear upgrade/downgrade paths
- **Development workflow** - Active development with staging and validation

## 📁 Directory Structure

```
design-tokens/
├── versions/                   # Immutable version archives
│   ├── v1.0.0/                # Legacy CSS system
│   │   ├── metadata.json      # Version metadata
│   │   ├── tokens/            # Source tokens
│   │   ├── build/             # Generated outputs  
│   │   └── migration/         # Migration guides
│   ├── v2.0.0/                # YAML system launch
│   └── v2.1.0/                # Next stable release
├── active/                     # Current development
│   ├── source/                # Active token development
│   ├── build/                 # Development builds
│   ├── metadata.json          # Development metadata
│   └── CHANGELOG.md           # Development log
├── migration/                  # Migration staging
│   ├── staging/               # Active migration work
│   ├── templates/             # Migration templates
│   └── scripts/               # Migration automation
└── lib/                       # Version management utilities
    ├── version-metadata.ts    # Metadata types & utilities
    └── breaking-change-detector.ts  # Change analysis
```

## 🚀 Quick Start

### List All Versions
```bash
npm run version:list
```

### View Version Details
```bash
npm run version:info 2.0.0
```

### Compare Versions
```bash
npm run version:diff 1.0.0 2.0.0
```

### Check for Breaking Changes
```bash
npm run version:check-breaking 2.0.0 active
```

### Create New Version
```bash
npm run version:create --version 2.1.0
```

## 📋 Version Lifecycle

### 1. Development Phase
- Work in `/design-tokens/active/`
- Make changes to source YAML files
- Build and validate frequently
- Update development changelog

```bash
# Development workflow
npm run build:tokens           # Build tokens
npm run validate-tokens        # Validate syntax
npm run scan:hardcoded        # Check for hardcoded values
npm run report:coverage       # Generate coverage report
```

### 2. Pre-Release Validation
- Run comprehensive validation
- Check for breaking changes
- Test with real components
- Generate migration guides

```bash
# Pre-release validation
npm run version:check-breaking 2.0.0 active
npm run test:tokens
npm run report:all
```

### 3. Version Creation
- Create immutable version archive
- Generate all platform outputs
- Create migration artifacts
- Update active development

```bash
# Create stable release
npm run version:create --version 2.1.0

# Create beta release  
npm run version:create --version 2.1.0-beta.1
```

### 4. Post-Release
- Version becomes immutable
- Migration paths established
- Documentation updated
- Community notified

## 🔄 Migration System

### Migration Types

**Safe Migrations:**
- Token additions (new tokens)
- Non-breaking value refinements
- Documentation updates

**Breaking Migrations:**
- Token removals
- Token renames
- Significant value changes
- Structure reorganization

### Migration Workflow

1. **Analysis Phase**
   ```bash
   npm run version:diff 2.0.0 2.1.0
   ```

2. **Migration Development**
   ```bash
   npm run migration:init --from 2.0.0 --to 2.1.0
   npm run migration:generate-script 2.0.0 2.1.0
   ```

3. **Testing Phase**
   ```bash
   npm run migration:test 2.0.0 2.1.0
   npm run migration:validate 2.0.0 2.1.0
   ```

4. **Documentation**
   ```bash
   npm run migration:generate-guide 2.0.0 2.1.0
   ```

### Automated Migration Scripts

```javascript
// Example migration script
module.exports = {
  name: "v2.0.0 to v2.1.0",
  transforms: [
    {
      type: "rename",
      from: "colors.legacy.cosmic-purple",
      to: "colors.brand.purple"
    },
    {
      type: "value-change", 
      token: "colors.brand.purple",
      from: "#6366F1",
      to: "#7B00FF",
      reason: "Brand color update"
    }
  ]
}
```

## 📊 Breaking Change Detection

The system automatically detects breaking changes:

### Breaking Change Types
- **Token Removal** - Any token deleted
- **Token Rename** - Name changes (automatable)
- **Value Change** - Significant visual changes
- **Structure Change** - Hierarchy modifications
- **Format Change** - Output format updates

### Impact Assessment
- **Critical** - Major visual or functional impact
- **High** - Noticeable changes requiring testing
- **Medium** - Minor adjustments needed
- **Low** - Minimal impact

### Effort Estimation
- **Extensive** - Major refactoring required
- **High** - Significant development time
- **Medium** - Moderate changes needed
- **Low** - Quick fixes
- **Minimal** - Automated migration available

## 🔧 Advanced Usage

### Custom Version Creation

```typescript
import { VersionManager } from '../scripts/version-manager';

const manager = new VersionManager();

// Create custom version with metadata
await manager.createVersion('2.1.0', {
  description: 'Enhanced accessibility features',
  force: false,
  dryRun: false
});
```

### Migration Scripting

```typescript
import { BreakingChangeDetector } from '../lib/breaking-change-detector';

// Analyze changes between versions
const analysis = BreakingChangeDetector.analyzeChanges(
  oldTokens, 
  newTokens, 
  '2.0.0', 
  '2.1.0'
);

console.log(`Breaking changes: ${analysis.breakingChanges.length}`);
console.log(`Impact level: ${analysis.summary.impactLevel}`);
```

### Version Activation

```bash
# Switch active development to different version
npm run version:activate 2.0.0 --force

# Backup is automatically created
# Active becomes v2.1.0-dev based on v2.0.0
```

## 📈 Compatibility Matrix

### Version Compatibility

| From/To | v1.0.0 | v2.0.0 | v2.1.0 |
|---------|--------|--------|--------|
| v1.0.0  | ✅     | ⚠️ Breaking | ❌ Major |
| v2.0.0  | ❌     | ✅      | ✅ Safe |
| v2.1.0  | ❌     | ⬇️ Possible | ✅     |

### Platform Support

| Version | CSS | SCSS | JS/TS | Tailwind | Figma |
|---------|-----|------|-------|----------|--------|
| v1.0.0  | ✅  | ❌   | ❌    | ✅       | ❌     |
| v2.0.0  | ✅  | ✅   | ✅    | ✅       | 🚧     |
| v2.1.0  | ✅  | ✅   | ✅    | ✅       | ✅     |

## 🎨 Design Token Categories

### Tracked Categories
- **Colors** - Brand, neutral, functional, gradients
- **Typography** - Fonts, sizes, weights, spacing
- **Spacing** - Margins, padding, gaps, radii
- **Animations** - Durations, easings, keyframes
- **Shadows** - Elevations, brand shadows, effects

### Token Organization
```yaml
colors:
  brand:           # Primary brand colors
  neutral:         # Grayscale palette  
  functional:      # Success, error, warning, info
  semantic:        # Context-specific aliases
  legacy:          # Deprecated tokens
```

## 🔍 Validation & Quality

### Validation Rules
- **Syntax** - Valid YAML structure
- **References** - No broken token references
- **Accessibility** - Contrast ratios meet WCAG
- **Consistency** - Naming conventions followed
- **Performance** - Token count within limits

### Quality Metrics
- Token coverage across components
- Platform compatibility score
- Migration effort assessment
- Breaking change frequency
- Documentation completeness

## 📚 Examples

### Version Creation Example

```bash
# Create development version
npm run version:create --version 2.1.0-alpha.1

# Create stable release
npm run version:create --version 2.1.0

# Force overwrite existing version
npm run version:create --version 2.1.0 --force

# Dry run to see what would happen
npm run version:create --version 2.1.0 --dry-run
```

### Migration Example

```bash
# Start migration development
npm run migration:init --from 2.0.0 --to 2.1.0

# Test migration locally
npm run migration:test 2.0.0 2.1.0

# Validate migration results
npm run migration:validate 2.0.0 2.1.0

# Generate migration report
npm run migration:report 2.0.0 2.1.0
```

### Comparison Example

```bash
# Compare any two versions
npm run version:diff 1.0.0 2.0.0

# Compare with active development
npm run version:diff 2.0.0 active

# Check only for breaking changes
npm run version:check-breaking 2.0.0 active
```

## 🚨 Best Practices

### Version Planning
1. **Plan breaking changes** for major versions
2. **Batch related changes** together
3. **Provide deprecation warnings** before removal
4. **Test migrations** on real codebases
5. **Document everything** thoroughly

### Development Workflow
1. **Work in active directory** only
2. **Validate frequently** during development
3. **Update changelog** with significant changes
4. **Test breaking changes** before version creation
5. **Coordinate with design team** on visual changes

### Migration Strategy
1. **Automate what's possible** (renames, simple changes)
2. **Provide clear guidance** for manual changes
3. **Test thoroughly** with visual regression
4. **Support gradual adoption** with compatibility layers
5. **Monitor adoption** and provide help

## 🆘 Troubleshooting

### Common Issues

**Version creation fails:**
```bash
# Check token validation
npm run validate-tokens

# Check for syntax errors  
npm run build:tokens

# Force creation if needed
npm run version:create --version 2.1.0 --force
```

**Migration errors:**
```bash
# Check version exists
npm run version:list

# Validate tokens in both versions
npm run version:info 2.0.0
npm run version:info 2.1.0
```

**Active development corrupted:**
```bash
# Restore from version
npm run version:activate 2.0.0

# Check backup directories
ls design-tokens/active/backup-*
```

### Support Resources
- [Design System Documentation](../README.md)
- [Token Validation Guide](./validation.md)
- [Migration Templates](./migration/templates/)
- [GitHub Issues](https://github.com/VergilAI/brand-book/issues)

---

*Generated: ${new Date().toISOString()}*
*Version Management System v1.0.0*