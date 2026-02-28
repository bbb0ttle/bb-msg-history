import type { AuthorConfig } from '../types/index.js';
/**
 * Built-in author configurations (secret presets)
 * These are used for specific authors in personal projects
 */
export declare const AUTHOR_CONFIG: Record<string, Omit<AuthorConfig, 'isCustomAvatar'>>;
/**
 * Authors that should use first-character avatar instead of SVG
 */
export declare const FIRST_CHAR_AVATAR_AUTHORS: Set<string>;
