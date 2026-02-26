import type { AuthorOptions, Message } from './types/index.js';
export declare class BBMsgHistory extends HTMLElement {
    private _mutationObserver?;
    private _userAuthors;
    private _messages;
    private _lastAuthor;
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
    /**
     * Append a message to the history.
     * Automatically scrolls to the new message with smooth animation.
     *
     * @example
     * el.appendMessage({ author: 'alice', text: 'Hello!' });
     * el.appendMessage({ author: 'bob', text: 'How are you?' });
     */
    appendMessage(message: Message): this;
    private _appendSingleMessage;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _setupMutationObserver;
    private render;
    private _renderEmpty;
}
