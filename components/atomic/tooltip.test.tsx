import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('Tooltip', () => {
  const renderTooltip = (props = {}) => {
    return render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Hover me</button>
          </TooltipTrigger>
          <TooltipContent {...props}>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  it('should render trigger element', () => {
    renderTooltip()
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup()
    renderTooltip()
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    
    // Tooltip should not be visible initially
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    
    // Hover over trigger
    await user.hover(trigger)
    
    // Tooltip should appear
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  it('should hide tooltip on unhover', async () => {
    const user = userEvent.setup()
    renderTooltip()
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    
    // Show tooltip
    await user.hover(trigger)
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
    
    // Hide tooltip
    await user.unhover(trigger)
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    })
  })

  it('should apply custom className', async () => {
    const user = userEvent.setup()
    renderTooltip({ className: 'custom-tooltip' })
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    await user.hover(trigger)
    
    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content').parentElement
      expect(tooltip).toHaveClass('custom-tooltip')
    })
  })

  it('should position tooltip on different sides', async () => {
    const user = userEvent.setup()
    
    const sides = ['top', 'right', 'bottom', 'left'] as const
    
    for (const side of sides) {
      const { unmount } = renderTooltip({ side })
      
      const trigger = screen.getByRole('button', { name: 'Hover me' })
      await user.hover(trigger)
      
      await waitFor(() => {
        const tooltip = screen.getByText('Tooltip content').parentElement
        expect(tooltip).toHaveAttribute('data-side', side)
      })
      
      unmount()
    }
  })

  it('should align tooltip correctly', async () => {
    const user = userEvent.setup()
    
    const alignments = ['start', 'center', 'end'] as const
    
    for (const align of alignments) {
      const { unmount } = renderTooltip({ align })
      
      const trigger = screen.getByRole('button', { name: 'Hover me' })
      await user.hover(trigger)
      
      await waitFor(() => {
        const tooltip = screen.getByText('Tooltip content').parentElement
        expect(tooltip).toHaveAttribute('data-align', align)
      })
      
      unmount()
    }
  })

  it('should hide arrow when hideArrow is true', async () => {
    const user = userEvent.setup()
    renderTooltip({ hideArrow: true })
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    await user.hover(trigger)
    
    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content').parentElement
      const arrow = tooltip?.querySelector('svg')
      expect(arrow).not.toBeInTheDocument()
    })
  })

  it('should show arrow by default', async () => {
    const user = userEvent.setup()
    renderTooltip()
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    await user.hover(trigger)
    
    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content').parentElement
      const arrow = tooltip?.querySelector('svg')
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveClass('fill-inverse')
    })
  })

  it('should accept custom sideOffset', async () => {
    const user = userEvent.setup()
    renderTooltip({ sideOffset: 20 })
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
      // The actual positioning is handled by Radix UI, so we just verify the tooltip appears
    })
  })

  it('should be accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    renderTooltip()
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    
    // Focus trigger with keyboard
    await user.tab()
    expect(trigger).toHaveFocus()
    
    // Tooltip should show on focus
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  it('should apply semantic design tokens', async () => {
    const user = userEvent.setup()
    renderTooltip()
    
    const trigger = screen.getByRole('button', { name: 'Hover me' })
    await user.hover(trigger)
    
    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content').parentElement
      
      // Check for semantic token classes
      expect(tooltip).toHaveClass('bg-inverse')
      expect(tooltip).toHaveClass('text-inverse')
      expect(tooltip).toHaveClass('text-sm')
      expect(tooltip).toHaveClass('px-spacing-sm')
      expect(tooltip).toHaveClass('py-spacing-xs')
      expect(tooltip).toHaveClass('shadow-popover')
    })
  })
})