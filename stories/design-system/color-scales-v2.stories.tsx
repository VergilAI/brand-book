import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@/generated/tokens';

const meta = {
  title: 'Design System/Color Scales V2',
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive color scales for V2 design system with 10-step scales for brand/semantic colors and 16-step neutral scale.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorScale = ({ scale, name }: { scale: Record<string, string>, name: string }) => {
  const isNeutral = name === 'gray';
  const semanticNames: Record<string, Record<string, string>> = {
    purple: {
      200: 'purple-lightest',
      300: 'purple-lighter', 
      500: 'purple-light',
      600: 'purple (brand)'
    },
    gray: {
      25: 'emphasis-input-bg',
      50: 'off-white',
      100: 'emphasis-bg',
      450: 'footnote',
      700: 'emphasis-input-text',
      750: 'emphasis-text',
      800: 'button-hover',
      850: 'off-black',
      950: 'black'
    },
    red: {
      500: 'error'
    },
    yellow: {
      500: 'warning'
    },
    green: {
      600: 'success'
    },
    blue: {
      600: 'info'
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold capitalize mb-4">{name} Scale</h3>
      <div className="grid gap-2">
        {Object.entries(scale).map(([step, color]) => {
          const semanticName = semanticNames[name]?.[step];
          return (
            <div key={step} className="flex items-center gap-4">
              <div className="w-12 text-right text-sm font-mono">{step}</div>
              <div 
                className="h-12 flex-1 rounded-md shadow-sm"
                style={{ backgroundColor: color }}
              />
              <div className="flex gap-4 items-center">
                <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {color}
                </code>
                {semanticName && (
                  <span className="text-sm text-gray-600">
                    {semanticName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SemanticColorSet = ({ colors, name }: { colors: Record<string, string>, name: string }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold capitalize">{name} Semantic Colors</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(colors).map(([usage, color]) => (
          <div key={usage} className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded shadow-sm"
              style={{ backgroundColor: color }}
            />
            <div>
              <div className="text-sm font-medium">{usage}</div>
              <code className="text-xs text-gray-500">{color}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AllScales: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-8">V2 Color Scales</h2>
        
        <div className="grid gap-12">
          <ColorScale scale={tokens.colors.scales.purple} name="purple" />
          <ColorScale scale={tokens.colors.scales.gray} name="gray" />
          
          <div className="grid grid-cols-2 gap-12">
            <ColorScale scale={tokens.colors.scales.red} name="red" />
            <ColorScale scale={tokens.colors.scales.yellow} name="yellow" />
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <ColorScale scale={tokens.colors.scales.green} name="green" />
            <ColorScale scale={tokens.colors.scales.blue} name="blue" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SemanticMappings: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-8">Semantic Color Mappings</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <SemanticColorSet colors={tokens.colors.semantic.error} name="error" />
        <SemanticColorSet colors={tokens.colors.semantic.warning} name="warning" />
        <SemanticColorSet colors={tokens.colors.semantic.success} name="success" />
        <SemanticColorSet colors={tokens.colors.semantic.info} name="info" />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <ul className="space-y-2 text-sm">
          <li>• Error backgrounds: <code>tokens.colors.semantic.error.background</code></li>
          <li>• Warning borders: <code>tokens.colors.semantic.warning.border</code></li>
          <li>• Success text: <code>tokens.colors.semantic.success.text</code></li>
          <li>• Info icons: <code>tokens.colors.semantic.info.icon</code></li>
        </ul>
      </div>
    </div>
  ),
};

export const ComparisonView: Story = {
  render: () => {
    const scaleSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-8">Color Scale Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Step</th>
                <th className="text-center p-2">Purple</th>
                <th className="text-center p-2">Red</th>
                <th className="text-center p-2">Yellow</th>
                <th className="text-center p-2">Green</th>
                <th className="text-center p-2">Blue</th>
              </tr>
            </thead>
            <tbody>
              {scaleSteps.map(step => (
                <tr key={step}>
                  <td className="p-2 font-mono text-sm">{step}</td>
                  {['purple', 'red', 'yellow', 'green', 'blue'].map(color => {
                    const value = tokens.colors.scales[color as keyof typeof tokens.colors.scales][step];
                    return (
                      <td key={color} className="p-2">
                        <div 
                          className="w-full h-10 rounded shadow-sm"
                          style={{ backgroundColor: value }}
                          title={value}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">Light backgrounds (50-100)</h4>
            <p>Use for subtle backgrounds and hover states</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Medium tones (200-400)</h4>
            <p>Use for borders, dividers, and secondary elements</p>
          </div>
          <div className="p-4 bg-gray-200 rounded-lg">
            <h4 className="font-semibold mb-2">Primary colors (500-600)</h4>
            <p>Use for primary actions, text, and key UI elements</p>
          </div>
          <div className="p-4 bg-gray-800 text-white rounded-lg">
            <h4 className="font-semibold mb-2">Dark shades (700-900)</h4>
            <p>Use for text on light backgrounds and pressed states</p>
          </div>
        </div>
      </div>
    );
  },
};

export const NeutralScaleDetail: Story = {
  render: () => {
    const neutralSteps = [
      { step: '25', usage: 'Near white - emphasis inputs' },
      { step: '50', usage: 'Off-white - soft containers' },
      { step: '100', usage: 'Emphasis bg - attention areas' },
      { step: '150', usage: 'Light gray - subtle borders' },
      { step: '200', usage: 'Gray 200 - dividers' },
      { step: '300', usage: 'Gray 300 - disabled text' },
      { step: '400', usage: 'Gray 400 - placeholders' },
      { step: '450', usage: 'Footnote gray - small text' },
      { step: '500', usage: 'Gray 500 - secondary icons' },
      { step: '600', usage: 'Gray 600 - tertiary text' },
      { step: '700', usage: 'Emphasis input text' },
      { step: '750', usage: 'Emphasis text' },
      { step: '800', usage: 'Button hover - interaction' },
      { step: '850', usage: 'Off-black - primary text' },
      { step: '900', usage: 'Near black - high emphasis' },
      { step: '950', usage: 'Full black - backgrounds only' },
    ];
    
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-8">16-Step Neutral Scale</h2>
        
        <div className="space-y-1">
          {neutralSteps.map(({ step, usage }) => {
            const color = tokens.colors.scales.gray[step as keyof typeof tokens.colors.scales.gray];
            return (
              <div key={step} className="flex items-center gap-4">
                <div className="w-16 text-right text-sm font-mono">{step}</div>
                <div 
                  className="h-12 w-32 rounded border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 flex items-center gap-4">
                  <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {color}
                  </code>
                  <span className="text-sm text-gray-600">{usage}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Apple-Inspired Values Included:</h3>
          <ul className="space-y-1 text-sm">
            <li>• <code>gray.25</code> (#FAFAFC) - emphasis-input-bg</li>
            <li>• <code>gray.50</code> (#F5F5F7) - off-white</li>
            <li>• <code>gray.100</code> (#F0F0F2) - emphasis-bg</li>
            <li>• <code>gray.450</code> (#6C6C6D) - footnote-text</li>
            <li>• <code>gray.700</code> (#323232) - emphasis-input-text</li>
            <li>• <code>gray.750</code> (#303030) - emphasis-text</li>
            <li>• <code>gray.800</code> (#272729) - button-hover</li>
            <li>• <code>gray.850</code> (#1D1D1F) - off-black</li>
          </ul>
        </div>
      </div>
    );
  },
};