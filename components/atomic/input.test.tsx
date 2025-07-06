import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test input" />)
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello')
    
    expect(handleChange).toHaveBeenCalledTimes(5)
  })

  it('applies error styles when error prop is true', () => {
    render(<Input error placeholder="Error input" />)
    const input = screen.getByPlaceholderText('Error input')
    
    expect(input).toHaveClass('border-border-error')
    expect(input).toHaveClass('text-text-error')
  })

  it('applies success styles when success prop is true', () => {
    render(<Input success placeholder="Success input" />)
    const input = screen.getByPlaceholderText('Success input')
    
    expect(input).toHaveClass('border-border-success')
    expect(input).toHaveClass('text-text-success')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed')
  })

  it('renders different input types correctly', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" />)
    // Password inputs don't have the textbox role
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />)
    const input = screen.getByPlaceholderText('Custom input')
    
    expect(input).toHaveClass('custom-class')
  })

  it('has correct height for touch targets', () => {
    render(<Input placeholder="Touch target" />)
    const input = screen.getByPlaceholderText('Touch target')
    
    expect(input).toHaveClass('h-12') // 48px height
  })

  it('has correct font size to prevent mobile zoom', () => {
    render(<Input placeholder="Mobile optimized" />)
    const input = screen.getByPlaceholderText('Mobile optimized')
    
    expect(input).toHaveClass('text-base') // 16px font size
  })

  it('has proper padding for comfortable interaction', () => {
    render(<Input placeholder="Padded input" />)
    const input = screen.getByPlaceholderText('Padded input')
    
    expect(input).toHaveClass('px-spacing-md') // 16px padding
  })
})