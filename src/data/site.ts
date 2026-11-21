import type { Locale } from '../i18n/ui';

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
  city: string;
}

export interface Site {
  name: string;
  contact: Contact;
  person: {
    jobTitle: Record<Locale, string>;
    school: string;
    employer: string;
  };
}

export const site = {
  name: 'Ramazan Kus',
  contact: {
    email: 'contact@ramazankus.dev',
    github: 'https://github.com/Rameray1',
    linkedin: 'https://www.linkedin.com/in/ramazan-kus/',
    city: 'Alès, France',
  },
  person: {
    jobTitle: {
      fr: 'Élève ingénieur en alternance',
      en: 'Software engineering apprentice',
    },
    school: 'IMT Mines Alès',
    employer: 'Astrée Software',
  },
} as const satisfies Site;
