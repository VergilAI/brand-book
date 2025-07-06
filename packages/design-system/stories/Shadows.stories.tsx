import type { Meta, StoryObj } from '@storybook/react';
import { shadows } from '../tokens/primitives';
import { semanticShadows } from '../tokens/semantic';

const meta: Meta = {
  title: 'Design Tokens/Shadows',
  parameters: {
    docs: {
      description: {
        component: 'Elevation system with subtle shadows and brand-colored glows',
      },
    },
  },
};

export default meta;

// Shadow Preview Component
const ShadowBox = ({ 
  shadow, 
  name, 
  description 
}: { 
  shadow: string; 
  name: string; 
  description?: string;
}) => (
  <div className="text-center">
    <div 
      className="bg-white rounded-lg p-8 mb-4 border border-gray-100"
      style={{ boxShadow: shadow }}
    >
      <div className="text-sm font-medium text-gray-700">{name}</div>
    </div>
    <p className="text-sm font-mono text-gray-600">--shadow-{name}</p>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

export const PrimitiveShadows: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Primitive Shadows</h2>
      <p className="text-gray-600 mb-8">
        Foundation shadow scale for creating depth and hierarchy
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <ShadowBox 
          shadow={shadows.none} 
          name="none" 
          description="No shadow"
        />
        <ShadowBox 
          shadow={shadows.sm} 
          name="sm" 
          description="Subtle elevation"
        />
        <ShadowBox 
          shadow={shadows.md} 
          name="md" 
          description="Default elevation"
        />
        <ShadowBox 
          shadow={shadows.lg} 
          name="lg" 
          description="High elevation"
        />
        <ShadowBox 
          shadow={shadows.xl} 
          name="xl" 
          description="Maximum elevation"
        />
      </div>
      
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Brand Shadows</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ShadowBox 
            shadow={shadows.brandSm} 
            name="brandSm" 
            description="Subtle brand glow"
          />
          <ShadowBox 
            shadow={shadows.brandMd} 
            name="brandMd" 
            description="Medium brand glow"
          />
          <ShadowBox 
            shadow={shadows.brandLg} 
            name="brandLg" 
            description="Strong brand glow"
          />
          <ShadowBox 
            shadow={shadows.brandGlow} 
            name="brandGlow" 
            description="Intense brand glow"
          />
        </div>
      </div>
    </div>
  ),
};

