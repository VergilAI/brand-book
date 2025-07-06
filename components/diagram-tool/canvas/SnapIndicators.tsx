"use client"

import React from 'react'
import type { SnapIndicator } from '@/app/map-editor/types/snapping'

interface SnapIndicatorsProps {
  indicators: SnapIndicator[]
  zoom: number
}

export function SnapIndicators({ indicators, zoom }: SnapIndicatorsProps) {
  return (
    <g className="snap-indicators" style={{ pointerEvents: 'none' }}>
      {indicators.map(indicator => {
        switch (indicator.type) {
          case 'point':
            const point = indicator.geometry as { x: number; y: number }
            
            // Check if this is a center point (orange/yellow color)
            const isCenter = indicator.style.color === 'var(--color-yellow-600)'
            
            if (isCenter) {
              // Render center with crosshair icon
              return (
                <g key={indicator.id}>
                  {/* Crosshair for center */}
                  <line
                    x1={point.x - 8 / zoom}
                    y1={point.y}
                    x2={point.x + 8 / zoom}
                    y2={point.y}
                    stroke={indicator.style.color}
                    strokeWidth={indicator.style.width / zoom}
                  />
                  <line
                    x1={point.x}
                    y1={point.y - 8 / zoom}
                    x2={point.x}
                    y2={point.y + 8 / zoom}
                    stroke={indicator.style.color}
                    strokeWidth={indicator.style.width / zoom}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={6 / zoom}
                    fill="none"
                    stroke={indicator.style.color}
                    strokeWidth={indicator.style.width / zoom}
                  />
                </g>
              )
            } else {
              // Regular point indicator
              return (
                <g key={indicator.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={(indicator.style.radius || 4) / zoom}
                    fill="none"
                    stroke={indicator.style.color}
                    strokeWidth={indicator.style.width / zoom}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={2 / zoom}
                    fill={indicator.style.color}
                  />
                </g>
              )
            }
            
          case 'line':
          case 'guide':
            const line = indicator.geometry as { start: { x: number; y: number }; end: { x: number; y: number } }
            return (
              <line
                key={indicator.id}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke={indicator.style.color}
                strokeWidth={indicator.style.width / zoom}
                strokeDasharray={indicator.style.pattern === 'dashed' ? `${4 / zoom},${4 / zoom}` : undefined}
                opacity={0.6}
              />
            )
            
          case 'measurement':
            // For future implementation of measurement labels
            return null
            
          default:
            return null
        }
      })}
    </g>
  )
}