// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Français par défaut sans préfixe, anglais sous /en.
  // Ces deux littéraux reprennent `locales` et `defaultLocale` de src/i18n/ui.ts :
  // les changer ensemble (la config ne peut pas importer le TypeScript de src/).
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
});
