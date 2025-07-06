import type { Meta, StoryObj } from '@storybook/react';
import { duration, easing } from '../tokens/primitives';
import { animations, interactiveStates } from '../tokens/semantic';

const meta: Meta = {
  title: 'Design Tokens/Animation',
  parameters: {
    docs: {
      description: {
        component: 'Motion tokens for consistent animations and transitions',
      },
    },
  },
};

export default meta;

// Animation Demo Component
const AnimationBox = ({ 
  children, 
  animationStyle 
}: { 
  children: React.ReactNode;
  animationStyle?: React.CSSProperties;
}) => (
  <div 
    className="bg-purple-600 text-white p-6 rounded-lg text-center"
    style={animationStyle}
  >
    {children}
  </div>
);

export const Durations: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Animation Durations</h2>
      <p className="text-gray-600 mb-8">
        Consistent timing for smooth, predictable animations
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(duration).map(([name, value]) => (
          <div key={name} className="text-center">
            <div className="relative h-32 mb-4">
              <div 
                className="absolute inset-x-0 top-1/2 transform -translate-y-1/2"
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.animation-demo')?.classList.add('animate');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.animation-demo')?.classList.remove('animate');
                }}
              >
                <div 
                  className="animation-demo bg-purple-600 h-16 rounded-lg mx-auto"
                  style={{
                    width: '100px',
                    transition: `transform ${value} ease-out`,
                  }}
                />
                <style jsx>{`
                  .animation-demo.animate {
                    transform: translateX(100px);
                  }
                `}</style>
              </div>
            </div>
            <p className="font-medium mb-1 capitalize">{name}</p>
            <p className="text-sm font-mono text-gray-600">--duration-{name}</p>
            <p className="text-xs text-gray-500">{value}</p>
            <p className="text-xs text-gray-500 mt-1">
              {name === 'instant' && 'No animation'}
              {name === 'fast' && 'Micro-interactions'}
              {name === 'normal' && 'Default transitions'}
              {name === 'slow' && 'Complex animations'}
              {name === 'slower' && 'Page transitions'}
              {name === 'slowest' && 'Elaborate effects'}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Hover over the boxes above to see the animation duration in action
        </p>
      </div>
    </div>
  ),
};

