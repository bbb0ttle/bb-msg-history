import type { AuthorOptions, Message } from '../types/index.js';
import type { ProcessedMessage } from './message-processor.js';
import { EMPTY_STYLES, LOADING_STYLES, MAIN_STYLES } from '../const/styles.js';
import { resolveAuthorConfig } from '../utils/author-resolver.js';
import { buildMessageRowHtml, setupTooltipForElement } from '../utils/message-builder.js';
import { buildScrollButtonHtml } from '../utils/scroll-button.js';
import { setupTooltips } from '../utils/tooltip.js';

/**
 * State for incremental message appending
 */
export interface LastState {
  author: string;
  groupTimestamp?: string;
}

/**
 * Result of a full render operation
 */
export interface RenderResult {
  wasAtBottom: boolean;
}

/**
 * Result of an incremental append operation
 */
export interface AppendResult {
  success: boolean;
  lastAuthor: string;
  lastGroupTimestamp?: string;
}

/**
 * Renderer - Manages all DOM rendering operations
 *
 * Centralizes DOM manipulation logic:
 * - Full render of all messages
 * - Incremental update when appending single messages
 * - Empty state rendering
 * - Loading overlay management
 */
export class Renderer {
  constructor(private shadowRoot: ShadowRoot) {}

  /**
   * Render the complete message history
   *
   * @param messages - Processed messages with grouping metadata
   * @param authors - User-defined author configurations
   * @param isLoading - Whether to show loading overlay
   * @param hideScrollButton - Whether to hide the scroll-to-bottom button
   * @returns Result indicating if we were at bottom before render
   */
  render(
    messages: ProcessedMessage[],
    authors: Map<string, AuthorOptions>,
    isLoading: boolean,
    hideScrollButton: boolean
  ): RenderResult {
    // Check if we need to create or update the structure
    const historyContainer = this.shadowRoot.querySelector('.history') as HTMLElement | null;
    const needsFullSetup = !historyContainer;

    // Build messages HTML
    const messagesHtml = this.buildMessagesHtml(messages, authors);

    if (needsFullSetup) {
      // First render - create full structure
      return this.renderFullStructure(messagesHtml, isLoading, hideScrollButton);
    } else {
      // Update only - preserve DOM structure
      return this.updateContent(historyContainer, messagesHtml, isLoading);
    }
  }

  /**
   * Build HTML string for all messages
   */
  private buildMessagesHtml(
    messages: ProcessedMessage[],
    authors: Map<string, AuthorOptions>
  ): string {
    return messages
      .map(msg => {
        const config = resolveAuthorConfig(msg.author, authors);

        return buildMessageRowHtml(
          msg.author,
          msg.text,
          config,
          !msg.isFirstFromAuthor, // isSubsequent
          msg.groupTimestamp,
          msg.isLastInGroup
        );
      })
      .join('');
  }

  /**
   * Render full structure including styles, container, and scroll button
   */
  private renderFullStructure(
    messagesHtml: string,
    isLoading: boolean,
    hideScrollButton: boolean
  ): RenderResult {
    // For initial render, we consider it as "was at bottom" to scroll down
    const wasAtBottom = true;

    const loadingOverlay = isLoading
      ? `<div class="loading-overlay" role="status" aria-label="Loading messages">
          <div class="loading-spinner"></div>
        </div>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>${MAIN_STYLES}${LOADING_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
      ${hideScrollButton ? '' : buildScrollButtonHtml()}
      ${loadingOverlay}
    `;

    return { wasAtBottom };
  }

