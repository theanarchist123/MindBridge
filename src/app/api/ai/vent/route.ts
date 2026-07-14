import { NextResponse } from 'next/server'
import { getOllamaClient } from '@/lib/ollama'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const SYSTEM_PROMPT = `You are an executive function assistant. 
The user is overwhelmed and has provided a disorganized 'brain dump' of their stressors. 
Your job is to de-escalate their cognitive load. 
1. Identify the 1 or 2 most urgent, actionable tasks from their vent.
2. Tell them the rest is noise and can wait. 
3. Provide a very brief, empathetic validation, followed by a bulleted checklist of the 1-2 next steps.
Do not reply as a conversational chatbot. Be structured, decisive, and calming. Keep it under 150 words.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })

    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return new NextResponse('Invalid input', { status: 400 })
    }

    const openai = getOllamaClient()
    
    const response = await openai.chat.completions.create({
      model: process.env.OLLAMA_MODEL || "llama3.2",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.3, // Low temperature for focused, structural output
    })

    const summary = response.choices[0]?.message?.content || "I couldn't process this right now, but please take a deep breath."

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Vent Box API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
