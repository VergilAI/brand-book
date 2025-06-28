"use client"

import React from 'react'

interface GridOverlayProps {
  gridSize: number
  viewBox: string
}

export function GridOverlay({ gridSize, viewBox }: GridOverlayProps) {
  // Parse viewBox to get visible area
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  
  // Extend grid well beyond visible area for smooth panning
  const padding = Math.max(width, height) * 2
  
  // Calculate grid lines needed
  const startX = Math.floor((x - padding) / gridSize) * gridSize
  const endX = Math.ceil((x + width + padding) / gridSize) * gridSize
  const startY = Math.floor((y - padding) / gridSize) * gridSize
  const endY = Math.ceil((y + height + padding) / gridSize) * gridSize
  
  const verticalLines = []
  const horizontalLines = []
  
  // Generate vertical lines
  for (let lineX = startX; lineX <= endX; lineX += gridSize) {
    verticalLines.push(
      <line
        key={`v-${lineX}`}
        x1={lineX}
        y1={startY}
        x2={lineX}
        y2={endY}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    )
  }
  
  // Generate horizontal lines
  for (let lineY = startY; lineY <= endY; lineY += gridSize) {
    horizontalLines.push(
      <line
        key={`h-${lineY}`}
        x1={startX}
        y1={lineY}
        x2={endX}
        y2={lineY}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    )
  }
  
  // Major grid lines every 5 units
  const majorLines = []
  const majorGridSize = gridSize * 5
  
  for (let lineX = Math.floor((x - padding) / majorGridSize) * majorGridSize; lineX <= endX; lineX += majorGridSize) {
    majorLines.push(
      <line
        key={`mv-${lineX}`}
        x1={lineX}
        y1={startY}
        x2={lineX}
        y2={endY}
        stroke="#D1D5DB"
        strokeWidth="1"
      />
    )
  }
  
  for (let lineY = Math.floor((y - padding) / majorGridSize) * majorGridSize; lineY <= endY; lineY += majorGridSize) {
    majorLines.push(
      <line
        key={`mh-${lineY}`}
        x1={startX}
        y1={lineY}
        x2={endX}
        y2={lineY}
        stroke="#D1D5DB"
        strokeWidth="1"
      />
    )
  }
  
  return (
    <g className="grid-overlay pointer-events-none">
      {verticalLines}
      {horizontalLines}
      {majorLines}
      
      {/* Origin marker */}
      <circle cx="0" cy="0" r="2" fill="#6366F1" opacity="0.5" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke="#6366F1" strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="-10" x2="0" y2="10" stroke="#6366F1" strokeWidth="1" opacity="0.5" />
    </g>
  )
}