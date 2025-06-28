import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { ResponsiveTable } from '../ResponsiveTable'

describe('ResponsiveTable', () => {
  const mockData = [
    { id: 1, name: 'Revenue', amount: 50000, date: '2024-01-15' },
    { id: 2, name: 'Expenses', amount: -15000, date: '2024-01-16' },
    { id: 3, name: 'Investment', amount: 100000, date: '2024-01-17' },
  ]

  const mockColumns = [
    { key: 'name', label: 'Transaction' },
    { key: 'amount', label: 'Amount', format: (val: number) => `$${val.toLocaleString()}` },
    { key: 'date', label: 'Date' },
  ]

  describe('Mobile Layout Tests', () => {
    beforeEach(() => {
      window.innerWidth = 375
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
    })

    it('renders as cards on mobile', () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      // Should render card layout
      const cards = screen.getAllByRole('article')
      expect(cards).toHaveLength(3)
      
      // Should not render table
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('displays all data in card format', () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      const firstCard = screen.getAllByRole('article')[0]
      expect(within(firstCard).getByText('Transaction')).toBeInTheDocument()
      expect(within(firstCard).getByText('Revenue')).toBeInTheDocument()
      expect(within(firstCard).getByText('Amount')).toBeInTheDocument()
      expect(within(firstCard).getByText('$50,000')).toBeInTheDocument()
    })

    it('applies mobile-specific styles', () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      const container = screen.getByTestId('responsive-table-mobile')
      expect(container).toHaveClass('space-y-4')
    })
  })

  describe('Desktop Layout Tests', () => {
    beforeEach(() => {
      window.innerWidth = 1920
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: !query.includes('max-width'),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
    })

    it('renders as table on desktop', () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      // Should render table
      expect(screen.getByRole('table')).toBeInTheDocument()
      
      // Should not render cards
      expect(screen.queryAllByRole('article')).toHaveLength(0)
    })

    it('displays correct headers', () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      expect(screen.getByText('Transaction')).toBeInTheDocument()
      expect(screen.getByText('Amount')).toBeInTheDocument()
      expect(screen.getByText('Date')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior Tests', () => {
    it('switches layouts on resize', () => {
      const { rerender } = render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      // Start desktop
      window.innerWidth = 1920
      window.dispatchEvent(new Event('resize'))
      rerender(<ResponsiveTable data={mockData} columns={mockColumns} />)
      expect(screen.getByRole('table')).toBeInTheDocument()
      
      // Resize to mobile
      window.innerWidth = 375
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      window.dispatchEvent(new Event('resize'))
      rerender(<ResponsiveTable data={mockData} columns={mockColumns} />)
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.getAllByRole('article')).toHaveLength(3)
    })
  })

  describe('Accessibility Tests', () => {
    it('has proper table semantics on desktop', () => {
      window.innerWidth = 1920
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      
      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(3)
    })

    it('maintains semantic structure on mobile', () => {
      window.innerWidth = 375
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }))
      
      render(<ResponsiveTable data={mockData} columns={mockColumns} />)
      
      const cards = screen.getAllByRole('article')
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label', expect.stringContaining('Row'))
      })
    })
  })

  describe('Performance Tests', () => {
    it('handles large datasets efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        amount: Math.random() * 10000,
        date: new Date().toISOString(),
      }))
      
      const startTime = performance.now()
      render(<ResponsiveTable data={largeData} columns={mockColumns} />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(200) // Should render in less than 200ms
    })
  })
})