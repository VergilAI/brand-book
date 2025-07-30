"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LineSettingsContextType {
  lineType: 'straight' | 'elbow' | 'curved';
  setLineType: (type: 'straight' | 'elbow' | 'curved') => void;
  connectionMode: 'smart' | 'manual';
  setConnectionMode: (mode: 'smart' | 'manual') => void;
}

const LineSettingsContext = createContext<LineSettingsContextType | undefined>(undefined)

export function LineSettingsProvider({ children }: { children: ReactNode }) {
  const [lineType, setLineType] = useState<'straight' | 'elbow' | 'curved'>('elbow')
  const [connectionMode, setConnectionMode] = useState<'smart' | 'manual'>('smart')
  
  return (
    <LineSettingsContext.Provider value={{
      lineType,
      setLineType,
      connectionMode,
      setConnectionMode
    }}>
      {children}
    </LineSettingsContext.Provider>
  )
}

export function useLineSettings() {
  const context = useContext(LineSettingsContext)
  if (!context) {
    throw new Error('useLineSettings must be used within LineSettingsProvider')
  }
  return context
}