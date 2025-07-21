'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  MessageSquare,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  ChevronDown,
  Play,
  Pause,
  SkipForward,
  Settings,
  Download,
  Save,
  Search,
  BookOpen,
  Lightbulb,
  RefreshCw,
  Hash,
  SlidersHorizontal,
  StopCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atomic/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Avatar } from '@/components/atomic/avatar'
import { useTTS } from '@/hooks/use-tts'
import { TTSSettingsProvider, useTTSSettings } from '@/contexts/tts-settings-context'
import { chatStorage } from '@/lib/chat/chat-storage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu'
import { Slider } from '@/components/slider'
import { Switch } from '@/components/atomic/switch'
import { Label } from '@/components/atomic/label'

// Quick action prompts
const quickActions = [
  { id: 'explain', label: 'Explain this differently', prompt: 'Can you explain this concept in a different way?' },
  { id: 'example', label: 'Give me an example', prompt: 'Can you provide a practical example of this?' },
  { id: 'simplify', label: 'Simplify this', prompt: 'Can you simplify this explanation?' },
  { id: 'quiz', label: 'Quiz me on this', prompt: 'Can you create a quiz question about what we just discussed?' }
]

// Create a messages context to isolate updates
const MessagesContext = React.createContext(null)

// Messages provider component
const MessagesProvider = React.memo(({ children, initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages)
  
  const value = React.useMemo(() => ({
    messages,
    setMessages
  }), [messages])
  
  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
})

// Loading indicator component
const LoadingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex justify-start gap-spacing-sm"
  >
    <Avatar className="size-8 flex-shrink-0">
      <div className="size-full bg-bg-brand flex items-center justify-center">
        <MessageSquare className="size-4 text-text-inverse" />
      </div>
    </Avatar>
    
    <div className="bg-bg-secondary rounded-lg p-spacing-md">
      <div className="flex items-center gap-spacing-sm">
        <Loader2 className="size-4 animate-spin text-text-secondary" />
        <span className="text-sm text-text-secondary">AI is thinking...</span>
      </div>
    </div>
  </motion.div>
)

// Render message bubble - Optimized with proper memoization
const MessageBubble = React.memo(({ message, onToggleTTS, renderMessageContent, formatTimestamp }) => {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-spacing-sm', // 8px
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="size-8 flex-shrink-0">
          <div className="size-full bg-bg-brand flex items-center justify-center">
            <MessageSquare className="size-4 text-text-inverse" />
          </div>
        </Avatar>
      )}
      
      <div className={cn(
        'max-w-[70%] space-y-spacing-xs', // 4px
        isUser && 'items-end'
      )}>
        <div className={cn(
          'rounded-lg p-spacing-md', // 16px padding
          'shadow-sm',
          isUser 
            ? 'bg-bg-brand text-text-inverse' // #7B00FF, #F5F5F7
            : 'bg-bg-secondary text-text-primary' // #F5F5F7, #1D1D1F
        )}>
          {renderMessageContent(message)}
        </div>
        
        <div className={cn(
          'flex items-center gap-spacing-sm text-xs text-text-tertiary', // #71717A
          isUser ? 'justify-end' : 'justify-start'
        )}>
          <span>{formatTimestamp(message.timestamp)}</span>
          
          {!isUser && (
            <div className="flex items-center gap-spacing-xs">
              {message.isPlaying && (
                <Badge variant="secondary" className="text-xs">
                  Speaking...
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleTTS(message.id)}
                className="h-6 px-2"
              >
                {message.isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="size-8 flex-shrink-0">
          <div className="size-full bg-bg-emphasis flex items-center justify-center">
            <span className="text-sm font-medium text-text-primary">U</span>
          </div>
        </Avatar>
      )}
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Deep comparison for message properties that matter for rendering
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.isPlaying === nextProps.message.isPlaying &&
    prevProps.message.currentWordIndex === nextProps.message.currentWordIndex
  )
})

// Message list component - isolated to prevent parent re-renders
const MessageList = React.memo(({ 
  messages, 
  isLoading, 
  onToggleTTS,
  renderMessageContent,
  formatTimestamp 
}) => {
  return (
    <AnimatePresence mode="popLayout">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onToggleTTS={onToggleTTS}
          renderMessageContent={renderMessageContent}
          formatTimestamp={formatTimestamp}
        />
      ))}
      
      {isLoading && <LoadingIndicator />}
    </AnimatePresence>
  )
})

