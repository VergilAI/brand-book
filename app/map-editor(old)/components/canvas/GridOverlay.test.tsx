import React from 'react'
import { render } from '@testing-library/react'
import { GridOverlay, DotGridOverlay } from './GridOverlay'

describe('GridOverlay', () => {
  const defaultProps = {
    gridSize: 20,
    viewBox: '0 0 1000 600',
    zoom: 1,
  }

  it('renders line grid by default', () => {
    const { container } = render(
      <svg>
        <GridOverlay {...defaultProps} />
      </svg>
    )
    
    const gridOverlay = container.querySelector('.grid-overlay')
    expect(gridOverlay).toBeInTheDocument()
    
    // Should have different grid line levels
    expect(container.querySelector('.grid-lines-primary')).toBeInTheDocument()
    expect(container.querySelector('.grid-lines-secondary')).toBeInTheDocument()
    expect(container.querySelector('.grid-lines-tertiary')).toBeInTheDocument()
  })

  it('renders dot grid when gridType is dots', () => {
    const { container } = render(
      <svg>
        <GridOverlay {...defaultProps} gridType="dots" />
      </svg>
    )
    
    const dotGridOverlay = container.querySelector('.dot-grid-overlay')
    expect(dotGridOverlay).toBeInTheDocument()
    
    // Should have dots
    const dots = container.querySelectorAll('circle')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('shows origin axes at higher zoom levels', () => {
    const { container } = render(
      <svg>
        <GridOverlay {...defaultProps} zoom={2} />
      </svg>
    )
    
    const originAxes = container.querySelector('.origin-axes')
    expect(originAxes).toBeInTheDocument()
    expect(originAxes?.children.length).toBeGreaterThan(0)
  })

  it('hides origin axes at lower zoom levels', () => {
    const { container } = render(
      <svg>
        <GridOverlay {...defaultProps} zoom={0.3} />
      </svg>
    )
    
    const originAxes = container.querySelector('.origin-axes')
    expect(originAxes).toBeInTheDocument()
    expect(originAxes?.children.length).toBe(0)
  })

  it('adjusts grid density based on zoom level', () => {
    const { container: container1 } = render(
      <svg>
        <GridOverlay {...defaultProps} zoom={0.5} />
      </svg>
    )
    
    const { container: container2 } = render(
      <svg>
        <GridOverlay {...defaultProps} zoom={5} />
      </svg>
    )
    
    const lines1 = container1.querySelectorAll('line')
    const lines2 = container2.querySelectorAll('line')
    
    // Both should have similar line counts due to constant density
    expect(Math.abs(lines1.length - lines2.length)).toBeLessThan(20)
  })

  it('renders DotGridOverlay directly', () => {
    const { container } = render(
      <svg>
        <DotGridOverlay {...defaultProps} />
      </svg>
    )
    
    const dotGridOverlay = container.querySelector('.dot-grid-overlay')
    expect(dotGridOverlay).toBeInTheDocument()
    
    // Should have both minor and major dots
    expect(container.querySelector('.grid-dot-minor')).toBeInTheDocument()
    expect(container.querySelector('.grid-dot-major')).toBeInTheDocument()
  })
})