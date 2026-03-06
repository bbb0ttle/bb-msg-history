import type { AuthorOptions, Message } from './types/index.js';
import { EMPTY_STYLES, LOADING_STYLES, MAIN_STYLES } from './const/styles.js';
import { parseMessages } from './utils/message-parser.js';
import { resolveAuthorConfig } from './utils/author-resolver.js';
import { setupTooltips } from './utils/tooltip.js';
import { buildMessageRowHtml, setupTooltipForElement } from './utils/message-builder.js';
import { buildScrollButtonHtml } from './utils/scroll-button.js';

export class BBMsgHistory extends HTMLElement {
  private _mutationObserver?: MutationObserver;
  private _userAuthors = new Map<string, AuthorOptions>();
  private _lastAuthor = '';
  private _lastGroupTimestamp: string | undefined;
  private _scrollButtonVisible = false;

  static get observedAttributes() {
    return ['theme', 'loading', 'hide-scroll-bar', 'infinite', 'hide-scroll-button'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string) {
    if (name === 'theme' || name === 'loading' || name === 'hide-scroll-bar' || name === 'infinite' || name === 'hide-scroll-button') {
      this.render();
    }
  }

  /**
   * Configure an author's avatar, side, and colors.
   * Call before or after rendering — the component re-renders automatically.
   *
   * @example
   * el.setAuthor('alice', { avatar: '🐱', side: 'right', bubbleColor: '#e0f2fe' });
   * el.setAuthor('bob', { avatar: '<img src="bob.png" />', side: 'left' });
   */
  setAuthor(name: string, options: AuthorOptions): this {
    this._userAuthors.set(name, options);
    this.render();
    return this;
  }

  /**
   * Remove a previously set author config.
   */
  removeAuthor(name: string): this {
    this._userAuthors.delete(name);
    this.render();
    return this;
  }

  /**
   * Show or hide the loading overlay.
   *
   * @example
   * el.setLoading(true);  // Show loading animation
   * el.setLoading(false); // Hide loading animation
   */
  setLoading(isLoading: boolean): this {
    this.toggleAttribute('loading', isLoading);
    return this;
  }

  /**
   * Append a message to the history.
   * Automatically scrolls to the new message with smooth animation.
   *
   * @example
   * el.appendMessage({ author: 'alice', text: 'Hello!' });
   * el.appendMessage({ author: 'bob', text: 'How are you?' });
   */
  appendMessage(message: Message): this {
    // Update textContent
    const currentText = this.textContent || '';
    const separator = currentText && !currentText.endsWith('\n') ? '\n' : '';
    this.textContent = currentText + separator + `${message.author}: ${message.text}`;

    // Temporarily disconnect observer to prevent recursive render
    this._mutationObserver?.disconnect();

    // Append single message without re-rendering entire list
    this._appendSingleMessage(message);

    // Reconnect observer
    this._setupMutationObserver();

    return this;
  }

  /**
   * Scroll to the bottom of the message history.
   *
   * @example
   * el.scrollToBottom();  // Scroll with smooth animation
   */
  scrollToBottom(): this {
    if (this.hasAttribute('infinite')) {
      return this;
    }

    const container = this.shadowRoot?.querySelector('.history') as HTMLElement | null;
    if (!container) {
      return this;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });

    return this;
  }

