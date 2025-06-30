# Design Token Version Management Examples

Real-world examples and use cases for the design token version management system.

## 🎯 Common Scenarios

### 1. Creating Your First Release

**Scenario:** You've been working on design tokens and want to create the first stable release.

```bash
# 1. Validate your current tokens
npm run validate-tokens
npm run build:tokens

# 2. Check what would be included
npm run version:diff v2.0.0 active

# 3. Create the release
npm run version:create --version 2.1.0

# 4. Verify the release
npm run version:info 2.1.0
npm run version:list
```

**Output:**
```
✅ Version 2.1.0 created successfully!
📁 Location: design-tokens/versions/v2.1.0
🚧 Active development is now v2.2.0-dev
```

### 2. Handling Breaking Changes

**Scenario:** You need to update the primary brand color from purple to a new shade.

```bash
# 1. Check current state
npm run version:info active

# 2. Make your changes in design-tokens/active/source/colors.yaml
# Change colors.brand.purple from #7B00FF to #8A2BE2

# 3. Check for breaking changes
npm run version:check-breaking 2.1.0 active
```

**Output:**
```
❌ Breaking changes detected (1)
• Token 'colors.brand.purple' value changed significantly (high impact)
```

```bash
# 4. See detailed diff
npm run version:diff 2.1.0 active
```

**Output:**
```
⚠️  Breaking Changes:
   • Token 'colors.brand.purple' value changed significantly
     Impact: high | Effort: high | Auto: No
     Migration: Token 'colors.brand.purple' value changed from '#7B00FF' to '#8A2BE2'. Review visual impact and test thoroughly.

💡 Recommendations:
   ⚠️  1 breaking changes detected.
   🔴 High impact changes require careful testing and gradual rollout.
   ⏰ Significant migration effort required. Plan accordingly.
   👨‍💻 1 changes require manual review and testing.
```

```bash
# 5. Create major version due to breaking change
npm run version:create --version 3.0.0
```

### 3. Safe Feature Addition

**Scenario:** Adding new spacing tokens for a new component without breaking existing usage.

```bash
# 1. Add new tokens to design-tokens/active/source/spacing.yaml
# Add component.card.padding and component.card.margin tokens

# 2. Validate the addition
npm run validate-tokens
npm run build:tokens

# 3. Check impact (should be safe)
npm run version:check-breaking 2.1.0 active
```

**Output:**
```
✅ No breaking changes detected
```

```bash
# 4. Create minor version release
npm run version:create --version 2.2.0
```

### 4. Emergency Rollback

**Scenario:** A critical issue was found in v2.2.0 and you need to rollback active development.

```bash
# 1. Check available versions
npm run version:list

# 2. Activate previous stable version
npm run version:activate 2.1.0
```

**Output:**
```
🔄 Activating version 2.1.0...
💾 Backing up current active version...
📋 Copying version to active...
✅ Version 2.1.0 activated successfully!
🚧 Active development is now v2.2.0-dev
💾 Previous active backed up to: design-tokens/active/backup-1640995200000
```

### 5. Migration Between Major Versions

**Scenario:** Upgrading a project from v1.0.0 (CSS) to v2.0.0 (YAML).

```bash
# 1. Understand the migration
npm run version:diff 1.0.0 2.0.0
```

**Output:**
```
⚠️  Breaking Changes:
   • Token 'cosmic-purple' was removed
     Impact: high | Effort: medium | Auto: Yes
     Migration: Replace all instances of 'cosmic-purple' with 'vergil-purple'.

   • Token 'electric-violet' was removed  
     Impact: medium | Effort: minimal | Auto: Yes
     Migration: Replace all instances of 'electric-violet' with 'vergil-purple-light'.

💡 Recommendations:
   ⚠️  15 breaking changes detected.
   🤖 12 changes can be automated with migration scripts.
   👨‍💻 3 changes require manual review and testing.
```

```bash
# 2. Get migration guide
cat design-tokens/versions/v1.0.0/migration/guide.md

# 3. Run automated migration (if available)
npm run migration:run 1.0.0 2.0.0

# 4. Manual updates based on guide
# Update CSS: --cosmic-purple → --color-vergil-purple
# Update Tailwind: bg-cosmic-purple → bg-vergil-purple
```

### 6. Development Workflow

**Scenario:** Daily development workflow with version management.

