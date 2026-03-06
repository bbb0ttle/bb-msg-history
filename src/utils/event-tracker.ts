/**
 * EventTracker - Utility class for tracking and managing event listeners
 *
 * Provides centralized event listener registration and cleanup,
 * preventing memory leaks by ensuring all listeners are removed when no longer needed.
 */
export class EventTracker {
  private listeners: Array<{
    el: EventTarget;
    type: string;
    fn: EventListener;
    options?: AddEventListenerOptions;
  }> = [];

  /**
   * Add an event listener and track it for automatic cleanup
   *
   * @param el - Event target element
   * @param type - Event type (e.g., 'scroll', 'click')
   * @param fn - Event listener function
   * @param options - Optional addEventListener options
   */
  add(el: EventTarget, type: string, fn: EventListener, options?: AddEventListenerOptions): void {
    el.addEventListener(type, fn, options);
    this.listeners.push({ el, type, fn, options });
  }

  /**
   * Remove all tracked event listeners
   * Should be called when the component is disconnected to prevent memory leaks
   */
  cleanup(): void {
    this.listeners.forEach(({ el, type, fn, options }) => {
      el.removeEventListener(type, fn, options);
    });
    this.listeners = [];
  }
}
