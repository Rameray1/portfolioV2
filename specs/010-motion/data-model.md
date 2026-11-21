# Data Model: Transitions et micro-animations

No new collection and no new field: the moves already live in the project files (F06) and
the reference position in `src/data/diagram.ts` (C2b). This feature adds one build-time
transformation, `playBoard`, in `src/lib/board.ts` (revised by research R14).

## Inputs

### Move (from `featuredProjects(locale)`)

| Field  | Type                  | Source                                   |
| ------ | --------------------- | ---------------------------------------- |
| `from` | `string`              | `project.move.from`, square `[a-h][1-8]` |
| `to`   | `string`              | `project.move.to`, square `[a-h][1-8]`   |
| `eval` | `'!' \| '!?' \| '!!'` | `project.eval`                           |

Order: the order of `featuredProjects` (year desc, then title). The 1-based index is the
move number `N` shared with the home list (`data-play`). At most 3 moves (enforced in
`src/lib/projects.ts`).

### Reference position

`diagram.fen` (placement field only), parsed by the existing `parseFen`.

## Output: `Board`

```ts
interface BoardSquare {
  file: number; // 1–8
  rank: number; // 1–8
  dark: boolean;
  from?: number; // N of the move that starts here
  to?: number; // N of the move that lands here
}

interface BoardPiece {
  piece: string; // 'wR', 'bB'…
  file: number; // reference square
  rank: number;
  move?: number; // N of the move this piece plays
  dx?: number; // squares to its arrival square (+ = towards h)
  dy?: number; // squares to its arrival square (+ = towards rank 1, i.e. down)
  takenBy?: number; // N of the move that captures this piece
}

interface BoardStamp {
  file: number; // arrival square of move N
  rank: number;
  move: number;
  eval: '!' | '!?' | '!!';
}

interface Board {
  squares: BoardSquare[]; // 64, rank 8 to 1, file a to h
  pieces: BoardPiece[];
  stamps: BoardStamp[]; // one per move
}
```

## Rules

- **Rest state**: every piece on its reference square, every piece visible, no stamp.
- **Displacement**: `dx = toFile − fromFile`, `dy = fromRank − toRank`.
- **Validation** (throws, the build fails, message names the square and the move):
  - `from` holds no white piece;
  - `to` holds a white piece;
  - two moves share a square (any of their `from`/`to`).

## State per active row (rendered by CSS, see [contracts/motion.md](./contracts/motion.md))

| Row active | Piece of move N | Other moving pieces | Piece taken by N | Stamp of N | Squares of N |
| ---------- | --------------- | ------------------- | ---------------- | ---------- | ------------ |
| none       | on `from`       | on `from`           | visible          | hidden     | unmarked     |
| N          | on `to`         | on `from`           | hidden           | visible    | marked       |

Under reduced motion, pieces and stamps keep the « none » column whatever the row; only the
squares mark.
