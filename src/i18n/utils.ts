import { en, fr, type Locale, type UiKey } from './ui';

const dictionaries = { fr, en } satisfies Record<Locale, Record<UiKey, string>>;

export function getLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : 'fr';
}

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => dictionaries[locale][key];
}

export function localizePath(path: string, locale: Locale): `/${string}` {
  const bare = (path.replace(/^\/en(?=\/|$)/, '') || '/') as `/${string}`;
  if (locale === 'fr') return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

const strip = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, '') : path;

export function isStatusPage(pathname: string): boolean {
  return /^(\/en)?\/404$/.test(strip(pathname));
}

const pagePaths = Object.keys(import.meta.glob('/src/pages/**/*.astro')).map(
  (file) =>
    strip(
      file
        .replace(/^\/src\/pages/, '')
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '') || '/',
    ),
);

const routes = new Set(
  pagePaths.filter((path) => !path.includes('[') && !isStatusPage(path)),
);

// Routes dynamiques : `/projects/[slug]` accepte tout chemin `/projects/x`.
const dynamicRoutes = pagePaths
  .filter((path) => path.includes('['))
  .map((path) => new RegExp(`^${path.replace(/\[[^\]]+\]/g, '[^/]+')}$`));

const otherLocale = (locale: Locale): Locale => (locale === 'fr' ? 'en' : 'fr');

export function alternatePath(
  pathname: string,
  locale: Locale,
): `/${string}` | undefined {
  const target = localizePath(pathname, otherLocale(locale));
  const path = strip(target);
  const exists =
    routes.has(path) || dynamicRoutes.some((route) => route.test(path));
  return exists ? target : undefined;
}

export function switchPath(pathname: string, locale: Locale): `/${string}` {
  return (
    alternatePath(pathname, locale) ?? localizePath('/', otherLocale(locale))
  );
}
