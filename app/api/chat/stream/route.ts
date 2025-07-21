import { NextRequest } from 'next/server'

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
  return input
    .trim()
    .slice(0, MAX_INPUT_LENGTH)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
}

// Format chat history for API
function formatChatHistory(history: any[]): any[] {
  return history
    .filter(msg => msg.role && msg.content)
    .slice(-MAX_CHAT_HISTORY)
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: sanitizeInput(msg.content)
    }))
}

// Check rate limit
function checkRateLimit(clientId: string): boolean {
  const now = Date.now()
  const clientData = rateLimitStore.get(clientId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }
  
  if (now > clientData.resetTime) {
    clientData.count = 0
    clientData.resetTime = now + RATE_LIMIT_WINDOW
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  clientData.count++
  rateLimitStore.set(clientId, clientData)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { message, chatHistory = [], context = 'default', lessonTopic, maxTokens = DEFAULT_MAX_TOKENS } = body
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Get client identifier for rate limiting
    const headersList = await request.headers
    const clientId = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'anonymous'
    
    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending more messages.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Sanitize input
    const sanitizedMessage = sanitizeInput(message)
    
    // Get appropriate system prompt
    let systemPrompt = SYSTEM_PROMPTS[context as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.default
    
    // Add lesson context if provided
    if (lessonTopic) {
      systemPrompt += `\n\nCurrent lesson topic: ${lessonTopic}. Focus your responses on this topic and relate examples back to it when possible.`
    }
    
    // Check if Anthropic API key is configured
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY in your environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Stream response using Anthropic
    // Create streaming response for Anthropic
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                messages: [
                  ...formatChatHistory(chatHistory),
                  { role: 'user', content: sanitizedMessage }
                ],
                system: systemPrompt,
                max_tokens: Math.min(maxTokens, 2000),
                temperature: 0.7,
                stream: true
              })
            })
            
            if (!response.ok) {
              const errorText = await response.text()
              console.error('Anthropic API error:', response.status, errorText)
              throw new Error(`Anthropic API error: ${response.status} - ${errorText}`)
            }
            
            const reader = response.body?.getReader()
            if (!reader) throw new Error('No response body')
            
            const decoder = new TextDecoder()
            
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
                    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`))
                    }
                  } catch (e) {
                    console.error('Error parsing chunk:', e)
                  }
                }
              }
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
            controller.close()
          }
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}