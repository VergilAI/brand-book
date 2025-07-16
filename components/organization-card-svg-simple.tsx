'use client'

import { OrganizationCard } from './organization-card'

interface OrganizationCardSVGSimpleProps {
  x: number
  y: number
  width?: number
  height?: number
  cardProps: React.ComponentProps<typeof OrganizationCard>
}

export function OrganizationCardSVGSimple({ 
  x, 
  y, 
  width = 220, 
  height = 120,
  cardProps 
}: OrganizationCardSVGSimpleProps) {
  
  return (
    <>
      {/* Shadow */}
      <rect
        x={x + 2}
        y={y + 2}
        width={width}
        height={height}
        rx="8"
        fill="rgba(0,0,0,0.08)"
      />
      
      {/* Card container */}
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <OrganizationCard {...cardProps} className="h-full" />
        </div>
      </foreignObject>
    </>
  )
}