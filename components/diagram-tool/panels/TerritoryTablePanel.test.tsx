import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TerritoryTablePanel } from './TerritoryTablePanel'
import { useMapEditor } from '@/app/map-editor/hooks/useMapEditor'

// Mock the useMapEditor hook
jest.mock('../../hooks/useMapEditor')

const mockStore = {
  map: {
    territories: {
      'territory-1': {
        id: 'territory-1',
        name: 'Alaska',
        continent: 'North America',
        center: { x: 100, y: 200 },
        fillPath: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
        borderSegments: ['border-1', 'border-2']
      },
      'territory-2': {
        id: 'territory-2',
        name: 'Alberta',
        continent: 'North America',
        center: { x: 150, y: 250 },
        fillPath: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
        borderSegments: ['border-2', 'border-3', 'border-4']
      }
    },
    borders: {
      'border-1': {
        id: 'border-1',
        path: 'M 0 0 L 100 0',
        territories: ['territory-1', 'territory-3'],
        type: 'land',
        points: []
      },
      'border-2': {
        id: 'border-2',
        path: 'M 100 0 L 100 100',
        territories: ['territory-1', 'territory-2'],
        type: 'land',
        points: []
      },
      'border-3': {
        id: 'border-3',
        path: 'M 100 100 L 0 100',
        territories: ['territory-2', 'territory-4'],
        type: 'land',
        points: []
      },
      'border-4': {
        id: 'border-4',
        path: 'M 0 100 L 0 0',
        territories: ['territory-2', 'territory-5'],
        type: 'land',
        points: []
      }
    },
    continents: {
      'north-america': {
        id: 'north-america',
        name: 'North America',
        territories: ['territory-1', 'territory-2'],
        bonus: 5,
        color: '#22c55e'
      }
    }
  },
  selection: {
    territories: new Set(['territory-1'])
  },
  selectTerritory: jest.fn(),
  clearSelection: jest.fn(),
  setPan: jest.fn()
}

describe('TerritoryTablePanel', () => {
  beforeEach(() => {
    ;(useMapEditor as jest.Mock).mockReturnValue(mockStore)
  })

  it('renders correctly when open', () => {
    render(<TerritoryTablePanel isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Territory Overview')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(<TerritoryTablePanel isOpen={false} onClose={() => {}} />)
    const panel = container.querySelector('[class*="translate-y-full"]')
    expect(panel).toBeInTheDocument()
  })

  it('shows territory data in table', () => {
    render(<TerritoryTablePanel isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Alaska')).toBeInTheDocument()
    expect(screen.getByText('Alberta')).toBeInTheDocument()
  })

  it('calculates border counts correctly', () => {
    render(<TerritoryTablePanel isOpen={true} onClose={() => {}} />)
    // Alaska has 2 borders, Alberta has 3 borders
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('2') // Alaska border count
    expect(rows[2]).toHaveTextContent('3') // Alberta border count
  })

  it('switches between territories and continents tabs', () => {
    render(<TerritoryTablePanel isOpen={true} onClose={() => {}} />)
    
    const continentsTab = screen.getByText(/Continents/)
    fireEvent.click(continentsTab)
    
    expect(screen.getByText('North America')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // bonus value
  })

  it('calls onClose when X button is clicked', () => {
    const onClose = jest.fn()
    render(<TerritoryTablePanel isOpen={true} onClose={onClose} />)
    
    const closeButton = screen.getByTitle('Close (Esc)')
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('selects territory and pans to it when row is clicked', () => {
    render(<TerritoryTablePanel isOpen={true} onClose={() => {}} />)
    
    const alaskaRow = screen.getByText('Alaska').closest('tr')
    fireEvent.click(alaskaRow!)
    
    expect(mockStore.selectTerritory).toHaveBeenCalledWith('territory-1', false)
    expect(mockStore.setPan).toHaveBeenCalledWith({
      x: -400, // 100 - 500
      y: -100  // 200 - 300
    })
  })
})