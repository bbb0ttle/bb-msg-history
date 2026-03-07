import { LitElement, html, css, nothing, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import type { AuthorOptions, Message } from '../types/index.js';
import { authorContext } from '../contexts/author-context.js';
import { ScrollController } from '../controllers/scroll-controller.js';
import { DefaultMessageParser } from '../parsers/default-parser.js';
import type { MessageParser, MessageInput } from '../parsers/base.js';
import { THEME } from '../const/theme.js';
import './bb-message.js';
import './bb-scroll-button.js';
import './bb-loading-overlay.js';

/**
 * Extended message with grouping metadata
 */
interface ProcessedMessage extends Message {
  isFirstFromAuthor: boolean;
  isLastInGroup: boolean;
  groupTimestamp?: string;
}

/**
 * BBMsgHistory - A chat-style message history web component
 *
 * Uses Lit for reactive rendering with a compositional architecture.
 * Preserves backward compatibility with the lightweight textContent mode.
 *
 * @example
 * ```html
 * <!-- Lightweight mode -->
 * <bb-msg-history>
 *   alice: Hello!
 *   bob: Hi there!
 * </bb-msg-history>
 *
 * <!-- With custom authors -->
 * <bb-msg-history id="chat"></bb-msg-history>
 * <script>
 *   document.getElementById('chat')
 *     .setAuthor('alice', { avatar: '🐱', side: 'right' });
 * </script>
 * ```
 */
@customElement('bb-msg-history')
export class BBMsgHistory extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      font-family:
        'PT Sans',
        ui-sans-serif,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      --bb-bg-color: ${unsafeCSS(THEME.gray[50])};
      --bb-max-height: 600px;
      --bb-avatar-bg: #ffffff;
      --bb-avatar-color: ${unsafeCSS(THEME.gray[600])};
    }

    :host([theme='dark']) {
      --bb-bg-color: ${unsafeCSS(THEME.gray[900])};
      --bb-avatar-bg: ${unsafeCSS(THEME.slate[600])};
      --bb-avatar-color: ${unsafeCSS(THEME.slate[200])};
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --bb-bg-color: ${unsafeCSS(THEME.gray[900])};
        --bb-avatar-bg: ${unsafeCSS(THEME.slate[600])};
        --bb-avatar-color: ${unsafeCSS(THEME.slate[200])};
      }
    }

    .history-container {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      max-height: var(--bb-max-height, 600px);
      overflow-y: auto;
      scroll-behavior: smooth;
      background-color: transparent;
      border-radius: 0.5rem;
      /* Firefox scrollbar */
      scrollbar-width: thin;
      scrollbar-color: ${unsafeCSS(THEME.gray[400])} transparent;
    }

    /* Custom scrollbar for webkit browsers */
    .history-container::-webkit-scrollbar {
      width: 6px;
    }

    .history-container::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }

    .history-container::-webkit-scrollbar-thumb {
      background: ${unsafeCSS(THEME.gray[400])};
      border-radius: 3px;
    }

    .history-container::-webkit-scrollbar-thumb:hover {
      background: ${unsafeCSS(THEME.gray[500])};
    }

    /* Hide scrollbar */
    :host([hide-scroll-bar]) .history-container {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    :host([hide-scroll-bar]) .history-container::-webkit-scrollbar {
      display: none;
    }

    /* Infinite mode */
    :host([infinite]) .history-container {
      max-height: none;
      overflow-y: visible;
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: ${unsafeCSS(THEME.gray[400])};
      font-size: 0.875rem;
    }

    @media (prefers-color-scheme: dark) {
      .empty-state {
        color: ${unsafeCSS(THEME.gray[500])};
      }

      .history-container {
        scrollbar-color: ${unsafeCSS(THEME.gray[600])} transparent;
      }

      .history-container::-webkit-scrollbar-thumb {
        background: ${unsafeCSS(THEME.gray[600])};
      }

      .history-container::-webkit-scrollbar-thumb:hover {
        background: ${unsafeCSS(THEME.gray[500])};
      }
    }

    @media (max-width: 480px) {
      .history-container {
        max-height: var(--bb-max-height, 70vh);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .history-container {
        scroll-behavior: auto;
      }
    }
  `;

  // Public properties
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'hide-scroll-bar' })
  hideScrollBar = false;
  @property({ type: Boolean, reflect: true }) infinite = false;
  @property({ type: Boolean, reflect: true, attribute: 'hide-scroll-button' })
  hideScrollButton = false;
  @property({ reflect: true }) theme: 'light' | 'dark' | null = null;

  // Private state
  @state() private _messages: Message[] = [];
  @state() private _processedMessages: ProcessedMessage[] = [];

  // Context provider for author configurations
  @provide({ context: authorContext })
  @state()
  private _userAuthors = new Map<string, AuthorOptions>();

  // Light DOM observation
  private _mutationObserver?: MutationObserver;
  private _isParsing = false;
  private _parser: MessageParser = new DefaultMessageParser();

  // Scroll controller
  private _scrollController = new ScrollController(this);

  connectedCallback() {
    super.connectedCallback();
    this._initLightDOMObserver();

    // Initial parse if content exists (for SSR or static HTML)
    if (this.textContent?.trim()) {
      this._parseLightDOM();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mutationObserver?.disconnect();
  }

  willUpdate(changedProps: PropertyValues<BBMsgHistory>) {
    if (
      changedProps.has('_messages' as keyof BBMsgHistory) ||
      changedProps.has('_userAuthors' as keyof BBMsgHistory)
    ) {
      this._processedMessages = this._computeGroups(this._messages);
    }
  }

  updated(changedProps: PropertyValues<BBMsgHistory>) {
    if (changedProps.has('_processedMessages' as keyof BBMsgHistory)) {
      // Update scroll observer when messages change
      this._scrollController.updateObservedMessage();

      // Auto-scroll if not in infinite mode
      if (!this.infinite) {
        this._scrollController.scrollToBottom('auto');
      }
    }
  }

  /**
   * Configure an author's avatar, side, and colors.
   * Call before or after rendering — the component re-renders automatically.
   */
  setAuthor(name: string, options: AuthorOptions): this {
    this._userAuthors = new Map([...this._userAuthors, [name, options]]);
    return this;
  }

  /**
   * Remove a previously set author config.
   */
  removeAuthor(name: string): this {
    const newMap = new Map(this._userAuthors);
    newMap.delete(name);
    this._userAuthors = newMap;
    return this;
  }

  /**
   * Show or hide the loading overlay.
   */
  setLoading(isLoading: boolean): this {
    this.loading = isLoading;
    return this;
  }

  /**
   * Append a message to the history.
   * Automatically scrolls to the new message with smooth animation.
   */
  appendMessage(input: MessageInput): this {
    const msg: Message = {
      author: input.author,
      text: input.text,
      timestamp: input.timestamp,
    };

    // Pause observation to avoid loop
    this._mutationObserver?.disconnect();

    // Update messages array
    this._messages = [...this._messages, msg];

    // Optionally sync back to light DOM (for consistency)
    this._syncToLightDOM();

    // Restore observation after current event loop
    requestAnimationFrame(() => {
      this._initLightDOMObserver();
    });

    // Scroll to bottom (skip in infinite mode)
    if (!this.infinite) {
      this._scrollController.scrollToBottom();
    }

    return this;
  }

  /**
   * Scroll to the bottom of the message history.
   */
  scrollToBottom(): this {
    this._scrollController.scrollToBottom();
    return this;
  }

  /**
   * Set a custom parser for message parsing
   */
  setParser(parser: MessageParser): this {
    this._parser = parser;
    this._parseLightDOM();
    return this;
  }

  /**
   * Initialize MutationObserver for Light DOM observation
   */
  private _initLightDOMObserver() {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }

    this._mutationObserver = new MutationObserver(records => {
      // Only react to light DOM changes, not shadow DOM
      const hasLightDOMChange = records.some(r => {
        const root = (r.target as Node).getRootNode();
        return root === document || root === this;
      });

      if (hasLightDOMChange && !this._isParsing) {
        this._parseLightDOM();
      }
    });

    this._mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  /**
   * Parse Light DOM textContent into messages
   */
  private _parseLightDOM() {
    const rawText = this.textContent || '';
    if (!rawText.trim()) {
      this._messages = [];
      return;
    }

    this._isParsing = true;
    const parsed = this._parser.parse(rawText);

    // Only update if messages actually changed (avoid unnecessary re-renders)
    if (this._messagesChanged(parsed)) {
      this._messages = parsed;
    }

    // Hide light DOM content visually but keep it accessible
    this._hideLightDOMContent();

    requestAnimationFrame(() => {
      this._isParsing = false;
    });
  }

  /**
   * Check if messages have changed
   */
  private _messagesChanged(newMessages: Message[]): boolean {
    if (newMessages.length !== this._messages.length) return true;
    return newMessages.some((msg, i) => {
      const old = this._messages[i];
      return (
        msg.author !== old?.author || msg.text !== old?.text || msg.timestamp !== old?.timestamp
      );
    });
  }

  /**
   * Hide light DOM content visually while keeping it for accessibility/parsing
   */
  private _hideLightDOMContent() {
    // The content is parsed and rendered in shadow DOM,
    // so we don't need to hide it explicitly - the shadow DOM overlays it.
    // But we can ensure proper accessibility by marking it.
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('role', 'log');
    this.setAttribute('aria-label', 'Message history');
  }

  /**
   * Sync current messages back to light DOM
   */
  private _syncToLightDOM() {
    const content = this._messages
      .map(m => {
        const timestamp = m.timestamp ? `[${m.timestamp}] ` : '';
        return `${timestamp}${m.author}: ${m.text}`;
      })
      .join('\n');

    // Temporarily disconnect observer to prevent loop
    this._mutationObserver?.disconnect();
    this.textContent = content;
    this._initLightDOMObserver();
  }

  /**
   * Compute message groups for rendering
   */
  private _computeGroups(messages: Message[]): ProcessedMessage[] {
    if (messages.length === 0) return [];

    const processed: ProcessedMessage[] = [];
    let currentGroupTimestamp: string | undefined;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const prev = i > 0 ? messages[i - 1] : null;
      const next = i < messages.length - 1 ? messages[i + 1] : null;

      // Determine if this is first from author
      const isFirstFromAuthor = !this._canGroup(prev, msg);

      // Start of new group - initialize group timestamp
      if (isFirstFromAuthor) {
        currentGroupTimestamp = msg.timestamp;
      } else if (!currentGroupTimestamp && msg.timestamp) {
        currentGroupTimestamp = msg.timestamp;
      }

      // Determine if this is last in group
      const isLastInGroup = !next || !this._canGroup(msg, next);

      processed.push({
        ...msg,
        isFirstFromAuthor,
        isLastInGroup,
        groupTimestamp: isLastInGroup ? currentGroupTimestamp : undefined,
      });

      // Reset group timestamp at end of group
      if (isLastInGroup) {
        currentGroupTimestamp = undefined;
      }
    }

    return processed;
  }

  /**
   * Check if two messages can be grouped together
   */
  private _canGroup(prev: Message | null, curr: Message): boolean {
    if (!prev) return false;
    if (prev.author !== curr.author) return false;
    if (prev.timestamp && curr.timestamp && prev.timestamp !== curr.timestamp) {
      return false;
    }
    return true;
  }

  /**
   * Handle scroll button click
   */
  private _onScrollButtonClick() {
    this._scrollController.scrollToBottom();
  }

  render() {
    const hasMessages = this._processedMessages.length > 0;

    return html`
      <div class="history-container" role="log" aria-live="polite" aria-label="Message history">
        ${hasMessages
          ? this._processedMessages.map(
              (msg, index) => html`
                <bb-message
                  .author=${msg.author}
                  .text=${msg.text}
                  .timestamp=${msg.groupTimestamp || ''}
                  ?subsequent=${!msg.isFirstFromAuthor}
                  ?lastInGroup=${msg.isLastInGroup}
                  data-index="${index}"
                ></bb-message>
              `
            )
          : html` <div class="empty-state">${this.loading ? '' : 'No messages'}</div> `}
      </div>

      ${!this.hideScrollButton && !this.infinite
        ? html`
            <bb-scroll-button
              .visible=${this._scrollController.isVisible}
              @bb-scroll-to-bottom=${this._onScrollButtonClick}
            ></bb-scroll-button>
          `
        : nothing}
      ${this.loading ? html`<bb-loading-overlay visible></bb-loading-overlay>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-msg-history': BBMsgHistory;
  }
}
