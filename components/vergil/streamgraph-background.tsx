'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface StreamgraphBackgroundProps {
  animationSpeed?: number
  blurAmount?: number
  opacity?: number
  n?: number // layers
  m?: number // samples
  k?: number // bumps
  className?: string
}

export function StreamgraphBackground({
  animationSpeed = 10000,
  blurAmount = 36,
  opacity = 0.45,
  n = 10,
  m = 200,
  k = 10,
  className = ''
}: StreamgraphBackgroundProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<any>(null)
  const animationLoopRef = useRef<boolean>(false)
  
  // Vergil brand colors - exact match from brand book
  const vergilColors = [
    '#6366F1', // cosmic-purple
    '#A78BFA', // electric-violet  
    '#818CF8', // luminous-indigo
    '#10B981', // phosphor-cyan
    '#3B82F6', // synaptic-blue
    '#F472B6', // neural-pink
    '#8B5CF6', // violet
    '#06B6D4'  // cyan (only 8 colors to match brand book exactly)
  ]

  // Lee Byron's bump function
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

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = window.innerWidth
    const height = window.innerHeight
    
    svg.attr('width', width).attr('height', height)
    svg.selectAll('*').remove()

    // Create scales
    const x = d3.scaleLinear([0, m - 1], [0, width])
    const y = d3.scaleLinear([0, 1], [height, 0])

    // Create area generator
    const area = d3.area<any>()
      .x((d, i) => x(i))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveBasis)

    // Create stack
    const stack = d3.stack()
      .keys(d3.range(n).map(String))
      .offset(d3.stackOffsetExpand)
      .order(d3.stackOrderNone)

    // Create bump function
    const bumps = createBumps(n, k)

    // Randomize function
    function randomize() {
      // Convert array data to object format expected by stack
      const transposedData = d3.transpose(Array.from({length: n}, () => bumps(m, k)))
      const objectData = transposedData.map(row => {
        const obj: {[key: string]: number} = {}
        row.forEach((value, i) => {
          obj[String(i)] = value
        })
        return obj
      })
      const layers = stack(objectData)
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
      .attr('fill', (d, i) => vergilColors[i % vergilColors.length])
      .style('mix-blend-mode', 'multiply')
      .style('opacity', opacity)
      .style('filter', 'saturate(0.8)') // Reduce saturation to match brand book

    // Animation loop
    const animate = async () => {
      if (!animationLoopRef.current || !pathsRef.current) return
      
      try {
        pathsRef.current.interrupt()
        
        await pathsRef.current
          .data(randomize())
          .transition()
          .duration(animationSpeed)
          .ease(d3.easeLinear)
          .attr('d', area)
          .end()
        
        if (animationLoopRef.current) {
          setTimeout(animate, 50)
        }
      } catch (error) {
        // Handle transition interruption
      }
    }

    // Start animation
    animationLoopRef.current = true
    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      svg.attr('width', newWidth).attr('height', newHeight)
      x.range([0, newWidth])
      y.range([newHeight, 0])
    }

    window.addEventListener('resize', handleResize)

    return () => {
      animationLoopRef.current = false
      window.removeEventListener('resize', handleResize)
      if (pathsRef.current) {
        pathsRef.current.interrupt()
      }
    }
  }, [animationSpeed, n, m, k, opacity])

  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ 
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        transform: 'translateZ(0)', // Force GPU layer
        willChange: blurAmount > 0 ? 'filter' : 'auto'
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}