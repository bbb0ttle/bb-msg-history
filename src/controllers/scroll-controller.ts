import type { ReactiveController } from 'lit';
import type { LitElement } from 'lit';

/**
 * ScrollController - Reactive controller for scroll behavior
 *
 * Encapsulates scroll-related logic:
 * - Scroll to bottom with smooth animation
 * - Detect when user is near/at bottom of content
 * - Control scroll button visibility based on scroll position
 */
export class ScrollController implements ReactiveController {
  private host: LitElement;
  private _container?: HTMLElement;
  private _intersectionObserver?: IntersectionObserver;
  private _resizeObserver?: ResizeObserver;
  private _isVisible = false;

  // Threshold in pixels from bottom to consider "at bottom"
  private readonly BOTTOM_THRESHOLD = 50;

  constructor(host: LitElement) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    // Wait for render to complete before querying DOM
    this.host.updateComplete.then(() => {
      this._init();
    });
  }

  hostDisconnected() {
    this._cleanup();
  }

  hostUpdated() {
    // Re-initialize if container becomes available
    if (!this._container) {
      this._init();
    }
  }

  private _init() {
    const host = this.host as LitElement;
    this._container = host.renderRoot?.querySelector('.history-container') as
      | HTMLElement
      | undefined;

    if (this._container) {
      this._initIntersectionObserver();
      this._initResizeObserver();
      this.checkPosition();
    }
  }

  private _cleanup() {
    this._intersectionObserver?.disconnect();
    this._resizeObserver?.disconnect();
    this._container = undefined;
  }

  private _initIntersectionObserver() {
    if (!this._container) return;

    // Observe the last message to detect if we're at bottom
    const lastMsg = this._container.lastElementChild;
    if (!lastMsg) return;

    this._intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const wasVisible = this._isVisible;
          this._isVisible = !entry.isIntersecting;

          if (wasVisible !== this._isVisible) {
            this.host.requestUpdate();
          }
        });
      },
      {
        root: this._container,
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    this._intersectionObserver.observe(lastMsg);
  }

  private _initResizeObserver() {
    if (!this._container) return;

    this._resizeObserver = new ResizeObserver(() => {
      this.checkPosition();
    });

    this._resizeObserver.observe(this._container);
  }

  /**
   * Check current scroll position and update visibility state
   */
  checkPosition(): void {
    if (!this._container) return;

    const isAtBottom = this.isAtBottom();
    const hasOverflow = this._container.scrollHeight > this._container.clientHeight;

    // Show button when not at bottom and content has overflow
    const shouldShow = !isAtBottom && hasOverflow;

    if (shouldShow !== this._isVisible) {
      this._isVisible = shouldShow;
      this.host.requestUpdate();
    }
  }

  /**
   * Scroll the container to the bottom
   * @param behavior - Scroll behavior: 'smooth' or 'auto'
   */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    if (!this._container) return;

    this._container.scrollTo({
      top: this._container.scrollHeight,
      behavior,
    });

    // Hide button since we're scrolling to bottom
    if (this._isVisible) {
      this._isVisible = false;
      this.host.requestUpdate();
    }
  }

  /**
   * Check if the container is currently at or near the bottom
   * @returns true if within threshold pixels of bottom
   */
  isAtBottom(): boolean {
    if (!this._container) return true;

    const distanceFromBottom =
      this._container.scrollHeight - this._container.scrollTop - this._container.clientHeight;

    return distanceFromBottom < this.BOTTOM_THRESHOLD;
  }

  /**
   * Get the current button visibility state
   */
  get isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Get the scrollable container element
   */
  get container(): HTMLElement | undefined {
    return this._container;
  }

  /**
   * Update the observed last message (call when messages change)
   */
  updateObservedMessage() {
    this._intersectionObserver?.disconnect();
    this._initIntersectionObserver();
    this.checkPosition();
  }
}
