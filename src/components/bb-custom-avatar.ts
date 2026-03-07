import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { THEME } from '../const/theme.js';

/**
 * Custom avatar component - displays SVG, img, emoji, or HTML content
 * Includes tooltip on hover
 */
@customElement('bb-custom-avatar')
export class BBCustomAvatar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 1.75rem;
      height: 1.75rem;
    }

    .avatar-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 50%;
      overflow: hidden;
      cursor: help;
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

    .avatar ::slotted(svg) {
      width: 100%;
      height: 100%;
    }

    .avatar ::slotted(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Tooltip styles */
    .avatar-tooltip {
      position: fixed;
      padding: 0.25rem 0.5rem;
      background: ${unsafeCSS(THEME.gray[800])};
      color: ${unsafeCSS(THEME.gray[50])};
      font-size: 0.75rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      z-index: 10000;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition:
        opacity 0.2s ease,
        visibility 0.2s ease;
    }

    .avatar-tooltip::after {
      content: '';
      position: absolute;
      top: calc(100% - 1px);
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: ${unsafeCSS(THEME.gray[800])};
    }

    .avatar-tooltip.visible {
      opacity: 1;
      visibility: visible;
    }

    @media (max-width: 480px) {
      :host {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `;

  @property() tooltip = '';

  private _tooltipRef: HTMLElement | null = null;
  private _showTooltip = false;

  private _onMouseEnter() {
    this._showTooltip = true;
    this.requestUpdate();
    // Wait for the tooltip to be rendered before positioning
    requestAnimationFrame(() => this._positionTooltip());
  }

  private _onMouseLeave() {
    this._showTooltip = false;
    this.requestUpdate();
  }

  private _positionTooltip() {
    if (!this._tooltipRef || !this._showTooltip) return;

    // Force a layout to ensure tooltip has dimensions
    this._tooltipRef.style.display = 'block';
    const tooltipRect = this._tooltipRef.getBoundingClientRect();
    if (tooltipRect.width === 0 || tooltipRect.height === 0) {
      // If dimensions are zero, retry next frame
      requestAnimationFrame(() => this._positionTooltip());
      return;
    }

    const rect = this.getBoundingClientRect();
    // Center horizontally, position above with 8px gap
    const left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    const top = rect.top - tooltipRect.height - 8;

    this._tooltipRef.style.left = `${left}px`;
    this._tooltipRef.style.top = `${top}px`;
  }

  render() {
    return html`
      <div
        class="avatar-wrapper"
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
      >
        <div class="avatar"><slot></slot></div>
      </div>
      <div
        class="avatar-tooltip ${this._showTooltip ? 'visible' : ''}"
        ${(el: HTMLElement | undefined) => {
          if (el) this._tooltipRef = el;
        }}
      >
        ${this.tooltip}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-custom-avatar': BBCustomAvatar;
  }
}
