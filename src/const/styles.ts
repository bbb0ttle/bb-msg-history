import { THEME } from './theme.js';

/**
 * Main component styles
 */
export const MAIN_STYLES = `
  :host {
    display: block;
    position: relative;
    font-family: "PT Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    --bb-bg-color: ${THEME.gray[50]};
    --bb-max-height: 600px;
    --bb-avatar-bg: #ffffff;
    --bb-avatar-color: ${THEME.gray[600]};
  }

  .history {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-height: var(--bb-max-height, 600px);
    overflow-y: auto;
    scroll-behavior: smooth;
    background-color: transparent;
    border-radius: 0.5rem;
    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: ${THEME.gray[400]} transparent;
  }

  /* Custom scrollbar for webkit browsers */
  .history::-webkit-scrollbar {
    width: 6px;
  }

  .history::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  .history::-webkit-scrollbar-thumb {
    background: ${THEME.gray[400]};
    border-radius: 3px;
  }

  .history::-webkit-scrollbar-thumb:hover {
    background: ${THEME.gray[500]};
  }

  /* Scroll to bottom button */
  .scroll-to-bottom {
    position: absolute;
    bottom: 16px;
    left: 50%;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: ${THEME.gray[500]};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) translateY(10px) scale(0.9);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  .scroll-to-bottom.visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0) scale(1);
  }

  .scroll-to-bottom:hover {
    color: ${THEME.gray[700]};
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .scroll-to-bottom:active {
    transform: translateX(-50%) translateY(0) scale(0.95);
  }

  .scroll-to-bottom svg {
    width: 20px;
    height: 20px;
  }

  /* Message row layout */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    max-width: 80%;
  }

  .msg-row--left {
    align-self: flex-start;
    margin-right: auto;
  }

  .msg-row--right {
    align-self: flex-end;
    margin-left: auto;
  }

  .msg-row--subsequent {
    margin-top: 0.375rem;
  }

  .msg-row--new-author {
    margin-top: 0.75rem;
  }

  .msg-row--new-author:first-child {
    margin-top: 0;
  }

  /* Avatar container */
  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    background: #ffffff;
    border-radius: 50%;
    overflow: hidden;
    cursor: help;
  }

  .avatar-wrapper--hidden {
    opacity: 0;
    pointer-events: none;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar svg {
    width: 100%;
    height: 100%;
  }

  /* Hover tooltip */
  .avatar-tooltip {
    position: fixed;
    padding: 0.25rem 0.5rem;
    background: ${THEME.gray[800]};
    color: ${THEME.gray[50]};
    font-size: 0.75rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 10;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .avatar-tooltip::after {
    content: '';
    position: absolute;
    top: calc(100% - 1px);
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${THEME.gray[800]};
  }

  .avatar-wrapper:hover .avatar-tooltip {
    opacity: 1;
    visibility: visible;
  }

  /* Message content area */
  .msg-content {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 12px;
  }

  /* Timestamp styles */
  .msg-timestamp {
    position: absolute;
    font-size: 11px;
    color: ${THEME.gray[400]};
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    white-space: nowrap;
    bottom: 1px;
    line-height: 1;
    pointer-events: none;
  }

  .msg-timestamp--left {
    left: 0;
  }

  .msg-timestamp--right {
    right: 0;
  }

  .msg-row:hover .msg-timestamp {
    opacity: 1;
    visibility: visible;
  }

  .msg-bubble {
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    word-break: break-word;
    border-radius: 1rem;
  }

  /* Left bubble */
  .msg-bubble--left {
    border-bottom-left-radius: 0.25rem;
    background-color: ${THEME.gray[200]};
    color: ${THEME.gray[900]};
  }

  /* Right bubble */
  .msg-bubble--right {
    border-bottom-right-radius: 0.25rem;
    color: ${THEME.gray[900]};
  }

  /* Subsequent messages - all corners rounded */
  .msg-row--subsequent .msg-bubble--left {
    border-bottom-left-radius: 1rem;
  }

  .msg-row--subsequent .msg-bubble--right {
    border-bottom-right-radius: 1rem;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: ${THEME.gray[400]};
    font-size: 0.875rem;
  }

  /* Mobile responsive */
  @media (max-width: 480px) {
    .history {
      max-height: var(--bb-max-height, 70vh);
    }
    
    .msg-row {
      max-width: 85%;
    }
    
    .msg-bubble {
      font-size: 0.9375rem;
      padding: 0.5rem 0.75rem;
    }
    
    .avatar-wrapper {
      width: 1.5rem;
      height: 1.5rem;
    }

    .scroll-to-bottom {
      width: 32px;
      height: 32px;
      bottom: 12px;
    }

    .scroll-to-bottom svg {
      width: 18px;
      height: 18px;
    }
  }

  /* Dark mode styles - shared between media query and attribute */
  :host([theme="dark"]) {
    --bb-bg-color: ${THEME.gray[900]};
    --bb-avatar-bg: ${THEME.slate[600]};
    --bb-avatar-color: ${THEME.slate[200]};
  }

  :host([theme="dark"]) .history {
    background-color: transparent;
    scrollbar-color: ${THEME.gray[600]} transparent;
  }

  :host([theme="dark"]) .history::-webkit-scrollbar-thumb {
    background: ${THEME.gray[600]};
  }

  :host([theme="dark"]) .history::-webkit-scrollbar-thumb:hover {
    background: ${THEME.gray[500]};
  }

  :host([theme="dark"]) .msg-bubble {
    color: ${THEME.slate[100]};
  }

  :host([theme="dark"]) .msg-bubble--right {
    background-color: ${THEME.slate[700]};
    color: ${THEME.slate[100]};
  }

  :host([theme="dark"]) .msg-bubble--left {
    background-color: ${THEME.slate[800]};
    border: 1px solid ${THEME.slate[700]};
    color: ${THEME.slate[100]};
  }

  :host([theme="dark"]) .avatar-wrapper {
    background: ${THEME.slate[600]};
  }

  :host([theme="dark"]) .empty-state {
    color: ${THEME.gray[500]};
  }

  :host([theme="dark"]) .scroll-to-bottom {
    background: ${THEME.slate[800]};
    border: none;
    color: ${THEME.slate[300]};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  :host([theme="dark"]) .scroll-to-bottom:hover {
    color: ${THEME.slate[200]};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  /* System dark mode preference */
  @media (prefers-color-scheme: dark) {
    :host {
      --bb-bg-color: ${THEME.gray[900]};
      --bb-avatar-bg: ${THEME.slate[600]};
      --bb-avatar-color: ${THEME.slate[200]};
    }

    .history {
      background-color: transparent;
      scrollbar-color: ${THEME.gray[600]} transparent;
    }

    .history::-webkit-scrollbar-thumb {
      background: ${THEME.gray[600]};
    }

    .history::-webkit-scrollbar-thumb:hover {
      background: ${THEME.gray[500]};
    }

    .msg-bubble {
      color: ${THEME.slate[100]};
    }

    .msg-bubble--right {
      background-color: ${THEME.slate[700]};
      color: ${THEME.slate[100]};
    }

    .msg-bubble--left {
      background-color: ${THEME.slate[800]};
      border: 1px solid ${THEME.slate[700]};
      color: ${THEME.slate[100]};
    }

    .avatar-wrapper {
      background: ${THEME.slate[600]};
    }

    .empty-state {
      color: ${THEME.gray[500]};
    }

    .scroll-to-bottom {
      background: ${THEME.slate[800]};
      border: none;
      color: ${THEME.slate[300]};
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    }

    .scroll-to-bottom:hover {
      color: ${THEME.slate[200]};
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .history {
      scroll-behavior: auto;
    }

    .scroll-to-bottom {
      transition: opacity 0.15s ease, visibility 0.15s ease;
      transform: translateX(-50%);
    }

    .scroll-to-bottom.visible {
      transform: translateX(-50%);
    }

    .scroll-to-bottom:hover {
      transform: translateX(-50%);
    }

    .scroll-to-bottom:active {
      transform: translateX(-50%);
    }
  }
`;

/**
 * Empty state styles
 */
export const EMPTY_STYLES = `
  :host { display: block; }
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: ${THEME.gray[400]};
    font-size: 0.875rem;
    font-family: inherit;
  }
`;

/**
 * Fallback styles for when custom elements are not supported
 */
export const FALLBACK_STYLES = `
  background: ${THEME.gray[100]};
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${THEME.gray[900]};
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  border: 1px solid ${THEME.gray[200]};
`;
