import React from 'react'
import { render } from '@testing-library/react'
import {
  BringToFrontIcon,
  BringForwardIcon,
  SendBackwardIcon,
  SendToBackIcon,
  CopyIcon,
  DuplicateIcon,
  PasteIcon,
  SelectAllIcon,
  GridIcon,
  SnappingIcon
} from './LayeringIcons'

describe('LayeringIcons', () => {
  describe('BringToFrontIcon', () => {
    it('renders with default size', () => {
      const { container } = render(<BringToFrontIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '16')
      expect(svg).toHaveAttribute('height', '16')
    })

    it('renders with custom size', () => {
      const { container } = render(<BringToFrontIcon size={32} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '32')
      expect(svg).toHaveAttribute('height', '32')
    })

    it('applies custom className', () => {
      const { container } = render(<BringToFrontIcon className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })
  })

  describe('BringForwardIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<BringForwardIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
    })
  })

  describe('SendBackwardIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<SendBackwardIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
    })
  })

  describe('SendToBackIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<SendToBackIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
    })
  })

  describe('CopyIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<CopyIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
    })

    it('has correct stroke width', () => {
      const { container } = render(<CopyIcon />)
      const rects = container.querySelectorAll('rect')
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('stroke-width', '1.5')
      })
    })
  })

  describe('DuplicateIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<DuplicateIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
    })

    it('has correct stroke width', () => {
      const { container } = render(<DuplicateIcon />)
      const rects = container.querySelectorAll('rect')
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('stroke-width', '1.5')
      })
    })
  })

  describe('PasteIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<PasteIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(2)
      expect(svg?.querySelectorAll('path')).toHaveLength(1)
    })

    it('has correct stroke width', () => {
      const { container } = render(<PasteIcon />)
      const rects = container.querySelectorAll('rect')
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('stroke-width', '1.5')
      })
    })
  })

  describe('SelectAllIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<SelectAllIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('rect')).toHaveLength(5) // 1 dashed border + 4 filled squares
    })

    it('has dashed border', () => {
      const { container } = render(<SelectAllIcon />)
      const dashedRect = container.querySelector('rect[stroke-dasharray]')
      expect(dashedRect).toHaveAttribute('stroke-dasharray', '2 2')
    })
  })

  describe('GridIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<GridIcon />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg?.querySelectorAll('line')).toHaveLength(8) // 4 horizontal + 4 vertical
    })

    it('has correct stroke width', () => {
      const { container } = render(<GridIcon />)
      const lines = container.querySelectorAll('line')
      lines.forEach(line => {
        expect(line).toHaveAttribute('stroke-width', '1')
      })
    })
  })

  describe('SnappingIcon', () => {
    it('renders with enabled state', () => {
      const { container } = render(<SnappingIcon enabled={true} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      const rects = container.querySelectorAll('rect')
      expect(rects).toHaveLength(4)
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('fill', '#3B82F6')
      })
    })

    it('renders with disabled state', () => {
      const { container } = render(<SnappingIcon enabled={false} />)
      const rects = container.querySelectorAll('rect')
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('fill', '#D1D5DB')
      })
    })

    it('defaults to enabled', () => {
      const { container } = render(<SnappingIcon />)
      const rects = container.querySelectorAll('rect')
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('fill', '#3B82F6')
      })
    })
  })

  it('all icons have viewBox attribute', () => {
    const icons = [
      <BringToFrontIcon key="1" />,
      <BringForwardIcon key="2" />,
      <SendBackwardIcon key="3" />,
      <SendToBackIcon key="4" />,
      <CopyIcon key="5" />,
      <DuplicateIcon key="6" />,
      <PasteIcon key="7" />,
      <SelectAllIcon key="8" />,
      <GridIcon key="9" />,
      <SnappingIcon key="10" />
    ]

    icons.forEach((icon) => {
      const { container } = render(icon)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16')
    })
  })
})