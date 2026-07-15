// Local toxicity analyzer replacing external API dependency
// This uses a predefined list of offensive terms to calculate a basic toxicity score.

const PROFANITY_LIST = new Set([
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard', 'slut', 'whore',
  'faggot', 'nigger', 'spic', 'chink', 'retard', 'kill yourself', 'die', 'kys',
  'motherfucker', 'cock', 'twat', 'wanker', 'prick', 'dumbass', 'dipshit', 'jackass'
]);

export async function analyzeToxicity(text: string): Promise<number> {
  // Normalize text: lowercase and remove basic punctuation
  const normalizedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  const words = normalizedText.split(/\s+/);
  
  let toxicWordCount = 0;
  
  for (const word of words) {
    if (PROFANITY_LIST.has(word)) {
      toxicWordCount++;
    }
  }

  // Check for exact phrase matches (like "kill yourself")
  if (normalizedText.includes('kill yourself') || normalizedText.includes('kys')) {
    toxicWordCount += 2;
  }

  // Calculate a basic score (0.0 to 1.0)
  // If even one severe toxic word is found, score jumps to > 0.8
  let score = 0.0;
  if (toxicWordCount > 0) {
    score = Math.min(0.85 + (toxicWordCount * 0.05), 1.0);
  } else {
    // Add a tiny bit of noise so it's not always exactly 0.0 for benign text
    score = Math.random() * 0.1;
  }

  return score;
}
