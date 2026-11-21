import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';
import { localizePath } from '../i18n/utils';
import { getBackground } from './background';
import { getProjects } from './projects';
import { DOMAINS, LEVELS, type Domain, type Level } from './skill-scale';

const FILE = 'src/data/skills.yaml';

interface Skill {
  id: string;
  name: string;
  level: Level;
  proofs: { href: string; title: string }[];
}

interface SkillDomain {
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

function assertNoDuplicate(entry: Entry, ids: string[], kind: string) {
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicate) {
    throw new Error(
      `${FILE} : « ${entry.id} » cite deux fois ${kind} « ${duplicate} »`,
    );
  }
}

async function assertProofs(entries: Entry[]) {
  // Brouillons inclus : un brouillon cité doit échouer en dev comme en production.
  const projects = new Map(
    (await getCollection('projects')).map((project) => [project.id, project]),
  );
  const steps = new Set(
    [
      ...(await getCollection('experience')),
      ...(await getCollection('education')),
    ].map((step) => step.id),
  );
  for (const entry of entries) {
    const slugs = entry.data.projects.map((project) => project.id);
    assertNoDuplicate(entry, slugs, 'le projet');
    assertNoDuplicate(entry, entry.data.background, 'l’étape');
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
    for (const id of entry.data.background) {
      if (!steps.has(id)) {
        throw new Error(
          `${FILE} : « ${entry.id} » cite l’étape « ${id} », absente du parcours`,
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
  const steps = await getBackground(locale);
  const background = localizePath('/background', locale);
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
        const cited = new Set([
          ...entry.data.projects.map((project) => project.id),
          ...entry.data.background,
        ]);
        // Les projets d'abord, puis les étapes du parcours, chacun du plus récent au plus ancien.
        return {
          id: entry.id,
          name: localName(entry, locale),
          level,
          proofs: [
            ...projects
              .filter((project) => cited.has(project.slug))
              .map(({ slug, title }) => ({
                href: localizePath(`/projects/${slug}/`, locale),
                title,
              })),
            ...steps
              .filter((step) => cited.has(step.id))
              .map(({ id, title }) => ({ href: `${background}#${id}`, title })),
          ],
        };
      }),
  })).filter((group) => group.skills.length > 0);
}
