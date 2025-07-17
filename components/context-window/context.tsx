'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ContextWindowContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
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
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ContextWindowProvider({
  children,
  defaultOpen = false,
  onOpenChange,
}: ContextWindowProviderProps) {
  const [isOpen, setIsOpenState] = useState(defaultOpen)

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open)
    onOpenChange?.(open)
  }

  const toggle = () => setIsOpen(!isOpen)

  // Keyboard shortcut support (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <ContextWindowContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </ContextWindowContext.Provider>
  )
}