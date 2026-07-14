import { NextResponse } from 'next/server'
import { streamMindBotResponse, detectCrisisKeywords } from '@/lib/ollama'
import connectDB from '@/lib/mongoose'
import CounsellorAlert from '@/models/CounsellorAlert'
import MindBotMemory from '@/models/MindBotMemory'
import Assessment from '@/models/Assessment'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import User from '@/models/User'
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ messages: [] })
    
    await connectDB()
    const user = await User.findById((session.user as any).id)
    if (!user?.mindbotMemoryEnabled) {
      return NextResponse.json({ messages: [] })
    }

    const memory = await MindBotMemory.findOne({ userId: (session.user as any).id })
    
    // Map to the simple { role, content } format the frontend expects
    const formattedMessages = (memory?.messages || []).map((m: any) => ({
      role: m.role,
      content: m.content
    }))
    
    return NextResponse.json({ messages: formattedMessages })
  } catch (error: any) {
    console.error('MindBot Chat GET Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Invalid messages format', { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]

    let detectedCrisis = false;

    // Passive NLP Crisis Detection
    if (lastMessage && lastMessage.role === 'user') {
      const isCrisis = detectCrisisKeywords(lastMessage.content)
      
      if (isCrisis) {
        detectedCrisis = true;
        // Log alert asynchronously in the background
        const session = await getServerSession(authOptions)
        if (session?.user) {
          connectDB().then(async () => {
            const user = await User.findById((session.user as any).id)
            await CounsellorAlert.create({
              college: user?.college || 'Generic University',
              severity: 'critical',
              source: 'crisis_mode',
              status: 'open',
            })
          }).catch(console.error)
        }
      }
    }

    // 1. Fetch user session and inject context if available
    const session = await getServerSession(authOptions)
    let contextStr = ""
    let userId = session?.user ? (session.user as any).id : null;
    let mindbotMemoryEnabled = false;
    let memoryDoc: any = null;

    if (userId) {
      await connectDB()
      const user = await User.findById(userId);
      mindbotMemoryEnabled = user?.mindbotMemoryEnabled || false;

      if (mindbotMemoryEnabled) {
        // Save user message to memory
        memoryDoc = await MindBotMemory.findOneAndUpdate(
          { userId },
          { 
            $push: { messages: { role: 'user', content: lastMessage.content, timestamp: new Date() } },
            $setOnInsert: { userId }
          },
          { upsert: true, new: true }
        );

        if (memoryDoc?.summary) {
          contextStr += `\n[SUMMARY OF OLDER CONVERSATIONS]\n${memoryDoc.summary}\n`;
        }

        // Greeting callback: If this is the start of a session but we have history, remind the bot to refer to it
        if (messages.length === 1 && memoryDoc && (memoryDoc.messages.length > 1 || memoryDoc.summary)) {
          contextStr += `\n[INSTRUCTION]: This is a returning user starting a new session. Read the summary above or your history, and start your first reply by warmly referring back to what they discussed last time. Do not use a generic greeting.\n`;
        }
      }
      
      // Fetch recent assessments for context
      const recentAssessments = await Assessment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();
        
      if (recentAssessments.length > 0) {
        contextStr += `\n[BACKGROUND CONTEXT FOR THIS USER]\n` +
          `User has recently taken these assessments:\n` +
          recentAssessments.map(a => `- ${a.type}: Score ${a.totalScore} (Tier ${a.tier})`).join('\n') +
          `\nAdjust your tone based on this. If scores are high/severe, be extra gentle and proactive.`
      }
    }

    // Cap the messages sent to the prompt to the last 10
    const boundedMessages = messages.slice(-10);

    // Call local Ollama via OpenAI SDK helper
    const stream = await streamMindBotResponse(boundedMessages, contextStr)

    // Convert the OpenAI AsyncIterable stream into a standard Web ReadableStream
    let fullAssistantMessage = "";
    
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullAssistantMessage += content;
              controller.enqueue(encoder.encode(content))
            }
          }
        } catch (err) {
          console.error('Stream error:', err)
          controller.error(err)
        } finally {
          // Stream finished, save the assistant's complete message
          if (userId && fullAssistantMessage && mindbotMemoryEnabled) {
            // Find and update memory, then trigger background summarization if > 10 messages
            MindBotMemory.findOneAndUpdate(
              { userId },
              { 
                $push: { messages: { role: 'assistant', content: fullAssistantMessage, timestamp: new Date() } }
              },
              { new: true }
            ).then(async (updatedMemory) => {
              if (updatedMemory && updatedMemory.messages.length > 10) {
                // Background summary processing
                const messagesToSummarize = updatedMemory.messages.slice(0, updatedMemory.messages.length - 10);
                const { summarizeMindBotHistory } = await import('@/lib/ollama');
                
                const newSummary = await summarizeMindBotHistory(messagesToSummarize, updatedMemory.summary);
                
                await MindBotMemory.findOneAndUpdate(
                  { userId },
                  {
                    $set: { summary: newSummary },
                    // keep only the last 10 messages
                    $push: { messages: { $each: [], $slice: -10 } }
                  }
                );
              }
            }).catch(err => console.error("Failed to save/summarize assistant message:", err));
          }
          controller.close()
        }
      },
    })

    const headers: Record<string, string> = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    };

    if (detectedCrisis) {
      headers['X-Crisis-Detected'] = 'true';
    }

    return new Response(readableStream, { headers });
  } catch (error: any) {
    console.error('MindBot Chat API Error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
