import type { AuthorConfig, AuthorOptions } from '../types/index.js';
import { THEME } from '../const/theme.js';
import { AUTHOR_CONFIG, FIRST_CHAR_AVATAR_AUTHORS } from '../const/authors.js';
import { wrapAvatarHtml } from './html.js';
import { generateLetterAvatar } from './avatar.js';

/**
 * Resolve author configuration with the following priority:
 * 1. User config (exact match)
 * 2. User config (fuzzy match - author name contains configured key)
 * 3. Built-in first-char avatar authors
 * 4. Built-in exact match
 * 5. Built-in fuzzy match
 * 6. Default: letter avatar, left side
 */
export function resolveAuthorConfig(
  author: string,
  userAuthors: Map<string, AuthorOptions>
): AuthorConfig {
  // 1. User custom config (exact match)
  const userConfig = userAuthors.get(author);
  if (userConfig) {
    return {
      avatar: userConfig.avatar
        ? wrapAvatarHtml(userConfig.avatar)
        : generateLetterAvatar(author.charAt(0).toUpperCase()),
      bubbleColor: userConfig.bubbleColor || THEME.gray[50],
      textColor: userConfig.textColor || THEME.gray[900],
      side: userConfig.side || 'left',
      isCustomAvatar: !!userConfig.avatar,
    };
  }

  // 2. User custom config (fuzzy match)
  for (const [key, cfg] of userAuthors.entries()) {
    if (author.includes(key)) {
      return {
        avatar: cfg.avatar
          ? wrapAvatarHtml(cfg.avatar)
          : generateLetterAvatar(author.charAt(0).toUpperCase()),
        bubbleColor: cfg.bubbleColor || THEME.gray[50],
        textColor: cfg.textColor || THEME.gray[900],
        side: cfg.side || 'left',
        isCustomAvatar: !!cfg.avatar,
      };
    }
  }

  // 3. Built-in first-char avatar authors
  if (FIRST_CHAR_AVATAR_AUTHORS.has(author)) {
    const config = AUTHOR_CONFIG[author];
    const firstChar = author.charAt(0);
    return {
      ...(config || { bubbleColor: THEME.gray[50], textColor: THEME.gray[900], side: 'left' as const }),
      avatar: generateLetterAvatar(firstChar),
      isCustomAvatar: false
    };
  }

  // 4. Built-in exact match
  if (AUTHOR_CONFIG[author]) {
    return { ...AUTHOR_CONFIG[author], isCustomAvatar: true };
  }

  // 5. Built-in fuzzy match
  for (const [key, config] of Object.entries(AUTHOR_CONFIG)) {
    if (author.includes(key)) {
      return { ...config, isCustomAvatar: true };
    }
  }
  
  // 6. Default: letter avatar, left side
  const firstChar = author.charAt(0).toUpperCase();
  return {
    avatar: generateLetterAvatar(firstChar),
    bubbleColor: THEME.gray[50],
    textColor: THEME.gray[900],
    side: 'left',
    isCustomAvatar: false
  };
}
