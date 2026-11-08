# Quickstart: validate the visual foundation and layout

## Prerequisites

- Node 22 (`nvm use`), `npm ci`.
- Chrome (DevTools: Lighthouse, Rendering emulation, axe DevTools extension), plus Safari or
  Firefox for a second engine; VoiceOver (macOS) for the screen-reader check.

## 1. Static checks

```sh
npm run check && npm run build
```

- Passes with 0 errors.
- Remove `description` from the home page's `<BaseLayout>`: `npm run check` fails naming
  `src/pages/index.astro` (FR-002). Restore.
- Add `{ label: 'Test' }` (no `href`) to `nav.ts`: `npm run check` fails (FR-009). Restore.

## 2. Generated HTML (`dist/index.html`)

- No `<script>` tag (`grep -c '<script' dist/index.html` → 0) (SC-007).
- `<html lang="fr">`, `<title>Ramazan Kus</title>`, `<meta name="description">` = the pitch.
- `<meta name="color-scheme" content="light dark">` present.
- The preload `href` equals the `url()` of the `@font-face` in the built CSS (one font
  request in the Network panel, no "preloaded but not used" warning) (R3).
- First focusable element in `<body>` is the skip link.
- No phone number: `grep -riE 'tel:|\+33|0[67]( ?[0-9]{2}){4}' dist src` → nothing (FR-019).

## 3. Add a rubrique in one line (US4)

`astro dev --background`, add `{ label: 'Test', href: '/test' }` to `nav.ts`: it appears last
in the nav of the home page; `git diff --stat` shows one file, one line. Revert.

## 4. Themes (US2)

- DevTools → Rendering → emulate `prefers-color-scheme: dark`, Network throttling "Slow 4G",
  hard reload with Performance recording + screenshots: no frame shows a white page (SC-002).
- Same in light. Switch the emulation while on the page: colors follow.
- Scrollbars are dark in dark mode.

## 5. Keyboard and screen reader (US3)

- Reload, press Tab: « Aller au contenu » appears; Enter: next Tab goes to the first
  focusable element after the header (SC-005).
- Tab through name, six rubriques, footer links: each shows the red focus ring.
- Current item: create a scratch page `src/pages/about.astro` using `BaseLayout` (deleted
  afterwards, never committed). On `/about`, « À propos » is red, 600, underlined, and
  VoiceOver announces it as the current page. On a scratch `src/pages/about/x.astro`, the item
  is signalled the same way (`aria-current="true"`). On `/` and `/about/` (trailing slash),
  behaviour matches R7.
- With JavaScript disabled, all of the above works identically.

## 6. Mobile and zoom (US3)

- Device emulation 320 × 640: name on line 1, rubriques on at most two lines below, no
  horizontal scroll (SC-006). Same at 200 % zoom on a 1280 px window.
- If the rubriques take three lines or more, stop: R5's popover fallback must be planned.

## 7. Contrast and audits

- axe DevTools on the home page, light and dark: 0 issues (SC-009).
- Lighthouse mobile: performance ≥ 95, accessibility 100, CLS ≤ 0.1. If CLS > 0.1, revisit R3
  (Astro Fonts API with optimized fallbacks).
- Network panel: total transferred < 200 kB (SC-007).

## 8. No hard-coded visual values (SC-008)

```sh
grep -nE '#[0-9a-fA-F]{3,8}\b|[0-9.]+(rem|em|px)\b' src/components src/layouts src/pages
```

Every hit is `1px`, a breakpoint inside `@media`, a commented one-off value, or text content.

## 9. Design review

`/impeccable audit` then `/impeccable polish`; fixes committed; sections 1–8 re-run.
