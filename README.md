# bb-msg-history

Chat-style message history web component. Render conversations from plain text, with avatars, bubbles, and smooth animations.

## Install

```bash
npm install @bbki.ng/bb-msg-history
```

CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bb-msg-history@latest/dist/index.js"></script>
```

## Usage

Place messages inside the element using the `author: text` format, one per line:

```html
<bb-msg-history>
  alice: Hey, are you free this weekend?
  bob: Sounds good! When?
  alice: Saturday morning, around 10?
  bob: Perfect. See you then!
</bb-msg-history>
```

## Message Format

Each message is a line with the author name, a colon, and the message text:

```
<author>: <message text>
```

Blank lines and lines without a colon are ignored.

## Author Avatars

By default, every author gets a **letter avatar** (first character of their name) and appears on the **left** side.

Use the `setAuthor()` method to customize avatar, side, bubble color, and text color:

```js
const el = document.querySelector('bb-msg-history');

// Emoji avatar, right side
el.setAuthor('me', { avatar: '🐱', side: 'right' });

// Image avatar, custom bubble color
el.setAuthor('bot', {
  avatar: '<img src="bot.png" width="28" height="28" />',
  side: 'left',
  bubbleColor: '#e0f2fe',
});

// SVG avatar
el.setAuthor('alice', {
  avatar: '<svg viewBox="0 0 48 48">...</svg>',
  side: 'left',
});
```

### `setAuthor(name, options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `avatar` | `string` | letter avatar | HTML string: emoji, `<img>`, `<svg>`, or text |
| `side` | `'left' \| 'right'` | `'left'` | Which side the bubbles appear on |
| `bubbleColor` | `string` | `'#f9fafb'` | Bubble background color |
| `textColor` | `string` | `'#111827'` | Text color inside bubble |

Returns `this` for chaining:

```js
el.setAuthor('me', { avatar: '🐱', side: 'right' })
  .setAuthor('you', { avatar: '🐶', side: 'left' });
```

Fuzzy matching: if an author name _contains_ a configured key (e.g. you configured `"alice"` and the message is from `"alice(phone)"`), the config is reused.

Use `removeAuthor(name)` to remove a custom config.

### `appendMessage(message)`

Append a message programmatically with smooth scroll to the new message.

| Parameter | Type | Description |
|-----------|------|-------------|
| `message.author` | `string` | The author name |
| `message.text` | `string` | The message text |

```js
el.appendMessage({ author: 'alice', text: 'Hello!' });
el.appendMessage({ author: 'bob', text: 'How are you?' });
```

Returns `this` for chaining. This is ideal for chat applications where messages arrive in real-time.

**Note:** Unlike modifying `textContent` directly, `appendMessage()` scrolls smoothly to the newly added message.

## Customization

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--bb-max-height` | `600px` | Maximum height of the message container |

```css
bb-msg-history {
  --bb-max-height: 400px;
}
```

### Manual Registration

By default, the component auto-registers as `<bb-msg-history>`. You can also register manually with a custom tag name:

```js
import { BBMsgHistory, define } from '@bbki.ng/bb-msg-history';

// Register with default tag name
define();

// Or use a custom tag name
define('my-chat-history');
```

## Features

- Plain-text message format — no JSON or attributes needed
- Left/right bubble layout based on author
- Customizable avatars: emoji, `<img>`, `<svg>`, or letter avatars
- Hover tooltip showing the author name
- Consecutive messages from the same author are grouped (avatar hidden)
- Auto-scroll to the latest message on render
- **`appendMessage()` API** — programmatically add messages with smooth scroll
- Long text word-wrap and overflow handling
- Empty state when no messages are provided
- Dark mode support via `prefers-color-scheme`
- Mobile responsive layout
- `prefers-reduced-motion` support
- Reactive: automatically re-renders when content changes
- Customizable max-height via `--bb-max-height` CSS custom property
- Graceful degradation to `<pre>` when Custom Elements are unsupported

## Examples

### Basic

```html
<bb-msg-history>
  alice: Hey, are you free this weekend?
  bob: Sounds good! When?
  alice: Saturday morning, around 10?
  bob: Perfect. See you then!
</bb-msg-history>
```

### Custom avatars

```html
<bb-msg-history id="chat">
  me: Hey there!
  friend: What's up?
</bb-msg-history>

<script>
  const el = document.getElementById('chat');
  el.setAuthor('me', { avatar: '🐱', side: 'right', bubbleColor: '#f3f4f6' });
  el.setAuthor('friend', { avatar: '🐶', side: 'left', bubbleColor: '#e0f2fe' });
</script>
```

### Consecutive messages — avatar grouping

When the same author sends multiple messages in a row, the avatar is only shown on the first one:

```html
<bb-msg-history>
  alice: First message
  alice: Second message, avatar hidden
  alice: Third, still hidden
  bob: Got it!
  bob: I'll send two as well
</bb-msg-history>
```

### Unknown authors — letter avatars

Authors without custom config receive a letter avatar and appear on the left:

```html
<bb-msg-history>
  alice: Hello!
  bob: Hi there!
  charlie: Hey everyone!
</bb-msg-history>
```

### Empty state

When no messages are provided, a "No messages" placeholder is shown:

```html
<bb-msg-history></bb-msg-history>
```

### Dynamic message appending

Use `appendMessage()` to add messages programmatically with smooth scrolling:

```html
<bb-msg-history id="chat" style="--bb-max-height: 300px;">
  alice: Hey there!
</bb-msg-history>

<script>
  const el = document.getElementById('chat');
  el.setAuthor('alice', { avatar: '👩', side: 'right' });
  el.setAuthor('bob', { avatar: '👨', side: 'left' });

  // Add messages dynamically with smooth scroll
  el.appendMessage({ author: 'bob', text: 'Hello! How are you?' });
  el.appendMessage({ author: 'alice', text: 'I\'m doing great!' });
  
  // Simulate receiving a message after 2 seconds
  setTimeout(() => {
    el.appendMessage({ author: 'bob', text: 'Nice to hear that!' });
  }, 2000);
</script>
```

### Full page example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bb-msg-history@latest/dist/index.js"></script>
</head>
<body>
  <bb-msg-history id="chat">
    alice: Hey, are you free this weekend?
    bob: Yeah, what's up?
    alice: Want to grab coffee?
    bob: Sounds good! Saturday morning?
    alice: Perfect, see you then!
  </bb-msg-history>

  <script>
    const el = document.getElementById('chat');
    el.setAuthor('alice', { avatar: '👩', side: 'right' });
    el.setAuthor('bob', { avatar: '👨', side: 'left', bubbleColor: '#ecfdf5' });
  </script>
</body>
</html>
```

See `example/` directory for a full demo.

## Development

```bash
npm install
npm run prepare
```

## License

MIT
