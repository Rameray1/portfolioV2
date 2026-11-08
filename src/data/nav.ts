// Rubriques de la navigation, une entrée par rubrique ; l'ordre du tableau est l'ordre affiché.
// `href` commence par `/`. Une page placée sous ce chemin (`/projects/x`) signale la rubrique
// comme courante. Les libellés passeront par le dictionnaire i18n en F03.
export interface NavItem {
  label: string;
  href: `/${string}`;
}

export const nav = [
  { label: 'À propos', href: '/about' },
  { label: 'Projets', href: '/projects/' },
  { label: 'Parcours', href: '/background' },
  { label: 'Compétences', href: '/skills' },
  { label: 'CV', href: '/cv' },
  { label: 'Blog', href: '/blog/' },
] as const satisfies readonly NavItem[];