export const EasingFunctions: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Easing Functions</h2>
      <p className="text-gray-600 mb-8">
        Natural motion curves for realistic animations
      </p>
      
      <div className="space-y-6">
        {Object.entries(easing).map(([name, value]) => (
          <div key={name} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold capitalize">{name}</h3>
                <p className="text-sm font-mono text-gray-600">--easing-{name}</p>
                <p className="text-xs text-gray-500">{value}</p>
              </div>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
                onClick={(e) => {
                  const box = e.currentTarget.parentElement?.parentElement?.querySelector('.easing-demo');
                  box?.classList.toggle('move');
                }}
              >
                Animate
              </button>
            </div>
            <div className="relative h-20">
              <div
                className="easing-demo absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-600 w-20 h-12 rounded-md transition-all duration-1000"
                style={{
                  transitionTimingFunction: value,
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {name === 'linear' && 'Constant speed, mechanical feeling'}
              {name === 'in' && 'Slow start, accelerates - use sparingly'}
              {name === 'out' && 'Fast start, decelerates - most natural'}
              {name === 'inOut' && 'Slow start and end - good for large movements'}
              {name === 'outQuart' && 'Quick deceleration - snappy feel'}
              {name === 'outExpo' && 'Very quick deceleration - dramatic'}
              {name === 'outBack' && 'Slight overshoot - playful bounce'}
            </p>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .easing-demo.move {
          transform: translateX(calc(100% - 80px)) translateY(-50%) !important;
        }
      `}</style>
    </div>
  ),
};

export const InteractiveStates: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Interactive States</h2>
      <p className="text-gray-600 mb-8">
        Consistent state transitions for interactive elements
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hover State */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hover State</h3>
          <div className="space-y-4">
            <div 
              className="bg-purple-600 text-white p-6 rounded-lg text-center cursor-pointer transition-all"
              style={{
                transitionDuration: interactiveStates.hover.duration,
                transitionTimingFunction: interactiveStates.hover.easing,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `scale(${interactiveStates.hover.scale})`;
                e.currentTarget.style.opacity = String(interactiveStates.hover.opacity);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              Hover Me
            </div>
            <p className="text-sm text-gray-600">
              Duration: {interactiveStates.hover.duration}, 
              Scale: {interactiveStates.hover.scale}
            </p>
          </div>
        </div>
        
        {/* Pressed State */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pressed State</h3>
          <div className="space-y-4">
            <div 
              className="bg-purple-600 text-white p-6 rounded-lg text-center cursor-pointer transition-all"
              style={{
                transitionDuration: interactiveStates.pressed.duration,
                transitionTimingFunction: interactiveStates.pressed.easing,
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = `scale(${interactiveStates.pressed.scale})`;
                e.currentTarget.style.opacity = String(interactiveStates.pressed.opacity);
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              Click Me
            </div>
            <p className="text-sm text-gray-600">
              Duration: {interactiveStates.pressed.duration}, 
              Scale: {interactiveStates.pressed.scale}
            </p>
          </div>
        </div>
        
        {/* Focus State */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Focus State</h3>
          <div className="space-y-4">
            <button 
              className="bg-purple-600 text-white p-6 rounded-lg text-center w-full focus:outline-none"
              style={{
                borderRadius: interactiveStates.focus.borderRadius,
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = interactiveStates.focus.outline;
                e.currentTarget.style.outlineOffset = interactiveStates.focus.outlineOffset;
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              Tab to Focus
            </button>
            <p className="text-sm text-gray-600">
              Outline: {interactiveStates.focus.outline}
            </p>
          </div>
        </div>
        
        {/* Disabled State */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Disabled State</h3>
          <div className="space-y-4">
            <div 
              className="bg-purple-600 text-white p-6 rounded-lg text-center"
              style={{
                opacity: interactiveStates.disabled.opacity,
                cursor: interactiveStates.disabled.cursor,
              }}
            >
              Disabled
            </div>
            <p className="text-sm text-gray-600">
              Opacity: {interactiveStates.disabled.opacity}, 
              Cursor: {interactiveStates.disabled.cursor}
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AnimationPresets: StoryObj = {
  render: () => (
    <div className="p-6 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6">Animation Presets</h2>
      <p className="text-gray-600 mb-8">
        Pre-composed animations for common UI patterns
      </p>
      
      <div className="space-y-12">
        {/* Transitions */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Transitions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(animations.transition).map(([speed, value]) => (
              <div key={speed} className="text-center">
                <div 
                  className="bg-purple-600 text-white p-6 rounded-lg mb-4 cursor-pointer"
                  style={{ transition: value }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#9333EA';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#7B00FF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {speed} transition
                </div>
                <p className="text-sm font-mono text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fade Animations */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Fade Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Fade In</h4>
              <button 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg"
                onClick={(e) => {
                  const box = e.currentTarget.nextElementSibling;
                  box?.classList.toggle('opacity-0');
                }}
              >
                Toggle Fade In
              </button>
              <div 
                className="mt-4 bg-gray-100 p-6 rounded-lg transition-opacity"
                style={{
                  transitionDuration: animations.fadeIn.duration,
                  transitionTimingFunction: animations.fadeIn.easing,
                }}
              >
                Fade in content
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Fade Out</h4>
              <button 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg"
                onClick={(e) => {
                  const box = e.currentTarget.nextElementSibling;
                  box?.classList.toggle('opacity-0');
                }}
              >
                Toggle Fade Out
              </button>
              <div 
                className="mt-4 bg-gray-100 p-6 rounded-lg transition-opacity"
                style={{
                  transitionDuration: animations.fadeOut.duration,
                  transitionTimingFunction: animations.fadeOut.easing,
                }}
              >
                Fade out content
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AnimationGuide: StoryObj = {
  render: () => (
    <div className="p-6 max-w-4xl prose prose-gray">
      <h2>Animation Guidelines</h2>
      
      <h3>Duration Guidelines</h3>
      <ul>
        <li><strong>instant (0ms):</strong> Use for color changes and immediate feedback</li>
        <li><strong>fast (100ms):</strong> Micro-interactions like hover states</li>
        <li><strong>normal (200ms):</strong> Default for most transitions</li>
        <li><strong>slow (300ms):</strong> Complex state changes, modals appearing</li>
        <li><strong>slower (400ms):</strong> Page transitions, large element movements</li>
        <li><strong>slowest (500ms):</strong> Elaborate animations, avoid for common interactions</li>
      </ul>
      
      <h3>Easing Selection</h3>
      <ul>
        <li><strong>ease-out:</strong> Default choice - feels most natural</li>
        <li><strong>ease-in-out:</strong> Good for elements moving across the screen</li>
        <li><strong>ease-out-back:</strong> Adds personality with slight overshoot</li>
        <li><strong>linear:</strong> Only for continuous animations (loading spinners)</li>
      </ul>
      
      <h3>Performance Best Practices</h3>
      <ul>
        <li>Animate only transform and opacity for best performance</li>
        <li>Use will-change sparingly on animated elements</li>
        <li>Prefer CSS transitions over JavaScript animations</li>
        <li>Test animations on lower-end devices</li>
        <li>Respect prefers-reduced-motion user preference</li>
      </ul>
      
      <h3>Animation Principles</h3>
      <ol>
        <li><strong>Purpose:</strong> Every animation should have a clear purpose</li>
        <li><strong>Speed:</strong> Faster is usually better for UI animations</li>
        <li><strong>Consistency:</strong> Similar actions should have similar animations</li>
        <li><strong>Natural:</strong> Animations should feel physical and realistic</li>
        <li><strong>Subtle:</strong> Good animations often go unnoticed</li>
      </ol>
      
      <h3>Common Patterns</h3>
      <ul>
        <li><strong>Hover:</strong> fast duration, scale 1.02, ease-out</li>
        <li><strong>Press:</strong> instant duration, scale 0.98</li>
        <li><strong>Modal enter:</strong> slow duration, fade + scale, ease-out</li>
        <li><strong>Page transition:</strong> slower duration, slide, ease-in-out</li>
        <li><strong>Loading:</strong> 1-2s duration, linear, infinite</li>
      </ul>
      
      <h3>Accessibility</h3>
      <pre className="language-css">{`/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}</pre>
    </div>
  ),
};