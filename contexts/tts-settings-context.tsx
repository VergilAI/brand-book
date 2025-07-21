'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TTSSettings {
  autoTTS: boolean
  voiceName: string
  playbackSpeed: number
  volume: number
}

interface TTSSettingsContextType {
  settings: TTSSettings
  updateSettings: (updates: Partial<TTSSettings>) => void
  availableVoices: string[]
}

const defaultSettings: TTSSettings = {
  autoTTS: true,
  voiceName: 'Rachel',
  playbackSpeed: 1.0,
  volume: 1.0
}

const availableVoices = ['Rachel', 'Emily', 'Sarah', 'John', 'Michael']

const TTSSettingsContext = createContext<TTSSettingsContextType | undefined>(undefined)

export function TTSSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TTSSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tts-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse TTS settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tts-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates: Partial<TTSSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  return (
    <TTSSettingsContext.Provider value={{ settings, updateSettings, availableVoices }}>
      {children}
    </TTSSettingsContext.Provider>
  )
}

export function useTTSSettings() {
  const context = useContext(TTSSettingsContext)
  if (!context) {
    throw new Error('useTTSSettings must be used within a TTSSettingsProvider')
  }
  return context
}