'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pause, Play, RotateCcw } from 'lucide-react'

interface RadialHeatmapProps {
  skills?: string[]
  title?: string
  description?: string
  colors?: Array<{
    base: string
    glow: string
    highlight: string
  }>
  className?: string
  showControls?: boolean
  autoStart?: boolean
  numLayers?: number
}

export function RadialHeatmap({
  skills = [
    "Digital Banking",
    "Risk Analysis", 
    "Customer Service",
    "AI & Analytics",
    "Compliance",
    "Leadership"
  ],
  title = "Skill Intelligence Matrix",
  description = "Real-time visualization of organizational competency levels across key skill areas. Each layer represents different departments or skill categories.",
  colors = [
    { base: "rgba(99, 102, 241, 0.4)", glow: "rgba(99, 102, 241, 0.8)", highlight: "rgba(129, 140, 248, 0.6)" },
    { base: "rgba(168, 85, 247, 0.4)", glow: "rgba(168, 85, 247, 0.8)", highlight: "rgba(196, 181, 253, 0.6)" },
    { base: "rgba(236, 72, 153, 0.4)", glow: "rgba(236, 72, 153, 0.8)", highlight: "rgba(244, 114, 182, 0.6)" },
    { base: "rgba(251, 146, 60, 0.4)", glow: "rgba(251, 146, 60, 0.8)", highlight: "rgba(254, 215, 170, 0.6)" },
    { base: "rgba(59, 130, 246, 0.4)", glow: "rgba(59, 130, 246, 0.8)", highlight: "rgba(96, 165, 250, 0.6)" },
    { base: "rgba(139, 92, 246, 0.4)", glow: "rgba(139, 92, 246, 0.8)", highlight: "rgba(167, 139, 250, 0.6)" },
    { base: "rgba(217, 70, 239, 0.4)", glow: "rgba(217, 70, 239, 0.8)", highlight: "rgba(232, 121, 249, 0.6)" }
  ],
  className,
  showControls = true,
  autoStart = true,
  numLayers = 7
}: RadialHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number | null>(null)
  const layersRef = useRef<Array<{
    element: HTMLDivElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    level: number
    time: number
    speed: number
    colorData: typeof colors[0]
  }>>([])
  
  const [isPaused, setIsPaused] = useState(!autoStart)

  // Noise function for organic blob shapes
  const noise = useCallback((x: number, y: number, z: number, time: number) => {
    const freq = 0.02
    return (
      Math.sin(x * freq + time) * Math.cos(y * freq - time * 0.7) * Math.sin(z * freq + time * 1.3) +
      Math.sin(x * freq * 2 + time * 1.5) * 0.5
    )
  }, [])

  // Draw individual blob layer
  const drawBlob = useCallback((layer: typeof layersRef.current[0]) => {
    const { ctx, canvas, level, time, colorData } = layer
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const baseRadius = 200 - level * 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseRadius * 1.2
    )
    gradient.addColorStop(0, colorData.highlight)
    gradient.addColorStop(0.3, colorData.base)
    gradient.addColorStop(0.7, colorData.base.replace("0.4", "0.2"))
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.beginPath()
    const points = 120
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const noiseValue = noise(
        Math.cos(angle) * 100,
        Math.sin(angle) * 100,
        level * 50,
        time
      )
      const radius = baseRadius + noiseValue * 50 + Math.sin(angle * 3 + time) * 15

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()

    ctx.shadowBlur = 40
    ctx.shadowColor = colorData.glow
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.shadowBlur = 0
  }, [noise])

  // Animation loop
  const animate = useCallback(() => {
    if (!isPaused) {
      layersRef.current.forEach(layer => {
        layer.time += layer.speed
        drawBlob(layer)
      })
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [isPaused, drawBlob])

  // Initialize heatmap
  const initializeHeatmap = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return

    const blobContainer = containerRef.current.querySelector('.blob-container') as HTMLDivElement
    const labelsContainer = containerRef.current.querySelector('.labels-container') as HTMLDivElement

    if (!blobContainer || !labelsContainer) return

    // Clear any existing content
    blobContainer.innerHTML = ''
    labelsContainer.innerHTML = ''
    layersRef.current = []

    // Add skill labels - ensure we have valid skills
    const safeSkills = skills.slice(0, 6).map(skill => skill || '')
    while (safeSkills.length < 6) {
      safeSkills.push('')
    }

    const labelPositions = [
      { text: safeSkills[0], x: 0, y: -280 },
      { text: safeSkills[1], x: 280, y: -140 },
      { text: safeSkills[2], x: 280, y: 140 },
      { text: safeSkills[3], x: 0, y: 280 },
      { text: safeSkills[4], x: -280, y: 140 },
      { text: safeSkills[5], x: -280, y: -140 }
    ]

    // Add labels
    labelPositions.forEach(pos => {
      if (!pos.text) return
      
      const label = document.createElement('div')
      label.textContent = pos.text
      label.style.cssText = `
        position: absolute;
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.3);
        padding: 4px 8px;
        border-radius: 4px;
        backdrop-filter: blur(10px);
        opacity: 0.4;
        left: calc(50% + ${pos.x}px);
        top: calc(50% + ${pos.y}px);
      `
      labelsContainer.appendChild(label)
    })

    // Draw radial graph background
    const centerX = 300
    const centerY = 300
    const maxRadius = 250
    const levels = 5
    const sides = 6

    svgRef.current.innerHTML = ''

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('opacity', '0.15')

    // Draw concentric hexagons
    for (let level = 1; level <= levels; level++) {
      const radius = (maxRadius / levels) * level
      const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')

      const points = []
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        points.push(`${x},${y}`)
      }

      hexagon.setAttribute('points', points.join(' '))
      hexagon.setAttribute('fill', 'none')
      hexagon.setAttribute('stroke', '#94a3b8')
      hexagon.setAttribute('stroke-width', '1')
      g.appendChild(hexagon)
    }

    // Draw radial lines
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = centerX + Math.cos(angle) * maxRadius
      const y = centerY + Math.sin(angle) * maxRadius

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', centerX.toString())
      line.setAttribute('y1', centerY.toString())
      line.setAttribute('x2', x.toString())
      line.setAttribute('y2', y.toString())
      line.setAttribute('stroke', '#94a3b8')
      line.setAttribute('stroke-width', '1')
      g.appendChild(line)
    }

    svgRef.current.appendChild(g)

    // Create blob layers
    for (let i = 0; i < numLayers; i++) {
      const layerDiv = document.createElement('div')
      layerDiv.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: ${numLayers - i};
      `

      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 600
      canvas.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: contrast(1.1) saturate(1.2);
      `
      layerDiv.appendChild(canvas)

      blobContainer.appendChild(layerDiv)

      const ctx = canvas.getContext('2d')
      if (ctx) {
        layersRef.current.push({
          element: layerDiv,
          canvas: canvas,
          ctx: ctx,
          level: i,
          time: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002,
          colorData: colors[i % colors.length]
        })
      }
    }

    // Start animation
    if (!isPaused) {
      animate()
    }
  }, [skills, colors, numLayers, animate, isPaused])

  // Control functions
  const pauseAnimation = () => setIsPaused(true)
  const resumeAnimation = () => setIsPaused(false)
  const resetAnimation = () => {
    layersRef.current.forEach(layer => {
      layer.time = Math.random() * Math.PI * 2
    })
  }

  useEffect(() => {
    initializeHeatmap()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeHeatmap])

  useEffect(() => {
    if (isPaused && animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    } else if (!isPaused) {
      animate()
    }
  }, [isPaused, animate])

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        ref={containerRef}
        className="relative w-full h-[600px]"
        style={{ perspective: '1200px' }}
      >
        <svg 
          ref={svgRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width="600" 
          height="600" 
          viewBox="0 0 600 600"
        />
        <div className="labels-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none" />
        <div className="blob-container absolute w-full h-full" style={{ transformStyle: 'preserve-3d' }} />
        
        {showControls && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => isPaused ? resumeAnimation() : pauseAnimation()}
              className="gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={resetAnimation}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        )}
        
        {(title || description) && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-background/95 backdrop-blur-xl p-4 rounded-lg max-w-xs">
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{title || ''}</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {description || ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}