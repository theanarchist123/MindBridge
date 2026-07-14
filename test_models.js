const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });
const getOllamaClient = () => {
  let baseURL = process.env.OLLAMA_BASE_URL || '';
  baseURL = baseURL.replace('api.ollama.com', 'ollama.com');
  const finalBaseURL = baseURL.endsWith('/v1') ? baseURL : baseURL + '/v1';
  return new OpenAI({ baseURL: finalBaseURL, apiKey: process.env.OLLAMA_API_KEY });
};
const client = getOllamaClient();
const modelsToTest = ['gemma3:4b', 'ministral-3:3b', 'ministral-3:8b', 'gpt-oss:20b', 'qwen3-coder-next'];
(async () => {
  for (const model of modelsToTest) {
    try {
      console.log('Testing ' + model + '...');
      const res = await client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: 'Say hello!' }],
        max_tokens: 10
      });
      console.log('SUCCESS with ' + model + ':', res.choices[0].message.content);
      return;
    } catch (err) {
      console.log('FAILED ' + model + ':', err.message);
    }
  }
})();