```bash
# Morning: Check current state
npm run version:list
npm run version:info active

# During development: Regular validation
npm run build:tokens        # After making changes
npm run validate-tokens     # Check syntax
npm run scan:hardcoded     # Find hardcoded values

# Before committing: Comprehensive check
npm run report:all         # Generate all reports
npm run version:check-breaking 2.1.0 active  # Check for breaking changes

# Weekly: Create development snapshot
npm run version:create --version 2.2.0-alpha.1
```

### 7. Beta Release Cycle

**Scenario:** Creating and managing beta releases before stable.

```bash
# 1. Create first beta
npm run version:create --version 2.2.0-beta.1

# 2. After feedback, create second beta
npm run version:create --version 2.2.0-beta.2

# 3. Create release candidate
npm run version:create --version 2.2.0-rc.1

# 4. Final stable release
npm run version:create --version 2.2.0

# 5. View the progression
npm run version:list
```

**Output:**
```
📋 Available versions:

   ✅ v2.2.0 - Latest stable release
      Released: 6/30/2025
      Status: stable

   🚧 v2.2.0-rc.1 - Release candidate
      Released: 6/29/2025  
      Status: rc

   🚧 v2.2.0-beta.2 - Second beta release
      Released: 6/28/2025
      Status: beta

   🚧 v2.2.0-beta.1 - First beta release
      Released: 6/27/2025
      Status: beta
```

## 🔧 Advanced Examples

### Custom Migration Script

```typescript
// design-tokens/migration/scripts/custom-migration.ts

import { BreakingChangeDetector } from '../lib/breaking-change-detector';
import { promises as fs } from 'fs';
import path from 'path';

// Custom migration for complex token reorganization
async function migrateColorStructure() {
  const oldStructure = await loadTokens('design-tokens/versions/v2.0.0/tokens');
  const newStructure = await loadTokens('design-tokens/active/source');
  
  const analysis = BreakingChangeDetector.analyzeChanges(
    oldStructure, 
    newStructure, 
    '2.0.0', 
    '3.0.0'
  );
  
  // Generate custom migration steps
  const migrationSteps = analysis.breakingChanges.map(change => {
    if (change.type === 'token-renamed') {
      return {
        type: 'find-replace',
        pattern: `var(--color-${change.oldValue})`,
        replacement: `var(--color-${change.newValue})`,
        files: ['**/*.css', '**/*.scss']
      };
    }
    return null;
  }).filter(Boolean);
  
  // Save migration script
  await fs.writeFile(
    'migration-steps.json', 
    JSON.stringify(migrationSteps, null, 2)
  );
}
```

### Automated Testing Integration

```bash
#!/bin/bash
# .github/workflows/token-validation.yml

name: Design Token Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # Install dependencies
      - run: npm install
      
      # Validate tokens
      - run: npm run validate-tokens
      - run: npm run build:tokens
      
      # Check for breaking changes
      - run: npm run version:check-breaking 2.1.0 active
        continue-on-error: true
        id: breaking-check
      
      # Generate reports
      - run: npm run report:all
      
      # Upload artifacts
      - uses: actions/upload-artifact@v3
        with:
          name: token-reports
          path: reports/
```

### Component Testing with Token Versions

```typescript
// tests/token-version-compatibility.test.ts

import { render } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Token Version Compatibility', () => {
  test('Button works with v2.1.0 tokens', async () => {
    // Load v2.1.0 token CSS
    await loadTokenVersion('2.1.0');
    
    const { container } = render(<Button variant="primary">Test</Button>);
    
    // Verify expected styles are applied
    const button = container.firstChild;
    const styles = getComputedStyle(button);
    
    expect(styles.backgroundColor).toBe('rgb(123, 0, 255)'); // vergil-purple
    expect(styles.borderRadius).toBe('9999px');
  });
  
  test('Button gracefully handles missing tokens', async () => {
    // Load minimal token set
    await loadTokenVersion('minimal');
    
    const { container } = render(<Button variant="primary">Test</Button>);
    
    // Should still render without errors
    expect(container.firstChild).toBeInTheDocument();
  });
});
```

### Version Comparison Utility

