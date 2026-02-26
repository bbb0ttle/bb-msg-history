/**
 * HTML utility functions
 */
/**
 * Escape HTML special characters to prevent XSS
 */
export declare function escapeHtml(str: string): string;
/**
 * Wrap plain text/emoji avatar in a styled container
 * If HTML tags are present, return as-is
 */
export declare function wrapAvatarHtml(html: string): string;
