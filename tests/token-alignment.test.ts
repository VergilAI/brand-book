import { validateTokens } from '../scripts/validate-tokens';

describe('Token Alignment', () => {
  it('should have CSS variables and TypeScript tokens aligned', () => {
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
      
      throw new Error(`Token alignment validation failed with ${errors.length} error(s):\n\n${errorMessages}`);
    }
    
    expect(isValid).toBe(true);
  });
  
  it('should follow naming conventions', () => {
    const { isValid, errors } = validateTokens();
    
    const namingErrors = errors.filter(e => e.type === 'naming-mismatch');
    
    if (namingErrors.length > 0) {
      const messages = namingErrors.map(e => e.message).join('\n');
      throw new Error(`Naming convention violations found:\n\n${messages}`);
    }
    
    expect(namingErrors).toHaveLength(0);
  });
  
  it('should have matching color values', () => {
    const { isValid, errors } = validateTokens();
    
    const valueErrors = errors.filter(e => e.type === 'value-mismatch');
    
    if (valueErrors.length > 0) {
      const messages = valueErrors.map(e => 
        `--${e.cssName}: CSS=${e.cssValue}, TS=${e.tsValue}`
      ).join('\n');
      throw new Error(`Color value mismatches found:\n\n${messages}`);
    }
    
    expect(valueErrors).toHaveLength(0);
  });
});