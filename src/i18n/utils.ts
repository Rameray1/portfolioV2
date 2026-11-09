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
