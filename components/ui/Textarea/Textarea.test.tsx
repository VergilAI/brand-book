import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Textarea size="sm" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[80px]')

    rerender(<Textarea size="md" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[120px]')

    rerender(<Textarea size="lg" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[160px]')
  })

  it('applies error state correctly', () => {
    render(<Textarea error placeholder="Error textarea" />)
    const textarea = screen.getByPlaceholderText('Error textarea')
    expect(textarea).toHaveClass('border-border-error')
  })

  it('applies success state correctly', () => {
    render(<Textarea success placeholder="Success textarea" />)
    const textarea = screen.getByPlaceholderText('Success textarea')
    expect(textarea).toHaveClass('border-border-success')
  })

  it('handles disabled state', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)
    const textarea = screen.getByPlaceholderText('Disabled textarea')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:bg-bg-disabled')
  })

  it('handles controlled value', async () => {
    const handleChange = jest.fn()
    render(
      <Textarea 
        value="controlled value" 
        onChange={handleChange}
        placeholder="Controlled"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Controlled')
    expect(textarea).toHaveValue('controlled value')
    
    await userEvent.type(textarea, 'new text')
    expect(handleChange).toHaveBeenCalled()
  })

  it('handles uncontrolled value', async () => {
    render(<Textarea defaultValue="initial value" placeholder="Uncontrolled" />)
    
    const textarea = screen.getByPlaceholderText('Uncontrolled')
    expect(textarea).toHaveValue('initial value')
    
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'new value')
    expect(textarea).toHaveValue('new value')
  })

  it('shows character count when enabled', () => {
    render(
      <Textarea 
        showCount 
        defaultValue="Hello" 
        placeholder="With count"
      />
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows character count with limit', () => {
    render(
      <Textarea 
        showCount 
        maxCount={10}
        defaultValue="Hello" 
        placeholder="With limit"
      />
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('prevents input beyond maxCount', async () => {
    render(
      <Textarea 
        maxCount={5}
        defaultValue=""
        placeholder="Limited"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Limited')
    await userEvent.type(textarea, 'Hello World')
    
    expect(textarea).toHaveValue('Hello')
  })

  it('auto-resizes when enabled', () => {
    const { rerender } = render(
      <Textarea 
        autoResize
        defaultValue="Short text"
        placeholder="Auto resize"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Auto resize')
    const initialHeight = textarea.style.height
    
    rerender(
      <Textarea 
        autoResize
        value="Much longer text that should cause the textarea to grow in height"
        placeholder="Auto resize"
      />
    )
    
    expect(textarea.style.height).not.toBe(initialHeight)
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} placeholder="With ref" />)
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current?.placeholder).toBe('With ref')
  })

  it('applies custom className', () => {
    render(
      <Textarea 
        className="custom-class" 
        placeholder="Custom class"
      />
    )
    
    expect(screen.getByPlaceholderText('Custom class')).toHaveClass('custom-class')
  })

  it('passes through native textarea props', () => {
    render(
      <Textarea 
        rows={10}
        cols={50}
        name="description"
        id="desc"
        placeholder="Native props"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Native props')
    expect(textarea).toHaveAttribute('rows', '10')
    expect(textarea).toHaveAttribute('cols', '50')
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveAttribute('id', 'desc')
  })
})