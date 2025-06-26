'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

const typeScale = [
  { name: 'Display XL', class: 'text-display-xl font-display', size: '72px/80px', usage: 'Hero headlines, major announcements', weight: 'font-bold', font: 'Lato', fontSize: '4.5rem', lineHeight: '5rem' },
  { name: 'Display LG', class: 'text-display-lg font-display', size: '60px/68px', usage: 'Page headers, section headlines', weight: 'font-bold', font: 'Lato', fontSize: '3.75rem', lineHeight: '4.25rem' },
  { name: 'Display MD', class: 'text-display-md font-display', size: '48px/56px', usage: 'Card headers, feature titles', weight: 'font-bold', font: 'Lato', fontSize: '3rem', lineHeight: '3.5rem' },
  { name: 'Heading 1', class: 'text-h1 font-sans', size: '36px/44px', usage: 'Primary page headings', weight: 'font-bold', font: 'Inter', fontSize: '2.25rem', lineHeight: '2.75rem' },
  { name: 'Heading 2', class: 'text-h2 font-sans', size: '30px/36px', usage: 'Section headings, card titles', weight: 'font-bold', font: 'Inter', fontSize: '1.875rem', lineHeight: '2.25rem' },
  { name: 'Heading 3', class: 'text-h3 font-sans', size: '24px/32px', usage: 'Subsection headings', weight: 'font-semibold', font: 'Inter', fontSize: '1.5rem', lineHeight: '2rem' },
  { name: 'Heading 4', class: 'text-h4 font-sans', size: '20px/28px', usage: 'Component titles, labels', weight: 'font-medium', font: 'Inter', fontSize: '1.25rem', lineHeight: '1.75rem' },
  { name: 'Body Large', class: 'text-body-lg font-sans', size: '18px/28px', usage: 'Intro paragraphs, important body text', weight: 'font-normal', font: 'Inter', fontSize: '1.125rem', lineHeight: '1.75rem' },
  { name: 'Body Medium', class: 'text-body-md font-sans', size: '16px/24px', usage: 'Standard body text, descriptions', weight: 'font-normal', font: 'Inter', fontSize: '1rem', lineHeight: '1.5rem' },
  { name: 'Body Small', class: 'text-body-sm font-sans', size: '14px/20px', usage: 'Secondary text, captions', weight: 'font-normal', font: 'Inter', fontSize: '0.875rem', lineHeight: '1.25rem' },
  { name: 'Caption', class: 'text-caption font-sans', size: '12px/16px', usage: 'Labels, metadata, fine print', weight: 'font-medium', font: 'Inter', fontSize: '0.75rem', lineHeight: '1rem' },
]

