# asap-style - Technical Documentation

## Overview

`asap-style` is a minimal, framework-agnostic repository holding the
shared browser-side styling (`wave.css`) and behavior (`wave.js`) assets
used by ASAP family Streamlit applications. It contains **no application
code** - only front-end assets meant to be read from disk and injected
into a page by a consuming app.

This repo was extracted from `asap-ai` (River of Talent), which remains
the reference implementation for how to consume these files.

## Repository Contents

```
asap-style/
├── README.md      # High-level purpose and usage
├── CLAUDE.md       # This file - conventions for editing wave.css/wave.js
├── wave.css        # All browser CSS
└── wave.js         # All browser JavaScript
```

There is intentionally no `src/`, no `requirements.txt`, no Dockerfile,
and no application configuration here. If you find yourself wanting to
add Python, YAML, or deployment files to this repo, that content belongs
in the consuming application's repository instead.

## Core Convention

> All browser CSS lives in `wave.css`. All browser JavaScript lives in
> `wave.js`. Nothing else defines styling or script logic.

This means:

- **Do not** split CSS across multiple files. If a new visual feature is
  added, add a clearly-commented section to `wave.css` rather than
  creating `wave2.css` or a component-specific stylesheet.
- **Do not** split JS across multiple files. Add new behaviors to
  `wave.js` as additional self-contained IIFEs, following the pattern of
  the existing `scrollToBottom` block.
- **Do not** add inline `<style>` or `<script>` blocks to application
  Python/HTML - those belong here, referenced indirectly.

## HTML Markup Embedded in CSS

Some consuming code needs small, static HTML wrapper snippets (e.g. a
`<div>` tag used only to scope a CSS class for `st.html()`). Rather than
hardcoding those tag strings in application Python, this repo exposes
them as **CSS custom properties** under `:root`, e.g.:

```css
:root {
    --human-connection-open: "<div class=\"human-connection\">";
    --human-connection-close: "</div>";
}
```

Guidelines for this pattern:

1. Name custom properties descriptively: `--<feature>-open` /
   `--<feature>-close` (or `--<feature>-html` for a single self-closing
   snippet).
2. Keep the value a valid double-quoted CSS string, with any internal
   double quotes escaped as `\"`.
3. Place the property block immediately near the CSS rule it pairs with
   (e.g. `.human-connection` styling and `--human-connection-*` markup
   live next to each other), with a comment explaining the pairing.
4. Consuming code is responsible for parsing the property value out of
   the stylesheet text (e.g. a small helper function that reads
   `wave.css` and regex-extracts the named custom property) and must
   provide a safe fallback default in case the property is missing or
   the file can't be read.

## Editing Guidelines

### `wave.css`

- Group related rules under a clearly labeled comment banner, e.g.:
  ```css
  /* ---------------------------------------------------------------------
     Section name
     --------------------------------------------------------------------- */
  ```
- When a rule replaces or formerly lived as inline Python/JS in a
  consuming application, note that provenance in a comment so future
  readers can find the original context.
- Prefer class selectors (`.my-component`) over ids, and prefer targeting
  Streamlit's own `data-testid` attributes where available for stability
  across Streamlit versions.
- Keep animations/keyframes near the rule that uses them.

### `wave.js`

- Wrap each independent behavior in its own IIFE `(function() { ... })();`
  so behaviors don't leak variables into each other or the global scope.
- Keep behaviors idempotent/safe to re-run, since consuming apps may
  re-inject the script on every rerender (e.g. Streamlit reruns).
- Avoid dependencies on any JS framework/library - this script is
  injected raw via `st.html()`/`<script>` and must run standalone in the
  browser.

## Versioning & Distribution

This repo has no build step or package manifest - it is consumed by
copying `wave.css` and `wave.js` into a consuming application's project
root (or by referencing this repo directly, e.g. as a git submodule).
When making a breaking change (e.g. renaming a CSS class or custom
property that a consuming app depends on), search consuming
applications for references before merging, and update them in
lock-step.

## Non-Goals

- No Python, YAML, or other application logic.
- No build tooling (bundlers, preprocessors, linters) - keep the assets
  plain CSS/JS so they can be read and injected as-is.
- No secrets, credentials, or environment-specific configuration.
