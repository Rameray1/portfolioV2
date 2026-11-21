import { getCollection } from 'astro:content';
import { campaign } from '../data/campaign';
import { site } from '../data/site';
import type { Locale } from '../i18n/ui';
import { localizePath, useTranslations } from '../i18n/utils';
import { getAvailability, type Availability } from './availability';
import { getBackground, type BackgroundEntry } from './background';
import { formatMonth } from './dates';
import { featuredProjects, type Project } from './projects';
import { getSkills } from './skills';

export interface CvLink {
  kind: 'linkedin' | 'github' | 'website';
  href: string;
  label: string;
}

export interface CvEntry {
  title: string;
  place: string;
  from: string;
  to: string;
  current: boolean;
  detail: string;
  highlights: string[];
}

// La page reprend la liste des coups (symbole, repli français) ; le PDF lit l'URL absolue.
type CvProject = Project & { url: string };

export interface Cv {
  locale: Locale;
  name: string;
  title: string;
  email: string;
  city: string;
  links: CvLink[];
  profile: { pitch: string; availability?: Availability };
  experience: CvEntry[];
  education: CvEntry[];
  projects: CvProject[];
  skills: { domain: string; names: string[] }[];
  languages: { name: string; level: string }[];
  pdf: { href: string; filename: string };
}

// La forme courte sert de texte au lien : sans protocole, sans « www. », sans barre finale.
export const shortUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

async function getLanguages(locale: Locale) {
  const entries = await getCollection('languages');
  if (entries.length === 0) {
    throw new Error('src/data/languages.yaml : aucune langue');
  }
  return entries
    .sort((a, b) => a.data.rank - b.data.rank || a.id.localeCompare(b.id))
    .map(({ data }) => ({
      name: data.name[locale],
      level: data.level[locale],
    }));
}

export async function getCv(locale: Locale): Promise<Cv> {
  const t = useTranslations(locale);
  const website = import.meta.env.SITE;

  const entries = await getBackground(locale);
  const toEntry = (entry: BackgroundEntry): CvEntry => {
    const from = formatMonth(entry.start, locale);
    const to = entry.end
      ? formatMonth(entry.end, locale)
      : t('background.present');
    return {
      title: entry.title,
      place: entry.place,
      from,
      to,
      current: !entry.end,
      detail: entry.detail,
      highlights: entry.highlights,
    };
  };

  const projects = (await featuredProjects(locale)).map((project) => ({
    ...project,
    url: new URL(localizePath(`/projects/${project.slug}/`, locale), website)
      .href,
  }));

  const skills = (await getSkills(locale)).map((group) => ({
    domain: t(`skills.domain.${group.domain}`),
    names: group.skills.map((skill) => skill.name),
  }));

  return {
    locale,
    name: site.name,
    title: site.person.jobTitle[locale],
    email: site.contact.email,
    city: site.contact.city,
    links: (
      [
        ['website', website],
        ['linkedin', site.contact.linkedin],
        ['github', site.contact.github],
      ] as const
    ).map(([kind, href]) => ({ kind, href, label: shortUrl(href) })),
    profile: {
      pitch: campaign.pitch[locale],
      availability: getAvailability(locale),
    },
    experience: entries
      .filter((entry) => entry.kind === 'experience')
      .map(toEntry),
    education: entries
      .filter((entry) => entry.kind === 'education')
      .map(toEntry),
    projects,
    skills,
    languages: await getLanguages(locale),
    pdf: {
      href: `/cv-${locale}.pdf`,
      filename: `${site.name.replaceAll(' ', '-')}-CV.pdf`,
    },
  };
}
