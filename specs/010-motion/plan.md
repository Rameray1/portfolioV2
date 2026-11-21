# Implementation Plan: Transitions et micro-animations

**Branch**: `010-motion` | **Date**: 2026-11-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-motion/spec.md`

## Summary

The four effects of `DESIGN.md` (Motion), in CSS only, as revised after the maintainer's
review (research R14): nothing moves at load. A pure build-time function, `playBoard`
(`src/lib/board.ts`), keeps the reference position and tags every moving piece with its move
number and displacement, every taken piece with its capturer, and adds one evaluation stamp
per move on its arrival square. `Diagram` renders that board and reacts to the home rows
(`data-play`, set by `ProjectList`): one `:root:has()` rule per move turns a `--on-N` flag on,
read by the piece (transform), its squares (outline liserés), the taken piece and the stamp,
which lands after the piece. Page transitions are native cross-document view transitions
(`site-header`, `project-<slug>`), opted in only under `prefers-reduced-motion:
no-preference`; the project page symbol fades in after `--duration-page`. Square marks are
outlines and stay under reduced motion. Zero script; three duration tokens and four board
inks.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Astro 7.4, Node 22

**Primary Dependencies**: none added. CSS view transitions (`@view-transition`), scroll-driven
animations (`animation-timeline`, `view-timeline-name`), `:has()`, all as progressive
enhancement

**Storage**: N/A — moves in `src/content/projects/fr/*.md` (F06), FEN in
`src/data/diagram.ts` (C2b)

**Testing**: no test framework. Build-time throws of `playBoard`
([contracts/motion.md](./contracts/motion.md), « Failure contract »), `npm run check`, then
the scenarios of [quickstart.md](./quickstart.md): Chromium, Safari, Firefox; reduced motion;
forced colors; touch; keyboard; VoiceOver; Lighthouse; captures at 375 px and 1280 px in both
themes

**Target Platform**: evergreen browsers; static files in `dist/`, deployed on Vercel

**Project Type**: static website (Astro)

**Performance Goals**: 0 kB client JS; home < 200 kB transferred (CSS only, < 2 kB);
Lighthouse mobile ≥ 95 / 100 / 100 / 100; CLS 0 (transforms and opacity only)

**Constraints**: no `<script>`, no `ClientRouter`, no `IntersectionObserver`; every movement
inside `@media screen and (prefers-reduced-motion: no-preference)`; rest state = HTML (reference position, research R14);
tokens only, except the 400 ms delay and the 4 px / 2 px liserés (DESIGN.md values, commented)

**Scale/Scope**: 1 new lib module (`board.ts`), 3 changed components (`Diagram`,
`ProjectList`, `Header`), 2 changed views (`HomeView`, `ProjectView`), `global.css`
(7 tokens, view transition rules), `DESIGN.md` aligned
(R9)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                       | Status | Notes                                                                                                                                                                                                                                                                |
| ---- | ------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I    | Simplicité d'abord, SOLID       | Pass   | No dependency. One pure function holds the board logic (S); `Diagram` displays, `HomeView` passes `featuredProjects` data (D). Adding or changing a featured move edits a Markdown file only (O). No move legality engine (YAGNI, R2).                               |
| II   | Statique, zéro JS client        | Pass   | No `<script>`, no `client:*`. Every effect is CSS the browser may ignore; the page without it is the rest state (R10, R14).                                                                                                                                          |
| III  | Contenu = donnée typée          | Pass   | Moves stay in the project schema; `playBoard` fails the build on an impossible move (R2).                                                                                                                                                                            |
| IV   | Une seule source                | Pass   | The final position is derived from the FEN plus the `!!` move, never stored twice (R1). The same `featured` array feeds the list and the diagram.                                                                                                                    |
| V    | Leviers = données               | Pass   | Choosing the featured projects and the `!!` stays in `featured` / `eval`; the motion follows.                                                                                                                                                                        |
| VI   | Bilingue par dictionnaire       | Pass   | No new UI label. The diagram alt is data in `diagram.ts`, FR and EN.                                                                                                                                                                                                 |
| VII  | Accessibilité, performance      | Pass   | All motion off under `prefers-reduced-motion: reduce`, including the page fade; marks survive forced colors (R9); alt matches the reference position; transforms only (CLS 0). Review at 375 / 1280 px, both themes, header and footer.                              |
| VIII | Jetons, direction visuelle      | Pass   | Three duration tokens and four board inks (R13, R14); exceptions are DESIGN.md values used by one component, commented (4 px / 2 px liserés, stamp size). The effects are the four of DESIGN.md and serve comprehension. DESIGN.md wording aligned on outlines (R9). |
| IX   | Conventions, qualité vérifiable | Pass   | English code and names; `npm run check && npm run build` before each commit; `feat(motion)` commits, one per user story.                                                                                                                                             |

**Post-design re-check** (after Phase 1, and again after the R14 revision): unchanged, all
Pass. No `!important`, no script.

## Project Structure

### Documentation (this feature)

```text
specs/010-motion/
├── plan.md              # This file
├── research.md          # Phase 0 (R1–R18)
├── data-model.md        # Phase 1: playBoard inputs, Board, state table
├── quickstart.md        # Phase 1: validation scenarios
├── contracts/
│   └── motion.md        # Phase 1: props, hooks, names, tokens, gates, failures
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── board.ts               # NEW: playBoard(fen, moves) → squares, pieces, stamps; throws
├── data/
│   └── diagram.ts             # FEN and alt FR/EN (reference position, unchanged)
├── components/
│   ├── Diagram.astro          # renders Board; per-move :has() rules; marks and stamps
│   ├── ProjectList.astro      # data-play on home rows; view-transition name and class on .title
│   └── Header.astro           # view-transition-name: site-header
├── views/
│   ├── HomeView.astro         # maps featured → Move[] for Diagram
│   └── ProjectView.astro      # h1 view-transition-name; delayed fade of .mark
└── styles/
    └── global.css             # --duration-page/-move/-stamp; @view-transition; group duration
DESIGN.md                      # Elevation: « liserés » (outline) instead of box-shadow
```

**Structure Decision**: existing single Astro project. Board logic joins `src/lib/` next to
`projects.ts`; `parseFen` stays in `src/data/diagram.ts` and is reused by `board.ts`.

## Complexity Tracking

No violation to justify.
