/**
 * Build scroll-to-bottom button HTML string
 */
export function buildScrollButtonHtml() {
    return `
    <button class="scroll-to-bottom" aria-label="Scroll to bottom" title="Scroll to bottom">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  `;
}
