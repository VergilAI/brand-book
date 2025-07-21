'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atomic/button'
import { Input } from '@/components/atomic/input'
import { Card } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import { Avatar } from '@/components/atomic/avatar'
import { useTTS } from '@/hooks/use-tts'

const AIChatbot = ({ 
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
  autoTTS = true,
  onMessageSent,
  chatContext = 'default',
  lessonTopic = null
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
      isPlaying: false
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [ttsEnabled, setTtsEnabled] = useState(autoTTS)
  const [error, setError] = useState(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [ttsQueue, setTtsQueue] = useState([])
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  
  // TTS hook
  const { speak, stop: stopTTS, isPlaying: isTTSPlaying } = useTTS()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if user has scrolled up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  // Timestamp formatter
  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setError(null)
    
    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent()
    }

    // Make API call
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: messages.slice(-10),
          context: chatContext,
          lessonTopic: lessonTopic
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const aiResponse = {
        id: data.messageId,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isPlaying: false
      }

      setMessages(prev => [...prev, aiResponse])
      
      // Auto-play TTS if enabled
      if (ttsEnabled && autoTTS) {
        setTtsQueue(prev => [...prev, aiResponse.id])
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred while sending the message')
    } finally {
      setIsLoading(false)
    }
  }

  // Key press is now handled inline in the input element

  // Clear chat history
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        isPlaying: false
      }])
      setError(null)
    }
  }

  // Toggle TTS playing state for a message
  const toggleMessageTTS = (messageId, isPlaying) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying } : msg
    ))
    
    if (isPlaying) {
      setCurrentlyPlayingId(messageId)
    } else if (currentlyPlayingId === messageId) {
      setCurrentlyPlayingId(null)
      // Process next in queue
      processNextTTS()
    }
  }

  // Process TTS queue
  const processNextTTS = async () => {
    if (ttsQueue.length > 0 && !currentlyPlayingId && ttsEnabled) {
      const nextId = ttsQueue[0]
      setTtsQueue(prev => prev.slice(1))
      
      // Find the message and trigger TTS
      const message = messages.find(m => m.id === nextId)
      if (message && message.role === 'assistant') {
        // Use the TTS hook to speak
        await speak(
          message.content,
          () => toggleMessageTTS(message.id, true),  // onStart
          () => toggleMessageTTS(message.id, false)  // onEnd
        )
      }
    }
  }

  // Process TTS queue when it changes
  useEffect(() => {
    processNextTTS()
  }, [ttsQueue, currentlyPlayingId])
  
  // Stop TTS when component unmounts or TTS is disabled
  useEffect(() => {
    return () => {
      stopTTS()
    }
  }, [stopTTS])
  
  // Stop TTS when TTS is disabled
  useEffect(() => {
    if (!ttsEnabled) {
      stopTTS()
      setTtsQueue([])
      setCurrentlyPlayingId(null)
    }
  }, [ttsEnabled, stopTTS])

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => messages, [messages])

  // Position classes for floating widget
  const positionClasses = {
    'bottom-right': 'bottom-spacing-lg right-spacing-lg',
    'bottom-left': 'bottom-spacing-lg left-spacing-lg',
    'top-right': 'top-spacing-lg right-spacing-lg',
    'top-left': 'top-spacing-lg left-spacing-lg'
  }

  // Render message bubble
  const MessageBubble = React.memo(({ message }) => {
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
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          
          <div className={cn(
            'flex items-center gap-spacing-sm text-xs text-text-tertiary', // #71717A
            isUser ? 'justify-end' : 'justify-start'
          )}>
            <span>{formatTimestamp(message.timestamp)}</span>
            
            {!isUser && ttsEnabled && message.isPlaying && (
              <Badge variant="secondary" className="text-xs">
                Speaking...
              </Badge>
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
  })

  // Loading indicator
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="size-9"
            title={ttsEnabled ? 'Disable TTS' : 'Enable TTS'}
          >
            {ttsEnabled ? (
              <Volume2 className="size-4" />
            ) : (
              <VolumeX className="size-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="size-9"
            title="Clear chat"
          >
            <Trash2 className="size-4" />
          </Button>
          
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

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={cn(
          'flex-1 overflow-y-auto p-spacing-md', // 16px
          'space-y-spacing-md', // 16px gap
          'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
        )}
        style={{ maxHeight: embedded ? maxHeight : '400px' }}
      >
        <AnimatePresence>
          {memoizedMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingIndicator />}
        </AnimatePresence>
        
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
              onClick={scrollToBottom}
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
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={placeholder}
            disabled={isLoading}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-no-animate="true"
            className=""
            style={{
              // Reset all inherited styles and ensure no CSS can override
              all: 'unset',
              // Critical: Force text color with maximum specificity
              color: '#1f2937 !important',
              WebkitTextFillColor: '#1f2937 !important',
              textFillColor: '#1f2937 !important',
              WebkitBackgroundClip: 'initial !important',
              backgroundClip: 'initial !important',
              // Layout
              display: 'block',
              width: '100%',
              height: '48px',
              padding: '0 16px',
              boxSizing: 'border-box',
              // Typography
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '400',
              lineHeight: '48px',
              // Background and border
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              // Disable all animations, transitions, and transforms
              transition: 'none !important',
              animation: 'none !important',
              transform: 'none !important',
              willChange: 'auto !important',
              // Ensure text stays visible
              opacity: isLoading ? '0.6' : '1',
              filter: 'none !important',
              // Focus styles
              outline: 'none',
              // Cursor
              cursor: isLoading ? 'not-allowed' : 'text',
              // Prevent any gradient text issues
              background: 'transparent !important',
              backgroundImage: 'none !important',
              // Force normal text rendering
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #3b82f6'
              e.target.style.outlineOffset = '2px'
              // Ensure color stays visible on focus
              e.target.style.color = '#1f2937 !important'
              e.target.style.WebkitTextFillColor = '#1f2937 !important'
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none'
              // Ensure color stays visible on blur
              e.target.style.color = '#1f2937 !important'
              e.target.style.WebkitTextFillColor = '#1f2937 !important'
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="md"
            className="px-spacing-md"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
          </Button>
        </div>
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

export default AIChatbot