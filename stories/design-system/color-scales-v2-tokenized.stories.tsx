import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@/generated/tokens';

const meta = {
  title: 'Design System/Color Scales V2 (Tokenized)',
  parameters: {
    docs: {
      description: {
        component: 'Color scales using ONLY the centralized token system - no hardcoded values anywhere.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to get all scale values for a color
const getColorScale = (colorName: keyof typeof tokens.colors.scales) => {
  return tokens.colors.scales[colorName];
};

// Helper to get semantic mappings
const getSemanticNames = () => ({
  purple: {
    '200': 'purple-lightest',
    '300': 'purple-lighter', 
    '500': 'purple-light',
    '600': 'purple (brand)'
  },
  gray: {
    '25': 'emphasis-input-bg',
    '50': 'off-white',
    '100': 'emphasis-bg',
    '450': 'footnote',
    '700': 'emphasis-input-text',
    '750': 'emphasis-text',
    '800': 'button-hover',
    '850': 'off-black',
    '950': 'black'
  },
  red: {
    '500': 'error'
  },
  yellow: {
    '500': 'warning'
  },
  green: {
    '600': 'success'
  },
  blue: {
    '600': 'info'
  }
});

const ColorScaleToken = ({ scale, name }: { scale: Record<string, string>, name: string }) => {
  const semanticNames = getSemanticNames();
  
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold capitalize mb-4">{name} Scale</h3>
      <div className="grid gap-2">
        {Object.entries(scale).map(([step, color]) => {
          const semanticName = semanticNames[name as keyof typeof semanticNames]?.[step];
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

const SemanticColorSetToken = ({ name }: { name: 'error' | 'warning' | 'success' | 'info' }) => {
  const colors = tokens.colors.semantic[name];
  
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

export const AllScalesTokenized: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-8">V2 Color Scales (Token System)</h2>
        
        <div className="grid gap-12">
          <ColorScaleToken scale={getColorScale('purple')} name="purple" />
          <ColorScaleToken scale={getColorScale('gray')} name="gray" />
          
          <div className="grid grid-cols-2 gap-12">
            <ColorScaleToken scale={getColorScale('red')} name="red" />
            <ColorScaleToken scale={getColorScale('yellow')} name="yellow" />
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <ColorScaleToken scale={getColorScale('green')} name="green" />
            <ColorScaleToken scale={getColorScale('blue')} name="blue" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SemanticMappingsTokenized: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-8">Semantic Color Mappings (Token System)</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <SemanticColorSetToken name="error" />
        <SemanticColorSetToken name="warning" />
        <SemanticColorSetToken name="success" />
        <SemanticColorSetToken name="info" />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Token Usage Examples:</h3>
        <ul className="space-y-2 text-sm font-mono">
          <li>• Error bg: tokens.colors.semantic.error.background</li>
          <li>• Warning border: tokens.colors.semantic.warning.border</li>
          <li>• Success text: tokens.colors.semantic.success.text</li>
          <li>• Info icon: tokens.colors.semantic.info.icon</li>
        </ul>
      </div>
    </div>
  ),
};

export const ComparisonViewTokenized: Story = {
  render: () => {
    const scaleNames = ['purple', 'red', 'yellow', 'green', 'blue'] as const;
    const scaleSteps = Object.keys(tokens.colors.scales.purple);
    
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-8">Color Scale Comparison (Token System)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Step</th>
                {scaleNames.map(name => (
                  <th key={name} className="text-center p-2 capitalize">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scaleSteps.map(step => (
                <tr key={step}>
                  <td className="p-2 font-mono text-sm">{step}</td>
                  {scaleNames.map(colorName => {
                    const color = tokens.colors.scales[colorName][step];
                    return (
                      <td key={colorName} className="p-2">
                        <div 
                          className="w-full h-10 rounded shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
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
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: tokens.colors.scales.purple['50'] }}
          >
            <h4 className="font-semibold mb-2">Light backgrounds (50-100)</h4>
            <p>Use for subtle backgrounds and hover states</p>
          </div>
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: tokens.colors.scales.gray['100'] }}
          >
            <h4 className="font-semibold mb-2">Medium tones (200-400)</h4>
            <p>Use for borders, dividers, and secondary elements</p>
          </div>
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: tokens.colors.scales.gray['200'] }}
          >
            <h4 className="font-semibold mb-2">Primary colors (500-600)</h4>
            <p>Use for primary actions, text, and key UI elements</p>
          </div>
          <div 
            className="p-4 rounded-lg text-white"
            style={{ backgroundColor: tokens.colors.scales.gray['800'] }}
          >
            <h4 className="font-semibold mb-2">Dark shades (700-900)</h4>
            <p>Use for text on light backgrounds and pressed states</p>
          </div>
        </div>
      </div>
    );
  },
};

export const NeutralScaleDetailTokenized: Story = {
  render: () => {
    const neutralScale = tokens.colors.scales.gray;
    const neutralInfo = [
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
        <h2 className="text-2xl font-bold mb-8">16-Step Neutral Scale (Token System)</h2>
        
        <div className="space-y-1">
          {neutralInfo.map(({ step, usage }) => {
            const color = neutralScale[step];
            return (
              <div key={step} className="flex items-center gap-4">
                <div className="w-16 text-right text-sm font-mono">{step}</div>
                <div 
                  className="h-12 w-32 rounded border"
                  style={{ 
                    backgroundColor: color,
                    borderColor: tokens.colors.scales.gray['200']
                  }}
                />
                <div className="flex-1 flex items-center gap-4">
                  <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {color}
                  </code>
                  <span className="text-sm" style={{ color: tokens.colors.semantic.text.secondary }}>
                    {usage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div 
          className="mt-8 p-4 rounded-lg"
          style={{ backgroundColor: tokens.colors.emphasis.bg }}
        >
          <h3 className="font-semibold mb-2">Token References:</h3>
          <ul className="space-y-1 text-sm font-mono">
            <li>• tokens.colors.scales.gray['25'] → {tokens.colors.emphasis.inputBg}</li>
            <li>• tokens.colors.scales.gray['50'] → {tokens.colors.neutral.offWhite}</li>
            <li>• tokens.colors.scales.gray['100'] → {tokens.colors.emphasis.bg}</li>
            <li>• tokens.colors.scales.gray['450'] → {tokens.colors.emphasis.footnote}</li>
            <li>• tokens.colors.scales.gray['700'] → {tokens.colors.emphasis.inputText}</li>
            <li>• tokens.colors.scales.gray['750'] → {tokens.colors.emphasis.text}</li>
            <li>• tokens.colors.scales.gray['800'] → {tokens.colors.emphasis.buttonHover}</li>
            <li>• tokens.colors.scales.gray['850'] → {tokens.colors.neutral.offBlack}</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const TokenSystemShowcase: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-8">Centralized Token System in Action</h2>
      
      <div className="grid gap-6">
        <div className="p-6 rounded-lg border" style={{ 
          backgroundColor: tokens.colors.semantic.background.primary,
          borderColor: tokens.colors.semantic.border.default 
        }}>
          <h3 className="text-lg font-semibold mb-2" style={{ 
            color: tokens.colors.semantic.text.primary 
          }}>
            Primary Container
          </h3>
          <p style={{ color: tokens.colors.semantic.text.secondary }}>
            This container uses semantic background and border tokens.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded" style={{ 
            backgroundColor: tokens.colors.semantic.error.background,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: tokens.colors.semantic.error.border
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded" style={{ 
                backgroundColor: tokens.colors.semantic.error.icon 
              }} />
              <span className="font-medium" style={{ 
                color: tokens.colors.semantic.error.text 
              }}>
                Error State
              </span>
            </div>
            <p className="text-sm" style={{ color: tokens.colors.semantic.text.secondary }}>
              Using error tokens
            </p>
          </div>

          <div className="p-4 rounded" style={{ 
            backgroundColor: tokens.colors.semantic.warning.background,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: tokens.colors.semantic.warning.border
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded" style={{ 
                backgroundColor: tokens.colors.semantic.warning.icon 
              }} />
              <span className="font-medium" style={{ 
                color: tokens.colors.semantic.warning.text 
              }}>
                Warning State
              </span>
            </div>
            <p className="text-sm" style={{ color: tokens.colors.semantic.text.secondary }}>
              Using warning tokens
            </p>
          </div>

          <div className="p-4 rounded" style={{ 
            backgroundColor: tokens.colors.semantic.success.background,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: tokens.colors.semantic.success.border
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded" style={{ 
                backgroundColor: tokens.colors.semantic.success.icon 
              }} />
              <span className="font-medium" style={{ 
                color: tokens.colors.semantic.success.text 
              }}>
                Success State
              </span>
            </div>
            <p className="text-sm" style={{ color: tokens.colors.semantic.text.secondary }}>
              Using success tokens
            </p>
          </div>

          <div className="p-4 rounded" style={{ 
            backgroundColor: tokens.colors.semantic.info.background,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: tokens.colors.semantic.info.border
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded" style={{ 
                backgroundColor: tokens.colors.semantic.info.icon 
              }} />
              <span className="font-medium" style={{ 
                color: tokens.colors.semantic.info.text 
              }}>
                Info State
              </span>
            </div>
            <p className="text-sm" style={{ color: tokens.colors.semantic.text.secondary }}>
              Using info tokens
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ 
          background: tokens.colors.gradients.consciousness 
        }}>
          <h3 className="text-lg font-semibold mb-2 text-white">
            Brand Gradient
          </h3>
          <p className="text-white/90">
            Using the consciousness gradient token directly from the system.
          </p>
        </div>

        <div className="bg-gray-900 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Token Benefits</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ All colors defined in colors.yaml</li>
            <li>✅ TypeScript types ensure valid token paths</li>
            <li>✅ Single source of truth for all colors</li>
            <li>✅ Zero hardcoded hex values in components</li>
            <li>✅ Automatic Tailwind integration</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};