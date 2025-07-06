import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox, CheckboxWithLabel, AnimatedCheckbox } from './checkbox'

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('can be checked', () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    const checkbox = screen.getByRole('checkbox')
    
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('supports indeterminate state', () => {
    render(<Checkbox indeterminate />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
  })

  it('can be disabled', () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('has minimum size of 24px', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-6', 'w-6')
  })

  it('has generous click target', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('before:absolute', 'before:-inset-2.5')
  })
})

describe('CheckboxWithLabel', () => {
  it('renders with label', () => {
    render(<CheckboxWithLabel label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<CheckboxWithLabel label="Accept terms" description="Please read carefully" />)
    expect(screen.getByText('Please read carefully')).toBeInTheDocument()
  })

  it('clicking label toggles checkbox', () => {
    const handleChange = jest.fn()
    render(<CheckboxWithLabel label="Accept terms" onCheckedChange={handleChange} />)
    
    const label = screen.getByText('Accept terms')
    fireEvent.click(label)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })
})

describe('AnimatedCheckbox', () => {
  it('supports size variants', () => {
    const { rerender } = render(<AnimatedCheckbox size="small" />)
    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-5', 'w-5')
    
    rerender(<AnimatedCheckbox size="large" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('h-8', 'w-8')
  })

  it('supports style variants', () => {
    const { rerender } = render(<AnimatedCheckbox variant="brand" />)
    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('border-border-brand')
    
    rerender(<AnimatedCheckbox variant="success" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('border-border-success')
    
    rerender(<AnimatedCheckbox variant="error" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('border-border-error')
  })
})