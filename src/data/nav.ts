import type { UiKey } from '../i18n/ui';

type NavKey = Extract<UiKey, `nav.${string}`>;

export interface NavItem {
  key: NavKey;
  href: `/${string}`;
}

export const nav = [
  { key: 'nav.about', href: '/about' },
  { key: 'nav.projects', href: '/projects/' },
  { key: 'nav.background', href: '/background' },
  { key: 'nav.skills', href: '/skills' },
  { key: 'nav.cv', href: '/cv' },
] as const satisfies readonly NavItem[];
