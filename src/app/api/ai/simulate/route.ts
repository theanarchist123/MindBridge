import { NextResponse } from 'next/server'
import { getOllamaClient, streamMindBotResponse } from '@/lib/ollama'

export async function POST(req: Request) {
  try {
    const { scenario, difficulty, messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid messages format', { status: 400 })
    }

    const systemPrompt = `You are a conversational roleplay partner in a simulation sandbox designed to help college students practice difficult conversations.
The user wants to practice this scenario: "${scenario}".
The difficulty/defensiveness level is: ${difficulty} (on a scale where 'easy' is understanding, 'medium' is somewhat resistant, and 'hard' is defensive and stubborn).
Adopt the persona of the person they need to talk to. Stay in character completely. Respond realistically to what they say. Do not break character. Do not be overly helpful unless they actually say the right things to de-escalate you.`

    // Prepend the system prompt to the messages
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const stream = await streamMindBotResponse(fullMessages)

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
        } catch (err) {
          console.error('Stream error:', err)
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Simulation API Error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
