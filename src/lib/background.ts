import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

type Kind = 'experience' | 'education';

export interface BackgroundEntry {
  id: string;
  kind: Kind;
  start: string;
  end?: string;
  title: string;
  place: string;
  detail: string;
  tech: string[];
  highlights: string[];
}

async function load(kind: Kind): Promise<CollectionEntry<Kind>[]> {
  const entries = await getCollection(kind);
  // Astro laisse la collection vide si le fichier est absent ou illisible.
  if (entries.length === 0) {
    throw new Error(
      `src/data/${kind}.yaml : aucune entrée (fichier vide, absent ou illisible)`,
    );
  }
  return entries;
}

export async function getBackground(
  locale: Locale,
): Promise<BackgroundEntry[]> {
  const kinds: Kind[] = ['experience', 'education'];
  const groups = await Promise.all(
    kinds.map(async (kind) =>
      (await load(kind)).map((entry) => ({ kind, entry })),
    ),
  );

  return groups
    .flat()
    .sort(
      (a, b) =>
        b.entry.data.start.localeCompare(a.entry.data.start) ||
        // Sans date de fin, l'entrée est en cours : elle passe avant les terminées.
        (b.entry.data.end ?? '9999').localeCompare(
          a.entry.data.end ?? '9999',
        ) ||
        a.entry.data.title.fr.localeCompare(b.entry.data.title.fr, 'fr') ||
        a.entry.id.localeCompare(b.entry.id),
    )
    .map(({ kind, entry: { id, data } }) => ({
      id,
      kind,
      start: data.start,
      end: data.end,
      title: data.title[locale],
      place: data.place,
      detail: data.detail[locale],
      tech: data.tech,
      highlights: data.highlights.map((highlight) => highlight[locale]),
    }));
}
