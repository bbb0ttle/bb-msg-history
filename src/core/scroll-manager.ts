import type { EventTracker } from '../utils/event-tracker.js';

/**
 * ScrollManager - Handles scroll behavior, position detection, and scroll button visibility
 *
 * Isolates all scroll-related logic from the main component:
 * - Scroll to bottom with smooth animation
 * - Detect when user is near/at bottom of content
 * - Control scroll button visibility based on scroll position
 * - Dispatch custom events for scroll button state changes
 */
export class ScrollManager {
  private container?: HTMLElement;
  private button?: HTMLButtonElement | null;
  private isButtonVisible = false;

  // Threshold in pixels from bottom to consider "at bottom"
  private readonly BOTTOM_THRESHOLD = 50;

  constructor(
    private host: HTMLElement,
    private shadowRoot: ShadowRoot,
    private eventTracker: EventTracker,
    private onVisibilityChange: (visible: boolean) => void
  ) {}

  /**
   * Initialize scroll tracking on the container
   *
   * @param container - The scrollable history container
   * @param button - Optional scroll-to-bottom button element
   * @param skipInitialCheck - If true, skip the initial position check (for initial render)
   */
  init(container: HTMLElement, button?: HTMLButtonElement | null, skipInitialCheck = false): void {
    this.container = container;
    this.button = button ?? null;

    if (!skipInitialCheck) {
      this.checkPosition();
    }

    // Listen for scroll events with passive listener for performance
    this.eventTracker.add(container, 'scroll', () => this.checkPosition(), { passive: true });

    // Also check on resize
    this.eventTracker.add(window, 'resize', () => this.checkPosition());

    // Setup button click handler
    if (button && !this.host.hasAttribute('infinite')) {
      button.addEventListener('click', () => this.scrollToBottom());
    }
  }

  /**
   * Check current scroll position and update button visibility
   * Dispatches custom events when visibility changes
   */
  checkPosition(): void {
    if (!this.container) return;

    const isAtBottom = this.isAtBottom();
    const hasOverflow = this.container.scrollHeight > this.container.clientHeight;

    // Show button when not at bottom and content has overflow
    const shouldShow = !isAtBottom && hasOverflow;

    if (shouldShow !== this.isButtonVisible) {
      this.isButtonVisible = shouldShow;

      // Update button UI
      if (this.button) {
        this.button.classList.toggle('visible', shouldShow);
      }

      // Notify parent component
      this.onVisibilityChange(shouldShow);

      // Dispatch custom event
      this.host.dispatchEvent(
        new CustomEvent(shouldShow ? 'bb-scrollbuttonshow' : 'bb-scrollbuttonhide', {
          bubbles: true,
          composed: true,
          detail: { visible: shouldShow },
        })
      );
    }
  }

  /**
   * Scroll the container to the bottom
   *
   * @param behavior - Scroll behavior: 'smooth' or 'auto'
   */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    if (!this.container || this.host.hasAttribute('infinite')) {
      return;
    }

    this.container.scrollTo({
      top: this.container.scrollHeight,
      behavior,
    });

    // Hide button since we're scrolling to bottom
    if (this.isButtonVisible) {
      this.isButtonVisible = false;
      if (this.button) {
        this.button.classList.remove('visible');
      }
      this.onVisibilityChange(false);
      this.host.dispatchEvent(
        new CustomEvent('bb-scrollbuttonhide', {
          bubbles: true,
          composed: true,
          detail: { visible: false },
        })
      );
    }
  }

  /**
   * Check if the container is currently at or near the bottom
   *
   * @returns true if within threshold pixels of bottom
   */
  isAtBottom(): boolean {
    if (!this.container) return true;

    const distanceFromBottom =
      this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight;

    return distanceFromBottom < this.BOTTOM_THRESHOLD;
  }

  /**
   * Get the current button visibility state
   */
  get isVisible(): boolean {
    return this.isButtonVisible;
  }

  /**
   * Get the scrollable container element
   */
  getContainer(): HTMLElement | undefined {
    return this.container;
  }
}
