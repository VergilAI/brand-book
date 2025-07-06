import type { Meta, StoryObj } from '@storybook/react';
import { colors, gradients } from '../tokens/primitives';
import { semanticColors } from '../tokens/semantic';

const meta: Meta = {
  title: 'Design Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive color system with primitive scales and semantic mappings',
      },
    },
  },
};

export default meta;

// Color Scale Component
const ColorScale = ({ scale, name }: { scale: Record<string, string>; name: string }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 capitalize">{name} Scale</h3>
    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
      {Object.entries(scale).map(([shade, color]) => (
        <div key={shade} className="text-center">
          <div 
            className={`h-16 rounded-md mb-2 border border-gray-200 ${
              parseInt(shade) >= 600 ? 'text-white' : 'text-gray-900'
            } flex items-center justify-center text-xs font-medium`}
            style={{ backgroundColor: color }}
          >
            {shade}
          </div>
          <div className="text-xs text-gray-600">{color}</div>
        </div>
      ))}
    </div>
  </div>
);

// Semantic Color Component
const SemanticColorGroup = ({ 
  colors, 
  title, 
  prefix 
}: { 
  colors: Record<string, string>; 
  title: string; 
  prefix: string;
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(colors).map(([name, color]) => (
        <div key={name} className="space-y-2">
          <div
            className={`h-20 rounded-md border ${
              name.includes('inverse') || name.includes('brand') || color.includes('rgb(0') 
                ? 'text-white' 
                : 'text-gray-900'
            } flex items-center justify-center font-medium`}
            style={{ 
              backgroundColor: name === 'primary' && prefix === 'text' ? color : undefined,
              color: name !== 'primary' || prefix !== 'text' ? color : undefined,
              borderColor: color 
            }}
          >
            {name}
          </div>
          <div className="text-sm">
            <div className="font-mono text-xs text-gray-500">--{prefix}-{name}</div>
            <div className="text-xs text-gray-600">{color}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Gradient Component
const GradientDisplay = ({ gradients }: { gradients: Record<string, string> }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">Gradients</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(gradients).map(([name, gradient]) => (
        <div key={name} className="space-y-2">
          <div
            className="h-24 rounded-lg text-white flex items-center justify-center font-medium"
            style={{ background: gradient }}
          >
            {name}
          </div>
          <div className="text-sm">
            <div className="font-mono text-xs text-gray-500">--gradient-{name}</div>
            <div className="text-xs text-gray-600 truncate">{gradient}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PrimitiveColors: StoryObj = {
  render: () => (
    <div className="p-6 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Primitive Color Scales</h2>
      <p className="text-gray-600 mb-8">
        Foundation color scales providing a comprehensive palette for the design system.
      </p>
      
      <ColorScale scale={colors.purple} name="purple" />
      <ColorScale scale={colors.gray} name="gray" />
      <ColorScale scale={colors.red} name="red" />
      <ColorScale scale={colors.yellow} name="yellow" />
      <ColorScale scale={colors.green} name="green" />
      <ColorScale scale={colors.blue} name="blue" />
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Special Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-white border-2 border-gray-300 rounded-md"></div>
            <div className="text-sm">
              <div className="font-mono text-xs text-gray-500">--white</div>
              <div className="text-xs text-gray-600">{colors.white}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-black rounded-md"></div>
            <div className="text-sm">
              <div className="font-mono text-xs text-gray-500">--black</div>
              <div className="text-xs text-gray-600">{colors.black}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div 
              className="h-16 rounded-md text-white flex items-center justify-center"
              style={{ backgroundColor: colors['vergil-purple'] }}
            >
              Vergil Purple
            </div>
            <div className="text-sm">
              <div className="font-mono text-xs text-gray-500">--vergil-purple</div>
              <div className="text-xs text-gray-600">{colors['vergil-purple']}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div 
              className="h-16 rounded-md text-white flex items-center justify-center"
              style={{ backgroundColor: colors['cosmic-purple'] }}
            >
              Cosmic Purple
            </div>
            <div className="text-sm">
              <div className="font-mono text-xs text-gray-500">--cosmic-purple</div>
              <div className="text-xs text-gray-600">{colors['cosmic-purple']}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SemanticColors: StoryObj = {
  render: () => (
    <div className="p-6 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Semantic Colors</h2>
      <p className="text-gray-600 mb-8">
        Purpose-based color tokens that reference primitive values for consistent theming.
      </p>
      
      <SemanticColorGroup colors={semanticColors.text} title="Text Colors" prefix="text" />
      <SemanticColorGroup colors={semanticColors.background} title="Background Colors" prefix="bg" />
      <SemanticColorGroup colors={semanticColors.border} title="Border Colors" prefix="border" />
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Interactive States</h3>
        {Object.entries(semanticColors.interactive).map(([variant, states]) => (
          <div key={variant} className="mb-6">
            <h4 className="font-medium mb-3 capitalize">{variant}</h4>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(states).map(([state, color]) => (
                <div key={state} className="space-y-2">
                  <div
                    className={`h-12 rounded-md ${
                      color.includes('#') && parseInt(color.slice(1, 3), 16) < 128 
                        ? 'text-white' 
                        : 'text-gray-900'
                    } flex items-center justify-center text-sm font-medium`}
                    style={{ backgroundColor: color }}
                  >
                    {state}
                  </div>
                  <div className="text-xs text-gray-600">{color}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Gradients: StoryObj = {
  render: () => (
    <div className="p-6 max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Gradients</h2>
      <p className="text-gray-600 mb-8">
        Brand gradients for creating visual hierarchy and emphasis.
      </p>
      
      <GradientDisplay gradients={gradients} />
    </div>
  ),
};

export const ColorUsageGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-7xl prose prose-gray">
      <h2>Color Usage Guidelines</h2>
      
      <h3>Primitive Colors</h3>
      <p>
        Primitive colors form the foundation of our color system. Each scale contains 10 shades 
        (except gray which has 16) providing flexibility for various use cases:
      </p>
      <ul>
        <li><strong>50-200:</strong> Light backgrounds, subtle borders</li>
        <li><strong>300-500:</strong> Interactive elements, icons</li>
        <li><strong>600-700:</strong> Primary actions, emphasis (brand moments)</li>
        <li><strong>800-900:</strong> High contrast text, dark themes</li>
      </ul>
      
      <h3>Semantic Colors</h3>
      <p>
        Semantic colors abstract the primitive values into purpose-based tokens:
      </p>
      <ul>
        <li><strong>Text:</strong> Typography hierarchy and emphasis</li>
        <li><strong>Background:</strong> Surface colors and containers</li>
        <li><strong>Border:</strong> Dividers and outlines</li>
        <li><strong>Interactive:</strong> Stateful colors for buttons and controls</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Always use semantic tokens in components, not primitive values</li>
        <li>Purple 600 (#7B00FF) is our primary brand color</li>
        <li>Maintain WCAG AA contrast ratios (4.5:1 for normal text)</li>
        <li>Use color functionally, not decoratively</li>
        <li>Test designs in both light and dark contexts</li>
      </ul>
    </div>
  ),
};