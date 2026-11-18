import type { Locale } from '../i18n/ui';
import { site } from './site';

export type Localized = Record<Locale, string>;

export interface Action {
  label: Localized;
  href: string | Localized;
}

export interface Availability {
  visible: boolean;
  status: Localized;
  start?: `${number}-${number}` | `${number}-${number}-${number}`;
  place: Localized;
}

export interface Campaign {
  pitch: Localized;
  availability: Availability;
  actions: readonly [Action, Action];
}

export const campaign: Campaign = {
  pitch: {
    fr: 'Élève ingénieur à IMT Mines Alès, en alternance chez Astrée Software, je développe des applications métier, du modèle de données à la mise en production.',
    en: 'Software engineering student at IMT Mines Alès, building business applications at Astrée Software as an apprentice, from data model to production.',
  },
  availability: {
    visible: true,
    status: {
      fr: 'Disponible pour un stage de développement à l’étranger',
      en: 'Available for a developer internship abroad',
    },
    place: {
      fr: 'Tous pays hors de France, 9\u00a0semaines minimum',
      en: 'Any country outside France, 9\u00a0weeks minimum',
    },
  },
  actions: [
    {
      label: { fr: 'M’écrire', en: 'Email me' },
      href: `mailto:${site.contact.email}`,
    },
    {
      label: { fr: 'LinkedIn', en: 'LinkedIn' },
      href: site.contact.linkedin,
    },
  ],
};
