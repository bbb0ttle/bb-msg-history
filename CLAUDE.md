# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build System

This is a TypeScript web component project built with:

- **Package manager**: pnpm (required - do not use npm/yarn)
- **Compiler**: TypeScript (`tsc` only, no bundler)
- **Minifier**: terser
- **Test runner**: vitest with happy-dom environment
- **Linter**: ESLint with TypeScript plugin
- **Formatter**: Prettier

### Key Commands

```bash
# Development
pnpm start              # Watch mode TypeScript compilation
pnpm preview            # Start Python HTTP server on port 8000

# Building
pnpm build              # Full build: compile + copy + minify
pnpm prepare            # Same as build (runs automatically on install)
```

Build outputs:
- `dist/index.js` - Minified production build
- `dist/index.dev.js` - Unminified development build
- `dist/*.d.ts` - Type declarations

### Testing

```bash
pnpm test               # Run tests once
pnpm test:watch         # Run tests in watch mode
```

Run a single test file:
```bash
pnpm vitest run tests/html.test.ts
```

### Code Quality

```bash
pnpm lint               # Check for lint errors
pnpm lint:fix           # Fix lint errors
pnpm format             # Format code with Prettier
pnpm format:check       # Check formatting without modifying files
```

### Release

```bash
pnpm release            # Create release using release-it
```

Uses conventional changelog with Angular preset. Creates git tag, GitHub release, and publishes to npm.

## Architecture

### Component Structure

The `bb-msg-history` component is a native Web Component extending `HTMLElement` with Shadow DOM:

```
src/
├── index.ts                    # Entry point: auto-registers component
├── component.ts                # Main BBMsgHistory class
├── types/index.ts              # TypeScript interfaces
├── const/
│   ├── styles.ts               # CSS-in-JS styles (MAIN_STYLES, EMPTY_STYLES)
│   ├── theme.ts                # Color palette (gray, slate, red, yyPink)
│   └── authors.ts              # Built-in author configurations
└── utils/
    ├── registration.ts         # define() and initBBMsgHistory()
    ├── message-parser.ts       # Parse "author: text" format
    ├── author-resolver.ts      # Resolve author config (fuzzy matching)
    ├── message-builder.ts      # Build HTML strings for messages
    ├── html.ts                 # HTML escaping utilities
    ├── avatar.ts               # Letter avatar generation
    ├── tooltip.ts              # Tooltip positioning
    └── scroll-button.ts        # Scroll-to-bottom button HTML
```

### Key Behaviors

**Message Format**: Simple plain text with `author: text` format, one message per line. Parsed by `message-parser.ts`.

**Author Configuration**:
- Users call `setAuthor(name, options)` to configure avatars, bubble colors, and side (left/right)
- Fuzzy matching: author names containing a configured key reuse that config (e.g., "alice(phone)" matches "alice")
- Priority: user exact > user fuzzy > built-in exact > built-in fuzzy > default (letter avatar)

**Rendering**:
- Uses Shadow DOM with styles injected as string constants
- Reactive: MutationObserver watches `textContent` changes and re-renders
- `appendMessage()` adds messages without full re-render, with smooth scroll
- Consecutive messages from same author hide avatar (grouping)

**Styling**: CSS custom properties for theming:
- `--bb-max-height`: Container max height (default: 600px)
- Dark mode via `prefers-color-scheme` media query in styles

### CI/CD Workflows

- **PR Checks** (`.github/workflows/pr-checks.yml`): Runs on PR/push to main - lint, format check, test, build
- **Deploy** (`.github/workflows/deploy.yml`): Builds and deploys `example/` + `dist/` to GitHub Pages on push to main

## Development Notes

- Always use `.js` extensions in TypeScript imports (ESM requirement)
- Component auto-registers on import, but `define()` export allows custom tag names
- HTML escaping is manual - always use `escapeHtml()` for user content
- Avatar supports: emoji, `<img>`, `<svg>`, or plain text (auto-wrapped in styled div)
- The component gracefully degrades to `<pre>` if Custom Elements unsupported
