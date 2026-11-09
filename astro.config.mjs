// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // À garder aligné sur `locales` et `defaultLocale` de src/i18n/ui.ts.
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
});
