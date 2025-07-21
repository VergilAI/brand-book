import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10
const MAX_CHAT_HISTORY = 10
const MAX_INPUT_LENGTH = 2000
const DEFAULT_MAX_TOKENS = 500

// Only use Anthropic API
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// System prompts for different contexts
const SYSTEM_PROMPTS = {
  default: `You are an AI learning assistant integrated into an educational platform. Your role is to:
- Help students understand concepts clearly and thoroughly
- Provide encouraging and supportive responses
- Break down complex topics into understandable parts
- Use examples and analogies when helpful
- Ask clarifying questions when needed
- Maintain a friendly, professional tone
- Keep responses concise but informative
- Encourage critical thinking and exploration
- Never provide direct answers to assessments or exams
- Guide students to find answers themselves when appropriate`,
  
  lesson: `You are an AI tutor helping a student with a specific lesson. Focus on:
- Explaining concepts related to the current lesson topic
- Providing relevant examples from the lesson material
- Checking understanding with follow-up questions
- Offering practice exercises when appropriate
- Staying within the scope of the lesson content`,
  
  practice: `You are an AI practice partner. Your role is to:
- Engage in conversational practice
- Correct mistakes gently and constructively
- Provide alternative phrasings
- Explain grammar and usage when needed
- Encourage the student to express themselves
- Adapt to the student's skill level`
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input: string): string {
  // Remove any potential harmful characters or patterns
  return input
    .trim()
    .substring(0, MAX_INPUT_LENGTH)
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .replace(/\\/g, '\\\\') // Escape backslashes
}

// Format chat history for OpenAI API
function formatChatHistory(history: any[]): any[] {
  // Take only the last MAX_CHAT_HISTORY messages
  const recentHistory = history.slice(-MAX_CHAT_HISTORY)
  
  return recentHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: sanitizeInput(msg.content)
  }))
}

// Check rate limit
function checkRateLimit(clientId: string): { allowed: boolean; remainingRequests: number } {
  const now = Date.now()
  const clientData = rateLimitStore.get(clientId)
  
  // Clean up old entries
  if (clientData && now > clientData.resetTime) {
    rateLimitStore.delete(clientId)
  }
  
  // Check current client
  if (clientData && now <= clientData.resetTime) {
    if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
      return { 
        allowed: false, 
        remainingRequests: 0 
      }
    }
    
    clientData.count++
    return { 
      allowed: true, 
      remainingRequests: RATE_LIMIT_MAX_REQUESTS - clientData.count 
    }
  }
  
  // New client or reset window
  rateLimitStore.set(clientId, {
    count: 1,
    resetTime: now + RATE_LIMIT_WINDOW
  })
  
  return { 
    allowed: true, 
    remainingRequests: RATE_LIMIT_MAX_REQUESTS - 1 
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting
    const headersList = headers()
    const clientId = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'anonymous'
    
    // Check rate limit
    const { allowed, remainingRequests } = checkRateLimit(clientId)
    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please wait before sending more messages.',
          retryAfter: 60 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
          }
        }
      )
    }
    
    // Parse request body
    const body = await request.json()
    const { 
      message, 
      chatHistory = [], 
      context = 'default',
      lessonTopic = null,
      maxTokens = DEFAULT_MAX_TOKENS 
    } = body
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }
    
    const sanitizedMessage = sanitizeInput(message)
    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }
    
    // Check for Anthropic API key
    if (!ANTHROPIC_API_KEY) {
      console.error('No Anthropic API key found in environment variables')
      return NextResponse.json(
        { error: 'AI service is not configured. Please set ANTHROPIC_API_KEY in your environment variables.' },
        { status: 500 }
      )
    }
    
    // Prepare system prompt
    let systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.default
    if (lessonTopic) {
      systemPrompt += `\n\nCurrent lesson topic: ${lessonTopic}`
    }
    
    let aiResponse: string
    let usage: any = {}
    
    // Use Anthropic Claude API
    try {
      // Format messages for Claude
      const claudeMessages = formatChatHistory(chatHistory).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
      claudeMessages.push({ role: 'user', content: sanitizedMessage })
      
      // Make request to Anthropic
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Fast and cost-effective model
          system: systemPrompt,
          messages: claudeMessages,
          temperature: 0.7,
          max_tokens: Math.min(maxTokens, 1000)
        })
      })
      
      if (!anthropicResponse.ok) {
        const errorData = await anthropicResponse.json()
        console.error('Anthropic API error:', errorData)
        
        if (anthropicResponse.status === 429) {
          return NextResponse.json(
            { error: 'AI service is currently busy. Please try again in a moment.' },
            { status: 503 }
          )
        }
        
        return NextResponse.json(
          { error: 'Failed to generate response. Please try again.' },
          { status: 500 }
        )
      }
      
      const claudeData = await anthropicResponse.json()
      aiResponse = claudeData.content[0]?.text || 'I apologize, but I was unable to generate a response.'
      usage = {
        promptTokens: claudeData.usage?.input_tokens || 0,
        completionTokens: claudeData.usage?.output_tokens || 0,
        totalTokens: (claudeData.usage?.input_tokens || 0) + (claudeData.usage?.output_tokens || 0)
    } catch (error) {
      console.error('Error in Anthropic API request:', error)
      throw error
    }
    
    // Generate message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Return successful response
    return NextResponse.json(
      {
        response: aiResponse,
        messageId,
        usage
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': remainingRequests.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        }
      }
    )
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}