'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, X, Globe, Check, AlertCircle, Cookie, Bell, Sparkles } from 'lucide-react'
import { useState } from 'react'

// Apple-style region selector component
const RegionSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('Hungary')
  
  const regions = [
    'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Hungary', 'Japan', 'China'
  ]
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-vergil-emphasis-input-bg text-vergil-emphasis-text rounded-md hover:bg-gray-100 transition-colors text-sm"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-vergil-full-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => {
                setSelected(region)
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-vergil-off-white transition-colors flex items-center justify-between"
            >
              <span className={region === selected ? 'text-vergil-emphasis-text font-medium' : 'text-vergil-off-black'}>
                {region}
              </span>
              {region === selected && <Check className="w-4 h-4 text-vergil-purple" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ColorsV2Page() {
  const [showRegionBar, setShowRegionBar] = useState(true)
  const [showCookieBanner, setShowCookieBanner] = useState(true)
  const [showUpdateNotice, setShowUpdateNotice] = useState(true)
  const [showBetaFeature, setShowBetaFeature] = useState(true)

  return (
    <>
      <div className="mb-12">
        <h1 className="text-h1 font-bold mb-4">Color System v2: Apple-Inspired Monochrome</h1>
        <p className="text-body-lg text-gray-600">
          A sophisticated evolution of our color system inspired by Apple's subtle attention hierarchy
          and refined neutral palette.
        </p>
      </div>

      {/* Core Principles */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-h2">Core Principles</CardTitle>
          <CardDescription>The philosophy behind our v2 color system</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-h4 font-semibold mb-3">Sophisticated Neutrals</h3>
              <p className="text-body-sm text-gray-600">
                Moving beyond pure black and white to create a more refined, comfortable reading experience
                with carefully chosen off-blacks and off-whites.
              </p>
            </div>
            <div>
              <h3 className="text-h4 font-semibold mb-3">Subtle Attention</h3>
              <p className="text-body-sm text-gray-600">
                Drawing user attention through barely perceptible color shifts rather than stark contrasts,
                creating a calm, professional interface.
              </p>
            </div>
            <div>
              <h3 className="text-h4 font-semibold mb-3">Clear Usage Rules</h3>
              <p className="text-body-sm text-gray-600">
                Each color has specific use cases and rules, ensuring consistency across all touchpoints
                and preventing accessibility issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Brand Purple Palette</h2>
        <p className="text-body-lg text-gray-600 mb-8">
          The complete Vergil purple color system with semantic variations for different use cases.
        </p>
        
        <div className="grid gap-6 mb-8">
          {/* Primary Purple */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-purple rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-purple</h3>
                  <p className="text-sm text-gray-600">#7B00FF</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-purple</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Primary brand identity</li>
                    <li>• CTA buttons</li>
                    <li>• Interactive elements</li>
                    <li>• Brand emphasis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ White text on purple bg</li>
                    <li>✓ Purple on white/off-white</li>
                    <li>✗ Purple on black</li>
                    <li>✓ Purple borders/outlines</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Primary CTA</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Links</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Active states</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purple Light */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-purple-light rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-purple-light</h3>
                  <p className="text-sm text-gray-600">#9933FF</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-purple-light</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Hover states</li>
                    <li>• Secondary emphasis</li>
                    <li>• Light theme accents</li>
                    <li>• Interactive feedback</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Button hover states</li>
                    <li>✓ Link hover effects</li>
                    <li>✓ Selected states</li>
                    <li>✓ Focus indicators</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Hover</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Selected</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Focus</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purple Lighter */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-purple-lighter rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-purple-lighter</h3>
                  <p className="text-sm text-gray-600">#BB66FF</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-purple-lighter</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Dark theme primary</li>
                    <li>• Gradient midpoints</li>
                    <li>• Dark backgrounds</li>
                    <li>• Softer emphasis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ On dark backgrounds</li>
                    <li>✓ Dark mode buttons</li>
                    <li>✓ Gradient colors</li>
                    <li>✓ Badge colors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dark mode</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Gradients</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Badges</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purple Lightest */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-purple-lightest rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-purple-lightest</h3>
                  <p className="text-sm text-gray-600">#D199FF</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-purple-lightest</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Secondary text on dark</li>
                    <li>• Subtle brand hints</li>
                    <li>• Background tints</li>
                    <li>• Disabled states</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Dark mode secondary</li>
                    <li>✓ Background accents</li>
                    <li>✓ Disabled elements</li>
                    <li>✓ Subtle borders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Secondary</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Disabled</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Accents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deprecated Cosmic Purple */}
          <Card className="opacity-60">
            <CardContent className="p-6 relative">
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">DEPRECATED</div>
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-cosmic-purple rounded-lg mb-3"></div>
                  <h3 className="font-semibold">cosmic-purple (deprecated)</h3>
                  <p className="text-sm text-gray-600">#6366F1</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--cosmic-purple</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">DO NOT USE</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Legacy v1 color</li>
                    <li>• Too muted</li>
                    <li>• Use vergil-purple</li>
                    <li>• Will be removed</li>
                  </ul>
                </div>
                <div className="col-span-2">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-800">
                      ⚠️ This color is deprecated and only kept for backward compatibility. 
                      Please use <code className="bg-red-100 px-1 rounded">vergil-purple</code> instead.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Neutral Palette */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Neutral Palette</h2>
        
        <div className="grid gap-6 mb-8">
          {/* Full Black */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-full-black rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-full-black</h3>
                  <p className="text-sm text-gray-600">#000000</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-full-black</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Backgrounds only</li>
                    <li>• Never for text</li>
                    <li>• Hero sections</li>
                    <li>• Maximum contrast areas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ vergil-off-white text</li>
                    <li>✓ vergil-white containers</li>
                    <li>✗ vergil-text (too dark)</li>
                    <li>✗ Pure white text (too harsh)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dark mode</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Footer</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Hero</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Off-Black (Text) */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-off-black rounded-lg mb-3"></div>
                  <h3 className="font-semibold">vergil-off-black</h3>
                  <p className="text-sm text-gray-600">#1D1D1F</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-off-black</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Primary text color</li>
                    <li>• Icons on light</li>
                    <li>• Never on dark</li>
                    <li>• Softer than pure black</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ On vergil-full-white</li>
                    <li>✓ On vergil-off-white</li>
                    <li>✗ On vergil-full-black</li>
                    <li>✗ On dark backgrounds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Body text</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Headlines</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Navigation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full White */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-full-white rounded-lg mb-3 border"></div>
                  <h3 className="font-semibold">vergil-full-white</h3>
                  <p className="text-sm text-gray-600">#FFFFFF</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-full-white</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Backgrounds only</li>
                    <li>• Never for text</li>
                    <li>• Primary page bg</li>
                    <li>• Clean sections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ vergil-off-black content</li>
                    <li>✓ vergil-off-white sections</li>
                    <li>✗ White text (invisible)</li>
                    <li>✓ Separates emphasis colors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Page bg</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Cards</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Modals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Off-White */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-start">
                <div>
                  <div className="w-full h-24 bg-vergil-off-white rounded-lg mb-3 border"></div>
                  <h3 className="font-semibold">vergil-off-white</h3>
                  <p className="text-sm text-gray-600">#F5F5F7</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-off-white</code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Rules</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Text on dark</li>
                    <li>• Soft backgrounds</li>
                    <li>• Section dividers</li>
                    <li>• Footer backgrounds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Allowed Combinations</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ On vergil-full-black</li>
                    <li>✓ As background</li>
                    <li>✓ vergil-text on top</li>
                    <li>✗ Direct on emphasis-bg</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dark text</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Sections</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Code blocks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subtle Attention Hierarchy */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Subtle Attention Hierarchy</h2>
        <p className="text-body-lg text-gray-600 mb-8">
          Apple's sophisticated system for drawing attention without being obtrusive. Each color shift is
          barely perceptible but creates clear visual hierarchy.
        </p>

        {/* Live Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Apple-Style Demo</CardTitle>
            <CardDescription>See how these colors work together in real UI patterns</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-vergil-full-white rounded-b-lg overflow-hidden">
              {/* Region selection header */}
              {showRegionBar && (
                <div className="bg-vergil-emphasis-bg border-b">
                  <div className="px-6 py-3 flex items-center justify-between">
                    <p className="text-sm text-vergil-off-black">
                      Choose your region to see localized content and shopping options.
                    </p>
                    <div className="flex items-center gap-3">
                      <RegionSelector />
                      <button
                        onClick={() => setShowRegionBar(false)}
                        className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-off-black-hover transition-opacity"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => setShowRegionBar(false)}
                        className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4 text-vergil-off-black" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation (white separator) */}
              <div className="bg-vergil-full-white px-6 py-4 border-b">
                <div className="flex items-center gap-6 text-sm">
                  <span className="font-semibold text-vergil-off-black">Vergil</span>
                  <a href="#" className="text-vergil-off-black hover:text-vergil-purple">Products</a>
                  <a href="#" className="text-vergil-off-black hover:text-vergil-purple">Solutions</a>
                  <a href="#" className="text-vergil-off-black hover:text-vergil-purple">Support</a>
                </div>
              </div>

              {/* Main content area */}
              <div className="bg-vergil-off-white p-6 min-h-[200px]">
                <p className="text-vergil-off-black mb-4">
                  Notice how the region bar (emphasis-bg) is separated from this off-white section by the white navigation bar.
                  This prevents the subtle color difference from being jarring.
                </p>
                
                {/* Example content sections */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-vergil-full-white p-4 rounded-lg">
                    <h4 className="font-medium text-vergil-off-black mb-2">White Container</h4>
                    <p className="text-sm text-vergil-off-black">Standard content area</p>
                  </div>
                  <div className="bg-vergil-full-white p-4 rounded-lg">
                    <h4 className="font-medium text-vergil-off-black mb-2">Another Section</h4>
                    <p className="text-sm text-vergil-footnote-text">With footnote text color</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attention Color Details */}
        <div className="grid gap-6">
          {/* Emphasis Background */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-vergil-emphasis-bg rounded-lg border"></div>
                    <div>
                      <h3 className="font-semibold">vergil-emphasis-bg</h3>
                      <p className="text-sm text-gray-600">#F0F0F2</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">--vergil-emphasis-bg</code>
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">Usage Guidelines</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Temporary UI elements requiring action</li>
                    <li>• Must be separated from off-white by white</li>
                    <li>• Use vergil-emphasis-text (#303030) for general text</li>
                    <li>• Interactive elements get emphasis-input-bg + emphasis-input-text</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Common Use Cases</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-vergil-purple" />
                      <span className="text-sm">Region/language selection headers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cookie className="w-5 h-5 text-vergil-purple" />
                      <span className="text-sm">Cookie consent banners</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-vergil-purple" />
                      <span className="text-sm">System notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-vergil-purple" />
                      <span className="text-sm">Update prompts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-vergil-purple" />
                      <span className="text-sm">Beta feature announcements</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Emphasis Colors */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Supporting Emphasis Colors</h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <div className="w-full h-16 bg-vergil-emphasis-input-bg rounded mb-2 border"></div>
                  <h4 className="text-sm font-medium">emphasis-input-bg</h4>
                  <p className="text-xs text-gray-600">#FAFAFC</p>
                  <p className="text-xs text-gray-500 mt-1">Interactive elements</p>
                </div>
                <div>
                  <div className="w-full h-16 bg-[#303030] rounded mb-2"></div>
                  <h4 className="text-sm font-medium">emphasis-text</h4>
                  <p className="text-xs text-gray-600">#303030</p>
                  <p className="text-xs text-gray-500 mt-1">Text on emphasis-bg</p>
                </div>
                <div>
                  <div className="w-full h-16 bg-[#323232] rounded mb-2"></div>
                  <h4 className="text-sm font-medium">emphasis-input-text</h4>
                  <p className="text-xs text-gray-600">#323232</p>
                  <p className="text-xs text-gray-500 mt-1">Text in inputs</p>
                </div>
                <div>
                  <div className="w-full h-16 bg-[#272729] rounded mb-2"></div>
                  <h4 className="text-sm font-medium">emphasis-button-hover</h4>
                  <p className="text-xs text-gray-600">#272729</p>
                  <p className="text-xs text-gray-500 mt-1">Button hover state</p>
                </div>
                <div>
                  <div className="w-full h-16 bg-vergil-footnote rounded mb-2"></div>
                  <h4 className="text-sm font-medium">footnote-text</h4>
                  <p className="text-xs text-gray-600">#6C6C6D</p>
                  <p className="text-xs text-gray-500 mt-1">Secondary info</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* More UI Examples */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">UI Pattern Examples</h2>
        
        <div className="grid gap-6">
          {/* Cookie Banner */}
          {showCookieBanner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cookie Consent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-vergil-off-black mb-2">We value your privacy</h3>
                      <p className="text-sm text-vergil-off-black mb-4">
                        We use cookies to enhance your browsing experience and analyze our traffic. 
                        By clicking "Accept All", you consent to our use of cookies.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowCookieBanner(false)}
                          className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-off-black-hover transition-opacity"
                        >
                          Accept All
                        </button>
                        <button className="px-4 py-2 bg-vergil-full-white text-vergil-off-black text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                          Customize
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCookieBanner(false)}
                      className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-vergil-off-black" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Update Notice */}
          {showUpdateNotice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-vergil-off-black mb-2">Version 2.1.0 Available</h3>
                      <p className="text-sm text-vergil-off-black mb-1">
                        Includes performance improvements and bug fixes
                      </p>
                      <p className="text-xs text-vergil-footnote-text">Released 3 hours ago • 125 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-sm text-vergil-purple hover:underline">
                        View details
                      </button>
                      <button 
                        onClick={() => setShowUpdateNotice(false)}
                        className="px-4 py-2 bg-vergil-off-black text-vergil-full-white text-sm rounded-md hover:bg-vergil-off-black-hover transition-opacity"
                      >
                        Update Now
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Beta Feature */}
          {showBetaFeature && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Beta Feature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-vergil-emphasis-bg rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-vergil-purple rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-vergil-full-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-vergil-off-black mb-2">
                          Try AI-Powered Code Suggestions
                        </h3>
                        <p className="text-sm text-vergil-off-black mb-3">
                          Get intelligent code completions powered by our latest AI model.
                          Join the beta to help us improve.
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="text-sm text-vergil-purple hover:underline font-medium">
                            Learn more →
                          </button>
                          <span className="text-xs text-vergil-footnote-text">Limited time offer</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBetaFeature(false)}
                      className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-vergil-off-black" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h2">Implementation Guide</CardTitle>
          <CardDescription>Best practices for using the v2 color system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Do's</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-vergil-success mt-0.5">✓</span>
                  <div>
                    <strong>Use off-white for text on dark backgrounds</strong>
                    <p className="text-gray-600">Creates softer, more readable contrast</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-success mt-0.5">✓</span>
                  <div>
                    <strong>Separate emphasis colors with white</strong>
                    <p className="text-gray-600">Prevents jarring transitions between similar grays</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-success mt-0.5">✓</span>
                  <div>
                    <strong>Use emphasis colors for temporary UI</strong>
                    <p className="text-gray-600">Perfect for dismissible notifications and prompts</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-success mt-0.5">✓</span>
                  <div>
                    <strong>Apply footnote color for secondary info</strong>
                    <p className="text-gray-600">Legal text, timestamps, version numbers</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Don'ts</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-vergil-error mt-0.5">✗</span>
                  <div>
                    <strong>Use pure white text on black</strong>
                    <p className="text-gray-600">Too harsh - use off-white instead</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-error mt-0.5">✗</span>
                  <div>
                    <strong>Place off-white directly on emphasis-bg</strong>
                    <p className="text-gray-600">Always separate with white for clean hierarchy</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-error mt-0.5">✗</span>
                  <div>
                    <strong>Use emphasis colors for permanent UI</strong>
                    <p className="text-gray-600">Reserve for temporary, dismissible elements</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vergil-error mt-0.5">✗</span>
                  <div>
                    <strong>Mix v1 and v2 color systems</strong>
                    <p className="text-gray-600">Commit fully to v2 for consistency</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-vergil-off-white rounded-lg">
            <h3 className="font-semibold mb-3">Quick Reference</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Background Hierarchy</p>
                <p className="font-mono text-xs">white → off-white → emphasis-bg</p>
              </div>
              <div>
                <p className="font-medium mb-2">Text Hierarchy</p>
                <p className="font-mono text-xs">footnote → text → emphasis-text</p>
              </div>
              <div>
                <p className="font-medium mb-2">Dark Mode Text</p>
                <p className="font-mono text-xs">Always use off-white, never pure white</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}