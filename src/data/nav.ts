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
