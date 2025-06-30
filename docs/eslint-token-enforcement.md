# ESLint Token Enforcement System

A comprehensive guide to the Vergil Design System's ESLint-based token enforcement architecture.

## 🎯 Overview

The ESLint Token Enforcement System automatically detects and prevents hardcoded design values throughout the codebase, ensuring consistent adherence to the **Token-First Architecture**.

## 🏗️ Architecture

```
eslint-rules/
├── index.js                    # Plugin entry point
├── package.json               # Plugin package definition
├── rules/                     # Individual ESLint rules
│   ├── no-hardcoded-colors.js    # Detect hardcoded colors
│   ├── no-hardcoded-spacing.js   # Detect hardcoded spacing
│   ├── no-arbitrary-tailwind.js  # Detect arbitrary Tailwind
│   ├── require-design-tokens.js  # Require token imports
│   └── no-deprecated-tokens.js   # Detect deprecated tokens
├── utils/
│   └── token-suggestions.js   # Smart token suggestions
├── docs/
│   └── README.md              # Complete documentation
└── test-examples.tsx          # Test cases and examples
```

## 🔧 Rule Details

### 1. `no-hardcoded-colors`

**Purpose:** Detects any hardcoded color values in code.

**Detects:**
- Hex colors: `#7B00FF`, `#000`
- RGB/RGBA: `rgb(123, 0, 255)`, `rgba(0,0,0,0.5)`
- HSL/HSLA: `hsl(270, 100%, 24%)`
- Named colors: `purple`, `black`, `white`
- CSS arbitrary values: `bg-[#7B00FF]`

**Exceptions:**
- `transparent`, `inherit`, `currentColor`
- CSS functions: `var()`, `calc()`
- Configurable allowed values

**Auto-fix:** Maps common colors to design tokens.

### 2. `no-hardcoded-spacing`

**Purpose:** Detects hardcoded spacing, sizing, and positioning values.

**Detects:**
- Pixel values: `16px`, `1.5px`
- Rem values: `1rem`, `1.5rem`
- Em values: `1em`, `2em`
- Percentage: `50%`, `75%` (configurable)
- Arbitrary Tailwind: `p-[16px]`, `w-[320px]`

**Exceptions:**
- `0`, `auto`, `inherit`
- `100%`, `50%` (common layout values)
- CSS functions

**Auto-fix:** Maps to closest design token values.

### 3. `no-arbitrary-tailwind`

**Purpose:** Prevents arbitrary Tailwind classes using bracket notation.

**Detects:**
- Color arbitraries: `bg-[#000]`, `text-[rgb(255,0,0)]`
- Spacing arbitraries: `p-[16px]`, `m-[2rem]`
- Typography arbitraries: `text-[14px]`, `leading-[1.5]`

**Exceptions:**
- URL values: `bg-[url('/image.jpg')]`
- CSS functions: `w-[calc(100%-2rem)]`
- Complex gradients

**Auto-fix:** Suggests standard Tailwind classes or design tokens.

### 4. `require-design-tokens`

**Purpose:** Ensures design tokens are imported when styling is used.

**Detects:**
- Style objects without token imports
- Styled-components usage without tokens
- CSS-in-JS without proper imports

**Auto-fix:** Adds token import statements automatically.

### 5. `no-deprecated-tokens`

**Purpose:** Warns about v1 color system usage.

**Detects:**
- Legacy color classes: `bg-cosmic-purple`
- Legacy token access: `tokens.colors.legacy.*`
- Deprecated CSS variables

**Auto-fix:** Migrates to v2 color system automatically.

## 🛠️ Configuration System

### Global Configuration (`.eslintrc.js`)

