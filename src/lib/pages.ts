import { getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

type Page = CollectionEntry<'pages'>;

async function getPage(name: string, locale: Locale): Promise<Page> {
  const entry = await getEntry('pages', `${locale}/${name}`);
  if (!entry) {
    throw new Error(`src/content/pages/${locale}/${name}.md manquant`);
  }
  return entry;
}

// Champ facultatif dans le schéma commun, obligatoire pour cette page.
function required<T>(value: T | undefined, field: string, file: string): T {
  if (value === undefined) {
    throw new Error(`src/content/pages/${file}.md : \`${field}\` manquant`);
  }
  return value;
}

export async function getAboutPage(locale: Locale) {
  const entry = await getPage('about', locale);
  const photoAlt = required(entry.data.photoAlt, 'photoAlt', `${locale}/about`);
  return { entry, photoAlt };
}

export async function getLegalPage(locale: Locale) {
  const entry = await getPage('legal', locale);
  const file = `${locale}/legal`;
  const summary = required(entry.data.summary, 'summary', file);
  const updated = required(entry.data.updated, 'updated', file);
  return { entry, summary, updated };
}
