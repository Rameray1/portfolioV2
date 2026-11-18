import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';
import { getProjects } from './projects';
import { DOMAINS, LEVELS, type Domain, type Level } from './skill-scale';

const FILE = 'src/data/skills.yaml';

export interface Skill {
  id: string;
  name: string;
  level: Level;
  proofs: { slug: string; title: string }[];
}

export interface SkillDomain {
  domain: Domain;
  skills: Skill[];
}

type Entry = CollectionEntry<'skills'>;

// Un nom propre s'écrit une fois ; un nom commun porte sa forme dans chaque langue.
const localName = (entry: Entry, locale: Locale) =>
  typeof entry.data.name === 'string'
    ? entry.data.name
    : entry.data.name[locale];

const frenchName = (entry: Entry) => localName(entry, 'fr');

function assertUniqueNames(entries: Entry[]) {
  const names = new Map<string, string>();
  for (const entry of entries) {
    const key = frenchName(entry).toLocaleLowerCase('fr');
    const other = names.get(key);
    if (other) {
      throw new Error(
        `${FILE} : « ${entry.id} » et « ${other} » portent le même nom`,
      );
    }
    names.set(key, entry.id);
  }
}

async function assertProofs(entries: Entry[]) {
  // Brouillons inclus : un brouillon cité doit échouer en dev comme en production.
  const projects = new Map(
    (await getCollection('projects')).map((project) => [project.id, project]),
  );
  for (const entry of entries) {
    const slugs = entry.data.projects.map((project) => project.id);
    const duplicate = slugs.find(
      (slug, index) => slugs.indexOf(slug) !== index,
    );
    if (duplicate) {
      throw new Error(
        `${FILE} : « ${entry.id} » cite deux fois le projet « ${duplicate} »`,
      );
    }
    for (const slug of slugs) {
      const project = projects.get(slug);
      if (!project) {
        throw new Error(
          `${FILE} : « ${entry.id} » cite le projet « ${slug} », qui n’existe pas`,
        );
      }
      if (project.data.draft) {
        throw new Error(
          `${FILE} : « ${entry.id} » cite le projet « ${slug} », qui est un brouillon`,
        );
      }
    }
  }
}

export async function getSkills(locale: Locale): Promise<SkillDomain[]> {
  const entries = await getCollection('skills');
  if (entries.length === 0) {
    throw new Error(`${FILE} : aucune compétence`);
  }
  assertUniqueNames(entries);
  await assertProofs(entries);

  const projects = await getProjects(locale);
  const rank = (level: Level) => LEVELS.indexOf(level) + 1;

  return DOMAINS.map((domain) => ({
    domain,
    skills: entries
      .filter((entry) => entry.data.domain === domain)
      .sort(
        (a, b) =>
          rank(b.data.level) - rank(a.data.level) ||
          frenchName(a).localeCompare(frenchName(b), 'fr') ||
          a.id.localeCompare(b.id),
      )
      .map((entry) => {
        const { level } = entry.data;
        const cited = new Set(entry.data.projects.map((project) => project.id));
        return {
          id: entry.id,
          name: localName(entry, locale),
          level,
          proofs: projects
            .filter((project) => cited.has(project.slug))
            .map(({ slug, title }) => ({ slug, title })),
        };
      }),
  })).filter((group) => group.skills.length > 0);
}