```javascript
module.exports = {
  plugins: ['@vergil/tokens'],
  rules: {
    '@vergil/tokens/no-hardcoded-colors': 'error',
    '@vergil/tokens/no-hardcoded-spacing': 'error',
    '@vergil/tokens/no-arbitrary-tailwind': 'error',
    '@vergil/tokens/require-design-tokens': 'warn',
    '@vergil/tokens/no-deprecated-tokens': 'warn',
  },
  settings: {
    '@vergil/tokens': {
      tokenImportPaths: [
        '@/tokens',
        '../generated/tokens',
        './generated/tokens.ts',
      ],
      allowedValues: {
        colors: ['transparent', 'inherit', 'currentColor'],
        spacing: ['0', 'auto', '100%', '50%'],
      },
      suggestTokens: true,
      autoFix: true,
    },
  },
};
```

### File-Specific Overrides

```javascript
{
  overrides: [
    {
      // Lenient for test files
      files: ['**/*.stories.*', '**/*.test.*'],
      rules: {
        '@vergil/tokens/no-hardcoded-colors': 'warn',
        '@vergil/tokens/require-design-tokens': 'off',
      },
    },
    {
      // Strict for components
      files: ['components/**/*.tsx'],
      rules: {
        '@vergil/tokens/no-hardcoded-colors': 'error',
        '@vergil/tokens/no-hardcoded-spacing': 'error',
        '@vergil/tokens/require-design-tokens': 'error',
      },
    },
    {
      // Disabled for config files
      files: ['*.config.*', 'scripts/**/*'],
      rules: {
        '@vergil/tokens/*': 'off',
      },
    },
  ],
}
```

## 🔄 Integration Points

### 1. Development Workflow

```bash
# Real-time linting in IDE
# ESLint extension shows violations inline

# Manual checking
npm run lint:tokens

# Auto-fixing
npm run lint:fix
```

### 2. Pre-commit Hooks

```bash
# .husky/pre-commit
npm run lint:tokens
npm run validate-tokens
npx lint-staged
```

### 3. Continuous Integration

```yaml
# .github/workflows/token-compliance.yml
- name: Check token compliance
  run: npm run lint:tokens

- name: Generate compliance report
  run: npm run report:coverage
```

### 4. Build Process

```javascript
// next.config.mjs
const nextConfig = {
  eslint: {
    rules: {
      '@vergil/tokens/no-hardcoded-colors': 'error',
    },
  },
};
```

## 📊 Token Suggestion System

### Color Mapping

```javascript
const COLOR_SUGGESTIONS = {
  '#7B00FF': 'tokens.colors.brand.purple',
  '#1D1D1F': 'tokens.colors.neutral.offBlack',
  '#F5F5F7': 'tokens.colors.neutral.offWhite',
  'purple': 'tokens.colors.brand.purple',
  'black': 'tokens.colors.neutral.offBlack',
};
```

### Spacing Mapping

```javascript
const SPACING_SUGGESTIONS = {
  '4px': 'tokens.spacing.scale[1]',
  '8px': 'tokens.spacing.scale[2]',
  '16px': 'tokens.spacing.scale[4]',
  '1rem': 'tokens.spacing.scale[4]',
};
```

### Tailwind Class Mapping

```javascript
const TAILWIND_SUGGESTIONS = {
  'bg-[#7B00FF]': 'bg-vergil-purple',
  'p-[16px]': 'p-4',
  'text-[14px]': 'text-sm',
};
```

## 🎯 Usage Patterns

### React Components

```tsx
// ❌ Bad
const Button = () => (
  <button 
    style={{ 
      backgroundColor: '#7B00FF',
      padding: '16px 24px',
      borderRadius: '8px'
    }}
  >
    Click me
  </button>
);

// ✅ Good
import { tokens } from '@/tokens';

const Button = () => (
  <button 
    style={{ 
      backgroundColor: tokens.colors.brand.purple,
      padding: `${tokens.spacing.scale[4]} ${tokens.spacing.scale[6]}`,
      borderRadius: tokens.spacing.radius.md
    }}
  >
    Click me
  </button>
);
```

### Tailwind Classes

```tsx
// ❌ Bad
<div className="bg-[#7B00FF] p-[16px] text-[14px]">
  Arbitrary values
</div>

// ✅ Good
<div className="bg-vergil-purple p-4 text-sm">
  Standard classes
</div>
```

### Styled Components

