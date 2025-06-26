import type { Meta, StoryObj } from '@storybook/react';

const WelcomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-5xl font-bold mb-4 gradient-text">Welcome to Vergil Design System</h1>
      
      <div className="text-lg text-gray-600 mb-8">
        The living intelligence design system that powers all Vergil products.
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🎨 Design Philosophy</h2>
        <p className="mb-4">
          Our design system embodies the concept of <strong>living intelligence</strong> - interfaces that breathe, respond, and evolve. 
          Every component is crafted to feel alive and conscious, creating a unique user experience that sets Vergil apart.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Living Motion</h3>
            <p className="text-sm text-gray-600">Subtle animations that make the interface feel alive</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Neural Aesthetics</h3>
            <p className="text-sm text-gray-600">Visual patterns inspired by neural networks</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Conscious Interaction</h3>
            <p className="text-sm text-gray-600">Responsive elements that acknowledge user presence</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Evolutionary Design</h3>
            <p className="text-sm text-gray-600">Components that can adapt and grow with use</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🚀 Getting Started</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">For Designers</h3>
            <p className="mb-4">Explore our design tokens to understand the visual language:</p>
            <ul className="space-y-2">
              <li>• <strong>Colors</strong> - The consciousness spectrum</li>
              <li>• <strong>Typography</strong> - Font systems and scales</li>
              <li>• <strong>Spacing</strong> - Consistent spacing system</li>
              <li>• <strong>Animations</strong> - Living motion patterns</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">For Developers</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">1. Generate a new component:</p>
                <pre className="bg-gray-900 text-white p-3 rounded text-sm">
                  npm run generate:component MyComponent -- --category=ui
                </pre>
              </div>
              <div>
                <p className="font-medium mb-1">2. Use design tokens:</p>
                <pre className="bg-gray-900 text-white p-3 rounded text-sm">
                  className="bg-cosmic-purple text-white breathing"
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">🌟 What's Special</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Breathing Components</h3>
          <p className="mb-4">Our signature breathing animation brings components to life:</p>
          <div className="bg-cosmic-purple text-white p-8 rounded-lg breathing inline-block">
            I'm alive and breathing
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Neural Connections</h3>
          <p className="mb-4">Visual representations of intelligence and connectivity:</p>
          <div className="text-electric-violet space-y-1">
            <div>⚡ Neural networks</div>
            <div>🧠 Synaptic patterns</div>
            <div>✨ Consciousness flows</div>
          </div>
        </div>
      </section>

      <footer className="mt-16 p-6 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          Built with ❤️ by the Vergil team. Creating the future of living AI systems.
        </p>
      </footer>
    </div>
  );
};

const meta = {
  title: 'Welcome',
  component: WelcomePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof WelcomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};