import { test } from 'node:test';
import assert from 'node:assert';

// Example of what aligned tokens would look like
const exampleCssTokens = new Map([
  ['primary-purple', '#7B00FF'],
  ['primary-purple-light', '#9933FF'],
  ['foundation-black', '#000000'],
  ['foundation-white', '#FFFFFF'],
]);

const exampleTsTokens = {
  primary: {
    purple: '#7B00FF',
    purpleLight: '#9933FF',
  },
  foundation: {
    black: '#000000',
    white: '#FFFFFF',
  },
};

function flattenTsTokens(obj: any, prefix = ''): Map<string, string> {
  const flattened = new Map<string, string>();
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.startsWith('#')) {
      const kebabKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const fullKey = prefix ? `${prefix}-${kebabKey}` : kebabKey;
      flattened.set(fullKey, value);
    } else if (typeof value === 'object') {
      const kebabKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const nestedFlattened = flattenTsTokens(value, prefix ? `${prefix}-${kebabKey}` : kebabKey);
      nestedFlattened.forEach((val, k) => flattened.set(k, val));
    }
  }
  
  return flattened;
}

test('Example: Properly Aligned Tokens', async (t) => {
  await t.test('should have all CSS tokens in TypeScript', () => {
    const flatTs = flattenTsTokens(exampleTsTokens);
    
    for (const [cssName, cssValue] of exampleCssTokens) {
      assert.ok(flatTs.has(cssName), `CSS token "${cssName}" should exist in TypeScript`);
      assert.strictEqual(flatTs.get(cssName), cssValue, `CSS token "${cssName}" should have matching value`);
    }
  });
  
  await t.test('should have all TypeScript tokens in CSS', () => {
    const flatTs = flattenTsTokens(exampleTsTokens);
    
    for (const [tsName, tsValue] of flatTs) {
      assert.ok(exampleCssTokens.has(tsName), `TypeScript token "${tsName}" should exist in CSS`);
      assert.strictEqual(exampleCssTokens.get(tsName), tsValue, `TypeScript token "${tsName}" should have matching value`);
    }
  });
  
  await t.test('should have exact same number of tokens', () => {
    const flatTs = flattenTsTokens(exampleTsTokens);
    assert.strictEqual(exampleCssTokens.size, flatTs.size, 'CSS and TypeScript should have same number of tokens');
  });
});