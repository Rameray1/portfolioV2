// Langues du site. Reprises dans astro.config.mjs (bloc i18n) : les changer ensemble.
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

// Dictionnaire de référence : toute clé ajoutée ici doit l'être aussi dans `en`.
// `langSwitch.*` décrivent la langue cible, écrits dans cette langue.
// `nav.frenchMark` et `nav.inFrench` ne s'affichent que sur les pages non françaises.
export const fr = {
  skipLink: 'Aller au contenu',
  'nav.label': 'Navigation principale',
  'nav.about': 'À propos',
  'nav.projects': 'Projets',
  'nav.background': 'Parcours',
  'nav.skills': 'Compétences',
  'nav.cv': 'CV',
  'nav.blog': 'Blog',
  'nav.frenchMark': '(FR)',
  'nav.inFrench': 'en français',
  'footer.email': 'Email',
  'footer.github': 'GitHub',
  'footer.linkedin': 'LinkedIn',
  'langSwitch.short': 'EN',
  'langSwitch.label': 'English',
} satisfies Record<string, string>;

export type UiKey = keyof typeof fr;

// Mêmes clés que `fr`, ni plus ni moins : une clé manquante ou en trop fait échouer
// `npm run check`.
export const en: Record<UiKey, string> = {
  skipLink: 'Skip to content',
  'nav.label': 'Main navigation',
  'nav.about': 'About',
  'nav.projects': 'Projects',
  'nav.background': 'Background',
  'nav.skills': 'Skills',
  'nav.cv': 'CV',
  'nav.blog': 'Blog',
  'nav.frenchMark': '(FR)',
  'nav.inFrench': 'in French',
  'footer.email': 'Email',
  'footer.github': 'GitHub',
  'footer.linkedin': 'LinkedIn',
  'langSwitch.short': 'FR',
  'langSwitch.label': 'Français',
};
