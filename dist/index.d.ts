declare class BBMsgHistory extends HTMLElement {
    private _mutationObserver?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _setupMutationObserver;
    private parseMessages;
    private getAuthorConfig;
    private _generateLetterAvatar;
    private escapeHtml;
    private render;
    private _renderEmpty;
}
declare function define(tagName?: string): void;
export { BBMsgHistory, define };
declare global {
    interface HTMLElementTagNameMap {
        'bb-msg-history': BBMsgHistory;
    }
}
