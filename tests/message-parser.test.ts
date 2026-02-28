import { describe, it, expect } from 'vitest';
import { parseMessages } from '../src/utils/message-parser.js';

describe('parseMessages', () => {
  describe('basic parsing (no timestamp)', () => {
    it('should parse simple author: text format', () => {
      const input = 'alice: Hello world';
      const result = parseMessages(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world' });
    });

    it('should parse multiple messages', () => {
      const input = 'alice: Hello\nbob: Hi there\nalice: How are you?';
      const result = parseMessages(input);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello' });
      expect(result[1]).toEqual({ author: 'bob', text: 'Hi there' });
      expect(result[2]).toEqual({ author: 'alice', text: 'How are you?' });
    });

    it('should skip empty lines', () => {
      const input = 'alice: Hello\n\n\nbob: Hi';
      const result = parseMessages(input);
      expect(result).toHaveLength(2);
    });

    it('should skip lines without colon', () => {
      const input = 'alice: Hello\ninvalid line\nbob: Hi';
      const result = parseMessages(input);
      expect(result).toHaveLength(2);
    });

    it('should handle empty input', () => {
      expect(parseMessages('')).toEqual([]);
      expect(parseMessages(null)).toEqual([]);
    });

    it('should trim whitespace from author and text', () => {
      const input = '  alice  :  Hello world  ';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world' });
    });
  });

  describe('timestamp parsing', () => {
    it('should parse message with timestamp', () => {
      const input = '[10:30] alice: Hello world';
      const result = parseMessages(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world', timestamp: '10:30' });
    });

    it('should parse message with timestamp without space', () => {
      const input = '[10:30]alice: Hello world';
      const result = parseMessages(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world', timestamp: '10:30' });
    });

    it('should parse message with date timestamp', () => {
      const input = '[2024-01-15] alice: Hello world';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world', timestamp: '2024-01-15' });
    });

    it('should parse message with timestamp containing spaces', () => {
      const input = '[10:30 AM] alice: Hello world';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello world', timestamp: '10:30 AM' });
    });

    it('should parse mixed messages with and without timestamps', () => {
      const input = '[10:30] alice: Hello\nbob: Hi\n[10:32] alice: How are you?';
      const result = parseMessages(input);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello', timestamp: '10:30' });
      expect(result[1]).toEqual({ author: 'bob', text: 'Hi' });
      expect(result[2]).toEqual({ author: 'alice', text: 'How are you?', timestamp: '10:32' });
    });

    it('should treat empty brackets as author name', () => {
      // Empty brackets [] don't match the timestamp pattern (needs content inside)
      // So [] becomes part of the author name
      const input = '[] alice: Hello';
      const result = parseMessages(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ author: '[] alice', text: 'Hello' });
    });

    it('should handle special characters in timestamp', () => {
      const input = '[10:30:45.123] alice: Hello';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello', timestamp: '10:30:45.123' });
    });

    it('should trim whitespace from timestamp', () => {
      const input = '[  10:30  ] alice: Hello';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello', timestamp: '10:30' });
    });
  });

  describe('edge cases', () => {
    it('should handle colon in message text', () => {
      const input = 'alice: Time: 10:30';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Time: 10:30' });
    });

    it('should handle colon in timestamp and message', () => {
      const input = '[10:30:45] alice: Time: now';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Time: now', timestamp: '10:30:45' });
    });

    it('should handle brackets in message text', () => {
      const input = 'alice: [not a timestamp] Hello';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: '[not a timestamp] Hello' });
    });

    it('should require closing bracket for timestamp', () => {
      // Missing closing bracket means pattern doesn't match
      // The text before colon is treated as author
      const input = '[10:30 alice: Hello';
      const result = parseMessages(input);
      expect(result[0].author).toBe('[10');
      expect(result[0].text).toBe('30 alice: Hello');
    });

    it('should handle textContent that looks like timestamp but is not', () => {
      const input = '[note]alice: Hello';
      const result = parseMessages(input);
      expect(result[0]).toEqual({ author: 'alice', text: 'Hello', timestamp: 'note' });
    });
  });
});
