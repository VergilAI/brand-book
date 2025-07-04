import React from 'react';

/**
 * Example component demonstrating proper token usage
 * Shows how to use primitive, semantic, and component tokens
 */

export const TokenExample = () => {
  return (
    <div className="space-y-8 p-8">
      {/* Using semantic tokens */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Semantic Token Usage</h2>
        
        {/* Background and text colors */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-bg-primary p-4 rounded-md border border-border-default">
            <p className="text-text-primary">Primary Background</p>
            <p className="text-text-secondary">With secondary text</p>
          </div>
          
          <div className="bg-bg-elevated p-4 rounded-md shadow-card">
            <p className="text-text-primary">Elevated Background</p>
            <p className="text-text-tertiary">With tertiary text</p>
          </div>
          
          <div className="bg-bg-brand p-4 rounded-md">
            <p className="text-text-inverse">Brand Background</p>
            <p className="text-text-inverse/80">With inverse text</p>
          </div>
        </div>
      </section>

      {/* Using component tokens via classes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Component Token Classes</h2>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button className="btn-primary btn-sm">Small Primary</button>
          <button className="btn-secondary btn-md">Medium Secondary</button>
          <button className="btn-ghost btn-lg">Large Ghost</button>
          <button className="btn-destructive btn-md" disabled>Disabled</button>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-default">
            <h3 className="font-medium text-text-primary mb-2">Default Card</h3>
            <p className="text-text-secondary">Standard card with default styling</p>
          </div>
          
          <div className="card-interactive cursor-pointer">
            <h3 className="font-medium text-text-primary mb-2">Interactive Card</h3>
            <p className="text-text-secondary">Hover me for effect</p>
          </div>
          
          <div className="card-neural">
            <h3 className="font-medium text-text-primary mb-2">Neural Card</h3>
            <p className="text-text-secondary">With gradient background</p>
          </div>
          
          <div className="card-outlined">
            <h3 className="font-medium text-text-primary mb-2">Outlined Card</h3>
            <p className="text-text-secondary">Border emphasis variant</p>
          </div>
        </div>
      </section>

      {/* Using primitive tokens */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Primitive Token Usage</h2>
        
        {/* Colors */}
        <div className="flex gap-2">
          <div className="w-20 h-20 bg-vergil-purple rounded-md" />
          <div className="w-20 h-20 bg-cosmic-purple rounded-md" />
          <div className="w-20 h-20 bg-electric-violet rounded-md" />
          <div className="w-20 h-20 bg-phosphor-cyan rounded-md" />
          <div className="w-20 h-20 bg-neural-pink rounded-md" />
        </div>
        
        {/* Spacing */}
        <div className="bg-bg-secondary rounded-md">
          <div className="p-xs bg-bg-brand text-text-inverse mb-xs">xs spacing (4px)</div>
          <div className="p-sm bg-bg-brand text-text-inverse mb-sm">sm spacing (8px)</div>
          <div className="p-md bg-bg-brand text-text-inverse mb-md">md spacing (16px)</div>
          <div className="p-lg bg-bg-brand text-text-inverse mb-lg">lg spacing (24px)</div>
        </div>
      </section>

      {/* Using gradient utilities */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Gradient Utilities</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="gradient-consciousness p-8 rounded-lg text-white">
            <p className="font-medium">Consciousness Gradient</p>
          </div>
          <div className="gradient-synaptic p-8 rounded-lg text-white">
            <p className="font-medium">Synaptic Gradient</p>
          </div>
        </div>
      </section>

      {/* Interactive states */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Interactive States</h2>
        
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Default input" 
            className="input"
          />
          <input 
            type="text" 
            placeholder="Error state" 
            className="input border-border-error focus:ring-error/20"
          />
          <input 
            type="text" 
            placeholder="Disabled input" 
            className="input"
            disabled
          />
        </div>
      </section>

      {/* Shadow examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">Shadow Tokens</h2>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-bg-elevated p-4 rounded-md shadow-card">
            <p className="text-sm text-text-secondary">Card Shadow</p>
          </div>
          <div className="bg-bg-elevated p-4 rounded-md shadow-dropdown">
            <p className="text-sm text-text-secondary">Dropdown Shadow</p>
          </div>
          <div className="bg-bg-elevated p-4 rounded-md shadow-modal">
            <p className="text-sm text-text-secondary">Modal Shadow</p>
          </div>
          <div className="bg-bg-elevated p-4 rounded-md shadow-card hover:shadow-card-hover transition-shadow">
            <p className="text-sm text-text-secondary">Hover Me</p>
          </div>
        </div>
      </section>

      {/* CSS Variable usage example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-text-primary">CSS Variable Usage</h2>
        
        <div 
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '2px solid var(--border-brand)',
            boxShadow: 'var(--shadow-card-hover)',
            color: 'var(--text-primary)',
          }}
        >
          <p>This div uses CSS variables directly for all styling</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
            Useful when you need dynamic styling
          </p>
        </div>
      </section>
    </div>
  );
};

export default TokenExample;