# Token Management System

A comprehensive token editing and management system for the Vergil Design System.

## Features

### 🎛️ Interactive Token Editor
- Browse tokens by category
- Real-time editing with live preview
- Search and filter capabilities
- Validation and error checking

### 📋 Command Line Tools
- `npm run token:add` - Add new tokens
- `npm run token:remove` - Remove tokens with dependency checking
- `npm run token:rename` - Rename tokens and update references
- `npm run token:find` - Search tokens with advanced filters
- `npm run token:validate` - Comprehensive validation

### ♿ Accessibility Validation
- WCAG contrast ratio checking
- Accessibility compliance reports
- Alternative color suggestions
- Usage guidelines

### 🔗 Integration Features
- Auto-rebuild on file changes
- Storybook hot-reload integration
- Git integration with hooks
- Multi-format export

### 📖 Documentation Generation
- Comprehensive token documentation
- Visual token galleries
- Usage examples and patterns
- Migration guides

## Quick Start

### Launch Interactive Editor
```bash
npm run token:editor
```

### Add a New Token
```bash
npm run token:add primary-blue "#0066CC" --category colors --comment "Primary brand color"
```

### Search Tokens
```bash
npm run token:find "purple" --category colors
```

### Validate All Tokens
```bash
npm run token:validate
```

### Generate Documentation
```bash
npm run token:docs
```

### Watch for Changes
```bash
npm run token:watch --storybook --git
```

## Architecture

```
token-manager/
├── types.ts           # TypeScript interfaces and types
├── parser.ts          # Parse tokens from various sources
├── validator.ts       # Validation rules and checking
├── exporter.ts        # Export to multiple formats
├── commands.ts        # Command implementations
├── accessibility.ts   # WCAG compliance checking
├── integration.ts     # External integrations
├── documentation.ts   # Documentation generation
├── cli.ts            # Interactive CLI interface
└── index.ts          # Main exports
```

## Token Structure

```typescript
interface TokenDefinition {
  name: string;           // Token name (kebab-case)
  path: string;          // Dot-notation path
  category: TokenCategory; // colors, spacing, typography, etc.
  type: TokenValueType;   // color, spacing, fontSize, etc.
  value: string;         // Token value
  cssVar: string;        // CSS custom property name
  comment?: string;      // Description/usage notes
  deprecated?: boolean;  // Deprecation status
  semantic?: boolean;    // References other tokens
  accessibility?: AccessibilityInfo;
}
```

## Validation Rules

- **Valid color formats** - Hex, RGB, HSL, CSS variables
- **Contrast compliance** - WCAG AA/AAA standards
- **Naming conventions** - kebab-case, semantic naming
- **No duplicate values** - Prevent unintentional duplicates
- **Reference validation** - Ensure semantic tokens reference valid tokens
- **Consistent units** - Proper units for spacing/typography

## Export Formats

- **CSS** - Custom properties (`:root { --token: value; }`)
- **SCSS** - Variables (`$token: value;`)
- **TypeScript** - Typed constants and helpers
- **JavaScript** - ES6 modules
- **JSON** - Structured data format
- **Tailwind** - Tailwind CSS configuration

## Integration Options

### Storybook
- Hot-reload token changes
- Auto-generate token stories
- Visual documentation

### Git
- Pre-commit validation hooks
- Auto-commit generated files
- Branch protection rules

### Build Process
- Watch file changes
- Auto-rebuild on updates
- Multiple output formats

## Best Practices

1. **Use semantic naming** - `primary-button` vs `blue-500`
2. **Follow token hierarchy** - Base → semantic → component tokens
3. **Validate regularly** - Run validation before commits
4. **Document changes** - Include comments for complex tokens
5. **Test accessibility** - Ensure color combinations meet WCAG standards

## Troubleshooting

### Common Issues

**Token not found in CSS**
- Check import path for `tokens.css`
- Verify token name spelling
- Ensure latest build

**TypeScript errors**
- Regenerate tokens: `npm run build:tokens`
- Check import statement
- Verify token exists in registry

**Validation errors**
- Review error messages and suggestions
- Check naming conventions
- Verify color formats and accessibility

### Debug Commands

```bash
# Check token status
npm run token:find "token-name"

# Validate specific token
npm run token:validate

# View accessibility report
npm run token:accessibility

# Check system status
npm run token:watch  # shows integration status
```

## Contributing

1. **Follow naming conventions** - Use kebab-case for all token names
2. **Add comprehensive comments** - Explain purpose and usage
3. **Test changes** - Run validation and accessibility checks
4. **Update documentation** - Keep docs current with changes
5. **Consider breaking changes** - Use deprecation for gradual migration