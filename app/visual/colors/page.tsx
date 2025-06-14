'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

const colorPalettes = {
  primary: [
    { name: 'Cosmic Purple', value: '#6366F1', class: 'bg-[#6366F1]', description: 'Primary brand color for key actions and focus' },
    { name: 'Electric Violet', value: '#A78BFA', class: 'bg-[#A78BFA]', description: 'Secondary brand color for emphasis and highlights' },
    { name: 'Luminous Indigo', value: '#818CF8', class: 'bg-[#818CF8]', description: 'Tertiary brand color for depth and variation' },
  ],
  accent: [
    { name: 'Phosphor Cyan', value: '#10B981', class: 'bg-[#10B981]', description: 'Success states and positive feedback' },
    { name: 'Synaptic Blue', value: '#3B82F6', class: 'bg-[#3B82F6]', description: 'Information and neutral interactions' },
    { name: 'Neural Pink', value: '#F472B6', class: 'bg-[#F472B6]', description: 'Creative elements and special highlights' },
  ],
  foundation: [
    { name: 'Pure Light', value: '#FFFFFF', class: 'bg-[#FFFFFF] border border-gray-200', description: 'Primary background color' },
    { name: 'Soft Light', value: '#FAFAFA', class: 'bg-[#FAFAFA]', description: 'Secondary background color' },
    { name: 'Whisper Gray', value: '#F8F9FA', class: 'bg-[#F8F9FA]', description: 'Subtle background variations' },
    { name: 'Mist Gray', value: '#E5E7EB', class: 'bg-[#E5E7EB]', description: 'Borders and dividers' },
    { name: 'Stone Gray', value: '#9CA3AF', class: 'bg-[#9CA3AF]', description: 'Secondary text and disabled states' },
    { name: 'Deep Space', value: '#0F172A', class: 'bg-[#0F172A]', description: 'Primary text and strong contrast' },
  ]
}

const gradients = [
  { 
    name: 'Consciousness Gradient',
    class: 'consciousness-gradient',
    css: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #818CF8 100%)',
    description: 'Primary brand gradient for hero sections and key CTAs'
  },
  {
    name: 'Awakening Gradient', 
    class: 'awakening-gradient',
    css: 'linear-gradient(90deg, #6366F1 0%, #3B82F6 100%)',
    description: 'Secondary gradient for interactive elements'
  },
  {
    name: 'Synaptic Gradient',
    class: 'synaptic-gradient', 
    css: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
    description: 'Accent gradient for creative and highlight elements'
  },
  {
    name: 'Light Ray Gradient',
    class: 'light-ray-gradient',
    css: 'radial-gradient(circle at center, rgba(99,102,241,0.2) 0%, transparent 70%)',
    description: 'Subtle background gradient for depth and atmosphere'
  }
]

export default function ColorSystem() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(identifier)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const ColorCard = ({ color, showBorder = false }: { color: any, showBorder?: boolean }) => (
    <Card className="brand-card group">
      <CardContent className="p-0">
        <div 
          className={`h-24 w-full rounded-t-lg ${color.class}`}
          style={{ backgroundColor: color.value }}
        />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">{color.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(color.value, color.name)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              {copiedColor === color.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="text-xs font-mono text-gray-600 mb-2">{color.value}</div>
          <div className="text-xs text-gray-600">{color.description}</div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Color <span className="gradient-text">System</span>
        </h1>
        <p className="text-body-lg text-stone-gray max-w-2xl">
          Our color palette embodies the moment when static systems come alive. Each color carries meaning, 
          purpose, and the subtle energy of living intelligence.
        </p>
      </div>

      {/* Design Philosophy */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Color Philosophy</CardTitle>
          <CardDescription className="text-body-lg">
            Colors in the Vergil system represent different aspects of intelligence and consciousness. 
            From the cosmic purple of deep thought to the phosphor cyan of breakthrough moments, 
            each hue tells part of our story.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="consciousness-gradient h-24 rounded-lg mb-4" />
          <p className="text-body-md text-stone-gray">
            The primary gradient represents the spectrum of consciousness—from the deep purple of contemplation 
            to the bright indigo of insight and understanding.
          </p>
        </CardContent>
      </Card>

      {/* Primary Palette */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Primary Palette</h2>
        <p className="text-body-md text-stone-gray mb-6">
          The core colors that define Vergil's visual identity. These colors should be used for primary actions, 
          key messaging, and brand recognition.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {colorPalettes.primary.map((color) => (
            <ColorCard key={color.name} color={color} />
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Accent Colors</h2>
        <p className="text-body-md text-stone-gray mb-6">
          Supporting colors that add vibrancy and meaning to specific contexts. Use sparingly for maximum impact.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {colorPalettes.accent.map((color) => (
            <ColorCard key={color.name} color={color} />
          ))}
        </div>
      </div>

      {/* Foundation Colors */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Foundation Colors</h2>
        <p className="text-body-md text-stone-gray mb-6">
          Neutral colors that provide structure and hierarchy. These form the backbone of our interface design.
        </p>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {colorPalettes.foundation.map((color) => (
            <ColorCard key={color.name} color={color} showBorder={color.name === 'Pure Light'} />
          ))}
        </div>
      </div>

      {/* Gradient System */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Gradient System</h2>
        <p className="text-body-md text-stone-gray mb-6">
          Our gradient system creates depth, energy, and the sense of living intelligence flowing through our designs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {gradients.map((gradient) => (
            <Card key={gradient.name} className="brand-card group">
              <CardContent className="p-0">
                <div className={`h-32 w-full rounded-t-lg ${gradient.class}`} />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{gradient.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(gradient.css, gradient.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    >
                      {copiedColor === gradient.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="text-xs font-mono text-stone-gray mb-2 break-all">{gradient.css}</div>
                  <div className="text-xs text-stone-gray">{gradient.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <Card className="brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-cosmic-purple mb-2">Backgrounds</h3>
            <p className="text-body-sm text-stone-gray">
              Use Soft Light (#FAFAFA) for main backgrounds, Pure Light (#FFFFFF) for elevated surfaces like cards and modals.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-electric-violet mb-2">Text</h3>
            <p className="text-body-sm text-stone-gray">
              Deep Space (#0F172A) for primary text, Stone Gray (#9CA3AF) for secondary text and captions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-phosphor-cyan mb-2">Interactive Elements</h3>
            <p className="text-body-sm text-stone-gray">
              Primary gradients for CTAs and key actions, single colors for hover states and secondary interactions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-synaptic-blue mb-2">Accents</h3>
            <p className="text-body-sm text-stone-gray">
              Use Phosphor Cyan sparingly for success states and highlights. Neural Pink for creative elements and special features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}