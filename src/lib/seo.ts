// Lu aussi par astro.config.mjs (filtre du sitemap) : aucun import `astro:*` ici.
import { existsSync } from 'node:fs';

// Page de repli : `/en/projects/<slug>` sans fiche anglaise affiche le français.
export function isUntranslatedProjectPath(pathname: string): boolean {
  const slug = pathname.match(/^\/en\/projects\/([^/]+)\/?$/)?.[1];
  return (
    slug !== undefined && !existsSync(`src/content/projects/en/${slug}.md`)
  );
}
