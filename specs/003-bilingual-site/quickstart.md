# Quickstart: validate the bilingual site

## Prerequisites

- Node 22 (`nvm use`), `npm ci`.
- Chrome (Lighthouse, axe DevTools), VoiceOver (macOS).

## 1. Static checks

```sh
npm run check && npm run build
```

- Passes with 0 errors.
- Delete `'nav.about'` from `en` in `src/i18n/ui.ts`: `npm run check` fails on that object
  (FR-006, SC-004). Restore.
- Add `extra: 'x'` to `en` only: `npm run check` fails. Restore.
- Call `t('nav.missing')` in `Footer.astro`: `npm run check` fails. Restore.

## 2. Generated HTML

```sh
ls dist/index.html dist/en/index.html
test ! -e dist/en/blog && echo "no /en/blog"
grep -o '<html lang="[a-z]*"' dist/index.html dist/en/index.html
grep -c '<script' dist/index.html dist/en/index.html
grep -rn 'href="/en/blog' dist || echo "no link to /en/blog"
```

- `dist/index.html` → `lang="fr"`; `dist/en/index.html` → `lang="en"` (FR-003, SC-001).
- 0 `<script>` in both (SC-008). No `/en/blog` page or link (FR-004, SC-006).
- `/`: switcher `<a href="/en/" hreflang="en" lang="en" aria-label="English">EN</a>`.
- `/en/`: switcher `href="/"`, `lang="fr"`, `aria-label="Français"`, text `FR`.
- `/en/`: nav hrefs `/en/about`, `/en/projects/`, `/en/background`, `/en/skills`, `/en/cv`,
  and Blog → `/blog/` with ` (FR)`, `hreflang="fr"`, `aria-label="Blog (FR), in French"`.
- `/en/`: name link → `/en/`; skip link "Skip to content"; nav `aria-label="Main navigation"`.
- `/`: identical to F02 except the header that holds the switcher (SC-007): build `main` into another folder
  (`git worktree add`), then `diff` its `dist/index.html` with this branch's.

## 3. Path helpers

Create a temporary `src/pages/paths-check.astro` that renders `localizePath(input, locale)`
for the 6 inputs × 2 locales of the table in [contracts/i18n.md](./contracts/i18n.md). Open it
with `astro dev --background` and compare every cell with the table, including `/english` →
`/english` / `/en/english`. Delete the page; never commit it.

## 4. Fallback of the switcher (FR-008)

- Temporarily add `src/pages/blog/index.astro` (any content using a view or the layout).
  Build: on `/blog/`, the switcher points to `/en/` (no `src/pages/en/blog/`). Remove it.
- Temporarily add `src/pages/test.astro` and `src/pages/en/test.astro` (shells of
  `HomeView`): `/test` switches to `/en/test` and back. Remove both.

## 5. Accessibility and visuals

- Keyboard on `/` and `/en/`: Tab order skip link → name → rubriques → switcher → content →
  footer; focus ring visible on the switcher.
- VoiceOver on the switcher of `/`: reads "English, link" with an English voice; on Blog in
  `/en/`: "Blog (FR), in French, link".
- 320 px and 200 % zoom, both locales, both themes: header wraps without horizontal scroll
  (FR-010).
- axe DevTools on `/` and `/en/`, light and dark: 0 errors (SC-009). Lighthouse mobile on both:
  ≥ 95 / 100 / 100 / 100, < 200 kB transferred.
- Then `/impeccable audit` and `/impeccable polish` (constitution IX).