export const SemanticShadows: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Semantic Shadows</h2>
      <p className="text-gray-600 mb-8">
        Purpose-based shadows for consistent component elevation
      </p>
      
      <div className="space-y-12">
        {/* UI Element Shadows */}
        <div>
          <h3 className="text-xl font-semibold mb-6">UI Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ShadowBox 
              shadow={semanticShadows.card} 
              name="card" 
              description="Default card elevation"
            />
            <ShadowBox 
              shadow={semanticShadows.cardHover} 
              name="cardHover" 
              description="Card hover state"
            />
            <ShadowBox 
              shadow={semanticShadows.dropdown} 
              name="dropdown" 
              description="Dropdown menus"
            />
            <ShadowBox 
              shadow={semanticShadows.modal} 
              name="modal" 
              description="Modal dialogs"
            />
            <ShadowBox 
              shadow={semanticShadows.popover} 
              name="popover" 
              description="Popovers & tooltips"
            />
            <ShadowBox 
              shadow={semanticShadows.toast} 
              name="toast" 
              description="Toast notifications"
            />
          </div>
        </div>
        
        {/* Focus Shadows */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Focus States</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <button 
                className="bg-white border-2 border-purple-600 rounded-lg px-6 py-3 mb-4"
                style={{ boxShadow: semanticShadows.focus }}
              >
                Default Focus
              </button>
              <p className="text-sm font-mono text-gray-600">--shadow-focus</p>
            </div>
            <div className="text-center">
              <button 
                className="bg-white border-2 border-red-500 rounded-lg px-6 py-3 mb-4"
                style={{ boxShadow: semanticShadows.focusError }}
              >
                Error Focus
              </button>
              <p className="text-sm font-mono text-gray-600">--shadow-focus-error</p>
            </div>
            <div className="text-center">
              <button 
                className="bg-white border-2 border-green-600 rounded-lg px-6 py-3 mb-4"
                style={{ boxShadow: semanticShadows.focusSuccess }}
              >
                Success Focus
              </button>
              <p className="text-sm font-mono text-gray-600">--shadow-focus-success</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ShadowExamples: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Shadow Examples</h2>
      
      <div className="space-y-12">
        {/* Interactive Cards */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Interactive Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-lg p-6 transition-shadow duration-200 hover:shadow-md cursor-pointer"
              style={{ boxShadow: semanticShadows.card }}
            >
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-gray-600 text-sm">Hover me to see elevation change</p>
            </div>
            <div 
              className="bg-white rounded-lg p-6"
              style={{ boxShadow: semanticShadows.cardHover }}
            >
              <h4 className="font-semibold mb-2">Elevated Card</h4>
              <p className="text-gray-600 text-sm">Already in hover state</p>
            </div>
            <div 
              className="bg-purple-600 text-white rounded-lg p-6"
              style={{ boxShadow: semanticShadows.brandMd }}
            >
              <h4 className="font-semibold mb-2">Brand Card</h4>
              <p className="text-purple-100 text-sm">With brand shadow glow</p>
            </div>
          </div>
        </div>
        
        {/* Layered UI */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Layered UI Example</h3>
          <div className="relative">
            {/* Base layer */}
            <div className="bg-white rounded-lg p-8" style={{ boxShadow: semanticShadows.card }}>
              <h4 className="font-semibold mb-4">Base Layer</h4>
              
              {/* Dropdown */}
              <div className="absolute top-16 left-8 bg-white rounded-lg p-4 w-48" 
                   style={{ boxShadow: semanticShadows.dropdown }}>
                <p className="text-sm font-medium mb-2">Dropdown Menu</p>
                <div className="space-y-1">
                  <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm">Option 1</div>
                  <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm">Option 2</div>
                  <div className="px-2 py-1 hover:bg-gray-100 rounded text-sm">Option 3</div>
                </div>
              </div>
              
              {/* Popover */}
              <div className="absolute top-16 right-8 bg-white rounded-lg p-4 w-48" 
                   style={{ boxShadow: semanticShadows.popover }}>
                <p className="text-sm font-medium mb-2">Popover</p>
                <p className="text-xs text-gray-600">Additional information displayed on hover or click</p>
              </div>
            </div>
            
            {/* Modal backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center"
                 style={{ marginTop: '100px' }}>
              <div className="bg-white rounded-lg p-6 max-w-sm" 
                   style={{ boxShadow: semanticShadows.modal }}>
                <h4 className="font-semibold mb-2">Modal Dialog</h4>
                <p className="text-sm text-gray-600 mb-4">Maximum elevation for overlays</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm">
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Examples */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Notifications</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 max-w-sm" 
                 style={{ boxShadow: semanticShadows.toast }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium">Success toast notification</p>
              </div>
            </div>
            <div className="bg-purple-600 text-white rounded-lg p-4 max-w-sm" 
                 style={{ boxShadow: semanticShadows.brandGlow }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p className="text-sm font-medium">Brand notification with glow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ShadowGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Shadow Guidelines</h2>
      
      <h3>Elevation Principles</h3>
      <p>
        Shadows create depth and hierarchy in the interface. They help users understand 
        which elements are interactive and how components relate to each other.
      </p>
      
      <h3>Shadow Scale</h3>
      <ul>
        <li><strong>sm:</strong> Subtle elevation for cards and containers</li>
        <li><strong>md:</strong> Default elevation for interactive elements</li>
        <li><strong>lg:</strong> High elevation for dropdowns and menus</li>
        <li><strong>xl:</strong> Maximum elevation for modals and overlays</li>
      </ul>
      
      <h3>Semantic Usage</h3>
      <ul>
        <li><strong>Cards:</strong> Use card shadow, increase to cardHover on interaction</li>
        <li><strong>Dropdowns:</strong> Always use dropdown shadow for floating menus</li>
        <li><strong>Modals:</strong> Use modal shadow for maximum elevation</li>
        <li><strong>Toasts:</strong> Use toast shadow for notifications</li>
        <li><strong>Focus:</strong> Use colored focus shadows for accessibility</li>
      </ul>
      
      <h3>Brand Shadows</h3>
      <p>
        Brand shadows add a purple glow effect. Use sparingly for:
      </p>
      <ul>
        <li>Primary call-to-action buttons</li>
        <li>Important notifications</li>
        <li>Feature highlights</li>
        <li>Loading states</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Higher elevation = more important or temporary</li>
        <li>Use consistent shadows for similar components</li>
        <li>Animate shadow transitions for smooth interactions</li>
        <li>Consider shadow direction (top-down lighting)</li>
        <li>Test shadows on different backgrounds</li>
      </ul>
      
      <h3>Accessibility</h3>
      <ul>
        <li>Don't rely solely on shadows for meaning</li>
        <li>Ensure sufficient contrast without shadows</li>
        <li>Use focus shadows for keyboard navigation</li>
        <li>Test with reduced motion preferences</li>
      </ul>
    </div>
  ),
};