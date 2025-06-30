# Vergil Design Token ESLint Rules

A comprehensive ESLint plugin to enforce design token usage throughout the Vergil Design System. This plugin prevents hardcoded values and ensures consistent token-first development.

## 🎯 Purpose

This ESLint plugin enforces the **Token-First Architecture** by:

- Detecting hardcoded colors, spacing, and other design values
- Preventing arbitrary Tailwind CSS classes
- Requiring design token imports when styling
- Warning about deprecated v1 color tokens
- Providing auto-fix suggestions with proper tokens

## 📦 Installation

The plugin is already configured in your workspace. If setting up elsewhere:

```bash
npm install --save-dev @vergil/eslint-plugin-tokens
```

## ⚙️ Configuration

Add to your `.eslintrc.js`:

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
};
```

## 📋 Rules

### `no-hardcoded-colors`

**Prevents hardcoded color values in any format**

❌ **Incorrect:**
```tsx
// Hex colors
<div style={{ backgroundColor: '#7B00FF' }} />
<div className="bg-[#7B00FF]" />

// RGB colors  
<div style={{ color: 'rgb(123, 0, 255)' }} />

// Named colors
<div style={{ background: 'purple' }} />
```

✅ **Correct:**
```tsx
import { tokens } from '@/tokens';

<div style={{ backgroundColor: tokens.colors.brand.purple }} />
<div className="bg-vergil-purple" />
```

**Auto-fix:** Automatically suggests appropriate design tokens.

---

### `no-hardcoded-spacing`

**Prevents hardcoded spacing values (px, rem, em)**

❌ **Incorrect:**
```tsx
// Pixel values
<div style={{ padding: '16px', margin: '24px' }} />
<div className="p-[16px] m-[24px]" />

// Rem values
<div style={{ gap: '1rem' }} />
```

✅ **Correct:**
```tsx
import { tokens } from '@/tokens';

<div style={{ 
  padding: tokens.spacing.scale[4], 
  margin: tokens.spacing.scale[6] 
}} />
<div className="p-4 m-6" />
```

**Auto-fix:** Maps common spacing values to design tokens.

---

### `no-arbitrary-tailwind`

**Prevents arbitrary Tailwind classes using bracket notation**

❌ **Incorrect:**
```tsx
// Arbitrary colors
<div className="bg-[#7B00FF] text-[rgb(255,255,255)]" />

// Arbitrary spacing
<div className="p-[16px] m-[24px]" />

// Arbitrary typography
<div className="text-[14px] leading-[1.5]" />
```

✅ **Correct:**
```tsx
<div className="bg-vergil-purple text-vergil-off-white" />
<div className="p-4 m-6" />
<div className="text-sm leading-normal" />
```

**Allowed exceptions:** URL values, CSS functions (calc, var, min, max, clamp), and complex gradients.

---

### `require-design-tokens`

**Requires design token imports when using styling properties**

❌ **Incorrect:**
```tsx
// Using style props without token import
const Button = () => (
  <button style={{ backgroundColor: tokens.colors.brand.purple }}>
    Click me
  </button>
);
```

✅ **Correct:**
```tsx
import { tokens } from '@/tokens';

const Button = () => (
  <button style={{ backgroundColor: tokens.colors.brand.purple }}>
    Click me
  </button>
);
```

**Auto-fix:** Automatically adds token import statements.

---

### `no-deprecated-tokens`

**Warns about v1 color system usage and suggests v2 alternatives**

❌ **Deprecated:**
```tsx
import { tokens } from '@/tokens';

// V1 color tokens
<div className="bg-cosmic-purple" />
<div style={{ color: tokens.colors.legacy.cosmicPurple }} />
```

✅ **Updated:**
```tsx
import { tokens } from '@/tokens';

