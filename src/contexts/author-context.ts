import { createContext } from '@lit/context';
import type { AuthorOptions } from '../types/index.js';

/**
 * Lit Context for author configuration sharing
 * Allows sub-components to access author configs without prop drilling
 */
export const authorContext = createContext<Map<string, AuthorOptions>>('authors');
