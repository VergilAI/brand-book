'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { LightRays } from '@/components/vergil/light-rays'
import { Eye, Layers, Zap, Settings, Palette } from 'lucide-react'

export default function LightRaysPage() {
  const [rayCount, setRayCount] = useState([24])
  const [rayStartDistance, setRayStartDistance] = useState([8])
  const [colorVariant, setColorVariant] = useState<'apple' | 'consciousness'>('apple')
  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cosmic-purple via-electric-violet to-phosphor-cyan bg-clip-text text-transparent">
          Light Rays Pattern
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          A sophisticated radial gradient with distinct linear light rays emanating from an off-screen light source. 
          Features organic ray spacing, varying opacity levels, and subtle horizontal banding for texture.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">Radial Gradients</Badge>
          <Badge variant="outline">Linear Rays</Badge>
          <Badge variant="outline">Organic Spacing</Badge>
          <Badge variant="outline">Navy to Cyan</Badge>
          <Badge variant="outline">Soft Edges</Badge>
        </div>
      </div>

      {/* Main Demo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Light Rays Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden border mb-6">
            <LightRays 
              className="w-full h-full" 
              rayCount={rayCount[0]}
              rayStartDistance={rayStartDistance[0]}
              colorVariant={colorVariant}
            />
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Color Variant Control */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Palette
              </h4>
              <div className="flex gap-3">
                <Button
                  variant={colorVariant === 'apple' ? 'default' : 'outline'}
                  onClick={() => setColorVariant('apple')}
                  className="flex-1"
                >
                  Apple Colors
                </Button>
                <Button
                  variant={colorVariant === 'consciousness' ? 'default' : 'outline'}
                  onClick={() => setColorVariant('consciousness')}
                  className="flex-1"
                >
                  Consciousness Gradient
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {colorVariant === 'apple' 
                  ? 'Vibrant early Apple-inspired colors' 
                  : 'Purple-violet tones from the Vergil consciousness gradient'
                }
              </p>
            </div>

            {/* Ray Count Control */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Ray Count: {rayCount[0]}
              </h4>
              <Slider
                value={rayCount}
                onValueChange={setRayCount}
                min={8}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Ray Start Distance Control */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Ray Start Distance: {rayStartDistance[0]}%
              </h4>
              <Slider
                value={rayStartDistance}
                onValueChange={setRayStartDistance}
                min={0}
                max={25}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Controls how far from center the rays begin to appear
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Base Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The foundation uses a radial gradient transitioning from deep navy/black on the left 
              to bright cyan-blue on the right, creating the illusion of an off-screen light source.
            </p>
            <div className="bg-muted/30 p-3 rounded text-xs font-mono">
              <pre>{`radial-gradient(ellipse at left center, 
  #0a0f1c 0%,     // Deep navy
  #1a2332 25%,    // Dark blue-gray
  #2d4663 50%,    // Medium blue
  #4a6b94 75%,    // Light blue
  #06b6d4 100%    // Bright cyan
)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Ray Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Individual rays are created with diagonal linear gradients at 15-30 degree angles. 
              Each ray has varying opacity, width, and position for organic feel.
            </p>
            <div className="bg-muted/30 p-3 rounded text-xs font-mono">
              <pre>{`// Ray configuration
{ 
  angle: 25, 
  opacity: 0.8, 
  width: 3, 
  position: 52 
}

// Gradient generation
linear-gradient(25deg, 
  transparent 0%,
  rgba(255,255,255,0.8) 52%,
  transparent 100%
)`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Key Characteristics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Ray Direction</h4>
              <p className="text-sm text-muted-foreground">
                Rays emanate diagonally from upper-left at 15-30 degree angles from horizontal
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Opacity Variation</h4>
              <p className="text-sm text-muted-foreground">
                Each ray uses different transparency (20-90%) creating layered depth
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Organic Spacing</h4>
              <p className="text-sm text-muted-foreground">
                Irregular spacing between rays creates natural, non-mechanical feel
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Soft Edges</h4>
              <p className="text-sm text-muted-foreground">
                Slight blur (0.5-2px) creates feathered edges rather than hard cutoffs
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="font-medium">Technical Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-sm mb-2">Horizontal Banding</h5>
                <p className="text-xs text-muted-foreground">
                  Subtle horizontal gradient bands add texture to the base gradient
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-sm mb-2">Multiple Ray Layers</h5>
                <p className="text-xs text-muted-foreground">
                  Primary rays plus subtle background rays for additional depth
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-sm mb-2">Color Transitions</h5>
                <p className="text-xs text-muted-foreground">
                  White-cyan ray centers with transparent falloffs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg">
            <pre className="text-sm font-mono overflow-x-auto">
{`import { LightRays } from '@/components/vergil/light-rays'

// Full background
<div className="w-full h-screen">
  <LightRays />
</div>

// Card background
<div className="relative w-96 h-64 rounded-lg overflow-hidden">
  <LightRays className="absolute inset-0" />
  <div className="relative z-10 p-6">
    {/* Your content here */}
  </div>
</div>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}