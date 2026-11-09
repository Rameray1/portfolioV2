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

// Routes dynamiques ([slug]) non listées : à traiter en F06.
const routes = new Set(
  Object.keys(import.meta.glob('/src/pages/**/*.astro'))
    .filter((file) => !file.includes('['))
    .map((file) =>
      strip(
        file
          .replace(/^\/src\/pages/, '')
          .replace(/\.astro$/, '')
          .replace(/\/index$/, '') || '/',
      ),
    ),
);

export function switchPath(pathname: string, locale: Locale): `/${string}` {
  const other: Locale = locale === 'fr' ? 'en' : 'fr';
  const target = localizePath(pathname, other);
  return routes.has(strip(target)) ? target : localizePath('/', other);
}
