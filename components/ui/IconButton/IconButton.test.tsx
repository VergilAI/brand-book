import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'
import { Bold } from 'lucide-react'

describe('IconButton', () => {
  it('renders with icon', () => {
    render(<IconButton icon={<Bold />} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with left subscript', () => {
    render(<IconButton icon={<Bold />} leftSubscript="B" />)
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByLabelText('Keyboard shortcut: B')).toBeInTheDocument()
  })

  it('renders with right subscript', () => {
    render(<IconButton icon={<Bold />} rightSubscript="1" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByLabelText('Numeric shortcut: 1')).toBeInTheDocument()
  })

  it('renders with both subscripts', () => {
    render(<IconButton icon={<Bold />} leftSubscript="B" rightSubscript="1" />)
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('applies active state classes', () => {
    const { rerender } = render(<IconButton icon={<Bold />} active={false} />)
    const button = screen.getByRole('button')
    
    expect(button).not.toHaveClass('bg-accent')
    
    rerender(<IconButton icon={<Bold />} active={true} />)
    expect(button).toHaveClass('bg-accent')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<IconButton icon={<Bold />} onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<IconButton icon={<Bold />} disabled onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders different variants', () => {
    const { rerender } = render(<IconButton icon={<Bold />} variant="default" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('border-border')
    
    rerender(<IconButton icon={<Bold />} variant="ghost" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent')
    
    rerender(<IconButton icon={<Bold />} variant="solid" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
    
    rerender(<IconButton icon={<Bold />} variant="outline" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border-2')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<IconButton icon={<Bold />} size="sm" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('size-8')
    
    rerender(<IconButton icon={<Bold />} size="md" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('size-10')
    
    rerender(<IconButton icon={<Bold />} size="lg" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('size-12')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<IconButton icon={<Bold />} ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('passes through additional props', () => {
    render(
      <IconButton 
        icon={<Bold />} 
        data-testid="custom-icon-button"
        aria-label="Bold text"
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-testid', 'custom-icon-button')
    expect(button).toHaveAttribute('aria-label', 'Bold text')
  })
})