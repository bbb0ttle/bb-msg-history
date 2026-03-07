import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Message bubble component - displays message text with theming
 */
@customElement('bb-message-bubble')
export class BBMessageBubble extends LitElement {
  static styles = css`
    :host {
      display: block;
      --bubble-bg: var(--bb-bubble-bg, ${unsafeCSS(THEME.gray[50])});
      --bubble-color: var(--bb-bubble-color, ${unsafeCSS(THEME.gray[900])});
      --bubble-radius: 1rem;
    }

    :host([side='right']) {
      --bubble-bg: var(--bb-bubble-right-bg, ${unsafeCSS(THEME.gray[200])});
    }

    .bubble {
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      word-break: break-word;
      border-radius: var(--bubble-radius);
      background-color: var(--bubble-bg);
      color: var(--bubble-color);
    }

    /* Left side bubble - squared bottom left */
    :host([side='left']:not([subsequent])) .bubble {
      border-bottom-left-radius: 0.25rem;
    }

    /* Right side bubble - squared bottom right */
    :host([side='right']:not([subsequent])) .bubble {
      border-bottom-right-radius: 0.25rem;
    }

    @media (max-width: 480px) {
      .bubble {
        font-size: 0.9375rem;
        padding: 0.5rem 0.75rem;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :host {
        --bubble-bg: var(--bb-bubble-bg-dark, ${unsafeCSS(THEME.slate[800])});
        --bubble-color: var(--bb-bubble-color-dark, ${unsafeCSS(THEME.slate[100])});
      }

      :host([side='right']) {
        --bubble-bg: var(--bb-bubble-right-bg-dark, ${unsafeCSS(THEME.slate[700])});
      }

      .bubble {
        border: 1px solid ${unsafeCSS(THEME.slate[700])};
      }

      :host([side='right']) .bubble {
        border: none;
      }
    }
  `;

  @property() text = '';
  @property({ reflect: true }) side: 'left' | 'right' = 'left';
  @property({ type: Boolean, reflect: true }) subsequent = false;
  @property({ attribute: 'custom-bg' }) customBg = '';
  @property({ attribute: 'custom-color' }) customColor = '';

  private _getInlineStyles() {
    const styles: string[] = [];
    if (this.customBg) {
      styles.push(`background-color: ${this.customBg}`);
    }
    if (this.customColor) {
      styles.push(`color: ${this.customColor}`);
    }
    return styles.length > 0 ? styles.join('; ') : '';
  }

  render() {
    const style = this._getInlineStyles();
    return html`<div class="bubble" style="${style}">${this.text}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-message-bubble': BBMessageBubble;
  }
}