// Memoized input component to prevent re-renders - moved outside to prevent recreation
const ChatInput = React.memo(({ onSend, isLoading, placeholder, value, onChange, disabled }) => {
  const inputRef = useRef(null)
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSend(value)
      }
    }
  }
  
  const handleChange = (e) => {
    onChange(e.target.value)
  }
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      type="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      className={cn(
        "w-full h-12 px-4 text-base font-normal leading-[48px]",
        "text-text-primary bg-bg-emphasis-input",
        "border border-border-default rounded-md",
        "transition-all duration-fast ease-out",
        "focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed"
      )}
    />
  )
}, (prevProps, nextProps) => {
  // Optimized comparison
  return prevProps.value === nextProps.value && 
         prevProps.isLoading === nextProps.isLoading &&
         prevProps.placeholder === nextProps.placeholder &&
         prevProps.disabled === nextProps.disabled
})

// Inner component that uses TTS settings
const AIChatbotInner = ({ 
  embedded = false,
  defaultMinimized = false,
  position = 'bottom-right',
  className,
  onClose,
  title = 'AI Learning Assistant',
  subtitle = 'Ask me anything!',
  placeholder = 'Type your message...',
  welcomeMessage = "Hello! I'm your AI learning assistant. How can I help you today?",
  maxHeight = '600px',
  onMessageSent,
  chatContext = 'default',
  lessonTopic = null,
  lessonContent = null,
  sessionId = null
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
      isPlaying: false,
      currentWordIndex: -1
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Wrap setInputValue in useCallback to prevent unnecessary re-renders
  const handleInputChange = useCallback((value) => {
    setInputValue(value)
  }, [])
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [error, setError] = useState(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [ttsQueue, setTtsQueue] = useState([])
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [messageQueue, setMessageQueue] = useState([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const messagesRef = useRef(messages)
  
  // TTS hooks and settings
  const { settings, updateSettings } = useTTSSettings()
  // Single TTS instance for all messages
  const { speak, pause, resume, stop, setPlaybackRate, setVolume, isPlaying, isPaused, error: ttsError } = useTTS()
  
  // Show TTS errors to user
  useEffect(() => {
    if (ttsError && ttsError.includes('usage limit')) {
      setError('Monthly TTS limit reached. Audio playback is temporarily disabled.')
    }
  }, [ttsError])

  // Track if user is at bottom
  const [isAtBottom, setIsAtBottom] = useState(true)
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Keep messagesRef updated
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Only auto-scroll if user is already at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [messages, isAtBottom])

  // Check if user has scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
      setIsAtBottom(isNearBottom)
    }
  }

  // Save chat session
  const saveSession = useCallback(() => {
    if (sessionId) {
      chatStorage.saveSession({
        id: sessionId,
        title: `${lessonTopic || 'General'} - ${new Date().toLocaleDateString()}`,
        messages,
        metadata: {
          lessonTopic,
          context: chatContext,
          lastUpdated: new Date()
        }
      })
    }
  }, [sessionId, messages, lessonTopic, chatContext])

  // Auto-save session
  useEffect(() => {
    const saveTimer = setInterval(() => {
      saveSession()
    }, 30000) // Save every 30 seconds

    return () => clearInterval(saveTimer)
  }, [saveSession])

  // Timestamp formatter
  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }


  // Handle message sending with queueing support
  const handleSendMessage = async (messageText = inputValue.trim()) => {
    if (!messageText) return
    
    // Prevent sending if TTS is playing
    if (currentlyPlayingId) {
      setError('Please stop the current audio playback before sending a new message')
      return
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setError(null)
    
    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent()
    }

    // Add to queue if processing another message
    if (isProcessingQueue) {
      setMessageQueue(prev => [...prev, { userMessage, contextMessage: lessonContent ? `Current lesson topic: ${lessonTopic}\n\n` : '' }])
      return
    }

    // Process the message
    await processMessage(userMessage, lessonContent ? `Current lesson topic: ${lessonTopic}\n\n` : '')
  }

  // Process a single message with streaming
  const processMessage = async (userMessage, contextMessage = '') => {
    setIsProcessingQueue(true)
    setIsLoading(true)
    
    const aiResponseId = Date.now().toString() + '-ai'
    const aiResponse = {
      id: aiResponseId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isPlaying: false,
      currentWordIndex: -1,
      isStreaming: true
    }
    
    // Add empty AI message that will be filled with streaming content
    setMessages(prev => [...prev, aiResponse])
    
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextMessage + userMessage.content,
          chatHistory: messagesRef.current.slice(-10),
          context: chatContext,
          lessonTopic: lessonTopic
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''
      let sentenceBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) {
                throw new Error(parsed.error)
              }
              
              if (parsed.text) {
                accumulatedText += parsed.text
                sentenceBuffer += parsed.text
                
                // Update the message with accumulated text
                setMessages(prev => prev.map(msg => 
                  msg.id === aiResponseId 
                    ? { ...msg, content: accumulatedText }
                    : msg
                ))
                
                // Check if we have a complete sentence for TTS
                const sentenceEnd = /[.!?]\s/.exec(sentenceBuffer)
                if (sentenceEnd && settings.autoTTS) {
                  const sentence = sentenceBuffer.substring(0, sentenceEnd.index + 1).trim()
                  if (sentence.length > 10) { // Only speak meaningful sentences
                    // Create a temporary message for TTS
                    const tempId = `${aiResponseId}-sentence-${Date.now()}`
                    setTtsQueue(prev => [...prev, { id: tempId, text: sentence }])
                    sentenceBuffer = sentenceBuffer.substring(sentenceEnd.index + 1)
                  }
                }
              }
            } catch (e) {
              console.error('Error parsing stream:', e)
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === aiResponseId 
          ? { ...msg, isStreaming: false }
          : msg
      ))
      
      // Queue any remaining text for TTS
      if (settings.autoTTS && sentenceBuffer.trim().length > 0) {
        // Only queue the remaining unspoken text
        const tempId = `${aiResponseId}-final-${Date.now()}`
        setTtsQueue(prev => [...prev, { id: tempId, text: sentenceBuffer.trim() }])
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred while sending the message')
      // Remove the empty AI message on error
      setMessages(prev => prev.filter(msg => msg.id !== aiResponseId))
    } finally {
      setIsLoading(false)
      setIsProcessingQueue(false)
      
      // Process next message in queue
      if (messageQueue.length > 0) {
        const nextMessage = messageQueue[0]
        setMessageQueue(prev => prev.slice(1))
        await processMessage(nextMessage.userMessage, nextMessage.contextMessage)
      }
    }
  }

  // Handle quick actions
  const handleQuickAction = (action) => {
    // Prevent if TTS is playing
    if (currentlyPlayingId) {
      setError('Please stop the current audio playback before sending a new message')
      return
    }
    handleSendMessage(action.prompt)
  }

  // Toggle message TTS - Optimized to reduce re-renders
  const toggleMessageTTS = useCallback(async (messageId) => {
    const currentMessages = messagesRef.current
    const messageIndex = currentMessages.findIndex(m => m.id === messageId)
    if (messageIndex === -1 || currentMessages[messageIndex].role !== 'assistant') return
    
    const message = currentMessages[messageIndex]
    
    if (message.isPlaying && currentlyPlayingId === messageId) {
      pause()
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[messageIndex] = { ...newMessages[messageIndex], isPlaying: false }
        return newMessages
      })
    } else if (currentlyPlayingId === messageId && isPaused) {
      resume()
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[messageIndex] = { ...newMessages[messageIndex], isPlaying: true }
        return newMessages
      })
    } else {
      // Stop any other playing message
      if (currentlyPlayingId) {
        stopMessage(currentlyPlayingId)
      }

      setCurrentlyPlayingId(messageId)
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : msg
      ))

      await speak(message.content, {
        voiceName: settings.voiceName,
        playbackRate: settings.playbackSpeed,
        volume: settings.volume,
        onStart: () => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, isPlaying: true } : msg
          ))
        },
        onEnd: () => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, isPlaying: false, currentWordIndex: -1, highlightRange: null } : msg
          ))
          setCurrentlyPlayingId(null)
          processNextTTS()
        },
        onProgress: ({ currentWordIndex, highlightRange }) => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, currentWordIndex, highlightRange } : msg
          ))
        }
      })
    }
  }, [currentlyPlayingId, isPaused, settings.voiceName, settings.playbackSpeed, settings.volume, speak, pause, resume])

  // Stop a specific message
  const stopMessage = useCallback((messageId) => {
    stop()
    setMessages(prev => {
      const index = prev.findIndex(msg => msg.id === messageId)
      if (index === -1) return prev
      const newMessages = [...prev]
      newMessages[index] = { ...newMessages[index], isPlaying: false, currentWordIndex: -1, highlightRange: null }
      return newMessages
    })
    if (currentlyPlayingId === messageId) {
      setCurrentlyPlayingId(null)
    }
  }, [currentlyPlayingId, stop])
  
  // Stop all TTS playback
  const stopAllTTS = useCallback(() => {
    if (currentlyPlayingId) {
      stopMessage(currentlyPlayingId)
    }
    setTtsQueue([])
    setError(null)
  }, [currentlyPlayingId, stopMessage])

  // Process TTS queue - don't include in dependency arrays to avoid loops
  const processNextTTS = useCallback(() => {
    if (ttsQueue.length === 0 || currentlyPlayingId || !settings.autoTTS) {
      return
    }
    
    const nextItem = ttsQueue[0]
    
    // Handle sentence-based TTS
    if (typeof nextItem === 'object' && nextItem.text) {
      setTtsQueue(prev => prev.slice(1))
      
      // Speak the sentence directly
      speak(nextItem.text, {
        voiceName: settings.voiceName,
        playbackRate: settings.playbackSpeed,
        volume: settings.volume,
        onEnd: () => {
          setCurrentlyPlayingId(null)
        }
      })
      
      setCurrentlyPlayingId(nextItem.id)
      return
    }
    
    // Handle regular message TTS
    const nextId = typeof nextItem === 'string' ? nextItem : nextItem.id
    // Check if the message exists in the current messages
    const messageExists = messagesRef.current.some(m => m.id === nextId)
    
    if (!messageExists) {
      // Message not ready yet, try again shortly
      setTimeout(() => processNextTTS(), 100)
      return
    }
    
    setTtsQueue(prev => prev.slice(1))
    
    // Immediately toggle TTS without delay
    toggleMessageTTS(nextId)
  }, [ttsQueue, currentlyPlayingId, settings.autoTTS, settings.voiceName, settings.playbackSpeed, settings.volume, speak, toggleMessageTTS])

  // Skip to next message
  const skipToNext = useCallback(() => {
    if (currentlyPlayingId) {
      stopMessage(currentlyPlayingId)
    }
    processNextTTS()
  }, [currentlyPlayingId, stopMessage, processNextTTS])

  // Only process queue when playback ends or queue changes
  useEffect(() => {
    if (!currentlyPlayingId && ttsQueue.length > 0 && settings.autoTTS) {
      // Process immediately without delay
      processNextTTS()
    }
  }, [currentlyPlayingId, ttsQueue.length, settings.autoTTS, processNextTTS])

  // Clear chat history
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      stopAllTTS()
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        isPlaying: false,
        currentWordIndex: -1
      }])
      setError(null)
    }
  }

  // Export chat as text
  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.role.toUpperCase()}] ${formatTimestamp(msg.timestamp)}\n${msg.content}\n`
    ).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${lessonTopic || 'general'}-${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export as audio study guide
  const exportAudioGuide = async () => {
    // This would require backend implementation to concatenate all AI responses
    alert('Audio export feature coming soon!')
  }

  // Render message with highlighted words for TTS
  const renderMessageContent = (message) => {
    if (message.role !== 'assistant' || !message.isPlaying) {
      return <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
    }

    const words = message.content.split(' ')
    const highlightRange = message.highlightRange || { start: -1, end: -1 }
    
    return (
      <p className="text-base leading-relaxed whitespace-pre-wrap">
        {words.map((word, index) => {
          const isHighlighted = index >= highlightRange.start && index <= highlightRange.end
          const isCenterWord = index === message.currentWordIndex
          
          return (
            <span
              key={index}
              className={cn(
                'cursor-pointer transition-all duration-200',
                isHighlighted && 'bg-yellow-100 dark:bg-yellow-900/30',
                isCenterWord && 'bg-yellow-300 dark:bg-yellow-800 font-medium'
              )}
              onClick={async () => {
                if (message.isPlaying && currentlyPlayingId === message.id) {
                  // Restart from clicked word
                  stop()
                  setCurrentlyPlayingId(message.id)
                  await speak(message.content, {
                    startFrom: index,
                    voiceName: settings.voiceName,
                    playbackRate: settings.playbackSpeed,
                    volume: settings.volume,
                    onStart: () => {
                      setMessages(prev => prev.map(msg => 
                        msg.id === message.id ? { ...msg, isPlaying: true } : msg
                      ))
                    },
                    onEnd: () => {
                      setMessages(prev => prev.map(msg => 
                        msg.id === message.id ? { ...msg, isPlaying: false, currentWordIndex: -1, highlightRange: null } : msg
                      ))
                      setCurrentlyPlayingId(null)
                    },
                    onProgress: ({ currentWordIndex, highlightRange }) => {
                      setMessages(prev => prev.map(msg => 
                        msg.id === message.id ? { ...msg, currentWordIndex, highlightRange } : msg
                      ))
                    }
                  })
                }
              }}
            >
              {word}{' '}
            </span>
          )
        })}
      </p>
    )
  }

  // Settings panel
  const SettingsPanel = () => (
    <div className="p-spacing-md space-y-spacing-md">
      <div>
        <Label htmlFor="auto-tts">Auto-play TTS</Label>
        <Switch
          id="auto-tts"
          checked={settings.autoTTS}
          onCheckedChange={(checked) => updateSettings({ autoTTS: checked })}
        />
      </div>
      
      <div>
        <Label htmlFor="voice">Voice</Label>
        <select
          id="voice"
          value={settings.voiceName}
          onChange={(e) => updateSettings({ voiceName: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Rachel">Rachel</option>
          <option value="Emily">Emily</option>
          <option value="Sarah">Sarah</option>
          <option value="John">John</option>
          <option value="Michael">Michael</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="speed">Playback Speed: {settings.playbackSpeed}x</Label>
        <Slider
          id="speed"
          min={0.5}
          max={2}
          step={0.1}
          value={[settings.playbackSpeed]}
          onValueChange={([value]) => {
            updateSettings({ playbackSpeed: value })
            // Update currently playing audio
            if (currentlyPlayingId) {
              setPlaybackRate(value)
            }
          }}
        />
      </div>
      
      <div>
        <Label htmlFor="volume">Volume: {Math.round(settings.volume * 100)}%</Label>
        <Slider
          id="volume"
          min={0}
          max={1}
          step={0.1}
          value={[settings.volume]}
          onValueChange={([value]) => {
            updateSettings({ volume: value })
            // Update currently playing audio
            if (currentlyPlayingId) {
              setVolume(value)
            }
          }}
        />
      </div>
    </div>
  )


  // Position classes for floating widget
  const positionClasses = {
    'bottom-right': 'bottom-spacing-lg right-spacing-lg',
    'bottom-left': 'bottom-spacing-lg left-spacing-lg',
    'top-right': 'top-spacing-lg right-spacing-lg',
    'top-left': 'top-spacing-lg left-spacing-lg'
  }

  // Main chat interface
  const chatInterface = (
    <div className={cn(
      'flex flex-col h-full',
      'bg-bg-primary', // #FFFFFF
      !embedded && 'rounded-xl shadow-xl border border-border-subtle'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-spacing-md border-b border-border-subtle">
        <div className="flex items-center gap-spacing-sm">
          <div className="size-10 rounded-lg bg-bg-brand flex items-center justify-center">
            <MessageSquare className="size-5 text-text-inverse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-spacing-xs">
          {/* TTS Controls */}
          {currentlyPlayingId && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipToNext}
                className="size-9"
                title="Skip to next"
              >
                <SkipForward className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopAllTTS}
                className="size-9"
                title="Stop all audio"
              >
                <StopCircle className="size-4" />
              </Button>
            </>
          )}
          
          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
              >
                <Settings className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>TTS Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <SettingsPanel />
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
              >
                <SlidersHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportChat}>
                <Download className="size-4 mr-2" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAudioGuide}>
                <Volume2 className="size-4 mr-2" />
                Export Audio Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowHistory(true)}>
                <Search className="size-4 mr-2" />
                Search History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClearChat}>
                <Trash2 className="size-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!embedded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="size-9"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="size-4" />
              ) : (
                <Minimize2 className="size-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Context bar */}
      {lessonTopic && (
        <div className="px-spacing-md py-spacing-sm bg-bg-emphasis border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-spacing-sm">
              <BookOpen className="size-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">
                Learning about: <strong>{lessonTopic}</strong>
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSendMessage(`Can you help me understand the key concepts about ${lessonTopic}?`)}
              className="text-xs"
              disabled={currentlyPlayingId !== null}
              title={currentlyPlayingId ? "Stop audio to send new message" : "Ask about the lesson"}
            >
              Ask about this lesson
            </Button>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-spacing-md py-spacing-sm border-b border-border-subtle bg-bg-secondary">
        <div className="flex items-center gap-spacing-sm overflow-x-auto">
          <Lightbulb className="size-4 text-text-secondary flex-shrink-0" />
          <div className="flex gap-spacing-xs">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="text-xs whitespace-nowrap"
                disabled={currentlyPlayingId !== null}
                title={currentlyPlayingId ? "Stop audio to send new message" : action.prompt}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={cn(
          'flex-1 overflow-y-auto p-spacing-md', // 16px
          'space-y-spacing-md', // 16px gap
          'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
        )}
        style={{ 
          maxHeight: embedded ? (maxHeight === '100%' ? undefined : maxHeight) : '400px',
          height: embedded && maxHeight === '100%' ? '100%' : undefined 
        }}
      >
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onToggleTTS={toggleMessageTTS}
          renderMessageContent={renderMessageContent}
          formatTimestamp={formatTimestamp}
        />
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-spacing-sm p-spacing-sm rounded-lg bg-bg-errorLight text-text-error"
          >
            <AlertCircle className="size-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence mode="wait">
        {showScrollButton && (
          <motion.div
            key="scroll-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-24 right-4"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                scrollToBottom()
                setIsAtBottom(true)
              }}
              className="size-10 rounded-full shadow-lg"
            >
              <ChevronDown className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div 
        className="border-t border-border-subtle p-spacing-md" 
        style={{ 
          backgroundColor: '#ffffff',
          isolation: 'isolate',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div className="flex gap-spacing-sm">
          <ChatInput 
            value={inputValue}
            onChange={handleInputChange}
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder={placeholder}
            disabled={currentlyPlayingId !== null}
          />
          {currentlyPlayingId ? (
            <Button
              onClick={stopAllTTS}
              size="md"
              variant="destructive"
              className="px-spacing-md"
              title="Stop audio playback"
            >
              <StopCircle className="size-5 mr-2" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (inputValue.trim()) {
                  handleSendMessage(inputValue)
                }
              }}
              disabled={!inputValue.trim()}
              size="md"
              className="px-spacing-md"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Send className="size-5" />
              )}
            </Button>
          )}
        </div>
        
        {(messageQueue.length > 0 || currentlyPlayingId) && (
          <div className="mt-spacing-xs text-xs text-text-secondary flex items-center gap-spacing-sm">
            {currentlyPlayingId && (
              <span className="inline-flex items-center gap-1">
                <Volume2 className="size-3 animate-pulse" />
                Audio playing - Stop to send new message
              </span>
            )}
            {messageQueue.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="size-3 animate-spin" />
                {messageQueue.length} message{messageQueue.length > 1 ? 's' : ''} queued
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Floating widget wrapper
  if (!embedded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          'fixed z-50',
          positionClasses[position],
          'w-full max-w-md',
          className
        )}
      >
        <AnimatePresence mode="wait">
          {isMinimized ? (
            <motion.div
              key="minimized"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={() => setIsMinimized(false)}
                size="lg"
                className="shadow-xl"
              >
                <MessageSquare className="size-5 mr-2" />
                {title}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-[600px]"
            >
              {chatInterface}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Embedded version
  return (
    <div className={cn('h-full', className)}>
      {chatInterface}
    </div>
  )
}

// Wrapper component with TTSSettingsProvider
const AIChatbotEnhanced = (props) => {
  return (
    <TTSSettingsProvider>
      <AIChatbotInner {...props} />
    </TTSSettingsProvider>
  )
}

export default AIChatbotEnhanced