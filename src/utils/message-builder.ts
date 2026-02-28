import type { AuthorConfig } from '../types/index.js';
import { THEME } from '../const/theme.js';
import { escapeHtml } from './html.js';

/**
 * Build avatar HTML string
 */
export function buildAvatarHtml(author: string, config: AuthorConfig, showAvatar: boolean): string {
  return `
    <div class="avatar-wrapper ${showAvatar ? '' : 'avatar-wrapper--hidden'}"
         data-author="${escapeHtml(author)}">
      <div class="avatar">${config.avatar}</div>
      <div class="avatar-tooltip">${escapeHtml(author)}</div>
    </div>
  `;
}

/**
 * Build timestamp HTML string
 */
export function buildTimestampHtml(timestamp: string, side: 'left' | 'right'): string {
  return `<span class="msg-timestamp msg-timestamp--${side}">${escapeHtml(timestamp)}</span>`;
}

/**
 * Build a single message row HTML string
 */
export function buildMessageRowHtml(
  author: string,
  text: string,
  config: AuthorConfig,
  isSubsequent: boolean,
  timestamp?: string,
  isLastInGroup?: boolean
): string {
  const showAvatar = !isSubsequent;
  const side = config.side;
  const avatarHtml = buildAvatarHtml(author, config, showAvatar);
  // Only show timestamp on the last message of a group
  const timestampHtml = isLastInGroup && timestamp ? buildTimestampHtml(timestamp, side) : '';

  // Build inline style only for custom colors (not defaults)
  const isDefaultBubbleColor = config.bubbleColor === THEME.gray[50];
  const isDefaultTextColor = config.textColor === THEME.gray[900];
  const inlineStyles: string[] = [];

  if (!isDefaultBubbleColor) {
    inlineStyles.push(`background-color: ${config.bubbleColor}`);
  }
  if (!isDefaultTextColor) {
    inlineStyles.push(`color: ${config.textColor}`);
  }

  const styleAttr = inlineStyles.length > 0 ? ` style="${inlineStyles.join('; ')}"` : '';

  return `
    <div class="msg-row msg-row--${side} ${isSubsequent ? 'msg-row--subsequent' : 'msg-row--new-author'}">
      ${side === 'left' ? avatarHtml : ''}

      <div class="msg-content">
        ${timestampHtml}
        <div class="msg-bubble msg-bubble--${side}"${styleAttr}>
          ${escapeHtml(text)}
        </div>
      </div>

      ${side === 'right' ? avatarHtml : ''}
    </div>
  `;
}

/**
 * Setup tooltip for a single avatar wrapper element
 */
export function setupTooltipForElement(wrapper: Element): void {
  wrapper.addEventListener('mouseenter', () => {
    const tooltip = wrapper.querySelector('.avatar-tooltip') as HTMLElement;
    if (!tooltip) return;
    const rect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
  });
}
