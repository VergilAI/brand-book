'use client'

import { OrganizationCard } from './organization-card'
import { createPortal } from 'react-dom'
import { useEffect, useState, useRef } from 'react'

interface OrganizationCardSVGProps {
  x: number
  y: number
  width?: number
  height?: number
  cardProps: React.ComponentProps<typeof OrganizationCard>
}

export function OrganizationCardSVG({ 
  x, 
  y, 
  width = 220, 
  height = 120,
  cardProps 
}: OrganizationCardSVGProps) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  const foreignObjectRef = useRef<SVGForeignObjectElement>(null)
  
  useEffect(() => {
    if (foreignObjectRef.current) {
      const div = document.createElement('div')
      div.style.width = '100%'
      div.style.height = '100%'
      foreignObjectRef.current.appendChild(div)
      setPortal(div)
      
      return () => {
        if (foreignObjectRef.current && div.parentNode === foreignObjectRef.current) {
          foreignObjectRef.current.removeChild(div)
        }
      }
    }
  }, [])
  
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
        ref={foreignObjectRef}
        x={x}
        y={y}
        width={width}
        height={height}
      >
        {portal && createPortal(
          <div style={{ width: '100%', height: '100%' }}>
            <OrganizationCard {...cardProps} className="h-full" />
          </div>,
          portal
        )}
      </foreignObject>
    </>
  )
}