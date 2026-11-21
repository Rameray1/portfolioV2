// Adresse de chaque figurine par son code FEN (`wK`, `bP`…).
export const pieceUrls: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../assets/pieces/*.svg', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ).map(([path, url]) => [path.replace(/^.*\/(\w+)\.svg$/, '$1'), url]),
);

// Figurines imprimées à l'encre : noires sur papier clair, blanches en thème sombre (DESIGN.md).
export const pieces = {
  pawn: { light: pieceUrls.bP, dark: pieceUrls.wP },
  knight: { light: pieceUrls.bN, dark: pieceUrls.wN },
  rook: { light: pieceUrls.bR, dark: pieceUrls.wR },
  queen: { light: pieceUrls.bQ, dark: pieceUrls.wQ },
  king: { light: pieceUrls.bK, dark: pieceUrls.wK },
};

export type PieceName = keyof typeof pieces;

// La pièce d'une étape du parcours, sur la frise comme sur le CV.
export const stepPiece = {
  education: 'pawn',
  experience: 'knight',
} as const satisfies Record<string, PieceName>;
