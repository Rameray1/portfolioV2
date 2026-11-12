import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

type FrenchEntry = CollectionEntry<'projects'>;
type EnglishEntry = CollectionEntry<'projectsEn'>;
type FrenchData = FrenchEntry['data'];

export type Eval = FrenchData['eval'];

export interface Project {
  slug: string;
  year: number;
  tech: string[];
  eval: Eval;
  links: FrenchData['links'];
  cover?: FrenchData['cover'];
  featured: boolean;
  draft: boolean;
  move?: { from: string; to: string; notation: string };
  title: string;
  summary: string;
  keyMove: string;
  coverAlt?: string;
  // Aucune fiche anglaise : la page `/en` affiche la prose française.
  untranslated: boolean;
  entry: FrenchEntry | EnglishEntry;
}

const MAX_FEATURED = 3;

const list = (entries: { id: string }[]) =>
  entries.map((entry) => entry.id).join(', ');

function validate(french: FrenchEntry[], english: Map<string, EnglishEntry>) {
  const slugs = new Set(french.map((entry) => entry.id));
  const orphans = [...english.values()].filter((entry) => !slugs.has(entry.id));
  if (orphans.length > 0) {
    throw new Error(
      `Fiche anglaise sans fiche française : src/content/projects/en/${list(orphans)}.md`,
    );
  }

  for (const entry of french) {
    const translation = english.get(entry.id);
    if (
      translation &&
      Boolean(translation.data.coverAlt) !== Boolean(entry.data.cover)
    ) {
      throw new Error(
        `src/content/projects/en/${entry.id}.md : \`coverAlt\` doit exister si et seulement si la fiche française a un \`cover\``,
      );
    }
    if (entry.data.draft) continue;
    for (const [folder, file] of [
      ['fr', entry],
      ['en', translation],
    ] as const) {
      if (file && !file.body?.trim()) {
        throw new Error(
          `src/content/projects/${folder}/${entry.id}.md : le récit est vide`,
        );
      }
    }
  }

  const featured = french.filter(
    (entry) => entry.data.featured && !entry.data.draft,
  );
  if (featured.length > MAX_FEATURED) {
    throw new Error(
      `${featured.length} projets mis en avant (${MAX_FEATURED} au plus) : ${list(featured)}`,
    );
  }
  const brilliant = featured.filter((entry) => entry.data.eval === '!!');
  if (brilliant.length > 1) {
    throw new Error(
      `Plusieurs projets mis en avant portent « !! » (un au plus) : ${list(brilliant)}`,
    );
  }
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const french = await getCollection('projects');
  const english = new Map(
    (await getCollection('projectsEn')).map((entry) => [entry.id, entry]),
  );
  validate(french, english);

  return french
    .filter((entry) => !(import.meta.env.PROD && entry.data.draft))
    .sort(
      (a, b) =>
        b.data.year - a.data.year ||
        a.data.title.localeCompare(b.data.title, 'fr'),
    )
    .map((entry) => {
      const { data } = entry;
      const translation = locale === 'en' ? english.get(entry.id) : undefined;
      const prose = translation ?? entry;
      return {
        slug: entry.id,
        year: data.year,
        tech: data.tech,
        eval: data.eval,
        links: data.links,
        cover: data.cover,
        featured: data.featured,
        draft: data.draft,
        move: data.move && {
          from: data.move.from,
          to: data.move.to,
          notation: data.move.notation[locale],
        },
        title: prose.data.title,
        summary: prose.data.summary,
        keyMove: prose.data.keyMove,
        coverAlt: prose.data.coverAlt,
        untranslated: !english.has(entry.id),
        entry: prose,
      };
    });
}

export async function featuredProjects(locale: Locale): Promise<Project[]> {
  return (await getProjects(locale)).filter((project) => project.featured);
}

export async function projectPaths(locale: Locale) {
  return (await getProjects(locale)).map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}
