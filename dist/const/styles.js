import { THEME } from './theme.js';
/**
 * Main component styles
 */
export const MAIN_STYLES = `
  :host {
    display: block;
    font-family: "PT Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    --bb-bg-color: ${THEME.gray[50]};
    --bb-max-height: 600px;
  }

  .history {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-height: var(--bb-max-height, 600px);
    overflow-y: auto;
    scroll-behavior: smooth;
    background-color: transparent;
    border-radius: 0.5rem;
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
    margin-top: 0.125rem;
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
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    :host {
      --bb-bg-color: ${THEME.gray[900]};
    }

    .history {
      background-color: transparent;
    }

    .msg-bubble {
      color: ${THEME.gray[100]};
    }

    .msg-bubble--left {
      background-color: ${THEME.gray[700]};
      color: ${THEME.gray[100]};
    }

    .avatar-wrapper {
      background: ${THEME.gray[800]};
    }

    .empty-state {
      color: ${THEME.gray[500]};
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .history {
      scroll-behavior: auto;
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
