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
  'notFound.title': 'Page introuvable',
  'notFound.description':
    'Erreur 404 : cette adresse ne mène à aucune page du portfolio de Ramazan Kus.',
  'notFound.lead': 'Erreur 404 : cette adresse ne mène à aucune page.',
  'notFound.home': 'Accueil',
  'notFound.projects': 'Projets',
  'notFound.email': 'M’écrire',
  'seo.ogImageAlt':
    'Ramazan Kus, élève ingénieur à IMT Mines Alès en alternance chez Astrée Software',
  'availability.label': 'Disponibilité',
  'availability.from': 'Dès',
  'about.seeking': 'Ce que je cherche',
  'action.pdf': '(PDF)',
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
  'notFound.title': 'Page not found',
  'notFound.description':
    'Error 404: this address leads to no page of Ramazan Kus’s portfolio.',
  'notFound.lead': 'Error 404: this address leads to no page.',
  'notFound.home': 'Home',
  'notFound.projects': 'Projects',
  'notFound.email': 'Email me',
  'seo.ogImageAlt':
    'Ramazan Kus, engineering student at IMT Mines Alès and apprentice at Astrée Software',
  'availability.label': 'Availability',
  'availability.from': 'From',
  'about.seeking': 'What I’m looking for',
  'action.pdf': '(PDF)',
};
