import { FALLBACK_STYLES } from '../const/styles.js';

/**
 * Define the custom element
 */
export function define(
  BBMsgHistoryClass: CustomElementConstructor,
  tagName = 'bb-msg-history'
): void {
  if (!customElements.get(tagName)) {
    customElements.define(
      tagName,
      tagName === 'bb-msg-history' ? BBMsgHistoryClass : class extends BBMsgHistoryClass {}
    );
  }
}

/**
 * Initialize with fallback for unsupported browsers
 */
export function initBBMsgHistory(BBMsgHistoryClass: CustomElementConstructor): void {
  try {
    define(BBMsgHistoryClass);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('BBMsgHistory registration failed, falling back to plain text:', error);

    document.querySelectorAll('bb-msg-history').forEach(el => {
      const pre = document.createElement('pre');
      pre.style.cssText = FALLBACK_STYLES;
      pre.textContent = el.textContent || '';
      el.replaceWith(pre);
    });
  }
}
