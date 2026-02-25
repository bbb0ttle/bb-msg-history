interface AuthorOptions {
    /** Avatar HTML string: SVG, <img>, emoji, or plain text */
    avatar?: string;
    /** Which side the messages appear on */
    side?: 'left' | 'right';
    /** Bubble background color */
    bubbleColor?: string;
    /** Text color inside bubble */
    textColor?: string;
}
declare class BBMsgHistory extends HTMLElement {
    private _mutationObserver?;
    private _userAuthors;
    constructor();
    /**
     * Configure an author's avatar, side, and colors.
     * Call before or after rendering — the component re-renders automatically.
     *
     * @example
     * el.setAuthor('alice', { avatar: '🐱', side: 'right', bubbleColor: '#e0f2fe' });
     * el.setAuthor('bob', { avatar: '<img src="bob.png" />', side: 'left' });
     */
    setAuthor(name: string, options: AuthorOptions): this;
    /**
     * Remove a previously set author config.
     */
    removeAuthor(name: string): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _setupMutationObserver;
    private parseMessages;
    private getAuthorConfig;
    private _wrapAvatarHtml;
    private _generateLetterAvatar;
    private escapeHtml;
    private render;
    private _renderEmpty;
}
declare function define(tagName?: string): void;
export { BBMsgHistory, define };
export type { AuthorOptions };
declare global {
    interface HTMLElementTagNameMap {
        'bb-msg-history': BBMsgHistory;
    }
}
