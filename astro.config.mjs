// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Project page at https://delphinelaboureur.github.io/TMPS (no custom domain).
  site: 'https://delphinelaboureur.github.io',
  base: '/TMPS',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});