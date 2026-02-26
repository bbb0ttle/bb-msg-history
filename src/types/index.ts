/**
 * Type definitions for bb-msg-history
 */

/** Single message structure */
export interface Message {
  author: string;
  text: string;
}

/** Internal author configuration with resolved values */
export interface AuthorConfig {
  avatar: string;
  bubbleColor: string;
  textColor: string;
  side: 'left' | 'right';
  isCustomAvatar: boolean;
}

/** User-facing options for configuring an author */
export interface AuthorOptions {
  /** Avatar HTML string: SVG, <img>, emoji, or plain text */
  avatar?: string;
  /** Which side the messages appear on */
  side?: 'left' | 'right';
  /** Bubble background color */
  bubbleColor?: string;
  /** Text color inside bubble */
  textColor?: string;
}

/** Theme color palette */
export interface Theme {
  gray: Record<string, string>;
  red: Record<string, string>;
  yyPink: Record<string, string>;
}
