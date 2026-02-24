interface Message {
  author: string;
  text: string;
}

const AUTHOR_COLORS = [
  { bubble: '#fdf4f4', badge: '#fbd1d2' }, // yy-pink
  { bubble: '#f3f4f6', badge: '#e5e7eb' }, // gray
];

class BBMsgHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

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
      if (author && text) messages.push({ author, text });
    }
    return messages;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private render() {
    const messages = this.parseMessages();
    const authorOrder: string[] = [];
    for (const { author } of messages) {
      if (!authorOrder.includes(author)) authorOrder.push(author);
    }

    const messagesHtml = messages
      .map(({ author, text }) => {
        const idx = authorOrder.indexOf(author);
        const colors = AUTHOR_COLORS[idx % AUTHOR_COLORS.length];
        const side = idx % 2 === 0 ? 'left' : 'right';
        return `<div class="msg msg--${side}">
          <span class="msg__author" style="background:${colors.badge}">${this.escapeHtml(author)}</span>
          <span class="msg__text" style="background:${colors.bubble}">${this.escapeHtml(text)}</span>
        </div>`;
      })
      .join('');

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

        .history {
          max-width: 640px;
          margin: 0 auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .history::-webkit-scrollbar {
          width: 4px;
        }

        .history::-webkit-scrollbar-track {
          background: transparent;
        }

        .history::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }

        .msg {
          display: flex;
          flex-direction: column;
          max-width: 75%;
          gap: 4px;
        }

        .msg--left {
          align-self: flex-start;
          align-items: flex-start;
        }

        .msg--right {
          align-self: flex-end;
          align-items: flex-end;
        }

        .msg__author {
          font-size: 11px;
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .msg__text {
          font-size: 14px;
          color: #111827;
          padding: 8px 12px;
          border-radius: 8px;
          line-height: 1.5;
          word-break: break-word;
        }

        @media (max-width: 480px) {
          .history {
            padding: 12px;
            gap: 10px;
          }

          .msg {
            max-width: 85%;
          }

          .msg__text {
            font-size: 13px;
          }
        }
      </style>
      <div class="history">${messagesHtml}</div>
    `;

    // Scroll to the latest message
    const container = this.shadowRoot!.querySelector('.history') as HTMLElement;
    if (container) container.scrollTop = container.scrollHeight;
  }
}

customElements.define('bb-msg-history', BBMsgHistory);

export { BBMsgHistory };

declare global {
  interface HTMLElementTagNameMap {
    'bb-msg-history': BBMsgHistory;
  }
}
