import type { Locale } from '../i18n/ui';

interface DiagramPosition {
  fen: string;
  alt: Record<Locale, string>;
}

// Champ « placement » d'une FEN : ma partie contre R4GUL07 (chess.com, 2026), avant 16.Txe7+.
export const diagram = {
  fen: 'r3k2r/p1qnbpp1/1p1p1n2/1Bp2PB1/8/2N3Pp/PPP2P1P/R2QR1K1',
  alt: {
    fr: 'Diagramme d’une de mes parties, avant le 16ᵉ coup des blancs, qui sacrifient la tour en e7',
    en: 'Diagram from one of my games, before White’s 16th move, a rook sacrifice on e7',
  },
} as const satisfies DiagramPosition;
