import { BBMsgHistory } from './component.js';
import { initBBMsgHistory } from './utils/registration.js';
// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initBBMsgHistory(BBMsgHistory));
}
else {
    initBBMsgHistory(BBMsgHistory);
}
// Re-exports
export { BBMsgHistory };
export { define } from './utils/registration.js';
