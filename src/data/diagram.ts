import type { Locale } from '../i18n/ui';

export interface DiagramPosition {
  fen: string;
  alt: Record<Locale, string>;
}

export interface PlacedPiece {
  piece: string;
  file: number;
  rank: number;
}

// Champ « placement » d'une FEN : ma partie contre R4GUL07 (chess.com, 2026), avant 16.Txe7+.
export const diagram = {
  fen: 'r3k2r/p1qnbpp1/1p1p1n2/1Bp2PB1/8/2N3Pp/PPP2P1P/R2QR1K1',
  alt: {
    fr: 'Diagramme d’une de mes parties, avant le 16ᵉ coup des blancs, qui sacrifient la tour en e7',
    en: 'Diagram from one of my games, before White’s 16th move, a rook sacrifice on e7',
  },
} as const satisfies DiagramPosition;

export function parseFen(fen: string): PlacedPiece[] {
  const ranks = fen.split('/');
  if (ranks.length !== 8) throw new Error(`FEN invalide : « ${fen} »`);

  return ranks.flatMap((row, index) => {
    const rank = 8 - index;
    const pieces: PlacedPiece[] = [];
    let file = 1;
    for (const char of row) {
      if (/[1-8]/.test(char)) {
        file += Number(char);
      } else if (/[pnbrqk]/i.test(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        pieces.push({ piece: color + char.toUpperCase(), file, rank });
        file += 1;
      } else {
        throw new Error(`FEN invalide : « ${fen} »`);
      }
    }
    if (file !== 9) throw new Error(`FEN invalide : « ${fen} »`);
    return pieces;
  });
}
