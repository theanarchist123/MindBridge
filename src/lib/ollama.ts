import OpenAI from 'openai'

export const getOllamaClient = () => {
  let baseURL = process.env.OLLAMA_BASE_URL || '';
  baseURL = baseURL.replace('api.ollama.com', 'ollama.com');
  const finalBaseURL = baseURL.endsWith('/v1') ? baseURL : `${baseURL}/v1`;
  
  return new OpenAI({
    baseURL: finalBaseURL,
    apiKey: process.env.OLLAMA_API_KEY,
  });
}

const ollama = getOllamaClient()

export const MINDBOT_SYSTEM_PROMPT = `You are MindBot, a companion for Indian college students on the MindBridge platform.

YOUR ROLE & MEMORY:
- You have memory of past conversations and the user's recent mental health assessments.
- Use this context! If they had a rough week recently, check in on it. Notice patterns across sessions without being asked.
- Speak naturally and warmly, like a supportive friend, not a textbook.
- Shift your tone based on their history: be gentler if they have been scoring high on depression/anxiety lately.
- End sessions with a small signal of continuity (e.g., "I'll remember this for next time. Take care.").

YOUR HARD LIMITS (NEVER cross these):
- Never diagnose a medical condition or recommend medications.
- Never claim to be a therapist.
- Never engage with graphic descriptions of self-harm.
- CRISIS PROTOCOL: If the student expresses suicidal ideation or self-harm intent, IMMEDIATELY drop the "warm companion" persona. Switch to a direct, calm, firm tone. Provide crisis resources and urge them to use the Crisis button. Do NOT try to counsel them out of it yourself.

CRISIS RESOURCES (always include when student mentions self-harm/suicide):
- KIRAN (Govt. of India): 1800-599-0019 (24/7 National Toll-Free)
- Vandrevala Foundation: 9999 666 555 (24/7 Multilingual)

TONE: Culturally aware of Indian college context (board exam pressure, parental expectations, JEE/NEET stress, hostel life). Occasional Hindi phrases OK if natural.`

export async function streamMindBotResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  contextStr: string = ""
) {
  const stream = await ollama.chat.completions.create({
    model: process.env.OLLAMA_MODEL || 'llama3.2',
    messages: [
      { role: 'system', content: MINDBOT_SYSTEM_PROMPT + contextStr },
      ...messages,
    ],
    stream: true,
    max_tokens: 512,
    temperature: 0.7,
  })
  return stream
}

export async function summarizeMindBotHistory(
  oldMessages: { role: string; content: string }[],
  existingSummary: string = ""
): Promise<string> {
  if (!oldMessages || oldMessages.length === 0) return existingSummary;

  const chatTranscript = oldMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  
  const prompt = `You are an expert summarizer. Compress the following chat transcript into a concise, factual summary of the user's emotional state, key life events discussed, and any coping mechanisms agreed upon. 
Do not include conversational filler. Keep it brief.

Existing summary to build upon (if any):
${existingSummary}

New chat transcript to integrate:
${chatTranscript}

Return ONLY the updated synthesized summary.`;

  try {
    const res = await ollama.chat.completions.create({
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
    return res.choices[0]?.message?.content || existingSummary;
  } catch (e) {
    console.error("Failed to summarize history:", e);
    return existingSummary;
  }
}

export function detectCrisisKeywords(text: string): boolean {
  const crisisTerms = [
    // English
    'kill myself', 'want to die', 'end my life', 'suicide', 'self harm',
    'hurt myself', 'cut myself', 'no reason to live', 'better off dead',
    'don\'t want to be here', 'not worth living', 'can\'t keep doing this',
    // Hinglish / Hindi
    'marne ka man', 'khatam karna', 'nahi jeena', 'mar jana chahta',
    'zindagi se thak', 'kuch nahi bacha', 'jaan deni', 'himmat nahi'
  ]
  const lower = text.toLowerCase()
  return crisisTerms.some(term => lower.includes(term))
}
