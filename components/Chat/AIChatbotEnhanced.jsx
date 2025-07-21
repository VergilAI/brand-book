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
  FileText,
  StopCircle,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atomic/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Avatar } from '@/components/atomic/avatar'
import { useTTS } from '@/hooks/use-tts'
import { TTSSettingsProvider, useTTSSettings } from '@/contexts/tts-settings-context'
import { chatStorage } from '@/lib/chat/chat-storage'
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

// Generate context-aware suggestions based on the message content
const generateSuggestions = (messageContent) => {
  const lowerContent = messageContent.toLowerCase()
  const suggestions = []
  
  // Check for specific patterns and suggest relevant follow-ups
  if (lowerContent.includes('function') || lowerContent.includes('method') || lowerContent.includes('code')) {
    suggestions.push({ id: 'example-code', label: 'Show me code examples', prompt: 'Can you show me some code examples of this?' })
  }
  
  if (lowerContent.includes('concept') || lowerContent.includes('theory') || lowerContent.includes('principle')) {
    suggestions.push({ id: 'practical', label: 'How is this used in practice?', prompt: 'How is this concept applied in real-world scenarios?' })
  }
  
  if (lowerContent.includes('step') || lowerContent.includes('process') || lowerContent.includes('how to')) {
    suggestions.push({ id: 'detailed', label: 'Break it down step-by-step', prompt: 'Can you break this down into more detailed steps?' })
  }
  
  if (lowerContent.includes('definition') || lowerContent.includes('what is') || lowerContent.includes('means')) {
    suggestions.push({ id: 'examples', label: 'Give me examples', prompt: 'Can you provide some concrete examples?' })
  }
  
  // Add default suggestions if we have room
  const defaultSuggestions = [
    { id: 'explain', label: 'Explain differently', prompt: 'Can you explain this in a different way?' },
    { id: 'simplify', label: 'Make it simpler', prompt: 'Can you simplify this explanation?' },
    { id: 'deeper', label: 'Go deeper', prompt: 'Can you provide more details about this?' },
    { id: 'quiz', label: 'Test my understanding', prompt: 'Can you quiz me on what we just discussed?' }
  ]
  
  // Add defaults up to 4 total suggestions
  for (const suggestion of defaultSuggestions) {
    if (suggestions.length >= 4) break
    if (!suggestions.find(s => s.id === suggestion.id)) {
      suggestions.push(suggestion)
    }
  }
  
  return suggestions.slice(0, 4) // Return max 4 suggestions
}

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
const MessageBubble = React.memo(({ message, onToggleTTS, renderMessageContent, formatTimestamp, isLatest, onSuggestionClick, isDisabled }) => {
  const isUser = message.role === 'user'
  // Only show suggestions for the latest AI message that is not streaming
  const suggestions = !isUser && isLatest && !message.isStreaming ? generateSuggestions(message.content) : []
  
  return (
    <div className="space-y-spacing-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        data-message-id={message.id}
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
      
      {/* Suggestion prompts for the latest AI message */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-wrap gap-spacing-xs ml-10"
        >
          {suggestions.map(suggestion => (
            <Button
              key={suggestion.id}
              variant="secondary"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              disabled={isDisabled}
              className="text-xs"
            >
              {suggestion.label}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Deep comparison for message properties that matter for rendering
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.isPlaying === nextProps.message.isPlaying &&
    prevProps.message.currentWordIndex === nextProps.message.currentWordIndex &&
    JSON.stringify(prevProps.message.highlightRange) === JSON.stringify(nextProps.message.highlightRange) &&
    prevProps.message.isStreaming === nextProps.message.isStreaming &&
    prevProps.isLatest === nextProps.isLatest &&
    prevProps.isDisabled === nextProps.isDisabled
  )
})

// Message list component - isolated to prevent parent re-renders
const MessageList = React.memo(({ 
  messages, 
  isLoading, 
  onToggleTTS,
  renderMessageContent,
  formatTimestamp,
  onSuggestionClick,
  isDisabled
}) => {
  const lastAssistantMessageIndex = messages.findLastIndex(m => m.role === 'assistant')
  
  return (
    <AnimatePresence mode="popLayout">
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onToggleTTS={onToggleTTS}
          renderMessageContent={renderMessageContent}
          formatTimestamp={formatTimestamp}
          isLatest={message.role === 'assistant' && index === lastAssistantMessageIndex}
          onSuggestionClick={onSuggestionClick}
          isDisabled={isDisabled}
        />
      ))}
      
      {isLoading && <LoadingIndicator />}
    </AnimatePresence>
  )
})

// Memoized input component to prevent re-renders - moved outside to prevent recreation
const ChatInput = React.memo(({ onSend, isLoading, placeholder, value, onChange, disabled, autoFocus }) => {
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
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  
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
         prevProps.disabled === nextProps.disabled &&
         prevProps.autoFocus === nextProps.autoFocus
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
  sessionId = null,
  onComplete = null,
  messageCount = 0
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
      isPlaying: false,
      currentWordIndex: -1,
      highlightRange: null
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
  const isProcessingTTSRef = useRef(false)
  const [responseStyle, setResponseStyle] = useState('balanced')
  const [languageLevel, setLanguageLevel] = useState('intermediate')
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const messagesRef = useRef(messages)
  const ttsQueueRef = useRef(ttsQueue)
  const currentlyPlayingIdRef = useRef(currentlyPlayingId)
  
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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Keep refs updated
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])
  
  useEffect(() => {
    ttsQueueRef.current = ttsQueue
  }, [ttsQueue])
  
  useEffect(() => {
    currentlyPlayingIdRef.current = currentlyPlayingId
  }, [currentlyPlayingId])

  // Smart auto-scroll behavior
  useEffect(() => {
    // Always scroll for new user messages or when explicitly at bottom
    const lastMessage = messages[messages.length - 1]
    
    if (lastMessage?.role === 'user' || isAtBottom) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const { scrollHeight, clientHeight } = chatContainerRef.current
          chatContainerRef.current.scrollTop = scrollHeight - clientHeight
        }
      })
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
  
  // Cleanup TTS when component unmounts
  useEffect(() => {
    return () => {
      // Stop all TTS when leaving the activity
      if (currentlyPlayingIdRef.current) {
        stop()
      }
      setTtsQueue([])
    }
  }, [stop])

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
      timestamp: new Date(),
      isPlaying: false,
      currentWordIndex: -1,
      highlightRange: null
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setError(null)
    
    // Force scroll to bottom when user sends a message
    setIsAtBottom(true)
    setTimeout(() => {
      scrollToBottom()
    }, 50)
    
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
      highlightRange: null,
      isStreaming: true
    }
    
    // Add empty AI message that will be filled with streaming content
    setMessages(prev => [...prev, aiResponse])
    
    // Keep user at bottom if they were already there
    if (isAtBottom) {
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
    
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
          lessonTopic: lessonTopic,
          responseStyle: responseStyle,
          languageLevel: languageLevel
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
                
                // Check if we have complete sentences for TTS
                // Look for multiple sentences to batch together
                const sentences = []
                let tempBuffer = sentenceBuffer
                let sentenceMatch
                
                while ((sentenceMatch = /[.!?]\s/.exec(tempBuffer))) {
                  const sentence = tempBuffer.substring(0, sentenceMatch.index + 1).trim()
                  if (sentence.length > 10) {
                    sentences.push(sentence)
                  }
                  tempBuffer = tempBuffer.substring(sentenceMatch.index + 1)
                }
                
                // If we have 2+ sentences, or 1 sentence that's reasonably long, queue them
                if (settings.autoTTS && sentences.length > 0) {
                  const totalLength = sentences.join(' ').length
                  
                  // Batch sentences if we have multiple short ones or one long one
                  if (sentences.length >= 2 || totalLength > 80) {
                    const textToSpeak = sentences.join(' ')
                    const tempId = `${aiResponseId}-sentence-${Date.now()}`
                    setTtsQueue(prev => [...prev, { id: tempId, text: textToSpeak, messageId: aiResponseId }])
                    
                    // Update sentence buffer to remove spoken sentences
                    sentenceBuffer = tempBuffer
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
        const remainingText = sentenceBuffer.trim()
        
        // Check if there's meaningful content left to speak
        if (remainingText.length > 10) {
          // If the remaining text is substantial, combine it with the last queued item if possible
          setTtsQueue(prev => {
            if (prev.length > 0 && prev[prev.length - 1].messageId === aiResponseId) {
              // Combine with the last item to avoid a short fragment
              const lastItem = prev[prev.length - 1]
              const combinedText = lastItem.text + ' ' + remainingText
              return [
                ...prev.slice(0, -1),
                { ...lastItem, text: combinedText }
              ]
            } else {
              // Queue as a new item
              const tempId = `${aiResponseId}-final-${Date.now()}`
              return [...prev, { id: tempId, text: remainingText, messageId: aiResponseId }]
            }
          })
        }
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

  // Stop a specific message
  const stopMessage = useCallback((messageId) => {
    stop()
    
    // Find which message this ID belongs to
    let actualMessageId = messageId
    if (messageId && messageId.includes('-sentence-')) {
      actualMessageId = messageId.split('-sentence-')[0]
    } else if (messageId && messageId.includes('-final-')) {
      actualMessageId = messageId.split('-final-')[0]
    }
    
    setMessages(prev => {
      return prev.map(msg => {
        if (msg.id === actualMessageId) {
          return { ...msg, isPlaying: false, currentWordIndex: -1, highlightRange: null }
        }
        return msg
      })
    })
    
    setCurrentlyPlayingId(null)
  }, [stop])

  // Toggle message TTS - Optimized to reduce re-renders
  const toggleMessageTTS = useCallback(async (messageId) => {
    const currentMessages = messagesRef.current
    const messageIndex = currentMessages.findIndex(m => m.id === messageId)
    if (messageIndex === -1 || currentMessages[messageIndex].role !== 'assistant') return
    
    const message = currentMessages[messageIndex]
    
    // Check if we're currently playing a sentence from this message
    const isPlayingSentenceFromMessage = currentlyPlayingId && 
      (currentlyPlayingId.includes(`${messageId}-sentence-`) || 
       currentlyPlayingId.includes(`${messageId}-final-`))
    
    if (message.isPlaying && (currentlyPlayingId === messageId || isPlayingSentenceFromMessage)) {
      // Pause playback
      await pause()
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ))
    } else if ((currentlyPlayingId === messageId || isPlayingSentenceFromMessage) && isPaused) {
      // Resume playback
      resume()
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : msg
      ))
    } else {
      // Stop any other playing message
      if (currentlyPlayingId) {
        await stopMessage(currentlyPlayingId)
      }

      setCurrentlyPlayingId(messageId)
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : msg
      ))

      try {
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
      } catch (error) {
        // Handle the error gracefully
        console.error('TTS error:', error)
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isPlaying: false, currentWordIndex: -1, highlightRange: null } : msg
        ))
        setCurrentlyPlayingId(null)
      }
    }
  }, [currentlyPlayingId, isPaused, settings.voiceName, settings.playbackSpeed, settings.volume, speak, pause, resume, stopMessage])
  
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
    const currentQueue = ttsQueueRef.current
    const currentPlayingId = currentlyPlayingIdRef.current
    
    
    // Prevent concurrent processing
    if (isProcessingTTSRef.current) {
      return
    }
    
    if (currentQueue.length === 0 || currentPlayingId || !settings.autoTTS) {
      isProcessingTTSRef.current = false
      return
    }
    
    isProcessingTTSRef.current = true
    const nextItem = currentQueue[0]
    
    // Handle sentence-based TTS
    if (typeof nextItem === 'object' && nextItem.text) {
      setTtsQueue(prev => prev.slice(1))
      
      // Mark the message as playing if we have a messageId
      if (nextItem.messageId) {
        const fullMessage = messagesRef.current.find(m => m.id === nextItem.messageId)
        if (!fullMessage) {
          isProcessingTTSRef.current = false
          processNextTTS()
          return
        }
        
        // Find the offset of this sentence in the full message
        const sentenceStart = fullMessage.content.indexOf(nextItem.text)
        const beforeSentence = sentenceStart > 0 ? fullMessage.content.substring(0, sentenceStart) : ''
        const wordsBeforeSentence = beforeSentence ? beforeSentence.split(/\s+/).length : 0
        
        setMessages(prev => prev.map(msg => 
          msg.id === nextItem.messageId ? { ...msg, isPlaying: true } : msg
        ))
        
        // Speak the sentence directly
        speak(nextItem.text, {
          voiceName: settings.voiceName,
          playbackRate: settings.playbackSpeed,
          volume: settings.volume,
          onEnd: () => {
            // Clear the playing state only if this is the last sentence
            const remainingItems = ttsQueueRef.current.filter(item => 
              typeof item === 'object' && item.messageId === nextItem.messageId
            )
            
            if (remainingItems.length === 0) {
              setMessages(prev => prev.map(msg => 
                msg.id === nextItem.messageId ? { ...msg, isPlaying: false, currentWordIndex: -1, highlightRange: null } : msg
              ))
            }
            
            setCurrentlyPlayingId(null)
            isProcessingTTSRef.current = false
            // Process next item immediately for smoother flow
            setTimeout(() => processNextTTS(), 50) // Small delay for more natural flow
          },
          onProgress: ({ currentWordIndex, highlightRange }) => {
            // Adjust the word indices to account for the sentence position in the full message
            if (nextItem.messageId) {
              const adjustedCurrentWordIndex = wordsBeforeSentence + currentWordIndex
              const adjustedHighlightRange = highlightRange ? {
                start: wordsBeforeSentence + highlightRange.start,
                end: wordsBeforeSentence + highlightRange.end
              } : null
              
              setMessages(prev => prev.map(msg => 
                msg.id === nextItem.messageId ? { 
                  ...msg, 
                  currentWordIndex: adjustedCurrentWordIndex, 
                  highlightRange: adjustedHighlightRange 
                } : msg
              ))
            }
          }
        })
        
        setCurrentlyPlayingId(nextItem.id)
        return
      }
    }
    
    // Handle regular message TTS
    const nextId = typeof nextItem === 'string' ? nextItem : nextItem.id
    // Check if the message exists in the current messages
    const messageExists = messagesRef.current.some(m => m.id === nextId)
    
    if (!messageExists) {
      // Message not ready yet, try again shortly
      isProcessingTTSRef.current = false
      setTimeout(() => processNextTTS(), 100)
      return
    }
    
    setTtsQueue(prev => prev.slice(1))
    isProcessingTTSRef.current = false
    
    // Immediately toggle TTS without delay
    toggleMessageTTS(nextId)
  }, [settings.autoTTS, settings.voiceName, settings.playbackSpeed, settings.volume, speak]) // Simplified deps to avoid loops

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
  }, [currentlyPlayingId, ttsQueue.length, settings.autoTTS]) // Remove processNextTTS from deps to avoid loops

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
        currentWordIndex: -1,
        highlightRange: null
      }])
      setError(null)
    }
  }

  // Export chat as markdown
  const exportChatAsMarkdown = () => {
    const date = new Date()
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    
    let markdownContent = `# AI Learning Session\n\n`
    markdownContent += `**Topic**: ${lessonTopic || 'General Learning'}\n`
    markdownContent += `**Date**: ${formattedDate}\n`
    markdownContent += `**Time**: ${formattedTime}\n`
    markdownContent += `**Total Messages**: ${messages.length}\n\n`
    markdownContent += `---\n\n`
    
    messages.forEach((msg, index) => {
      const timestamp = formatTimestamp(msg.timestamp)
      if (msg.role === 'user') {
        markdownContent += `### User (${timestamp})\n\n`
        markdownContent += `${msg.content}\n\n`
      } else {
        markdownContent += `### AI Assistant (${timestamp})\n\n`
        markdownContent += `${msg.content}\n\n`
      }
      if (index < messages.length - 1) {
        markdownContent += `---\n\n`
      }
    })
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${lessonTopic || 'session'}-${date.toISOString().split('T')[0]}.md`
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
    if (message.role !== 'assistant') {
      return <div className="text-sm leading-normal">{message.content}</div>
    }
    
    // Split content into paragraphs
    const paragraphs = message.content.split('\n\n').filter(p => p.trim())
    
    // Check if this message is currently playing
    const isPlayingThisMessage = message.isPlaying === true
    
    // HIGHLIGHTING DISABLED FOR NOW - Uncomment the block below to re-enable
    /*
    if (!isPlayingThisMessage) {
      return (
        <div className="text-sm leading-normal space-y-2">
          {paragraphs.map((paragraph, pIndex) => (
            <p key={pIndex}>{paragraph.trim()}</p>
          ))}
        </div>
      )
    }

    // For playing messages with highlighting
    const allWords = message.content.split(/\s+/)
    const highlightRange = message.highlightRange || { start: -1, end: -1 }
    
    // Track word index across all paragraphs
    let globalWordIndex = 0
    
    return (
      <div className="text-sm leading-normal space-y-2">
        {paragraphs.map((paragraph, pIndex) => {
          const paragraphWords = paragraph.trim().split(/\s+/)
          const paragraphStartIndex = globalWordIndex
          
          const paragraphContent = paragraphWords.map((word, localIndex) => {
            const currentGlobalIndex = paragraphStartIndex + localIndex
            const isHighlighted = currentGlobalIndex >= highlightRange.start && currentGlobalIndex <= highlightRange.end
            const isCenterWord = currentGlobalIndex === message.currentWordIndex
            
            return (
              <React.Fragment key={`${pIndex}-${localIndex}`}>
                <span
                  className={cn(
                    'transition-all duration-200 rounded cursor-pointer inline-block',
                    isHighlighted && 'bg-yellow-200 dark:bg-yellow-900/50',
                    isCenterWord && 'bg-yellow-400 dark:bg-yellow-700 font-semibold'
                  )}
                  style={{ 
                    paddingLeft: isHighlighted || isCenterWord ? '2px' : '0',
                    paddingRight: isHighlighted || isCenterWord ? '2px' : '0'
                  }}
                  onClick={async () => {
                    if (message.isPlaying && currentlyPlayingId === message.id) {
                      // Restart from clicked word
                      stop()
                      setCurrentlyPlayingId(message.id)
                      await speak(message.content, {
                        startFrom: currentGlobalIndex,
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
                  {word}
                </span>
                {localIndex < paragraphWords.length - 1 && ' '}
              </React.Fragment>
            )
          })
          
          globalWordIndex += paragraphWords.length
          
          return <p key={pIndex}>{paragraphContent}</p>
        })}
      </div>
    )
    */
    
    // Simple rendering without highlighting
    return (
      <div className="text-sm leading-normal space-y-2">
        {paragraphs.map((paragraph, pIndex) => (
          <p key={pIndex}>{paragraph.trim()}</p>
        ))}
      </div>
    )
  }

  // Settings panel with working components
  const SettingsPanel = () => (
    <div className="space-y-spacing-sm">
      {/* Auto-play TTS Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary hover:bg-bg-emphasis transition-all duration-200">
        <div className="flex items-center gap-spacing-sm">
          <Volume2 className="size-4 text-text-secondary" />
          <div>
            <Label htmlFor="auto-tts" className="text-sm font-medium text-text-primary block">Auto-play TTS</Label>
            <p className="text-xs text-text-secondary">Read AI responses aloud</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="auto-tts"
            className="sr-only peer"
            checked={settings.autoTTS}
            onChange={(e) => updateSettings({ autoTTS: e.target.checked })}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bg-brand/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bg-brand"></div>
        </label>
      </div>
      
      {/* Voice Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-spacing-sm">
          <MessageSquare className="size-4 text-text-secondary" />
          <Label htmlFor="voice-select" className="text-sm font-semibold text-text-primary">
            Voice Selection
          </Label>
        </div>
        <div className="relative">
          <select
            id="voice-select"
            value={settings.voiceName}
            onChange={(e) => updateSettings({ voiceName: e.target.value })}
            className="w-full h-11 px-4 pr-10 bg-bg-primary hover:bg-bg-emphasis border border-border-default hover:border-border-emphasis rounded-lg text-sm font-medium text-text-primary appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-bg-brand/20 focus:border-bg-brand"
          >
            <option value="Rachel">Rachel (Female)</option>
            <option value="Emily">Emily (Female)</option>
            <option value="Sarah">Sarah (Female)</option>
            <option value="John">John (Male)</option>
            <option value="Michael">Michael (Male)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="size-4 text-text-secondary" />
          </div>
        </div>
      </div>
      
      {/* Playback Speed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-spacing-sm">
            <Play className="size-4 text-text-secondary" />
            <Label htmlFor="speed-slider" className="text-sm font-semibold text-text-primary">
              Playback Speed
            </Label>
          </div>
          <div className="px-2 py-1 bg-bg-emphasis rounded text-xs font-semibold text-bg-brand" id="speed-display">
            {settings.playbackSpeed.toFixed(1)}x
          </div>
        </div>
        <div className="px-3 py-2 bg-bg-secondary rounded-lg">
          <input
            id="speed-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            defaultValue={settings.playbackSpeed <= 1 ? ((settings.playbackSpeed - 0.5) / 0.5) * 50 : 50 + ((settings.playbackSpeed - 1) / 1) * 50}
            onMouseUp={(e) => {
              const percentage = parseFloat(e.currentTarget.value)
              let value;
              if (percentage <= 50) {
                // 0-50% maps to 0.5x-1.0x
                value = 0.5 + (percentage / 50) * 0.5
              } else {
                // 50-100% maps to 1.0x-2.0x
                value = 1 + ((percentage - 50) / 50) * 1
              }
              updateSettings({ playbackSpeed: value })
            }}
            onTouchEnd={(e) => {
              const percentage = parseFloat(e.currentTarget.value)
              let value;
              if (percentage <= 50) {
                value = 0.5 + (percentage / 50) * 0.5
              } else {
                value = 1 + ((percentage - 50) / 50) * 1
              }
              updateSettings({ playbackSpeed: value })
            }}
            onInput={(e) => {
              const percentage = parseFloat(e.target.value)
              let value;
              if (percentage <= 50) {
                value = 0.5 + (percentage / 50) * 0.5
              } else {
                value = 1 + ((percentage - 50) / 50) * 1
              }
              // Update visual feedback immediately
              e.target.style.background = `linear-gradient(to right, #7B00FF 0%, #7B00FF ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
              // Update display value
              const displayEl = document.getElementById('speed-display')
              if (displayEl) displayEl.textContent = `${value.toFixed(1)}x`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7B00FF 0%, #7B00FF ${settings.playbackSpeed <= 1 ? ((settings.playbackSpeed - 0.5) / 0.5) * 50 : 50 + ((settings.playbackSpeed - 1) / 1) * 50}%, #E5E7EB ${settings.playbackSpeed <= 1 ? ((settings.playbackSpeed - 0.5) / 0.5) * 50 : 50 + ((settings.playbackSpeed - 1) / 1) * 50}%, #E5E7EB 100%)`,
              WebkitAppearance: 'none'
            }}
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-3">
            <span>0.5x</span>
            <span className="text-text-secondary font-medium">1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>
      
      {/* Volume Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-spacing-sm">
            <Volume2 className="size-4 text-text-secondary" />
            <Label htmlFor="volume-slider" className="text-sm font-semibold text-text-primary">
              Volume Control
            </Label>
          </div>
          <div className="px-2 py-1 bg-bg-emphasis rounded text-xs font-semibold text-bg-brand" id="volume-display">
            {Math.round(settings.volume * 100)}%
          </div>
        </div>
        <div className="px-3 py-2 bg-bg-secondary rounded-lg">
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={settings.volume}
            onMouseUp={(e) => {
              const value = parseFloat(e.currentTarget.value)
              updateSettings({ volume: value })
            }}
            onTouchEnd={(e) => {
              const value = parseFloat(e.currentTarget.value)
              updateSettings({ volume: value })
            }}
            onInput={(e) => {
              const value = parseFloat(e.currentTarget.value)
              // Update visual feedback immediately
              e.currentTarget.style.background = `linear-gradient(to right, #7B00FF 0%, #7B00FF ${value * 100}%, #E5E7EB ${value * 100}%, #E5E7EB 100%)`
              // Update display value
              const displayEl = document.getElementById('volume-display')
              if (displayEl) displayEl.textContent = `${Math.round(value * 100)}%`
              
              if (currentlyPlayingId) {
                setVolume(value)
              }
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #7B00FF 0%, #7B00FF ${settings.volume * 100}%, #E5E7EB ${settings.volume * 100}%, #E5E7EB 100%)`,
              WebkitAppearance: 'none'
            }}
          />
          <div className="flex justify-between items-center text-xs text-text-tertiary mt-3">
            <VolumeX className="size-4" />
            <span className="text-text-secondary font-medium">50%</span>
            <Volume2 className="size-4" />
          </div>
        </div>
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
          {/* Message count badge for embedded mode */}
          {embedded && messageCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
            </Badge>
          )}
          
          
          {/* Settings button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="size-9"
            title="Chat Settings"
          >
            <Settings className="size-4" />
          </Button>
          
          {/* Export chat button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={exportChatAsMarkdown}
            className="size-9"
            title="Export chat as Markdown"
          >
            <FileText className="size-4" />
          </Button>
          
          {/* Exit button for embedded mode */}
          {embedded && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-9"
              title="Exit"
            >
              <X className="size-4" />
            </Button>
          )}
          
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
          onSuggestionClick={handleQuickAction}
          isDisabled={currentlyPlayingId !== null}
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
            autoFocus={embedded}
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
      
      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 w-[600px] max-w-[90vw] h-[auto] max-h-[85vh] bg-bg-primary rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
              style={{
                transformOrigin: 'center'
              }}
            >
              <div className="p-spacing-md border-b border-border-subtle flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Chat Settings</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSettingsOpen(false)}
                    className="size-8"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-spacing-md space-y-spacing-sm" style={{ overflowY: 'hidden' }}>
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-spacing-xs">Chat Preferences</h4>
                  <div className="space-y-spacing-xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-spacing-sm">
                        <Lightbulb className="size-4 text-text-secondary" />
                        <Label className="text-sm font-medium text-text-primary">
                          Response Style
                        </Label>
                      </div>
                      <div className="relative">
                        <select
                          value={responseStyle}
                          onChange={(e) => setResponseStyle(e.target.value)}
                          className="w-full h-10 px-4 pr-10 bg-bg-primary hover:bg-bg-emphasis border border-border-default hover:border-border-emphasis rounded-lg text-sm font-medium text-text-primary appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-bg-brand/20 focus:border-bg-brand"
                        >
                          <option value="balanced">Balanced</option>
                          <option value="concise">Concise & Direct</option>
                          <option value="detailed">Detailed & Thorough</option>
                          <option value="friendly">Friendly & Encouraging</option>
                          <option value="academic">Academic & Formal</option>
                          <option value="creative">Creative & Imaginative</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="size-4 text-text-secondary" />
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary px-1">
                        {responseStyle === 'balanced' && 'A mix of clarity and detail, suitable for most learning'}
                        {responseStyle === 'concise' && 'Short, direct answers focused on key points'}
                        {responseStyle === 'detailed' && 'Comprehensive explanations with examples'}
                        {responseStyle === 'friendly' && 'Warm, encouraging tone with positive reinforcement'}
                        {responseStyle === 'academic' && 'Formal, scholarly approach with technical precision'}
                        {responseStyle === 'creative' && 'Imaginative explanations with analogies and stories'}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-spacing-sm">
                        <BookOpen className="size-4 text-text-secondary" />
                        <Label className="text-sm font-medium text-text-primary">
                          Language Level
                        </Label>
                      </div>
                      <div className="relative">
                        <select
                          value={languageLevel}
                          onChange={(e) => setLanguageLevel(e.target.value)}
                          className="w-full h-10 px-4 pr-10 bg-bg-primary hover:bg-bg-emphasis border border-border-default hover:border-border-emphasis rounded-lg text-sm font-medium text-text-primary appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-bg-brand/20 focus:border-bg-brand"
                        >
                          <option value="elementary">Elementary</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="size-4 text-text-secondary" />
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary px-1">
                        {languageLevel === 'elementary' && 'Simple language, basic concepts'}
                        {languageLevel === 'intermediate' && 'Standard vocabulary, moderate complexity'}
                        {languageLevel === 'advanced' && 'Sophisticated language, nuanced explanations'}
                        {languageLevel === 'expert' && 'Technical terminology, professional level'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border-subtle pt-spacing-md">
                  <h4 className="text-sm font-medium text-text-primary mb-spacing-sm">Text-to-Speech</h4>
                  <SettingsPanel />
                </div>
              </div>
              
              <div className="border-t border-border-subtle p-spacing-md flex justify-end gap-spacing-xs flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSettingsOpen(false)}
                >
                  Apply Settings
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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