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

## Built-in Authors

| Author | Avatar | Side | Bubble Color |
|--------|--------|------|--------------|
| `bbki.ng` | SVG | right | light gray |
| `xwy` | SVG | left | light pink |
| `小乌鸦` | first-char | left | light pink |

Any other author name is placed on the **left** side and receives a letter avatar (first character of the name).

If an author name _contains_ a built-in key (e.g. `bbki.ng(电话)` or `xwy_bot`), it will fuzzy-match and reuse that author's config. Note: only the `author.includes(key)` direction is matched — a short author name won't accidentally match a longer built-in key.

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
- SVG avatars with hover tooltip showing the author name
- Consecutive messages from the same author are grouped (avatar hidden)
- Auto-scroll to the latest message on render
- Long text word-wrap and overflow handling
- Empty state when no messages are provided
- Dark mode support via `prefers-color-scheme`
- Mobile responsive layout
- `prefers-reduced-motion` support
- Reactive: automatically re-renders when content changes
- Customizable max-height via `--bb-max-height` CSS custom property
- Graceful degradation to `<pre>` when Custom Elements are unsupported

## Examples

### Basic — built-in authors

```html
<bb-msg-history>
  bbki.ng: 谁呀？
  xwy: 谁谁谁，你猴爷爷！
</bb-msg-history>
```

### Consecutive messages — avatar grouping

When the same author sends multiple messages in a row, the avatar is only shown on the first one:

```html
<bb-msg-history>
  bbki.ng: 第一条
  bbki.ng: 第二条，头像隐藏了
  bbki.ng: 第三条，还是隐藏
  xwy: 收到！
  xwy: 我也连发两条
</bb-msg-history>
```

### Built-in first-char avatar — 小乌鸦

`小乌鸦` uses a first-character avatar with a custom pink bubble:

```html
<bb-msg-history>
  bbki.ng: 小乌鸦你好呀
  小乌鸦: 你好！我用首字符当头像
</bb-msg-history>
```

### Unknown authors — letter avatars

Authors not in the built-in config receive a letter avatar and appear on the left:

```html
<bb-msg-history>
  alice: Hello!
  bob: Hi there!
  charlie: Hey everyone!
</bb-msg-history>
```

### Fuzzy matching

An author name that contains a built-in key reuses that author's avatar and layout:

```html
<bb-msg-history>
  bbki.ng(电话): 名字包含 bbki.ng，复用右侧布局
  xwy_bot: 名字包含 xwy，复用粉色气泡
</bb-msg-history>
```

### Empty state

When no messages are provided, a "No messages" placeholder is shown:

```html
<bb-msg-history></bb-msg-history>
```

### Multi-party mixed conversation

```html
<bb-msg-history>
  bbki.ng: 大家好，开个会
  xwy: 好的好的
  小乌鸦: 来了来了
  dave: 我也在
  bbki.ng: 那我们开始吧
</bb-msg-history>
```

### Full page example

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bb-msg-history@latest/dist/index.js"></script>
</head>
<body>
  <bb-msg-history>
    alice: Hey, are you free this weekend?
    bob: Yeah, what's up?
    alice: Want to grab coffee?
    bob: Sounds good! Saturday morning?
    alice: Perfect, see you then!
  </bb-msg-history>
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
