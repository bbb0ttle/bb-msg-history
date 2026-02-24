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

Two authors have built-in SVG avatars and are pre-configured with a specific side:

| Author | Side | Bubble Color |
|--------|------|--------------|
| `bbki.ng` | right | light gray |
| `xwy` | left | light pink |

Any other author name is placed on the **left** side and receives a letter avatar (first character of the name).

## Features

- Plain-text message format — no JSON or attributes needed
- Left/right bubble layout based on author
- SVG avatars with hover tooltip showing the author name
- Auto-scroll to the latest message on render
- Fade-in animation per message row
- Dark mode support via `prefers-color-scheme`
- Mobile responsive layout
- `prefers-reduced-motion` support
- Graceful degradation to `<pre>` when Custom Elements are unsupported

## Examples

### Basic conversation

```html
<bb-msg-history>
  bbki.ng: 谁呀？
  xwy: 谁谁谁，你猴爷爷！
  bbki.ng: foo
  xwy: bar
</bb-msg-history>
```

### Unknown / custom authors

Authors not listed in the built-in config receive a letter avatar and appear on the left:

```html
<bb-msg-history>
  alice: Hey!
  bob: Hi there!
  alice: How are you?
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
