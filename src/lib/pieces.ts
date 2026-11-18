import blackPawn from '../assets/pieces/bP.svg?url';
import blackKnight from '../assets/pieces/bN.svg?url';
import blackQueen from '../assets/pieces/bQ.svg?url';
import whitePawn from '../assets/pieces/wP.svg?url';
import whiteKnight from '../assets/pieces/wN.svg?url';
import whiteQueen from '../assets/pieces/wQ.svg?url';

// Figurines imprimées à l'encre : noires sur papier clair, blanches en thème sombre (DESIGN.md).
export const pieces = {
  pawn: { light: blackPawn, dark: whitePawn },
  knight: { light: blackKnight, dark: whiteKnight },
  queen: { light: blackQueen, dark: whiteQueen },
};

export type PieceName = keyof typeof pieces;
