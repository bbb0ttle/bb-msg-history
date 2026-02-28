import type { Message } from '../types/index.js';

/**
 * Parse text content into message array
 * Format: `[timestamp] author: text` or `author: text` (one message per line)
 * Timestamp is optional for backward compatibility
 */
export function parseMessages(textContent: string | null): Message[] {
  const raw = textContent || '';
  const messages: Message[] = [];

  // Pattern: [timestamp] author: text (space between timestamp and author is optional)
  const timestampPattern = /^\[([^\]]+)\]\s*(.+)$/;

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let remainingLine = trimmed;
    let timestamp: string | undefined;

    // Try to extract timestamp
    const timestampMatch = trimmed.match(timestampPattern);
    if (timestampMatch) {
      timestamp = timestampMatch[1].trim();
      remainingLine = timestampMatch[2];
    }

    // Find the author:text separator (colon followed by space)
    const colonIdx = remainingLine.indexOf(':');
    if (colonIdx <= 0) continue;

    const author = remainingLine.slice(0, colonIdx).trim();
    const text = remainingLine.slice(colonIdx + 1).trim();

    if (author && text) {
      const message: Message = { author, text };
      if (timestamp) {
        message.timestamp = timestamp;
      }
      messages.push(message);
    }
  }

  return messages;
}
