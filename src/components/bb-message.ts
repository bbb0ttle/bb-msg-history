import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import type { AuthorOptions, AuthorConfig } from '../types/index.js';
import { authorContext } from '../contexts/author-context.js';
import { resolveAuthorConfig } from '../utils/author-resolver.js';
import { FIRST_CHAR_AVATAR_AUTHORS } from '../const/authors.js';
import './bb-letter-avatar.js';
import './bb-custom-avatar.js';
import './bb-message-bubble.js';
import './bb-timestamp.js';

/**
 * Message row component - composes avatar, bubble, and timestamp
 */
@customElement('bb-message')
export class BBMessage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 80%;
    }

    :host([side='left']) {
      align-self: flex-start;
      margin-right: auto;
    }

    :host([side='right']) {
      align-self: flex-end;
      margin-left: auto;
      flex-direction: row-reverse;
    }

    :host([subsequent]) {
      margin-top: 0.375rem;
    }

    :host(:not([subsequent])) {
      margin-top: 0.75rem;
    }

    :host(:first-of-type:not([subsequent])) {
      margin-top: 0;
    }

    .content {
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 12px;
    }

    :host(:hover) bb-timestamp {
      --timestamp-opacity: 1;
      --timestamp-visibility: visible;
    }

    .avatar-container {
      flex-shrink: 0;
      width: 1.75rem;
      height: 1.75rem;
    }

    :host([subsequent]) .avatar-container {
      opacity: 0;
      pointer-events: none;
    }

    @media (max-width: 480px) {
      :host {
        max-width: 85%;
      }

      .avatar-container {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `;

  @property() author = '';
  @property() text = '';
  @property() timestamp = '';
  @property({ type: Boolean, reflect: true }) subsequent = false;
  @property({ type: Boolean, reflect: true }) lastInGroup = false;
  @property({ reflect: true }) side: 'left' | 'right' = 'left';

  @consume({ context: authorContext, subscribe: true })
  @state()
  private _authors?: Map<string, AuthorOptions>;

  private _getConfig(): AuthorConfig {
    return resolveAuthorConfig(this.author, this._authors ?? new Map());
  }

  willUpdate(changedProps: PropertyValues<this>) {
    if (changedProps.has('author' as any) || changedProps.has('_authors' as any)) {
      const config = this._getConfig();
      this.side = config.side;
    }
  }

  private _renderAvatar(config: AuthorConfig) {
    const isLetterAvatar = !config.isCustomAvatar || FIRST_CHAR_AVATAR_AUTHORS.has(this.author);

    if (isLetterAvatar) {
      return html`
        <bb-letter-avatar
          class="avatar-container"
          .letter=${this.author.charAt(0).toUpperCase()}
        ></bb-letter-avatar>
      `;
    }

    // Custom avatar - need to parse the avatar HTML
    const avatarContent = config.avatar;
    const isPlainText = !avatarContent.includes('<');

    if (isPlainText) {
      // Single emoji or text - wrap in styled div
      return html`
        <bb-custom-avatar class="avatar-container" .tooltip=${this.author}>
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              line-height: 1;
            "
          >
            ${avatarContent}
          </div>
        </bb-custom-avatar>
      `;
    }

    // HTML content (SVG, img, etc.)
    return html`
      <bb-custom-avatar class="avatar-container" .tooltip=${this.author}>
        <div .innerHTML=${avatarContent}></div>
      </bb-custom-avatar>
    `;
  }

  render() {
    const config = this._getConfig();

    return html`
      ${this._renderAvatar(config)}
      <div class="content">
        <bb-message-bubble
          .text=${this.text}
          side=${this.side}
          ?subsequent=${this.subsequent}
          custom-bg=${config.bubbleColor}
          custom-color=${config.textColor}
        ></bb-message-bubble>
        ${this.lastInGroup && this.timestamp
          ? html`<bb-timestamp .value=${this.timestamp} side=${this.side}></bb-timestamp>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bb-message': BBMessage;
  }
}
