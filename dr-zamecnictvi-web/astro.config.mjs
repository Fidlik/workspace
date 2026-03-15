// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const prerenderEntrypoint = fileURLToPath(new URL('./node_modules/astro/dist/entrypoints/prerender.js', import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        'astro/entrypoints/prerender': prerenderEntrypoint,
      },
    },
  },
});
