'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * @component NeuralNetwork
 * @description Animated neural network visualization with synaptic connections
 * 
 * @example
 * // Basic usage
 * <NeuralNetwork 
 *   nodes={[
 *     { id: '1', x: 100, y: 100, layer: 0 },
 *     { id: '2', x: 200, y: 150, layer: 1 }
 *   ]}
 *   edges={[
 *     { from: '1', to: '2' }
 *   ]}
 * />
 * 
 * @props
 * - nodes: Array<{id: string, x: number, y: number, layer: number}> - Network nodes
 * - edges: Array<{from: string, to: string}> - Connections between nodes
 * - animated: boolean - Enable pulse animations
 * - className: string - Additional CSS classes
 * 
 * @accessibility
 * - ARIA labels for network visualization
 * - Reduced motion support
 * 
 * @vergil-semantic neural-network-visualization
 */

interface Node {
  id: string
  x: number
  y: number
  layer: number
}

interface Edge {
  from: string
  to: string
}

interface NeuralNetworkProps {
  nodes?: Node[]
  edges?: Edge[]
  animated?: boolean
  className?: string
}

export function NeuralNetwork({ 
  nodes = [], 
  edges = [], 
  animated = true,
  className 
}: NeuralNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Generate default nodes if none provided
  const defaultNodes: Node[] = nodes.length === 0 ? [
    { id: '1', x: 50, y: 150, layer: 0 },
    { id: '2', x: 50, y: 250, layer: 0 },
    { id: '3', x: 200, y: 100, layer: 1 },
    { id: '4', x: 200, y: 200, layer: 1 },
    { id: '5', x: 200, y: 300, layer: 1 },
    { id: '6', x: 350, y: 150, layer: 2 },
    { id: '7', x: 350, y: 250, layer: 2 },
  ] : nodes

  const defaultEdges: Edge[] = edges.length === 0 ? [
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '1', to: '5' },
    { from: '2', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '3', to: '7' },
    { from: '4', to: '6' },
    { from: '4', to: '7' },
    { from: '5', to: '6' },
    { from: '5', to: '7' },
  ] : edges

  const actualNodes = defaultNodes
  const actualEdges = defaultEdges

  return (
    <div className={cn("relative w-full h-[400px] bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden", className)}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 400 400"
        aria-label="Neural network visualization"
      >
        <defs>
          <linearGradient id="synapticGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--vergil-purple-500)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--vergil-violet-500)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--vergil-indigo-500)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Render edges */}
        {actualEdges.map((edge, index) => {
          const fromNode = actualNodes.find(n => n.id === edge.from)
          const toNode = actualNodes.find(n => n.id === edge.to)
          
          if (!fromNode || !toNode) return null

          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#synapticGradient)"
              strokeWidth="2"
              opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={animated ? {
                pathLength: 1,
                opacity: [0.6, 1, 0.6],
              } : { pathLength: 1 }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut" },
                opacity: { duration: 2, repeat: Infinity, repeatType: "reverse", delay: index * 0.1 }
              }}
            />
          )
        })}

        {/* Render nodes */}
        {actualNodes.map((node, index) => (
          <motion.g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="12"
              fill="var(--vergil-purple-500)"
              opacity="0.8"
              initial={{ scale: 0 }}
              animate={animated ? {
                scale: [1, 1.2, 1],
              } : { scale: 1 }}
              transition={{
                scale: { duration: 2, repeat: Infinity, repeatType: "reverse", delay: index * 0.2 }
              }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill="var(--vergil-violet-500)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill="white"
              initial={{ opacity: 0 }}
              animate={animated ? {
                opacity: [0.5, 1, 0.5],
              } : { opacity: 0.8 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.15
              }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Floating particles */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => {
            // Use deterministic positions based on index to avoid hydration mismatch
            const initialX = (i * 80) % 400
            const initialY = (i * 60 + 50) % 400
            const targetX = ((i + 1) * 70 + 100) % 400
            const targetY = ((i + 2) * 90 + 30) % 400
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-600 rounded-full"
                initial={{ 
                  x: initialX, 
                  y: initialY,
                  opacity: 0 
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  delay: i * 0.5
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}