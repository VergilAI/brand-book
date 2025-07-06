import type { Meta, StoryObj } from '@storybook/react';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from '../tokens/primitives';
import { typography } from '../tokens/semantic';

const meta: Meta = {
  title: 'Design Tokens/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Apple-inspired typography system using Inter with carefully crafted scales',
      },
    },
  },
};

export default meta;

// Font Preview Component
const FontPreview = ({ 
  text = "The quick brown fox jumps over the lazy dog", 
  style 
}: { 
  text?: string; 
  style?: React.CSSProperties;
}) => (
  <div style={style}>{text}</div>
);

export const FontFamilies: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Font Families</h2>
      
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Primary</h3>
          <p className="text-sm text-gray-600 mb-4 font-mono">--font-primary</p>
          <FontPreview 
            style={{ 
              fontFamily: fontFamily.primary,
              fontSize: '18px',
              lineHeight: '1.5'
            }} 
          />
          <p className="text-sm text-gray-500 mt-2">{fontFamily.primary}</p>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monospace</h3>
          <p className="text-sm text-gray-600 mb-4 font-mono">--font-mono</p>
          <FontPreview 
            text="const code = { message: 'Hello World' };"
            style={{ 
              fontFamily: fontFamily.mono,
              fontSize: '16px',
              lineHeight: '1.5'
            }} 
          />
          <p className="text-sm text-gray-500 mt-2">{fontFamily.mono}</p>
        </div>
      </div>
    </div>
  ),
};