// V2 color tokens
<div className="bg-vergil-purple" />
<div style={{ color: tokens.colors.brand.purple }} />
```

**Auto-fix:** Automatically migrates to v2 color system.

## 🛠️ Usage

### Available Scripts

```bash
# Lint for token violations only
npm run lint:tokens

# Auto-fix token violations
npm run lint:fix

# Full linting with Next.js rules
npm run lint

# Pre-commit validation (tokens + validation)
npm run precommit
```

### IDE Integration

Most IDEs with ESLint support will show violations inline:

- **VS Code:** Install ESLint extension
- **WebStorm:** ESLint is built-in
- **Vim/Neovim:** Use ALE or similar

### CI/CD Integration

The rules are automatically checked in:

- **Pre-commit hooks** via Husky
- **GitHub Actions** (if configured)
- **Build process** via Next.js linting

## 🔧 Rule Configuration

### Custom Configuration

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    '@vergil/tokens/no-hardcoded-colors': ['error', {
      allowedValues: ['transparent', 'inherit'],
      suggestTokens: true,
    }],
    '@vergil/tokens/no-hardcoded-spacing': ['error', {
      allowedValues: ['0', 'auto', '100%'],
      allowedProperties: ['zIndex', 'opacity'],
      suggestTokens: true,
    }],
    '@vergil/tokens/no-arbitrary-tailwind': ['error', {
      strictMode: false,
      allowedPatterns: ['url\\(', 'calc\\('],
      suggestAlternatives: true,
    }],
  },
};
```

### File-Specific Overrides

```javascript
// .eslintrc.js
module.exports = {
  overrides: [
    {
      // Lenient for stories and tests
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
  ],
};
```

## 🐛 Troubleshooting

### Common Issues

**1. False positives with CSS functions**
```javascript
// Add to allowed patterns
rules: {
  '@vergil/tokens/no-arbitrary-tailwind': ['error', {
    allowedPatterns: ['calc\\(', 'var\\(', 'min\\(', 'max\\(']
  }]
}
```

**2. Token import not recognized**
```javascript
// Configure token import paths
settings: {
  '@vergil/tokens': {
    tokenImportPaths: [
      '@/tokens',
      '../tokens',
      './generated/tokens',
    ],
  },
}
```

**3. Legacy code migration**
```bash
# Gradually migrate with warnings
npm run lint:fix -- --rule '@vergil/tokens/no-deprecated-tokens: warn'
```

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `Hardcoded color "#7B00FF" found` | Using hex color directly | Use `tokens.colors.brand.purple` |
| `Arbitrary Tailwind class "bg-[#000]"` | Using bracket notation | Use `bg-vergil-off-black` |
| `Missing design token import` | No token import found | Add `import { tokens } from '@/tokens'` |
| `Token "cosmic-purple" is deprecated` | Using v1 color system | Replace with `vergil-purple` |

## 📚 Migration Guide

### From Hardcoded Values

1. **Run the scanner:**
   ```bash
   npm run scan:hardcoded
   ```

2. **Apply auto-fixes:**
   ```bash
   npm run lint:fix
   ```

3. **Manual review:**
   - Check auto-fixes are semantically correct
   - Verify visual appearance matches expectations
   - Test responsive behavior

### From V1 to V2 Colors

1. **Enable deprecation warnings:**
   ```bash
   npm run lint:tokens
   ```

2. **Apply automatic migration:**
   ```bash
   npm run lint:fix
   ```

3. **Visual verification:**
   - Compare before/after in Storybook
   - Test color contrast compliance
   - Verify brand consistency

## 🤝 Contributing

### Adding New Rules

1. Create rule file in `eslint-rules/rules/`
2. Add to `eslint-rules/index.js`
3. Update documentation
4. Add tests
5. Update configuration

### Improving Suggestions

Edit `eslint-rules/utils/token-suggestions.js` to:
- Add new color mappings
- Improve spacing suggestions
- Enhance Tailwind class suggestions

## 📄 License

MIT License - Part of the Vergil Design System.