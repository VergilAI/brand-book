# Vergil Design System - Storybook Integration

This comprehensive Storybook integration provides advanced version visualization and management capabilities for the Vergil Design System. It includes interactive token browsing, automated migration tools, and rich documentation features.

## Features Overview

### 🔄 Version Management
- **Version Switcher Addon**: Top-level version dropdown in Storybook toolbar
- **URL-based Version Selection**: Shareable links with version state
- **Breaking Change Indicators**: Visual alerts for breaking changes
- **Migration Guides**: Step-by-step migration instructions with code examples

### 🎨 Token Visualization
- **TokenSwatch**: Individual token display with usage rules and examples
- **TokenGrid**: Organized layouts with search and filtering
- **Interactive Browser**: Advanced token exploration with live preview
- **Code Generation**: Automatic CSS variable and JSON export

### 📊 Comparison Tools
- **VersionComparison**: Side-by-side and overlay comparison modes
- **MigrationTable**: Detailed token migration mapping
- **Visual Regression**: Before/after comparisons for design changes

### 🔍 Interactive Features
- **Advanced Search**: Search by name, value, usage, or tags
- **Category Filtering**: Filter by color, typography, spacing, etc.
- **Tag System**: Flexible tagging for better organization
- **Live Preview**: See tokens applied to real UI components
- **Hot Reload**: Automatic updates when tokens change

## File Structure

```
components/storybook/
├── TokenSwatch/           # Individual token display
├── TokenGrid/             # Grid layout with filtering
├── MigrationTable/        # Migration mapping display
├── VersionComparison/     # Side-by-side comparisons
├── TokenBrowser/          # Interactive token explorer
├── VersionMetadata/       # Version information display
└── index.ts              # Main exports

.storybook/
├── addons/
│   ├── version-switcher.ts      # Panel addon for version selection
│   └── toolbar-version-switcher.ts  # Toolbar addon for quick switching
├── main.ts               # Storybook configuration
└── preview.tsx           # Global decorators and parameters

stories/
├── tokens/
│   └── ColorTokens.stories.tsx     # Version-aware color stories
├── TokenBrowser.stories.tsx        # Interactive browser demos
├── VersionManagement.stories.tsx   # Version metadata and migration
├── ComprehensiveTokenSystem.stories.tsx  # Complete system demo
└── README.md             # This documentation
```

## Usage Examples

### Basic Token Display
```tsx
import { TokenSwatch } from '../components/storybook'

<TokenSwatch
  name="vergil-purple"
  value="#7B00FF"
  cssVar="--vergil-purple"
  usage="Primary brand color"
  category="color"
  examples={['Buttons', 'Links', 'Active states']}
  rules={['Use for primary CTAs', 'Ensure proper contrast']}
/>
```

### Token Grid with Filtering
```tsx
import { TokenGrid } from '../components/storybook'

<TokenGrid
  title="Brand Colors"
  tokens={colorTokens}
  columns={4}
  showSearch={true}
  showFilter={true}
/>
```

### Migration Table
```tsx
import { MigrationTable } from '../components/storybook'

<MigrationTable
  title="v1 → v2 Migration"
  migrations={migrationData}
  groupByCategory={true}
/>
```

### Version-Aware Stories
```tsx
import { useGlobals } from '@storybook/manager-api'

const VersionAwareStory = () => {
  const [globals] = useGlobals()
  const currentVersion = globals.version || 'v2'
  const tokens = currentVersion === 'v1' ? v1Tokens : v2Tokens
  
  return <TokenGrid tokens={tokens} />
}
```

## Version Data Structure

### Version Information
```typescript
interface VersionInfo {
  version: string           // e.g., "v2.0.0"
  name: string             // e.g., "Apple-Inspired System"
  releaseDate: string      // e.g., "2024-06-30"
  status: 'current' | 'deprecated' | 'beta' | 'alpha'
  description: string
  breaking: boolean
  tokensAdded: number
  tokensModified: number
  tokensRemoved: number
  contributors: string[]
  migrationGuide?: string
  changelog?: string[]
  compatibility?: {
    browsers?: string[]
    frameworks?: string[]
    dependencies?: Record<string, string>
  }
  performance?: {
    bundleSize?: string
    loadTime?: string
    improvements?: string[]
  }
  accessibility?: {
    wcagLevel: 'A' | 'AA' | 'AAA'
    improvements?: string[]
    issues?: string[]
  }
}
```

### Migration Data
```typescript
interface MigrationItem {
  oldToken: {
    name: string
    value: string
    cssVar?: string
  }
  newToken?: {
    name: string
    value: string
    cssVar?: string
  }
  status: 'deprecated' | 'replaced' | 'breaking' | 'new' | 'unchanged'
  notes?: string
  migrationGuide?: string
  category?: string
}
```

## Key Stories

### 1. Version-Aware Color Tokens
**Path**: `Design Tokens/Colors`
- Automatically updates based on toolbar version selection
- Shows current vs legacy token sets
- Includes deprecation warnings and migration hints

### 2. Interactive Token Browser
**Path**: `Storybook Integration/Token Browser`
- Complete token exploration with search and filtering
- Live preview modes (grid, list, preview)
- Code generation and export functionality
- Hot reload integration

### 3. Migration Workflow
**Path**: `Storybook Integration/Complete Token System`
- Step-by-step migration process
- Version comparisons and change analysis
- Automated migration scripts and validation

### 4. Version Management
**Path**: `Storybook Integration/Version Management`
- Comprehensive version metadata display
- Performance and accessibility metrics
- Breaking change indicators and migration guides

## Addon Integration

### Version Switcher Panel
- Accessible via Storybook's addon panel
- Shows all available versions with metadata
- Indicates breaking changes and deprecation status
- Provides version descriptions and release dates

### Toolbar Version Switcher
- Quick version selection from main toolbar
- Visual indicators for version status
- Keyboard shortcuts for rapid switching
- URL synchronization for shareable links

## Advanced Features

### Hot Reload Integration
When enabled, the system provides real-time updates as tokens change during development:
- Live preview updates without page reload
- Automatic validation of new token values
- Visual indicators for successful/failed updates

### Accessibility Integration
- WCAG compliance indicators for all tokens
- Color contrast validation
- Screen reader compatibility
- High contrast mode support

### Performance Monitoring
- Bundle size impact tracking
- Load time measurements
- Tree-shaking optimization indicators
- Performance regression alerts

## Best Practices

### Token Organization
1. **Consistent Naming**: Use semantic naming conventions
2. **Clear Categories**: Group related tokens together
3. **Usage Documentation**: Always include usage rules and examples
4. **Status Indicators**: Mark deprecated or breaking changes clearly

### Version Management
1. **Semantic Versioning**: Follow semver for token releases
2. **Migration Guides**: Provide clear upgrade paths
3. **Backward Compatibility**: Maintain compatibility when possible
4. **Change Documentation**: Document all changes with rationale

### Story Development
1. **Version Awareness**: Use version globals for responsive stories
2. **Complete Examples**: Show tokens in real UI contexts
3. **Interactive Features**: Leverage search and filtering capabilities
4. **Documentation**: Provide clear descriptions and usage examples

## Development Workflow

1. **Token Changes**: Update token definitions
2. **Version Metadata**: Update version information and migration data
3. **Story Updates**: Refresh stories with new tokens
4. **Testing**: Validate across all supported versions
5. **Documentation**: Update usage examples and migration guides

This integration provides a comprehensive foundation for design token management and version visualization within Storybook, making it easy for teams to understand, migrate, and maintain their design systems across versions.