# Quickstart: Transitions et micro-animations

Validation guide for [spec.md](./spec.md). Behaviour per state:
[data-model.md](./data-model.md); hooks and gates: [contracts/motion.md](./contracts/motion.md).

## Prerequisites

```sh
npm run check && npm run build
astro dev --background
```

Browsers: a recent Chromium (view transitions + scroll-driven animations), Safari, and
Firefox (no cross-document view transitions: the fallback). Reduced motion: system setting,
or DevTools › Rendering › « prefers-reduced-motion: reduce ».

## 1. Rest state without animation (FR-001–003, US1, US3)

- Open `/` and `/en/`, motion on or off: the reference position, rook on e1, bishop on e7,
  no stamp, nothing moves at load.
- VoiceOver on the diagram: the label describes the position before 16.Txe7+ (FR, EN) and
  reads nothing from the stamps.
- Print preview of `/` and a project page: rest state, project symbol visible.

## 2. Candidate moves and their notes (US1, US2)

At 1280 px, light and dark, for each of the three rows, by mouse then by Tab:

| Row       | Expected                                                                  |
| --------- | ------------------------------------------------------------------------- |
| Meetz     | knight c3 → d5, d5 thick red, c3 thin red, then `!?` stamps next to d5    |
| Portfolio | rook e1 → e7, bishop e7 vanishes on arrival, then `!!` stamps next to e7  |
| Sportify  | bishop g5 → f6, knight f6 vanishes on arrival, then `!` stamps next to f6 |

- The stamp lands after the piece, never with it; it sits on a light chip inside the board,
  in the board ink of its symbol (≥ 3:1, research R13).
- Move from one row to the next: the old piece returns and its stamp vanishes at once, the
  new one plays; no black piece ever moves.
- Leave the list: marks off, pieces back, stamps gone.
- Reduced motion: same rows, only the squares mark; no piece moves, no stamp.
- Touch (DevTools device mode, or a phone): one tap on a row opens the project.
- Forced colors: the board keeps its inks, marked squares visible.

## 3. Mobile

- 375 px (iframe capture, `AGENTS.md`): the board shows the reference position; focus on a
  row plays its move as on desktop; no horizontal scroll at 320 px.

## 4. Page transitions (US4, US5)

Chromium, motion on:

- From `/` and from `/projects`, open each project: the title travels and grows into the
  `h1`; the header stays still; the rest fades in ~0.28 s. Browser back: reverse.
- From a project page, « partie suivante »: fade only. Going to or back from a project, only
  that project's title travels; no other title moves.
- Language switch on a project page: fade only, title stays in place.
- On the project page, the symbol fades in after the transition, never during; colours:
  `!` dark blue, `!?` violet, `!!` sky blue. Same on a direct load.
- Firefox: every navigation is instant and complete. Reduced motion in Chromium: no fade.

## 5. Failure contract (scratch branch, then revert)

- Set Meetz `move.from: c4` (empty): `npm run build` fails naming c4.
- Set Sportify `move.to: c3` (shares Meetz' square): build fails naming both.
- Set Portfolio `featured: false`: build passes, two rows, two moves on hover.

## 6. Budgets and review

- `grep -l "<script" dist -r` finds nothing new; home < 200 kB transferred.
- Lighthouse mobile on `/` and one project page: ≥ 95 / 100 / 100 / 100, CLS 0.
- Captures at 375 px and 1280 px, light and dark, header and footer included, then
  `/impeccable audit` and `/impeccable polish` (`AGENTS.md`).
