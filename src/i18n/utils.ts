import { en, fr, type Locale, type UiKey } from './ui';

const dictionaries = { fr, en } satisfies Record<Locale, Record<UiKey, string>>;

// `Astro.currentLocale` vaut 'en' sous /en, 'fr' ailleurs ; jamais undefined pour les composants.
export function getLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : 'fr';
}

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => dictionaries[locale][key];
}

// Chemin du site dans la langue voulue, depuis un chemin avec ou sans préfixe /en.
// Le préfixe est un segment entier (/english n'est pas une page anglaise) ; la barre
// oblique finale est conservée.
export function localizePath(path: string, locale: Locale): `/${string}` {
  const bare = (path.replace(/^\/en(?=\/|$)/, '') || '/') as `/${string}`;
  if (locale === 'fr') return bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
}

const strip = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, '') : path;

// Routes statiques générées, lues depuis les fichiers de src/pages (sans barre finale).
// Les routes dynamiques ([slug].astro) n'y figurent pas : F06 déclarera leurs chemins traduits.
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

// Cible du sélecteur depuis une page en `locale` : la même page dans l'autre langue si elle
// est générée, sinon l'accueil de l'autre langue.
export function switchPath(pathname: string, locale: Locale): `/${string}` {
  const other: Locale = locale === 'fr' ? 'en' : 'fr';
  const target = localizePath(pathname, other);
  return routes.has(strip(target)) ? target : localizePath('/', other);
}
