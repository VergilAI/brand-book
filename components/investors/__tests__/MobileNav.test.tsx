import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from '../MobileNav'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/investors',
}))

describe('MobileNav', () => {
  const mockViewportSizes = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  }

  beforeEach(() => {
    // Reset viewport to mobile
    window.innerWidth = mockViewportSizes.mobile.width
    window.innerHeight = mockViewportSizes.mobile.height
  })

  describe('Mobile Viewport Tests', () => {
    it('renders hamburger menu on mobile', () => {
      render(<MobileNav />)
      const menuButton = screen.getByLabelText('Open menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('opens menu on hamburger click', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      const menuButton = screen.getByLabelText('Open menu')
      await user.click(menuButton)
      
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Financials')).toBeInTheDocument()
        expect(screen.getByText('Reports')).toBeInTheDocument()
      })
    })

    it('closes menu on item click', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      // Open menu
      const menuButton = screen.getByLabelText('Open menu')
      await user.click(menuButton)
      
      // Click menu item
      const dashboardLink = screen.getByText('Dashboard')
      await user.click(dashboardLink)
      
      // Menu should close
      await waitFor(() => {
        expect(screen.queryByText('Financials')).not.toBeInTheDocument()
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      // Tab to menu button
      await user.tab()
      expect(screen.getByLabelText('Open menu')).toHaveFocus()
      
      // Open with Enter
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
      
      // Navigate through items
      await user.tab()
      expect(screen.getByText('Dashboard')).toHaveFocus()
    })

    it('applies correct mobile styles', () => {
      render(<MobileNav />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('md:hidden')
    })
  })

  describe('Tablet Viewport Tests', () => {
    beforeEach(() => {
      window.innerWidth = mockViewportSizes.tablet.width
      window.innerHeight = mockViewportSizes.tablet.height
    })

    it('still shows mobile menu on tablet', () => {
      render(<MobileNav />)
      const menuButton = screen.getByLabelText('Open menu')
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Touch Gesture Tests', () => {
    it('handles touch events properly', async () => {
      render(<MobileNav />)
      const menuButton = screen.getByLabelText('Open menu')
      
      // Simulate touch
      fireEvent.touchStart(menuButton)
      fireEvent.touchEnd(menuButton)
      
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Tests', () => {
    it('has correct ARIA attributes', () => {
      render(<MobileNav />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Mobile navigation')
    })

    it('announces menu state changes', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      const menuButton = screen.getByLabelText('Open menu')
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      
      await user.click(menuButton)
      
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true')
        expect(menuButton).toHaveAttribute('aria-label', 'Close menu')
      })
    })

    it('traps focus when menu is open', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      // Open menu
      await user.click(screen.getByLabelText('Open menu'))
      
      // Tab through all items
      await user.tab() // Dashboard
      await user.tab() // Financials
      await user.tab() // Reports
      await user.tab() // Settings
      await user.tab() // Should wrap to close button
      
      expect(screen.getByLabelText('Close menu')).toHaveFocus()
    })
  })

  describe('Performance Tests', () => {
    it('renders quickly on mobile devices', () => {
      const startTime = performance.now()
      render(<MobileNav />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should render in less than 100ms
    })

    it('uses lazy loading for menu content', async () => {
      const user = userEvent.setup()
      render(<MobileNav />)
      
      // Menu items shouldn't be in DOM until opened
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      
      await user.click(screen.getByLabelText('Open menu'))
      
      // Now they should be loaded
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
    })
  })
})