interface Message {
  author: string;
  text: string;
}

interface AuthorConfig {
  avatar: string;
  bubbleColor: string;
  textColor: string;
  side: 'left' | 'right';
  isCustomAvatar: boolean;
}

interface AuthorOptions {
  /** Avatar HTML string: SVG, <img>, emoji, or plain text */
  avatar?: string;
  /** Which side the messages appear on */
  side?: 'left' | 'right';
  /** Bubble background color */
  bubbleColor?: string;
  /** Text color inside bubble */
  textColor?: string;
}

// 主题色板
const THEME = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
  },
  yyPink: {
    50: '#fdf4f4',
    100: '#fbd1d2',
    150: '#f8babc',
  }
};

// 作者配置映射
const AUTHOR_CONFIG: Record<string, Omit<AuthorConfig, 'isCustomAvatar'>> = {
  'bbki.ng': {
    avatar: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48" fill="none"><path d="M29.1152 21.3106C32.0605 21.3106 34.4481 18.9101 34.4481 15.9489V24.6457C34.4481 25.7585 33.5508 26.6607 32.444 26.6607H15.1207C14.0138 26.6607 13.1166 25.7585 13.1166 24.6457V15.9489C13.1166 18.9101 15.5042 21.3106 18.4494 21.3106C21.3947 21.3106 23.7823 18.9101 23.7823 15.9489C23.7823 18.9101 26.17 21.3106 29.1152 21.3106Z" fill="${THEME.gray[400]}"/><path d="M23.7823 15.9373L23.7823 15.9489C23.7823 15.9451 23.7823 15.9412 23.7823 15.9373Z" fill="${THEME.gray[400]}"/><path d="M23.1143 28.004C23.1205 30.9598 25.5057 33.3541 28.4472 33.3541C31.3886 33.3541 33.7738 30.9598 33.7801 28.004H23.1143Z" fill="${THEME.gray[400]}"/><path d="M13.7846 28.004C13.7846 28.0079 13.7846 28.0117 13.7846 28.0156C13.7908 30.9714 16.1761 33.3657 19.1175 33.3657C22.0589 33.3657 24.4442 30.9714 24.4504 28.0156H13.7846V28.004Z" fill="${THEME.gray[400]}"/><path d="M14.4527 15.9373C14.4527 16.6792 13.8545 17.2806 13.1166 17.2806C12.3786 17.2806 11.7805 16.6792 11.7805 15.9373C11.7805 15.1954 12.3786 14.594 13.1166 14.594C13.8545 14.594 14.4527 15.1954 14.4527 15.9373Z" fill="${THEME.gray[400]}"/><path d="M25.1184 15.2657C25.1184 16.0076 24.5202 16.609 23.7823 16.609C23.0444 16.609 22.4462 16.0076 22.4462 15.2657C22.4462 14.5238 23.0444 13.9224 23.7823 13.9224C24.5202 13.9224 25.1184 14.5238 25.1184 15.2657Z" fill="${THEME.gray[400]}"/><path d="M35.7842 15.9373C35.7842 16.6792 35.186 17.2806 34.4481 17.2806C33.7102 17.2806 33.112 16.6792 33.112 15.9373C33.112 15.1954 33.7102 14.594 34.4481 14.594C35.186 14.594 35.7842 15.1954 35.7842 15.9373Z" fill="${THEME.gray[400]}"/></svg>`,
    bubbleColor: THEME.gray[100],
    textColor: THEME.gray[900],
    side: 'right'
  },
  'xwy': {
    avatar: `<svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.821 17.5305C10.709 18.17 9.68345 19.4423 9.22624 20.1359C9.11159 20.3099 9.21615 20.5428 9.42038 20.5839L12.67 21.2381C12.8291 21.2702 12.9328 21.4275 12.9084 21.5879C11.3004 32.1653 21.5275 36.7547 28.6638 33.0597C28.7443 33.018 28.8408 33.0139 28.9245 33.0487C32.8032 34.6598 35.967 34.5662 37.8217 34.3099C38.131 34.2671 38.1505 33.841 37.855 33.7401C29.1343 30.7633 26.0152 24.5245 25.5144 18.8022C25.3835 17.3066 23.8172 13.2016 19.2675 13.0058C15.7934 12.8563 13.6137 15.6103 13.0319 17.325C12.9986 17.4231 12.9201 17.5004 12.821 17.5305Z" fill="${THEME.yyPink[100]}"/><circle cx="17.6178" cy="18.2688" r="0.995689" fill="white"/></svg>`,
    bubbleColor: THEME.yyPink[50], // 淡红色背景
    textColor: THEME.gray[900],
    side: 'left'
  },
  '小乌鸦': {
    avatar: `<svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.821 17.5305C10.709 18.17 9.68345 19.4423 9.22624 20.1359C9.11159 20.3099 9.21615 20.5428 9.42038 20.5839L12.67 21.2381C12.8291 21.2702 12.9328 21.4275 12.9084 21.5879C11.3004 32.1653 21.5275 36.7547 28.6638 33.0597C28.7443 33.018 28.8408 33.0139 28.9245 33.0487C32.8032 34.6598 35.967 34.5662 37.8217 34.3099C38.131 34.2671 38.1505 33.841 37.855 33.7401C29.1343 30.7633 26.0152 24.5245 25.5144 18.8022C25.3835 17.3066 23.8172 13.2016 19.2675 13.0058C15.7934 12.8563 13.6137 15.6103 13.0319 17.325C12.9986 17.4231 12.9201 17.5004 12.821 17.5305Z" fill="${THEME.yyPink[100]}"/><circle cx="17.6178" cy="18.2688" r="0.995689" fill="white"/></svg>`,
    bubbleColor: THEME.yyPink[50], // 淡红色背景
    textColor: THEME.gray[900],
    side: 'left'
  }
};

