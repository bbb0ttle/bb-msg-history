import { MAIN_STYLES, EMPTY_STYLES } from './const/styles.js';
import { parseMessages } from './utils/message-parser.js';
import { resolveAuthorConfig } from './utils/author-resolver.js';
import { escapeHtml } from './utils/html.js';
import { setupTooltips } from './utils/tooltip.js';
export class BBMsgHistory extends HTMLElement {
    constructor() {
        super();
        this._userAuthors = new Map();
        this._messages = [];
        this._lastAuthor = '';
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
    setAuthor(name, options) {
        this._userAuthors.set(name, options);
        this.render();
        return this;
    }
    /**
     * Remove a previously set author config.
     */
    removeAuthor(name) {
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
    appendMessage(message) {
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
    _appendSingleMessage(message) {
        const container = this.shadowRoot.querySelector('.history');
        // If empty state or no container, do full render first
        if (!container) {
            this.render();
            return;
        }
        this._messages.push(message);
        const author = message.author;
        const text = message.text;
        const config = resolveAuthorConfig(author, this._userAuthors);
        const isFirstFromAuthor = author !== this._lastAuthor;
        this._lastAuthor = author;
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
        const msgHtml = `
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
        // Append to container
        container.insertAdjacentHTML('beforeend', msgHtml);
        // Setup tooltip for new elements
        const newWrapper = container.lastElementChild?.querySelector('.avatar-wrapper');
        if (newWrapper) {
            newWrapper.addEventListener('mouseenter', () => {
                const tooltip = newWrapper.querySelector('.avatar-tooltip');
                if (!tooltip)
                    return;
                const rect = newWrapper.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
            });
        }
        // Smooth scroll to bottom
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    }
    connectedCallback() {
        this.render();
        this._setupMutationObserver();
    }
    disconnectedCallback() {
        this._mutationObserver?.disconnect();
    }
    _setupMutationObserver() {
        let debounceTimer;
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
    render() {
        const messages = parseMessages(this.textContent);
        this._messages = messages;
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
        this._lastAuthor = lastAuthor;
        this.shadowRoot.innerHTML = `
      <style>${MAIN_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
    `;
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('.history');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
            setupTooltips(this.shadowRoot);
        });
    }
    _renderEmpty() {
        this.shadowRoot.innerHTML = `
      <style>${EMPTY_STYLES}</style>
      <div class="empty-state">No messages</div>
    `;
    }
}