```tsx
// ❌ Bad
const StyledDiv = styled.div`
  background: #7B00FF;
  padding: 16px;
  color: white;
`;

// ✅ Good
import { tokens } from '@/tokens';

const StyledDiv = styled.div`
  background: ${tokens.colors.brand.purple};
  padding: ${tokens.spacing.scale[4]};
  color: ${tokens.colors.neutral.offWhite};
`;
```

## 📈 Metrics and Reporting

### Compliance Metrics

1. **Violation Count:** Total ESLint violations
2. **Import Coverage:** Files with token imports vs. total style files
3. **Deprecated Usage:** Count of v1 color system usage
4. **Auto-fix Success Rate:** Violations fixed automatically

### Reports Generated

1. **Pre-commit Report:** Immediate feedback on violations
2. **CI/CD Report:** Comprehensive compliance overview
3. **PR Comments:** Automated violation summaries
4. **Coverage Report:** Token usage across codebase

## 🔍 Debugging and Troubleshooting

### Common Issues

**1. False Positives**
```javascript
// Add to allowed values
rules: {
  '@vergil/tokens/no-hardcoded-colors': ['error', {
    allowedValues: ['transparent', 'inherit', 'currentColor']
  }]
}
```

**2. Import Path Issues**
```javascript
// Configure import paths
settings: {
  '@vergil/tokens': {
    tokenImportPaths: [
      '@/tokens',
      '../tokens',
      './generated/tokens.ts'
    ]
  }
}
```

**3. CSS Function Conflicts**
```javascript
// Allow CSS functions
rules: {
  '@vergil/tokens/no-arbitrary-tailwind': ['error', {
    allowedPatterns: ['calc\\(', 'var\\(', 'min\\(', 'max\\(']
  }]
}
```

### Debugging Commands

```bash
# Test specific files
npx eslint path/to/file.tsx --rule '@vergil/tokens/no-hardcoded-colors: error'

# Debug rule execution
npx eslint --debug path/to/file.tsx

# Check rule configuration
npx eslint --print-config path/to/file.tsx
```

## 🚀 Migration Strategy

### Phase 1: Detection
1. Install and configure ESLint rules
2. Run initial scan: `npm run scan:hardcoded`
3. Generate baseline violation report

### Phase 2: Gradual Enforcement
1. Set rules to 'warn' initially
2. Apply auto-fixes: `npm run lint:fix`
3. Manual review and corrections
4. Increase rule severity to 'error'

### Phase 3: Full Enforcement
1. Enable all rules as 'error'
2. Add pre-commit hooks
3. Configure CI/CD validation
4. Train team on token-first development

## 📚 Best Practices

### Rule Configuration
- Start with warnings, escalate to errors
- Use file-specific overrides for flexibility
- Configure appropriate allowed values
- Enable auto-fix for faster adoption

### Development Workflow
- Use IDE ESLint extensions for real-time feedback
- Run `lint:fix` before commits
- Review auto-fixes for semantic correctness
- Test visual appearance after token migrations

### Team Adoption
- Provide training on token-first architecture
- Document common violation patterns
- Share auto-fix techniques
- Regular compliance reviews

## 🔮 Future Enhancements

### Planned Features
1. **Advanced AI Suggestions:** ML-based token recommendations
2. **Visual Diff Validation:** Automated visual regression testing
3. **Performance Impact Analysis:** Bundle size and runtime metrics
4. **Custom Rule Generator:** Team-specific violation patterns
5. **IDE Extensions:** Dedicated VS Code/WebStorm plugins

### Integration Opportunities
1. **Figma Plugin:** Design-to-code token validation
2. **Storybook Addon:** Visual token compliance verification
3. **Build-time Optimization:** Unused token elimination
4. **Analytics Dashboard:** Team compliance metrics

## 📄 Conclusion

The ESLint Token Enforcement System provides comprehensive, automated protection against design inconsistencies while enabling seamless migration to token-first architecture. Through intelligent detection, auto-fixing, and team-friendly workflows, it ensures the Vergil Design System maintains its high standards of consistency and maintainability.