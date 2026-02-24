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
  blue: {
    600: '#000000',
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
  private _resizeObserver?: ResizeObserver;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._setupResizeObserver();
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
  }

  private _setupResizeObserver() {
    if ('ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => {
        this._adjustLayout();
      });
      this._resizeObserver.observe(this);
    }
  }

  private _adjustLayout() {}

  private parseMessages(): Message[] {
    const raw = this.textContent || '';
    const messages: Message[] = [];
    
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('- ')) continue;
      
      const content = trimmed.slice(2).trim();
      const colonIdx = content.indexOf(':');
      if (colonIdx <= 0) continue;
      
      const author = content.slice(0, colonIdx).trim();
      const text = content.slice(colonIdx + 1).trim();
      
      if (author && text) {
        messages.push({ author, text });
      }
    }
    
    return messages;
  }

  private getAuthorConfig(author: string): AuthorConfig {
    // 使用首字符头像的作者
    if (FIRST_CHAR_AVATAR_AUTHORS.has(author)) {
      const config = AUTHOR_CONFIG[author];
      const firstChar = author.charAt(0);
      return {
        ...(config || { bubbleColor: THEME.gray[50], textColor: THEME.gray[900], side: 'left' as const }),
        avatar: this._generateLetterAvatar(firstChar),
        isCustomAvatar: false
      };
    }
    // 精确匹配
    if (AUTHOR_CONFIG[author]) {
      return { ...AUTHOR_CONFIG[author], isCustomAvatar: true };
    }
    // 模糊匹配
    for (const [key, config] of Object.entries(AUTHOR_CONFIG)) {
      if (author.includes(key) || key.includes(author)) {
        return { ...config, isCustomAvatar: true };
      }
    }
    
    // 默认：使用首字母作为头像
    const firstChar = author.charAt(0).toUpperCase();
    const side = 'left'; // 默认左侧
    
    return {
      avatar: this._generateLetterAvatar(firstChar),
      bubbleColor: THEME.gray[50],
      textColor: THEME.gray[900],
      side,
      isCustomAvatar: false
    };
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
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
          <div class="msg-row msg-row--${side} ${isSubsequent ? 'msg-row--subsequent' : ''}">
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
        }

        .history {
          max-width: 640px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-height: 600px;
          overflow-y: auto;
          scroll-behavior: smooth;
          background-color: transparent;
          border-radius: 0.5rem;
        }

        .history::-webkit-scrollbar {
          width: 0.5rem;
        }
        .history::-webkit-scrollbar-track {
          background: transparent;
        }
        .history::-webkit-scrollbar-thumb {
          background-color: ${THEME.gray[300]};
          border-radius: 0.25rem;
        }

        /* 消息行布局 */
        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          max-width: 80%;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
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

        /* 头像容器 */
        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          overflow: hidden;
          background: #ffffff;
          cursor: help;
          transition: transform 0.15s ease;
        }

        .avatar-wrapper:hover {
          transform: scale(1.1);
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
        }

        .avatar svg {
          width: 100%;
          height: 100%;
        }

        /* 悬浮显示名字 */
        .avatar-tooltip {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          padding: 0.25rem 0.5rem;
          background: ${THEME.gray[800]};
          color: ${THEME.gray[50]};
          font-size: 0.75rem;
          border-radius: 0.25rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.15s ease;
          pointer-events: none;
          z-index: 10;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .avatar-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: ${THEME.gray[800]};
        }

        .avatar-wrapper:hover .avatar-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) scale(1);
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
            padding: 0.75rem;
            max-height: 70vh;
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

        /* 暗色模式 */
        @media (prefers-color-scheme: dark) {
          :host {
            --bb-bg-color: ${THEME.gray[900]};
          }
          
          .msg-bubble--left {
            background-color: ${THEME.gray[700]} !important;
            color: ${THEME.gray[100]} !important;
          }
          
          .msg-bubble--right {
            background-color: ${THEME.gray[800]} !important;
            color: ${THEME.gray[100]} !important;
            border-color: ${THEME.gray[700]};
          }
          
          .avatar-wrapper {
            background: #ffffff;
          }
          
          .avatar-tooltip {
            background: ${THEME.gray[200]};
            color: ${THEME.gray[900]};
          }
          
          .avatar-tooltip::after {
            border-top-color: ${THEME.gray[200]};
          }
        }

        /* 减少动画 */
        @media (prefers-reduced-motion: reduce) {
          .msg-row {
            animation: none;
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

// 降级处理
function initBBMsgHistory() {
  try {
    if (!customElements.get('bb-msg-history')) {
      customElements.define('bb-msg-history', BBMsgHistory);
    }
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

export { BBMsgHistory };

declare global {
  interface HTMLElementTagNameMap {
    'bb-msg-history': BBMsgHistory;
  }
}