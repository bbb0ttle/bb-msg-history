import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Timestamp component - displays message timestamp
 */
@customElement('bb-timestamp')
export class BBTimestamp extends LitElement {
  static styles = css`
    :host {
      display: block;
      --timestamp-opacity: 0;
      --timestamp-visibility: hidden;
    }

    .timestamp {
      font-size: 11px;
      color: ${unsafeCSS(THEME.gray[400])};
      white-space: nowrap;
      line-height: 1;
      pointer-events: none;
      opacity: var(--timestamp-opacity);
      visibility: var(--timestamp-visibility);
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }

    :host([side='left']) .timestamp {
      text-align: left;
    }

    :host([side='right']) .timestamp {
      text-align: right;
    }

    @media (prefers-color-scheme: dark) {
      .timestamp {
        color: ${unsafeCSS(THEME.gray[500])};
      }
    }
  `;

  @property() value = '';
  @property({ reflect: true }) side: 'left' | 'right' = 'left';

  render() {
    return html`<div class="timestamp">${this.value}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-timestamp': BBTimestamp;
  }
}
