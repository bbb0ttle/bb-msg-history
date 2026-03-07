import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Loading overlay component - displays spinner overlay
 */
@customElement('bb-loading-overlay')
export class BBLoadingOverlay extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      z-index: 20;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(1px);
      border-radius: 0.5rem;
      min-height: 120px;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid ${unsafeCSS(THEME.gray[200])};
      border-top-color: ${unsafeCSS(THEME.gray[500])};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 1.5s;
        opacity: 0.8;
      }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .overlay {
        background: rgba(17, 24, 39, 0.6);
      }

      .spinner {
        border-color: ${unsafeCSS(THEME.gray[700])};
        border-top-color: ${unsafeCSS(THEME.gray[400])};
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) visible = false;

  render() {
    if (!this.visible) {
      return html``;
    }

    return html`
      <div class="overlay" role="status" aria-label="Loading messages">
        <div class="spinner"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-loading-overlay': BBLoadingOverlay;
  }
}
