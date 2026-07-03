/**
 * Moderation utility for checking mannerless or abusive language.
 */

export function containsAbusiveLanguage(text: string): { hasAbuse: boolean; matchedWord?: string } {
  if (!text) return { hasAbuse: false };
  
  // Clean punctuation and convert to lowercase for uniform check
  const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ");
  const words = cleanText.split(/\s+/);

  const bannedKeywords = [
    // English swear/rude words
    'fuck', 'fucker', 'fucking', 'bitch', 'bastard', 'asshole', 'shitty', 'dick', 'pussy', 
    'mannerless', 'abused', 'abusing', 'idiot', 'stupid', 'nonsense', 'fool', 'uneducated',
    // Hindi / Hinglish standard abuses
    'chutiya', 'gandu', 'behenchod', 'bhenchod', 'madarchod', 'bhadva', 'bhadve', 'harami', 
    'kamina', 'randi', 'bsdk', 'bhosdike', 'bhosd', 'lawda', 'lund', 'jhaat', 'chut', 'choot',
    'gand', 'gnd', 'saala', 'saale', 'kutta', 'kamine', 'kamini'
  ];

  // Specific exact word matches (like short forms that can be part of other words, e.g., 'mc', 'bc')
  const strictExactWords = ['mc', 'bc', 'wtf', 'ass', 'lnd', 'gnd', 'crap', 'shit'];

  // 1. Check direct word inclusion or substring (for longer banned keywords)
  for (const banned of bannedKeywords) {
    if (cleanText.includes(banned)) {
      return { hasAbuse: true, matchedWord: banned };
    }
  }

  // 2. Check strict exact words
  for (const word of words) {
    if (strictExactWords.includes(word)) {
      return { hasAbuse: true, matchedWord: word };
    }
  }

  return { hasAbuse: false };
}
