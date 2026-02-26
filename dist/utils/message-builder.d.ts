import type { AuthorConfig } from '../types/index.js';
/**
 * Build avatar HTML string
 */
export declare function buildAvatarHtml(author: string, config: AuthorConfig, showAvatar: boolean): string;
/**
 * Build a single message row HTML string
 */
export declare function buildMessageRowHtml(author: string, text: string, config: AuthorConfig, isSubsequent: boolean): string;
/**
 * Setup tooltip for a single avatar wrapper element
 */
export declare function setupTooltipForElement(wrapper: Element): void;
