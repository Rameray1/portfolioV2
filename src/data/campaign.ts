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
  start: `${number}-${number}` | `${number}-${number}-${number}`;
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
      fr: '[provisoire] Disponible pour un stage',
      en: '[draft] Available for an internship',
    },
    start: '2027-04',
    place: {
      fr: '[provisoire] en France et en Europe',
      en: '[draft] in France and Europe',
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

// Formatée au build : une date invalide fait échouer la génération.
export function formatStart(start: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(start);
  const [year, month, day] = match
    ? [Number(match[1]), Number(match[2]), match[3] ? Number(match[3]) : 1]
    : [NaN, NaN, NaN];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    !match ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`campaign.availability.start invalide : « ${start} »`);
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: match[3] ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(date);
}
