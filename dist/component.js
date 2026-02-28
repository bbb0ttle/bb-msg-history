import { MAIN_STYLES, EMPTY_STYLES } from './const/styles.js';
import { parseMessages } from './utils/message-parser.js';
import { resolveAuthorConfig } from './utils/author-resolver.js';
import { setupTooltips } from './utils/tooltip.js';
import { buildMessageRowHtml, setupTooltipForElement } from './utils/message-builder.js';
import { buildScrollButtonHtml } from './utils/scroll-button.js';
export class BBMsgHistory extends HTMLElement {
    static get observedAttributes() {
        return ['theme'];
    }
    constructor() {
        super();
        this._userAuthors = new Map();
        this._lastAuthor = '';
        this._scrollButtonVisible = false;
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
        const scrollButton = this.shadowRoot.querySelector('.scroll-to-bottom');
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
        this.shadowRoot.innerHTML = `
      <style>${MAIN_STYLES}</style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
      ${buildScrollButtonHtml()}
    `;
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('.history');
            const scrollButton = this.shadowRoot.querySelector('.scroll-to-bottom');
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
            setupTooltips(this.shadowRoot);
        });
    }
    _renderEmpty() {
        this.shadowRoot.innerHTML = `
      <style>${EMPTY_STYLES}</style>
      <div class="empty-state">No messages</div>
    `;
    }
    _setupScrollTracking(container, button) {
        const checkScrollPosition = () => {
            const threshold = 50; // pixels from bottom
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
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
