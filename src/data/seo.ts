// Lu aussi par astro.config.mjs (filtre du sitemap) : aucun import `astro:*` ici.
import { existsSync } from 'node:fs';

export const noindexPaths: readonly `/${string}/`[] = [];

export function isNoindexPath(pathname: string): boolean {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const withSlash = bare.endsWith('/') ? bare : `${bare}/`;
  return (noindexPaths as readonly string[]).includes(withSlash);
}

// Page de repli : `/en/projects/<slug>` sans fiche anglaise affiche le français.
export function isUntranslatedProjectPath(pathname: string): boolean {
  const slug = pathname.match(/^\/en\/projects\/([^/]+)\/?$/)?.[1];
  return (
    slug !== undefined && !existsSync(`src/content/projects/en/${slug}.md`)
  );
}
