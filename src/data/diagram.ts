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

// Position provisoire jusqu'à C2b : champ « placement » d'une FEN, copiable depuis lichess.
export const diagram = {
  fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
  alt: {
    fr: '[provisoire] Diagramme : partie italienne après 1.e4 e5 2.Cf3 Cc6 3.Fc4 Fc5',
    en: '[draft] Diagram: Italian Game after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5',
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
