import React, { useMemo } from 'react'

interface GridOverlayProps {
  gridSize: number
  viewBox: string
  zoom: number
  gridType?: 'lines' | 'dots'
}

// Powers of 2 and 5 for clean spacing transitions
const SPACING_SEQUENCE = [
  1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000
]

export function GridOverlay({ gridSize, viewBox, zoom, gridType = 'lines' }: GridOverlayProps) {
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  
  const gridConfig = useMemo(() => {
    // Calculate viewport size in SVG coordinates
    const viewportSize = Math.min(width, height) // Use min for better coverage
    
    // Calculate the ideal spacing to show ~5 major lines
    const idealPrimarySpacing = viewportSize / 5
    
    // Find the closest power of 10 * [1, 2, 5]
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(idealPrimarySpacing)))
    const normalized = idealPrimarySpacing / orderOfMagnitude
    
    let multiplier = 1
    if (normalized > 7.5) multiplier = 10
    else if (normalized > 3.5) multiplier = 5  
    else if (normalized > 1.5) multiplier = 2
    
    const primarySpacing = orderOfMagnitude * multiplier
    
    // For secondary and tertiary, use consistent subdivisions
    const secondarySpacing = primarySpacing / 5
    const tertiarySpacing = primarySpacing / 20
    
    // Calculate stroke widths based on zoom
    const baseStrokeWidth = Math.min(1, 1 / Math.sqrt(zoom))
    
    // Calculate zoom-based opacity fade
    // As we zoom out, fine grids should fade away
    const zoomNormalized = Math.log10(zoom + 0.1) // Log scale for smoother transitions
    
    // Tertiary lines fade out first when zooming out
    const tertiaryFade = Math.max(0, Math.min(1, (zoomNormalized + 1) * 2))
    // Secondary lines fade out at lower zoom levels
    const secondaryFade = Math.max(0, Math.min(1, (zoomNormalized + 0.5) * 2))
    
    return {
      tertiary: {
        spacing: tertiarySpacing,
        opacity: 0.03 * tertiaryFade, // Fades out when zooming out
        strokeWidth: baseStrokeWidth * 0.5,
        color: '#E5E7EB' // gray-200
      },
      secondary: {
        spacing: secondarySpacing,
        opacity: 0.08 * secondaryFade, // Fades out at lower zoom
        strokeWidth: baseStrokeWidth * 0.7,
        color: '#D1D5DB' // gray-300
      },
      primary: {
        spacing: primarySpacing,
        opacity: 0.15, // Always visible
        strokeWidth: baseStrokeWidth,
        color: '#9CA3AF' // gray-400
      }
    }
  }, [zoom, width, height])
  
  // Extend grid beyond visible area for smooth panning
  const padding = Math.max(width, height) * 0.5
  
  // Calculate grid line positions
  const lines = useMemo(() => {
    const allLines: JSX.Element[] = []
    
    // Helper function to generate lines for a specific grid level
    const generateGridLines = (
      spacing: number, 
      opacity: number, 
      strokeWidth: number, 
      color: string, 
      level: string
    ) => {
      if (opacity < 0.01) return [] // Skip if too faint
      
      const lines: JSX.Element[] = []
      
      // Calculate bounds for this spacing level
      const startX = Math.floor((x - padding) / spacing) * spacing
      const endX = Math.ceil((x + width + padding) / spacing) * spacing
      const startY = Math.floor((y - padding) / spacing) * spacing
      const endY = Math.ceil((y + height + padding) / spacing) * spacing
      
      // Vertical lines
      for (let lineX = startX; lineX <= endX; lineX += spacing) {
        lines.push(
          <line
            key={`v-${level}-${lineX}`}
            x1={lineX}
            y1={startY}
            x2={lineX}
            y2={endY}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            shapeRendering="crispEdges"
          />
        )
      }
      
      // Horizontal lines
      for (let lineY = startY; lineY <= endY; lineY += spacing) {
        lines.push(
          <line
            key={`h-${level}-${lineY}`}
            x1={startX}
            y1={lineY}
            x2={endX}
            y2={lineY}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            shapeRendering="crispEdges"
          />
        )
      }
      
      return lines
    }
    
    // Generate all three grid levels independently
    // Start with finest grid (drawn first, so it appears behind)
    allLines.push(...generateGridLines(
      gridConfig.tertiary.spacing,
      gridConfig.tertiary.opacity,
      gridConfig.tertiary.strokeWidth,
      gridConfig.tertiary.color,
      'tertiary'
    ))
    
    allLines.push(...generateGridLines(
      gridConfig.secondary.spacing,
      gridConfig.secondary.opacity,
      gridConfig.secondary.strokeWidth,
      gridConfig.secondary.color,
      'secondary'
    ))
    
    allLines.push(...generateGridLines(
      gridConfig.primary.spacing,
      gridConfig.primary.opacity,
      gridConfig.primary.strokeWidth,
      gridConfig.primary.color,
      'primary'
    ))
    
    return allLines
  }, [x, y, width, height, padding, gridConfig, gridType])
  
  // Origin lines and marker (only at higher zoom)
  const originElements = useMemo(() => {
    if (zoom < 0.5) return null
    
    const originOpacity = Math.min(0.3, (zoom - 0.5) * 0.6)
    
    return (
      <>
        {/* X axis */}
        <line
          x1={x - padding}
          y1={0}
          x2={x + width + padding}
          y2={0}
          stroke="#EF4444"
          strokeWidth={1 / zoom}
          opacity={originOpacity}
        />
        {/* Y axis */}
        <line
          x1={0}
          y1={y - padding}
          x2={0}
          y2={y + height + padding}
          stroke="#10B981"
          strokeWidth={1 / zoom}
          opacity={originOpacity}
        />
        {/* Origin marker */}
        {zoom > 1 && (
          <circle
            cx={0}
            cy={0}
            r={3 / zoom}
            fill="#6366F1"
            opacity={originOpacity}
          />
        )}
      </>
    )
  }, [x, y, width, height, padding, zoom])
  
  // Dot grid implementation
  if (gridType === 'dots') {
    const dots = useMemo(() => {
      const allDots: JSX.Element[] = []
      
      const generateDots = (spacing: number, radius: number, opacity: number, color: string, level: string) => {
        if (opacity < 0.01) return []
        
        const dots: JSX.Element[] = []
        const startX = Math.floor((x - padding) / spacing) * spacing
        const endX = Math.ceil((x + width + padding) / spacing) * spacing
        const startY = Math.floor((y - padding) / spacing) * spacing
        const endY = Math.ceil((y + height + padding) / spacing) * spacing
        
        for (let dotX = startX; dotX <= endX; dotX += spacing) {
          for (let dotY = startY; dotY <= endY; dotY += spacing) {
            dots.push(
              <circle
                key={`dot-${level}-${dotX}-${dotY}`}
                cx={dotX}
                cy={dotY}
                r={radius}
                fill={color}
                opacity={opacity}
              />
            )
          }
        }
        
        return dots
      }
      
      // Generate dots for each level
      allDots.push(...generateDots(
        gridConfig.tertiary.spacing,
        0.5 / zoom,
        gridConfig.tertiary.opacity,
        gridConfig.tertiary.color,
        'tertiary'
      ))
      
      allDots.push(...generateDots(
        gridConfig.secondary.spacing,
        0.75 / zoom,
        gridConfig.secondary.opacity,
        gridConfig.secondary.color,
        'secondary'
      ))
      
      allDots.push(...generateDots(
        gridConfig.primary.spacing,
        1 / zoom,
        gridConfig.primary.opacity,
        gridConfig.primary.color,
        'primary'
      ))
      
      return allDots
    }, [x, y, width, height, padding, gridConfig, zoom])
    
    return (
      <g className="grid-overlay" pointerEvents="none">
        {dots}
        {originElements}
      </g>
    )
  }
  
  // Lines grid (default)
  return (
    <g className="grid-overlay" pointerEvents="none">
      {lines}
      {originElements}
    </g>
  )
}