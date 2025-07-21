'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type ContextWindowState = 'closed' | 'compact' | 'expanded'

interface ContextWindowContextValue {
  state: ContextWindowState
  setState: (state: ContextWindowState) => void
  toggle: () => void
  expand: () => void
  compact: () => void
  close: () => void
  // Legacy support
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ContextWindowContext = createContext<ContextWindowContextValue | null>(null)

export function useContextWindow() {
  const context = useContext(ContextWindowContext)
  if (!context) {
    throw new Error('useContextWindow must be used within a ContextWindowProvider')
  }
  return context
}

interface ContextWindowProviderProps {
  children: React.ReactNode
  defaultState?: ContextWindowState
  defaultOpen?: boolean // Legacy support
  onStateChange?: (state: ContextWindowState) => void
  onOpenChange?: (open: boolean) => void // Legacy support
}

export function ContextWindowProvider({
  children,
  defaultState = 'closed',
  defaultOpen = false,
  onStateChange,
  onOpenChange,
}: ContextWindowProviderProps) {
  // Initialize with defaultOpen for legacy support
  const [state, setStateInternal] = useState<ContextWindowState>(
    defaultOpen ? 'compact' : defaultState
  )

  const setState = (newState: ContextWindowState) => {
    setStateInternal(newState)
    onStateChange?.(newState)
    // Legacy support
    onOpenChange?.(newState !== 'closed')
  }

  const toggle = () => {
    setState(state === 'closed' ? 'compact' : 'closed')
  }

  const expand = () => setState('expanded')
  const compact = () => setState('compact')
  const close = () => setState('closed')

  // Legacy support
  const isOpen = state !== 'closed'
  const setIsOpen = (open: boolean) => {
    setState(open ? 'compact' : 'closed')
  }

  // Keyboard shortcut support (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
      // ESC to close expanded view
      if (e.key === 'Escape' && state === 'expanded') {
        e.preventDefault()
        compact()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state])

  return (
    <ContextWindowContext.Provider value={{ 
      state, 
      setState, 
      toggle, 
      expand, 
      compact, 
      close,
      isOpen, 
      setIsOpen 
    }}>
      {children}
    </ContextWindowContext.Provider>
  )
}