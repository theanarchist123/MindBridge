import OpenAI from 'openai';

const getLocalClient = () => {
  let baseURL = process.env.OLLAMA_BASE_URL || '';
  baseURL = baseURL.replace('api.ollama.com', 'ollama.com');
  const finalBaseURL = baseURL.endsWith('/v1') ? baseURL : `${baseURL}/v1`;
  
  return new OpenAI({
    baseURL: finalBaseURL,
    apiKey: process.env.OLLAMA_API_KEY || 'ollama',
  });
}

export async function analyzeAndTranslateHinglish(text: string): Promise<string> {
  // 100% FREE AND LOCAL ALTERNATIVE TO BHASHINI API
  // This uses your existing local Ollama instance to translate Hinglish to English
  // before the crisis keyword detection runs.
  
  try {
    const client = getLocalClient();
    
    const response = await client.chat.completions.create({
      model: process.env.OLLAMA_MODEL || 'llama3',
      messages: [
        { 
          role: 'system', 
          content: 'You are a translation assistant. The user will provide text that may contain Romanized Hindi (Hinglish) or mixed Hinglish/English. Translate any Hinglish to English. Keep the original English intact. Output ONLY the translated text, no explanations, no conversational filler. If it is already fully English, just output the exact same text.' 
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.1,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error("Local Translation Error:", error);
    // Fallback to original text if Ollama fails or is offline
    return text; 
  }
}
