/**
 * Chat History Storage Management
 * Handles local and server-side persistence of chat conversations
 */

import { ChatMessage } from './use-chat'

export interface ChatSession {
  id: string
  title: string
  lessonId?: string
  lessonTopic?: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    totalMessages: number
    userMessages: number
    assistantMessages: number
    context?: string
  }
}

export interface ChatStorageOptions {
  maxSessions?: number // Maximum number of sessions to store
  maxMessagesPerSession?: number // Maximum messages to keep per session
  autoSave?: boolean // Auto-save on each message
  storageKey?: string // LocalStorage key prefix
}

const DEFAULT_OPTIONS: ChatStorageOptions = {
  maxSessions: 50,
  maxMessagesPerSession: 100,
  autoSave: true,
  storageKey: 'lms_chat_sessions'
}

export class ChatStorage {
  private options: ChatStorageOptions
  private currentSessionId: string | null = null

  constructor(options: ChatStorageOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Initialize a new chat session
   */
  createSession(title: string, lessonId?: string, lessonTopic?: string): ChatSession {
    const session: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      lessonId,
      lessonTopic,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        totalMessages: 0,
        userMessages: 0,
        assistantMessages: 0
      }
    }

    this.currentSessionId = session.id
    this.saveSession(session)
    return session
  }

  /**
   * Get all stored sessions
   */
  getAllSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.options.storageKey || DEFAULT_OPTIONS.storageKey!)
      if (!stored) return []

      const sessions: ChatSession[] = JSON.parse(stored)
      // Convert date strings back to Date objects
      return sessions.map(session => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      return []
    }
  }

  /**
   * Get a specific session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    const sessions = this.getAllSessions()
    return sessions.find(s => s.id === sessionId) || null
  }

  /**
   * Get the current active session
   */
  getCurrentSession(): ChatSession | null {
    if (!this.currentSessionId) return null
    return this.getSession(this.currentSessionId)
  }

  /**
   * Save or update a session
   */
  saveSession(session: ChatSession): void {
    try {
      const sessions = this.getAllSessions()
      const existingIndex = sessions.findIndex(s => s.id === session.id)

      // Update metadata
      session.metadata = {
        totalMessages: session.messages.length,
        userMessages: session.messages.filter(m => m.role === 'user').length,
        assistantMessages: session.messages.filter(m => m.role === 'assistant').length,
        context: session.metadata?.context
      }

      // Update timestamp
      session.updatedAt = new Date()

      // Limit messages per session
      const maxMessages = this.options.maxMessagesPerSession || DEFAULT_OPTIONS.maxMessagesPerSession!
      if (session.messages.length > maxMessages) {
        session.messages = session.messages.slice(-maxMessages)
      }

      if (existingIndex >= 0) {
        sessions[existingIndex] = session
      } else {
        sessions.unshift(session) // Add new sessions to the beginning
      }

      // Limit total number of sessions
      const maxSessions = this.options.maxSessions || DEFAULT_OPTIONS.maxSessions!
      if (sessions.length > maxSessions) {
        sessions.splice(maxSessions)
      }

      localStorage.setItem(this.options.storageKey || DEFAULT_OPTIONS.storageKey!, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving chat session:', error)
    }
  }

  /**
   * Add a message to the current session
   */
  addMessage(message: ChatMessage): void {
    if (!this.currentSessionId) {
      console.warn('No active session. Creating a new one.')
      this.createSession('New Chat')
    }

    const session = this.getCurrentSession()
    if (session) {
      session.messages.push(message)
      if (this.options.autoSave) {
        this.saveSession(session)
      }
    }
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    try {
      const sessions = this.getAllSessions()
      const filteredSessions = sessions.filter(s => s.id !== sessionId)
      
      if (sessions.length !== filteredSessions.length) {
        localStorage.setItem(this.options.storageKey || DEFAULT_OPTIONS.storageKey!, JSON.stringify(filteredSessions))
        
        // Clear current session if it was deleted
        if (this.currentSessionId === sessionId) {
          this.currentSessionId = null
        }
        
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting session:', error)
      return false
    }
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    localStorage.removeItem(this.options.storageKey || DEFAULT_OPTIONS.storageKey!)
    this.currentSessionId = null
  }

  /**
   * Export sessions as JSON
   */
  exportSessions(): string {
    const sessions = this.getAllSessions()
    return JSON.stringify(sessions, null, 2)
  }

  /**
   * Import sessions from JSON
   */
  importSessions(jsonData: string): boolean {
    try {
      const sessions = JSON.parse(jsonData)
      if (!Array.isArray(sessions)) {
        throw new Error('Invalid session data format')
      }

      localStorage.setItem(this.options.storageKey || DEFAULT_OPTIONS.storageKey!, JSON.stringify(sessions))
      return true
    } catch (error) {
      console.error('Error importing sessions:', error)
      return false
    }
  }

  /**
   * Get session summary for display
   */
  getSessionSummary(sessionId: string): {
    title: string
    messageCount: number
    lastMessage: string
    duration: string
  } | null {
    const session = this.getSession(sessionId)
    if (!session || session.messages.length === 0) return null

    const lastMessage = session.messages[session.messages.length - 1]
    const duration = this.formatDuration(
      new Date(lastMessage.timestamp).getTime() - session.createdAt.getTime()
    )

    return {
      title: session.title,
      messageCount: session.messages.length,
      lastMessage: this.truncateMessage(lastMessage.content),
      duration
    }
  }

  /**
   * Search sessions by content
   */
  searchSessions(query: string): ChatSession[] {
    const sessions = this.getAllSessions()
    const lowerQuery = query.toLowerCase()

    return sessions.filter(session => 
      session.title.toLowerCase().includes(lowerQuery) ||
      session.lessonTopic?.toLowerCase().includes(lowerQuery) ||
      session.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      )
    )
  }

  /**
   * Set the current active session
   */
  setCurrentSession(sessionId: string): boolean {
    const session = this.getSession(sessionId)
    if (session) {
      this.currentSessionId = sessionId
      return true
    }
    return false
  }

  // Helper methods
  private truncateMessage(message: string, maxLength: number = 50): string {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  }
}

// Create a singleton instance
export const chatStorage = new ChatStorage()

// Server-side API functions (to be implemented with actual API endpoints)
export const chatAPI = {
  /**
   * Save session to server
   */
  async saveToServer(session: ChatSession): Promise<boolean> {
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      })
      return response.ok
    } catch (error) {
      console.error('Error saving to server:', error)
      return false
    }
  },

  /**
   * Load sessions from server
   */
  async loadFromServer(userId?: string): Promise<ChatSession[]> {
    try {
      const response = await fetch(`/api/chat/sessions${userId ? `?userId=${userId}` : ''}`)
      if (!response.ok) return []
      
      const data = await response.json()
      return data.sessions || []
    } catch (error) {
      console.error('Error loading from server:', error)
      return []
    }
  },

  /**
   * Delete session from server
   */
  async deleteFromServer(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      return response.ok
    } catch (error) {
      console.error('Error deleting from server:', error)
      return false
    }
  }
}