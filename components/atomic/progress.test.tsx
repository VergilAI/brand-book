import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from './progress'

describe('Progress', () => {
  it('renders with default props', () => {
    render(<Progress value={50} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders with label', () => {
    render(<Progress value={75} label="Upload Progress" />)
    expect(screen.getByText('Upload Progress')).toBeInTheDocument()
  })

  it('renders with percentage', () => {
    render(<Progress value={33} showPercentage />)
    expect(screen.getByText('33%')).toBeInTheDocument()
  })

  it('renders with label and percentage', () => {
    render(<Progress value={66} label="Course Completion" showPercentage />)
    expect(screen.getByText('Course Completion')).toBeInTheDocument()
    expect(screen.getByText('66%')).toBeInTheDocument()
  })

  it('clamps values to 0-100 range', () => {
    const { rerender } = render(<Progress value={150} showPercentage />)
    expect(screen.getByText('100%')).toBeInTheDocument()

    rerender(<Progress value={-50} showPercentage />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('calculates percentage correctly with custom max', () => {
    render(<Progress value={50} max={200} showPercentage />)
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<Progress value={50} variant="success" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('bg-success/20')

    rerender(<Progress value={50} variant="warning" />)
    expect(progressBar).toHaveClass('bg-warning/20')

    rerender(<Progress value={50} variant="error" />)
    expect(progressBar).toHaveClass('bg-error/20')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<Progress value={50} size="sm" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('h-2')

    rerender(<Progress value={50} size="md" />)
    expect(progressBar).toHaveClass('h-3')

    rerender(<Progress value={50} size="lg" />)
    expect(progressBar).toHaveClass('h-4')
  })

  it('applies custom className', () => {
    render(<Progress value={50} className="custom-class" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('custom-class')
  })

  it('applies custom indicatorClassName', () => {
    render(<Progress value={50} indicatorClassName="custom-indicator" />)
    const indicator = screen.getByRole('progressbar').firstChild
    expect(indicator).toHaveClass('custom-indicator')
  })

  it('sets correct aria attributes', () => {
    render(<Progress value={75} label="Test Progress" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-label', 'Test Progress')
    expect(progressBar).toHaveAttribute('aria-valuetext', '75%')
  })

  it('applies correct text color for percentage based on variant', () => {
    const { rerender } = render(<Progress value={50} variant="success" showPercentage />)
    expect(screen.getByText('50%')).toHaveClass('text-success')

    rerender(<Progress value={50} variant="warning" showPercentage />)
    expect(screen.getByText('50%')).toHaveClass('text-warning')

    rerender(<Progress value={50} variant="error" showPercentage />)
    expect(screen.getByText('50%')).toHaveClass('text-error')

    rerender(<Progress value={50} showPercentage />)
    expect(screen.getByText('50%')).toHaveClass('text-primary')
  })
})