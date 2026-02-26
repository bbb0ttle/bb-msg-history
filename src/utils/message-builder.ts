import type { AuthorConfig } from '../types/index.js';
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
 * Build a single message row HTML string
 */
export function buildMessageRowHtml(
  author: string,
  text: string,
  config: AuthorConfig,
  isSubsequent: boolean
): string {
  const showAvatar = !isSubsequent;
  const side = config.side;
  const avatarHtml = buildAvatarHtml(author, config, showAvatar);
  
  return `
    <div class="msg-row msg-row--${side} ${isSubsequent ? 'msg-row--subsequent' : 'msg-row--new-author'}">
      ${side === 'left' ? avatarHtml : ''}
      
      <div class="msg-content">
        <div class="msg-bubble msg-bubble--${side}" 
             style="background-color: ${config.bubbleColor}; color: ${config.textColor};">
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
