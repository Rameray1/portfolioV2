import type { Locale } from '../i18n/ui';

interface Contact {
  email: string;
  github: string;
  linkedin: string;
  city: string;
}

interface Site {
  name: string;
  contact: Contact;
  // Hébergeur, tel que Vercel le publie (https://vercel.com/legal/privacy-policy).
  host: { name: string; address: string; url: string };
  // Slug de la fiche projet qui raconte ce site, citée par le pied de page.
  project: string;
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
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Avenue #4133, Covina, CA 91723, United States',
    url: 'https://vercel.com',
  },
  project: 'portfolio',
  person: {
    jobTitle: {
      fr: 'Élève ingénieur en alternance',
      en: 'Software engineering apprentice',
    },
    school: 'IMT Mines Alès',
    employer: 'Astrée Software',
  },
} as const satisfies Site;
