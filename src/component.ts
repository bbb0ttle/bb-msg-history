import type { AuthorOptions, Message } from './types/index.js';
import { MAIN_STYLES, EMPTY_STYLES } from './const/styles.js';
import { parseMessages } from './utils/message-parser.js';
import { resolveAuthorConfig } from './utils/author-resolver.js';
import { escapeHtml } from './utils/html.js';
import { setupTooltips } from './utils/tooltip.js';

export class BBMsgHistory extends HTMLElement {
  private _mutationObserver?: MutationObserver;
  private _userAuthors = new Map<string, AuthorOptions>();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
    // Append to textContent
    const currentText = this.textContent || '';
    const separator = currentText && !currentText.endsWith('\n') ? '\n' : '';
    this.textContent = currentText + separator + `${message.author}: ${message.text}`;
    
    // Re-render and scroll smoothly to the new message
    this.render(true);
    return this;
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

  private render(smoothScroll = false) {
    const messages = parseMessages(this.textContent);
    
    if (messages.length === 0) {
      this._renderEmpty();
      return;
    }

    let lastAuthor = '';
    const messagesHtml = messages
      .map(({ author, text }) => {
        const config = resolveAuthorConfig(author, this._userAuthors);
        const isFirstFromAuthor = author !== lastAuthor;
        lastAuthor = author;
        
        const showAvatar = isFirstFromAuthor;
        const side = config.side;
        const isSubsequent = !isFirstFromAuthor;
        
        const avatarHtml = `
          <div class="avatar-wrapper ${showAvatar ? '' : 'avatar-wrapper--hidden'}" 
               data-author="${escapeHtml(author)}">
            <div class="avatar">${config.avatar}</div>
            <div class="avatar-tooltip">${escapeHtml(author)}</div>
          </div>
        `;
        
        return `
          <div class="msg-row msg-row--${side} ${isSubsequent ? 'msg-row--subsequent' : 'msg-row--new-author'}">
            ${side === 'left' ? avatarHtml : ''}
            
            <div class="msg-content">
              <div class="msg-bubble msg-bubble--${side}" 
                   style="background-color: ${config.bubbleColor}; color: ${config.textColor};">
                ${escapeHtml(text)}
              </div>
            </div>
            
            ${side === 'right' ? avatarHtml : ''}
          </div>
        `;
      })
      .join('');

    this.shadowRoot!.innerHTML = `
      <style>${MAIN_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
    `;

    requestAnimationFrame(() => {
      const container = this.shadowRoot!.querySelector('.history') as HTMLElement;
      if (container) {
        if (smoothScroll) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          container.scrollTop = container.scrollHeight;
        }
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
}
