'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, Play, Palette, Zap } from "lucide-react"
import Image from "next/image"
import { VergilLogo } from "@/components/vergil/vergil-logo"
import { DynamicLogo } from "@/components/vergil/dynamic-logo"
import { useState } from "react"

const logoVariations = [
  {
    name: 'Primary Logo',
    description: 'White logo - the default version for all applications',
    svg: '/logos/vergil-logo.svg',
    png: '/logos/vergil-logo.png',
    usage: 'Dark backgrounds, hero sections, primary brand applications',
    background: 'dark',
    isWhite: true,
    variant: 'logo'
  },
  {
    name: 'Logo Mark',
    description: 'White iris star symbol only for compact spaces',
    svg: '/logos/vergil-mark.svg',
    png: '/logos/vergil-mark.png',
    usage: 'Dark backgrounds, favicons, social media avatars, app icons',
    background: 'dark',
    isWhite: true,
    variant: 'mark'
  },
  {
    name: 'Wordmark',
    description: 'White typography-only version for specific contexts',
    svg: '/logos/vergil-wordmark.svg',
    png: '/logos/vergil-wordmark.png',
    usage: 'Dark backgrounds, text-heavy layouts, footer applications',
    background: 'dark',
    isWhite: true,
    variant: 'wordmark'
  }
]

