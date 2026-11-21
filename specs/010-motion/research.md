# Research: Transitions et micro-animations

Phase 0 of [plan.md](./plan.md). No `NEEDS CLARIFICATION` remained in the Technical Context;
each entry below records one design decision.

## R1 — The HTML holds the final position, computed at build

> Superseded by R14 (maintainer feedback, 2026-11-20).

- **Decision**: a pure function `playBoard(fen, moves)` in `src/lib/board.ts` turns the
  reference FEN (C2b, unchanged in `src/data/diagram.ts`) and the ordered featured moves into
  the 64 squares and the placed pieces of the **final state**: the `!!` piece sits on its
  `to` square, the piece it takes is kept in the DOM but hidden, every other piece sits on
  its reference square. Each moving piece carries its displacement `dx`/`dy` (in squares) to
  its other square: towards `to` for a candidate, back towards `from` for the `!!` piece.
- **Rationale**: Final State Rule (FR-001, FR-003): with no animation, no support or reduced
  motion, the page is already right. Keeping the taken piece in the DOM lets it reappear
  when the `!!` piece goes back (spec US2-2). Computing at build keeps `Diagram` a view
  (principle I) and puts every rule a schema cannot see in one testable place.
- **Alternatives**: a second FEN for the final state in `diagram.ts` (two sources for one
  position, principle IV); computing in `Diagram.astro` (view doing data work).

## R2 — One build-time check on the moves

- **Decision**: `playBoard` throws when a move starts from a square without a white piece,
  lands on a white piece, or when two moves share any square (`from` or `to`).
- **Rationale**: FR-012 makes the moves data; principle III says invalid data fails the
  build. Distinct squares remove every ambiguous case (two captures of the same piece, a
  candidate starting where the `!!` lands) with one rule, and C2b already requires three
  different pieces. No legality check (YAGNI): the maintainer copies a real game.
- **Alternatives**: full move legality (a chess library or 200 lines, for data written once).

## R3 — Linking a list row to its move: `data-play`

- **Decision**: on the home list only (`ProjectList` without `detail`), each row link gets
  `data-play="N"`, N = its 1-based rank. `Diagram` receives the moves in the same order and
  stamps `data-move="N"` on the piece, the `from` square, the `to` square and the taken
  piece. `Diagram`'s scoped style holds one rule group per N (1 to 3, the cap enforced in
  `src/lib/projects.ts`), of the form
  `:global(:root:has([data-play='N']:is(:hover, :focus-visible))) [data-move='N']`.
- **Rationale**: no script (FR-020); `Diagram` stays self-contained, it reacts to any row
  that names its move. An attribute is sturdier than the `nth-child` of the ROADMAP plan: it
  does not depend on the list markup. `HomeView` passes the same `featured` array to both
  components, so the order cannot drift.
