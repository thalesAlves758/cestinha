# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cestinha is an offline grocery-list PWA (Android/Chrome, single user, personal use). The spec is [docs/refinamento.md](docs/refinamento.md) (in Portuguese): requirements RF01–RF20, business rules RN01–RN15, non-functional RNF01–RNF10, screens T01–T07, data model. Only "MVP" items are in scope; "Depois" items and the non-goals (login/backend, "finish purchase" state, combining templates, grams unit, price history) must not be built.

## Workflow: task cards

Work is split into cards in `docs/cards/`. [docs/cards/_index.md](docs/cards/_index.md) has the execution order, dependencies, traceability and project-wide assumptions. When implementing a card:
- Read the card, the `_index.md` assumptions and the spec sections listed under its "Referências".
- Stay within the card's scope ("Fora do escopo" is binding); respect `depende_de`.
- When done: check every acceptance criterion, set `status: done` in the card frontmatter **and** in the `_index.md` table, and commit with a message prefixed by the card ID (e.g. `CARD-003: cálculos e formatação pt-BR`).

## No unit tests

**Do not create unit test files, test pages or test harnesses** (e.g. `tests/calc.test.html`, `tests/*.test.js`). This overrides any card that asks for them (CARD-003, CARD-011 and the `_index.md` premise mention a browser test page — skip that part). Verify logic by reasoning through the card's acceptance examples; the user validates behavior manually in the browser.

## Commands

No package manager, linter or bundler. The only build step is Tailwind, using the v4 standalone binary at the repo root (`tailwindcss.exe`, gitignored; dev machine is Windows):

```sh
./tailwindcss.exe -i styles/input.css -o styles/output.css --watch    # development
./tailwindcss.exe -i styles/input.css -o styles/output.css --minify   # before committing for deploy
```

`styles/output.css` is generated but **committed** (GitHub Pages runs no build) — never edit it by hand; rebuild it after adding new classes. The machine has no Python or Node; the app is served with the VS Code **Live Server** extension (service workers need localhost/HTTPS).

## Stack constraints (decided — don't substitute)

- Vanilla JavaScript ES modules served as static files; no framework, no npm dependencies.
- IndexedDB via the native API only (no Dexie or wrappers).
- Tailwind via the standalone CLI; never the Play CDN.
- No external network calls, analytics or downloaded fonts (system font stack).
- **Language split (RNF10):** all code in English (identifiers, files, routes, stores, fields, comments); only user-facing text in pt-BR. Section 12 of the spec still shows some Portuguese names (`#/listas`, `views/listas…configuracoes`, `quantidade * valorCentavos`) — use the English equivalents.

## Architecture

- **Shell + router:** `index.html` holds the static shell (header with settings link, `<main id="view">`, bottom `<nav id="tabs">`). `src/app.js` declares the route table (pattern → lazy `import()` of a view) and hides the tabs outside top-level routes (`/lists`, `/templates`). `src/router.js` is a hash router: unknown/empty hash → `#/lists`; stale async loads are discarded via a token.
- **View contract:** each `src/views/*.js` exports `render(container, params)` and may return a cleanup function, called before the next view renders. Views for `/list/:id` and `/template/:id` receive `params.id`.
- **Rendering & escaping:** build markup with the `html` tagged template from `src/ui/dom.js` — it escapes every interpolation (item/list names are user text). Wrap trusted fragments with `raw()`; arrays are joined. Reusable UI components go in `src/ui/`.
- **Data:** `src/db.js` is the only module touching IndexedDB (db `cestinha`; stores `templates` [index `updatedAt`] and `lists` [indexes `createdAt`, `templateId`]). Its API (`getAll*`, `get*`, `put*`, `delete*`) returns promises; `put*` sets `updatedAt`; `getAllTemplates`/`getAllLists` return newest first. Schema changes go in a new `if (event.oldVersion < N)` block — never edit the v1 block. `src/model.js` has pure record factories (`createTemplate`, `createList`, `createItem`, `listFromTemplate`, `nextOrder`).
- **Calculations:** `src/calc.js` holds pure functions for subtotals, totals, progress, pt-BR formatting/parsing and `normalizeName`. Totals/subtotals/progress are always computed, never stored.
- **Styling:** `styles/input.css` defines semantic color tokens as CSS variables swapped by the `.dark` class on `<html>` (Tailwind v4 `@custom-variant dark`), exposed as utilities `bg-page`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-primary`/`text-on-primary`, `text-danger`. Use these instead of raw colors or `dark:` variants. Never build class names dynamically (the Tailwind scanner only sees complete strings).
- **Theme:** `src/theme.js` (modes auto/light/dark, localStorage key `cestinha.theme`); an inline `<head>` script in `index.html` applies it before first paint — the key is duplicated there, keep both in sync.
- **Version:** `version.js` sets `self.APP_VERSION`, the single source for the settings screen and the service worker cache name (`sw.js` loads it via `importScripts`).
- **Offline (service worker):** `sw.js` precaches the `APP_SHELL` list into `cestinha-<APP_VERSION>` (cache-first; navigations get the cached `index.html`; old `cestinha-*` caches deleted on activate). `src/pwa.js` registers it with `updateViaCache: 'none'` and, when a new version is waiting, shows a persistent banner below the header (`src/ui/updateBanner.js`); the new version only takes over when the user taps "Atualizar" (no automatic reload mid-shopping). Updates are also checked when the app returns to the foreground.
- **During development:** with the SW active the browser serves cached files — keep DevTools › Application › Service Workers › "Update on reload" checked, or changes won't show.

## Domain rules that are easy to get wrong

- Items are embedded in their template/list record (`items` array). Template and list items share `id, name, quantity, unit, priceCents, order`; list items add `checked`. Generating a list copies each item with a **new `id`** and `checked: false`.
- A generated list is an independent copy (RN08). The RF14 suggestion (offer to add a new list item to the source template) was dropped from the MVP and moved to "depois" (CARD-012) — do not build it. Deleting a template never deletes its lists.
- Money is integer cents (`priceCents`, nullable). Subtotal = `Math.round(quantity * priceCents)`. Unpriced items have no subtotal and are excluded from both totals but count toward progress.
- Total previsto = all priced items; total no carrinho = checked priced items; progress = checked / all (0% when empty).
- Quantity required, > 0, up to 3 decimals, default 1; unit `un` | `kg` (default `un`); price is per unit or per kg, up to 2 decimals. Inputs accept comma or dot and use `inputmode="decimal"`; display via `Intl.NumberFormat('pt-BR')` (R$ 1.234,56, 1,5 kg).
- Checked items render struck-through and sink to the bottom; unchecked keep insertion `order`.
- IDs via `crypto.randomUUID()`; dates as ISO 8601.

## Deployment gotchas

- Served under a subpath (`/cestinha/` on GitHub Pages): every URL must be relative — no leading `/` in `index.html`, imports, manifest (`start_url`, `scope`), or SW registration.
- **Every new app file (JS module, icon, etc.) must be added to `APP_SHELL` in `sw.js`** — `cache.addAll` is atomic, so a missing or misspelled path fails the whole install, and an unlisted file breaks the app offline.
- On every deploy bump `APP_VERSION` in `version.js`; otherwise installed phones never see the new version.
- UI: touch targets ≥ 44px, WCAG AA contrast in both themes, `tabular-nums` for money, state never conveyed by color alone.
