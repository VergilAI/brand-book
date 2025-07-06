import { render, screen } from '@testing-library/react'
import { Badge, badgeVariants } from './badge'

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-bg-secondary', 'text-text-primary')
  })

  it('renders with success variant', () => {
    render(<Badge variant="success">Success Badge</Badge>)
    const badge = screen.getByText('Success Badge')
    expect(badge).toHaveClass('bg-bg-successLight', 'text-text-success')
  })

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Warning Badge</Badge>)
    const badge = screen.getByText('Warning Badge')
    expect(badge).toHaveClass('bg-bg-warningLight', 'text-text-warning')
  })

  it('renders with error variant', () => {
    render(<Badge variant="error">Error Badge</Badge>)
    const badge = screen.getByText('Error Badge')
    expect(badge).toHaveClass('bg-bg-errorLight', 'text-text-error')
  })

  it('renders with info variant', () => {
    render(<Badge variant="info">Info Badge</Badge>)
    const badge = screen.getByText('Info Badge')
    expect(badge).toHaveClass('bg-bg-infoLight', 'text-text-info')
  })

  it('renders with brand variant', () => {
    render(<Badge variant="brand">Brand Badge</Badge>)
    const badge = screen.getByText('Brand Badge')
    expect(badge).toHaveClass('bg-bg-brandLight', 'text-text-brand')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-class')
  })

  it('has proper padding and typography', () => {
    render(<Badge>Styled Badge</Badge>)
    const badge = screen.getByText('Styled Badge')
    expect(badge).toHaveClass('px-spacing-sm', 'py-spacing-xs', 'text-sm')
  })

  it('has proper visual weight with shadow', () => {
    render(<Badge>Visual Badge</Badge>)
    const badge = screen.getByText('Visual Badge')
    expect(badge).toHaveClass('shadow-sm')
  })

  it('forwards ref properly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Badge ref={ref}>Ref Badge</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('exports badgeVariants for external use', () => {
    expect(badgeVariants).toBeDefined()
    expect(typeof badgeVariants).toBe('function')
  })
})