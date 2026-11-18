import { getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export async function getAboutPage(
  locale: Locale,
): Promise<CollectionEntry<'pages'>> {
  const entry = await getEntry('pages', `${locale}/about`);
  if (!entry) {
    throw new Error(`src/content/pages/${locale}/about.md manquant`);
  }
  return entry;
}
