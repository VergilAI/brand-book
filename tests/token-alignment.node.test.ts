import { test } from 'node:test';
import assert from 'node:assert';
import { validateTokens } from '../scripts/validate-tokens';

test('Token Alignment', async (t) => {
  await t.test('should have CSS variables and TypeScript tokens aligned', () => {
    const { isValid, errors } = validateTokens();
    
    if (!isValid) {
      // Create a detailed error message
      const errorMessages = errors.map(error => {
        switch (error.type) {
          case 'value-mismatch':
            return `Value mismatch: --${error.cssName} has "${error.cssValue}" in CSS but "${error.tsValue}" in TypeScript`;
          case 'missing-in-css':
            return `Missing in CSS: TypeScript token "${error.tsName}" (${error.tsValue}) has no corresponding CSS variable`;
          case 'missing-in-ts':
            return `Missing in TypeScript: CSS variable "--${error.cssName}" (${error.cssValue}) has no corresponding TypeScript token`;
          case 'naming-mismatch':
            return `Naming mismatch: ${error.message}`;
          default:
            return error.message;
        }
      }).join('\n');
      
      assert.fail(`Token alignment validation failed with ${errors.length} error(s):\n\n${errorMessages}`);
    }
    
    assert.strictEqual(isValid, true);
  });
  
  await t.test('should follow naming conventions', () => {
    const { errors } = validateTokens();
    
    const namingErrors = errors.filter(e => e.type === 'naming-mismatch');
    
    if (namingErrors.length > 0) {
      const messages = namingErrors.map(e => e.message).join('\n');
      assert.fail(`Naming convention violations found:\n\n${messages}`);
    }
    
    assert.strictEqual(namingErrors.length, 0);
  });
  
  await t.test('should have matching color values', () => {
    const { errors } = validateTokens();
    
    const valueErrors = errors.filter(e => e.type === 'value-mismatch');
    
    if (valueErrors.length > 0) {
      const messages = valueErrors.map(e => 
        `--${e.cssName}: CSS=${e.cssValue}, TS=${e.tsValue}`
      ).join('\n');
      assert.fail(`Color value mismatches found:\n\n${messages}`);
    }
    
    assert.strictEqual(valueErrors.length, 0);
  });
});