const fontFamilies = [
  {
    name: 'Inter',
    role: 'Primary Sans-Serif',
    usage: 'All UI elements and body text',
    css: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`,
    features: 'Excellent readability, comprehensive weights, optimized for screens',
    class: 'font-sans'
  },
  {
    name: 'Lato',
    role: 'Display Sans-Serif', 
    usage: 'Marketing headlines and emphasis',
    css: `font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`,
    features: 'Friendly and approachable, perfect for headlines',
    class: 'font-display'
  },
  {
    name: 'Georgia',
    role: 'Serif',
    usage: 'Editorial content and quotes',
    css: `font-family: Georgia, 'Times New Roman', serif;`,
    features: 'Classic readability, excellent for long-form content',
    class: 'font-serif'
  }
]

export default function Typography() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(identifier)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-bold mb-4">
          Typography <span className="gradient-text">System</span>
        </h1>
        <p className="text-body-lg text-gray-600 max-w-2xl">
          Our typography creates hierarchy, guides attention, and communicates with clarity and purpose. 
          Every font choice reflects our commitment to accessible, intelligent design.
        </p>
      </div>

      {/* Typography Philosophy */}
      <Card className="mb-12 brand-card">
        <CardHeader>
          <CardTitle className="text-h2">Typography Philosophy</CardTitle>
          <CardDescription className="text-body-lg">
            Typography in the Vergil system serves intelligence. Clear hierarchy guides users through complex 
            information, while subtle details create moments of delight and recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="consciousness-gradient p-6 rounded-lg">
            <blockquote className="text-center text-white">
              <p className="text-h2 font-display font-bold mb-2">
                "Clarity is the courtesy of the philosopher"
              </p>
              <p className="text-body-md opacity-90">
                Our typography prioritizes understanding above all else
              </p>
            </blockquote>
          </div>
        </CardContent>
      </Card>

      {/* Font Families */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Font Families</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {fontFamilies.map((font) => (
            <Card key={font.name} className="brand-card group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className={`text-h3 ${font.class}`}>{font.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(font.css, font.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    {copiedText === font.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <CardDescription className="text-blue-600 font-medium">{font.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div 
                    className="font-bold mb-2 text-gray-900"
                    style={{ 
                      fontSize: '3rem', 
                      lineHeight: '3.5rem',
                      fontFamily: font.name === 'Inter' ? 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : 
                                  font.name === 'Lato' ? 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' :
                                  'Georgia, "Times New Roman", serif'
                    }}
                  >
                    Intelligence, Orchestrated
                  </div>
                  <div 
                    className="mb-2 text-gray-700"
                    style={{ 
                      fontSize: '1.25rem', 
                      lineHeight: '1.75rem',
                      fontFamily: font.name === 'Inter' ? 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : 
                                  font.name === 'Lato' ? 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' :
                                  'Georgia, "Times New Roman", serif'
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div 
                    className="text-gray-600"
                    style={{ 
                      fontSize: '1.125rem', 
                      lineHeight: '1.75rem',
                      fontFamily: font.name === 'Inter' ? 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : 
                                  font.name === 'Lato' ? 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' :
                                  'Georgia, "Times New Roman", serif'
                    }}
                  >
                    Building the infrastructure for living, breathing AI systems
                  </div>
                </div>
                <div className="text-body-sm text-gray-600 mb-2">{font.usage}</div>
                <div className="text-caption text-gray-500 mb-3">{font.features}</div>
                <div className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded break-all">
                  {font.css}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Type Scale */}
      <div className="mb-12">
        <h2 className="text-h2 font-bold mb-6">Type Scale</h2>
        <p className="text-body-md text-gray-600 mb-6">
          Our type scale creates clear hierarchy and guides users through content with purposeful progression.
        </p>
        <div className="space-y-8">
          {typeScale.map((type) => (
            <div key={type.name} className="group">
              <Card className="brand-card">
                <CardContent className="p-8">
                  {/* Visual Typography Sample */}
                  <div className="mb-6">
                    <div 
                      className={`${type.class} ${type.weight} text-gray-900 leading-tight mb-2`}
                      style={{ 
                        fontSize: type.fontSize, 
                        lineHeight: type.lineHeight,
                        fontFamily: type.font === 'Lato' ? 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                      }}
                    >
                      Intelligence, Orchestrated
                    </div>
                    {type.name.includes('Display') && (
                      <div className="text-lg font-sans text-gray-600 mt-2">
                        The future of AI infrastructure
                      </div>
                    )}
                    {type.name.includes('Body') && (
                      <div 
                        className={`${type.class} ${type.weight} text-gray-700 mt-2`}
                        style={{ 
                          fontSize: type.fontSize, 
                          lineHeight: type.lineHeight,
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        }}
                      >
                        This is sample body text showing how this typography size looks in context. 
                        It demonstrates readability and visual hierarchy within content blocks.
                      </div>
                    )}
                  </div>
                  
                  {/* Typography Specifications */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid gap-6 md:grid-cols-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{type.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(`${type.class} ${type.weight}`, type.name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            {copiedText === type.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {type.size}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Weight & Family</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{type.weight.replace('font-', '')}</span> • {type.font}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Usage Context</div>
                        <div className="text-sm text-gray-600">{type.usage}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">CSS Classes</div>
                        <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded break-all">
                          {type.class} {type.weight}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Guidelines */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-h3">Writing Principles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-600 mb-1">Headlines</h4>
              <p className="text-body-sm text-gray-600">Use Lato Bold with tight letter-spacing (-0.02em) for maximum impact</p>
            </div>
            <div>
              <h4 className="font-medium text-violet-600 mb-1">Body Text</h4>
              <p className="text-body-sm text-gray-600">Use Inter Regular with normal letter-spacing for optimal readability</p>
            </div>
            <div>
              <h4 className="font-medium text-cyan-600 mb-1">UI Elements</h4>
              <p className="text-body-sm text-gray-600">Use Inter Medium for buttons and labels to ensure clarity</p>
            </div>
            <div>
              <h4 className="font-medium text-indigo-600 mb-1">Emphasis</h4>
              <p className="text-body-sm text-gray-600">Use color or weight for emphasis, avoid italics in UI contexts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="brand-card">
          <CardHeader>
            <CardTitle className="text-h3">Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-cosmic-purple mb-1">Line Length</h4>
              <p className="text-body-sm text-stone-gray">Optimal 65-75 characters for body text readability</p>
            </div>
            <div>
              <h4 className="font-medium text-electric-violet mb-1">Contrast</h4>
              <p className="text-body-sm text-stone-gray">Maintain WCAG AA standards (4.5:1 minimum) for accessibility</p>
            </div>
            <div>
              <h4 className="font-medium text-phosphor-cyan mb-1">Hierarchy</h4>
              <p className="text-body-sm text-stone-gray">Use consistent heading levels to create clear information structure</p>
            </div>
            <div>
              <h4 className="font-medium text-synaptic-blue mb-1">Responsive</h4>
              <p className="text-body-sm text-stone-gray">Scale typography fluidly across devices using clamp() values</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}