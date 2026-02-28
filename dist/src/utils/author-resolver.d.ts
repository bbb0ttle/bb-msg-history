import type { AuthorConfig, AuthorOptions } from '../types/index.js';
/**
 * Resolve author configuration with the following priority:
 * 1. User config (exact match)
 * 2. User config (fuzzy match - author name contains configured key)
 * 3. Built-in first-char avatar authors
 * 4. Built-in exact match
 * 5. Built-in fuzzy match
 * 6. Default: letter avatar, left side
 */
export declare function resolveAuthorConfig(author: string, userAuthors: Map<string, AuthorOptions>): AuthorConfig;
