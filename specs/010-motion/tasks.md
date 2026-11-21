---
description: 'Task list for F10 · Transitions et micro-animations'
---

# Tasks: Transitions et micro-animations

**Input**: Design documents from `specs/010-motion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/motion.md,
quickstart.md

**Tests**: no automated test suite (not requested). `playBoard` throws cover the failure
contract; `npm run check` covers types. Each story ends with a manual validation task from
[quickstart.md](./quickstart.md).

**Organization**: tasks grouped by user story (spec US1–US5). **Load the `impeccable` skill
before any task that touches UI** (AGENTS.md), respect `DESIGN.md` (Motion) and the tokens of
`src/styles/global.css`. Finish with the Impeccable audit + polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1–US5 from spec.md
- All paths are relative to the repository root.
- **No `<script>`, no `client:*`, no `ClientRouter`** (constitution II, FR-020).
- Every movement, fade or view transition sits inside
  `@media screen and (prefers-reduced-motion: no-preference)` (research R5); square marks
  are the only state change outside it.
- Every style value comes from a token; the 400 ms delay and the 4 px / 2 px liserés are
  `DESIGN.md` values for one component and get a short French comment (constitution VIII).
- Few code comments: only a short non-obvious _why_, in French.
- Visual checks at 375 px (in a 375 px `<iframe>`) and 1280 px, light and dark, header and
  footer included.
- « Scratch » checks are done on a throw-away branch or reverted; nothing from them is
  committed.
- Featured order today: 1 Meetz (`c3`→`d5`, `!?`), 2 Portfolio (`e1`→`e7`, `!!`, takes the
  bishop), 3 Sportify (`g5`→`f6`, `!`, takes the knight).

---

## Phase 1: Setup

**Purpose**: commit the design docs before code.

- [x] T001 On branch `010-motion`, run `npx prettier --check specs/010-motion` and commit `specs/010-motion/` as `docs(specs): F10 specification, plan and tasks`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: the tokens and the **final state** of the diagram, built from the data. After
this phase the home shows, without any animation, the position after 16.Txe7+ with the `!!`
next to e7 (FR-001, FR-002, FR-012) — which every story starts from.

**⚠️ CRITICAL**: no user story can start before this phase is done.

- [x] T002 [P] In `src/styles/global.css`, add to `:root`, after `--duration`: `--duration-page: 280ms;`, `--duration-move: 320ms;`, `--duration-stamp: 240ms;`; in the existing `@media (prefers-reduced-motion: reduce)` block, set all three to `0ms` next to `--duration` (research R12, contracts « Tokens »). Add to `:root`, next to `--color-brilliant`, `--color-brilliant-on-board: #0077b6;`, **not** overridden in the dark block, with a French comment: la planche reste claire en sombre, le `!!` y garde son bleu d'impression (research R13)
- [x] T003 [P] Create `src/lib/board.ts` per [data-model.md](./data-model.md) and [contracts/motion.md § src/lib/board.ts](./contracts/motion.md): export `Move { from: string; to: string; brilliant: boolean }`, `BoardSquare`, `BoardPiece`, `Board` with the exact fields of the data model, and `playBoard(fen: string, moves: Move[]): Board`, reusing `parseFen` from `src/data/diagram.ts`. Rules, verbatim from the data model:
  - square name → `file` 1–8 (`a`–`h`), `rank` 1–8; `squares` are the 64 squares « rank 8 to 1, file a to h », `dark` when `(file + rank) % 2 === 0` (same as today's `Diagram`), with `from` / `to` set to the 1-based N of the move that starts / lands there;
  - **throw** (French message naming the square and the move number) when « `from` holds no white piece », « `to` holds a white piece », or « two moves share a square (any of their `from`/`to`) »;
  - « the `brilliant` piece is placed on its `to` square; every other piece on its reference square. A piece on a capture square stays in `pieces` with `takenBy` »;
  - candidate « `dx = toFile − fromFile`, `dy = fromRank − toRank`; `brilliant` the opposite (back to `from`) »; the moving piece gets `move: N`, the `!!` one also `brilliant: true`;
  - `stamp` = the `to` square of the `brilliant` move, absent when there is none.

  Pure module, no Astro import. Run `npm run check`

- [x] T004 [P] In `src/data/diagram.ts`, rewrite `diagram.alt` to describe the position **after** 16.Txe7+ (research R12): fr `Diagramme d’une de mes parties, après le 16ᵉ coup des blancs, un sacrifice de la tour en e7`, en `Diagram from one of my games, after White’s 16th move, a rook sacrifice on e7` (no colon, `CONTENU.md` §9); keep the FEN and its comment, and add one French comment line: the alt describes the position after the `!!` move and changes with it
- [x] T005 Load `impeccable`. In `src/components/Diagram.astro`, add the prop `moves?: Move[]` (default `[]`) and render `playBoard(fen, moves)` instead of `parseFen(fen)` (contracts « Diagram.astro », « Rendered hooks »): each square keeps `--file` / `--rank` and gains `data-from="N"` / `data-to="N"` when set; each piece keeps `--file` / `--rank` and, when it moves, gains `data-move="N"` and `--dx` / `--dy` in its `style`, the `!!` piece the class `brilliant`; a taken piece gains `data-taken-by="N"` and, when N is the `brilliant` move, is hidden at rest with `opacity: 0` (data model « Visibility at rest »). When `stamp` exists, render `<span class="stamp" aria-hidden="true"><EvalMark eval="!!" /></span>` inside `.board` (the `aria-hidden` wrapper keeps EvalMark's visually hidden label out of the accessibility tree, whatever the browser does with the children of `role="img"`), placed on the stamp square by `--file` / `--rank` (same grid rule as pieces), as a small chip in the top-right corner of the square that stays **entirely inside the board** whatever the square, h-file and rank 8 included (no overflow, FR-021): chip background `var(--color-square-light)`, symbol colour `var(--color-brilliant-on-board)` set through `--eval-color-brilliant` on `.stamp` (research R13); size and offset tuned with `impeccable`, tokens only (`DESIGN.md` « à côté de la case d'arrivée »). `.board` keeps `role="img"` and its `aria-label`, and gains `data-brilliant="N"` when a `brilliant` move exists
- [x] T006 In `src/views/HomeView.astro`, pass `moves={featured.flatMap((project) => project.move ? [{ from: project.move.from, to: project.move.to, brilliant: project.eval === '!!' }] : [])}` to `Diagram` — the same `featured` array, in the same order, as `ProjectList` (contracts « Invariant »). Run `npm run check && npm run build`; at 1280 px and 375 px, light and dark, the home shows the rook on e7, no bishop on e7, the `!!` blue next to e7, the rest of the position unchanged
- [x] T007 Scratch check of the failure contract (quickstart §5): Meetz `move.from: c4` → `npm run build` fails naming c4; Sportify `move.to: c3` → fails naming both moves; Portfolio `featured: false` → build passes, reference diagram, no stamp, two rows. Revert

**Checkpoint**: the final state is the HTML. Stories can start.

---

## Phase 3: User Story 1 — Voir le coup brillant se jouer (Priority: P1) 🎯 MVP

**Goal**: on the home, the `!!` move plays once, then its symbol stamps (FR-004, FR-005).

**Independent Test**: reload `/` at 1280 px, then scroll to the board at 375 px; the move
plays once, the stamp follows, the end state equals the T006 state.

- [x] T008 [US1] Load `impeccable`. In `src/components/Diagram.astro`, add the keyframes of research R6: `play` (`from { transform: translate(calc(var(--dx) * 100%), calc(var(--dy) * 100%)); }`) on `.brilliant`, `held` (`from, to { opacity: 1; }`) on the piece taken by the `!!` move, `stamp` (`from { opacity: 0; scale: 1.15; }`) on `.stamp`
- [x] T009 [US1] In the same file, inside `@media screen and (prefers-reduced-motion: no-preference) and (width > 56rem)`: `play` and `held` with `animation-duration: calc(var(--duration-move) * 2)`, `animation-timing-function: var(--ease-out)`, `animation-delay: 400ms` (French comment: délai de DESIGN.md, propre au diagramme), `animation-fill-mode: backwards`; `stamp` with `--duration-stamp`, `--ease-out`, delay `calc(400ms + var(--duration-move) * 2)`, `backwards` (Move-Then-Note)
- [x] T010 [US1] In the same file, inside `@media screen and (prefers-reduced-motion: no-preference) and (width <= 56rem)` and `@supports (animation-timeline: view())`: `.board { view-timeline-name: --board; }`; `play` and `held` with `animation-timeline: --board`, `animation-range: entry 0% entry 70%`, `animation-fill-mode: both`, `animation-timing-function: linear` and an `animation-duration` of `auto` per the scroll-driven animations spec; `stamp` on `--board` with `animation-range: entry 70% entry 100%`, `both`. Check property order: `animation-timeline` after the `animation` shorthand, which resets it
- [x] T011 [US1] Validate quickstart §1 and §2: reduced motion and Firefox below 56rem show the final state at once; at 1280 px the rook slides after ~0.4 s, the bishop vanishes on arrival, then the stamp; at 375 px (iframe) in Chromium the move follows the board's entry and ends, stamp set, when the board is fully visible; print preview of `/` shows the final state; VoiceOver reads the T004 label and nothing from the stamp. Light and dark: the stamp chip sits inside the board and its `!!` measures ≥ 3:1 against the chip (large bold text; expected 4.87:1 light, 3.8:1 dark) _Chromium headless: 1280 px, the rook leaves e1 after the delay, the bishop vanishes at mid-move (97 % of the path with `--ease-out`, so `held` lasts `--duration-move`), then the stamp. 375 px iframe at 720 / 800 / 880 / 960 px tall: bishop still on e7, rook travelling, rook landed with stamp fading in, final state. Scroll range moved to `entry 30% entry 85%` (stamp `entry 85% entry 100%`), linear: at `entry 0%` the move happened below the fold. The minifier merged `animation-timeline` into the `animation` shorthand, which Chrome rejects: the timeline is now a separate rule. Reduced motion: final state at once. Stamp chip contrast 4.87:1 light, 3.8:1 dark. Not run here: Firefox (not installed), print preview, VoiceOver, left to the maintainer._

**Checkpoint**: US1 is complete on its own.

---

## Phase 4: User Story 2 — Faire jouer un coup candidat au survol (Priority: P1)

**Goal**: hovering or focusing a home row plays its piece and marks its squares; the `!!`
piece steps back meanwhile (FR-006–FR-011).

**Independent Test**: quickstart §3, the three rows by mouse then by Tab.

- [x] T012 [P] [US2] In `src/components/ProjectList.astro`, on the home variant only (`detail` false), add `data-play={index + 1}` to each row link (use the `map` index). No other change in this story (contracts « ProjectList.astro ») _Done: `data-play` only on home rows with a move (`!detail && project.move`)._
- [x] T013 [US2] Load `impeccable`. In `src/components/Diagram.astro`, square marks (research R9), **outside** the motion media query: every `.square` gets `outline: 0 solid transparent` and `transition: outline-color var(--duration) var(--ease-out)`; for N = 1, 2, 3, `:global(:root:has([data-play='N']:focus-visible)) [data-to='N']` → `outline: 4px solid var(--color-mark); outline-offset: -4px;` and `[data-from='N']` → `2px` / `-2px` (French comment: liserés de DESIGN.md, en contour pour rester visibles en contraste forcé); the same rules with `:hover` inside `@media (hover: hover)` (research R4). Keep the selector list readable: one rule per N listing its hover and focus selectors _Done with flags instead of one selector per element: the trigger rules set `--on-1`…`--on-3` on `.board` (focus everywhere, hover inside `@media (hover: hover)`); each square or piece reads its own flag into `--on`, and the liserés are `outline: calc(var(--on) * 4px)` / `2px` with a matching offset, animated by width in `--duration`. Colour `--color-mark-on-board` (#c8102e in both themes): the dark-theme red #ff5a6a reached only 1.39–2.37:1 on the light board, the print red gives 2.69–5.88:1._
- [x] T014 [US2] In the same file, inside `@media screen and (prefers-reduced-motion: no-preference)`, per data model « State per active row » and research R5, R7, R8 (same hover / focus split as T013): _Done without `!important`: the signature animates a registered `--sig` (0–1) and the rook's offset is `max(var(--sig), var(--away))`, so a row hovered during the signature wins at once and leaving the list never restarts it (research R7 updated). Taken pieces vanish at half `--duration-move` (97 % of the path with `--ease-out`)._
  - `.piece { transition: transform var(--duration-move) var(--ease-out), opacity 0s; }`;
  - row N active → `[data-move='N']:not(.brilliant)` gets `transform: translate(calc(var(--dx) * 100%), calc(var(--dy) * 100%))`;
  - any row active except the `!!` one → `.brilliant` gets the same translate with `!important` (French comment: l'emporte sur l'animation signature sans la relancer), and the piece taken by the `!!` move and `.stamp` become visible / hidden: taken piece `opacity: 1`, stamp `opacity: 0`; `.board` carries `data-brilliant="N"` (the `!!` move number, set in T005 when a `brilliant` move exists) and the rule is written per N as `:global(:root:has([data-play='N']:focus-visible)) .board:not([data-brilliant='N']) .brilliant` (and its `:hover` twin), same for the taken piece and `.stamp`;
  - taken pieces (research R8): hidden state with `transition-delay: var(--duration-move)` (vanish on the capturer's arrival), visible state with no delay; the stamp returns with `transition: opacity var(--duration-stamp) var(--ease-out) var(--duration-move)` (after the rook is back);
  - row N active → the piece with `data-taken-by='N'` (not the `!!` one) gets `opacity: 0`
- [x] T015 [US2] Validate quickstart §3 at 1280 px, light and dark: the table of three rows by mouse and by Tab; row to row; leaving the list replays e1 → e7 then the stamp; hover during the signature takes over and leaving does not restart the signature; reduced motion marks only; touch (device mode) opens on first tap; forced colors keeps the marks. Fix in `Diagram.astro` / `ProjectList.astro` _Puppeteer on Chromium, 1280 px, light, dark and reduced motion: rest, the three rows by mouse, row 1 → row 3 at 120 ms, leaving the list (rook back to e7, stamp after it), Tab to row 1, hover during the signature (row wins, no replay on leave). Forced colors: marks visible. iPhone 13 emulation: one tap on row 1 opens `/projects/meetz/`. Test-harness note: Puppeteer screenshots that resize the viewport restart the CSS animations; captures use `captureBeyondViewport: false`._

**Checkpoint**: US1 and US2 work together.

---

## Phase 5: User Story 3 — Lire sans mouvement (Priority: P1)

**Goal**: under reduced motion nothing moves, every information stays (FR-003, FR-016).

**Independent Test**: reduced motion on, browse `/`, `/projects`, one project page.

- [x] T016 [US3] Read `src/components/Diagram.astro`, `src/components/ProjectList.astro` and `src/styles/global.css`: every `transform`, `opacity` change, `animation` and view transition rule sits inside `@media screen and (prefers-reduced-motion: no-preference)`; only the outline marks and the existing `--duration` colour transitions sit outside. Fix any leak _Only the final state (`.piece.gone { opacity: 0 }`) and the outline marks sit outside the motion query; nothing to fix._
- [x] T017 [US3] Validate quickstart §1 and the reduced-motion lines of §3 and §4 with DevTools « prefers-reduced-motion: reduce », light and dark, 375 px and 1280 px: rook on e7, stamp visible, hover marks only, project page instant with its symbol _Reduced motion at 1280 px and 375 px, light and dark: rook on e7 and stamp at once, mid-scroll included; hover and focus mark the squares only. Project page: checked again with US4–US5._

**Checkpoint**: P1 stories done. Commit point for the MVP.

---

## Phase 6: User Story 4 — Ouvrir un projet sans perdre le fil (Priority: P2)

**Goal**: native cross-document transitions: header still, title travels, rest fades
(FR-013, FR-014).

**Independent Test**: quickstart §4, first four lines, in Chromium; Firefox unchanged.

- [x] T018 [P] [US4] In `src/styles/global.css`, inside `@media screen and (prefers-reduced-motion: no-preference)`: `@view-transition { navigation: auto; }` and `::view-transition-group(*) { animation-duration: var(--duration-page); animation-timing-function: var(--ease-out); }` (research R10)
- [x] T019 [P] [US4] In `src/components/Header.astro`, add `view-transition-name: site-header;` to the `header` rule
- [x] T020 [P] [US4] In `src/components/ProjectList.astro`, add `style={`view-transition-name: project-${project.slug}`}` to the `.title` span (a block box; never the inner `lang` span, research R10)
- [x] T021 [P] [US4] In `src/views/ProjectView.astro`, add the same inline `view-transition-name: project-${project.slug}` to the `h1`
- [x] T022 [US4] Validate quickstart §4 (lines 1–3 and Firefox) at 1280 px and 375 px: from `/` and `/projects` into each project and back; « partie suivante »; language switch fades only; check in DevTools › Animations that no transition is skipped (a duplicate or fragmented name would skip it) _Puppeteer on Chromium, `pagereveal` listener: home → project, `/projects` → project, « partie suivante », FR → EN, project → home and browser back all reveal with a view transition that reaches `ready` and `finished` (none skipped, so no duplicate or fragmented name); with reduced motion, no view transition at all. Capture at 0.1× speed: header still, title in place, root cross-fade. Not run here: Firefox (not installed), left to the maintainer._

**Checkpoint**: US4 independent of US1–US3.

---

## Phase 7: User Story 5 — Voir la note se poser sur la page projet (Priority: P3)

**Goal**: the margin symbol fades in after the page transition (FR-015).

**Independent Test**: open a `!`, a `!?` and the `!!` project page, by link and by reload.

- [x] T023 [US5] Load `impeccable`. In `src/views/ProjectView.astro`, inside `@media screen and (prefers-reduced-motion: no-preference)`: a scoped `@keyframes note { from { opacity: 0; } }` on `.mark` with `animation: note var(--duration-stamp) var(--ease-out) var(--duration-page) backwards` (research R11). No scale; colour unchanged (it comes from `EvalMark`)
- [x] T024 [US5] Validate quickstart §4, last lines: Meetz `!?` violet, Sportify `!` dark blue, Portfolio `!!` sky blue; the symbol appears after the transition, never during, by link and by reload; reduced motion and print: visible at once _Puppeteer, opacity sampled every 60 ms: by link (Meetz `!?`, Portfolio `!!`, Sportify `!`) the symbol stays at 0 until the view transition ends (287–297 ms), then reaches 1 within 240 ms; direct load, same delay; reduced motion, 1 at once. Colours from `EvalMark` unchanged. Print: the fade sits in a `screen` query._

---

## Phase 8: Documents alignment

**Purpose**: keep `DESIGN.md` and `ROADMAP.md` true to what is built (constitution,
Governance).

- [x] T025 [P] In `DESIGN.md`, in French: Elevation, « Les seules ombres du code sont des `box-shadow: inset` rouges… » becomes liserés rouges tracés en contour intérieur (4 px arrivée, 2 px départ), visibles en contraste forcé ; Motion effet 2, « liseré » wording unchanged; Motion effet 1, add that on narrow screens the move follows the scroll and rewinds if the reader scrolls back up, and that the `!!` of the diagram sits on a light-square chip inside the board, in `--color-brilliant-on-board` in both themes; Motion intro, « Ces effets sont à construire en F10 » becomes « livrés en F10 »; Colors (Accent, bleu du coup brillant), add the board exception
- [x] T026 [P] In `ROADMAP.md`, F10 Plan block: `nth-child` → `data-play` on the home rows, `box-shadow inset` → outline, `playBoard` in `src/lib/board.ts`, motion gated by `screen and (prefers-reduced-motion: no-preference)`, the board stamp in `--color-brilliant-on-board`

---

## Phase 9: Design review, accessibility & polish (Impeccable)

**Purpose**: constitution VII–IX quality gate before the feature is done.

- [x] T027 Run `/impeccable audit` on `/`, `/projects/`, `/projects/portfolio/` and their `/en` mirrors, light and dark, 375 px and 1280 px, header and footer included, with motion on and off; list findings in this task's note _Detector: 0 finding on `/`, `/en/`, `/projects/`; on `/projects/portfolio/` only the known `line-length` on story paragraphs (the 68ch `--measure` token, F06) and the root `font-size` clamp advisory, both outside F10. Rendered checks at 320, 375 and 1280 px, light and dark, header and footer: no horizontal scroll at rest, while scrolling or on focus; stamp inside the board. Finding: in forced colors the board lost its squares and the black pieces (predates F10, component touched here). The missing `!!` in the first CLI captures of the project page came from headless virtual time; real-time Puppeteer shows it._
- [x] T028 Run `/impeccable polish` and apply the accepted fixes in the files concerned (`Diagram`, `ProjectList`, `ProjectView`, `Header`, `global.css`), tokens only _Fixes in `Diagram.astro`: `forced-color-adjust: none` on the board (a printed plate, kept like an image; marks and pieces readable in forced colors), the two `.board` rules merged, the `...rest` destructuring replaced, the stamp's `em` padding commented._
- [x] T029 Run quickstart §6: `grep -rl "<script" dist` lists nothing new against `main`; home < 200 kB transferred; Lighthouse mobile on `astro preview` ≥ 95 / 100 / 100 / 100 on `/` and `/projects/portfolio/`, CLS 0; 320 px without horizontal scroll during and after the moves. VoiceOver may be left to the maintainer; say so in the note _Only the two existing JSON-LD `<script>` blocks in `dist`; no client script. Lighthouse 12 mobile on `astro preview`: 100 / 100 / 100 / 100 on `/` and `/projects/portfolio/`, CLS 0, home 100 KiB. 320 px: no horizontal scroll during the moves. Not run here: VoiceOver, Safari and Firefox, left to the maintainer._
- [x] T030 Run `npm run check && npm run build` on the whole branch; read every changed component for untokenised values (VIII) and scripts (II); `git log main..HEAD --oneline` → every commit conventional and in English _`npm run check` (0 error, 0 warning) and `npm run build` pass; literal values are tokens or commented `DESIGN.md` values (4px, 2px, 400ms); commits conventional and in English._

---

## Phase 10: Revision after the maintainer's review (2026-11-20)

**Purpose**: the `!!` move no longer plays at load; every move stamps its evaluation on the
board (research R14). Phase 3 (T008–T011) is superseded.

- [x] T031 In `src/lib/board.ts`, `Move.eval` replaces `brilliant`; the board keeps the reference position and returns one `BoardStamp` per move (data-model.md); the build-time checks are unchanged
- [x] T032 In `src/components/Diagram.astro`, remove the signature (keyframes, scroll timeline, `--sig`, `--away`, `data-brilliant`, hidden taken piece at rest); render one `aria-hidden` stamp per move on its arrival square, in the board ink of its symbol (`--color-great-on-board`, `--color-interesting-on-board` added to `src/styles/global.css`), landing at half `--duration-move` (the piece is at 97 % of its path) and leaving at once; no stamp under reduced motion. `HomeView` passes `eval`; the diagram alt text is back to « avant le 16ᵉ coup »
- [x] T033 Register `--on` and `--taken` with `@property` (`<number>`): with unregistered flags, Chrome did not start the transitions that depend on them, so candidate pieces, liserés and stamps jumped instead of moving (the first-version captures only showed end states). _Puppeteer, row 2: rook at 96 % of its path at 160 ms, `!!` fully set at ~300 ms (was ~560 ms with a full `--duration-move` delay)._
- [x] T034 Align `spec.md` (US1 rewritten, FR-001–FR-007, edge cases, SC-001, SC-003, SC-007), `plan.md`, `research.md` (R14, R15), `data-model.md`, `contracts/motion.md`, `quickstart.md`, `DESIGN.md` (Motion, Accent board inks) and `ROADMAP.md` (F10 spec and plan)
- [x] T035 Validate: rest state without any move; the three rows by mouse and Tab in light and dark (piece glides, capture on arrival, symbol after the piece); row switch; leaving the list; reduced motion marks only; `npm run check && npm run build`

## Phase 11: Move sounds, tried then removed (2026-11-20)

- [x] T036 Build move, capture and check sounds (Web Audio, one inline script), then make them audible and unlock them on the first gesture for Safari _commits « feat(motion): move, capture and check sounds » and « fix(motion): audible wood move sounds… »._
- [x] T037 Remove them at the maintainer's request (research R16): code and documents back to their state before the sounds, idea and findings moved to the reserve of `ROADMAP.md`. FR-020 holds again: no client script.

## Phase 12: Transition fix (maintainer feedback, 2026-11-21)

- [x] T038 Other titles moved when opening or leaving a project: the « partie suivante » row paired with the same project in the list. `ProjectList` gains `transition` (default `true`), `ProjectView` passes `false` for that row (research R17). _Puppeteer, groups with a transform during the view transition: home → Meetz and back, `/projects` → Sportify and back now animate only the opened project's title (plus the root and the still header); before, Portfolio or Meetz travelled too._

- [x] T039 Smoother title transition (research R18): `view-transition-class: project` on the titles, captures keep their proportions and cross-fade in a third of `--duration-page`, the old page fades out before the new one fades in. _Filmed at 3 s (temporary build): the title now grows from the row to the `h1` without stretching, one page at a time; back navigation checked. Transition checks: none skipped, only the opened title travels._

- [x] T040 Full review (KISS, YAGNI, SOLID, quality, performance): `view-transition-class` moved from the inline styles to the components' CSS (one inline value left, the per-project name); `board.ts` exports only `playBoard` and `Move`; `HomeView` builds the moves in one line; stale plan lines fixed. _Checks: `npm run check` 0/0/0; no client script; detector 0 new finding; Lighthouse mobile 100/100/100/100, CLS 0, home 100 KiB; no horizontal scroll at 320 and 375 px; only the opened title travels, no transition skipped, none under reduced motion; the three build failures fire. Note: headless Chrome sometimes skips CSS transitions under load (the pre-review build behaved the same), so timing checks need a real browser._

## Dependencies & Execution Order

- **Phase 1** → **Phase 2** → user stories.
- Phase 2: T002 ∥ T003 ∥ T004; T005 after T003; T006 after T005; T007 after T006.
- **US1** needs Phase 2 (T002, T005). **US2** needs Phase 2; T014 needs T008 only for the
  `!important` check against the signature (T015), so US2 is best done after US1. **US3**
  validates US1 and US2 (and US4, US5 when done). **US4** needs only T002; it is independent
  of the diagram. **US5** needs T002, and its delay is meaningful after US4.
- **Phase 8** any time after the stories it describes; **Phase 9** last.

## Parallel Opportunities

- Phase 2: T002 ∥ T003 ∥ T004.
- US2: T012 ∥ T013.
- US4: T018 ∥ T019 ∥ T020 ∥ T021; the whole of Phase 6 ∥ Phases 3–5 once T002 is done.
- Phase 8: T025 ∥ T026.

## Implementation Strategy

1. **MVP**: Phases 1–3. The final state from the data, then the signature move.
2. Add US2 (candidate moves), then check US3 (reduced motion) across both.
3. Add US4 (page transitions) and US5 (project page symbol).
4. Align the documents, then audit, polish and the quality gates.

Commits, one per user story (each ticking its own tasks in this file):

1. `docs(specs): F10 specification, plan and tasks` (T001)
2. `feat(motion): signature move on the home diagram` (Phase 2 and US1, T002–T011)
3. `feat(motion): candidate moves on row hover and focus` (US2, T012–T015)
4. `a11y(motion): reduced motion leaves only the square marks` (US3, T016–T017), or folded
   into commit 3 if T016 finds nothing to fix
5. `feat(motion): page transitions between list and project` (US4, T018–T022)
6. `feat(motion): evaluation symbol stamps after the transition` (US5, T023–T024)
7. `docs: align DESIGN and ROADMAP with the motion` (Phase 8)
8. `fix(motion): design review`, or folded into the matching story commit (Phase 9)
