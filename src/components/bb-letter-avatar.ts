import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Letter avatar component - displays a letter in a circular container
 */
@customElement('bb-letter-avatar')
export class BBLetterAvatar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 1.75rem;
      height: 1.75rem;
    }

    .avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bb-avatar-bg, #ffffff);
      color: var(--bb-avatar-color, ${unsafeCSS(THEME.gray[600])});
      font-size: 14px;
      font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
      border-radius: 50%;
      overflow: hidden;
    }

    @media (max-width: 480px) {
      :host {
        width: 1.5rem;
        height: 1.5rem;
      }

      .avatar {
        font-size: 12px;
      }
    }
  `;

  @property() letter = '';

  render() {
    return html`<div class="avatar">${this.letter}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-letter-avatar': BBLetterAvatar;
  }
}
