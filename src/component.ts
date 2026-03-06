import type { AuthorOptions, Message } from './types/index.js';
import { parseMessages } from './utils/message-parser.js';
import { EventTracker } from './utils/event-tracker.js';
import { MessageProcessor } from './core/message-processor.js';
import { ScrollManager } from './core/scroll-manager.js';
import { Renderer } from './core/renderer.js';

export class BBMsgHistory extends HTMLElement {
  private _mutationObserver?: MutationObserver;
  private _debounceTimer?: ReturnType<typeof setTimeout>;

  // Core modules
  private _eventTracker = new EventTracker();
  private _messageProcessor = new MessageProcessor();
  private _scrollManager: ScrollManager;
  private _renderer: Renderer;

  // State
  private _userAuthors = new Map<string, AuthorOptions>();
  private _lastAuthor = '';
  private _lastGroupTimestamp: string | undefined;

  static get observedAttributes() {
    return ['theme', 'loading', 'hide-scroll-bar', 'infinite', 'hide-scroll-button'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Initialize renderer with shadow root
    this._renderer = new Renderer(this.shadowRoot!);

    // Initialize scroll manager with callback
    this._scrollManager = new ScrollManager(this, this.shadowRoot!, this._eventTracker, _ => {
      // Callback for visibility changes (state tracking if needed)
    });

    // Create MutationObserver for reactive rendering
    this._mutationObserver = new MutationObserver(() => {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => this.render(), 50);
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (['theme', 'loading', 'hide-scroll-bar', 'infinite', 'hide-scroll-button'].includes(name)) {
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
    // Temporarily disconnect observer BEFORE updating textContent to prevent double render
    this._mutationObserver?.disconnect();
    clearTimeout(this._debounceTimer);

    // Update textContent
    const currentText = this.textContent || '';
    const separator = currentText && !currentText.endsWith('\n') ? '\n' : '';
    this.textContent = currentText + separator + `${message.author}: ${message.text}`;

    // Append single message without re-rendering entire list
    this._appendSingleMessage(message);

    // Reconnect observer
    this._mutationObserver?.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return this;
  }

  /**
   * Scroll to the bottom of the message history.
   *
   * @example
   * el.scrollToBottom();  // Scroll with smooth animation
   */
  scrollToBottom(): this {
    this._scrollManager.scrollToBottom();
    return this;
  }

  /**
   * Internal: Append a single message with incremental DOM update
   */
  private _appendSingleMessage(message: Message): void {
    const result = this._renderer.appendSingleMessage(message, this._userAuthors, {
      author: this._lastAuthor,
      groupTimestamp: this._lastGroupTimestamp,
    });

    if (!result.success) {
      // Container not ready, do full render
      this.render();
      return;
    }

    // Update state
    this._lastAuthor = result.lastAuthor;
    this._lastGroupTimestamp = result.lastGroupTimestamp;

    // Scroll to bottom (skip in infinite mode)
    if (!this.hasAttribute('infinite')) {
      this._scrollManager.scrollToBottom();
    }
  }

  connectedCallback() {
    this.render();
    this._setupMutationObserver();
  }

  disconnectedCallback() {
    this._mutationObserver?.disconnect();
    clearTimeout(this._debounceTimer);
    this._eventTracker.cleanup();
  }

  private _setupMutationObserver() {
    this._mutationObserver?.observe(this, {
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
      this._renderer.renderEmpty(this.hasAttribute('loading'));
      return;
    }

    // Process messages (single-pass algorithm)
    const { processed, lastAuthor, lastGroupTimestamp } = this._messageProcessor.process(messages);

    // Update state
    this._lastAuthor = lastAuthor;
    this._lastGroupTimestamp = lastGroupTimestamp;

    // Render messages
    const isLoading = this.hasAttribute('loading');
    const hideScrollButton = this.hasAttribute('hide-scroll-button');
    const { wasAtBottom } = this._renderer.render(
      processed,
      this._userAuthors,
      isLoading,
      hideScrollButton
    );

    // Setup scroll tracking and other post-render tasks
    this._setupAfterRender(wasAtBottom);
  }

  private _setupAfterRender(shouldScrollToBottom = true): void {
    requestAnimationFrame(() => {
      const container = this._renderer.getHistoryContainer();
      const scrollButton = this._renderer.getScrollButton();
      const isInfinite = this.hasAttribute('infinite');

      if (container && !isInfinite) {
        // Initialize scroll manager
        this._scrollManager.init(container, scrollButton, shouldScrollToBottom);
      }
    });
  }
}
