import type { Message } from '../types/index.js';

/**
 * Extended message with grouping metadata
 */
export interface ProcessedMessage extends Message {
  /** Whether this is the first message from this author in the current group */
  isFirstFromAuthor: boolean;
  /** Whether this is the last message in the current group */
  isLastInGroup: boolean;
  /** The timestamp to display for this group (if any) */
  groupTimestamp?: string;
}

/**
 * Result of processing messages, including state for incremental updates
 */
export interface ProcessResult {
  /** Processed messages with grouping metadata */
  processed: ProcessedMessage[];
  /** The author of the last message */
  lastAuthor: string;
  /** The timestamp of the current group */
  lastGroupTimestamp?: string;
}

/**
 * MessageProcessor - Handles message grouping and metadata calculation
 *
 * Encapsulates the grouping algorithm to determine:
 * - Which messages are first from an author (show avatar)
 * - Which messages are last in a group (show timestamp)
 * - Group timestamps for display
 *
 * Optimized to process messages in a single pass instead of multiple traversals.
 */
export class MessageProcessor {
  /**
   * Check if two messages can be grouped together
   * Messages can be grouped if they have the same author and compatible timestamps
   *
   * @param prev - Previous message (null if this is the first)
   * @param curr - Current message
   * @returns true if messages can be grouped
   */
  private canGroup(prev: Message | null, curr: Message): boolean {
    if (!prev) return false;
    if (prev.author !== curr.author) return false;
    // Different timestamps = break group
    if (prev.timestamp && curr.timestamp && prev.timestamp !== curr.timestamp) {
      return false;
    }
    return true;
  }

  /**
   * Process messages to add grouping metadata
   *
   * This method performs a single-pass algorithm that:
   * 1. Determines first/last status for each message in its group
   * 2. Assigns group timestamps consistently
   * 3. Tracks state for incremental updates
   *
   * @param messages - Raw messages from parser
   * @returns Processed messages with grouping metadata and state
   */
  process(messages: Message[]): ProcessResult {
    if (messages.length === 0) {
      return { processed: [], lastAuthor: '' };
    }

    const processed: ProcessedMessage[] = [];
    let lastAuthor = '';
    let lastGroupTimestamp: string | undefined;

    // Track group state
    let currentGroupTimestamp: string | undefined;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const prev = i > 0 ? messages[i - 1] : null;
      const next = i < messages.length - 1 ? messages[i + 1] : null;

      // Determine if this is first from author
      const isFirstFromAuthor = !this.canGroup(prev, msg);

      // Start of new group - initialize group timestamp
      if (isFirstFromAuthor) {
        currentGroupTimestamp = msg.timestamp;
      } else if (!currentGroupTimestamp && msg.timestamp) {
        // If no timestamp yet and current msg has one, use it
        currentGroupTimestamp = msg.timestamp;
      }

      // Determine if this is last in group
      const isLastInGroup = !next || !this.canGroup(msg, next);

      // Create processed message with metadata
      const processedMsg: ProcessedMessage = {
        ...msg,
        isFirstFromAuthor,
        isLastInGroup,
        groupTimestamp: isLastInGroup ? currentGroupTimestamp : undefined,
      };

      processed.push(processedMsg);

      // Update state tracking
      lastAuthor = msg.author;

      // If this is the last in group, reset group timestamp
      if (isLastInGroup) {
        lastGroupTimestamp = currentGroupTimestamp;
        currentGroupTimestamp = undefined;
      }
    }

    return { processed, lastAuthor, lastGroupTimestamp };
  }
}
