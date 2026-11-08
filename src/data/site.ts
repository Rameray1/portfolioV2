export interface Contact {
  email: string;
  github: string;
  linkedin: string;
}

export interface Site {
  name: string;
  contact: Contact;
}

export const site = {
  name: 'Ramazan Kus',
  contact: {
    email: 'rkus.contact@gmail.com',
    github: 'https://github.com/Rameray1',
    linkedin: 'https://www.linkedin.com/in/ramazan-kus/',
  },
} as const satisfies Site;
