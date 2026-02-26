# AGENTS.md

Project guidance for AI coding agents working on `@bbki.ng/bb-msg-history`.

## Project Overview

`@bbki.ng/bb-msg-history` is a chat-style message history web component. It renders conversations from plain text using the `author: text` format, featuring avatars, chat bubbles, and smooth animations.

- **Package Name**: `@bbki.ng/bb-msg-history`
- **Version**: 0.2.0
- **License**: MIT
- **Author**: bbbottle <b@bbki.ng>

## Technology Stack

- **Language**: TypeScript
- **Target**: ES2020, ES Modules
- **Runtime**: Browser (Web Components / Custom Elements)
- **Build Tools**: TypeScript Compiler (`tsc`), Terser (minification)
- **Package Manager**: pnpm (pnpm-lock.yaml present)

## Project Structure

```
bb-msg-history/
├── src/
│   └── index.ts          # Single source file containing entire component (~612 lines)
├── dist/                 # Build output (committed to repo)
│   ├── index.js          # Minified production build
│   ├── index.dev.js      # Unminified development build (preserved)
│   └── index.d.ts        # TypeScript declarations
├── example/
│   └── index.html        # Demo page with 13 usage examples
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── README.md             # Human-readable documentation
└── AGENTS.md             # This file
```

## Code Organization

The entire component is contained in a single file `src/index.ts`:

### Key Interfaces
- `Message`: `{ author: string; text: string }`
- `AuthorConfig`: Full author configuration including avatar HTML, colors, side
- `AuthorOptions`: User-facing options for `setAuthor()` method

### Main Class: `BBMsgHistory`

Extends `HTMLElement`, implements a chat message history component using Shadow DOM.

**Public Methods:**
- `setAuthor(name, options)`: Configure an author's avatar, side, bubble color, text color
- `removeAuthor(name)`: Remove a previously set author configuration

**Private Methods:**
- `parseMessages()`: Parse text content into message array (format: `author: text`)
- `getAuthorConfig(author)`: Resolve author configuration with priority:
  1. User config (exact match)
  2. User config (fuzzy match - author name contains configured key)
  3. Built-in first-char avatar authors (like "小乌鸦")
  4. Built-in exact match (like "bbki.ng", "xwy")
  5. Built-in fuzzy match
  6. Default: letter avatar, left side
- `render()`: Render the component with messages
- `_renderEmpty()`: Render empty state

### Hardcoded Presets (Secret Authors)

The component includes built-in SVG avatars for specific authors:
- `bbki.ng`: Gray theme, right side
- `xwy` / `小乌鸦`: Pink theme, left side (bird SVG)

These are used by the original author for personal projects but don't affect other users.

### Theme Constants

The `THEME` object defines a color palette based on Tailwind-like gray scale and custom pink colors:
- `THEME.gray`: 50-900 scale
- `THEME.red`: 50-600 scale
- `THEME.yyPink`: Custom pink shades (50, 100, 150)

## Build Process

### Scripts (package.json)

```bash
# Development: Watch mode compilation
npm run start          # tsc -w

# Preview: Serve example with Python HTTP server
npm run preview        # python3 -m http.server 8000

# Production build (runs automatically on npm install)
npm run prepare        # tsc && cp dist/index.js dist/index.dev.js && terser dist/index.js --compress --mangle -o dist/index.js
```

### Build Steps

1. `tsc`: Compile TypeScript to `dist/index.js` with declarations
2. `cp`: Preserve unminified version as `dist/index.dev.js`
3. `terser`: Minify `dist/index.js` for production

### Output Files

- `dist/index.js`: Minified production bundle (distributed)
- `dist/index.dev.js`: Unminified version for debugging
- `dist/index.d.ts`: TypeScript type declarations

**Note**: The `dist/` directory is committed to the repository and included in npm package.

## Development Workflow

```bash
# Install dependencies
npm install

# Build the component
npm run prepare

# Watch mode (rebuild on changes)
npm run start

# Preview example (in another terminal)
npm run preview
# Then open http://localhost:8000/example/
```

## Code Style Guidelines

### TypeScript

- Use strict mode (enabled in tsconfig)
- Prefer `const` and `let` over `var`
- Use explicit return types on public methods
- Interface names use PascalCase
- Private methods prefixed with underscore (`_`)

### CSS (in Shadow DOM)

- CSS custom properties for theming (e.g., `--bb-max-height`)
- BEM-like naming: `.msg-row`, `.msg-row--left`, `.avatar-wrapper--hidden`
- Mobile-first responsive design with `@media (max-width: 480px)`
- Dark mode support via `prefers-color-scheme`
- Reduced motion support via `prefers-reduced-motion`

### Comments

Code comments are primarily in Chinese, especially for:
- Section headers (主题色板, 作者配置映射)
- Implementation notes
- Inline explanations

English is used for:
- JSDoc comments on public APIs
- Exported type definitions

## Features & Capabilities

1. **Plain-text format**: Messages use `author: text` format, one per line
2. **Avatar customization**: Emoji, `<img>`, `<svg>`, or letter avatars
3. **Left/right layout**: Configurable message bubble alignment per author
4. **Consecutive grouping**: Same-author messages hide subsequent avatars
5. **Fuzzy matching**: Author names containing configured keys reuse configs
6. **Hover tooltips**: Avatar hover shows author name
7. **Auto-scroll**: Scrolls to latest message on render
8. **Reactive**: MutationObserver re-renders when content changes
9. **Accessibility**: ARIA labels, `prefers-reduced-motion`, dark mode
10. **Graceful degradation**: Falls back to `<pre>` if Custom Elements unsupported

## Testing

**No automated tests currently exist.** Testing is done manually via:

1. Open `example/index.html` in a browser
2. Verify all 13 demo sections render correctly
3. Test in both light and dark modes
4. Test responsive layout at mobile widths
5. Test dynamic update section (click "Add message" button)

## NPM Publishing

```bash
# Version bump (manual)
# Edit package.json version field

# Build
npm run prepare

# Publish (public access)
npm publish --access public
```

The package is published under the `@bbki.ng` scope.

## CDN Usage

Published builds are available via jsDelivr:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@bbki.ng/bb-msg-history@latest/dist/index.js"></script>
```

## Security Considerations

1. **HTML escaping**: User message text is escaped via `escapeHtml()` to prevent XSS
2. **Avatar HTML**: When users provide custom avatar HTML via `setAuthor()`, it's inserted directly (trusted input assumption)
3. **Shadow DOM**: Styles are isolated, preventing external CSS leakage

## Adding New Features

When modifying the component:

1. Update `src/index.ts`
2. Run `npm run prepare` to rebuild
3. Verify in `example/index.html`
4. Update README.md if public API changes
5. Update version in package.json for releases

## Common Patterns

### Adding a New Built-in Author

Add to `AUTHOR_CONFIG` constant with SVG avatar HTML and theme colors.

### Adding a New CSS Custom Property

1. Define in `:host` selector with default value
2. Use with `var(--property-name, fallback)`
3. Document in README.md

### Adding a New Public Method

1. Add JSDoc with `@example`
2. Return `this` for chaining consistency
3. Call `this.render()` if UI needs update
4. Export type if options interface is new
