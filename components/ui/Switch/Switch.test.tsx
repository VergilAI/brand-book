import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders without crashing', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('toggles state when clicked', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute('data-state', 'checked')
    
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('respects defaultChecked prop', () => {
    render(<Switch defaultChecked />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  it('respects disabled prop', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
    expect(switchElement).toHaveAttribute('data-disabled')
  })

  it('does not toggle when disabled', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Switch size="sm" />)
    let switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('h-5', 'w-9')
    
    rerender(<Switch size="md" />)
    switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('h-6', 'w-11')
    
    rerender(<Switch size="lg" />)
    switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('h-7', 'w-14')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Switch ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('supports custom className', () => {
    render(<Switch className="custom-class" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-class')
  })

  it('maintains accessibility attributes', () => {
    render(<Switch aria-label="Toggle feature" />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle feature')
  })

  it('supports controlled state', () => {
    const handleChange = jest.fn()
    const { rerender } = render(<Switch checked={false} onCheckedChange={handleChange} />)
    const switchElement = screen.getByRole('switch')
    
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledWith(true)
    
    rerender(<Switch checked={true} onCheckedChange={handleChange} />)
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })
})