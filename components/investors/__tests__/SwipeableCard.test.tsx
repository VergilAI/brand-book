import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SwipeableCard } from '../SwipeableCard'

describe('SwipeableCard', () => {
  const mockOnSwipe = jest.fn()
  const defaultProps = {
    children: <div>Test Content</div>,
    onSwipeLeft: mockOnSwipe,
    onSwipeRight: mockOnSwipe,
  }

  beforeEach(() => {
    mockOnSwipe.mockClear()
  })

  describe('Touch Gesture Tests', () => {
    it('detects left swipe gesture', async () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Simulate swipe left
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 200, clientY: 100 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 50, clientY: 100 }],
      })
      fireEvent.touchEnd(card!, {})

      await waitFor(() => {
        expect(mockOnSwipe).toHaveBeenCalledTimes(1)
      })
    })

    it('detects right swipe gesture', async () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Simulate swipe right
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 50, clientY: 100 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 200, clientY: 100 }],
      })
      fireEvent.touchEnd(card!, {})

      await waitFor(() => {
        expect(mockOnSwipe).toHaveBeenCalledTimes(1)
      })
    })

    it('ignores vertical swipes', async () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Simulate vertical swipe
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 100, clientY: 50 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 100, clientY: 200 }],
      })
      fireEvent.touchEnd(card!, {})

      expect(mockOnSwipe).not.toHaveBeenCalled()
    })

    it('requires minimum swipe distance', async () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Small swipe (less than threshold)
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 100, clientY: 100 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 120, clientY: 100 }],
      })
      fireEvent.touchEnd(card!, {})

      expect(mockOnSwipe).not.toHaveBeenCalled()
    })
  })

  describe('Visual Feedback Tests', () => {
    it('shows visual feedback during swipe', () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Start swipe
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 100, clientY: 100 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 150, clientY: 100 }],
      })

      // Card should have transform applied
      expect(card).toHaveStyle('transform: translateX(50px)')
    })

    it('snaps back when swipe is cancelled', async () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Start and cancel swipe
      fireEvent.touchStart(card!, {
        touches: [{ clientX: 100, clientY: 100 }],
      })
      fireEvent.touchMove(card!, {
        touches: [{ clientX: 120, clientY: 100 }],
      })
      fireEvent.touchEnd(card!, {})

      await waitFor(() => {
        expect(card).toHaveStyle('transform: translateX(0)')
      })
    })
  })

  describe('Accessibility Tests', () => {
    it('provides keyboard alternatives for swipe actions', () => {
      render(
        <SwipeableCard
          {...defaultProps}
          actionButtons={
            <>
              <button onClick={mockOnSwipe}>Delete</button>
              <button onClick={mockOnSwipe}>Archive</button>
            </>
          }
        />
      )

      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Archive')).toBeInTheDocument()
    })

    it('announces swipe actions to screen readers', () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      expect(card).toHaveAttribute('role', 'article')
      expect(card).toHaveAttribute('aria-label', expect.stringContaining('swipe'))
    })
  })

  describe('Multi-touch Prevention', () => {
    it('ignores multi-touch gestures', () => {
      render(<SwipeableCard {...defaultProps} />)
      const card = screen.getByText('Test Content').parentElement

      // Multi-touch start
      fireEvent.touchStart(card!, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 },
        ],
      })

      // Should not track gesture
      expect(card).not.toHaveStyle('transform')
    })
  })
})