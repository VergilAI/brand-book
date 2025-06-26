'use client'

import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Play, Pause, RotateCcw, Palette, Eye } from 'lucide-react'

export default function StreamgraphPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([1500])
  const [blurAmount, setBlurAmount] = useState([3])
  const [opacity, setOpacity] = useState([0.8])
  const [n, setN] = useState([20]) // number of layers
  const [m, setM] = useState([200]) // number of samples per layer  
  const [k, setK] = useState([10]) // number of bumps per layer
  const [colorScheme, setColorScheme] = useState('vergil') // Color scheme selector
  const intervalRef = useRef<NodeJS.Timeout>()
  const pathsRef = useRef<any>(null)
  const animationLoopRef = useRef<boolean>(false)
  const currentSpeedRef = useRef(animationSpeed[0])
  
  const width = 928
  const height = 500

  // Color scheme definitions
  const colorSchemes: Record<string, { name: string; type: 'preset' | 'd3'; colors?: string[]; interpolator?: any }> = {
    // Preset palettes
    vergil: {
      name: 'Vergil Brand',
      type: 'preset',
      colors: ['#6366F1', '#A78BFA', '#818CF8', '#10B981', '#3B82F6', '#F472B6', '#8B5CF6', '#06B6D4']
    },
    ocean: {
      name: 'Ocean Depths',
      type: 'preset',
      colors: ['#0077BE', '#0099CC', '#00BBDD', '#00DDEE', '#00FFFF', '#0E7490', '#155E75', '#164E63']
    },
    sunset: {
      name: 'Sunset',
      type: 'preset',
      colors: ['#FF6B6B', '#FF8E53', '#FF6F61', '#FFB347', '#FFD93D', '#FF6B9D', '#C44569', '#F8B195']
    },
    forest: {
      name: 'Forest',
      type: 'preset',
      colors: ['#2D5016', '#3D7C2E', '#4B9F47', '#5CB85C', '#71C671', '#8FD694', '#A3D9A5', '#B7E4C7']
    },
    monochrome: {
      name: 'Monochrome',
      type: 'preset',
      colors: ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc']
    },
    // D3 interpolators
    cool: { name: 'Cool', type: 'd3', interpolator: d3.interpolateCool },
    warm: { name: 'Warm', type: 'd3', interpolator: d3.interpolateWarm },
    viridis: { name: 'Viridis', type: 'd3', interpolator: d3.interpolateViridis },
    plasma: { name: 'Plasma', type: 'd3', interpolator: d3.interpolatePlasma },
    inferno: { name: 'Inferno', type: 'd3', interpolator: d3.interpolateInferno },
    rainbow: { name: 'Rainbow', type: 'd3', interpolator: d3.interpolateRainbow },
    sinebow: { name: 'Sinebow', type: 'd3', interpolator: d3.interpolateSinebow },
    turbo: { name: 'Turbo', type: 'd3', interpolator: d3.interpolateTurbo },
    cividis: { name: 'Cividis', type: 'd3', interpolator: d3.interpolateCividis },
    cubehelix: { name: 'Cubehelix', type: 'd3', interpolator: d3.interpolateCubehelixDefault }
  }

  // Get color for a layer based on selected scheme
  const getLayerColor = (index: number, total: number) => {
    const scheme = colorSchemes[colorScheme]
    if (scheme.type === 'preset' && scheme.colors) {
      return scheme.colors[index % scheme.colors.length]
    } else if (scheme.type === 'd3' && scheme.interpolator) {
      return scheme.interpolator(index / total)
    }
    return d3.interpolateCool(Math.random())
  }

  // Lee Byron's bump function from D3 Observable
  const createBumps = (n: number, k: number) => {
    function bump(a: number[], n: number) {
      const x = 1 / (0.1 + Math.random())
      const y = 2 * Math.random() - 0.5
      const z = 10 / (0.1 + Math.random())
      for (let i = 0; i < n; ++i) {
        const w = (i / n - y) * z
        a[i] += x * Math.exp(-w * w)
      }
    }
    
    return function bumps(n: number, k: number) {
      const a = []
      for (let i = 0; i < n; ++i) a[i] = 0
      for (let i = 0; i < k; ++i) bump(a, n)
      return a
    }
  }

  // Initialize the chart once
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Create scales
    const x = d3.scaleLinear([0, m[0] - 1], [0, width])
    const y = d3.scaleLinear([0, 1], [height, 0])

    // Create area generator
    const area = d3.area<any>()
      .x((d, i) => x(i))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveBasis)

    // Create stack
    const stack = d3.stack()
      .keys(d3.range(n[0]))
      .offset(d3.stackOffsetExpand)
      .order(d3.stackOrderNone)

    // Create bump function
    const bumps = createBumps(n[0], k[0])

    // Randomize function
    function randomize() {
      const layers = stack(d3.transpose(Array.from({length: n[0]}, () => bumps(m[0], k[0]))))
      y.domain([
        d3.min(layers, l => d3.min(l, d => d[0])) || 0,
        d3.max(layers, l => d3.max(l, d => d[1])) || 1
      ])
      return layers
    }

    // Create a group for all paths
    const mainGroup = svg.append('g')
      .attr('class', 'streamgraph-group')

    // Create initial paths
    pathsRef.current = mainGroup.selectAll('path')
      .data(randomize())
      .join('path')
      .attr('d', area)
      .attr('fill', (d, i) => getLayerColor(i, n[0]))
      .style('mix-blend-mode', 'multiply')
      .style('opacity', opacity[0])

    // Clean up any existing animation
    return () => {
      animationLoopRef.current = false
    }

  }, [n, m, k, colorScheme]) // Recreate when core parameters or color scheme changes

  // Update visual properties without recreating chart
  useEffect(() => {
    if (!svgRef.current) return

    // Update opacity on paths
    if (pathsRef.current) {
      pathsRef.current.style('opacity', opacity[0])
    }

  }, [opacity])

  // Control animation
  useEffect(() => {
    if (!pathsRef.current) return
    
    // Clear any existing timeouts
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }
    
    animationLoopRef.current = isPlaying
    
    if (isPlaying) {
      // Need to access D3 setup from the initialization
      const x = d3.scaleLinear([0, m[0] - 1], [0, width])
      const y = d3.scaleLinear([0, 1], [height, 0])
      
      const area = d3.area<any>()
        .x((d, i) => x(i))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveBasis)
      
      const stack = d3.stack()
        .keys(d3.range(n[0]))
        .offset(d3.stackOffsetExpand)
        .order(d3.stackOrderNone)
      
      const bumps = createBumps(n[0], k[0])
      
      function randomize() {
        const layers = stack(d3.transpose(Array.from({length: n[0]}, () => bumps(m[0], k[0]))))
        y.domain([
          d3.min(layers, l => d3.min(l, d => d[0])) || 0,
          d3.max(layers, l => d3.max(l, d => d[1])) || 1
        ])
        return layers
      }
      
      const animate = async () => {
        if (!animationLoopRef.current || !pathsRef.current) return
        
        try {
          // Stop any running transitions before starting new ones
          pathsRef.current.interrupt()
          
          await pathsRef.current
            .data(randomize())
            .transition()
            .duration(currentSpeedRef.current)
            .ease(d3.easeLinear)
            .attr('d', area)
            .attr('fill', (d, i) => getLayerColor(i, n[0]))
            .end()
          
          if (animationLoopRef.current) {
            intervalRef.current = setTimeout(animate, 50)
          }
        } catch (error) {
          // Handle transition interruption gracefully
          console.log('Transition interrupted')
        }
      }
      
      // Start the animation loop
      animate()
    } else {
      // Stop any running transitions when paused
      if (pathsRef.current) {
        pathsRef.current.interrupt()
      }
    }
    
    return () => {
      animationLoopRef.current = false
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
      if (pathsRef.current) {
        pathsRef.current.interrupt()
      }
    }
  }, [isPlaying, n, m, k]) // Recreate animation when data params change

  // Update speed ref when slider changes
  useEffect(() => {
    currentSpeedRef.current = animationSpeed[0]
  }, [animationSpeed])

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  const resetData = () => {
    setIsPlaying(false)
    // Force re-initialization by changing a parameter slightly
    setN([n[0]])
  }

  const generateNewData = () => {
    if (pathsRef.current) {
      // Force re-initialization with same parameters to get new data
      setN([n[0]])
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cosmic-purple via-electric-violet to-phosphor-cyan bg-clip-text text-transparent">
          Streamgraph Transitions
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
          Fluid data visualizations using D3's stackOffsetExpand with customizable blur effects 
          to create dreamy, out-of-focus background animations that suggest depth and movement.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline">D3.js</Badge>
          <Badge variant="outline">stackOffsetExpand</Badge>
          <Badge variant="outline">Gaussian Blur</Badge>
          <Badge variant="outline">CSS Filters</Badge>
          <Badge variant="outline">Smooth Transitions</Badge>
        </div>
      </div>

      {/* Main Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Interactive Streamgraph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <div 
              className="relative border rounded-lg bg-gradient-to-br from-deep-space/5 via-cosmic-purple/5 to-phosphor-cyan/5"
              style={{ 
                filter: blurAmount[0] > 0 ? `blur(${blurAmount[0]}px)` : 'none',
                transform: 'translateZ(0)', // Force GPU layer
                willChange: blurAmount[0] > 0 ? 'filter' : 'auto'
              }}
            >
              <svg
                ref={svgRef}
                width={width}
                height={height}
                style={{ display: 'block' }}
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="space-y-6 pt-6 border-t">
            {/* Data Generation Parameters */}
            <div>
              <h4 className="font-medium mb-3">Data Generation Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Layers (n)</label>
                  <Slider
                    value={n}
                    onValueChange={setN}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {n[0]} layers
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Samples (m)</label>
                  <Slider
                    value={m}
                    onValueChange={setM}
                    min={50}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {m[0]} samples per layer
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bumps (k)</label>
                  <Slider
                    value={k}
                    onValueChange={setK}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {k[0]} bumps per layer
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Effects */}
            <div>
              <h4 className="font-medium mb-3">Visual Effects</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Scheme</label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vergil">Vergil Brand</SelectItem>
                      <SelectItem value="ocean">Ocean Depths</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                      <SelectItem value="cool">D3 Cool</SelectItem>
                      <SelectItem value="warm">D3 Warm</SelectItem>
                      <SelectItem value="viridis">D3 Viridis</SelectItem>
                      <SelectItem value="plasma">D3 Plasma</SelectItem>
                      <SelectItem value="inferno">D3 Inferno</SelectItem>
                      <SelectItem value="rainbow">D3 Rainbow</SelectItem>
                      <SelectItem value="sinebow">D3 Sinebow</SelectItem>
                      <SelectItem value="turbo">D3 Turbo</SelectItem>
                      <SelectItem value="cividis">D3 Cividis</SelectItem>
                      <SelectItem value="cubehelix">D3 Cubehelix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    min={200}
                    max={12000}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {animationSpeed[0]}ms
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blur Amount</label>
                  <Slider
                    value={blurAmount}
                    onValueChange={setBlurAmount}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {blurAmount[0]}px
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Opacity</label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={0.1}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">
                    {Math.round(opacity[0] * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h4 className="font-medium mb-3">Controls</h4>
              <div className="flex gap-2">
                <Button
                  onClick={toggleAnimation}
                  variant={isPlaying ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  onClick={resetData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={generateNewData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  New Pattern
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Performance Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The blur effect is now optimized by applying it to the group element instead of individual paths, 
              and using CSS filters with GPU acceleration for better performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Group-Level Blur</h4>
                <p className="text-xs text-muted-foreground">
                  Single blur filter on parent group reduces calculations
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">CSS Filter</h4>
                <p className="text-xs text-muted-foreground">
                  CSS blur is hardware-accelerated unlike SVG filters
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">GPU Layer</h4>
                <p className="text-xs text-muted-foreground">
                  will-change and translateZ(0) force GPU compositing
                </p>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                For best performance with blur effects, keep layers (n) under 30 and reduce blur amount if needed.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>stackOffsetExpand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              D3's stackOffsetExpand normalizes each time point to span 0-1, creating the characteristic 
              streamgraph shape where the total height remains constant while individual layers flow.
            </p>
            <div className="bg-muted/30 p-3 rounded text-xs">
              <code>
                d3.stack()<br/>
                &nbsp;&nbsp;.keys(layerKeys)<br/>
                &nbsp;&nbsp;.offset(d3.stackOffsetExpand)
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blur & Depth Effects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Optimized blur implementation uses CSS filters on a group element for better performance 
              while maintaining the dreamy, out-of-focus effect.
            </p>
            <div className="bg-muted/30 p-3 rounded text-xs">
              <code>
                filter: blur(3px)<br/>
                will-change: transform<br/>
                transform: translateZ(0)
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            This streamgraph technique is perfect for creating subtle, intelligent background animations 
            that enhance the Vergil brand's "living system" philosophy without overwhelming content.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Hero Backgrounds</h4>
              <p className="text-xs text-muted-foreground">
                Slow, subtle animations behind hero content create depth and intelligence
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Dashboard Ambience</h4>
              <p className="text-xs text-muted-foreground">
                Represent data flows and AI processing with gentle, living visualizations
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Loading States</h4>
              <p className="text-xs text-muted-foreground">
                Transform waiting into engaging experiences with beautiful, hypnotic flows
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}