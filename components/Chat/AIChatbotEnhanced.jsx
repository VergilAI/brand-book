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
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [error, setError] = useState(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [ttsQueue, setTtsQueue] = useState([])
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  
  // TTS hooks and settings
  const { settings, updateSettings } = useTTSSettings()
  // Single TTS instance for all messages
  const { speak, pause, resume, stop, setPlaybackRate, setVolume, isPlaying, isPaused, error: ttsError } = useTTS()

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

  // Handle typing detection
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      // Pause all TTS when typing
      if (currentlyPlayingId && isPlaying) {
        pause()
      }
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      // Resume TTS if it was paused due to typing
      if (currentlyPlayingId && isPaused && !isPlaying) {
        resume()
      }
    }, 1000)
  }, [isTyping, currentlyPlayingId, isPlaying, isPaused, pause, resume])

  // Handle message sending
  const handleSendMessage = async (messageText = inputValue.trim()) => {
    if (!messageText) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setError(null)
    setIsTyping(false)
    
    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent()
    }

    // Build context message
    let contextMessage = ''
    if (lessonContent) {
      contextMessage = `Current lesson topic: ${lessonTopic}\n\nLesson content for reference:\n${lessonContent}\n\n`
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
          message: contextMessage + userMessage.content,
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
        isPlaying: false,
        currentWordIndex: -1
      }

      setMessages(prev => [...prev, aiResponse])
      
      // Auto-play TTS if enabled
      if (settings.autoTTS) {
        setTtsQueue(prev => [...prev, aiResponse.id])
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred while sending the message')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle quick actions
  const handleQuickAction = (action) => {
    handleSendMessage(action.prompt)
  }

  // Toggle message TTS
  const toggleMessageTTS = useCallback(async (messageId) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return
    
    if (message.isPlaying && currentlyPlayingId === messageId) {
      pause()
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ))
    } else if (currentlyPlayingId === messageId && isPaused) {
      resume()
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: true } : msg
      ))
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
            msg.id === messageId ? { ...msg, isPlaying: false, currentWordIndex: -1 } : msg
          ))
          setCurrentlyPlayingId(null)
          processNextTTS()
        },
        onProgress: ({ currentWordIndex }) => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, currentWordIndex } : msg
          ))
        }
      })
    }
  }, [messages, currentlyPlayingId, isPaused, settings, speak, pause, resume])

  // Stop a specific message
  const stopMessage = (messageId) => {
    stop()
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying: false, currentWordIndex: -1 } : msg
    ))
    if (currentlyPlayingId === messageId) {
      setCurrentlyPlayingId(null)
    }
  }

  // Stop all TTS
  const stopAllTTS = () => {
    stop()
    setMessages(prev => prev.map(msg => ({ 
      ...msg, 
      isPlaying: false, 
      currentWordIndex: -1 
    })))
    setCurrentlyPlayingId(null)
    setTtsQueue([])
  }

  // Skip to next message
  const skipToNext = () => {
    if (currentlyPlayingId) {
      stopMessage(currentlyPlayingId)
    }
    processNextTTS()
  }

  // Process TTS queue - don't include in dependency arrays to avoid loops
  const processNextTTS = () => {
    if (ttsQueue.length === 0 || currentlyPlayingId || !settings.autoTTS || isTyping) {
      return
    }
    
    const nextId = ttsQueue[0]
    setTtsQueue(prev => prev.slice(1))
    
    // Delay to ensure state updates have propagated
    setTimeout(() => {
      toggleMessageTTS(nextId)
    }, 100)
  }

  // Only process queue when playback ends or queue changes
  useEffect(() => {
    if (!currentlyPlayingId && ttsQueue.length > 0 && !isTyping && settings.autoTTS) {
      const timer = setTimeout(() => {
        processNextTTS()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [currentlyPlayingId, ttsQueue.length, isTyping, settings.autoTTS])

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
    if (message.role !== 'assistant' || message.currentWordIndex < 0) {
      return <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
    }

    const words = message.content.split(' ')
    return (
      <p className="text-base leading-relaxed whitespace-pre-wrap">
        {words.map((word, index) => (
          <span
            key={index}
            className={cn(
              'cursor-pointer transition-colors',
              index === message.currentWordIndex && 'bg-yellow-200 dark:bg-yellow-900'
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
                      msg.id === message.id ? { ...msg, isPlaying: false, currentWordIndex: -1 } : msg
                    ))
                    setCurrentlyPlayingId(null)
                  },
                  onProgress: ({ currentWordIndex }) => {
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id ? { ...msg, currentWordIndex } : msg
                    ))
                  }
                })
              }
            }}
          >
            {word}{' '}
          </span>
        ))}
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

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => messages, [messages])

  // Memoized input component to prevent re-renders
  const ChatInput = React.memo(({ onSend, onTyping, isLoading, placeholder, value, onChange }) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (value.trim() && !isLoading) {
          onSend(value)
        }
      }
    }
    
    const handleChange = (e) => {
      onChange(e.target.value)
      onTyping()
    }
    
    return (
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          all: 'unset',
          display: 'block',
          width: '100%',
          height: '48px',
          padding: '0 16px',
          boxSizing: 'border-box',
          fontSize: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: '400',
          lineHeight: '48px',
          color: '#1f2937',
          WebkitTextFillColor: '#1f2937',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          opacity: isLoading ? '0.6' : '1',
          cursor: isLoading ? 'not-allowed' : 'text',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.outline = '2px solid #3b82f6'
          e.target.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none'
        }}
      />
    )
  }, (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return prevProps.value === nextProps.value && 
           prevProps.isLoading === nextProps.isLoading &&
           prevProps.placeholder === nextProps.placeholder
  })

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
                  onClick={() => toggleMessageTTS(message.id)}
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
          <ChatInput 
            value={inputValue}
            onChange={setInputValue}
            onTyping={handleTypingStart}
            onSend={(text) => {
              handleSendMessage(text)
              setInputValue('')
            }}
            isLoading={isLoading}
            placeholder={placeholder}
          />
          <Button
            onClick={() => {
              if (inputValue.trim()) {
                handleSendMessage(inputValue)
                setInputValue('')
              }
            }}
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
        
        {isTyping && (
          <div className="mt-spacing-xs text-xs text-text-secondary">
            TTS paused while typing...
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