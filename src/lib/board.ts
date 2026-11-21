import { parseFen } from '../data/diagram';
import type { Eval } from './projects';

export interface Move {
  from: string;
  to: string;
  eval: Eval;
}

interface BoardSquare {
  file: number;
  rank: number;
  dark: boolean;
  from?: number;
  to?: number;
}

interface BoardPiece {
  piece: string;
  file: number;
  rank: number;
  move?: number;
  dx?: number;
  dy?: number;
  takenBy?: number;
}

interface BoardStamp {
  file: number;
  rank: number;
  move: number;
  eval: Eval;
}

interface Board {
  squares: BoardSquare[];
  pieces: BoardPiece[];
  stamps: BoardStamp[];
}

const toSquare = (name: string) => ({
  file: name.charCodeAt(0) - 96,
  rank: Number(name[1]),
});

// La position reste celle de la FEN ; chaque coup ne se joue qu'au survol de sa ligne.
export function playBoard(fen: string, moves: Move[]): Board {
  const pieces: BoardPiece[] = parseFen(fen);
  const at = (name: string) => {
    const { file, rank } = toSquare(name);
    return pieces.find((piece) => piece.file === file && piece.rank === rank);
  };

  const seen = new Map<string, number>();
  const stamps = moves.map((move, index) => {
    const n = index + 1;
    for (const square of [move.from, move.to]) {
      const other = seen.get(square);
      if (other !== undefined) {
        throw new Error(
          `Diagramme : les coups ${other} et ${n} partagent la case ${square}`,
        );
      }
      seen.set(square, n);
    }

    const mover = at(move.from);
    if (!mover?.piece.startsWith('w')) {
      throw new Error(
        `Diagramme : le coup ${n} part de ${move.from}, sans pièce blanche`,
      );
    }
    const taken = at(move.to);
    if (taken?.piece.startsWith('w')) {
      throw new Error(
        `Diagramme : le coup ${n} arrive en ${move.to}, sur une pièce blanche`,
      );
    }

    const from = toSquare(move.from);
    const to = toSquare(move.to);
    Object.assign(mover, {
      move: n,
      dx: to.file - from.file,
      dy: from.rank - to.rank,
    });
    if (taken) taken.takenBy = n;
    return { ...to, move: n, eval: move.eval };
  });

  const squares: BoardSquare[] = [8, 7, 6, 5, 4, 3, 2, 1].flatMap((rank) =>
    [1, 2, 3, 4, 5, 6, 7, 8].map((file) => {
      const name = String.fromCharCode(96 + file) + rank;
      const n = moves.findIndex(
        (move) => move.from === name || move.to === name,
      );
      const move = moves[n];
      return {
        file,
        rank,
        dark: (file + rank) % 2 === 0,
        ...(move?.from === name && { from: n + 1 }),
        ...(move?.to === name && { to: n + 1 }),
      };
    }),
  );

  return { squares, pieces, stamps };
}
