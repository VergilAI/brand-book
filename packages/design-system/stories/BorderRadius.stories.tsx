import type { Meta, StoryObj } from '@storybook/react';
import { borderRadius } from '../tokens/primitives';

const meta: Meta = {
  title: 'Design Tokens/Border Radius',
  parameters: {
    docs: {
      description: {
        component: 'Corner radius system for consistent rounded edges across components',
      },
    },
  },
};

export default meta;

// Border Radius Visual Component
const RadiusBox = ({ 
  radius, 
  name, 
  description 
}: { 
  radius: string; 
  name: string; 
  description?: string;
}) => (
  <div className="text-center">
    <div 
      className="bg-purple-600 h-24 w-24 mb-3 mx-auto"
      style={{ borderRadius: radius }}
    />
    <p className="text-sm font-medium mb-1">{name}</p>
    <p className="text-xs font-mono text-gray-600">--radius-{name}</p>
    <p className="text-xs text-gray-500">{radius}</p>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

export const RadiusScale: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Border Radius Scale</h2>
      <p className="text-gray-600 mb-8">
        Consistent corner radius values for a cohesive design language
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(borderRadius)
          .filter(([key]) => key !== 'full')
          .map(([name, value]) => (
            <RadiusBox 
              key={name}
              radius={value}
              name={name}
              description={
                name === 'none' ? 'Sharp corners' :
                name === 'xs' ? 'Subtle rounding' :
                name === 'sm' ? 'Small components' :
                name === 'md' ? 'Default radius' :
                name === 'lg' ? 'Cards, modals' :
                name === 'xl' ? 'Large containers' :
                name === '2xl' ? 'Extra large' : undefined
              }
            />
        ))}
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Special Values</h3>
        <div className="flex justify-center">
          <div className="text-center">
            <div 
              className="bg-purple-600 h-24 w-24 mb-3 mx-auto"
              style={{ borderRadius: borderRadius.full }}
            />
            <p className="text-sm font-medium mb-1">full</p>
            <p className="text-xs font-mono text-gray-600">--radius-full</p>
            <p className="text-xs text-gray-500">{borderRadius.full}</p>
            <p className="text-xs text-gray-500 mt-1">Perfect circles</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ComponentExamples: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Component Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Buttons</h3>
          <div className="space-y-4">
            <button 
              className="bg-purple-600 text-white px-6 py-2 w-full"
              style={{ borderRadius: borderRadius.sm }}
            >
              Small Radius Button (6px)
            </button>
            <button 
              className="bg-purple-600 text-white px-6 py-2 w-full"
              style={{ borderRadius: borderRadius.md }}
            >
              Medium Radius Button (8px)
            </button>
            <button 
              className="bg-purple-600 text-white px-6 py-2 w-full"
              style={{ borderRadius: borderRadius.full }}
            >
              Pill Button (50%)
            </button>
          </div>
        </div>
        
        {/* Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Cards</h3>
          <div className="space-y-4">
            <div 
              className="bg-gray-100 p-6"
              style={{ borderRadius: borderRadius.md }}
            >
              <h4 className="font-medium mb-2">Default Card</h4>
              <p className="text-sm text-gray-600">8px radius for standard cards</p>
            </div>
            <div 
              className="bg-gray-100 p-6"
              style={{ borderRadius: borderRadius.lg }}
            >
              <h4 className="font-medium mb-2">Large Card</h4>
              <p className="text-sm text-gray-600">12px radius for prominent cards</p>
            </div>
          </div>
        </div>
        
        {/* Input Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Input Fields</h3>
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Extra small radius (4px)"
              className="w-full px-4 py-2 border border-gray-300"
              style={{ borderRadius: borderRadius.xs }}
            />
            <input 
              type="text"
              placeholder="Small radius (6px)"
              className="w-full px-4 py-2 border border-gray-300"
              style={{ borderRadius: borderRadius.sm }}
            />
            <input 
              type="text"
              placeholder="Medium radius (8px)"
              className="w-full px-4 py-2 border border-gray-300"
              style={{ borderRadius: borderRadius.md }}
            />
          </div>
        </div>
        
        {/* Badges & Tags */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Badges & Tags</h3>
          <div className="flex flex-wrap gap-3">
            <span 
              className="bg-purple-100 text-purple-700 px-3 py-1 text-sm"
              style={{ borderRadius: borderRadius.xs }}
            >
              XS Badge
            </span>
            <span 
              className="bg-purple-100 text-purple-700 px-3 py-1 text-sm"
              style={{ borderRadius: borderRadius.sm }}
            >
              SM Badge
            </span>
            <span 
              className="bg-purple-100 text-purple-700 px-3 py-1 text-sm"
              style={{ borderRadius: borderRadius.full }}
            >
              Pill Badge
            </span>
          </div>
        </div>
        
        {/* Avatars */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Avatars</h3>
          <div className="flex gap-4">
            <div 
              className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center"
              style={{ borderRadius: borderRadius.md }}
            >
              A
            </div>
            <div 
              className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center"
              style={{ borderRadius: borderRadius.lg }}
            >
              B
            </div>
            <div 
              className="bg-purple-600 text-white w-12 h-12 flex items-center justify-center"
              style={{ borderRadius: borderRadius.full }}
            >
              C
            </div>
          </div>
        </div>
        
        {/* Modal Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Modal</h3>
          <div 
            className="bg-white border-2 border-gray-200 p-6 shadow-lg"
            style={{ borderRadius: borderRadius.xl }}
          >
            <h4 className="font-medium mb-2">Modal Dialog</h4>
            <p className="text-sm text-gray-600 mb-4">
              16px radius for modal containers
            </p>
            <div className="flex gap-2">
              <button 
                className="bg-purple-600 text-white px-4 py-2 text-sm"
                style={{ borderRadius: borderRadius.sm }}
              >
                Confirm
              </button>
              <button 
                className="border border-gray-300 px-4 py-2 text-sm"
                style={{ borderRadius: borderRadius.sm }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MixedRadii: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Mixed Border Radii</h2>
      <p className="text-gray-600 mb-8">
        Examples of selective corner rounding for specific UI patterns
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top corners only */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Top Corners Only</h3>
          <div 
            className="bg-purple-600 text-white p-6"
            style={{ 
              borderTopLeftRadius: borderRadius.lg,
              borderTopRightRadius: borderRadius.lg,
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0'
            }}
          >
            Modal Header
          </div>
          <div className="bg-gray-100 p-6">
            Modal Body Content
          </div>
        </div>
        
        {/* Single corner */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Single Corner</h3>
          <div 
            className="bg-purple-100 text-purple-700 p-6 inline-block"
            style={{ 
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xs,
              borderBottomLeftRadius: borderRadius.xs,
              borderBottomRightRadius: borderRadius.xs
            }}
          >
            Notification Badge
          </div>
        </div>
        
        {/* Grouped buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Group</h3>
          <div className="flex">
            <button 
              className="bg-purple-600 text-white px-4 py-2 border-r border-purple-700"
              style={{ 
                borderTopLeftRadius: borderRadius.md,
                borderBottomLeftRadius: borderRadius.md,
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0'
              }}
            >
              Left
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 border-r border-purple-700">
              Center
            </button>
            <button 
              className="bg-purple-600 text-white px-4 py-2"
              style={{ 
                borderTopRightRadius: borderRadius.md,
                borderBottomRightRadius: borderRadius.md,
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0'
              }}
            >
              Right
            </button>
          </div>
        </div>
        
        {/* Nested radii */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Nested Radii</h3>
          <div 
            className="bg-gray-200 p-4"
            style={{ borderRadius: borderRadius.lg }}
          >
            <div 
              className="bg-white p-4"
              style={{ borderRadius: borderRadius.md }}
            >
              Inner content with smaller radius
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const RadiusGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Border Radius Guidelines</h2>
      
      <h3>Scale Overview</h3>
      <ul>
        <li><strong>xs (4px):</strong> Subtle rounding for small UI elements</li>
        <li><strong>sm (6px):</strong> Default for buttons and inputs</li>
        <li><strong>md (8px):</strong> Standard for cards and containers</li>
        <li><strong>lg (12px):</strong> Prominent containers and modals</li>
        <li><strong>xl (16px):</strong> Large feature cards</li>
        <li><strong>2xl (20px):</strong> Hero sections and banners</li>
        <li><strong>full (50%):</strong> Perfect circles and pills</li>
      </ul>
      
      <h3>Component Mapping</h3>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Recommended Radius</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Buttons</td>
            <td>sm (6px) or full for pills</td>
          </tr>
          <tr>
            <td>Input fields</td>
            <td>sm (6px)</td>
          </tr>
          <tr>
            <td>Cards</td>
            <td>md (8px) or lg (12px)</td>
          </tr>
          <tr>
            <td>Modals</td>
            <td>lg (12px) or xl (16px)</td>
          </tr>
          <tr>
            <td>Badges</td>
            <td>xs (4px) or full</td>
          </tr>
          <tr>
            <td>Avatars</td>
            <td>full (50%) for circles</td>
          </tr>
          <tr>
            <td>Tooltips</td>
            <td>sm (6px)</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use consistent radii for related components</li>
        <li>Larger elements generally need larger radii</li>
        <li>Consider the hierarchy - important elements can have larger radii</li>
        <li>Match border radius to your brand personality</li>
        <li>Test rounded corners at different sizes</li>
      </ul>
      
      <h3>Nested Elements</h3>
      <p>
        When nesting rounded elements, use the following formula to maintain 
        visual consistency:
      </p>
      <pre>innerRadius = outerRadius - padding</pre>
      <p>
        This ensures the inner corners appear concentric with the outer corners.
      </p>
      
      <h3>Accessibility</h3>
      <ul>
        <li>Ensure rounded corners don't cut off important content</li>
        <li>Maintain sufficient click/tap area on rounded buttons</li>
        <li>Consider how border radius affects focus indicators</li>
      </ul>
    </div>
  ),
};