export const TypeScale: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Type Scale</h2>
      <p className="text-gray-600 mb-8">
        1.25 ratio (Major Third) scale optimized for readability and hierarchy
      </p>
      
      <div className="space-y-6">
        {Object.entries(fontSize).map(([key, value]) => (
          <div key={key} className="border-b border-gray-200 pb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span 
                style={{ 
                  fontSize: value,
                  fontFamily: fontFamily.primary,
                  lineHeight: 1.2
                }}
              >
                The quick brown fox jumps
              </span>
              <div className="text-sm text-gray-600 ml-4 flex-shrink-0">
                <span className="font-mono">--font-size-{key}</span>
                <span className="ml-2 text-gray-500">{value}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {key === 'xs' && 'Captions, fine print, metadata'}
              {key === 'sm' && 'Secondary text, labels'}
              {key === 'base' && 'DEFAULT body text, paragraphs'}
              {key === 'lg' && 'Large body text, small headings'}
              {key === 'xl' && 'H4 headings'}
              {key === '2xl' && 'H3 headings'}
              {key === '3xl' && 'H2 headings'}
              {key === '4xl' && 'H1 headings, page titles'}
              {key === '5xl' && 'Display text, marketing headers'}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontWeights: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Font Weights</h2>
      <p className="text-gray-600 mb-8">
        Carefully selected weights for optimal readability on screens
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(fontWeight).map(([key, value]) => (
          <div key={key} className="p-6 bg-gray-50 rounded-lg">
            <div 
              className="text-2xl mb-2"
              style={{ 
                fontFamily: fontFamily.primary,
                fontWeight: value
              }}
            >
              The quick brown fox
            </div>
            <p className="text-sm">
              <span className="font-mono text-gray-600">--font-weight-{key}</span>
              <span className="ml-2 text-gray-500">({value})</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {key === 'normal' && 'Body text, most content'}
              {key === 'medium' && 'Slightly emphasized text'}
              {key === 'semibold' && 'Subheadings, important labels'}
              {key === 'bold' && 'Headings, strong emphasis'}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LineHeights: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Line Heights</h2>
      <p className="text-gray-600 mb-8">
        Optimized line heights for different content types
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(lineHeight).map(([key, value]) => (
          <div key={key} className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {key} ({value})
            </h3>
            <p className="text-sm font-mono text-gray-600 mb-4">--line-height-{key}</p>
            <p 
              style={{ 
                fontSize: '16px',
                lineHeight: value as any,
                fontFamily: fontFamily.primary
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
              enim ad minim veniam, quis nostrud exercitation.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              {key === 'tight' && 'Headings, short text'}
              {key === 'normal' && 'DEFAULT body text'}
              {key === 'relaxed' && 'Long-form content'}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LetterSpacing: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Letter Spacing</h2>
      <p className="text-gray-600 mb-8">
        Subtle tracking adjustments for improved readability
      </p>
      
      <div className="space-y-6">
        {Object.entries(letterSpacing).map(([key, value]) => (
          <div key={key} className="p-6 bg-gray-50 rounded-lg">
            <div 
              className={`mb-2 ${key === 'tight' ? 'text-3xl' : key === 'wide' ? 'text-sm uppercase' : 'text-lg'}`}
              style={{ 
                fontFamily: fontFamily.primary,
                letterSpacing: value,
                fontWeight: key === 'tight' ? fontWeight.bold : key === 'wide' ? fontWeight.medium : fontWeight.normal
              }}
            >
              {key === 'wide' ? 'BUTTON TEXT EXAMPLE' : 'The quick brown fox jumps over the lazy dog'}
            </div>
            <p className="text-sm">
              <span className="font-mono text-gray-600">--letter-spacing-{key}</span>
              <span className="ml-2 text-gray-500">({value})</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {key === 'tight' && 'Large headings'}
              {key === 'normal' && 'DEFAULT body text'}
              {key === 'wide' && 'Small caps, buttons'}
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const SemanticTypography: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Semantic Typography</h2>
      <p className="text-gray-600 mb-8">
        Pre-composed text styles for consistent typography across the system
      </p>
      
      <div className="space-y-8">
        {/* Headings */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Headings</h3>
          <div className="space-y-4">
            {Object.entries(typography.text.heading).map(([level, styles]) => (
              <div key={level} className="border-b border-gray-200 pb-4">
                <div 
                  style={{
                    fontFamily: fontFamily.primary,
                    ...styles
                  }}
                >
                  {level.toUpperCase()}: The quick brown fox jumps
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Size: {styles.fontSize}, Weight: {styles.fontWeight}, 
                  Line Height: {styles.lineHeight}, Tracking: {styles.letterSpacing}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Body Text */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Body Text</h3>
          <div className="space-y-4">
            {Object.entries(typography.text.body).map(([size, styles]) => (
              <div key={size} className="p-4 bg-gray-50 rounded-lg">
                <div 
                  style={{
                    fontFamily: fontFamily.primary,
                    ...styles
                  }}
                >
                  Body {size}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Size: {styles.fontSize}, Weight: {styles.fontWeight}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* UI Text */}
        <div>
          <h3 className="text-xl font-semibold mb-4">UI Text</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(typography.text.ui).map(([type, styles]) => (
              <div key={type} className="p-4 bg-gray-50 rounded-lg">
                <div 
                  style={{
                    fontFamily: type === 'code' ? fontFamily.mono : fontFamily.primary,
                    ...styles
                  }}
                >
                  {type === 'label' && 'Form Label Example'}
                  {type === 'caption' && 'This is a caption text'}
                  {type === 'button' && 'BUTTON TEXT'}
                  {type === 'code' && 'const example = true;'}
                </div>
                <p className="text-sm text-gray-500 mt-2 capitalize">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TypographyGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Typography Guidelines</h2>
      
      <h3>Font Selection</h3>
      <p>
        Inter is our primary typeface, chosen for its excellent readability across all sizes 
        and weights. It's designed specifically for user interfaces with careful attention 
        to letter spacing and x-height.
      </p>
      
      <h3>Type Scale</h3>
      <p>
        Our type scale uses a 1.25 ratio (Major Third), creating harmonious size relationships:
      </p>
      <ul>
        <li>Start with 16px as the base (optimal for reading)</li>
        <li>Never go below 12px for body text</li>
        <li>Use the scale consistently - avoid arbitrary sizes</li>
      </ul>
      
      <h3>Font Weights</h3>
      <ul>
        <li><strong>400 (Normal):</strong> Default for all body text</li>
        <li><strong>500 (Medium):</strong> Subtle emphasis without boldness</li>
        <li><strong>600 (Semibold):</strong> Section headers and labels</li>
        <li><strong>700 (Bold):</strong> Page titles and primary headings</li>
      </ul>
      
      <h3>Line Height</h3>
      <ul>
        <li><strong>Tight (1.25):</strong> Headlines and display text</li>
        <li><strong>Normal (1.5):</strong> Body text and UI elements</li>
        <li><strong>Relaxed (1.625):</strong> Long-form reading content</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Prefer weight changes over size for emphasis</li>
        <li>Maintain consistent vertical rhythm with line heights</li>
        <li>Use tight letter-spacing only on large headings</li>
        <li>Apply wide letter-spacing sparingly (buttons, small caps)</li>
        <li>Ensure text remains readable at all sizes</li>
      </ul>
    </div>
  ),
};