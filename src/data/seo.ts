// Lu aussi par astro.config.mjs (filtre du sitemap) : aucun import `astro:*` ici.
export const noindexPaths: readonly `/${string}/`[] = [];

export function isNoindexPath(pathname: string): boolean {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const withSlash = bare.endsWith('/') ? bare : `${bare}/`;
  return (noindexPaths as readonly string[]).includes(withSlash);
}
