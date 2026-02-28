import { describe, it, expect } from 'vitest';
import { escapeHtml, wrapAvatarHtml } from '../src/utils/html.js';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle string without special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("'test'")).toBe('&#39;test&#39;');
  });

  it('should escape ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });
});

describe('wrapAvatarHtml', () => {
  it('should wrap plain text in styled container', () => {
    const result = wrapAvatarHtml('😀');
    expect(result).toContain('<div style=');
    expect(result).toContain('😀');
  });

  it('should return HTML as-is when tags are present', () => {
    const html = '<img src="avatar.png" />';
    expect(wrapAvatarHtml(html)).toBe(html);
  });

  it('should wrap emoji in styled container', () => {
    const result = wrapAvatarHtml('🎉');
    expect(result).toContain('display: flex');
    expect(result).toContain('🎉');
  });
});
