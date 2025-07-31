import { useState, useCallback, useRef } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isPlaying?: boolean
}

export interface UseChatOptions {
  context?: 'default' | 'lesson' | 'practice'
  lessonTopic?: string
  maxTokens?: number
  onError?: (error: string) => void
  onRateLimit?: (retryAfter: number) => void
}

export interface ChatResponse {
  response: string
  messageId: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Abort controller for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Send a message to the chat API
  const sendMessage = useCallback(async (content: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Clear previous error
    setError(null)
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    try {
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      
      // Prepare request body
      const requestBody = {
        message: content,
        chatHistory: messages.slice(-10), // Last 10 messages for context
        context: options.context || 'default',
        lessonTopic: options.lessonTopic,
        maxTokens: options.maxTokens
      }
      
      // Make API request
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      })
      
      // Parse response
      const data = await response.json()
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = data.retryAfter || 60
        setError(data.error || 'Rate limit exceeded. Please wait before sending more messages.')
        
        if (options.onRateLimit) {
          options.onRateLimit(retryAfter)
        }
        
        return null
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to get response from AI'
        setError(errorMessage)
        
        if (options.onError) {
          options.onError(errorMessage)
        }
        
        return null
      }
      
      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: data.messageId,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isPlaying: false
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      return data as ChatResponse
      
    } catch (err) {
      // Handle network errors or aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't show error
        return null
      }
      
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      if (options.onError) {
        options.onError(errorMessage)
      }
      
      return null
      
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages, options])
  
  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])
  
  // Add a system message
  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      role: 'system',
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, systemMessage])
  }, [])
  
  // Update message playing state (for TTS)
  const updateMessagePlayingState = useCallback((messageId: string, isPlaying: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying } : msg
    ))
  }, [])
  
  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    addSystemMessage,
    updateMessagePlayingState,
    cancelRequest
  }
}