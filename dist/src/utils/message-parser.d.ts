import type { Message } from '../types/index.js';
/**
 * Parse text content into message array
 * Format: `author: text` (one message per line)
 */
export declare function parseMessages(textContent: string | null): Message[];
