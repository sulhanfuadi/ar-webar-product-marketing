import { chatbotContent } from '../config/content';

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreFaq(query, faqItem) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  return faqItem.intents.reduce((score, intent) => {
    const normalizedIntent = normalize(intent);
    if (normalizedQuery === normalizedIntent) return score + 4;
    if (normalizedQuery.includes(normalizedIntent)) return score + 2;
    if (normalizedIntent.split(' ').some((token) => normalizedQuery.includes(token))) return score + 1;
    return score;
  }, 0);
}

export function getChatbotReply(question) {
  const rankedFaq = chatbotContent.faq
    .map((item) => ({ item, score: scoreFaq(question, item) }))
    .sort((left, right) => right.score - left.score);

  const bestMatch = rankedFaq[0];
  if (!bestMatch || bestMatch.score <= 0) {
    return {
      type: 'fallback',
      answer: chatbotContent.fallbackResponse,
    };
  }

  return {
    type: 'faq',
    answer: bestMatch.item.answer,
    matchedQuestion: bestMatch.item.question,
  };
}

export function createInitialMessages() {
  return [
    {
      role: 'assistant',
      text: chatbotContent.greeting,
    },
  ];
}
