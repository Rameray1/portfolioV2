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