  private _appendSingleMessage(message: Message): void {
    const container = this.shadowRoot!.querySelector('.history') as HTMLElement;

    // If empty state or no container, do full render first
    if (!container) {
      this.render();
      return;
    }

    const author = message.author;
    const text = message.text;
    const timestamp = message.timestamp;
    const config = resolveAuthorConfig(author, this._userAuthors);

    // Check if this can group with the last message
    // Same author AND (no timestamp conflict)
    const canGroupWithLast =
      author === this._lastAuthor &&
      (!this._lastGroupTimestamp || !timestamp || this._lastGroupTimestamp === timestamp);

    const isFirstFromAuthor = !canGroupWithLast;
    this._lastAuthor = author;

    const isSubsequent = !isFirstFromAuthor;

    // Update group timestamp tracking
    if (isFirstFromAuthor) {
      // Start new group
      this._lastGroupTimestamp = timestamp;
    } else if (!this._lastGroupTimestamp && timestamp) {
      // If no timestamp in group yet and current has one, use it
      this._lastGroupTimestamp = timestamp;
    }

    // When appending, we assume this IS the last in group (for now)
    // If another message from same author comes, we'll re-render
    const isLastInGroup = true;
    const groupTimestamp = this._lastGroupTimestamp;

    // Use utility function to build message HTML
    const msgHtml = buildMessageRowHtml(
      author,
      text,
      config,
      isSubsequent,
      groupTimestamp,
      isLastInGroup
    );

    // Append to container
    container.insertAdjacentHTML('beforeend', msgHtml);

    // Setup tooltip for new element using utility function
    const newWrapper = container.lastElementChild?.querySelector('.avatar-wrapper');
    if (newWrapper) {
      setupTooltipForElement(newWrapper);
    }

    // Smooth scroll to bottom (skip in infinite mode)
    if (!this.hasAttribute('infinite')) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });

      // Hide scroll button since we're scrolling to bottom
      if (this._scrollButtonVisible) {
        this._scrollButtonVisible = false;
        const scrollButton = this.shadowRoot!.querySelector('.scroll-to-bottom') as HTMLButtonElement | null;
        if (scrollButton) {
          scrollButton.classList.remove('visible');
        }

        // Dispatch hide event (always, regardless of button visibility)
        this.dispatchEvent(
          new CustomEvent('bb-scrollbuttonhide', {
            bubbles: true,
            composed: true,
            detail: { visible: false }
          })
        );
      }
    }
  }

  connectedCallback() {
    this.render();
    this._setupMutationObserver();
  }

  disconnectedCallback() {
    this._mutationObserver?.disconnect();
  }

  private _setupMutationObserver() {
    let debounceTimer: ReturnType<typeof setTimeout>;
    this._mutationObserver = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => this.render(), 50);
    });
    this._mutationObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private render() {
    const messages = parseMessages(this.textContent);

    if (messages.length === 0) {
      this._lastAuthor = '';
      this._lastGroupTimestamp = undefined;
      this._renderEmpty();
      return;
    }

    // Helper: Check if two messages can be grouped (same author, no timestamp conflict)
    const canGroup = (prev: Message, curr: Message): boolean => {
      if (prev.author !== curr.author) return false;
      // Different timestamps = break group
      if (prev.timestamp && curr.timestamp && prev.timestamp !== curr.timestamp) {
        return false;
      }
      return true;
    };

    // First pass: determine which messages are last in their group
    const lastInGroupFlags: boolean[] = messages.map((msg, i) => {
      const next = messages[i + 1];
      return !next || !canGroup(msg, next);
    });

    // Second pass: collect the timestamp for each group
    // Use the first non-empty timestamp in the group
    const groupTimestamps = new Map<number, string | undefined>();
    let currentGroupTimestamp: string | undefined;

    messages.forEach((msg, i) => {
      // Start of a new group
      if (i === 0 || !canGroup(messages[i - 1], msg)) {
        currentGroupTimestamp = msg.timestamp;
      } else if (!currentGroupTimestamp && msg.timestamp) {
        // If no timestamp yet and current msg has one, use it
        currentGroupTimestamp = msg.timestamp;
      }

      // If this is the last message in the group, save the timestamp
      if (lastInGroupFlags[i]) {
        groupTimestamps.set(i, currentGroupTimestamp);
        currentGroupTimestamp = undefined;
      }
    });

    // Third pass: build HTML
    let lastAuthor = '';
    const messagesHtml = messages
      .map((msg, i) => {
        const { author, text } = msg;
        const config = resolveAuthorConfig(author, this._userAuthors);

        // Determine if this is a new author group (can't group with previous)
        const isFirstFromAuthor = i === 0 || !canGroup(messages[i - 1], msg);
        lastAuthor = author;
        const isSubsequent = !isFirstFromAuthor;

        // Get timestamp if this is the last in group
        const isLastInGroup = lastInGroupFlags[i];
        const groupTimestamp = groupTimestamps.get(i);

        // Use utility function to build message HTML
        return buildMessageRowHtml(
          author,
          text,
          config,
          isSubsequent,
          groupTimestamp,
          isLastInGroup
        );
      })
      .join('');

    this._lastAuthor = lastAuthor;

    // Check if we need to create or update the structure
    const historyContainer = this.shadowRoot!.querySelector('.history') as HTMLElement;
    const needsFullSetup = !historyContainer;

    if (needsFullSetup) {
      // First render - create full structure
      this._renderFullStructure(messagesHtml);
    } else {
      // Update only - preserve DOM structure, just update content
      this._updateContent(historyContainer, messagesHtml);
    }
  }

  private _renderFullStructure(messagesHtml: string): void {
    const loadingOverlay = this.hasAttribute('loading')
      ? `<div class="loading-overlay" role="status" aria-label="Loading messages">
          <div class="loading-spinner"></div>
        </div>`
      : '';

    const hideScrollButton = this.hasAttribute('hide-scroll-button');

    this.shadowRoot!.innerHTML = `
      <style>${MAIN_STYLES}${LOADING_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
      ${hideScrollButton ? '' : buildScrollButtonHtml()}
      ${loadingOverlay}
    `;

    this._setupAfterRender();
  }

  private _updateContent(historyContainer: HTMLElement, messagesHtml: string): void {
    // Preserve scroll position before update
    const scrollContainer = historyContainer;
    const wasAtBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 50;

    // Update messages content only
    historyContainer.innerHTML = messagesHtml;

    // Update loading overlay
    this._updateLoadingOverlay();

    // Restore scroll position or scroll to bottom if we were there
    if (wasAtBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    // Re-setup tooltips for new content
    setupTooltips(this.shadowRoot!);
  }

  private _updateLoadingOverlay(): void {
    const existingOverlay = this.shadowRoot!.querySelector('.loading-overlay');
    const shouldShow = this.hasAttribute('loading');

    if (shouldShow && !existingOverlay) {
      const overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-label', 'Loading messages');
      overlay.innerHTML = '<div class="loading-spinner"></div>';
      this.shadowRoot!.appendChild(overlay);
    } else if (!shouldShow && existingOverlay) {
      existingOverlay.remove();
    }
  }

  private _setupAfterRender(): void {
    requestAnimationFrame(() => {
      const container = this.shadowRoot!.querySelector('.history') as HTMLElement;
      const scrollButton = this.shadowRoot!.querySelector('.scroll-to-bottom') as HTMLButtonElement | null;
      const isInfinite = this.hasAttribute('infinite');

      if (container && !isInfinite) {
        container.scrollTop = container.scrollHeight;
        this._setupScrollTracking(container, scrollButton, { skipInitialCheck: true });
      }

      if (scrollButton && !isInfinite) {
        scrollButton.addEventListener('click', () => {
          container?.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
      }

      setupTooltips(this.shadowRoot!);
    });
  }

  private _renderEmpty() {
    const isLoading = this.hasAttribute('loading');

    if (isLoading) {
      // Show loading overlay with minimum height for better appearance
      this.shadowRoot!.innerHTML = `
        <style>${EMPTY_STYLES}${LOADING_STYLES}</style>
        <div style="position: relative; min-height: 120px;">
          <div class="loading-overlay" role="status" aria-label="Loading messages">
            <div class="loading-spinner"></div>
          </div>
        </div>
      `;
    } else {
      this.shadowRoot!.innerHTML = `
        <style>${EMPTY_STYLES}</style>
        <div class="empty-state">No messages</div>
      `;
    }
  }

  private _setupScrollTracking(
    container: HTMLElement,
    button: HTMLButtonElement | null,
    options?: { skipInitialCheck?: boolean }
  ): void {
    const checkScrollPosition = () => {
      const threshold = 50; // pixels from bottom
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      const hasOverflow = container.scrollHeight > container.clientHeight;
      // Show button when not at bottom and content has overflow
      const shouldShow = !isAtBottom && hasOverflow;

      if (shouldShow !== this._scrollButtonVisible) {
        this._scrollButtonVisible = shouldShow;
        // Only toggle button visibility if button exists
        if (button) {
          button.classList.toggle('visible', shouldShow);
        }

        // Dispatch custom event (always, regardless of button visibility)
        this.dispatchEvent(
          new CustomEvent(shouldShow ? 'bb-scrollbuttonshow' : 'bb-scrollbuttonhide', {
            bubbles: true,
            composed: true,
            detail: { visible: shouldShow }
          })
        );
      }
    };

    // Check initial state unless skipped
    if (!options?.skipInitialCheck) {
      checkScrollPosition();
    }

    // Listen for scroll events with passive listener for performance
    container.addEventListener('scroll', checkScrollPosition, { passive: true });

    // Also check on resize
    window.addEventListener('resize', checkScrollPosition, { passive: true });
  }
}
