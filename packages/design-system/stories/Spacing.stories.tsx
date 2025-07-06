import type { Meta, StoryObj } from '@storybook/react';
import { spacing } from '../tokens/primitives';
import { semanticSpacing } from '../tokens/semantic';

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  parameters: {
    docs: {
      description: {
        component: 'Apple-inspired 8px base spacing system with emphasis on 16px and 24px',
      },
    },
  },
};

export default meta;

// Spacing Visual Component
const SpacingVisual = ({ 
  value, 
  token, 
  isPrimary = false 
}: { 
  value: string; 
  token: string; 
  isPrimary?: boolean;
}) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="w-24 text-right">
      <span className={`font-mono text-sm ${isPrimary ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
        {token}
      </span>
    </div>
    <div 
      className="bg-purple-600 h-4 rounded"
      style={{ width: value }}
    />
    <div className="text-sm text-gray-600">
      {value}
      {isPrimary && <span className="ml-2 text-purple-600 font-medium">(Primary)</span>}
    </div>
  </div>
);

export const PrimitiveSpacing: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Primitive Spacing Scale</h2>
      <p className="text-gray-600 mb-8">
        8px base system with emphasis on 16px and 24px for primary spacing decisions
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        {Object.entries(spacing).map(([token, value]) => (
          <SpacingVisual 
            key={token}
            token={token}
            value={value}
            isPrimary={value === '16px' || value === '24px'}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Usage Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use 16px (md) as your default spacing unit</li>
          <li>• Use 24px (lg) for comfortable section spacing</li>
          <li>• Reserve 4px (xs) for tight icon padding only</li>
          <li>• Maintain consistent rhythm by using the scale</li>
        </ul>
      </div>
    </div>
  ),
};

export const SemanticSpacing: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Semantic Spacing</h2>
      <p className="text-gray-600 mb-8">
        Purpose-based spacing tokens for consistent layout decisions
      </p>
      
      <div className="space-y-8">
        {/* Component Spacing */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Component Spacing</h3>
          <p className="text-gray-600 mb-4">Internal spacing within components</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            {Object.entries(semanticSpacing.component).map(([token, value]) => (
              <div key={token} className="mb-4">
                <SpacingVisual token={`component.${token}`} value={value} />
                <p className="text-sm text-gray-500 ml-28">
                  {token === 'xs' && 'Icon padding, tight spacing'}
                  {token === 'sm' && 'Compact internal spacing'}
                  {token === 'md' && 'Default component padding'}
                  {token === 'lg' && 'Comfortable component padding'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Layout Spacing */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Layout Spacing</h3>
          <p className="text-gray-600 mb-4">Spacing between layout elements</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            {Object.entries(semanticSpacing.layout).map(([token, value]) => (
              <div key={token} className="mb-4">
                <SpacingVisual token={`layout.${token}`} value={value} />
                <p className="text-sm text-gray-500 ml-28">
                  {token === 'gap' && 'Default gap between elements'}
                  {token === 'section' && 'Between content sections'}
                  {token === 'container' && 'Container padding'}
                  {token === 'page' && 'Page-level spacing'}
                  {token === 'hero' && 'Hero section spacing'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Grid Spacing */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Grid Spacing</h3>
          <p className="text-gray-600 mb-4">Consistent grid and layout gaps</p>
          <div className="bg-gray-50 p-6 rounded-lg">
            {Object.entries(semanticSpacing.grid).map(([token, value]) => (
              <div key={token} className="mb-4">
                <SpacingVisual token={`grid.${token}`} value={value} />
                <p className="text-sm text-gray-500 ml-28">
                  {token === 'gap' && 'Default grid gap'}
                  {token === 'gutter' && 'Grid gutter spacing'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingExamples: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Spacing in Practice</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Component Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Component Example</h3>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <div className="bg-purple-100 p-4 rounded" style={{ padding: spacing.md }}>
              <div className="bg-purple-200 rounded mb-2" style={{ padding: spacing.sm, marginBottom: spacing.sm }}>
                Small padding (8px)
              </div>
              <div className="bg-purple-300 rounded" style={{ padding: spacing.md }}>
                Medium padding (16px)
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Components use semantic spacing tokens
            </p>
          </div>
        </div>
        
        {/* Layout Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Layout Example</h3>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded" style={{ marginBottom: semanticSpacing.layout.gap }}>
                Section 1
              </div>
              <div className="bg-blue-100 p-4 rounded" style={{ marginBottom: semanticSpacing.layout.section }}>
                Section 2
              </div>
              <div className="bg-blue-100 p-4 rounded">
                Section 3
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Layout uses gap (16px) and section (24px) spacing
            </p>
          </div>
        </div>
        
        {/* Grid Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Grid Example</h3>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <div 
              className="grid grid-cols-3"
              style={{ gap: semanticSpacing.grid.gap }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-green-100 p-4 rounded text-center">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Grid gap using semantic token (16px)
            </p>
          </div>
        </div>
        
        {/* Rhythm Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Vertical Rhythm</h3>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <h4 className="text-lg font-semibold" style={{ marginBottom: spacing.sm }}>
              Heading
            </h4>
            <p style={{ marginBottom: spacing.md }}>
              Body text with consistent spacing maintains visual rhythm.
            </p>
            <div className="flex gap-2" style={{ gap: spacing.sm }}>
              <button className="bg-purple-600 text-white px-4 py-2 rounded">
                Button 1
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded">
                Button 2
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Consistent spacing creates rhythm
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Spacing Guidelines</h2>
      
      <h3>Foundation</h3>
      <p>
        Our spacing system is based on an 8px grid, inspired by Apple's Human Interface Guidelines. 
        This creates consistent, harmonious layouts that feel natural to users.
      </p>
      
      <h3>Primary Units</h3>
      <ul>
        <li><strong>16px (md):</strong> The workhorse of our system. Use this as your default spacing.</li>
        <li><strong>24px (lg):</strong> Comfortable spacing for sections and larger gaps.</li>
      </ul>
      
      <h3>Usage Principles</h3>
      <ol>
        <li><strong>Start with 16px:</strong> When in doubt, use md (16px) spacing</li>
        <li><strong>Be consistent:</strong> Use the same spacing for similar elements</li>
        <li><strong>Create hierarchy:</strong> Larger spacing = greater separation</li>
        <li><strong>Maintain rhythm:</strong> Consistent spacing creates visual harmony</li>
      </ol>
      
      <h3>Common Patterns</h3>
      <ul>
        <li><strong>Button padding:</strong> 8px vertical, 16px horizontal</li>
        <li><strong>Card padding:</strong> 16px or 24px</li>
        <li><strong>Section spacing:</strong> 24px between related, 48px between unrelated</li>
        <li><strong>Icon spacing:</strong> 8px from text</li>
        <li><strong>Form field spacing:</strong> 16px between fields</li>
      </ul>
      
      <h3>Do's and Don'ts</h3>
      <h4>Do:</h4>
      <ul>
        <li>Use spacing tokens from the scale</li>
        <li>Apply spacing consistently</li>
        <li>Consider touch targets (minimum 44px)</li>
        <li>Test spacing at different screen sizes</li>
      </ul>
      
      <h4>Don't:</h4>
      <ul>
        <li>Use arbitrary pixel values</li>
        <li>Mix spacing units (px, rem, em)</li>
        <li>Create new spacing values</li>
        <li>Use margins when padding is more appropriate</li>
      </ul>
    </div>
  ),
};