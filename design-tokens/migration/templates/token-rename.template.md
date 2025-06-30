# Token Rename Migration Template

## Overview
This template handles simple token renames where the value stays the same but the name changes.

**Impact:** Low to Medium  
**Automatable:** Yes  
**Effort:** Minimal  

## Migration Script Template

```javascript
module.exports = {
  name: "Token Rename: {{FROM_VERSION}} → {{TO_VERSION}}",
  type: "token-rename",
  automatable: true,
  transforms: [
    {{#RENAMES}}
    {
      type: "rename",
      from: "{{OLD_NAME}}",
      to: "{{NEW_NAME}}",
      value: "{{VALUE}}",
      platforms: {
        css: {
          pattern: "var(--{{OLD_CSS_NAME}})",
          replacement: "var(--{{NEW_CSS_NAME}})"
        },
        tailwind: {
          pattern: "{{OLD_TAILWIND_CLASS}}",
          replacement: "{{NEW_TAILWIND_CLASS}}"
        },
        javascript: {
          pattern: "tokens.{{OLD_JS_PATH}}",
          replacement: "tokens.{{NEW_JS_PATH}}"
        }
      }
    }{{#unless @last}},{{/unless}}
    {{/RENAMES}}
  ]
}
```

## Migration Guide Template

```markdown
# Migration Guide: {{FROM_VERSION}} → {{TO_VERSION}}

## Token Renames

The following tokens have been renamed for better organization:

{{#RENAMES}}
### {{OLD_NAME}} → {{NEW_NAME}}

**Value:** `{{VALUE}}`  
**Reason:** {{REASON}}

**Required Changes:**

**CSS/SCSS:**
\`\`\`diff
- var(--{{OLD_CSS_NAME}})
+ var(--{{NEW_CSS_NAME}})
\`\`\`

**Tailwind:**
\`\`\`diff
- {{OLD_TAILWIND_CLASS}}
+ {{NEW_TAILWIND_CLASS}}
\`\`\`

**JavaScript/TypeScript:**
\`\`\`diff
- tokens.{{OLD_JS_PATH}}
+ tokens.{{NEW_JS_PATH}}
\`\`\`

{{/RENAMES}}

## Automated Migration

This migration can be automated:

\`\`\`bash
# Run automated migration script
npm run migration:run {{FROM_VERSION}} {{TO_VERSION}}

# Or use find/replace commands
{{#RENAMES}}
find . -name "*.css" -exec sed -i 's/var(--{{OLD_CSS_NAME}})/var(--{{NEW_CSS_NAME}})/g' {} \\;
find . -name "*.tsx" -exec sed -i 's/{{OLD_TAILWIND_CLASS}}/{{NEW_TAILWIND_CLASS}}/g' {} \\;
{{/RENAMES}}
\`\`\`

## Validation

After migration:

- [ ] Build succeeds: \`npm run build\`
- [ ] No console errors for missing tokens
- [ ] Visual regression tests pass
- [ ] Storybook builds without issues

## Timeline

**Recommended migration timeline:**
1. **Week 1:** Update development environment
2. **Week 2:** Update staging environment  
3. **Week 3:** Update production environment
4. **Week 4:** Remove old token references

**Deprecation schedule:**
- {{FROM_VERSION}}: Tokens deprecated (warnings shown)
- {{TO_VERSION}}: New tokens available
- Next major: Old tokens removed
```

## Test Template

```typescript
// migration-tests/{{FROM_VERSION}}-to-{{TO_VERSION}}.test.ts

import { testMigration } from '../utils/migration-tester';

describe('Token Rename Migration: {{FROM_VERSION}} → {{TO_VERSION}}', () => {
  const migration = require('../scripts/{{FROM_VERSION}}-to-{{TO_VERSION}}');
  
  {{#RENAMES}}
  test('{{OLD_NAME}} → {{NEW_NAME}}', async () => {
    const testFiles = {
      'test.css': 'color: var(--{{OLD_CSS_NAME}});',
      'test.tsx': '<div className="{{OLD_TAILWIND_CLASS}}">Test</div>',
      'test.ts': 'const color = tokens.{{OLD_JS_PATH}};'
    };
    
    const result = await testMigration(migration, testFiles);
    
    expect(result['test.css']).toContain('var(--{{NEW_CSS_NAME}})');
    expect(result['test.css']).not.toContain('var(--{{OLD_CSS_NAME}})');
    
    expect(result['test.tsx']).toContain('{{NEW_TAILWIND_CLASS}}');
    expect(result['test.tsx']).not.toContain('{{OLD_TAILWIND_CLASS}}');
    
    expect(result['test.ts']).toContain('tokens.{{NEW_JS_PATH}}');
    expect(result['test.ts']).not.toContain('tokens.{{OLD_JS_PATH}}');
  });
  {{/RENAMES}}
  
  test('migration is reversible', async () => {
    const originalFiles = {
      'test.css': 'color: var(--{{RENAMES.0.OLD_CSS_NAME}});'
    };
    
    // Apply migration
    const migrated = await testMigration(migration, originalFiles);
    
    // Apply reverse migration
    const reverseMigration = migration.createReverse();
    const reversed = await testMigration(reverseMigration, migrated);
    
    expect(reversed['test.css']).toBe(originalFiles['test.css']);
  });
});
```

## Metadata Template

```json
{
  "templateType": "token-rename",
  "breaking": false,
  "automatable": true,
  "impact": "low",
  "effort": "minimal",
  "platforms": ["css", "scss", "javascript", "typescript", "tailwind"],
  "validation": {
    "required": ["build", "visual-regression"],
    "recommended": ["accessibility", "performance"]
  },
  "timeline": {
    "preparation": "1 week",
    "migration": "1 week", 
    "validation": "1 week",
    "cleanup": "1 week"
  },
  "rollback": {
    "supported": true,
    "automated": true,
    "timeRequired": "1 day"
  }
}
```

## Usage Example

```bash
# Detect renames between versions
npm run migration:detect-renames 2.0.0 2.1.0

# Generate migration from template
npm run migration:generate --template token-rename \
  --from 2.0.0 --to 2.1.0 \
  --renames "cosmic-purple:vergil-purple,electric-violet:vergil-purple-light"

# Test the migration
npm run migration:test 2.0.0 2.1.0

# Apply the migration
npm run migration:apply 2.0.0 2.1.0
```