// 使用首字符头像的作者（非 bbki.ng / xwy）
const FIRST_CHAR_AVATAR_AUTHORS = new Set(['小乌鸦']);

class BBMsgHistory extends HTMLElement {
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

  private parseMessages(): Message[] {
    const raw = this.textContent || '';
    const messages: Message[] = [];
    
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx <= 0) continue;
      
      const author = trimmed.slice(0, colonIdx).trim();
      const text = trimmed.slice(colonIdx + 1).trim();
      
      if (author && text) {
        messages.push({ author, text });
      }
    }
    
    return messages;
  }

  private getAuthorConfig(author: string): AuthorConfig {
    // 1. 用户自定义配置（精确匹配）
    const userConfig = this._userAuthors.get(author);
    if (userConfig) {
      return {
        avatar: userConfig.avatar
          ? this._wrapAvatarHtml(userConfig.avatar)
          : this._generateLetterAvatar(author.charAt(0).toUpperCase()),
        bubbleColor: userConfig.bubbleColor || THEME.gray[50],
        textColor: userConfig.textColor || THEME.gray[900],
        side: userConfig.side || 'left',
        isCustomAvatar: !!userConfig.avatar,
      };
    }

    // 2. 用户自定义配置（模糊匹配：作者名包含已配置的 key）
    for (const [key, cfg] of this._userAuthors.entries()) {
      if (author.includes(key)) {
        return {
          avatar: cfg.avatar
            ? this._wrapAvatarHtml(cfg.avatar)
            : this._generateLetterAvatar(author.charAt(0).toUpperCase()),
          bubbleColor: cfg.bubbleColor || THEME.gray[50],
          textColor: cfg.textColor || THEME.gray[900],
          side: cfg.side || 'left',
          isCustomAvatar: !!cfg.avatar,
        };
      }
    }

    // 3. 内置首字符头像作者（secret）
    if (FIRST_CHAR_AVATAR_AUTHORS.has(author)) {
      const config = AUTHOR_CONFIG[author];
      const firstChar = author.charAt(0);
      return {
        ...(config || { bubbleColor: THEME.gray[50], textColor: THEME.gray[900], side: 'left' as const }),
        avatar: this._generateLetterAvatar(firstChar),
        isCustomAvatar: false
      };
    }

    // 4. 内置配置精确匹配（secret）
    if (AUTHOR_CONFIG[author]) {
      return { ...AUTHOR_CONFIG[author], isCustomAvatar: true };
    }

    // 5. 内置配置模糊匹配（secret）
    for (const [key, config] of Object.entries(AUTHOR_CONFIG)) {
      if (author.includes(key)) {
        return { ...config, isCustomAvatar: true };
      }
    }
    
    // 6. 默认：首字母头像，左侧
    const firstChar = author.charAt(0).toUpperCase();
    return {
      avatar: this._generateLetterAvatar(firstChar),
      bubbleColor: THEME.gray[50],
      textColor: THEME.gray[900],
      side: 'left',
      isCustomAvatar: false
    };
  }

  private _wrapAvatarHtml(html: string): string {
    // If it looks like a single emoji or short text (no HTML tags), wrap in a styled div
    if (!html.includes('<')) {
      return `<div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        line-height: 1;
      ">${html}</div>`;
    }
    return html;
  }

  private _generateLetterAvatar(letter: string): string {
    return `<div style="
      width: 100%; 
      height: 100%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: #ffffff; 
      color: ${THEME.gray[600]}; 
      font-size: 14px; 
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
    ">${letter}</div>`;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private render() {
    const messages = this.parseMessages();
    
    if (messages.length === 0) {
      this._renderEmpty();
      return;
    }

    let lastAuthor = '';
    const messagesHtml = messages
      .map(({ author, text }) => {
        const config = this.getAuthorConfig(author);
        const isFirstFromAuthor = author !== lastAuthor;
        lastAuthor = author;
        
        const showAvatar = isFirstFromAuthor;
        const side = config.side;
        const isSubsequent = !isFirstFromAuthor;
        
        const avatarHtml = `
          <div class="avatar-wrapper ${showAvatar ? '' : 'avatar-wrapper--hidden'}" 
               data-author="${this.escapeHtml(author)}">
            <div class="avatar">${config.avatar}</div>
            <div class="avatar-tooltip">${this.escapeHtml(author)}</div>
          </div>
        `;
        
        return `
          <div class="msg-row msg-row--${side} ${isSubsequent ? 'msg-row--subsequent' : 'msg-row--new-author'}">
            ${side === 'left' ? avatarHtml : ''}
            
            <div class="msg-content">
              <div class="msg-bubble msg-bubble--${side}" 
                   style="background-color: ${config.bubbleColor}; color: ${config.textColor};">
                ${this.escapeHtml(text)}
              </div>
            </div>
            
            ${side === 'right' ? avatarHtml : ''}
          </div>
        `;
      })
      .join('');

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "PT Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
          --bb-bg-color: ${THEME.gray[50]};
          --bb-max-height: 600px;
        }

        .history {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-height: var(--bb-max-height, 600px);
          overflow-y: auto;
          scroll-behavior: smooth;
          background-color: transparent;
          border-radius: 0.5rem;
        }

        /* 消息行布局 */
        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          max-width: 80%;
        }

        .msg-row--left {
          align-self: flex-start;
          margin-right: auto;
        }

        .msg-row--right {
          align-self: flex-end;
          margin-left: auto;
        }

        .msg-row--subsequent {
          margin-top: 0.125rem;
        }

        .msg-row--new-author {
          margin-top: 0.75rem;
        }

        .msg-row--new-author:first-child {
          margin-top: 0;
        }

        /* 头像容器 */
        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
          width: 1.75rem;
          height: 1.75rem;
          background: #ffffff;
          border-radius: 50%;
          overflow: hidden;
          cursor: help;
        }

        .avatar-wrapper--hidden {
          opacity: 0;
          pointer-events: none;
        }

        .avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
        }

        .avatar svg {
          width: 100%;
          height: 100%;
        }

        /* 悬浮显示名字 */
        .avatar-tooltip {
          position: fixed;
          padding: 0.25rem 0.5rem;
          background: ${THEME.gray[800]};
          color: ${THEME.gray[50]};
          font-size: 0.75rem;
          border-radius: 0.25rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          z-index: 10;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .avatar-tooltip::after {
          content: '';
          position: absolute;
          top: calc(100% - 1px);
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: ${THEME.gray[800]};
        }

        .avatar-wrapper:hover .avatar-tooltip {
          opacity: 1;
          visibility: visible;
        }

        /* 消息内容区 */
        .msg-content {
          display: flex;
          flex-direction: column;
        }

        .msg-bubble {
          padding: 0.625rem 0.875rem;
          font-size: 0.9375rem;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: anywhere;
          word-break: break-word;
          border-radius: 1rem;
        }

        /* 左侧气泡 */
        .msg-bubble--left {
          border-bottom-left-radius: 0.25rem;
          background-color: ${THEME.gray[200]};
          color: ${THEME.gray[900]};
        }

        /* 右侧气泡 */
        .msg-bubble--right {
          border-bottom-right-radius: 0.25rem;
          /* 移除边框 */
        }

        /* 空状态 */
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: ${THEME.gray[400]};
          font-size: 0.875rem;
        }

        /* 移动端 */
        @media (max-width: 480px) {
          .history {
            max-height: var(--bb-max-height, 70vh);
          }
          
          .msg-row {
            max-width: 85%;
          }
          
          .msg-bubble {
            font-size: 0.9375rem;
            padding: 0.5rem 0.75rem;
          }
          
          .avatar-wrapper {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          :host {
            --bb-bg-color: ${THEME.gray[900]};
          }

          .history {
            background-color: transparent;
          }

          .msg-bubble {
            color: ${THEME.gray[100]};
          }

          .msg-bubble--left {
            background-color: ${THEME.gray[700]};
            color: ${THEME.gray[100]};
          }

          .avatar-wrapper {
            background: ${THEME.gray[800]};
          }

          .empty-state {
            color: ${THEME.gray[500]};
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .history {
            scroll-behavior: auto;
          }
        }

      </style>
      <div class="history" role="log" aria-live="polite" aria-label="Message history">
        ${messagesHtml}
      </div>
    `;

    requestAnimationFrame(() => {
      const container = this.shadowRoot!.querySelector('.history') as HTMLElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      // Position tooltips dynamically on hover to avoid overflow clipping
      this.shadowRoot!.querySelectorAll('.avatar-wrapper').forEach(wrapper => {
        wrapper.addEventListener('mouseenter', () => {
          const tooltip = wrapper.querySelector('.avatar-tooltip') as HTMLElement;
          if (!tooltip) return;
          const rect = wrapper.getBoundingClientRect();
          const tooltipRect = tooltip.getBoundingClientRect();
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
          tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
        });
      });
    });
  }

  private _renderEmpty() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: block; }
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: ${THEME.gray[400]};
          font-size: 0.875rem;
          font-family: inherit;
        }
      </style>
      <div class="empty-state">No messages</div>
    `;
  }
}

// 手动注册
function define(tagName = 'bb-msg-history') {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, tagName === 'bb-msg-history'
      ? BBMsgHistory
      : class extends BBMsgHistory {}
    );
  }
}

// 降级处理
function initBBMsgHistory() {
  try {
    define();
  } catch (error) {
    console.warn('BBMsgHistory registration failed, falling back to plain text:', error);
    
    document.querySelectorAll('bb-msg-history').forEach(el => {
      const pre = document.createElement('pre');
      pre.style.cssText = `
        background: ${THEME.gray[100]};
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
        font-size: 0.875rem;
        line-height: 1.5;
        color: ${THEME.gray[900]};
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        border: 1px solid ${THEME.gray[200]};
      `;
      pre.textContent = el.textContent || '';
      el.replaceWith(pre);
    });
  }
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBBMsgHistory);
} else {
  initBBMsgHistory();
}

export { BBMsgHistory, define };
export type { AuthorOptions };

declare global {
  interface HTMLElementTagNameMap {
    'bb-msg-history': BBMsgHistory;
  }
}