export default function LogoGuidelines() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(identifier)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const downloadAsset = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Logo & <span className="gradient-text">Iconography</span>
        </h1>
        <p className="text-body-lg text-gray-600 max-w-2xl">
          The Vergil logo embodies our brand essence: the iris star represents the window to consciousness, 
          the moment of awakening, and the depth of intelligence our platform provides.
        </p>
      </div>

      {/* Logo Concept */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">The Vergil Mark: Iris Star</CardTitle>
          <CardDescription className="text-body-lg mb-6">
            Our logo merges powerful symbolic elements into a cohesive mark that represents 
            intelligence awakening and systems coming alive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full" />
              </div>
              <h3 className="font-medium text-blue-600 mb-2">Iris as Window</h3>
              <p className="text-sm text-gray-600">The gateway to understanding and perception</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-violet-600 star-shape" />
              </div>
              <h3 className="font-medium text-violet-600 mb-2">Star Navigation</h3>
              <p className="text-sm text-gray-600">Guidance through complexity and aspiration</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-cyan-600 rounded" />
              </div>
              <h3 className="font-medium text-cyan-600 mb-2">Neural Pathways</h3>
              <p className="text-sm text-gray-600">Connections radiating outward like synapses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full animate-pulse" />
              </div>
              <h3 className="font-medium text-yellow-600 mb-2">Fiat Lux</h3>
              <p className="text-sm text-gray-600">The moment of light, awakening, intelligence</p>
            </div>
          </div>
          
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <VergilLogo 
              variant="logo" 
              size="lg" 
              animated={true}
            />
            <p className="text-sm text-gray-400 mt-4">
              The complete Vergil logo combining the iris star mark with custom typography (white version)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Original Logo Files */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Original Logo Files</h2>
        <p className="text-body-md text-gray-600 mb-6">
          All provided logo files are white by default, designed for use on dark backgrounds or with color overlays.
        </p>
        <div className="grid gap-6">
          {logoVariations.map((logo) => (
            <Card key={logo.name} className="brand-card group">
              <CardContent className="p-6">
                <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
                  {/* Logo Display */}
                  <div className="p-8 rounded-lg bg-gray-900 flex items-center justify-center" style={{ minHeight: '120px' }}>
                    <VergilLogo 
                      variant={logo.variant as 'logo' | 'mark' | 'wordmark'}
                      size="md" 
                      animated={false}
                    />
                  </div>
                  
                  {/* Logo Details */}
                  <div>
                    <h3 className="text-h4 font-semibold mb-2">{logo.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{logo.description}</p>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Usage: </span>
                      <span className="text-gray-600">{logo.usage}</span>
                    </div>
                  </div>
                  
                  {/* Download Actions */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadAsset(logo.svg, `${logo.name.toLowerCase().replace(' ', '-')}.svg`)}
                        className="gap-2"
                      >
                        <Download className="h-3 w-3" />
                        SVG
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadAsset(logo.png, `${logo.name.toLowerCase().replace(' ', '-')}.png`)}
                        className="gap-2"
                      >
                        <Download className="h-3 w-3" />
                        PNG
                      </Button>
                    </div>
                    
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(logo.svg, `${logo.name}-svg`)}
                        className="w-full justify-start gap-2 h-8 text-xs"
                      >
                        {copiedItem === `${logo.name}-svg` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy SVG path
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(logo.png, `${logo.name}-png`)}
                        className="w-full justify-start gap-2 h-8 text-xs"
                      >
                        {copiedItem === `${logo.name}-png` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        Copy PNG path
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SVG Color Variations */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Recommended Logo Implementation</h2>
        <p className="text-body-md text-gray-600 mb-6">
          Based on accessibility and brand consistency, here's how to properly implement Vergil logos.
        </p>
        
        <div className="grid gap-6">
          {/* Practical Usage Examples */}
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Practical Usage Examples</CardTitle>
              <CardDescription>Real-world applications showing proper logo usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Website Header Examples */}
                <div>
                  <h4 className="font-medium mb-4">Website Headers</h4>
                  <div className="space-y-4">
                    {/* Dark header */}
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <VergilLogo variant="mark" size="sm" animated={false} />
                          <span className="text-white font-medium">Vergil</span>
                        </div>
                        <div className="flex gap-4 text-white text-sm">
                          <span>Products</span>
                          <span>About</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gradient header */}
                    <div className="consciousness-gradient p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <VergilLogo variant="mark" size="sm" animated={false} />
                          <span className="text-white font-medium">Vergil</span>
                        </div>
                        <div className="flex gap-4 text-white text-sm">
                          <span>Products</span>
                          <span>About</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Light header with badge */}
                    <div className="bg-gray-50 border p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-gray-900 rounded">
                            <VergilLogo variant="mark" size="sm" animated={false} />
                          </div>
                          <span className="text-gray-900 font-medium">Vergil</span>
                        </div>
                        <div className="flex gap-4 text-gray-700 text-sm">
                          <span>Products</span>
                          <span>About</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Business Card / Marketing Examples */}
                <div>
                  <h4 className="font-medium mb-4">Marketing Materials</h4>
                  <div className="space-y-4">
                    {/* Business card - dark */}
                    <div className="bg-gray-900 p-4 rounded-lg h-24 flex flex-col justify-between">
                      <VergilLogo variant="logo" size="sm" animated={false} />
                      <div className="text-white text-xs">
                        <div className="font-medium">John Smith</div>
                        <div className="opacity-75">AI Engineering Lead</div>
                      </div>
                    </div>
                    
                    {/* Hero section */}
                    <div className="awakening-gradient p-6 rounded-lg text-center">
                      <VergilLogo variant="logo" size="md" animated={true} />
                      <h3 className="text-white font-bold mt-4 mb-2">Intelligence, Orchestrated</h3>
                      <p className="text-white/90 text-sm">Build living AI systems that evolve</p>
                    </div>
                    
                    {/* App icon style */}
                    <div className="flex gap-3">
                      <div className="w-12 h-12 consciousness-gradient rounded-xl flex items-center justify-center">
                        <VergilLogo variant="mark" size="sm" animated={false} />
                      </div>
                      <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                        <VergilLogo variant="mark" size="sm" animated={false} />
                      </div>
                      <div className="w-12 h-12 synaptic-gradient rounded-xl flex items-center justify-center">
                        <VergilLogo variant="mark" size="sm" animated={false} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gradient Variations */}
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Gradient Overlays</CardTitle>
              <CardDescription>Apply brand gradients as overlays or masks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3">
                    <DynamicLogo 
                      variant="logo" 
                      size="md" 
                      gradient="consciousness"
                      animated={false}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Consciousness gradient overlay</p>
                </div>
                
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3">
                    <DynamicLogo 
                      variant="logo" 
                      size="md" 
                      gradient="awakening"
                      animated={false}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Awakening gradient overlay</p>
                </div>
                
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3">
                    <DynamicLogo 
                      variant="logo" 
                      size="md" 
                      gradient="synaptic"
                      animated={false}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Synaptic gradient overlay</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animated Variations */}
          <Card className="brand-card">
            <CardHeader>
              <CardTitle className="text-h3">Animated Star Effects</CardTitle>
              <CardDescription>Dynamic animations for the iris star mark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3 flex items-center justify-center" style={{ minHeight: '120px' }}>
                    <DynamicLogo 
                      variant="mark" 
                      size="lg" 
                      colorScheme="white"
                      animated="pulse"
                    />
                  </div>
                  <h4 className="font-medium mb-1">Pulsing Star</h4>
                  <p className="text-sm text-gray-600">Gentle pulse at 60bpm rhythm</p>
                </div>
                
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3 flex items-center justify-center" style={{ minHeight: '120px' }}>
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full animate-spin" style={{
                        background: 'linear-gradient(45deg, #6366F1, #A78BFA, #818CF8, #10B981)',
                        animationDuration: '4s'
                      }}></div>
                      <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                        <DynamicLogo 
                          variant="mark" 
                          size="sm" 
                          colorScheme="white"
                          animated={false}
                        />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium mb-1">Rotating Halo</h4>
                  <p className="text-sm text-gray-600">Gradient ring rotation</p>
                </div>
                
                <div className="text-center">
                  <div className="p-6 bg-gray-900 rounded-lg mb-3 flex items-center justify-center" style={{ minHeight: '120px' }}>
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 bg-blue-500 rounded-full breathing opacity-60"></div>
                      <div className="absolute inset-2 bg-violet-500 rounded-full breathing opacity-80" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center">
                        <DynamicLogo 
                          variant="mark" 
                          size="sm" 
                          colorScheme="white"
                          animated="breathing"
                        />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium mb-1">Layered Breathing</h4>
                  <p className="text-sm text-gray-600">Multiple breathing layers</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Animation CSS</h4>
                <code className="text-sm text-purple-800 block mb-2">
                  .star-pulse {'{'}animation: pulse 1s ease-in-out infinite;{'}'}
                </code>
                <code className="text-sm text-purple-800 block mb-2">
                  .star-rotate {'{'}animation: rotate 4s linear infinite;{'}'}
                </code>
                <code className="text-sm text-purple-800">
                  .star-breathe {'{'}animation: breathing 4s ease-in-out infinite;{'}'}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Interactive Logo Demo</h2>
        <p className="text-body-md text-gray-600 mb-6">
          Experiment with different color schemes, gradients, and animations on the white logo.
        </p>
        
        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-h3 flex items-center gap-2">
              <Play className="h-5 w-5" />
              Live Logo Playground
            </CardTitle>
            <CardDescription>Click the examples below to see different treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Demo Display */}
              <div className="text-center">
                <div className="p-8 bg-gray-900 rounded-lg mb-4">
                  <DynamicLogo 
                    variant="logo" 
                    size="lg" 
                    colorScheme="white"
                    animated="breathing"
                  />
                </div>
                <p className="text-sm text-gray-600">Original white logo with breathing animation</p>
              </div>
              
              {/* Variation Examples */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3">Try these variations:</h4>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded">
                        <DynamicLogo 
                          variant="mark" 
                          size="sm" 
                          colorScheme="cosmic-purple"
                          animated="pulse"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Cosmic Purple + Pulse</p>
                        <p className="text-xs text-gray-600">Brand color with pulsing animation</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Palette className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded">
                        <DynamicLogo 
                          variant="mark" 
                          size="sm" 
                          gradient="consciousness"
                          animated="rotate"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Consciousness Gradient</p>
                        <p className="text-xs text-gray-600">Gradient background with rotation</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded">
                        <DynamicLogo 
                          variant="mark" 
                          size="sm" 
                          colorScheme="phosphor-cyan"
                          animated="glow"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Phosphor Cyan + Glow</p>
                        <p className="text-xs text-gray-600">Accent color with glow effect</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> These effects can be applied to any white SVG logo using CSS filters and animations.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guidelines */}
      <div className="grid gap-6 lg:grid-cols-2 mb-12">
        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-h3 text-green-600">Do's</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Use white logos on dark/colored backgrounds</p>
                <p className="text-sm text-gray-600">Ensure 4.5:1 contrast ratio minimum for accessibility</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Create logo badges for light backgrounds</p>
                <p className="text-sm text-gray-600">Use colored containers or borders when placing on light surfaces</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Use brand gradients as backgrounds</p>
                <p className="text-sm text-gray-600">Consciousness, Awakening, and Synaptic gradients work perfectly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Maintain proportions and minimum sizes</p>
                <p className="text-sm text-gray-600">24px height minimum for digital, 10mm for print</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-h3 text-red-600">Don'ts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Place white logos directly on white/light backgrounds</p>
                <p className="text-sm text-gray-600">This creates invisible or low-contrast logos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Use light purple/violet on light backgrounds</p>
                <p className="text-sm text-gray-600">Fails WCAG accessibility contrast requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Alter logo proportions or add effects</p>
                <p className="text-sm text-gray-600">Never stretch, skew, add shadows, or modify the original files</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="font-medium mb-1">Place logo on busy or low-contrast backgrounds</p>
                <p className="text-sm text-gray-600">Ensure clear space and strong contrast for readability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clear Space & Sizing */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Clear Space & Sizing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Minimum Clear Space</h3>
              <div className="bg-gray-50 p-8 rounded-lg text-center mb-4">
                <div className="inline-block p-8 border-2 border-dashed border-blue-300">
                  <VergilLogo 
                    variant="logo" 
                    size="md"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Maintain minimum clear space of 1.5x the height of the mark around all sides
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Minimum Sizes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Digital Minimum</span>
                  <span className="text-sm text-gray-600">24px height</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Print Minimum</span>
                  <span className="text-sm text-gray-600">10mm height</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">Optimal Display</span>
                  <span className="text-sm text-gray-600">48-64px height</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}