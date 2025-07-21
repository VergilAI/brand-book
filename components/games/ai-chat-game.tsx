'use client'

import React, { useState, useEffect } from 'react'
import { X, Bot, MessageSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import { Card } from '@/components/card'
import { Badge } from '@/components/atomic/badge'
import AIChatbotEnhanced from '@/components/Chat/AIChatbotEnhanced'
import { useChat } from '@/lib/chat/use-chat'
import { chatStorage } from '@/lib/chat/chat-storage'
import { motion } from 'framer-motion'

interface AIChatGameProps {
  lessonId: string
  lessonTitle?: string
  lessonTopic?: string
  onClose: () => void
  onComplete: (score: number) => void
}

export function AIChatGame({ 
  lessonId, 
  lessonTitle = 'Learning Session',
  lessonTopic = 'General Learning',
  onClose, 
  onComplete 
}: AIChatGameProps) {
  const [showIntro, setShowIntro] = useState(false) // Changed to false to skip intro
  const [chatMode, setChatMode] = useState<'tutor' | 'practice' | 'conversation'>('tutor')
  const [sessionStartTime] = useState(new Date())
  const [messageCount, setMessageCount] = useState(0)

  // Chat modes configuration
  const chatModes = {
    tutor: {
      title: 'AI Tutor',
      subtitle: 'Get help understanding concepts',
      icon: Bot,
      color: 'bg-bg-brand', // #7B00FF
      description: 'I\'ll help explain concepts, answer questions, and guide your learning.',
      systemContext: 'lesson'
    },
    practice: {
      title: 'Practice Partner',
      subtitle: 'Practice through conversation',
      icon: MessageSquare,
      color: 'bg-blue-600', // #0087FF
      description: 'Let\'s practice together! I\'ll help you apply what you\'ve learned.',
      systemContext: 'practice'
    },
    conversation: {
      title: 'Free Discussion',
      subtitle: 'Open-ended learning chat',
      icon: MessageSquare,
      color: 'bg-green-600', // #0F8A0F
      description: 'Let\'s have an open discussion about the topic.',
      systemContext: 'default'
    }
  }

  // Initialize chat session
  useEffect(() => {
    const sessionTitle = `${lessonTitle} - ${chatModes[chatMode].title}`
    chatStorage.createSession(sessionTitle, lessonId, lessonTopic)
  }, [lessonId, lessonTitle, lessonTopic, chatMode])

  // Track message count
  const handleMessageSent = () => {
    setMessageCount(prev => prev + 1)
  }

  // Calculate completion score based on engagement
  const calculateScore = () => {
    const sessionDuration = (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60 // minutes
    const engagementScore = Math.min(100, Math.round(
      (messageCount * 10) + // 10 points per message
      (sessionDuration * 5) + // 5 points per minute
      (messageCount >= 5 ? 20 : 0) // Bonus for sustained conversation
    ))
    return engagementScore
  }

  // Handle completion
  const handleComplete = () => {
    const score = calculateScore()
    const currentSession = chatStorage.getCurrentSession()
    
    if (currentSession) {
      currentSession.metadata = {
        ...currentSession.metadata,
        context: chatMode
      }
      chatStorage.saveSession(currentSession)
    }
    
    onComplete(score)
  }

  // Mode selection screen
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-bg-primary flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-spacing-lg border-b border-border-subtle">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">AI Learning Assistant</h2>
              <p className="text-text-secondary mt-1">Choose how you'd like to learn today</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-10"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Mode Selection */}
          <div className="p-spacing-xl">
            <div className="mb-spacing-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Lesson Topic</h3>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {lessonTopic}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-spacing-md">
              Select Learning Mode
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-md">
              {Object.entries(chatModes).map(([mode, config]) => {
                const Icon = config.icon
                return (
                  <Card
                    key={mode}
                    className="p-spacing-lg cursor-pointer hover:shadow-card-hover transition-all"
                    onClick={() => {
                      setChatMode(mode as typeof chatMode)
                      setShowIntro(false)
                    }}
                  >
                    <div className={`size-12 rounded-lg ${config.color} flex items-center justify-center mb-spacing-md`}>
                      <Icon className="size-6 text-text-inverse" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-1">
                      {config.title}
                    </h4>
                    <p className="text-sm text-text-secondary mb-spacing-sm">
                      {config.subtitle}
                    </p>
                    <p className="text-base text-text-primary">
                      {config.description}
                    </p>
                  </Card>
                )
              })}
            </div>

            <div className="mt-spacing-xl p-spacing-md bg-bg-secondary rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Tips for effective learning:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
                <li>Ask specific questions about concepts you don't understand</li>
                <li>Request examples to clarify difficult topics</li>
                <li>Practice applying what you've learned through discussion</li>
                <li>Don't hesitate to ask for clarification</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main chat interface
  const currentMode = chatModes[chatMode]
  
  return (
    <div className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-bg-primary flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-spacing-md border-b border-border-subtle bg-bg-secondary">
          <div className="flex items-center gap-spacing-sm">
            <div className={`size-10 rounded-lg ${currentMode.color} flex items-center justify-center`}>
              <currentMode.icon className="size-5 text-text-inverse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{currentMode.title}</h3>
              <p className="text-sm text-text-secondary">{lessonTopic}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-spacing-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Activities
            </Button>
            <Badge variant="secondary">
              {messageCount} messages
            </Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
            >
              Complete Session
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-9"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <AIChatbotEnhanced
            embedded={true}
            title={currentMode.title}
            subtitle={currentMode.subtitle}
            welcomeMessage={`Hello! ${currentMode.description} What would you like to explore about ${lessonTopic}?`}
            placeholder="Type your message..."
            maxHeight="100%"
            className="h-full"
            onMessageSent={handleMessageSent}
            chatContext={currentMode.systemContext}
            lessonTopic={lessonTopic}
            lessonContent={null} // Could be populated with actual lesson content
            sessionId={`session-${lessonId}-${Date.now()}`}
          />
        </div>

        {/* Footer Status */}
        <div className="p-spacing-sm border-t border-border-subtle bg-bg-secondary">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Session started {sessionStartTime.toLocaleTimeString()}</span>
            <span>Engagement score: {calculateScore()}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}