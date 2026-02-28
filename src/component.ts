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
    const config = resolveAuthorConfig(author, this._userAuthors);
    const isFirstFromAuthor = author !== this._lastAuthor;
    this._lastAuthor = author;

    const isSubsequent = !isFirstFromAuthor;

    // Use utility function to build message HTML
    const msgHtml = buildMessageRowHtml(author, text, config, isSubsequent);

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
      this._renderEmpty();
      return;
    }

    let lastAuthor = '';
    const messagesHtml = messages
      .map(({ author, text }) => {
        const config = resolveAuthorConfig(author, this._userAuthors);
        const isFirstFromAuthor = author !== lastAuthor;
        lastAuthor = author;
        const isSubsequent = !isFirstFromAuthor;

        // Use utility function to build message HTML
        return buildMessageRowHtml(author, text, config, isSubsequent);
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
