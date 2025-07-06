import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('applies htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    const label = screen.getByText('Test Label').closest('label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('shows required asterisk when required', () => {
    render(<Label required>Required Field</Label>)
    expect(screen.getByLabelText('required')).toBeInTheDocument()
    expect(screen.getByLabelText('required')).toHaveTextContent('*')
  })

  it('does not show asterisk when not required', () => {
    render(<Label>Optional Field</Label>)
    expect(screen.queryByLabelText('required')).not.toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    render(<Label error="This field has an error">Error Field</Label>)
    expect(screen.getByRole('alert')).toHaveTextContent('This field has an error')
  })

  it('applies error variant when error is provided', () => {
    render(<Label error="Error message">Error Field</Label>)
    const label = screen.getByText('Error Field').closest('label')
    expect(label).toHaveClass('text-error')
  })

  it('displays help text when provided', () => {
    render(<Label helpText="This is helpful information">Help Field</Label>)
    expect(screen.getByText('This is helpful information')).toBeInTheDocument()
  })

  it('does not display help text when error is present', () => {
    render(
      <Label error="Error message" helpText="This should not show">
        Field with Error
      </Label>
    )
    expect(screen.queryByText('This should not show')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Label size="sm">Small Label</Label>)
    let label = screen.getByText('Small Label').closest('label')
    expect(label).toHaveClass('text-sm')

    rerender(<Label size="md">Medium Label</Label>)
    label = screen.getByText('Medium Label').closest('label')
    expect(label).toHaveClass('text-base')

    rerender(<Label size="lg">Large Label</Label>)
    label = screen.getByText('Large Label').closest('label')
    expect(label).toHaveClass('text-lg')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Label variant="error">Error Label</Label>)
    let label = screen.getByText('Error Label').closest('label')
    expect(label).toHaveClass('text-error')

    rerender(<Label variant="success">Success Label</Label>)
    label = screen.getByText('Success Label').closest('label')
    expect(label).toHaveClass('text-success')

    rerender(<Label variant="warning">Warning Label</Label>)
    label = screen.getByText('Warning Label').closest('label')
    expect(label).toHaveClass('text-warning')

    rerender(<Label variant="info">Info Label</Label>)
    label = screen.getByText('Info Label').closest('label')
    expect(label).toHaveClass('text-info')
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>)
    const label = screen.getByText('Custom Label').closest('label')
    expect(label).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Ref Label</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('applies proper spacing classes', () => {
    render(<Label>Spaced Label</Label>)
    const label = screen.getByText('Spaced Label').closest('label')
    expect(label).toHaveClass('mb-spacing-xs')
  })

  it('has proper accessibility attributes', () => {
    render(
      <Label htmlFor="test" required error="Error message">
        Accessible Label
      </Label>
    )
    
    const label = screen.getByText('Accessible Label').closest('label')
    expect(label).toHaveAttribute('for', 'test')
    
    const asterisk = screen.getByLabelText('required')
    expect(asterisk).toBeInTheDocument()
    
    const error = screen.getByRole('alert')
    expect(error).toHaveTextContent('Error message')
  })
})