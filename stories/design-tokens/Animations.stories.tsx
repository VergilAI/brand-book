import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../packages/design-system/tokens';
import React from 'react';

const AnimationDemo = ({ 
  name, 
  duration, 
  description 
}: { 
  name: string; 
  duration: string; 
  description: string;
}) => {
  const animationStyle = {
    animation: `${name} ${duration} ${tokens.animations.easings.smooth} infinite`,
  };

  // Add keyframes to document
  React.useEffect(() => {
    const styleId = `animation-${name}`;
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      
      const keyframeString = `@keyframes ${name} {
        ${Object.entries(tokens.animations.keyframes[name as keyof typeof tokens.animations.keyframes] || {})
          .map(([key, value]) => `${key} { ${Object.entries(value).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')} }`)
          .join(' ')}
      }`;
      
      styleElement.textContent = keyframeString;
      document.head.appendChild(styleElement);
    }
    
    return () => {
      // Cleanup on unmount
    };
  }, [name]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-gray-600">{description}</p>
          <p className="text-sm text-gray-500 font-mono mt-1">Duration: {duration}</p>
        </div>
        <div 
          className="w-20 h-20 bg-cosmic-purple rounded-lg"
          style={animationStyle}
        />
      </div>
    </div>
  );
};

const EasingDemo = ({ name, value }: { name: string; value: string }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-gray-500 font-mono">{value}</p>
        </div>
        <button
          onClick={handleClick}
          className="px-3 py-1 text-sm bg-cosmic-purple text-white rounded hover:bg-electric-violet transition-colors"
        >
          Play
        </button>
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        <div 
          className={`absolute top-0 left-0 h-full bg-cosmic-purple rounded transition-all ${isAnimating ? 'w-full' : 'w-0'}`}
          style={{ 
            transitionDuration: '1s',
            transitionTimingFunction: value,
          }}
        />
      </div>
    </div>
  );
};

const DurationBar = ({ name, duration }: { name: string; duration: string }) => {
  const widthPercentage = Math.min((parseInt(duration) / 6000) * 100, 100);
  
  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="w-24 text-sm font-mono">{name}</div>
      <div className="flex-1 bg-gray-200 rounded h-6 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-electric-violet rounded"
          style={{ width: `${widthPercentage}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {duration}
        </span>
      </div>
    </div>
  );
};

export default {
  title: 'Design Tokens/Animations',
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const LivingAnimations: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Living System Animations</h1>
        <p className="text-lg text-gray-600">
          Organic animations that bring the interface to life
        </p>
      </div>

      <AnimationDemo 
        name="breathing" 
        duration={tokens.animations.durations.breathing}
        description="Subtle scale and opacity animation for living elements"
      />
      
      <AnimationDemo 
        name="pulseGlow" 
        duration={tokens.animations.durations.pulse}
        description="Glowing pulse effect for highlights and focus states"
      />
      
      <AnimationDemo 
        name="float" 
        duration={tokens.animations.durations.float}
        description="Gentle floating motion for ambient elements"
      />
      
      <AnimationDemo 
        name="synapticPulse" 
        duration={tokens.animations.durations.pulse}
        description="Neural pulse effect for connections and energy"
      />
    </div>
  ),
};

export const Durations: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Animation Durations</h1>
        <p className="text-lg text-gray-600">
          Consistent timing for smooth interactions
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {Object.entries(tokens.animations.durations).map(([key, value]) => (
          <DurationBar key={key} name={key} duration={value} />
        ))}
      </div>
    </div>
  ),
};

export const Easings: StoryObj = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Easing Functions</h1>
        <p className="text-lg text-gray-600">
          Natural motion curves for realistic animations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Standard Easings</h3>
          {Object.entries(tokens.animations.easings).slice(0, 4).map(([key, value]) => (
            <EasingDemo key={key} name={key} value={value} />
          ))}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Custom Easings</h3>
          {Object.entries(tokens.animations.easings).slice(4).map(([key, value]) => (
            <EasingDemo key={key} name={key} value={value} />
          ))}
        </div>
      </div>
    </div>
  ),
};