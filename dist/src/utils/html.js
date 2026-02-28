/**
 * HTML utility functions
 */
/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
/**
 * Wrap plain text/emoji avatar in a styled container
 * If HTML tags are present, return as-is
 */
export function wrapAvatarHtml(html) {
    // If it looks like a single emoji or short text (no HTML tags), wrap in a styled div
    if (!html.includes('<')) {
        return `<div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      line-height: 1;
    ">${html}</div>`;
    }
    return html;
}
