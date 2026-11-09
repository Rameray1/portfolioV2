import type { APIRoute } from 'astro';
import { PUBLIC_NOINDEX } from 'astro:env/client';

export const GET: APIRoute = ({ site }) => {
  const body = PUBLIC_NOINDEX
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
