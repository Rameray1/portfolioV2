// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { projectMarkdown } from './src/lib/project-markdown.ts';
import { cvPdf } from './src/integrations/cv-pdf.ts';
import { isNoindexPath, isUntranslatedProjectPath } from './src/data/seo.ts';

export default defineConfig({
  site: 'https://ramazankus.dev',
  // À garder aligné sur `locales` de src/i18n/ui.ts, le français par défaut (et sur le sitemap).
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  markdown: { processor: satteri({ hastPlugins: [projectMarkdown] }) },
  redirects: {
    '/projects/sample-project': '/projects/portfolio/',
    '/en/projects/sample-project': '/en/projects/portfolio/',
  },
  integrations: [
    cvPdf(),
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
      filter: (page) => {
        const { pathname } = new URL(page);
        return !isNoindexPath(pathname) && !isUntranslatedProjectPath(pathname);
      },
    }),
  ],
  env: {
    schema: {
      PUBLIC_NOINDEX: envField.boolean({
        context: 'client',
        access: 'public',
        default: false,
      }),
    },
  },
});
