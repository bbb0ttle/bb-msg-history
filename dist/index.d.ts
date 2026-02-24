declare class BBMsgHistory extends HTMLElement {
    private _resizeObserver?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _setupResizeObserver;
    private _adjustLayout;
    private parseMessages;
    private getAuthorConfig;
    private _generateLetterAvatar;
    private escapeHtml;
    private render;
    private _renderEmpty;
}
export { BBMsgHistory };
declare global {
    interface HTMLElementTagNameMap {
        'bb-msg-history': BBMsgHistory;
    }
}
