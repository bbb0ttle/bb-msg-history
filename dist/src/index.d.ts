import { BBMsgHistory } from './component.js';
export { BBMsgHistory };
export { define } from './utils/registration.js';
export type { AuthorOptions, AuthorConfig, Message } from './types/index.js';
declare global {
    interface HTMLElementTagNameMap {
        'bb-msg-history': BBMsgHistory;
    }
}