  /**
   * Update content while preserving DOM structure
   */
  private updateContent(
    historyContainer: HTMLElement,
    messagesHtml: string,
    isLoading: boolean
  ): RenderResult {
    // Check scroll position before update
    const scrollContainer = historyContainer;
    const wasAtBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 50;

    // Update messages content only
    historyContainer.innerHTML = messagesHtml;

    // Update loading overlay
    this.updateLoadingOverlay(isLoading);

    // Restore scroll position or scroll to bottom if we were there
    if (wasAtBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    // Re-setup tooltips for new content
    setupTooltips(this.shadowRoot);

    return { wasAtBottom };
  }

  /**
   * Append a single message without full re-render
   *
   * @param message - The message to append
   * @param authors - User-defined author configurations
   * @param lastState - Previous state for grouping logic
   * @returns Result indicating success and updated state
   */
  appendSingleMessage(
    message: Message,
    authors: Map<string, AuthorOptions>,
    lastState: LastState
  ): AppendResult {
    const container = this.shadowRoot.querySelector('.history') as HTMLElement | null;

    // If empty state or no container, signal that full render is needed
    if (!container) {
      return { success: false, lastAuthor: lastState.author };
    }

    const config = resolveAuthorConfig(message.author, authors);

    // Determine grouping
    const prevMessage: Message | null = lastState.author
      ? { author: lastState.author, text: '', timestamp: lastState.groupTimestamp }
      : null;

    const canGroupWithLast = this.canGroupMessages(prevMessage, message);
    const isFirstFromAuthor = !canGroupWithLast;

    // Calculate new state
    let lastGroupTimestamp = lastState.groupTimestamp;
    if (isFirstFromAuthor) {
      lastGroupTimestamp = message.timestamp;
    } else if (!lastGroupTimestamp && message.timestamp) {
      lastGroupTimestamp = message.timestamp;
    }

    // Build and append HTML
    const msgHtml = buildMessageRowHtml(
      message.author,
      message.text,
      config,
      !isFirstFromAuthor, // isSubsequent
      lastGroupTimestamp,
      true // isLastInGroup - when appending, this is always last (for now)
    );

    container.insertAdjacentHTML('beforeend', msgHtml);

    // Setup tooltip for new element
    const newWrapper = container.lastElementChild?.querySelector('.avatar-wrapper');
    if (newWrapper) {
      setupTooltipForElement(newWrapper);
    }

    return {
      success: true,
      lastAuthor: message.author,
      lastGroupTimestamp,
    };
  }

  /**
   * Check if two messages can be grouped
   */
  private canGroupMessages(prev: Message | null, curr: Message): boolean {
    if (!prev) return false;
    if (prev.author !== curr.author) return false;
    if (prev.timestamp && curr.timestamp && prev.timestamp !== curr.timestamp) {
      return false;
    }
    return true;
  }

  /**
   * Render empty state (no messages)
   */
  renderEmpty(isLoading: boolean): void {
    if (isLoading) {
      // Show loading overlay with minimum height
      this.shadowRoot.innerHTML = `
        <style>${EMPTY_STYLES}${LOADING_STYLES}</style>
        <div style="position: relative; min-height: 120px;">
          <div class="loading-overlay" role="status" aria-label="Loading messages">
            <div class="loading-spinner"></div>
          </div>
        </div>
      `;
    } else {
      this.shadowRoot.innerHTML = `
        <style>${EMPTY_STYLES}</style>
        <div class="empty-state">No messages</div>
      `;
    }
  }

  /**
   * Update loading overlay visibility
   */
  updateLoadingOverlay(shouldShow: boolean): void {
    const existingOverlay = this.shadowRoot.querySelector('.loading-overlay');

    if (shouldShow && !existingOverlay) {
      const overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-label', 'Loading messages');
      overlay.innerHTML = '<div class="loading-spinner"></div>';
      this.shadowRoot.appendChild(overlay);
    } else if (!shouldShow && existingOverlay) {
      existingOverlay.remove();
    }
  }

  /**
   * Get the history container element
   */
  getHistoryContainer(): HTMLElement | null {
    return this.shadowRoot.querySelector('.history') as HTMLElement | null;
  }

  /**
   * Get the scroll-to-bottom button element
   */
  getScrollButton(): HTMLButtonElement | null {
    return this.shadowRoot.querySelector('.scroll-to-bottom') as HTMLButtonElement | null;
  }
}
