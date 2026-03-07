import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Scroll-to-bottom button component
 * Emits bb-scroll-to-bottom event when clicked
 */
@customElement('bb-scroll-button')
export class BBScrollButton extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }

    .scroll-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #ffffff;
      border: none;
      color: ${unsafeCSS(THEME.gray[500])};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px) scale(0);
      transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s ease,
        box-shadow 0.2s ease;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    .scroll-btn.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .scroll-btn:hover {
      color: ${unsafeCSS(THEME.gray[700])};
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .scroll-btn:active {
      transform: translateY(-1px) scale(0.95);
    }

    .scroll-btn svg {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      :host {
        bottom: 12px;
      }

      .scroll-btn {
        width: 32px;
        height: 32px;
      }

      .scroll-btn svg {
        width: 18px;
        height: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-btn {
        transition:
          opacity 0.15s ease,
          visibility 0.15s ease;
        transform: translateY(10px) scale(0);
      }

      .scroll-btn.visible {
        transform: translateY(0) scale(1);
      }

      .scroll-btn:hover {
        transform: translateY(-2px) scale(1);
      }

      .scroll-btn:active {
        transform: translateY(0) scale(0.95);
      }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .scroll-btn {
        background: ${unsafeCSS(THEME.slate[800])};
        color: ${unsafeCSS(THEME.slate[300])};
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
      }

      .scroll-btn:hover {
        color: ${unsafeCSS(THEME.slate[200])};
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) visible = false;

  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent('bb-scroll-to-bottom', {
        bubbles: true,
        composed: true,
        detail: { behavior: 'smooth' },
      })
    );
  }

  render() {
    return html`
      <button
        class="scroll-btn ${this.visible ? 'visible' : ''}"
        @click=${this._handleClick}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-scroll-button': BBScrollButton;
  }
}
