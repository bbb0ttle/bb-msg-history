import { BBMsgHistory } from './components/bb-msg-history.js';

// Auto-register the custom element
if (!customElements.get('bb-msg-history')) {
  customElements.define('bb-msg-history', BBMsgHistory);
}

// Re-export types
export type { AuthorOptions, AuthorConfig, Message } from './types/index.js';
export type { MessageParser, MessageInput } from './parsers/base.js';

// Re-export main component
export { BBMsgHistory };

// Utility function for custom element registration
export function define(BBMsgHistoryClass: typeof BBMsgHistory, tagName = 'bb-msg-history'): void {
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      tagName === 'bb-msg-history' ? BBMsgHistoryClass : class extends BBMsgHistoryClass {}
    );
  }
}

// Global type declaration
declare global {
  interface HTMLElementTagNameMap {
    'bb-msg-history': BBMsgHistory;
  }
}
