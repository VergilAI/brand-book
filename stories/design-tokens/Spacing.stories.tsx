import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@vergil/design-system/tokens';

const SpacingBox = ({ size, sizeKey }: { size: string; sizeKey: string }) => {
  const pixels = size.endsWith('px') 
    ? size 
    : size === '0' 
    ? '0px' 
    : `${parseFloat(size) * 16}px`;

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 text-sm font-mono text-gray-600">{sizeKey}</div>
      <div 
        className="bg-cosmic-purple h-8 rounded"
        style={{ width: size }}
      />
      <div className="text-sm text-gray-500">
        {size} · {pixels}
      </div>
    </div>
  );
};

const SpacingDemo = ({ spacing, title }: { spacing: Record<string, string>; title: string }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold mb-6">{title}</h3>
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {Object.entries(spacing).map(([key, value]) => (
        <SpacingBox key={key} sizeKey={key} size={value} />
      ))}
    </div>
  </div>
);

const PaddingDemo = () => {
  const sizes = ['2', '4', '6', '8', '12', '16'];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {sizes.map(size => (
        <div key={size} className="text-center">
          <div 
            className="bg-gray-100 rounded-lg flex items-center justify-center mb-2"
            style={{ padding: tokens.spacing[size as keyof typeof tokens.spacing] }}
          >
            <div className="bg-cosmic-purple text-white px-4 py-2 rounded">
              Content
            </div>
          </div>
          <p className="text-sm font-mono">p-{size}</p>
          <p className="text-xs text-gray-500">{tokens.spacing[size as keyof typeof tokens.spacing]}</p>
        </div>
      ))}
    </div>
  );
};

const MarginDemo = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-100 p-8 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">Gap between elements:</p>
        <div className="flex gap-4">
          <div className="bg-cosmic-purple text-white px-4 py-2 rounded">Item 1</div>
          <div className="bg-electric-violet text-white px-4 py-2 rounded">Item 2</div>
          <div className="bg-luminous-indigo text-white px-4 py-2 rounded">Item 3</div>
        </div>
        <p className="text-sm font-mono mt-4">gap-4 (16px)</p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">Margin between sections:</p>
        <div className="bg-white p-4 rounded mb-8">Section 1</div>
        <div className="bg-white p-4 rounded">Section 2</div>
        <p className="text-sm font-mono mt-4">mb-8 (32px)</p>
      </div>
    </div>
  );
};

export default {
  title: 'Design Tokens/Spacing',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const SpacingScale: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Spacing System</h1>
        <p className="text-lg text-gray-600">
          Consistent spacing scale for margins, padding, and gaps
        </p>
      </div>

      <SpacingDemo 
        spacing={Object.fromEntries(
          Object.entries(tokens.spacing).slice(0, 20)
        )} 
        title="Base Scale (0-10)" 
      />
      
      <SpacingDemo 
        spacing={Object.fromEntries(
          Object.entries(tokens.spacing).slice(20)
        )} 
        title="Extended Scale (11+)" 
      />
    </div>
  ),
};

export const SemanticSpacing: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Semantic Spacing</h1>
        <p className="text-lg text-gray-600">
          Purpose-driven spacing for common use cases
        </p>
      </div>

      <SpacingDemo spacing={tokens.semanticSpacing.component} title="Component Spacing" />
      <SpacingDemo spacing={tokens.semanticSpacing.section} title="Section Spacing" />
      <SpacingDemo spacing={tokens.semanticSpacing.container} title="Container Padding" />
    </div>
  ),
};

export const PaddingExamples: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Padding Examples</h1>
        <p className="text-lg text-gray-600">
          How padding affects element spacing
        </p>
      </div>

      <PaddingDemo />
    </div>
  ),
};

export const MarginExamples: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Margin & Gap Examples</h1>
        <p className="text-lg text-gray-600">
          Creating space between elements
        </p>
      </div>

      <MarginDemo />
    </div>
  ),
};