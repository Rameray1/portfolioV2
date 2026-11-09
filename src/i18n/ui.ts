// À garder aligné sur le bloc i18n de astro.config.mjs.
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

// `langSwitch.*` nomment la langue cible, dans cette langue.
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
