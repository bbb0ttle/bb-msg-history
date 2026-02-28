import type { AuthorOptions, Message } from './types/index.js';
import { MAIN_STYLES, EMPTY_STYLES } from './const/styles.js';
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
    return ['theme'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
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

    // Smooth scroll to bottom
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });

    // Hide scroll button since we're scrolling to bottom
    const scrollButton = this.shadowRoot!.querySelector('.scroll-to-bottom') as HTMLButtonElement;
    if (scrollButton && this._scrollButtonVisible) {
      this._scrollButtonVisible = false;
      scrollButton.classList.remove('visible');
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

    this.shadowRoot!.innerHTML = `
      <style>${MAIN_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
      ${buildScrollButtonHtml()}
    `;

    requestAnimationFrame(() => {
      const container = this.shadowRoot!.querySelector('.history') as HTMLElement;
      const scrollButton = this.shadowRoot!.querySelector('.scroll-to-bottom') as HTMLButtonElement;

      if (container) {
        container.scrollTop = container.scrollHeight;
        this._setupScrollTracking(container, scrollButton);
      }

      if (scrollButton) {
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
    this.shadowRoot!.innerHTML = `
      <style>${EMPTY_STYLES}</style>
      <div class="empty-state">No messages</div>
    `;
  }

  private _setupScrollTracking(container: HTMLElement, button: HTMLButtonElement): void {
    const checkScrollPosition = () => {
      const threshold = 50; // pixels from bottom
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      const hasOverflow = container.scrollHeight > container.clientHeight;
      const shouldShow = !isAtBottom && hasOverflow;

      if (shouldShow !== this._scrollButtonVisible) {
        this._scrollButtonVisible = shouldShow;
        button.classList.toggle('visible', shouldShow);
      }
    };

    // Check initial state
    checkScrollPosition();

    // Listen for scroll events with passive listener for performance
    container.addEventListener('scroll', checkScrollPosition, { passive: true });

    // Also check on resize
    window.addEventListener('resize', checkScrollPosition, { passive: true });
  }
}
