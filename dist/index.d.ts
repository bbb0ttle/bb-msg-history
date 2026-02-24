declare class BBMsgHistory extends HTMLElement {
    constructor();
    connectedCallback(): void;
    private parseMessages;
    private escapeHtml;
    private render;
}
export { BBMsgHistory };
declare global {
    interface HTMLElementTagNameMap {
        'bb-msg-history': BBMsgHistory;
    }
}
