import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

describe('Tooltip', () => {
  it('renders tooltip on hover', async () => {
    const user = userEvent.setup()
    
    render(
      <Tooltip>
        <TooltipTrigger>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip content</p>
        </TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByText('Hover me')
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()

    await user.hover(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })

    await user.unhover(trigger)
    
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
    })
  })

  it('supports different positioning', async () => {
    const user = userEvent.setup()
    
    const positions = ['top', 'right', 'bottom', 'left'] as const
    
    for (const position of positions) {
      const { unmount } = render(
        <Tooltip>
          <TooltipTrigger>
            <button>Trigger</button>
          </TooltipTrigger>
          <TooltipContent side={position}>
            <p>{`Tooltip ${position}`}</p>
          </TooltipContent>
        </Tooltip>
      )

      const trigger = screen.getByText('Trigger')
      await user.hover(trigger)
      
      await waitFor(() => {
        const content = screen.getByText(`Tooltip ${position}`)
        expect(content).toBeInTheDocument()
        expect(content.parentElement).toHaveAttribute('data-side', position)
      })

      unmount()
    }
  })

  it('respects delay duration', async () => {
    const user = userEvent.setup()
    
    render(
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <button>Delayed trigger</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delayed tooltip</p>
        </TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByText('Delayed trigger')
    await user.hover(trigger)
    
    // Should not be visible immediately
    expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument()
    
    // Wait for delay
    await waitFor(
      () => {
        expect(screen.getByText('Delayed tooltip')).toBeInTheDocument()
      },
      { timeout: 600 }
    )
  })

  it('applies custom className', async () => {
    const user = userEvent.setup()
    
    render(
      <Tooltip>
        <TooltipTrigger>
          <button>Custom tooltip</button>
        </TooltipTrigger>
        <TooltipContent className="custom-class">
          <p>Custom content</p>
        </TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByText('Custom tooltip')
    await user.hover(trigger)
    
    await waitFor(() => {
      const content = screen.getByText('Custom content').parentElement
      expect(content).toHaveClass('custom-class')
    })
  })

  it('uses semantic token classes', async () => {
    const user = userEvent.setup()
    
    render(
      <Tooltip>
        <TooltipTrigger>
          <button>Token test</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Token content</p>
        </TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByText('Token test')
    await user.hover(trigger)
    
    await waitFor(() => {
      const content = screen.getByText('Token content').parentElement
      
      // Check for semantic token classes
      expect(content).toHaveClass('bg-inverse')
      expect(content).toHaveClass('text-inverse')
      expect(content).toHaveClass('shadow-popover')
      expect(content).toHaveClass('rounded-md')
      expect(content).toHaveClass('duration-normal')
    })
  })
})