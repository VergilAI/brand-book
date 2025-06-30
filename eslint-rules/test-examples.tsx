/**
 * Test Examples for Vergil Design Token ESLint Rules
 * This file demonstrates violations and correct usage patterns
 * Use: npm run lint:tokens -- eslint-rules/test-examples.tsx
 */

import React from 'react';
// Missing token import - should trigger require-design-tokens rule

// ❌ VIOLATIONS - These should be flagged by ESLint

// 1. Hardcoded Colors
const BadColorExamples = () => (
  <div>
    {/* Hex colors */}
    <div style={{ backgroundColor: '#7B00FF' }}>Hex color</div>
    <div style={{ color: '#000000' }}>Black text</div>
    
    {/* RGB colors */}
    <div style={{ background: 'rgb(123, 0, 255)' }}>RGB color</div>
    <div style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>RGBA border</div>
    
    {/* HSL colors */}
    <div style={{ color: 'hsl(270, 100%, 24%)' }}>HSL color</div>
    
    {/* Named colors */}
    <div style={{ background: 'purple' }}>Named color</div>
    <div style={{ color: 'black' }}>Named black</div>
    
    {/* Arbitrary Tailwind colors */}
    <div className="bg-[#7B00FF] text-[rgb(255,255,255)]">Arbitrary colors</div>
    <div className="border-[#000] shadow-[0_0_10px_rgba(0,0,0,0.5)]">More arbitrary</div>
  </div>
);

// 2. Hardcoded Spacing
const BadSpacingExamples = () => (
  <div>
    {/* Pixel values */}
    <div style={{ padding: '16px', margin: '24px' }}>Pixel spacing</div>
    <div style={{ gap: '12px', width: '320px' }}>More pixels</div>
    
    {/* Rem values */}
    <div style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>Rem values</div>
    
    {/* Arbitrary Tailwind spacing */}
    <div className="p-[16px] m-[24px]">Arbitrary padding/margin</div>
    <div className="gap-[12px] w-[320px]">Arbitrary gap/width</div>
    <div className="text-[14px] leading-[1.5]">Arbitrary typography</div>
  </div>
);

// 3. Deprecated Tokens
const BadDeprecatedExamples = () => (
  <div>
    {/* V1 color classes */}
    <div className="bg-cosmic-purple text-electric-violet">Deprecated colors</div>
    <div className="border-luminous-indigo">More deprecated</div>
    
    {/* Legacy token access (would need token import) */}
    {/* <div style={{ color: tokens.colors.legacy.cosmicPurple }}>Legacy token</div> */}
  </div>
);

// 4. Mixed Violations
const BadMixedExamples = () => (
  <div 
    style={{ 
      backgroundColor: '#6366F1', // Hardcoded color
      padding: '20px',           // Hardcoded spacing
      margin: '1.5rem',          // Hardcoded spacing
      borderColor: 'purple',     // Named color
      fontSize: '18px'           // Hardcoded typography
    }}
    className="shadow-[0_4px_12px_rgba(99,102,241,0.15)] rounded-[8px]" // Arbitrary values
  >
    Mixed violations
  </div>
);

// ✅ CORRECT USAGE - These should pass ESLint

import { tokens } from '../generated/tokens'; // Proper token import

const GoodExamples = () => (
  <div>
    {/* Using design tokens */}
    <div style={{ 
      backgroundColor: tokens.colors.brand.purple,
      color: tokens.colors.neutral.offWhite,
      padding: tokens.spacing.scale[4],
      margin: tokens.spacing.scale[6],
      borderRadius: tokens.spacing.radius.md,
      fontSize: tokens.typography.sizes.lg,
    }}>
      Using design tokens
    </div>
    
    {/* Standard Tailwind classes */}
    <div className="bg-vergil-purple text-vergil-off-white p-4 m-6 rounded-md text-lg">
      Standard Tailwind classes
    </div>
    
    {/* Allowed hardcoded values */}
    <div style={{ 
      opacity: 0.5,        // Numbers are OK
      zIndex: 1000,        // Numbers are OK
      position: 'relative', // Keywords are OK
      display: 'flex',     // Keywords are OK
      backgroundColor: 'transparent', // Allowed color
      margin: 'auto',      // Allowed spacing
      width: '100%',       // Allowed percentage
    }}>
      Allowed hardcoded values
    </div>
    
    {/* CSS functions (should be allowed) */}
    <div style={{ 
      width: 'calc(100% - 2rem)',
      background: 'var(--custom-bg)',
      height: 'min(100vh, 800px)',
    }}>
      CSS functions allowed
    </div>
    
    {/* Complex gradients (should be allowed in arbitrary) */}
    <div className="bg-[linear-gradient(135deg,theme(colors.purple.500)_0%,theme(colors.blue.500)_100%)]">
      Complex gradient allowed
    </div>
  </div>
);

// Template literals and dynamic values
const DynamicExamples = () => {
  const isActive = true;
  
  return (
    <div>
      {/* ❌ Bad: Hardcoded colors in template literal */}
      <div 
        className={`base-class ${isActive ? 'bg-[#7B00FF]' : 'bg-[#6366F1]'}`}
      >
        Dynamic with hardcoded colors
      </div>
      
      {/* ✅ Good: Design tokens in template literal */}
      <div 
        className={`base-class ${isActive ? 'bg-vergil-purple' : 'bg-vergil-purple-light'}`}
      >
        Dynamic with token classes
      </div>
      
      {/* ✅ Good: Using CSS variables */}
      <div 
        style={{ 
          backgroundColor: isActive 
            ? tokens.colors.brand.purple 
            : tokens.colors.brand.purpleLight 
        }}
      >
        Dynamic with tokens
      </div>
    </div>
  );
};

// Styled components example
import styled from 'styled-components';

// ❌ Bad: Hardcoded values in styled-components
const BadStyledButton = styled.button`
  background-color: #7B00FF;  /* Hardcoded color */
  padding: 16px 24px;         /* Hardcoded spacing */
  font-size: 14px;            /* Hardcoded typography */
  border-radius: 8px;         /* Hardcoded radius */
  
  &:hover {
    background-color: #9933FF; /* Hardcoded hover color */
  }
`;

// ✅ Good: Using design tokens in styled-components
const GoodStyledButton = styled.button`
  background-color: ${tokens.colors.brand.purple};
  padding: ${tokens.spacing.scale[4]} ${tokens.spacing.scale[6]};
  font-size: ${tokens.typography.sizes.sm};
  border-radius: ${tokens.spacing.radius.md};
  
  &:hover {
    background-color: ${tokens.colors.brand.purpleLight};
  }
`;

export {
  BadColorExamples,
  BadSpacingExamples,
  BadDeprecatedExamples,
  BadMixedExamples,
  GoodExamples,
  DynamicExamples,
  BadStyledButton,
  GoodStyledButton,
};