```typescript
// scripts/compare-token-usage.ts

import { globby } from 'globby';
import { readFile } from 'fs/promises';

async function analyzeTokenUsage(version1: string, version2: string) {
  // Get all component files
  const files = await globby(['components/**/*.tsx', 'app/**/*.tsx']);
  
  const usage = {
    [version1]: new Set<string>(),
    [version2]: new Set<string>(),
    common: new Set<string>(),
    removed: new Set<string>(),
    added: new Set<string>()
  };
  
  // Load version metadata
  const v1Tokens = await loadVersionTokens(version1);
  const v2Tokens = await loadVersionTokens(version2);
  
  // Analyze each file
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    
    // Find token usage patterns
    const tokenMatches = content.match(/var\(--[\w-]+\)/g) || [];
    const classMatches = content.match(/\b[\w-]*(?:purple|violet|indigo)[\w-]*\b/g) || [];
    
    for (const token of [...tokenMatches, ...classMatches]) {
      if (tokenExistsInVersion(token, v1Tokens)) usage[version1].add(token);
      if (tokenExistsInVersion(token, v2Tokens)) usage[version2].add(token);
    }
  }
  
  // Calculate differences
  usage.common = new Set([...usage[version1]].filter(t => usage[version2].has(t)));
  usage.removed = new Set([...usage[version1]].filter(t => !usage[version2].has(t)));
  usage.added = new Set([...usage[version2]].filter(t => !usage[version1].has(t)));
  
  return usage;
}

// Usage
const analysis = await analyzeTokenUsage('2.0.0', '2.1.0');
console.log(`Tokens removed: ${analysis.removed.size}`);
console.log(`Tokens added: ${analysis.added.size}`);
console.log(`Common tokens: ${analysis.common.size}`);
```

## 🎨 Design System Examples

### Color Migration Example

```yaml
# Before (v2.0.0): design-tokens/versions/v2.0.0/tokens/colors.yaml
colors:
  brand:
    purple:
      value: "#7B00FF"
      comment: "Primary brand purple"
  legacy:
    cosmic-purple:
      value: "#6366F1"
      deprecated: true

# After (v2.1.0): design-tokens/active/source/colors.yaml  
colors:
  brand:
    purple:
      value: "#7B00FF"
      comment: "Primary brand purple"
    purple-vibrant:
      value: "#8A2BE2"
      comment: "High-energy variant for special moments"
  semantic:
    interactive:
      primary:
        value: "{brand.purple}"
        comment: "Primary interactive color"
      secondary:
        value: "{brand.purple-vibrant}"
        comment: "Secondary interactive color"
```

**Migration impact:**
- ✅ Non-breaking: Added `purple-vibrant` and semantic tokens
- ✅ Safe upgrade from v2.0.0 to v2.1.0

### Typography Scale Evolution

```yaml
# Before (v1.0.0): Hardcoded CSS
/* globals.css */
:root {
  --font-display: 'Lato', sans-serif;
  --font-sans: 'Inter', sans-serif;
}

# After (v2.0.0): Structured system
typography:
  fontFamilies:
    display:
      value: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      comment: "Display font for headlines"
    sans:
      value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"  
      comment: "Body text font"
  
  fontSizes:
    xs: { value: "12px", comment: "Extra small text" }
    sm: { value: "14px", comment: "Small text" }
    base: { value: "16px", comment: "Body text" }
    lg: { value: "18px", comment: "Large text" }
    xl: { value: "20px", comment: "Extra large text" }
    "2xl": { value: "24px", comment: "Headings" }
    "3xl": { value: "30px", comment: "Large headings" }
```

**Migration commands:**
```bash
# Check typography changes
npm run version:diff 1.0.0 2.0.0 | grep -A 10 "Typography"

# Update CSS variables
find . -name "*.css" -exec sed -i 's/var(--font-display)/var(--font-family-display)/g' {} \;
find . -name "*.css" -exec sed -i 's/var(--font-sans)/var(--font-family-sans)/g' {} \;
```

## 🚀 Production Examples

### Gradual Rollout Strategy

```bash
# 1. Create pre-release for testing
npm run version:create --version 3.0.0-beta.1

# 2. Deploy to staging environment
git checkout deploy-staging
npm run version:activate 3.0.0-beta.1
git commit -m "Deploy beta tokens to staging"

# 3. Run automated tests
npm run test:visual-regression
npm run test:accessibility

# 4. After validation, create RC
npm run version:create --version 3.0.0-rc.1

# 5. Deploy to production
git checkout deploy-production  
npm run version:activate 3.0.0-rc.1
git commit -m "Deploy RC tokens to production"

# 6. Monitor for issues, then create stable
npm run version:create --version 3.0.0
```

### Multi-Environment Sync

```bash
# Development
npm run version:list                    # Check available versions
npm run version:info active            # Current development state

# Staging  
npm run version:activate 3.0.0-beta.1  # Deploy beta for testing
npm run version:info 3.0.0-beta.1      # Verify deployment

# Production
npm run version:activate 2.2.0         # Stable production version
npm run version:info 2.2.0             # Verify production state
```

---

*These examples demonstrate real-world usage patterns for the design token version management system. Adapt them to your specific workflow and requirements.*