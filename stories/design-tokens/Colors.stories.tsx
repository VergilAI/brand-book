import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@vergil/design-system/tokens';

const ColorSwatch = ({ name, value, category }: { name: string; value: string; category: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={copyToClipboard}
    >
      <div 
        className="w-24 h-24 rounded-lg shadow-md group-hover:scale-105 transition-transform"
        style={{ backgroundColor: value }}
      />
      <div className="text-center">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{value}</p>
        <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to copy
        </p>
      </div>
    </div>
  );
};

const ColorGrid = ({ colors, title }: { colors: Record<string, string>; title: string }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold mb-6">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Object.entries(colors).map(([key, value]) => (
        <ColorSwatch key={key} name={key} value={value} category={title} />
      ))}
    </div>
  </div>
);

const GradientSwatch = ({ name, value }: { name: string; value: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div 
      className="cursor-pointer group"
      onClick={copyToClipboard}
    >
      <div 
        className="h-32 rounded-lg shadow-md group-hover:scale-105 transition-transform"
        style={{ background: value }}
      />
      <div className="mt-2">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500 truncate">{value}</p>
        <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to copy
        </p>
      </div>
    </div>
  );
};

export default {
  title: 'Design Tokens/Colors',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const AllColors: StoryObj = {
  render: () => (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Vergil Color System</h1>
        <p className="text-lg text-gray-600">
          The living intelligence color palette. Click any color to copy its value.
        </p>
      </div>

      <ColorGrid colors={tokens.colors.primary} title="Primary Colors" />
      <ColorGrid colors={tokens.colors.accent} title="Accent Colors" />
      <ColorGrid colors={tokens.colors.foundation} title="Foundation Colors" />
      <ColorGrid colors={tokens.colors.semantic} title="Semantic Colors" />
      
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(tokens.colors.gradients).map(([key, value]) => (
            <GradientSwatch key={key} name={key} value={value} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const PrimaryPalette: StoryObj = {
  render: () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">Primary Palette</h2>
      <p className="mb-8 text-gray-600">
        The consciousness spectrum - our core brand colors that represent living intelligence.
      </p>
      <ColorGrid colors={tokens.colors.primary} title="" />
    </div>
  ),
};

export const AccentPalette: StoryObj = {
  render: () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">Accent Palette</h2>
      <p className="mb-8 text-gray-600">
        Neural energy colors - used for highlights, interactions, and special emphasis.
      </p>
      <ColorGrid colors={tokens.colors.accent} title="" />
    </div>
  ),
};