- **Alternatives**: rules in `HomeView` reaching into `Diagram` with `:global` (couples the
  page to the component's internals); `nth-child` (breaks if the list gains a wrapper).

## R4 — Hover only where hover exists

- **Decision**: `:hover` triggers inside `@media (hover: hover)`; `:focus-visible` triggers
  everywhere.
- **Rationale**: on touch screens, a tap opens the project at once (FR-011), and a sticky
  hover left after a back navigation must not leave a piece away from its square. The
  current inverted row already opens on first tap; this keeps it so.
- **Alternatives**: one `:is(:hover, :focus-visible)` everywhere (sticky hover on mobile).

## R5 — Moves are `transform` transitions; reduced motion moves nothing

- **Decision**: a moving piece's active state is
  `transform: translate(calc(var(--dx) * 100%), calc(var(--dy) * 100%))`, with
  `transition: transform var(--duration-move) var(--ease-out)`. A piece fills its square, so
  100 % of its own box is one square. Every displacement rule sits inside
  `@media screen and (prefers-reduced-motion: no-preference)`; outside it, pieces never move
  and only the squares mark (FR-016, US3-2).
- **Rationale**: transforms do not touch layout (FR-021, CLS 0) and run on the compositor.
  Leaving the row makes the old piece transition back on its own, which also replays the
  `!!` move when the list is left (US2-6) without any extra rule.
- **Alternatives**: moving `grid-column`/`grid-row` (not animatable, layout work).
- **One Move Rule**: the returning piece and the new one travel in the same 320 ms. The spec
  only requires at most one piece heading to an arrival square (edge case « passage
  rapide »); a delay before the new move would make every hover feel late.

## R6 — The signature move: load on desktop, scroll on mobile

> Superseded by R14 (maintainer feedback, 2026-11-20).

- **Decision**: three keyframes in `Diagram`, used only when the board has a `!!` move:
  - `play` on the `!!` piece, from its back translation to none;
  - `held` on the taken piece, opacity 1 for the whole move (its rest state is hidden);
  - `stamp` on the `!!` symbol, from opacity 0 and `scale: 1.15` to the rest state.
    Above 56rem (`@media (width > 56rem)`): `play` and `held` last
    `calc(var(--duration-move) * 2)` after a 400 ms delay (DESIGN.md, a component value,
    commented), `stamp` lasts `--duration-stamp` and starts when `play` ends; all use
    `animation-fill-mode: backwards`. At 56rem and below, inside
    `@supports (animation-timeline: view())`: the board declares `view-timeline-name: --board`,
    `play`/`held` run on `animation-range: entry 0% entry 70%`, `stamp` on
    `entry 70% entry 100%`, `fill-mode: both`. All of it sits in the motion media query.
- **Rationale**: FR-004, FR-005, Move-Then-Note (the stamp starts after the piece lands).
  A named timeline on the board makes the trigger the board's entry, not the small piece's.
  `entry 100%` is the moment the board is fully on screen (spec US1-2, SC-001). Without
  `view()` support on mobile, the `@supports` block is skipped and the final state shows.
  `backwards` keeps the start position during the delay and lets the HTML state take over at
  the end, so hover rules work afterwards.
- **Alternatives**: `IntersectionObserver` (script, refused by principle II); playing on load
  on mobile too (the move would end before the reader scrolls to it).

## R7 — Hover during the signature: a registered `--sig` instead of `!important`

> Superseded by R14 (maintainer feedback, 2026-11-20).

- **Decision** (revised at implementation): the signature keyframes animate a registered
  number `--sig` from 1 to 0 instead of `transform`; the rook's offset is
  `max(var(--sig), var(--away))` times its displacement, `--away` being 1 while a row other
  than the `!!` one is active.
- **Rationale**: a row hovered during the signature takes over at once (edge case « survol
  pendant le coup signature »), the animation is never cancelled, so leaving the list does
  not replay it, and no `!important` is needed. Changes driven by an animation do not start
  transitions, so the hover transition on `transform` stays clean.
- **Alternatives**: `!important` on the hovered transform (works, but only through a cascade
  exception); `animation: none` while the list is active (replays the whole signature, stamp
  included, on every list exit).

## R8 — Taken pieces follow their capturer

> The board stamp part is superseded by R14.

- **Decision**: a taken piece is hidden by `opacity: 0` exactly when its capturer stands on
  its square, with `transition: opacity 0s var(--duration-move)` towards hidden (it vanishes
  when the capturer lands) and no delay towards visible (it is back as soon as the capturer
  leaves). The `!!` symbol on the board follows the same rule as the piece taken by the `!!`:
  hidden while the `!!` piece is away, back once it has returned. Outside the motion query,
  nothing changes state, so the final state stays.
- **Rationale**: FR-008, Move-Then-Note on every replay, not only the first one.
- **Alternatives**: removing the taken piece from the HTML (cannot reappear, US2-2).

## R13 — Board stamps keep their print inks in both themes

> Extended by R14 to the three symbols: `--color-great-on-board` (`#2a5384`) and
> `--color-interesting-on-board` (`#a3289a`) join `--color-brilliant-on-board`.

- **Decision**: the `!!` of the diagram is a small chip inside the board, background
  `--color-square-light`, symbol in a new token `--color-brilliant-on-board: #0077b6`, not
  overridden in dark. The chip stays inside the board whatever the square.
- **Rationale**: the board stays a light print in dark theme (Printed Negative Rule), so the
  dark-theme sky blue `#5cc8ff` would read at 1.47:1 on the dark-theme light square, and the
  print blue at 2.22:1 on a dark square. On the chip, `#0077b6` gives 4.87:1 (light theme,
  `#ffffff`) and 3.8:1 (dark theme, `#e6e3dc`), above the 3:1 of large bold text
  (constitution VII). Inside the board, no overflow on the h-file (FR-021).
- **Alternatives**: the symbol outside the board on the paper (its colour would have to follow
  the page theme while the board does not, and it could overflow); a darker blue (leaves the
  `DESIGN.md` palette).

## R9 — Square marks are outlines, not inset shadows

- **Decision**: a marked square gets `outline: 4px solid var(--color-mark)` (`to`) or `2px`
  (`from`) with a matching negative `outline-offset`, by a colour change from `transparent`
  in `--duration`. The marks apply under reduced motion too.
- **Rationale**: `box-shadow` is dropped in forced colors mode, outlines are kept (edge case
  « contraste forcé »). Drawn inside the square, the result is the same liseré as the inset
  shadow of DESIGN.md. 4 px and 2 px are DESIGN.md values used by this component only.
- **Alternatives**: `box-shadow: inset` (invisible in forced colors). DESIGN.md (Elevation)
  is aligned to say « liserés » rather than « box-shadow ».

## R10 — Page transitions: native, cross-document, opt-in by motion

- **Decision**: in `global.css`, inside `@media (prefers-reduced-motion: no-preference)`:
  `@view-transition { navigation: auto; }` and
  `::view-transition-group(*) { animation-duration: var(--duration-page); }`.
  `Header` gets `view-transition-name: site-header`. The project title gets
  `view-transition-name: project-<slug>` on the block `.title` of a `ProjectList` row and on
  the `h1` of `ProjectView`, as an inline style.
- **Rationale**: FR-013, FR-014, zero script (no `ClientRouter`). Opting in only under
  `no-preference` removes the fade too (FR-016). The name sits on block boxes: an inline
  title broken over two lines is a fragmented box, which makes the browser skip the whole
  transition. Names stay unique per page; a project page names only its own title, the
  « partie suivante » row carries none (R17). The back navigation runs the same pairs in reverse (US4-3);
  a language switch keeps the same slug, so the title stays in place (US4-5).
- **Alternatives**: `ClientRouter` (client script); naming the inner title span (fragmented
  on mobile).

## R11 — The project page symbol

- **Decision**: in `ProjectView`, inside the motion media query, `.mark` gets a fade
  (`opacity` 0 → 1) of `--duration-stamp` with `animation-delay: var(--duration-page)` and
  `fill-mode: backwards`. No scale.
- **Rationale**: FR-015, US5; on a direct load the same delay applies, the symbol ends
  visible (US5-3). Print and reduced motion get no animation.

## R12 — Tokens and alt text

- **Decision**: `--duration-page: 280ms`, `--duration-move: 320ms`, `--duration-stamp: 240ms`
  in `global.css`, set to `0ms` in the existing reduced-motion block. `diagram.alt` describes
  the position after 16.Txe7+, FR and EN, following `CONTENU.md` §9.
- **Rationale**: FR-019, FR-002. The alt is data; if the `!!` project ever changes, its move
  and this sentence change together in the same commit (noted in `diagram.ts`).
- **Alternatives**: generating the alt from the moves (prose from code, worse sentences).

## R14 — Revision: no move at load, every move noted on the board

- **Decision** (maintainer feedback after the first implementation, 2026-11-20): the `!!` move
  no longer plays by itself. The HTML shows the reference position and nothing moves until a
  row is hovered or focused; the `!!` row behaves like the others. Each move gets its own
  stamp: `playBoard` returns one `BoardStamp` per move (arrival square, move number,
  evaluation), rendered as an `aria-hidden` chip holding `EvalMark`, in the board ink of its
  symbol. A stamp reads the same `--on` flag as its piece: `opacity: var(--on)`,
  `scale: calc(1.15 - var(--on) * 0.15)`, with a transition delayed by
  `calc(var(--on) * var(--duration-move) / 2)` (the piece has covered 97 % of its path at
  half time with `--ease-out`), so it lands as the piece reaches its square and leaves at
  once; a full `--duration-move` delay felt slow.
  Under reduced motion no stamp appears (only the squares mark).
- **Removed**: the signature keyframes, the scroll-driven variant, the registered `--sig`, the
  `--away` / `--own` flags, `data-brilliant`, the hidden taken piece at rest. The diagram
  alt text describes the reference position again (« avant le 16ᵉ coup »).
- **Rationale**: the maintainer wants the diagram to stay still until the reader asks, and
  every evaluation symbol to show on its move. It also removes the most fragile code of the
  first version (the scroll timeline merged by the minifier, the cascade between the
  signature animation and the hover).

## R15 — The flags are registered numbers

- **Decision**: `--on` and `--taken` are declared with `@property` (`syntax: '<number>'`,
  `inherits: false`, `initial-value: 0`); the per-row `--on-1`…`--on-3` stay plain.
- **Rationale**: with unregistered flags, Chrome did not start the `transform`, `outline` and
  `opacity` transitions that depend on them: candidate pieces jumped to their square. A
  registered number gives a typed computed value, and the transitions run.
- **Alternatives**: one selector per element and per row writing literal values (three times
  the rules).

## R16 — Move sounds: tried, then removed

- **Decision** (maintainer, 2026-11-20): no sound in F10. A version was built and committed
  (Web Audio wooden taps for move, capture and check, typed from the data, unlocked on the
  first gesture), then removed after review.
- **Rationale**: it needed the only client script of the site (principle II), stayed silent
  until a first click in the page and absent on mobile, so few recruiters would hear it, and
  it surprised the ones who did, with no way to mute it. The diagram and the list already
  carry the same information.
- **Kept for later**: an idea in the reserve of `ROADMAP.md`, to come back with a sound
  switch next to a theme button. Licences checked: chess.com sounds are « all rights
  reserved », Lichess « standard » sounds are listed as non-free; synthesis avoids both.

## R17 — Only the opened project's title travels

- **Decision** (maintainer feedback, 2026-11-21): the « partie suivante » row of a project page
  carries no `view-transition-name` (`ProjectList` prop `transition={false}`).
- **Rationale**: with a name, that row paired with the same project in the list, so opening
  Meetz also flew the Portfolio title down to the page footer, and going back flew it up
  again. Without JavaScript, the browser cannot know which link was clicked; removing the
  second name on the project page is the only way to keep one travelling title. The cost:
  « partie suivante » opens with the plain fade.

## R18 — A smoother title transition

- **Decision** (maintainer feedback « pas très fluide », 2026-11-21): titles carry
  `view-transition-class: project`; their old and new captures keep their own proportions
  (`block-size: 100%; inline-size: auto`, anchored top left) and cross-fade in a third of
  `--duration-page`. The root old capture fades out in half the duration, the new one fades
  in after a quarter.
- **Rationale**: frames filmed at 3 s showed the default stretch (the large `h1` squeezed
  into the row's box, so the title popped instead of growing, and two wrappings read at
  once) and the two pages superimposed at 50 % mid-way. The duration stays 280 ms.
