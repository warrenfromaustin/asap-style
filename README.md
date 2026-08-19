# asap-style

Shared browser styling and behavior assets for the ASAP family of
Streamlit applications (starting with `asap-ai`, aka "River of Talent").

## What's in this repo

| File | Purpose |
|------|---------|
| [`wave.css`](wave.css) | Single stylesheet for all browser-side CSS: background gradient/animation, chat bubble styling, header/button styling, and small HTML-wrapper markup exposed via CSS custom properties. |
| [`wave.js`](wave.js) | Single script for all browser-side JavaScript behavior (currently: auto-scroll the chat view to the latest message). |

This repo intentionally contains **only** these two front-end assets - no
Python application code, configuration, images, or deployment files. It
exists so that visual/behavioral styling can be versioned, reviewed, and
reused independently of any single application's codebase.

## Why a separate repo?

The originating application (`asap-ai`) follows a strict convention:

> All browser CSS lives in one stylesheet (`wave.css`) and all browser
> JavaScript lives in one script (`wave.js`). Application code only
> *references* these files (reads them from disk and injects them via
> `st.markdown` / `st.html`) - it never defines CSS rules or JS logic
> inline in Python.

Splitting these assets into their own repository:

- Lets a designer/front-end developer iterate on visuals and browser
  behavior without touching (or needing checkout access to) application
  source code.
- Makes it straightforward to share the same look-and-feel across
  multiple ASAP applications by pulling in this repo (e.g. as a git
  submodule, a copied release artifact, or a small package) rather than
  copy-pasting CSS/JS between projects.
- Keeps a clean version history for styling changes, separate from
  application logic changes.

## How consuming applications use these files

A consuming app is expected to:

1. Vendor a copy of `wave.css` and `wave.js` into its own project root
   (or reference this repo as a submodule/dependency).
2. Read `wave.css` from disk at render time and inject it via
   `st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)`.
3. Read `wave.js` from disk and inject it via `st.html(f"<script>{js}</script>")`
   at the point in the page where the behavior should run.
4. For any small HTML snippets that need to travel with their styling
   (e.g. a `<div>` wrapper used only to scope a CSS class), define them as
   CSS custom properties in `wave.css` (see `--human-connection-open` /
   `--human-connection-close`) and have the application parse those
   properties out at runtime, rather than hardcoding HTML tag strings in
   Python.

See [`CLAUDE.md`](CLAUDE.md) for detailed conventions to follow when
editing files in this repo.
