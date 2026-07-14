import { NextResponse } from 'next/server'
import { getOllamaClient } from '@/lib/ollama'

const SYSTEM_PROMPT = `You are a Cognitive Behavioral Therapy (CBT) assistant.
The user will provide an anxious or negative thought.
You must identify the primary cognitive distortion (e.g. Catastrophizing, All-or-Nothing Thinking, Mind Reading, Fortune Telling, etc.).
Then, provide a brief rationale for why the thought exhibits this distortion.
Finally, provide a 'balanced thought' that is more realistic and grounded.

You MUST respond with valid JSON ONLY in this exact format, with no markdown formatting or backticks:
{
  "distortionType": "Name of Distortion",
  "rationale": "Brief explanation",
  "balancedThought": "The restructured thought"
}`;

export async function POST(req: Request) {
  try {
    const { thought } = await req.json()
    if (!thought || typeof thought !== 'string') {
      return new NextResponse('Invalid input', { status: 400 })
    }

    const openai = getOllamaClient()
    
    const response = await openai.chat.completions.create({
      model: process.env.OLLAMA_MODEL || "llama3.2",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: thought }
      ],
      temperature: 0.1, // Very low temp to ensure JSON format
    })

    const rawText = response.choices[0]?.message?.content || "{}"
    // Strip markdown JSON block if present
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    let parsed = {}
    try {
      parsed = JSON.parse(cleanText)
    } catch (e) {
      console.error("Failed to parse JSON from AI:", cleanText)
      parsed = {
        distortionType: "Cognitive Distortion",
        rationale: "This thought contains elements of anxiety or stress that may be magnifying the negative aspects of the situation.",
        balancedThought: "I am feeling stressed, but I can handle this one step at a time."
      }
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Detangle API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
