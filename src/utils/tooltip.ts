/**
 * Setup dynamic tooltip positioning
 * Tooltips are positioned fixed to avoid overflow clipping from parent containers
 */
export function setupTooltips(shadowRoot: ShadowRoot): void {
  shadowRoot.querySelectorAll('.avatar-wrapper').forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
      const tooltip = wrapper.querySelector('.avatar-tooltip') as HTMLElement;
      if (!tooltip) return;
      const rect = wrapper.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
      tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
    });
  });
}
