import type { Message } from '../types/index.js';

/**
 * Parse text content into message array
 * Format: `author: text` (one message per line)
 */
export function parseMessages(textContent: string | null): Message[] {
  const raw = textContent || '';
  const messages: Message[] = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx <= 0) continue;

    const author = trimmed.slice(0, colonIdx).trim();
    const text = trimmed.slice(colonIdx + 1).trim();

    if (author && text) {
      messages.push({ author, text });
    }
  }

  return messages;
}
