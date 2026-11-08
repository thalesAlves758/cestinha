# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Cestinha is an offline grocery-list PWA (Android/Chrome, single user, personal use). **No code exists yet** — the only source of truth is [docs/refinamento.md](docs/refinamento.md) (in Portuguese), which defines requirements (RF01–RF20), business rules (RN01–RN15), non-functional requirements (RNF01–RNF09), screens (T01–T07) and the data model. Read the relevant sections before implementing a feature and reference requirement IDs in commits/PRs. Implementation is broken into task cards in `docs/cards/` (start at `docs/cards/_index.md` for order, dependencies and traceability). Only "MVP" items are in scope; "Depois" items and the listed non-goals (login/backend, "finish purchase" state, combining templates, grams unit, price history) must not be built.

**Language split (RNF10):** all code is in **English** — variables, functions, files, folders, hash routes, IndexedDB stores and fields, comments. Only user-facing UI text is **pt-BR**. The spec itself is written in Portuguese, and a few spots in its section 12 still use Portuguese names (`#/listas`, `#/lista/:id`, `views/listas…configuracoes`, `quantidade * valorCentavos`); translate those to English (`#/lists`, `#/list/:id`, `views/lists`, `settings`, `quantity * priceCents`) rather than copying them.

## Stack constraints (decided — don't substitute)

- **Vanilla JavaScript**, no framework, no npm dependencies at runtime. ES modules served directly as static files.
- **IndexedDB via the native API** — no Dexie or other wrappers.
- **Tailwind CSS via the standalone CLI** (no Node required). Never use the Tailwind Play CDN.
- **Service Worker** for full offline support; **GitHub Pages** hosting. No external network calls, analytics, or downloaded fonts (system font stack only).

## Commands (planned)

No build tooling exists yet. Per the spec, the only build step is Tailwind, using the v4 standalone binary saved at the repo root as `tailwindcss.exe` (gitignored; development machine is Windows):

```sh
# compile CSS (add --watch during development, --minify for deploy)
./tailwindcss.exe -i styles/input.css -o styles/output.css
```

`styles/output.css` is generated — edit `styles/input.css` instead. The machine has no Python or Node, so serve the repo root with the VS Code **Live Server** extension (service workers require localhost or HTTPS).

## Architecture (planned, see spec section 12)

- `index.html` + `manifest.webmanifest` + `sw.js` at root; `src/app.js` boots the app and does **hash routing** (`#/lists`, `#/list/:id`, …) so GitHub Pages needs no 404 fallback.
- `src/db.js` is the only module touching IndexedDB (database `cestinha`, stores `templates` keyed by `id` with index `updatedAt`; `lists` keyed by `id` with indexes `createdAt`, `templateId`). All schema changes go through versioned migrations in `onupgradeneeded`.
- `src/calc.js` holds pure functions for subtotal, totals, progress and pt-BR formatting/parsing.
- `src/views/` holds one module per screen (lists, list, templates, template, settings).
- Theme preference lives in `localStorage` under key `cestinha.theme` (not IndexedDB) and must be applied before first render to avoid a theme flash. Dark mode is class-based on `<html>`: in Tailwind v4, `@custom-variant dark (&:where(.dark, .dark *));`. Modes: automatic (follow system), light, dark.

## Domain rules that are easy to get wrong

- **Items are embedded** in their template/list record (`items` array), not separate stores. Template items and list items share one shape (`id`, `name`, `quantity`, `unit`, `priceCents`, `order`); list items add `checked`. Generating a list copies each template item with a **new `id`** and `checked: false`.
- A list generated from a template is an **independent copy**; editing either never affects the other, except when the user accepts the "add to template" suggestion (RF14), which copies only name, quantity and unit (not price).
- RF14 suggestion only appears if the source template still exists, and name comparison ignores case, accents and extra whitespace. Deleting a template never deletes its lists.
- Money is stored as **integer cents** (`priceCents`, nullable). Subtotal = `Math.round(quantity * priceCents)`. Item with no price has no subtotal and is excluded from both totals but still counts toward progress.
- **Total previsto** = all priced items; **total no carrinho** = checked priced items; **progresso** = checked / all items (0% for empty list). Totals/subtotals/progress are always computed, never stored.
- Quantity: required, > 0, up to 3 decimals, default 1; unit `un` | `kg` (default `un`). Price is per unit or per kg. Inputs accept comma decimals and use `inputmode="decimal"`; display with `Intl.NumberFormat('pt-BR')` (R$ 1.234,56, 1,5 kg).
- Checked items render struck-through and sink to the bottom; unchecked keep insertion order (`order`).
- IDs via `crypto.randomUUID()`; dates as ISO 8601.

## Deployment gotchas

- App is served under a subpath (`/cestinha/`): use **relative paths** in the manifest (`start_url`, `scope`), SW registration and asset URLs.
- **Bump the cache name in `sw.js` on every deploy** and delete old caches in `activate`, or installed phones get stuck on an old version.
- Call `navigator.storage.persist()` on first run.
- UI: touch targets ≥ 44px, WCAG AA contrast in both themes, tabular numerals for prices/totals, state never conveyed by color alone.
