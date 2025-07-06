import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

describe('Avatar', () => {
  it('renders with default size', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    const avatar = screen.getByRole('img', { hidden: true })
    expect(avatar).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    )
    
    let fallback = screen.getByText('SM')
    expect(fallback).toHaveClass('text-sm')
    
    rerender(
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    )
    
    fallback = screen.getByText('XL')
    expect(fallback).toHaveClass('text-xl')
  })

  it('extracts initials from full name', () => {
    render(
      <Avatar>
        <AvatarFallback>John Doe</AvatarFallback>
      </Avatar>
    )
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('handles single word names', () => {
    render(
      <Avatar>
        <AvatarFallback>Admin</AvatarFallback>
      </Avatar>
    )
    
    expect(screen.getByText('AD')).toBeInTheDocument()
  })

  it('uses semantic colors for fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>Test</AvatarFallback>
      </Avatar>
    )
    
    const fallback = screen.getByText('TE')
    expect(fallback).toHaveClass('bg-bg-brand', 'text-text-inverse')
  })
})