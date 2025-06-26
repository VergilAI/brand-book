import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../packages/design-system/tokens';

const TypeSample = ({ 
  size, 
  sizeKey, 
  font = 'sans' 
}: { 
  size: string; 
  sizeKey: string; 
  font?: keyof typeof tokens.typography.fonts 
}) => {
  const fontFamily = tokens.typography.fonts[font];
  
  return (
    <div className="mb-8 pb-8 border-b border-gray-200">
      <div className="flex items-baseline justify-between mb-2">
        <span 
          className="font-medium"
          style={{ fontSize: size, fontFamily }}
        >
          The quick brown fox jumps
        </span>
        <div className="text-sm text-gray-500 ml-4">
          <span className="font-mono">{sizeKey}</span>
          <span className="mx-2">·</span>
          <span>{size}</span>
        </div>
      </div>
    </div>
  );
};

const FontSample = ({ 
  font, 
  fontKey 
}: { 
  font: string; 
  fontKey: string 
}) => {
  return (
    <div className="mb-8 p-6 rounded-lg bg-gray-50">
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-1">{fontKey}</h4>
        <p className="text-sm text-gray-600 font-mono">{font}</p>
      </div>
      <p 
        className="text-2xl mb-3"
        style={{ fontFamily: font }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
      <p 
        className="text-base"
        style={{ fontFamily: font }}
      >
        ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
        abcdefghijklmnopqrstuvwxyz<br />
        0123456789 !@#$%^&*()
      </p>
    </div>
  );
};

const WeightSample = ({ weight, weightKey }: { weight: string; weightKey: string }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span 
        className="text-xl"
        style={{ fontWeight: weight }}
      >
        The quick brown fox jumps
      </span>
      <div className="text-sm text-gray-500">
        <span className="font-mono">{weightKey}</span>
        <span className="mx-2">·</span>
        <span>{weight}</span>
      </div>
    </div>
  );
};

export default {
  title: 'Design Tokens/Typography',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const TypeScale: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Typography Scale</h1>
        <p className="text-lg text-gray-600">
          Consistent type sizing based on Tailwind's scale
        </p>
      </div>

      {Object.entries(tokens.typography.sizes).map(([key, value]) => (
        <TypeSample key={key} sizeKey={key} size={value} />
      ))}
    </div>
  ),
};

export const FontFamilies: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Font Families</h1>
        <p className="text-lg text-gray-600">
          Our carefully selected typefaces for different contexts
        </p>
      </div>

      {Object.entries(tokens.typography.fonts).map(([key, value]) => (
        <FontSample key={key} fontKey={key} font={value} />
      ))}
    </div>
  ),
};

export const FontWeights: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Font Weights</h1>
        <p className="text-lg text-gray-600">
          Weight variations for hierarchy and emphasis
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {Object.entries(tokens.typography.weights).map(([key, value]) => (
          <WeightSample key={key} weightKey={key} weight={value} />
        ))}
      </div>
    </div>
  ),
};

export const LineHeights: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Line Heights</h1>
        <p className="text-lg text-gray-600">
          Spacing between lines for optimal readability
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(tokens.typography.lineHeights).map(([key, value]) => (
          <div key={key} className="p-6 bg-gray-50 rounded-lg">
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-mono">{key}</span> · {value}
            </div>
            <p className="text-base" style={{ lineHeight: value }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};