// @ts-check
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  // Adresse provisoire : à remplacer par le vrai domaine à la mise en ligne.
  site: 'https://ramazankus.example',
  // À garder aligné sur `locales` et `defaultLocale` de src/i18n/ui.ts.
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
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
