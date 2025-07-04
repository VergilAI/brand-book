'use client'

import React from 'react'

export function TokenShowcase() {
  return (
    <div className="p-2xl bg-bg-secondary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-text-primary mb-sm">
            Vergil Token System
          </h1>
          <p className="text-xl text-text-secondary">
            A comprehensive design token system for consistent UI
          </p>
        </div>

        {/* Color Showcase */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Colors</h2>
          
          <div className="space-y-xl">
            {/* Color Scales */}
            <div>
              <h3 className="text-xl font-semibold mb-lg">Color Scales</h3>
              
              {/* Purple Scale */}
              <div className="mb-lg">
                <h4 className="text-lg font-medium mb-md">Purple Scale - Brand Colors</h4>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-sm">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`h-16 rounded-md mb-xs ${shade >= 600 ? 'text-white' : ''}`}
                        style={{ backgroundColor: `var(--color-purple-${shade})` }}
                      />
                      <div className="text-xs font-medium">{shade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gray Scale */}
              <div className="mb-lg">
                <h4 className="text-lg font-medium mb-md">Gray Scale - Neutrals</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-sm">
                  {[25, 50, 100, 150, 200, 300, 400, 450, 500, 600, 700, 750, 800, 850, 900, 950].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className={`h-16 rounded-md mb-xs border ${shade >= 600 ? 'text-white' : ''}`}
                        style={{ backgroundColor: `var(--color-gray-${shade})` }}
                      />
                      <div className="text-xs font-medium">{shade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Color Scales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {/* Red Scale */}
                <div>
                  <h4 className="text-md font-medium mb-sm">Red - Error States</h4>
                  <div className="grid grid-cols-5 gap-xs">
                    {[50, 200, 400, 600, 800].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`h-12 rounded-sm mb-xs ${shade >= 600 ? 'text-white' : ''}`}
                          style={{ backgroundColor: `var(--color-red-${shade})` }}
                        />
                        <div className="text-xs">{shade}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Green Scale */}
                <div>
                  <h4 className="text-md font-medium mb-sm">Green - Success States</h4>
                  <div className="grid grid-cols-5 gap-xs">
                    {[50, 200, 400, 600, 800].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`h-12 rounded-sm mb-xs ${shade >= 600 ? 'text-white' : ''}`}
                          style={{ backgroundColor: `var(--color-green-${shade})` }}
                        />
                        <div className="text-xs">{shade}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yellow Scale */}
                <div>
                  <h4 className="text-md font-medium mb-sm">Yellow - Warning States</h4>
                  <div className="grid grid-cols-5 gap-xs">
                    {[50, 200, 400, 600, 800].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`h-12 rounded-sm mb-xs ${shade >= 700 ? 'text-white' : ''}`}
                          style={{ backgroundColor: `var(--color-yellow-${shade})` }}
                        />
                        <div className="text-xs">{shade}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blue Scale */}
                <div>
                  <h4 className="text-md font-medium mb-sm">Blue - Info States</h4>
                  <div className="grid grid-cols-5 gap-xs">
                    {[50, 200, 400, 600, 800].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`h-12 rounded-sm mb-xs ${shade >= 600 ? 'text-white' : ''}`}
                          style={{ backgroundColor: `var(--color-blue-${shade})` }}
                        />
                        <div className="text-xs">{shade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-lg">Semantic Colors</h3>
              
              {/* Text Colors */}
              <div className="mb-lg">
                <h4 className="text-lg font-medium mb-md">Text Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
                  <div>
                    <div className="text-text-primary font-medium">Primary</div>
                    <div className="text-sm text-text-secondary">text-text-primary</div>
                  </div>
                  <div>
                    <div className="text-text-secondary font-medium">Secondary</div>
                    <div className="text-sm text-text-secondary">text-text-secondary</div>
                  </div>
                  <div>
                    <div className="text-text-emphasis font-medium">Emphasis</div>
                    <div className="text-sm text-text-secondary">text-text-emphasis</div>
                  </div>
                  <div>
                    <div className="text-text-brand font-medium">Brand</div>
                    <div className="text-sm text-text-secondary">text-text-brand</div>
                  </div>
                  <div>
                    <div className="text-text-success font-medium">Success</div>
                    <div className="text-sm text-text-secondary">text-text-success</div>
                  </div>
                  <div>
                    <div className="text-text-error font-medium">Error</div>
                    <div className="text-sm text-text-secondary">text-text-error</div>
                  </div>
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h4 className="text-lg font-medium mb-md">Background Colors</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
                  <div className="bg-bg-primary p-md rounded-md border border-border-default">
                    <div className="font-medium">Primary</div>
                    <div className="text-sm text-text-secondary">bg-bg-primary</div>
                  </div>
                  <div className="bg-bg-secondary p-md rounded-md border border-border-subtle">
                    <div className="font-medium">Secondary</div>
                    <div className="text-sm text-text-secondary">bg-bg-secondary</div>
                  </div>
                  <div className="bg-bg-emphasis p-md rounded-md">
                    <div className="font-medium">Emphasis</div>
                    <div className="text-sm text-text-secondary">bg-bg-emphasis</div>
                  </div>
                  <div className="bg-bg-elevated p-md rounded-md shadow-card">
                    <div className="font-medium">Elevated</div>
                    <div className="text-sm text-text-secondary">bg-bg-elevated</div>
                  </div>
                  <div className="bg-bg-brand p-md rounded-md text-text-inverse">
                    <div className="font-medium">Brand</div>
                    <div className="text-sm opacity-80">bg-bg-brand</div>
                  </div>
                  <div className="bg-bg-inverse p-md rounded-md text-text-inverse">
                    <div className="font-medium">Inverse</div>
                    <div className="text-sm opacity-80">bg-bg-inverse</div>
                  </div>
                  <div className="bg-bg-errorLight p-md rounded-md border border-border-error">
                    <div className="font-medium text-text-error">Error Light</div>
                    <div className="text-sm text-text-secondary">bg-bg-errorLight</div>
                  </div>
                  <div className="bg-bg-successLight p-md rounded-md border border-border-success">
                    <div className="font-medium text-text-success">Success Light</div>
                    <div className="text-sm text-text-secondary">bg-bg-successLight</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Showcase */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Spacing</h2>
          <p className="text-text-secondary mb-lg">Apple-inspired 8px base with emphasis on 16px and 24px</p>
          
          <div className="space-y-md">
            {[
              { token: 'xs', value: '4px', primary: false },
              { token: 'sm', value: '8px', primary: false },
              { token: 'md', value: '16px', primary: true },
              { token: 'lg', value: '24px', primary: true },
              { token: 'xl', value: '32px', primary: false },
              { token: '2xl', value: '48px', primary: false },
              { token: '3xl', value: '64px', primary: false },
            ].map(({ token, value, primary }) => (
              <div key={token} className="flex items-center gap-lg">
                <div className="w-20 text-right">
                  <span className={`font-mono text-sm ${primary ? 'text-text-brand font-semibold' : ''}`}>
                    {token}
                  </span>
                </div>
                <div className={`bg-bg-brand h-4 rounded-xs`} style={{ width: value }} />
                <div className="text-sm text-text-secondary">
                  {value} {primary && <span className="text-text-brand font-medium">(Primary)</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Typography</h2>
          
          <div className="space-y-xl">
            {/* Font Families */}
            <div>
              <h3 className="text-lg font-semibold mb-md">Font Families</h3>
              <div className="space-y-sm">
                <div>
                  <p className="font-primary">Primary: Inter - The quick brown fox jumps over the lazy dog</p>
                  <p className="text-sm text-text-secondary">font-primary</p>
                </div>
                <div>
                  <p className="font-mono">Monospace: SF Mono - const code = "Hello World";</p>
                  <p className="text-sm text-text-secondary">font-mono</p>
                </div>
              </div>
            </div>

            {/* Type Scale */}
            <div>
              <h3 className="text-lg font-semibold mb-md">Type Scale (1.25 ratio - Major Third)</h3>
              <div className="space-y-sm">
                <div>
                  <div className="text-xs">text-xs (12px) - Captions, fine print, metadata</div>
                  <div className="text-sm text-text-secondary">The quick brown fox jumps over the lazy dog</div>
                </div>
                <div>
                  <div className="text-sm">text-sm (14px) - Secondary text, labels</div>
                  <div className="text-sm text-text-secondary">The quick brown fox jumps over the lazy dog</div>
                </div>
                <div>
                  <div className="text-base bg-bg-brandLight px-sm py-xs rounded-sm inline-block">text-base (16px) - DEFAULT body text</div>
                  <div className="text-base mt-xs">The quick brown fox jumps over the lazy dog</div>
                </div>
                <div>
                  <div className="text-lg">text-lg (20px) - Large body text, small headings</div>
                  <div className="text-sm text-text-secondary">The quick brown fox jumps over the lazy dog</div>
                </div>
                <div>
                  <div className="text-xl">text-xl (24px) - H4 headings</div>
                  <div className="text-sm text-text-secondary">The quick brown fox jumps</div>
                </div>
                <div>
                  <div className="text-2xl">text-2xl (30px) - H3 headings</div>
                  <div className="text-sm text-text-secondary">The quick brown fox</div>
                </div>
                <div>
                  <div className="text-3xl">text-3xl (36px) - H2 headings</div>
                  <div className="text-sm text-text-secondary">The quick brown</div>
                </div>
                <div>
                  <div className="text-4xl">text-4xl (48px) - H1 headings</div>
                  <div className="text-sm text-text-secondary">The quick</div>
                </div>
                <div>
                  <div className="text-5xl">text-5xl (60px) - Display</div>
                  <div className="text-sm text-text-secondary">Display</div>
                </div>
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h3 className="text-lg font-semibold mb-md">Font Weights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div>
                  <div className="text-lg font-normal">Normal (400)</div>
                  <div className="text-sm text-text-secondary">Body text</div>
                </div>
                <div>
                  <div className="text-lg font-medium">Medium (500)</div>
                  <div className="text-sm text-text-secondary">Emphasized text</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">Semibold (600)</div>
                  <div className="text-sm text-text-secondary">Subheadings</div>
                </div>
                <div>
                  <div className="text-lg font-bold">Bold (700)</div>
                  <div className="text-sm text-text-secondary">Headings</div>
                </div>
              </div>
            </div>

            {/* Line Heights */}
            <div>
              <h3 className="text-lg font-semibold mb-md">Line Heights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                <div>
                  <h4 className="font-medium mb-sm">Tight (1.25)</h4>
                  <p className="leading-tight">Perfect for headings and short text blocks where you want a more compact appearance. Reduces vertical space between lines.</p>
                  <p className="text-sm text-text-secondary mt-sm">leading-tight</p>
                </div>
                <div>
                  <h4 className="font-medium mb-sm bg-bg-brandLight px-sm py-xs rounded-sm inline-block">Normal (1.5) - DEFAULT</h4>
                  <p className="leading-normal">Ideal for body text and paragraphs. Provides optimal readability for most content. This is the default line height for all text.</p>
                  <p className="text-sm text-text-secondary mt-sm">leading-normal</p>
                </div>
                <div>
                  <h4 className="font-medium mb-sm">Relaxed (1.625)</h4>
                  <p className="leading-relaxed">Best for long-form content and articles. The extra space between lines improves readability for extended reading sessions.</p>
                  <p className="text-sm text-text-secondary mt-sm">leading-relaxed</p>
                </div>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <h3 className="text-lg font-semibold mb-md">Letter Spacing</h3>
              <div className="space-y-md">
                <div>
                  <h4 className="text-3xl tracking-tight">Tight (-0.025em) - Large headings</h4>
                  <p className="text-sm text-text-secondary">tracking-tight</p>
                </div>
                <div>
                  <h4 className="text-xl tracking-normal bg-bg-brandLight px-sm py-xs rounded-sm inline-block">Normal (0) - DEFAULT body text</h4>
                  <p className="text-sm text-text-secondary">tracking-normal</p>
                </div>
                <div>
                  <h4 className="text-base tracking-wide uppercase">Wide (0.025em) - Small caps, buttons</h4>
                  <p className="text-sm text-text-secondary">tracking-wide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows & Borders */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Shadows & Borders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Shadows */}
            <div>
              <h3 className="text-lg font-medium mb-md">Shadows</h3>
              <div className="space-y-md">
                <div className="p-md bg-bg-elevated rounded-md shadow-sm">
                  shadow-sm
                </div>
                <div className="p-md bg-bg-elevated rounded-md shadow-card">
                  shadow-card
                </div>
                <div className="p-md bg-bg-elevated rounded-md shadow-dropdown">
                  shadow-dropdown
                </div>
                <div className="p-md bg-bg-elevated rounded-md shadow-modal">
                  shadow-modal
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <h3 className="text-lg font-medium mb-md">Border Radius</h3>
              <div className="space-y-md">
                <div className="p-md bg-bg-brand text-text-inverse rounded-xs">
                  rounded-xs (4px)
                </div>
                <div className="p-md bg-bg-brand text-text-inverse rounded-sm">
                  rounded-sm (6px)
                </div>
                <div className="p-md bg-bg-brand text-text-inverse rounded-md">
                  rounded-md (8px)
                </div>
                <div className="p-md bg-bg-brand text-text-inverse rounded-lg">
                  rounded-lg (12px)
                </div>
              </div>
            </div>

            {/* Borders */}
            <div>
              <h3 className="text-lg font-medium mb-md">Borders</h3>
              <div className="space-y-md">
                <div className="p-md border border-border-subtle rounded-md">
                  border-subtle
                </div>
                <div className="p-md border border-border-default rounded-md">
                  border-default
                </div>
                <div className="p-md border-2 border-border-focus rounded-md">
                  border-focus
                </div>
                <div className="p-md border-2 border-border-brand rounded-md">
                  border-brand
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Component Classes</h2>
          
          <div className="space-y-lg">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-medium mb-md">Buttons</h3>
              <div className="flex flex-wrap gap-md">
                <button className="btn-primary btn-sm">Small Primary</button>
                <button className="btn-primary btn-md">Medium Primary</button>
                <button className="btn-primary btn-lg">Large Primary</button>
                <button className="btn-secondary btn-md">Secondary</button>
                <button className="btn-ghost btn-md">Ghost</button>
                <button className="btn-success btn-md">Success</button>
                <button className="btn-destructive btn-md">Destructive</button>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-medium mb-md">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="card-default">
                  <h4 className="font-medium mb-sm">Default Card</h4>
                  <p className="text-text-secondary">Basic card styling</p>
                </div>
                <div className="card-interactive">
                  <h4 className="font-medium mb-sm">Interactive Card</h4>
                  <p className="text-text-secondary">Hover me!</p>
                </div>
                <div className="card-neural">
                  <h4 className="font-medium mb-sm">Neural Card</h4>
                  <p className="text-text-secondary">With gradient background</p>
                </div>
                <div className="card-outlined">
                  <h4 className="font-medium mb-sm">Outlined Card</h4>
                  <p className="text-text-secondary">Border emphasis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animation */}
        <section className="card-default">
          <h2 className="text-2xl font-semibold mb-lg">Animation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Duration */}
            <div>
              <h3 className="text-lg font-medium mb-md">Duration</h3>
              <div className="space-y-sm">
                <button className="btn-secondary btn-md w-full transition-colors duration-fast hover:bg-bg-brand hover:text-text-inverse">
                  duration-fast (100ms)
                </button>
                <button className="btn-secondary btn-md w-full transition-colors duration-normal hover:bg-bg-brand hover:text-text-inverse">
                  duration-normal (200ms) - DEFAULT
                </button>
                <button className="btn-secondary btn-md w-full transition-colors duration-slow hover:bg-bg-brand hover:text-text-inverse">
                  duration-slow (300ms)
                </button>
              </div>
            </div>

            {/* Easing */}
            <div>
              <h3 className="text-lg font-medium mb-md">Easing</h3>
              <div className="space-y-sm">
                <div className="p-md bg-bg-primary rounded-md transition-transform duration-normal ease-out hover:translate-x-2">
                  ease-out (DEFAULT)
                </div>
                <div className="p-md bg-bg-primary rounded-md transition-transform duration-normal ease-in-out hover:translate-x-2">
                  ease-in-out
                </div>
                <div className="p-md bg-bg-primary rounded-md transition-transform duration-normal ease-out-back hover:translate-x-2">
                  ease-out-back (playful)
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}