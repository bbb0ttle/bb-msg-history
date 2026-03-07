import type { Message } from '../types/index.js';

/**
 * Parser interface for message parsing
 * Allows custom parsers to be plugged in
 */
export interface MessageParser {
  /**
   * Parse text content into message array
   * @param textContent - Raw text content to parse
   * @returns Array of parsed messages
   */
  parse(textContent: string | null): Message[];
}

/**
 * Input type for appending messages
 */
export interface MessageInput {
  author: string;
  text: string;
  timestamp?: string;
}
