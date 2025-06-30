# Token Validation System

This document describes the token validation system that ensures CSS variables and TypeScript tokens remain aligned.

## Overview

The token validation system prevents drift between CSS custom properties (CSS variables) and TypeScript design tokens by automatically validating their alignment during development and testing.

## Components

### 1. Validation Script (`/scripts/validate-tokens.ts`)

The core validation script that:
- Parses `globals.css` to extract all color CSS variables and their hex values
- Imports TypeScript tokens from `/packages/design-system/tokens/colors.ts`
- Compares values between both systems
- Checks for missing tokens (in CSS but not TS, or vice versa)
- Validates naming conventions (kebab-case to camelCase conversion)

### 2. Test File (`/tests/token-alignment.test.ts`)

Jest test that runs the validation and fails if any mismatches are found, providing:
- Clear error messages for each type of mismatch
- Separate tests for naming conventions and value alignment
- Detailed output showing exactly what needs to be fixed

### 3. Package Scripts

Two npm scripts for running validation:
- `npm run validate-tokens` - Runs the validation script directly with detailed console output
- `npm run test:tokens` - Runs the Jest test for CI/CD integration

## Usage

### Manual Validation

Run the validation script to see current alignment status:

```bash
npm run validate-tokens
```

This will output:
- ✅ Success message if all tokens are aligned
- ❌ Detailed error report if mismatches are found

### Automated Testing

Run the Jest test as part of your test suite:

```bash
npm run test:tokens
```

Or include it in your CI/CD pipeline by adding to your test command.

## Error Types

The validation system detects four types of mismatches:

1. **Missing in TypeScript** - CSS variables that don't have corresponding TS tokens
2. **Missing in CSS** - TypeScript tokens that don't have corresponding CSS variables
3. **Value Mismatch** - Same token name but different color values
4. **Naming Mismatch** - Incorrect naming convention conversion

## Token Naming Conventions

The system expects the following naming conversions:

- CSS: `--kebab-case` (e.g., `--cosmic-purple`)
- TypeScript: `camelCase` (e.g., `cosmicPurple`)

Nested TypeScript tokens are flattened with hyphens:
- TS: `colors.primary.cosmicPurple`
- CSS: `--primary-cosmic-purple`

## CSS-Only Patterns

Some CSS variables are intentionally CSS-only and excluded from validation:

- Legacy color variants (e.g., `--vergil-purple-500`)
- Tailwind gray scale (e.g., `--gray-400`)
- UI-specific colors (e.g., `--vergil-emphasis-bg`)
- Tool-specific colors (e.g., `--map-selection`)
- One-off colors that haven't been systematized

These patterns are defined in the validation script's `cssOnlyPatterns` array.

## Maintaining Alignment

To keep tokens aligned:

1. **When adding new colors**: Add to both `globals.css` and the TypeScript tokens file
2. **When updating colors**: Update both files simultaneously
3. **When removing colors**: Remove from both files
4. **Before committing**: Run `npm run validate-tokens` to ensure alignment

## Current Status

As of the last update, there are mismatches between the CSS and TypeScript tokens due to the v2 color system migration. The `colors-complete.ts` file contains all tokens needed for full alignment, but the main `colors.ts` file contains only the v2 system.

## Future Improvements

1. **Pre-commit Hook**: Add validation to git pre-commit hooks
2. **CI Integration**: Fail builds if tokens are misaligned
3. **Auto-generation**: Consider generating one format from the other
4. **Visual Diff**: Create a visual tool showing color differences