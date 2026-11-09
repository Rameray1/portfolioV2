// Rubriques de la navigation, une entrée par rubrique ; l'ordre du tableau est l'ordre affiché.
// `key` désigne le libellé dans le dictionnaire (src/i18n/ui.ts). `href` est le chemin
// français, sans préfixe : il est localisé au rendu (/projects/ → /en/projects/). Une page
// placée sous ce chemin (`/projects/x`) signale la rubrique comme courante.
// `frenchOnly` : rubrique sans version anglaise (le blog) ; son lien reste français et porte
// la mention (FR) dans les autres langues.
import type { UiKey } from '../i18n/ui';

type NavKey = Extract<UiKey, `nav.${string}`>;

export interface NavItem {
  key: NavKey;
  href: `/${string}`;
  frenchOnly?: true;
}

export const nav = [
  { key: 'nav.about', href: '/about' },
  { key: 'nav.projects', href: '/projects/' },
  { key: 'nav.background', href: '/background' },
  { key: 'nav.skills', href: '/skills' },
  { key: 'nav.cv', href: '/cv' },
  { key: 'nav.blog', href: '/blog/', frenchOnly: true },
] as const satisfies readonly NavItem[];
