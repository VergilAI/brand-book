# Hardcoded Values Scanner

The hardcoded values scanner is a tool designed to identify design decisions that are not using the Vergil Design System's token-based approach. This helps maintain consistency, scalability, and design system adherence across the codebase.

## What it Scans For

### 1. Hex Colors (`#RRGGBB`, `#RGB`, `#RRGGBBAA`)
Identifies hardcoded color values that should be replaced with design tokens.

**Examples:**
- `#6366F1` → Should use `vergil-purple` token
- `#1D1D1F` → Should use `vergil-off-black` token
- `#F5F5F7` → Should use `vergil-off-white` token

**Exceptions:**
- Pure black (`#000000`, `#000`)
- Pure white (`#ffffff`, `#fff`)
- `transparent`, `currentColor`, `inherit`

### 2. RGB/RGBA Values
Identifies RGB and RGBA color values that should use design tokens.

**Examples:**
- `rgb(123, 0, 255)` → Should use `vergil-purple` token
- `rgba(29, 29, 31, 0.8)` → Should use `vergil-off-black` with opacity

### 3. HSL/HSLA Values
Identifies HSL and HSLA color values that should use design tokens.

**Examples:**
- `hsl(262, 100%, 50%)` → Should use design token
- `hsla(262, 100%, 50%, 0.5)` → Should use design token with opacity

### 4. Pixel Values
Identifies hardcoded dimensions that should use spacing or sizing tokens.

**Examples:**
- `24px` → Should use spacing token like `space-6`
- `1.5rem` → Should use sizing token
- `2em` → Should use typography token

**Exceptions:**
- `0px`, `0rem`, `0em` (zero values)
- `1px` (common border width)
- `100%`, `50%` (percentage values)
- `100vh`, `100vw` (viewport units)

### 5. Arbitrary Tailwind Classes
Identifies arbitrary Tailwind CSS classes that bypass the design system.

**Examples:**
- `bg-[#6366F1]` → Should use `bg-vergil-purple`
- `text-[14px]` → Should use `text-sm` or appropriate typography token
- `shadow-[0_4px_8px_rgba(0,0,0,0.1)]` → Should use shadow token

### 6. Inline Styles
Identifies React inline styles that should use CSS classes or design tokens.

**Examples:**
```jsx
// ❌ Hardcoded
<div style={{ color: '#6366F1', fontSize: '16px' }}>

// ✅ Token-based
<div className="text-vergil-purple text-base">
```

### 7. Font Families
Identifies custom font families that should use typography tokens.

**Examples:**
- `font-family: 'Custom Font'` → Should use typography token

**Exceptions:**
- System fonts (`system-ui`, `-apple-system`, `BlinkMacSystemFont`)
- Generic families (`sans-serif`, `monospace`)
- `inherit`

### 8. Box Shadows
Identifies hardcoded box shadows that should use shadow tokens.

**Examples:**
- `box-shadow: 0 4px 8px rgba(0,0,0,0.1)` → Should use shadow token

**Exceptions:**
- `none`, `inherit`
- Shadows using CSS variables (`var(--shadow-sm)`)

## Why This Matters

### 1. **Design Consistency**
Using design tokens ensures visual consistency across the entire application. When colors, spacing, or typography are hardcoded, they can drift from the design system over time.

### 2. **Maintainability**
Design tokens provide a single source of truth. When the design system evolves, changes can be made in one place rather than hunting through hundreds of files.

### 3. **Scalability**
As the design system grows, new components and features can immediately leverage the established patterns and tokens.

### 4. **Theming Support**
Design tokens enable features like dark mode, high contrast themes, or brand variations without touching individual components.

### 5. **Developer Experience**
Tokens provide semantic meaning (`vergil-purple` vs `#6366F1`) making code more readable and intentional.

### 6. **Design-Development Alignment**
When developers use the same tokens that designers specify, the gap between design and implementation shrinks.

## How to Use the Scanner

### Running the Scanner
```bash
npm run scan:hardcoded
```

### Understanding the Report
The scanner generates a detailed report at `/reports/hardcoded-values.md` with:

1. **Summary**: Total files scanned and findings count
2. **Findings by Type**: Breakdown of issue categories
3. **Detailed Findings**: File-by-file breakdown with line numbers and context

### Fixing Common Issues

#### Colors
```css
/* ❌ Before */
.header {
  background-color: #6366F1;
  color: #1D1D1F;
}

/* ✅ After */
.header {
  background-color: var(--vergil-purple);
  color: var(--vergil-off-black);
}
```

#### Spacing
```css
/* ❌ Before */
.card {
  padding: 24px;
  margin: 16px;
}

/* ✅ After */
.card {
  padding: var(--space-6);
  margin: var(--space-4);
}
```

#### Tailwind Classes
```jsx
// ❌ Before
<div className="bg-[#6366F1] text-[14px] p-[24px]">

// ✅ After
<div className="bg-vergil-purple text-sm p-6">
```

#### Inline Styles
```jsx
// ❌ Before
<div style={{ 
  backgroundColor: '#6366F1', 
  fontSize: '14px',
  padding: '24px' 
}}>

// ✅ After
<div className="bg-vergil-purple text-sm p-6">
```

## Integration with CI/CD

The scanner can be integrated into your continuous integration pipeline to catch hardcoded values before they reach production:

```yaml
# GitHub Actions example
- name: Scan for hardcoded values
  run: |
    npm run scan:hardcoded
    # Fail if critical findings exist
    if grep -q "Total findings: [^0]" reports/hardcoded-values.md; then
      echo "Hardcoded values found! Please use design tokens."
      exit 1
    fi
```

## Best Practices

1. **Run regularly**: Include the scanner in your development workflow
2. **Fix incrementally**: Address findings as you touch files rather than all at once
3. **Document exceptions**: If a hardcoded value is intentional, document why
4. **Update tokens**: If you find repeated hardcoded values, consider adding them as tokens
5. **Educate the team**: Share findings and solutions to prevent future issues

## Configuration

The scanner includes sensible defaults but can be customized by modifying the `exceptions` object in the scanner code:

```typescript
private exceptions = {
  colors: [
    '#000000', '#000', // Pure black
    '#ffffff', '#fff', // Pure white
    'transparent',
    'currentColor',
    'inherit',
    // Add your exceptions here
  ],
  // ... other exception categories
};
```

## Limitations

- **Context awareness**: The scanner may flag legitimate uses of hardcoded values (e.g., in examples or documentation)
- **Complex expressions**: May not catch all hardcoded values in complex CSS calculations
- **Third-party code**: May flag hardcoded values in vendor files that shouldn't be modified

## Roadmap

- **Auto-fix suggestions**: Suggest specific design tokens for common hardcoded values
- **IDE integration**: Real-time scanning and suggestions in code editors
- **Custom rules**: Allow project-specific scanning rules and exceptions
- **Performance optimization**: Faster scanning for large codebases